
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth, UserRole } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { getTranslations } from '@/lib/i18n';
import { useAppContext } from '@/context/AppContext';
import LanguageToggle from '@/components/LanguageToggle';
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

const Login = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const { language } = useAppContext();
  const { theme, setTheme } = useTheme();
  const t = getTranslations(language);
  const [selectedRole, setSelectedRole] = useState<UserRole>('teacher');
  const [demoType, setDemoType] = useState<'default' | 'arabic'>('default');
  
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  const handleDemoLogin = () => {
    if (demoType === 'arabic') {
      login({
        id: '5',
        name: 'عمر عبدالمنعم',
        email: 'omar@school.edu',
        role: 'teacher',
        profile: {
          subjects: ['العلوم', 'الرياضيات'],
          assignedGrades: ['5', '6'],
          assignedSections: ['5A', '5B', '6A'],
        }
      });
    } else {
      login({
        id: '1',
        name: 'Demo User',
        email: 'demo@school.edu',
        role: selectedRole,
        profile: {
          subjects: selectedRole === 'teacher' ? ['Math', 'Science'] : undefined,
          assignedGrades: selectedRole === 'teacher' || selectedRole === 'supervisor' ? ['5', '6'] : undefined,
          assignedSections: selectedRole === 'teacher' ? ['5A', '5B', '6A'] : undefined,
          departments: selectedRole === 'supervisor' ? ['Science', 'Math'] : undefined,
        }
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="absolute top-4 right-4 flex items-center gap-4">
        <div className="flex items-center space-x-2">
          <Sun className="h-5 w-5 dark:hidden" />
          <Switch
            checked={theme === 'dark'}
            onCheckedChange={(checked) => {
              setTheme(checked ? 'dark' : 'light');
            }}
          />
          <Moon className="h-5 w-5 hidden dark:block" />
        </div>
        <LanguageToggle />
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div 
          className="bg-card p-8 rounded-xl shadow-lg max-w-md w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-20 h-20 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </motion.div>
            
            <h1 className="text-3xl font-bold font-display text-foreground">Learning Track</h1>
            <p className="text-muted-foreground mt-2">{language === 'en' ? 'Track student progress and celebrate achievements' : 'تتبع تقدم الطالب والاحتفال بالإنجازات'}</p>
          </div>
          
          <div className="space-y-4">
            {demoType === 'default' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {language === 'en' ? 'Login as:' : 'تسجيل الدخول كـ:'}
                </label>
                <Select value={selectedRole} onValueChange={(value: UserRole) => setSelectedRole(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={language === 'en' ? 'Select role' : 'اختر الدور'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">
                      {language === 'en' ? 'Administrator' : 'مدير النظام'}
                    </SelectItem>
                    <SelectItem value="supervisor">
                      {language === 'en' ? 'Supervisor' : 'مشرف'}
                    </SelectItem>
                    <SelectItem value="counselor">
                      {language === 'en' ? 'Student Counselor' : 'مرشد طلابي'}
                    </SelectItem>
                    <SelectItem value="teacher">
                      {language === 'en' ? 'Teacher' : 'معلم'}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-foreground">
                {language === 'en' ? 'Demo Account:' : 'حساب تجريبي:'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant={demoType === 'default' ? "default" : "outline"} 
                  onClick={() => setDemoType('default')}
                  className="w-full"
                >
                  {language === 'en' ? 'Default' : 'افتراضي'}
                </Button>
                <Button 
                  variant={demoType === 'arabic' ? "default" : "outline"} 
                  onClick={() => setDemoType('arabic')}
                  className="w-full"
                >
                  {language === 'en' ? 'Arabic Teacher' : 'معلم عربي'}
                </Button>
              </div>
            </div>
            
            <motion.button
              className="w-full py-3 px-4 rounded-md bg-primary text-primary-foreground font-medium flex items-center justify-center space-x-2 hover:bg-primary/90 transition-colors"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDemoLogin}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>
                {demoType === 'arabic' 
                  ? (language === 'en' ? 'Login as عمر عبدالمنعم' : 'تسجيل الدخول كـ عمر عبدالمنعم')
                  : (language === 'en' ? `Demo Login (${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)})` : 
                    `تسجيل دخول تجريبي (${selectedRole === 'admin' ? 'مدير النظام' : 
                                      selectedRole === 'supervisor' ? 'مشرف' : 
                                      selectedRole === 'counselor' ? 'مرشد طلابي' : 'معلم'})`)
                }
              </span>
            </motion.button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card text-muted-foreground">
                  {t.or || (language === 'en' ? 'or' : 'أو')}
                </span>
              </div>
            </div>
            
            <motion.button
              className="w-full py-3 px-4 rounded-md border border-border bg-background text-foreground font-medium flex items-center justify-center space-x-2 hover:bg-muted/10 transition-colors"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDemoLogin}
              disabled
            >
              <svg viewBox="0 0 48 48" className="h-5 w-5">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
              </svg>
              <span>{t.signInWithGoogle || (language === 'en' ? 'Sign in with Google' : 'تسجيل الدخول بواسطة جوجل')}</span>
            </motion.button>
          </div>
          
          <p className="text-sm text-muted-foreground text-center mt-8">
            {t.demoLoginNote || (language === 'en' ? 'This is a demo application. No real authentication is performed.' : 'هذا تطبيق تجريبي. لا يتم إجراء مصادقة حقيقية.')}
          </p>
        </motion.div>
      </div>
      
      <footer className="py-4 text-center text-muted-foreground text-sm">
        &copy; 2023 Learning Track. {t.allRightsReserved || (language === 'en' ? 'All rights reserved' : 'جميع الحقوق محفوظة')}
      </footer>
    </div>
  );
};

export default Login;
