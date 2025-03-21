
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import LanguageToggle from './LanguageToggle';
import { ChevronLeft, ChevronRight, Trophy } from 'lucide-react';

const Header: React.FC = () => {
  const { language } = useAppContext();
  const location = useLocation();
  
  const translations = {
    en: {
      dashboard: 'Dashboard',
      students: 'Students',
      import: 'Import',
      back: 'Back',
    },
    ar: {
      dashboard: 'لوحة التحكم',
      students: 'الطلاب',
      import: 'استيراد',
      back: 'عودة',
    }
  };

  const t = translations[language];
  
  const isHome = location.pathname === '/';
  const BackChevron = language === 'ar' ? ChevronRight : ChevronLeft;

  return (
    <header className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-border">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        {!isHome ? (
          <Link to="/" className="flex items-center text-blue-600 transition duration-200 hover:text-blue-700">
            <BackChevron className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">{t.back}</span>
          </Link>
        ) : (
          <div className="flex items-center">
            <Trophy className="h-6 w-6 text-blue-600 mr-2" />
            <span className="font-display font-semibold text-xl">EduRace</span>
          </div>
        )}

        <div className="flex items-center">
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
