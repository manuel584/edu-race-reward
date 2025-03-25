
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  BookOpen, 
  GraduationCap, 
  Globe, 
  Users, 
  User, 
  BarChart3, 
  Settings,
  PlusCircle,
  FileDown,
  ArrowUpDown,
  ChevronsLeft,
  ChevronsRight,
  Menu,
  HandHeart,
  Shield,
  Gem
} from 'lucide-react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerOverlay, DrawerTrigger } from "@/components/ui/drawer";

interface AppSidebarProps {
  children: React.ReactNode;
}

export const AppSidebarProvider: React.FC<AppSidebarProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Update sidebarOpen state when mobile status changes
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex min-h-screen w-full bg-gray-50">
        {isMobile ? (
          <>
            <DrawerTrigger asChild className="fixed top-4 left-4 z-50 md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </DrawerTrigger>
            <Drawer>
              <DrawerContent className="max-h-[90vh]">
                <div className="w-full max-w-none p-0 h-[80vh] overflow-auto">
                  <MobileSidebar />
                </div>
              </DrawerContent>
            </Drawer>
            <div className="flex-1 pt-14">{children}</div>
          </>
        ) : (
          <>
            <AppSidebarContent open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
            <div className="flex-1">{children}</div>
          </>
        )}
      </div>
    </SidebarProvider>
  );
};

