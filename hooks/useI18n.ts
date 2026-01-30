import { useCallback, useMemo } from 'react';
import { getCopy, translate, TranslationCopy } from '../i18n';
import { useSettings } from '../contexts/SettingsContext';

export const useI18n = () => {
  const { language } = useSettings();
  const copy = useMemo<TranslationCopy>(() => getCopy(language), [language]);
  const t = useCallback((path: string, params?: Record<string, string | number>) => translate(language, path, params), [language]);
  return { language, copy, t };
};
