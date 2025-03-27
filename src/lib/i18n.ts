// This file manages translations for the application
type Translations = {
  // General
  allStudents: string;
  allRightsReserved: string;
  byGrade: string;
  clearFilters: string;
  confirm: string;
  confirmDelete: string;
  dashboard: string;
  delete: string;
  demoLoginNote: string;
  edit: string;
  editProfile: string;
  error: string;
  errorParsingFile: string;
  exportData: string;
  grade: string;
  grades: string;
  home: string;
  importText: string;
  internationalStudents: string;
  logout: string;
  name: string;
  nationalStudents: string;
  navigation: string;
  needsLogin: string;
  no: string;
  noInternationalStudents: string;
  noNationalStudents: string;
  noStudents: string;
  or: string;
  password: string;
  points: string;
  pointHistory: string;
  searchStudents: string;
  settings: string;
  signInWithGoogle: string;
  students: string;
  studentsImported: string;
  studentOptions: string;
  submit: string;
  successfullyDeleted: string;
  username: string;
  yes: string;
  
  // Recognition System
  addPoints: string;
  averageScore: string;
  analysis: string;
  categories: string;
  distribution: string;
  excellence: string;
  filters: string;
  gradeOverview: string;
  helpfulness: string;
  level: string;
  more: string;
  noGradesFound: string;
  noAchievementsYet: string;
  noRecognitionsYet: string;
  overviewOfAllRecognitionCategories: string;
  recognitionCategories: string;
  recognition: string;
  respect: string;
  subcategories: string;
  studentsWithHighestRecognitionLevels: string;
  teamwork: string;
  topPerformers: string;
  viewRecognitionDashboard: string;
  viewStudents: string;
  
  // Class Recognition
  achievements: string;
  achievementAdded: string;
  achievementPlaceholder: string;
  addClassAchievement: string;
  addAchievementDescription: string;
  addedTo: string;
  actions: string;
  averageAttendance: string;
  classes: string;
  engagement: string;
  generatingReportFor: string;
  generateReport: string;
  improving: string;
  needsAttention: string;
  noData: string;
  reportNotImplemented: string;
  significantImprovement: string;
  steady: string;
  totalPoints: string;
  viewClass: string;
  
  // Others that should be part of the system
  achievement: string;
  addAchievement: string;
  addRecognition: string;
  addStudent: string;
  addExam: string;
  average: string;
  cancel: string;
  category: string;
  chooseRecognitionCategory: string;
  createStudent: string;
  date: string;
  description: string;
  engagementScore: string;
  enterReason: string;
  exam: string;
  examScores: string;
  examName: string;
  exportToExcel: string;
  firstName: string;
  lastName: string;
  nationality: string;
  newExam: string;
  noExams: string;
  reason: string;
  save: string;
  score: string;
  search: string;
  selectGrade: string;
  selectStudent: string;
  subjects: string;
  student: string;
  subject: string;
  updateExam: string;
  updateProfile: string;
};

