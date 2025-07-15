import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'zh',
    supportedLngs: ['zh', 'en', 'es', 'fr', 'de', 'ja'],
    debug: import.meta.env.MODE === 'development',
    interpolation: {
      escapeValue: false, // 不转义 HTML，允许翻译中包含标签
    },

    react: {
      useSuspense: false,
    },

    detection: {
      order: ['localStorage', 'navigator'], // 优先从 localStorage 获取语言
      caches: ['localStorage'], // 缓存语言选择
    },
  });

export default i18n;