
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';
import { Home, User, UserPlus, Search, Trash2, PencilLine, BookOpen, Calendar, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Teacher } from '@/types/teacher';
import { generateUUID } from '@/lib/uuid';
import TeacherForm from '@/components/TeacherForm';
import TeacherCard from '@/components/TeacherCard';
import WorkloadChart from '@/components/WorkloadChart';
import { toast } from 'sonner';

const TeacherManagement = () => {
  const { language } = useAppContext();
  const t = getTranslations(language);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  
  // Sample teachers data - this would come from your context in a real implementation
  const [teachers, setTeachers] = useState<Teacher[]>([
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

  // Filter teachers based on search term and selected tab
  const filteredTeachers = teachers.filter(teacher => 
    (teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     teacher.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     teacher.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()))) &&
    (selectedTab === 'all' || teacher.status === selectedTab)
  );

  // Generate breadcrumb items
  const breadcrumbItems = [
    { label: t.home || 'Home', path: '/', icon: <Home className="h-4 w-4" /> },
    { label: t.teacherManagement || 'Teacher Management' },
  ];

  const handleAddTeacher = (teacherData: Partial<Teacher>) => {
    const newTeacher: Teacher = {
      ...teacherData as Teacher,
      id: generateUUID(),
      role: 'teacher',
      assignedClasses: teacherData.assignedClasses || [],
      qualifications: teacherData.qualifications || [],
      subjects: teacherData.subjects || [],
      status: 'active',
      hasChangedInitialPassword: false,
      createdAt: new Date().toISOString(),
    };
    
    setTeachers(prev => [...prev, newTeacher]);
    setIsDialogOpen(false);
    toast.success(language === 'en' ? 'Teacher added successfully' : 'تمت إضافة المعلم بنجاح');
  };

  const handleEditTeacher = (teacherData: Partial<Teacher>) => {
    if (!selectedTeacher) return;
    
    setTeachers(prev => prev.map(teacher => 
      teacher.id === selectedTeacher.id ? 
        { ...teacher, ...teacherData } : 
        teacher
    ));
    
    setSelectedTeacher(null);
    setIsDialogOpen(false);
    toast.success(language === 'en' ? 'Teacher updated successfully' : 'تم تحديث بيانات المعلم بنجاح');
  };

  const handleDeleteTeacher = (id: string) => {
    if (window.confirm(language === 'en' ? 'Are you sure you want to delete this teacher?' : 'هل أنت متأكد من حذف هذا المعلم؟')) {
      setTeachers(prev => prev.filter(teacher => teacher.id !== id));
      toast.success(language === 'en' ? 'Teacher deleted successfully' : 'تم حذف المعلم بنجاح');
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
              {t.teacherManagement || 'Teacher Management'}
            </h1>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="mt-4 md:mt-0">
                  <UserPlus className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'Add New Teacher' : 'إضافة معلم جديد'}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {selectedTeacher 
                      ? (language === 'en' ? 'Edit Teacher' : 'تعديل معلم') 
                      : (language === 'en' ? 'Add New Teacher' : 'إضافة معلم جديد')
                    }
                  </DialogTitle>
                </DialogHeader>
                <TeacherForm 
                  teacher={selectedTeacher}
                  onSubmit={selectedTeacher ? handleEditTeacher : handleAddTeacher}
                />
              </DialogContent>
            </Dialog>
          </div>
          
          <Tabs 
            defaultValue="all" 
            value={selectedTab} 
            onValueChange={setSelectedTab}
            className="mb-6"
          >
            <TabsList className="w-full sm:w-auto mb-4">
              <TabsTrigger value="all">
                {language === 'en' ? 'All Teachers' : 'جميع المعلمين'}
              </TabsTrigger>
              <TabsTrigger value="active">
                {language === 'en' ? 'Active' : 'نشط'}
              </TabsTrigger>
              <TabsTrigger value="inactive">
                {language === 'en' ? 'Inactive' : 'غير نشط'}
              </TabsTrigger>
              <TabsTrigger value="on-leave">
                {language === 'en' ? 'On Leave' : 'في إجازة'}
              </TabsTrigger>
            </TabsList>
            
            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={language === 'en' ? 'Search teachers...' : 'البحث عن المعلمين...'}
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <TabsContent value="all" className="mt-0">
              <TeacherManagementContent 
                teachers={filteredTeachers} 
                onEdit={(teacher) => {
                  setSelectedTeacher(teacher);
                  setIsDialogOpen(true);
                }}
                onDelete={handleDeleteTeacher}
                language={language}
              />
            </TabsContent>
            <TabsContent value="active" className="mt-0">
              <TeacherManagementContent 
                teachers={filteredTeachers} 
                onEdit={(teacher) => {
                  setSelectedTeacher(teacher);
                  setIsDialogOpen(true);
                }}
                onDelete={handleDeleteTeacher}
                language={language}
              />
            </TabsContent>
            <TabsContent value="inactive" className="mt-0">
              <TeacherManagementContent 
                teachers={filteredTeachers} 
                onEdit={(teacher) => {
                  setSelectedTeacher(teacher);
                  setIsDialogOpen(true);
                }}
                onDelete={handleDeleteTeacher}
                language={language}
              />
            </TabsContent>
            <TabsContent value="on-leave" className="mt-0">
              <TeacherManagementContent 
                teachers={filteredTeachers} 
                onEdit={(teacher) => {
                  setSelectedTeacher(teacher);
                  setIsDialogOpen(true);
                }}
                onDelete={handleDeleteTeacher}
                language={language}
              />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

// Component for the content in each tab
interface TeacherManagementContentProps {
  teachers: Teacher[];
  onEdit: (teacher: Teacher) => void;
  onDelete: (id: string) => void;
  language: string;
}

const TeacherManagementContent: React.FC<TeacherManagementContentProps> = ({ 
  teachers, 
  onEdit, 
  onDelete,
  language
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'cards' | 'workload'>('table');
  
  // Calculate workload statistics for visualization
  const workloadData = teachers.map(teacher => {
    const subjectDistribution: Record<string, number> = {};
    const gradeDistribution: Record<string, number> = {};
    
    let totalHours = 0;
    
    teacher.assignedClasses.forEach(cls => {
      // Calculate hours for this class
      const classHours = cls.schedule.reduce((total, session) => {
        const start = new Date(`1970-01-01T${session.startTime}:00`);
        const end = new Date(`1970-01-01T${session.endTime}:00`);
        const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        return total + durationHours;
      }, 0);
      
      totalHours += classHours;
      
      // Add to subject distribution
      if (subjectDistribution[cls.subject]) {
        subjectDistribution[cls.subject] += classHours;
      } else {
        subjectDistribution[cls.subject] = classHours;
      }
      
      // Add to grade distribution
      if (gradeDistribution[cls.grade]) {
        gradeDistribution[cls.grade] += classHours;
      } else {
        gradeDistribution[cls.grade] = classHours;
      }
    });
    
    return {
      teacherId: teacher.id,
      teacherName: teacher.name,
      totalAssignedHours: totalHours,
      subjectDistribution,
      gradeDistribution,
      remainingCapacity: (teacher.maxWeeklyHours || 30) - totalHours
    };
  });
  
  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-6">
        <Button 
          variant={viewMode === 'table' ? 'default' : 'outline'} 
          onClick={() => setViewMode('table')}
          size="sm"
        >
          {language === 'en' ? 'Table View' : 'عرض جدولي'}
        </Button>
        <Button 
          variant={viewMode === 'cards' ? 'default' : 'outline'} 
          onClick={() => setViewMode('cards')}
          size="sm"
        >
          {language === 'en' ? 'Card View' : 'عرض البطاقات'}
        </Button>
        <Button 
          variant={viewMode === 'workload' ? 'default' : 'outline'} 
          onClick={() => setViewMode('workload')}
          size="sm"
        >
          {language === 'en' ? 'Workload View' : 'عرض الحمل التدريسي'}
        </Button>
      </div>
      
      {viewMode === 'table' && (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{language === 'en' ? 'Teacher Name' : 'اسم المعلم'}</TableHead>
                <TableHead>{language === 'en' ? 'Email' : 'البريد الإلكتروني'}</TableHead>
                <TableHead>{language === 'en' ? 'Department' : 'القسم'}</TableHead>
                <TableHead>{language === 'en' ? 'Subjects' : 'المواد'}</TableHead>
                <TableHead>{language === 'en' ? 'Classes' : 'الفصول'}</TableHead>
                <TableHead>{language === 'en' ? 'Status' : 'الحالة'}</TableHead>
                <TableHead className="text-right">{language === 'en' ? 'Actions' : 'الإجراءات'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.length > 0 ? (
                teachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell className="font-medium">{teacher.name}</TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>{teacher.department || '—'}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {teacher.subjects.map((subject, idx) => (
                          <Badge key={idx} variant="outline">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {teacher.assignedClasses.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {teacher.assignedClasses.map((cls, idx) => (
                            <Badge key={idx} variant="secondary">
                              {cls.className} ({cls.subject})
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic">
                          {language === 'en' ? 'No classes assigned' : 'لا توجد فصول مخصصة'}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        teacher.status === 'active' ? 'default' : 
                        teacher.status === 'inactive' ? 'destructive' : 
                        'outline'
                      }>
                        {teacher.status === 'active' ? (language === 'en' ? 'Active' : 'نشط') : 
                         teacher.status === 'inactive' ? (language === 'en' ? 'Inactive' : 'غير نشط') : 
                         (language === 'en' ? 'On Leave' : 'في إجازة')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onEdit(teacher)}
                        >
                          <PencilLine className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500"
                          onClick={() => onDelete(teacher.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    {language === 'en' ? 'No teachers found.' : 'لم يتم العثور على معلمين.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.length > 0 ? (
            teachers.map(teacher => (
              <TeacherCard
                key={teacher.id}
                teacher={teacher}
                onEdit={() => onEdit(teacher)}
                onDelete={() => onDelete(teacher.id)}
                language={language}
              />
            ))
          ) : (
            <div className="col-span-3 text-center py-12 border rounded-lg bg-gray-50 dark:bg-gray-900">
              {language === 'en' ? 'No teachers found.' : 'لم يتم العثور على معلمين.'}
            </div>
          )}
        </div>
      )}
      
      {viewMode === 'workload' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Weekly Teaching Hours' : 'ساعات التدريس الأسبوعية'}</CardTitle>
              <CardDescription>
                {language === 'en' 
                  ? 'Distribution of teaching hours per teacher' 
                  : 'توزيع ساعات التدريس لكل معلم'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WorkloadChart 
                data={workloadData}
                type="hours"
                language={language}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Subject Distribution' : 'توزيع المواد'}</CardTitle>
              <CardDescription>
                {language === 'en' 
                  ? 'Number of teachers per subject' 
                  : 'عدد المعلمين لكل مادة'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WorkloadChart 
                data={workloadData}
                type="subjects"
                language={language}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TeacherManagement;
