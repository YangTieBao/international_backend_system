import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

// 从Cookie中获取指定键的值
const getCookie = (name: string): string | null => {
  // 分割Cookie字符串，处理可能的空格
  const cookies = document.cookie.split(';').map(c => c.trim());

  for (const cookie of cookies) {
    // 分割键值对（处理可能包含等号的值）
    const [cookieName, ...cookieValueParts] = cookie.split('=');
    if (cookieName === name) {
      // 拼接值的部分（如果值中包含等号）
      return cookieValueParts.join('=');
    }
  }
  return null;
};

// 从Cookie获取后端设置的默认语言（假设Cookie键名为 'defaultLanguage'）
const backendDefaultLang = getCookie('defaultLanguage') || 'zh';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: backendDefaultLang, // 使用使用从Cookie获取的语言作为默认值
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
