
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/hooks/useAuth';
import { getTranslations } from '@/lib/i18n';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Edit, Trash2, Users, Table } from 'lucide-react';
import { StudentScore } from '@/types/student-score';
import { toast } from 'sonner';
import RecordResultDialog from './RecordResultDialog';
import { Link } from 'react-router-dom';

interface ExamListProps {
  filter: 'all' | 'recent' | 'historical';
}

const ExamList: React.FC<ExamListProps> = ({ filter }) => {
  const { language, scores = [], deleteScore } = useAppContext();
  const { user } = useAuth();
  const t = getTranslations(language);
  const [isRecordResultDialogOpen, setIsRecordResultDialogOpen] = useState(false);
  const [selectedScore, setSelectedScore] = useState<StudentScore | null>(null);
  
  // Filter scores based on teacher context and selected tab
  const getFilteredScores = () => {
    let filteredScores = scores;

    // Filter by teacher context if not admin
    if (user && user.role !== 'admin') {
      const teacherProfile = user.profile;
      const assignedGrades = teacherProfile?.assignedGrades || [];
      const assignedSubjects = teacherProfile?.subjects || [];

      filteredScores = scores.filter(score => {
        const matchesGrade = !score.grade || assignedGrades.includes(score.grade);
        const matchesSubject = !score.subject || assignedSubjects.includes(score.subject);
        return matchesGrade && matchesSubject;
      });
    }

    // Apply date filter
    const currentDate = new Date();
    const thirtyDaysAgo = new Date(currentDate);
    thirtyDaysAgo.setDate(currentDate.getDate() - 30);
    
    if (filter === 'recent') {
      return filteredScores.filter(score => new Date(score.date) >= thirtyDaysAgo);
    } else if (filter === 'historical') {
      return filteredScores.filter(score => new Date(score.date) < thirtyDaysAgo);
    }
    
    return filteredScores;
  };
  
  const filteredScores = getFilteredScores();
  
  // Group scores by exam name
  const groupedScores = filteredScores.reduce((acc, score) => {
    if (!acc[score.examName]) {
      acc[score.examName] = [];
    }
    acc[score.examName].push(score);
    return acc;
  }, {} as Record<string, StudentScore[]>);
  
  const handleDeleteScore = (id: string) => {
    if (window.confirm(t.confirmDelete || "Are you sure you want to delete this result?")) {
      deleteScore?.(id);
      toast.success(t.resultDeleted || "Result deleted successfully");
    }
  };
  
  const handleEditScore = (score: StudentScore) => {
    setSelectedScore(score);
    setIsRecordResultDialogOpen(true);
  };
  
  if (!scores || scores.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
        <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">{t.noResultsYet || "No results recorded yet"}</h3>
        <p className="text-gray-500 max-w-md mx-auto mb-6">{t.startAddingResults || "Start by adding your first quiz or exam results to track student performance."}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => setIsRecordResultDialogOpen(true)}>
            {t.recordResult || "Record Result"}
          </Button>
          <Button variant="outline" asChild>
            <Link to="/grade-entry">
              <Table className="h-4 w-4 mr-2" />
              {t.gradeEntry || "Grade Entry"}
            </Link>
          </Button>
        </div>
        <RecordResultDialog
          open={isRecordResultDialogOpen}
          onOpenChange={setIsRecordResultDialogOpen}
          initialData={selectedScore}
        />
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{t.results || "Results"}</h2>
        <Button variant="outline" asChild>
          <Link to="/grade-entry">
            <Table className="h-4 w-4 mr-2" />
            {t.gradeEntry || "Grade Entry"}
          </Link>
        </Button>
      </div>
      
      <div className="space-y-8">
        {Object.entries(groupedScores).map(([examName, examScores]) => (
          <div key={examName}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">{examName}</h3>
              <Link to={`/grade-entry?exam=${encodeURIComponent(examName)}`}>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Table className="h-4 w-4" />
                  {t.viewInSpreadsheet || "View in Spreadsheet"}
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {examScores.map((score) => (
                <Card key={score.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-start justify-between">
                      <span className="line-clamp-1">{score.examName}</span>
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {score.studentName}
                      {score.grade && ` - ${score.grade}`}
                      {score.subject && ` (${score.subject})`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-2" />
                        {new Date(score.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-2" />
                        {t.score || "Score"}: {score.score}/{score.totalPossiblePoints || 100}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 flex justify-between">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditScore(score)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      {user?.role === 'admin' && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteScore(score.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <RecordResultDialog
        open={isRecordResultDialogOpen}
        onOpenChange={(open) => {
          setIsRecordResultDialogOpen(open);
          if (!open) setSelectedScore(null);
        }}
        initialData={selectedScore}
      />
    </div>
  );
};

export default ExamList;
