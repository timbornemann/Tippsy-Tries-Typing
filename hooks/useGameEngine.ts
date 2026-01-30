import { useState, useEffect, useCallback, useMemo } from 'react';
import { GameState, Stage, GameStats, UserProgress, GameMode, SessionRecord } from '../types';
import { getStages } from '../constants';
import { generatePatternLevel } from '../services/patternGenerator';
import { generateWordSentenceLevel } from '../services/wordSentenceGenerator';
import { useSettings } from '../contexts/SettingsContext';
import { useSound } from './useSound';

const SESSION_HISTORY_MAX = 30;

function progressKey(stageId: number, subLevelId: number): string {
  return `${stageId}_${subLevelId}`;
}

/** Unlock logic: returns new { unlockedStageId, unlockedSubLevelId } from previous progress and current level result. */
function computeUnlock(
  prev: UserProgress,
  gameMode: GameMode,
  stage: Stage | null,
  subLevelId: number
): { unlockedStageId: number; unlockedSubLevelId: number } {
  if (gameMode !== 'STANDARD' || !stage) {
    return { unlockedStageId: prev.unlockedStageId, unlockedSubLevelId: prev.unlockedSubLevelId };
  }
  const isCurrentStage = stage.id === prev.unlockedStageId;
  const isCurrentSub = subLevelId === prev.unlockedSubLevelId;
  if (!isCurrentStage || !isCurrentSub) {
    return { unlockedStageId: prev.unlockedStageId, unlockedSubLevelId: prev.unlockedSubLevelId };
  }
  if (subLevelId === 5) {
    return { unlockedStageId: prev.unlockedStageId + 1, unlockedSubLevelId: 1 };
  }
  return { unlockedStageId: prev.unlockedStageId, unlockedSubLevelId: prev.unlockedSubLevelId + 1 };
}

