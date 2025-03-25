
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import Header from '@/components/Header';
import AddStudentDialog from '@/components/AddStudentDialog';
import StudentCard from '@/components/StudentCard';
import CustomBreadcrumb from '@/components/CustomBreadcrumb';
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import {
  Users,
  Flag,
  GraduationCap,
  Home,
  Search,
  X,
  BarChart3
} from 'lucide-react';

const Students = () => {
  const { students, language } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const t = getTranslations(language);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'all' | 'international' | 'national'>('all');
  
  // Parse URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const gradeParam = params.get('grade');
    const typeParam = params.get('type') as 'international' | 'national' | null;
    
    if (gradeParam) {
      setSelectedGrade(gradeParam);
    }
    
    if (typeParam && (typeParam === 'international' || typeParam === 'national')) {
      setSelectedTab(typeParam);
    }
  }, [location.search]);
  
  // Get unique grade levels
  const uniqueGrades = [...new Set(students.map(student => student.grade))].sort();
  
  // Filter students based on search term, selected grade, and tab
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade ? student.grade === selectedGrade : true;
    const matchesTab = selectedTab === 'all' ? true : student.nationality === selectedTab;
    
    return matchesSearch && matchesGrade && matchesTab;
  });
  
  // Filter students by nationality
  const internationalStudents = filteredStudents.filter(student => student.nationality === 'international');
  const nationalStudents = filteredStudents.filter(student => student.nationality === 'national');
  
  // Handle grade selection
  const handleGradeChange = (grade: string) => {
    if (grade === selectedGrade) {
      // Clear grade filter
      setSelectedGrade(null);
      navigate('/students');
    } else {
      // Set grade filter
      setSelectedGrade(grade);
      navigate(`/students?grade=${grade}`);
    }
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedGrade(null);
    navigate('/students');
  };
  
  // Navigate to student view
  const handleStudentClick = (id: string) => {
    navigate(`/student/${id}`);
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
      current: selectedTab === 'all' && !selectedGrade
    }
  ];

  // Add nationality item if selected
  if (selectedTab !== 'all') {
    breadcrumbItems.push({
      label: selectedTab === 'international' ? t.internationalStudents : t.nationalStudents,
      icon: <Flag className="h-4 w-4" />,
      current: !selectedGrade
    });
  }

  // Add grade item if selected
  if (selectedGrade) {
    breadcrumbItems.push({
      label: selectedGrade,
      icon: <GraduationCap className="h-4 w-4" />,
      current: true
    });
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="page-container">
        <CustomBreadcrumb items={breadcrumbItems} className="mb-6" />
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <h1 className="text-3xl font-display font-semibold">
            {selectedTab === 'all' ? t.allStudents : 
             selectedTab === 'international' ? t.internationalStudents : 
             t.nationalStudents}
             {selectedGrade ? ` - ${t.grade} ${selectedGrade}` : ''}
          </h1>
          
          <div className="flex gap-2">
            {selectedGrade && (
              <Button 
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => navigate(`/grade/${selectedGrade}`)}
              >
                <BarChart3 className="h-4 w-4" />
                {t.viewRecognitionDashboard}
              </Button>
            )}
            <AddStudentDialog />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t.searchStudents}
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {(searchTerm || selectedGrade) && (
              <Button variant="outline" onClick={handleClearFilters}>
                {t.clearFilters}
              </Button>
            )}
          </div>
          
          <Tabs defaultValue="all" value={selectedTab} onValueChange={(value) => setSelectedTab(value as 'all' | 'international' | 'national')}>
            <TabsList className="mb-6">
              <TabsTrigger value="all" className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                {t.allStudents}
              </TabsTrigger>
              <TabsTrigger value="international" className="flex items-center">
                <Flag className="mr-2 h-4 w-4" />
                {t.internationalStudents}
              </TabsTrigger>
              <TabsTrigger value="national" className="flex items-center">
                <Flag className="mr-2 h-4 w-4" />
                {t.nationalStudents}
              </TabsTrigger>
            </TabsList>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3">{t.byGrade}</h3>
              <div className="flex flex-wrap gap-2">
                {uniqueGrades.map((grade) => (
                  <div key={grade} className="flex flex-col sm:flex-row gap-1">
                    <Button
                      variant={selectedGrade === grade ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleGradeChange(grade)}
                      className="flex items-center"
                    >
                      <GraduationCap className="mr-2 h-4 w-4" />
                      {grade}
                    </Button>
                    {selectedGrade === grade && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/grade/${grade}`)}
                        className="flex items-center sm:ml-1"
                      >
                        <BarChart3 className="mr-2 h-4 w-4" />
                        {t.recognition}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <TabsContent value="all">
              {filteredStudents.length > 0 ? (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.05 }}
                >
                  {filteredStudents.map((student) => (
                    <StudentCard
                      key={student.id}
                      student={student}
                      onClick={() => handleStudentClick(student.id)}
                    />
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  {t.noStudents}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="international">
              {internationalStudents.length > 0 ? (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.05 }}
                >
                  {internationalStudents.map((student) => (
                    <StudentCard
                      key={student.id}
                      student={student}
                      onClick={() => handleStudentClick(student.id)}
                    />
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  {t.noInternationalStudents}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="national">
              {nationalStudents.length > 0 ? (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.05 }}
                >
                  {nationalStudents.map((student) => (
                    <StudentCard
                      key={student.id}
                      student={student}
                      onClick={() => handleStudentClick(student.id)}
                    />
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  {t.noNationalStudents}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Students;
