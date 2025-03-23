
import React from 'react';
import { useAppContext, Student } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { formatDateFromIso } from '@/lib/studentData';
import { getLevelInfo, hasBalancedRecognition } from '@/lib/recognitionUtils';
import { 
  HandHeart, 
  Shield, 
  Users, 
  Gem, 
  Award, 
  Medal, 
  Trophy, 
  Star, 
  Calendar
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
      default:
        return 'text-gray-600 bg-gray-50';
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
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  // Get level info for each recognition type
  const helpfulnessInfo = getLevelInfo(student.helpfulness || 0);
  const respectInfo = getLevelInfo(student.respect || 0);
  const teamworkInfo = getLevelInfo(student.teamwork || 0);
  const excellenceInfo = getLevelInfo(student.excellence || 0);
  
  // Check for balanced recognition achievement
  const hasBalance = hasBalancedRecognition(student);
  
  // Filter recognitions by type for the most recent ones
  const recentRecognitions = [...(student.recognitions || [])]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
    
  // Get recognition counts by category for the chart
  const recognitionCounts = [
    { name: t.helpfulness || "Helpfulness", value: student.helpfulness || 0 },
    { name: t.respect || "Respect", value: student.respect || 0 },
    { name: t.teamwork || "Teamwork", value: student.teamwork || 0 },
    { name: t.excellence || "Excellence", value: student.excellence || 0 }
  ];
    
  return (
    <div className="mt-6 space-y-6">
      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">{t.overview || "Overview"}</TabsTrigger>
          <TabsTrigger value="history">{t.history || "History"}</TabsTrigger>
          <TabsTrigger value="achievements">{t.achievements || "Achievements"}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <h3 className="text-lg font-semibold mb-4">{t.recognitionScores || "Recognition Scores"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Helpfulness */}
            <div className="p-4 border rounded-lg hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-2">
                <HandHeart className="h-5 w-5 text-rose-500" />
                <h4 className="font-medium">{t.helpfulness || "Helpfulness"}</h4>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="ml-auto text-sm font-medium">
                        {helpfulnessInfo.levelName} (Lvl {helpfulnessInfo.level})
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        {helpfulnessInfo.nextLevelPoints > 0 ? 
                          `${helpfulnessInfo.nextLevelPoints} more to reach ${RECOGNITION_LEVELS[helpfulnessInfo.level].name}` : 
                          "Maximum level reached!"
                        }
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Progress value={helpfulnessInfo.progress} className="h-2 mb-1" />
              <p className="text-xs text-gray-500">
                {student.helpfulness || 0} {t.totalRecognitions || "total recognitions"}
              </p>
            </div>
            
            {/* Respect */}
            <div className="p-4 border rounded-lg hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-blue-500" />
                <h4 className="font-medium">{t.respect || "Respect"}</h4>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="ml-auto text-sm font-medium">
                        {respectInfo.levelName} (Lvl {respectInfo.level})
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        {respectInfo.nextLevelPoints > 0 ? 
                          `${respectInfo.nextLevelPoints} more to reach ${RECOGNITION_LEVELS[respectInfo.level].name}` : 
                          "Maximum level reached!"
                        }
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Progress value={respectInfo.progress} className="h-2 mb-1" />
              <p className="text-xs text-gray-500">
                {student.respect || 0} {t.totalRecognitions || "total recognitions"}
              </p>
            </div>
            
            {/* Teamwork */}
            <div className="p-4 border rounded-lg hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-green-500" />
                <h4 className="font-medium">{t.teamwork || "Teamwork"}</h4>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="ml-auto text-sm font-medium">
                        {teamworkInfo.levelName} (Lvl {teamworkInfo.level})
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        {teamworkInfo.nextLevelPoints > 0 ? 
                          `${teamworkInfo.nextLevelPoints} more to reach ${RECOGNITION_LEVELS[teamworkInfo.level].name}` : 
                          "Maximum level reached!"
                        }
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Progress value={teamworkInfo.progress} className="h-2 mb-1" />
              <p className="text-xs text-gray-500">
                {student.teamwork || 0} {t.totalRecognitions || "total recognitions"}
              </p>
            </div>
            
            {/* Excellence */}
            <div className="p-4 border rounded-lg hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-2">
                <Gem className="h-5 w-5 text-amber-500" />
                <h4 className="font-medium">{t.excellence || "Excellence"}</h4>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="ml-auto text-sm font-medium">
                        {excellenceInfo.levelName} (Lvl {excellenceInfo.level})
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        {excellenceInfo.nextLevelPoints > 0 ? 
                          `${excellenceInfo.nextLevelPoints} more to reach ${RECOGNITION_LEVELS[excellenceInfo.level].name}` : 
                          "Maximum level reached!"
                        }
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Progress value={excellenceInfo.progress} className="h-2 mb-1" />
              <p className="text-xs text-gray-500">
                {student.excellence || 0} {t.totalRecognitions || "total recognitions"}
              </p>
            </div>
          </div>
          
          {hasBalance && (
            <div className="mt-4 p-4 bg-purple-50 text-purple-800 rounded-lg flex items-center gap-3">
              <Medal className="h-5 w-5 text-purple-500" />
              <div>
                <h4 className="font-medium">{t.balancedAchievement || "Balanced Achievement"}</h4>
                <p className="text-sm">{t.balancedDesc || "Demonstrated excellence across all categories"}</p>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="history">
          <h3 className="text-lg font-semibold mb-4">{t.recentRecognitions || "Recent Recognitions"}</h3>
          {recentRecognitions.length > 0 ? (
            <div className="space-y-3">
              {recentRecognitions.map((recognition, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${getRecognitionColor(recognition.type)}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {getRecognitionIcon(recognition.type)}
                    <span className="font-medium">{t[recognition.type] || recognition.type}</span>
                    <span className="text-xs ml-auto flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDateFromIso(recognition.date, language)}
                    </span>
                  </div>
                  <p className="text-sm">{recognition.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {t.noRecognitionsYet || "No recognitions yet"}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="achievements">
          <h3 className="text-lg font-semibold mb-4">{t.awards || "Awards"}</h3>
          {student.awards && student.awards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {student.awards.map((award, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 px-4 py-3 bg-amber-50 text-amber-800 rounded-lg hover:shadow-md transition-all"
                >
                  <Trophy className="h-5 w-5 text-amber-500" />
                  <div>
                    <div className="font-medium">{award}</div>
                    <div className="text-xs text-amber-600">
                      {formatDateFromIso(
                        student.recognitions?.[
                          student.recognitions.findIndex(r => 
                            award.toLowerCase().includes(r.type.toLowerCase())
                          )
                        ]?.date || new Date().toISOString(), 
                        language
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {t.noAwardsYet || "No awards yet"}
            </div>
          )}
          
          <h3 className="text-lg font-semibold mt-6 mb-4">{t.specialRecognitions || "Special Recognitions"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${hasBalance ? 'bg-purple-50 text-purple-800' : 'bg-gray-50 text-gray-400'}`}>
              <Award className={`h-5 w-5 ${hasBalance ? 'text-purple-500' : 'text-gray-300'}`} />
              <div>
                <div className="font-medium">{t.balancedGrowth || "Balanced Growth"}</div>
                <div className="text-xs">
                  {hasBalance ? 
                    (t.achievedOn || "Achieved") : 
                    `${t.needsAllCategories || "Needs 5 recognitions in each category"}`
                  }
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Pull in the recognition levels
import { RECOGNITION_LEVELS } from '@/lib/recognitionUtils';

export default StudentRecognitionProfile;
