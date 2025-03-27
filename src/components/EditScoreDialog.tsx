
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getTranslations } from '@/lib/i18n';
import { useAppContext } from '@/context/AppContext';
import { ScoreForm } from '@/components/ScoreForm';
import { StudentScore } from '@/types/student-score';

interface EditScoreDialogProps {
  score: StudentScore | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditScoreDialog: React.FC<EditScoreDialogProps> = ({ 
  score,
  open,
  onOpenChange
}) => {
  const { language } = useAppContext();
  const t = getTranslations(language);

  if (!score) return null;

  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t.editScore || "Edit Score"}</DialogTitle>
        </DialogHeader>
        <ScoreForm scoreToEdit={score} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default EditScoreDialog;
