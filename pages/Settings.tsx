import React, { useEffect, useRef } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useI18n } from '../hooks/useI18n';
import { useSound } from '../hooks/useSound';
import { Home, Download, Upload, Trash2, Info } from 'lucide-react';
import { UserProgress } from '../types';
import { MAX_SUB_LEVELS } from '../constants';

const PROGRESS_STORAGE_KEY = 'tippsy_progress';

/** Validate and normalize parsed JSON to UserProgress; return null if invalid. */
function parseProgressJson(raw: unknown): UserProgress | null {
  if (!raw || typeof raw !== 'object') return null;
  const p = raw as Record<string, unknown>;
  const us = typeof p.unlockedStageId === 'number' ? p.unlockedStageId : null;
  const ul = typeof p.unlockedSubLevelId === 'number' ? p.unlockedSubLevelId : null;
  if (us == null || ul == null) return null;
  const st = p.stats && typeof p.stats === 'object' ? (p.stats as Record<string, unknown>) : null;
  if (!st) return null;
  const totalCharsTyped = typeof st.totalCharsTyped === 'number' ? st.totalCharsTyped : 0;
  const totalTimePlayed = typeof st.totalTimePlayed === 'number' ? st.totalTimePlayed : 0;
  const gamesPlayed = typeof st.gamesPlayed === 'number' ? st.gamesPlayed : 0;
  const highestWpm = typeof st.highestWpm === 'number' ? st.highestWpm : 0;
  const averageWpm = typeof st.averageWpm === 'number' ? st.averageWpm : 0;
  const averageAccuracy = typeof st.averageAccuracy === 'number' ? st.averageAccuracy : 0;
  const stats = { totalCharsTyped, totalTimePlayed, gamesPlayed, highestWpm, averageWpm, averageAccuracy };
  const lastSessionByKey = p.lastSessionByKey && typeof p.lastSessionByKey === 'object' ? (p.lastSessionByKey as Record<string, unknown>) : {};
  const sessionHistory = Array.isArray(p.sessionHistory) ? p.sessionHistory : [];
  const perStageBest = p.perStageBest && typeof p.perStageBest === 'object' ? (p.perStageBest as Record<string, unknown>) : {};
  const errorCountByChar = p.errorCountByChar && typeof p.errorCountByChar === 'object' ? (p.errorCountByChar as Record<string, number>) : {};
  return {
    unlockedStageId: Math.max(1, Math.floor(us)),
    unlockedSubLevelId: Math.max(1, Math.min(MAX_SUB_LEVELS, Math.floor(ul))),
    stats,
    lastSessionByKey,
    sessionHistory,
    perStageBest,
    errorCountByChar
  };
}

interface SettingsProps {
  onBack: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  const { language, keyboardLayout, soundEnabled, setLanguage, setKeyboardLayout, setSoundEnabled } = useSettings();
  const { t } = useI18n();
  const { playMenuClick } = useSound();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    playMenuClick();
    try {
      const json = localStorage.getItem(PROGRESS_STORAGE_KEY) ?? '{}';
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tippsy-progress.json';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    }
  };

  const handleImportClick = () => {
    playMenuClick();
    fileInputRef.current?.click();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const raw = JSON.parse(reader.result as string);
        const progress = parseProgressJson(raw);
        if (!progress) {
          alert(t('settings.importError'));
          return;
        }
        localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
        window.location.reload();
      } catch {
        alert(t('settings.importError'));
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    playMenuClick();
    if (!window.confirm(t('settings.resetConfirm'))) return;
    try {
      localStorage.removeItem(PROGRESS_STORAGE_KEY);
      window.location.reload();
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        playMenuClick();
        onBack();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onBack, playMenuClick]);

