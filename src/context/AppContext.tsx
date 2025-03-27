import React, { createContext, useContext, useState, useEffect } from 'react';
import { StudentScore, Exam, Question } from '@/types/student-score';

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

export type AppContextType = {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  language: 'en' | 'ar';
  setLanguage: React.Dispatch<React.SetStateAction<'en' | 'ar'>>;
  addStudent: (student: Omit<Student, 'id' | 'pointsHistory' | 'recognitions' | 'awards'>) => void;
  updateStudentPoints: (id: string, change: number, reason: string) => void;
  goalPoints: number;
  setGoalPoints: React.Dispatch<React.SetStateAction<number>>;
  importStudents: (students: Omit<Student, 'id' | 'pointsHistory' | 'recognitions' | 'awards'>[]) => void;
  selectedStudent: Student | null;
  setSelectedStudent: React.Dispatch<React.SetStateAction<Student | null>>;
  updateStudent: (id: string, studentData: Partial<Omit<Student, 'id' | 'pointsHistory'>>) => void;
  deleteStudent: (id: string) => void;
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

  useEffect(() => {
    const savedStudents = localStorage.getItem('students');
    const savedLanguage = localStorage.getItem('language');
    const savedGoalPoints = localStorage.getItem('goalPoints');
    const savedScores = localStorage.getItem('studentScores');
    const savedExams = localStorage.getItem('exams');

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
    setStudents((prev) => prev.filter(student => student.id !== id));
  };

  const updateStudentPoints = (id: string, change: number, reason: string) => {
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
    
    students.forEach(student => {
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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
