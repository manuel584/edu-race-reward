import React, { createContext, useContext, useState, useEffect } from 'react';
import { StudentScore, Exam, Question } from '@/types/student-score';
import { toast } from 'sonner';

// Types
export type Student = {
  id: string;
  name: string;
  points: number;
  attendance: number;
  booksOwned: number;
  engagementScore: number;
  nationality: 'international' | 'national';
  grade: string;
  subjects: string[];
  pointsHistory: {
    date: string;
    change: number;
    reason: string;
  }[];
  helpfulness: number;
  respect: number;
  teamwork: number;
  excellence: number;
  awards: string[];
  recognitions: {
    date: string;
    type: 'helpfulness' | 'respect' | 'teamwork' | 'excellence';
    description: string;
  }[];
  archived?: boolean;
};

export type ClassMetrics = {
  id: string;
  name: string;
  totalPoints: number;
  averageAttendance: number;
  averageEngagement: number;
  weeklyImprovement: number;
  achievements: string[];
};

export type DeletedItem = {
  id: string;
  type: 'student' | 'class';
  data: any;
  deletedAt: string;
  deletedBy: string;
};

export type AppContextType = {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  language: 'en' | 'ar';
  setLanguage: React.Dispatch<React.SetStateAction<'en' | 'ar'>>;
  addStudent: (student: Omit<Student, 'id' | 'pointsHistory' | 'recognitions' | 'awards'>) => void;
  updateStudentPoints: (id: string, change: number, reason: string, teacherId?: string, subject?: string) => void;
  goalPoints: number;
  setGoalPoints: React.Dispatch<React.SetStateAction<number>>;
  importStudents: (students: Omit<Student, 'id' | 'pointsHistory' | 'recognitions' | 'awards'>[]) => void;
  selectedStudent: Student | null;
  setSelectedStudent: React.Dispatch<React.SetStateAction<Student | null>>;
  updateStudent: (id: string, studentData: Partial<Omit<Student, 'id' | 'pointsHistory'>>) => void;
  deleteStudent: (id: string) => void;
  deleteStudents: (ids: string[]) => void;
  deleteStudentsByClass: (className: string) => void;
  archiveStudent: (id: string) => void;
  archiveStudents: (ids: string[]) => void;
  getArchivedStudents: () => Student[];
  restoreArchivedStudent: (id: string) => void;
  addRecognition: (studentId: string, type: 'helpfulness' | 'respect' | 'teamwork' | 'excellence', description: string) => void;
  addClassAchievement: (className: string, achievement: string) => void;
  getClassMetrics: () => ClassMetrics[];
  nominateStudent: (studentId: string, category: string, nominatorId: string) => void;
  scores: StudentScore[];
  addScore: (score: Omit<StudentScore, 'id'>) => void;
  updateScore: (id: string, scoreData: Omit<StudentScore, 'id'>) => void;
  deleteScore: (id: string) => void;
  exams: Exam[];
  addExam: (exam: Omit<Exam, 'id' | 'createdAt'>) => void;
  updateExam: (id: string, examData: Omit<Exam, 'id' | 'createdAt'>) => void;
  deleteExam: (id: string) => void;
  deletedItems: DeletedItem[];
  getDeletedItems: () => DeletedItem[];
  restoreDeletedItem: (id: string) => void;
  permanentlyDeleteItem: (id: string) => void;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  updateGradeName: (oldName: string, newName: string) => void;
  getDailyBehaviorReports: () => { date: string; worstBehaved: Student[]; bestBehaved: Student[] }[];
  addBehaviorReport: (date: string, worstStudentIds: string[], bestStudentIds: string[]) => void;
};

