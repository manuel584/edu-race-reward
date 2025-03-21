
// Contains translations for the application
type Language = 'en' | 'ar';

type Translations = {
  [key in Language]: {
    addStudent: string;
    studentName: string;
    points: string;
    attendance: string;
    books: string;
    engagement: string;
    save: string;
    cancel: string;
    update: string;
    studentAdded: string;
    studentUpdated: string;
    delete: string;
    deleteConfirmation: string;
    confirmDelete: string;
    cancelDelete: string;
    studentDeleted: string;
    grade: string;
    selectGrade: string;
    nationality: string;
    selectNationality: string;
    international: string;
    national: string;
    subjects: string;
    selectSubject: string;
    selectSubjects: string;
    subjectMath: string;
    subjectScience: string;
    subjectEnglish: string;
    subjectHistory: string;
    subjectGeography: string;
    subjectArt: string;
    subjectMusic: string;
    subjectPE: string;
    subjectComputing: string;
    dashboard: string;
    students: string;
    import: string;
    totalStudents: string;
    averagePoints: string;
    topPerformers: string;
    recentActivity: string;
    viewAll: string;
    noActivity: string;
    allStudents: string;
    searchStudents: string;
    noStudents: string;
    byNationality: string;
    byGrade: string;
    internationalStudents: string;
    nationalStudents: string;
    noInternationalStudents: string;
    noNationalStudents: string;
    studentDetails: string;
    pointsHistory: string;
    date: string;
    change: string;
    reason: string;
    noHistory: string;
    chooseFile: string;
    dragAndDrop: string;
    fileSelected: string;
    processFile: string;
    back: string;
    goBack: string;
    notFound: string;
    notFoundMessage: string;
    backToHome: string;
    grades: string;
    exportData: string;
    settings: string;
    addPoints: string;
    deductPoints: string;
    selectReason: string;
    quickAdd: string;
    quickDeduct: string;
    attendanceReason: string;
    participationReason: string;
    homeworkReason: string;
    testResultReason: string;
    absenceReason: string;
    misbehaviorReason: string;
    incompleteWorkReason: string;
    lateSubmissionReason: string;
    main: string;
    studentGroups: string;
    studentActions: string;
    viewHistory: string;
    home: string;
    clearFilters: string;
    // Add new translations for file upload
    noFileSelected: string;
    studentsImported: string;
    fileReadError: string;
    upload: string;
  };
};

