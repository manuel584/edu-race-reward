
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
  },
  // New translations for AddUserForm
  addUser: {
    en: 'Add User',
    ar: 'إضافة مستخدم'
  },
  fullName: {
    en: 'Full Name',
    ar: 'الاسم الكامل'
  },
  emailAddress: {
    en: 'Email Address',
    ar: 'البريد الإلكتروني'
  },
  password: {
    en: 'Password',
    ar: 'كلمة المرور'
  },
  generatePassword: {
    en: 'Generate',
    ar: 'إنشاء'
  },
  department: {
    en: 'Department',
    ar: 'القسم'
  },
  subjects: {
    en: 'Subjects',
    ar: 'المواد'
  },
  assignedClasses: {
    en: 'Assigned Classes',
    ar: 'الفصول المعينة'
  },
  cancel: {
    en: 'Cancel',
    ar: 'إلغاء'
  },
  role: {
    en: 'Role',
    ar: 'الدور'
  },
  selectRole: {
    en: 'Select role',
    ar: 'اختر الدور'
  },
  administrator: {
    en: 'Administrator',
    ar: 'مدير النظام'
  },
  supervisor: {
    en: 'Supervisor',
    ar: 'مشرف'
  },
  counselor: {
    en: 'Counselor',
    ar: 'مرشد طلابي'
  },
  teacher: {
    en: 'Teacher',
    ar: 'معلم'
  },
  show: {
    en: 'Show',
    ar: 'إظهار'
  },
  hide: {
    en: 'Hide',
    ar: 'إخفاء'
  },
  // Additional translations for error messages
  error: {
    en: 'Error',
    ar: 'خطأ'
  },
  fillRequiredFields: {
    en: 'Please fill in all required fields.',
    ar: 'يرجى ملء جميع الحقول المطلوبة.'
  },
  passwordGenerated: {
    en: 'Password Generated',
    ar: 'تم إنشاء كلمة المرور'
  },
  securePasswordGenerated: {
    en: 'A secure password has been generated.',
    ar: 'تم إنشاء كلمة مرور آمنة.'
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
    // New translations for AddUserForm
    addUser: translations.addUser[lang],
    fullName: translations.fullName[lang],
    emailAddress: translations.emailAddress[lang],
    password: translations.password[lang],
    generatePassword: translations.generatePassword[lang],
    department: translations.department[lang],
    subjects: translations.subjects[lang],
    assignedClasses: translations.assignedClasses[lang],
    cancel: translations.cancel[lang],
    role: translations.role[lang],
    selectRole: translations.selectRole[lang],
    administrator: translations.administrator[lang],
    supervisor: translations.supervisor[lang],
    counselor: translations.counselor[lang],
    teacher: translations.teacher[lang],
    show: translations.show[lang],
    hide: translations.hide[lang],
    error: translations.error[lang],
    fillRequiredFields: translations.fillRequiredFields[lang],
    passwordGenerated: translations.passwordGenerated[lang],
    securePasswordGenerated: translations.securePasswordGenerated[lang],
  };
};
