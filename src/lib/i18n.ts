export const translations = {
  dash: {
    en: 'Dashboard',
    ar: 'لوحة التحكم'
  },
  students: {
    en: 'Students',
    ar: 'الطلاب'
  },
  classes: {
    en: 'Classes',
    ar: 'الصفوف'
  },
  exams: {
    en: 'Exams',
    ar: 'الاختبارات'
  },
  reports: {
    en: 'Reports',
    ar: 'التقارير'
  },
  settings: {
    en: 'Settings',
    ar: 'الإعدادات'
  },
  logout: {
    en: 'Logout',
    ar: 'تسجيل الخروج'
  },
  addStudent: {
    en: 'Add Student',
    ar: 'إضافة طالب'
  },
  exportData: {
    en: 'Export Data',
    ar: 'تصدير البيانات'
  },
  importData: {
    en: 'Import Data',
    ar: 'استيراد بيانات'
  },
  studentProgress: {
    en: 'Student Progress',
    ar: 'تقدم الطالب'
  },
  classComparison: {
    en: 'Class Comparison',
    ar: 'مقارنة الصفوف'
  },
  recognitionSystem: {
    en: 'Recognition System',
    ar: 'نظام التقدير'
  },
  raceToGoal: {
    en: 'Race to Goal',
    ar: 'السباق نحو الهدف'
  },
  progressOverview: {
    en: 'Progress Overview',
    ar: 'نظرة عامة على التقدم'
  },
  noStudents: {
    en: 'No students yet',
    ar: 'لا يوجد طلاب حتى الآن'
  },
  home: {
    en: 'Home',
    ar: 'الرئيسية'
  },
  studentManagement: {
    en: 'Student Management',
    ar: 'إدارة الطلاب'
  },
  gradeRecognition: {
    en: 'Grade Recognition',
    ar: 'تقدير الصف'
  },
  examCenter: {
    en: 'Exam Center',
    ar: 'مركز الاختبارات'
  },
  userManagement: {
    en: 'User Management',
    ar: 'إدارة المستخدمين'
  },
  teacherManagement: {
    en: 'Teacher Management',
    ar: 'إدارة المعلمين'
  }
};

export const getTranslations = (language: string = 'en') => {
  const lang = language === 'ar' ? 'ar' : 'en';
  return {
    dash: translations.dash[lang],
    students: translations.students[lang],
    classes: translations.classes[lang],
    exams: translations.exams[lang],
    reports: translations.reports[lang],
    settings: translations.settings[lang],
    logout: translations.logout[lang],
    addStudent: translations.addStudent[lang],
    exportData: translations.exportData[lang],
    importData: translations.importData[lang],
    studentProgress: translations.studentProgress[lang],
    classComparison: translations.classComparison[lang],
    recognitionSystem: translations.recognitionSystem[lang],
    raceToGoal: translations.raceToGoal[lang],
    progressOverview: translations.progressOverview[lang],
    noStudents: translations.noStudents[lang],
    home: translations.home[lang],
    studentManagement: translations.studentManagement[lang],
    gradeRecognition: translations.gradeRecognition[lang],
    examCenter: translations.examCenter[lang],
    userManagement: translations.userManagement[lang],
    teacherManagement: translations.teacherManagement[lang],
  };
};
