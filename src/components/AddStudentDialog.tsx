
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { StudentForm } from "@/components/StudentForm";
import { getTranslations } from '@/lib/i18n';
import { useAppContext } from '@/context/AppContext';

interface AddStudentDialogProps {
  children?: React.ReactNode;
}

const AddStudentDialog: React.FC<AddStudentDialogProps> = ({ children }) => {
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
            <UserPlus className="h-4 w-4" />
            {t.addStudent || "Add Student"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t.addStudent || "Add Student"}</DialogTitle>
        </DialogHeader>
        <StudentForm />
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentDialog;
