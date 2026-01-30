import React, { useEffect, useState } from 'react';
import { Stage, UserProgress } from '../types';
import { STAGE_COLOR_CLASSES } from '../constants';
import { Check, Lock, Star, Crown, Zap, BookOpen } from 'lucide-react';
import TippsyAvatar from './TippsyAvatar';
import { useI18n } from '../hooks/useI18n';

interface StageCardProps {
  stage: Stage;
  progress: UserProgress;
  sessionStartProgress: UserProgress | null;
  onStartLevel: (s: Stage, l: number) => void;
  onStartPractice: (s: Stage) => void;
  onStartWordSentencePractice: (s: Stage) => void;
  isStageFocused?: boolean;
  focusedSubLevelId?: number | null;
}

const StageCard: React.FC<StageCardProps> = ({
  stage,
  progress,
  sessionStartProgress,
  onStartLevel,
  onStartPractice,
  onStartWordSentencePractice,
  isStageFocused = false,
  focusedSubLevelId = null
}) => {
  const { t } = useI18n();
  const isLocked = stage.id > progress.unlockedStageId;
  const isCompleted = stage.id < progress.unlockedStageId;
  const isCurrent = stage.id === progress.unlockedStageId;

  // Calculate Progress Percentage for this stage
  let completionPercent = 0;
  if (isCompleted) completionPercent = 100;
  else if (isCurrent) {
    completionPercent = ((progress.unlockedSubLevelId - 1) / 5) * 100;
  }

  // --- WALKING ANIMATION LOGIC ---
  const getPositionForSubLevel = (subLevel: number) => {
    switch(subLevel) {
      case 1: return 15;
      case 2: return 32;
      case 3: return 50;
      case 4: return 67;
      case 5: return 85;
      default: return 15;
    }
  };

  const [tippsyPos, setTippsyPos] = useState(() => {
      if (isCurrent && sessionStartProgress && sessionStartProgress.unlockedStageId === stage.id) {
          return getPositionForSubLevel(sessionStartProgress.unlockedSubLevelId);
      }
      if (isCurrent) return getPositionForSubLevel(progress.unlockedSubLevelId);
      return 15;
  });
  
  const [isWalking, setIsWalking] = useState(false);

  useEffect(() => {
    if (!isCurrent) return;

    const targetPos = getPositionForSubLevel(progress.unlockedSubLevelId);
    
    if (sessionStartProgress && sessionStartProgress.unlockedStageId === stage.id) {
       const startPos = getPositionForSubLevel(sessionStartProgress.unlockedSubLevelId);
       
       if (startPos !== targetPos) {
           setTippsyPos(startPos);
           setIsWalking(true);
           
           const timer = setTimeout(() => {
               setTippsyPos(targetPos);
           }, 800); 

           const stopTimer = setTimeout(() => {
               setIsWalking(false);
           }, 2900);

           return () => { clearTimeout(timer); clearTimeout(stopTimer); };
       } else {
           setTippsyPos(targetPos);
           setIsWalking(false);
       }
    } else {
        setTippsyPos(targetPos);
        setIsWalking(false);
    }
  }, [isCurrent, progress, sessionStartProgress, stage.id]);


  const getVerticalPos = (xPercent: number) => {
      if (xPercent < 23) return 90;
      if (xPercent < 41) return 122;
      if (xPercent < 58) return 58;
      if (xPercent < 76) return 90;
      return 90;
  };

  const c = STAGE_COLOR_CLASSES[stage.color] ?? STAGE_COLOR_CLASSES.emerald;

  return (
    <div
      data-stage-id={stage.id}
      className={`
      relative rounded-[2.5rem] p-8 transition-all duration-300 overflow-hidden group
      ${isLocked 
        ? 'border-[3px] border-slate-800 bg-slate-900/40 grayscale-[0.8] opacity-60' 
        : `border-[3px] bg-gradient-to-b from-slate-900 via-slate-900 ${c.cardBorder} ${c.cardBg} ${c.shadow}`
      }
      ${isStageFocused ? 'ring-4 ring-offset-4 ring-offset-[#0a0f1c] ring-white scale-[1.02] shadow-2xl z-10' : 'shadow-xl'}
    `}>
      {!isLocked && (
        <div className={`absolute -top-20 -right-20 w-64 h-64 ${c.blobBg} rounded-full blur-[80px] ${c.blobHover} transition-all duration-700 pointer-events-none`}></div>
      )}

      {/* HEADER SECTION */}
      <div className="relative z-10 flex justify-between items-start mb-8">
        <div className="flex items-center gap-5">
           {/* Stage Number Badge */}
          <div className={`
            w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg border-2 transform rotate-3 group-hover:rotate-6 transition-transform
            ${isLocked 
              ? 'bg-slate-800 border-slate-700 text-slate-600' 
              : isCompleted
                ? 'bg-emerald-500 border-emerald-400 text-white'
                : `${c.badgeBg} ${c.badgeBorder} text-white`
            }
          `}>
            {isCompleted ? <Check strokeWidth={4} className="w-7 h-7" /> : stage.id}
          </div>
          
          <div>
            <h3 className={`text-2xl font-bold mb-1 ${isLocked ? 'text-slate-500' : 'text-white'}`}>{stage.name}</h3>
            <p className="text-sm text-slate-400 font-medium max-w-[200px] leading-snug">{stage.description}</p>
          </div>
        </div>

        {/* New Keys Preview Pill */}
        {!isLocked && (
          <div className="hidden sm:flex flex-col items-end">
            <span className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${c.labelText}`}>{t('stageCard.newKeys')}</span>
            <div className="flex gap-1">
              {stage.newChars.slice(0, 4).map((char, i) => (
                <div key={i} className={`
                  w-8 h-8 rounded-lg flex items-center justify-center font-mono text-sm font-bold border border-b-2
                  bg-slate-800 ${c.keyBorder} text-white shadow-sm
                `}>
                  {char === 'Shift' ? '⇧' : char.toUpperCase()}
                </div>
              ))}
              {stage.newChars.length > 4 && (
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs text-slate-500 bg-slate-900 border border-slate-800">+</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* PROGRESS BAR */}
      {!isLocked && stage.id !== 15 && (
        <div className="mb-10 relative">
          <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            <span>{t('stageCard.progress')}</span>
            <span>{Math.round(completionPercent)}%</span>
          </div>
          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-800/50">
            <div 
              className={`h-full ${c.progressBar} transition-all duration-1000 ease-out rounded-full`}
              style={{ width: `${completionPercent}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* PATH / LEVEL MAP */}
      <div className="relative min-h-[180px] flex items-center justify-center">
        
        {/* ENDLESS MODE: Single Big Button */}
        {stage.id === 15 ? (
          <div className="w-full flex justify-center py-8">
             <button
                disabled={isLocked}
                onClick={() => onStartLevel(stage, 1)}
                className={`
                  relative group flex flex-col items-center justify-center transition-all duration-500
                  ${isStageFocused ? 'scale-110' : ''}
                `}
              >
                <div className={`
                   w-32 h-32 rounded-full flex items-center justify-center border-4 shadow-2xl transition-all duration-500 relative z-10
                   ${isLocked
                     ? 'bg-slate-800 border-slate-700 text-slate-600'
                     : 'bg-gradient-to-br from-violet-600 to-indigo-600 border-violet-400 text-white shadow-[0_0_50px_rgba(139,92,246,0.4)] hover:scale-110 hover:shadow-[0_0_70px_rgba(139,92,246,0.6)]'
                   }
                   ${isStageFocused && !isLocked ? 'ring-4 ring-white shadow-[0_0_90px_rgba(139,92,246,0.8)] scale-110' : ''}
                `}>
                   {isLocked ? (
                     <Lock size={32} />
                   ) : (
                     <div className="flex flex-col items-center animate-pulse-slow">
                        <span className="text-4xl">∞</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest mt-1">{t('stageCard.start')}</span>
                     </div>
                   )}
                </div>
             </button>
          </div>
        ) : (
          /* STANDARD: 5-Step Path */
          <>
            {/* TIPPSY WALKER - Only on Current Stage */}
            {!isLocked && isCurrent && (
                <div 
                  className="absolute z-30 w-12 h-12 pointer-events-none transition-all duration-[2000ms] ease-in-out"
                  style={{ 
                      left: `${tippsyPos}%`, 
                      top: `${getVerticalPos(tippsyPos)}px`,
                      transform: 'translate(-50%, -100%)' // Pivot at bottom/feet
                  }}
                >
                    <div className={isWalking ? 'animate-bounce' : ''}>
                      <TippsyAvatar mood={isWalking ? 'excited' : 'happy'} className="w-full h-full drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]" />
                    </div>
                </div>
            )}

            {/* SVG Connecting Line (Dotted Path) */}
            {!isLocked && (
              <svg className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30" viewBox="0 0 400 180" preserveAspectRatio="none">
                <path 
                  d="M 50,90 C 100,90 100,130 150,130 C 200,130 200,50 250,50 C 300,50 300,90 350,90" 
                  fill="none" 
                  stroke={isLocked ? "#334155" : "currentColor"} 
                  strokeWidth="4" 
                  strokeDasharray="8 8"
                  className={c.pathText}
                />
              </svg>
            )}

            <div className="relative z-10 w-full flex justify-between px-4 sm:px-12 items-center">
              {[1, 2, 3, 4, 5].map((subLevelId) => {
                const isMaster = subLevelId === 5;
                const isItemFocused = isStageFocused && focusedSubLevelId === subLevelId;
                
                let status: 'locked' | 'active' | 'completed' = 'locked';
                
                if (isCompleted) status = 'completed';
                else if (isCurrent) {
                  if (subLevelId < progress.unlockedSubLevelId) status = 'completed';
                  else if (subLevelId === progress.unlockedSubLevelId) status = 'active';
                }

                // Vertical positioning to match the curve vaguely
                let translateY = 'translate-y-0';
                if (subLevelId === 2) translateY = 'translate-y-8'; // Down
                if (subLevelId === 3) translateY = '-translate-y-8'; // Up
                if (subLevelId === 4) translateY = 'translate-y-0'; 

                return (
                  <button
                    key={subLevelId}
                    disabled={status === 'locked'}
                    onClick={() => onStartLevel(stage, subLevelId)}
                    className={`
                      relative group/btn flex flex-col items-center justify-center transition-all duration-300 ${translateY}
                      ${isItemFocused ? 'scale-125 z-20' : ''}
                    `}
                  >
                    <div className={`
                      w-14 h-14 rounded-full flex items-center justify-center border-4 shadow-xl transition-all duration-300 relative z-10
                      ${status === 'locked' 
                        ? 'bg-slate-800 border-slate-700 text-slate-600 scale-90' 
                        : status === 'completed'
                          ? 'bg-slate-800 border-emerald-500 text-emerald-400 scale-100 hover:scale-110'
                          : `${c.nodeActive} border-white text-white scale-110 hover:scale-125 shadow-[0_0_30px_rgba(255,255,255,0.3)]`
                      }
                      ${isMaster && status !== 'locked' ? 'w-16 h-16' : ''}
                      ${isItemFocused ? 'ring-4 ring-white shadow-[0_0_40px_rgba(255,255,255,0.6)]' : ''}
                    `}>
                        {status === 'locked' && <Lock size={16} />}
                        {status === 'completed' && <Star fill="currentColor" size={20} />}
                        {status === 'active' && !isMaster && <span className="font-bold text-lg">{subLevelId}</span>}
                        {status === 'active' && isMaster && <Crown fill="currentColor" size={24} />}
                    </div>
                    
                    {/* Tooltip / Label */}
                    <div className={`
                      absolute -bottom-8 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none z-20
                      ${status === 'active' ? 'text-white border-white/30' : 'text-slate-500'}
                      ${isItemFocused ? 'opacity-100' : ''}
                    `}>
                      {isMaster ? t('stageCard.master') : t('stageCard.level', { level: subLevelId })}
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* PRACTICE BUTTONS */}
      {isCompleted && (
        <div className="mt-8 pt-6 border-t border-slate-800/50 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => onStartPractice(stage)}
            className={`
              flex items-center gap-3 px-8 py-4 rounded-2xl 
              bg-slate-800 border border-slate-700
              ${c.practiceHover}
              text-slate-300 font-bold transition-all duration-300 group/practice w-full sm:w-auto justify-center
            `}
          >
            <div className={`p-1.5 rounded-lg ${c.practiceIconBg} transition-colors`}>
              <Zap className={`w-5 h-5 ${c.practiceIconText}`} />
            </div>
            <span>{t('stageCard.endlessPractice')}</span>
          </button>
          <button
            onClick={() => onStartWordSentencePractice(stage)}
            className={`
              flex items-center gap-3 px-8 py-4 rounded-2xl 
              bg-slate-800 border border-slate-700
              ${c.practiceHover}
              text-slate-300 font-bold transition-all duration-300 group/practice w-full sm:w-auto justify-center
            `}
          >
            <div className={`p-1.5 rounded-lg ${c.practiceIconBg} transition-colors`}>
              <BookOpen className={`w-5 h-5 ${c.practiceIconText}`} />
            </div>
            <span>{t('stageCard.wordSentence')}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default StageCard;
