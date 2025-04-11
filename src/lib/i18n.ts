type Translations = {
  home?: string;
  students?: string;
  addStudent?: string;
  importStudents?: string;
  name?: string;
  points?: string;
  attendance?: string;
  booksOwned?: string;
  engagementScore?: string;
  nationality?: string;
  grade?: string;
  subjects?: string;
  actions?: string;
  search?: string;
  add?: string;
  edit?: string;
  delete?: string;
  studentName?: string;
  studentDetails?: string;
  pointsHistory?: string;
  date?: string;
  change?: string;
  reason?: string;
  helpfulness?: string;
  respect?: string;
  teamwork?: string;
  excellence?: string;
  awards?: string;
  recognitions?: string;
  type?: string;
  description?: string;
  save?: string;
  cancel?: string;
  confirmDelete?: string;
  studentDeleted?: string;
  editStudent?: string;
  updatePoints?: string;
  enterPointsChange?: string;
  reasonForChange?: string;
  nominateStudent?: string;
  category?: string;
  nominator?: string;
  submitNomination?: string;
  nominationSubmitted?: string;
  gradeRecognition?: string;
  achievements?: string;
  addClassAchievement?: string;
  achievementDescription?: string;
  classMetrics?: string;
  totalPoints?: string;
  averageAttendance?: string;
  averageEngagement?: string;
  weeklyImprovement?: string;
  import?: string;
  chooseFile?: string;
  upload?: string;
  fileUploaded?: string;
  login?: string;
  username?: string;
  password?: string;
  loginButton?: string;
  logout?: string;
  studentAdded?: string;
  studentUpdated?: string;
  examCenter?: string;
  scores?: string;
  createExam?: string;
  allExams?: string;
  upcoming?: string;
  archived?: string;
  noExamsYet?: string;
  noExamsDescription?: string;
  examTitle?: string;
  enterExamTitle?: string;
  titleRequired?: string;
  examType?: string;
  selectType?: string;
  quiz?: string;
  exam?: string;
  test?: string;
  duration?: string;
  enterDuration?: string;
  validDurationRequired?: string;
  questions?: string;
  addQuestion?: string;
  addAtLeastOneQuestion?: string;
  noQuestionsAdded?: string;
  addYourFirstQuestion?: string;
  updateExam?: string;
  questionText?: string;
  enterQuestionText?: string;
  questionType?: string;
  multipleChoice?: string;
  trueFalse?: string;
  shortAnswer?: string;
  essay?: string;
  options?: string;
  allowMultipleAnswers?: string;
  option?: string;
  addOption?: string;
  correctAnswer?: string;
  forGrading?: string;
  enterCorrectAnswer?: string;
  essayNoCorrectAnswer?: string;
  minutes?: string;
  view?: string;
  examDeleted?: string;
  examUpdated?: string;
  examAdded?: string;
  addScore?: string;
  editScore?: string;
  examName?: string;
  score?: string;
  enterStudentName?: string;
  enterExamName?: string;
  enterScore?: string;
  studentNameRequired?: string;
  examNameRequired?: string;
  validScoreRequired?: string;
  updateScore?: string;
  scoreAdded?: string;
  scoreUpdated?: string;
  scoreDeleted?: string;
  noScoresYet?: string;
  export?: string;
  studentScores?: string;
  average?: string;
  exportSuccess?: string;
  nav?: string;
  dash?: string;
  filter?: string;
  nationalStuds?: string;
  internationalStuds?: string;
  studentOpts?: string;
  addPts?: string;
  exportDt?: string;
  sett?: string;
  recogCats?: string;
  enterDescription?: string;
};

