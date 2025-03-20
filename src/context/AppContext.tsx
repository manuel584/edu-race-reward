
import React, { createContext, useContext, useState, useEffect } from 'react';

// Types
export type Student = {
  id: string;
  name: string;
  points: number;
  attendance: number;
  booksOwned: number;
  engagementScore: number;
  pointsHistory: {
    date: string;
    change: number;
    reason: string;
  }[];
};

export type AppContextType = {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  language: 'en' | 'ar';
  setLanguage: React.Dispatch<React.SetStateAction<'en' | 'ar'>>;
  addStudent: (student: Omit<Student, 'id' | 'pointsHistory'>) => void;
  updateStudentPoints: (id: string, change: number, reason: string) => void;
  goalPoints: number;
  setGoalPoints: React.Dispatch<React.SetStateAction<number>>;
  importStudents: (students: Omit<Student, 'id' | 'pointsHistory'>[]) => void;
  selectedStudent: Student | null;
  setSelectedStudent: React.Dispatch<React.SetStateAction<Student | null>>;
};

// Create context with default values
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
});

// Hook to use the context
export const useAppContext = () => useContext(AppContext);

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [goalPoints, setGoalPoints] = useState<number>(100);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedStudents = localStorage.getItem('students');
    const savedLanguage = localStorage.getItem('language');
    const savedGoalPoints = localStorage.getItem('goalPoints');

    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    }
    
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
      setLanguage(savedLanguage as 'en' | 'ar');
    }
    
    if (savedGoalPoints) {
      setGoalPoints(Number(savedGoalPoints));
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('language', language);
    // Update document direction and lang
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    localStorage.setItem('goalPoints', goalPoints.toString());
  }, [goalPoints]);

  // Generate a unique ID
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  // Add a new student
  const addStudent = (student: Omit<Student, 'id' | 'pointsHistory'>) => {
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
    };
    
    setStudents((prev) => [...prev, newStudent]);
  };

  // Update student points with history tracking
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

  // Import multiple students from external source (like Excel)
  const importStudents = (newStudents: Omit<Student, 'id' | 'pointsHistory'>[]) => {
    const formattedStudents = newStudents.map(student => ({
      ...student,
      id: generateId(),
      pointsHistory: [
        {
          date: new Date().toISOString(),
          change: student.points,
          reason: 'Initial points from import',
        },
      ],
    }));
    
    setStudents((prev) => [...prev, ...formattedStudents]);
  };

  // Context value
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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
