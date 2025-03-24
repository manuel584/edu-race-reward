
import { createTranslations } from './studentData';

export type TranslationKey = 
  | 'students'
  | 'points'
  | 'profile'
  | 'search'
  | 'addStudent'
  | 'studentName'
  | 'grade'
  | 'nationality'
  | 'addPoints'
  | 'removePoints'
  | 'importStudents'
  | 'settingsAndOptions'
  | 'attendance'
  | 'books'
  | 'engagement'
  | 'subjects'
  | 'home'
  | 'dashboard'
  | 'loading'
  | 'save'
  | 'cancel'
  | 'delete'
  | 'edit'
  | 'view'
  | 'welcome'
  | 'progressToGoal'
  | 'congratulations'
  | 'reachedGoal'
  | 'almost'
  | 'keepGoing'
  | 'needsImprovement'
  | 'recognition'
  | 'pointsHistory'
  | 'date'
  | 'change'
  | 'reason'
  | 'helpfulness'
  | 'respect'
  | 'teamwork'
  | 'excellence'
  | 'nominateStudent'
  | 'nominateStudentDesc'
  | 'selectStudent'
  | 'nominationCategory'
  | 'selectCategory'
  | 'academicHelp'
  | 'emotionalSupport'
  | 'culturalSensitivity'
  | 'conflictResolution'
  | 'groupContribution'
  | 'collaboration'
  | 'academicExcellence'
  | 'specialTalent'
  | 'submitNomination'
  | 'addRecognitionFor'
  | 'addRecognition'
  | 'enterReason'
  | 'nominationSubmitted'
  | 'nominatedFor'
  | 'all'
  | 'allStudents'
  | 'internationalStudents'
  | 'nationalStudents'
  | 'byGrade'
  | 'noStudents'
  | 'noInternationalStudents'
  | 'noNationalStudents'
  | 'searchStudents'
  | 'clearFilters'
  | 'studentRecognitions'
  | 'noRecognitionsYet'
  | 'noPointsHistory'
  | 'exceptional-helpfulness'
  | 'outstanding-respect'
  | 'remarkable-teamwork'
  | 'academic-excellence'
  | 'personal-growth'
  | 'community-contribution'
  | 'leadership'
  | 'creativity'
  | 'reasonForNomination'
  | 'selectReason'
  | 'selectReasonDescription'
  | 'additionalComments'
  | 'commentsPlaceholder'
  | 'nominate'
  | 'goalReached'
  | 'toGoal'
  | 'recentlyNominated'
  | 'noStudentsFound'
  | 'noRecentNominations'
  | 'significantImprovement'
  | 'improving'
  | 'steady'
  | 'needsAttention'
  | 'noData'
  | 'actions'
  | 'viewStudents'
  | 'addAchievement'
  | 'generateReport'
  | 'totalPoints'
  | 'averageAttendance'
  | 'engagement'
  | 'achievements'
  | 'noAchievementsYet'
  | 'viewClass'
  | 'generatingReportFor'
  | 'reportNotImplemented'
  | 'achievementAdded'
  | 'addedTo'
  | 'classes'
  | 'addClassAchievement'
  | 'addAchievementDescription'
  | 'achievement'
  | 'achievementPlaceholder'
  | 'more'
  | 'noStudentsName';

export type Translations = {
  [key in TranslationKey]?: string;
};

