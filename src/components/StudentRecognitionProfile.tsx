
import React from 'react';
import { useAppContext, Student } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { formatDateFromIso } from '@/lib/studentData';
import { HandHeart, Shield, Users, Gem, Award } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface StudentRecognitionProfileProps {
  student: Student;
}

const StudentRecognitionProfile: React.FC<StudentRecognitionProfileProps> = ({ student }) => {
  const { language } = useAppContext();
  const t = getTranslations(language);
  
  const getRecognitionColor = (type: 'helpfulness' | 'respect' | 'teamwork' | 'excellence') => {
    switch (type) {
      case 'helpfulness':
        return 'text-rose-600 bg-rose-50';
      case 'respect':
        return 'text-blue-600 bg-blue-50';
      case 'teamwork':
        return 'text-green-600 bg-green-50';
      case 'excellence':
        return 'text-amber-600 bg-amber-50';
    }
  };
  
  const getRecognitionIcon = (type: 'helpfulness' | 'respect' | 'teamwork' | 'excellence') => {
    switch (type) {
      case 'helpfulness':
        return <HandHeart className="h-4 w-4" />;
      case 'respect':
        return <Shield className="h-4 w-4" />;
      case 'teamwork':
        return <Users className="h-4 w-4" />;
      case 'excellence':
        return <Gem className="h-4 w-4" />;
    }
  };

  // Calculate next level progress for each recognition type
  const calculateLevelProgress = (value: number) => {
    const currentLevel = Math.floor(value / 5);
    const progress = ((value % 5) / 5) * 100;
    return { currentLevel, progress };
  };
  
  const helpfulnessProgress = calculateLevelProgress(student.helpfulness);
  const respectProgress = calculateLevelProgress(student.respect);
  const teamworkProgress = calculateLevelProgress(student.teamwork);
  const excellenceProgress = calculateLevelProgress(student.excellence);
  
  // Filter recognitions by type for the most recent ones
  const recentRecognitions = [...student.recognitions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
    
  return (
    <div className="mt-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">{t.recognitionScores}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Helpfulness */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <HandHeart className="h-5 w-5 text-rose-500" />
              <h4 className="font-medium">{t.helpfulness}</h4>
              <span className="ml-auto text-sm font-medium">Lvl {helpfulnessProgress.currentLevel}</span>
            </div>
            <Progress value={helpfulnessProgress.progress} className="h-2 mb-1" />
            <p className="text-xs text-gray-500">
              {student.helpfulness} {t.totalRecognitions}
            </p>
          </div>
          
          {/* Respect */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-blue-500" />
              <h4 className="font-medium">{t.respect}</h4>
              <span className="ml-auto text-sm font-medium">Lvl {respectProgress.currentLevel}</span>
            </div>
            <Progress value={respectProgress.progress} className="h-2 mb-1" />
            <p className="text-xs text-gray-500">
              {student.respect} {t.totalRecognitions}
            </p>
          </div>
          
          {/* Teamwork */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-green-500" />
              <h4 className="font-medium">{t.teamwork}</h4>
              <span className="ml-auto text-sm font-medium">Lvl {teamworkProgress.currentLevel}</span>
            </div>
            <Progress value={teamworkProgress.progress} className="h-2 mb-1" />
            <p className="text-xs text-gray-500">
              {student.teamwork} {t.totalRecognitions}
            </p>
          </div>
          
          {/* Excellence */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Gem className="h-5 w-5 text-amber-500" />
              <h4 className="font-medium">{t.excellence}</h4>
              <span className="ml-auto text-sm font-medium">Lvl {excellenceProgress.currentLevel}</span>
            </div>
            <Progress value={excellenceProgress.progress} className="h-2 mb-1" />
            <p className="text-xs text-gray-500">
              {student.excellence} {t.totalRecognitions}
            </p>
          </div>
        </div>
      </div>
      
      {student.awards.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">{t.awards}</h3>
          <div className="flex flex-wrap gap-2">
            {student.awards.map((award, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-2 bg-amber-50 text-amber-800 rounded-lg"
              >
                <Award className="h-4 w-4 text-amber-500" />
                <span>{award}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {recentRecognitions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">{t.recentRecognitions}</h3>
          <div className="space-y-3">
            {recentRecognitions.map((recognition, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${getRecognitionColor(recognition.type)}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {getRecognitionIcon(recognition.type)}
                  <span className="font-medium">{t[recognition.type]}</span>
                  <span className="text-xs ml-auto">
                    {formatDateFromIso(recognition.date, language)}
                  </span>
                </div>
                <p className="text-sm">{recognition.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentRecognitionProfile;
