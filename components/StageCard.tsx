import React, { useEffect, useState } from 'react';
import { Stage, UserProgress } from '../types';
import { ENDLESS_STAGE_ID, MAX_SUB_LEVELS, STAGE_COLOR_CLASSES } from '../constants';
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

// Level 9 and master spaced apart (78% and 95%) so they don’t overlap
const LEVEL_X = [10, 20, 30, 40, 50, 60, 70, 78, 86, 95];

type PathVariant = { pathD: string; topPercents: number[] };

// 14 unique paths (one per stage 1–14); viewBox 0 0 400 180, asymmetric, not sinus-like
const STAGE_PATHS: PathVariant[] = [
  // 1: Zigzag (sharp L segments)
  {
    pathD: 'M 40,95 L 76,52 L 112,122 L 148,45 L 184,115 L 220,55 L 256,118 L 292,48 L 328,88 L 364,75 L 380,88',
    topPercents: [53, 29, 68, 25, 64, 31, 66, 27, 49, 42],
  },
  // 2: Stairs (flat then jump)
  {
    pathD: 'M 40,90 L 120,90 L 120,55 L 200,55 L 200,125 L 280,125 L 280,70 L 360,70 L 380,82',
    topPercents: [50, 50, 31, 31, 69, 69, 39, 39, 48, 46],
  },
  // 3: Valley (high start, low middle, high end) — topPercents from path y at LEVEL_X
  {
    pathD: 'M 40,62 C 100,62 140,95 180,118 C 220,138 260,95 300,75 C 330,62 355,68 380,72',
    topPercents: [34, 37, 45, 57, 69, 56, 46, 41, 38, 40],
  },
  // 4: Mountain (low start, peak middle, low end)
  {
    pathD: 'M 40,118 C 100,118 140,85 180,52 C 220,28 260,55 300,95 C 330,118 355,112 380,108',
    topPercents: [66, 63, 50, 36, 19, 36, 49, 54, 60, 60],
  },
  // 5: Two bumps (asymmetric C, different heights)
  {
    pathD: 'M 40,92 C 90,92 105,58 150,62 C 195,66 210,98 250,94 C 285,90 298,55 340,65 Q 368,72 380,78',
    topPercents: [51, 35, 34, 55, 54, 52, 35, 42, 40, 43],
  },
  // 6: Two valleys (dips at different x)
  {
    pathD: 'M 40,78 L 90,78 C 130,78 145,118 180,122 C 215,126 230,82 270,78 C 305,75 318,112 355,108 L 380,95',
    topPercents: [43, 43, 56, 66, 67, 50, 46, 53, 60, 53],
  },
  // 7: Wobbly (small Q/C with offset control points)
  {
    pathD: 'M 40,88 Q 65,72 90,85 Q 118,98 142,78 Q 168,58 198,82 Q 228,105 258,88 Q 285,72 318,82 Q 348,92 368,85 L 380,88',
    topPercents: [49, 44, 49, 43, 46, 58, 49, 49, 48, 47],
  },
  // 8: Flat–drop–recovery (long flat, steep drop, gentle rise)
  {
    pathD: 'M 40,85 L 160,85 L 180,125 L 220,98 L 280,75 L 340,78 L 380,82',
    topPercents: [47, 47, 47, 69, 55, 42, 44, 43, 43, 46],
  },
  // 9: Recovery–climb (gentle up then flatter)
  {
    pathD: 'M 40,118 C 80,118 100,95 150,82 C 200,70 240,62 290,68 C 330,72 355,78 380,80',
    topPercents: [66, 58, 53, 46, 35, 38, 38, 43, 43, 44],
  },
  // 10: S-curve asymmetric (one side stronger curve)
  {
    pathD: 'M 40,95 C 120,95 130,52 200,58 C 260,64 270,115 320,108 C 355,102 368,78 380,85',
    topPercents: [53, 49, 43, 36, 32, 42, 56, 59, 53, 47],
  },
  // 11: Stairs down (stepwise down)
  {
    pathD: 'M 40,65 L 80,65 L 80,85 L 160,85 L 160,105 L 240,105 L 240,118 L 320,118 L 320,128 L 380,128',
    topPercents: [36, 36, 47, 47, 58, 58, 66, 66, 71, 71],
  },
  // 12: Stairs up (stepwise up)
  {
    pathD: 'M 40,125 L 80,125 L 80,105 L 160,105 L 160,85 L 240,85 L 240,62 L 320,62 L 320,52 L 380,52',
    topPercents: [69, 69, 58, 58, 47, 47, 34, 34, 29, 29],
  },
  // 13: One big arc (wide C, asymmetric)
  {
    pathD: 'M 40,108 C 180,108 220,38 380,75',
    topPercents: [60, 58, 54, 49, 42, 34, 31, 32, 35, 42],
  },
  // 14: Mix (short lines + short arcs, irregular)
  {
    pathD: 'M 40,82 L 72,82 Q 95,65 118,78 L 148,78 C 175,78 182,108 210,98 L 242,98 Q 268,88 292,95 L 322,95 C 348,95 355,62 380,72',
    topPercents: [46, 44, 43, 46, 56, 55, 53, 53, 48, 40],
  },
];

function getPathForStage(stageId: number): PathVariant {
  // Stage 15 (Endless) has no path; return first so getLevelPath still yields valid data if called
  const index = Math.min(stageId - 1, STAGE_PATHS.length - 1);
  return STAGE_PATHS[index];
}

