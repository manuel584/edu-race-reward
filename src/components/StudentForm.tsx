
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { Student } from '@/context/AppContext';

interface StudentFormProps {
  student?: Student;
  onSuccess?: () => void;
  onClose?: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ student, onSuccess, onClose }) => {
  const { addStudent, updateStudent, language } = useAppContext();
  const t = getTranslations(language);
  
  const [name, setName] = useState(student?.name || '');
  const [points, setPoints] = useState(student?.points?.toString() || '0');
  const [attendance, setAttendance] = useState(student?.attendance?.toString() || '0');
  const [booksOwned, setBooksOwned] = useState(student?.booksOwned?.toString() || '0');
  const [engagementScore, setEngagementScore] = useState(student?.engagementScore?.toString() || '0');
  const [grade, setGrade] = useState(student?.grade || '');
  const [nationality, setNationality] = useState<'international' | 'national'>(student?.nationality || 'national');
  const [helpfulness, setHelpfulness] = useState(student?.helpfulness?.toString() || '0');
  const [respect, setRespect] = useState(student?.respect?.toString() || '0');
  const [teamwork, setTeamwork] = useState(student?.teamwork?.toString() || '0');
  const [excellence, setExcellence] = useState(student?.excellence?.toString() || '0');
  
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(student?.subjects || []);
  const availableSubjects = ['Math', 'Science', 'English', 'History', 'Art', 'Music', 'PE', 'Technology'];
  
  const handleSubjectToggle = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create student object from form data
    const studentData = {
      subjects: selectedSubjects,
      name,
      points: parseInt(points),
      attendance: parseInt(attendance),
      booksOwned: parseInt(booksOwned),
      engagementScore: parseInt(engagementScore),
      nationality,
      grade,
      helpfulness: parseInt(helpfulness),
      respect: parseInt(respect),
      teamwork: parseInt(teamwork),
      excellence: parseInt(excellence)
    };
    
    if (student) {
      updateStudent(student.id, studentData);
      toast.success(t.studentUpdated || "Student updated successfully");
    } else {
      addStudent(studentData);
      toast.success(t.studentAdded || "Student added successfully");
    }
    
    if (onSuccess) {
      onSuccess();
    } else if (onClose) {
      onClose();
    }
  };
  
  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">{t.name}</label>
        <Input 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="grade" className="text-sm font-medium">{t.grade}</label>
        <Input 
          id="grade" 
          value={grade} 
          onChange={(e) => setGrade(e.target.value)} 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="nationality" className="text-sm font-medium">{t.nationality}</label>
        <Select 
          value={nationality} 
          onValueChange={(value: 'international' | 'national') => setNationality(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t.selectNationality} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="national">{t.national}</SelectItem>
            <SelectItem value="international">{t.international}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="points" className="text-sm font-medium">{t.points}</label>
        <Input 
          id="points" 
          type="number" 
          value={points} 
          onChange={(e) => setPoints(e.target.value)} 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="attendance" className="text-sm font-medium">{t.attendance}</label>
        <Input 
          id="attendance" 
          type="number" 
          value={attendance} 
          onChange={(e) => setAttendance(e.target.value)} 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="booksOwned" className="text-sm font-medium">{t.booksOwned}</label>
        <Input 
          id="booksOwned" 
          type="number" 
          value={booksOwned} 
          onChange={(e) => setBooksOwned(e.target.value)} 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="engagementScore" className="text-sm font-medium">{t.engagementScore}</label>
        <Input 
          id="engagementScore" 
          type="number" 
          value={engagementScore} 
          onChange={(e) => setEngagementScore(e.target.value)} 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">{t.helpfulness}</label>
        <Input 
          type="number" 
          value={helpfulness} 
          onChange={(e) => setHelpfulness(e.target.value)} 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">{t.respect}</label>
        <Input 
          type="number" 
          value={respect} 
          onChange={(e) => setRespect(e.target.value)} 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">{t.teamwork}</label>
        <Input 
          type="number" 
          value={teamwork} 
          onChange={(e) => setTeamwork(e.target.value)} 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">{t.excellence}</label>
        <Input 
          type="number" 
          value={excellence} 
          onChange={(e) => setExcellence(e.target.value)} 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">{t.subjects}</label>
        <div className="grid grid-cols-2 gap-2">
          {availableSubjects.map((subject) => (
            <div key={subject} className="flex items-center space-x-2">
              <Checkbox 
                id={`subject-${subject}`} 
                checked={selectedSubjects.includes(subject)}
                onCheckedChange={() => handleSubjectToggle(subject)}
              />
              <label 
                htmlFor={`subject-${subject}`}
                className="text-sm cursor-pointer"
              >
                {subject}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end pt-4">
        <Button type="submit">{student ? t.updateStudent : t.addStudent}</Button>
      </div>
    </form>
  );
};

export { StudentForm };
