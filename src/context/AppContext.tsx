
import React, { createContext, useContext, useState, useEffect } from 'react';

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
  // Adding recognition system fields
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
  // New recognition system methods
  addRecognition: (studentId: string, type: 'helpfulness' | 'respect' | 'teamwork' | 'excellence', description: string) => void;
  addClassAchievement: (className: string, achievement: string) => void;
  getClassMetrics: () => ClassMetrics[];
  nominateStudent: (studentId: string, category: string, nominatorId: string) => void;
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
  updateStudent: () => {},
  deleteStudent: () => {},
  // New recognition system methods
  addRecognition: () => {},
  addClassAchievement: () => {},
  getClassMetrics: () => [],
  nominateStudent: () => {},
});

// Hook to use the context
export const useAppContext = () => useContext(AppContext);

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [goalPoints, setGoalPoints] = useState<number>(100);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [classAchievements, setClassAchievements] = useState<{[className: string]: string[]}>({});

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
      // Initialize recognition system fields
      helpfulness: 0,
      respect: 0,
      teamwork: 0,
      excellence: 0,
      awards: [],
      recognitions: [],
    };
    
    setStudents((prev) => [...prev, newStudent]);
  };

  // Update student data
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

  // Delete a student
  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter(student => student.id !== id));
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
  const importStudents = (newStudents: Omit<Student, 'id' | 'pointsHistory' | 'recognitions' | 'awards'>[]) => {
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
      // Initialize recognition system fields
      helpfulness: 0,
      respect: 0,
      teamwork: 0,
      excellence: 0,
      awards: [],
      recognitions: [],
    }));
    
    setStudents((prev) => [...prev, ...formattedStudents]);
  };

  // New method to add a recognition to a student
  const addRecognition = (studentId: string, type: 'helpfulness' | 'respect' | 'teamwork' | 'excellence', description: string) => {
    setStudents((prev) => 
      prev.map((student) => {
        if (student.id === studentId) {
          const updatedStudent = {
            ...student,
            recognitions: [
              ...student.recognitions,
              {
                date: new Date().toISOString(),
                type,
                description,
              },
            ],
          };
          
          // Update the corresponding metric
          updatedStudent[type] = student[type] + 1;
          
          // Add award if needed (5 recognitions of the same type)
          if (updatedStudent[type] % 5 === 0) {
            const award = `${type.charAt(0).toUpperCase() + type.slice(1)} Star (Level ${Math.floor(updatedStudent[type] / 5)})`;
            updatedStudent.awards = [...student.awards, award];
          }
          
          return updatedStudent;
        }
        return student;
      })
    );
  };

  // Add an achievement to a class
  const addClassAchievement = (className: string, achievement: string) => {
    setClassAchievements(prev => {
      const classAchievementsList = prev[className] || [];
      return {
        ...prev,
        [className]: [...classAchievementsList, achievement]
      };
    });
  };

  // Calculate class metrics for comparison
  const getClassMetrics = (): ClassMetrics[] => {
    const classBuckets: {[className: string]: Student[]} = {};
    
    // Group students by class/grade
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
      
      // Simple calculation for weekly improvement (could be enhanced with real historical data)
      const weeklyImprovement = Math.random() * 10; // Placeholder improvement metric
      
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

  // Nominate a student for recognition
  const nominateStudent = (studentId: string, category: string, nominatorId: string) => {
    // In a real app, this would store nominations for teacher verification
    console.log(`Student ${studentId} nominated for ${category} by ${nominatorId}`);
    // For now, we'll simulate immediate recognition
    const recognitionType = category === 'academic help' || category === 'emotional support' 
      ? 'helpfulness'
      : category === 'conflict resolution' || category === 'cultural sensitivity'
      ? 'respect'
      : category === 'group contribution' || category === 'collaboration'
      ? 'teamwork'
      : 'excellence';
      
    addRecognition(studentId, recognitionType, `Nominated for ${category}`);
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
    updateStudent,
    deleteStudent,
    // New recognition system methods
    addRecognition,
    addClassAchievement,
    getClassMetrics,
    nominateStudent,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
