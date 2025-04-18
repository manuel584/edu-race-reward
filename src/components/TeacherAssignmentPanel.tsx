
import React, { useState } from 'react';
import { Teacher, ClassAssignment } from '@/types/teacher';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { 
  AlertTriangle, 
  Save, 
  Check, 
  BookOpen, 
  Clock, 
  Calendar,
  Trash2
} from 'lucide-react';
import { generateUUID } from '@/lib/uuid';
import { useToast } from '@/hooks/use-toast';

interface TeacherAssignmentPanelProps {
  teachers: Teacher[];
  onAssign: (assignmentData: any) => void;
  onCancel: () => void;
  language: string;
}

const TeacherAssignmentPanel: React.FC<TeacherAssignmentPanelProps> = ({
  teachers,
  onAssign,
  onCancel,
  language
}) => {
  const { toast } = useToast();
  
  // Sample data
  const availableGrades = [
    'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 
    'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8',
    'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'
  ];
  
  const availableSubjects = [
    'Mathematics', 'English', 'Science', 'History', 'Geography', 
    'Physics', 'Chemistry', 'Biology', 'Art', 'Music', 
    'Physical Education', 'Computer Science'
  ];
  
  const availableClassrooms = [
    '1A', '1B', '1C', '2A', '2B', '2C', '3A', '3B', '3C',
    '4A', '4B', '4C', '5A', '5B', '5C', '6A', '6B', '6C'
  ];
  
  const availableRooms = [
    'Room 101', 'Room 102', 'Room 103', 'Room 201', 'Room 202',
    'Lab 1', 'Lab 2', 'Computer Lab', 'Library', 'Gymnasium'
  ];
  
  // State for new assignments
  const [assignments, setAssignments] = useState<Record<string, ClassAssignment[]>>(
    teachers.reduce((acc, teacher) => {
      acc[teacher.id] = [];
      return acc;
    }, {} as Record<string, ClassAssignment[]>)
  );
  
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  
  // Filtered classes based on selected grade
  const filteredClasses = selectedGrade 
    ? availableClassrooms.filter(c => c.startsWith(selectedGrade.replace('Grade ', '')))
    : [];
  
  // Schedule state
  const [schedule, setSchedule] = useState<Array<{
    day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday";
    startTime: string;
    endTime: string;
  }>>([
    { 
      day: 'monday', 
      startTime: '08:00', 
      endTime: '09:30' 
    }
  ]);
  
  // Add a new schedule slot
  const addScheduleSlot = () => {
    setSchedule([
      ...schedule,
      { 
        day: 'monday', 
        startTime: '08:00', 
        endTime: '09:30' 
      }
    ]);
  };
  
  // Remove a schedule slot
  const removeScheduleSlot = (index: number) => {
    setSchedule(schedule.filter((_, i) => i !== index));
  };
  
  // Update a schedule slot
  const updateScheduleSlot = (index: number, field: string, value: string) => {
    setSchedule(schedule.map((slot, i) => {
      if (i === index) {
        return { ...slot, [field]: value };
      }
      return slot;
    }));
  };
  
  // Add a new assignment to selected teachers
  const addAssignment = () => {
    if (!selectedGrade || !selectedClass || !selectedSubject) {
      toast({
        title: language === 'en' ? 'Missing information' : 'معلومات ناقصة',
        description: language === 'en' 
          ? 'Please select grade, class, and subject' 
          : 'الرجاء تحديد المرحلة والفصل والمادة',
        variant: 'destructive'
      });
      return;
    }
    
    if (schedule.length === 0) {
      toast({
        title: language === 'en' ? 'No schedule' : 'لا يوجد جدول',
        description: language === 'en' 
          ? 'Please add at least one schedule slot' 
          : 'الرجاء إضافة فترة جدول واحدة على الأقل',
        variant: 'destructive'
      });
      return;
    }
    
    // Create new assignment
    const newAssignment: ClassAssignment = {
      id: generateUUID(),
      className: selectedClass,
      grade: selectedGrade,
      subject: selectedSubject,
      schedule: schedule,
      room: selectedRoom,
    };
    
    // Add assignment to all selected teachers
    const newAssignments = { ...assignments };
    teachers.forEach(teacher => {
      newAssignments[teacher.id] = [...(newAssignments[teacher.id] || []), newAssignment];
    });
    
    setAssignments(newAssignments);
    
    // Reset form
    setSelectedGrade('');
    setSelectedClass('');
    setSelectedSubject('');
    setSelectedRoom('');
    setSchedule([{ day: 'monday', startTime: '08:00', endTime: '09:30' }]);
    
    toast({
      title: language === 'en' ? 'Assignment added' : 'تمت إضافة التعيين',
      description: language === 'en' 
        ? `${selectedClass} (${selectedSubject}) added to ${teachers.length} teacher(s)` 
        : `تمت إضافة ${selectedClass} (${selectedSubject}) إلى ${teachers.length} معلم`,
    });
  };
  
  // Remove an assignment
  const removeAssignment = (teacherId: string, assignmentId: string) => {
    setAssignments({
      ...assignments,
      [teacherId]: assignments[teacherId].filter(a => a.id !== assignmentId)
    });
  };
  
  // Handle final submission
  const handleSubmit = () => {
    // Validate assignments
    let hasAssignments = false;
    teachers.forEach(teacher => {
      if (assignments[teacher.id] && assignments[teacher.id].length > 0) {
        hasAssignments = true;
      }
    });
    
    if (!hasAssignments) {
      toast({
        title: language === 'en' ? 'No assignments' : 'لا توجد تعيينات',
        description: language === 'en' 
          ? 'Please add at least one assignment' 
          : 'الرجاء إضافة تعيين واحد على الأقل',
        variant: 'destructive'
      });
      return;
    }
    
    // Submit assignments
    onAssign(assignments);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'en' 
              ? `Assign Classes to ${teachers.length} Teacher${teachers.length > 1 ? 's' : ''}` 
              : `تعيين الفصول لـ ${teachers.length} معلم${teachers.length > 1 ? 'ين' : ''}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="grade">
                  {language === 'en' ? 'Grade Level' : 'المستوى الدراسي'}
                </Label>
                <Select
                  value={selectedGrade}
                  onValueChange={setSelectedGrade}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'en' ? 'Select grade' : 'اختر المستوى'} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableGrades.map(grade => (
                      <SelectItem key={grade} value={grade}>
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="class">
                  {language === 'en' ? 'Class' : 'الفصل'}
                </Label>
                <Select
                  value={selectedClass}
                  onValueChange={setSelectedClass}
                  disabled={!selectedGrade}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'en' ? 'Select class' : 'اختر الفصل'} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredClasses.map(cls => (
                      <SelectItem key={cls} value={cls}>
                        {cls}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">
                  {language === 'en' ? 'Subject' : 'المادة'}
                </Label>
                <Select
                  value={selectedSubject}
                  onValueChange={setSelectedSubject}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'en' ? 'Select subject' : 'اختر المادة'} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSubjects.map(subject => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="room">
                  {language === 'en' ? 'Room' : 'الغرفة'}
                </Label>
                <Select
                  value={selectedRoom}
                  onValueChange={setSelectedRoom}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'en' ? 'Select room' : 'اختر الغرفة'} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRooms.map(room => (
                      <SelectItem key={room} value={room}>
                        {room}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>
                  {language === 'en' ? 'Schedule' : 'الجدول'}
                </Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={addScheduleSlot}
                >
                  {language === 'en' ? 'Add Time Slot' : 'إضافة فترة زمنية'}
                </Button>
              </div>
              
              {schedule.map((slot, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5">
                    <Select
                      value={slot.day}
                      onValueChange={(value) => updateScheduleSlot(index, 'day', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monday">
                          {language === 'en' ? 'Monday' : 'الإثنين'}
                        </SelectItem>
                        <SelectItem value="tuesday">
                          {language === 'en' ? 'Tuesday' : 'الثلاثاء'}
                        </SelectItem>
                        <SelectItem value="wednesday">
                          {language === 'en' ? 'Wednesday' : 'الأربعاء'}
                        </SelectItem>
                        <SelectItem value="thursday">
                          {language === 'en' ? 'Thursday' : 'الخميس'}
                        </SelectItem>
                        <SelectItem value="friday">
                          {language === 'en' ? 'Friday' : 'الجمعة'}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="col-span-3">
                    <Input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => updateScheduleSlot(index, 'startTime', e.target.value)}
                    />
                  </div>
                  
                  <div className="col-span-3">
                    <Input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => updateScheduleSlot(index, 'endTime', e.target.value)}
                    />
                  </div>
                  
                  <div className="col-span-1 flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeScheduleSlot(index)}
                      disabled={schedule.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button 
                type="button" 
                className="w-full mt-6"
                onClick={addAssignment}
                disabled={!selectedGrade || !selectedClass || !selectedSubject || schedule.length === 0}
              >
                {language === 'en' ? 'Add Assignment' : 'إضافة تعيين'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-6">
        {teachers.map(teacher => (
          <Card key={teacher.id}>
            <CardHeader>
              <CardTitle className="text-lg">{teacher.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-sm font-medium mb-3">
                {language === 'en' ? 'Current Assignments' : 'التعيينات الحالية'}
              </h3>
              
              {teacher.assignedClasses.length > 0 && (
                <Table className="mb-6">
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === 'en' ? 'Class' : 'الفصل'}</TableHead>
                      <TableHead>{language === 'en' ? 'Subject' : 'المادة'}</TableHead>
                      <TableHead>{language === 'en' ? 'Schedule' : 'الجدول'}</TableHead>
                      <TableHead>{language === 'en' ? 'Room' : 'الغرفة'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teacher.assignedClasses.map((cls) => (
                      <TableRow key={cls.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{cls.className} ({cls.grade})</span>
                          </div>
                        </TableCell>
                        <TableCell>{cls.subject}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {cls.schedule.map((session, i) => (
                              <div key={i} className="flex items-center text-xs">
                                <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                                <span className="capitalize">
                                  {language === 'en' ? session.day : 
                                    session.day === 'monday' ? 'الإثنين' :
                                    session.day === 'tuesday' ? 'الثلاثاء' :
                                    session.day === 'wednesday' ? 'الأربعاء' :
                                    session.day === 'thursday' ? 'الخميس' :
                                    'الجمعة'
                                  }
                                </span>
                                <Clock className="h-3 w-3 mx-1 text-muted-foreground" />
                                <span>
                                  {session.startTime} - {session.endTime}
                                </span>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{cls.room || '—'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              
              <h3 className="text-sm font-medium mb-3">
                {language === 'en' ? 'New Assignments' : 'التعيينات الجديدة'}
              </h3>
              
              {assignments[teacher.id] && assignments[teacher.id].length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === 'en' ? 'Class' : 'الفصل'}</TableHead>
                      <TableHead>{language === 'en' ? 'Subject' : 'المادة'}</TableHead>
                      <TableHead>{language === 'en' ? 'Schedule' : 'الجدول'}</TableHead>
                      <TableHead>{language === 'en' ? 'Room' : 'الغرفة'}</TableHead>
                      <TableHead className="w-10">{language === 'en' ? 'Actions' : 'إجراءات'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignments[teacher.id].map((cls) => (
                      <TableRow key={cls.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{cls.className} ({cls.grade})</span>
                          </div>
                        </TableCell>
                        <TableCell>{cls.subject}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {cls.schedule.map((session, i) => (
                              <div key={i} className="flex items-center text-xs">
                                <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                                <span className="capitalize">
                                  {language === 'en' ? session.day : 
                                    session.day === 'monday' ? 'الإثنين' :
                                    session.day === 'tuesday' ? 'الثلاثاء' :
                                    session.day === 'wednesday' ? 'الأربعاء' :
                                    session.day === 'thursday' ? 'الخميس' :
                                    'الجمعة'
                                  }
                                </span>
                                <Clock className="h-3 w-3 mx-1 text-muted-foreground" />
                                <span>
                                  {session.startTime} - {session.endTime}
                                </span>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{cls.room || '—'}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeAssignment(teacher.id, cls.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6 border rounded-md bg-muted/10">
                  <p className="text-sm text-muted-foreground">
                    {language === 'en' 
                      ? 'No new assignments. Add assignments using the form above.' 
                      : 'لا توجد تعيينات جديدة. أضف التعيينات باستخدام النموذج أعلاه.'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-end space-x-4 mt-6">
        <Button 
          variant="outline" 
          onClick={onCancel}
        >
          {language === 'en' ? 'Cancel' : 'إلغاء'}
        </Button>
        <Button 
          onClick={handleSubmit}
        >
          <Save className="h-4 w-4 mr-2" />
          {language === 'en' ? 'Save Assignments' : 'حفظ التعيينات'}
        </Button>
      </div>
    </div>
  );
};

export default TeacherAssignmentPanel;
