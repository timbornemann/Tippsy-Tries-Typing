import React, { useState, useEffect } from 'react';
import { GameState, Stage, GameStats, UserProgress, GameMode, GlobalStats } from './types';
import { STAGES } from './constants';
import { generatePracticeContent } from './services/geminiService';
import { generatePatternLevel } from './services/patternGenerator';
import TypingGame from './components/TypingGame';
import Statistics from './components/Statistics';
import { Keyboard, Trophy, BarChart3, Star, Loader2, RotateCcw, Lock, Check, Crown, Zap, User } from 'lucide-react';

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
    await new Promise(r => setTimeout(r, 500));
    
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
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-emerald-500/30 font-sans flex flex-col">
      
      {/* Background Gradient Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-900/20 rounded-full blur-[128px]"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* HEADER */}
        {gameState === GameState.MENU && (
          <header className="py-6 px-6 text-center sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 shadow-lg flex justify-between items-center">
             <div className="w-10"></div> {/* Spacer for centering */}
             
            <div className="inline-flex items-center justify-center gap-3">
              <Keyboard className="w-8 h-8 text-emerald-400" />
              <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                TippMeister
              </h1>
            </div>

            <button 
              onClick={() => setGameState(GameState.STATISTICS)}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
              title="Statistik ansehen"
            >
              <User size={24} />
            </button>
          </header>
        )}

        {/* MENU STATE (Learning Path) */}
        {gameState === GameState.MENU && (
          <div className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
            <div className="flex flex-col gap-12 pb-24">
              {STAGES.map((stage) => {
                const isStageLocked = stage.id > progress.unlockedStageId;
                const isStageActive = stage.id === progress.unlockedStageId;
                const isStageCompleted = stage.id < progress.unlockedStageId;

                return (
                  <div key={stage.id} className={`relative rounded-3xl p-6 border-2 transition-all duration-500 ${isStageLocked ? 'border-slate-800 bg-slate-900/50 grayscale opacity-70' : `border-${stage.color}-900/50 bg-slate-900/80 shadow-2xl shadow-${stage.color}-900/20`}`}>
                    
                    {/* Stage Header */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl border shadow-lg ${isStageLocked ? 'bg-slate-800 border-slate-700 text-slate-500' : `bg-${stage.color}-500 border-${stage.color}-400 text-white`}`}>
                        {isStageCompleted ? <Check strokeWidth={4} /> : stage.id}
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-xl font-bold ${isStageLocked ? 'text-slate-500' : 'text-white'}`}>{stage.name}</h3>
                        <p className="text-sm text-slate-400">{stage.description}</p>
                      </div>
                    </div>

                    {/* Path / SubLevels */}
                    <div className="relative flex flex-col items-center gap-6">
                      {/* Vertical connector line */}
                      <div className="absolute top-4 bottom-4 w-1 bg-slate-800 rounded-full z-0"></div>

                      {[1, 2, 3, 4, 5].map((subLevelId) => {
                        const isMaster = subLevelId === 5;
                        let status: 'locked' | 'active' | 'completed' = 'locked';
                        
                        if (isStageCompleted) status = 'completed';
                        else if (isStageActive) {
                          if (subLevelId < progress.unlockedSubLevelId) status = 'completed';
                          else if (subLevelId === progress.unlockedSubLevelId) status = 'active';
                        }

                        // Slight horizontal offset for snake effect
                        const offsetClass = subLevelId % 2 === 0 ? 'translate-x-8' : '-translate-x-8';
                        const masterClass = isMaster ? 'scale-125 my-4' : '';

                        return (
                          <button
                            key={subLevelId}
                            disabled={status === 'locked'}
                            onClick={() => startLevel(stage, subLevelId)}
                            className={`
                              relative z-10 w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300
                              ${masterClass} ${subLevelId !== 3 ? offsetClass : ''}
                              ${status === 'locked' 
                                ? 'bg-slate-800 border-slate-700 text-slate-600 cursor-not-allowed' 
                                : status === 'completed'
                                  ? 'bg-yellow-500 border-yellow-400 text-yellow-900 shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:scale-110'
                                  : `bg-${stage.color}-500 border-${stage.color}-400 text-white animate-bounce-slow shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-110 cursor-pointer`
                              }
                            `}
                          >
                            {status === 'locked' && <Lock size={20} />}
                            {status === 'completed' && <Star fill="currentColor" size={24} />}
                            {status === 'active' && !isMaster && <span className="font-bold text-xl">{subLevelId}</span>}
                            {status === 'active' && isMaster && <Crown fill="white" size={24} />}
                            
                            {/* Star count or detail for active/completed could go here */}
                            {isMaster && <div className="absolute -bottom-6 text-[10px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">Master</div>}
                          </button>
                        );
                      })}
                    </div>

                    {/* PRACTICE BUTTON (AI) - Only if stage is completed */}
                    {isStageCompleted && (
                      <div className="mt-8 pt-6 border-t border-slate-800 flex justify-center">
                        <button
                           onClick={() => startPractice(stage)}
                           className={`flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 border border-${stage.color}-500/30 text-${stage.color}-400 font-bold hover:bg-${stage.color}-900/20 hover:border-${stage.color}-500 transition-all group`}
                        >
                          <Zap className="w-5 h-5 group-hover:text-yellow-400 transition-colors" />
                          <span>Üben (KI-Modus)</span>
                        </button>
                      </div>
                    )}

                  </div>
                );
              })}
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
             <Loader2 className="w-16 h-16 text-emerald-500 animate-spin mb-6" />
             <h2 className="text-2xl font-bold text-white mb-2">
               {gameMode === 'PRACTICE' ? 'KI generiert Übung...' : currentSubLevel === 5 ? 'Meisterprüfung wird geladen...' : 'Übung wird geladen...'}
             </h2>
             <p className="text-slate-400">
               {gameMode === 'PRACTICE' ? 'Bereite einzigartigen Text vor.' : 'Bereite Tastatur vor.'}
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
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden">
               {/* Background Glow */}
               <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-${currentStage.color}-500 to-blue-500`}></div>
               
               <div className="text-center mb-10">
                 <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-800 mb-6 border-4 border-slate-700 relative">
                    <Trophy className="w-12 h-12 text-yellow-400" />
                    <Star className="w-6 h-6 text-yellow-200 absolute top-0 right-0 animate-ping" />
                 </div>
                 <h2 className="text-4xl font-bold text-white mb-2">
                   {gameMode === 'PRACTICE' ? 'Training beendet' : currentSubLevel === 5 ? 'Stufe gemeistert!' : 'Level geschafft!'}
                 </h2>
                 <p className="text-slate-400">
                   {currentStage.name} • {gameMode === 'PRACTICE' ? 'Freies Üben' : (currentSubLevel === 5 ? 'Meisterprüfung' : `Übung ${currentSubLevel}`)}
                 </p>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                 <div className="bg-slate-800/50 p-4 rounded-xl text-center border border-slate-700">
                   <BarChart3 className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                   <div className="text-3xl font-bold text-white font-mono">{lastStats.wpm}</div>
                   <div className="text-xs text-slate-400 uppercase tracking-wider">WPM</div>
                 </div>
                 <div className="bg-slate-800/50 p-4 rounded-xl text-center border border-slate-700">
                   <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                   <div className="text-3xl font-bold text-white font-mono">{lastStats.accuracy}%</div>
                   <div className="text-xs text-slate-400 uppercase tracking-wider">Genauigkeit</div>
                 </div>
                 <div className="bg-slate-800/50 p-4 rounded-xl text-center border border-slate-700">
                   <div className="text-3xl font-bold text-white font-mono mt-8">{lastStats.errors}</div>
                   <div className="text-xs text-slate-400 uppercase tracking-wider">Fehler</div>
                 </div>
                 <div className="bg-slate-800/50 p-4 rounded-xl text-center border border-slate-700">
                   <div className="text-3xl font-bold text-white font-mono mt-8">{Math.round(lastStats.timeElapsed)}s</div>
                   <div className="text-xs text-slate-400 uppercase tracking-wider">Zeit</div>
                 </div>
               </div>
               
               {/* Small summary of total progress */}
               <div className="mb-8 text-center bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
                  <p className="text-sm text-slate-400">Gesamt getippte Zeichen: <span className="text-emerald-400 font-mono font-bold">{progress.stats.totalCharsTyped.toLocaleString()}</span></p>
               </div>

               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <button 
                   onClick={handleBackToMenu}
                   className="px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all"
                 >
                   Menü
                 </button>
                 <button 
                   onClick={handleRetry}
                   className="px-8 py-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold transition-all flex items-center justify-center gap-2"
                 >
                   <RotateCcw className="w-5 h-5" />
                   {gameMode === 'PRACTICE' ? 'Neue Übung' : 'Wiederholen'}
                 </button>
                 <button 
                   onClick={handleNextLevel}
                   className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
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