const translations: { [key: string]: Translations } = {
  en: {
    home: 'Home',
    students: 'Students',
    addStudent: 'Add Student',
    importStudents: 'Import Students',
    name: 'Name',
    points: 'Points',
    attendance: 'Attendance',
    booksOwned: 'Books Owned',
    engagementScore: 'Engagement Score',
    nationality: 'Nationality',
    grade: 'Grade',
    subjects: 'Subjects',
    actions: 'Actions',
    search: 'Search',
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    studentName: 'Student Name',
    studentDetails: 'Student Details',
    pointsHistory: 'Points History',
    date: 'Date',
    change: 'Change',
    reason: 'Reason',
    helpfulness: 'Helpfulness',
    respect: 'Respect',
    teamwork: 'Teamwork',
    excellence: 'Excellence',
    awards: 'Awards',
    recognitions: 'Recognitions',
    type: 'Type',
    description: 'Description',
    save: 'Save',
    cancel: 'Cancel',
    confirmDelete: 'Are you sure you want to delete this student?',
    studentDeleted: 'Student deleted successfully',
    editStudent: 'Edit Student',
    updatePoints: 'Update Points',
    enterPointsChange: 'Enter points change',
    reasonForChange: 'Reason for change',
    nominateStudent: 'Nominate Student',
    category: 'Category',
    nominator: 'Nominator',
    submitNomination: 'Submit Nomination',
    nominationSubmitted: 'Nomination submitted successfully',
    gradeRecognition: 'Grade Recognition',
    achievements: 'Achievements',
    addClassAchievement: 'Add Class Achievement',
    achievementDescription: 'Achievement Description',
    classMetrics: 'Class Metrics',
    totalPoints: 'Total Points',
    averageAttendance: 'Average Attendance',
    averageEngagement: 'Average Engagement',
    weeklyImprovement: 'Weekly Improvement',
    import: 'Import',
    chooseFile: 'Choose File',
    upload: 'Upload',
    fileUploaded: 'File uploaded successfully',
    login: 'Login',
    username: 'Username',
    password: 'Password',
    loginButton: 'Login',
    logout: 'Logout',
    studentAdded: 'Student added successfully',
    studentUpdated: 'Student updated successfully',
    examCenter: 'Exam Center',
    scores: 'Scores',
    createExam: 'Create Exam',
    allExams: 'All Exams',
    upcoming: 'Upcoming',
    archived: 'Archived',
    noExamsYet: 'No exams created yet',
    noExamsDescription: 'Start by creating your first exam to manage quizzes and track student performance.',
    examTitle: 'Exam Title',
    enterExamTitle: 'Enter exam title',
    titleRequired: 'Title is required',
    enterDescription: 'Enter exam description',
    examType: 'Exam Type',
    selectType: 'Select exam type',
    quiz: 'Quiz',
    exam: 'Exam',
    test: 'Test',
    duration: 'Duration (minutes)',
    enterDuration: 'Enter duration in minutes',
    validDurationRequired: 'Please enter a valid duration',
    questions: 'Questions',
    addQuestion: 'Add Question',
    addAtLeastOneQuestion: 'Add at least one question',
    noQuestionsAdded: 'No questions added yet',
    addYourFirstQuestion: 'Add your first question',
    updateExam: 'Update Exam',
    questionText: 'Question Text',
    enterQuestionText: 'Enter question text',
    questionType: 'Question Type',
    multipleChoice: 'Multiple Choice',
    trueFalse: 'True/False',
    shortAnswer: 'Short Answer',
    essay: 'Essay',
    options: 'Options',
    allowMultipleAnswers: 'Allow multiple answers',
    option: 'Option',
    addOption: 'Add Option',
    correctAnswer: 'Correct Answer',
    forGrading: 'for grading',
    enterCorrectAnswer: 'Enter correct answer',
    essayNoCorrectAnswer: 'Essay questions require manual grading',
    minutes: 'minutes',
    view: 'View',
    examDeleted: 'Exam deleted successfully',
    examUpdated: 'Exam updated successfully',
    examAdded: 'Exam created successfully',
    addScore: 'Add Score',
    editScore: 'Edit Score',
    examName: 'Exam Name',
    score: 'Score',
    enterStudentName: 'Enter student name',
    enterExamName: 'Enter exam name',
    enterScore: 'Enter score (0-100)',
    studentNameRequired: 'Student name is required',
    examNameRequired: 'Exam name is required',
    validScoreRequired: 'Please enter a valid score (0-100)',
    updateScore: 'Update Score',
    scoreAdded: 'Score added successfully',
    scoreUpdated: 'Score updated successfully',
    scoreDeleted: 'Score deleted successfully',
    noScoresYet: 'No scores added yet',
    export: 'Export',
    studentScores: 'Student Scores',
    average: 'Average',
    exportSuccess: 'Exported successfully',
    nav: 'Navigation',
    dash: 'Dashboard',
    filter: 'Filters',
    nationalStuds: 'National Students',
    internationalStuds: 'International Students',
    studentOpts: 'Student Options',
    addPts: 'Add Points',
    exportDt: 'Export Data',
    sett: 'Settings',
    recogCats: 'Recognition Categories',
    enterDescription: 'Enter exam description'
  },
  ar: {
    home: 'الرئيسية',
    students: 'الطلاب',
    addStudent: 'إضافة طالب',
    importStudents: 'استيراد الطلاب',
    name: 'الاسم',
    points: 'النقاط',
    attendance: 'الحضور',
    booksOwned: 'الكتب المملوكة',
    engagementScore: 'نقاط المشاركة',
    nationality: 'الجنسية',
    grade: 'الصف',
    subjects: 'المواد',
    actions: 'الإجراءات',
    search: 'بحث',
    add: 'إضافة',
    edit: 'تعديل',
    delete: 'حذف',
    studentName: 'اسم الطالب',
    studentDetails: 'تفاصيل الطالب',
    pointsHistory: 'سجل النقاط',
    date: 'التاريخ',
    change: 'التغيير',
    reason: 'السبب',
    helpfulness: 'المساعدة',
    respect: 'الاحترام',
    teamwork: 'العمل الجماعي',
    excellence: 'التميز',
    awards: 'الجوائز',
    recognitions: 'التقديرات',
    type: 'النوع',
    description: 'الوصف',
    save: 'حفظ',
    cancel: 'إلغاء',
    confirmDelete: 'هل أنت متأكد أنك تريد حذف هذا الطالب؟',
    studentDeleted: 'تم حذف الطالب بنجاح',
    editStudent: 'تعديل الطالب',
    updatePoints: 'تحديث النقاط',
    enterPointsChange: 'أدخل تغيير النقاط',
    reasonForChange: 'سبب التغيير',
    nominateStudent: 'ترشيح الطالب',
    category: 'الفئة',
    nominator: 'المرشح',
    submitNomination: 'إرسال الترشيح',
    nominationSubmitted: 'تم إرسال الترشيح بنجاح',
    gradeRecognition: 'تقدير الصف',
    achievements: 'الإنجازات',
    addClassAchievement: 'إضافة إنجاز للصف',
    achievementDescription: 'وصف الإنجاز',
    classMetrics: 'مقاييس الصف',
    totalPoints: 'مجموع النقاط',
    averageAttendance: 'متوسط الحضور',
    averageEngagement: 'متوسط المشاركة',
    weeklyImprovement: 'التحسن الأسبوعي',
    import: 'استيراد',
    chooseFile: 'اختر ملفا',
    upload: 'رفع',
    fileUploaded: 'تم رفع الملف بنجاح',
    login: 'تسجيل الدخول',
    username: 'اسم المستخدم',
    password: 'كلمة المرور',
    loginButton: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    studentAdded: 'تمت إضافة الطالب بنجاح',
    studentUpdated: 'تم تحديث الطالب بنجاح',
    examCenter: 'مركز الاختبارات',
    scores: 'النتائج',
    createExam: 'إنشاء اختبار',
    allExams: 'جميع الاختبارات',
    upcoming: 'القادمة',
    archived: 'المؤرشفة',
    noExamsYet: 'لا توجد اختبارات تم إنشاؤها حتى الآن',
    noExamsDescription: 'ابدأ بإنشاء الاختبار الأول لإدارة الاختبارات القصيرة وتتبع أداء الطلاب.',
    examTitle: 'عنوان الاختبار',
    enterExamTitle: 'أدخل عنوان الاختبار',
    titleRequired: 'العنوان مطلوب',
    enterDescription: 'أدخل وصف الاختبار',
    examType: 'نوع الاختبار',
    selectType: 'اختر نوع الاختبار',
    quiz: 'اختبار قصير',
    exam: 'امتحان',
    test: 'اختبار',
    duration: 'المدة (بالدقائق)',
    enterDuration: 'أدخل المدة بالدقائق',
    validDurationRequired: 'الرجاء إدخال مدة صحيحة',
    questions: 'الأسئلة',
    addQuestion: 'إضافة سؤال',
    addAtLeastOneQuestion: 'أضف سؤال واحد على الأقل',
    noQuestionsAdded: 'لم يتم إضافة أسئلة بعد',
    addYourFirstQuestion: 'أضف سؤالك الأول',
    updateExam: 'تحديث الاختبار',
    questionText: 'نص السؤال',
    enterQuestionText: 'أدخل نص السؤال',
    questionType: 'نوع السؤال',
    multipleChoice: 'اختيار من متعدد',
    trueFalse: 'صواب / خطأ',
    shortAnswer: 'إجابة قصيرة',
    essay: 'مقال',
    options: 'خيارات',
    allowMultipleAnswers: 'السماح بإجابات متعددة',
    option: 'خيار',
    addOption: 'إضافة خيار',
    correctAnswer: 'الإجابة الصحيحة',
    forGrading: 'للتصحيح',
    enterCorrectAnswer: 'أدخل الإجابة الصحيحة',
    essayNoCorrectAnswer: 'تتطلب أسئلة المقال تصحيحًا يدويًا',
    minutes: 'دقائق',
    view: 'عرض',
    examDeleted: 'تم حذف الاختبار بنجاح',
    examUpdated: 'تم تحديث الاختبار بنجاح',
    examAdded: 'تم إنشاء الاختبار بنجاح',
    addScore: 'إضافة نتيجة',
    editScore: 'تعديل النتيجة',
    examName: 'اسم الاختبار',
    score: 'النتيجة',
    enterStudentName: 'أدخل اسم الطالب',
    enterExamName: 'أدخل اسم الاختبار',
    enterScore: 'أدخل النتيجة (0-100)',
    studentNameRequired: 'اسم الطالب مطلوب',
    examNameRequired: 'اسم الاختبار مطلوب',
    validScoreRequired: 'الرجاء إدخال نتيجة صحيحة (0-100)',
    updateScore: 'تحديث النتيجة',
    scoreAdded: 'تمت إضافة النتيجة بنجاح',
    scoreUpdated: 'تم تحديث النتيجة بنجاح',
    scoreDeleted: 'تم حذف النتيجة بنجاح',
    noScoresYet: 'لم يتم إضافة نتائج بعد',
    export: 'تصدير',
    studentScores: 'نتائج الطلاب',
    average: 'المعدل',
    exportSuccess: 'تم التصدير بنجاح',
    nav: 'التنقل',
    dash: 'لوحة التحكم',
    filter: 'التصفية',
    nationalStuds: 'الطلاب الوطنيون',
    internationalStuds: 'الطلاب الدوليون',
    studentOpts: 'خيارات الطالب',
    addPts: 'إضافة نقاط',
    exportDt: 'تصدير البيانات',
    sett: 'الإعدادات',
    recogCats: 'فئات التقدير',
    enterDescription: 'أدخل وصف الاختبار'
  },
};

export const getTranslations = (language: string = 'en'): Translations => {
  return translations[language] || translations.en;
};
