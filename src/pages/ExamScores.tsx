
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import Header from '@/components/Header';
import CustomBreadcrumb from '@/components/CustomBreadcrumb';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { utils, writeFile } from 'xlsx';
import {
  Users,
  Home,
  Search,
  X,
  Download,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { toast } from 'sonner';

const ExamScores = () => {
  const { students, language } = useAppContext();
  const navigate = useNavigate();
  const t = getTranslations(language);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  
  // Get unique grade levels
  const uniqueGrades = [...new Set(students.map(student => student.grade))].sort();
  
  // Get all subjects from all exams
  const allSubjects = new Set<string>();
  students.forEach(student => {
    if (student.examScores) {
      student.examScores.forEach(exam => {
        allSubjects.add(exam.subject);
      });
    }
  });
  const uniqueSubjects = [...allSubjects].sort();
  
  // Filter students based on search term and selected grade
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade ? student.grade === selectedGrade : true;
    return matchesSearch && matchesGrade;
  });
  
  // Handle grade selection
  const handleGradeChange = (grade: string) => {
    if (grade === selectedGrade) {
      // Clear grade filter
      setSelectedGrade(null);
    } else {
      // Set grade filter
      setSelectedGrade(grade);
    }
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedGrade(null);
    setSelectedSubject(null);
  };
  
  // Navigate to student view
  const handleStudentClick = (id: string) => {
    navigate(`/student/${id}`);
  };
  
  // Export all exam scores to Excel
  const handleExportToExcel = () => {
    const hasExamScores = students.some(student => student.examScores && student.examScores.length > 0);
    
    if (!hasExamScores) {
      toast.error(t.noExamScores);
      return;
    }
    
    // Prepare data for export
    const wsData = students
      .filter(student => student.examScores && student.examScores.length > 0)
      .flatMap(student => 
        (student.examScores || [])
          .filter(exam => {
            const matchesSubject = selectedSubject ? exam.subject === selectedSubject : true;
            return matchesSubject;
          })
          .map(exam => ({
            [t.student]: student.name,
            [t.grade]: student.grade,
            [t.examName]: exam.examName,
            [t.subject]: exam.subject,
            [t.date]: format(new Date(exam.date), 'PP'),
            [t.score]: exam.score,
            [t.totalPossible]: exam.totalPossible,
            '%': `${Math.round((exam.score / exam.totalPossible) * 100)}%`
          }))
      );
    
    if (wsData.length === 0) {
      toast.error(t.noExamScores);
      return;
    }
    
    const ws = utils.json_to_sheet(wsData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Exam Scores');
    
    writeFile(wb, `Exam Scores.xlsx`);
    toast.success(`${t.exportToExcel} ${t.success}`);
  };
  
  // Calculate scores by subject for each grade
  const calculateGradeSubjectAverages = () => {
    const results: Record<string, Record<string, { total: number, count: number }>> = {};
    
    students.forEach(student => {
      if (!student.examScores) return;
      
      if (!results[student.grade]) {
        results[student.grade] = {};
      }
      
      student.examScores.forEach(exam => {
        if (!results[student.grade][exam.subject]) {
          results[student.grade][exam.subject] = { total: 0, count: 0 };
        }
        
        const percentage = (exam.score / exam.totalPossible) * 100;
        results[student.grade][exam.subject].total += percentage;
        results[student.grade][exam.subject].count += 1;
      });
    });
    
    // Format the results
    return Object.entries(results).map(([grade, subjects]) => {
      const subjectAverages = Object.entries(subjects).map(([subject, data]) => ({
        subject,
        average: data.total / data.count,
        count: data.count
      }));
      
      return {
        grade,
        subjects: subjectAverages
      };
    });
  };
  
  const gradeSubjectAverages = calculateGradeSubjectAverages();
  
  // Create breadcrumb items
  const breadcrumbItems = [
    {
      label: t.home,
      icon: <Home className="h-4 w-4" />,
      href: "/"
    },
    {
      label: t.examScores,
      icon: <BookOpen className="h-4 w-4" />,
      current: true
    }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="page-container">
        <CustomBreadcrumb items={breadcrumbItems} className="mb-6" />
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <h1 className="text-3xl font-display font-semibold">
            {t.examScoresManagement}
          </h1>
          
          <Button 
            onClick={handleExportToExcel}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {t.exportToExcel}
          </Button>
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
            
            <Select
              value={selectedSubject || ''}
              onValueChange={(value) => setSelectedSubject(value || null)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={t.subject} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t.allStudents}</SelectItem>
                {uniqueSubjects.map(subject => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {(searchTerm || selectedGrade || selectedSubject) && (
              <Button variant="outline" onClick={handleClearFilters}>
                {t.clearFilters}
              </Button>
            )}
          </div>
          
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">{t.byGrade}</h3>
            <div className="flex flex-wrap gap-2">
              {uniqueGrades.map((grade) => (
                <Button
                  key={grade}
                  variant={selectedGrade === grade ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleGradeChange(grade)}
                  className="flex items-center"
                >
                  <GraduationCap className="mr-2 h-4 w-4" />
                  {grade}
                </Button>
              ))}
            </div>
          </div>
          
          <Tabs defaultValue="students">
            <TabsList className="mb-6">
              <TabsTrigger value="students" className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                {t.students}
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                {t.analysis}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="students">
              {filteredStudents.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t.student}</TableHead>
                        <TableHead>{t.grade}</TableHead>
                        <TableHead>{t.examScores}</TableHead>
                        <TableHead>{t.averageExamScore}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student) => {
                        const examScores = student.examScores || [];
                        const filteredExams = selectedSubject 
                          ? examScores.filter(exam => exam.subject === selectedSubject)
                          : examScores;
                        
                        const averageScore = filteredExams.length > 0 
                          ? filteredExams.reduce((sum, exam) => sum + (exam.score / exam.totalPossible) * 100, 0) / filteredExams.length
                          : 0;
                        
                        return (
                          <TableRow 
                            key={student.id}
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() => handleStudentClick(student.id)}
                          >
                            <TableCell className="font-medium">{student.name}</TableCell>
                            <TableCell>{student.grade}</TableCell>
                            <TableCell>{filteredExams.length}</TableCell>
                            <TableCell>
                              {filteredExams.length > 0 ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-24 bg-gray-200 rounded-full h-2.5">
                                    <div 
                                      className="bg-blue-600 h-2.5 rounded-full" 
                                      style={{ width: `${Math.min(100, averageScore)}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-medium">{averageScore.toFixed(1)}%</span>
                                </div>
                              ) : (
                                <span className="text-gray-400 text-sm">{t.noExamScores}</span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  {t.noStudents}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="analysis">
              {gradeSubjectAverages.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t.grade}</TableHead>
                        <TableHead>{t.subject}</TableHead>
                        <TableHead>{t.examScores}</TableHead>
                        <TableHead>{t.averageExamScore}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {gradeSubjectAverages.flatMap(grade => 
                        grade.subjects
                          .filter(subject => !selectedSubject || subject.subject === selectedSubject)
                          .map(subject => (
                            <TableRow key={`${grade.grade}-${subject.subject}`}>
                              <TableCell className="font-medium">{grade.grade}</TableCell>
                              <TableCell>{subject.subject}</TableCell>
                              <TableCell>{subject.count}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="w-24 bg-gray-200 rounded-full h-2.5">
                                    <div 
                                      className="bg-blue-600 h-2.5 rounded-full" 
                                      style={{ width: `${Math.min(100, subject.average)}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-medium">{subject.average.toFixed(1)}%</span>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  {t.noExamScores}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default ExamScores;
