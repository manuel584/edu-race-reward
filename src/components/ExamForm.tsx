
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Exam, Question, QuestionType } from '@/types/student-score';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import QuestionEditor from './QuestionEditor';
import { PlusCircle } from 'lucide-react';

interface ExamFormProps {
  examToEdit?: Exam;
  onSuccess?: () => void;
}

export const ExamForm: React.FC<ExamFormProps> = ({ 
  examToEdit,
  onSuccess
}) => {
  const { language, addExam, updateExam } = useAppContext();
  const t = getTranslations(language);
  
  const [title, setTitle] = useState(examToEdit?.title || '');
  const [description, setDescription] = useState(examToEdit?.description || '');
  const [type, setType] = useState<'quiz' | 'exam' | 'test'>(examToEdit?.type || 'quiz');
  const [duration, setDuration] = useState(examToEdit?.duration?.toString() || '30');
  const [questions, setQuestions] = useState<Question[]>(examToEdit?.questions || []);
  
  const [errors, setErrors] = useState({
    title: false,
    duration: false,
    questions: false
  });
  
  const validateInputs = () => {
    const newErrors = {
      title: title.trim() === '',
      duration: duration.trim() === '' || isNaN(Number(duration)) || Number(duration) <= 0,
      questions: questions.length === 0
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };
  
  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      text: '',
      type: 'multiple-choice',
      points: 1,
      options: ['', ''],
      correctAnswer: ''
    };
    
    setQuestions([...questions, newQuestion]);
  };
  
  const handleUpdateQuestion = (updatedQuestion: Question) => {
    setQuestions(questions.map(q => 
      q.id === updatedQuestion.id ? updatedQuestion : q
    ));
  };
  
  const handleRemoveQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInputs()) {
      return;
    }
    
    const examData: Omit<Exam, 'id' | 'createdAt'> = {
      title: title.trim(),
      description: description.trim(),
      type,
      totalPoints: questions.reduce((sum, q) => sum + q.points, 0),
      duration: Number(duration),
      questions,
    };
    
    if (examToEdit) {
      updateExam?.(examToEdit.id, examData);
      toast.success(t.examUpdated || "Exam updated successfully");
    } else {
      addExam?.(examData);
      toast.success(t.examAdded || "Exam created successfully");
    }
    
    if (onSuccess) {
      onSuccess();
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
      <div className="space-y-2">
        <Label htmlFor="title">
          {t.examTitle || "Exam Title"} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t.enterExamTitle || "Enter exam title"}
          className={errors.title ? "border-red-500" : ""}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{t.titleRequired || "Title is required"}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">
          {t.description || "Description"}
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t.enterDescription || "Enter exam description"}
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">
            {t.examType || "Exam Type"}
          </Label>
          <Select value={type} onValueChange={(value: 'quiz' | 'exam' | 'test') => setType(value)}>
            <SelectTrigger id="type">
              <SelectValue placeholder={t.selectType || "Select exam type"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="quiz">{t.quiz || "Quiz"}</SelectItem>
              <SelectItem value="exam">{t.exam || "Exam"}</SelectItem>
              <SelectItem value="test">{t.test || "Test"}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="duration">
            {t.duration || "Duration (minutes)"} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="duration"
            type="number"
            min="1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder={t.enterDuration || "Enter duration in minutes"}
            className={errors.duration ? "border-red-500" : ""}
          />
          {errors.duration && (
            <p className="text-sm text-red-500">{t.validDurationRequired || "Please enter a valid duration"}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{t.questions || "Questions"}</h3>
          <Button type="button" variant="outline" size="sm" onClick={handleAddQuestion} className="flex items-center gap-1">
            <PlusCircle className="h-4 w-4" />
            {t.addQuestion || "Add Question"}
          </Button>
        </div>
        
        {errors.questions && (
          <p className="text-sm text-red-500">{t.addAtLeastOneQuestion || "Add at least one question"}</p>
        )}
        
        <div className="space-y-6">
          {questions.map((question, index) => (
            <QuestionEditor
              key={question.id}
              question={question}
              index={index}
              onUpdate={handleUpdateQuestion}
              onRemove={handleRemoveQuestion}
            />
          ))}
          
          {questions.length === 0 && (
            <div className="text-center py-8 border border-dashed rounded-md">
              <p className="text-gray-500">{t.noQuestionsAdded || "No questions added yet"}</p>
              <Button type="button" variant="link" onClick={handleAddQuestion} className="mt-2">
                {t.addYourFirstQuestion || "Add your first question"}
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end pt-4">
        <Button type="submit">
          {examToEdit ? (t.updateExam || "Update Exam") : (t.createExam || "Create Exam")}
        </Button>
      </div>
    </form>
  );
};
