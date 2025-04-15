
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Student } from '@/lib/studentData';

interface EditStudentDialogProps {
  student: Student;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditStudentDialog: React.FC<EditStudentDialogProps> = ({ 
  student,
  open,
  onOpenChange 
}) => {
  const [formData, setFormData] = useState({
    name: student.name,
    grade: student.grade,
    nationality: student.nationality
  });
  
  const { updateStudent, language } = useAppContext();
  const t = getTranslations(language);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error(t.nameRequired || "Name is required");
      return;
    }
    
    updateStudent(student.id, {
      ...student,
      ...formData
    });
    
    toast.success(t.studentUpdated || "Student updated successfully");
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {t.editStudent || "Edit Student"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="name">
              {t.name || "Name"}
            </label>
            <input
              id="name"
              name="name"
              className="w-full px-3 py-2 border rounded-md"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="grade">
              {t.grade || "Grade"}
            </label>
            <input
              id="grade"
              name="grade"
              className="w-full px-3 py-2 border rounded-md"
              value={formData.grade}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="nationality">
              {t.nationality || "Nationality"}
            </label>
            <select
              id="nationality"
              name="nationality"
              className="w-full px-3 py-2 border rounded-md"
              value={formData.nationality}
              onChange={handleInputChange}
            >
              <option value="local">{t.local || "Local"}</option>
              <option value="international">{t.international || "International"}</option>
            </select>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              {t.cancel || "Cancel"}
            </Button>
            <Button type="submit">
              {t.save || "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStudentDialog;
