
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
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
  ChevronsLeft
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

interface AppSidebarProps {
  children: React.ReactNode;
}

export const AppSidebarProvider: React.FC<AppSidebarProps> = ({ children }) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-gray-50">
        <AppSidebarContent />
        <div className="flex-1">{children}</div>
      </div>
    </SidebarProvider>
  );
};

const AppSidebarContent: React.FC = () => {
  const { language, students } = useAppContext();
  const t = getTranslations(language);
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
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
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex items-center py-4">
        <div className="flex items-center px-2">
          <GraduationCap className="h-6 w-6 text-blue-600 mr-2" />
          <span className="font-display font-semibold text-xl">EduRace</span>
        </div>
        <Button variant="ghost" size="icon" className="ml-auto" onClick={toggleSidebar}>
          <ChevronsLeft className="h-4 w-4" />
        </Button>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {t.main}
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isDashboard}>
                <Link to="/dashboard">
                  <BarChart3 className="h-4 w-4" />
                  <span>{t.dashboard}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isStudentsPage}>
                <Link to="/students">
                  <Users className="h-4 w-4" />
                  <span>{t.students}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/import">
                  <FileDown className="h-4 w-4" />
                  <span>{t.import}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        
        {isStudentsPage && (
          <SidebarGroup>
            <SidebarGroupLabel>
              {t.studentGroups}
            </SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
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
                <SidebarMenuButton asChild>
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
        
        {isStudentsPage && (
          <SidebarGroup>
            <SidebarGroupLabel>
              {t.grades}
            </SidebarGroupLabel>
            <SidebarMenu>
              {Object.entries(gradeGroups).map(([grade, students]) => (
                <SidebarMenuItem key={grade}>
                  <SidebarMenuButton asChild>
                    <Link to={`/students?grade=${grade}`}>
                      <GraduationCap className="h-4 w-4" />
                      <span>{grade}</span>
                      <span className="ml-auto bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs">
                        {students.length}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}
        
        {isStudentView && (
          <SidebarGroup>
            <SidebarGroupLabel>
              {t.studentActions}
            </SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <PlusCircle className="h-4 w-4" />
                  <span>{t.addPoints}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <BookOpen className="h-4 w-4" />
                  <span>{t.viewHistory}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton>
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
