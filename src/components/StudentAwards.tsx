
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Award, Calendar } from 'lucide-react';

interface StudentAwardsProps {
  studentId: string;
}

const StudentAwards: React.FC<StudentAwardsProps> = ({ studentId }) => {
  const { getStudentAwards, language } = useAppContext();
  const t = getTranslations(language);
  
  const awards = getStudentAwards(studentId);
  
  if (!awards.length) {
    return (
      <div className="text-center py-8 text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-lg border">
        {t.awards ? t.noAchievements || "No achievements yet" : "No achievements yet"}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {awards.map((award, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="border rounded-lg p-4 bg-white dark:bg-gray-800 dark:border-gray-700"
        >
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Award className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">{award.title}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(award.date)}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {award.description}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StudentAwards;
