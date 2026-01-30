import React, { useState, useEffect } from 'react';
import { GameState, Stage, GameStats, UserProgress, GameMode, GlobalStats } from './types';
import { STAGES } from './constants';
import { generatePracticeContent } from './services/geminiService';
import { generatePatternLevel } from './services/patternGenerator';
import TypingGame from './components/TypingGame';
import Statistics from './components/Statistics';
import { Keyboard, Trophy, BarChart3, Star, Loader2, RotateCcw, Lock, Check, Crown, Zap, User, Bot, Sparkles, MapPin } from 'lucide-react';

// --- MASCOT COMPONENT ---
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

// --- STAGE CARD COMPONENT ---
const StageCard = ({ 
  stage, 
  progress, 
  onStartLevel, 
  onStartPractice 
}: { 
  stage: Stage, 
  progress: UserProgress, 
  onStartLevel: (s: Stage, l: number) => void, 
  onStartPractice: (s: Stage) => void 
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
            <span>Endlos-Üben (KI)</span>
          </button>
        </div>
      )}
    </div>
  );
};


const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  
  // Progress State with safe initialization for new stats field
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('tippmeister_progress');
    const parsed = saved ? JSON.parse(saved) : {};
    
    // Ensure structure exists even for old saves
    return {
      unlockedStageId: parsed.unlockedStageId || 1,
      unlockedSubLevelId: parsed.unlockedSubLevelId || 1,
      stats: parsed.stats || {
        totalCharsTyped: 0,
        totalTimePlayed: 0,
        gamesPlayed: 0,
        highestWpm: 0,
        averageWpm: 0,
        averageAccuracy: 0
      }
    };
  });

  // Current Session State
  const [currentStage, setCurrentStage] = useState<Stage | null>(null);
  const [currentSubLevel, setCurrentSubLevel] = useState<number>(1);
  const [gameMode, setGameMode] = useState<GameMode>('STANDARD');
  const [gameContent, setGameContent] = useState<string>('');
  const [lastStats, setLastStats] = useState<GameStats | null>(null);

  useEffect(() => {
    localStorage.setItem('tippmeister_progress', JSON.stringify(progress));
  }, [progress]);

  // Start a standard level (1-5) using the Pattern Generator
  const startLevel = async (stage: Stage, subLevelId: number) => {
    setCurrentStage(stage);
    setCurrentSubLevel(subLevelId);
    setGameMode('STANDARD');
    setGameState(GameState.LOADING);
    
    // Artificial delay for smooth UX transition even though generation is instant
    await new Promise(r => setTimeout(r, 800));
    
    const content = generatePatternLevel(stage, subLevelId);
    setGameContent(content);
    setGameState(GameState.PLAYING);
  };

  // Start Practice Mode using AI
  const startPractice = async (stage: Stage) => {
    setCurrentStage(stage);
    setCurrentSubLevel(0); // 0 indicates practice/no specific level
    setGameMode('PRACTICE');
    setGameState(GameState.LOADING);
    
    const content = await generatePracticeContent(stage);
    setGameContent(content);
    setGameState(GameState.PLAYING);
  };

  const handleFinish = (gameStats: GameStats) => {
    setLastStats(gameStats);
    setGameState(GameState.FINISHED);
    
    // Update Global Stats
    setProgress(prev => {
      const p = prev;
      const s = p.stats;
      const newGamesPlayed = s.gamesPlayed + 1;
      
      // Calculate new averages
      const newAvgWpm = ((s.averageWpm * s.gamesPlayed) + gameStats.wpm) / newGamesPlayed;
      const newAvgAcc = ((s.averageAccuracy * s.gamesPlayed) + gameStats.accuracy) / newGamesPlayed;

      return {
        ...p,
        stats: {
          totalCharsTyped: s.totalCharsTyped + gameStats.totalChars,
          totalTimePlayed: s.totalTimePlayed + gameStats.timeElapsed,
          gamesPlayed: newGamesPlayed,
          highestWpm: Math.max(s.highestWpm, gameStats.wpm),
          averageWpm: newAvgWpm,
          averageAccuracy: newAvgAcc
        },
        // Unlock Logic (Only for standard levels)
        unlockedSubLevelId: (gameMode === 'STANDARD' && currentStage && currentSubLevel === 5 && currentStage.id === p.unlockedStageId && currentSubLevel === p.unlockedSubLevelId) ? 1 : (gameMode === 'STANDARD' && currentStage && currentSubLevel < 5 && currentStage.id === p.unlockedStageId && currentSubLevel === p.unlockedSubLevelId) ? p.unlockedSubLevelId + 1 : p.unlockedSubLevelId,
        unlockedStageId: (gameMode === 'STANDARD' && currentStage && currentSubLevel === 5 && currentStage.id === p.unlockedStageId && currentSubLevel === p.unlockedSubLevelId) ? p.unlockedStageId + 1 : p.unlockedStageId
      };
    });
  };

  const handleBackToMenu = () => {
    setGameState(GameState.MENU);
    setCurrentStage(null);
  };

  const handleRetry = () => {
    if (!currentStage) return;
    
    if (gameMode === 'PRACTICE') {
      startPractice(currentStage); // Generates new AI text
    } else {
      startLevel(currentStage, currentSubLevel); // Regenerates pattern
    }
  };

  const handleNextLevel = () => {
    if (!currentStage) return;

    // If we are in practice mode, just do another practice
    if (gameMode === 'PRACTICE') {
      startPractice(currentStage);
      return;
    }

    if (currentSubLevel < 5) {
      startLevel(currentStage, currentSubLevel + 1);
    } else {
      // Find next stage
      const nextStage = STAGES.find(s => s.id === currentStage.id + 1);
      if (nextStage) {
        startLevel(nextStage, 1);
      } else {
        // End of all content
        handleBackToMenu();
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-50 selection:bg-emerald-500/30 font-sans flex flex-col">
      
      {/* Background Gradient Mesh - Warmer Tones */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/20 rounded-full blur-[128px]"></div>
        <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] bg-rose-900/10 rounded-full blur-[150px]"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* HEADER */}
        {gameState === GameState.MENU && (
          <header className="py-6 px-6 text-center sticky top-0 z-50 bg-[#0a0f1c]/80 backdrop-blur-xl border-b border-slate-800/60 shadow-lg flex justify-between items-center">
            
            <div className="inline-flex items-center gap-3">
              <div className="bg-gradient-to-tr from-emerald-500 to-blue-500 p-2 rounded-xl shadow-lg">
                 <Keyboard className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-xl font-extrabold tracking-tight text-white">
                  TippMeister
                </h1>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Lern-Abenteuer</p>
              </div>
            </div>

            <button 
              onClick={() => setGameState(GameState.STATISTICS)}
              className="group flex items-center gap-3 px-4 py-2 rounded-full bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white transition-all border border-slate-700/50"
              title="Statistik ansehen"
            >
              <div className="text-right hidden sm:block">
                <p className="text-[10px] uppercase text-slate-500 font-bold">Dein Profil</p>
                <p className="text-xs font-mono font-bold">{progress.stats.totalCharsTyped.toLocaleString()} Zeichen</p>
              </div>
              <div className="p-2 bg-slate-700 rounded-full group-hover:bg-slate-600 transition-colors">
                <User size={20} />
              </div>
            </button>
          </header>
        )}

        {/* MENU STATE (Learning Path) */}
        {gameState === GameState.MENU && (
          <div className="flex-1 container mx-auto px-4 py-12 max-w-2xl">
            
            <Mascot progress={progress} gameState={gameState} />

            <div className="flex flex-col gap-16 pb-32">
              {STAGES.map((stage) => (
                <StageCard 
                  key={stage.id} 
                  stage={stage} 
                  progress={progress} 
                  onStartLevel={startLevel}
                  onStartPractice={startPractice}
                />
              ))}
            </div>
            
            {/* End of Content Message */}
            <div className="text-center pb-12">
               <p className="text-slate-500 text-sm">Mehr Lektionen folgen bald!</p>
            </div>
          </div>
        )}

        {/* STATISTICS STATE */}
        {gameState === GameState.STATISTICS && (
          <Statistics stats={progress.stats} onBack={handleBackToMenu} />
        )}

        {/* LOADING STATE */}
        {gameState === GameState.LOADING && (
          <div className="flex-1 flex flex-col items-center justify-center">
             <div className="relative mb-8">
               <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
               <Bot className="w-20 h-20 text-emerald-400 relative z-10 animate-bounce" />
             </div>
             <h2 className="text-3xl font-bold text-white mb-2">
               {gameMode === 'PRACTICE' ? 'Tippy denkt nach...' : currentSubLevel === 5 ? 'Meisterprüfung!' : 'Lektion wird geladen'}
             </h2>
             <p className="text-slate-400 text-lg">
               {gameMode === 'PRACTICE' ? 'Bereite einen coolen Text für dich vor.' : 'Mach deine Finger bereit!'}
             </p>
          </div>
        )}

        {/* PLAYING STATE */}
        {gameState === GameState.PLAYING && currentStage && (
          <TypingGame 
            stage={currentStage}
            subLevelId={currentSubLevel}
            content={gameContent}
            onFinish={handleFinish}
            onBack={handleBackToMenu}
            onRetry={handleRetry}
            gameMode={gameMode}
          />
        )}

        {/* FINISHED STATE */}
        {gameState === GameState.FINISHED && lastStats && currentStage && (
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
            <div className="bg-[#0f1623] border border-slate-800 rounded-[2.5rem] p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden">
               {/* Background Glow */}
               <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-${currentStage.color}-500 to-blue-500`}></div>
               
               <div className="text-center mb-10 relative">
                 <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-slate-800 mb-6 border-4 border-slate-700 relative shadow-xl">
                    <Trophy className="w-14 h-14 text-yellow-400" />
                    <Sparkles className="w-8 h-8 text-yellow-200 absolute -top-2 -right-2 animate-pulse" />
                 </div>
                 <h2 className="text-4xl font-bold text-white mb-2">
                   {gameMode === 'PRACTICE' ? 'Training beendet!' : currentSubLevel === 5 ? 'Meisterhaft!' : 'Gut gemacht!'}
                 </h2>
                 <p className="text-slate-400 text-lg">
                   {currentStage.name} • {gameMode === 'PRACTICE' ? 'Freies Üben' : (currentSubLevel === 5 ? 'Meisterprüfung' : `Übung ${currentSubLevel}`)}
                 </p>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                 <div className="bg-slate-800/50 p-5 rounded-2xl text-center border border-slate-700/50">
                   <BarChart3 className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                   <div className="text-3xl font-bold text-white font-mono">{lastStats.wpm}</div>
                   <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">WPM</div>
                 </div>
                 <div className="bg-slate-800/50 p-5 rounded-2xl text-center border border-slate-700/50">
                   <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                   <div className="text-3xl font-bold text-white font-mono">{lastStats.accuracy}%</div>
                   <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Genauigkeit</div>
                 </div>
                 <div className="bg-slate-800/50 p-5 rounded-2xl text-center border border-slate-700/50">
                   <div className={`text-3xl font-bold font-mono mt-8 ${lastStats.errors === 0 ? 'text-emerald-400' : 'text-white'}`}>{lastStats.errors}</div>
                   <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Fehler</div>
                 </div>
                 <div className="bg-slate-800/50 p-5 rounded-2xl text-center border border-slate-700/50">
                   <div className="text-3xl font-bold text-white font-mono mt-8">{Math.round(lastStats.timeElapsed)}s</div>
                   <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Zeit</div>
                 </div>
               </div>
               
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <button 
                   onClick={handleBackToMenu}
                   className="px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all border border-slate-700"
                 >
                   Menü
                 </button>
                 <button 
                   onClick={handleRetry}
                   className="px-8 py-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold transition-all flex items-center justify-center gap-2 border border-slate-600"
                 >
                   <RotateCcw className="w-5 h-5" />
                   {gameMode === 'PRACTICE' ? 'Neue Übung' : 'Wiederholen'}
                 </button>
                 <button 
                   onClick={handleNextLevel}
                   className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 transform hover:scale-105"
                 >
                   {gameMode === 'PRACTICE' ? 'Noch eine' : 'Weiter'}
                 </button>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;