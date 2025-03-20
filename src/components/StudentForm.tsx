
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppContext, Student } from '@/context/AppContext';
import { toast } from 'sonner';
import { getTranslations } from '@/lib/i18n';
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type StudentFormValues = {
  name: string;
  points: number;
  attendance: number;
  booksOwned: number;
  engagementScore: number;
  nationality: 'international' | 'national';
  grade: string;
  subjects: string[];
};

// Available grades
const grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];

// Available subjects
const subjects = ['Math', 'Science', 'English', 'History', 'Geography', 'Art', 'Music', 'Physical Education', 'Computer Science'];

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
    engagementScore: 0,
    nationality: 'national',
    grade: 'Grade 1',
    subjects: [],
  },
  isEditing = false
}) => {
  const { addStudent, updateStudent, language } = useAppContext();
  const t = getTranslations(language);
  
  const form = useForm<StudentFormValues>({
    defaultValues: initialData
  });

  const [selectedSubjects, setSelectedSubjects] = React.useState<string[]>(initialData.subjects || []);

  const onSubmit = (data: StudentFormValues) => {
    const studentData = {
      ...data,
      subjects: selectedSubjects,
    };

    if (isEditing && initialData && 'id' in initialData) {
      updateStudent((initialData as any).id, studentData);
    } else {
      addStudent(studentData);
    }
    
    toast.success(isEditing ? t.studentUpdated : t.studentAdded);
    onSuccess();
  };

  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">{t.basicInfo}</TabsTrigger>
            <TabsTrigger value="academic">{t.academicInfo}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 pt-4">
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
              name="nationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.nationality}</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t.selectNationality} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="national">{t.national}</SelectItem>
                      <SelectItem value="international">{t.international}</SelectItem>
                    </SelectContent>
                  </Select>
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
          </TabsContent>
          
          <TabsContent value="academic" className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.grade}</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t.selectGrade} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {grades.map(grade => (
                        <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <Label>{t.subjects}</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {subjects.map(subject => (
                  <div key={subject} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`subject-${subject}`}
                      checked={selectedSubjects.includes(subject)}
                      onChange={() => toggleSubject(subject)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={`subject-${subject}`} className="text-sm">{subject}</label>
                  </div>
                ))}
              </div>
            </div>
            
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
          </TabsContent>
        </Tabs>
        
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
