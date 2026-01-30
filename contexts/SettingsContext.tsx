import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { KeyboardLayout, Language } from '../types';

const LANGUAGE_STORAGE_KEY = 'tippsy_language';
const KEYBOARD_STORAGE_KEY = 'tippsy_keyboard_layout';

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

interface SettingsContextValue {
  language: Language;
  keyboardLayout: KeyboardLayout;
  setLanguage: (language: Language) => void;
  setKeyboardLayout: (layout: KeyboardLayout) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => getInitialLanguage());
  const [keyboardLayout, setKeyboardLayout] = useState<KeyboardLayout>(() => getInitialKeyboardLayout(getInitialLanguage()));

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

  const value = useMemo(() => ({ language, keyboardLayout, setLanguage, setKeyboardLayout }), [language, keyboardLayout]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = (): SettingsContextValue => {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return ctx;
};
