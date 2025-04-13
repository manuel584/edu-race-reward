
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { UserRole } from '@/hooks/useAuth';
import { generatePassword } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type UserType = {
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  subjects?: string[];
  assignedClasses?: string[];
  permissions?: string[];
  status?: 'active' | 'inactive' | 'pending';
};

interface AddUserFormProps {
  onAddUser: (user: UserType) => void;
  allSubjects: string[];
  allClasses: string[];
}

const AddUserForm = ({ onAddUser, allSubjects, allClasses }: AddUserFormProps) => {
  const { language } = useAppContext();
  const t = getTranslations(language);
  const [formData, setFormData] = useState<UserType>({
    name: '',
    email: '',
    role: 'teacher',
    subjects: [],
    assignedClasses: [],
    permissions: [],
  });
  const [password, setPassword] = useState('');
  const [sendEmailInvite, setSendEmailInvite] = useState(true);
  const [forcePasswordChange, setForcePasswordChange] = useState(true);
  const [subjectsOpen, setSubjectsOpen] = useState(false);
  const [classesOpen, setClassesOpen] = useState(false);
  
  // Generate a random password when form is initially rendered
  React.useEffect(() => {
    const generatedPassword = generatePassword(10);
    setPassword(generatedPassword);
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRoleChange = (role: UserRole) => {
    setFormData(prev => ({ ...prev, role }));
  };
  
  const toggleSubject = (subject: string) => {
    setFormData(prev => {
      const subjects = prev.subjects || [];
      if (subjects.includes(subject)) {
        return { ...prev, subjects: subjects.filter(s => s !== subject) };
      } else {
        return { ...prev, subjects: [...subjects, subject] };
      }
    });
  };
  
  const toggleClass = (className: string) => {
    setFormData(prev => {
      const classes = prev.assignedClasses || [];
      if (classes.includes(className)) {
        return { ...prev, assignedClasses: classes.filter(c => c !== className) };
      } else {
        return { ...prev, assignedClasses: [...classes, className] };
      }
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddUser({
      ...formData,
      status: sendEmailInvite ? 'pending' : 'active',
    });
  };
  
  const generateNewPassword = () => {
    const generatedPassword = generatePassword(10);
    setPassword(generatedPassword);
  };
  
  const roleNames = {
    admin: language === 'en' ? 'Administrator' : 'مدير النظام',
    supervisor: language === 'en' ? 'Supervisor' : 'مشرف',
    counselor: language === 'en' ? 'Counselor' : 'مرشد طلابي',
    teacher: language === 'en' ? 'Teacher' : 'معلم',
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">
          {language === 'en' ? 'Full Name' : 'الاسم الكامل'}
        </Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder={language === 'en' ? 'Enter full name' : 'أدخل الاسم الكامل'}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">
          {language === 'en' ? 'Email Address' : 'البريد الإلكتروني'}
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={language === 'en' ? 'Enter email address' : 'أدخل البريد الإلكتروني'}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="role">
          {language === 'en' ? 'User Role' : 'دور المستخدم'}
        </Label>
        <Select value={formData.role} onValueChange={(value) => handleRoleChange(value as UserRole)}>
          <SelectTrigger id="role">
            <SelectValue placeholder={language === 'en' ? 'Select role' : 'اختر الدور'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">{roleNames.admin}</SelectItem>
            <SelectItem value="supervisor">{roleNames.supervisor}</SelectItem>
            <SelectItem value="counselor">{roleNames.counselor}</SelectItem>
            <SelectItem value="teacher">{roleNames.teacher}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {formData.role === 'supervisor' && (
        <div className="space-y-2">
          <Label htmlFor="department">
            {language === 'en' ? 'Department' : 'القسم'}
          </Label>
          <Input
            id="department"
            name="department"
            value={formData.department || ''}
            onChange={handleChange}
            placeholder={language === 'en' ? 'Enter department' : 'أدخل القسم'}
          />
        </div>
      )}
      
      {formData.role === 'teacher' && (
        <>
          <div className="space-y-2">
            <Label>
              {language === 'en' ? 'Subjects' : 'المواد'}
            </Label>
            <Popover open={subjectsOpen} onOpenChange={setSubjectsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={subjectsOpen}
                  className="w-full justify-between"
                >
                  {formData.subjects && formData.subjects.length > 0
                    ? `${formData.subjects.length} ${language === 'en' ? 'selected' : 'محدد'}`
                    : language === 'en' ? 'Select subjects' : 'اختر المواد'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder={language === 'en' ? 'Search subjects...' : 'البحث عن المواد...'} />
                  <CommandEmpty>
                    {language === 'en' ? 'No subject found.' : 'لم يتم العثور على مادة.'}
                  </CommandEmpty>
                  <CommandGroup>
                    <ScrollArea className="h-60">
                      {allSubjects.map((subject) => (
                        <CommandItem
                          key={subject}
                          value={subject}
                          onSelect={() => toggleSubject(subject)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.subjects?.includes(subject)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {subject}
                        </CommandItem>
                      ))}
                    </ScrollArea>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            
            {formData.subjects && formData.subjects.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.subjects.map(subject => (
                  <Badge 
                    key={subject} 
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => toggleSubject(subject)}
                  >
                    {subject} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label>
              {language === 'en' ? 'Assigned Classes' : 'الفصول المعينة'}
            </Label>
            <Popover open={classesOpen} onOpenChange={setClassesOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={classesOpen}
                  className="w-full justify-between"
                >
                  {formData.assignedClasses && formData.assignedClasses.length > 0
                    ? `${formData.assignedClasses.length} ${language === 'en' ? 'selected' : 'محدد'}`
                    : language === 'en' ? 'Select classes' : 'اختر الفصول'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder={language === 'en' ? 'Search classes...' : 'البحث عن الفصول...'} />
                  <CommandEmpty>
                    {language === 'en' ? 'No class found.' : 'لم يتم العثور على فصل.'}
                  </CommandEmpty>
                  <CommandGroup>
                    <ScrollArea className="h-60">
                      {allClasses.map((className) => (
                        <CommandItem
                          key={className}
                          value={className}
                          onSelect={() => toggleClass(className)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.assignedClasses?.includes(className)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {className}
                        </CommandItem>
                      ))}
                    </ScrollArea>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            
            {formData.assignedClasses && formData.assignedClasses.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.assignedClasses.map(className => (
                  <Badge 
                    key={className} 
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => toggleClass(className)}
                  >
                    {className} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="password">
          {language === 'en' ? 'Initial Password' : 'كلمة المرور الأولية'}
        </Label>
        <div className="flex gap-2">
          <Input
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1"
            readOnly
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={generateNewPassword}
          >
            {language === 'en' ? 'Regenerate' : 'إعادة إنشاء'}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {language === 'en' 
            ? 'This password will be used for the initial login' 
            : 'سيتم استخدام كلمة المرور هذه لتسجيل الدخول الأولي'}
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="sendInvite"
            checked={sendEmailInvite}
            onCheckedChange={(checked) => setSendEmailInvite(!!checked)}
          />
          <Label htmlFor="sendInvite" className="text-sm font-normal">
            {language === 'en' 
              ? 'Send email invitation to user' 
              : 'إرسال دعوة بالبريد الإلكتروني للمستخدم'}
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="forceChange"
            checked={forcePasswordChange}
            onCheckedChange={(checked) => setForcePasswordChange(!!checked)}
          />
          <Label htmlFor="forceChange" className="text-sm font-normal">
            {language === 'en' 
              ? 'Force password change on first login' 
              : 'فرض تغيير كلمة المرور عند تسجيل الدخول الأول'}
          </Label>
        </div>
      </div>
      
      <div className="pt-4 flex justify-end space-x-2">
        <Button type="submit">
          {language === 'en' ? 'Create User' : 'إنشاء مستخدم'}
        </Button>
      </div>
    </form>
  );
};

export default AddUserForm;
