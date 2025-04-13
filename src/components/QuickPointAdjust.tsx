
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/hooks/useAuth';
import { getTranslations } from '@/lib/i18n';
import { Plus, Minus } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [selectedSubject, setSelectedSubject] = useState('');
  const { updateStudentPoints, language } = useAppContext();
  const { user } = useAuth();
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
      
  // Subject options
  const subjects = [
    'Math',
    'Science',
    'English',
    'History',
    'Art',
    'Physical Education',
    'Music',
    'Computer Science',
    'Foreign Language',
    'Other'
  ];

  // Handle point adjustment
  const handlePointAdjustment = (reason: string) => {
    if (!selectedSubject) {
      toast.error(t.selectSubject || "Please select a subject");
      return;
    }
    
    const change = isAdd ? 1 : -1;
    updateStudentPoints(studentId, change, reason, user?.id, selectedSubject);
    setIsOpen(false);
    setSelectedSubject('');
    
    const message = isAdd
      ? `Added 1 point to ${studentName}`
      : `Deducted 1 point from ${studentName}`;
    
    toast.success(`${message} for ${reason} (${selectedSubject})`);
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
        <h4 className="text-sm font-medium mb-2">{t.selectSubject || "Select Subject"}</h4>
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="mb-3">
            <SelectValue placeholder={t.selectSubject || "Select subject"} />
          </SelectTrigger>
          <SelectContent>
            {subjects.map(subject => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <h4 className="text-sm font-medium mb-2">{t.selectReason || "Select Reason"}</h4>
        <div className="grid grid-cols-1 gap-2">
          {reasons.map(reason => (
            <Button 
              key={reason.id} 
              variant="outline"
              size="sm"
              className="justify-start"
              onClick={() => handlePointAdjustment(reason.label)}
              disabled={!selectedSubject}
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
