
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { Award, Trophy, TrendingUp, Users, Star, BookOpen, Brain } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import AnimatedNumber from '@/components/AnimatedNumber';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const ClassRecognition = () => {
  const { students, getClassMetrics, goalPoints, language } = useAppContext();
  const t = getTranslations(language);
  const [comparisonMetric, setComparisonMetric] = useState<'points' | 'attendance' | 'engagement' | 'improvement'>('points');
  
  // Get class metrics
  const classMetrics = getClassMetrics();
  
  // Sort classes by the selected metric
  const sortedClasses = [...classMetrics].sort((a, b) => {
    switch(comparisonMetric) {
      case 'attendance': 
        return b.averageAttendance - a.averageAttendance;
      case 'engagement': 
        return b.averageEngagement - a.averageEngagement;
      case 'improvement': 
        return b.weeklyImprovement - a.weeklyImprovement;
      case 'points':
      default: 
        return b.totalPoints - a.totalPoints;
    }
  });
  
  // Calculate subject-specific performance for each class
  const getSubjectPerformance = () => {
    const subjectData: { [className: string]: { [subject: string]: number } } = {};
    
    // Initialize with class names
    classMetrics.forEach(classData => {
      subjectData[classData.name] = {};
    });
    
    // Group students by class and calculate average performance by subject
    students.forEach(student => {
      // Add a null check to prevent trying to access properties of undefined
      if (!subjectData[student.grade]) {
        return;
      }
      
      // Make sure student.subjects exists and is an array before calling forEach
      if (student.subjects && Array.isArray(student.subjects)) {
        student.subjects.forEach(subject => {
          if (!subjectData[student.grade][subject]) {
            subjectData[student.grade][subject] = 0;
          }
          // Simple approximation of subject performance based on overall points
          // In a real app, you would have subject-specific scores
          subjectData[student.grade][subject] += student.points / student.subjects.length;
        });
      }
    });
    
    // Average the scores and format for the chart
    const allSubjects = new Set<string>();
    Object.values(subjectData).forEach(classSubjects => {
      Object.keys(classSubjects).forEach(subject => allSubjects.add(subject));
    });
    
    const result: { name: string; [subject: string]: number }[] = [];
    
    Object.entries(subjectData).forEach(([className, subjects]) => {
      const classData: { name: string; [subject: string]: number } = { name: className };
      const studentsInClass = students.filter(s => s.grade === className).length;
      
      if (studentsInClass === 0) return;
      
      allSubjects.forEach(subject => {
        classData[subject] = subjects[subject] ? Math.round(subjects[subject] / studentsInClass) : 0;
      });
      
      result.push(classData);
    });
    
    return { chartData: result, subjects: Array.from(allSubjects) };
  };
  
  // Get unique strengths for each class
  const getClassStrengths = (classData: typeof classMetrics[0]) => {
    const strengths: string[] = [];
    
    if (classData.averageAttendance >= 8.5) {
      strengths.push(t.highAttendance);
    }
    
    if (classData.averageEngagement >= 8) {
      strengths.push(t.highEngagement);
    }
    
    if (classData.weeklyImprovement >= 7) {
      strengths.push(t.fastImprovement);
    }
    
    // Add subject-specific strengths
    const { chartData } = getSubjectPerformance();
    const subjectPerf = chartData.find(c => c.name === classData.name);
    if (subjectPerf) {
      const bestSubject = Object.entries(subjectPerf)
        .filter(([key]) => key !== 'name')
        .sort(([, a], [, b]) => Number(b) - Number(a))[0];
      
      if (bestSubject && bestSubject[1] > 50) {
        strengths.push(`${t.strongIn} ${bestSubject[0]}`);
      }
    }
    
    // Add recognition-based strengths from awards
    if (classData.achievements.length > 0) {
      strengths.push(t.recognitionLeader);
    }
    
    return strengths.length > 0 ? strengths : [t.developingStrengths];
  };
  
  // Get the subject performance data and subjects list safely
  const subjectPerformanceData = getSubjectPerformance();
  const chartData = subjectPerformanceData.chartData || [];
  const subjects = subjectPerformanceData.subjects || [];
  
  const COLORS = ['#9b87f5', '#0EA5E9', '#F97316', '#8B5CF6', '#33C3F0']; // Purple, Blue, Orange, etc.
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-5 w-5 text-amber-500" />
        <h2 className="text-xl font-semibold">{t.classComparison}</h2>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">
            <Trophy className="mr-2 h-4 w-4" />
            {t.overview}
          </TabsTrigger>
          <TabsTrigger value="subjects">
            <BookOpen className="mr-2 h-4 w-4" />
            {t.subjectComparison}
          </TabsTrigger>
          <TabsTrigger value="strengths">
            <Star className="mr-2 h-4 w-4" />
            {t.classStrengths}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="flex flex-wrap gap-4 mb-6 justify-center md:justify-start">
            <button 
              onClick={() => setComparisonMetric('points')}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${comparisonMetric === 'points' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {t.totalPoints}
            </button>
            <button 
              onClick={() => setComparisonMetric('attendance')}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${comparisonMetric === 'attendance' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {t.attendance}
            </button>
            <button 
              onClick={() => setComparisonMetric('engagement')}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${comparisonMetric === 'engagement' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {t.engagement}
            </button>
            <button 
              onClick={() => setComparisonMetric('improvement')}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${comparisonMetric === 'improvement' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {t.improvement}
            </button>
          </div>
          
          <div className="space-y-6">
            {sortedClasses.length > 0 ? (
              sortedClasses.map((classData, index) => {
                let progressPercentage, metricValue, metricUnit;
                
                switch(comparisonMetric) {
                  case 'attendance':
                    progressPercentage = (classData.averageAttendance / 10) * 100;
                    metricValue = Math.round(classData.averageAttendance * 10) / 10;
                    metricUnit = '/10';
                    break;
                  case 'engagement':
                    progressPercentage = (classData.averageEngagement / 10) * 100;
                    metricValue = Math.round(classData.averageEngagement * 10) / 10;
                    metricUnit = '/10';
                    break;
                  case 'improvement':
                    progressPercentage = Math.min(100, classData.weeklyImprovement * 10);
                    metricValue = Math.round(classData.weeklyImprovement);
                    metricUnit = '%';
                    break;
                  case 'points':
                  default:
                    progressPercentage = Math.min(100, (classData.totalPoints / (goalPoints * 5)) * 100);
                    metricValue = classData.totalPoints;
                    metricUnit = '';
                    break;
                }
                
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
                      <span className="text-gray-500">
                        {comparisonMetric === 'points' ? t.totalPoints :
                         comparisonMetric === 'attendance' ? t.attendance :
                         comparisonMetric === 'engagement' ? t.engagement :
                         t.improvement}
                      </span>
                      <span className="font-semibold">
                        <AnimatedNumber value={metricValue} className="text-blue-600" />
                        {metricUnit}
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
        </TabsContent>
        
        <TabsContent value="subjects" className="space-y-6">
          <div className="bg-white p-4 rounded-lg border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">{t.subjectComparison}</h3>
            
            {chartData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {subjects.map((subject, index) => (
                      <Bar 
                        key={subject} 
                        dataKey={subject} 
                        fill={COLORS[index % COLORS.length]} 
                        name={subject}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                {t.noSubjectData}
              </div>
            )}
            
            <div className="mt-4 text-sm text-gray-500">
              <p>{t.subjectDescription}</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="strengths" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedClasses.map((classData) => {
              const strengths = getClassStrengths(classData);
              return (
                <div key={classData.id} className="bg-white p-4 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="h-5 w-5 text-amber-500" />
                    <h3 className="font-semibold">{classData.name} {t.strengths}</h3>
                  </div>
                  
                  <ul className="space-y-2">
                    {strengths.map((strength, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-amber-400 rounded-full"></div>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                      {t.classUniqueMessage}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClassRecognition;
