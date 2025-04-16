import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type Student = {
  id: string;
  name: string;
  grade: string;
  nationality: 'national' | 'international';
  points: number;
  books?: number;
  archived?: boolean;
};

export type Award = {
  title: string;
  description: string;
  date: string;
  issuedBy?: string;
};

export type PointHistoryItem = {
  date: string;
  change: number;
  reason: string;
  givenBy?: string;
  subject: string;
};

export type Recognition = {
  date: string;
  type: 'helpfulness' | 'respect' | 'teamwork' | 'excellence';
  description: string;
  givenBy?: string;
  isNomination?: boolean;
};

export type Score = {
  date: string;
  score: number;
  subject: string;
  testName?: string;
};

export type BehaviorReport = {
  date: string;
  worstBehaved: Student[];
  bestBehaved: Student[];
};

export type AppContextType = {
  students: Student[];
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  archiveStudent: (id: string) => void;
  unarchiveStudent: (id: string) => void;
  deleteStudent: (id: string) => void;
  awards: Record<string, Award[]>;
  addAward: (studentId: string, award: Award) => void;
  getStudentAwards: (studentId: string) => Award[];
  pointsHistory: Record<string, PointHistoryItem[]>;
  updateStudentPoints: (studentId: string, change: number, reason: string, givenBy?: string, subject?: string) => void;
  getPointsHistory: (studentId: string) => PointHistoryItem[];
  recognitions: Record<string, Recognition[]>;
  addRecognition: (studentId: string, recognition: Recognition) => void;
  getStudentRecognitions: (studentId: string) => Recognition[];
  scores: Record<string, Score[]>;
  addScore: (studentId: string, score: Omit<Score, 'date'>) => void;
  getStudentScores: (studentId: string) => Score[];
  behaviorReports: BehaviorReport[];
  addBehaviorReport: (date: string, worstBehavedIds: string[], bestBehavedIds: string[]) => void;
  getDailyBehaviorReports: () => BehaviorReport[];
  grades: string[];
  addGrade: (grade: string) => void;
  deleteGrade: (grade: string) => void;
  goalPoints: number;
  setGoalPoints: (points: number) => void;
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
};

const defaultContext: AppContextType = {
  students: [],
  addStudent: () => {},
  updateStudent: () => {},
  archiveStudent: () => {},
  unarchiveStudent: () => {},
  deleteStudent: () => {},
  awards: {},
  addAward: () => {},
  getStudentAwards: () => [],
  pointsHistory: {},
  updateStudentPoints: () => {},
  getPointsHistory: () => [],
  recognitions: {},
  addRecognition: () => {},
  getStudentRecognitions: () => [],
  scores: {},
  addScore: () => {},
  getStudentScores: () => [],
  behaviorReports: [],
  addBehaviorReport: () => {},
  getDailyBehaviorReports: () => [],
  grades: [],
  addGrade: () => {},
  deleteGrade: () => {},
  goalPoints: 100,
  setGoalPoints: () => {},
  language: 'en',
  setLanguage: () => {},
};

const AppContext = createContext<AppContextType>(defaultContext);

