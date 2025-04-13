import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string) {
  const d = new Date(date);
  return d.toLocaleDateString();
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function calculateAverageScore(scores: number[]) {
  if (!scores.length) return 0;
  const sum = scores.reduce((a, b) => a + b, 0);
  return parseFloat((sum / scores.length).toFixed(1));
}

export function getMonthName(month: number, short: boolean = false) {
  const monthNames = {
    long: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    short: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]
  };
  
  return short ? monthNames.short[month] : monthNames.long[month];
}

export function generateRandomId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function generatePassword(length: number = 12) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+';
  let password = '';
  
  // Ensure at least one character from each class
  password += getRandomChar('ABCDEFGHIJKLMNOPQRSTUVWXYZ'); // Uppercase
  password += getRandomChar('abcdefghijklmnopqrstuvwxyz'); // Lowercase
  password += getRandomChar('0123456789'); // Number
  password += getRandomChar('!@#$%^&*()-_=+'); // Special char
  
  // Fill the rest of the password
  for (let i = password.length; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  // Shuffle the password to avoid patterns
  return shuffleString(password);
}

function getRandomChar(charset: string) {
  const randomIndex = Math.floor(Math.random() * charset.length);
  return charset[randomIndex];
}

function shuffleString(str: string) {
  const arr = str.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
}

export function getGradientClass(value: number, max: number = 100) {
  const percentage = (value / max) * 100;
  if (percentage >= 90) return 'from-green-500 to-emerald-500';
  if (percentage >= 75) return 'from-emerald-500 to-teal-500';
  if (percentage >= 60) return 'from-teal-500 to-cyan-500';
  if (percentage >= 45) return 'from-cyan-500 to-blue-500';
  if (percentage >= 30) return 'from-blue-500 to-indigo-500';
  if (percentage >= 15) return 'from-indigo-500 to-purple-500';
  return 'from-purple-500 to-pink-500';
}

