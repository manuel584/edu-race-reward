
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { formatDateFromIso, calculatePerformanceMetrics } from '@/lib/studentData';
import Header from '@/components/Header';
import AnimatedNumber from '@/components/AnimatedNumber';
import { 
  User, 
  CalendarCheck, 
  BookOpen, 
  MessageSquare, 
  PlusCircle, 
  MinusCircle,
  Calendar,
  Trophy,
  ArrowDown,
  ArrowUp
} from 'lucide-react';
import { toast } from 'sonner';

const StudentView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    students, 
    updateStudentPoints, 
    language, 
    goalPoints 
  } = useAppContext();
  
  const [student, setStudent] = useState(students.find(s => s.id === id) || null);
  const [isAddingPoints, setIsAddingPoints] = useState(false);
  const [isDeductingPoints, setIsDeductingPoints] = useState(false);
  const [pointsAmount, setPointsAmount] = useState('');
  const [pointsReason, setPointsReason] = useState('');
  
  const t = getTranslations(language);

  // Metrics calculation
  const metrics = student ? calculatePerformanceMetrics(student) : {
    attendanceRate: 0,
    booksRate: 0,
    engagementRate: 0,
    overallPerformance: 0
  };

  // Check if student exists
  useEffect(() => {
    const foundStudent = students.find(s => s.id === id);
    if (!foundStudent) {
      navigate('/dashboard');
      toast.error('Student not found');
    } else {
      setStudent(foundStudent);
    }
  }, [id, students, navigate]);

  // Handle adding points
  const handleAddPoints = (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;
    
    const amount = parseInt(pointsAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid positive number');
      return;
    }
    
    updateStudentPoints(student.id, amount, pointsReason || 'Added points');
    setIsAddingPoints(false);
    setPointsAmount('');
    setPointsReason('');
    toast.success(`${amount} points added to ${student.name}`);
  };

  // Handle deducting points
  const handleDeductPoints = (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;
    
    const amount = parseInt(pointsAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid positive number');
      return;
    }
    
    updateStudentPoints(student.id, -amount, pointsReason || 'Deducted points');
    setIsDeductingPoints(false);
    setPointsAmount('');
    setPointsReason('');
    toast.success(`${amount} points deducted from ${student.name}`);
  };

  if (!student) return null;

  // Calculate progress percentage
  const progressPercentage = Math.min(100, (student.points / goalPoints) * 100);
  
  // Get progress status
  const getProgressStatus = () => {
    if (progressPercentage >= 100) {
      return {
        message: `${t.congratulations} ${student.name} ${t.reachedGoal}`,
        color: 'text-green-600',
        icon: <Trophy className="h-5 w-5" />
      };
    } else if (progressPercentage >= 75) {
      return {
        message: `${t.almost}`,
        color: 'text-blue-600',
        icon: <ArrowUp className="h-5 w-5" />
      };
    } else if (progressPercentage >= 50) {
      return {
        message: `${t.keepGoing}`,
        color: 'text-orange-500',
        icon: null
      };
    } else {
      return {
        message: `${t.needsImprovement}`,
        color: 'text-gray-500',
        icon: <ArrowDown className="h-5 w-5" />
      };
    }
  };

  const progressStatus = getProgressStatus();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="page-container">
        <motion.div 
          className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-display font-bold mb-2">{student.name}</h1>
                <div className="flex items-center">
                  <div className={`flex items-center ${progressStatus.color}`}>
                    {progressStatus.icon && <span className="mr-1">{progressStatus.icon}</span>}
                    <span>{progressStatus.message}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 flex space-x-3">
                <button 
                  onClick={() => setIsAddingPoints(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm flex items-center"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t.addPoints}
                </button>
                
                <button 
                  onClick={() => setIsDeductingPoints(true)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 text-sm flex items-center"
                >
                  <MinusCircle className="mr-2 h-4 w-4" />
                  {t.deductPoints}
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
                <motion.div 
                  className="h-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, type: 'spring' }}
                ></motion.div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t.progressToGoal}</span>
                <span className="font-medium">
                  <AnimatedNumber value={student.points} className="text-blue-600" /> / {goalPoints} {t.points}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 rounded-xl p-4 flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-gray-500 text-sm">{t.points}</div>
                  <div className="font-semibold text-xl">
                    <AnimatedNumber value={student.points} />
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-4 flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <CalendarCheck className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-gray-500 text-sm">{t.attendance}</div>
                  <div className="font-semibold text-xl">
                    <AnimatedNumber value={student.attendance} />
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-4 flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-gray-500 text-sm">{t.books}</div>
                  <div className="font-semibold text-xl">
                    <AnimatedNumber value={student.booksOwned} />
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-4 flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-gray-500 text-sm">{t.engagement}</div>
                  <div className="font-semibold text-xl">
                    <AnimatedNumber value={student.engagementScore} />
                  </div>
                </div>
              </div>
            </div>
            
            {(isAddingPoints || isDeductingPoints) && (
              <motion.div 
                className="mb-6 p-4 border border-blue-100 rounded-xl bg-blue-50"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-medium mb-3">
                  {isAddingPoints ? t.addPoints : t.deductPoints}
                </h3>
                
                <form onSubmit={isAddingPoints ? handleAddPoints : handleDeductPoints}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.points}
                      </label>
                      <input
                        type="number"
                        value={pointsAmount}
                        onChange={(e) => setPointsAmount(e.target.value)}
                        className="input-field"
                        placeholder="0"
                        min="1"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.reason}
                      </label>
                      <input
                        type="text"
                        value={pointsReason}
                        onChange={(e) => setPointsReason(e.target.value)}
                        className="input-field"
                        placeholder={t.enterReason}
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="button-primary text-sm py-2 px-4"
                    >
                      {isAddingPoints ? t.addPoints : t.deductPoints}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingPoints(false);
                        setIsDeductingPoints(false);
                        setPointsAmount('');
                        setPointsReason('');
                      }}
                      className="button-secondary text-sm py-2 px-4"
                    >
                      {t.cancel}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
          
          <div className="border-t border-gray-100">
            <div className="p-8">
              <h2 className="text-xl font-semibold mb-4">{t.pointsHistory}</h2>
              
              {student.pointsHistory.length > 0 ? (
                <div className="rounded-xl border border-gray-200 overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t.date}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t.change}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t.reason}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {student.pointsHistory
                        .slice()
                        .reverse()
                        .map((entry, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                {formatDateFromIso(entry.date, language)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`
                                ${entry.change > 0 ? 'text-green-600' : entry.change < 0 ? 'text-red-600' : 'text-gray-500'}
                                font-medium
                              `}>
                                {entry.change > 0 ? '+' : ''}{entry.change}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {entry.reason}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No points history available
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default StudentView;
