import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { useAuth } from '@/hooks/useAuth';
import {
  Home,
  Menu,
  Users,
  BookOpen,
  FileText,
  Settings,
  Award,
  BarChart,
  Upload,
  UserCog,
  GraduationCap,
  ClipboardList,
  School
} from 'lucide-react';

type AppSidebarContextType = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const AppSidebarContext = createContext<AppSidebarContextType | undefined>(undefined);

export function AppSidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AppSidebarContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="flex min-h-screen">
        <DesktopSidebar />
        <MobileSidebar />
        <div className="flex-1">{children}</div>
      </div>
    </AppSidebarContext.Provider>
  );
}

export function useAppSidebar() {
  const context = useContext(AppSidebarContext);
  if (!context) {
    throw new Error('useAppSidebar must be used within an AppSidebarProvider');
  }
  return context;
}

function MobileSidebar() {
  const { isOpen, setIsOpen } = useAppSidebar();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed left-4 top-4 z-40 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <SidebarContent />
      </SheetContent>
    </Sheet>
  );
}

function DesktopSidebar() {
  return (
    <div className="hidden border-r bg-gray-100/40 md:block dark:bg-gray-800/40">
      <div className="h-screen w-64 sticky top-0">
        <SidebarContent />
      </div>
    </div>
  );
}

function SidebarContent() {
  const { language } = useAppContext();
  const t = getTranslations(language);
  const { user } = useAuth();
  const { setIsOpen } = useAppSidebar();

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4">
        <Link to="/dashboard" className="flex items-center gap-2 font-semibold" onClick={handleLinkClick}>
          <School className="h-6 w-6" />
          <span className="text-lg font-display">{t.appName || "School System"}</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 py-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/dashboard" onClick={handleLinkClick}>
                <Home className="h-4 w-4 mr-2" />
                <span>{t.dashboard}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/students" onClick={handleLinkClick}>
                <Users className="h-4 w-4 mr-2" />
                <span>{t.students}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/scores" onClick={handleLinkClick}>
                <BarChart className="h-4 w-4 mr-2" />
                <span>{t.scores}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/exam-center" onClick={handleLinkClick}>
                <ClipboardList className="h-4 w-4 mr-2" />
                <span>{t.examCenter}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/reports" onClick={handleLinkClick}>
                <FileText className="h-4 w-4 mr-2" />
                <span>{t.reports}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="pl-8">
            <SidebarMenuButton asChild>
              <Link to="/recognition-race" onClick={handleLinkClick}>
                <Award className="h-4 w-4 mr-2" />
                <span>{language === 'en' ? 'Recognition Race' : 'سباق التمييز'}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          {/* Admin section */}
          {user?.role === 'admin' && (
            <>
              <SidebarMenuTitle>{t.administration}</SidebarMenuTitle>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/users" onClick={handleLinkClick}>
                    <UserCog className="h-4 w-4 mr-2" />
                    <span>{t.userManagement}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/teachers" onClick={handleLinkClick}>
                    <GraduationCap className="h-4 w-4 mr-2" />
                    <span>{t.teacherManagement}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/class-sections" onClick={handleLinkClick}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    <span>{t.classSections}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/import" onClick={handleLinkClick}>
                    <Upload className="h-4 w-4 mr-2" />
                    <span>{t.import}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}
        </SidebarMenu>
      </ScrollArea>
      <div className="h-14 border-t flex items-center px-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="text-sm">
            <div className="font-medium">{user?.name}</div>
            <div className="text-xs text-gray-500">{user?.role}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarMenu({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-1 px-2">{children}</div>;
}

function SidebarMenuTitle({ children }: { children: React.ReactNode }) {
  return <div className="px-4 py-2 text-xs font-medium text-gray-500">{children}</div>;
}

function SidebarMenuItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('', className)}>{children}</div>;
}

function SidebarMenuButton({
  children,
  asChild,
}: {
  children: React.ReactNode;
  asChild?: boolean;
}) {
  const Component = asChild ? React.Fragment : 'button';
  const location = useLocation();
  const isActive = React.Children.toArray(children).some((child) => {
    if (React.isValidElement(child) && child.type === Link) {
      return location.pathname === child.props.to;
    }
    return false;
  });

  return (
    <Component>
      <div
        className={cn(
          'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-50'
            : 'text-gray-700 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-50'
        )}
      >
        {children}
      </div>
    </Component>
  );
}