const translations: Translations = {
  en: {
    addStudent: 'Add Student',
    studentName: 'Student Name',
    points: 'Points',
    attendance: 'Attendance',
    books: 'Books Owned',
    engagement: 'Engagement Score',
    save: 'Save',
    cancel: 'Cancel',
    update: 'Update',
    studentAdded: 'Student added successfully',
    studentUpdated: 'Student updated successfully',
    delete: 'Delete',
    deleteConfirmation: 'Are you sure you want to delete this student?',
    confirmDelete: 'Yes, delete',
    cancelDelete: 'Cancel',
    studentDeleted: 'Student deleted successfully',
    grade: 'Grade',
    selectGrade: 'Select Grade',
    nationality: 'Nationality',
    selectNationality: 'Select Nationality',
    international: 'International',
    national: 'National',
    subjects: 'Subjects',
    selectSubject: 'Select a Subject',
    selectSubjects: 'Select Subjects',
    subjectMath: 'Mathematics',
    subjectScience: 'Science',
    subjectEnglish: 'English',
    subjectHistory: 'History',
    subjectGeography: 'Geography',
    subjectArt: 'Art',
    subjectMusic: 'Music',
    subjectPE: 'Physical Education',
    subjectComputing: 'Computing',
    dashboard: 'Dashboard',
    students: 'Students',
    import: 'Import',
    totalStudents: 'Total Students',
    averagePoints: 'Average Points',
    topPerformers: 'Top Performers',
    recentActivity: 'Recent Activity',
    viewAll: 'View All',
    noActivity: 'No recent activity',
    allStudents: 'All Students',
    searchStudents: 'Search students...',
    noStudents: 'No students found',
    byNationality: 'By Nationality',
    byGrade: 'By Grade',
    internationalStudents: 'International Students',
    nationalStudents: 'National Students',
    noInternationalStudents: 'No international students found',
    noNationalStudents: 'No national students found',
    studentDetails: 'Student Details',
    pointsHistory: 'Points History',
    date: 'Date',
    change: 'Change',
    reason: 'Reason',
    noHistory: 'No points history',
    chooseFile: 'Choose File',
    dragAndDrop: 'or drag and drop',
    fileSelected: 'File selected',
    processFile: 'Process File',
    back: 'Back',
    goBack: 'Go Back',
    notFound: 'Page Not Found',
    notFoundMessage: 'The page you are looking for does not exist or has been moved.',
    backToHome: 'Back to Home',
    grades: 'Grades',
    exportData: 'Export Data',
    settings: 'Settings',
    addPoints: 'Add Points',
    deductPoints: 'Deduct Points',
    selectReason: 'Select a Reason',
    quickAdd: 'Add',
    quickDeduct: 'Deduct',
    attendanceReason: 'Good Attendance',
    participationReason: 'Active Participation',
    homeworkReason: 'Excellent Homework',
    testResultReason: 'Great Test Result',
    absenceReason: 'Absence',
    misbehaviorReason: 'Misbehavior',
    incompleteWorkReason: 'Incomplete Work',
    lateSubmissionReason: 'Late Submission',
    main: 'Main',
    studentGroups: 'Student Groups',
    studentActions: 'Student Actions',
    viewHistory: 'View History',
    home: 'Home',
    clearFilters: 'Clear Filters',
    // New translations for file upload
    noFileSelected: 'No file selected',
    studentsImported: 'Students imported successfully',
    fileReadError: 'Error reading file',
    upload: 'Upload',
  },
  ar: {
    addStudent: 'إضافة طالب',
    studentName: 'اسم الطالب',
    points: 'النقاط',
    attendance: 'الحضور',
    books: 'الكتب المملوكة',
    engagement: 'درجة المشاركة',
    save: 'حفظ',
    cancel: 'إلغاء',
    update: 'تحديث',
    studentAdded: 'تمت إضافة الطالب بنجاح',
    studentUpdated: 'تم تحديث الطالب بنجاح',
    delete: 'حذف',
    deleteConfirmation: 'هل أنت متأكد أنك تريد حذف هذا الطالب؟',
    confirmDelete: 'نعم، احذف',
    cancelDelete: 'إلغاء',
    studentDeleted: 'تم حذف الطالب بنجاح',
    grade: 'الصف',
    selectGrade: 'اختر الصف',
    nationality: 'الجنسية',
    selectNationality: 'اختر الجنسية',
    international: 'دولي',
    national: 'محلي',
    subjects: 'المواد الدراسية',
    selectSubject: 'اختر مادة',
    selectSubjects: 'اختر المواد',
    subjectMath: 'الرياضيات',
    subjectScience: 'العلوم',
    subjectEnglish: 'اللغة الإنجليزية',
    subjectHistory: 'التاريخ',
    subjectGeography: 'الجغرافيا',
    subjectArt: 'الفن',
    subjectMusic: 'الموسيقى',
    subjectPE: 'التربية البدنية',
    subjectComputing: 'الحاسوب',
    dashboard: 'لوحة التحكم',
    students: 'الطلاب',
    import: 'استيراد',
    totalStudents: 'إجمالي الطلاب',
    averagePoints: 'متوسط النقاط',
    topPerformers: 'أفضل المؤدين',
    recentActivity: 'النشاط الأخير',
    viewAll: 'عرض الكل',
    noActivity: 'لا يوجد نشاط حديث',
    allStudents: 'جميع الطلاب',
    searchStudents: 'البحث عن طلاب...',
    noStudents: 'لم يتم العثور على طلاب',
    byNationality: 'حسب الجنسية',
    byGrade: 'حسب الصف',
    internationalStudents: 'الطلاب الدوليين',
    nationalStudents: 'الطلاب المحليين',
    noInternationalStudents: 'لم يتم العثور على طلاب دوليين',
    noNationalStudents: 'لم يتم العثور على طلاب محليين',
    studentDetails: 'تفاصيل الطالب',
    pointsHistory: 'سجل النقاط',
    date: 'التاريخ',
    change: 'التغيير',
    reason: 'السبب',
    noHistory: 'لا يوجد سجل نقاط',
    chooseFile: 'اختر ملف',
    dragAndDrop: 'أو اسحب وأفلت',
    fileSelected: 'تم اختيار الملف',
    processFile: 'معالجة الملف',
    back: 'رجوع',
    goBack: 'العودة',
    notFound: 'الصفحة غير موجودة',
    notFoundMessage: 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.',
    backToHome: 'العودة إلى الرئيسية',
    grades: 'الصفوف',
    exportData: 'تصدير البيانات',
    settings: 'الإعدادات',
    addPoints: 'إضافة نقاط',
    deductPoints: 'خصم نقاط',
    selectReason: 'اختر سبباً',
    quickAdd: 'إضافة',
    quickDeduct: 'خصم',
    attendanceReason: 'حضور جيد',
    participationReason: 'مشاركة فعالة',
    homeworkReason: 'واجب منزلي ممتاز',
    testResultReason: 'نتيجة اختبار رائعة',
    absenceReason: 'غياب',
    misbehaviorReason: 'سوء سلوك',
    incompleteWorkReason: 'عمل غير مكتمل',
    lateSubmissionReason: 'تقديم متأخر',
    main: 'الرئيسية',
    studentGroups: 'مجموعات الطلاب',
    studentActions: 'إجراءات الطالب',
    viewHistory: 'عرض السجل',
    home: 'الرئيسية',
    clearFilters: 'مسح الفلاتر',
    // New translations for file upload
    noFileSelected: 'لم يتم اختيار ملف',
    studentsImported: 'تم استيراد الطلاب بنجاح',
    fileReadError: 'خطأ في قراءة الملف',
    upload: 'رفع',
  },
};

export const getTranslations = (language: Language) => {
  return translations[language];
};