type AppProviderProps = {
  children: ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const [students, setStudents] = useState<Student[]>(() => {
    const storedStudents = localStorage.getItem('students');
    return storedStudents ? JSON.parse(storedStudents) : [];
  });
  const [awards, setAwards] = useState<Record<string, Award[]>>(() => {
    const storedAwards = localStorage.getItem('awards');
    return storedAwards ? JSON.parse(storedAwards) : {};
  });
  const [pointsHistory, setPointsHistory] = useState<Record<string, PointHistoryItem[]>>(() => {
    const storedPointsHistory = localStorage.getItem('pointsHistory');
    return storedPointsHistory ? JSON.parse(storedPointsHistory) : {};
  });
  const [recognitions, setRecognitions] = useState<Record<string, Recognition[]>>(() => {
    const storedRecognitions = localStorage.getItem('recognitions');
    return storedRecognitions ? JSON.parse(storedRecognitions) : {};
  });
  const [scores, setScores] = useState<Record<string, Score[]>>(() => {
    const storedScores = localStorage.getItem('scores');
    return storedScores ? JSON.parse(storedScores) : {};
  });
  const [behaviorReports, setBehaviorReports] = useState<BehaviorReport[]>(() => {
    const storedBehaviorReports = localStorage.getItem('behaviorReports');
    return storedBehaviorReports ? JSON.parse(storedBehaviorReports) : [];
  });
  const [grades, setGrades] = useState<string[]>(() => {
    const storedGrades = localStorage.getItem('grades');
    return storedGrades ? JSON.parse(storedGrades) : ['Grade 1', 'Grade 2', 'Grade 3'];
  });
  const [goalPoints, setGoalPoints] = useState<number>(() => {
    const storedGoalPoints = localStorage.getItem('goalPoints');
    return storedGoalPoints ? parseInt(storedGoalPoints) : 100;
  });
  const [language, setLanguage] = useState<'en' | 'ar'>(() => {
    const storedLanguage = localStorage.getItem('language');
    return storedLanguage === 'ar' ? 'ar' : 'en';
  });
  
  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);
  
  useEffect(() => {
    localStorage.setItem('awards', JSON.stringify(awards));
  }, [awards]);
  
  useEffect(() => {
    localStorage.setItem('pointsHistory', JSON.stringify(pointsHistory));
  }, [pointsHistory]);
  
  useEffect(() => {
    localStorage.setItem('recognitions', JSON.stringify(recognitions));
  }, [recognitions]);
  
  useEffect(() => {
    localStorage.setItem('scores', JSON.stringify(scores));
  }, [scores]);
  
  useEffect(() => {
    localStorage.setItem('behaviorReports', JSON.stringify(behaviorReports));
  }, [behaviorReports]);
  
   useEffect(() => {
    localStorage.setItem('grades', JSON.stringify(grades));
  }, [grades]);
  
  useEffect(() => {
    localStorage.setItem('goalPoints', JSON.stringify(goalPoints));
  }, [goalPoints]);
  
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);
  
  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent: Student = { id: uuidv4(), ...student, points: 0, archived: false };
    setStudents(prevStudents => [...prevStudents, newStudent]);
  };
  
  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents(prevStudents =>
      prevStudents.map(student => (student.id === id ? { ...student, ...updates } : student))
    );
  };
  
  const archiveStudent = (id: string) => {
    setStudents(prevStudents =>
      prevStudents.map(student => (student.id === id ? { ...student, archived: true } : student))
    );
  };
  
  const unarchiveStudent = (id: string) => {
    setStudents(prevStudents => 
      prevStudents.map(student => 
        student.id === id ? { ...student, archived: false } : student
      )
    );
  };
  
  const deleteStudent = (id: string) => {
    setStudents(prevStudents => prevStudents.filter(student => student.id !== id));
  };
  
  const addAward = (studentId: string, award: Award) => {
    setAwards(prevAwards => ({
      ...prevAwards,
      [studentId]: [...(prevAwards[studentId] || []), award],
    }));
  };
  
  const getStudentAwards = (studentId: string): Award[] => {
    return awards[studentId] || [];
  };
  
  const updateStudentPoints = (studentId: string, change: number, reason: string, givenBy?: string, subject: string = 'General') => {
    setStudents(prevStudents =>
      prevStudents.map(student => {
        if (student.id === studentId) {
          const updatedPoints = student.points + change;
          
          // Add to points history
          setPointsHistory(prevHistory => ({
            ...prevHistory,
            [studentId]: [
              ...(prevHistory[studentId] || []),
              { date: new Date().toISOString(), change, reason, givenBy, subject },
            ],
          }));
          
          return { ...student, points: updatedPoints };
        }
        return student;
      })
    );
  };
  
  const getPointsHistory = (studentId: string): PointHistoryItem[] => {
    return pointsHistory[studentId] || [];
  };
  
  const addRecognition = (studentId: string, recognition: Recognition) => {
    setRecognitions(prevRecognitions => ({
      ...prevRecognitions,
      [studentId]: [...(prevRecognitions[studentId] || []), recognition],
    }));
  };
  
  const getStudentRecognitions = (studentId: string): Recognition[] => {
    return recognitions[studentId] || [];
  };
  
  const addScore = (studentId: string, score: Omit<Score, 'date'>) => {
    setScores(prevScores => ({
      ...prevScores,
      [studentId]: [...(prevScores[studentId] || []), { ...score, date: new Date().toISOString() }],
    }));
  };
  
  const getStudentScores = (studentId: string): Score[] => {
    return scores[studentId] || [];
  };
  
  const addBehaviorReport = (date: string, worstBehavedIds: string[], bestBehavedIds: string[]) => {
    const worstBehaved = students.filter(student => worstBehavedIds.includes(student.id));
    const bestBehaved = students.filter(student => bestBehavedIds.includes(student.id));
    
    setBehaviorReports(prevReports => [...prevReports, { date, worstBehaved, bestBehaved }]);
  };
  
  const getDailyBehaviorReports = (): BehaviorReport[] => {
    return behaviorReports;
  };
  
  const addGrade = (grade: string) => {
    setGrades(prevGrades => [...prevGrades, grade]);
  };
  
  const deleteGrade = (grade: string) => {
    setGrades(prevGrades => prevGrades.filter(g => g !== grade));
  };
  
  const value = {
    students,
    addStudent,
    updateStudent,
    archiveStudent,
    unarchiveStudent,
    deleteStudent,
    awards,
    addAward,
    getStudentAwards,
    pointsHistory,
    updateStudentPoints,
    getPointsHistory,
    recognitions,
    addRecognition,
    getStudentRecognitions,
    scores,
    addScore,
    getStudentScores,
    behaviorReports,
    addBehaviorReport,
    getDailyBehaviorReports,
    grades,
    addGrade,
    deleteGrade,
    goalPoints,
    setGoalPoints,
    language,
    setLanguage,
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
