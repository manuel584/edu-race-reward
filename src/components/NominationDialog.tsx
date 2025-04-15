
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Student } from '@/lib/studentData';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Award, ThumbsUp, Users, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface NominationDialogProps {
  student: Student;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NominationDialog: React.FC<NominationDialogProps> = ({ 
  student,
  open, 
  onOpenChange 
}) => {
  const [type, setType] = useState<'helpfulness' | 'respect' | 'teamwork' | 'excellence'>('helpfulness');
  const [description, setDescription] = useState('');
  
  const { addRecognition, language } = useAppContext();
  const t = getTranslations(language);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      toast.error(t.descriptionRequired || "Description is required");
      return;
    }
    
    // Add recognition
    addRecognition({
      studentId: student.id,
      date: new Date().toISOString(),
      type,
      description,
      isNomination: true
    });
    
    // Show success message
    toast.success(
      language === 'en' 
        ? `Student nominated for ${type} successfully`
        : `تم ترشيح الطالب لـ ${type} بنجاح`
    );
    
    // Reset form and close dialog
    setDescription('');
    setType('helpfulness');
    onOpenChange(false);
  };
  
  const typeIcons = {
    helpfulness: <ThumbsUp className="h-4 w-4" />,
    respect: <Users className="h-4 w-4" />,
    teamwork: <Users className="h-4 w-4" />,
    excellence: <Sparkles className="h-4 w-4" />
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            {t.nominateStudent || "Nominate Student"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-3">
            <Label>{t.nominationType || "Nomination Type"}</Label>
            <RadioGroup value={type} onValueChange={(value) => setType(value as any)} className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="helpfulness" id="helpfulness" />
                <Label htmlFor="helpfulness" className="flex items-center gap-2 cursor-pointer">
                  <ThumbsUp className="h-4 w-4" />
                  {t.helpfulness || "Helpfulness"}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="respect" id="respect" />
                <Label htmlFor="respect" className="flex items-center gap-2 cursor-pointer">
                  <Users className="h-4 w-4" />
                  {t.respect || "Respect"}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="teamwork" id="teamwork" />
                <Label htmlFor="teamwork" className="flex items-center gap-2 cursor-pointer">
                  <Users className="h-4 w-4" />
                  {t.teamwork || "Teamwork"}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excellence" id="excellence" />
                <Label htmlFor="excellence" className="flex items-center gap-2 cursor-pointer">
                  <Sparkles className="h-4 w-4" />
                  {t.excellence || "Excellence"}
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">
              {t.description || "Description"} *
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.nominationReason || "Reason for nomination"}
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              {t.cancel || "Cancel"}
            </Button>
            <Button type="submit">
              {t.submitNomination || "Submit Nomination"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NominationDialog;
