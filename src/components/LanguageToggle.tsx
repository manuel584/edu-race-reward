
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useAppContext();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <Button 
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-1 px-2"
      aria-label={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
    >
      <Globe className="h-4 w-4" />
      <span className="text-sm font-medium">{language === 'en' ? 'العربية' : 'English'}</span>
    </Button>
  );
};

export default LanguageToggle;

