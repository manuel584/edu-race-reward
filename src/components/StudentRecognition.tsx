
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppContext, Student } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { useAuth } from '@/hooks/useAuth';
import StudentNominationForm from '@/components/StudentNominationForm';
import { getLevelInfo } from '@/lib/recognitionUtils';
import { 
  BadgeCheck, 
  HandHeart, 
  Shield, 
  Users, 
  Gem, 
  Heart, 
  Star
} from 'lucide-react';
import { TooltipProvider, TooltipContent, Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface RecognitionCardProps {
  student: Student;
  type: 'helpfulness' | 'respect' | 'teamwork' | 'excellence';
  onClick: () => void;
}

const RecognitionCard: React.FC<RecognitionCardProps> = ({ student, type, onClick }) => {
  const { language } = useAppContext();
  const t = getTranslations(language);
  
  const getTypeIcon = () => {
    switch (type) {
      case 'helpfulness':
        return <HandHeart className="h-4 w-4 text-rose-500" />;
      case 'respect':
        return <Shield className="h-4 w-4 text-blue-500" />;
      case 'teamwork':
        return <Users className="h-4 w-4 text-green-500" />;
      case 'excellence':
        return <Gem className="h-4 w-4 text-amber-500" />;
      default:
        return <Star className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getTypeLabel = () => {
    const labels: Record<string, string> = {
      helpfulness: t.helpfulness || "Helpfulness",
      respect: t.respect || "Respect",
      teamwork: t.teamwork || "Teamwork",
      excellence: t.excellence || "Excellence"
    };
    return labels[type];
  };
  
  const getTypeColor = () => {
    switch (type) {
      case 'helpfulness':
        return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'respect':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'teamwork':
        return 'bg-green-50 text-green-600 border-green-100';
      case 'excellence':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };
  
  // Get amount of recognitions of this type (with fallback to 0)
  const recognitionCount = student[type] || 0;
  
  // Get level info from our utility function
  const { level, levelName, progress, nextLevelPoints } = getLevelInfo(recognitionCount);
  
  return (
    <motion.div
      className={`p-3 rounded-lg border ${getTypeColor()} cursor-pointer hover:shadow-md transition-all`}
      whileHover={{ y: -3 }}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-1">
          {getTypeIcon()}
          <span className="font-medium text-sm">{getTypeLabel()}</span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center px-2 py-0.5 bg-white bg-opacity-50 rounded text-xs">
                <BadgeCheck className="h-3 w-3 mr-1" />
                <span>Level {level}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{levelName}</p>
              <p className="text-xs">{nextLevelPoints > 0 ? `${nextLevelPoints} more to next level` : "Max level reached"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="text-xs mb-1">
        {recognitionCount} {t.recognition || "Recognitions"}
      </div>
      
      <div className="w-full bg-white bg-opacity-50 h-1.5 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full bg-current"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </motion.div>
  );
};

const StudentRecognition = () => {
  const { students, language } = useAppContext();
  const navigate = useNavigate();
  const t = getTranslations(language);
  
  const [isNominateOpen, setIsNominateOpen] = useState(false);
  
  // Get top students for each category
  const topHelpfulStudents = [...students].sort((a, b) => (b.helpfulness || 0) - (a.helpfulness || 0)).slice(0, 2);
  const topRespectfulStudents = [...students].sort((a, b) => (b.respect || 0) - (a.respect || 0)).slice(0, 2);
  const topTeamworkStudents = [...students].sort((a, b) => (b.teamwork || 0) - (a.teamwork || 0)).slice(0, 2);
  const topExcellenceStudents = [...students].sort((a, b) => (b.excellence || 0) - (a.excellence || 0)).slice(0, 2);
  
  const handleStudentClick = (student: Student, type: 'helpfulness' | 'respect' | 'teamwork' | 'excellence') => {
    navigate(`/student/${student.id}`);
  };
  
  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold mb-4">{t.studentRecognitions || "Student Recognitions"}</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Helpfulness Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <HandHeart className="h-5 w-5 text-rose-500" />
              <h3 className="font-medium">{t.helpfulness || "Helpfulness"}</h3>
            </div>
            
            <div className="space-y-3">
              {topHelpfulStudents.length > 0 ? (
                topHelpfulStudents.map(student => (
                  <RecognitionCard 
                    key={student.id} 
                    student={student} 
                    type="helpfulness" 
                    onClick={() => handleStudentClick(student, 'helpfulness')}
                  />
                ))
              ) : (
                <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded">
                  {t.noRecognitionsYet || "No recognitions yet"}
                </div>
              )}
            </div>
          </div>
          
          {/* Respect Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-5 w-5 text-blue-500" />
              <h3 className="font-medium">{t.respect || "Respect"}</h3>
            </div>
            
            <div className="space-y-3">
              {topRespectfulStudents.length > 0 ? (
                topRespectfulStudents.map(student => (
                  <RecognitionCard 
                    key={student.id} 
                    student={student} 
                    type="respect" 
                    onClick={() => handleStudentClick(student, 'respect')}
                  />
                ))
              ) : (
                <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded">
                  {t.noRecognitionsYet || "No recognitions yet"}
                </div>
              )}
            </div>
          </div>
          
          {/* Teamwork Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-5 w-5 text-green-500" />
              <h3 className="font-medium">{t.teamwork || "Teamwork"}</h3>
            </div>
            
            <div className="space-y-3">
              {topTeamworkStudents.length > 0 ? (
                topTeamworkStudents.map(student => (
                  <RecognitionCard 
                    key={student.id} 
                    student={student} 
                    type="teamwork" 
                    onClick={() => handleStudentClick(student, 'teamwork')}
                  />
                ))
              ) : (
                <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded">
                  {t.noRecognitionsYet || "No recognitions yet"}
                </div>
              )}
            </div>
          </div>
          
          {/* Excellence Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Gem className="h-5 w-5 text-amber-500" />
              <h3 className="font-medium">{t.excellence || "Excellence"}</h3>
            </div>
            
            <div className="space-y-3">
              {topExcellenceStudents.length > 0 ? (
                topExcellenceStudents.map(student => (
                  <RecognitionCard 
                    key={student.id} 
                    student={student} 
                    type="excellence" 
                    onClick={() => handleStudentClick(student, 'excellence')}
                  />
                ))
              ) : (
                <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded">
                  {t.noRecognitionsYet || "No recognitions yet"}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-6">
          <Button variant="outline" onClick={() => setIsNominateOpen(true)} className="gap-2">
            <Heart className="h-4 w-4 text-rose-500" />
            {t.nominateStudent || "Nominate Student"}
          </Button>
        </div>
      </div>
      
      <StudentNominationForm 
        open={isNominateOpen} 
        onOpenChange={setIsNominateOpen}
      />
    </>
  );
};

export default StudentRecognition;
