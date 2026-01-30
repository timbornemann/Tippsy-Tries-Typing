import React, { useState, useEffect } from 'react';
import { GameState, UserProgress } from '../types';
import { Bot, Sparkles } from 'lucide-react';

const Mascot = ({ progress, gameState }: { progress: UserProgress, gameState: GameState }) => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (gameState === GameState.MENU) {
      if (progress.unlockedStageId === 1 && progress.unlockedSubLevelId === 1) {
        setMessage("Hallo! Ich bin Tippy. Lass uns gemeinsam tippen lernen!");
      } else if (progress.unlockedStageId > 5) {
        setMessage("Wow, du bist schon richtig weit! Deine Finger fliegen ja nur so.");
      } else {
        setMessage("Schön, dass du wieder da bist! Bereit für die nächste Lektion?");
      }
    }
  }, [gameState, progress]);

  return (
    <div className="flex items-center gap-4 bg-slate-800/60 backdrop-blur-md p-4 rounded-[2rem] border border-slate-700/50 shadow-xl mb-8 max-w-xl mx-auto transform hover:scale-[1.02] transition-transform duration-300">
      <div className="relative">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Bot className="w-9 h-9 text-white" />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-1 border-2 border-slate-800">
          <Sparkles className="w-3 h-3 text-yellow-900" />
        </div>
      </div>
      <div className="flex-1">
        <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-0.5">Dein Lernbegleiter</p>
        <p className="text-slate-200 font-medium leading-tight">{message}</p>
      </div>
    </div>
  );
};

export default Mascot;
