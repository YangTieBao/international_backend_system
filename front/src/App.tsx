import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './components/LanguageSwitcher';
import { useLocale } from './hook/useLocale';


function App() {
  const { t } = useTranslation();
  const { isLoading, changeLanguage } = useLocale();

  if (isLoading) {
    return <div>加载语言数据中...</div>;
  }

  return (
    <div>
      <h1>{t('common.greeting')}</h1>
      <LanguageSwitcher changeLanguage={changeLanguage} />
    </div>
  );
}

export default App;