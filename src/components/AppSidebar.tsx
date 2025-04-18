import React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  Settings,
  User,
  Book,
  Calendar,
  Users,
  FileText,
  BarChart,
  ListChecks,
  PlusCircle,
} from "lucide-react";

import { Icons } from "@/components/Icons";
import { useAppSidebar } from "@/components/AppSidebar";
import { useAppContext } from "@/context/AppContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarToggleButton,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { collapsed, setCollapsed } = useAppSidebar();
  const { language } = useAppContext();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>
          <Link to="/">
            <div className="flex items-center space-x-2">
              <Icons.logo className="h-6 w-6" />
              <span className="font-bold">
                {language === "en" ? "Acme School" : "مدرسة Acme"}
              </span>
            </div>
          </Link>
        </SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/dashboard">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                <span>{language === "en" ? "Dashboard" : "لوحة التحكم"}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/students">
                <User className="h-4 w-4 mr-2" />
                <span>{language === "en" ? "Students" : "الطلاب"}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/scores">
                <ListChecks className="h-4 w-4 mr-2" />
                <span>{language === "en" ? "Scores" : "النتائج"}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="exams">
              <AccordionTrigger className="data-[state=open]:text-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{language === "en" ? "Exams" : "الاختبارات"}</span>
              </AccordionTrigger>
              <AccordionContent>
                <SidebarMenuItem className="pl-8">
                  <SidebarMenuButton asChild>
                    <Link to="/exam-center">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      <span>
                        {language === "en" ? "Exam Center" : "مركز الاختبارات"}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="admin">
              <AccordionTrigger className="data-[state=open]:text-foreground">
                <Settings className="h-4 w-4 mr-2" />
                <span>{language === "en" ? "Admin" : "مدير"}</span>
              </AccordionTrigger>
              <AccordionContent>
                <SidebarMenuItem className="pl-8">
                  <SidebarMenuButton asChild>
                    <Link to="/users">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{language === "en" ? "User Management" : "إدارة المستخدمين"}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem className="pl-8">
                  <SidebarMenuButton asChild>
                    <Link to="/teachers">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{language === 'en' ? 'Teacher Management' : 'إدارة المعلمين'}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem className="pl-8">
                  <SidebarMenuButton asChild>
                    <Link to="/class-sections">
                      <Book className="h-4 w-4 mr-2" />
                      <span>{language === 'en' ? 'Class Sections' : 'أقسام الصفوف'}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem className="pl-8">
                  <SidebarMenuButton asChild>
                    <Link to="/import">
                      <FileText className="h-4 w-4 mr-2" />
                      <span>{language === "en" ? "Import" : "استيراد"}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem className="pl-8">
                  <SidebarMenuButton asChild>
                    <Link to="/reports">
                      <BarChart className="h-4 w-4 mr-2" />
                      <span>{language === "en" ? "Reports" : "التقارير"}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                {/* Add this inside the admin section of your sidebar */}
                <SidebarMenuItem className="pl-8">
                  <SidebarMenuButton asChild>
                    <Link to="/teacher-assignments">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{language === 'en' ? 'Teacher Assignments' : 'تعيين المعلمين'}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </SidebarMenu>
        <SidebarFooter>
          <p className="text-xs text-center">
            {language === "en"
              ? "© 2024 Acme School. All rights reserved."
              : "© 2024 مدرسة Acme. جميع الحقوق محفوظة."}
          </p>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
