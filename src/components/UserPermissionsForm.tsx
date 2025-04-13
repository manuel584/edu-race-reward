
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from '@/components/ui/separator';
import { UserRole } from '@/hooks/useAuth';
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type UserType = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  subjects?: string[];
  assignedClasses?: string[];
  permissions?: string[];
};

interface UserPermissionsFormProps {
  user: UserType;
  onSave: (user: UserType, permissions: string[]) => void;
  onCancel: () => void;
}

const UserPermissionsForm = ({ user, onSave, onCancel }: UserPermissionsFormProps) => {
  const { language } = useAppContext();
  const t = getTranslations(language);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(user.permissions || []);
  
  // Define all available permissions grouped by category
  const permissionGroups = [
    {
      name: language === 'en' ? 'Student Management' : 'إدارة الطلاب',
      permissions: [
        { id: 'view_all_students', label: language === 'en' ? 'View all students' : 'عرض جميع الطلاب' },
        { id: 'view_assigned_students', label: language === 'en' ? 'View assigned students' : 'عرض الطلاب المعينين' },
        { id: 'view_department_students', label: language === 'en' ? 'View department students' : 'عرض طلاب القسم' },
        { id: 'edit_all_students', label: language === 'en' ? 'Edit all students' : 'تعديل جميع الطلاب' },
        { id: 'delete_students', label: language === 'en' ? 'Delete students' : 'حذف الطلاب' },
        { id: 'view_student_behavior', label: language === 'en' ? 'View student behavior' : 'عرض سلوك الطالب' },
        { id: 'view_student_academics', label: language === 'en' ? 'View student academics' : 'عرض الأكاديمية للطالب' },
      ],
    },
    {
      name: language === 'en' ? 'Class Management' : 'إدارة الفصول',
      permissions: [
        { id: 'view_all_classes', label: language === 'en' ? 'View all classes' : 'عرض جميع الفصول' },
        { id: 'view_assigned_classes', label: language === 'en' ? 'View assigned classes' : 'عرض الفصول المعينة' },
        { id: 'view_department_classes', label: language === 'en' ? 'View department classes' : 'عرض فصول القسم' },
        { id: 'edit_all_classes', label: language === 'en' ? 'Edit all classes' : 'تعديل جميع الفصول' },
        { id: 'create_classes', label: language === 'en' ? 'Create classes' : 'إنشاء فصول' },
        { id: 'delete_classes', label: language === 'en' ? 'Delete classes' : 'حذف الفصول' },
        { id: 'manage_sections', label: language === 'en' ? 'Manage sections' : 'إدارة الشعب' },
        { id: 'assign_teachers', label: language === 'en' ? 'Assign teachers' : 'تعيين المعلمين' },
      ],
    },
    {
      name: language === 'en' ? 'Exam Management' : 'إدارة الاختبارات',
      permissions: [
        { id: 'view_all_exams', label: language === 'en' ? 'View all exams' : 'عرض جميع الاختبارات' },
        { id: 'create_exams', label: language === 'en' ? 'Create exams' : 'إنشاء اختبارات' },
        { id: 'edit_exams', label: language === 'en' ? 'Edit all exams' : 'تعديل جميع الاختبارات' },
        { id: 'edit_own_exams', label: language === 'en' ? 'Edit own exams' : 'تعديل اختبارات المعلم' },
        { id: 'delete_exams', label: language === 'en' ? 'Delete exams' : 'حذف الاختبارات' },
        { id: 'grade_exams', label: language === 'en' ? 'Grade exams' : 'تقييم الاختبارات' },
      ],
    },
    {
      name: language === 'en' ? 'Recognition System' : 'نظام التقدير',
      permissions: [
        { id: 'view_recognitions', label: language === 'en' ? 'View recognitions' : 'عرض التقديرات' },
        { id: 'create_recognitions', label: language === 'en' ? 'Create recognitions' : 'إنشاء تقديرات' },
        { id: 'create_interventions', label: language === 'en' ? 'Create interventions' : 'إنشاء تدخلات' },
      ],
    },
    {
      name: language === 'en' ? 'Reports & Data' : 'التقارير والبيانات',
      permissions: [
        { id: 'view_all_reports', label: language === 'en' ? 'View all reports' : 'عرض جميع التقارير' },
        { id: 'view_curriculum', label: language === 'en' ? 'View curriculum' : 'عرض المنهج' },
        { id: 'view_teacher_performance', label: language === 'en' ? 'View teacher performance' : 'عرض أداء المعلم' },
        { id: 'import_data', label: language === 'en' ? 'Import data' : 'استيراد البيانات' },
        { id: 'export_data', label: language === 'en' ? 'Export all data' : 'تصدير جميع البيانات' },
        { id: 'export_own_data', label: language === 'en' ? 'Export own data' : 'تصدير البيانات الخاصة' },
      ],
    },
    {
      name: language === 'en' ? 'Administration' : 'الإدارة',
      permissions: [
        { id: 'manage_users', label: language === 'en' ? 'Manage users' : 'إدارة المستخدمين' },
        { id: 'view_system_settings', label: language === 'en' ? 'View system settings' : 'عرض إعدادات النظام' },
        { id: 'edit_system_settings', label: language === 'en' ? 'Edit system settings' : 'تعديل إعدادات النظام' },
        { id: 'parent_communication', label: language === 'en' ? 'Parent communication' : 'التواصل مع أولياء الأمور' },
      ],
    },
  ];
  
  const togglePermission = (permissionId: string) => {
    setSelectedPermissions(prev => {
      if (prev.includes(permissionId)) {
        return prev.filter(id => id !== permissionId);
      } else {
        return [...prev, permissionId];
      }
    });
  };
  
  const selectAll = (groupPermissions: string[]) => {
    setSelectedPermissions(prev => {
      const newPermissions = [...prev];
      groupPermissions.forEach(permission => {
        if (!newPermissions.includes(permission)) {
          newPermissions.push(permission);
        }
      });
      return newPermissions;
    });
  };
  
  const deselectAll = (groupPermissions: string[]) => {
    setSelectedPermissions(prev => 
      prev.filter(permission => !groupPermissions.includes(permission))
    );
  };
  
  const areAllSelected = (groupPermissions: string[]) => {
    return groupPermissions.every(permission => selectedPermissions.includes(permission));
  };
  
  const areSomeSelected = (groupPermissions: string[]) => {
    return groupPermissions.some(permission => selectedPermissions.includes(permission)) &&
      !areAllSelected(groupPermissions);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(user, selectedPermissions);
  };
  
  const roleSpecificPermissions = {
    admin: ['manage_users', 'edit_system_settings', 'view_all_reports'],
    supervisor: ['view_department_students', 'view_teacher_performance', 'create_exams'],
    counselor: ['view_student_behavior', 'create_interventions', 'parent_communication'],
    teacher: ['view_assigned_students', 'view_assigned_classes', 'grade_exams'],
  };
  
  // Get role-specific recommended permissions
  const getRecommendedPermissions = () => {
    return roleSpecificPermissions[user.role] || [];
  };
  
  // Apply role-based template
  const applyRoleTemplate = () => {
    setSelectedPermissions(getRecommendedPermissions());
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-lg font-medium">
            {user.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {language === 'en' ? 'Role:' : 'الدور:'} {user.role}
          </p>
        </div>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={applyRoleTemplate}
        >
          {language === 'en' ? 'Apply role template' : 'تطبيق قالب الدور'}
        </Button>
      </div>
      
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-6">
          {permissionGroups.map((group) => {
            const groupPermissionIds = group.permissions.map(p => p.id);
            const allSelected = areAllSelected(groupPermissionIds);
            const someSelected = areSomeSelected(groupPermissionIds);
            
            return (
              <div key={group.name} className="space-y-2">
                <div className="flex items-start">
                  <div className="flex items-center h-5 mt-1">
                    <Checkbox
                      id={`group-${group.name}`}
                      checked={allSelected}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          selectAll(groupPermissionIds);
                        } else {
                          deselectAll(groupPermissionIds);
                        }
                      }}
                      className={cn(someSelected && "opacity-70")}
                    />
                  </div>
                  <div className="ml-3">
                    <Label 
                      htmlFor={`group-${group.name}`} 
                      className="font-medium text-base"
                    >
                      {group.name}
                    </Label>
                  </div>
                </div>
                
                <div className="ml-6 space-y-1">
                  {group.permissions.map((permission) => {
                    const isRecommended = getRecommendedPermissions().includes(permission.id);
                    
                    return (
                      <div key={permission.id} className="flex items-start">
                        <div className="flex items-center h-5 mt-0.5">
                          <Checkbox
                            id={permission.id}
                            checked={selectedPermissions.includes(permission.id)}
                            onCheckedChange={() => togglePermission(permission.id)}
                          />
                        </div>
                        <div className="ml-3 flex items-center">
                          <Label 
                            htmlFor={permission.id} 
                            className="text-sm font-normal"
                          >
                            {permission.label}
                          </Label>
                          {isRecommended && (
                            <Badge variant="outline" className="ml-2 text-xs py-0 h-5">
                              {language === 'en' ? 'Recommended' : 'موصى به'}
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Separator className="mt-4" />
              </div>
            );
          })}
        </div>
      </ScrollArea>
      
      <div className="pt-4 flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {language === 'en' ? 'Cancel' : 'إلغاء'}
        </Button>
        <Button type="submit">
          {language === 'en' ? 'Save Permissions' : 'حفظ الصلاحيات'}
        </Button>
      </div>
    </form>
  );
};

export default UserPermissionsForm;
