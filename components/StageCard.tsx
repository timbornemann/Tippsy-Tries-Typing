import React from 'react';
import { Stage, UserProgress } from '../types';
import { Check, Lock, Star, Crown, Zap } from 'lucide-react';

interface StageCardProps {
  stage: Stage;
  progress: UserProgress;
  onStartLevel: (s: Stage, l: number) => void;
  onStartPractice: (s: Stage) => void;
}

const StageCard: React.FC<StageCardProps> = ({ 
  stage, 
  progress, 
  onStartLevel, 
  onStartPractice 
}) => {
  const isLocked = stage.id > progress.unlockedStageId;
  const isCompleted = stage.id < progress.unlockedStageId;
  const isCurrent = stage.id === progress.unlockedStageId;

  // Calculate Progress Percentage for this stage
  let completionPercent = 0;
  if (isCompleted) completionPercent = 100;
  else if (isCurrent) {
    // 5 Levels total. If unlockedSubLevelId is 3, we finished 2. (2/5 = 40%)
    // But if we unlocked 3, it means we are ABOUT to do 3.
    completionPercent = ((progress.unlockedSubLevelId - 1) / 5) * 100;
  }

  return (
    <div className={`
      relative rounded-[2.5rem] p-8 border-[3px] transition-all duration-500 overflow-hidden group
      ${isLocked 
        ? 'border-slate-800 bg-slate-900/40 grayscale-[0.8] opacity-60' 
        : `border-${stage.color}-500/20 bg-gradient-to-b from-slate-900 via-slate-900 to-${stage.color}-950/20 shadow-2xl shadow-${stage.color}-900/10`
      }
    `}>
      {/* Decorative background blob */}
      {!isLocked && (
        <div className={`absolute -top-20 -right-20 w-64 h-64 bg-${stage.color}-500/10 rounded-full blur-[80px] group-hover:bg-${stage.color}-500/20 transition-all duration-700 pointer-events-none`}></div>
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
                : `bg-${stage.color}-500 border-${stage.color}-400 text-white`
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
            <span className={`text-[10px] font-bold uppercase tracking-widest mb-2 text-${stage.color}-400`}>Neue Tasten</span>
            <div className="flex gap-1">
              {stage.newChars.slice(0, 4).map((char, i) => (
                <div key={i} className={`
                  w-8 h-8 rounded-lg flex items-center justify-center font-mono text-sm font-bold border border-b-2
                  bg-slate-800 border-${stage.color}-500/30 text-white shadow-sm
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
      {!isLocked && (
        <div className="mb-10 relative">
          <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            <span>Fortschritt</span>
            <span>{Math.round(completionPercent)}%</span>
          </div>
          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-800/50">
            <div 
              className={`h-full bg-gradient-to-r from-${stage.color}-600 to-${stage.color}-400 transition-all duration-1000 ease-out rounded-full`}
              style={{ width: `${completionPercent}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* PATH / LEVEL MAP */}
      <div className="relative min-h-[180px] flex items-center justify-center">
        
        {/* SVG Connecting Line (Dotted Path) */}
        {!isLocked && (
           <svg className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30" viewBox="0 0 400 180" preserveAspectRatio="none">
             <path 
               d="M 50,90 C 100,90 100,130 150,130 C 200,130 200,50 250,50 C 300,50 300,90 350,90" 
               fill="none" 
               stroke={isLocked ? "#334155" : "currentColor"} 
               strokeWidth="4" 
               strokeDasharray="8 8"
               className={`text-${stage.color}-500`}
             />
           </svg>
        )}

        <div className="relative z-10 w-full flex justify-between px-4 sm:px-12 items-center">
          {[1, 2, 3, 4, 5].map((subLevelId) => {
             const isMaster = subLevelId === 5;
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
                 `}
               >
                 <div className={`
                   w-14 h-14 rounded-full flex items-center justify-center border-4 shadow-xl transition-all duration-300 relative z-10
                   ${status === 'locked' 
                     ? 'bg-slate-800 border-slate-700 text-slate-600 scale-90' 
                     : status === 'completed'
                       ? 'bg-slate-800 border-emerald-500 text-emerald-400 scale-100 hover:scale-110'
                       : `bg-${stage.color}-500 border-white text-white scale-110 hover:scale-125 shadow-[0_0_30px_rgba(255,255,255,0.3)]`
                   }
                   ${isMaster && status !== 'locked' ? 'w-16 h-16' : ''}
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
                 `}>
                   {isMaster ? 'Meister' : `Level ${subLevelId}`}
                 </div>
               </button>
             );
          })}
        </div>
      </div>

      {/* PRACTICE BUTTON */}
      {isCompleted && (
        <div className="mt-8 pt-6 border-t border-slate-800/50 flex justify-center">
          <button
             onClick={() => onStartPractice(stage)}
             className={`
               flex items-center gap-3 px-8 py-4 rounded-2xl 
               bg-slate-800 border border-slate-700
               hover:bg-${stage.color}-500 hover:border-${stage.color}-400 hover:text-white hover:shadow-[0_0_25px_rgba(0,0,0,0.3)]
               text-slate-300 font-bold transition-all duration-300 group/practice w-full sm:w-auto justify-center
             `}
          >
            <div className={`p-1.5 rounded-lg bg-${stage.color}-500/20 group-hover/practice:bg-white/20 transition-colors`}>
              <Zap className={`w-5 h-5 text-${stage.color}-400 group-hover/practice:text-white`} />
            </div>
            <span>Endlos-Üben (Mega-Level)</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default StageCard;
