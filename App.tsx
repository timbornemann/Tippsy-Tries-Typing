import React, { useState } from 'react';
import { GameState, Level, GameStats } from './types';
import { LEVELS } from './constants';
import { generateLevelContent } from './services/geminiService';
import TypingGame from './components/TypingGame';
import { Keyboard, Play, Trophy, BarChart3, Star, Loader2, RotateCcw } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [gameContent, setGameContent] = useState<string>('');
  const [lastStats, setLastStats] = useState<GameStats | null>(null);

  const startLevel = async (level: Level) => {
    setCurrentLevel(level);
    setGameState(GameState.LOADING);
    const content = await generateLevelContent(level);
    setGameContent(content);
    setGameState(GameState.PLAYING);
  };

  const handleFinish = (stats: GameStats) => {
    setLastStats(stats);
    setGameState(GameState.FINISHED);
  };

  const handleBackToMenu = () => {
    setGameState(GameState.MENU);
    setCurrentLevel(null);
  };

  const handleRetry = () => {
    if (currentLevel) {
      startLevel(currentLevel);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-emerald-500/30">
      
      {/* Background Gradient Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-900/20 rounded-full blur-[128px]"></div>
      </div>

      <div className="relative z-10">
        
        {/* MENU STATE */}
        {gameState === GameState.MENU && (
          <div className="container mx-auto px-4 py-12 max-w-6xl">
            <header className="text-center mb-16 space-y-4">
              <div className="inline-flex items-center justify-center p-4 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 mb-4">
                <Keyboard className="w-12 h-12 text-emerald-400 mr-4" />
                <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                  TippMeister
                </h1>
              </div>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Lerne das 10-Finger-System spielerisch. Wähle ein Level und verbessere deine Geschwindigkeit und Präzision.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {LEVELS.map((level) => (
                <button
                  key={level.id}
                  onClick={() => startLevel(level)}
                  className="group relative flex flex-col items-start p-6 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl text-left"
                >
                  <div className="flex items-center justify-between w-full mb-4">
                    <span className="px-3 py-1 text-xs font-bold text-emerald-300 bg-emerald-950/50 border border-emerald-900 rounded-full">
                      LEVEL {level.id}
                    </span>
                    <Play className="w-5 h-5 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                    {level.name}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {level.description}
                  </p>
                  
                  {/* Decorative Key Preview */}
                  <div className="mt-6 flex flex-wrap gap-1">
                     {level.chars.slice(0, 5).map((char, i) => (
                       <span key={i} className="w-6 h-6 flex items-center justify-center text-[10px] font-mono bg-slate-800 rounded border-b border-slate-700 text-slate-300 uppercase">
                         {char === ' ' ? '␣' : char}
                       </span>
                     ))}
                     {level.chars.length > 5 && <span className="text-slate-600 text-xs self-center">...</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* LOADING STATE */}
        {gameState === GameState.LOADING && (
          <div className="flex flex-col items-center justify-center min-h-screen">
             <Loader2 className="w-16 h-16 text-emerald-500 animate-spin mb-6" />
             <h2 className="text-2xl font-bold text-white mb-2">Übung wird erstellt...</h2>
             <p className="text-slate-400">Unsere KI bereitet den perfekten Text für dich vor.</p>
          </div>
        )}

        {/* PLAYING STATE */}
        {gameState === GameState.PLAYING && currentLevel && (
          <TypingGame 
            level={currentLevel}
            content={gameContent}
            onFinish={handleFinish}
            onBack={handleBackToMenu}
            onRetry={handleRetry}
          />
        )}

        {/* FINISHED STATE */}
        {gameState === GameState.FINISHED && lastStats && (
          <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden">
               {/* Background Glow */}
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500"></div>
               
               <div className="text-center mb-10">
                 <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800 mb-6 border border-slate-700">
                    <Trophy className="w-10 h-10 text-yellow-400" />
                 </div>
                 <h2 className="text-4xl font-bold text-white mb-2">Klasse gemacht!</h2>
                 <p className="text-slate-400">Level {currentLevel?.id}: {currentLevel?.name} abgeschlossen.</p>
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

               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <button 
                   onClick={handleBackToMenu}
                   className="px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all"
                 >
                   Menü
                 </button>
                 <button 
                   onClick={handleRetry}
                   className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                 >
                   <RotateCcw className="w-5 h-5" />
                   Nochmal üben
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