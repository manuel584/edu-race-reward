
import React, { useState } from 'react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { useAppContext, Student } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { toast } from 'sonner';

export interface StudentFormProps {
  onSubmit: (data: StudentFormData) => void;
  studentToEdit?: Student;
  onCancel?: () => void;
}

export interface StudentFormData {
  name: string;
  grade: string;
  nationality: 'international' | 'national';
  points: number;
  attendance: number;
  booksOwned: number;
  engagementScore: number;
  subjects: string[];
}

export const StudentForm: React.FC<StudentFormProps> = ({
  onSubmit,
  studentToEdit,
  onCancel
}) => {
  const { language } = useAppContext();
  const t = getTranslations(language);
  
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    studentToEdit?.subjects || []
  );
  
  const form = useForm<StudentFormData>({
    defaultValues: {
      name: studentToEdit?.name || '',
      grade: studentToEdit?.grade || '',
      nationality: studentToEdit?.nationality || 'national',
      points: studentToEdit?.points || 0,
      attendance: studentToEdit?.attendance || 0,
      booksOwned: studentToEdit?.booksOwned || 0,
      engagementScore: studentToEdit?.engagementScore || 0,
      subjects: studentToEdit?.subjects || [],
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
  
  const grades = [
    'Grade 1',
    'Grade 2',
    'Grade 3',
    'Grade 4',
    'Grade 5',
    'Grade 6',
    'Grade 7',
    'Grade 8',
    'Grade 9',
    'Grade 10',
    'Grade 11',
    'Grade 12'
  ];
  
  const handleSubjectToggle = (subject: string) => {
    setSelectedSubjects(prev => {
      const isSelected = prev.includes(subject);
      if (isSelected) {
        return prev.filter(s => s !== subject);
      } else {
        return [...prev, subject];
      }
    });
  };
  
  const handleFormSubmit = (data: StudentFormData) => {
    try {
      // Add the selected subjects to the form data
      data.subjects = selectedSubjects;
      
      // Validate numeric fields
      if (isNaN(data.points)) data.points = 0;
      if (isNaN(data.attendance)) data.attendance = 0;
      if (isNaN(data.booksOwned)) data.booksOwned = 0;
      if (isNaN(data.engagementScore)) data.engagementScore = 0;
      
      // Ensure attendance is between 0-10
      data.attendance = Math.max(0, Math.min(10, data.attendance));
      
      // Ensure engagementScore is between 0-10
      data.engagementScore = Math.max(0, Math.min(10, data.engagementScore));
      
      onSubmit(data);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(t.errorSubmittingForm || 'Error submitting form');
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.studentName || 'Student Name'}</FormLabel>
              <FormControl>
                <Input placeholder={t.studentName || 'Enter student name'} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.grade || 'Grade'}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t.selectGrade || 'Select Grade'} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {grades.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {grade}
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
            name="nationality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.nationality || 'Nationality'}</FormLabel>
                <Select
                  onValueChange={field.onChange as (value: string) => void}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t.selectNationality || 'Select Nationality'} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="national">{t.national || 'National'}</SelectItem>
                    <SelectItem value="international">{t.international || 'International'}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="points"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.points || 'Points'}</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    {...field} 
                    onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="attendance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.attendance || 'Attendance'} (0-10)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    min="0" 
                    max="10" 
                    {...field} 
                    onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="booksOwned"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.books || 'Books Owned'}</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    min="0" 
                    {...field} 
                    onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="engagementScore"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.engagement || 'Engagement Score'} (0-10)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    min="0" 
                    max="10" 
                    {...field} 
                    onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div>
          <Label>{t.subjects || 'Subjects'}</Label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {availableSubjects.map((subject) => (
              <div key={subject} className="flex items-center space-x-2">
                <Checkbox 
                  id={`subject-${subject}`} 
                  checked={selectedSubjects.includes(subject)}
                  onCheckedChange={() => handleSubjectToggle(subject)}
                />
                <label htmlFor={`subject-${subject}`} className="text-sm cursor-pointer">
                  {subject}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              {t.cancel || 'Cancel'}
            </Button>
          )}
          <Button type="submit">
            {studentToEdit ? (t.updateStudent || 'Update Student') : (t.addStudent || 'Add Student')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default StudentForm;
