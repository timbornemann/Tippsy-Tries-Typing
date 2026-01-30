import { useState, useEffect } from 'react';
import { GameState, Stage, GameStats, UserProgress, GameMode } from '../types';
import { STAGES } from '../constants';
import { generatePatternLevel } from '../services/patternGenerator';

export const useGameEngine = () => {
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

  // Track progress at the start of a session to enable "walking" animation on return
  const [sessionStartProgress, setSessionStartProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    localStorage.setItem('tippmeister_progress', JSON.stringify(progress));
  }, [progress]);

  // Start a standard level (1-5) using the Pattern Generator
  const startLevel = async (stage: Stage, subLevelId: number) => {
    // If we are starting from the Menu, this is the start of a "Session" (or chain)
    // We capture the progress state here so we can animate from this point when we return.
    if (gameState === GameState.MENU) {
        setSessionStartProgress({ ...progress });
    }

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

  // Start Practice Mode using the Pattern Generator (Case 0)
  const startPractice = async (stage: Stage) => {
    if (gameState === GameState.MENU) {
        setSessionStartProgress({ ...progress });
    }

    setCurrentStage(stage);
    setCurrentSubLevel(0); // 0 indicates practice/no specific level
    setGameMode('PRACTICE');
    setGameState(GameState.LOADING);
    
    // Small delay for UI feedback
    await new Promise(r => setTimeout(r, 600));

    // Use Case 0 (Mega Level) instead of AI
    const content = generatePatternLevel(stage, 0);
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

    // Note: We do NOT reset sessionStartProgress here immediately. 
    // We want the UI to read it, animate, and THEN maybe reset it?
    // Actually, if we reset it here, MainMenu won't see the "diff".
    // Strategy: MainMenu will use sessionStartProgress vs progress.
    // If they differ, it animates.
    // We can clear sessionStartProgress purely when starting a new "chain" or just leave it. 
    // Actually, better: if we return to menu, we might wan to reset it AFTER delay.
    // For now, let's keep it simplest: It updates when you start a level if null. 
    // But if we just finished a level, progress > sessionStartProgress.
    // So animation happens.
    // Ideally we reset it when the animation is "consumed".
    // Extended to 4s to ensure StageCard animation (approx 3s) completes fully.
    setTimeout(() => {
        setSessionStartProgress(null);
    }, 4000);
  };

  const handleRetry = () => {
    if (!currentStage) return;
    
    if (gameMode === 'PRACTICE') {
      startPractice(currentStage); // Generates new random text
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

  return {
    gameState,
    setGameState,
    progress,
    sessionStartProgress, // Export this
    currentStage,
    currentSubLevel,
    gameMode,
    gameContent,
    lastStats,
    startLevel,
    startPractice,
    handleFinish,
    handleBackToMenu,
    handleRetry,
    handleNextLevel
  };
};
