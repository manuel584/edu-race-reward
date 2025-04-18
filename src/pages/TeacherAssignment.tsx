
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';
import { 
  Home, 
  Users, 
  CalendarDays, 
  AlertTriangle, 
  Clock, 
  History
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Teacher } from '@/types/teacher';
import { 
  TeacherFilters as TeacherFiltersType,
  TeacherAssignmentStats,
  AssignmentValidation,
  AssignmentPeriod
} from '@/types/teacherAssignment';
import TeacherFilters from '@/components/TeacherFilters';
import TeacherList from '@/components/TeacherList';
import TeacherAssignmentPanel from '@/components/TeacherAssignmentPanel';
import AssignmentHistory from '@/components/AssignmentHistory';
import WorkloadChart from '@/components/WorkloadChart';
import { cn } from '@/lib/utils';

const TeacherAssignment = () => {
  const { language } = useAppContext();
  const t = getTranslations(language);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<TeacherFiltersType>({});
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [activeView, setActiveView] = useState<'list' | 'assignment'>('list');
  const [currentPeriod, setCurrentPeriod] = useState<AssignmentPeriod>({
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 10)).toISOString(),
    term: 'full-year'
  });
  
  // Sample data - in a real app, this would come from an API
  const [teachers, setTeachers] = useState<Teacher[]>([
    // Using the sample data from TeacherManagement.tsx
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@school.edu',
      role: 'teacher',
      department: 'Science',
      subjects: ['Biology', 'Chemistry'],
      qualifications: [
        { subject: 'Biology', level: 'Advanced', yearsOfExperience: 8, certifications: ['National Board Certification'] },
        { subject: 'Chemistry', level: 'Intermediate', yearsOfExperience: 5 }
      ],
      assignedClasses: [
        { 
          id: 'c1', 
          className: '10A', 
          grade: 'Grade 10', 
          subject: 'Biology', 
          schedule: [
            { day: 'monday', startTime: '09:00', endTime: '10:30' },
            { day: 'wednesday', startTime: '09:00', endTime: '10:30' }
          ],
          room: 'Lab 3'
        }
      ],
      maxWeeklyHours: 30,
      weeklyHours: 12,
      status: 'active',
      hasChangedInitialPassword: true,
      createdAt: '2023-08-15T00:00:00.000Z'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@school.edu',
      role: 'teacher',
      department: 'Mathematics',
      subjects: ['Algebra', 'Calculus'],
      qualifications: [
        { subject: 'Mathematics', level: 'Advanced', yearsOfExperience: 10 }
      ],
      assignedClasses: [
        { 
          id: 'c2', 
          className: '11B', 
          grade: 'Grade 11', 
          subject: 'Calculus', 
          schedule: [
            { day: 'tuesday', startTime: '11:00', endTime: '12:30' },
            { day: 'thursday', startTime: '11:00', endTime: '12:30' }
          ],
          room: 'Room 201'
        }
      ],
      maxWeeklyHours: 25,
      weeklyHours: 8,
      status: 'active',
      hasChangedInitialPassword: true,
      createdAt: '2023-09-01T00:00:00.000Z'
    }
  ]);
  
  // Filter teachers based on search and filters
  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = (
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const matchesDepartment = !filters.department || teacher.department === filters.department;
    const matchesGrade = !filters.grade || teacher.assignedClasses.some(cls => cls.grade === filters.grade);
    const matchesSubject = !filters.subject || teacher.subjects.includes(filters.subject);
    const matchesStatus = !filters.status || teacher.status === filters.status;

    return matchesSearch && matchesDepartment && matchesGrade && matchesSubject && matchesStatus;
  });
  
  // Get selected teacher objects
  const selectedTeacherObjects = teachers.filter(teacher => 
    selectedTeachers.includes(teacher.id)
  );
  
  // Breadcrumb items for navigation
  const breadcrumbItems = [
    { label: t.home || 'Home', path: '/', icon: <Home className="h-4 w-4" /> },
    { label: t.teacherManagement || 'Teacher Management', path: '/teacher-management' },
    { label: t.assignTeachers || 'Assign Teachers' },
  ];
  
  // Handle teacher selection/deselection
  const handleTeacherSelect = (teacherId: string) => {
    setSelectedTeachers(prev => {
      if (prev.includes(teacherId)) {
        return prev.filter(id => id !== teacherId);
      }
      return [...prev, teacherId];
    });
  };
  
  // Handle assigning teachers to classes
  const handleAssignTeachers = (assignmentData: any) => {
    // In a real app, this would be an API call
    toast.success(
      language === 'en' 
        ? 'Teachers have been assigned successfully'
        : 'تم تعيين المعلمين بنجاح'
    );
    
    // Update the teachers list with new assignments
    // This is a simple mock implementation
    setTeachers(prev => 
      prev.map(teacher => {
        if (selectedTeachers.includes(teacher.id)) {
          // Update teacher assignments (simplified)
          return {
            ...teacher,
            assignedClasses: [
              ...teacher.assignedClasses,
              // Add new assignments
            ]
          };
        }
        return teacher;
      })
    );
    
    // Reset selection and go back to list view
    setSelectedTeachers([]);
    setActiveView('list');
  };
  
  // Handle bulk actions on teachers
  const handleBulkAction = (action: 'assign' | 'copy' | 'remove') => {
    if (selectedTeachers.length === 0) {
      toast.error(
        language === 'en'
          ? 'Please select at least one teacher'
          : 'الرجاء تحديد معلم واحد على الأقل'
      );
      return;
    }
    
    if (action === 'assign') {
      setActiveView('assignment');
    } else if (action === 'copy') {
      // Show UI for copying assignments
      toast.info(
        language === 'en'
          ? 'Copy assignment feature will be implemented soon'
          : 'سيتم تنفيذ ميزة نسخ التعيين قريبًا'
      );
    } else if (action === 'remove') {
      // Show confirmation dialog for removing assignments
      if (window.confirm(
        language === 'en'
          ? 'Are you sure you want to remove all assignments for the selected teachers?'
          : 'هل أنت متأكد أنك تريد إزالة جميع التعيينات للمعلمين المحددين؟'
      )) {
        // Remove assignments
        setTeachers(prev => 
          prev.map(teacher => {
            if (selectedTeachers.includes(teacher.id)) {
              return {
                ...teacher,
                assignedClasses: []
              };
            }
            return teacher;
          })
        );
        
        toast.success(
          language === 'en'
            ? 'Assignments removed successfully'
            : 'تمت إزالة التعيينات بنجاح'
        );
        
        setSelectedTeachers([]);
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="page-container">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-3xl font-display font-bold text-foreground">
              {language === 'en' ? 'Teacher Assignment' : 'تعيين المعلمين'}
            </h1>
            
            <div className="flex space-x-2 mt-4 md:mt-0">
              <Button 
                onClick={() => handleBulkAction('assign')}
                disabled={selectedTeachers.length === 0}
              >
                <CalendarDays className="h-4 w-4 mr-2" />
                {language === 'en' ? 'Assign Selected' : 'تعيين المحددين'}
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => handleBulkAction('copy')}
                disabled={selectedTeachers.length === 0}
              >
                {language === 'en' ? 'Copy Assignments' : 'نسخ التعيينات'}
              </Button>
              
              <Button 
                variant="destructive"
                onClick={() => handleBulkAction('remove')}
                disabled={selectedTeachers.length === 0}
              >
                {language === 'en' ? 'Remove Assignments' : 'إزالة التعيينات'}
              </Button>
            </div>
          </div>
          
          {activeView === 'list' ? (
            <>
              <TeacherFilters
                filters={filters}
                onFilterChange={setFilters}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                language={language}
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="lg:col-span-2">
                  <TeacherList
                    teachers={filteredTeachers}
                    selectedTeachers={selectedTeachers}
                    onTeacherSelect={handleTeacherSelect}
                    language={language}
                  />
                </div>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {language === 'en' ? 'Assignment Summary' : 'ملخص التعيينات'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b">
                          <span>{language === 'en' ? 'Selected Teachers:' : 'المعلمون المحددون:'}</span>
                          <Badge>{selectedTeachers.length}</Badge>
                        </div>
                        
                        <div className="flex justify-between items-center py-2 border-b">
                          <span>{language === 'en' ? 'Current Term:' : 'الفصل الدراسي الحالي:'}</span>
                          <Badge variant="outline">
                            {currentPeriod.term === 'full-year' 
                              ? (language === 'en' ? 'Full Year' : 'السنة الكاملة')
                              : currentPeriod.term === 'semester-1'
                              ? (language === 'en' ? 'First Semester' : 'الفصل الأول')
                              : currentPeriod.term === 'semester-2'
                              ? (language === 'en' ? 'Second Semester' : 'الفصل الثاني')
                              : (language === 'en' ? 'Custom Period' : 'فترة مخصصة')}
                          </Badge>
                        </div>
                        
                        {selectedTeachers.length > 0 && (
                          <div className="mt-4">
                            <h3 className="font-medium mb-2">
                              {language === 'en' ? 'Selected Teachers:' : 'المعلمون المحددون:'}
                            </h3>
                            <div className="max-h-40 overflow-y-auto">
                              {selectedTeacherObjects.map(teacher => (
                                <div 
                                  key={teacher.id}
                                  className="flex justify-between items-center py-2 border-b last:border-0"
                                >
                                  <div className="flex items-center">
                                    <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                                    <span>{teacher.name}</span>
                                  </div>
                                  <Badge variant="outline">{teacher.department}</Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <Button
                          className="w-full mt-4"
                          onClick={() => setActiveView('assignment')}
                          disabled={selectedTeachers.length === 0}
                        >
                          {language === 'en' ? 'Proceed to Assignment' : 'المتابعة للتعيين'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {language === 'en' ? 'Assignment Validation' : 'التحقق من التعيين'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedTeachers.length > 0 ? (
                        <div className="space-y-3">
                          {selectedTeacherObjects.map(teacher => {
                            // Simple validation logic - in a real app this would be more sophisticated
                            const hasConflict = false;
                            const isQualified = true;
                            const workload = teacher.weeklyHours || 0;
                            const maxHours = teacher.maxWeeklyHours || 30;
                            const workloadStatus = 
                              workload < maxHours * 0.5 ? 'light' :
                              workload < maxHours * 0.8 ? 'optimal' :
                              workload < maxHours ? 'heavy' : 'overloaded';
                            
                            return (
                              <div 
                                key={teacher.id}
                                className={cn(
                                  "p-3 rounded-md border",
                                  hasConflict || workloadStatus === 'overloaded' 
                                    ? "border-red-200 bg-red-50 dark:bg-red-950/10 dark:border-red-900"
                                    : "border-green-200 bg-green-50 dark:bg-green-950/10 dark:border-green-900"
                                )}
                              >
                                <h4 className="font-medium">{teacher.name}</h4>
                                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    <span>
                                      {workload}/{maxHours} {language === 'en' ? 'hrs' : 'ساعة'}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    {workloadStatus === 'optimal' ? (
                                      <Badge variant="outline" className="bg-green-100 dark:bg-green-900 border-green-200 dark:border-green-800">
                                        {language === 'en' ? 'Optimal' : 'مثالي'}
                                      </Badge>
                                    ) : workloadStatus === 'light' ? (
                                      <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 border-blue-200 dark:border-blue-800">
                                        {language === 'en' ? 'Light' : 'خفيف'}
                                      </Badge>
                                    ) : workloadStatus === 'heavy' ? (
                                      <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-800">
                                        {language === 'en' ? 'Heavy' : 'ثقيل'}
                                      </Badge>
                                    ) : (
                                      <Badge variant="outline" className="bg-red-100 dark:bg-red-900 border-red-200 dark:border-red-800">
                                        {language === 'en' ? 'Overloaded' : 'زائد'}
                                      </Badge>
                                    )}
                                  </div>
                                  {hasConflict && (
                                    <div className="col-span-2 flex items-center text-red-600 dark:text-red-400">
                                      <AlertTriangle className="h-4 w-4 mr-1" />
                                      <span>{language === 'en' ? 'Schedule conflict' : 'تعارض في الجدول'}</span>
                                    </div>
                                  )}
                                  {!isQualified && (
                                    <div className="col-span-2 flex items-center text-yellow-600 dark:text-yellow-400">
                                      <AlertTriangle className="h-4 w-4 mr-1" />
                                      <span>{language === 'en' ? 'Missing qualification' : 'مؤهل مفقود'}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-muted-foreground">
                          {language === 'en' 
                            ? 'Select teachers to see validation status'
                            : 'حدد المعلمين لرؤية حالة التحقق'
                          }
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="mt-8">
                <Tabs defaultValue="workload">
                  <TabsList>
                    <TabsTrigger value="workload">
                      {language === 'en' ? 'Workload Analysis' : 'تحليل عبء العمل'}
                    </TabsTrigger>
                    <TabsTrigger value="history">
                      {language === 'en' ? 'Assignment History' : 'سجل التعيين'}
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="workload" className="mt-4">
                    <Card>
                      <CardContent className="pt-6">
                        <WorkloadChart 
                          data={teachers.map(teacher => ({
                            teacherId: teacher.id,
                            teacherName: teacher.name,
                            totalAssignedHours: teacher.weeklyHours || 0,
                            subjectDistribution: teacher.subjects.reduce((acc, subject) => {
                              acc[subject] = 5; // Simplified data
                              return acc;
                            }, {} as Record<string, number>),
                            gradeDistribution: teacher.assignedClasses.reduce((acc, cls) => {
                              acc[cls.grade] = (acc[cls.grade] || 0) + 5; // Simplified data
                              return acc;
                            }, {} as Record<string, number>),
                            remainingCapacity: (teacher.maxWeeklyHours || 30) - (teacher.weeklyHours || 0)
                          }))}
                          type="hours"
                          language={language}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="history" className="mt-4">
                    <Card>
                      <CardContent className="pt-6">
                        <AssignmentHistory teachers={teachers} language={language} />
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </>
          ) : (
            <TeacherAssignmentPanel
              teachers={selectedTeacherObjects}
              onAssign={handleAssignTeachers}
              onCancel={() => setActiveView('list')}
              language={language}
            />
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default TeacherAssignment;
