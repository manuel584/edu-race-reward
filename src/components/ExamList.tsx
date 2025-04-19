
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Edit, Trash2, Users, FileText } from 'lucide-react';
import { StudentScore } from '@/types/student-score';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import RecordResultDialog from './RecordResultDialog';

interface ExamListProps {
  filter: 'all' | 'recent' | 'historical';
}

const ExamList: React.FC<ExamListProps> = ({ filter }) => {
  const { language, scores = [], deleteScore } = useAppContext();
  const t = getTranslations(language);
  const navigate = useNavigate();
  const [isRecordResultDialogOpen, setIsRecordResultDialogOpen] = useState(false);
  const [selectedScore, setSelectedScore] = useState<StudentScore | null>(null);
  
  // Filter scores based on the selected tab
  const getFilteredScores = () => {
    if (filter === 'all') return scores;
    
    const currentDate = new Date();
    const thirtyDaysAgo = new Date(currentDate);
    thirtyDaysAgo.setDate(currentDate.getDate() - 30);
    
    if (filter === 'recent') {
      return scores.filter(score => new Date(score.date) >= thirtyDaysAgo);
    } else {
      return scores.filter(score => new Date(score.date) < thirtyDaysAgo);
    }
  };
  
  const filteredScores = getFilteredScores();
  
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
        <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">{t.noResultsYet || "No results recorded yet"}</h3>
        <p className="text-gray-500 max-w-md mx-auto mb-6">{t.startAddingResults || "Start by adding your first quiz or exam results to track student performance."}</p>
        <Button onClick={() => setIsRecordResultDialogOpen(true)}>
          {t.recordResult || "Record Result"}
        </Button>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredScores.map((score) => (
          <Card key={score.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-start justify-between">
                <span className="line-clamp-1">{score.examName}</span>
              </CardTitle>
              <CardDescription className="line-clamp-2">{score.studentName}</CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-2" />
                  {new Date(score.date).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-2" />
                  {t.score || "Score"}: {score.score}
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2 flex justify-between">
              <Button variant="outline" onClick={() => handleEditScore(score)}>
                {t.view || "View"} 
              </Button>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleEditScore(score)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDeleteScore(score.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
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
