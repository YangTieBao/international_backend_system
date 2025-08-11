import { useState } from 'react';
import { commonsRequests } from '../api';
import i18n from '../i18n';

const { fetchLanguage } = commonsRequests()

export const useLanguage = () => {
  const [languageSelectItems, setLanguageSelectItems] = useState([])
  const [currentLanguage, setCurrentLanguage] = useState('')

  const initLanguage = async (isLogin: boolean = false) => {
    try {
      const currentLang = i18n.language;

      setCurrentLanguage(currentLang)

      const response = await fetchLanguage(currentLang, isLogin);
      const { languageItems, translationContentsObject } = response.data;
      setLanguageSelectItems(languageItems)

      // 注入翻译内容
      i18n.addResourceBundle(currentLang, 'translation', translationContentsObject, true, true);

    } catch (err) {

    } finally {
      
    };
  }


  const changeLanguage = async (lang: string, isLogin: boolean = false) => {
    if (lang === i18n.language) return;

    try {
      const response = await fetchLanguage(lang, isLogin);
      const { translationContentsObject } = response.data;

      i18n.addResourceBundle(
        lang,
        'translation',
        translationContentsObject,
        true,
        true
      );

      await i18n.changeLanguage(lang);
      localStorage.setItem('language', lang);
      setCurrentLanguage(lang)

    } catch (err) {

    } finally {
    }
  };

  return {
    languageSelectItems,
    currentLanguage,
    initLanguage,
    changeLanguage
  };
}