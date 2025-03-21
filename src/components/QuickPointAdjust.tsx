
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { Plus, Minus } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface QuickPointAdjustProps {
  studentId: string;
  studentName: string;
  isAdd: boolean;
}

const QuickPointAdjust: React.FC<QuickPointAdjustProps> = ({ 
  studentId, 
  studentName,
  isAdd
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { updateStudentPoints, language } = useAppContext();
  const t = getTranslations(language);
  
  // Reasons for point adjustments
  const reasons = isAdd 
    ? [
        { id: 'attendance', label: t.attendanceReason },
        { id: 'participation', label: t.participationReason },
        { id: 'homework', label: t.homeworkReason },
        { id: 'test', label: t.testResultReason },
      ]
    : [
        { id: 'absence', label: t.absenceReason },
        { id: 'misbehavior', label: t.misbehaviorReason },
        { id: 'incomplete', label: t.incompleteWorkReason },
        { id: 'late', label: t.lateSubmissionReason },
      ];

  // Handle point adjustment
  const handlePointAdjustment = (reason: string) => {
    const change = isAdd ? 1 : -1;
    updateStudentPoints(studentId, change, reason);
    setIsOpen(false);
    
    const message = isAdd
      ? `Added 1 point to ${studentName}`
      : `Deducted 1 point from ${studentName}`;
    
    toast.success(`${message} for ${reason}`);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`flex-1 items-center justify-center gap-1 ${
            isAdd ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'
          }`}
        >
          {isAdd ? (
            <Plus className="h-4 w-4" />
          ) : (
            <Minus className="h-4 w-4" />
          )}
          <span>{isAdd ? t.quickAdd : t.quickDeduct}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-3">
        <h4 className="text-sm font-medium mb-2">{t.selectReason}</h4>
        <div className="grid grid-cols-1 gap-2">
          {reasons.map(reason => (
            <Button 
              key={reason.id} 
              variant="outline"
              size="sm"
              className="justify-start"
              onClick={() => handlePointAdjustment(reason.label)}
            >
              {reason.label}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default QuickPointAdjust;
