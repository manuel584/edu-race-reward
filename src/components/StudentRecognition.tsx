
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppContext, Student } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { useAuth } from '@/hooks/useAuth';
import StudentNominationForm from '@/components/StudentNominationForm';
import { 
  getLevelInfo, 
  getCategoryVisuals,
  getTopPerformers,
  RECOGNITION_SUBCATEGORIES 
} from '@/lib/recognitionUtils';
import { 
  BadgeCheck, 
  HandHeart, 
  Shield, 
  Users, 
  Gem, 
  Heart, 
  Star,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { TooltipProvider, TooltipContent, Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartTooltip } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

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
  const { level, levelName, progress, nextLevelPoints, levelColor } = getLevelInfo(recognitionCount);
  
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
              <div 
                className="flex items-center px-2 py-0.5 rounded text-xs" 
                style={{ backgroundColor: `${levelColor}80`, color: '#333' }}
              >
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
          className="h-full rounded-full" 
          style={{ width: `${progress}%`, backgroundColor: levelColor }}
        ></div>
      </div>
    </motion.div>
  );
};

// Chart component to visualize category distribution
const RecognitionDistributionChart = ({ students }: { students: Student[] }) => {
  const totalsByCategory = students.reduce((acc, student) => {
    acc.helpfulness += student.helpfulness || 0;
    acc.respect += student.respect || 0;
    acc.teamwork += student.teamwork || 0;
    acc.excellence += student.excellence || 0;
    return acc;
  }, { helpfulness: 0, respect: 0, teamwork: 0, excellence: 0 });
  
  const data = [
    { name: 'Helpfulness', value: totalsByCategory.helpfulness, color: '#FD4F79' },
    { name: 'Respect', value: totalsByCategory.respect, color: '#3B81F6' },
    { name: 'Teamwork', value: totalsByCategory.teamwork, color: '#22C55E' },
    { name: 'Excellence', value: totalsByCategory.excellence, color: '#F59E0B' },
  ];
  
  const chartConfig = {
    helpfulness: { color: '#FD4F79' },
    respect: { color: '#3B81F6' },
    teamwork: { color: '#22C55E' },
    excellence: { color: '#F59E0B' },
  };
  
  return (
    <div className="h-64 w-full mt-4">
      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" fontSize={12} />
            <YAxis fontSize={12} />
            <ChartTooltip
              content={
                <ChartTooltipContent formatter={(value) => [`${value} recognitions`, ""]} />
              }
            />
            <Bar dataKey="value" nameKey="name" fill="#8884d8" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Bar key={`cell-${index}`} dataKey="value" fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

// Component for grade-specific recognition metrics
const GradeRecognitionMetrics = ({ 
  grade, 
  students 
}: { 
  grade: string, 
  students: Student[] 
}) => {
  const { language } = useAppContext();
  const t = getTranslations(language);
  
  // Filter students by grade
  const gradeStudents = students.filter(s => s.grade === grade);
  
  // Skip if no students in this grade
  if (gradeStudents.length === 0) return null;
  
  // Get top performers for each category
  const topHelpfulness = getTopPerformers(gradeStudents, 'helpfulness', 2);
  const topRespect = getTopPerformers(gradeStudents, 'respect', 2);
  const topTeamwork = getTopPerformers(gradeStudents, 'teamwork', 2);
  const topExcellence = getTopPerformers(gradeStudents, 'excellence', 2);
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Award className="h-5 w-5 mr-2 text-violet-500" />
          {grade} {t.recognition || "Recognition"}
        </CardTitle>
        <CardDescription>
          {t.topPerformers || "Top performers"} ({gradeStudents.length} {t.students || "students"})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium flex items-center mb-2">
              <HandHeart className="h-4 w-4 mr-1 text-rose-500" /> 
              {t.helpfulness || "Helpfulness"}
            </h4>
            <div className="space-y-2">
              {topHelpfulness.map((student, i) => (
                <div key={student.id} className="flex items-center justify-between text-sm p-2 bg-rose-50 rounded">
                  <span>{i + 1}. {student.name}</span>
                  <span className="font-medium">{t.level || "Level"} {student.levelInfo.level}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium flex items-center mb-2">
              <Shield className="h-4 w-4 mr-1 text-blue-500" /> 
              {t.respect || "Respect"}
            </h4>
            <div className="space-y-2">
              {topRespect.map((student, i) => (
                <div key={student.id} className="flex items-center justify-between text-sm p-2 bg-blue-50 rounded">
                  <span>{i + 1}. {student.name}</span>
                  <span className="font-medium">{t.level || "Level"} {student.levelInfo.level}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium flex items-center mb-2">
              <Users className="h-4 w-4 mr-1 text-green-500" /> 
              {t.teamwork || "Teamwork"}
            </h4>
            <div className="space-y-2">
              {topTeamwork.map((student, i) => (
                <div key={student.id} className="flex items-center justify-between text-sm p-2 bg-green-50 rounded">
                  <span>{i + 1}. {student.name}</span>
                  <span className="font-medium">{t.level || "Level"} {student.levelInfo.level}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium flex items-center mb-2">
              <Gem className="h-4 w-4 mr-1 text-amber-500" /> 
              {t.excellence || "Excellence"}
            </h4>
            <div className="space-y-2">
              {topExcellence.map((student, i) => (
                <div key={student.id} className="flex items-center justify-between text-sm p-2 bg-amber-50 rounded">
                  <span>{i + 1}. {student.name}</span>
                  <span className="font-medium">{t.level || "Level"} {student.levelInfo.level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const StudentRecognition = () => {
  const { students, language } = useAppContext();
  const navigate = useNavigate();
  const t = getTranslations(language);
  
  const [isNominateOpen, setIsNominateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Get top students for each category
  const topHelpfulStudents = [...students].sort((a, b) => (b.helpfulness || 0) - (a.helpfulness || 0)).slice(0, 2);
  const topRespectfulStudents = [...students].sort((a, b) => (b.respect || 0) - (a.respect || 0)).slice(0, 2);
  const topTeamworkStudents = [...students].sort((a, b) => (b.teamwork || 0) - (a.teamwork || 0)).slice(0, 2);
  const topExcellenceStudents = [...students].sort((a, b) => (b.excellence || 0) - (a.excellence || 0)).slice(0, 2);
  
  // Get unique grades for grade-specific displays
  const uniqueGrades = [...new Set(students.map(s => s.grade))].sort();
  
  const handleStudentClick = (student: Student, type: 'helpfulness' | 'respect' | 'teamwork' | 'excellence') => {
    navigate(`/student/${student.id}`);
  };
  
  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Award className="h-5 w-5 mr-2 text-purple-500" />
          {t.studentRecognitions || "Student Recognitions"}
        </h2>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">
              {t.overview || "Overview"}
            </TabsTrigger>
            <TabsTrigger value="byGrade">
              {t.byGrade || "By Grade"}
            </TabsTrigger>
            <TabsTrigger value="categories">
              {t.categories || "Categories"}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
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
            
            {students.length > 0 && (
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1 text-purple-500" />
                  {t.recognitionDistribution || "Recognition Distribution"}
                </h3>
                <RecognitionDistributionChart students={students} />
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="byGrade">
            <div className="space-y-6">
              {uniqueGrades.length > 0 ? (
                uniqueGrades.map(grade => (
                  <GradeRecognitionMetrics 
                    key={grade} 
                    grade={grade} 
                    students={students} 
                  />
                ))
              ) : (
                <div className="text-center p-6 text-gray-500">
                  {t.noGradesFound || "No grades found"}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="categories">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HandHeart className="h-5 w-5 mr-2 text-rose-500" />
                    {t.helpfulness || "Helpfulness"}
                  </CardTitle>
                  <CardDescription>
                    {t.helpfulnessDescription || "Recognition for helpful behaviors and support to others"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {RECOGNITION_SUBCATEGORIES.helpfulness.map(subcategory => (
                      <div key={subcategory.id} className="bg-rose-50 border border-rose-100 p-3 rounded-lg">
                        <h4 className="text-sm font-medium mb-1">{subcategory.name}</h4>
                        <p className="text-xs text-gray-600">
                          {t[`${subcategory.id}Description`] || `Recognition for ${subcategory.name.toLowerCase()}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-blue-500" />
                    {t.respect || "Respect"}
                  </CardTitle>
                  <CardDescription>
                    {t.respectDescription || "Recognition for respectful behaviors and interactions"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {RECOGNITION_SUBCATEGORIES.respect.map(subcategory => (
                      <div key={subcategory.id} className="bg-blue-50 border border-blue-100 p-3 rounded-lg">
                        <h4 className="text-sm font-medium mb-1">{subcategory.name}</h4>
                        <p className="text-xs text-gray-600">
                          {t[`${subcategory.id}Description`] || `Recognition for ${subcategory.name.toLowerCase()}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-green-500" />
                    {t.teamwork || "Teamwork"}
                  </CardTitle>
                  <CardDescription>
                    {t.teamworkDescription || "Recognition for effective collaboration and teamwork"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {RECOGNITION_SUBCATEGORIES.teamwork.map(subcategory => (
                      <div key={subcategory.id} className="bg-green-50 border border-green-100 p-3 rounded-lg">
                        <h4 className="text-sm font-medium mb-1">{subcategory.name}</h4>
                        <p className="text-xs text-gray-600">
                          {t[`${subcategory.id}Description`] || `Recognition for ${subcategory.name.toLowerCase()}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Gem className="h-5 w-5 mr-2 text-amber-500" />
                    {t.excellence || "Excellence"}
                  </CardTitle>
                  <CardDescription>
                    {t.excellenceDescription || "Recognition for outstanding achievements and excellence"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {RECOGNITION_SUBCATEGORIES.excellence.map(subcategory => (
                      <div key={subcategory.id} className="bg-amber-50 border border-amber-100 p-3 rounded-lg">
                        <h4 className="text-sm font-medium mb-1">{subcategory.name}</h4>
                        <p className="text-xs text-gray-600">
                          {t[`${subcategory.id}Description`] || `Recognition for ${subcategory.name.toLowerCase()}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-center mt-6">
          <Button onClick={() => setIsNominateOpen(true)} className="gap-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700">
            <Heart className="h-4 w-4 text-white" />
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
