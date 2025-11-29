import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

// Helper to access nested keys like 'login.title'
const getNestedTranslation = (obj: any, key: string): string => {
  if (!obj) return key;
  const result = key.split('.').reduce((o, i) => (o ? o[i] : undefined), obj);
  return result || key;
};

type Language = 'en' | 'pt';
type Translations = { [key in Language]?: any };

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useLocalStorage<Language>('futsal_language', 'pt');
  const [translations, setTranslations] = useState<Translations>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTranslations = async () => {
      setIsLoading(true);
      try {
        const [enResponse, ptResponse] = await Promise.all([
          fetch('/locales/en.json'),
          fetch('/locales/pt.json')
        ]);
        const en = await enResponse.json();
        const pt = await ptResponse.json();
        setTranslations({ en, pt });
      } catch (error) {
        console.error('Failed to load translation files:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTranslations();
  }, []);

  const t = (key: string): string => {
    const langFile = translations[language];
    return getNestedTranslation(langFile, key);
  };

  if (isLoading) {
    // Render a blank screen or a loading spinner while translations are loading
    return <div className="flex items-center justify-center min-h-screen bg-gray-900"></div>;
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};