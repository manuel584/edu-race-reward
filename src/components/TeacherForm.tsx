
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Teacher, TeacherQualification } from '@/types/teacher';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { Plus, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { generateUUID } from '@/lib/uuid';
import { Badge } from '@/components/ui/badge';
import { DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface TeacherFormProps {
  teacher?: Teacher | null;
  onSubmit: (data: Partial<Teacher>) => void;
}

const TeacherForm: React.FC<TeacherFormProps> = ({ teacher, onSubmit }) => {
  const { language } = useAppContext();
  const t = getTranslations(language);
  
  const [newSubject, setNewSubject] = useState<string>('');
  const [teacherQualifications, setTeacherQualifications] = useState<TeacherQualification[]>(
    teacher?.qualifications || []
  );

  // Sample subject list - this would come from your context in a real implementation
  const subjectOptions = [
    'Mathematics', 'English', 'Science', 'History', 'Geography', 
    'Physics', 'Chemistry', 'Biology', 'Art', 'Music', 'Physical Education',
    'Foreign Languages', 'Computer Science', 'Economics', 'Social Studies'
  ];
  
  // Sample department list
  const departmentOptions = [
    'Science', 'Mathematics', 'Languages', 'Humanities', 'Arts', 'Physical Education'
  ];

  // Sample initial form data
  const defaultValues = {
    name: teacher?.name || '',
    email: teacher?.email || '',
    department: teacher?.department || '',
    maxWeeklyHours: teacher?.maxWeeklyHours || 30,
    status: teacher?.status || 'active',
  };
  
  const form = useForm({
    defaultValues,
  });
  
  const handleFormSubmit = (data: any) => {
    const teacherData: Partial<Teacher> = {
      ...data,
      subjects: teacher?.subjects || [],
      qualifications: teacherQualifications,
    };
    
    onSubmit(teacherData);
  };
  
  const handleAddSubject = () => {
    if (newSubject && !teacher?.subjects.includes(newSubject)) {
      onSubmit({
        ...teacher as Teacher,
        subjects: [...(teacher?.subjects || []), newSubject]
      });
      setNewSubject('');
    }
  };
  
  const handleRemoveSubject = (subjectToRemove: string) => {
    onSubmit({
      ...teacher as Teacher,
      subjects: (teacher?.subjects || []).filter(subject => subject !== subjectToRemove)
    });
  };
  
  const handleAddQualification = () => {
    setTeacherQualifications(prev => [
      ...prev,
      {
        subject: '',
        level: 'Beginner',
        yearsOfExperience: 0,
        certifications: []
      }
    ]);
  };
  
  const handleRemoveQualification = (index: number) => {
    setTeacherQualifications(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleUpdateQualification = (index: number, field: string, value: any) => {
    setTeacherQualifications(prev => prev.map((qual, i) => 
      i === index ? { ...qual, [field]: value } : qual
    ));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{language === 'en' ? 'Full Name' : 'الاسم الكامل'}</FormLabel>
              <FormControl>
                <Input {...field} required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{language === 'en' ? 'Email' : 'البريد الإلكتروني'}</FormLabel>
              <FormControl>
                <Input {...field} type="email" required />
              </FormControl>
              <FormDescription>
                {language === 'en' 
                  ? 'This will be used for login and communications' 
                  : 'سيتم استخدامه لتسجيل الدخول والتواصل'}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{language === 'en' ? 'Department' : 'القسم'}</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'en' ? 'Select department' : 'اختر القسم'} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {departmentOptions.map(dept => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
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
          name="maxWeeklyHours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{language === 'en' ? 'Maximum Weekly Hours' : 'الحد الأقصى للساعات الأسبوعية'}</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  min="1"
                  max="40"
                  {...field} 
                  onChange={e => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{language === 'en' ? 'Status' : 'الحالة'}</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">
                    {language === 'en' ? 'Active' : 'نشط'}
                  </SelectItem>
                  <SelectItem value="inactive">
                    {language === 'en' ? 'Inactive' : 'غير نشط'}
                  </SelectItem>
                  <SelectItem value="on-leave">
                    {language === 'en' ? 'On Leave' : 'في إجازة'}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <Label>{language === 'en' ? 'Teaching Subjects' : 'المواد التدريسية'}</Label>
          
          <div className="flex flex-wrap gap-2 mb-2">
            {(teacher?.subjects || []).map((subject, index) => (
              <Badge 
                key={index}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {subject}
                <Button 
                  type="button"
                  variant="ghost" 
                  size="sm"
                  className="h-5 w-5 p-0 text-muted-foreground"
                  onClick={() => handleRemoveSubject(subject)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Select
              value={newSubject}
              onValueChange={setNewSubject}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder={language === 'en' ? 'Select a subject' : 'اختر مادة'} />
              </SelectTrigger>
              <SelectContent>
                {subjectOptions
                  .filter(subject => !(teacher?.subjects || []).includes(subject))
                  .map(subject => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
            <Button 
              type="button"
              variant="outline"
              onClick={handleAddSubject}
              disabled={!newSubject}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>{language === 'en' ? 'Qualifications' : 'المؤهلات'}</Label>
            <Button 
              type="button"
              variant="outline" 
              size="sm"
              onClick={handleAddQualification}
            >
              <Plus className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Add Qualification' : 'إضافة مؤهل'}
            </Button>
          </div>
          
          {teacherQualifications.map((qualification, index) => (
            <div 
              key={index}
              className="border p-4 rounded-md space-y-3 relative"
            >
              <Button
                type="button"
                variant="ghost" 
                size="sm"
                className="absolute right-2 top-2 text-muted-foreground"
                onClick={() => handleRemoveQualification(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>{language === 'en' ? 'Subject' : 'المادة'}</Label>
                  <Select
                    value={qualification.subject}
                    onValueChange={(value) => handleUpdateQualification(index, 'subject', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'en' ? 'Select subject' : 'اختر المادة'} />
                    </SelectTrigger>
                    <SelectContent>
                      {subjectOptions.map(subject => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>{language === 'en' ? 'Level' : 'المستوى'}</Label>
                  <Select
                    value={qualification.level}
                    onValueChange={(value) => handleUpdateQualification(index, 'level', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">
                        {language === 'en' ? 'Beginner' : 'مبتدئ'}
                      </SelectItem>
                      <SelectItem value="Intermediate">
                        {language === 'en' ? 'Intermediate' : 'متوسط'}
                      </SelectItem>
                      <SelectItem value="Advanced">
                        {language === 'en' ? 'Advanced' : 'متقدم'}
                      </SelectItem>
                      <SelectItem value="Expert">
                        {language === 'en' ? 'Expert' : 'خبير'}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>{language === 'en' ? 'Years of Experience' : 'سنوات الخبرة'}</Label>
                  <Input
                    type="number"
                    min="0"
                    value={qualification.yearsOfExperience}
                    onChange={(e) => 
                      handleUpdateQualification(index, 'yearsOfExperience', Number(e.target.value))
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>{language === 'en' ? 'Certifications' : 'الشهادات'}</Label>
                  <Textarea
                    placeholder={language === 'en' 
                      ? 'List certifications, one per line' 
                      : 'اذكر الشهادات، واحدة في كل سطر'
                    }
                    value={(qualification.certifications || []).join('\n')}
                    onChange={(e) => 
                      handleUpdateQualification(
                        index, 
                        'certifications', 
                        e.target.value.split('\n').filter(cert => cert.trim().length > 0)
                      )
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button type="submit">
            {teacher 
              ? (language === 'en' ? 'Update Teacher' : 'تحديث المعلم') 
              : (language === 'en' ? 'Add Teacher' : 'إضافة معلم')
            }
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default TeacherForm;
