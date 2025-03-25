
import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getTranslations } from '@/lib/i18n';
import { ExamScore } from '@/context/AppContext';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';

interface ExamScoreFormProps {
  onSubmit: (data: ExamScoreFormData) => void;
  examToEdit?: ExamScore;
  onCancel?: () => void;
  language: 'en' | 'ar';
}

export interface ExamScoreFormData {
  examName: string;
  score: number;
  totalPossible: number;
  date: Date;
  subject: string;
}

export const ExamScoreForm: React.FC<ExamScoreFormProps> = ({
  onSubmit,
  examToEdit,
  onCancel,
  language
}) => {
  const t = getTranslations(language);
  
  // Create schema for form validation
  const formSchema = z.object({
    examName: z.string().min(1, { message: "Exam name is required" }),
    score: z.number().min(0),
    totalPossible: z.number().min(1),
    date: z.date(),
    subject: z.string().min(1, { message: "Subject is required" }),
  }).refine(data => data.score <= data.totalPossible, {
    message: t.scoreValidation,
    path: ["score"],
  });

  // Initialize form with default values or values from examToEdit
  const form = useForm<ExamScoreFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: examToEdit
      ? {
          examName: examToEdit.examName,
          score: examToEdit.score,
          totalPossible: examToEdit.totalPossible,
          date: new Date(examToEdit.date),
          subject: examToEdit.subject,
        }
      : {
          examName: '',
          score: 0,
          totalPossible: 100,
          date: new Date(),
          subject: '',
        },
  });
  
  const availableSubjects = [
    'Math',
    'Science',
    'English',
    'Arabic',
    'Social Studies',
    'Physical Education',
    'Art',
    'Music',
    'Computer Science',
    'Religious Studies'
  ];
  
  const handleFormSubmit = (data: ExamScoreFormData) => {
    try {
      if (data.score > data.totalPossible) {
        toast.error(t.scoreValidation);
        return;
      }
      
      onSubmit(data);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(t.error);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="examName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.examName}</FormLabel>
              <FormControl>
                <Input placeholder={t.examName} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.subject}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t.subject} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableSubjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t.date}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="score"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.score}</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0"
                    {...field} 
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="totalPossible"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.totalPossible}</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1"
                    {...field} 
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              {t.cancel}
            </Button>
          )}
          <Button type="submit">
            {examToEdit ? t.editExamScore : t.addExamScore}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ExamScoreForm;
