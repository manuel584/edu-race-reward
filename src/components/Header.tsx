
import React from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch"
import { useTheme } from 'next-themes'
import { useAppContext } from '@/context/AppContext';
import { Moon, Sun, User, Globe } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { getTranslations } from '@/lib/i18n';

const Header = () => {
  const { language, setLanguage } = useAppContext();
  const { setTheme } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const t = getTranslations(language);
  
  // Get user's display name
  const displayName = user?.name || 'User';

  return (
    <header className="flex items-center justify-between py-4 px-4 sm:px-6 border-b border-border">
      <h1 className="text-xl sm:text-2xl font-semibold">
        {language === 'en' ? 'Student Management System' : 'نظام إدارة الطلاب'}
      </h1>
      
      <div className="flex items-center gap-2 sm:gap-4">
        <Button 
          variant="outline" 
          size={isMobile ? "icon" : "sm"} 
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className="h-9 w-9 sm:h-auto sm:w-auto flex items-center gap-1"
        >
          <Globe className="h-4 w-4" />
          {isMobile ? (language === 'en' ? 'ع' : 'E') : (language === 'en' ? 'العربية' : 'English')}
        </Button>

        <div className="flex items-center space-x-1 sm:space-x-2">
          <Sun className="h-[1.2rem] w-[1.2rem] dark:hidden" />
          <Switch
            onCheckedChange={(checked) => {
              setTheme(checked ? 'dark' : 'light');
            }}
          />
          <Moon className="h-[1.2rem] w-[1.2rem] hidden dark:block" />
        </div>
        
        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium hidden md:block">
              {language === 'en' ? 'Welcome, ' : 'مرحباً، '}{displayName}
            </span>
            <Button
              variant="outline"
              size={isMobile ? "icon" : "sm"}
              onClick={() => logout()}
              className={isMobile ? "h-9 w-9" : ""}
            >
              {isMobile ? <User className="h-4 w-4" /> : (language === 'en' ? "Logout" : "تسجيل الخروج")}
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            onClick={() => navigate('/login')}
          >
            <User className="mr-2 h-4 w-4" /> {language === 'en' ? "Login" : "تسجيل الدخول"}
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;

