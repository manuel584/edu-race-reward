
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getTranslations } from '@/lib/i18n';
import { useAppContext } from '@/context/AppContext';
import { ExamForm } from '@/components/ExamForm';

interface CreateExamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateExamDialog: React.FC<CreateExamDialogProps> = ({ 
  open,
  onOpenChange
}) => {
  const { language } = useAppContext();
  const t = getTranslations(language);

  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{t.createExam || "Create Exam"}</DialogTitle>
        </DialogHeader>
        <ExamForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateExamDialog;