export const useGameEngine = () => {
  const { language, keyboardLayout } = useSettings();
  const { playLevelComplete } = useSound();
  const stages = useMemo(() => getStages(language, keyboardLayout), [language, keyboardLayout]);

  const [gameState, setGameState] = useState<GameState>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('stats') === '1') return GameState.STATISTICS;
      if (params.get('menu') === '1') return GameState.MENU;
    }
    try {
      const hasSeenOnboarding = localStorage.getItem('tippsy_onboarding_seen');
      return hasSeenOnboarding ? GameState.MENU : GameState.START;
    } catch {
      return GameState.START;
    }
  });
  
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem('tippsy_progress');
      const parsed = saved ? JSON.parse(saved) : {};
      return {
        unlockedStageId: parsed.unlockedStageId ?? 1,
        unlockedSubLevelId: parsed.unlockedSubLevelId ?? 1,
        stats: parsed.stats ?? {
          totalCharsTyped: 0,
          totalTimePlayed: 0,
          gamesPlayed: 0,
          highestWpm: 0,
          averageWpm: 0,
          averageAccuracy: 0
        },
        lastSessionByKey: parsed.lastSessionByKey ?? {},
        sessionHistory: parsed.sessionHistory ?? [],
        perStageBest: parsed.perStageBest ?? {},
        errorCountByChar: parsed.errorCountByChar ?? {}
      };
    } catch {
      return {
        unlockedStageId: 1,
        unlockedSubLevelId: 1,
        stats: {
          totalCharsTyped: 0,
          totalTimePlayed: 0,
          gamesPlayed: 0,
          highestWpm: 0,
          averageWpm: 0,
          averageAccuracy: 0
        },
        lastSessionByKey: {},
        sessionHistory: [],
        perStageBest: {},
        errorCountByChar: {}
      };
    }
  });

  // Current Session State
  const [currentStage, setCurrentStage] = useState<Stage | null>(null);
  const [currentSubLevel, setCurrentSubLevel] = useState<number>(1);
  const [gameMode, setGameMode] = useState<GameMode>('STANDARD');
  const [gameContent, setGameContent] = useState<string>('');
  const [lastStats, setLastStats] = useState<GameStats | null>(null);
  /** Previous run for this stage+subLevel (for "compared to last time" on Finished screen). */
  const [previousLevelStats, setPreviousLevelStats] = useState<GameStats | null>(null);

  // Track progress at the start of a session to enable "walking" animation on return
  const [sessionStartProgress, setSessionStartProgress] = useState<UserProgress | null>(null);
  /** When returning to menu, scroll to this stage id (cleared after scroll). */
  const [scrollToStageId, setScrollToStageId] = useState<number | null>(null);

  const clearScrollToStageId = useCallback(() => setScrollToStageId(null), []);

  // URL params for screenshots/demos: ?finished=1 | ?play=1
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('finished') === '1') {
      setCurrentStage(stages[0]);
      setCurrentSubLevel(1);
      setGameMode('STANDARD');
      setLastStats({
        wpm: 42,
        accuracy: 98,
        errors: 2,
        totalChars: 120,
        timeElapsed: 28,
      });
      setGameState(GameState.FINISHED);
    } else if (params.get('loading') === '1') {
      setCurrentStage(stages[0]);
      setCurrentSubLevel(1);
      setGameMode('STANDARD');
      setGameState(GameState.LOADING);
    } else if (params.get('play') === '1') {
      startLevel(stages[0], 1);
    }
  }, [stages]);

  useEffect(() => {
    localStorage.setItem('tippsy_progress', JSON.stringify(progress));
  }, [progress]);

  const handleCompleteTutorial = () => {
    try {
      localStorage.setItem('tippsy_onboarding_seen', '1');
    } catch {}
    setGameState(GameState.MENU);
  };

  const handleEnterTutorial = () => {
    setGameState(GameState.START);
  };

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
    
    let content = generatePatternLevel(stage, subLevelId, language);
    if (typeof content !== 'string' || !content.trim()) {
      content = 'fff jjj fff jjj fff jjj';
    }
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
    let content = generatePatternLevel(stage, 0, language);
    if (typeof content !== 'string' || !content.trim()) {
      content = 'fff jjj fff jjj fff jjj';
    }
    setGameContent(content);
    setGameState(GameState.PLAYING);
  };

  // Start Word/Sentence practice mode
  const startWordSentencePractice = async (stage: Stage) => {
    if (gameState === GameState.MENU) {
      setSessionStartProgress({ ...progress });
    }

    setCurrentStage(stage);
    setCurrentSubLevel(0);
    setGameMode('WORDS_SENTENCES');
    setGameState(GameState.LOADING);

    await new Promise((r) => setTimeout(r, 600));

    let content = generateWordSentenceLevel(stage, language);
    if (typeof content !== 'string' || !content.trim()) {
      content = 'fff jjj fff jjj fff jjj';
    }
    setGameContent(content);
    setGameState(GameState.PLAYING);
  };

  const handleFinish = (gameStats: GameStats) => {
    playLevelComplete();
    setLastStats(gameStats);
    const key = currentStage ? progressKey(currentStage.id, currentSubLevel) : '';
    setPreviousLevelStats(progress.lastSessionByKey?.[key] ?? null);
    setGameState(GameState.FINISHED);
    
    setProgress(prev => {
      const p = prev;
      const s = p.stats;
      const newGamesPlayed = s.gamesPlayed + 1;
      const newAvgWpm = ((s.averageWpm * s.gamesPlayed) + gameStats.wpm) / newGamesPlayed;
      const newAvgAcc = ((s.averageAccuracy * s.gamesPlayed) + gameStats.accuracy) / newGamesPlayed;

      const { unlockedStageId, unlockedSubLevelId } = computeUnlock(p, gameMode, currentStage, currentSubLevel);

      const key = currentStage ? progressKey(currentStage.id, currentSubLevel) : '';
      const lastByKey = { ...(p.lastSessionByKey ?? {}), [key]: gameStats };
      const today = new Date().toISOString().slice(0, 10);
      const sessionRecord: SessionRecord = {
        date: today,
        wpm: gameStats.wpm,
        accuracy: gameStats.accuracy,
        stageId: currentStage?.id,
        subLevelId: currentSubLevel
      };
      const history = [...(p.sessionHistory ?? []), sessionRecord].slice(-SESSION_HISTORY_MAX);

      const perBest = { ...(p.perStageBest ?? {}) };
      if (key) {
        const existing = perBest[key] ?? {};
        perBest[key] = {
          ...existing,
          last: gameStats,
          bestWpm: Math.max(existing.bestWpm ?? 0, gameStats.wpm),
          bestAccuracy: Math.max(existing.bestAccuracy ?? 0, gameStats.accuracy)
        };
      }

      const mergedErrors: Record<string, number> = { ...(p.errorCountByChar ?? {}) };
      if (gameStats.errorCountByChar) {
        for (const [char, count] of Object.entries(gameStats.errorCountByChar)) {
          mergedErrors[char] = (mergedErrors[char] ?? 0) + count;
        }
      }

      return {
        ...p,
        unlockedStageId,
        unlockedSubLevelId,
        stats: {
          totalCharsTyped: s.totalCharsTyped + gameStats.totalChars,
          totalTimePlayed: s.totalTimePlayed + gameStats.timeElapsed,
          gamesPlayed: newGamesPlayed,
          highestWpm: Math.max(s.highestWpm, gameStats.wpm),
          averageWpm: newAvgWpm,
          averageAccuracy: newAvgAcc
        },
        lastSessionByKey: lastByKey,
        sessionHistory: history,
        perStageBest: perBest,
        errorCountByChar: mergedErrors
      };
    });
  };

  const handleBackToMenu = () => {
    const stageId = currentStage?.id ?? null;
    setScrollToStageId(stageId);
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
      startPractice(currentStage);
    } else if (gameMode === 'WORDS_SENTENCES') {
      startWordSentencePractice(currentStage);
    } else {
      startLevel(currentStage, currentSubLevel);
    }
  };

  const handleNextLevel = () => {
    if (!currentStage) return;

    if (gameMode === 'PRACTICE') {
      startPractice(currentStage);
      return;
    }
    if (gameMode === 'WORDS_SENTENCES') {
      startWordSentencePractice(currentStage);
      return;
    }

    if (currentSubLevel < 5) {
      startLevel(currentStage, currentSubLevel + 1);
    } else {
      // Find next stage
      const nextStage = stages.find(s => s.id === currentStage.id + 1);
      if (nextStage) {
        startLevel(nextStage, 1);
      } else {
        // End of all content
        handleBackToMenu();
      }
    }
  };

  /** Debug: advance unlocked progress by one level (as if current level was passed). Works from menu too. */
  const debugPassCurrentLevel = useCallback(() => {
    setProgress(prev => {
      const { unlockedStageId, unlockedSubLevelId } = prev;
      if (unlockedSubLevelId < 5) {
        return { ...prev, unlockedSubLevelId: unlockedSubLevelId + 1 };
      }
      const nextStage = stages.find(s => s.id === unlockedStageId + 1);
      if (nextStage) {
        return { ...prev, unlockedStageId: nextStage.id, unlockedSubLevelId: 1 };
      }
      return prev;
    });
  }, []);

  return {
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
    handleCompleteTutorial,
    handleEnterTutorial,
    debugPassCurrentLevel,
    stages
  };
};
