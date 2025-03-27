
import { createTranslations } from './studentData';

export type Translations = {
  dashboard: string;
  students: string;
  grades: string;
  settings: string;
  language: string;
  english: string;
  arabic: string;
  home: string;
  pointsGoal: string;
  changePointsGoal: string;
  changeGoalDesc: string;
  save: string;
  cancel: string;
  goalUpdated: string;
  allStudents: string;
  internationalStudents: string;
  nationalStudents: string;
  importText: string;
  byGrade: string;
  searchStudents: string;
  clearFilters: string;
  noStudents: string;
  noInternationalStudents: string;
  noNationalStudents: string;
  student: string;
  recognition: string;
  grade: string;
  addStudent: string;
  quickAddPoints: string;
  quickDeductPoints: string;
  points: string;
  pointHistory: string;
  goalReached: string;
  view: string;
  date: string;
  reason: string;
  profile: string;
  import: string;
  upload: string;
  uploadFile: string;
  uploading: string;
  uploadSuccess: string;
  uploadDescription: string;
  errorParsingFile: string;
  studentsImported: string;
  nominate: string;
  add: string;
  remove: string;
  toGoal: string;
  welcome: string;
  welcomeDescription: string;
  export: string;
  getStarted: string;
  raceToGoal: string;
  studentRecognition: string;
  viewRecognitionDashboard: string;
  recognizeTheseStudents: string;
  noRecognitionsYet: string;
  recognitionCategories: string;
  selectACategory: string;
  selectReason: string;
  helpfulness: string;
  respect: string;
  teamwork: string;
  excellence: string;
  addAward: string;
  recognitionNotFound: string;
  helpfulnessTitle: string;
  respectTitle: string;
  teamworkTitle: string;
  excellenceTitle: string;
  notFound: string;
  notFoundMessage: string;
  backToDashboard: string;
  back: string;
  progressToGoal: string;
  national: string;
  international: string;
  congratulations: string;
  reachedGoal: string;
  almost: string;
  keepGoing: string;
  needsImprovement: string;
  attendance: string;
  books: string;
  studentName: string;
  selectNationality: string;
  updateStudent: string;
  studentUpdated: string;
  errorSubmittingForm: string;
  nominateStudentDesc: string;
  nominateStudent: string;
  submitNomination: string;
  commentsPlaceholder: string;
  additionalComments: string;
  selectReasonDescription: string;
  reasonForNomination: string;
  nominationSubmitted: string;
  nominatedFor: string;
  recentlyNominated: string;
  noRecentNominations: string;
  noStudentsFound: string;
  totalRecognitions: string;
  balancedGrowth: string;
  achievedOn: string;
  needsAllCategories: string;
  awards: string;
  specialRecognitions: string;
  balancedAchievement: string;
  balancedDesc: string;
  noAwardsYet: string;
  recentRecognitions: string;
  history: string;
  overview: string;
  recognitionScores: string;
  detailedBreakdownOfSubcategories: string;
  helpfulnessDescription: string;
  respectDescription: string;
  teamworkDescription: string;
  excellenceDescription: string;
  studentRecognitions: string;
  studentProgress: string;
  classComparison: string;
  recognitionSystem: string;
  raceToGoalDescription: string;
  progressOverview: string;
  change: string;
  average: string;
  // New translations for scores feature
  scores: string;
  addScore: string;
  editScore: string;
  updateScore: string;
  examName: string;
  score: string;
  actions: string;
  confirmDelete: string;
  scoreAdded: string;
  scoreUpdated: string;
  scoreDeleted: string;
  studentScores: string;
  exportSuccess: string;
  enterStudentName: string;
  enterExamName: string;
  enterScore: string;
  studentNameRequired: string;
  examNameRequired: string;
  validScoreRequired: string;
  noScoresYet: string;
};

