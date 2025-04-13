
import React from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import QuickPointAdjust from './QuickPointAdjust';

interface StudentPointsCardProps {
  student: {
    id: string;
    name: string;
    points: number;
    nationality: 'international' | 'national';
    grade: string;
    subjects: string[];
  };
  onClick: () => void;
}

const StudentPointsCard: React.FC<StudentPointsCardProps> = ({ student, onClick }) => {
  const { language, goalPoints } = useAppContext();
  const t = getTranslations(language);

  // Calculate progress percentage (capped at 100%)
  const progressPercentage = Math.min(100, (student.points / goalPoints) * 100);

  // Generate badge for nationality
  const nationalityBadge = student.nationality === 'international' 
    ? <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">{t.international}</span>
    : <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">{t.national}</span>;

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md transition-all duration-200"
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 
            className="text-xl font-semibold cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            onClick={onClick}
          >
            {student.name}
          </h3>
          {nationalityBadge}
        </div>
        
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-3 cursor-pointer" onClick={onClick}>
          {student.grade} • {student.subjects?.length || 0} {t.subjects.toLowerCase()}
        </div>
        
        <div className="flex justify-between items-center" onClick={onClick}>
          <span className="text-gray-500 dark:text-gray-400">{t.points}:</span>
          <span className="font-medium text-blue-600 dark:text-blue-400">{student.points}</span>
        </div>
        
        <div className="mt-3 mb-4 w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 cursor-pointer" onClick={onClick}>
          <motion.div 
            className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.7, type: 'spring' }}
          ></motion.div>
        </div>
        
        <div className="flex justify-between gap-2 mt-4">
          <QuickPointAdjust studentId={student.id} studentName={student.name} isAdd={true} />
          <QuickPointAdjust studentId={student.id} studentName={student.name} isAdd={false} />
        </div>
      </div>
    </motion.div>
  );
};

export default StudentPointsCard;
