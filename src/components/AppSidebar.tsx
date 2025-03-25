
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { useMobile } from '@/hooks/use-mobile';
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { 
  Menu, 
  Home, 
  Users, 
  Star, 
  Settings, 
  LogOut, 
  FileUp,
  FileText,
  BookOpen
} from 'lucide-react';
import LanguageToggle from './LanguageToggle';
import { useAuth } from '@/hooks/useAuth';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const NavItem = ({ to, icon, children }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);
  
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive 
          ? "bg-primary text-primary-foreground"
          : "hover:bg-muted"
      )}
    >
      {icon}
      <span>{children}</span>
    </NavLink>
  );
};

export const AppSidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isMobile = useMobile();
  
  if (isMobile) {
    return (
      <div className="flex min-h-screen w-full">
        <MobileNavbar />
        <div className="flex-1 px-2 pt-2 pb-0 md:px-6 md:pt-6 md:pb-0">
          {children}
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 px-2 pt-2 pb-0 md:px-6 md:pt-6 md:pb-0">
        {children}
      </div>
    </div>
  );
};

const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useAppContext();
  const t = getTranslations(language);
  const { logout } = useAuth();
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <>
      <div className="sticky top-0 z-30 flex h-16 w-full items-center border-b bg-background px-4">
        <Button
          variant="outline"
          size="icon"
          className="mr-2"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <span className="font-semibold">
          Student Recognition System
        </span>
      </div>
      
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={toggleSidebar}
        >
          <div 
            className="fixed left-0 top-0 z-50 h-full w-3/4 max-w-xs bg-background p-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between py-4">
                <h2 className="text-lg font-semibold">Student Recognition</h2>
                <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-1">
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                  onClick={toggleSidebar}
                >
                  <Home className="h-4 w-4" />
                  <span>{t.dashboard}</span>
                </NavLink>
                
                <NavLink 
                  to="/students" 
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                  onClick={toggleSidebar}
                >
                  <Users className="h-4 w-4" />
                  <span>{t.students}</span>
                </NavLink>
                
                <NavLink 
                  to="/exam-scores" 
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                  onClick={toggleSidebar}
                >
                  <BookOpen className="h-4 w-4" />
                  <span>{t.examScores}</span>
                </NavLink>
                
                <NavLink 
                  to="/import" 
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                  onClick={toggleSidebar}
                >
                  <FileUp className="h-4 w-4" />
                  <span>{t.import}</span>
                </NavLink>
              </div>
              
              <div className="mt-auto space-y-4">
                <div className="flex items-center gap-2">
                  <LanguageToggle onClick={toggleSidebar} />
                </div>
                
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {t.logout || "Logout"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const AppSidebar = () => {
  const { language } = useAppContext();
  const t = getTranslations(language);
  const location = useLocation();
  const { logout } = useAuth();
  
  return (
    <Sidebar defaultCollapsed={false}>
      <SidebarHeader className="px-2">
        <div className="flex flex-col space-y-1 px-2 py-2 text-center">
          <h1 className="text-xl font-semibold tracking-tight">
            Student Recognition
          </h1>
          <p className="text-xs text-muted-foreground">
            Empowering Excellence
          </p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <div className="px-1 py-2">
          <h3 className="px-4 text-xs font-medium text-muted-foreground">
            {t.navigation}
          </h3>
          <div className="mt-2 space-y-1 px-1">
            <NavItem to="/dashboard" icon={<Home className="h-4 w-4" />}>
              {t.dashboard}
            </NavItem>
            <NavItem to="/students" icon={<Users className="h-4 w-4" />}>
              {t.students}
            </NavItem>
            <NavItem to="/exam-scores" icon={<BookOpen className="h-4 w-4" />}>
              {t.examScores}
            </NavItem>
            <NavItem to="/import" icon={<FileUp className="h-4 w-4" />}>
              {t.import}
            </NavItem>
          </div>
        </div>
      </SidebarContent>
      <SidebarFooter className="px-4 py-4">
        <div className="grid gap-4">
          <div className="flex items-center space-x-2">
            <LanguageToggle />
          </div>
          
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={logout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {t.logout || "Logout"}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
