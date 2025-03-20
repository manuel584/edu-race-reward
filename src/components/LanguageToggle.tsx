
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Globe } from 'lucide-react';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useAppContext();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <button 
      onClick={toggleLanguage}
      className="flex items-center space-x-1 p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all duration-200"
      aria-label={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
    >
      <Globe className="h-4 w-4" />
      <span className="text-sm font-medium">{language === 'en' ? 'AR' : 'EN'}</span>
    </button>
  );
};

export default LanguageToggle;