const englishTranslations: Translations = {
  dashboard: 'Dashboard',
  students: 'Students',
  grades: 'Grades',
  settings: 'Settings',
  language: 'Language',
  english: 'English',
  arabic: 'Arabic',
  home: 'Home',
  pointsGoal: 'Points Goal',
  changePointsGoal: 'Change Points Goal',
  changeGoalDesc: 'Set the number of points students need to reach the goal',
  save: 'Save',
  cancel: 'Cancel',
  goalUpdated: 'Goal updated successfully',
  allStudents: 'All Students',
  internationalStudents: 'International Students',
  nationalStudents: 'National Students',
  importText: 'Import',
  byGrade: 'By Grade',
  searchStudents: 'Search students...',
  clearFilters: 'Clear Filters',
  noStudents: 'No students found',
  noInternationalStudents: 'No international students found',
  noNationalStudents: 'No national students found',
  student: 'Student',
  recognition: 'Recognition',
  grade: 'Grade',
  addStudent: 'Add Student',
  quickAddPoints: 'Quick Add Points',
  quickDeductPoints: 'Quick Deduct Points',
  points: 'Points',
  pointHistory: 'Points History',
  goalReached: 'Goal Reached!',
  view: 'View',
  date: 'Date',
  reason: 'Reason',
  profile: 'Profile',
  import: 'Import',
  upload: 'Upload',
  uploadFile: 'Upload File',
  uploading: 'Uploading...',
  uploadSuccess: 'Upload Successful',
  uploadDescription: 'Upload a CSV or Excel file containing student data to import them into the system.',
  errorParsingFile: 'Error parsing file',
  studentsImported: 'students imported',
  nominate: 'Nominate',
  add: 'Add',
  remove: 'Remove',
  toGoal: 'to goal',
  welcome: 'Welcome to the Student Recognition System',
  welcomeDescription: 'Track student progress, manage rewards, and recognize achievements',
  export: 'Export',
  getStarted: 'Get Started',
  raceToGoal: 'Race to Goal',
  studentRecognition: 'Student Recognition',
  viewRecognitionDashboard: 'View Recognition Dashboard',
  recognizeTheseStudents: 'Recognize These Students',
  noRecognitionsYet: 'No recognitions yet',
  recognitionCategories: 'Recognition Categories',
  selectACategory: 'Select a category',
  selectReason: 'Select reason',
  helpfulness: 'Helpfulness',
  respect: 'Respect',
  teamwork: 'Teamwork',
  excellence: 'Excellence',
  addAward: 'Add Award',
  recognitionNotFound: 'Recognition not found',
  helpfulnessTitle: 'Helpfulness Star',
  respectTitle: 'Respect Star',
  teamworkTitle: 'Teamwork Star',
  excellenceTitle: 'Excellence Star',
  notFound: 'Page Not Found',
  notFoundMessage: 'The page you are looking for does not exist or has been moved.',
  backToDashboard: 'Back to Dashboard',
  back: 'Back',
  progressToGoal: 'Progress to Goal',
  national: 'National',
  international: 'International',
  congratulations: 'Congratulations!',
  reachedGoal: 'reached goal!',
  almost: 'Almost there!',
  keepGoing: 'Keep going!',
  needsImprovement: 'Needs improvement',
  attendance: 'Attendance',
  books: 'Books',
  studentName: 'Student Name',
  selectNationality: 'Select Nationality',
  updateStudent: 'Update Student',
  studentUpdated: 'Student updated successfully',
  errorSubmittingForm: 'Error submitting form',
  nominateStudentDesc: 'Recognize a student who has demonstrated exceptional qualities',
  nominateStudent: 'Nominate Student',
  submitNomination: 'Submit Nomination',
  commentsPlaceholder: 'Enter any additional details about why this student deserves recognition',
  additionalComments: 'Additional Comments',
  selectReasonDescription: 'Select a specific reason for this nomination',
  reasonForNomination: 'Reason for Nomination',
  nominationSubmitted: 'Nomination submitted successfully',
  nominatedFor: 'nominated for',
  recentlyNominated: 'Recently Nominated',
  noRecentNominations: 'No recent nominations',
  noStudentsFound: 'No students found',
  totalRecognitions: 'Total Recognitions',
  balancedGrowth: 'Balanced Growth',
  achievedOn: 'Achieved on',
  needsAllCategories: 'Needs recognition in all categories',
  awards: 'Awards',
  specialRecognitions: 'Special Recognitions',
  balancedAchievement: 'Balanced Achievement',
  balancedDesc: 'Awarded to students who show growth in all areas',
  noAwardsYet: 'No awards earned yet',
  recentRecognitions: 'Recent Recognitions',
  history: 'History',
  overview: 'Overview',
  recognitionScores: 'Recognition Scores',
  detailedBreakdownOfSubcategories: 'Detailed breakdown of recognition subcategories',
  helpfulnessDescription: 'Recognizes students who assist others academically or emotionally',
  respectDescription: 'Honors students who show respect for diversity and resolve conflicts',
  teamworkDescription: 'Celebrates students who collaborate effectively in group settings',
  excellenceDescription: 'Acknowledges students who consistently strive for high standards',
  studentRecognitions: 'Student Recognitions',
  studentProgress: 'Student Progress',
  classComparison: 'Class Comparison',
  recognitionSystem: 'Recognition System',
  raceToGoalDescription: 'Monitor student progress as they race to reach the point goal',
  progressOverview: 'Progress Overview',
  change: 'Change',
  average: 'Average',
  // New translations for scores feature
  scores: 'Scores',
  addScore: 'Add Score',
  editScore: 'Edit Score',
  updateScore: 'Update Score',
  examName: 'Exam Name',
  score: 'Score',
  actions: 'Actions',
  confirmDelete: 'Are you sure you want to delete this score?',
  scoreAdded: 'Score added successfully',
  scoreUpdated: 'Score updated successfully',
  scoreDeleted: 'Score deleted successfully',
  studentScores: 'Student Scores',
  exportSuccess: 'Exported successfully',
  enterStudentName: 'Enter student name',
  enterExamName: 'Enter exam name',
  enterScore: 'Enter score (0-100)',
  studentNameRequired: 'Student name is required',
  examNameRequired: 'Exam name is required',
  validScoreRequired: 'Please enter a valid score (0-100)',
  noScoresYet: 'No scores added yet'
};

