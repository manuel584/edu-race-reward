
import React from 'react';
import Header from '@/components/Header';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard: React.FC = () => {
  const { language } = useAppContext();
  const t = getTranslations(language);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="page-container">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold">{t.teacher || "Teacher Dashboard"}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {t.teacherDesc || "Manage your classes and teaching materials"}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-4">{t.classes || "My Classes"}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {t.classesDesc || "View and manage your assigned classes"}
            </p>
            <Button onClick={() => navigate('/class-sections')} variant="default">
              {t.viewClasses || "View Classes"}
            </Button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-4">{t.exam || "Exam Center"}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {t.examDesc || "Create and manage exams and assessments"}
            </p>
            <Button onClick={() => navigate('/exam-center')} variant="default">
              {t.openExam || "Open Exam Center"}
            </Button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-4">{t.recognition || "Student Recognition"}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {t.recognitionDesc || "Recognize and reward student achievements"}
            </p>
            <Button onClick={() => navigate('/students')} variant="default">
              {t.manageRecognitions || "Manage Recognitions"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
