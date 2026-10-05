import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.ml;
  isRtl: boolean;
  fontClass: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('theen_lang') as Language | null;
    if (saved === 'ml' || saved === 'en' || saved === 'ur') {
      return saved;
    }
    return 'ml'; // Malayalam default as requested
  });

  const isRtl = language === 'ur';

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('lang', language);
    html.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    localStorage.setItem('theen_lang', language);
  }, [language, isRtl]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const currentTranslations = translations[language] || translations.ml;

  // Choose appropriate font helper
  const fontClass = language === 'ur' ? 'font-urdu' : language === 'ml' ? 'font-malayalam' : 'font-sans';

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: currentTranslations,
        isRtl,
        fontClass,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
