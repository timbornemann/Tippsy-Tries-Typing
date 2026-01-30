import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Stage, GameStats, GameMode, ErrorCountByChar } from '../types';
import { KEYBOARD_LAYOUTS, FINGER_NAMES, FINGER_COLORS } from '../constants';
import VirtualKeyboard from './VirtualKeyboard';
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
  gameMode?: GameMode;
}

const FALLBACK_CONTENT = 'fff jjj fff jjj';

const TypingGame: React.FC<TypingGameProps> = ({ stage, subLevelId, content: contentProp, onFinish, onBack, onRetry, gameMode = 'STANDARD' }) => {
  const { keyboardLayout } = useSettings();
  const { t, language } = useI18n();
  const { playTyping, playError } = useSound();
  const keyboardLayoutConfig = KEYBOARD_LAYOUTS[keyboardLayout];
  const [content, setContent] = useState((typeof contentProp === 'string' && contentProp.trim().length > 0) ? contentProp : FALLBACK_CONTENT);
  const [inputIndex, setInputIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [errorShake, setErrorShake] = useState(false);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  /** Per-session: which expected character was mistyped how often */
  const [errorCountByChar, setErrorCountByChar] = useState<ErrorCountByChar>({});
  
  const [wpm, setWpm] = useState(0);

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
    }
  }, [contentProp]);

  useEffect(() => {
    inputRef.current?.focus();
    const handleGlobalClick = () => inputRef.current?.focus();
    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  const calculateStats = useCallback(() => {
    if (!startTime) return;
    const now = Date.now();
    const minutes = (now - startTime) / 60000;
    // For endless mode, we track totalCharsTyped. For normal, inputIndex is sufficient.
    const chars = stage.id === 15 ? totalCharsTyped + inputIndex : inputIndex; 
    const words = chars / 5;
    const currentWpm = Math.round(words / minutes) || 0;
    setWpm(currentWpm);
  }, [inputIndex, startTime, totalCharsTyped, stage.id]);

  useEffect(() => {
    const timer = setInterval(calculateStats, 1000);
    return () => clearInterval(timer);
  }, [calculateStats]);

  const finishGame = useCallback(() => {
    const endTime = Date.now();
    const timeElapsed = (endTime - (startTime || endTime)) / 1000;
    const finalTotalChars = stage.id === 15 ? totalCharsTyped + inputIndex : content.length;

    let finalWpm = 0;
    let accuracy = 0;
    if (finalTotalChars > 0) {
      const wpmCalc = timeElapsed > 0 ? (finalTotalChars / 5) / (timeElapsed / 60) : 0;
      finalWpm = Math.round(wpmCalc);
      accuracy = Math.round(((finalTotalChars - mistakes) / finalTotalChars) * 100);
    }

    onFinish({
      wpm: finalWpm,
      accuracy: Math.max(0, accuracy),
      errors: mistakes,
      totalChars: finalTotalChars,
      timeElapsed,
      errorCountByChar: Object.keys(errorCountByChar).length > 0 ? errorCountByChar : undefined
    });
  }, [content.length, inputIndex, startTime, mistakes, errorCountByChar, onFinish, stage.id, totalCharsTyped]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      if (stage.id === 15) {
        // Endless Mode: Escape finishes the game
        finishGame();
      } else {
        onBack();
      }
      return;
    }

    const keyForPress = (e.key === 'Minus' ? '-' : e.key === 'Comma' ? ',' : e.key === 'Period' ? '.' : e.key === 'Enter' ? '\n' : e.key);
    setPressedKeys(prev => {
      const newSet = new Set(prev);
      newSet.add(e.key);
      if (keyForPress !== e.key) newSet.add(keyForPress);
      return newSet;
    });

    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) return;
    if (e.key === ' ') e.preventDefault();
    if (e.key === 'Enter') e.preventDefault(); // Prevent standard enter behavior

    if (startTime === null) {
      setStartTime(Date.now());
    }

    const targetChar = content[inputIndex];
    // Normalize key: some keyboards/browsers send "Minus"/"Comma"/"Period" instead of the character
    const key = (e.key === 'Minus' ? '-' : e.key === 'Comma' ? ',' : e.key === 'Period' ? '.' : e.key === 'Enter' ? '\n' : e.key);
    
    if (key === targetChar) {
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
            finishGame();
        }
      }
      
    } else {
      playError();
      setMistakes(m => m + 1);
      setErrorCountByChar(prev => {
        const next = { ...prev };
        next[targetChar] = (next[targetChar] ?? 0) + 1;
        return next;
      });
      setErrorShake(true);
      setTimeout(() => setErrorShake(false), 300);
    }
  }, [content, inputIndex, mistakes, finishGame, startTime, onBack, errorCountByChar, stage.id, playTyping, playError]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const normalized = (k: string) => (k === 'Minus' ? '-' : k === 'Comma' ? ',' : k === 'Period' ? '.' : k === 'Enter' ? '\n' : k);
    setPressedKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(e.key);
      const n = normalized(e.key);
      if (n !== e.key) newSet.delete(n);
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

  // Determine active finger for display
  const getActiveFingerInfo = () => {
    if (inputIndex >= content.length) return null;
    const char = content[inputIndex];
    
    // Find char in layout
    for (const row of keyboardLayoutConfig) {
      for (const k of row) {
        if (k.key.toLowerCase() === char.toLowerCase()) {
          return { finger: k.finger, color: FINGER_COLORS[k.finger] };
        }
        if (char === ' ' && k.key === ' ') {
            return { finger: k.finger, color: FINGER_COLORS[k.finger] };
        }
        // Handle Newline -> Enter key (assumed to be mapped if present in layout, distinct from standard chars)
         if (char === '\n' && k.key === 'Enter') { // You might need to add Enter to KEYBOARD_LAYOUT or handle it specially
            return { finger: 'r5', color: FINGER_COLORS['r5'] }; // Right pinky for Enter
         }
      }
    }
    // Default fallback (e.g. for punctuation not on layout yet)
    // For Enter/Newline specifically
    if (char === '\n') return { finger: 'r5', color: FINGER_COLORS['r5'] };
    
    return null;
  };

  const fingerInfo = getActiveFingerInfo();
  const isMasterLevel = subLevelId === 5;
  const isPractice = gameMode === 'PRACTICE';
  const isWordsSentences = gameMode === 'WORDS_SENTENCES';

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto min-h-screen pt-8 px-4">
      {/* Header / Stats */}
      <div className={`w-full flex justify-between items-center mb-8 p-4 rounded-lg border backdrop-blur-sm transition-colors ${isMasterLevel && !isPractice && !isWordsSentences ? 'bg-yellow-900/30 border-yellow-700/50' : isWordsSentences ? 'bg-teal-900/30 border-teal-700/50' : isPractice ? 'bg-purple-900/30 border-purple-700/50' : 'bg-slate-800/50 border-slate-700'}`}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => (stage.id === 15 ? finishGame() : onBack())}
            className="p-2 hover:bg-slate-700 rounded-full transition-colors"
            title={stage.id === 15 ? t('typing.finishStats') : t('typing.backToMenu')}
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
          <div className="text-center">
            <p className="text-xs text-slate-400 uppercase tracking-wider">{t('typing.wpm')}</p>
            <p className="text-2xl font-mono font-bold text-emerald-400">{wpm}</p>
          </div>
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

        <button onClick={onRetry} className="p-2 hover:bg-slate-700 rounded-full transition-colors" title={t('typing.restart')}>
          <RotateCcw size={20} className="text-slate-400 hover:text-white" />
        </button>
      </div>

      {/* Typing Area - Scrolling Tape: Wrapper = Viewport-Größe, Inhalt mit left:50% + translateX so 50% sich auf Viewport bezieht */}
      <div className="relative w-full bg-slate-900 rounded-2xl mb-8 border border-slate-800 shadow-inner h-40 overflow-hidden group">
         {/* Gradients for fade effect */}
         <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent z-10 pointer-events-none"></div>
         <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-900 via-slate-900/80 to-transparent z-10 pointer-events-none"></div>

         {/* Center Marker (Visual Aid) */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-24 rounded-lg bg-emerald-500/5 border border-emerald-500/20 z-0 pointer-events-none"></div>

         {/* Viewport-sized wrapper so left:50% = Mitte des sichtbaren Bereichs */}
         <div className="absolute inset-0 flex items-center">
           <div
             className="absolute top-0 bottom-0 flex items-center transition-transform duration-200 ease-out will-change-transform"
             style={{
               left: '50%',
               transform: `translateX(-${inputIndex * 64 + 32}px)`,
             }}
           >
           
           {content.split('').map((char, idx) => {
             let statusColor = 'text-slate-600'; // Upcoming
             let scale = 'scale-100';
             let activeStyle = '';
             
             if (idx < inputIndex) {
               statusColor = 'text-emerald-500 opacity-60'; // Completed
             } else if (idx === inputIndex) {
               statusColor = 'text-white';
               scale = 'scale-110';
               if (errorShake) {
                 statusColor = 'text-rose-500';
                 activeStyle = 'z-10 drop-shadow-[0_0_10px_rgba(255,50,50,0.5)] font-bold animate-shake';
               } else {
                 activeStyle = 'z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] font-bold';
               }
             }

             return (
               <div 
                 key={idx} 
                 className={`flex items-center justify-center w-16 h-24 text-4xl font-mono shrink-0 transition-all duration-200 ${statusColor} ${scale} ${activeStyle}`}
               >
                 {char === ' ' ? (
                   <span className="opacity-30 text-2xl">␣</span>
                 ) : char === '\n' ? (
                   <span className="opacity-50 text-2xl">↵</span>
                 ) : (
                   char
                 )}
               </div>
             );
           })}
           </div>
         </div>
      </div>

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
      <VirtualKeyboard activeKey={content[inputIndex] || ''} pressedKeys={pressedKeys} />

      <input ref={inputRef} type="text" className="opacity-0 absolute top-0" />
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>

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
