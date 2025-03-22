import React from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch"
import { useTheme } from 'next-themes'
import { useAppContext } from '@/context/AppContext';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';

const Header = () => {
  const { language, setLanguage } = useAppContext();
  const { setTheme } = useTheme();

  // Check if user is logged in
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  return (
    <header className="flex items-center justify-between py-4 px-6 border-b border-border">
      <h1 className="text-2xl font-semibold">Student Management System</h1>
      
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}>
          {language === 'en' ? 'عربي' : 'English'}
        </Button>

        <Switch
          onCheckedChange={(checked) => {
            setTheme(checked ? 'dark' : 'light');
          }}
        />
        
        {user ? (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium hidden md:block">
              Welcome, {user.name}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                localStorage.removeItem('user');
                window.location.href = '/login';
              }}
            >
              Logout
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            onClick={() => {
              window.location.href = '/login';
            }}
          >
            Login
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
