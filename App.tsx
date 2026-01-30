import React, { useEffect, useMemo } from 'react';
import { GameState } from './types';
import TypingGame from './components/TypingGame';
import Statistics from './components/Statistics';
import { Bot, Trophy, BarChart3, Star, RotateCcw, Sparkles } from 'lucide-react';
import { useGameEngine } from './hooks/useGameEngine';
import MainMenu from './pages/MainMenu';
import { STAGE_COLOR_CLASSES } from './constants';

const App: React.FC = () => {
  const {
    gameState,
    setGameState,
    progress,
    sessionStartProgress,
    scrollToStageId,
    clearScrollToStageId,
    currentStage,
    currentSubLevel,
    gameMode,
    gameContent,
    lastStats,
    previousLevelStats,
    startLevel,
    startPractice,
    startWordSentencePractice,
    handleFinish,
    handleBackToMenu,
    handleRetry,
    handleNextLevel,
    debugPassCurrentLevel
  } = useGameEngine();

  // Debug: Tastenkombi zum sofortigen Bestehen des aktuellen Levels (auch aus dem Menü)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.altKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        debugPassCurrentLevel();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [debugPassCurrentLevel]);

  const stageColorClasses = currentStage ? STAGE_COLOR_CLASSES[currentStage.color] ?? STAGE_COLOR_CLASSES.emerald : STAGE_COLOR_CLASSES.emerald;

  const finishedTippsyMessage = useMemo(() => {
    if (!lastStats || !previousLevelStats) return null;
    const wpmDiff = lastStats.wpm - previousLevelStats.wpm;
    const accDiff = lastStats.accuracy - previousLevelStats.accuracy;
    if (wpmDiff > 0 && accDiff >= 0) return 'Du warst schneller als beim letzten Mal – super!';
    if (wpmDiff > 0) return 'Deine Geschwindigkeit steigt! Beim nächsten Mal noch mehr auf Genauigkeit achten.';
    if (accDiff > 0) return 'Bessere Genauigkeit als letztes Mal – sehr gut!';
    if (lastStats.accuracy === 100) return '100 % Genauigkeit – meisterhaft!';
    return null;
  }, [lastStats, previousLevelStats]);

  useEffect(() => {
    if (gameState !== GameState.FINISHED || !currentStage || !lastStats) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleNextLevel();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        handleBackToMenu();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [gameState, currentStage, lastStats, handleNextLevel, handleBackToMenu]);

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-50 selection:bg-emerald-500/30 font-sans flex flex-col">
      
      {/* Background Gradient Mesh - Warmer Tones */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/20 rounded-full blur-[128px]"></div>
        <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] bg-rose-900/10 rounded-full blur-[150px]"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* MENU STATE (Learning Path) */}
        {gameState === GameState.MENU && (
          <MainMenu
            progress={progress}
            sessionStartProgress={sessionStartProgress}
            gameState={gameState}
            scrollToStageId={scrollToStageId}
            clearScrollToStageId={clearScrollToStageId}
            onStartLevel={startLevel}
            onStartPractice={startPractice}
            onStartWordSentencePractice={startWordSentencePractice}
            onOpenStats={() => setGameState(GameState.STATISTICS)}
          />
        )}

        {/* STATISTICS STATE */}
        {gameState === GameState.STATISTICS && (
          <Statistics progress={progress} onBack={handleBackToMenu} />
        )}

        {/* LOADING STATE */}
        {gameState === GameState.LOADING && (
          <div className="flex-1 flex flex-col items-center justify-center">
             <div className="relative mb-8">
               <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
               <Bot className="w-20 h-20 text-emerald-400 relative z-10 animate-bounce" />
             </div>
             <h2 className="text-3xl font-bold text-white mb-2">
               {gameMode === 'PRACTICE' ? 'Erstelle Mega-Level...' : gameMode === 'WORDS_SENTENCES' ? 'Erstelle Wörter & Sätze…' : currentSubLevel === 5 ? 'Meisterprüfung!' : 'Lektion wird geladen'}
             </h2>
             <p className="text-slate-400 text-lg">
               {gameMode === 'PRACTICE' ? 'Mische Wörter und Übungen für dich.' : gameMode === 'WORDS_SENTENCES' ? 'Echte Wörter und Sätze zum Tippen.' : 'Mach deine Finger bereit!'}
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
               <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${stageColorClasses.gradient} to-blue-500`}></div>
               
               {/* 1. Success: Title + Stage */}
               <div className="text-center mb-6 relative">
                 <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-slate-800 mb-6 border-4 border-slate-700 relative shadow-xl">
                    <Trophy className="w-14 h-14 text-yellow-400" />
                    <Sparkles className="w-8 h-8 text-yellow-200 absolute -top-2 -right-2 animate-pulse" />
                 </div>
                 <h2 className="text-4xl font-bold text-white mb-2">
                   {gameMode === 'PRACTICE' ? 'Training beendet!' : gameMode === 'WORDS_SENTENCES' ? 'Wörter & Sätze beendet!' : currentSubLevel === 5 ? 'Meisterhaft!' : 'Gut gemacht!'}
                 </h2>
                 <p className="text-slate-400 text-lg">
                   {currentStage.name} • {gameMode === 'PRACTICE' ? 'Freies Üben' : gameMode === 'WORDS_SENTENCES' ? 'Wort & Satz' : (currentSubLevel === 5 ? 'Meisterprüfung' : `Übung ${currentSubLevel}`)}
                 </p>
               </div>

               {/* 2. Optional Tippsy message */}
               {finishedTippsyMessage && (
                 <div className="text-center mb-6 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                   <p className="text-emerald-300 text-sm font-medium">{finishedTippsyMessage}</p>
                 </div>
               )}

               {/* 3. Kennzahlen */}
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
               
               {/* 4. Buttons (Enter = Weiter) */}
               <p className="text-slate-500 text-xs text-center mb-4">Enter = Weiter, Esc = Menü</p>
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
                   {gameMode === 'PRACTICE' || gameMode === 'WORDS_SENTENCES' ? 'Neue Übung' : 'Wiederholen'}
                 </button>
                 <button 
                   onClick={handleNextLevel}
                   className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 transform hover:scale-105"
                 >
                   {gameMode === 'PRACTICE' || gameMode === 'WORDS_SENTENCES' ? 'Noch eine' : 'Weiter'}
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