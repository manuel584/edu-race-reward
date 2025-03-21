
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import Header from '@/components/Header';
import AddStudentDialog from '@/components/AddStudentDialog';
import StudentPointsCard from '@/components/StudentPointsCard';
import { motion } from 'framer-motion';
import { Search, Users, GraduationCap, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Students = () => {
  const { students, language } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();
  
  const t = getTranslations(language);
  
  // Filter students based on search term
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="page-container">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-3xl font-display font-bold">{t.students}</h1>
            
            <div className="mt-4 md:mt-0">
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
              <TabsTrigger value="all" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {t.allStudents}
              </TabsTrigger>
              <TabsTrigger value="nationality" className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                {t.byNationality}
              </TabsTrigger>
              <TabsTrigger value="grade" className="flex items-center gap-1">
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
