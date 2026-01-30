import React, { useState, useEffect } from 'react';
import { GameState, UserProgress } from '../types';
import { Sparkles } from 'lucide-react';
import TippsyAvatar from './TippsyAvatar';
import { useI18n } from '../hooks/useI18n';

const Mascot = ({ progress, gameState }: { progress: UserProgress, gameState: GameState }) => {
  const { t } = useI18n();
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (gameState === GameState.MENU) {
      if (progress.unlockedStageId === 1 && progress.unlockedSubLevelId === 1) {
        setMessage(t('mascot.messages.start'));
      } else if (progress.unlockedStageId > 5) {
        setMessage(t('mascot.messages.advanced'));
      } else {
        setMessage(t('mascot.messages.default'));
      }
    }
  }, [gameState, progress, t]);

  return (
    <div className="flex items-center gap-4 bg-slate-800/60 backdrop-blur-md p-4 rounded-[2rem] border border-slate-700/50 shadow-xl mb-8 max-w-xl mx-auto transform hover:scale-[1.02] transition-transform duration-300">
      <div className="relative">
        <div className="w-20 h-20 -ml-2">
           <TippsyAvatar mood="happy" className="w-full h-full drop-shadow-xl" />
        </div>
        <div className="absolute top-0 right-0 bg-yellow-400 rounded-full p-1 border-2 border-slate-800 animate-spin-slow">
          <Sparkles className="w-3 h-3 text-yellow-900" />
        </div>
      </div>
      <div className="flex-1 pl-2">
        <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-0.5">{t('mascot.label')}</p>
        <p className="text-slate-200 font-medium leading-tight">{message}</p>
      </div>
    </div>
  );
};

export default Mascot;
