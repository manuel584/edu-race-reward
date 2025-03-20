
import React from 'react';
import { motion } from 'framer-motion';
import { useAppContext, Student } from '@/context/AppContext';
import { User, Book, MessageSquare, ArrowUpRight } from 'lucide-react';
import { formatDateFromIso } from '@/lib/studentData';

interface StudentCardProps {
  student: Student;
  onClick?: () => void;
  showDetails?: boolean;
}

const StudentCard: React.FC<StudentCardProps> = ({ 
  student, 
  onClick,
  showDetails = false 
}) => {
  const { language, goalPoints } = useAppContext();
  
  const translations = {
    en: {
      points: 'Points',
      attendance: 'Attendance',
      books: 'Books',
      engagement: 'Engagement',
      viewDetails: 'View Details',
      progressToGoal: 'Progress to Goal',
      lastActivity: 'Last Activity',
      on: 'on',
    },
    ar: {
      points: 'النقاط',
      attendance: 'الحضور',
      books: 'الكتب',
      engagement: 'المشاركة',
      viewDetails: 'عرض التفاصيل',
      progressToGoal: 'التقدم نحو الهدف',
      lastActivity: 'آخر نشاط',
      on: 'في',
    }
  };

  const t = translations[language];
  
  // Calculate progress percentage (capped at 100%)
  const progressPercentage = Math.min(100, (student.points / goalPoints) * 100);
  
  // Get last activity from history
  const lastActivity = student.pointsHistory.length > 0 
    ? student.pointsHistory[student.pointsHistory.length - 1] 
    : null;

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card overflow-hidden"
      onClick={onClick}
    >
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-3">{student.name}</h3>
        
        <div className="mb-4">
          <div className="w-full bg-gray-100 rounded-full h-2.5 mb-1">
            <div 
              className="h-2.5 rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>{t.progressToGoal}</span>
            <span className="font-medium">{student.points} / {goalPoints}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="p-3 bg-blue-50 rounded-lg flex flex-col items-center justify-center">
            <User className="h-4 w-4 text-blue-600 mb-1" />
            <span className="text-xs text-gray-500">{t.attendance}</span>
            <span className="font-semibold">{student.attendance}</span>
          </div>
          
          <div className="p-3 bg-blue-50 rounded-lg flex flex-col items-center justify-center">
            <Book className="h-4 w-4 text-blue-600 mb-1" />
            <span className="text-xs text-gray-500">{t.books}</span>
            <span className="font-semibold">{student.booksOwned}</span>
          </div>
          
          <div className="p-3 bg-blue-50 rounded-lg flex flex-col items-center justify-center">
            <MessageSquare className="h-4 w-4 text-blue-600 mb-1" />
            <span className="text-xs text-gray-500">{t.engagement}</span>
            <span className="font-semibold">{student.engagementScore}</span>
          </div>
        </div>
        
        {lastActivity && (
          <div className="text-sm text-gray-500 mb-4">
            <span className="font-medium">{t.lastActivity}:</span>{' '}
            <span>
              {lastActivity.change > 0 ? '+' : ''}{lastActivity.change} {t.points} {t.on} {formatDateFromIso(lastActivity.date, language)}
            </span>
          </div>
        )}

        {!showDetails && (
          <button 
            onClick={onClick}
            className="w-full flex justify-center items-center px-4 py-2 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 text-sm"
          >
            {t.viewDetails}
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default StudentCard;
