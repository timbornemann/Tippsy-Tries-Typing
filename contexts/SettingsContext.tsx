import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { KeyboardLayout, Language } from '../types';

const LANGUAGE_STORAGE_KEY = 'tippsy_language';
const KEYBOARD_STORAGE_KEY = 'tippsy_keyboard_layout';
const SOUND_STORAGE_KEY = 'tippsy_sound_enabled';
const ZERO_MISTAKES_STORAGE_KEY = 'tippsy_zero_mistakes_mode';

const getStoredValue = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const getInitialLanguage = (): Language => {
  const stored = getStoredValue(LANGUAGE_STORAGE_KEY);
  if (stored === 'de' || stored === 'en') return stored;
  return 'en';
};

const getInitialKeyboardLayout = (language: Language): KeyboardLayout => {
  const stored = getStoredValue(KEYBOARD_STORAGE_KEY);
  if (stored === 'qwertz' || stored === 'qwerty') return stored;
  return language === 'de' ? 'qwertz' : 'qwerty';
};

const getInitialSoundEnabled = (): boolean => {
  const stored = getStoredValue(SOUND_STORAGE_KEY);
  if (stored === '0' || stored === 'false') return false;
  if (stored === '1' || stored === 'true') return true;
  return true;
};

const getInitialZeroMistakesMode = (): boolean => {
  const stored = getStoredValue(ZERO_MISTAKES_STORAGE_KEY);
  if (stored === '1' || stored === 'true') return true;
  return false;
};

interface SettingsContextValue {
  language: Language;
  keyboardLayout: KeyboardLayout;
  soundEnabled: boolean;
  zeroMistakesMode: boolean;
  setLanguage: (language: Language) => void;
  setKeyboardLayout: (layout: KeyboardLayout) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setZeroMistakesMode: (enabled: boolean) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => getInitialLanguage());
  const [keyboardLayout, setKeyboardLayout] = useState<KeyboardLayout>(() => getInitialKeyboardLayout(getInitialLanguage()));
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => getInitialSoundEnabled());
  const [zeroMistakesMode, setZeroMistakesMode] = useState<boolean>(() => getInitialZeroMistakesMode());

  useEffect(() => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // ignore
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  useEffect(() => {
    try {
      localStorage.setItem(KEYBOARD_STORAGE_KEY, keyboardLayout);
    } catch {
      // ignore
    }
  }, [keyboardLayout]);

  useEffect(() => {
    try {
      localStorage.setItem(SOUND_STORAGE_KEY, soundEnabled ? '1' : '0');
    } catch {
      // ignore
    }
  }, [soundEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem(ZERO_MISTAKES_STORAGE_KEY, zeroMistakesMode ? '1' : '0');
    } catch {
      // ignore
    }
  }, [zeroMistakesMode]);

  const value = useMemo(() => ({
    language,
    keyboardLayout,
    soundEnabled,
    zeroMistakesMode,
    setLanguage,
    setKeyboardLayout,
    setSoundEnabled,
    setZeroMistakesMode
  }), [language, keyboardLayout, soundEnabled, zeroMistakesMode]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = (): SettingsContextValue => {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return ctx;
};
