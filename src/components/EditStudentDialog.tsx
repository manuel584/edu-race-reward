
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { Student } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface EditStudentDialogProps {
  student: Student;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditStudentDialog: React.FC<EditStudentDialogProps> = ({
  student,
  open,
  onOpenChange,
}) => {
  const [name, setName] = useState(student.name);
  const [grade, setGrade] = useState(student.grade);
  const [nationality, setNationality] = useState(student.nationality);
  const [books, setBooks] = useState(student.books?.toString() || '0');
  
  const { updateStudent, grades, language } = useAppContext();
  const t = getTranslations(language);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast.error(t.nameRequired);
      return;
    }
    
    updateStudent(student.id, {
      name,
      grade,
      nationality,
      books: parseInt(books) || 0,
    });
    
    onOpenChange(false);
    toast.success(t.studentUpdated);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t.editStudent}</DialogTitle>
          <DialogDescription>
            {t.editStudentDescription}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">{t.name}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.enterStudentName}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="grade">{t.grade}</Label>
              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger id="grade">
                  <SelectValue placeholder={t.selectGrade} />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="nationality">{t.nationality}</Label>
              <Select value={nationality} onValueChange={setNationality}>
                <SelectTrigger id="nationality">
                  <SelectValue placeholder={t.selectNationality} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="national">{t.national}</SelectItem>
                  <SelectItem value="international">{t.international}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="books">{t.booksRead}</Label>
              <Input
                id="books"
                type="number"
                min="0"
                value={books}
                onChange={(e) => setBooks(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t.cancel}
            </Button>
            <Button type="submit">{t.save}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStudentDialog;
