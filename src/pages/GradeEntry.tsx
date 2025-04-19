
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';
import { Home, ChevronDown } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GradeSpreadsheet from '@/components/GradeSpreadsheet';
import GradePerformanceChart from '@/components/GradePerformanceChart';
import { GradeDistribution } from '@/types/student-score';
import { useAuth } from '@/hooks/useAuth';
import RoleBasedRoute from '@/components/RoleBasedRoute';

const GradeEntry = () => {
  const { language } = useAppContext();
  const { user } = useAuth();
  const t = getTranslations(language);
  
  // State for the exam name
  const [examName, setExamName] = useState<string>('');
  const [newExamName, setNewExamName] = useState<string>('');
  const [isAddingExam, setIsAddingExam] = useState<boolean>(false);
  
  // State for the chart data
  const [distribution, setDistribution] = useState<GradeDistribution>({ A: 0, B: 0, C: 0, D: 0, F: 0 });
  const [average, setAverage] = useState<number>(0);
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
  
  // Generate breadcrumb items
  const breadcrumbItems = [
    { label: t.home || "Home", path: '/', icon: <Home className="h-4 w-4" /> },
    { label: t.enterResults || "Enter Results" },
    { label: t.gradeEntry || "Grade Entry" }
  ];
  
  // Function to handle chart data updates from the spreadsheet
  const handleUpdateChartData = (newDistribution: GradeDistribution, newAverage: number) => {
    setDistribution(newDistribution);
    setAverage(newAverage);
  };
  
  // List of example exams (in a real app, these would come from the API)
  const exampleExams = [
    'Midterm Exam 2023',
    'Final Quiz - Math',
    'Science Assessment Q1',
    'Reading Comprehension Test'
  ];
  
  // Function to add a new exam
  const handleAddExam = () => {
    if (newExamName.trim() === '') return;
    
    setExamName(newExamName);
    setNewExamName('');
    setIsAddingExam(false);
  };
  
  return (
    <RoleBasedRoute allowedRoles={['admin', 'teacher', 'supervisor']}>
      <div className="min-h-screen">
        <Header />
        
        <main className="page-container">
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Breadcrumb items={breadcrumbItems} />
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h1 className="text-3xl font-display font-bold">{t.gradeEntry || "Grade Entry"}</h1>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle>{t.excelStyleGrading || "Excel-Style Grading"}</CardTitle>
                      
                      {!isAddingExam ? (
                        <div className="flex gap-2">
                          <Select value={examName} onValueChange={setExamName}>
                            <SelectTrigger className="w-[250px]">
                              <SelectValue placeholder={t.selectExam || "Select Exam"} />
                            </SelectTrigger>
                            <SelectContent>
                              {exampleExams.map(exam => (
                                <SelectItem key={exam} value={exam}>
                                  {exam}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => setIsAddingExam(true)}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Input
                            value={newExamName}
                            onChange={(e) => setNewExamName(e.target.value)}
                            placeholder={t.enterExamName || "Enter exam name"}
                            className="w-[250px]"
                          />
                          <Button 
                            onClick={handleAddExam}
                            disabled={newExamName.trim() === ''}
                          >
                            {t.add || "Add"}
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setIsAddingExam(false)}
                          >
                            {t.cancel || "Cancel"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {examName ? (
                      <GradeSpreadsheet 
                        examName={examName} 
                        onUpdateChartData={handleUpdateChartData}
                      />
                    ) : (
                      <div className="py-12 text-center text-muted-foreground">
                        {t.selectExamToStart || "Select an exam to start entering grades"}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle>{t.performance || "Performance"}</CardTitle>
                      <div>
                        <Tabs defaultValue="bar" onValueChange={(value) => setChartType(value as 'bar' | 'pie')}>
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="bar">{t.bar || "Bar"}</TabsTrigger>
                            <TabsTrigger value="pie">{t.pie || "Pie"}</TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <GradePerformanceChart 
                      distribution={distribution}
                      average={average}
                      type={chartType}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>{t.keyInsights || "Key Insights"}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.values(distribution).some(value => value > 0) ? (
                        <>
                          <div>
                            <h3 className="font-medium mb-1">{t.gradeDistribution || "Grade Distribution"}</h3>
                            <p className="text-sm text-muted-foreground">
                              {distribution.A > 0 && (
                                <span className="inline-flex items-center gap-1 mr-3">
                                  <span className="h-3 w-3 bg-[#4CAF50] rounded-sm inline-block"></span>
                                  A: {distribution.A}
                                </span>
                              )}
                              {distribution.B > 0 && (
                                <span className="inline-flex items-center gap-1 mr-3">
                                  <span className="h-3 w-3 bg-[#8BC34A] rounded-sm inline-block"></span>
                                  B: {distribution.B}
                                </span>
                              )}
                              {distribution.C > 0 && (
                                <span className="inline-flex items-center gap-1 mr-3">
                                  <span className="h-3 w-3 bg-[#FFC107] rounded-sm inline-block"></span>
                                  C: {distribution.C}
                                </span>
                              )}
                              {distribution.D > 0 && (
                                <span className="inline-flex items-center gap-1 mr-3">
                                  <span className="h-3 w-3 bg-[#FF9800] rounded-sm inline-block"></span>
                                  D: {distribution.D}
                                </span>
                              )}
                              {distribution.F > 0 && (
                                <span className="inline-flex items-center gap-1">
                                  <span className="h-3 w-3 bg-[#F44336] rounded-sm inline-block"></span>
                                  F: {distribution.F}
                                </span>
                              )}
                            </p>
                          </div>
                          
                          <div>
                            <h3 className="font-medium mb-1">{t.classAverage || "Class Average"}</h3>
                            <p className="text-sm text-muted-foreground">
                              {average.toFixed(1)} / 100
                            </p>
                          </div>
                          
                          <div>
                            <h3 className="font-medium mb-1">{t.passRate || "Pass Rate"}</h3>
                            <p className="text-sm text-muted-foreground">
                              {distribution.A + distribution.B + distribution.C + distribution.D > 0 
                                ? ((distribution.A + distribution.B + distribution.C + distribution.D) / 
                                   (distribution.A + distribution.B + distribution.C + distribution.D + distribution.F) * 100).toFixed(1)
                                : 0}%
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="py-4 text-center text-muted-foreground">
                          {t.noDataYet || "No data available yet"}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </RoleBasedRoute>
  );
};

export default GradeEntry;
