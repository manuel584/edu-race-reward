
import React from 'react';
import { motion } from 'framer-motion';
import { useAppContext, Student } from '@/context/AppContext';
import { Flag } from 'lucide-react';

interface ProgressTrackProps {
  students: Student[];
}

const ProgressTrack: React.FC<ProgressTrackProps> = ({ students }) => {
  const { language, goalPoints } = useAppContext();
  
  const translations = {
    en: {
      raceToGoal: 'Race to the Goal',
      points: 'points',
      goal: 'Goal',
      noStudents: 'No students added yet',
    },
    ar: {
      raceToGoal: 'سباق نحو الهدف',
      points: 'نقطة',
      goal: 'الهدف',
      noStudents: 'لم يتم إضافة طلاب حتى الآن',
    }
  };

  const t = translations[language];
  
  // Sort students by points (descending)
  const sortedStudents = [...students].sort((a, b) => b.points - a.points);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-6">{t.raceToGoal}</h2>
      
      <div className="relative">
        {/* Track */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gray-200 flex items-start justify-center">
          <div className="absolute top-0 -right-2 bg-blue-600 p-1 rounded-full">
            <Flag className="h-3 w-3 text-white" />
          </div>
          <div className="absolute top-6 text-xs font-medium text-blue-600 whitespace-nowrap">
            {goalPoints} {t.points}
          </div>
        </div>
        
        {/* Student progress indicators */}
        {sortedStudents.length > 0 ? (
          <div className="ml-4 space-y-8 pb-16">
            {sortedStudents.map((student) => {
              // Calculate progress percentage (max 100%)
              const progressPercentage = Math.min(100, (student.points / goalPoints) * 100);
              
              return (
                <div key={student.id} className="relative">
                  <div className="flex items-center mb-1">
                    <motion.div 
                      className="h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center overflow-hidden"
                      style={{ width: `${progressPercentage}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 1, type: 'spring' }}
                    >
                      <div className="absolute left-3 flex items-center space-x-2">
                        <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">
                          {sortedStudents.indexOf(student) + 1}
                        </div>
                        <span className="text-white text-sm font-medium truncate max-w-xs">
                          {student.name}
                        </span>
                      </div>
                    </motion.div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {student.points} {t.points}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-10 text-center text-gray-400">
            {t.noStudents}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressTrack;
