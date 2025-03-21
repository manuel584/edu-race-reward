
import React, { useState } from 'react';
import { PlusCircle, MinusCircle, X } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { Button } from './ui/button';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from 'sonner';

interface QuickPointAdjustProps {
  studentId: string;
  studentName: string;
  isAdd?: boolean;
}

const QuickPointAdjust: React.FC<QuickPointAdjustProps> = ({ 
  studentId, 
  studentName,
  isAdd = true 
}) => {
  const { updateStudentPoints, language } = useAppContext();
  const [open, setOpen] = useState(false);
  const t = getTranslations(language);

  // Define preset reasons and point values
  const presetReasons = isAdd 
    ? [
        { reason: t.attendanceReason, points: 5 },
        { reason: t.participationReason, points: 3 },
        { reason: t.homeworkReason, points: 4 },
        { reason: t.testResultReason, points: 10 }
      ]
    : [
        { reason: t.absenceReason, points: 5 },
        { reason: t.misbehaviorReason, points: 3 },
        { reason: t.incompleteWorkReason, points: 4 },
        { reason: t.lateSubmissionReason, points: 2 }
      ];

  const handleAdjustPoints = (points: number, reason: string) => {
    const pointsToAdjust = isAdd ? points : -points;
    updateStudentPoints(studentId, pointsToAdjust, reason);
    
    const message = isAdd 
      ? `Added ${points} points to ${studentName}` 
      : `Deducted ${points} points from ${studentName}`;
    
    toast.success(message);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant={isAdd ? "default" : "outline"} 
          size="sm"
          className={isAdd ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-200 hover:bg-gray-300 text-gray-700"}
        >
          {isAdd ? <PlusCircle className="h-4 w-4 mr-1" /> : <MinusCircle className="h-4 w-4 mr-1" />}
          {isAdd ? t.quickAdd : t.quickDeduct}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium">{t.selectReason}</h3>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2">
          {presetReasons.map((preset, index) => (
            <Button 
              key={index}
              variant="outline" 
              size="sm"
              className="w-full justify-between"
              onClick={() => handleAdjustPoints(preset.points, preset.reason)}
            >
              <span>{preset.reason}</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {isAdd ? '+' : '-'}{preset.points}
              </span>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default QuickPointAdjust;