const en: Translations = {
  // General
  allStudents: "All Students",
  allRightsReserved: "All rights reserved",
  byGrade: "By Grade",
  clearFilters: "Clear Filters",
  confirm: "Confirm",
  confirmDelete: "Are you sure you want to delete this student?",
  dashboard: "Dashboard",
  delete: "Delete",
  demoLoginNote: "Note: This is a demo. Actual authentication will be implemented in production.",
  edit: "Edit",
  editProfile: "Edit Profile",
  error: "Error",
  errorParsingFile: "Error parsing file",
  exportData: "Export Data",
  grade: "Grade",
  grades: "Grades",
  home: "Home",
  importText: "Import",
  internationalStudents: "International Students",
  logout: "Logout",
  name: "Name",
  nationalStudents: "National Students",
  navigation: "Navigation",
  needsLogin: "You need to log in to access this page",
  no: "No",
  noInternationalStudents: "No international students found",
  noNationalStudents: "No national students found",
  noStudents: "No students found",
  or: "or",
  password: "Password",
  points: "Points",
  pointHistory: "Point History",
  searchStudents: "Search students...",
  settings: "Settings",
  signInWithGoogle: "Sign in with Google",
  students: "Students",
  studentsImported: "students imported successfully",
  studentOptions: "Student Options",
  submit: "Submit",
  successfullyDeleted: "Student successfully deleted",
  username: "Username",
  yes: "Yes",
  
  // Recognition System
  addPoints: "Add Points",
  averageScore: "Average Score",
  analysis: "Analysis",
  categories: "Categories",
  distribution: "Distribution",
  excellence: "Excellence",
  filters: "Filters",
  gradeOverview: "Grade Overview",
  helpfulness: "Helpfulness",
  level: "Level",
  more: "more",
  noGradesFound: "No grades found",
  noAchievementsYet: "No achievements yet",
  noRecognitionsYet: "No recognitions yet",
  overviewOfAllRecognitionCategories: "Overview of all recognition categories for this grade",
  recognitionCategories: "Recognition Categories",
  recognition: "Recognition",
  respect: "Respect",
  subcategories: "Subcategories",
  studentsWithHighestRecognitionLevels: "Students with highest recognition levels",
  teamwork: "Teamwork",
  topPerformers: "Top Performers",
  viewRecognitionDashboard: "View Recognition Dashboard",
  viewStudents: "View Students",
  
  // Class Recognition
  achievements: "Achievements",
  achievementAdded: "Achievement added",
  achievementPlaceholder: "Enter achievement description",
  addClassAchievement: "Add Class Achievement",
  addAchievementDescription: "Add a new achievement for this class",
  addedTo: "added to",
  actions: "Actions",
  averageAttendance: "Avg. Attendance",
  classes: "Classes",
  engagement: "Engagement",
  generatingReportFor: "Generating report for",
  generateReport: "Generate Report",
  improving: "Improving",
  needsAttention: "Needs attention",
  noData: "No data",
  reportNotImplemented: "This feature is not implemented yet",
  significantImprovement: "Significant improvement",
  steady: "Steady",
  totalPoints: "Total Points",
  viewClass: "View Class",
  
  // Others
  achievement: "Achievement",
  addAchievement: "Add Achievement",
  addRecognition: "Add Recognition",
  addStudent: "Add Student",
  addExam: "Add Exam",
  average: "Average",
  cancel: "Cancel",
  category: "Category",
  chooseRecognitionCategory: "Choose Recognition Category",
  createStudent: "Create Student",
  date: "Date",
  description: "Description",
  engagementScore: "Engagement Score",
  enterReason: "Enter Reason",
  exam: "Exam",
  examScores: "Exam Scores",
  examName: "Exam Name",
  exportToExcel: "Export to Excel",
  firstName: "First Name",
  lastName: "Last Name",
  nationality: "Nationality",
  newExam: "New Exam",
  noExams: "No exams recorded yet",
  reason: "Reason",
  save: "Save",
  score: "Score",
  search: "Search",
  selectGrade: "Select Grade",
  selectStudent: "Select Student",
  subjects: "Subjects",
  student: "Student",
  subject: "Subject",
  updateExam: "Update Exam",
  updateProfile: "Update Profile"
};

