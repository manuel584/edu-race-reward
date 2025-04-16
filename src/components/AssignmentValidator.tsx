
import React from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { AssignmentValidation } from '@/types/teacherAssignment';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface AssignmentValidatorProps {
  validation: AssignmentValidation;
  language: string;
}

const AssignmentValidator: React.FC<AssignmentValidatorProps> = ({ validation, language }) => {
  const getWorkloadColor = () => {
    switch (validation.workloadStatus) {
      case 'overloaded': return 'bg-red-500';
      case 'heavy': return 'bg-orange-500';
      case 'light': return 'bg-blue-500';
      default: return 'bg-green-500';
    }
  };

  const getWorkloadPercentage = () => {
    switch (validation.workloadStatus) {
      case 'overloaded': return 100;
      case 'heavy': return 85;
      case 'light': return 40;
      default: return 70;
    }
  };

  return (
    <div className="space-y-4">
      <Progress 
        value={getWorkloadPercentage()} 
        className={`h-2 ${getWorkloadColor()}`}
      />
      
      {validation.conflicts.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {validation.conflicts.join('. ')}
          </AlertDescription>
        </Alert>
      )}
      
      {validation.conflicts.length === 0 && (
        <Alert variant="default" className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-700">
            {language === 'en' 
              ? 'Assignment is valid with no conflicts'
              : 'التعيين صالح وبدون تعارضات'
            }
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AssignmentValidator;
