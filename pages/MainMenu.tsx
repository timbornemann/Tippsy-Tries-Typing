import React, { useState, useEffect, useCallback } from 'react';
import { GameState, UserProgress, Stage } from '../types';
import { Keyboard, User, X, Info, Settings as SettingsIcon } from 'lucide-react';
import Mascot from '../components/Mascot';
import StageCard from '../components/StageCard';
import OnboardingModal from '../components/OnboardingModal';
import { useI18n } from '../hooks/useI18n';
import { useSound } from '../hooks/useSound';
import { ENDLESS_STAGE_ID, MAX_SUB_LEVELS } from '../constants';

const ONBOARDING_KEY = 'tippsy_onboarding_seen';
const STORAGE_HINT_KEY = 'tippsy_storage_hint_seen';

interface MainMenuProps {
  stages: Stage[];
  progress: UserProgress;
  sessionStartProgress: UserProgress | null;
  gameState: GameState;
  scrollToStageId: number | null;
  clearScrollToStageId: () => void;
  onStartLevel: (s: Stage, l: number) => void;
  onStartPractice: (s: Stage) => void;
  onStartWordSentencePractice: (s: Stage) => void;
  onOpenStats: () => void;
  onStartTutorial: () => void;
  onOpenSettings: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({
  stages,
  progress,
  sessionStartProgress,
  gameState,
  scrollToStageId,
  clearScrollToStageId,
  onStartLevel,
  onStartPractice,
  onStartWordSentencePractice,
  onOpenStats,
  onStartTutorial,
  onOpenSettings
}) => {
  const { t, language } = useI18n();
  const { playMenuClick } = useSound();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showStorageHint, setShowStorageHint] = useState(false);

  // Keyboard Navigation State
  const [focusedStageId, setFocusedStageId] = useState<number>(progress.unlockedStageId);
  const [focusedSubLevelId, setFocusedSubLevelId] = useState<number>(progress.unlockedSubLevelId);

  // Sync focus with progress on initial load or progress update
  useEffect(() => {
    // Only update if we are not actively navigating (optional heuristic, or just sync when progress changes significantly)
    // For now, let's trust manual navigation but init correctly
  }, []);

  // Keyboard Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if modal is open (simple check)
      if (showOnboarding) return;

      const key = e.key.toLowerCase();

      const maxSubLevelForStage = (stageId: number) => (stageId === ENDLESS_STAGE_ID ? 1 : MAX_SUB_LEVELS);
      const effectiveMaxSubLevel = (stageId: number) => {
        if (stageId > progress.unlockedStageId) return 1;
        if (stageId < progress.unlockedStageId) return maxSubLevelForStage(stageId);
        return Math.min(progress.unlockedSubLevelId, maxSubLevelForStage(stageId));
      };

