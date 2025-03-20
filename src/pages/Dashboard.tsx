
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import Header from '@/components/Header';
import AddStudentDialog from '@/components/AddStudentDialog';
import StudentCard from '@/components/StudentCard';
import ProgressTrack from '@/components/ProgressTrack';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';

const Dashboard = () => {
  const { students, language } = useAppContext();
  const navigate = useNavigate();
  const t = getTranslations(language);

  // Sort students by points for ranking
  const sortedStudents = [...students].sort((a, b) => b.points - a.points);
  
  // Top performing students
  const topStudents = sortedStudents.slice(0, 3);

  const handleStudentClick = (id: string) => {
    navigate(`/student/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="page-container">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-3xl font-display font-bold">{t.dashboard}</h1>
            
            <div className="mt-4 md:mt-0">
              <AddStudentDialog />
            </div>
          </div>

          {students.length > 0 ? (
            <>
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t.raceToGoal}</h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <ProgressTrack students={sortedStudents} />
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t.progressOverview}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {topStudents.map(student => (
                    <StudentCard 
                      key={student.id} 
                      student={student} 
                      onClick={() => handleStudentClick(student.id)}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <p className="text-gray-500 mb-4">{t.noStudents}</p>
              <AddStudentDialog>
                <button className="button-primary inline-flex items-center">
                  <UserPlus className="mr-2 h-4 w-4" />
                  {t.addStudent}
                </button>
              </AddStudentDialog>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
