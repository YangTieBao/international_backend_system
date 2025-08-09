import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: localStorage.getItem('language') || 'zh',
    supportedLngs: ['zh', 'en', 'es', 'fr', 'de', 'ja'],
    debug: import.meta.env.MODE === 'development',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    detection: {
      order: [],
      caches: []
    },
  });

export default i18n;
