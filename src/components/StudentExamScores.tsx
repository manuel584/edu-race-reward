
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAppContext, ExamScore, Student } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { format } from 'date-fns';
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ExamScoreDialog from './ExamScoreDialog';
import { utils, writeFile } from 'xlsx';
import { MoreHorizontal, FileText, BarChart2, Download, Search, Trash2, Edit, SortAsc, SortDesc, X } from 'lucide-react';
import { toast } from 'sonner';

interface StudentExamScoresProps {
  student: Student;
}

type SortOption = 'date' | 'examName' | 'score' | 'subject';
type SortDirection = 'asc' | 'desc';

const StudentExamScores: React.FC<StudentExamScoresProps> = ({ student }) => {
  const { language, deleteExamScore } = useAppContext();
  const t = getTranslations(language);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  
  const examScores = student.examScores || [];
  
  const handleDelete = (examId: string) => {
    deleteExamScore(student.id, examId);
    toast.success(t.deleteExamScore + ' ' + t.success);
  };
  
  const handleExportToExcel = () => {
    if (examScores.length === 0) {
      toast.error(t.noExamScores);
      return;
    }
    
    const wsData = filteredExamScores.map(exam => ({
      [t.examName]: exam.examName,
      [t.subject]: exam.subject,
      [t.date]: format(new Date(exam.date), 'PP'),
      [t.score]: exam.score,
      [t.totalPossible]: exam.totalPossible,
      '%': `${Math.round((exam.score / exam.totalPossible) * 100)}%`
    }));
    
    const ws = utils.json_to_sheet(wsData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Exam Scores');
    
    writeFile(wb, `${student.name} - Exam Scores.xlsx`);
    toast.success(`${t.exportToExcel} ${t.success}`);
  };
  
  // Get unique subjects for filtering
  const uniqueSubjects = useMemo(() => {
    return [...new Set(examScores.map(exam => exam.subject))];
  }, [examScores]);
  
  // Calculate total and average scores
  const totalScore = useMemo(() => {
    return examScores.reduce((sum, exam) => sum + exam.score, 0);
  }, [examScores]);
  
  const averagePercentage = useMemo(() => {
    if (examScores.length === 0) return 0;
    const totalPercentage = examScores.reduce((sum, exam) => sum + (exam.score / exam.totalPossible) * 100, 0);
    return totalPercentage / examScores.length;
  }, [examScores]);
  
  // Filter and sort exam scores
  const filteredExamScores = useMemo(() => {
    return examScores
      .filter(exam => {
        const matchesSearch = 
          exam.examName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exam.subject.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesSubject = selectedSubject ? exam.subject === selectedSubject : true;
        
        return matchesSearch && matchesSubject;
      })
      .sort((a, b) => {
        let comparison = 0;
        
        switch (sortBy) {
          case 'date':
            comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
            break;
          case 'examName':
            comparison = a.examName.localeCompare(b.examName);
            break;
          case 'score':
            comparison = (a.score / a.totalPossible) - (b.score / b.totalPossible);
            break;
          case 'subject':
            comparison = a.subject.localeCompare(b.subject);
            break;
        }
        
        return sortDirection === 'asc' ? comparison : -comparison;
      });
  }, [examScores, searchTerm, selectedSubject, sortBy, sortDirection]);
  
  // Prepare chart data
  const chartData = useMemo(() => {
    // Group by subject
    const subjectData: Record<string, { subject: string, count: number, avgScore: number, scores: number[] }> = {};
    
    examScores.forEach(exam => {
      if (!subjectData[exam.subject]) {
        subjectData[exam.subject] = {
          subject: exam.subject,
          count: 0,
          avgScore: 0,
          scores: []
        };
      }
      
      const percentage = (exam.score / exam.totalPossible) * 100;
      subjectData[exam.subject].scores.push(percentage);
      subjectData[exam.subject].count += 1;
    });
    
    // Calculate average scores
    return Object.values(subjectData).map(item => ({
      subject: item.subject,
      count: item.count,
      avgScore: item.scores.reduce((sum, score) => sum + score, 0) / item.scores.length
    }));
  }, [examScores]);
  
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pb-4">
        <h3 className="text-xl font-semibold">{t.studentExamScores}</h3>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleExportToExcel}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {t.exportToExcel}
          </Button>
          
          <ExamScoreDialog 
            studentId={student.id}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <h4 className="text-gray-500 text-sm font-medium mb-1">{t.totalScore}</h4>
          <p className="text-2xl font-bold">{totalScore}</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <h4 className="text-gray-500 text-sm font-medium mb-1">{t.averageExamScore}</h4>
          <p className="text-2xl font-bold">{averagePercentage.toFixed(1)}%</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <h4 className="text-gray-500 text-sm font-medium mb-1">{t.examScores}</h4>
          <p className="text-2xl font-bold">{examScores.length}</p>
        </div>
      </div>
      
      <Tabs defaultValue="table">
        <TabsList className="mb-6">
          <TabsTrigger value="table" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {t.examScores}
          </TabsTrigger>
          <TabsTrigger value="chart" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            {t.analysis}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="table">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={`${t.search} ${t.examScores}`}
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
              
              <div className="flex gap-2">
                <Select
                  value={selectedSubject || ''}
                  onValueChange={(value) => setSelectedSubject(value || null)}
                >
                  <SelectTrigger className="w-[180px]">
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
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      {sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                      {t.sortBy}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{t.sortBy}</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => { setSortBy('date'); toggleSortDirection(); }}>
                      {t.date}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setSortBy('examName'); toggleSortDirection(); }}>
                      {t.examName}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setSortBy('score'); toggleSortDirection(); }}>
                      {t.score}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setSortBy('subject'); toggleSortDirection(); }}>
                      {t.subject}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {filteredExamScores.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t.examName}</TableHead>
                      <TableHead>{t.subject}</TableHead>
                      <TableHead>{t.date}</TableHead>
                      <TableHead>{t.score}</TableHead>
                      <TableHead className="text-right">{t.actions}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExamScores.map((exam) => (
                      <TableRow key={exam.id}>
                        <TableCell className="font-medium">{exam.examName}</TableCell>
                        <TableCell>{exam.subject}</TableCell>
                        <TableCell>{format(new Date(exam.date), 'PP')}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{exam.score}/{exam.totalPossible}</span>
                            <span className="text-sm text-gray-500">
                              ({Math.round((exam.score / exam.totalPossible) * 100)}%)
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <ExamScoreDialog
                                studentId={student.id}
                                examToEdit={exam}
                              >
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  {t.edit}
                                </DropdownMenuItem>
                              </ExamScoreDialog>
                              
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    {t.delete}
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>{t.confirmDeleteExam}</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      {t.examName}: {exam.examName}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(exam.id)}>
                                      {t.delete}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {t.noExamScores}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="chart">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <h4 className="text-lg font-medium mb-4">{t.averageScore} {t.bySubject}</h4>
            
            {chartData.length > 0 ? (
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip 
                      formatter={(value) => [`${value.toFixed(1)}%`, t.averageScore]}
                      labelFormatter={(label) => `${label} (${chartData.find(d => d.subject === label)?.count} exams)`}
                    />
                    <Legend />
                    <Bar 
                      dataKey="avgScore" 
                      name={t.averageScore} 
                      fill="#3b82f6" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {t.noExamScores}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentExamScores;
