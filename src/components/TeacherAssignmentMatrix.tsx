
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { UserRole } from '@/hooks/useAuth';
import { Users, BookOpen, GraduationCap, ScrollText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

type TeacherType = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  subjects?: string[];
  assignedClasses?: string[];
  status?: 'active' | 'inactive' | 'pending';
};

interface TeacherAssignmentMatrixProps {
  teachers: TeacherType[];
  allClasses: string[];
  allSubjects: string[];
  onUpdateAssignments: (teacherId: string, classes: string[]) => void;
  onUpdateSubjects: (teacherId: string, subjects: string[]) => void;
}

const TeacherAssignmentMatrix = ({ 
  teachers, 
  allClasses, 
  allSubjects,
  onUpdateAssignments,
  onUpdateSubjects
}: TeacherAssignmentMatrixProps) => {
  const { language } = useAppContext();
  const t = getTranslations(language);
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'matrix' | 'list' | 'workload'>('matrix');
  const [filterGrade, setFilterGrade] = useState<string>('all');
  const [classFilterType, setClassFilterType] = useState<string>('all');
  
  const isAssigned = (teacherId: string, className: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher?.assignedClasses?.includes(className) || false;
  };
  
  const canTeachSubject = (teacherId: string, subject: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher?.subjects?.includes(subject) || false;
  };
  
  const getTeacherById = (teacherId: string) => {
    return teachers.find(t => t.id === teacherId) || null;
  };
  
  const getClassGrade = (className: string) => {
    // Extract grade number from class name (e.g., "5A" => "5")
    return className.replace(/[^0-9]/g, '');
  };
  
  const filteredClasses = allClasses.filter(className => {
    if (filterGrade === 'all') return true;
    return getClassGrade(className) === filterGrade;
  });
  
  const getTeacherWorkload = (teacherId: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher?.assignedClasses?.length || 0;
  };
  
  const getWorkloadPercentage = (teacherId: string) => {
    // Assuming a full workload is 8 classes
    const maxClasses = 8;
    const currentClasses = getTeacherWorkload(teacherId);
    return Math.min(Math.round((currentClasses / maxClasses) * 100), 100);
  };
  
  const getWorkloadColor = (percentage: number) => {
    if (percentage < 40) return "bg-green-500";
    if (percentage < 80) return "bg-amber-500";
    return "bg-red-500";
  };
  
  const toggleAssignment = (teacherId: string, className: string) => {
    const teacher = getTeacherById(teacherId);
    if (!teacher) return;
    
    const currentAssignments = teacher.assignedClasses || [];
    let newAssignments: string[];
    
    if (currentAssignments.includes(className)) {
      // Remove assignment
      newAssignments = currentAssignments.filter(c => c !== className);
    } else {
      // Add assignment
      newAssignments = [...currentAssignments, className];
    }
    
    onUpdateAssignments(teacherId, newAssignments);
  };
  
  const toggleSubject = (teacherId: string, subject: string) => {
    const teacher = getTeacherById(teacherId);
    if (!teacher) return;
    
    const currentSubjects = teacher.subjects || [];
    let newSubjects: string[];
    
    if (currentSubjects.includes(subject)) {
      // Remove subject
      newSubjects = currentSubjects.filter(s => s !== subject);
    } else {
      // Add subject
      newSubjects = [...currentSubjects, subject];
    }
    
    onUpdateSubjects(teacherId, newSubjects);
  };
  
  const activeTeachers = teachers.filter(t => t.status !== 'inactive');
  const grades = [...new Set(allClasses.map(getClassGrade))];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">
            {language === 'en' ? 'Teacher Assignment Management' : 'إدارة تعيينات المعلمين'}
          </h2>
          <p className="text-muted-foreground">
            {language === 'en' 
              ? 'Manage class and subject assignments for teachers' 
              : 'إدارة تعيينات الفصول والمواد للمعلمين'}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={filterGrade} onValueChange={setFilterGrade}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={language === 'en' ? 'Filter by Grade' : 'تصفية حسب الصف'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {language === 'en' ? 'All Grades' : 'جميع الصفوف'}
              </SelectItem>
              {grades.map(grade => (
                <SelectItem key={grade} value={grade}>
                  {language === 'en' ? `Grade ${grade}` : `الصف ${grade}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'matrix' | 'list' | 'workload')}>
        <TabsList>
          <TabsTrigger value="matrix">
            <ScrollText className="h-4 w-4 mr-2" />
            {language === 'en' ? 'Assignment Matrix' : 'مصفوفة التعيينات'}
          </TabsTrigger>
          <TabsTrigger value="list">
            <BookOpen className="h-4 w-4 mr-2" />
            {language === 'en' ? 'Subject Management' : 'إدارة المواد'}
          </TabsTrigger>
          <TabsTrigger value="workload">
            <GraduationCap className="h-4 w-4 mr-2" />
            {language === 'en' ? 'Teacher Workload' : 'عبء العمل للمعلمين'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="matrix" className="border rounded-md p-4">
          <ScrollArea className="h-[600px]">
            <div className="w-full overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="sticky left-0 bg-background z-10">
                      {language === 'en' ? 'Teacher' : 'المعلم'}
                    </TableHead>
                    {filteredClasses.map(className => (
                      <TableHead key={className} className="text-center min-w-[70px]">
                        {className}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeTeachers.map(teacher => (
                    <TableRow key={teacher.id} className={selectedTeacher === teacher.id ? "bg-accent/50" : ""}>
                      <TableCell 
                        className="font-medium sticky left-0 bg-background z-10"
                        onClick={() => setSelectedTeacher(teacher.id === selectedTeacher ? null : teacher.id)}
                      >
                        <div className="flex items-center gap-2 cursor-pointer">
                          <Users className="h-4 w-4" />
                          <span>{teacher.name}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {teacher.subjects?.join(', ') || language === 'en' ? 'No subjects assigned' : 'لم يتم تعيين مواد'}
                        </div>
                      </TableCell>
                      {filteredClasses.map(className => {
                        const assigned = isAssigned(teacher.id, className);
                        return (
                          <TableCell 
                            key={`${teacher.id}-${className}`} 
                            className="text-center"
                          >
                            <Checkbox
                              checked={assigned}
                              onCheckedChange={() => toggleAssignment(teacher.id, className)}
                              className={assigned ? "data-[state=checked]:bg-primary" : ""}
                            />
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="list" className="border rounded-md p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeTeachers.map(teacher => (
              <Card key={teacher.id}>
                <CardHeader>
                  <CardTitle>{teacher.name}</CardTitle>
                  <CardDescription>{teacher.email}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        {language === 'en' ? 'Qualified to Teach:' : 'مؤهل للتدريس:'}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {allSubjects.map(subject => (
                          <Badge 
                            key={subject}
                            variant={canTeachSubject(teacher.id, subject) ? "default" : "outline"}
                            className="cursor-pointer hover:bg-accent transition-colors"
                            onClick={() => toggleSubject(teacher.id, subject)}
                          >
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        {language === 'en' ? 'Currently Teaching:' : 'يدرس حالياً:'}
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {teacher.assignedClasses && teacher.assignedClasses.length > 0 ? (
                          teacher.assignedClasses.map(className => (
                            <Badge key={className} variant="secondary">
                              {className}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            {language === 'en' ? 'No classes assigned' : 'لم يتم تعيين فصول'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="workload" className="border rounded-md p-4">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeTeachers.map(teacher => {
                const workload = getTeacherWorkload(teacher.id);
                const percentage = getWorkloadPercentage(teacher.id);
                return (
                  <Card key={teacher.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{teacher.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {teacher.subjects?.join(', ')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>
                            {language === 'en' ? 'Classes:' : 'الفصول:'} {workload}
                          </span>
                          <span className={percentage > 75 ? "text-red-500" : ""}>
                            {percentage}%
                          </span>
                        </div>
                        <Progress value={percentage} className={getWorkloadColor(percentage)} />
                        
                        <div className="pt-2">
                          <h4 className="text-xs font-medium mb-1">
                            {language === 'en' ? 'Assigned Classes:' : 'الفصول المعينة:'}
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {teacher.assignedClasses && teacher.assignedClasses.length > 0 ? (
                              teacher.assignedClasses.map(className => (
                                <Badge key={className} variant="outline" className="text-xs">
                                  {className}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                {language === 'en' ? 'None' : 'لا يوجد'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">
                {language === 'en' ? 'Workload Summary' : 'ملخص عبء العمل'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border rounded p-3 text-center">
                  <div className="text-3xl font-bold">{activeTeachers.length}</div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'en' ? 'Active Teachers' : 'المعلمين النشطين'}
                  </div>
                </div>
                
                <div className="border rounded p-3 text-center">
                  <div className="text-3xl font-bold">{filteredClasses.length}</div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'en' ? 'Total Classes' : 'إجمالي الفصول'}
                  </div>
                </div>
                
                <div className="border rounded p-3 text-center">
                  <div className="text-3xl font-bold">{allSubjects.length}</div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'en' ? 'Subjects' : 'المواد'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeacherAssignmentMatrix;
