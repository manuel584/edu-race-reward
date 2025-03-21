
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import Header from '@/components/Header';
import AddStudentDialog from '@/components/AddStudentDialog';
import StudentPointsCard from '@/components/StudentPointsCard';
import Breadcrumb from '@/components/Breadcrumb';
import { motion } from 'framer-motion';
import { Search, Users, GraduationCap, Globe, Home } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';

const Students = () => {
  const { students, language } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();
  const location = useLocation();
  
  const t = getTranslations(language);
  
  // Parse URL parameters for filtering
  const searchParams = new URLSearchParams(location.search);
  const typeFilter = searchParams.get('type');
  const gradeFilter = searchParams.get('grade');
  
  // Set active tab based on URL parameters
  useEffect(() => {
    if (typeFilter) {
      setActiveTab('nationality');
    } else if (gradeFilter) {
      setActiveTab('grade');
    } else {
      setActiveTab('all');
    }
  }, [typeFilter, gradeFilter]);
  
  // Apply filters from URL parameters
  let filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (typeFilter === 'national') {
    filteredStudents = filteredStudents.filter(student => student.nationality === 'national');
  } else if (typeFilter === 'international') {
    filteredStudents = filteredStudents.filter(student => student.nationality === 'international');
  }
  
  if (gradeFilter) {
    filteredStudents = filteredStudents.filter(student => student.grade === gradeFilter);
  }

  // Group students by nationality
  const internationalStudents = filteredStudents.filter(student => 
    student.nationality === 'international'
  );
  
  const nationalStudents = filteredStudents.filter(student => 
    student.nationality === 'national'
  );

  // Group students by grade
  const studentsByGrade = filteredStudents.reduce((acc, student) => {
    const grade = student.grade || 'Unassigned';
    if (!acc[grade]) {
      acc[grade] = [];
    }
    acc[grade].push(student);
    return acc;
  }, {} as Record<string, typeof filteredStudents>);

  const handleStudentClick = (id: string) => {
    navigate(`/student/${id}`);
  };
  
  // Generate breadcrumb items
  const breadcrumbItems = [
    { label: t.home, path: '/', icon: <Home className="h-4 w-4" /> },
    { label: t.students, path: '/students' },
  ];
  
  if (typeFilter === 'national') {
    breadcrumbItems.push({ label: t.nationalStudents });
  } else if (typeFilter === 'international') {
    breadcrumbItems.push({ label: t.internationalStudents });
  }
  
  if (gradeFilter) {
    breadcrumbItems.push({ label: gradeFilter });
  }

  return (
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
            <h1 className="text-3xl font-display font-bold">
              {typeFilter === 'national' ? t.nationalStudents :
               typeFilter === 'international' ? t.internationalStudents :
               gradeFilter ? `${t.grade}: ${gradeFilter}` : t.students}
            </h1>
            
            <div className="mt-4 md:mt-0 flex gap-2">
              {(typeFilter || gradeFilter) && (
                <Button 
                  variant="outline"
                  onClick={() => navigate('/students')}
                >
                  {t.clearFilters}
                </Button>
              )}
              <AddStudentDialog />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder={t.searchStudents}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger 
                value="all" 
                className="flex items-center gap-1"
                onClick={() => navigate('/students')}
              >
                <Users className="h-4 w-4" />
                {t.allStudents}
              </TabsTrigger>
              <TabsTrigger 
                value="nationality" 
                className="flex items-center gap-1"
                onClick={() => !typeFilter && navigate('/students?type=national')}
              >
                <Globe className="h-4 w-4" />
                {t.byNationality}
              </TabsTrigger>
              <TabsTrigger 
                value="grade" 
                className="flex items-center gap-1"
                onClick={() => !gradeFilter && navigate('/students')}
              >
                <GraduationCap className="h-4 w-4" />
                {t.byGrade}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {filteredStudents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStudents.map(student => (
                    <StudentPointsCard 
                      key={student.id} 
                      student={student} 
                      onClick={() => handleStudentClick(student.id)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState />
              )}
            </TabsContent>
            
            <TabsContent value="nationality">
              {filteredStudents.length > 0 ? (
                <div className="space-y-8">
                  {(!typeFilter || typeFilter === 'international') && (
                    <div>
                      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Globe className="h-5 w-5 text-blue-600" />
                        {t.internationalStudents} ({internationalStudents.length})
                      </h2>
                      
                      {internationalStudents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {internationalStudents.map(student => (
                            <StudentPointsCard 
                              key={student.id} 
                              student={student} 
                              onClick={() => handleStudentClick(student.id)}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                          <p className="text-gray-500">{t.noInternationalStudents}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {(!typeFilter || typeFilter === 'national') && (
                    <div>
                      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        {t.nationalStudents} ({nationalStudents.length})
                      </h2>
                      
                      {nationalStudents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {nationalStudents.map(student => (
                            <StudentPointsCard 
                              key={student.id} 
                              student={student} 
                              onClick={() => handleStudentClick(student.id)}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                          <p className="text-gray-500">{t.noNationalStudents}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <EmptyState />
              )}
            </TabsContent>
            
            <TabsContent value="grade">
              {filteredStudents.length > 0 ? (
                <div className="space-y-8">
                  {Object.entries(studentsByGrade).map(([grade, gradeStudents]) => (
                    <div key={grade}>
                      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-blue-600" />
                        {grade} ({gradeStudents.length})
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {gradeStudents.map(student => (
                          <StudentPointsCard 
                            key={student.id} 
                            student={student} 
                            onClick={() => handleStudentClick(student.id)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState />
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

const EmptyState = () => {
  const { language } = useAppContext();
  const t = getTranslations(language);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
      <p className="text-gray-500">{t.noStudents}</p>
      <div className="mt-4">
        <AddStudentDialog />
      </div>
    </div>
  );
};

export default Students;
