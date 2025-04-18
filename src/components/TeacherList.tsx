
import React from 'react';
import { Teacher } from '@/types/teacher';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  User,
  Mail,
  Building,
} from 'lucide-react';

interface TeacherListProps {
  teachers: Teacher[];
  selectedTeachers: string[];
  onTeacherSelect: (id: string) => void;
  language: string;
}

const TeacherList: React.FC<TeacherListProps> = ({
  teachers,
  selectedTeachers,
  onTeacherSelect,
  language
}) => {
  if (teachers.length === 0) {
    return (
      <Card className="border border-dashed">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <User className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
            <h3 className="mt-4 text-lg font-medium">
              {language === 'en' ? 'No teachers found' : 'لم يتم العثور على معلمين'}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {language === 'en' 
                ? 'Try adjusting your search or filters' 
                : 'حاول تعديل البحث أو الفلاتر'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox 
                  checked={
                    selectedTeachers.length > 0 && 
                    selectedTeachers.length === teachers.length
                  }
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onTeacherSelect(
                        ...teachers.map(t => t.id).filter(id => !selectedTeachers.includes(id))
                      );
                    } else {
                      teachers.forEach(t => onTeacherSelect(t.id));
                    }
                  }}
                />
              </TableHead>
              <TableHead>{language === 'en' ? 'Teacher' : 'المعلم'}</TableHead>
              <TableHead className="hidden md:table-cell">{language === 'en' ? 'Department' : 'القسم'}</TableHead>
              <TableHead className="hidden md:table-cell">{language === 'en' ? 'Subjects' : 'المواد'}</TableHead>
              <TableHead>{language === 'en' ? 'Classes' : 'الفصول'}</TableHead>
              <TableHead className="hidden md:table-cell">{language === 'en' ? 'Workload' : 'العبء'}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers.map((teacher) => {
              // Calculate workload
              const currentHours = teacher.weeklyHours || 0;
              const maxHours = teacher.maxWeeklyHours || 30;
              const workloadPercentage = (currentHours / maxHours) * 100;
              
              let workloadColor;
              if (workloadPercentage < 50) workloadColor = 'bg-blue-500';
              else if (workloadPercentage < 80) workloadColor = 'bg-green-500';
              else if (workloadPercentage < 100) workloadColor = 'bg-yellow-500';
              else workloadColor = 'bg-red-500';
              
              return (
                <TableRow 
                  key={teacher.id}
                  className={
                    selectedTeachers.includes(teacher.id) 
                      ? 'bg-muted/80 hover:bg-muted/80' 
                      : ''
                  }
                  onClick={() => onTeacherSelect(teacher.id)}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedTeachers.includes(teacher.id)}
                      onCheckedChange={() => onTeacherSelect(teacher.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{teacher.name}</span>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Mail className="h-3 w-3 mr-1" />
                        {teacher.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                      {teacher.department || '—'}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {teacher.subjects.map((subject, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {teacher.assignedClasses.length > 0 ? (
                        teacher.assignedClasses.slice(0, 2).map((cls, idx) => (
                          <div key={idx} className="flex items-center text-xs">
                            <BookOpen className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span>{cls.className} ({cls.subject})</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          {language === 'en' ? 'No classes assigned' : 'لا توجد فصول مخصصة'}
                        </span>
                      )}
                      {teacher.assignedClasses.length > 2 && (
                        <span className="text-xs text-muted-foreground">
                          +{teacher.assignedClasses.length - 2} {language === 'en' ? 'more' : 'المزيد'}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-col space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>{currentHours}/{maxHours} {language === 'en' ? 'hrs' : 'ساعة'}</span>
                        <span className="text-muted-foreground">
                          {Math.round(workloadPercentage)}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${workloadColor}`}
                          style={{ width: `${Math.min(workloadPercentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TeacherList;