// English translations
const enTranslations: Translations = {
  students: 'Students',
  points: 'Points',
  profile: 'Profile',
  search: 'Search',
  addStudent: 'Add Student',
  studentName: 'Student Name',
  grade: 'Grade',
  nationality: 'Nationality',
  addPoints: 'Add Points',
  removePoints: 'Remove Points',
  importStudents: 'Import Students',
  settingsAndOptions: 'Settings & Options',
  attendance: 'Attendance',
  books: 'Books',
  engagement: 'Engagement',
  subjects: 'Subjects',
  home: 'Home',
  dashboard: 'Dashboard',
  loading: 'Loading...',
  save: 'Save',
  cancel: 'Cancel',
  delete: 'Delete',
  edit: 'Edit',
  view: 'View',
  welcome: 'Welcome',
  progressToGoal: 'Progress to Goal',
  congratulations: 'Congratulations!',
  reachedGoal: 'reached goal!',
  almost: 'Almost there!',
  keepGoing: 'Keep going!',
  needsImprovement: 'Needs improvement',
  recognition: 'Recognition',
  pointsHistory: 'Points History',
  date: 'Date',
  change: 'Change',
  reason: 'Reason',
  helpfulness: 'Helpfulness',
  respect: 'Respect',
  teamwork: 'Teamwork',
  excellence: 'Excellence',
  nominateStudent: 'Nominate Student',
  nominateStudentDesc: 'Nominate a student who has shown exceptional qualities',
  selectStudent: 'Select Student',
  nominationCategory: 'Nomination Category',
  selectCategory: 'Select Category',
  academicHelp: 'Academic Help',
  emotionalSupport: 'Emotional Support',
  culturalSensitivity: 'Cultural Sensitivity',
  conflictResolution: 'Conflict Resolution',
  groupContribution: 'Group Contribution',
  collaboration: 'Collaboration',
  academicExcellence: 'Academic Excellence',
  specialTalent: 'Special Talent',
  submitNomination: 'Submit Nomination',
  addRecognitionFor: 'Add recognition for {name}',
  addRecognition: 'Add Recognition',
  enterReason: 'Enter reason for recognition',
  nominationSubmitted: 'Nomination submitted',
  nominatedFor: 'nominated for',
  all: 'All',
  allStudents: 'All Students',
  internationalStudents: 'International Students',
  nationalStudents: 'National Students',
  byGrade: 'By Grade',
  noStudents: 'No students found',
  noInternationalStudents: 'No international students found',
  noNationalStudents: 'No national students found',
  searchStudents: 'Search students...',
  clearFilters: 'Clear Filters',
  studentRecognitions: 'Student Recognitions',
  noRecognitionsYet: 'No recognitions yet',
  noPointsHistory: 'No points history available',
  'exceptional-helpfulness': 'Exceptional Helpfulness',
  'outstanding-respect': 'Outstanding Respect',
  'remarkable-teamwork': 'Remarkable Teamwork',
  'academic-excellence': 'Academic Excellence',
  'personal-growth': 'Personal Growth',
  'community-contribution': 'Community Contribution',
  'leadership': 'Leadership',
  'creativity': 'Creativity',
  reasonForNomination: 'Reason for Nomination',
  selectReason: 'Select reason for nomination',
  selectReasonDescription: 'Choose the primary reason for this nomination',
  additionalComments: 'Additional Comments',
  commentsPlaceholder: 'Add any additional details about this nomination...',
  nominate: 'Nominate',
  goalReached: 'Goal Reached!',
  toGoal: 'to Goal',
  recentlyNominated: 'Recently Nominated',
  noStudentsFound: 'No students found',
  noRecentNominations: 'No recent nominations',
  significantImprovement: 'Significant improvement',
  improving: 'Improving',
  steady: 'Steady',
  needsAttention: 'Needs attention',
  noData: 'No data',
  actions: 'Actions',
  viewStudents: 'View Students',
  addAchievement: 'Add Achievement',
  generateReport: 'Generate Report',
  totalPoints: 'Total Points',
  averageAttendance: 'Avg. Attendance',
  achievements: 'Achievements',
  noAchievementsYet: 'No achievements yet',
  viewClass: 'View Class',
  generatingReportFor: 'Generating report for',
  reportNotImplemented: 'This feature is not implemented yet',
  achievementAdded: 'Achievement added',
  addedTo: 'added to',
  classes: 'Classes',
  addClassAchievement: 'Add Class Achievement',
  addAchievementDescription: 'Add a new achievement for this class',
  achievement: 'Achievement',
  achievementPlaceholder: 'Enter achievement description',
  more: 'more',
  noStudentsName: 'Unknown Student'
};

