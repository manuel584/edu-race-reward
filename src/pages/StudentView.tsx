import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { formatDateFromIso } from '@/lib/studentData';
import Header from '@/components/Header';
import StudentProfile from '@/components/StudentProfile';
import StudentRecognitionProfile from '@/components/StudentRecognitionProfile';
import QuickPointAdjust from '@/components/QuickPointAdjust';
import StudentStickyHeader from '@/components/StudentStickyHeader';
import StudentNominationForm from '@/components/StudentNominationForm';
import ExportDataDialog from '@/components/ExportDataDialog';
import BackToTopButton from '@/components/BackToTopButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar,
  ArrowDown,
  ArrowUp,
  Trophy,
  Award,
  Heart,
  FileDown,
  Trash2,
  ArchiveIcon,
  AlertTriangle,
  Users
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';

const StudentView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    students, 
    language, 
    goalPoints,
    deleteStudent,
    archiveStudent
  } = useAppContext();
  
  const [nominateOpen, setNominateOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteAction, setDeleteAction] = useState<'delete' | 'archive' | 'transfer'>('delete');
  const [transferClass, setTransferClass] = useState('');
  
  const student = students.find(s => s.id === id) || null;
  const t = getTranslations(language);
  
  const availableGrades = [...new Set(students.map(s => s.grade))].sort();

  useEffect(() => {
    if (!student) {
      navigate('/dashboard');
      toast.error('Student not found');
    }
  }, [id, students, navigate, student]);

  if (!student) return null;

  const progressPercentage = Math.min(100, (student.points / goalPoints) * 100);
  
  const getProgressStatus = () => {
    if (progressPercentage >= 100) {
      return {
        message: `${t.congratulations || "Congratulations!"} ${student.name} ${t.reachedGoal || "reached goal!"}`,
        color: 'text-green-600',
        icon: <Trophy className="h-5 w-5" />
      };
    } else if (progressPercentage >= 75) {
      return {
        message: `${t.almost || "Almost there!"}`,
        color: 'text-blue-600',
        icon: <ArrowUp className="h-5 w-5" />
      };
    } else if (progressPercentage >= 50) {
      return {
        message: `${t.keepGoing || "Keep going!"}`,
        color: 'text-orange-500',
        icon: null
      };
    } else {
      return {
        message: `${t.needsImprovement || "Needs improvement"}`,
        color: 'text-gray-500',
        icon: <ArrowDown className="h-5 w-5" />
      };
    }
  };

  const progressStatus = getProgressStatus();

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteOption = (action: 'delete' | 'archive' | 'transfer') => {
    setDeleteAction(action);
    
    if (action === 'transfer') {
    } else {
      setShowDeleteDialog(false);
      setShowDeleteConfirm(true);
    }
  };

  const handleTransferConfirm = () => {
    if (!transferClass) {
      toast.error(language === 'en' ? 'Please select a class' : 'الرجاء اختيار فصل');
      return;
    }
    
    toast.success(
      language === 'en' 
        ? `${student.name} transferred to ${transferClass}` 
        : `تم نقل ${student.name} إلى ${transferClass}`
    );
    
    setShowDeleteDialog(false);
    navigate('/students');
  };

  const handleConfirmDelete = () => {
    if (deleteAction === 'delete') {
      deleteStudent(student.id);
      toast.success(
        language === 'en' 
          ? `${student.name} has been deleted` 
          : `تم حذف ${student.name}`
      );
    } else if (deleteAction === 'archive') {
      archiveStudent(student.id);
      toast.success(
        language === 'en' 
          ? `${student.name} has been archived` 
          : `تم أرشفة ${student.name}`
      );
    }
    
    setShowDeleteConfirm(false);
    navigate('/students');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <StudentStickyHeader student={student} language={language} goalPoints={goalPoints} />
      
      <main className="page-container relative pb-20">
        <motion.div 
          className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-display font-bold mb-2">{student.name}</h1>
                <div className="flex items-center">
                  <div className={`flex items-center ${progressStatus.color}`}>
                    {progressStatus.icon && <span className="mr-1">{progressStatus.icon}</span>}
                    <span>{progressStatus.message}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 flex gap-2">
                <ExportDataDialog studentId={student.id}>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                  >
                    <FileDown className="h-4 w-4" />
                    {t.exportData || "Export Data"}
                  </Button>
                </ExportDataDialog>
                <Button 
                  variant="outline" 
                  onClick={() => setNominateOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Heart className="h-4 w-4 text-rose-500" />
                  {t.nominate || "Nominate"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleDeleteClick}
                  className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                >
                  <Trash2 className="h-4 w-4" />
                  {language === 'en' ? "Remove Student" : "إزالة الطالب"}
                </Button>
                <QuickPointAdjust studentId={student.id} studentName={student.name} isAdd={true} />
              </div>
            </div>
            
            <div className="mb-6">
              <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
                <motion.div 
                  className="h-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, type: 'spring' }}
                ></motion.div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t.progressToGoal || "Progress to Goal"}</span>
                <span className="font-medium">
                  {student.points} / {goalPoints} {t.points || "points"}
                </span>
              </div>
            </div>
            
            <Tabs defaultValue="profile">
              <TabsList className="mb-6">
                <TabsTrigger value="profile">
                  {t.profile || "Profile"}
                </TabsTrigger>
                <TabsTrigger value="recognition">
                  <Award className="mr-2 h-4 w-4" />
                  {t.recognition || "Recognition"}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <StudentProfile student={student} />
              </TabsContent>
              
              <TabsContent value="recognition">
                <StudentRecognitionProfile student={student} />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="border-t border-gray-100">
            <div className="p-8">
              <h2 className="text-xl font-semibold mb-4">{t.pointsHistory || "Points History"}</h2>
              
              {student.pointsHistory && student.pointsHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <div className="rounded-xl border border-gray-200 min-w-full">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t.date || "Date"}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t.change || "Change"}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t.reason || "Reason"}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {student.pointsHistory
                          .slice()
                          .reverse()
                          .map((entry, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                  {formatDateFromIso(entry.date, language)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`
                                  ${entry.change > 0 ? 'text-green-600' : entry.change < 0 ? 'text-red-600' : 'text-gray-500'}
                                  font-medium
                                `}>
                                  {entry.change > 0 ? '+' : ''}{entry.change}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {entry.reason}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {t.noPointsHistory || "No points history available"}
                </div>
              )}
            </div>
          </div>
        </motion.div>
        
        <BackToTopButton />
      </main>
      
      <StudentNominationForm 
        open={nominateOpen} 
        onOpenChange={setNominateOpen}
      />

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              {language === 'en' ? 'Remove Student' : 'إزالة الطالب'}
            </DialogTitle>
            <DialogDescription className="text-center">
              {language === 'en' 
                ? `Choose what you want to do with ${student.name}'s record` 
                : `اختر ما تريد فعله بسجل ${student.name}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 gap-4 py-4">
            <Button 
              variant="outline" 
              className="p-4 h-auto flex items-center justify-start gap-3"
              onClick={() => handleDeleteOption('transfer')}
            >
              <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="font-medium">
                  {language === 'en' ? 'Transfer to Another Class' : 'نقل إلى فصل آخر'}
                </div>
                <div className="text-xs text-gray-500">
                  {language === 'en' 
                    ? 'Keep student record and move to a different class' 
                    : 'احتفظ بسجل الطالب وانقله إلى فصل آخر'}
                </div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="p-4 h-auto flex items-center justify-start gap-3"
              onClick={() => handleDeleteOption('archive')}
            >
              <div className="h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center">
                <ArchiveIcon className="h-5 w-5 text-amber-600" />
              </div>
              <div className="text-left">
                <div className="font-medium">
                  {language === 'en' ? 'Archive Student' : 'أرشفة الطالب'}
                </div>
                <div className="text-xs text-gray-500">
                  {language === 'en' 
                    ? 'Hide student from active lists but preserve record' 
                    : 'إخفاء الطالب من القوائم النشطة مع الاحتفاظ بالسجل'}
                </div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="p-4 h-auto flex items-center justify-start gap-3 hover:bg-red-50 hover:border-red-200"
              onClick={() => handleDeleteOption('delete')}
            >
              <div className="h-9 w-9 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-red-600">
                  {language === 'en' ? 'Delete Permanently' : 'حذف نهائي'}
                </div>
                <div className="text-xs text-gray-500">
                  {language === 'en' 
                    ? 'Remove student and all associated data' 
                    : 'إزالة الطالب وجميع البيانات المرتبطة به'}
                </div>
              </div>
            </Button>
          </div>

          {deleteAction === 'transfer' && (
            <div className="border-t pt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {language === 'en' ? 'Select Class' : 'اختر الفصل'}
                  </label>
                  <Select value={transferClass} onValueChange={setTransferClass}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'en' ? 'Select class' : 'اختر الفصل'} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableGrades.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                    {language === 'en' ? 'Cancel' : 'إلغاء'}
                  </Button>
                  <Button onClick={handleTransferConfirm}>
                    {language === 'en' ? 'Transfer Student' : 'نقل الطالب'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">
              {deleteAction === 'delete'
                ? language === 'en' ? 'Confirm Permanent Deletion' : 'تأكيد الحذف الدائم'
                : language === 'en' ? 'Confirm Archive' : 'تأكيد الأرشفة'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              {deleteAction === 'delete'
                ? language === 'en' 
                  ? `Are you sure you want to permanently delete ${student.name}?`
                  : `هل أنت متأكد من رغبتك في حذف ${student.name} بشكل دائم؟`
                : language === 'en'
                  ? `Are you sure you want to archive ${student.name}?`
                  : `هل أنت متأكد من رغبتك في أرشفة ${student.name}؟`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className={`p-4 ${deleteAction === 'delete' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'} border rounded-md mb-4`}>
            <div className="flex items-start gap-3">
              <AlertTriangle className={`h-5 w-5 ${deleteAction === 'delete' ? 'text-red-500' : 'text-amber-500'} mt-0.5 flex-shrink-0`} />
              <p className={`text-sm ${deleteAction === 'delete' ? 'text-red-800' : 'text-amber-800'}`}>
                {deleteAction === 'delete'
                  ? language === 'en'
                    ? 'This action cannot be undone. All student data including points, achievements, and history will be permanently deleted.'
                    : 'لا يمكن التراجع عن هذا الإجراء. سيتم حذف جميع بيانات الطالب بما في ذلك النقاط والإنجازات والتاريخ بشكل دائم.'
                  : language === 'en'
                    ? 'The student will be hidden from active lists but their data will be preserved. You can restore archived students later.'
                    : 'سيتم إخفاء الطالب من القوائم النشطة ولكن سيتم الاحتفاظ ببياناته. يمكنك استعادة الطلاب المؤرشفين لاحقًا.'}
              </p>
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === 'en' ? 'Cancel' : 'إلغاء'}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete} 
              className={deleteAction === 'delete' ? 'bg-red-500 hover:bg-red-600' : ''}
            >
              {deleteAction === 'delete'
                ? language === 'en' ? 'Yes, Delete Permanently' : 'نعم، حذف نهائي'
                : language === 'en' ? 'Yes, Archive Student' : 'نعم، أرشفة الطالب'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StudentView;
