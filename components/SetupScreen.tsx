import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useI18n } from '../hooks/useI18n';
import { useSound } from '../hooks/useSound';
import { Keyboard, ArrowRight } from 'lucide-react';
interface SetupScreenProps {
  onComplete: () => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onComplete }) => {
  const { t } = useI18n();
  const { language, keyboardLayout, setLanguage, setKeyboardLayout } = useSettings();
  const { playMenuClick } = useSound();

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white flex flex-col items-center justify-center relative overflow-hidden p-6">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-900/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-900/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-2xl w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-blue-600 mb-6 shadow-2xl shadow-emerald-500/20 rotate-3">
          <Keyboard className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          {t('setup.title')}
        </h1>
        <p className="text-slate-400 text-lg text-center mb-10">
          {t('setup.description')}
        </p>

        {/* Language */}
        <div className="w-full mb-8">
          <h2 className="text-lg font-bold text-white mb-2">{t('settings.language')}</h2>
          <p className="text-slate-500 text-sm mb-4">{t('settings.languageHint')}</p>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setLanguage('en')}
              className={`px-4 py-4 rounded-xl border transition-all text-left ${language === 'en' ? 'border-emerald-500 bg-emerald-500/10 text-white' : 'border-slate-700 bg-slate-800/80 text-slate-300 hover:bg-slate-700'}`}
            >
              <div className="font-bold">{t('settings.english')}</div>
              <div className="text-xs text-slate-400">English</div>
            </button>
            <button
              onClick={() => setLanguage('de')}
              className={`px-4 py-4 rounded-xl border transition-all text-left ${language === 'de' ? 'border-emerald-500 bg-emerald-500/10 text-white' : 'border-slate-700 bg-slate-800/80 text-slate-300 hover:bg-slate-700'}`}
            >
              <div className="font-bold">{t('settings.german')}</div>
              <div className="text-xs text-slate-400">Deutsch</div>
            </button>
          </div>
        </div>

        {/* Keyboard layout */}
        <div className="w-full mb-10">
          <h2 className="text-lg font-bold text-white mb-2">{t('settings.keyboard')}</h2>
          <p className="text-slate-500 text-sm mb-4">{t('settings.keyboardHint')}</p>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setKeyboardLayout('qwerty')}
              className={`px-4 py-4 rounded-xl border transition-all text-left ${keyboardLayout === 'qwerty' ? 'border-emerald-500 bg-emerald-500/10 text-white' : 'border-slate-700 bg-slate-800/80 text-slate-300 hover:bg-slate-700'}`}
            >
              <div className="font-bold">{t('settings.qwerty')}</div>
              <div className="text-xs text-slate-400">QWERTY (US)</div>
            </button>
            <button
              onClick={() => setKeyboardLayout('qwertz')}
              className={`px-4 py-4 rounded-xl border transition-all text-left ${keyboardLayout === 'qwertz' ? 'border-emerald-500 bg-emerald-500/10 text-white' : 'border-slate-700 bg-slate-800/80 text-slate-300 hover:bg-slate-700'}`}
            >
              <div className="font-bold">{t('settings.qwertz')}</div>
              <div className="text-xs text-slate-400">QWERTZ (DE)</div>
            </button>
          </div>
        </div>

        <button
          onClick={() => { playMenuClick(); onComplete(); }}
          className="px-10 py-4 bg-white text-slate-900 font-bold text-lg rounded-full shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] hover:scale-105 transition-all flex items-center gap-3"
        >
          {t('setup.continue')} <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default SetupScreen;