type Translations = {
  home: string;
  dashboard: string;
  students: string;
  studentDetails: string;
  scores: string;
  examCenter: string;
  import: string;
  userManagement: string;
  reports: string;
  classSections: string;
  settings: string;
  profile: string;
  logout: string;
  search: string;
  myClasses: string;
  myStudents: string;
  recentRecognitions: string;
  myTasks: string;
  upcomingExams: string;
  viewAll: string;
  studentInformation: string;
  academicPerformance: string;
  behavior: string;
  attendance: string;
  recognition: string;
  notes: string;
  contacts: string;
  addStudent: string;
  editStudent: string;
  deleteStudent: string;
  name: string;
  email: string;
  grade: string;
  section: string;
  actions: string;
  cancel: string;
  submit: string;
  save: string;
  delete: string;
  edit: string;
  view: string;
  back: string;
  next: string;
  previous: string;
  loading: string;
  noResults: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  confirmation: string;
  areYouSure: string;
  thisActionCannot: string;
  yes: string;
  no: string;
  or: string;
  all: string;
  none: string;
  filters: string;
  applyFilters: string;
  clearFilters: string;
  sortBy: string;
  ascending: string;
  descending: string;
  today: string;
  yesterday: string;
  thisWeek: string;
  lastWeek: string;
  thisMonth: string;
  lastMonth: string;
  custom: string;
  date: string;
  time: string;
  status: string;
  active: string;
  inactive: string;
  pending: string;
  completed: string;
  add: string;
  remove: string;
  subcategories: string;
  optional: string;
  option: string;
  note: string;
  notFound: string;
  goBack: string;
  goHome: string;
  welcomeTo: string;
  login: string;
  signUp: string;
  forgotPassword: string;
  rememberMe: string;
  dontHaveAccount: string;
  alreadyHaveAccount: string;
  signInWithGoogle: string;
  signInWithMicrosoft: string;
  demoLoginNote: string;
  allRightsReserved: string;
  departments: string;
  subjects: string;
  teachers: string;
  admin: string;
  supervisor: string;
  counselor: string;
  teacher: string;
  permissions: string;
  role: string;
  roles: string;
  newUser: string;
  editUser: string;
  deleteUser: string;
  addUser: string;
  editProfile: string;
  changePassword: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  passwordsMustMatch: string;
  passwordRequirements: string;
  classes: string;
  account: string;
  manageAccount: string;
  manageUsers: string;
  teacherAssignments: string;
  classAssignments: string;
  userPermissions: string;
  workload: string;
  initialPassword: string;
  resetPassword: string;
  forcePasswordChange: string;
  sendEmailInvitation: string;
  permissionsUpdated: string;
  statusUpdated: string;
  passwordReset: string;
  assignmentsUpdated: string;
  subjectsUpdated: string;
  managementConsole: string;
  assignmentMatrix: string;
  selectClasses: string;
  selectSubjects: string;
  selectTeachers: string;
  applyRoleTemplate: string;
  recommendedPermissions: string;
  noSpecificPermissions: string;
  fullName: string;
  emailAddress: string;
  userRole: string;
  assignedClasses: string;
  currentPermissions: string;
  lastLogin: string;
  inviteUser: string;
  userCreated: string;
  userDeleted: string;
  accountSettings: string;
  systemSettings: string;
  appearance: string;
  language: string;
  notifications: string;
  security: string;
  advancedSettings: string;
  helpSupport: string;
  contactSupport: string;
  reportBug: string;
  documentation: string;
  about: string;
  version: string;
  termsOfService: string;
  privacyPolicy: string;
  cookiePolicy: string;
  accessControl: string;
  nav: string;
  dash: string;
  filter: string;
  nationalStuds: string;
  internationalStuds: string;
  recognitions: string;
  recogCats: string;
  helpfulness: string;
  respect: string;
  teamwork: string;
  excellence: string;
  studentOpts: string;
  addPts: string;
  pointsHistory: string;
  exportDt: string;
  sett: string;
  addScore: string;
  createExam: string;
  viewStudents: string;
  addAchievement: string;
  generateReport: string;
  totalPoints: string;
  averageAttendance: string;
  engagement: string;
  achievements: string;
  more: string;
  noAchievementsYet: string;
  viewClass: string;
  generatingReportFor: string;
  reportNotImplemented: string;
  achievementAdded: string;
  addedTo: string;
  addClassAchievement: string;
  addAchievementDescription: string;
  achievement: string;
  achievementPlaceholder: string;
  editScore: string;
  examUpdated: string;
  examAdded: string;
  examTitle: string;
  enterExamTitle: string;
  titleRequired: string;
  description: string;
  enterDescription: string;
  examType: string;
  selectType: string;
  quiz: string;
  exam: string;
  test: string;
  duration: string;
  enterDuration: string;
  validDurationRequired: string;
  questions: string;
  addQuestion: string;
  addAtLeastOneQuestion: string;
  noQuestionsAdded: string;
  addYourFirstQuestion: string;
  updateExam: string;
  confirmDelete: string;
  examDeleted: string;
  noExamsYet: string;
  noExamsDescription: string;
  minutes: string;
  noDataToExport: string;
  exportCompleted: string;
  export: string;
  exportData: string;
  exportOptions: string;
  selectExportScope: string;
  individualStudent: string;
  entireGrade: string;
  allStudents: string;
  selectStudent: string;
  selectGrade: string;
  selectDataType: string;
  raceToGoalData: string;
  nominationData: string;
  recognitionData: string;
  allData: string;
  exportingData: string;
  downloadExport: string;
  noStudents: string;
  studentsImported: string;
  errorParsingFile: string;
  nationality: string;
  selectNationality: string;
  uploading: string;
  uploadFile: string;
  question: string;
  questionText: string;
  enterQuestionText: string;
  questionType: string;
  multipleChoice: string;
  trueFalse: string;
  shortAnswer: string;
  essay: string;
  points: string;
  options: string;
  allowMultipleAnswers: string;
  addOption: string;
  correctAnswer: string;
  forGrading: string;
  enterCorrectAnswer: string;
  essayNoCorrectAnswer: string;
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
  scoreUpdated: string;
  scoreAdded: string;
  studentName: string;
  enterStudentName: string;
  studentNameRequired: string;
  examName: string;
  enterExamName: string;
  examNameRequired: string;
  score: string;
  enterScore: string;
  validScoreRequired: string;
  updateScore: string;
  errorSubmittingForm: string;
  national: string;
  international: string;
  books: string;
  updateStudent: string;
  nominationSubmitted: string;
  nominatedFor: string;
  searchStudents: string;
  recentlyNominated: string;
  noStudentsFound: string;
  noRecentNominations: string;
  reasonForNomination: string;
  selectReasonDescription: string;
  additionalComments: string;
  commentsPlaceholder: string;
  submitNomination: string;
  nominateStudent: string;
  nominateStudentDesc: string;
  level: string;
  overview: string;
  byGrade: string;
  categories: string;
  noRecognitionsYet: string;
  recognitionDistribution: string;
  noGradesFound: string;
  helpfulnessDescription: string;
  respectDescription: string;
  teamworkDescription: string;
  excellenceDescription: string;
  history: string;
  recognitionScores: string;
  totalRecognitions: string;
  balancedAchievement: string;
  balancedDesc: string;
  awards: string;
  noAwardsYet: string;
  specialRecognitions: string;
  balancedGrowth: string;
  achievedOn: string;
  needsAllCategories: string;
  studentScores: string;
  exportSuccess: string;
  average: string;
  noScoresYet: string;
  goalReached: string;
  toGoal: string;
  significantImprovement: string;
  improving: string;
  steady: string;
  needsAttention: string;
  noData: string;
  welcome: string;
  raceToGoal: string;
  progressToGoal: string;
  change: string;
  reason: string;
  noPointsHistory: string;
  gradeRecognition: string;
  progressOverview: string;
  studentProgress: string;
  classComparison: string;
  recognitionSystem: string;
  allExams: string;
  upcoming: string;
  archived: string;
  gradeOverview: string;
  overviewOfAllRecognitionCategories: string;
  averageScore: string;
  topPerformers: string;
  studentsWithHighestRecognitionLevels: string;
  analysis: string;
  detailedBreakdownOfSubcategories: string;
  distribution: string;
  importText: string;
  uploadDescription: string;
  downloadTemplate: string;
  fileFormat: string;
  fileFormatDescription: string;
  booksOwned: string;
  engagementScore: string;
  commaList: string;
  arabicSupportMessage: string;
  tip: string;
  templateUseMessage: string;
  getStarted: string;
  congratulations: string;
  reachedGoal: string;
  almost: string;
  keepGoing: string;
  needsImprovement: string;
  nominate: string;
};

