
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppContext, Student } from '@/context/AppContext';
import { User, Book, MessageSquare, ArrowUpRight, Plus, Minus, Gauge } from 'lucide-react';
import { formatDateFromIso } from '@/lib/studentData';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';

interface StudentCardProps {
  student: Student;
  onClick?: () => void;
  showDetails?: boolean;
}

const StudentCard: React.FC<StudentCardProps> = ({ 
  student, 
  onClick,
  showDetails = false 
}) => {
  const { language, goalPoints, updateStudentPoints } = useAppContext();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeductOpen, setIsDeductOpen] = useState(false);
  
  const t = getTranslations(language);
  
  // Calculate progress percentage (capped at 100%)
  const progressPercentage = Math.min(100, (student.points / goalPoints) * 100);
  
  // Get last activity from history
  const lastActivity = student.pointsHistory.length > 0 
    ? student.pointsHistory[student.pointsHistory.length - 1] 
    : null;

  // Positive reasons for adding points
  const positiveReasons = [
    { id: 'attendance', label: t.attendanceReason },
    { id: 'participation', label: t.participationReason },
    { id: 'homework', label: t.homeworkReason },
    { id: 'test', label: t.testResultReason },
  ];

  // Negative reasons for deducting points
  const negativeReasons = [
    { id: 'absence', label: t.absenceReason },
    { id: 'misbehavior', label: t.misbehaviorReason },
    { id: 'incomplete', label: t.incompleteWorkReason },
    { id: 'late', label: t.lateSubmissionReason },
  ];

  // Handle quick add points
  const handleAddPoints = (reason: string) => {
    updateStudentPoints(student.id, 1, reason);
    setIsAddOpen(false);
    toast.success(`Added 1 point to ${student.name} for ${reason}`);
  };

  // Handle quick deduct points
  const handleDeductPoints = (reason: string) => {
    updateStudentPoints(student.id, -1, reason);
    setIsDeductOpen(false);
    toast.success(`Deducted 1 point from ${student.name} for ${reason}`);
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card overflow-hidden"
    >
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-3">{student.name}</h3>
        
        <div className="mb-4">
          <div className="flex items-center mb-1">
            <Gauge className="h-4 w-4 text-blue-600 mr-2" />
            <Progress value={progressPercentage} className="h-2.5" />
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>{t.progressToGoal}</span>
            <span className="font-medium">{student.points} / {goalPoints}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="p-3 bg-blue-50 rounded-lg flex flex-col items-center justify-center">
            <User className="h-4 w-4 text-blue-600 mb-1" />
            <span className="text-xs text-gray-500">{t.attendance}</span>
            <span className="font-semibold">{student.attendance}</span>
          </div>
          
          <div className="p-3 bg-blue-50 rounded-lg flex flex-col items-center justify-center">
            <Book className="h-4 w-4 text-blue-600 mb-1" />
            <span className="text-xs text-gray-500">{t.books}</span>
            <span className="font-semibold">{student.booksOwned}</span>
          </div>
          
          <div className="p-3 bg-blue-50 rounded-lg flex flex-col items-center justify-center">
            <MessageSquare className="h-4 w-4 text-blue-600 mb-1" />
            <span className="text-xs text-gray-500">{t.engagement}</span>
            <span className="font-semibold">{student.engagementScore}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <Popover open={isAddOpen} onOpenChange={setIsAddOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Plus className="h-4 w-4 text-green-600" />
                <span className="text-green-600">{t.quickAdd}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60 p-3">
              <h4 className="text-sm font-medium mb-2">{t.selectReason}</h4>
              <div className="grid grid-cols-1 gap-2">
                {positiveReasons.map(reason => (
                  <Button 
                    key={reason.id} 
                    variant="outline"
                    size="sm"
                    className="justify-start"
                    onClick={() => handleAddPoints(reason.label)}
                  >
                    {reason.label}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          
          <Popover open={isDeductOpen} onOpenChange={setIsDeductOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Minus className="h-4 w-4 text-red-600" />
                <span className="text-red-600">{t.quickDeduct}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60 p-3">
              <h4 className="text-sm font-medium mb-2">{t.selectReason}</h4>
              <div className="grid grid-cols-1 gap-2">
                {negativeReasons.map(reason => (
                  <Button 
                    key={reason.id} 
                    variant="outline"
                    size="sm"
                    className="justify-start"
                    onClick={() => handleDeductPoints(reason.label)}
                  >
                    {reason.label}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        {lastActivity && (
          <div className="text-sm text-gray-500 mb-4">
            <span className="font-medium">{t.lastActivity}:</span>{' '}
            <span>
              {lastActivity.change > 0 ? '+' : ''}{lastActivity.change} {t.points} {t.on} {formatDateFromIso(lastActivity.date, language)}
            </span>
          </div>
        )}

        {!showDetails && (
          <button 
            onClick={onClick}
            className="w-full flex justify-center items-center px-4 py-2 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 text-sm"
          >
            {t.viewDetails}
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

// Helper function to get translations
const getTranslations = (language: 'en' | 'ar') => {
  const translations = {
    en: {
      addStudent: 'Add Student',
      studentName: 'Student Name',
      points: 'Points',
      attendance: 'Attendance',
      books: 'Books',
      engagement: 'Engagement',
      save: 'Save',
      cancel: 'Cancel',
      update: 'Update',
      studentAdded: 'Student added successfully!',
      studentUpdated: 'Student updated successfully!',
      dashboard: 'Dashboard',
      students: 'Students',
      searchStudents: 'Search students...',
      filterStudents: 'Filter',
      noStudents: 'No students found. Add a new student to get started!',
      raceToGoal: 'Race to Goal',
      progressOverview: 'Progress Overview',
      noActivity: 'No activity yet',
      viewDetails: 'View Details',
      addPoints: 'Add Points',
      reason: 'Reason',
      add: 'Add',
      history: 'History',
      settings: 'Settings',
      language: 'Language',
      english: 'English',
      arabic: 'Arabic',
      goal: 'Goal',
      setGoal: 'Set Goal',
      import: 'Import',
      export: 'Export',
      delete: 'Delete',
      deleteConfirmation: 'Are you sure you want to delete this student?',
      yes: 'Yes',
      no: 'No',
      congratulations: 'Congratulations!',
      goalReached: 'You have reached the goal!',
      basicInfo: 'Basic Info',
      academicInfo: 'Academic Info',
      nationality: 'Nationality',
      international: 'International',
      national: 'National',
      selectNationality: 'Select nationality',
      grade: 'Grade',
      selectGrade: 'Select grade',
      subjects: 'Subjects',
      allStudents: 'All Students',
      byNationality: 'By Nationality',
      byGrade: 'By Grade',
      internationalStudents: 'International Students',
      nationalStudents: 'National Students',
      noInternationalStudents: 'No international students found',
      noNationalStudents: 'No national students found',
      progressToGoal: 'Progress to Goal',
      lastActivity: 'Last Activity',
      on: 'on',
      deductPoints: 'Deduct Points',
      reachedGoal: 'has reached the goal!',
      almost: 'Almost there!',
      keepGoing: 'Keep going!',
      needsImprovement: 'Needs improvement',
      enterReason: 'Enter reason...',
      date: 'Date',
      change: 'Change',
      pointsHistory: 'Points History',
      // Point adjustment reasons
      attendanceReason: 'Attendance',
      participationReason: 'Participation',
      homeworkReason: 'Homework',
      testResultReason: 'Test Result',
      absenceReason: 'Absence',
      misbehaviorReason: 'Misbehavior',
      incompleteWorkReason: 'Incomplete Work',
      lateSubmissionReason: 'Late Submission',
      quickAdd: 'Quick Add',
      quickDeduct: 'Quick Deduct',
      selectReason: 'Select a reason'
    },
    ar: {
      addStudent: 'إضافة طالب',
      studentName: 'اسم الطالب',
      points: 'النقاط',
      attendance: 'الحضور',
      books: 'الكتب',
      engagement: 'المشاركة',
      save: 'حفظ',
      cancel: 'إلغاء',
      update: 'تحديث',
      studentAdded: 'تمت إضافة الطالب بنجاح!',
      studentUpdated: 'تم تحديث الطالب بنجاح!',
      dashboard: 'لوحة التحكم',
      students: 'الطلاب',
      searchStudents: 'ابحث عن الطلاب...',
      filterStudents: 'تصفية',
      noStudents: 'لم يتم العثور على طلاب. أضف طالبًا جديدًا للبدء!',
      raceToGoal: 'السباق نحو الهدف',
      progressOverview: 'نظرة عامة على التقدم',
      noActivity: 'لا يوجد نشاط حتى الآن',
      viewDetails: 'عرض التفاصيل',
      addPoints: 'إضافة نقاط',
      reason: 'السبب',
      add: 'أضف',
      history: 'التاريخ',
      settings: 'الإعدادات',
      language: 'اللغة',
      english: 'الإنجليزية',
      arabic: 'العربية',
      goal: 'الهدف',
      setGoal: 'تحديد الهدف',
      import: 'استيراد',
      export: 'تصدير',
      delete: 'حذف',
      deleteConfirmation: 'هل أنت متأكد أنك تريد حذف هذا الطالب؟',
      yes: 'نعم',
      no: 'لا',
      congratulations: 'تهانينا!',
      goalReached: 'لقد وصلت إلى الهدف!',
      basicInfo: 'معلومات أساسية',
      academicInfo: 'معلومات أكاديمية',
      nationality: 'الجنسية',
      international: 'دولي',
      national: 'وطني',
      selectNationality: 'اختر الجنسية',
      grade: 'الصف',
      selectGrade: 'اختر الصف',
      subjects: 'المواد',
      allStudents: 'جميع الطلاب',
      byNationality: 'حسب الجنسية',
      byGrade: 'حسب الصف',
      internationalStudents: 'الطلاب الدوليون',
      nationalStudents: 'الطلاب الوطنيون',
      noInternationalStudents: 'لا يوجد طلاب دوليين',
      noNationalStudents: 'لا يوجد طلاب وطنيين',
      progressToGoal: 'التقدم نحو الهدف',
      lastActivity: 'آخر نشاط',
      on: 'في',
      deductPoints: 'خصم النقاط',
      reachedGoal: 'وصل إلى الهدف!',
      almost: 'تقريباً هناك!',
      keepGoing: 'استمر!',
      needsImprovement: 'يحتاج إلى تحسين',
      enterReason: 'أدخل السبب...',
      date: 'التاريخ',
      change: 'التغيير',
      pointsHistory: 'سجل النقاط',
      // Point adjustment reasons
      attendanceReason: 'الحضور',
      participationReason: 'المشاركة',
      homeworkReason: 'الواجب المنزلي',
      testResultReason: 'نتيجة الاختبار',
      absenceReason: 'الغياب',
      misbehaviorReason: 'سوء السلوك',
      incompleteWorkReason: 'عمل غير مكتمل',
      lateSubmissionReason: 'تسليم متأخر',
      quickAdd: 'إضافة سريعة',
      quickDeduct: 'خصم سريع',
      selectReason: 'اختر سبباً'
    }
  };

  return translations[language];
};

export default StudentCard;
