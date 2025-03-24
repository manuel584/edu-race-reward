
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
  // Add new translations
  studentName: string;
  international: string;
  national: string;
  engagement: string;
  save: string;
  cancel: string;
  selectGrade: string;
  selectNationality: string;
  studentUpdated: string;
  studentAdded: string;
  update: string;
  overview: string;
  achievements: string;
  noAwardsYet: string;
  recognitionAdded: string;
  nominateStudent: string;
  nominationCategory: string;
  academicHelp: string;
  emotionalSupport: string;
  culturalSensitivity: string;
  conflictResolution: string;
  groupContribution: string;
  collaboration: string;
  academicExcellence: string;
  specialTalent: string;
  submitNomination: string;
  addRecognitionFor: string;
  nominationSubmitted: string;
  nominatedFor: string;
  receivedRecognitionFor: string;
  books: string;
  basicInfo: string;
  academicInfo: string;
  nominateStudentDesc: string;
  studentRecognitions: string;
  addRecognition: string;
  noFileSelected: string;
  studentsImported: string;
  fileReadError: string;
  upload: string;
  highAttendance: string;
  highEngagement: string;
  fastImprovement: string;
  strongIn: string;
  recognitionLeader: string;
  developingStrengths: string;
  classComparison: string;
  subjectComparison: string;
  classStrengths: string;
  totalPoints: string;
  improvement: string;
  noClassData: string;
  noSubjectData: string;
  subjectDescription: string;
  strengths: string;
  classUniqueMessage: string;
  welcome: string;
  description: string;
  getStarted: string;
  raceToGoal: string;
  progressOverview: string;
  studentProgress: string;
  recognitionSystem: string;
  back: string;
  attendanceReason: string;
  participationReason: string;
  homeworkReason: string;
  testResultReason: string;
  absenceReason: string;
  misbehaviorReason: string;
  incompleteWorkReason: string;
  lateSubmissionReason: string;
  quickAdd: string;
  quickDeduct: string;
  selectReason: string;
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
    // Additional translations for error fixing
    studentName: "Student Name",
    international: "International",
    national: "National",
    engagement: "Engagement",
    save: "Save",
    cancel: "Cancel",
    selectGrade: "Select Grade",
    selectNationality: "Select Nationality",
    studentUpdated: "Student updated successfully",
    studentAdded: "Student added successfully",
    update: "Update",
    overview: "Overview",
    achievements: "Achievements",
    noAwardsYet: "No awards yet",
    recognitionAdded: "Recognition added successfully",
    nominateStudent: "Nominate Student",
    nominationCategory: "Nomination Category",
    academicHelp: "Academic Help",
    emotionalSupport: "Emotional Support",
    culturalSensitivity: "Cultural Sensitivity",
    conflictResolution: "Conflict Resolution",
    groupContribution: "Group Contribution",
    collaboration: "Collaboration",
    academicExcellence: "Academic Excellence",
    specialTalent: "Special Talent",
    submitNomination: "Submit Nomination",
    addRecognitionFor: "Add Recognition",
    nominationSubmitted: "Nomination submitted successfully",
    nominatedFor: "has been nominated for",
    receivedRecognitionFor: "has received recognition for",
    books: "Books",
    basicInfo: "Basic Information",
    academicInfo: "Academic Information",
    nominateStudentDesc: "Recognize a student for their positive behavior or contributions",
    studentRecognitions: "Student Recognitions",
    addRecognition: "Add Recognition",
    noFileSelected: "No file selected",
    studentsImported: "Students imported successfully",
    fileReadError: "Error reading file",
    upload: "Upload",
    highAttendance: "High Attendance",
    highEngagement: "High Engagement",
    fastImprovement: "Fast Improvement",
    strongIn: "Strong in",
    recognitionLeader: "Recognition Leader",
    developingStrengths: "Developing Strengths",
    classComparison: "Class Comparison",
    subjectComparison: "Subject Comparison",
    classStrengths: "Class Strengths",
    totalPoints: "Total Points",
    improvement: "Improvement",
    noClassData: "No class data available",
    noSubjectData: "No subject data available",
    subjectDescription: "Subject Description",
    strengths: "Strengths",
    classUniqueMessage: "This class is unique in",
    welcome: "Welcome to Student Recognition System",
    description: "Track student progress, add recognitions, and view detailed reports",
    getStarted: "Get Started",
    raceToGoal: "Race to Goal",
    progressOverview: "Progress Overview",
    studentProgress: "Student Progress",
    recognitionSystem: "Recognition System",
    back: "Back",
    attendanceReason: "Good attendance",
    participationReason: "Active participation",
    homeworkReason: "Completed homework",
    testResultReason: "Good test result",
    absenceReason: "Unexcused absence",
    misbehaviorReason: "Classroom misbehavior",
    incompleteWorkReason: "Incomplete work",
    lateSubmissionReason: "Late submission",
    quickAdd: "Quick Add",
    quickDeduct: "Quick Deduct",
    selectReason: "Select a reason"
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
    // Additional translations for error fixing
    studentName: "اسم الطالب",
    international: "دولي",
    national: "محلي",
    engagement: "المشاركة",
    save: "حفظ",
    cancel: "إلغاء",
    selectGrade: "اختر الصف",
    selectNationality: "اختر الجنسية",
    studentUpdated: "تم تحديث الطالب بنجاح",
    studentAdded: "تمت إضافة الطالب بنجاح",
    update: "تحديث",
    overview: "نظرة عامة",
    achievements: "الإنجازات",
    noAwardsYet: "لا توجد جوائز بعد",
    recognitionAdded: "تمت إضافة التقدير بنجاح",
    nominateStudent: "ترشيح طالب",
    nominationCategory: "فئة الترشيح",
    academicHelp: "مساعدة أكاديمية",
    emotionalSupport: "دعم عاطفي",
    culturalSensitivity: "حساسية ثقافية",
    conflictResolution: "حل النزاعات",
    groupContribution: "مساهمة جماعية",
    collaboration: "تعاون",
    academicExcellence: "تميز أكاديمي",
    specialTalent: "موهبة خاصة",
    submitNomination: "تقديم الترشيح",
    addRecognitionFor: "إضافة تقدير",
    nominationSubmitted: "تم تقديم الترشيح بنجاح",
    nominatedFor: "تم ترشيحه لـ",
    receivedRecognitionFor: "حصل على تقدير لـ",
    books: "الكتب",
    basicInfo: "معلومات أساسية",
    academicInfo: "معلومات أكاديمية",
    nominateStudentDesc: "تقدير طالب لسلوكه الإيجابي أو مساهماته",
    studentRecognitions: "تقديرات الطالب",
    addRecognition: "إضافة تقدير",
    noFileSelected: "لم يتم اختيار ملف",
    studentsImported: "تم استيراد الطلاب بنجاح",
    fileReadError: "خطأ في قراءة الملف",
    upload: "رفع",
    highAttendance: "حضور مرتفع",
    highEngagement: "مشاركة عالية",
    fastImprovement: "تحسن سريع",
    strongIn: "قوي في",
    recognitionLeader: "رائد التقدير",
    developingStrengths: "تطوير نقاط القوة",
    classComparison: "مقارنة الصفوف",
    subjectComparison: "مقارنة المواد",
    classStrengths: "نقاط قوة الصف",
    totalPoints: "إجمالي النقاط",
    improvement: "التحسن",
    noClassData: "لا توجد بيانات للصف",
    noSubjectData: "لا توجد بيانات للمادة",
    subjectDescription: "وصف المادة",
    strengths: "نقاط القوة",
    classUniqueMessage: "هذا الصف فريد في",
    welcome: "مرحبًا بك في نظام تقدير الطلاب",
    description: "تتبع تقدم الطالب، وإضافة تقديرات، وعرض تقارير مفصلة",
    getStarted: "البدء",
    raceToGoal: "السباق نحو الهدف",
    progressOverview: "نظرة عامة على التقدم",
    studentProgress: "تقدم الطالب",
    recognitionSystem: "نظام التقدير",
    back: "العودة",
    attendanceReason: "حضور جيد",
    participationReason: "مشاركة فعالة",
    homeworkReason: "إكمال الواجب المنزلي",
    testResultReason: "نتيجة اختبار جيدة",
    absenceReason: "غياب بدون عذر",
    misbehaviorReason: "سوء سلوك في الفصل",
    incompleteWorkReason: "عمل غير مكتمل",
    lateSubmissionReason: "تسليم متأخر",
    quickAdd: "إضافة سريعة",
    quickDeduct: "خصم سريع",
    selectReason: "اختر سببًا"
  },
};

// Function to get translations based on locale
export const getTranslations = (locale: 'en' | 'ar') => {
  return translations[locale];
};
