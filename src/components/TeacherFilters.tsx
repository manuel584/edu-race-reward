
import React from 'react';
import { TeacherFilters as TeacherFiltersType } from '@/types/teacherAssignment';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Search } from 'lucide-react';

interface TeacherFiltersProps {
  filters: TeacherFiltersType;
  onFilterChange: (filters: TeacherFiltersType) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  language: string;
}

const TeacherFilters: React.FC<TeacherFiltersProps> = ({
  filters,
  onFilterChange,
  searchTerm,
  onSearchChange,
  language
}) => {
  const departments = ['Science', 'Mathematics', 'Languages', 'Arts', 'Physical Education'];
  const grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];
  const subjects = [
    'Mathematics', 'English', 'Science', 'History', 'Geography', 
    'Art', 'Music', 'Physical Education', 'Computer Science'
  ];

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={language === 'en' ? 'Search teachers...' : 'البحث عن المعلمين...'}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          value={filters.department || "all-departments"}
          onValueChange={(value) => onFilterChange({ ...filters, department: value === "all-departments" ? "" : value })}
        >
          <SelectTrigger>
            <SelectValue placeholder={language === 'en' ? 'Department' : 'القسم'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-departments">
              {language === 'en' ? 'All Departments' : 'جميع الأقسام'}
            </SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.grade || "all-grades"}
          onValueChange={(value) => onFilterChange({ ...filters, grade: value === "all-grades" ? "" : value })}
        >
          <SelectTrigger>
            <SelectValue placeholder={language === 'en' ? 'Grade Level' : 'المستوى الدراسي'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-grades">
              {language === 'en' ? 'All Grades' : 'جميع المراحل'}
            </SelectItem>
            {grades.map((grade) => (
              <SelectItem key={grade} value={grade}>{grade}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.subject || "all-subjects"}
          onValueChange={(value) => onFilterChange({ ...filters, subject: value === "all-subjects" ? "" : value })}
        >
          <SelectTrigger>
            <SelectValue placeholder={language === 'en' ? 'Subject' : 'المادة'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-subjects">
              {language === 'en' ? 'All Subjects' : 'جميع المواد'}
            </SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>{subject}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TeacherFilters;
