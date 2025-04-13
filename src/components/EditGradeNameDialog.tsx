
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit2 } from 'lucide-react';
import { toast } from 'sonner';

interface EditGradeNameDialogProps {
  gradeName: string;
  children?: React.ReactNode;
}

const EditGradeNameDialog: React.FC<EditGradeNameDialogProps> = ({ 
  gradeName,
  children 
}) => {
  const [open, setOpen] = useState(false);
  const [newGradeName, setNewGradeName] = useState(gradeName);
  const { updateGradeName, language } = useAppContext();
  const t = getTranslations(language);
  
  const handleSave = () => {
    if (!newGradeName.trim()) {
      toast.error(t.gradeNameRequired || "Grade name is required");
      return;
    }
    
    updateGradeName(gradeName, newGradeName);
    toast.success(
      language === 'en' 
        ? `Grade name updated from "${gradeName}" to "${newGradeName}"`
        : `تم تحديث اسم الصف من "${gradeName}" إلى "${newGradeName}"`
    );
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Edit2 className="h-4 w-4" />
            <span>{t.edit || "Edit"}</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {language === 'en' ? "Edit Grade Name" : "تعديل اسم الصف"}
          </DialogTitle>
          <DialogDescription>
            {language === 'en' 
              ? "This will update the grade name for all students in this grade."
              : "سيؤدي هذا إلى تحديث اسم الصف لجميع الطلاب في هذا الصف."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {language === 'en' ? "Grade Name" : "اسم الصف"}
            </label>
            <Input 
              value={newGradeName}
              onChange={(e) => setNewGradeName(e.target.value)}
              placeholder={language === 'en' ? "Enter grade name" : "أدخل اسم الصف"}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t.cancel || "Cancel"}
          </Button>
          <Button onClick={handleSave}>
            {t.save || "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditGradeNameDialog;