  return (
    <div className="flex-1 container mx-auto px-4 py-8 max-w-3xl flex flex-col h-full">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => { playMenuClick(); onBack(); }} className="p-3 hover:bg-slate-800 rounded-full transition-colors group" title={t('settings.back')}>
          <Home size={24} className="text-slate-400 group-hover:text-white" />
        </button>
        <h1 className="text-3xl font-bold text-white">{t('settings.title')}</h1>
      </div>
      <p className="text-slate-500 text-xs mb-8">{t('statistics.escHint')}</p>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-bold text-white mb-2">{t('settings.language')}</h2>
        <p className="text-slate-400 text-sm mb-6">{t('settings.languageHint')}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setLanguage('en')}
            className={`px-4 py-3 rounded-xl border transition-all text-left ${language === 'en' ? 'border-emerald-500 bg-emerald-500/10 text-white' : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            <div className="font-bold">{t('settings.english')}</div>
            <div className="text-xs text-slate-400">English</div>
          </button>
          <button
            onClick={() => setLanguage('de')}
            className={`px-4 py-3 rounded-xl border transition-all text-left ${language === 'de' ? 'border-emerald-500 bg-emerald-500/10 text-white' : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            <div className="font-bold">{t('settings.german')}</div>
            <div className="text-xs text-slate-400">Deutsch</div>
          </button>
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-bold text-white mb-2">{t('settings.keyboard')}</h2>
        <p className="text-slate-400 text-sm mb-6">{t('settings.keyboardHint')}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setKeyboardLayout('qwerty')}
            className={`px-4 py-3 rounded-xl border transition-all text-left ${keyboardLayout === 'qwerty' ? 'border-emerald-500 bg-emerald-500/10 text-white' : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            <div className="font-bold">{t('settings.qwerty')}</div>
            <div className="text-xs text-slate-400">QWERTY</div>
          </button>
          <button
            onClick={() => setKeyboardLayout('qwertz')}
            className={`px-4 py-3 rounded-xl border transition-all text-left ${keyboardLayout === 'qwertz' ? 'border-emerald-500 bg-emerald-500/10 text-white' : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            <div className="font-bold">{t('settings.qwertz')}</div>
            <div className="text-xs text-slate-400">QWERTZ</div>
          </button>
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-bold text-white mb-2">{t('settings.sound')}</h2>
        <p className="text-slate-400 text-sm mb-6">{t('settings.soundHint')}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setSoundEnabled(true)}
            className={`px-4 py-3 rounded-xl border transition-all text-left ${soundEnabled ? 'border-emerald-500 bg-emerald-500/10 text-white' : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            <div className="font-bold">{t('settings.soundOn')}</div>
            <div className="text-xs text-slate-400">{t('settings.sound')}</div>
          </button>
          <button
            onClick={() => setSoundEnabled(false)}
            className={`px-4 py-3 rounded-xl border transition-all text-left ${!soundEnabled ? 'border-emerald-500 bg-emerald-500/10 text-white' : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            <div className="font-bold">{t('settings.soundOff')}</div>
            <div className="text-xs text-slate-400">{t('settings.sound')}</div>
          </button>
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-2">{t('settings.data')}</h2>
        <p className="text-slate-400 text-sm mb-6">{t('settings.exportHint')}</p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
          >
            <Download size={18} />
            <span>{t('settings.export')}</span>
          </button>
          <button
            onClick={handleImportClick}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
          >
            <Upload size={18} />
            <span>{t('settings.import')}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleImportFile}
          />
        </div>
        <p className="text-slate-500 text-xs mt-4">{t('settings.importHint')}</p>
        <hr className="border-slate-700 my-6" />
        <p className="text-slate-400 text-sm mb-3">{t('settings.resetHint')}</p>
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-red-900/50 bg-red-950/30 text-red-300 hover:bg-red-900/30 transition-all"
        >
          <Trash2 size={18} />
          <span>{t('settings.reset')}</span>
        </button>
      </div>

      <div className="mt-8 p-4 rounded-xl bg-slate-800/60 border border-slate-700 flex gap-3">
        <Info size={20} className="text-slate-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-slate-300 text-sm font-medium mb-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-700 font-mono text-xs">{t('settings.skipLevelShortcut')}</kbd>
          </p>
          <p className="text-slate-500 text-xs">{t('settings.skipLevelHint')}</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