const arabicTranslations: Translations = {
  dashboard: 'لوحة التحكم',
  students: 'الطلاب',
  grades: 'الصفوف',
  settings: 'الإعدادات',
  language: 'اللغة',
  english: 'الإنجليزية',
  arabic: 'العربية',
  home: 'الرئيسية',
  pointsGoal: 'هدف النقاط',
  changePointsGoal: 'تغيير هدف النقاط',
  changeGoalDesc: 'حدد عدد النقاط التي يحتاجها الطلاب للوصول إلى الهدف',
  save: 'حفظ',
  cancel: 'إلغاء',
  goalUpdated: 'تم تحديث الهدف بنجاح',
  allStudents: 'جميع الطلاب',
  internationalStudents: 'الطلاب الدوليون',
  nationalStudents: 'الطلاب الوطنيون',
  importText: 'استيراد',
  byGrade: 'حسب الصف',
  searchStudents: 'البحث عن الطلاب...',
  clearFilters: 'مسح الفلاتر',
  noStudents: 'لم يتم العثور على طلاب',
  noInternationalStudents: 'لم يتم العثور على طلاب دوليين',
  noNationalStudents: 'لم يتم العثور على طلاب وطنيين',
  student: 'الطالب',
  recognition: 'التقدير',
  grade: 'الصف',
  addStudent: 'إضافة طالب',
  quickAddPoints: 'إضافة نقاط سريعة',
  quickDeductPoints: 'خصم نقاط سريع',
  points: 'نقاط',
  pointHistory: 'سجل النقاط',
  goalReached: 'تم الوصول للهدف!',
  view: 'عرض',
  date: 'التاريخ',
  reason: 'السبب',
  profile: 'الملف الشخصي',
  import: 'استيراد',
  upload: 'رفع',
  uploadFile: 'رفع ملف',
  uploading: 'جاري الرفع...',
  uploadSuccess: 'تم الرفع بنجاح',
  uploadDescription: 'قم برفع ملف CSV أو Excel يحتوي على بيانات الطلاب لاستيرادهم إلى النظام.',
  errorParsingFile: 'خطأ في تحليل الملف',
  studentsImported: 'تم استيراد الطلاب',
  nominate: 'ترشيح',
  add: 'إضافة',
  remove: 'إزالة',
  toGoal: 'للهدف',
  welcome: 'مرحبا بك في نظام تقدير الطلاب',
  welcomeDescription: 'تتبع تقدم الطلاب، وإدارة المكافآت، والاعتراف بالإنجازات',
  export: 'تصدير',
  getStarted: 'ابدأ الآن',
  raceToGoal: 'السباق إلى الهدف',
  studentRecognition: 'تقدير الطلاب',
  viewRecognitionDashboard: 'عرض لوحة تحكم التقدير',
  recognizeTheseStudents: 'تقدير هؤلاء الطلاب',
  noRecognitionsYet: 'لا توجد تقديرات بعد',
  recognitionCategories: 'فئات التقدير',
  selectACategory: 'اختر فئة',
  selectReason: 'اختر السبب',
  helpfulness: 'المساعدة',
  respect: 'الاحترام',
  teamwork: 'العمل الجماعي',
  excellence: 'التميز',
  addAward: 'إضافة جائزة',
  recognitionNotFound: 'لم يتم العثور على التقدير',
  helpfulnessTitle: 'نجمة المساعدة',
  respectTitle: 'نجمة الاحترام',
  teamworkTitle: 'نجمة العمل الجماعي',
  excellenceTitle: 'نجمة التميز',
  notFound: 'الصفحة غير موجودة',
  notFoundMessage: 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.',
  backToDashboard: 'العودة إلى لوحة التحكم',
  back: 'رجوع',
  progressToGoal: 'التقدم نحو الهدف',
  national: 'وطني',
  international: 'دولي',
  congratulations: 'تهانينا!',
  reachedGoal: 'وصل للهدف!',
  almost: 'اقترب من الهدف!',
  keepGoing: 'استمر!',
  needsImprovement: 'يحتاج إلى تحسين',
  attendance: 'الحضور',
  books: 'الكتب',
  studentName: 'اسم الطالب',
  selectNationality: 'اختر الجنسية',
  updateStudent: 'تحديث الطالب',
  studentUpdated: 'تم تحديث الطالب بنجاح',
  errorSubmittingForm: 'خطأ في تقديم النموذج',
  nominateStudentDesc: 'تقدير طالب أظهر صفات استثنائية',
  nominateStudent: 'ترشيح طالب',
  submitNomination: 'تقديم الترشيح',
  commentsPlaceholder: 'أدخل أي تفاصيل إضافية حول سبب استحقاق هذا الطالب للتقدير',
  additionalComments: 'تعليقات إضافية',
  selectReasonDescription: 'اختر سببًا محددًا لهذا الترشيح',
  reasonForNomination: 'سبب الترشيح',
  nominationSubmitted: 'تم تقديم الترشيح بنجاح',
  nominatedFor: 'تم ترشيحه لـ',
  recentlyNominated: 'تم ترشيحهم مؤخرًا',
  noRecentNominations: 'لا توجد ترشيحات حديثة',
  noStudentsFound: 'لم يتم العثور على طلاب',
  totalRecognitions: 'إجمالي التقديرات',
  balancedGrowth: 'النمو المتوازن',
  achievedOn: 'تم تحقيقه في',
  needsAllCategories: 'يحتاج إلى تقدير في جميع الفئات',
  awards: 'الجوائز',
  specialRecognitions: 'تقديرات خاصة',
  balancedAchievement: 'الإنجاز المتوازن',
  balancedDesc: 'تُمنح للطلاب الذين يُظهرون نموًا في جميع المجالات',
  noAwardsYet: 'لم يتم الحصول على جوائز بعد',
  recentRecognitions: 'التقديرات الأخيرة',
  history: 'السجل',
  overview: 'نظرة عامة',
  recognitionScores: 'درجات التقدير',
  detailedBreakdownOfSubcategories: 'تقسيم مفصل للفئات الفرعية للتقدير',
  helpfulnessDescription: 'يقدر الطلاب الذين يساعدون الآخرين أكاديميًا أو عاطفيًا',
  respectDescription: 'يكرم الطلاب الذين يظهرون احترامًا للتنوع ويحلون النزاعات',
  teamworkDescription: 'يحتفي بالطلاب الذين يتعاونون بفعالية في إعدادات المجموعة',
  excellenceDescription: 'يعترف بالطلاب الذين يسعون باستمرار لتحقيق معايير عالية',
  studentRecognitions: 'تقديرات الطلاب',
  studentProgress: 'تقدم الطلاب',
  classComparison: 'مقارنة الصفوف',
  recognitionSystem: 'نظام التقدير',
  raceToGoalDescription: 'مراقبة تقدم الطلاب أثناء سباقهم للوصول إلى هدف النقاط',
  progressOverview: 'نظرة عامة على التقدم',
  change: 'التغيير',
  average: 'المتوسط',
  // New translations for scores feature
  scores: 'الدرجات',
  addScore: 'إضافة درجة',
  editScore: 'تعديل الدرجة',
  updateScore: 'تحديث الدرجة',
  examName: 'اسم الامتحان',
  score: 'الدرجة',
  actions: 'الإجراءات',
  confirmDelete: 'هل أنت متأكد أنك تريد حذف هذه الدرجة؟',
  scoreAdded: 'تمت إضافة الدرجة بنجاح',
  scoreUpdated: 'تم تحديث الدرجة بنجاح',
  scoreDeleted: 'تم حذف الدرجة بنجاح',
  studentScores: 'درجات الطلاب',
  exportSuccess: 'تم التصدير بنجاح',
  enterStudentName: 'أدخل اسم الطالب',
  enterExamName: 'أدخل اسم الامتحان',
  enterScore: 'أدخل الدرجة (0-100)',
  studentNameRequired: 'اسم الطالب مطلوب',
  examNameRequired: 'اسم الامتحان مطلوب',
  validScoreRequired: 'الرجاء إدخال درجة صالحة (0-100)',
  noScoresYet: 'لم يتم إضافة درجات بعد'
};

export const translations = createTranslations(englishTranslations, arabicTranslations);

export const getTranslations = (lang: 'en' | 'ar') => {
  return translations[lang];
};
