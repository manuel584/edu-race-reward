
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Edit, Trash2, Users, FileText } from 'lucide-react';
import { Exam } from '@/types/student-score';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import CreateExamDialog from './CreateExamDialog';

interface ExamListProps {
  filter: 'all' | 'upcoming' | 'archived';
}

const ExamList: React.FC<ExamListProps> = ({ filter }) => {
  const { language, exams = [], deleteExam } = useAppContext();
  const t = getTranslations(language);
  const navigate = useNavigate();
  const [isCreateExamDialogOpen, setIsCreateExamDialogOpen] = useState(false);
  
  // Filter exams based on the selected tab
  const filteredExams = exams;
  
  const handleDeleteExam = (id: string) => {
    if (window.confirm(t.confirmDelete || "Are you sure you want to delete this exam?")) {
      deleteExam?.(id);
      toast.success(t.examDeleted || "Exam deleted successfully");
    }
  };
  
  if (!exams || exams.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
        <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">{t.noExamsYet || "No exams created yet"}</h3>
        <p className="text-gray-500 max-w-md mx-auto mb-6">{t.noExamsDescription || "Start by creating your first exam to manage quizzes and track student performance."}</p>
        <Button onClick={() => setIsCreateExamDialogOpen(true)}>
          {t.createExam || "Create Exam"}
        </Button>
        <CreateExamDialog
          open={isCreateExamDialogOpen}
          onOpenChange={setIsCreateExamDialogOpen}
        />
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredExams.map((exam) => (
        <Card key={exam.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-start justify-between">
              <span className="line-clamp-1">{exam.title}</span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                exam.type === 'quiz' ? 'bg-blue-100 text-blue-800' : 
                exam.type === 'exam' ? 'bg-purple-100 text-purple-800' : 
                'bg-green-100 text-green-800'
              }`}>
                {exam.type}
              </span>
            </CardTitle>
            <CardDescription className="line-clamp-2">{exam.description}</CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-2" />
                {exam.duration} {t.minutes || "minutes"}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Users className="h-4 w-4 mr-2" />
                {t.questions || "Questions"}: {exam.questions.length}
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-2 flex justify-between">
            <Button variant="outline" onClick={() => navigate(`/exam/${exam.id}`)}>
              {t.view || "View"} 
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => navigate(`/exam/${exam.id}/edit`)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleDeleteExam(exam.id)}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ExamList;