// Arabic translations
const ar: Translations = {
  // General
  allStudents: "جميع الطلاب",
  allRightsReserved: "ج��يع الحقوق محفوظة",
  byGrade: "حسب الصف",
  clearFilters: "مسح التصفية",
  confirm: "تأكيد",
  confirmDelete: "هل أنت متأكد أنك تريد حذف هذا الطالب؟",
  dashboard: "لوحة المعلومات",
  delete: "حذف",
  demoLoginNote: "ملاحظة: هذا عرض توضيحي. سيتم تنفيذ المصادقة الفعلية في الإنتاج.",
  edit: "تعديل",
  editProfile: "تعديل الملف الشخصي",
  error: "خطأ",
  errorParsingFile: "خطأ في تحليل الملف",
  exportData: "تصدير البيانات",
  grade: "الصف",
  grades: "الصفوف",
  home: "الرئيسية",
  importText: "استيراد",
  internationalStudents: "الطلاب الدوليين",
  logout: "تسجيل الخروج",
  name: "الاسم",
  nationalStudents: "الطلاب الوطنيين",
  navigation: "التنقل",
  needsLogin: "تحتاج إلى تسجيل الدخول للوصول إلى هذه الصفحة",
  no: "لا",
  noInternationalStudents: "لم يتم العثور على طلاب دوليين",
  noNationalStudents: "لم يتم العثور على طلاب وطنيين",
  noStudents: "لم يتم العثور على طلاب",
  or: "أو",
  password: "كلمة المرور",
  points: "النقاط",
  pointHistory: "سجل النقاط",
  searchStudents: "البحث عن طلاب...",
  settings: "الإعدادات",
  signInWithGoogle: "تسجيل الدخول باستخدام جوجل",
  students: "الطلاب",
  studentsImported: "تم استيراد الطلاب بنجاح",
  studentOptions: "خيارات الطالب",
  submit: "إرسال",
  successfullyDeleted: "تم حذف الطالب بنجاح",
  username: "اسم المستخدم",
  yes: "نعم",
  
  // Recognition System
  addPoints: "إضافة نقاط",
  averageScore: "متوسط الدرجة",
  analysis: "تحليل",
  categories: "الفئات",
  distribution: "التوزيع",
  excellence: "التميز",
  filters: "التصفية",
  gradeOverview: "نظرة عامة على الصف",
  helpfulness: "المساعدة",
  level: "المستوى",
  more: "المزيد",
  noGradesFound: "لم يتم العثور على صفوف",
  noAchievementsYet: "لا توجد إنجازات بعد",
  noRecognitionsYet: "لا يوجد تقدير بعد",
  overviewOfAllRecognitionCategories: "نظرة عامة على جميع فئات التقدير لهذا الصف",
  recognitionCategories: "فئات التقدير",
  recognition: "التقدير",
  respect: "الاحترام",
  subcategories: "الفئات الفرعية",
  studentsWithHighestRecognitionLevels: "الطلاب ذوو أعلى مستويات التقدير",
  teamwork: "العمل الجماعي",
  topPerformers: "أفضل المؤدين",
  viewRecognitionDashboard: "عرض لوحة التقدير",
  viewStudents: "عرض الطلاب",
  
  // Class Recognition
  achievements: "الإنجازات",
  achievementAdded: "تمت إضافة الإنجاز",
  achievementPlaceholder: "أدخل وصف الإنجاز",
  addClassAchievement: "إضافة إنجاز للصف",
  addAchievementDescription: "إضافة إنجاز جديد لهذا الصف",
  addedTo: "تمت إضافته إلى",
  actions: "الإجراءات",
  averageAttendance: "متوسط الحضور",
  classes: "الصفوف",
  engagement: "المشاركة",
  generatingReportFor: "جاري إنشاء تقرير لـ",
  generateReport: "إنشاء تقرير",
  improving: "يتحسن",
  needsAttention: "يحتاج اهتمام",
  noData: "لا توجد بيانات",
  reportNotImplemented: "هذه الميزة غير منفذة بعد",
  significantImprovement: "تحسن كبير",
  steady: "مستقر",
  totalPoints: "إجمالي النقاط",
  viewClass: "عرض الصف",
  
  // Others
  achievement: "الإنجاز",
  addAchievement: "إضافة إنجاز",
  addRecognition: "إضافة تقدير",
  addStudent: "إضافة طالب",
  addExam: "إضافة امتحان",
  average: "المتوسط",
  cancel: "إلغاء",
  category: "الفئة",
  chooseRecognitionCategory: "اختر فئة التقدير",
  createStudent: "إنشاء طالب",
  date: "التاريخ",
  description: "الوصف",
  engagementScore: "درجة المشاركة",
  enterReason: "أدخل السبب",
  exam: "امتحان",
  examScores: "درجات الامتحان",
  examName: "اسم الامتحان",
  exportToExcel: "تصدير إلى إكسل",
  firstName: "الاسم الأول",
  lastName: "اسم العائلة",
  nationality: "الجنسية",
  newExam: "امتحان جديد",
  noExams: "لا توجد امتحانات مسجلة بعد",
  reason: "السبب",
  save: "حفظ",
  score: "الدرجة",
  search: "بحث",
  selectGrade: "اختر الصف",
  selectStudent: "اختر الطالب",
  subjects: "المواد الدراسية",
  student: "طالب",
  subject: "المادة",
  updateExam: "تحديث الامتحان",
  updateProfile: "تحديث الملف الشخصي"
};

export const getTranslations = (language: 'en' | 'ar'): Translations => {
  return language === 'ar' ? ar : en;
};