const AppContext = createContext<AppContextType>({
  students: [],
  setStudents: () => {},
  language: 'en',
  setLanguage: () => {},
  addStudent: () => {},
  updateStudentPoints: () => {},
  goalPoints: 100,
  setGoalPoints: () => {},
  importStudents: () => {},
  selectedStudent: null,
  setSelectedStudent: () => {},
  updateStudent: () => {},
  deleteStudent: () => {},
  deleteStudents: () => {},
  deleteStudentsByClass: () => {},
  archiveStudent: () => {},
  archiveStudents: () => {},
  getArchivedStudents: () => [],
  restoreArchivedStudent: () => {},
  addRecognition: () => {},
  addClassAchievement: () => {},
  getClassMetrics: () => [],
  nominateStudent: () => {},
  scores: [],
  addScore: () => {},
  updateScore: () => {},
  deleteScore: () => {},
  exams: [],
  addExam: () => {},
  updateExam: () => {},
  deleteExam: () => {},
  deletedItems: [],
  getDeletedItems: () => [],
  restoreDeletedItem: () => {},
  permanentlyDeleteItem: () => {},
  theme: 'light',
  setTheme: () => {},
  updateGradeName: () => {},
  getDailyBehaviorReports: () => [],
  addBehaviorReport: () => {},
});

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [goalPoints, setGoalPoints] = useState<number>(100);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [classAchievements, setClassAchievements] = useState<{[className: string]: string[]}>({});
  const [scores, setScores] = useState<StudentScore[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [deletedItems, setDeletedItems] = useState<DeletedItem[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [behaviorReports, setBehaviorReports] = useState<{ 
    date: string; 
    worstBehaved: string[]; 
    bestBehaved: string[] 
  }[]>([]);

  useEffect(() => {
    const savedStudents = localStorage.getItem('students');
    const savedLanguage = localStorage.getItem('language');
    const savedGoalPoints = localStorage.getItem('goalPoints');
    const savedScores = localStorage.getItem('studentScores');
    const savedExams = localStorage.getItem('exams');
    const savedDeletedItems = localStorage.getItem('deletedItems');
    const savedTheme = localStorage.getItem('theme');
    const savedBehaviorReports = localStorage.getItem('behaviorReports');

    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    }
    
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
      setLanguage(savedLanguage as 'en' | 'ar');
    }
    
    if (savedGoalPoints) {
      setGoalPoints(Number(savedGoalPoints));
    }
    
    if (savedScores) {
      setScores(JSON.parse(savedScores));
    }
    
    if (savedExams) {
      setExams(JSON.parse(savedExams));
    }

    if (savedDeletedItems) {
      setDeletedItems(JSON.parse(savedDeletedItems));
    }
    
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setTheme(savedTheme as 'light' | 'dark' | 'system');
    }
    
    if (savedBehaviorReports) {
      setBehaviorReports(JSON.parse(savedBehaviorReports));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    localStorage.setItem('goalPoints', goalPoints.toString());
  }, [goalPoints]);
  
  useEffect(() => {
    localStorage.setItem('studentScores', JSON.stringify(scores));
  }, [scores]);
  
  useEffect(() => {
    localStorage.setItem('exams', JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem('deletedItems', JSON.stringify(deletedItems));
  }, [deletedItems]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    // Update DOM for theme
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);
  
  useEffect(() => {
    localStorage.setItem('behaviorReports', JSON.stringify(behaviorReports));
  }, [behaviorReports]);

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  const addStudent = (student: Omit<Student, 'id' | 'pointsHistory' | 'recognitions' | 'awards'>) => {
    const newStudent: Student = {
      ...student,
      id: generateId(),
      pointsHistory: [
        {
          date: new Date().toISOString(),
          change: student.points,
          reason: 'Initial points',
        },
      ],
      helpfulness: student.helpfulness || 0,
      respect: student.respect || 0,
      teamwork: student.teamwork || 0,
      excellence: student.excellence || 0,
      awards: [],
      recognitions: [],
    };
    
    setStudents((prev) => [...prev, newStudent]);
  };

  const updateStudent = (id: string, studentData: Partial<Omit<Student, 'id' | 'pointsHistory'>>) => {
    setStudents((prev) => 
      prev.map((student) => {
        if (student.id === id) {
          return {
            ...student,
            ...studentData,
          };
        }
        return student;
      })
    );
  };

  const deleteStudent = (id: string) => {
    // Get the student to archive before removing
    const studentToDelete = students.find(student => student.id === id);
    
    if (studentToDelete) {
      // Add to deleted items
      const deletedItem: DeletedItem = {
        id: generateId(),
        type: 'student',
        data: studentToDelete,
        deletedAt: new Date().toISOString(),
        deletedBy: 'admin', // In a real app, this would be the current user
      };
      
      setDeletedItems(prev => [...prev, deletedItem]);
    }
    
    // Remove from active students
    setStudents((prev) => prev.filter(student => student.id !== id));
  };

  const deleteStudents = (ids: string[]) => {
    // Get students to delete before removing
    const studentsToDelete = students.filter(student => ids.includes(student.id));
    
    // Add each to deleted items
    studentsToDelete.forEach(student => {
      const deletedItem: DeletedItem = {
        id: generateId(),
        type: 'student',
        data: student,
        deletedAt: new Date().toISOString(),
        deletedBy: 'admin', // In a real app, this would be the current user
      };
      
      setDeletedItems(prev => [...prev, deletedItem]);
    });
    
    // Remove from active students
    setStudents((prev) => prev.filter(student => !ids.includes(student.id)));
  };

  const deleteStudentsByClass = (className: string) => {
    // Get students in this class
    const studentsInClass = students.filter(student => student.grade === className);
    const studentIds = studentsInClass.map(student => student.id);
    
    if (studentIds.length > 0) {
      deleteStudents(studentIds);
    }
  };

  const archiveStudent = (id: string) => {
    setStudents((prev) => 
      prev.map((student) => {
        if (student.id === id) {
          return {
            ...student,
            archived: true,
          };
        }
        return student;
      })
    );
  };

  const archiveStudents = (ids: string[]) => {
    setStudents((prev) => 
      prev.map((student) => {
        if (ids.includes(student.id)) {
          return {
            ...student,
            archived: true,
          };
        }
        return student;
      })
    );
  };

  const getArchivedStudents = () => {
    return students.filter(student => student.archived);
  };

  const restoreArchivedStudent = (id: string) => {
    setStudents((prev) => 
      prev.map((student) => {
        if (student.id === id) {
          const { archived, ...rest } = student;
          return rest;
        }
        return student;
      })
    );
  };

  const getDeletedItems = () => {
    return deletedItems;
  };

  const restoreDeletedItem = (id: string) => {
    const itemToRestore = deletedItems.find(item => item.id === id);
    
    if (itemToRestore) {
      if (itemToRestore.type === 'student') {
        // Add student back to active students
        setStudents(prev => [...prev, itemToRestore.data]);
      }
      
      // Remove from deleted items
      setDeletedItems(prev => prev.filter(item => item.id !== id));
      
      toast.success(
        language === 'en' 
          ? `${itemToRestore.type === 'student' ? 'Student' : 'Class'} restored successfully` 
          : `تمت استعادة ${itemToRestore.type === 'student' ? 'الطالب' : 'الفصل'} بنجاح`
      );
    }
  };

  const permanentlyDeleteItem = (id: string) => {
    setDeletedItems(prev => prev.filter(item => item.id !== id));
    
    toast.success(
      language === 'en' 
        ? 'Item permanently deleted' 
        : 'تم حذف العنصر نهائيًا'
    );
  };

  const updateStudentPoints = (id: string, change: number, reason: string, teacherId?: string, subject?: string) => {
    setStudents((prev) => 
      prev.map((student) => {
        if (student.id === id) {
          const updatedPoints = student.points + change;
          return {
            ...student,
            points: updatedPoints,
            pointsHistory: [
              ...student.pointsHistory,
              {
                date: new Date().toISOString(),
                change,
                reason,
                teacherId,
                subject
              },
            ],
          };
        }
        return student;
      })
    );
  };

  const importStudents = (newStudents: Omit<Student, 'id' | 'pointsHistory' | 'recognitions' | 'awards'>[]) => {
    const formattedStudents = newStudents.map(student => ({
      ...student,
      id: generateId(),
      helpfulness: student.helpfulness || 0,
      respect: student.respect || 0,
      teamwork: student.teamwork || 0,
      excellence: student.excellence || 0,
      awards: [],
      pointsHistory: [
        {
          date: new Date().toISOString(),
          change: student.points,
          reason: 'Initial points from import',
        },
      ],
      recognitions: [],
    }));
    
    setStudents((prev) => [...prev, ...formattedStudents]);
  };

  const addRecognition = (studentId: string, type: 'helpfulness' | 'respect' | 'teamwork' | 'excellence', description: string) => {
    setStudents((prev) => 
      prev.map((student) => {
        if (student.id === studentId) {
          const currentValue = typeof student[type] === 'number' && !isNaN(student[type]) ? student[type] : 0;
          
          const updatedStudent = {
            ...student,
            recognitions: [
              ...(student.recognitions || []),
              {
                date: new Date().toISOString(),
                type,
                description,
              },
            ],
          };
          
          updatedStudent[type] = currentValue + 1;
          
          if (updatedStudent[type] % 5 === 0) {
            const { getAwardName } = require('../lib/recognitionUtils');
            const level = Math.floor(updatedStudent[type] / 5);
            const award = getAwardName(type, level);
            updatedStudent.awards = [...(student.awards || []), award];
          }
          
          return updatedStudent;
        }
        return student;
      })
    );
  };

  const addClassAchievement = (className: string, achievement: string) => {
    setClassAchievements(prev => {
      const classAchievementsList = prev[className] || [];
      return {
        ...prev,
        [className]: [...classAchievementsList, achievement]
      };
    });
  };

  const getClassMetrics = (): ClassMetrics[] => {
    const classBuckets: {[className: string]: Student[]} = {};
    
    // Only include non-archived students
    const activeStudents = students.filter(student => !student.archived);
    
    activeStudents.forEach(student => {
      if (!classBuckets[student.grade]) {
        classBuckets[student.grade] = [];
      }
      classBuckets[student.grade].push(student);
    });
    
    return Object.entries(classBuckets).map(([className, classStudents]) => {
      const totalPoints = classStudents.reduce((sum, student) => sum + student.points, 0);
      const averageAttendance = classStudents.reduce((sum, student) => sum + student.attendance, 0) / classStudents.length;
      const averageEngagement = classStudents.reduce((sum, student) => sum + student.engagementScore, 0) / classStudents.length;
      
      const weeklyImprovement = Math.random() * 10;
      
      return {
        id: className,
        name: className,
        totalPoints,
        averageAttendance,
        averageEngagement,
        weeklyImprovement,
        achievements: classAchievements[className] || [],
      };
    });
  };

  const nominateStudent = (studentId: string, category: string, nominatorId: string) => {
    console.log(`Student ${studentId} nominated for ${category} by ${nominatorId}`);
    const recognitionType = category === 'academic help' || category === 'emotional support' 
      ? 'helpfulness'
      : category === 'conflict resolution' || category === 'cultural sensitivity'
      ? 'respect'
      : category === 'group contribution' || category === 'collaboration'
      ? 'teamwork'
      : 'excellence';
      
    addRecognition(studentId, recognitionType, `Nominated for ${category}`);
  };

  const addScore = (scoreData: Omit<StudentScore, 'id'>) => {
    const newScore: StudentScore = {
      ...scoreData,
      id: generateId()
    };
    
    setScores(prev => [...prev, newScore]);
  };
  
  const updateScore = (id: string, scoreData: Omit<StudentScore, 'id'>) => {
    setScores(prev => 
      prev.map(score => {
        if (score.id === id) {
          return { ...scoreData, id };
        }
        return score;
      })
    );
  };
  
  const deleteScore = (id: string) => {
    setScores(prev => prev.filter(score => score.id !== id));
  };

  const addExam = (examData: Omit<Exam, 'id' | 'createdAt'>) => {
    const newExam: Exam = {
      ...examData,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    
    setExams(prev => [...prev, newExam]);
  };
  
  const updateExam = (id: string, examData: Omit<Exam, 'id' | 'createdAt'>) => {
    setExams(prev => 
      prev.map(exam => {
        if (exam.id === id) {
          return { 
            ...exam, 
            ...examData,
          };
        }
        return exam;
      })
    );
  };
  
  const deleteExam = (id: string) => {
    setExams(prev => prev.filter(exam => exam.id !== id));
  };

  const updateGradeName = (oldName: string, newName: string) => {
    if (oldName === newName) return;
    
    setStudents((prev) => 
      prev.map((student) => {
        if (student.grade === oldName) {
          return {
            ...student,
            grade: newName
          };
        }
        return student;
      })
    );
  };
  
  const getDailyBehaviorReports = () => {
    return behaviorReports.map(report => ({
      date: report.date,
      worstBehaved: students.filter(s => report.worstBehaved.includes(s.id)),
      bestBehaved: students.filter(s => report.bestBehaved.includes(s.id))
    }));
  };
  
  const addBehaviorReport = (date: string, worstStudentIds: string[], bestStudentIds: string[]) => {
    const existingReportIndex = behaviorReports.findIndex(r => r.date === date);
    
    if (existingReportIndex >= 0) {
      const updatedReports = [...behaviorReports];
      updatedReports[existingReportIndex] = {
        date,
        worstBehaved: worstStudentIds,
        bestBehaved: bestStudentIds
      };
      setBehaviorReports(updatedReports);
    } else {
      setBehaviorReports([
        ...behaviorReports,
        {
          date,
          worstBehaved: worstStudentIds,
          bestBehaved: bestStudentIds
        }
      ]);
    }
  };

  const value = {
    students,
    setStudents,
    language,
    setLanguage,
    addStudent,
    updateStudentPoints,
    goalPoints,
    setGoalPoints,
    importStudents,
    selectedStudent,
    setSelectedStudent,
    updateStudent,
    deleteStudent,
    deleteStudents,
    deleteStudentsByClass,
    archiveStudent,
    archiveStudents,
    getArchivedStudents,
    restoreArchivedStudent,
    addRecognition,
    addClassAchievement,
    getClassMetrics,
    nominateStudent,
    scores,
    addScore,
    updateScore,
    deleteScore,
    exams,
    addExam,
    updateExam,
    deleteExam,
    deletedItems,
    getDeletedItems,
    restoreDeletedItem,
    permanentlyDeleteItem,
    theme,
    setTheme,
    updateGradeName,
    getDailyBehaviorReports,
    addBehaviorReport,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
