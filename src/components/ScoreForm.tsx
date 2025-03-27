
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { StudentScore } from '@/types/student-score';
import { toast } from 'sonner';

interface ScoreFormProps {
  scoreToEdit?: StudentScore;
  onSuccess?: () => void;
}

export const ScoreForm: React.FC<ScoreFormProps> = ({ 
  scoreToEdit,
  onSuccess
}) => {
  const { language, addScore, updateScore } = useAppContext();
  const t = getTranslations(language);
  
  const [studentName, setStudentName] = useState(scoreToEdit?.studentName || '');
  const [examName, setExamName] = useState(scoreToEdit?.examName || '');
  const [score, setScore] = useState(scoreToEdit?.score.toString() || '');
  const [date, setDate] = useState(
    scoreToEdit?.date 
      ? new Date(scoreToEdit.date).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0]
  );
  
  const [errors, setErrors] = useState({
    studentName: false,
    examName: false,
    score: false
  });
  
  const validateInputs = () => {
    const newErrors = {
      studentName: studentName.trim() === '',
      examName: examName.trim() === '',
      score: score.trim() === '' || isNaN(Number(score)) || Number(score) < 0 || Number(score) > 100
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInputs()) {
      return;
    }
    
    const scoreData: Omit<StudentScore, 'id'> = {
      studentName: studentName.trim(),
      examName: examName.trim(),
      score: Number(score),
      date: new Date(date).toISOString()
    };
    
    if (scoreToEdit) {
      updateScore(scoreToEdit.id, scoreData);
      toast.success(t.scoreUpdated || "Score updated successfully");
    } else {
      addScore(scoreData);
      toast.success(t.scoreAdded || "Score added successfully");
    }
    
    if (onSuccess) {
      onSuccess();
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
      <div className="space-y-2">
        <Label htmlFor="studentName">
          {t.studentName || "Student Name"} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="studentName"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder={t.enterStudentName || "Enter student name"}
          className={errors.studentName ? "border-red-500" : ""}
        />
        {errors.studentName && (
          <p className="text-sm text-red-500">{t.studentNameRequired || "Student name is required"}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="examName">
          {t.examName || "Exam Name"} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="examName"
          value={examName}
          onChange={(e) => setExamName(e.target.value)}
          placeholder={t.enterExamName || "Enter exam name"}
          className={errors.examName ? "border-red-500" : ""}
        />
        {errors.examName && (
          <p className="text-sm text-red-500">{t.examNameRequired || "Exam name is required"}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="score">
          {t.score || "Score"} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="score"
          type="number"
          min="0"
          max="100"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          placeholder={t.enterScore || "Enter score (0-100)"}
          className={errors.score ? "border-red-500" : ""}
        />
        {errors.score && (
          <p className="text-sm text-red-500">{t.validScoreRequired || "Please enter a valid score (0-100)"}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="date">
          {t.date || "Date"}
        </Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      
      <div className="flex justify-end pt-2">
        <Button type="submit">
          {scoreToEdit ? (t.updateScore || "Update Score") : (t.addScore || "Add Score")}
        </Button>
      </div>
    </form>
  );
};
