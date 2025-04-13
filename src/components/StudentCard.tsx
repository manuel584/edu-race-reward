
import React from 'react';
import { cn } from '@/lib/utils';
import { Student } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { useAppContext } from '@/context/AppContext';
import { motion } from 'framer-motion';
import { Trophy, Star, GraduationCap, Flag, Layers } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface StudentCardProps {
  student: Student;
  onClick?: () => void;
  selected?: boolean;
  selectMode?: boolean;
  viewType?: 'grid' | 'list';
}

const StudentCard: React.FC<StudentCardProps> = ({ 
  student, 
  onClick,
  selected = false,
  selectMode = false,
  viewType = 'grid'
}) => {
  const { language, goalPoints, theme } = useAppContext();
  const t = getTranslations(language);
  
  // Calculate progress percentage
  const progressPercentage = Math.min(100, (student.points / goalPoints) * 100);
  
  if (viewType === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={cn(
          "border bg-white dark:bg-gray-800 dark:border-gray-700 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md",
          selectMode && "cursor-pointer",
          selected && "ring-2 ring-blue-500 border-blue-500"
        )}
        onClick={onClick}
      >
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <h3 className="font-medium text-lg dark:text-white">{student.name}</h3>
            {student.points >= goalPoints && (
              <Trophy className="h-5 w-5 text-amber-500 ml-2" />
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-300 gap-2">
              <GraduationCap className="h-4 w-4" />
              <span>{student.grade}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-300 gap-2">
              <Flag className="h-4 w-4" />
              <span>{student.nationality === 'international' ? t.international : t.national}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-300">
                {t.points || "Points"}:
              </span>
              <span className="font-medium dark:text-white">
                {student.points}/{goalPoints}
              </span>
            </div>
            
            {student.awards && student.awards.length > 0 && (
              <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <Star className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {student.awards.length} {student.awards.length === 1 ? t.awards : t.awards}
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "border bg-white dark:bg-gray-800 dark:border-gray-700 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md",
        selectMode && "cursor-pointer",
        selected && "ring-2 ring-blue-500 border-blue-500"
      )}
      onClick={onClick}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-lg dark:text-white">{student.name}</h3>
          {student.points >= goalPoints && (
            <Trophy className="h-5 w-5 text-amber-500" />
          )}
        </div>
        
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-300 mb-4 gap-2">
          <GraduationCap className="h-4 w-4" />
          <span>{student.grade}</span>
          <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-1"></span>
          <Flag className="h-4 w-4" />
          <span>{student.nationality === 'international' ? t.international : t.national}</span>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500 dark:text-gray-300">
              {t.points || "Points"}
            </span>
            <span className="font-medium dark:text-white">
              {student.points}/{goalPoints}
            </span>
          </div>
          <Progress value={progressPercentage} className="dark:bg-gray-700" />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {student.subjects && student.subjects.map((subject, index) => (
            <div 
              key={index}
              className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded-md"
            >
              {subject}
            </div>
          ))}
        </div>
      </div>
      
      {student.awards && student.awards.length > 0 && (
        <div className="px-5 py-3 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-t dark:border-gray-700 flex items-center gap-2">
          <Star className="h-4 w-4 text-amber-500" />
          <span className="text-sm font-medium text-amber-800 dark:text-amber-300">
            {student.awards.length} {student.awards.length === 1 ? t.awards : t.awards}
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default StudentCard;
