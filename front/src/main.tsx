// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next'; // 引入原生提供者
import i18n from './i18n'; // 导入 i18n 配置
import App from './App';
import './index.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </StrictMode>
);