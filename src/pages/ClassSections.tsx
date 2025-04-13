
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';
import { Home, Plus, Search, Trash2, PencilLine, GraduationCap, Users, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

// Define section type
type Section = {
  id: string;
  name: string;
  grade: string;
  capacity: number;
  teacherId?: string;
  teacherName?: string;
  studentCount: number;
  subjects: string[];
};

const ClassSections = () => {
  const { language, students, deleteStudentsByClass } = useAppContext();
  const t = getTranslations(language);
  const [searchTerm, setSearchTerm] = useState('');
  const [sectionToDelete, setSectionToDelete] = useState<Section | null>(null);
  const [deletionType, setDeletionType] = useState<'structure' | 'all'>('structure');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Example section data
  const [sections, setSections] = useState<Section[]>([
    {
      id: '1',
      name: '5A',
      grade: '5',
      capacity: 30,
      teacherId: '3',
      teacherName: 'Ahmed Ali',
      studentCount: 27,
      subjects: ['Math', 'Science', 'English', 'History']
    },
    {
      id: '2',
      name: '5B',
      grade: '5',
      capacity: 30,
      teacherId: '5',
      teacherName: 'Lisa Wong',
      studentCount: 25,
      subjects: ['Math', 'Science', 'English', 'Geography']
    },
    {
      id: '3',
      name: '6A',
      grade: '6',
      capacity: 25,
      teacherId: '3',
      teacherName: 'Ahmed Ali',
      studentCount: 22,
      subjects: ['Math', 'Physics', 'English', 'History']
    },
    {
      id: '4',
      name: '6B',
      grade: '6',
      capacity: 25,
      teacherId: '6',
      teacherName: 'Michael Brown',
      studentCount: 24,
      subjects: ['Math', 'Physics', 'English', 'Geography']
    }
  ]);
  
  // Get unique grades
  const grades = [...new Set(sections.map(s => s.grade))].sort();
  
  // Filter sections based on search term
  const filteredSections = sections.filter(section => 
    section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (section.teacherName && section.teacherName.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Group sections by grade
  const sectionsByGrade: { [key: string]: Section[] } = {};
  filteredSections.forEach(section => {
    if (!sectionsByGrade[section.grade]) {
      sectionsByGrade[section.grade] = [];
    }
    sectionsByGrade[section.grade].push(section);
  });
  
  // Generate breadcrumb items
  const breadcrumbItems = [
    { label: t.home || 'Home', path: '/', icon: <Home className="h-4 w-4" /> },
    { label: t.classSections || 'Class Sections' },
  ];

  // Handle deletion
  const handleDeleteSection = (section: Section, type: 'structure' | 'all') => {
    setSectionToDelete(section);
    setDeletionType(type);
    setShowDeleteConfirm(true);
  };

  // Confirm deletion
  const confirmDeletion = () => {
    if (!sectionToDelete) return;

    if (deletionType === 'all') {
      // Delete students associated with this class
      deleteStudentsByClass(`${sectionToDelete.grade}${sectionToDelete.name}`);
    }
    
    // Remove the section
    setSections(prev => prev.filter(s => s.id !== sectionToDelete.id));
    
    toast.success(`${language === 'en' ? 'Class deleted successfully' : 'تم حذف الفصل بنجاح'}`);
    setShowDeleteConfirm(false);
    setSectionToDelete(null);
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
              {t.classSections || 'Class Sections'}
            </h1>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mt-4 md:mt-0">
                  <Plus className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'Create New Section' : 'إنشاء قسم جديد'}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {language === 'en' ? 'Create New Section' : 'إنشاء قسم جديد'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none">
                        {language === 'en' ? 'Grade' : 'الصف'}
                      </label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder={language === 'en' ? 'Select grade' : 'اختر الصف'} />
                        </SelectTrigger>
                        <SelectContent>
                          {grades.map(grade => (
                            <SelectItem key={grade} value={grade}>
                              {grade}
                            </SelectItem>
                          ))}
                          <SelectItem value="new">
                            {language === 'en' ? '+ Add New Grade' : '+ إضافة صف جديد'}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none">
                        {language === 'en' ? 'Section Name' : 'اسم القسم'}
                      </label>
                      <Input placeholder={language === 'en' ? 'e.g., 5A' : 'مثال: 5أ'} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">
                      {language === 'en' ? 'Capacity' : 'السعة'}
                    </label>
                    <Input type="number" placeholder="30" min="1" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">
                      {language === 'en' ? 'Assign Teacher' : 'تعيين المعلم'}
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'en' ? 'Select teacher' : 'اختر المعلم'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">Ahmed Ali</SelectItem>
                        <SelectItem value="5">Lisa Wong</SelectItem>
                        <SelectItem value="6">Michael Brown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="pt-4 flex justify-end space-x-2">
                    <Button>
                      {language === 'en' ? 'Create Section' : 'إنشاء القسم'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={language === 'en' ? 'Search sections...' : 'البحث عن الأقسام...'}
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {Object.entries(sectionsByGrade).length > 0 ? (
              Object.entries(sectionsByGrade)
                .sort(([gradeA], [gradeB]) => gradeA.localeCompare(gradeB))
                .map(([grade, sections]) => (
                  <div key={grade} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      <h2 className="text-xl font-semibold">
                        {language === 'en' ? `Grade ${grade}` : `الصف ${grade}`}
                      </h2>
                      <Badge>
                        {sections.length} {language === 'en' ? 'sections' : 'أقسام'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {sections.map(section => (
                        <Card key={section.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg">{section.name}</CardTitle>
                                <CardDescription>
                                  {language === 'en' ? 'Capacity' : 'السعة'}: {section.studentCount}/{section.capacity}
                                </CardDescription>
                              </div>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="icon">
                                  <PencilLine className="h-4 w-4" />
                                </Button>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-red-500">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle className="text-center">
                                        {language === 'en' ? 'Delete Class' : 'حذف الفصل'}
                                      </DialogTitle>
                                      <DialogDescription className="text-center">
                                        {language === 'en' 
                                          ? `You are about to delete ${section.name} with ${section.studentCount} students` 
                                          : `أنت على وشك حذف ${section.name} مع ${section.studentCount} طالب`}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-md mb-4">
                                      <div className="flex items-start gap-3">
                                        <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm text-amber-800">
                                          {language === 'en' 
                                            ? 'This will remove all class data including grades and recognitions.' 
                                            : 'سيؤدي هذا إلى إزالة جميع بيانات الفصل بما في ذلك الدرجات والتقديرات.'}
                                        </p>
                                      </div>
                                    </div>
                                    <p className="text-sm text-center mb-4">
                                      {language === 'en' 
                                        ? 'Choose how you want to delete this class:' 
                                        : 'اختر كيفية حذف هذا الفصل:'}
                                    </p>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                      <Button 
                                        variant="outline" 
                                        className="p-4 h-auto flex flex-col items-center gap-2"
                                        onClick={() => handleDeleteSection(section, 'structure')}
                                      >
                                        <GraduationCap className="h-6 w-6" />
                                        <span className="font-medium">
                                          {language === 'en' ? 'Delete Structure Only' : 'حذف الهيكل فقط'}
                                        </span>
                                        <span className="text-xs text-center text-gray-500">
                                          {language === 'en' 
                                            ? 'Keep all student records' 
                                            : 'الاحتفاظ بجميع سجلات الطلاب'}
                                        </span>
                                      </Button>
                                      <Button 
                                        variant="destructive" 
                                        className="p-4 h-auto flex flex-col items-center gap-2"
                                        onClick={() => handleDeleteSection(section, 'all')}
                                      >
                                        <Trash2 className="h-6 w-6" />
                                        <span className="font-medium">
                                          {language === 'en' ? 'Delete All Data' : 'حذف جميع البيانات'}
                                        </span>
                                        <span className="text-xs text-center text-gray-200">
                                          {language === 'en' 
                                            ? 'Remove students as well' 
                                            : 'إزالة الطلاب أيضًا'}
                                        </span>
                                      </Button>
                                    </div>
                                    <DialogFooter>
                                      <Button variant="outline">
                                        {language === 'en' ? 'Cancel' : 'إلغاء'}
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                  {section.studentCount} {language === 'en' ? 'students' : 'طالب'}
                                </span>
                                <Badge variant="outline" className="ml-auto">
                                  {Math.round((section.studentCount / section.capacity) * 100)}% {language === 'en' ? 'full' : 'ممتلئ'}
                                </Badge>
                              </div>
                              
                              {section.teacherName && (
                                <div className="text-sm">
                                  <span className="text-muted-foreground">
                                    {language === 'en' ? 'Teacher: ' : 'المعلم: '}
                                  </span>
                                  {section.teacherName}
                                </div>
                              )}
                              
                              <Separator />
                              
                              <div>
                                <span className="text-sm text-muted-foreground">
                                  {language === 'en' ? 'Subjects:' : 'المواد:'}
                                </span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {section.subjects.map(subject => (
                                    <Badge key={subject} variant="secondary" className="text-xs">
                                      {subject}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button variant="outline" size="sm" className="w-full">
                              {language === 'en' ? 'Manage Students' : 'إدارة الطلاب'}
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                      
                      {/* Add section card */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Card className="border-dashed cursor-pointer hover:bg-muted/30 transition-colors">
                            <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px]">
                              <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-muted-foreground font-medium">
                                {language === 'en' ? `Add Section to Grade ${grade}` : `إضافة قسم للصف ${grade}`}
                              </p>
                            </CardContent>
                          </Card>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>
                              {language === 'en' ? `Add Section to Grade ${grade}` : `إضافة قسم للصف ${grade}`}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="col-span-2 space-y-2">
                                <label className="text-sm font-medium leading-none">
                                  {language === 'en' ? 'Section Name' : 'اسم القسم'}
                                </label>
                                <Input placeholder={language === 'en' ? 'e.g., 5C' : 'مثال: 5ج'} />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium leading-none">
                                {language === 'en' ? 'Capacity' : 'السعة'}
                              </label>
                              <Input type="number" placeholder="30" min="1" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium leading-none">
                                {language === 'en' ? 'Assign Teacher' : 'تعيين المعلم'}
                              </label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder={language === 'en' ? 'Select teacher' : 'اختر المعلم'} />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="3">Ahmed Ali</SelectItem>
                                  <SelectItem value="5">Lisa Wong</SelectItem>
                                  <SelectItem value="6">Michael Brown</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="pt-4 flex justify-end space-x-2">
                              <Button>
                                {language === 'en' ? 'Create Section' : 'إنشاء القسم'}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                {language === 'en' ? 'No sections found.' : 'لم يتم العثور على أقسام.'}
              </div>
            )}
          </div>
        </motion.div>
      </main>

      {/* Final Confirmation Alert Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">
              {language === 'en' ? 'Confirm Deletion' : 'تأكيد الحذف'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              {language === 'en' 
                ? `Are you sure you want to ${deletionType === 'all' ? 'delete' : 'remove'} ${sectionToDelete?.name}?`
                : `هل أنت متأكد أنك تريد ${deletionType === 'all' ? 'حذف' : 'إزالة'} ${sectionToDelete?.name}؟`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="p-4 bg-red-50 border border-red-200 rounded-md mb-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-800">
                {deletionType === 'all'
                  ? language === 'en'
                    ? `This will permanently delete ${sectionToDelete?.studentCount} student records and cannot be undone.`
                    : `سيؤدي هذا إلى حذف سجلات ${sectionToDelete?.studentCount} طالب بشكل دائم ولا يمكن التراجع عنه.`
                  : language === 'en'
                    ? 'The class structure will be removed, but student records will be preserved.'
                    : 'سيتم إزالة هيكل الفصل، ولكن سيتم الاحتفاظ بسجلات الطلاب.'}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">
                {language === 'en' ? 'Administrator Password:' : 'كلمة مرور المسؤول:'}
              </span>
              <Input type="password" className="mt-1" placeholder="••••••••" />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === 'en' ? 'Cancel' : 'إلغاء'}
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeletion} className={deletionType === 'all' ? 'bg-red-500 hover:bg-red-600' : ''}>
              {language === 'en' 
                ? deletionType === 'all' ? 'Permanently Delete' : 'Remove Class Only'
                : deletionType === 'all' ? 'حذف نهائي' : 'إزالة الفصل فقط'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClassSections;