const enTranslations: Translations = {
  home: 'Home',
  dashboard: 'Dashboard',
  students: 'Students',
  studentDetails: 'Student Details',
  scores: 'Scores',
  examCenter: 'Exam Center',
  import: 'Import',
  userManagement: 'User Management',
  reports: 'Reports',
  classSections: 'Class Sections',
  settings: 'Settings',
  profile: 'Profile',
  logout: 'Logout',
  search: 'Search',
  myClasses: 'My Classes',
  myStudents: 'My Students',
  recentRecognitions: 'Recent Recognitions',
  myTasks: 'My Tasks',
  upcomingExams: 'Upcoming Exams',
  viewAll: 'View All',
  studentInformation: 'Student Information',
  academicPerformance: 'Academic Performance',
  behavior: 'Behavior',
  attendance: 'Attendance',
  recognition: 'Recognition',
  notes: 'Notes',
  contacts: 'Contacts',
  addStudent: 'Add Student',
  editStudent: 'Edit Student',
  deleteStudent: 'Delete Student',
  name: 'Name',
  email: 'Email',
  grade: 'Grade',
  section: 'Section',
  actions: 'Actions',
  cancel: 'Cancel',
  submit: 'Submit',
  save: 'Save',
  delete: 'Delete',
  edit: 'Edit',
  view: 'View',
  back: 'Back',
  next: 'Next',
  previous: 'Previous',
  loading: 'Loading',
  noResults: 'No results found',
  error: 'Error',
  success: 'Success',
  warning: 'Warning',
  info: 'Info',
  confirmation: 'Confirmation',
  areYouSure: 'Are you sure?',
  thisActionCannot: 'This action cannot be undone.',
  yes: 'Yes',
  no: 'No',
  or: 'or',
  all: 'All',
  none: 'None',
  filters: 'Filters',
  applyFilters: 'Apply Filters',
  clearFilters: 'Clear Filters',
  sortBy: 'Sort By',
  ascending: 'Ascending',
  descending: 'Descending',
  today: 'Today',
  yesterday: 'Yesterday',
  thisWeek: 'This Week',
  lastWeek: 'Last Week',
  thisMonth: 'This Month',
  lastMonth: 'Last Month',
  custom: 'Custom',
  date: 'Date',
  time: 'Time',
  status: 'Status',
  active: 'Active',
  inactive: 'Inactive',
  pending: 'Pending',
  completed: 'Completed',
  add: 'Add',
  remove: 'Remove',
  subcategories: 'Subcategories',
  optional: 'Optional',
  option: 'Option',
  note: 'Note',
  notFound: 'Not Found',
  goBack: 'Go Back',
  goHome: 'Go Home',
  welcomeTo: 'Welcome to',
  login: 'Login',
  signUp: 'Sign Up',
  forgotPassword: 'Forgot Password',
  rememberMe: 'Remember Me',
  dontHaveAccount: 'Don\'t have an account?',
  alreadyHaveAccount: 'Already have an account?',
  signInWithGoogle: 'Sign in with Google',
  signInWithMicrosoft: 'Sign in with Microsoft',
  demoLoginNote: 'For demo purposes, you can use any username and password',
  allRightsReserved: 'All rights reserved',
  departments: 'Departments',
  subjects: 'Subjects',
  teachers: 'Teachers',
  admin: 'Administrator',
  supervisor: 'Supervisor',
  counselor: 'Counselor',
  teacher: 'Teacher',
  permissions: 'Permissions',
  role: 'Role',
  roles: 'Roles',
  newUser: 'New User',
  editUser: 'Edit User',
  deleteUser: 'Delete User',
  addUser: 'Add User',
  editProfile: 'Edit Profile',
  changePassword: 'Change Password',
  currentPassword: 'Current Password',
  newPassword: 'New Password',
  confirmPassword: 'Confirm Password',
  passwordsMustMatch: 'Passwords must match',
  passwordRequirements: 'Password must be at least 8 characters',
  classes: 'Classes',
  account: 'Account',
  manageAccount: 'Manage Account',
  manageUsers: 'Manage Users',
  teacherAssignments: 'Teacher Assignments',
  classAssignments: 'Class Assignments',
  userPermissions: 'User Permissions',
  workload: 'Workload',
  initialPassword: 'Initial Password',
  resetPassword: 'Reset Password',
  forcePasswordChange: 'Force Password Change',
  sendEmailInvitation: 'Send Email Invitation',
  permissionsUpdated: 'Permissions Updated',
  statusUpdated: 'Status Updated',
  passwordReset: 'Password Reset',
  assignmentsUpdated: 'Assignments Updated',
  subjectsUpdated: 'Subjects Updated',
  managementConsole: 'Management Console',
  assignmentMatrix: 'Assignment Matrix',
  selectClasses: 'Select Classes',
  selectSubjects: 'Select Subjects',
  selectTeachers: 'Select Teachers',
  applyRoleTemplate: 'Apply Role Template',
  recommendedPermissions: 'Recommended',
  noSpecificPermissions: 'No specific permissions assigned',
  fullName: 'Full Name',
  emailAddress: 'Email Address',
  userRole: 'User Role',
  assignedClasses: 'Assigned Classes',
  currentPermissions: 'Current Permissions',
  lastLogin: 'Last Login',
  inviteUser: 'Invite User',
  userCreated: 'User Created',
  userDeleted: 'User Deleted',
  accountSettings: 'Account Settings',
  systemSettings: 'System Settings',
  appearance: 'Appearance',
  language: 'Language',
  notifications: 'Notifications',
  security: 'Security',
  advancedSettings: 'Advanced Settings',
  helpSupport: 'Help & Support',
  contactSupport: 'Contact Support',
  reportBug: 'Report a Bug',
  documentation: 'Documentation',
  about: 'About',
  version: 'Version',
  termsOfService: 'Terms of Service',
  privacyPolicy: 'Privacy Policy',
  cookiePolicy: 'Cookie Policy',
  accessControl: 'Access Control',
  nav: 'Nav',
  dash: 'Dash',
  filter: 'Filter',
  nationalStuds: 'National Students',
  internationalStuds: 'International Students',
  recognitions: 'Recognitions',
  recogCats: 'Recognition Categories',
  helpfulness: 'Helpfulness',
  respect: 'Respect',
  teamwork: 'Teamwork',
  excellence: 'Excellence',
  studentOpts: 'Student Options',
  addPts: 'Add Points',
  pointsHistory: 'Points History',
  exportDt: 'Export Date',
  sett: 'Settings',
  addScore: 'Add Score',
  createExam: 'Create Exam',
  viewStudents: 'View Students',
  addAchievement: 'Add Achievement',
  generateReport: 'Generate Report',
  totalPoints: 'Total Points',
  averageAttendance: 'Average Attendance',
  engagement: 'Engagement',
  achievements: 'Achievements',
  more: 'More',
  noAchievementsYet: 'No Achievements Yet',
  viewClass: 'View Class',
  generatingReportFor: 'Generating Report For',
  reportNotImplemented: 'Report Not Implemented',
  achievementAdded: 'Achievement Added',
  addedTo: 'Added To',
  addClassAchievement: 'Add Class Achievement',
  addAchievementDescription: 'Add Achievement Description',
  achievement: 'Achievement',
  achievementPlaceholder: 'Achievement Placeholder',
  editScore: 'Edit Score',
  examUpdated: 'Exam Updated',
  examAdded: 'Exam Added',
  examTitle: 'Exam Title',
  enterExamTitle: 'Enter Exam Title',
  titleRequired: 'Title Required',
  description: 'Description',
  enterDescription: 'Enter Description',
  examType: 'Exam Type',
  selectType: 'Select Type',
  quiz: 'Quiz',
  exam: 'Exam',
  test: 'Test',
  duration: 'Duration',
  enterDuration: 'Enter Duration',
  validDurationRequired: 'Valid Duration Required',
  questions: 'Questions',
  addQuestion: 'Add Question',
  addAtLeastOneQuestion: 'Add At Least One Question',
  noQuestionsAdded: 'No Questions Added',
  addYourFirstQuestion: 'Add Your First Question',
  updateExam: 'Update Exam',
  confirmDelete: 'Confirm Delete',
  examDeleted: 'Exam Deleted',
  noExamsYet: 'No Exams Yet',
  noExamsDescription: 'No Exams Description',
  minutes: 'Minutes',
  noDataToExport: 'No Data To Export',
  exportCompleted: 'Export Completed',
  export: 'Export',
  exportData: 'Export Data',
  exportOptions: 'Export Options',
  selectExportScope: 'Select Export Scope',
  individualStudent: 'Individual Student',
  entireGrade: 'Entire Grade',
  allStudents: 'All Students',
  selectStudent: 'Select Student',
  selectGrade: 'Select Grade',
  selectDataType: 'Select Data Type',
  raceToGoalData: 'Race To Goal Data',
  nominationData: 'Nomination Data',
  recognitionData: 'Recognition Data',
  allData: 'All Data',
  exportingData: 'Exporting Data',
  downloadExport: 'Download Export',
  noStudents: 'No Students',
  studentsImported: 'Students Imported',
  errorParsingFile: 'Error Parsing File',
  nationality: 'Nationality',
  selectNationality: 'Select Nationality',
  uploading: 'Uploading',
  uploadFile: 'Upload File',
  question: 'Question',
  questionText: 'Question Text',
  enterQuestionText: 'Enter Question Text',
  questionType: 'Question Type',
  multipleChoice: 'Multiple Choice',
  trueFalse: 'True/False',
  shortAnswer: 'Short Answer',
  essay: 'Essay',
  points: 'Points',
  options: 'Options',
  allowMultipleAnswers: 'Allow Multiple Answers',
  addOption: 'Add Option',
  correctAnswer: 'Correct Answer',
  forGrading: 'For Grading',
  enterCorrectAnswer: 'Enter Correct Answer',
  essayNoCorrectAnswer: 'Essay No Correct Answer',
  attendanceReason: 'Attendance Reason',
  participationReason: 'Participation Reason',
  homeworkReason: 'Homework Reason',
  testResultReason: 'Test Result Reason',
  absenceReason: 'Absence Reason',
  misbehaviorReason: 'Misbehavior Reason',
  incompleteWorkReason: 'Incomplete Work Reason',
  lateSubmissionReason: 'Late Submission Reason',
  quickAdd: 'Quick Add',
  quickDeduct: 'Quick Deduct',
  selectReason: 'Select Reason',
  scoreUpdated: 'Score Updated',
  scoreAdded: 'Score Added',
  studentName: 'Student Name',
  enterStudentName: 'Enter Student Name',
  studentNameRequired: 'Student Name Required',
  examName: 'Exam Name',
  enterExamName: 'Enter Exam Name',
  examNameRequired: 'Exam Name Required',
  score: 'Score',
  enterScore: 'Enter Score',
  validScoreRequired: 'Valid Score Required',
  updateScore: 'Update Score',
  errorSubmittingForm: 'Error Submitting Form',
  national: 'National',
  international: 'International',
  books: 'Books',
  updateStudent: 'Update Student',
  nominationSubmitted: 'Nomination Submitted',
  nominatedFor: 'Nominated For',
  searchStudents: 'Search Students',
  recentlyNominated: 'Recently Nominated',
  noStudentsFound: 'No Students Found',
  noRecentNominations: 'No Recent Nominations',
  reasonForNomination: 'Reason For Nomination',
  selectReasonDescription: 'Select Reason Description',
  additionalComments: 'Additional Comments',
  commentsPlaceholder: 'Comments Placeholder',
  submitNomination: 'Submit Nomination',
  nominateStudent: 'Nominate Student',
  nominateStudentDesc: 'Nominate Student Description',
  level: 'Level',
  overview: 'Overview',
  byGrade: 'By Grade',
  categories: 'Categories',
  noRecognitionsYet: 'No Recognitions Yet',
  recognitionDistribution: 'Recognition Distribution',
  noGradesFound: 'No Grades Found',
  helpfulnessDescription: 'Helpfulness Description',
  respectDescription: 'Respect Description',
  teamworkDescription: 'Teamwork Description',
  excellenceDescription: 'Excellence Description',
  history: 'History',
  recognitionScores: 'Recognition Scores',
  totalRecognitions: 'Total Recognitions',
  balancedAchievement: 'Balanced Achievement',
  balancedDesc: 'Balanced Desc',
  awards: 'Awards',
  noAwardsYet: 'No Awards Yet',
  specialRecognitions: 'Special Recognitions',
  balancedGrowth: 'Balanced Growth',
  achievedOn: 'Achieved On',
  needsAllCategories: 'Needs All Categories',
  studentScores: 'Student Scores',
  exportSuccess: 'Export Success',
  average: 'Average',
  noScoresYet: 'No Scores Yet',
  goalReached: 'Goal Reached',
  toGoal: 'To Goal',
  significantImprovement: 'Significant Improvement',
  improving: 'Improving',
  steady: 'Steady',
  needsAttention: 'Needs Attention',
  noData: 'No Data',
  welcome: 'Welcome',
  raceToGoal: 'Race To Goal',
  progressToGoal: 'Progress To Goal',
  change: 'Change',
  reason: 'Reason',
  noPointsHistory: 'No Points History',
  gradeRecognition: 'Grade Recognition',
  progressOverview: 'Progress Overview',
  studentProgress: 'Student Progress',
  classComparison: 'Class Comparison',
  recognitionSystem: 'Recognition System',
  allExams: 'All Exams',
  upcoming: 'Upcoming',
  archived: 'Archived',
  gradeOverview: 'Grade Overview',
  overviewOfAllRecognitionCategories: 'Overview Of All Recognition Categories',
  averageScore: 'Average Score',
  topPerformers: 'Top Performers',
  studentsWithHighestRecognitionLevels: 'Students With Highest Recognition Levels',
  analysis: 'Analysis',
  detailedBreakdownOfSubcategories: 'Detailed Breakdown Of Subcategories',
  distribution: 'Distribution',
  importText: 'Import Text',
  uploadDescription: 'Upload Description',
  downloadTemplate: 'Download Template',
  fileFormat: 'File Format',
  fileFormatDescription: 'File Format Description',
  booksOwned: 'Books Owned',
  engagementScore: 'Engagement Score',
  commaList: 'Comma List',
  arabicSupportMessage: 'Arabic Support Message',
  tip: 'Tip',
  templateUseMessage: 'Template Use Message',
  getStarted: 'Get Started',
  congratulations: 'Congratulations',
  reachedGoal: 'Reached Goal',
  almost: 'Almost',
  keepGoing: 'Keep Going',
  needsImprovement: 'Needs Improvement',
  nominate: 'Nominate',
};

