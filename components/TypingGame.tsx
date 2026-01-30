import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Stage, GameStats, GameMode } from '../types';
import { KEYBOARD_LAYOUT, FINGER_NAMES_DE, FINGER_COLORS } from '../constants';
import VirtualKeyboard from './VirtualKeyboard';
import { RotateCcw, Home, Crown, Zap } from 'lucide-react';

interface TypingGameProps {
  stage: Stage;
  subLevelId: number;
  content: string;
  onFinish: (stats: GameStats) => void;
  onBack: () => void;
  onRetry: () => void;
  gameMode?: GameMode;
}

const TypingGame: React.FC<TypingGameProps> = ({ stage, subLevelId, content, onFinish, onBack, onRetry, gameMode = 'STANDARD' }) => {
  const [inputIndex, setInputIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [errorShake, setErrorShake] = useState(false);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  
  // Stats for real-time display
  const [wpm, setWpm] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

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
    const words = inputIndex / 5;
    const currentWpm = Math.round(words / minutes) || 0;
    setWpm(currentWpm);
  }, [inputIndex, startTime]);

  useEffect(() => {
    const timer = setInterval(calculateStats, 1000);
    return () => clearInterval(timer);
  }, [calculateStats]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.add(e.key);
        return newSet;
    });

    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) return;
    if (e.key === ' ') e.preventDefault();

    if (startTime === null) {
      setStartTime(Date.now());
    }

    const targetChar = content[inputIndex];
    
    if (e.key === targetChar) {
      const nextIndex = inputIndex + 1;
      setInputIndex(nextIndex);
      
      if (nextIndex === content.length) {
        const endTime = Date.now();
        const timeElapsed = (endTime - (startTime || endTime)) / 1000;
        const finalWpm = Math.round((content.length / 5) / (timeElapsed / 60));
        const accuracy = Math.round(((content.length - mistakes) / content.length) * 100);
        
        onFinish({
          wpm: finalWpm,
          accuracy: Math.max(0, accuracy),
          errors: mistakes,
          totalChars: content.length,
          timeElapsed
        });
      }
    } else {
      setMistakes(m => m + 1);
      setErrorShake(true);
      setTimeout(() => setErrorShake(false), 300);
    }
  }, [content, inputIndex, mistakes, onFinish, startTime]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(e.key);
        return newSet;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Determine active finger for display
  const getActiveFingerInfo = () => {
    if (inputIndex >= content.length) return null;
    const char = content[inputIndex];
    
    // Find char in layout
    for (const row of KEYBOARD_LAYOUT) {
      for (const k of row) {
        if (k.key.toLowerCase() === char.toLowerCase()) {
          return { finger: k.finger, color: FINGER_COLORS[k.finger] };
        }
        if (char === ' ' && k.key === ' ') {
            return { finger: k.finger, color: FINGER_COLORS[k.finger] };
        }
      }
    }
    // Default fallback (e.g. for punctuation not on layout yet)
    return null;
  };

  const fingerInfo = getActiveFingerInfo();
  const isMasterLevel = subLevelId === 5;
  const isPractice = gameMode === 'PRACTICE';

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto min-h-screen pt-8 px-4">
      {/* Header / Stats */}
      <div className={`w-full flex justify-between items-center mb-8 p-4 rounded-lg border backdrop-blur-sm transition-colors ${isMasterLevel && !isPractice ? 'bg-yellow-900/30 border-yellow-700/50' : isPractice ? 'bg-purple-900/30 border-purple-700/50' : 'bg-slate-800/50 border-slate-700'}`}>
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-full transition-colors" title="Zurück zum Menü">
            <Home size={20} className="text-slate-400 hover:text-white" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              {stage.name}
              {isMasterLevel && !isPractice && <Crown className="w-5 h-5 text-yellow-400 fill-yellow-400 animate-pulse" />}
              {isPractice && <Zap className="w-5 h-5 text-purple-400 fill-purple-400" />}
            </h2>
            <p className={`text-xs ${isMasterLevel && !isPractice ? 'text-yellow-200' : isPractice ? 'text-purple-200' : 'text-slate-400'}`}>
              Level {stage.id} - {isPractice ? 'Üben' : isMasterLevel ? 'Meisterprüfung' : `Übung ${subLevelId}/5`}
            </p>
          </div>
        </div>
        
        <div className="flex gap-8">
          <div className="text-center">
            <p className="text-xs text-slate-400 uppercase tracking-wider">WPM</p>
            <p className="text-2xl font-mono font-bold text-emerald-400">{wpm}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400 uppercase tracking-wider">Fehler</p>
            <p className={`text-2xl font-mono font-bold ${mistakes > 0 ? 'text-rose-400' : 'text-slate-200'}`}>{mistakes}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400 uppercase tracking-wider">Fortschritt</p>
            <p className="text-2xl font-mono font-bold text-blue-400">{Math.round((inputIndex / content.length) * 100)}%</p>
          </div>
        </div>

        <button onClick={onRetry} className="p-2 hover:bg-slate-700 rounded-full transition-colors" title="Neustart">
          <RotateCcw size={20} className="text-slate-400 hover:text-white" />
        </button>
      </div>

      {/* Typing Area */}
      <div className="relative w-full bg-slate-900 rounded-2xl p-8 mb-8 border border-slate-800 shadow-inner min-h-[160px] flex items-center flex-wrap content-center justify-center">
         <div className={`text-3xl font-mono leading-relaxed break-all transition-transform duration-75 ${errorShake ? 'translate-x-1 text-rose-500' : ''}`}>
           {content.split('').map((char, idx) => {
             let statusColor = 'text-slate-600'; // Upcoming
             
             if (idx < inputIndex) {
               statusColor = 'text-emerald-500'; // Completed
             } else if (idx === inputIndex) {
               statusColor = 'text-white bg-slate-700 px-1 rounded animate-pulse'; // Current
               if (errorShake) statusColor = 'text-white bg-rose-600 px-1 rounded';
             }

             return (
               <span key={idx} className={`${statusColor} transition-colors duration-100`}>
                 {char === ' ' ? '␣' : char}
               </span>
             );
           })}
         </div>
      </div>

      {/* Finger Hint */}
      <div className="flex items-center justify-center gap-3 mb-4 h-8">
        {fingerInfo && (
          <>
            <span className="text-slate-400 text-sm uppercase tracking-widest">Benutze:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg ${fingerInfo.color}`}>
              {FINGER_NAMES_DE[fingerInfo.finger]}
            </span>
          </>
        )}
      </div>

      {/* Virtual Keyboard */}
      <VirtualKeyboard activeKey={content[inputIndex] || ''} pressedKeys={pressedKeys} />

      <input ref={inputRef} type="text" className="opacity-0 absolute top-0" />
      
      <div className="mt-8 text-slate-500 text-sm text-center max-w-lg">
        {isMasterLevel && !isPractice
          ? "Zeig was du kannst! Keine Fehler erlaubt, volle Konzentration." 
          : "Tippe die angezeigten Zeichen. Achte auf die farbige Hervorhebung!"}
      </div>
    </div>
  );
};

export default TypingGame;