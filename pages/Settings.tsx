import React, { useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useI18n } from '../hooks/useI18n';
import { Home } from 'lucide-react';

interface SettingsProps {
  onBack: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  const { language, keyboardLayout, setLanguage, setKeyboardLayout } = useSettings();
  const { t } = useI18n();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onBack();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onBack]);

  return (
    <div className="flex-1 container mx-auto px-4 py-8 max-w-3xl flex flex-col h-full">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="p-3 hover:bg-slate-800 rounded-full transition-colors group" title={t('settings.back')}>
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

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
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
    </div>
  );
};

export default Settings;
