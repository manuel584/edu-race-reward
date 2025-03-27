
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import { 
  BookOpen, 
  GraduationCap, 
  Globe, 
  Users, 
  BarChart3, 
  Settings,
  PlusCircle,
  FileDown,
  ChevronsLeft,
  ChevronsRight,
  Menu,
  HandHeart,
  Shield,
  Gem,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

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
  );
};

const MobileSidebar: React.FC = () => {
  const { language, students } = useAppContext();
  const t = getTranslations(language);
  const location = useLocation();
  const { logout } = useAuth();
  
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
      
      <div className="mt-6 space-y-2">
        <Button variant="outline" className="w-full flex items-center justify-center">
          <Settings className="h-4 w-4 mr-2" />
          <span>{t.settings}</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center text-red-500 hover:text-red-600"
          onClick={() => logout()}
        >
          <LogOut className="h-4 w-4 mr-2" />
          <span>{t.logout}</span>
        </Button>
      </div>
    </div>
  );
};

const AppSidebarContent: React.FC<{ open: boolean; onToggle: () => void }> = ({ open, onToggle }) => {
  const { language, students } = useAppContext();
  const t = getTranslations(language);
  const location = useLocation();
  const { logout } = useAuth();
  
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
    <div className={`h-screen ${open ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
      <div className="border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center overflow-hidden">
          <GraduationCap className="h-6 w-6 flex-shrink-0 text-blue-600" />
          {open && <span className="ml-2 font-display font-semibold text-lg whitespace-nowrap">EduRace</span>}
        </div>
        <Button variant="ghost" size="icon" onClick={onToggle} className="ml-auto">
          {open ? <ChevronsLeft className="h-4 w-4" /> : <ChevronsRight className="h-4 w-4" />}
        </Button>
      </div>
      
      <div className="flex-1 py-4 overflow-y-auto">
        <div className="px-3 space-y-6">
          <div>
            {!open && <div className="text-xs font-medium text-gray-500 mb-2 text-center">{t.navigation.charAt(0)}</div>}
            {open && <div className="text-xs font-medium text-gray-500 mb-2 px-2">{t.navigation}</div>}
            
            <div className="space-y-1">
              <Button 
                variant={isDashboard ? "secondary" : "ghost"} 
                size={open ? "default" : "icon"}
                className={`w-full ${!open ? 'justify-center' : 'justify-start'}`} 
                asChild
              >
                <Link to="/dashboard">
                  <BarChart3 className="h-4 w-4" />
                  {open && <span className="ml-2">{t.dashboard}</span>}
                </Link>
              </Button>
              
              <Button 
                variant={isStudentsPage ? "secondary" : "ghost"} 
                size={open ? "default" : "icon"}
                className={`w-full ${!open ? 'justify-center' : 'justify-start'}`}
                asChild
              >
                <Link to="/students">
                  <Users className="h-4 w-4" />
                  {open && <span className="ml-2">{t.students}</span>}
                </Link>
              </Button>
              
              <Button 
                variant="ghost" 
                size={open ? "default" : "icon"}
                className={`w-full ${!open ? 'justify-center' : 'justify-start'}`}
                asChild
              >
                <Link to="/import">
                  <FileDown className="h-4 w-4" />
                  {open && <span className="ml-2">{t.importText}</span>}
                </Link>
              </Button>
            </div>
          </div>
          
          {(isStudentsPage || isGradePage) && (
            <div>
              {!open && <div className="text-xs font-medium text-gray-500 mb-2 text-center">{t.filters.charAt(0)}</div>}
              {open && <div className="text-xs font-medium text-gray-500 mb-2 px-2">{t.filters}</div>}
              
              <div className="space-y-1">
                <Button 
                  variant={location.search.includes('type=national') ? "secondary" : "ghost"} 
                  size={open ? "default" : "icon"}
                  className={`w-full ${!open ? 'justify-center' : 'justify-start'}`}
                  asChild
                >
                  <Link to="/students?type=national">
                    <Users className="h-4 w-4" />
                    {open && (
                      <>
                        <span className="ml-2">{t.nationalStudents}</span>
                        <span className="ml-auto bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs">
                          {nationalStudents}
                        </span>
                      </>
                    )}
                  </Link>
                </Button>
                
                <Button 
                  variant={location.search.includes('type=international') ? "secondary" : "ghost"} 
                  size={open ? "default" : "icon"}
                  className={`w-full ${!open ? 'justify-center' : 'justify-start'}`}
                  asChild
                >
                  <Link to="/students?type=international">
                    <Globe className="h-4 w-4" />
                    {open && (
                      <>
                        <span className="ml-2">{t.internationalStudents}</span>
                        <span className="ml-auto bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs">
                          {internationalStudents}
                        </span>
                      </>
                    )}
                  </Link>
                </Button>
              </div>
            </div>
          )}
          
          {(isStudentsPage || isGradePage) && (
            <div>
              {!open && <div className="text-xs font-medium text-gray-500 mb-2 text-center">{t.grades.charAt(0)}</div>}
              {open && <div className="text-xs font-medium text-gray-500 mb-2 px-2">{t.grades}</div>}
              
              <div className="space-y-1">
                {Object.entries(gradeGroups).sort().map(([grade, gradeStudents]) => (
                  <div key={grade} className="space-y-1">
                    <Button 
                      variant={grade === currentGrade && !isGradePage ? "secondary" : "ghost"} 
                      size={open ? "default" : "icon"}
                      className={`w-full ${!open ? 'justify-center' : 'justify-start'}`}
                      asChild
                    >
                      <Link to={`/students?grade=${grade}`}>
                        <GraduationCap className="h-4 w-4" />
                        {open && (
                          <>
                            <span className="ml-2">{t.grade} {grade}</span>
                            <span className="ml-auto bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs">
                              {gradeStudents.length}
                            </span>
                          </>
                        )}
                      </Link>
                    </Button>
                    
                    <Button 
                      variant={grade === currentGrade && isGradePage ? "secondary" : "ghost"} 
                      size={open ? "default" : "icon"}
                      className={`w-full ${!open ? 'justify-center pl-0' : 'justify-start pl-9'}`}
                      asChild
                    >
                      <Link to={`/grade/${grade}`}>
                        <BarChart3 className="h-4 w-4" />
                        {open && <span className="ml-2">{t.recognition}</span>}
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {isGradePage && open && (
            <div>
              <div className="text-xs font-medium text-gray-500 mb-2 px-2">{t.recognitionCategories}</div>
              
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to={`${location.pathname}#helpfulness`}>
                    <HandHeart className="h-4 w-4 text-rose-600" />
                    <span className="ml-2">{t.helpfulness}</span>
                  </Link>
                </Button>
                
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to={`${location.pathname}#respect`}>
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span className="ml-2">{t.respect}</span>
                  </Link>
                </Button>
                
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to={`${location.pathname}#teamwork`}>
                    <Users className="h-4 w-4 text-green-600" />
                    <span className="ml-2">{t.teamwork}</span>
                  </Link>
                </Button>
                
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to={`${location.pathname}#excellence`}>
                    <Gem className="h-4 w-4 text-amber-600" />
                    <span className="ml-2">{t.excellence}</span>
                  </Link>
                </Button>
              </div>
            </div>
          )}
          
          {isStudentView && (
            <div>
              {!open && <div className="text-xs font-medium text-gray-500 mb-2 text-center">{t.studentOptions.charAt(0)}</div>}
              {open && <div className="text-xs font-medium text-gray-500 mb-2 px-2">{t.studentOptions}</div>}
              
              <div className="space-y-1">
                <Button 
                  variant="ghost" 
                  size={open ? "default" : "icon"}
                  className={`w-full ${!open ? 'justify-center' : 'justify-start'}`}
                >
                  <PlusCircle className="h-4 w-4" />
                  {open && <span className="ml-2">{t.addPoints}</span>}
                </Button>
                
                <Button 
                  variant="ghost" 
                  size={open ? "default" : "icon"}
                  className={`w-full ${!open ? 'justify-center' : 'justify-start'}`}
                >
                  <BookOpen className="h-4 w-4" />
                  {open && <span className="ml-2">{t.pointHistory}</span>}
                </Button>
                
                <Button 
                  variant="ghost" 
                  size={open ? "default" : "icon"}
                  className={`w-full ${!open ? 'justify-center' : 'justify-start'}`}
                >
                  <FileDown className="h-4 w-4" />
                  {open && <span className="ml-2">{t.exportData}</span>}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="border-t border-gray-200 p-4">
        <div className="space-y-2">
          <Button 
            variant="outline" 
            size={open ? "default" : "icon"}
            className={`w-full ${!open ? 'justify-center' : 'justify-start'}`}
          >
            <Settings className="h-4 w-4" />
            {open && <span className="ml-2">{t.settings}</span>}
          </Button>
          
          <Button 
            variant="outline" 
            size={open ? "default" : "icon"}
            className={`w-full ${!open ? 'justify-center' : 'justify-start'} text-red-500 hover:text-red-600`}
            onClick={() => logout()}
          >
            <LogOut className="h-4 w-4" />
            {open && <span className="ml-2">{t.logout}</span>}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppSidebarProvider;
