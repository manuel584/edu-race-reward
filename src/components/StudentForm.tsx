
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAppContext, Student } from '@/context/AppContext';
import { toast } from 'sonner';
import { getTranslations } from '@/lib/i18n';

type StudentFormValues = {
  name: string;
  points: number;
  attendance: number;
  booksOwned: number;
  engagementScore: number;
};

interface StudentFormProps {
  onSuccess: () => void;
  initialData?: Omit<Student, 'id' | 'pointsHistory'>;
  isEditing?: boolean;
}

const StudentForm: React.FC<StudentFormProps> = ({ 
  onSuccess, 
  initialData = { 
    name: '', 
    points: 0, 
    attendance: 0, 
    booksOwned: 0, 
    engagementScore: 0 
  },
  isEditing = false
}) => {
  const { addStudent, language } = useAppContext();
  const t = getTranslations(language);
  
  const form = useForm<StudentFormValues>({
    defaultValues: initialData
  });

  const onSubmit = (data: StudentFormValues) => {
    addStudent({
      name: data.name,
      points: Number(data.points),
      attendance: Number(data.attendance),
      booksOwned: Number(data.booksOwned),
      engagementScore: Number(data.engagementScore)
    });
    
    toast.success(isEditing ? t.studentUpdated : t.studentAdded);
    onSuccess();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.studentName}</FormLabel>
              <FormControl>
                <Input placeholder={t.studentName} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="points"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.points}</FormLabel>
              <FormControl>
                <Input type="number" min="0" {...field} />
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
              <FormLabel>{t.attendance}</FormLabel>
              <FormControl>
                <Input type="number" min="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="booksOwned"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.books}</FormLabel>
              <FormControl>
                <Input type="number" min="0" {...field} />
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
              <FormLabel>{t.engagement}</FormLabel>
              <FormControl>
                <Input type="number" min="0" max="100" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onSuccess}>
            {t.cancel}
          </Button>
          <Button type="submit">
            {isEditing ? t.update : t.save}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default StudentForm;