const arTranslations: Translations = {
  home: 'الرئيسية',
  dashboard: 'لوحة التحكم',
  students: 'الطلاب',
  studentDetails: 'تفاصيل الطالب',
  scores: 'النتائج',
  examCenter: 'مركز الاختبارات',
  import: 'استيراد',
  userManagement: 'إدارة المستخدمين',
  reports: 'التقارير',
  classSections: 'شعب الفصول',
  settings: 'الإعدادات',
  profile: 'الملف الشخصي',
  logout: 'تسجيل الخروج',
  search: 'بحث',
  myClasses: 'صفوفي',
  myStudents: 'طلابي',
  recentRecognitions: 'التقديرات الحديثة',
  myTasks: 'مهامي',
  upcomingExams: 'الاختبارات القادمة',
  viewAll: 'عرض الكل',
  studentInformation: 'معلومات الطالب',
  academicPerformance: 'أداء الأكاديمي',
  behavior: 'سلوك',
  attendance: 'الحضور',
  recognition: 'التقدير',
  notes: 'ملاحظات',
  contacts: 'جهات اتصال',
  addStudent: 'إضافة طالب',
  editStudent: 'تعديل طالب',
  deleteStudent: 'حذف طالب',
  name: 'الاسم',
  email: 'البريد الإلكتروني',
  grade: 'الصف',
  section: 'الشعبة',
  actions: 'الإجراءات',
  cancel: 'إلغاء',
  submit: 'إرسال',
  save: 'حفظ',
  delete: 'حذف',
  edit: 'تعديل',
  view: 'عرض',
  back: 'رجوع',
  next: 'التالي',
  previous: 'السابق',
  loading: 'جاري التحميل',
  noResults: 'لم يتم العثور على نتائج',
  error: 'خطأ',
  success: 'نجاح',
  warning: 'تحذير',
  info: 'معلومات',
  confirmation: 'تأكيد',
  areYouSure: 'هل أنت متأكد؟',
  thisActionCannot: 'هذه الأجراء لا يمكن التراجع عنها.',
  yes: 'نعم',
  no: 'لا',
  or: 'أو',
  all: 'الكل',
  none: 'لا شيء',
  filters: 'التصفية',
  applyFilters: 'تطبيق التصفية',
  clearFilters: 'مسح التصفية',
  sortBy: 'ترتيب حسب',
  ascending: 'تصاعدي',
  descending: 'تنازلي',
  today: 'اليوم',
  yesterday: 'المساء',
  thisWeek: 'الأسبوع الحالي',
  lastWeek: 'الأسبوع السابق',
  thisMonth: 'الشهر الحالي',
  lastMonth: 'الشهر السابق',
  custom: 'مخصص',
  date: 'التاريخ',
  time: 'الوقت',
  status: 'الحالة',
  active: 'مفعل',
  inactive: 'غير مفعل',
  pending: 'قيد الانتظار',
  completed: 'مكتمل',
  add: 'إضافة',
  remove: 'حذف',
  subcategories: 'الفئات الفرعية',
  optional: 'اختياري',
  option: 'خيار',
  note: 'ملاحظة',
  notFound: 'لا يوجد',
  goBack: 'رجوع',
  goHome: 'العودة إلى الصفحة الرئيسية',
  welcomeTo: 'مرحبًا بك في',
  login: 'تسجيل الدخول',
  signUp: 'إنشاء حساب',
  forgotPassword: 'هل نسيت كلمة المرور؟',
  rememberMe: 'تذكرني',
  dontHaveAccount: 'لا يوجد حساب؟',
  alreadyHaveAccount: 'لديك حساب؟',
  signInWithGoogle: 'تسجيل الدخول باستخدام Google',
  signInWithMicrosoft: 'تسجيل الدخول باستخدام Microsoft',
  demoLoginNote: 'لأغراض العرض التوضيحي، يمكنك استخدام أي اسم مستخدم وكلمة مرور',
  allRightsReserved: 'جميع الحقوق محفوظة',
  departments: 'ال departamentos',
  subjects: 'المادة',
  teachers: 'المعلمين',
  admin: 'مدير النظام',
  supervisor: 'مشرف',
  counselor: 'مرشد طلابي',
  teacher: 'معلم',
  permissions: 'الصلاحيات',
  role: 'الدور',
  roles: 'الأدوار',
  newUser: 'مستخدم جديد',
  editUser: 'تعديل المستخدم',
  deleteUser: 'حذف المستخدم',
  addUser: 'إضافة مستخدم',
  editProfile: 'تعديل الملف الشخصي',
  changePassword: 'تغيير كلمة المرور',
  currentPassword: 'كلمة المرور الحالية',
  newPassword: 'كلمة المرور الجديدة',
  confirmPassword: 'تأكيد كلمة المرور',
  passwordsMustMatch: 'يجب أن تتطابق كلمات المرور',
  passwordRequirements: 'يجب أن تكون كلمة المرور 8 أحرف على الأقل',
  classes: 'الفصول',
  account: 'الحساب',
  manageAccount: 'إدارة الحساب',
  manageUsers: 'إدارة المستخدمين',
  teacherAssignments: 'تعيينات المعلمين',
  classAssignments: 'تعيينات الفصول',
  userPermissions: 'صلاحيات المستخدم',
  workload: 'عبء العمل',
  initialPassword: 'كلمة المرور الأولية',
  resetPassword: 'إعادة تعيين كلمة المرور',
  forcePasswordChange: 'فرض تغيير كلمة المرور',
  sendEmailInvitation: 'إرسال دعوة بالبريد الإلكتروني',
  permissionsUpdated: 'تم تحديث الصلاحيات',
  statusUpdated: 'تم تحديث الحالة',
  passwordReset: 'تم إعادة تعيين كلمة المرور',
  assignmentsUpdated: 'تم تحديث التعيينات',
  subjectsUpdated: 'تم تحديث المواد',
  managementConsole: 'وحدة الإدارة',
  assignmentMatrix: 'مصفوفة التعيينات',
  selectClasses: 'اختر الفصول',
  selectSubjects: 'اختر المواد',
  selectTeachers: 'اختر المعلمين',
  applyRoleTemplate: 'تطبيق قالب الدور',
  recommendedPermissions: 'موصى به',
  noSpecificPermissions: 'لم يتم تعيين صلاحيات محددة',
  fullName: 'الاسم الكامل',
  emailAddress: 'البريد الإلكتروني',
  userRole: 'دور المستخدم',
  assignedClasses: 'الفصول المعينة',
  currentPermissions: 'الصلاحيات الحالية',
  lastLogin: 'آخر تسجيل دخول',
  inviteUser: 'دعوة مستخدم',
  userCreated: 'تم إنشاء المستخدم',
  userDeleted: 'تم حذف المستخدم',
  accountSettings: 'إعدادات الحساب',
  systemSettings: 'إعدادات النظام',
  appearance: 'المظهر',
  language: 'اللغة',
  notifications: 'الإشعارات',
  security: 'الأمان',
  advancedSettings: 'إعدادات متقدمة',
  helpSupport: 'المساعدة والدعم',
  contactSupport: 'التواصل مع الدعم',
  reportBug: 'الإبلاغ عن خطأ',
  documentation: 'التوثيق',
  about: 'حول',
  version: 'الإصدار',
  termsOfService: 'شروط الخدمة',
  privacyPolicy: 'سياسة الخصوصية',
  cookiePolicy: 'سياسة ملفات تعريف الارتباط',
  accessControl: 'التحكم في الوصول',
  nav: 'القائمة',
  dash: 'الرئيسية',
  filter: 'البحث',
  nationalStuds: 'طلاب أهلية',
  internationalStuds: 'طلاب أجنبية',
  recognitions: 'التقديرات',
  recogCats: 'فئات التقديرات',
  helpfulness: 'المساعدة',
  respect: 'الاحترام',
  teamwork: 'التعاون',
  excellence: 'التميز',
  studentOpts: 'خيارات الطالب',
  addPts: 'إضافة النقاط',
  pointsHistory: 'سجل النقاط',
  exportDt: 'تاريخ التصدير',
  sett: 'الإعدادات',
  addScore: 'إضافة نتائج',
  createExam: 'إنشاء اختبار',
  viewStudents: 'عرض الطلاب',
  addAchievement: 'إضافة تحقيق',
  generateReport: 'إنشاء تقرير',
  totalPoints: 'النقاط الإجمالية',
  averageAttendance: 'معدل الحضور',
  engagement: 'التفاعل',
  achievements: 'الإنجازات',
  more: 'المزيد',
  noAchievementsYet: 'لا يوجد إنجازات حتى الآن',
  viewClass: 'عرض الفصل',
  generatingReportFor: 'إنشاء تقرير ل',
  reportNotImplemented: 'التقرير غير مُimplemented',
  achievementAdded: 'تم إضافة تحقيق',
  addedTo: 'تم إضافة إلى',
  addClassAchievement: 'إضافة تحقيق في الفصل',
  addAchievementDescription: 'إضافة وصف تحقيق',
  achievement: 'الإنجاز',
  achievementPlaceholder: 'إضافة وصف تحقيق',
  editScore: 'تعديل النتائج',
  examUpdated: 'تم تحديث الاختبار',
  examAdded: 'تم إضافة الاختبار',
  examTitle: 'عنوان الاختبار',
  enterExamTitle: 'أدخل عنوان الاختبار',
  titleRequired: 'حقل العنوان مطلوب',
  description: 'الوصف',
  enterDescription: 'أدخل الوصف',
  examType: 'نوع الاختبار',
  selectType: 'اختر النوع',
  quiz: 'اختبار',
  exam: 'اختبار',
  test: 'اختبار',
  duration: 'المدة',
  enterDuration: 'أدخل المدة',
  validDurationRequired: 'المدة المطلوبة يجب أن تكون صحيحة',
  questions: 'الأسئلة',
  addQuestion: 'إضافة أسئلة',
  addAtLeastOneQuestion: 'أضف الأقل من سؤال واحد',
  noQuestionsAdded: 'لم يتم إضافة أسئلة',
  addYourFirstQuestion: 'أضف أول سؤال',
  updateExam: 'تحديث الاختبار',
  confirmDelete: 'تأكيد الحذف',
  examDeleted: 'تم حذف الاختبار',
  noExamsYet: 'لا يوجد اختبارات حتى الآن',
  noExamsDescription: 'لا يوجد اختبارات',
  minutes: 'الدقائق',
  noDataToExport: 'لا يوجد بيانات لتصديرها',
  exportCompleted: 'تم تصدير البيانات',
  export: 'تصدير',
  exportData: 'تصدير البيانات',
  exportOptions: 'خيارات التصدير',
  selectExportScope: 'حدد نطاق التصدير',
  individualStudent: 'طالب فردي',
  entireGrade: 'الصف ككل',
  allStudents: 'جميع الطلاب',
  selectStudent: 'حدد الطالب',
  selectGrade: 'حدد الصف',
  selectDataType: 'حدد نوع البيانات',
  raceToGoalData: 'بيانات مسيرة إلى الهدف',
  nominationData: 'بيانات الالتحاق',
  recognitionData: 'بيانات التقديرات',
  allData: 'جميع البيانات',
  exportingData: 'جار تصدير البيانات',
  downloadExport: 'تحميل التصدير',
  noStudents: 'لا يوجد طلاب',
  studentsImported: 'تم استيراد الطلاب',
  errorParsingFile: 'خطأ في تحليل الملف',
  nationality: 'الجنسية',
  selectNationality: 'حدد الجنسية',
  uploading: 'جار التحميل',
  uploadFile: 'تحميل الملف',
  question: 'سؤال',
  questionText: 'نص السؤال',
  enterQuestionText: 'أدخل النص السؤال',
  questionType: 'نوع السؤال',
  multipleChoice: 'اختيار متعدد',
  trueFalse: 'صحيح/خطأ',
  shortAnswer: 'إجابة قصيرة',
  essay: 'مقالة',
  points: 'النقاط',
  options: 'الخيارات',
  allowMultipleAnswers: 'السماح بإضافة إجابات متعددة',
  addOption: 'إضافة خيار',
  correctAnswer: 'الإجابة الصحيحة',
  forGrading: 'للتصحيح',
  enterCorrectAnswer: 'أدخل الإجابة الصحيحة',
  essayNoCorrectAnswer: 'مقالة بدون إجابة صحيحة',
  attendanceReason: 'سبب الحضور',
  participationReason: 'سبب المشاركة',
  homeworkReason: 'سبب الواجب',
  testResultReason: 'سبب نتيجة الاختبار',
  absenceReason: 'سبب الغياب',
  misbehaviorReason: 'سبب الالتباس',
  incompleteWorkReason: 'سبب عدم الانتهاء من العمل',
  lateSubmissionReason: 'سبب تقديم الواجب متأخرًا',
  quickAdd: 'إضافة سريعة',
  quickDeduct: 'خصم سريعة',
  selectReason: 'حدد السبب',
  scoreUpdated: 'تم تحديث النتائج',
  scoreAdded: 'تم إضافة النتائج',
  studentName: 'اسم الطالب',
  enterStudentName: 'أدخل اسم الطالب',
  studentNameRequired: 'اسم الطالب مطلوب',
  examName: 'اسم الاختبار',
  enterExamName: 'أدخل اسم الاختبار',
  examNameRequired: 'اسم الاختبار مطلوب',
  score: 'النتائج',
  enterScore: 'أدخل النتائج',
  validScoreRequired: 'النتائج يجب أن تكون صحيحة',
  updateScore: 'تحديث النتائج',
  errorSubmittingForm: 'خطأ في إرسال النموذج',
  national: 'أهلية',
  international: 'اجنبية',
  books: 'الكتب',
  updateStudent: 'تحديث الطالب',
  nominationSubmitted: 'تم إرسال الالتحاق',
  nominatedFor: 'الالتحاق ل',
  searchStudents: 'بحث الطلاب',
  recentlyNominated: 'الطلاب الذين تم الالتحاق مؤخراً',
  noStudentsFound: 'لم يتم العثور على طلاب',
  noRecentNominations: 'لا يوجد الالتحاقات الأخيرة',
  reasonForNomination: 'سبب الالتحاق',
  selectReasonDescription: 'حدد وصف السبب',
  additionalComments: 'التعليقات الإضافية',
  commentsPlaceholder: 'أدخل التعليقات',
  submitNomination: 'إرسال الالتحاق',
  nominateStudent: 'الالتحاق لطالب',
  nominateStudentDesc: 'الالتحاق لطالب',
  level: 'المستوى',
  overview: 'الإحصائيات',
  byGrade: 'حسب الصف',
  categories: 'التصنيفات',
  noRecognitionsYet: 'لا يوجد تقديرات حتى الآن',
  recognitionDistribution: 'توزيع التقديرات',
  noGradesFound: 'لم يتم العثور على الصفوف',
  helpfulnessDescription: 'وصف الدعم',
  respectDescription: 'وصف الاحترام',
  teamworkDescription: 'وصف التعاون',
  excellenceDescription: 'وصف التميز',
  history: 'التاريخ',
  recognitionScores: 'نقاط التقديرات',
  totalRecognitions: 'الإجمالي من التقديرات',
  balancedAchievement: 'إنجاز متسامح',
  balancedDesc: 'وصف الإنجاز المتسامح',
  awards: 'الجوائز',
  noAwardsYet: 'لا يوجد جوائز حتى الآن',
  specialRecognitions: 'التقديرات الخاصة',
  balancedGrowth: 'نمو متسامح',
  achievedOn: 'تم تحقيقه',
  needsAllCategories: 'يجب أن يكون قد تم تعيين جميع التصنيفات',
  studentScores: 'نقاط الطالب',
  exportSuccess: 'تم تصدير البيانات بنجاح',
  average: 'المتوسط',
  noScoresYet: 'لا يوجد نتائج حتى الآن',
  goalReached: 'تم تحقيق الهدف',
  toGoal: 'لإلى الهدف',
  significantImprovement: 'تحسين كبير',
  improving: 'يحسن',
  steady: 'متوازن',
  needsAttention: 'يحتاج إلى الانتباه',
  noData: 'لا يوجد بيانات',
  welcome: 'مرحبًا بك',
  raceToGoal: 'مسيرة إلى الهدف',
  progressToGoal: 'تقدم نحو الهدف',
  change: 'تغيير',
  reason: 'السبب',
  noPointsHistory: 'لا يوجد سجل النقاط',
  gradeRecognition: 'التقديرات للصف',
  progressOverview: 'نظرة عامة على التقدم',
  studentProgress: 'تقدم الطالب',
  classComparison: 'مقارنة الفصول',
  recognitionSystem: 'نظام التقديرات',
  allExams: 'جميع الاختبارات',
  upcoming: 'الاختبارات القادمة',
  archived: 'الأرشيف',
  gradeOverview: 'نظرة عامة على الصفوف',
  overviewOfAllRecognitionCategories: 'نظرة عامة على جميع فئات التقديرات',
  averageScore: 'المتوسط من النتائج',
  topPerformers: 'الأفضل الطلاب',
  studentsWithHighestRecognitionLevels: 'الطلاب الذين يمتلكون أعلى مستويات التقديرات',
  analysis: 'تحليل',
  detailedBreakdownOfSubcategories: 'تحليل مفصل للتصنيفات الفرعية',
  distribution: 'التوزيع',
  importText: 'نص التصدير',
  uploadDescription: 'وصف التحميل',
  downloadTemplate: 'تنزيل النموذج',
  fileFormat: 'تنسيق الملف',
  fileFormatDescription: 'وصف تنسيق الملف',
  booksOwned: 'الكتب التي تمتلكها',
  engagementScore: 'نسبة التفاعل',
  commaList: 'قائمة بفواصل',
  arabicSupportMessage: 'رسالة الدعم العربية',
  tip: 'نصيحة',
  templateUseMessage: 'رسالة استخدام النموذج',
  getStarted: 'ابدأ',
  congratulations: 'مبروك',
  reachedGoal: 'تم تحقيق الهدف',
  almost: 'بعض الوقت',
  keepGoing: 'واصل',
  needsImprovement: 'يحتاج إلى تحسين',
  nominate: 'الالتحاق',
};

const translations: Record<string, Translations> = {
  en: enTranslations,
  ar: arTranslations
};

export const getTranslations = (language: string = 'en'): Translations => {
  return translations[language] || translations.en;
};
