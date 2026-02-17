import React, { useEffect, useMemo, useState } from 'react';
import { GameState } from './types';
import TypingGame from './components/TypingGame';
import Statistics from './components/Statistics';
import StartScreen from './components/StartScreen';
import SetupScreen from './components/SetupScreen';
import { Bot, Trophy, BarChart3, Star, RotateCcw, Sparkles, Type, Clock } from 'lucide-react';
import { useGameEngine } from './hooks/useGameEngine';
import MainMenu from './pages/MainMenu';
import { MAX_SUB_LEVELS, STAGE_COLOR_CLASSES } from './constants';
import { useI18n } from './hooks/useI18n';
import Settings from './pages/Settings';

const App: React.FC = () => {
  const { t, language } = useI18n();
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
    saveSessionStats,
    handleBackToMenu,
    handleRetry,
    handleNextLevel,
    handleCompleteTutorial,
    handleEnterTutorial,
    debugPassCurrentLevel,
    stages
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

  // When entering START (first time or "Tutorial"), show setup (language + keyboard) first, then tutorial
  const [startPhase, setStartPhase] = useState<'setup' | 'tutorial'>('setup');
  useEffect(() => {
    if (gameState === GameState.START) setStartPhase('setup');
  }, [gameState]);

  const stageColorClasses = currentStage ? STAGE_COLOR_CLASSES[currentStage.color] ?? STAGE_COLOR_CLASSES.emerald : STAGE_COLOR_CLASSES.emerald;

  const finishedTippsyMessage = useMemo(() => {
    if (!lastStats || !previousLevelStats) return null;
    const wpmDiff = lastStats.wpm - previousLevelStats.wpm;
    const accDiff = lastStats.accuracy - previousLevelStats.accuracy;
    if (wpmDiff > 0 && accDiff >= 0) return t('app.finishedTippsy.fasterAccurate');
    if (wpmDiff > 0) return t('app.finishedTippsy.faster');
    if (accDiff > 0) return t('app.finishedTippsy.accurate');
    if (lastStats.accuracy === 100) return t('app.finishedTippsy.perfect');
    return null;
  }, [lastStats, previousLevelStats, t]);

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
        
        {/* START: First setup (language + keyboard), then onboarding/tutorial */}
        {gameState === GameState.START && startPhase === 'setup' && (
          <SetupScreen onComplete={() => setStartPhase('tutorial')} />
        )}
        {gameState === GameState.START && startPhase === 'tutorial' && (
          <StartScreen 
            onComplete={handleCompleteTutorial} 
            onBackToSetup={() => setStartPhase('setup')}
          />
        )}

        {/* MENU STATE (Learning Path) */}
        {gameState === GameState.MENU && (
          <MainMenu
            stages={stages}
            progress={progress}
            sessionStartProgress={sessionStartProgress}
            gameState={gameState}
            scrollToStageId={scrollToStageId}
            clearScrollToStageId={clearScrollToStageId}
            onStartLevel={startLevel}
            onStartPractice={startPractice}
            onStartWordSentencePractice={startWordSentencePractice}
            onOpenStats={() => setGameState(GameState.STATISTICS)}
            onStartTutorial={handleEnterTutorial}
            onOpenSettings={() => setGameState(GameState.SETTINGS)}
          />
        )}

        {/* STATISTICS STATE */}
        {gameState === GameState.STATISTICS && (
          <Statistics stages={stages} progress={progress} onBack={handleBackToMenu} />
        )}

        {gameState === GameState.SETTINGS && (
          <Settings onBack={handleBackToMenu} />
        )}

        {/* LOADING STATE */}
        {gameState === GameState.LOADING && (
          <div className="flex-1 flex flex-col items-center justify-center">
             <div className="relative mb-8">
               <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
               <Bot className="w-20 h-20 text-emerald-400 relative z-10 animate-bounce" />
             </div>
             <h2 className="text-3xl font-bold text-white mb-2">
               {gameMode === 'PRACTICE'
                 ? t('app.loading.practiceTitle')
                 : gameMode === 'WORDS_SENTENCES'
                   ? t('app.loading.wordTitle')
                   : currentSubLevel === MAX_SUB_LEVELS
                     ? t('app.loading.masterTitle')
                     : t('app.loading.defaultTitle')}
             </h2>
             <p className="text-slate-400 text-lg">
               {gameMode === 'PRACTICE'
                 ? t('app.loading.practiceBody')
                 : gameMode === 'WORDS_SENTENCES'
                   ? t('app.loading.wordBody')
                   : t('app.loading.defaultBody')}
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
            onSaveStats={saveSessionStats}
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
                   {gameMode === 'PRACTICE'
                     ? t('app.finished.titlePractice')
                     : gameMode === 'WORDS_SENTENCES'
                       ? t('app.finished.titleWords')
                       : currentSubLevel === MAX_SUB_LEVELS
                         ? t('app.finished.titleMaster')
                         : t('app.finished.titleDefault')}
                 </h2>
                 <p className="text-slate-400 text-lg">
                   {currentStage.name} • {gameMode === 'PRACTICE'
                     ? t('app.finished.modePractice')
                     : gameMode === 'WORDS_SENTENCES'
                       ? t('app.finished.modeWords')
                       : (currentSubLevel === MAX_SUB_LEVELS ? t('app.finished.modeMaster') : t('app.finished.modeExercise', { subLevel: currentSubLevel }))}
                 </p>
               </div>

               {/* 2. Optional Tippsy message */}
               {finishedTippsyMessage && (
                 <div className="text-center mb-6 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                   <p className="text-emerald-300 text-sm font-medium">{finishedTippsyMessage}</p>
                 </div>
               )}

               {/* 3. Kennzahlen */}
               {(() => {
                 const timeStr = lastStats.timeElapsed >= 60
                   ? `${Math.floor(lastStats.timeElapsed / 60)} min ${Math.round(lastStats.timeElapsed % 60)} s`
                   : `${Math.round(lastStats.timeElapsed)} s`;
                 const charsPerSec = lastStats.timeElapsed > 0
                   ? (lastStats.totalChars / lastStats.timeElapsed).toFixed(1)
                   : '0';
                 const locale = language === 'de' ? 'de-DE' : 'en-US';
                 return (
                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
                     <div className="bg-slate-800/50 p-5 rounded-2xl text-center border border-slate-700/50">
                       <BarChart3 className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                       <div className="text-3xl font-bold text-white font-mono">{lastStats.wpm}</div>
                       <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">{t('app.finished.stats.wpm')}</div>
                     </div>
                     <div className="bg-slate-800/50 p-5 rounded-2xl text-center border border-slate-700/50">
                       <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                       <div className="text-3xl font-bold text-white font-mono">{lastStats.accuracy}%</div>
                       <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">{t('app.finished.stats.accuracy')}</div>
                     </div>
                     <div className="bg-slate-800/50 p-5 rounded-2xl text-center border border-slate-700/50">
                       <div className={`text-3xl font-bold font-mono mt-8 ${lastStats.errors === 0 ? 'text-emerald-400' : 'text-white'}`}>{lastStats.errors}</div>
                       <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">{t('app.finished.stats.errors')}</div>
                     </div>
                     <div className="bg-slate-800/50 p-5 rounded-2xl text-center border border-slate-700/50">
                       <Clock className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                       <div className="text-3xl font-bold text-white font-mono">{timeStr}</div>
                       <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">{t('app.finished.stats.time')}</div>
                     </div>
                     <div className="bg-slate-800/50 p-5 rounded-2xl text-center border border-slate-700/50">
                       <Type className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                       <div className="text-3xl font-bold text-white font-mono">{lastStats.totalChars.toLocaleString(locale)}</div>
                       <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">{t('app.finished.stats.charsTyped')}</div>
                     </div>
                     <div className="bg-slate-800/50 p-5 rounded-2xl text-center border border-slate-700/50">
                       <div className="text-3xl font-bold text-white font-mono mt-8">{charsPerSec}</div>
                       <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">{t('app.finished.stats.charsPerSec')}</div>
                     </div>
                   </div>
                 );
               })()}

               {/* 4. Buttons (Enter = Weiter) */}
               <p className="text-slate-500 text-xs text-center mb-4">{t('app.finished.shortcuts')}</p>
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <button 
                   onClick={handleBackToMenu}
                   className="px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all border border-slate-700"
                 >
                   {t('app.finished.buttons.menu')}
                 </button>
                 <button 
                   onClick={handleRetry}
                   className="px-8 py-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold transition-all flex items-center justify-center gap-2 border border-slate-600"
                 >
                   <RotateCcw className="w-5 h-5" />
                   {gameMode === 'PRACTICE' || gameMode === 'WORDS_SENTENCES'
                     ? t('app.finished.buttons.retryPractice')
                     : t('app.finished.buttons.retryStandard')}
                 </button>
                 <button 
                   onClick={handleNextLevel}
                   className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 transform hover:scale-105"
                 >
                   {gameMode === 'PRACTICE' || gameMode === 'WORDS_SENTENCES'
                     ? t('app.finished.buttons.nextPractice')
                     : t('app.finished.buttons.nextStandard')}
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
