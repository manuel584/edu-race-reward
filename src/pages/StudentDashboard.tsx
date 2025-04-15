
import React from 'react';
import Header from '@/components/Header';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const StudentDashboard: React.FC = () => {
  const { language } = useAppContext();
  const t = getTranslations(language);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="page-container">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold">{t.studentDashboard || "Student Dashboard"}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {t.studentDashboardDesc || "Manage and view student information"}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-4">{t.viewStudents || "View Students"}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {t.viewStudentsDesc || "Browse and search through student profiles"}
            </p>
            <Button onClick={() => navigate('/students')} variant="default">
              {t.openStudentsList || "Open Students List"}
            </Button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-4">{t.studentRecognitions || "Student Recognitions"}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {t.studentRecognitionsDesc || "View and manage student recognitions and awards"}
            </p>
            <Button onClick={() => navigate('/grade-recognition')} variant="default">
              {t.viewRecognitions || "View Recognitions"}
            </Button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-4">{t.studentScores || "Student Scores"}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {t.studentScoresDesc || "View and manage student scores and grades"}
            </p>
            <Button onClick={() => navigate('/scores')} variant="default">
              {t.viewScores || "View Scores"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
