
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import Header from '@/components/Header';
import StudentCard from '@/components/StudentCard';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Grid, 
  List, 
  Filter, 
  Plus, 
  Users,
  ThumbsDown,
  ThumbsUp,
  School
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import AddStudentDialog from '@/components/AddStudentDialog';
import EditGradeNameDialog from '@/components/EditGradeNameDialog';
import DailyBehaviorReport from '@/components/DailyBehaviorReport';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Students = () => {
  const { students, language } = useAppContext();
  const t = getTranslations(language);
  const navigate = useNavigate();
  
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  
  // Get active (non-archived) students
  const activeStudents = students.filter(student => !student.archived);
  
  // Get all unique grades
  const grades = [...new Set(activeStudents.map(student => student.grade))].sort();
  
  // Filter students based on search and grade filter
  const filteredStudents = activeStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(search.toLowerCase());
    const matchesGrade = gradeFilter === 'all' || student.grade === gradeFilter;
    return matchesSearch && matchesGrade;
  });
  
  // Group students by grade
  const studentsByGrade = filteredStudents.reduce((groups, student) => {
    const grade = student.grade;
    if (!groups[grade]) {
      groups[grade] = [];
    }
    groups[grade].push(student);
    return groups;
  }, {} as Record<string, typeof students>);
  
  const handleStudentClick = (studentId: string) => {
    navigate(`/student/${studentId}`);
  };
  
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-display font-bold">{t.students || "Students"}</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {t.manageYourStudents || "Manage your students and their progress"}
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex gap-2 flex-wrap">
              <Button variant="outline" className="flex items-center gap-2" onClick={() => setViewType(viewType === 'grid' ? 'list' : 'grid')}>
                {viewType === 'grid' ? (
                  <>
                    <List className="h-4 w-4" />
                    <span>{t.listView || "List View"}</span>
                  </>
                ) : (
                  <>
                    <Grid className="h-4 w-4" />
                    <span>{t.gridView || "Grid View"}</span>
                  </>
                )}
              </Button>
              
              <Button onClick={() => setAddStudentOpen(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>{t.addStudent || "Add Student"}</span>
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="students" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="students">
                <Users className="mr-2 h-4 w-4" />
                {t.allStudents || "All Students"}
              </TabsTrigger>
              <TabsTrigger value="behavior">
                <ThumbsUp className="mr-2 h-4 w-4" />
                {t.behaviorReports || "Behavior Reports"}
              </TabsTrigger>
              <TabsTrigger value="grades">
                <School className="mr-2 h-4 w-4" />
                {t.manageGrades || "Manage Grades"}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="students">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Input
                    placeholder={t.searchStudents || "Search students..."}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                
                <Select value={gradeFilter} onValueChange={setGradeFilter}>
                  <SelectTrigger className="w-[180px] flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder={t.filterByGrade || "Filter by grade"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.allGrades || "All Grades"}</SelectItem>
                    {grades.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {gradeFilter === 'all' ? (
                // Group by grade when showing all grades
                Object.entries(studentsByGrade).map(([grade, gradeStudents]) => (
                  <div key={grade} className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold">{grade}</h2>
                      <EditGradeNameDialog gradeName={grade} />
                    </div>
                    
                    <div className={cn(
                      viewType === 'grid' 
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                        : "space-y-4"
                    )}>
                      {gradeStudents.map((student) => (
                        <StudentCard
                          key={student.id}
                          student={student}
                          onClick={() => handleStudentClick(student.id)}
                          viewType={viewType}
                        />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                // Show selected grade only
                <div className={cn(
                  viewType === 'grid' 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                    : "space-y-4"
                )}>
                  {filteredStudents.map((student) => (
                    <StudentCard
                      key={student.id}
                      student={student}
                      onClick={() => handleStudentClick(student.id)}
                      viewType={viewType}
                    />
                  ))}
                </div>
              )}
              
              {filteredStudents.length === 0 && (
                <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Users className="h-10 w-10 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">{t.noStudentsFound || "No students found"}</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
                    {t.tryAdjustingFilters || "Try adjusting your search or filters to find what you're looking for."}
                  </p>
                  <Button onClick={() => setAddStudentOpen(true)} variant="outline">
                    {t.addNewStudent || "Add New Student"}
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="behavior">
              <DailyBehaviorReport />
            </TabsContent>
            
            <TabsContent value="grades">
              <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">{t.manageGrades || "Manage Grades"}</h2>
                
                <div className="space-y-4">
                  {grades.map((grade) => (
                    <div key={grade} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <h3 className="font-medium">{grade}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {studentsByGrade[grade]?.length || 0} {t.students || "students"}
                        </p>
                      </div>
                      <EditGradeNameDialog gradeName={grade}>
                        <Button variant="outline" size="sm">
                          {t.edit || "Edit Name"}
                        </Button>
                      </EditGradeNameDialog>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
      
      <AddStudentDialog 
        open={addStudentOpen}
        onOpenChange={setAddStudentOpen}
      />
    </div>
  );
};

export default Students;
