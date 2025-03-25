
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { 
  getStudentsByGrade, 
  getGradeRecognitionMetrics, 
  getTopPerformers,
  getCategoryVisuals,
  RECOGNITION_SUBCATEGORIES
} from '@/lib/recognitionUtils';
import { 
  HandHeart, 
  Shield, 
  Users, 
  Gem, 
  GraduationCap, 
  Medal, 
  BarChart3,
  Home,
  ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import CustomBreadcrumb from '@/components/CustomBreadcrumb';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  Cell 
} from 'recharts';

const GradeRecognition = () => {
  const { grade } = useParams<{ grade: string }>();
  const navigate = useNavigate();
  const { students, language } = useAppContext();
  const t = getTranslations(language);
  
  const [activeCategory, setActiveCategory] = useState<'helpfulness' | 'respect' | 'teamwork' | 'excellence'>('helpfulness');
  
  // If grade is not provided, redirect to students page
  if (!grade) {
    navigate('/students');
    return null;
  }
  
  // Get students in this grade
  const gradeStudents = getStudentsByGrade(students, grade);
  
  // Get metrics for this grade
  const metrics = getGradeRecognitionMetrics(gradeStudents);
  
  // Get top performers for each category
  const helpfulnessTopPerformers = getTopPerformers(gradeStudents, 'helpfulness');
  const respectTopPerformers = getTopPerformers(gradeStudents, 'respect');
  const teamworkTopPerformers = getTopPerformers(gradeStudents, 'teamwork');
  const excellenceTopPerformers = getTopPerformers(gradeStudents, 'excellence');
  
  // Calculate total students
  const totalStudents = gradeStudents.length;
  
  // Prepare data for category distribution chart
  const categoryData = [
    { 
      name: 'Helpfulness', 
      value: metrics.helpfulness.average, 
      fill: getCategoryVisuals('helpfulness').colorClass.split(' ')[0].replace('text-', 'bg-')
    },
    { 
      name: 'Respect', 
      value: metrics.respect.average, 
      fill: getCategoryVisuals('respect').colorClass.split(' ')[0].replace('text-', 'bg-')
    },
    { 
      name: 'Teamwork', 
      value: metrics.teamwork.average, 
      fill: getCategoryVisuals('teamwork').colorClass.split(' ')[0].replace('text-', 'bg-')
    },
    { 
      name: 'Excellence', 
      value: metrics.excellence.average, 
      fill: getCategoryVisuals('excellence').colorClass.split(' ')[0].replace('text-', 'bg-')
    }
  ];
  
  // Prepare subcategory data
  const getSubcategoryData = (category: 'helpfulness' | 'respect' | 'teamwork' | 'excellence') => {
    // In a real app, this would come from actual subcategory data
    // Here we'll generate some sample data based on the main category average
    const baseValue = metrics[category].average;
    return RECOGNITION_SUBCATEGORIES[category].map(subcategory => ({
      name: subcategory.name,
      value: baseValue * (0.8 + Math.random() * 0.4), // Slight random variation around the main category average
    }));
  };
  
  // Create breadcrumb items
  const breadcrumbItems = [
    {
      label: t.home,
      icon: <Home className="h-4 w-4" />,
      href: "/"
    },
    {
      label: t.students,
      icon: <Users className="h-4 w-4" />,
      href: "/students"
    },
    {
      label: `${t.grade} ${grade}`,
      icon: <GraduationCap className="h-4 w-4" />,
      current: true
    }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="page-container">
        <CustomBreadcrumb items={breadcrumbItems} className="mb-6" />
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate('/students')}
              className="shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-display font-semibold flex items-center">
              <GraduationCap className="mr-2 h-8 w-8 text-blue-600" />
              {`${t.grade} ${grade} ${t.recognition}`}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3">
              <Users className="h-4 w-4 mr-1" />
              {totalStudents} {t.students}
            </Badge>
            <Button 
              variant="outline" 
              onClick={() => navigate(`/students?grade=${grade}`)}
              className="flex items-center"
            >
              <Users className="h-4 w-4 mr-2" />
              {t.viewStudents}
            </Button>
          </div>
        </div>
        
        {/* Grade Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {t.gradeOverview}
            </CardTitle>
            <CardDescription>
              {t.overviewOfAllRecognitionCategories}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Helpfulness Overview */}
              <div className="flex flex-col p-4 rounded-lg border bg-rose-50 border-rose-200">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <HandHeart className="text-rose-600 h-5 w-5 mr-2" />
                    <h3 className="font-medium">{t.helpfulness}</h3>
                  </div>
                  <span className="text-2xl font-bold text-rose-600">
                    {metrics.helpfulness.averageLevel}
                  </span>
                </div>
                <Progress value={metrics.helpfulness.average * 2} className="h-2 mb-2" />
                <p className="text-sm text-gray-600">
                  {t.averageScore}: {metrics.helpfulness.average.toFixed(1)}
                </p>
              </div>
              
              {/* Respect Overview */}
              <div className="flex flex-col p-4 rounded-lg border bg-blue-50 border-blue-200">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <Shield className="text-blue-600 h-5 w-5 mr-2" />
                    <h3 className="font-medium">{t.respect}</h3>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">
                    {metrics.respect.averageLevel}
                  </span>
                </div>
                <Progress value={metrics.respect.average * 2} className="h-2 mb-2" />
                <p className="text-sm text-gray-600">
                  {t.averageScore}: {metrics.respect.average.toFixed(1)}
                </p>
              </div>
              
              {/* Teamwork Overview */}
              <div className="flex flex-col p-4 rounded-lg border bg-green-50 border-green-200">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <Users className="text-green-600 h-5 w-5 mr-2" />
                    <h3 className="font-medium">{t.teamwork}</h3>
                  </div>
                  <span className="text-2xl font-bold text-green-600">
                    {metrics.teamwork.averageLevel}
                  </span>
                </div>
                <Progress value={metrics.teamwork.average * 2} className="h-2 mb-2" />
                <p className="text-sm text-gray-600">
                  {t.averageScore}: {metrics.teamwork.average.toFixed(1)}
                </p>
              </div>
              
              {/* Excellence Overview */}
              <div className="flex flex-col p-4 rounded-lg border bg-amber-50 border-amber-200">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <Gem className="text-amber-600 h-5 w-5 mr-2" />
                    <h3 className="font-medium">{t.excellence}</h3>
                  </div>
                  <span className="text-2xl font-bold text-amber-600">
                    {metrics.excellence.averageLevel}
                  </span>
                </div>
                <Progress value={metrics.excellence.average * 2} className="h-2 mb-2" />
                <p className="text-sm text-gray-600">
                  {t.averageScore}: {metrics.excellence.average.toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Top Performers */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Medal className="h-5 w-5" />
              {t.topPerformers}
            </CardTitle>
            <CardDescription>
              {t.studentsWithHighestRecognitionLevels}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Helpfulness Top Performers */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium flex items-center text-rose-600">
                  <HandHeart className="h-4 w-4 mr-1" />
                  {t.helpfulness}
                </h3>
                <div className="space-y-2">
                  {helpfulnessTopPerformers.map((student, index) => (
                    <div 
                      key={student.id}
                      className="flex items-center justify-between p-2 rounded-md border bg-white hover:bg-rose-50 cursor-pointer"
                      onClick={() => navigate(`/student/${student.id}`)}
                    >
                      <div className="flex items-center">
                        <span className="font-medium text-lg text-gray-500 mr-2">{index + 1}</span>
                        <span>{student.name}</span>
                      </div>
                      <div className="flex items-center text-rose-600">
                        <span className="text-sm">Level {student.levelInfo.level}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Respect Top Performers */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium flex items-center text-blue-600">
                  <Shield className="h-4 w-4 mr-1" />
                  {t.respect}
                </h3>
                <div className="space-y-2">
                  {respectTopPerformers.map((student, index) => (
                    <div 
                      key={student.id}
                      className="flex items-center justify-between p-2 rounded-md border bg-white hover:bg-blue-50 cursor-pointer"
                      onClick={() => navigate(`/student/${student.id}`)}
                    >
                      <div className="flex items-center">
                        <span className="font-medium text-lg text-gray-500 mr-2">{index + 1}</span>
                        <span>{student.name}</span>
                      </div>
                      <div className="flex items-center text-blue-600">
                        <span className="text-sm">Level {student.levelInfo.level}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Teamwork Top Performers */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium flex items-center text-green-600">
                  <Users className="h-4 w-4 mr-1" />
                  {t.teamwork}
                </h3>
                <div className="space-y-2">
                  {teamworkTopPerformers.map((student, index) => (
                    <div 
                      key={student.id}
                      className="flex items-center justify-between p-2 rounded-md border bg-white hover:bg-green-50 cursor-pointer"
                      onClick={() => navigate(`/student/${student.id}`)}
                    >
                      <div className="flex items-center">
                        <span className="font-medium text-lg text-gray-500 mr-2">{index + 1}</span>
                        <span>{student.name}</span>
                      </div>
                      <div className="flex items-center text-green-600">
                        <span className="text-sm">Level {student.levelInfo.level}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Excellence Top Performers */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium flex items-center text-amber-600">
                  <Gem className="h-4 w-4 mr-1" />
                  {t.excellence}
                </h3>
                <div className="space-y-2">
                  {excellenceTopPerformers.map((student, index) => (
                    <div 
                      key={student.id}
                      className="flex items-center justify-between p-2 rounded-md border bg-white hover:bg-amber-50 cursor-pointer"
                      onClick={() => navigate(`/student/${student.id}`)}
                    >
                      <div className="flex items-center">
                        <span className="font-medium text-lg text-gray-500 mr-2">{index + 1}</span>
                        <span>{student.name}</span>
                      </div>
                      <div className="flex items-center text-amber-600">
                        <span className="text-sm">Level {student.levelInfo.level}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Detailed Category Analysis */}
        <Tabs defaultValue="helpfulness" value={activeCategory} onValueChange={(value) => setActiveCategory(value as 'helpfulness' | 'respect' | 'teamwork' | 'excellence')}>
          <TabsList className="mb-6">
            <TabsTrigger value="helpfulness" className="flex items-center">
              <HandHeart className="mr-2 h-4 w-4" />
              {t.helpfulness}
            </TabsTrigger>
            <TabsTrigger value="respect" className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              {t.respect}
            </TabsTrigger>
            <TabsTrigger value="teamwork" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              {t.teamwork}
            </TabsTrigger>
            <TabsTrigger value="excellence" className="flex items-center">
              <Gem className="mr-2 h-4 w-4" />
              {t.excellence}
            </TabsTrigger>
          </TabsList>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {activeCategory === 'helpfulness' && <HandHeart className="h-5 w-5 text-rose-600" />}
                {activeCategory === 'respect' && <Shield className="h-5 w-5 text-blue-600" />}
                {activeCategory === 'teamwork' && <Users className="h-5 w-5 text-green-600" />}
                {activeCategory === 'excellence' && <Gem className="h-5 w-5 text-amber-600" />}
                {t[activeCategory as keyof typeof t] || activeCategory} {t.analysis}
              </CardTitle>
              <CardDescription>
                {t.detailedBreakdownOfSubcategories}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TabsContent value="helpfulness" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4">{t.subcategories}</h3>
                    <div className="space-y-6">
                      {RECOGNITION_SUBCATEGORIES.helpfulness.map(subcategory => (
                        <div key={subcategory.id} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">{subcategory.name}</span>
                            <span className="text-sm text-gray-500">
                              {(metrics.helpfulness.average * (0.8 + Math.random() * 0.4)).toFixed(1)}
                            </span>
                          </div>
                          <Progress value={(0.8 + Math.random() * 0.4) * 100} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-4">{t.distribution}</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={getSubcategoryData('helpfulness')}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <RechartsTooltip />
                          <Bar dataKey="value" fill="#f43f5e">
                            {getSubcategoryData('helpfulness').map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={`#f43f5e${index % 2 === 0 ? '99' : '77'}`} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="respect" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4">{t.subcategories}</h3>
                    <div className="space-y-6">
                      {RECOGNITION_SUBCATEGORIES.respect.map(subcategory => (
                        <div key={subcategory.id} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">{subcategory.name}</span>
                            <span className="text-sm text-gray-500">
                              {(metrics.respect.average * (0.8 + Math.random() * 0.4)).toFixed(1)}
                            </span>
                          </div>
                          <Progress value={(0.8 + Math.random() * 0.4) * 100} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-4">{t.distribution}</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={getSubcategoryData('respect')}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <RechartsTooltip />
                          <Bar dataKey="value" fill="#2563eb">
                            {getSubcategoryData('respect').map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={`#2563eb${index % 2 === 0 ? '99' : '77'}`} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="teamwork" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4">{t.subcategories}</h3>
                    <div className="space-y-6">
                      {RECOGNITION_SUBCATEGORIES.teamwork.map(subcategory => (
                        <div key={subcategory.id} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">{subcategory.name}</span>
                            <span className="text-sm text-gray-500">
                              {(metrics.teamwork.average * (0.8 + Math.random() * 0.4)).toFixed(1)}
                            </span>
                          </div>
                          <Progress value={(0.8 + Math.random() * 0.4) * 100} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-4">{t.distribution}</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={getSubcategoryData('teamwork')}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <RechartsTooltip />
                          <Bar dataKey="value" fill="#16a34a">
                            {getSubcategoryData('teamwork').map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={`#16a34a${index % 2 === 0 ? '99' : '77'}`} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="excellence" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4">{t.subcategories}</h3>
                    <div className="space-y-6">
                      {RECOGNITION_SUBCATEGORIES.excellence.map(subcategory => (
                        <div key={subcategory.id} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">{subcategory.name}</span>
                            <span className="text-sm text-gray-500">
                              {(metrics.excellence.average * (0.8 + Math.random() * 0.4)).toFixed(1)}
                            </span>
                          </div>
                          <Progress value={(0.8 + Math.random() * 0.4) * 100} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-4">{t.distribution}</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={getSubcategoryData('excellence')}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <RechartsTooltip />
                          <Bar dataKey="value" fill="#d97706">
                            {getSubcategoryData('excellence').map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={`#d97706${index % 2 === 0 ? '99' : '77'}`} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </main>
    </div>
  );
};

// Need to import Badge which was used in the component
import { Badge } from "@/components/ui/badge";

export default GradeRecognition;
