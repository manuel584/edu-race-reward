
import React from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';
import { Home, BarChart2, Users, GraduationCap, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const ReportsPage = () => {
  const { language, students, getClassMetrics } = useAppContext();
  const { user } = useAuth();
  const t = getTranslations(language);
  
  // Get class metrics
  const classMetrics = getClassMetrics();
  
  // Set up tab content based on user role
  const userRole = user?.role || 'teacher';
  
  // Generate breadcrumb items
  const breadcrumbItems = [
    { label: t.home || 'Home', path: '/', icon: <Home className="h-4 w-4" /> },
    { label: t.reports || 'Reports' },
  ];
  
  // Filter data based on user role
  let filteredClasses = classMetrics;
  if (userRole === 'supervisor' && user?.profile?.departments) {
    // Logic to filter by department would go here
  } else if (userRole === 'teacher' && user?.profile?.assignedGrades) {
    // Filter by assigned grades
    const assignedGrades = user.profile.assignedGrades;
    filteredClasses = classMetrics.filter(cls => 
      assignedGrades.includes(cls.name)
    );
  }
  
  // Prepare data for charts
  const attendanceData = filteredClasses.map(cls => ({
    name: cls.name,
    attendance: cls.averageAttendance,
  }));
  
  const engagementData = filteredClasses.map(cls => ({
    name: cls.name,
    engagement: cls.averageEngagement,
  }));
  
  const pointsData = filteredClasses.map(cls => ({
    name: cls.name,
    points: cls.totalPoints,
  }));
  
  // Pie chart data for student distribution
  const nationalityDistribution = [
    { name: language === 'en' ? 'International' : 'دوليين', value: students.filter(s => s.nationality === 'international').length },
    { name: language === 'en' ? 'National' : 'محليين', value: students.filter(s => s.nationality === 'national').length },
  ];
  
  const COLORS = ['#0088FE', '#00C49F'];
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="page-container">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="flex flex-col md:items-start md:justify-between mb-6">
            <h1 className="text-3xl font-display font-bold text-foreground">
              {t.reports || 'Reports'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {language === 'en' 
                ? `View detailed ${userRole === 'admin' 
                    ? 'school-wide' 
                    : userRole === 'supervisor' 
                      ? 'departmental' 
                      : 'class'} analytics and reports`
                : `عرض تحليلات وتقارير ${userRole === 'admin' 
                    ? 'المدرسة' 
                    : userRole === 'supervisor' 
                      ? 'القسم' 
                      : 'الفصل'} المفصلة`
              }
            </p>
          </div>
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4" />
                {language === 'en' ? 'Overview' : 'نظرة عامة'}
              </TabsTrigger>
              <TabsTrigger value="academic" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                {language === 'en' ? 'Academic' : 'أكاديمي'}
              </TabsTrigger>
              <TabsTrigger value="students" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {language === 'en' ? 'Students' : 'الطلاب'}
              </TabsTrigger>
              <TabsTrigger value="classes" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                {language === 'en' ? 'Classes' : 'الفصول'}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{language === 'en' ? 'Total Students' : 'إجمالي الطلاب'}</CardTitle>
                    <CardDescription>{language === 'en' ? 'All registered students' : 'جميع الطلاب المسجلين'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{students.length}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{language === 'en' ? 'Total Classes' : 'إجمالي الفصول'}</CardTitle>
                    <CardDescription>{language === 'en' ? 'Number of active classes' : 'عدد الفصول النشطة'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{filteredClasses.length}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{language === 'en' ? 'Average Attendance' : 'متوسط الحضور'}</CardTitle>
                    <CardDescription>{language === 'en' ? 'School-wide average' : 'متوسط المدرسة'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {filteredClasses.length > 0 
                        ? Math.round(filteredClasses.reduce((acc, cls) => acc + cls.averageAttendance, 0) / filteredClasses.length) 
                        : 0}%
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{language === 'en' ? 'Total Points' : 'إجمالي النقاط'}</CardTitle>
                    <CardDescription>{language === 'en' ? 'Earned by all students' : 'حصل عليها جميع الطلاب'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {filteredClasses.reduce((acc, cls) => acc + cls.totalPoints, 0)}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>{language === 'en' ? 'Class Attendance' : 'حضور الفصول'}</CardTitle>
                    <CardDescription>
                      {language === 'en' ? 'Average attendance by class' : 'متوسط الحضور حسب الفصل'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={attendanceData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="attendance" name={language === 'en' ? 'Attendance %' : 'نسبة الحضور'} fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>{language === 'en' ? 'Student Distribution' : 'توزيع الطلاب'}</CardTitle>
                    <CardDescription>
                      {language === 'en' ? 'By nationality' : 'حسب الجنسية'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={nationalityDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {nationalityDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="academic">
              <div className="grid grid-cols-1 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>{language === 'en' ? 'Points by Class' : 'النقاط حسب الفصل'}</CardTitle>
                    <CardDescription>
                      {language === 'en' ? 'Total points earned by each class' : 'إجمالي النقاط التي حصل عليها كل فصل'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={pointsData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="points" name={language === 'en' ? 'Total Points' : 'إجمالي النقاط'} fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>{language === 'en' ? 'Engagement Levels' : 'مستويات المشاركة'}</CardTitle>
                    <CardDescription>
                      {language === 'en' ? 'Student engagement by class' : 'مشاركة الطلاب حسب الفصل'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={engagementData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="engagement" 
                          name={language === 'en' ? 'Engagement Score' : 'درجة المشاركة'} 
                          stroke="#ff7300" 
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="students">
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{language === 'en' ? 'Student Overview' : 'نظرة عامة على الطلاب'}</CardTitle>
                    <CardDescription>
                      {language === 'en' ? 'Basic statistics about students' : 'إحصائيات أساسية عن الطلاب'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {language === 'en' 
                        ? 'Detailed student reports and analytics are available in this section.' 
                        : 'تتوفر تقارير وتحليلات مفصلة للطلاب في هذا القسم.'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="classes">
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{language === 'en' ? 'Class Performance' : 'أداء الفصل'}</CardTitle>
                    <CardDescription>
                      {language === 'en' ? 'Performance metrics by class' : 'مقاييس الأداء حسب الفصل'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {language === 'en' 
                        ? 'Detailed class reports and analytics are available in this section.' 
                        : 'تتوفر تقارير وتحليلات مفصلة للفصول في هذا القسم.'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default ReportsPage;
