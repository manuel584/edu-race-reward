
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { useAuth } from '@/hooks/useAuth';
import { Student } from '@/context/AppContext';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface NominationDialogProps {
  student: Student;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NominationDialog: React.FC<NominationDialogProps> = ({
  student,
  open,
  onOpenChange,
}) => {
  const [type, setType] = useState<'helpfulness' | 'respect' | 'teamwork' | 'excellence'>('helpfulness');
  const [description, setDescription] = useState('');
  
  const { addRecognition, language } = useAppContext();
  const { user } = useAuth();
  const t = getTranslations(language);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description) {
      toast.error(t.descriptionRequired);
      return;
    }
    
    addRecognition(student.id, {
      date: format(new Date(), 'yyyy-MM-dd'),
      type,
      description,
      givenBy: user?.name,
      isNomination: true
    });
    
    setType('helpfulness');
    setDescription('');
    onOpenChange(false);
    
    toast.success(t.nominationAdded);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t.nominateStudent}</DialogTitle>
          <DialogDescription>
            {t.nominateStudentDescription}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="type">{t.recognitionType}</Label>
              <Select value={type} onValueChange={(value: 'helpfulness' | 'respect' | 'teamwork' | 'excellence') => setType(value)}>
                <SelectTrigger id="type">
                  <SelectValue placeholder={t.selectRecognitionType} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="helpfulness">{t.helpfulness}</SelectItem>
                  <SelectItem value="respect">{t.respect}</SelectItem>
                  <SelectItem value="teamwork">{t.teamwork}</SelectItem>
                  <SelectItem value="excellence">{t.excellence}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">{t.description}</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t.nominationDescriptionPlaceholder}
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t.cancel}
            </Button>
            <Button type="submit">{t.nominate}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NominationDialog;
