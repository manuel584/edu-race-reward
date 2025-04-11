
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getTranslations } from '@/lib/i18n';
import { useAppContext } from '@/context/AppContext';
import { ExamForm } from '@/components/ExamForm';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface CreateExamDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

const CreateExamDialog: React.FC<CreateExamDialogProps> = ({ 
  open,
  onOpenChange,
  trigger
}) => {
  const { language } = useAppContext();
  const t = getTranslations(language);

  const handleSuccess = () => {
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  // If controlled mode (open and onOpenChange provided)
  if (typeof open !== 'undefined' && onOpenChange) {
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
  }

  // If uncontrolled mode (trigger provided)
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2" data-create-exam>
            <PlusCircle className="h-4 w-4" />
            {t.createExam || "Create Exam"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{t.createExam || "Create Exam"}</DialogTitle>
        </DialogHeader>
        <ExamForm onSuccess={() => {}} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateExamDialog;
