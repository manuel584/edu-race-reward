
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { generateSampleStudents } from '@/lib/studentData';
import Header from '@/components/Header';
import ProgressTrack from '@/components/ProgressTrack';
import StudentCard from '@/components/StudentCard';
import { Plus, Users, Settings } from 'lucide-react';
import { toast } from 'sonner';

const Dashboard = () => {
  const { 
    students, 
    setStudents, 
    language, 
    goalPoints, 
    setGoalPoints,
    setSelectedStudent 
  } = useAppContext();
  const [isSettingGoal, setIsSettingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState(goalPoints.toString());
  const navigate = useNavigate();
  const t = getTranslations(language);

  // Add sample data if no students exist
  const handleAddSampleData = () => {
    setStudents(generateSampleStudents());
    toast.success('Sample data added successfully!');
  };

  // Handle navigation to student details
  const handleViewStudent = (id: string) => {
    const student = students.find(s => s.id === id);
    if (student) {
      setSelectedStudent(student);
      navigate(`/student/${id}`);
    }
  };

  // Handle goal change
  const handleGoalChange = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedGoal = parseInt(newGoal);
    if (!isNaN(parsedGoal) && parsedGoal > 0) {
      setGoalPoints(parsedGoal);
      setIsSettingGoal(false);
      toast.success(`Goal updated to ${parsedGoal} points`);
    } else {
      toast.error('Please enter a valid number greater than 0');
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        staggerChildren: 0.1
      }
    }
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="page-container">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-display font-bold">{t.dashboard}</h1>
          
          <div className="flex space-x-3">
            {students.length === 0 && (
              <button 
                onClick={handleAddSampleData}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-all duration-200 text-sm flex items-center"
              >
                <Users className="mr-2 h-4 w-4" />
                Add Sample Data
              </button>
            )}
            
            <button 
              onClick={() => navigate('/students/add')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm flex items-center"
            >
              <Plus className="mr-2 h-4 w-4" />
              {t.addStudent}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <ProgressTrack students={students} />
          </div>
          
          <motion.div 
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{t.goalPoints}</h2>
              
              <button 
                onClick={() => setIsSettingGoal(!isSettingGoal)}
                className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
              >
                <Settings className="h-4 w-4" />
              </button>
            </div>
            
            {isSettingGoal ? (
              <form onSubmit={handleGoalChange} className="mb-4">
                <div className="mb-3">
                  <input
                    type="number"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    className="input-field text-lg"
                    min="1"
                    required
                  />
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    type="submit"
                    className="button-primary text-sm py-2 px-4 flex-1"
                  >
                    {t.save}
                  </button>
                  
                  <button 
                    type="button"
                    onClick={() => {
                      setIsSettingGoal(false);
                      setNewGoal(goalPoints.toString());
                    }}
                    className="button-secondary text-sm py-2 px-4 flex-1"
                  >
                    {t.cancel}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="text-5xl font-display font-bold text-blue-600 mb-2">
                  {goalPoints}
                </div>
                <div className="text-gray-500">{t.points}</div>
              </div>
            )}
            
            <div className="border-t border-gray-100 pt-4 mt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">About Goal Points</h3>
              <p className="text-sm text-gray-600">
                This is the target that all students are racing towards. You can adjust this value based on your class needs.
              </p>
            </div>
          </motion.div>
        </div>
        
        <section>
          <h2 className="text-2xl font-semibold mb-6">{t.students}</h2>
          
          {students.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
            >
              {students.map((student) => (
                <motion.div key={student.id} variants={staggerItem}>
                  <StudentCard 
                    student={student} 
                    onClick={() => handleViewStudent(student.id)} 
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-500 mb-2">{t.noStudents}</h3>
              <p className="text-gray-400 mb-6">Add students to see their progress here</p>
              <button 
                onClick={() => navigate('/students/add')}
                className="button-primary"
              >
                {t.addStudent}
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
