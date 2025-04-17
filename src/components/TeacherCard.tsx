import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Teacher } from '@/types/teacher';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PencilLine, Trash2, MailIcon, Book, Calendar, BookOpen, Clock } from 'lucide-react';

interface TeacherCardProps {
  teacher: Teacher;
  onEdit: () => void;
  onDelete: () => void;
  language: string;
  onAssign?: () => void;
  isSelected?: boolean;
}

const TeacherCard: React.FC<TeacherCardProps> = ({ 
  teacher, 
  onEdit, 
  onDelete, 
  language,
  onAssign,
  isSelected
}) => {
  // Calculate total teaching hours per week
  const totalHours = teacher.assignedClasses.reduce((total, cls) => {
    const classHours = cls.schedule.reduce((hours, session) => {
      const start = new Date(`1970-01-01T${session.startTime}:00`);
      const end = new Date(`1970-01-01T${session.endTime}:00`);
      const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return hours + durationHours;
    }, 0);
    return total + classHours;
  }, 0);
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  // Get status badge color
  const getStatusVariant = (status: string) => {
    return status === 'active' ? 'default' : 
           status === 'inactive' ? 'destructive' : 'outline';
  };
  
  // Get localized status text
  const getStatusText = (status: string) => {
    return status === 'active' 
      ? (language === 'en' ? 'Active' : 'نشط')
      : status === 'inactive' 
      ? (language === 'en' ? 'Inactive' : 'غير نشط')
      : (language === 'en' ? 'On Leave' : 'في إجازة');
  };

  return (
    <Card className={`overflow-hidden transition-colors ${isSelected ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{teacher.name}</CardTitle>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MailIcon className="h-3.5 w-3.5 mr-1" />
              {teacher.email}
            </div>
          </div>
          <Badge variant={getStatusVariant(teacher.status)}>
            {getStatusText(teacher.status)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 pt-2">
        {teacher.department && (
          <div className="text-sm">
            <span className="font-medium">
              {language === 'en' ? 'Department: ' : 'القسم: '}
            </span>
            {teacher.department}
          </div>
        )}
        
        <div>
          <div className="text-sm font-medium mb-1.5">
            {language === 'en' ? 'Teaching Subjects' : 'المواد التدريسية'}
          </div>
          <div className="flex flex-wrap gap-1">
            {teacher.subjects.map((subject, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {subject}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <div className="text-sm font-medium mb-1.5">
            {language === 'en' ? 'Class Assignments' : 'الفصول المخصصة'}
          </div>
          {teacher.assignedClasses.length > 0 ? (
            <div className="space-y-2">
              {teacher.assignedClasses.map((cls, idx) => (
                <div key={idx} className="flex items-start text-sm py-1 border-b last:border-0">
                  <BookOpen className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium flex items-center justify-between">
                      <span>{cls.className} - {cls.subject}</span>
                      {cls.room && (
                        <span className="text-xs text-muted-foreground">
                          Room: {cls.room}
                        </span>
                      )}
                    </div>
                    {cls.schedule && (
                      <div className="text-muted-foreground text-xs mt-1 space-y-1">
                        {cls.schedule.map((session, i) => (
                          <div key={i} className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span className="capitalize">
                              {language === 'en' ? session.day : 
                                session.day === 'monday' ? 'الإثنين' :
                                session.day === 'tuesday' ? 'الثلاثاء' :
                                session.day === 'wednesday' ? 'الأربعاء' :
                                session.day === 'thursday' ? 'الخميس' :
                                'الجمعة'
                              }
                            </span>
                            <Clock className="h-3.5 w-3.5 ml-1.5" />
                            <span>
                              {session.startTime} - {session.endTime}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground italic">
              {language === 'en' ? 'No classes assigned' : 'لا توجد فصول دراسية مخصصة'}
            </div>
          )}
        </div>
        
        <div className="flex justify-between text-sm pt-1">
          <div>
            <span className="font-medium">
              {language === 'en' ? 'Weekly Hours: ' : 'الساعات الأسبوعية: '}
            </span>
            {totalHours.toFixed(1)}
          </div>
          <div>
            <span className="font-medium">
              {language === 'en' ? 'Max Hours: ' : 'الحد الأقصى: '}
            </span>
            {teacher.maxWeeklyHours || 30}
          </div>
        </div>
        
        <div className="flex justify-between items-center border-t pt-3 mt-3">
          <div className="text-sm flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              teacher.status === 'active' ? 'bg-green-500' :
              teacher.status === 'inactive' ? 'bg-red-500' :
              'bg-yellow-500'
            }`} />
            {teacher.status === 'active' ? (language === 'en' ? 'Active' : 'نشط') :
             teacher.status === 'inactive' ? (language === 'en' ? 'Inactive' : 'غير نشط') :
             (language === 'en' ? 'On Leave' : 'في إجازة')}
          </div>
          <div className="text-xs text-muted-foreground">
            {language === 'en' ? 'Last Updated: ' : 'آخر تحديث: '}
            {formatDate(teacher.createdAt)}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end space-x-2 pt-2">
        {onAssign && (
          <Button variant="secondary" size="sm" onClick={onAssign}>
            <BookOpen className="h-4 w-4 mr-1" />
            {language === 'en' ? 'Assign Classes' : 'تخصيص الفصول'}
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={onEdit}>
          <PencilLine className="h-4 w-4 mr-1" />
          {language === 'en' ? 'Edit' : 'تعديل'}
        </Button>
        <Button variant="outline" size="sm" className="text-red-500" onClick={onDelete}>
          <Trash2 className="h-4 w-4 mr-1" />
          {language === 'en' ? 'Delete' : 'حذف'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TeacherCard;
