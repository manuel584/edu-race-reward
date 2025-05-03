
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';
import { Home, ChevronDown, Plus, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import GradeSpreadsheet from '@/components/GradeSpreadsheet';
import GradePerformanceChart from '@/components/GradePerformanceChart';
import { GradeDistribution } from '@/types/student-score';
import { useAuth } from '@/hooks/useAuth';
import RoleBasedRoute from '@/components/RoleBasedRoute';

const GradeEntry = () => {
  const { language, students = [] } = useAppContext();
  const { user } = useAuth();
  const t = getTranslations(language);
  
  // State for the exam name
  const [examName, setExamName] = useState<string>('');
  const [newExamName, setNewExamName] = useState<string>('');
  const [isAddingExam, setIsAddingExam] = useState<boolean>(false);
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  
  // State for the chart data
  const [distribution, setDistribution] = useState<GradeDistribution>({ A: 0, B: 0, C: 0, D: 0, F: 0 });
  const [average, setAverage] = useState<number>(0);
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
  
  // State for chart customization
  const [isAddingCategory, setIsAddingCategory] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [customCategoryData, setCustomCategoryData] = useState<Record<string, number[]>>({});
  
  // Available grades from the students data
  const availableGrades = React.useMemo(() => {
    const grades = [...new Set(students.map(student => student.grade))];
    return ['all', ...grades.sort()];
  }, [students]);
  
  // Filter students if needed based on selected grade
  useEffect(() => {
    // This effect can be expanded when implementing grade filtering functionality
  }, [selectedGrade]);
  
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
  
  // Function to directly update distribution from the chart
  const handleUpdateDistribution = (newDistribution: GradeDistribution) => {
    setDistribution(newDistribution);
    
    // Recalculate average based on the new distribution
    const totalStudents = Object.values(newDistribution).reduce((sum, count) => sum + count, 0);
    if (totalStudents === 0) return;
    
    // This is an approximation since we don't know the exact scores
    const weightedSum = 
      newDistribution.A * 95 + // A avg = 95
      newDistribution.B * 85 + // B avg = 85
      newDistribution.C * 75 + // C avg = 75
      newDistribution.D * 65 + // D avg = 65
      newDistribution.F * 55;  // F avg = 55
    
    const newAverage = weightedSum / totalStudents;
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
  
  // Function to add a new chart category
  const handleAddCategory = () => {
    if (newCategoryName.trim() === '') return;
    
    setCustomCategories([...customCategories, newCategoryName]);
    setCustomCategoryData({
      ...customCategoryData,
      [newCategoryName]: [0, 0, 0, 0, 0] // Default values
    });
    
    setNewCategoryName('');
    setIsAddingCategory(false);
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
              
              <div className="flex items-center gap-2 mt-3 md:mt-0">
                <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder={t.selectGrade || "Select grade"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.allGrades || "All Grades"}</SelectItem>
                    {availableGrades
                      .filter(grade => grade !== 'all')
                      .map(grade => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
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
                      <div className="flex items-center gap-2">
                        <Tabs defaultValue="bar" onValueChange={(value) => setChartType(value as 'bar' | 'pie')}>
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="bar">{t.bar || "Bar"}</TabsTrigger>
                            <TabsTrigger value="pie">{t.pie || "Pie"}</TabsTrigger>
                          </TabsList>
                        </Tabs>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          title={t.editChart || "Edit Chart"}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <GradePerformanceChart 
                      distribution={distribution}
                      average={average}
                      type={chartType}
                      onUpdateDistribution={handleUpdateDistribution}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle>{t.keyInsights || "Key Insights"}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsAddingCategory(true)}
                      className="h-8 text-xs"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      {t.addCategory || "Add Category"}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.values(distribution).some(value => value > 0) ? (
                        <>
                          <div>
                            <h3 className="font-medium mb-1">{t.gradeDistribution || "Grade Distribution"}</h3>
                            <p className="text-sm text-muted-foreground flex flex-wrap gap-2">
                              {distribution.A > 0 && (
                                <span className="inline-flex items-center gap-1">
                                  <span className="h-3 w-3 bg-[#4CAF50] rounded-sm inline-block"></span>
                                  A: {distribution.A}
                                </span>
                              )}
                              {distribution.B > 0 && (
                                <span className="inline-flex items-center gap-1">
                                  <span className="h-3 w-3 bg-[#8BC34A] rounded-sm inline-block"></span>
                                  B: {distribution.B}
                                </span>
                              )}
                              {distribution.C > 0 && (
                                <span className="inline-flex items-center gap-1">
                                  <span className="h-3 w-3 bg-[#FFC107] rounded-sm inline-block"></span>
                                  C: {distribution.C}
                                </span>
                              )}
                              {distribution.D > 0 && (
                                <span className="inline-flex items-center gap-1">
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
                          
                          {/* Custom Categories */}
                          {customCategories.map(category => (
                            <div key={category}>
                              <h3 className="font-medium mb-1">{category}</h3>
                              <p className="text-sm text-muted-foreground">
                                {customCategoryData[category]?.[0] || 0} / 100
                              </p>
                            </div>
                          ))}
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
        
        {/* Add Category Dialog */}
        <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {t.addNewCategory || "Add New Category"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <label className="block text-sm font-medium mb-1">
                {t.categoryName || "Category Name"}
              </label>
              <Input
                placeholder={t.enterCategoryName || "Enter category name"}
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingCategory(false)}>
                {t.cancel || "Cancel"}
              </Button>
              <Button
                onClick={handleAddCategory}
                disabled={newCategoryName.trim() === ''}
              >
                {t.add || "Add"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </RoleBasedRoute>
  );
};

export default GradeEntry;
