
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Student } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';

interface StudentStickyHeaderProps {
  student: Student;
  language: 'en' | 'ar';
  goalPoints: number;
}

const StudentStickyHeader: React.FC<StudentStickyHeaderProps> = ({ 
  student, 
  language,
  goalPoints 
}) => {
  const navigate = useNavigate();
  const t = getTranslations(language);
  
  // Calculate progress percentage
  const progressPercentage = Math.min(100, (student.points / goalPoints) * 100);
  
  return (
    <div className="sticky top-0 z-10 w-full bg-white border-b border-gray-200 transition-all duration-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <div>
              <h3 className="font-medium truncate max-w-[200px] sm:max-w-xs">{student.name}</h3>
              <div className="text-xs text-gray-500 flex items-center">
                <span>{student.grade}</span>
                <span className="mx-1">•</span>
                <span>{student.points} {t.points}</span>
              </div>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-2">
            {progressPercentage >= 100 ? (
              <div className="flex items-center text-sm text-green-600 font-medium">
                <Trophy className="h-4 w-4 mr-1" />
                <span>{t.goalReached || "Goal Reached!"}</span>
              </div>
            ) : (
              <div className="flex items-center text-sm text-gray-500">
                <Award className="h-4 w-4 mr-1" />
                <span>{Math.round(progressPercentage)}% {t.toGoal || "to Goal"}</span>
              </div>
            )}
            
            <div className="w-36 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentStickyHeader;