// Arabic translations
const arTranslations: Translations = {
  students: 'الطلاب',
  points: 'النقاط',
  profile: 'الملف الشخصي',
  search: 'بحث',
  addStudent: 'إضافة طالب',
  studentName: 'اسم الطالب',
  grade: 'الصف',
  nationality: 'الجنسية',
  addPoints: 'إضافة نقاط',
  removePoints: 'إزالة نقاط',
  importStudents: 'استيراد الطلاب',
  settingsAndOptions: 'الإعدادات والخيارات',
  attendance: 'الحضور',
  books: 'الكتب',
  engagement: 'المشاركة',
  subjects: 'المواد',
  home: 'الرئيسية',
  dashboard: 'لوحة التحكم',
  loading: 'جار التحميل...',
  save: 'حفظ',
  cancel: 'إلغاء',
  delete: 'حذف',
  edit: 'تعديل',
  view: 'عرض',
  welcome: 'مرحبا',
  progressToGoal: 'التقدم نحو الهدف',
  congratulations: 'تهانينا!',
  reachedGoal: 'وصل إلى الهدف!',
  almost: 'اقتربت!',
  keepGoing: 'استمر!',
  needsImprovement: 'يحتاج إلى تحسين',
  recognition: 'التقدير',
  pointsHistory: 'سجل النقاط',
  date: 'التاريخ',
  change: 'التغيير',
  reason: 'السبب',
  helpfulness: 'المساعدة',
  respect: 'الاحترام',
  teamwork: 'العمل الجماعي',
  excellence: 'التميز',
  nominateStudent: 'ترشيح طالب',
  nominateStudentDesc: 'ترشيح طالب أظهر صفات استثنائية',
  selectStudent: 'اختر طالب',
  nominationCategory: 'فئة الترشيح',
  selectCategory: 'اختر الفئة',
  academicHelp: 'المساعدة الأكاديمية',
  emotionalSupport: 'الدعم العاطفي',
  culturalSensitivity: 'الحساسية الثقافية',
  conflictResolution: 'حل النزاعات',
  groupContribution: 'المساهمة الجماعية',
  collaboration: 'التعاون',
  academicExcellence: 'التفوق الأكاديمي',
  specialTalent: 'موهبة خاصة',
  submitNomination: 'إرسال الترشيح',
  addRecognitionFor: 'إضافة تقدير لـ {name}',
  addRecognition: 'إضافة تقدير',
  enterReason: 'أدخل سبب التقدير',
  nominationSubmitted: 'تم إرسال الترشيح',
  nominatedFor: 'تم ترشيحه لـ',
  all: 'الكل',
  allStudents: 'جميع الطلاب',
  internationalStudents: 'الطلاب الدوليين',
  nationalStudents: 'الطلاب المحليين',
  byGrade: 'حسب الصف',
  noStudents: 'لم يتم العثور على طلاب',
  noInternationalStudents: 'لم يتم العثور على طلاب دوليين',
  noNationalStudents: 'لم يتم العثور على طلاب محليين',
  searchStudents: 'البحث عن طلاب...',
  clearFilters: 'مسح الفلاتر',
  studentRecognitions: 'تقديرات الطلاب',
  noRecognitionsYet: 'لا توجد تقديرات بعد',
  noPointsHistory: 'لا يوجد سجل نقاط متاح',
  'exceptional-helpfulness': 'مساعدة استثنائية',
  'outstanding-respect': 'احترام متميز',
  'remarkable-teamwork': 'عمل جماعي رائع',
  'academic-excellence': 'تفوق أكاديمي',
  'personal-growth': 'نمو شخصي',
  'community-contribution': 'مساهمة مجتمعية',
  'leadership': 'قيادة',
  'creativity': 'إبداع',
  reasonForNomination: 'سبب الترشيح',
  selectReason: 'اختر سبب الترشيح',
  selectReasonDescription: 'اختر السبب الرئيسي لهذا الترشيح',
  additionalComments: 'تعليقات إضافية',
  commentsPlaceholder: 'أضف أي تفاصيل إضافية حول هذا الترشيح...',
  nominate: 'ترشيح',
  goalReached: 'تم الوصول للهدف!',
  toGoal: 'للهدف',
  recentlyNominated: 'تم ترشيحهم مؤخرا',
  noStudentsFound: 'لم يتم العثور على طلاب',
  noRecentNominations: 'لا توجد ترشيحات حديثة',
  significantImprovement: 'تحسن كبير',
  improving: 'يتحسن',
  steady: 'ثابت',
  needsAttention: 'يحتاج اهتمام',
  noData: 'لا توجد بيانات',
  actions: 'إجراءات',
  viewStudents: 'عرض الطلاب',
  addAchievement: 'إضافة إنجاز',
  generateReport: 'إنشاء تقرير',
  totalPoints: 'إجمالي النقاط',
  averageAttendance: 'متوسط الحضور',
  achievements: 'الإنجازات',
  noAchievementsYet: 'لا توجد إنجازات بعد',
  viewClass: 'عرض الصف',
  generatingReportFor: 'إنشاء تقرير لـ',
  reportNotImplemented: 'هذه الميزة غير متوفرة بعد',
  achievementAdded: 'تمت إضافة الإنجاز',
  addedTo: 'تمت إضافته إلى',
  classes: 'الصفوف',
  addClassAchievement: 'إضافة إنجاز للصف',
  addAchievementDescription: 'إضافة إنجاز جديد لهذا الصف',
  achievement: 'إنجاز',
  achievementPlaceholder: 'أدخل وصف الإنجاز',
  more: 'المزيد',
  noStudentsName: 'طالب غير معروف'
};

// Create and export translations
const translations = createTranslations(enTranslations, arTranslations);

// Helper function to get translations based on language
export const getTranslations = (language: 'en' | 'ar'): Translations => {
  return translations[language];
};