const MobileSidebar: React.FC = () => {
  const { language, students } = useAppContext();
  const t = getTranslations(language);
  const location = useLocation();
  
  // Count students by type
  const nationalStudents = students.filter(s => s.nationality === 'national').length;
  const internationalStudents = students.filter(s => s.nationality === 'international').length;
  
  // Group students by grade
  const gradeGroups = students.reduce((acc, student) => {
    const grade = student.grade || 'Unassigned';
    if (!acc[grade]) {
      acc[grade] = [];
    }
    acc[grade].push(student);
    return acc;
  }, {} as Record<string, typeof students>);
  
  const isStudentsPage = location.pathname.includes('/students');
  const isStudentView = location.pathname.includes('/student/');
  const isDashboard = location.pathname.includes('/dashboard');
  const isGradePage = location.pathname.includes('/grade/');

  // Get current grade for highlighting
  const currentGrade = location.pathname.includes('/grade/') 
    ? location.pathname.split('/grade/')[1] 
    : location.pathname.includes('/students?grade=')
      ? new URLSearchParams(location.search).get('grade')
      : '';

  return (
    <div className="bg-sidebar p-4 min-h-full w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <GraduationCap className="h-6 w-6 text-blue-600 mr-2" />
          <span className="font-display font-semibold text-xl">EduRace</span>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">{t.navigation}</h3>
          <div className="space-y-1">
            <Button 
              variant={isDashboard ? "secondary" : "ghost"} 
              className="w-full justify-start" 
              asChild
            >
              <Link to="/dashboard">
                <BarChart3 className="h-4 w-4 mr-2" />
                {t.dashboard}
              </Link>
            </Button>
            
            <Button 
              variant={isStudentsPage ? "secondary" : "ghost"} 
              className="w-full justify-start" 
              asChild
            >
              <Link to="/students">
                <Users className="h-4 w-4 mr-2" />
                {t.students}
              </Link>
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              asChild
            >
              <Link to="/import">
                <FileDown className="h-4 w-4 mr-2" />
                {t.importText}
              </Link>
            </Button>
          </div>
        </div>
        
        {(isStudentsPage || isGradePage) && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">{t.filters}</h3>
            <div className="space-y-1">
              <Button 
                variant={location.search.includes('type=national') ? "secondary" : "ghost"} 
                className="w-full justify-start" 
                asChild
              >
                <Link to="/students?type=national">
                  <Users className="h-4 w-4 mr-2" />
                  {t.nationalStudents}
                  <span className="ml-auto bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs">
                    {nationalStudents}
                  </span>
                </Link>
              </Button>
              
              <Button 
                variant={location.search.includes('type=international') ? "secondary" : "ghost"} 
                className="w-full justify-start" 
                asChild
              >
                <Link to="/students?type=international">
                  <Globe className="h-4 w-4 mr-2" />
                  {t.internationalStudents}
                  <span className="ml-auto bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs">
                    {internationalStudents}
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        )}
        
        {(isStudentsPage || isGradePage) && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">{t.grades}</h3>
            <div className="space-y-1">
              {Object.entries(gradeGroups).sort().map(([grade, gradeStudents]) => (
                <div key={grade} className="space-y-1">
                  <Button 
                    variant={grade === currentGrade ? "secondary" : "ghost"} 
                    className="w-full justify-start" 
                    asChild
                  >
                    <Link to={`/students?grade=${grade}`}>
                      <GraduationCap className="h-4 w-4 mr-2" />
                      {t.grade} {grade}
                      <span className="ml-auto bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs">
                        {gradeStudents.length}
                      </span>
                    </Link>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start pl-9" 
                    asChild
                  >
                    <Link to={`/grade/${grade}`}>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      {t.recognition} {t.dashboard}
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {isStudentView && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">{t.studentOptions}</h3>
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start">
                <PlusCircle className="h-4 w-4 mr-2" />
                {t.addPoints}
              </Button>
              
              <Button variant="ghost" className="w-full justify-start">
                <BookOpen className="h-4 w-4 mr-2" />
                {t.pointHistory}
              </Button>
              
              <Button variant="ghost" className="w-full justify-start">
                <FileDown className="h-4 w-4 mr-2" />
                {t.exportData}
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6">
        <Button variant="outline" className="w-full flex items-center justify-center">
          <Settings className="h-4 w-4 mr-2" />
          <span>{t.settings}</span>
        </Button>
      </div>
    </div>
  );
};

const AppSidebarContent: React.FC<{ open: boolean; onToggle: () => void }> = ({ open, onToggle }) => {
  const { language, students } = useAppContext();
  const t = getTranslations(language);
  const location = useLocation();
  
  // Count students by type
  const nationalStudents = students.filter(s => s.nationality === 'national').length;
  const internationalStudents = students.filter(s => s.nationality === 'international').length;
  
  // Group students by grade
  const gradeGroups = students.reduce((acc, student) => {
    const grade = student.grade || 'Unassigned';
    if (!acc[grade]) {
      acc[grade] = [];
    }
    acc[grade].push(student);
    return acc;
  }, {} as Record<string, typeof students>);
  
  const isStudentsPage = location.pathname.includes('/students');
  const isStudentView = location.pathname.includes('/student/');
  const isDashboard = location.pathname.includes('/dashboard');
  const isGradePage = location.pathname.includes('/grade/');

  // Get current grade for highlighting
  const currentGrade = location.pathname.includes('/grade/') 
    ? location.pathname.split('/grade/')[1] 
    : location.pathname.includes('/students?grade=')
      ? new URLSearchParams(location.search).get('grade')
      : '';

  // Get recognition category for highlighting
  const recognitionCategory = location.hash ? location.hash.substring(1) : '';

  return (
    <Sidebar collapsible="icon" className="transition-all duration-300">
      <SidebarHeader className="flex items-center py-4">
        <div className="flex items-center px-2">
          <GraduationCap className="h-6 w-6 text-blue-600 mr-2" />
          <span className="font-display font-semibold text-xl">EduRace</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-auto" 
          onClick={onToggle}
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
        >
          {open ? 
            <ChevronsLeft className="h-4 w-4" /> : 
            <ChevronsRight className="h-4 w-4" />
          }
        </Button>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {t.navigation}
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isDashboard} tooltip={t.dashboard}>
                <Link to="/dashboard">
                  <BarChart3 className="h-4 w-4" />
                  <span>{t.dashboard}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isStudentsPage && !currentGrade} tooltip={t.students}>
                <Link to="/students">
                  <Users className="h-4 w-4" />
                  <span>{t.students}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={t.importText}>
                <Link to="/import">
                  <FileDown className="h-4 w-4" />
                  <span>{t.importText}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        
        {(isStudentsPage || isGradePage) && (
          <SidebarGroup>
            <SidebarGroupLabel>
              {t.filters}
            </SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={location.search.includes('type=national')}
                  tooltip={t.nationalStudents}
                >
                  <Link to="/students?type=national">
                    <Users className="h-4 w-4" />
                    <span>{t.nationalStudents}</span>
                    <span className="ml-auto bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs">
                      {nationalStudents}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={location.search.includes('type=international')}
                  tooltip={t.internationalStudents}
                >
                  <Link to="/students?type=international">
                    <Globe className="h-4 w-4" />
                    <span>{t.internationalStudents}</span>
                    <span className="ml-auto bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs">
                      {internationalStudents}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}
        
        {(isStudentsPage || isGradePage) && (
          <SidebarGroup>
            <SidebarGroupLabel>
              {t.grades}
            </SidebarGroupLabel>
            <SidebarMenu>
              {Object.entries(gradeGroups).sort().map(([grade, gradeStudents]) => (
                <SidebarMenuItem key={grade}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={currentGrade === grade && !isGradePage}
                    tooltip={`${t.grade} ${grade}`}
                  >
                    <Link to={`/students?grade=${grade}`}>
                      <GraduationCap className="h-4 w-4" />
                      <span>{t.grade} {grade}</span>
                      <span className="ml-auto bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs">
                        {gradeStudents.length}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                  
                  <SidebarMenuButton 
                    asChild 
                    isActive={currentGrade === grade && isGradePage}
                    tooltip={`${t.grade} ${grade} ${t.recognition}`}
                    className="pl-8"
                  >
                    <Link to={`/grade/${grade}`}>
                      <BarChart3 className="h-4 w-4" />
                      <span>{t.recognition}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}
        
        {isGradePage && (
          <SidebarGroup>
            <SidebarGroupLabel>
              {t.recognitionCategories}
            </SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={recognitionCategory === 'helpfulness'}
                  tooltip={t.helpfulness}
                >
                  <Link to={`${location.pathname}#helpfulness`}>
                    <HandHeart className="h-4 w-4 text-rose-600" />
                    <span>{t.helpfulness}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={recognitionCategory === 'respect'}
                  tooltip={t.respect}
                >
                  <Link to={`${location.pathname}#respect`}>
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span>{t.respect}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={recognitionCategory === 'teamwork'}
                  tooltip={t.teamwork}
                >
                  <Link to={`${location.pathname}#teamwork`}>
                    <Users className="h-4 w-4 text-green-600" />
                    <span>{t.teamwork}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={recognitionCategory === 'excellence'}
                  tooltip={t.excellence}
                >
                  <Link to={`${location.pathname}#excellence`}>
                    <Gem className="h-4 w-4 text-amber-600" />
                    <span>{t.excellence}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}
        
        {isStudentView && (
          <SidebarGroup>
            <SidebarGroupLabel>
              {t.studentOptions}
            </SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip={t.addPoints}>
                  <PlusCircle className="h-4 w-4" />
                  <span>{t.addPoints}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton tooltip={t.pointHistory}>
                  <BookOpen className="h-4 w-4" />
                  <span>{t.pointHistory}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton tooltip={t.exportData}>
                  <FileDown className="h-4 w-4" />
                  <span>{t.exportData}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
      
      <SidebarFooter>
        <div className="p-2">
          <Button variant="outline" className="w-full flex items-center justify-center">
            <Settings className="h-4 w-4 mr-2" />
            <span>{t.settings}</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebarProvider;
