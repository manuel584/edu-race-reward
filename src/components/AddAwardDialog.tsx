
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Award } from 'lucide-react';
import { toast } from 'sonner';

interface AddAwardDialogProps {
  studentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddAwardDialog: React.FC<AddAwardDialogProps> = ({ 
  studentId,
  open,
  onOpenChange
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState('0');
  
  const { addAward, language } = useAppContext();
  const t = getTranslations(language);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error(t.titleRequired || "Title is required");
      return;
    }
    
    // Add the award
    addAward({
      id: `award-${Date.now()}`,
      studentId,
      title,
      description,
      date: new Date().toISOString(),
      points: parseInt(points) || 0
    });
    
    // Show success message
    toast.success(
      language === 'en' 
        ? `Award added successfully`
        : `تمت إضافة الجائزة بنجاح`
    );
    
    // Reset form and close dialog
    setTitle('');
    setDescription('');
    setPoints('0');
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            {t.addAchievement || "Add Achievement"}
          </DialogTitle>
          <DialogDescription>
            {t.addAchievementDesc || "Record a new achievement or award for this student"}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t.title || "Title"} *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.achievementTitle || "Achievement title"}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">{t.description || "Description"}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.achievementDescription || "Describe the achievement"}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="points">{t.points || "Points"}</Label>
            <Input
              id="points"
              type="number"
              min="0"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
            />
            <p className="text-sm text-gray-500">
              {t.pointsExplanation || "Points awarded for this achievement (0 if none)"}
            </p>
          </div>
          
          <DialogFooter className="pt-4">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              {t.cancel || "Cancel"}
            </Button>
            <Button type="submit">
              {t.addAward || "Add Award"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAwardDialog;
