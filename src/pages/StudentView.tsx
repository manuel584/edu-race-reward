
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { formatDateFromIso } from '@/lib/studentData';
import Header from '@/components/Header';
import StudentProfile from '@/components/StudentProfile';
import StudentRecognitionProfile from '@/components/StudentRecognitionProfile';
import StudentExamScores from '@/components/StudentExamScores';
import QuickPointAdjust from '@/components/QuickPointAdjust';
import StudentStickyHeader from '@/components/StudentStickyHeader';
import StudentNominationForm from '@/components/StudentNominationForm';
import BackToTopButton from '@/components/BackToTopButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar,
  ArrowDown,
  ArrowUp,
  Trophy,
  Award,
  Heart,
  BookOpen
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const StudentView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    students, 
    language, 
    goalPoints 
  } = useAppContext();
  
  const [nominateOpen, setNominateOpen] = useState(false);
  
  const student = students.find(s => s.id === id) || null;
  const t = getTranslations(language);

  // Check if student exists
  useEffect(() => {
    if (!student) {
      navigate('/dashboard');
      toast.error('Student not found');
    }
  }, [id, students, navigate, student]);

  if (!student) return null;

  // Calculate progress percentage
  const progressPercentage = Math.min(100, (student.points / goalPoints) * 100);
  
  // Get progress status
  const getProgressStatus = () => {
    if (progressPercentage >= 100) {
      return {
        message: `${t.congratulations || "Congratulations!"} ${student.name} ${t.reachedGoal || "reached goal!"}`,
        color: 'text-green-600',
        icon: <Trophy className="h-5 w-5" />
      };
    } else if (progressPercentage >= 75) {
      return {
        message: `${t.almost || "Almost there!"}`,
        color: 'text-blue-600',
        icon: <ArrowUp className="h-5 w-5" />
      };
    } else if (progressPercentage >= 50) {
      return {
        message: `${t.keepGoing || "Keep going!"}`,
        color: 'text-orange-500',
        icon: null
      };
    } else {
      return {
        message: `${t.needsImprovement || "Needs improvement"}`,
        color: 'text-gray-500',
        icon: <ArrowDown className="h-5 w-5" />
      };
    }
  };

  const progressStatus = getProgressStatus();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <StudentStickyHeader student={student} language={language} goalPoints={goalPoints} />
      
      <main className="page-container relative pb-20">
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
              
              <div className="mt-4 md:mt-0 flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setNominateOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Heart className="h-4 w-4 text-rose-500" />
                  {t.nominate || "Nominate"}
                </Button>
                <QuickPointAdjust studentId={student.id} studentName={student.name} isAdd={true} />
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
                <span className="text-gray-500">{t.progressToGoal || "Progress to Goal"}</span>
                <span className="font-medium">
                  {student.points} / {goalPoints} {t.points || "points"}
                </span>
              </div>
            </div>
            
            <Tabs defaultValue="profile">
              <TabsList className="mb-6">
                <TabsTrigger value="profile">
                  {t.profile || "Profile"}
                </TabsTrigger>
                <TabsTrigger value="recognition">
                  <Award className="mr-2 h-4 w-4" />
                  {t.recognition || "Recognition"}
                </TabsTrigger>
                <TabsTrigger value="exams">
                  <BookOpen className="mr-2 h-4 w-4" />
                  {t.examScores || "Exam Scores"}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <StudentProfile student={student} />
              </TabsContent>
              
              <TabsContent value="recognition">
                <StudentRecognitionProfile student={student} />
              </TabsContent>
              
              <TabsContent value="exams">
                <StudentExamScores student={student} />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="border-t border-gray-100">
            <div className="p-8">
              <h2 className="text-xl font-semibold mb-4">{t.pointHistory || "Points History"}</h2>
              
              {student.pointsHistory && student.pointsHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <div className="rounded-xl border border-gray-200 min-w-full">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t.date || "Date"}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t.change || "Change"}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t.reason || "Reason"}
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
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {t.noPointsHistory || "No points history available"}
                </div>
              )}
            </div>
          </div>
        </motion.div>
        
        <BackToTopButton />
      </main>
      
      <StudentNominationForm 
        open={nominateOpen} 
        onOpenChange={setNominateOpen}
      />
    </div>
  );
};

export default StudentView;
