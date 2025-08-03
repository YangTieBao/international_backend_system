import { useEffect, useState } from 'react';
import { commonsRequests } from '../api';
import i18n from '../i18n';

const { fetchLanguage } = commonsRequests()


export const useLocale = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initLocale = async () => {
      try {
        const currentLang = i18n.language;
        console.log('初始化语言:', currentLang);

        const localeData = await fetchLanguage(currentLang);
        console.log('获取到的初始数据:', localeData);

        i18n.addResourceBundle(currentLang, 'translation', localeData, true, true);
        console.log('初始注入结果:', i18n.hasResourceBundle(currentLang, 'translation'));

        setIsLoading(false);
      } catch (err) {
        console.error('初始化语言失败:', err);
        setError(err as Error);
        setIsLoading(false);
      }
    };

    initLocale();
  }, []);

  const changeLanguage = async (lang: string) => {
    if (lang === i18n.language) return;

    setIsLoading(true);
    try {
      console.log('切换到语言:', lang);
      const localeData = await fetchLanguage(lang);
      console.log('获取到的切换数据:', localeData);

      i18n.addResourceBundle(lang, 'translation', localeData, true, true);
      console.log('切换注入结果:', i18n.hasResourceBundle(lang, 'translation'));

      i18n.changeLanguage(lang); // 切换语言
      setIsLoading(false);
    } catch (err) {
      console.error('切换语言失败:', err);
      setError(err as Error);
      setIsLoading(false);
    }
  };

  return {
    currentLanguage: i18n.language,
    changeLanguage,
    isLoading,
    error,
  };
};