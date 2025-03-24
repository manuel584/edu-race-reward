// Base translations interface
interface Translations {
  dashboard: string;
  students: string;
  addStudent: string;
  points: string;
  attendance: string;
  booksOwned: string;
  engagementScore: string;
  nationality: string;
  grade: string;
  subjects: string;
  pointsHistory: string;
  date: string;
  change: string;
  reason: string;
  search: string;
  import: string;
  noStudents: string;
  // Add missing navigation translations
  main: string;
  home: string;
  studentGroups: string;
  nationalStudents: string;
  internationalStudents: string;
  grades: string;
  studentActions: string;
  addPoints: string;
  viewHistory: string;
  exportData: string;
  settings: string;
  selectStudent: string;
  selectCategory: string;
  enterReason: string;
  balancedAchievement: string;
  balancedDesc: string;
  balancedGrowth: string;
  achievedOn: string;
  needsAllCategories: string;
  congratulations: string;
  reachedGoal: string;
  almost: string;
  keepGoing: string;
  needsImprovement: string;
  progressToGoal: string;
  profile: string;
  recognition: string;
  history: string;
  recentRecognitions: string;
  noRecognitionsYet: string;
  totalRecognitions: string;
  recognitionScores: string;
  specialRecognitions: string;
  clearFilters: string;
  searchStudents: string;
  byGrade: string;
  noInternationalStudents: string;
  noNationalStudents: string;
  allStudents: string;
  excellence: string;
  teamwork: string;
  respect: string;
  helpfulness: string;
  awards: string;
}

export const translations: { en: Translations; ar: Translations } = {
  en: {
    dashboard: "Dashboard",
    students: "Students",
    addStudent: "Add Student",
    points: "Points",
    attendance: "Attendance",
    booksOwned: "Books Owned",
    engagementScore: "Engagement Score",
    nationality: "Nationality",
    grade: "Grade",
    subjects: "Subjects",
    pointsHistory: "Points History",
    date: "Date",
    change: "Change",
    reason: "Reason",
    search: "Search",
    import: "Import",
    noStudents: "No students found",
    // Add new translations
    main: "Main Menu",
    home: "Home",
    studentGroups: "Student Groups",
    nationalStudents: "National Students",
    internationalStudents: "International Students",
    grades: "Grade Levels",
    studentActions: "Student Actions",
    addPoints: "Add Points",
    viewHistory: "View History",
    exportData: "Export Data",
    settings: "Settings",
    selectStudent: "Select Student",
    selectCategory: "Select Category",
    enterReason: "Enter Reason",
    balancedAchievement: "Balanced Achievement",
    balancedDesc: "Demonstrated excellence across all categories",
    balancedGrowth: "Balanced Growth",
    achievedOn: "Achieved",
    needsAllCategories: "Needs 5 recognitions in each category",
    congratulations: "Congratulations!",
    reachedGoal: "has reached the goal!",
    almost: "Almost there!",
    keepGoing: "Keep going!",
    needsImprovement: "Needs improvement",
    progressToGoal: "Progress to Goal",
    profile: "Profile",
    recognition: "Recognition",
    history: "History",
    recentRecognitions: "Recent Recognitions",
    noRecognitionsYet: "No recognitions yet",
    totalRecognitions: "total recognitions",
    recognitionScores: "Recognition Scores",
    specialRecognitions: "Special Recognitions",
    clearFilters: "Clear Filters",
    searchStudents: "Search students...",
    byGrade: "By Grade",
    noInternationalStudents: "No international students found",
    noNationalStudents: "No national students found",
    allStudents: "All Students",
    excellence: "Excellence",
    teamwork: "Teamwork",
    respect: "Respect",
    helpfulness: "Helpfulness",
    awards: "Awards",
  },
  ar: {
    dashboard: "لوحة التحكم",
    students: "الطلاب",
    addStudent: "إضافة طالب",
    points: "نقاط",
    attendance: "الحضور",
    booksOwned: "الكتب المملوكة",
    engagementScore: "نقاط المشاركة",
    nationality: "الجنسية",
    grade: "الصف",
    subjects: "المواد",
    pointsHistory: "سجل النقاط",
    date: "تاريخ",
    change: "تغيير",
    reason: "سبب",
    search: "بحث",
    import: "استيراد",
    noStudents: "لا يوجد طلاب",
    // Add Arabic translations
    main: "القائمة الرئيسية",
    home: "الرئيسية",
    studentGroups: "مجموعات الطلاب",
    nationalStudents: "الطلاب المحليون",
    internationalStudents: "الطلاب الدوليون",
    grades: "المستويات الدراسية",
    studentActions: "إجراءات الطالب",
    addPoints: "إضافة نقاط",
    viewHistory: "عرض السجل",
    exportData: "تصدير البيانات",
    settings: "الإعدادات",
    selectStudent: "اختر الطالب",
    selectCategory: "اختر الفئة",
    enterReason: "أدخل السبب",
    balancedAchievement: "إنجاز متوازن",
    balancedDesc: "أظهر التميز في جميع الفئات",
    balancedGrowth: "نمو متوازن",
    achievedOn: "تم تحقيقه",
    needsAllCategories: "يحتاج إلى 5 اعترافات في كل فئة",
    congratulations: "تهانينا!",
    reachedGoal: "وصل إلى الهدف!",
    almost: "اقترب من الهدف!",
    keepGoing: "واصل التقدم!",
    needsImprovement: "يحتاج إلى تحسين",
    progressToGoal: "التقدم نحو الهدف",
    profile: "الملف الشخصي",
    recognition: "التقدير",
    history: "السجل",
    recentRecognitions: "آخر التقديرات",
    noRecognitionsYet: "لا توجد تقديرات حتى الآن",
    totalRecognitions: "إجمالي التقديرات",
    recognitionScores: "درجات التقدير",
    specialRecognitions: "تقديرات خاصة",
    clearFilters: "مسح الفلاتر",
    searchStudents: "البحث عن طلاب...",
    byGrade: "حسب المستوى",
    noInternationalStudents: "لا يوجد طلاب دوليين",
    noNationalStudents: "لا يوجد طلاب محليين",
    allStudents: "جميع الطلاب",
    excellence: "التميز",
    teamwork: "العمل الجماعي",
    respect: "احترام",
    helpfulness: "مساعدة",
    awards: "الجوائز",
  },
};

// Function to get translations based on locale
export const getTranslations = (locale: 'en' | 'ar') => {
  return translations[locale];
};
