// src/contexts/TranslationContext.tsx
import React, { createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';

const TranslationContext = createContext<{ t: any } | null>(null);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation(); // 从 react-i18next 获取 t 函数
  return (
    <TranslationContext.Provider value={{ t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useT = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useT must be used within a TranslationProvider');
  }
  return context.t;
};