function getLevelPath(stageId: number): { x: number; topPercent: number }[] {
  const variant = getPathForStage(stageId);
  return LEVEL_X.map((x, i) => ({ x, topPercent: variant.topPercents[i] }));
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
    completionPercent = ((progress.unlockedSubLevelId - 1) / MAX_SUB_LEVELS) * 100;
  }

  const levelPath = getLevelPath(stage.id);

  const getPositionForSubLevel = (subLevel: number) => {
    return levelPath[subLevel - 1] ?? levelPath[0];
  };

  const [tippsyPos, setTippsyPos] = useState(() => {
      if (isCurrent && sessionStartProgress && sessionStartProgress.unlockedStageId === stage.id) {
          return getPositionForSubLevel(sessionStartProgress.unlockedSubLevelId);
      }
      if (isCurrent) return getPositionForSubLevel(progress.unlockedSubLevelId);
      return levelPath[0];
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

  const c = STAGE_COLOR_CLASSES[stage.color] ?? STAGE_COLOR_CLASSES.emerald;

  return (
    <div
      data-stage-id={stage.id}
      className={`
      relative rounded-[2.5rem] p-8 transition-all duration-300 group w-full h-full flex flex-col min-h-0
      overflow-visible
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
      <div className="relative z-10 flex justify-between items-start mb-8 shrink-0">
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

      {/* PROGRESS BAR (or spacer for Endless so card height matches others) */}
      {!isLocked && stage.id !== ENDLESS_STAGE_ID && (
        <div className="mb-10 relative shrink-0">
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
      {!isLocked && stage.id === ENDLESS_STAGE_ID && (
        <div className="mb-10 min-h-[52px] shrink-0" aria-hidden="true" />
      )}

      {/* PATH / LEVEL MAP - overflow-visible so master level and halos aren’t clipped */}
      <div className={`relative min-h-[180px] flex-1 flex items-center justify-center min-h-0 overflow-visible ${stage.id === ENDLESS_STAGE_ID ? '' : ''}`}>
        
        {/* ENDLESS MODE: Single Big Button */}
        {stage.id === ENDLESS_STAGE_ID ? (
          <div className="w-full flex justify-center py-8 overflow-visible">
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
          /* STANDARD: 10-Step Path */
          <>
            {/* TIPPSY WALKER - Only on Current Stage */}
            {!isLocked && isCurrent && (
                <div 
                  className="absolute z-30 w-12 h-12 pointer-events-none transition-all duration-[2000ms] ease-in-out"
                  style={{ 
                      left: `${tippsyPos.x}%`, 
                      top: `${tippsyPos.topPercent}%`,
                      transform: 'translate(-50%, -100%)'
                  }}
                >
                    <div className={isWalking ? 'animate-bounce' : ''}>
                      <TippsyAvatar mood={isWalking ? 'excited' : 'happy'} className="w-full h-full drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]" />
                    </div>
                </div>
            )}

            {/* SVG Connecting Line (Dotted Path) – shape varies by stage */}
            {!isLocked && (
              <svg className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30" viewBox="0 0 400 180" preserveAspectRatio="none">
                <path 
                  d={getPathForStage(stage.id).pathD}
                  fill="none" 
                  stroke={isLocked ? "#334155" : "currentColor"} 
                  strokeWidth="4" 
                  strokeDasharray="8 8"
                  className={c.pathText}
                />
              </svg>
            )}

            <div className="absolute inset-0 z-10 w-full px-4 sm:px-12 pb-8 pointer-events-none [&_button]:pointer-events-auto">
              {levelPath.map((level, index) => {
                const subLevelId = index + 1;
                const isMaster = subLevelId === MAX_SUB_LEVELS;
                const isItemFocused = isStageFocused && focusedSubLevelId === subLevelId;
                
                let status: 'locked' | 'active' | 'completed' = 'locked';
                
                if (isCompleted) status = 'completed';
                else if (isCurrent) {
                  if (subLevelId < progress.unlockedSubLevelId) status = 'completed';
                  else if (subLevelId === progress.unlockedSubLevelId) status = 'active';
                }

                return (
                  <button
                    key={subLevelId}
                    disabled={status === 'locked'}
                    onClick={() => onStartLevel(stage, subLevelId)}
                    className={`
                      absolute group/btn flex flex-col items-center justify-center transition-all duration-300
                      -translate-x-1/2 -translate-y-1/2
                      ${isItemFocused ? 'scale-125 z-20' : ''}
                    `}
                    style={{
                      left: `${level.x}%`,
                      top: `${level.topPercent}%`,
                    }}
                  >
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center border-4 shadow-xl transition-all duration-300 relative z-10
                      ${status === 'locked' 
                        ? 'bg-slate-800 border-slate-700 text-slate-600 scale-90' 
                        : status === 'completed'
                          ? 'bg-slate-800 border-emerald-500 text-emerald-400 scale-100 hover:scale-110'
                          : `${c.nodeActive} border-white text-white scale-110 hover:scale-125 shadow-[0_0_30px_rgba(255,255,255,0.3)]`
                      }
                      ${isMaster && status !== 'locked' ? 'w-14 h-14' : ''}
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

      {/* Bottom spacer for Endless (stage 15) so card height matches completed cards with practice buttons */}
      {!isLocked && stage.id === ENDLESS_STAGE_ID && (
        <div className="mt-8 pt-6 border-t border-slate-800/50 min-h-[124px] shrink-0" aria-hidden="true" />
      )}

      {/* PRACTICE BUTTONS */}
      {isCompleted && (
        <div className="mt-8 pt-6 border-t border-slate-800/50 flex flex-col sm:flex-row gap-4 justify-center items-center shrink-0">
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
