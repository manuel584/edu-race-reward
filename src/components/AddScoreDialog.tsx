
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getTranslations } from '@/lib/i18n';
import { useAppContext } from '@/context/AppContext';
import { ScoreForm } from '@/components/ScoreForm';

interface AddScoreDialogProps {
  children?: React.ReactNode;
}

const AddScoreDialog: React.FC<AddScoreDialogProps> = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const { language } = useAppContext();
  const t = getTranslations(language);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t.addScore || "Add Score"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t.addScore || "Add Score"}</DialogTitle>
        </DialogHeader>
        <ScoreForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default AddScoreDialog;
