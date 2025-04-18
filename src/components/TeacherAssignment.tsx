import React, { useState } from 'react';
import { Teacher, ClassAssignment } from '@/types/teacher';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Plus, Save } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface TeacherAssignmentProps {
  teacher: Teacher;
  language: string;
  onSave: (assignments: ClassAssignment[]) => void;
}

interface SubjectAssignment {
  subject: string;
  grades: string[];
  sections: Record<string, string[]>; // grade -> sections
}

const TeacherAssignment: React.FC<TeacherAssignmentProps> = ({
  teacher,
  language,
  onSave
}) => {
  const [assignments, setAssignments] = useState<SubjectAssignment[]>([{
    subject: '',
    grades: [],
    sections: {}
  }]);

  const subjects = [
    'Mathematics', 'Science', 'English', 'History', 
    'Geography', 'Physics', 'Chemistry', 'Biology'
  ];

  const grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];
  const sections = ['A', 'B', 'C', 'D'];

  const handleSubjectChange = (value: string, index: number) => {
    const newAssignments = [...assignments];
    newAssignments[index] = { ...newAssignments[index], subject: value };
    setAssignments(newAssignments);
  };

  const handleGradeToggle = (grade: string, index: number) => {
    const newAssignments = [...assignments];
    const currentGrades = newAssignments[index].grades;
    
    if (currentGrades.includes(grade)) {
      newAssignments[index].grades = currentGrades.filter(g => g !== grade);
      delete newAssignments[index].sections[grade];
    } else {
      newAssignments[index].grades = [...currentGrades, grade];
      newAssignments[index].sections[grade] = [];
    }
    
    setAssignments(newAssignments);
  };

  const handleSectionToggle = (grade: string, section: string, index: number) => {
    const newAssignments = [...assignments];
    const currentSections = newAssignments[index].sections[grade] || [];
    
    if (currentSections.includes(section)) {
      newAssignments[index].sections[grade] = currentSections.filter(s => s !== section);
    } else {
      newAssignments[index].sections[grade] = [...currentSections, section];
    }
    
    setAssignments(newAssignments);
  };

  const handleAddSubject = () => {
    setAssignments([...assignments, { subject: '', grades: [], sections: {} }]);
  };

  const handleSave = () => {
    const classAssignments: ClassAssignment[] = [];
    
    assignments.forEach(assignment => {
      if (!assignment.subject) return;
      
      assignment.grades.forEach(grade => {
        const gradeSections = assignment.sections[grade] || [];
        if (gradeSections.length === 0) return;
        
        gradeSections.forEach(section => {
          classAssignments.push({
            id: `${grade}-${section}-${assignment.subject}`.toLowerCase(),
            className: `${grade.split(' ')[1]}${section}`,
            grade,
            subject: assignment.subject,
            schedule: [], // Schedule would be set separately
            room: '' // Room would be set separately
          });
        });
      });
    });
    
    onSave(classAssignments);
    toast.success(language === 'en' ? 'Assignments saved successfully' : 'تم حفظ التعيينات بنجاح');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="border-b pb-3">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{teacher.name}</h3>
          <p className="text-sm text-muted-foreground">ID: {teacher.id}</p>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4 space-y-6">
        {assignments.map((assignment, index) => (
          <div key={index} className="space-y-4 pb-4 border-b last:border-0">
            <Select
              value={assignment.subject}
              onValueChange={(value) => handleSubjectChange(value, index)}
            >
              <SelectTrigger>
                <SelectValue placeholder={language === 'en' ? "Select Subject" : "اختر المادة"} />
              </SelectTrigger>
              <SelectContent>
                {subjects
                  .filter(subject => !assignments.some((a, i) => i !== index && a.subject === subject))
                  .map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))
                }
              </SelectContent>
            </Select>

            {assignment.subject && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {language === 'en' ? 'Grades' : 'الصفوف'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {grades.map(grade => (
                      <div key={grade} className="flex items-center space-x-2">
                        <Checkbox
                          id={`grade-${grade}-${index}`}
                          checked={assignment.grades.includes(grade)}
                          onCheckedChange={() => handleGradeToggle(grade, index)}
                        />
                        <label
                          htmlFor={`grade-${grade}-${index}`}
                          className="text-sm"
                        >
                          {grade}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {assignment.grades.length > 0 && (
                  <div className="space-y-3">
                    {assignment.grades.map(grade => (
                      <div key={grade} className="space-y-2">
                        <label className="text-sm font-medium">
                          {grade} {language === 'en' ? 'Sections' : 'الشعب'}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {sections.map(section => (
                            <div key={section} className="flex items-center space-x-2">
                              <Checkbox
                                id={`section-${grade}-${section}-${index}`}
                                checked={assignment.sections[grade]?.includes(section)}
                                onCheckedChange={() => 
                                  handleSectionToggle(grade, section, index)
                                }
                              />
                              <label
                                htmlFor={`section-${grade}-${section}-${index}`}
                                className="text-sm"
                              >
                                {section}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={handleAddSubject}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          {language === 'en' ? 'Add Another Subject' : 'إضافة مادة أخرى'}
        </Button>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">
            {language === 'en' ? 'Current Assignments' : 'التعيينات الحالية'}
          </h4>
          {teacher.assignedClasses.length > 0 ? (
            <ul className="space-y-2">
              {Object.entries(
                teacher.assignedClasses.reduce((acc, curr) => {
                  if (!acc[curr.subject]) {
                    acc[curr.subject] = { grades: new Set(), sections: {} };
                  }
                  acc[curr.subject].grades.add(curr.grade);
                  if (!acc[curr.subject].sections[curr.grade]) {
                    acc[curr.subject].sections[curr.grade] = new Set();
                  }
                  acc[curr.subject].sections[curr.grade].add(curr.className.slice(-1));
                  return acc;
                }, {} as Record<string, { grades: Set<string>, sections: Record<string, Set<string>> }>)
              ).map(([subject, data]) => (
                <li key={subject} className="text-sm">
                  <span className="font-medium">{subject}:</span>{' '}
                  {Array.from(data.grades).map(grade => (
                    <span key={grade}>
                      {grade} {language === 'en' ? '(Sections: ' : '(الشعب: '}
                      {Array.from(data.sections[grade]).join(', ')})
                    </span>
                  )).join(', ')}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              {language === 'en' 
                ? 'No current assignments' 
                : 'لا توجد تعيينات حالية'}
            </p>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4">
        <Button 
          onClick={handleSave}
          className="w-full"
        >
          <Save className="h-4 w-4 mr-2" />
          {language === 'en' ? 'Save Assignments' : 'حفظ التعيينات'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TeacherAssignment;
