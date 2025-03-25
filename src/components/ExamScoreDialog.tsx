
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAppContext, ExamScore } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import ExamScoreForm, { ExamScoreFormData } from './ExamScoreForm';
import { toast } from 'sonner';

interface ExamScoreDialogProps {
  studentId: string;
  examToEdit?: ExamScore;
  onSuccess?: () => void;
}

const ExamScoreDialog: React.FC<ExamScoreDialogProps> = ({ 
  studentId, 
  examToEdit,
  onSuccess
}) => {
  const { language, addExamScore, updateExamScore } = useAppContext();
  const t = getTranslations(language);
  const [open, setOpen] = React.useState(false);
  
  const handleSubmit = (data: ExamScoreFormData) => {
    if (examToEdit) {
      // Edit existing exam score
      updateExamScore(studentId, examToEdit.id, {
        examName: data.examName,
        score: data.score,
        totalPossible: data.totalPossible,
        date: data.date.toISOString(),
        subject: data.subject,
      });
      
      toast.success(`${t.examName} ${data.examName} ${t.edit} ${t.success}`);
    } else {
      // Add new exam score
      addExamScore(studentId, {
        examName: data.examName,
        score: data.score,
        totalPossible: data.totalPossible,
        date: data.date.toISOString(),
        subject: data.subject,
      });
      
      toast.success(`${t.examName} ${data.examName} ${t.addExamScore} ${t.success}`);
    }
    
    setOpen(false);
    
    if (onSuccess) {
      onSuccess();
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {examToEdit ? (
          <Button variant="outline" size="sm">
            {t.edit}
          </Button>
        ) : (
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t.addExamScore}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {examToEdit ? t.editExamScore : t.addExamScore}
          </DialogTitle>
          <DialogDescription>
            {examToEdit 
              ? `${t.edit} ${t.score} ${t.for} ${t.student}`
              : `${t.add} ${t.new} ${t.score} ${t.for} ${t.student}`}
          </DialogDescription>
        </DialogHeader>
        
        <ExamScoreForm
          onSubmit={handleSubmit}
          examToEdit={examToEdit}
          onCancel={() => setOpen(false)}
          language={language}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ExamScoreDialog;