      // W/S and Arrow Up/Down: direct stage jump (next/prev stage, sublevel 1)
      if (key === 'arrowdown' || key === 's') {
        e.preventDefault();
        playMenuClick();
        setFocusedStageId(prev => Math.min(prev + 1, stages.length));
        setFocusedSubLevelId(1);
      } else if (key === 'arrowup' || key === 'w') {
        e.preventDefault();
        playMenuClick();
        setFocusedStageId(prev => Math.max(prev - 1, 1));
        setFocusedSubLevelId(1);
      }
      // A/D and Arrow Left/Right: first move within levels (1–10), only at last/first level jump to next/prev stage
      else if (key === 'arrowright' || key === 'd') {
        e.preventDefault();
        playMenuClick();
        const maxSub = effectiveMaxSubLevel(focusedStageId);
        if (focusedSubLevelId < maxSub) {
          setFocusedSubLevelId(prev => Math.min(prev + 1, maxSub));
        } else {
          setFocusedStageId(prev => Math.min(prev + 1, stages.length));
          setFocusedSubLevelId(1);
        }
      } else if (key === 'arrowleft' || key === 'a') {
        e.preventDefault();
        playMenuClick();
        if (focusedSubLevelId > 1) {
          setFocusedSubLevelId(prev => prev - 1);
        } else {
          const prevStageId = Math.max(focusedStageId - 1, 1);
          setFocusedStageId(prevStageId);
          setFocusedSubLevelId(effectiveMaxSubLevel(prevStageId));
        }
      }
      // ENTER ACTION
      else if (key === 'enter') {
        e.preventDefault();
        const stage = stages.find(s => s.id === focusedStageId);
        if (stage) {
            // Check if actually unlocked
            // Stage unlock check
            if (focusedStageId > progress.unlockedStageId) return; // Locked stage
            
            // Sublevel unlock check (double verification)
            if (focusedStageId === progress.unlockedStageId && focusedSubLevelId > progress.unlockedSubLevelId) return;

            playMenuClick();
            onStartLevel(stage, focusedSubLevelId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedStageId, focusedSubLevelId, progress, showOnboarding, onStartLevel, stages, playMenuClick]);

  // Auto-scroll to Focused Stage (horizontal)
  useEffect(() => {
    const el = document.querySelector(`[data-stage-id="${focusedStageId}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [focusedStageId]);

  // Beim Zurückkehren ins Menü zur zuletzt verlassenen Stage scrollen (Overrides focus initially)
  useEffect(() => {
    if (scrollToStageId == null) return;
    setFocusedStageId(scrollToStageId); // Sync focus
    // clearScrollToStageId handled by scrollIntoView effect ideally, or explicitly here
    const timer = requestAnimationFrame(() => {
      // let the auto-scroll effect handle it
      clearScrollToStageId();
    });
    return () => cancelAnimationFrame(timer);
  }, [scrollToStageId, clearScrollToStageId]);

  useEffect(() => {
    try {
      if (progress.stats.gamesPlayed === 0 && !localStorage.getItem(ONBOARDING_KEY)) {
        setShowOnboarding(true);
      }
      if (!localStorage.getItem(STORAGE_HINT_KEY)) {
        setShowStorageHint(true);
      }
    } catch {
      setShowOnboarding(progress.stats.gamesPlayed === 0);
    }
  }, [progress.stats.gamesPlayed]);

  const dismissOnboarding = () => {
    setShowOnboarding(false);
    try {
      localStorage.setItem(ONBOARDING_KEY, '1');
    } catch {}
  };

  const dismissStorageHint = () => {
    setShowStorageHint(false);
    try {
      localStorage.setItem(STORAGE_HINT_KEY, '1');
    } catch {}
  };

  const handleStartLevel = useCallback((s: Stage, l: number) => {
    playMenuClick();
    onStartLevel(s, l);
  }, [playMenuClick, onStartLevel]);

  const handleStartPractice = useCallback((s: Stage) => {
    playMenuClick();
    onStartPractice(s);
  }, [playMenuClick, onStartPractice]);

  const handleStartWordSentencePractice = useCallback((s: Stage) => {
    playMenuClick();
    onStartWordSentencePractice(s);
  }, [playMenuClick, onStartWordSentencePractice]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header className="shrink-0 py-6 px-6 text-center sticky top-0 z-50 bg-[#0a0f1c]/80 backdrop-blur-xl border-b border-slate-800/60 shadow-lg flex justify-between items-center">
        
        <div 
          onClick={() => { playMenuClick(); onStartTutorial(); }}
          className="inline-flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity group"
          title={t('menu.openTutorialTitle')}
        >
          <div className="bg-gradient-to-tr from-emerald-500 to-blue-500 p-2 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
              <img src="/logo.svg" alt="Tippsy Logo" className="w-6 h-6 object-contain" />
          </div>
          <div className="text-left">
            <h1 className="text-xl font-extrabold tracking-tight text-white">
              Tippsy
            </h1>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">{t('menu.adventure')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { playMenuClick(); onOpenSettings(); }}
            className="group flex items-center gap-2 px-3 py-2 rounded-full bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white transition-all border border-slate-700/50"
            title={t('menu.settings')}
            aria-label={t('menu.settings')}
          >
            <SettingsIcon size={18} />
          </button>
          <button 
            data-testid="open-stats"
            onClick={() => { playMenuClick(); onOpenStats(); }}
            className="group flex items-center gap-3 px-4 py-2 rounded-full bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white transition-all border border-slate-700/50"
            title={t('menu.statsTitle')}
          >
            <div className="text-right hidden sm:block">
              <p className="text-[10px] uppercase text-slate-500 font-bold">{t('menu.profileLabel')}</p>
              <p className="text-xs font-mono font-bold">{progress.stats.totalCharsTyped.toLocaleString(language === 'de' ? 'de-DE' : 'en-US')} {t('menu.characters')}</p>
            </div>
            <div className="p-2 bg-slate-700 rounded-full group-hover:bg-slate-600 transition-colors">
              <User size={20} />
            </div>
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col min-h-0 container mx-auto px-4 py-4 max-w-[1600px]">
        {showOnboarding && (
          <OnboardingModal onDismiss={dismissOnboarding} />
        )}

        {showStorageHint && (
          <div className="mb-4 shrink-0 p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-3">
            <Info size={20} className="text-slate-400 shrink-0" />
            <p className="text-slate-400 text-sm flex-1">
              {t('menu.storageHint')}
            </p>
            <button onClick={dismissStorageHint} className="p-1 rounded hover:bg-slate-700 text-slate-500 hover:text-white shrink-0" aria-label={t('menu.close')}>
              <X size={16} />
            </button>
          </div>
        )}

        <div className="shrink-0">
          <Mascot progress={progress} gameState={gameState} />
        </div>

        <div className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden scroll-smooth -mx-4 pl-4 pr-12">
          <div className="flex flex-row flex-nowrap gap-8 py-4">
            {stages.map((stage) => (
              <div key={stage.id} className="w-[680px] h-[580px] shrink-0 overflow-visible flex">
                <StageCard
                  stage={stage}
                  progress={progress}
                  sessionStartProgress={sessionStartProgress}
                  onStartLevel={handleStartLevel}
                  onStartPractice={handleStartPractice}
                  onStartWordSentencePractice={handleStartWordSentencePractice}
                  isStageFocused={focusedStageId === stage.id}
                  focusedSubLevelId={focusedStageId === stage.id ? focusedSubLevelId : null}
                />
              </div>
            ))}
            {/* Spacer so last card halo/shadow is not clipped when scrolled to end */}
            <div className="shrink-0 w-48" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
