
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import Header from '@/components/Header';
import AddStudentDialog from '@/components/AddStudentDialog';
import StudentCard from '@/components/StudentCard';
import CustomBreadcrumb from '@/components/CustomBreadcrumb';
import ExportDataDialog from '@/components/ExportDataDialog';
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Users,
  Flag,
  GraduationCap,
  Home,
  Search,
  X,
  BarChart3,
  FileDown,
  Trash2,
  ArchiveIcon,
  AlertTriangle,
  MoreVertical,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';

const Students = () => {
  const { students, language, deleteStudents, archiveStudents } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const t = getTranslations(language);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'all' | 'international' | 'national'>('all');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectMode, setSelectMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteAction, setDeleteAction] = useState<'delete' | 'archive'>('delete');
  const [showBulkActionDialog, setShowBulkActionDialog] = useState(false);
  
  // Parse URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const gradeParam = params.get('grade');
    const typeParam = params.get('type') as 'international' | 'national' | null;
    
    if (gradeParam) {
      setSelectedGrade(gradeParam);
    }
    
    if (typeParam && (typeParam === 'international' || typeParam === 'national')) {
      setSelectedTab(typeParam);
    }
  }, [location.search]);
  
  // Get unique grade levels
  const uniqueGrades = [...new Set(students.map(student => student.grade))].sort();
  
  // Filter students based on search term, selected grade, and tab
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade ? student.grade === selectedGrade : true;
    const matchesTab = selectedTab === 'all' ? true : student.nationality === selectedTab;
    
    return matchesSearch && matchesGrade && matchesTab;
  });
  
  // Filter students by nationality
  const internationalStudents = filteredStudents.filter(student => student.nationality === 'international');
  const nationalStudents = filteredStudents.filter(student => student.nationality === 'national');
  
  // Handle grade selection
  const handleGradeChange = (grade: string) => {
    if (grade === selectedGrade) {
      // Clear grade filter
      setSelectedGrade(null);
      navigate('/students');
    } else {
      // Set grade filter
      setSelectedGrade(grade);
      navigate(`/students?grade=${grade}`);
    }
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedGrade(null);
    navigate('/students');
  };
  
  // Navigate to student view
  const handleStudentClick = (id: string) => {
    if (selectMode) {
      // In select mode, clicking toggles selection
      handleSelectStudent(id);
    } else {
      navigate(`/student/${id}`);
    }
  };

  // Toggle select mode
  const toggleSelectMode = () => {
    if (selectMode) {
      // If exiting select mode, clear selections
      setSelectedStudents([]);
    }
    setSelectMode(!selectMode);
  };

  // Handle student selection
  const handleSelectStudent = (id: string) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(selectedStudents.filter((studentId) => studentId !== id));
    } else {
      setSelectedStudents([...selectedStudents, id]);
    }
  };

  // Select all visible students
  const selectAllStudents = () => {
    const currentList = getCurrentStudentList();
    setSelectedStudents(currentList.map(student => student.id));
  };

  // Deselect all students
  const deselectAllStudents = () => {
    setSelectedStudents([]);
  };

  // Get current list of students based on tab
  const getCurrentStudentList = () => {
    switch (selectedTab) {
      case 'international':
        return internationalStudents;
      case 'national':
        return nationalStudents;
      default:
        return filteredStudents;
    }
  };

  // Handle bulk action
  const handleBulkAction = (action: 'delete' | 'archive') => {
    if (selectedStudents.length === 0) return;
    
    setDeleteAction(action);
    setShowBulkActionDialog(false);
    setShowDeleteConfirm(true);
  };

  // Confirm bulk action
  const confirmBulkAction = () => {
    if (deleteAction === 'delete') {
      deleteStudents(selectedStudents);
      toast.success(
        language === 'en' 
          ? `${selectedStudents.length} students deleted` 
          : `تم حذف ${selectedStudents.length} طالب`
      );
    } else if (deleteAction === 'archive') {
      archiveStudents(selectedStudents);
      toast.success(
        language === 'en' 
          ? `${selectedStudents.length} students archived` 
          : `تم أرشفة ${selectedStudents.length} طالب`
      );
    }
    
    setSelectedStudents([]);
    setSelectMode(false);
    setShowDeleteConfirm(false);
  };

  // Create breadcrumb items
  const breadcrumbItems = [
    {
      label: t.home,
      icon: <Home className="h-4 w-4" />,
      href: "/"
    },
    {
      label: t.students,
      icon: <Users className="h-4 w-4" />,
      current: selectedTab === 'all' && !selectedGrade
    }
  ];

  // Add nationality item if selected
  if (selectedTab !== 'all') {
    breadcrumbItems.push({
      label: selectedTab === 'international' ? t.internationalStuds : t.nationalStuds,
      icon: <Flag className="h-4 w-4" />,
      current: !selectedGrade
    });
  }

  // Add grade item if selected
  if (selectedGrade) {
    breadcrumbItems.push({
      label: selectedGrade,
      icon: <GraduationCap className="h-4 w-4" />,
      current: true
    });
  }

  const selectedStudentsDetails = students.filter(s => selectedStudents.includes(s.id));
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="page-container">
        <CustomBreadcrumb items={breadcrumbItems} className="mb-6" />
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <h1 className="text-3xl font-display font-semibold">
            {selectedTab === 'all' ? t.students : 
             selectedTab === 'international' ? t.internationalStuds : 
             t.nationalStuds}
             {selectedGrade ? ` - ${t.grade} ${selectedGrade}` : ''}
          </h1>
          
          <div className="flex gap-2">
            {selectedGrade && (
              <Button 
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => navigate(`/grade/${selectedGrade}`)}
              >
                <BarChart3 className="h-4 w-4" />
                {t.gradeRecognition}
              </Button>
            )}
            <ExportDataDialog gradeLevel={selectedGrade || undefined}>
              <Button 
                variant="outline"
                className="flex items-center gap-2"
              >
                <FileDown className="h-4 w-4" />
                {t.exportData || "Export Data"}
              </Button>
            </ExportDataDialog>
            {selectMode ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={toggleSelectMode}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  {language === 'en' ? "Cancel Selection" : "إلغاء التحديد"}
                </Button>
                <Button 
                  variant="default"
                  onClick={() => setShowBulkActionDialog(true)}
                  disabled={selectedStudents.length === 0}
                  className="flex items-center gap-2"
                >
                  {language === 'en' ? `Actions (${selectedStudents.length})` : `إجراءات (${selectedStudents.length})`}
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={toggleSelectMode}
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  {language === 'en' ? "Select Students" : "تحديد الطلاب"}
                </Button>
                <AddStudentDialog />
              </>
            )}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t.search}
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {(searchTerm || selectedGrade) && (
              <Button variant="outline" onClick={handleClearFilters}>
                {t.clearFilters || "Clear Filters"}
              </Button>
            )}
          </div>
          
          <Tabs defaultValue="all" value={selectedTab} onValueChange={(value) => setSelectedTab(value as 'all' | 'international' | 'national')}>
            <TabsList className="mb-6">
              <TabsTrigger value="all" className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                {t.students}
              </TabsTrigger>
              <TabsTrigger value="international" className="flex items-center">
                <Flag className="mr-2 h-4 w-4" />
                {t.internationalStuds}
              </TabsTrigger>
              <TabsTrigger value="national" className="flex items-center">
                <Flag className="mr-2 h-4 w-4" />
                {t.nationalStuds}
              </TabsTrigger>
            </TabsList>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3">{t.grade}</h3>
              <div className="flex flex-wrap gap-2">
                {uniqueGrades.map((grade) => (
                  <div key={grade} className="flex flex-col sm:flex-row gap-1">
                    <Button
                      variant={selectedGrade === grade ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleGradeChange(grade)}
                      className="flex items-center"
                    >
                      <GraduationCap className="mr-2 h-4 w-4" />
                      {grade}
                    </Button>
                    {selectedGrade === grade && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/grade/${grade}`)}
                        className="flex items-center sm:ml-1"
                      >
                        <BarChart3 className="mr-2 h-4 w-4" />
                        {t.recognitions}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {selectMode && (
              <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">
                    {language === 'en' ? "Selection Tools" : "أدوات التحديد"}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={selectAllStudents}
                      className="text-xs"
                    >
                      {language === 'en' ? "Select All" : "تحديد الكل"}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={deselectAllStudents}
                      className="text-xs"
                      disabled={selectedStudents.length === 0}
                    >
                      {language === 'en' ? "Deselect All" : "إلغاء تحديد الكل"}
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {language === 'en' 
                    ? `${selectedStudents.length} students selected` 
                    : `تم تحديد ${selectedStudents.length} طالب`}
                </div>
              </div>
            )}
            
            <TabsContent value="all">
              {filteredStudents.length > 0 ? (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.05 }}
                >
                  {filteredStudents.map((student) => (
                    <div 
                      key={student.id} 
                      className={`relative ${selectMode ? 'cursor-pointer' : ''}`}
                    >
                      {selectMode && (
                        <div className="absolute top-3 left-3 z-10">
                          <Checkbox 
                            checked={selectedStudents.includes(student.id)}
                            onCheckedChange={() => handleSelectStudent(student.id)}
                          />
                        </div>
                      )}
                      <StudentCard
                        key={student.id}
                        student={student}
                        onClick={() => handleStudentClick(student.id)}
                        selected={selectedStudents.includes(student.id)}
                        selectMode={selectMode}
                      />
                    </div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  {t.noStudents || "No students found"}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="international">
              {internationalStudents.length > 0 ? (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.05 }}
                >
                  {internationalStudents.map((student) => (
                    <div 
                      key={student.id} 
                      className={`relative ${selectMode ? 'cursor-pointer' : ''}`}
                    >
                      {selectMode && (
                        <div className="absolute top-3 left-3 z-10">
                          <Checkbox 
                            checked={selectedStudents.includes(student.id)}
                            onCheckedChange={() => handleSelectStudent(student.id)}
                          />
                        </div>
                      )}
                      <StudentCard
                        key={student.id}
                        student={student}
                        onClick={() => handleStudentClick(student.id)}
                        selected={selectedStudents.includes(student.id)}
                        selectMode={selectMode}
                      />
                    </div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  {t.noStudents || "No international students found"}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="national">
              {nationalStudents.length > 0 ? (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.05 }}
                >
                  {nationalStudents.map((student) => (
                    <div 
                      key={student.id} 
                      className={`relative ${selectMode ? 'cursor-pointer' : ''}`}
                    >
                      {selectMode && (
                        <div className="absolute top-3 left-3 z-10">
                          <Checkbox 
                            checked={selectedStudents.includes(student.id)}
                            onCheckedChange={() => handleSelectStudent(student.id)}
                          />
                        </div>
                      )}
                      <StudentCard
                        key={student.id}
                        student={student}
                        onClick={() => handleStudentClick(student.id)}
                        selected={selectedStudents.includes(student.id)}
                        selectMode={selectMode}
                      />
                    </div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  {t.noStudents || "No national students found"}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Bulk Actions Dialog */}
      <Dialog open={showBulkActionDialog} onOpenChange={setShowBulkActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'en' ? 'Student Bulk Actions' : 'إجراءات جماعية للطلاب'}
            </DialogTitle>
            <DialogDescription>
              {language === 'en'
                ? `Selected ${selectedStudents.length} students`
                : `تم تحديد ${selectedStudents.length} طالب`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 gap-4 py-4">
            <Button 
              variant="outline" 
              className="p-4 h-auto flex items-center justify-start gap-3"
              onClick={() => {
                // Export selected students
                toast.success(language === 'en' ? 'Students exported successfully' : 'تم تصدير الطلاب بنجاح');
                setShowBulkActionDialog(false);
              }}
            >
              <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                <FileDown className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="font-medium">
                  {language === 'en' ? 'Export Selected Students' : 'تصدير الطلاب المحددين'}
                </div>
                <div className="text-xs text-gray-500">
                  {language === 'en' 
                    ? 'Download data for selected students' 
                    : 'تنزيل بيانات الطلاب المحددين'}
                </div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="p-4 h-auto flex items-center justify-start gap-3"
              onClick={() => handleBulkAction('archive')}
            >
              <div className="h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center">
                <ArchiveIcon className="h-5 w-5 text-amber-600" />
              </div>
              <div className="text-left">
                <div className="font-medium">
                  {language === 'en' ? 'Archive Selected Students' : 'أرشفة الطلاب المحددين'}
                </div>
                <div className="text-xs text-gray-500">
                  {language === 'en' 
                    ? 'Hide students from active lists but preserve records' 
                    : 'إخفاء الطلاب من القوائم النشطة مع الاحتفاظ بالسجلات'}
                </div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="p-4 h-auto flex items-center justify-start gap-3 hover:bg-red-50 hover:border-red-200"
              onClick={() => handleBulkAction('delete')}
            >
              <div className="h-9 w-9 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-red-600">
                  {language === 'en' ? 'Delete Selected Students' : 'حذف الطلاب المحددين'}
                </div>
                <div className="text-xs text-gray-500">
                  {language === 'en' 
                    ? 'Remove students and all associated data' 
                    : 'إزالة الطلاب وجميع البيانات المرتبطة بهم'}
                </div>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">
              {deleteAction === 'delete'
                ? language === 'en' ? 'Confirm Bulk Deletion' : 'تأكيد الحذف الجماعي'
                : language === 'en' ? 'Confirm Bulk Archive' : 'تأكيد الأرشفة الجماعية'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              {deleteAction === 'delete'
                ? language === 'en' 
                  ? `Are you sure you want to delete ${selectedStudents.length} students?`
                  : `هل أنت متأكد من رغبتك في حذف ${selectedStudents.length} طالب؟`
                : language === 'en'
                  ? `Are you sure you want to archive ${selectedStudents.length} students?`
                  : `هل أنت متأكد من رغبتك في أرشفة ${selectedStudents.length} طالب؟`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="max-h-40 overflow-y-auto my-4 border rounded-md">
            <div className="p-3 bg-slate-50 border-b font-medium">
              {language === 'en' ? 'Selected Students:' : 'الطلاب المحددون:'}
            </div>
            <ul className="divide-y">
              {selectedStudentsDetails.map(student => (
                <li key={student.id} className="p-3 text-sm flex justify-between">
                  <span>{student.name}</span>
                  <span className="text-gray-500">{student.grade}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className={`p-4 ${deleteAction === 'delete' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'} border rounded-md mb-4`}>
            <div className="flex items-start gap-3">
              <AlertTriangle className={`h-5 w-5 ${deleteAction === 'delete' ? 'text-red-500' : 'text-amber-500'} mt-0.5 flex-shrink-0`} />
              <p className={`text-sm ${deleteAction === 'delete' ? 'text-red-800' : 'text-amber-800'}`}>
                {deleteAction === 'delete'
                  ? language === 'en'
                    ? 'This action cannot be undone. All student data including points, achievements, and history will be permanently deleted.'
                    : 'لا يمكن التراجع عن هذا الإجراء. سيتم حذف جميع بيانات الطلاب بما في ذلك النقاط والإنجازات والتاريخ بشكل دائم.'
                  : language === 'en'
                    ? 'The students will be hidden from active lists but their data will be preserved. You can restore archived students later.'
                    : 'سيتم إخفاء الطلاب من القوائم النشطة ولكن سيتم الاحتفاظ ببياناتهم. يمكنك استعادة الطلاب المؤرشفين لاحقًا.'}
              </p>
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
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
            <AlertDialogAction 
              onClick={confirmBulkAction} 
              className={deleteAction === 'delete' ? 'bg-red-500 hover:bg-red-600' : ''}
            >
              {deleteAction === 'delete'
                ? language === 'en' ? 'Yes, Delete All Selected' : 'نعم، حذف كل ما تم تحديده'
                : language === 'en' ? 'Yes, Archive All Selected' : 'نعم، أرشفة كل ما تم تحديده'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Students;
