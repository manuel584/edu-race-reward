
import { Student } from '@/context/AppContext';

// Format date from ISO string to localized format
export const formatDateFromIso = (isoDate: string, locale: 'en' | 'ar'): string => {
  try {
    const date = new Date(isoDate);
    
    if (locale === 'ar') {
      // Arabic date format
      return new Intl.DateTimeFormat('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date);
    } else {
      // English date format
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date);
    }
  } catch (error) {
    console.error('Error formatting date:', error);
    return isoDate;
  }
};

// Calculate performance metrics
export const calculatePerformanceMetrics = (student: Student) => {
  // Attendance rate (%)
  const attendanceRate = student.attendance > 0 ? (student.attendance / 10) * 100 : 0;
  
  // Books completion (assuming 5 books is full score)
  const booksRate = student.booksOwned > 0 ? (student.booksOwned / 5) * 100 : 0;
  
  // Engagement rate (out of 10)
  const engagementRate = student.engagementScore > 0 ? (student.engagementScore / 10) * 100 : 0;
  
  // Overall performance (average of all metrics)
  const overallPerformance = (attendanceRate + booksRate + engagementRate) / 3;
  
  return {
    attendanceRate: Math.min(100, attendanceRate),
    booksRate: Math.min(100, booksRate),
    engagementRate: Math.min(100, engagementRate),
    overallPerformance: Math.min(100, overallPerformance),
  };
};

// Generate sample students for testing
export const generateSampleStudents = (): Student[] => {
  return [
    {
      id: '1',
      name: 'Ahmed Ali',
      points: 78,
      attendance: 8,
      booksOwned: 3,
      engagementScore: 7,
      nationality: 'national',
      grade: 'Grade 3',
      subjects: ['Math', 'Science', 'English'],
      pointsHistory: [
        {
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          change: 50,
          reason: 'Initial points',
        },
        {
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          change: 10,
          reason: 'Attendance',
        },
        {
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          change: 15,
          reason: 'Book ownership',
        },
        {
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          change: 3,
          reason: 'Class engagement',
        },
      ],
      // Add recognition system fields
      helpfulness: 2,
      respect: 3,
      teamwork: 1,
      excellence: 2,
      awards: ['Respect Star (Level 1)'],
      recognitions: [
        {
          date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'respect',
          description: 'Helped a new student adjust',
        },
        {
          date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'helpfulness',
          description: 'Assisted classmates with homework',
        },
      ],
    },
    {
      id: '2',
      name: 'Sara Mohammad',
      points: 92,
      attendance: 10,
      booksOwned: 4,
      engagementScore: 8,
      nationality: 'international',
      grade: 'Grade 4',
      subjects: ['Math', 'Science', 'Art', 'Music'],
      pointsHistory: [
        {
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          change: 50,
          reason: 'Initial points',
        },
        {
          date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          change: 20,
          reason: 'Attendance and book ownership',
        },
        {
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          change: 22,
          reason: 'Class engagement',
        },
      ],
      // Add recognition system fields
      helpfulness: 4,
      respect: 2,
      teamwork: 5,
      excellence: 3,
      awards: ['Teamwork Star (Level 1)'],
      recognitions: [
        {
          date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'teamwork',
          description: 'Led group project exceptionally',
        },
      ],
    },
    {
      id: '3',
      name: 'Yousef Khalid',
      points: 45,
      attendance: 5,
      booksOwned: 2,
      engagementScore: 4,
      nationality: 'national',
      grade: 'Grade 2',
      subjects: ['Math', 'English', 'Physical Education'],
      pointsHistory: [
        {
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          change: 30,
          reason: 'Initial points',
        },
        {
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          change: 10,
          reason: 'Attendance',
        },
        {
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          change: 5,
          reason: 'Book ownership',
        },
      ],
      // Add recognition system fields
      helpfulness: 1,
      respect: 1,
      teamwork: 2,
      excellence: 0,
      awards: [],
      recognitions: [
        {
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'teamwork',
          description: 'Good collaboration during group activity',
        },
      ],
    },
  ];
};

// Helper to create translations object
export const createTranslations = <T extends Record<string, any>>(
  en: T,
  ar: T
): { en: T; ar: T } => {
  return { en, ar };
};
