
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { generatePassword } from '@/lib/utils'; // Verify this import
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserRole } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface AddUserFormProps {
  onSubmit: (userData: any) => void;
  onCancel?: () => void;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onSubmit, onCancel }) => {
  const { language } = useAppContext();
  const t = getTranslations(language);
  const { toast } = useToast();
  
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: 'teacher' as UserRole,
    password: '',
    department: '',
    subjects: '',
    assignedClasses: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRoleChange = (value: UserRole) => {
    setUserData(prev => ({ ...prev, role: value }));
  };
  
  const handleGeneratePassword = () => {
    const newPassword = generatePassword(12);
    setUserData(prev => ({ ...prev, password: newPassword }));
    toast({
      title: language === 'en' ? 'Password Generated' : 'تم إنشاء كلمة المرور',
      description: language === 'en' ? 'A secure password has been generated.' : 'تم إنشاء كلمة مرور آمنة.',
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!userData.name || !userData.email || !userData.password) {
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'Please fill in all required fields.' : 'يرجى ملء جميع الحقول المطلوبة.',
        variant: 'destructive',
      });
      return;
    }
    
    // Process the form data
    const formattedData = {
      ...userData,
      subjects: userData.subjects ? userData.subjects.split(',').map(s => s.trim()) : [],
      assignedClasses: userData.assignedClasses ? userData.assignedClasses.split(',').map(c => c.trim()) : [],
    };
    
    onSubmit(formattedData);
  };
  
  const roleNames = {
    admin: language === 'en' ? 'Administrator' : 'مدير النظام',
    supervisor: language === 'en' ? 'Supervisor' : 'مشرف',
    counselor: language === 'en' ? 'Counselor' : 'مرشد طلابي',
    teacher: language === 'en' ? 'Teacher' : 'معلم',
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">
          {language === 'en' ? 'Full Name' : 'الاسم الكامل'}*
        </Label>
        <Input
          id="name"
          name="name"
          value={userData.name}
          onChange={handleChange}
          placeholder={language === 'en' ? 'Enter full name' : 'أدخل الاسم الكامل'}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">
          {language === 'en' ? 'Email Address' : 'البريد الإلكتروني'}*
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={userData.email}
          onChange={handleChange}
          placeholder={language === 'en' ? 'Enter email address' : 'أدخل البريد الإلكتروني'}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="role">
          {language === 'en' ? 'Role' : 'الدور'}*
        </Label>
        <Select
          value={userData.role}
          onValueChange={(value) => handleRoleChange(value as UserRole)}
        >
          <SelectTrigger>
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
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="password">
            {language === 'en' ? 'Password' : 'كلمة المرور'}*
          </Label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={handleGeneratePassword}
          >
            {language === 'en' ? 'Generate' : 'إنشاء'}
          </Button>
        </div>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={userData.password}
            onChange={handleChange}
            placeholder={language === 'en' ? 'Enter password' : 'أدخل كلمة المرور'}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? 
              (language === 'en' ? 'Hide' : 'إخفاء') : 
              (language === 'en' ? 'Show' : 'إظهار')}
          </Button>
        </div>
      </div>
      
      {userData.role === 'teacher' || userData.role === 'supervisor' ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="department">
              {language === 'en' ? 'Department' : 'القسم'}
            </Label>
            <Input
              id="department"
              name="department"
              value={userData.department}
              onChange={handleChange}
              placeholder={language === 'en' ? 'Enter department' : 'أدخل القسم'}
            />
          </div>
          
          {userData.role === 'teacher' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="subjects">
                  {language === 'en' ? 'Subjects' : 'المواد'}
                </Label>
                <Input
                  id="subjects"
                  name="subjects"
                  value={userData.subjects}
                  onChange={handleChange}
                  placeholder={language === 'en' ? 'Enter subjects (comma separated)' : 'أدخل المواد (مفصولة بفواصل)'}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="assignedClasses">
                  {language === 'en' ? 'Assigned Classes' : 'الفصول المعينة'}
                </Label>
                <Input
                  id="assignedClasses"
                  name="assignedClasses"
                  value={userData.assignedClasses}
                  onChange={handleChange}
                  placeholder={language === 'en' ? 'Enter assigned classes (comma separated)' : 'أدخل الفصول المعينة (مفصولة بفواصل)'}
                />
              </div>
            </>
          )}
        </>
      ) : null}
      
      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            {language === 'en' ? 'Cancel' : 'إلغاء'}
          </Button>
        )}
        <Button type="submit">
          {language === 'en' ? 'Add User' : 'إضافة مستخدم'}
        </Button>
      </div>
    </form>
  );
};

export default AddUserForm;
