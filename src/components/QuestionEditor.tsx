
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Question, QuestionType } from '@/types/student-score';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Trash2, PlusCircle, GripVertical } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

interface QuestionEditorProps {
  question: Question;
  index: number;
  onUpdate: (question: Question) => void;
  onRemove: (id: string) => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  index,
  onUpdate,
  onRemove
}) => {
  const { language } = useAppContext();
  const t = getTranslations(language);
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({
      ...question,
      text: e.target.value
    });
  };
  
  const handleTypeChange = (type: QuestionType) => {
    let updatedQuestion: Question = {
      ...question,
      type
    };
    
    // Reset options and correctAnswer based on question type
    if (type === 'multiple-choice') {
      updatedQuestion.options = question.options?.length ? question.options : ['', ''];
      updatedQuestion.correctAnswer = '';
    } else if (type === 'true-false') {
      updatedQuestion.options = ['True', 'False'];
      updatedQuestion.correctAnswer = 'True';
    } else {
      updatedQuestion.options = undefined;
      updatedQuestion.correctAnswer = '';
    }
    
    onUpdate(updatedQuestion);
  };
  
  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const points = parseInt(e.target.value) || 1;
    onUpdate({
      ...question,
      points: Math.max(1, points)
    });
  };
  
  const handleOptionChange = (index: number, value: string) => {
    if (!question.options) return;
    
    const newOptions = [...question.options];
    newOptions[index] = value;
    
    onUpdate({
      ...question,
      options: newOptions
    });
  };
  
  const handleAddOption = () => {
    if (!question.options) return;
    
    onUpdate({
      ...question,
      options: [...question.options, '']
    });
  };
  
  const handleRemoveOption = (index: number) => {
    if (!question.options || question.options.length <= 2) return;
    
    const newOptions = [...question.options];
    newOptions.splice(index, 1);
    
    // Adjust correctAnswer if needed
    let newCorrectAnswer = question.correctAnswer;
    if (Array.isArray(newCorrectAnswer)) {
      newCorrectAnswer = newCorrectAnswer.filter(ans => parseInt(ans) !== index)
        .map(ans => {
          const ansIndex = parseInt(ans);
          return ansIndex > index ? (ansIndex - 1).toString() : ans;
        });
    } else if (newCorrectAnswer === index.toString()) {
      newCorrectAnswer = '';
    } else if (parseInt(newCorrectAnswer as string) > index) {
      newCorrectAnswer = (parseInt(newCorrectAnswer as string) - 1).toString();
    }
    
    onUpdate({
      ...question,
      options: newOptions,
      correctAnswer: newCorrectAnswer
    });
  };
  
  const handleCorrectAnswerChange = (value: string | string[]) => {
    onUpdate({
      ...question,
      correctAnswer: value
    });
  };
  
  return (
    <Card className="border-gray-200">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <GripVertical className="h-5 w-5 text-gray-400" />
          <span className="font-semibold">
            {t.question || "Question"} {index + 1}
          </span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onRemove(question.id)}
          className="text-red-500 hover:text-red-600 -mt-1"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`question-${question.id}-text`}>
            {t.questionText || "Question Text"}
          </Label>
          <Textarea
            id={`question-${question.id}-text`}
            value={question.text}
            onChange={handleTextChange}
            placeholder={t.enterQuestionText || "Enter question text"}
            rows={2}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`question-${question.id}-type`}>
              {t.questionType || "Question Type"}
            </Label>
            <Select 
              value={question.type} 
              onValueChange={(value: QuestionType) => handleTypeChange(value)}
            >
              <SelectTrigger id={`question-${question.id}-type`}>
                <SelectValue placeholder={t.selectType || "Select question type"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="multiple-choice">{t.multipleChoice || "Multiple Choice"}</SelectItem>
                <SelectItem value="true-false">{t.trueFalse || "True/False"}</SelectItem>
                <SelectItem value="short-answer">{t.shortAnswer || "Short Answer"}</SelectItem>
                <SelectItem value="essay">{t.essay || "Essay"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`question-${question.id}-points`}>
              {t.points || "Points"}
            </Label>
            <Input
              id={`question-${question.id}-points`}
              type="number"
              min="1"
              value={question.points}
              onChange={handlePointsChange}
            />
          </div>
        </div>
        
        {(question.type === 'multiple-choice' || question.type === 'true-false') && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <Label>{t.options || "Options"}</Label>
              {question.type === 'multiple-choice' && (
                <div className="flex items-center gap-2">
                  <Label htmlFor={`question-${question.id}-allow-multiple`} className="text-sm">
                    {t.allowMultipleAnswers || "Allow multiple answers"}
                  </Label>
                  <Switch 
                    id={`question-${question.id}-allow-multiple`}
                    checked={Array.isArray(question.correctAnswer)}
                    onCheckedChange={(checked) => {
                      onUpdate({
                        ...question,
                        correctAnswer: checked ? [] : ''
                      });
                    }}
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              {question.options?.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center gap-3">
                  {Array.isArray(question.correctAnswer) ? (
                    <Checkbox 
                      checked={question.correctAnswer.includes(optionIndex.toString())}
                      onCheckedChange={(checked) => {
                        if (!Array.isArray(question.correctAnswer)) return;
                        
                        let newCorrectAnswers = [...question.correctAnswer];
                        if (checked) {
                          newCorrectAnswers.push(optionIndex.toString());
                        } else {
                          newCorrectAnswers = newCorrectAnswers.filter(a => a !== optionIndex.toString());
                        }
                        
                        handleCorrectAnswerChange(newCorrectAnswers);
                      }}
                    />
                  ) : (
                    <RadioGroup 
                      value={question.correctAnswer as string} 
                      onValueChange={handleCorrectAnswerChange}
                      className="flex"
                    >
                      <RadioGroupItem value={optionIndex.toString()} id={`question-${question.id}-option-${optionIndex}`} />
                    </RadioGroup>
                  )}
                  
                  <div className="flex-1">
                    <Input
                      value={option}
                      onChange={(e) => handleOptionChange(optionIndex, e.target.value)}
                      placeholder={`${t.option || "Option"} ${optionIndex + 1}`}
                      disabled={question.type === 'true-false'}
                    />
                  </div>
                  
                  {question.type === 'multiple-choice' && question.options.length > 2 && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemoveOption(optionIndex)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              
              {question.type === 'multiple-choice' && (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddOption}
                  className="mt-2"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  {t.addOption || "Add Option"}
                </Button>
              )}
            </div>
          </div>
        )}
        
        {(question.type === 'short-answer' || question.type === 'essay') && (
          <div className="space-y-2 pt-2">
            {question.type === 'short-answer' && (
              <>
                <Label htmlFor={`question-${question.id}-answer`}>
                  {t.correctAnswer || "Correct Answer"} ({t.forGrading || "for grading"})
                </Label>
                <Input
                  id={`question-${question.id}-answer`}
                  value={question.correctAnswer as string || ''}
                  onChange={(e) => handleCorrectAnswerChange(e.target.value)}
                  placeholder={t.enterCorrectAnswer || "Enter correct answer"}
                />
              </>
            )}
            
            {question.type === 'essay' && (
              <div className="text-sm text-gray-500 italic">
                {t.essayNoCorrectAnswer || "Essay questions require manual grading"}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionEditor;
