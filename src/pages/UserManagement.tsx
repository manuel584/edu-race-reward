
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';
import { Home, Users, UserPlus, Search, Trash2, PencilLine } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { UserRole } from '@/hooks/useAuth';

type UserType = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  subjects?: string[];
  assignedClasses?: string[];
};

const UserManagement = () => {
  const { language } = useAppContext();
  const t = getTranslations(language);
  const [searchTerm, setSearchTerm] = useState('');
  const [userList, setUserList] = useState<UserType[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@school.edu',
      role: 'admin',
    },
    {
      id: '2',
      name: 'Maria Garcia',
      email: 'maria.garcia@school.edu',
      role: 'supervisor',
      department: 'Science',
    },
    {
      id: '3',
      name: 'Ahmed Ali',
      email: 'ahmed.ali@school.edu',
      role: 'teacher',
      subjects: ['Math', 'Physics'],
      assignedClasses: ['5A', '6B'],
    },
    {
      id: '4',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@school.edu',
      role: 'counselor',
    },
    {
      id: '5',
      name: 'عمر عبدالمنعم',
      email: 'omar@school.edu',
      role: 'teacher',
      subjects: ['العلوم', 'الرياضيات'],
      assignedClasses: ['5A', '5B', '6A'],
    },
  ]);

  // Filter users based on search term
  const filteredUsers = userList.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // User role display names
  const roleNames = {
    admin: language === 'en' ? 'Administrator' : 'مدير النظام',
    supervisor: language === 'en' ? 'Supervisor' : 'مشرف',
    counselor: language === 'en' ? 'Counselor' : 'مرشد طلابي',
    teacher: language === 'en' ? 'Teacher' : 'معلم',
  };

  // Generate breadcrumb items
  const breadcrumbItems = [
    { label: t.home || 'Home', path: '/', icon: <Home className="h-4 w-4" /> },
    { label: t.userManagement || 'User Management' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="page-container">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-3xl font-display font-bold text-foreground">
              {t.userManagement || 'User Management'}
            </h1>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mt-4 md:mt-0">
                  <UserPlus className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'Add New User' : 'إضافة مستخدم جديد'}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {language === 'en' ? 'Add New User' : 'إضافة مستخدم جديد'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">
                      {language === 'en' ? 'Name' : 'الاسم'}
                    </label>
                    <Input placeholder={language === 'en' ? 'Full name' : 'الاسم الكامل'} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">
                      {language === 'en' ? 'Email' : 'البريد الإلكتروني'}
                    </label>
                    <Input placeholder={language === 'en' ? 'Email address' : 'عنوان البريد الإلكتروني'} type="email" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">
                      {language === 'en' ? 'Role' : 'الدور'}
                    </label>
                    <Select defaultValue="teacher">
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
                    <label className="text-sm font-medium leading-none">
                      {language === 'en' ? 'Password' : 'كلمة المرور'}
                    </label>
                    <Input placeholder={language === 'en' ? 'Password' : 'كلمة المرور'} type="password" />
                  </div>
                  <div className="pt-4 flex justify-end space-x-2">
                    <Button>
                      {language === 'en' ? 'Create User' : 'إنشاء مستخدم'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={language === 'en' ? 'Search users...' : 'البحث عن المستخدمين...'}
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'en' ? 'Name' : 'الاسم'}</TableHead>
                    <TableHead>{language === 'en' ? 'Email' : 'البريد الإلكتروني'}</TableHead>
                    <TableHead>{language === 'en' ? 'Role' : 'الدور'}</TableHead>
                    <TableHead>{language === 'en' ? 'Details' : 'التفاصيل'}</TableHead>
                    <TableHead className="text-right">{language === 'en' ? 'Actions' : 'الإجراءات'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={
                            user.role === 'admin' ? 'destructive' : 
                            user.role === 'supervisor' ? 'default' : 
                            user.role === 'counselor' ? 'outline' : 
                            'secondary'
                          }>
                            {roleNames[user.role]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.department && (
                            <div className="text-sm text-muted-foreground">
                              {language === 'en' ? 'Department: ' : 'القسم: '}{user.department}
                            </div>
                          )}
                          {user.subjects && user.subjects.length > 0 && (
                            <div className="text-sm text-muted-foreground">
                              {language === 'en' ? 'Subjects: ' : 'المواد: '}{user.subjects.join(', ')}
                            </div>
                          )}
                          {user.assignedClasses && user.assignedClasses.length > 0 && (
                            <div className="text-sm text-muted-foreground">
                              {language === 'en' ? 'Classes: ' : 'الفصول: '}{user.assignedClasses.join(', ')}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              <PencilLine className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-500">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        {language === 'en' ? 'No users found.' : 'لم يتم العثور على مستخدمين.'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default UserManagement;
