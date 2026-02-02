import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Stage, GameStats, GameMode, ErrorCountByChar } from '../types';
import { KEYBOARD_LAYOUTS, FINGER_NAMES, FINGER_COLORS, MAX_SUB_LEVELS } from '../constants';
import VirtualKeyboard from './VirtualKeyboard';
import TypingTape from './TypingTape';
import { WpmDisplay } from './WpmDisplay';
import { RotateCcw, Home, Crown, Zap, BookOpen, Infinity } from 'lucide-react';
import { getRandomChunk } from '../services/endlessContent';
import { useSettings } from '../contexts/SettingsContext';
import { useI18n } from '../hooks/useI18n';
import { useSound } from '../hooks/useSound';

interface TypingGameProps {
  stage: Stage;
  subLevelId: number;
  content: string;
  onFinish: (stats: GameStats) => void;
  onBack: () => void;
  onRetry: () => void;
  onSaveStats?: (stats: GameStats) => void;
  gameMode?: GameMode;
}

const FALLBACK_CONTENT = 'fff jjj fff jjj';
/** En-Dash (U+2013) in Inhalten wird wie Minus/Bindestrich (U+002D) akzeptiert – gleiche Taste. */
const EN_DASH = '\u2013';

const TypingGame: React.FC<TypingGameProps> = ({ stage, subLevelId, content: contentProp, onFinish, onBack, onRetry, onSaveStats, gameMode = 'STANDARD' }) => {
  const { keyboardLayout, zeroMistakesMode } = useSettings();
  const { t, language } = useI18n();
  const { playTyping, playError } = useSound();
  const keyboardLayoutConfig = KEYBOARD_LAYOUTS[keyboardLayout];
  const [content, setContent] = useState((typeof contentProp === 'string' && contentProp.trim().length > 0) ? contentProp : FALLBACK_CONTENT);
  const [inputIndex, setInputIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [errorShake, setErrorShake] = useState(false);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  /** Caps Lock an/aus – bleibt an, bis erneut gedrückt */
  const [capsLockOn, setCapsLockOn] = useState(false);
  /** Per-session: which expected character was mistyped how often */
  const [errorCountByChar, setErrorCountByChar] = useState<ErrorCountByChar>({});
  /** Total keys pressed in this session (including mistakes). */
  const [totalKeysTyped, setTotalKeysTyped] = useState(0);
  
  // Total chars typed in this endless session (since we slice content, inputIndex isn't the total anymore)
  const [totalCharsTyped, setTotalCharsTyped] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  // Reset content when prop changes (new level)
  useEffect(() => {
    if (contentProp) {
        setContent(contentProp);
        setInputIndex(0);
        setMistakes(0);
        setStartTime(null);
        setTotalCharsTyped(0);
        setTotalKeysTyped(0);
    }
  }, [contentProp]);

  useEffect(() => {
    inputRef.current?.focus();
    const handleGlobalClick = () => inputRef.current?.focus();
    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  const buildStats = useCallback((options?: { extraMistakes?: number; extraKeyPresses?: number; extraErrorChar?: string; allowEmpty?: boolean }): GameStats | null => {
    const endTime = Date.now();
    const timeElapsed = (endTime - (startTime || endTime)) / 1000;
    const errors = mistakes + (options?.extraMistakes ?? 0);
    const finalTotalChars = totalKeysTyped + (options?.extraKeyPresses ?? 0);
    if (!options?.allowEmpty && finalTotalChars === 0 && timeElapsed === 0) return null;
    let finalWpm = 0;
    let accuracy = 0;
    if (finalTotalChars > 0) {
      const wpmCalc = timeElapsed > 0 ? (finalTotalChars / 5) / (timeElapsed / 60) : 0;
      finalWpm = Math.round(wpmCalc);
      accuracy = Math.round(((finalTotalChars - errors) / finalTotalChars) * 100);
    }
    const nextErrorCount = options?.extraErrorChar
      ? {
          ...errorCountByChar,
          [options.extraErrorChar]: (errorCountByChar[options.extraErrorChar] ?? 0) + 1
        }
      : errorCountByChar;
    return {
      wpm: finalWpm,
      accuracy: Math.max(0, accuracy),
      errors,
      totalChars: finalTotalChars,
      timeElapsed,
      errorCountByChar: Object.keys(nextErrorCount).length > 0 ? nextErrorCount : undefined
    };
  }, [errorCountByChar, mistakes, startTime, totalKeysTyped]);

  const finishGame = useCallback((options?: { extraKeyPresses?: number }) => {
    const stats = buildStats({ allowEmpty: true, extraKeyPresses: options?.extraKeyPresses });
    if (!stats) return;
    onFinish(stats);
  }, [buildStats, onFinish]);

  /** Current session stats for background save on retry/back (no UI change). */
  const getCurrentStats = useCallback((): GameStats | null => buildStats(), [buildStats]);

  const registerKeyPress = useCallback(() => {
    setTotalKeysTyped(prev => prev + 1);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Escape/Enter: handle before modifier check (navigation / newline in content)
    if (e.key === 'Escape') {
      e.preventDefault();
      if (stage.id === 15) {
        finishGame();
      } else {
        const stats = getCurrentStats();
        if (stats && onSaveStats) onSaveStats(stats);
        onBack();
      }
      return;
    }

    // Always update pressedKeys for virtual keyboard (Shift/AltGr/Ctrl display), before modifier return
    const keyForPress = (e.key === 'Minus' ? '-' : e.key === 'Comma' ? ',' : e.key === 'Period' ? '.' : e.key === 'Enter' ? '\n' : e.key);
    setPressedKeys(prev => {
      const newSet = new Set(prev);
      // Modifier nur per e.code eintragen, damit links/rechts getrennt leuchten
      if (e.key === 'Control') {
        newSet.add(e.code);
      } else if (e.key === 'Shift') {
        newSet.add(e.code); // ShiftLeft oder ShiftRight
      } else {
        newSet.add(e.key);
        if (keyForPress !== e.key) newSet.add(keyForPress);
      }
      if (e.code === 'AltRight') newSet.add('AltGr');
      return newSet;
    });

    // Caps Lock: Toggle-Zustand mit echtem Modifier-Zustand synchronisieren
    if (e.key === 'CapsLock') {
      setCapsLockOn(e.getModifierState('CapsLock'));
      return;
    }

    // AltGr / Alt must never count as key press or error: ignore and prevent default
    if (e.key === 'Alt' || e.key === 'AltGraph' || e.code === 'AltRight') {
      e.preventDefault();
      return;
    }

    if (['Shift', 'Control', 'Meta', 'Tab'].includes(e.key)) return;
    if (e.key === ' ') e.preventDefault();
    if (e.key === 'Enter') e.preventDefault(); // Prevent standard enter behavior

    const targetChar = content[inputIndex];
    // Normalize key: some keyboards/browsers send "Minus"/"Comma"/"Period" instead of the character
    const key = (e.key === 'Minus' ? '-' : e.key === 'Comma' ? ',' : e.key === 'Period' ? '.' : e.key === 'Enter' ? '\n' : e.key);
    const targetKey = targetChar === EN_DASH ? '-' : targetChar; // En-Dash "–" mit Minus-Taste tippen

    // Strg/Alt/AltGr + Taste: Shortcut nicht ausführen, aber falsche Taste trotzdem als Fehler werten
    if (e.ctrlKey || e.metaKey || e.altKey) {
      e.preventDefault();
      if (startTime === null) setStartTime(Date.now());
      if (key === targetKey) return; // Richtige Taste mit Modifier – nicht vorrücken, kein Fehler

      playError();

      if (zeroMistakesMode) {
        const stats = buildStats({ extraMistakes: 1, extraKeyPresses: 1, extraErrorChar: targetChar });
        if (stats && onSaveStats) onSaveStats(stats);
        onRetry();
        return;
      }

      registerKeyPress();
      setMistakes(m => m + 1);
      setErrorCountByChar(prev => {
        const next = { ...prev };
        next[targetChar] = (next[targetChar] ?? 0) + 1;
        return next;
      });
      setErrorShake(true);
      setErrorKey(key);
      setTimeout(() => {
        setErrorShake(false);
        setErrorKey(null);
      }, 300);
      return;
    }

    if (startTime === null) {
      setStartTime(Date.now());
    }
    
    if (key === targetKey) {
      registerKeyPress();
      playTyping();
      const nextIndex = inputIndex + 1;
      
      // --- ENDLESS MODE LOGIC ---
      if (stage.id === 15) {
        // 1. Append content if needed
        if (content.length - nextIndex < 50) {
            const chunk = getRandomChunk(language);
            // Add a proper separator (newline for code/mixed, space otherwise)
            const separator = (stage.id === 13 || stage.id === 14) ? '\n\n' : ' '; 
            const newContent = content + separator + chunk;
            setContent(newContent);
        }

        // 2. Cleanup old content if too long (Memory Management)
        // Keep a buffer of ~100 chars behind cursor
        if (nextIndex > 200) {
            const cutAmount = 100;
            setTotalCharsTyped(prev => prev + cutAmount);
            setContent(prev => prev.slice(cutAmount));
            setInputIndex(nextIndex - cutAmount);
        } else {
            setInputIndex(nextIndex);
        }
      } else {
        // Standard Mode
        setInputIndex(nextIndex);
        if (nextIndex === content.length) {
            finishGame({ extraKeyPresses: 1 });
        }
      }
      
    } else {
      playError();
      if (zeroMistakesMode) {
        const stats = buildStats({ extraMistakes: 1, extraKeyPresses: 1, extraErrorChar: targetChar });
        if (stats && onSaveStats) onSaveStats(stats);
        onRetry();
        return;
      }

      registerKeyPress();
      setMistakes(m => m + 1);
      setErrorCountByChar(prev => {
        const next = { ...prev };
        next[targetChar] = (next[targetChar] ?? 0) + 1;
        return next;
      });
      setErrorShake(true);
      setErrorKey(key);
      setTimeout(() => {
        setErrorShake(false);
        setErrorKey(null);
      }, 300);
    }
  }, [content, inputIndex, finishGame, startTime, onBack, onSaveStats, getCurrentStats, errorCountByChar, stage.id, playTyping, playError, zeroMistakesMode, onRetry, registerKeyPress, buildStats]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const normalized = (k: string) => (k === 'Minus' ? '-' : k === 'Comma' ? ',' : k === 'Period' ? '.' : k === 'Enter' ? '\n' : k);
    setPressedKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(e.key);
      const n = normalized(e.key);
      if (n !== e.key) newSet.delete(n);
      if (e.code === 'AltRight') newSet.delete('AltGr');
      if (e.key === 'Control') newSet.delete(e.code); // ControlLeft / ControlRight
      if (e.key === 'Shift') newSet.delete(e.code); // ShiftLeft / ShiftRight
      // Shift+Buchstabe: keydown liefert oft "A", keyup oft "a" (physische Taste) – beide entfernen
      if (e.key.length === 1) {
        newSet.delete(e.key.toLowerCase());
        newSet.delete(e.key.toUpperCase());
      }
      return newSet;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    const onBlur = () => setPressedKeys(new Set());
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Precompute finger map for O(1) lookup
  const fingerMap = useMemo(() => {
    const map = new Map<string, { finger: string, color: string }>();
    for (const row of keyboardLayoutConfig) {
      for (const k of row) {
        const lowerKey = k.key.toLowerCase();
        if (!map.has(lowerKey)) {
          map.set(lowerKey, { finger: k.finger, color: FINGER_COLORS[k.finger] });
        }
        if (k.key === ' ') {
          map.set(' ', { finger: k.finger, color: FINGER_COLORS[k.finger] });
        }
        if (k.key === 'Enter') {
          // @ts-ignore: Preserving existing behavior for 'r5' key which might not be in Finger enum
          map.set('\n', { finger: 'r5', color: FINGER_COLORS['r5'] });
        }
      }
    }
    // Fallback for newline if not in layout
    if (!map.has('\n')) {
      // @ts-ignore: Preserving existing behavior for 'r5' key
      map.set('\n', { finger: 'r5', color: FINGER_COLORS['r5'] });
    }
    return map;
  }, [keyboardLayoutConfig]);

  // Determine active finger for display
  const getActiveFingerInfo = () => {
    if (inputIndex >= content.length) return null;
    const char = content[inputIndex];
    return fingerMap.get(char.toLowerCase()) || null;
  };

  const fingerInfo = getActiveFingerInfo();
  const isMasterLevel = subLevelId === MAX_SUB_LEVELS;
  const isPractice = gameMode === 'PRACTICE';
  const isWordsSentences = gameMode === 'WORDS_SENTENCES';

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto min-h-screen pt-8 px-4">
      {/* Header / Stats */}
      <div className={`w-full flex justify-between items-center mb-8 p-4 rounded-lg border backdrop-blur-sm transition-colors ${isMasterLevel && !isPractice && !isWordsSentences ? 'bg-yellow-900/30 border-yellow-700/50' : isWordsSentences ? 'bg-teal-900/30 border-teal-700/50' : isPractice ? 'bg-purple-900/30 border-purple-700/50' : 'bg-slate-800/50 border-slate-700'}`}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (stage.id === 15) finishGame();
              else {
                const stats = getCurrentStats();
                if (stats && onSaveStats) onSaveStats(stats);
                onBack();
              }
            }}
            className="p-2 hover:bg-slate-700 rounded-full transition-colors"
            title={stage.id === 15 ? t('typing.finishStats') : t('typing.backToMenu')}
            aria-label={stage.id === 15 ? t('typing.finishStats') : t('typing.backToMenu')}
          >
              <Home size={20} className="text-slate-400 hover:text-white" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              {stage.name}
              {isMasterLevel && !isPractice && !isWordsSentences && stage.id !== 15 && <Crown className="w-5 h-5 text-yellow-400 fill-yellow-400 animate-pulse" />}
              {isPractice && <Zap className="w-5 h-5 text-purple-400 fill-purple-400" />}
              {isWordsSentences && <BookOpen className="w-5 h-5 text-teal-400 fill-teal-400" />}
              {stage.id === 15 && <Infinity className="w-5 h-5 text-violet-400" />}
            </h2>
            <p className={`text-xs ${isMasterLevel && !isPractice && !isWordsSentences && stage.id !== 15 ? 'text-yellow-200' : isWordsSentences ? 'text-teal-200' : isPractice ? 'text-purple-200' : stage.id === 15 ? 'text-violet-200' : 'text-slate-400'}`}>
              {t('typing.levelLabel', { stageId: stage.id, mode: stage.id === 15 ? t('typing.endless') : isWordsSentences ? t('typing.wordSentence') : isPractice ? t('typing.practice') : isMasterLevel ? t('typing.masterTest') : t('typing.exercise', { subLevel: subLevelId }) })}
            </p>
          </div>
        </div>
        
        <div className="flex gap-8">
          <WpmDisplay startTime={startTime} inputIndex={inputIndex} totalCharsTyped={totalCharsTyped} stageId={stage.id} />
          <div className="text-center">
            <p className="text-xs text-slate-400 uppercase tracking-wider">{t('typing.errors')}</p>
            <p className={`text-2xl font-mono font-bold ${mistakes > 0 ? 'text-rose-400' : 'text-slate-200'}`}>{mistakes}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400 uppercase tracking-wider">{t('typing.progress')}</p>
            {stage.id === 15 ? (
              <p className="text-2xl font-mono font-bold text-violet-400 flex justify-center items-center"><Infinity size={32} /></p>
            ) : (
              <p className="text-2xl font-mono font-bold text-blue-400">{Math.round((inputIndex / content.length) * 100)}%</p>
            )}
          </div>
        </div>

        <button
          onClick={() => {
            const stats = getCurrentStats();
            if (stats && onSaveStats) onSaveStats(stats);
            onRetry();
          }}
          className="p-2 hover:bg-slate-700 rounded-full transition-colors"
          title={t('typing.restart')}
          aria-label={t('typing.restart')}
        >
          <RotateCcw size={20} className="text-slate-400 hover:text-white" />
        </button>
      </div>

      {/* Typing Area - Scrolling Tape */}
      <TypingTape content={content} inputIndex={inputIndex} errorShake={errorShake} />

      {/* Finger Hint */}
      <div className="flex items-center justify-center gap-3 mb-4 h-8">
        {fingerInfo && (
          <>
            <span className="text-slate-400 text-sm uppercase tracking-widest">{t('typing.useFinger')}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg ${fingerInfo.color}`}>
              {FINGER_NAMES[language][fingerInfo.finger]}
            </span>
          </>
        )}
      </div>

      {/* Virtual Keyboard */}
      <VirtualKeyboard activeKey={content[inputIndex] || ''} pressedKeys={pressedKeys} errorKey={errorKey} capsLockOn={capsLockOn} />

      <input ref={inputRef} type="text" className="opacity-0 absolute top-0" />
      
      <div className="mt-8 text-slate-500 text-sm text-center max-w-lg">
        {isMasterLevel && !isPractice && !isWordsSentences
          ? t('typing.instructionsMaster')
          : isWordsSentences
            ? t('typing.instructionsWords')
            : t('typing.instructionsDefault')}
      </div>
    </div>
  );
};

export default TypingGame;
