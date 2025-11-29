
import React from 'react';
import { useI18n } from '../../context/I18nContext';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useI18n();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'pt' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 text-sm font-bold transition-colors"
      title="Mudar Idioma / Change Language"
    >
      {language.toUpperCase()}
    </button>
  );
};

export default LanguageSwitcher;
