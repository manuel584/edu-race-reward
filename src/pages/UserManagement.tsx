
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';
import { Home, Users, UserPlus, Search, Trash2, PencilLine, Edit, Key, BookOpen, GraduationCap, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { UserRole } from '@/hooks/useAuth';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import TeacherAssignmentMatrix from '@/components/TeacherAssignmentMatrix';
import AddUserForm from '@/components/AddUserForm';
import UserPermissionsForm from '@/components/UserPermissionsForm';

type UserType = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  subjects?: string[];
  assignedClasses?: string[];
  permissions?: string[];
  lastLogin?: string;
  status?: 'active' | 'inactive' | 'pending';
};

const UserManagement = () => {
  const { language } = useAppContext();
  const t = getTranslations(language);
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);
  const [userList, setUserList] = useState<UserType[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@school.edu',
      role: 'admin',
      status: 'active',
      lastLogin: '2023-04-10',
      permissions: ['manage_users', 'view_all_students', 'edit_all_students']
    },
    {
      id: '2',
      name: 'Maria Garcia',
      email: 'maria.garcia@school.edu',
      role: 'supervisor',
      department: 'Science',
      status: 'active',
      lastLogin: '2023-04-12',
      permissions: ['view_department_students', 'view_department_classes']
    },
    {
      id: '3',
      name: 'Ahmed Ali',
      email: 'ahmed.ali@school.edu',
      role: 'teacher',
      subjects: ['Math', 'Physics'],
      assignedClasses: ['5A', '6B'],
      status: 'active',
      lastLogin: '2023-04-11',
      permissions: ['view_assigned_students', 'grade_exams']
    },
    {
      id: '4',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@school.edu',
      role: 'counselor',
      status: 'active',
      lastLogin: '2023-04-09',
      permissions: ['view_all_students', 'view_student_behavior']
    },
    {
      id: '5',
      name: 'عمر عبدالمنعم',
      email: 'omar@school.edu',
      role: 'teacher',
      subjects: ['العلوم', 'الرياضيات'],
      assignedClasses: ['5A', '5B', '6A'],
      status: 'active',
      lastLogin: '2023-04-13',
      permissions: ['view_assigned_students', 'grade_exams']
    },
    {
      id: '6',
      name: 'David Chen',
      email: 'david.chen@school.edu',
      role: 'teacher',
      subjects: ['English', 'History'],
      assignedClasses: ['7A', '8B'],
      status: 'inactive',
      lastLogin: '2023-03-15',
      permissions: ['view_assigned_students']
    },
    {
      id: '7',
      name: 'Fatima Al-Zahrani',
      email: 'fatima.z@school.edu',
      role: 'teacher',
      subjects: ['Arabic', 'Islamic Studies'],
      assignedClasses: ['4A', '4B', '5C'],
      status: 'active',
      lastLogin: '2023-04-10',
      permissions: ['view_assigned_students', 'grade_exams']
    },
    {
      id: '8',
      name: 'James Wilson',
      email: 'james.w@school.edu',
      role: 'teacher',
      status: 'pending',
      permissions: []
    },
  ]);

  const [allSubjects] = useState([
    'Math', 'Physics', 'Chemistry', 'Biology', 'English', 'Arabic', 
    'History', 'Geography', 'Islamic Studies', 'Computer Science', 
    'Physical Education', 'Art', 'Music', 'الرياضيات', 'العلوم'
  ]);

  const [allClasses] = useState([
    '1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', 
    '5A', '5B', '5C', '6A', '6B', '7A', '7B', '8A', '8B'
  ]);

  // Filter users based on search term
  const filteredUsers = userList.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Teachers only
  const teachers = userList.filter(user => user.role === 'teacher');

  // User role display names
  const roleNames = {
    admin: language === 'en' ? 'Administrator' : 'مدير النظام',
    supervisor: language === 'en' ? 'Supervisor' : 'مشرف',
    counselor: language === 'en' ? 'Counselor' : 'مرشد طلابي',
    teacher: language === 'en' ? 'Teacher' : 'معلم',
  };

  // Status display with colors
  const statusDisplay = (status?: string) => {
    if (!status) return null;
    
    let variant: "default" | "destructive" | "outline" | "secondary" = "default";
    let label = status;
    
    if (status === 'active') {
      variant = "default";
      label = language === 'en' ? 'Active' : 'نشط';
    } else if (status === 'inactive') {
      variant = "secondary";
      label = language === 'en' ? 'Inactive' : 'غير نشط';
    } else if (status === 'pending') {
      variant = "outline";
      label = language === 'en' ? 'Pending' : 'قيد الانتظار';
    }
    
    return <Badge variant={variant}>{label}</Badge>;
  };

  // Generate breadcrumb items
  const breadcrumbItems = [
    { label: t.home || 'Home', path: '/', icon: <Home className="h-4 w-4" /> },
    { label: t.userManagement || 'User Management' },
  ];

  // Handle adding a new user
  const handleAddUser = (newUser: UserType) => {
    setUserList(prev => [
      ...prev, 
      { ...newUser, id: (prev.length + 1).toString(), status: 'active' }
    ]);
    
    toast({
      title: language === 'en' ? "User Created" : "تم إنشاء المستخدم",
      description: language === 'en' 
        ? `${newUser.name} has been added successfully` 
        : `تم إضافة ${newUser.name} بنجاح`,
    });
  };

  // Handle user deletion
  const handleDeleteUser = (userId: string) => {
    setUserList(prev => prev.filter(user => user.id !== userId));
    
    toast({
      title: language === 'en' ? "User Deleted" : "تم حذف المستخدم",
      description: language === 'en' 
        ? "The user has been removed from the system" 
        : "تم إزالة المستخدم من النظام",
    });
  };

  // Handle user status change
  const handleStatusChange = (userId: string, newStatus: 'active' | 'inactive' | 'pending') => {
    setUserList(prev => prev.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
    
    toast({
      title: language === 'en' ? "Status Updated" : "تم تحديث الحالة",
      description: language === 'en' 
        ? "User status has been updated successfully" 
        : "تم تحديث حالة المستخدم بنجاح",
    });
  };

  // Reset password for a user
  const handleResetPassword = (userId: string) => {
    // In a real app, this would generate a new password or send a reset link
    setShowPasswordDialog(false);
    
    toast({
      title: language === 'en' ? "Password Reset" : "إعادة تعيين كلمة المرور",
      description: language === 'en' 
        ? "A password reset link has been sent to the user" 
        : "تم إرسال رابط إعادة تعيين كلمة المرور إلى المستخدم",
    });
  };

  // Update user permissions
  const handleUpdatePermissions = (user: UserType, permissions: string[]) => {
    setUserList(prev => prev.map(u => 
      u.id === user.id ? { ...u, permissions } : u
    ));
    
    setShowPermissionsDialog(false);
    
    toast({
      title: language === 'en' ? "Permissions Updated" : "تم تحديث الصلاحيات",
      description: language === 'en' 
        ? "User permissions have been updated successfully" 
        : "تم تحديث صلاحيات المستخدم بنجاح",
    });
  };

  // Update teacher's assigned classes
  const handleUpdateAssignments = (teacherId: string, classes: string[]) => {
    setUserList(prev => prev.map(user => 
      user.id === teacherId ? { ...user, assignedClasses: classes } : user
    ));
    
    toast({
      title: language === 'en' ? "Assignments Updated" : "تم تحديث التعيينات",
      description: language === 'en' 
        ? "Teacher class assignments have been updated" 
        : "تم تحديث تعيينات الفصول للمعلم",
    });
  };

  // Update teacher's subjects
  const handleUpdateSubjects = (teacherId: string, subjects: string[]) => {
    setUserList(prev => prev.map(user => 
      user.id === teacherId ? { ...user, subjects } : user
    ));
    
    toast({
      title: language === 'en' ? "Subjects Updated" : "تم تحديث المواد",
      description: language === 'en' 
        ? "Teacher subject assignments have been updated" 
        : "تم تحديث تعيينات المواد للمعلم",
    });
  };

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
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="users">
                <Users className="h-4 w-4 mr-2" />
                {language === 'en' ? 'All Users' : 'جميع المستخدمين'}
              </TabsTrigger>
              <TabsTrigger value="teachers">
                <GraduationCap className="h-4 w-4 mr-2" />
                {language === 'en' ? 'Teacher Assignments' : 'تعيينات المعلمين'}
              </TabsTrigger>
              <TabsTrigger value="permissions">
                <ShieldCheck className="h-4 w-4 mr-2" />
                {language === 'en' ? 'Permissions' : 'الصلاحيات'}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="space-y-4">
              <div className="flex justify-between mb-4">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={language === 'en' ? 'Search users...' : 'البحث عن المستخدمين...'}
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
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
                    <AddUserForm 
                      onAddUser={handleAddUser} 
                      allSubjects={allSubjects}
                      allClasses={allClasses}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            
              <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{language === 'en' ? 'Name' : 'الاسم'}</TableHead>
                        <TableHead>{language === 'en' ? 'Email' : 'البريد الإلكتروني'}</TableHead>
                        <TableHead>{language === 'en' ? 'Role' : 'الدور'}</TableHead>
                        <TableHead>{language === 'en' ? 'Status' : 'الحالة'}</TableHead>
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
                              {statusDisplay(user.status)}
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
                              {user.lastLogin && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  {language === 'en' ? 'Last login: ' : 'آخر تسجيل دخول: '}{user.lastLogin}
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="outline" size="sm" onClick={() => {
                                        setSelectedUser(user);
                                        setShowPermissionsDialog(true);
                                      }}>
                                        <ShieldCheck className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {language === 'en' ? 'Manage Permissions' : 'إدارة الصلاحيات'}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="outline" size="sm" onClick={() => {
                                        setSelectedUser(user);
                                        setShowPasswordDialog(true);
                                      }}>
                                        <Key className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {language === 'en' ? 'Reset Password' : 'إعادة تعيين كلمة المرور'}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="outline" size="sm">
                                        <PencilLine className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {language === 'en' ? 'Edit User' : 'تعديل المستخدم'}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="text-red-500"
                                        onClick={() => handleDeleteUser(user.id)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {language === 'en' ? 'Delete User' : 'حذف المستخدم'}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            {language === 'en' ? 'No users found.' : 'لم يتم العثور على مستخدمين.'}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="teachers" className="space-y-4">
              <TeacherAssignmentMatrix 
                teachers={teachers}
                allClasses={allClasses}
                allSubjects={allSubjects}
                onUpdateAssignments={handleUpdateAssignments}
                onUpdateSubjects={handleUpdateSubjects}
              />
            </TabsContent>
            
            <TabsContent value="permissions" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userList.map(user => (
                  <Card key={user.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        {user.name}
                        <Badge className="ml-2" variant={
                          user.role === 'admin' ? 'destructive' : 
                          user.role === 'supervisor' ? 'default' : 
                          user.role === 'counselor' ? 'outline' : 
                          'secondary'
                        }>
                          {roleNames[user.role]}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{user.email}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">
                          {language === 'en' ? 'Current Permissions:' : 'الصلاحيات الحالية:'}
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {user.permissions && user.permissions.length > 0 ? (
                            user.permissions.map(permission => (
                              <Badge key={permission} variant="outline">
                                {permission.replace(/_/g, ' ')}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              {language === 'en' ? 'No specific permissions assigned' : 'لم يتم تعيين صلاحيات محددة'}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowPermissionsDialog(true);
                        }}
                      >
                        <ShieldCheck className="h-4 w-4 mr-2" />
                        {language === 'en' ? 'Manage Permissions' : 'إدارة الصلاحيات'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Password Reset Dialog */}
          <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {language === 'en' ? 'Reset Password' : 'إعادة تعيين كلمة المرور'}
                </DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-muted-foreground mb-4">
                  {language === 'en' 
                    ? 'Are you sure you want to reset the password for:' 
                    : 'هل أنت متأكد أنك تريد إعادة تعيين كلمة المرور لـ:'}
                </p>
                {selectedUser && (
                  <div className="font-medium">{selectedUser.name} ({selectedUser.email})</div>
                )}
                <p className="mt-4 text-sm text-muted-foreground">
                  {language === 'en' 
                    ? 'This will send a password reset link to the user\'s email address.' 
                    : 'سيتم إرسال رابط إعادة تعيين كلمة المرور إلى عنوان البريد الإلكتروني للمستخدم.'}
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
                  {language === 'en' ? 'Cancel' : 'إلغاء'}
                </Button>
                <Button onClick={() => selectedUser && handleResetPassword(selectedUser.id)}>
                  {language === 'en' ? 'Reset Password' : 'إعادة تعيين كلمة المرور'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Permissions Dialog */}
          <Dialog open={showPermissionsDialog} onOpenChange={setShowPermissionsDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {language === 'en' ? 'Manage Permissions' : 'إدارة الصلاحيات'}
                </DialogTitle>
              </DialogHeader>
              {selectedUser && (
                <UserPermissionsForm 
                  user={selectedUser}
                  onSave={handleUpdatePermissions}
                  onCancel={() => setShowPermissionsDialog(false)}
                />
              )}
            </DialogContent>
          </Dialog>
        </motion.div>
      </main>
    </div>
  );
};

export default UserManagement;
