import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split(';').map(c => c.trim());

  for (const cookie of cookies) {
    const [cookieName, ...cookieValueParts] = cookie.split('=');
    if (cookieName === name) {
      return cookieValueParts.join('=');
    }
  }
  return null;
};

const backendDefaultLang = getCookie('defaultLanguage') || 'zh';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: backendDefaultLang,
    supportedLngs: ['zh', 'en', 'es', 'fr', 'de', 'ja'],
    debug: import.meta.env.MODE === 'development',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
