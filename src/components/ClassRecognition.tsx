
import React from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { Award, Trophy, TrendingUp, Users } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import AnimatedNumber from '@/components/AnimatedNumber';

const ClassRecognition = () => {
  const { students, getClassMetrics, goalPoints, language } = useAppContext();
  const t = getTranslations(language);
  
  const classMetrics = getClassMetrics();
  
  // Sort classes by total points (descending)
  const sortedClasses = [...classMetrics].sort((a, b) => b.totalPoints - a.totalPoints);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-5 w-5 text-amber-500" />
        <h2 className="text-xl font-semibold">{t.classRecognition}</h2>
      </div>
      
      <div className="space-y-6">
        {sortedClasses.length > 0 ? (
          sortedClasses.map((classData, index) => {
            const progressPercentage = Math.min(100, (classData.totalPoints / (goalPoints * 5)) * 100);
            
            return (
              <motion.div
                key={classData.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg border border-gray-100 hover:border-blue-200 transition-all"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index === 0 ? 'bg-amber-100 text-amber-600' : index === 1 ? 'bg-gray-100 text-gray-600' : index === 2 ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                      {index === 0 ? '1st' : index === 1 ? '2nd' : index === 2 ? '3rd' : `${index+1}th`}
                    </div>
                    <h3 className="font-semibold text-lg">{classData.name}</h3>
                  </div>
                  <div className="flex items-center gap-1 text-blue-600">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">
                      {students.filter(s => s.grade === classData.name).length} {t.students.toLowerCase()}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-gray-500">{t.totalPoints}</span>
                  <span className="font-semibold">
                    <AnimatedNumber value={classData.totalPoints} className="text-blue-600" />
                  </span>
                </div>
                
                <Progress value={progressPercentage} className="h-2 mb-3" />
                
                <div className="grid grid-cols-3 gap-2 text-xs mt-3">
                  <div className="bg-green-50 p-2 rounded">
                    <div className="flex items-center gap-1 text-green-600 mb-1">
                      <Award className="h-3 w-3" />
                      <span>{t.attendance}</span>
                    </div>
                    <span className="font-semibold">{Math.round(classData.averageAttendance * 10) / 10}/10</span>
                  </div>
                  
                  <div className="bg-purple-50 p-2 rounded">
                    <div className="flex items-center gap-1 text-purple-600 mb-1">
                      <Users className="h-3 w-3" />
                      <span>{t.engagement}</span>
                    </div>
                    <span className="font-semibold">{Math.round(classData.averageEngagement * 10) / 10}/10</span>
                  </div>
                  
                  <div className="bg-blue-50 p-2 rounded">
                    <div className="flex items-center gap-1 text-blue-600 mb-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>{t.improvement}</span>
                    </div>
                    <span className="font-semibold">+{Math.round(classData.weeklyImprovement)}%</span>
                  </div>
                </div>
                
                {classData.achievements.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-500 mb-2">{t.achievements}:</div>
                    <div className="flex flex-wrap gap-2">
                      {classData.achievements.map((achievement, i) => (
                        <span key={i} className="px-2 py-1 text-xs bg-amber-50 text-amber-600 rounded-full">
                          {achievement}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-6 text-gray-500">
            {t.noClassData}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassRecognition;
