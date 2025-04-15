
import React from 'react';
import Header from '@/components/Header';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const { language } = useAppContext();
  const t = getTranslations(language);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="page-container">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold">{t.dashboard || "Dashboard"}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {t.welcomeMessage || "Welcome to the Education Reward System"}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-4">{t.students || "Students"}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {t.manageStudents || "Manage your students and their progress"}
            </p>
            <Button onClick={() => navigate('/students')} variant="default">
              {t.openStudentDashboard || "Go to Students"}
            </Button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-4">{t.teacherDashboard || "Teacher Dashboard"}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {t.teacherDashboardDesc || "Manage your classes and teaching materials"}
            </p>
            <Button onClick={() => navigate('/teacher-dashboard')} variant="default">
              {t.openTeacherDashboard || "Go to Teacher Dashboard"}
            </Button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-4">{t.reports || "Reports"}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {t.reportsDesc || "View and generate reports on student performance"}
            </p>
            <Button onClick={() => navigate('/reports')} variant="default">
              {t.viewReports || "View Reports"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
