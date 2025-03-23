
import React from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch"
import { useTheme } from 'next-themes'
import { useAppContext } from '@/context/AppContext';
import { Moon, Sun, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const { language, setLanguage } = useAppContext();
  const { setTheme } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Get user's display name
  const displayName = user?.name || 'User';

  return (
    <header className="flex items-center justify-between py-4 px-4 sm:px-6 border-b border-border">
      <h1 className="text-xl sm:text-2xl font-semibold">Student Management System</h1>
      
      <div className="flex items-center gap-2 sm:gap-4">
        <Button 
          variant="outline" 
          size={isMobile ? "icon" : "sm"} 
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className="h-9 w-9 sm:h-auto sm:w-auto"
        >
          {isMobile ? (language === 'en' ? 'ع' : 'E') : (language === 'en' ? 'عربي' : 'English')}
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
              Welcome, {displayName}
            </span>
            <Button
              variant="outline"
              size={isMobile ? "icon" : "sm"}
              onClick={() => logout()}
              className={isMobile ? "h-9 w-9" : ""}
            >
              {isMobile ? <User className="h-4 w-4" /> : "Logout"}
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            onClick={() => navigate('/login')}
          >
            <User className="mr-2 h-4 w-4" /> Login
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
