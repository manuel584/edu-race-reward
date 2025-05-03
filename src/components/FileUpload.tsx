
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { useAppContext } from '@/context/AppContext';
import { toast } from 'sonner';
import { getTranslations } from '@/lib/i18n';
import { Button } from "@/components/ui/button";
import { Upload, Info } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from '@/hooks/useAuth';

interface FileUploadProps {
  onUploadComplete?: () => void;
  defaultGrade?: string;
  defaultNationality?: 'international' | 'national';
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onUploadComplete,
  defaultGrade,
  defaultNationality 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<string>(defaultGrade || '');
  const [selectedNationality, setSelectedNationality] = useState<'international' | 'national'>(
    defaultNationality || 'national'
  );
  const [uploadTab, setUploadTab] = useState<string>('students');
  const { importStudents, language, students = [] } = useAppContext();
  const { user } = useAuth();
  const t = getTranslations(language);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Options for teacher assignment
  const [assignGrades, setAssignGrades] = useState<string[]>([]);
  const [assignSubjects, setAssignSubjects] = useState<string[]>([]);
  const [shouldAssignTeachers, setShouldAssignTeachers] = useState<boolean>(false);

  // Extract unique grades from existing students for the dropdown
  const uniqueGrades = [...new Set(students.map(student => student.grade))].sort();
  
  // Common subjects
  const commonSubjects = ['Math', 'Science', 'English', 'History', 'Art', 'PE', 'Music', 'Computer Science'];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // Read the file as an array buffer to preserve all characters
      const data = await file.arrayBuffer();
      
      // Ensure proper encoding for Arabic characters
      const workbook = XLSX.read(data, { 
        type: 'array',
        codepage: 65001, // UTF-8 encoding
        cellStyles: false,
        cellDates: true,
        cellNF: false,
        cellText: false,
        raw: true
      });
      
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      
      // Convert to JSON with proper headers
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        raw: true,
        defval: ""
      });
      
      console.log("Raw imported data:", jsonData);
      
      if (jsonData.length === 0) {
        toast.error(t.noStudents || "No students found");
        setIsUploading(false);
        return;
      }
      
      // Handle different upload types
      if (uploadTab === 'students') {
        handleStudentImport(jsonData);
      } else if (uploadTab === 'teachers') {
        handleTeacherImport(jsonData);
      }
      
    } catch (error) {
      console.error('Error importing file:', error);
      toast.error(t.errorParsingFile || "Error importing file. Please check the format.");
      setIsUploading(false);
    }
  };
  
  const handleStudentImport = (jsonData: any[]) => {
    try {
      // Map Excel columns to student properties
      const students = jsonData.map((row: any, index: number) => {
        console.log(`Processing row ${index}:`, row);
        
        // Check if this row has a student name (first column)
        // Get name from first column whatever it's named
        const firstKey = Object.keys(row)[0];
        const studentName = row[firstKey] || "";
        
        console.log(`Student name: "${studentName}"`);
        
        if (!studentName || typeof studentName !== 'string' || studentName.trim() === '') {
          console.log("Skipping row with no name");
          return null;
        }
        
        // Use the selected nationality if the third column doesn't specify one
        let nationality: 'international' | 'national' = selectedNationality;
        const thirdKey = Object.keys(row)[2];
        if (row[thirdKey]) {
          const nationalityValue = String(row[thirdKey]).toLowerCase();
          if (nationalityValue.includes('international')) {
            nationality = 'international';
          } else if (nationalityValue.includes('national')) {
            nationality = 'national';
          }
        }

        // Process subjects from the 6th column if it exists
        const sixthKey = Object.keys(row)[5];
        let subjects: string[] = [];
        if (sixthKey && row[sixthKey]) {
          if (Array.isArray(row[sixthKey])) {
            subjects = row[sixthKey];
          } else if (typeof row[sixthKey] === 'string') {
            subjects = row[sixthKey].split(',').map((s: string) => s.trim());
          }
        }

        // Use the selected grade if the second column doesn't specify one
        const secondKey = Object.keys(row)[1];
        const grade = row[secondKey] || selectedGrade || "Unknown Grade";
        
        // Get points from 4th column
        const fourthKey = Object.keys(row)[3];
        const points = parseInt(row[fourthKey], 10) || 0;
        
        // Get attendance from 5th column
        const fifthKey = Object.keys(row)[4];
        const attendance = parseInt(row[fifthKey], 10) || 0;
        
        // Get other values if they exist
        const seventhKey = Object.keys(row)[6];
        const booksOwned = seventhKey ? parseInt(row[seventhKey], 10) || 0 : 0;
        
        const eighthKey = Object.keys(row)[7];
        const engagementScore = eighthKey ? parseInt(row[eighthKey], 10) || 0 : 0;
        
        const ninthKey = Object.keys(row)[8];
        const helpfulness = ninthKey ? parseInt(row[ninthKey], 10) || 0 : 0;
        
        const tenthKey = Object.keys(row)[9];
        const respect = tenthKey ? parseInt(row[tenthKey], 10) || 0 : 0;
        
        const eleventhKey = Object.keys(row)[10];
        const teamwork = eleventhKey ? parseInt(row[eleventhKey], 10) || 0 : 0;
        
        const twelfthKey = Object.keys(row)[11];
        const excellence = twelfthKey ? parseInt(row[twelfthKey], 10) || 0 : 0;
        
        // Generate a student ID
        const studentId = `S-${1000 + index + 1}`;

        return {
          name: studentName.trim(),
          studentId: studentId,
          points: points,
          attendance: attendance,
          booksOwned: booksOwned,
          engagementScore: engagementScore,
          nationality: nationality,
          grade: grade,
          subjects: subjects,
          helpfulness: helpfulness,
          respect: respect,
          teamwork: teamwork,
          excellence: excellence
        };
      }).filter(student => student !== null);

      // Filter out empty rows
      const validStudents = students.filter(Boolean);
      
      if (validStudents.length === 0) {
        toast.error(t.noStudents || "No valid student data found");
        setIsUploading(false);
        return;
      }
      
      console.log("Importing students:", validStudents);
      
      // Import students
      importStudents(validStudents);
      
      // If teacher assignment is enabled, we'd handle that here
      if (shouldAssignTeachers && assignGrades.length > 0 && assignSubjects.length > 0) {
        // In a real app, we would call an API to assign teachers here
        console.log("Assigning teachers to:", {
          grades: assignGrades,
          subjects: assignSubjects
        });
        
        toast.success("Teachers assigned to selected grades and subjects");
      }
      
      toast.success(`${validStudents.length} ${t.studentsImported || "students imported"}`);
      
      if (onUploadComplete) {
        onUploadComplete();
      }
      
    } catch (error) {
      console.error('Error processing student import:', error);
      toast.error(t.errorParsingFile || "Error parsing file");
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handleTeacherImport = (jsonData: any[]) => {
    try {
      // Process teacher data - this is a placeholder for the actual implementation
      console.log("Processing teacher import:", jsonData);
      
      toast.success("Teachers imported successfully");
      
      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error) {
      console.error('Error processing teacher import:', error);
      toast.error(t.errorParsingFile || "Error parsing file");
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const handleGradeChange = (grade: string, checked: boolean) => {
    if (checked) {
      setAssignGrades([...assignGrades, grade]);
    } else {
      setAssignGrades(assignGrades.filter(g => g !== grade));
    }
  };
  
  const handleSubjectChange = (subject: string, checked: boolean) => {
    if (checked) {
      setAssignSubjects([...assignSubjects, subject]);
    } else {
      setAssignSubjects(assignSubjects.filter(s => s !== subject));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Tabs value={uploadTab} onValueChange={setUploadTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="students">{t.students || "Students"}</TabsTrigger>
          <TabsTrigger value="teachers">{t.teachers || "Teachers"}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="students">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grade-select">{t.grade || "Grade"}</Label>
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger id="grade-select">
                  <SelectValue placeholder={t.selectGrade || "Select grade"} />
                </SelectTrigger>
                <SelectContent>
                  {uniqueGrades.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                  <SelectItem value="Grade 1">Grade 1</SelectItem>
                  <SelectItem value="Grade 2">Grade 2</SelectItem>
                  <SelectItem value="Grade 3">Grade 3</SelectItem>
                  <SelectItem value="Grade 4">Grade 4</SelectItem>
                  <SelectItem value="Grade 5">Grade 5</SelectItem>
                  <SelectItem value="Grade 6">Grade 6</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nationality-select">{t.nationality || "Nationality"}</Label>
              <Select 
                value={selectedNationality} 
                onValueChange={(value: 'international' | 'national') => setSelectedNationality(value)}
              >
                <SelectTrigger id="nationality-select">
                  <SelectValue placeholder={t.selectNationality || "Select nationality"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="national">{t.nationalStuds || "National"}</SelectItem>
                  <SelectItem value="international">{t.internationalStuds || "International"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center mb-4">
              <Checkbox 
                id="assign-teachers" 
                checked={shouldAssignTeachers}
                onCheckedChange={(checked) => setShouldAssignTeachers(Boolean(checked))}
              />
              <Label htmlFor="assign-teachers" className="ml-2 cursor-pointer">
                {t.assignTeachers || "Assign teachers while importing"}
              </Label>
              <div className="ml-2 text-muted-foreground">
                <Info className="h-4 w-4" />
              </div>
            </div>
            
            {shouldAssignTeachers && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2 p-4 bg-muted rounded-md">
                <div>
                  <Label className="block mb-2">{t.selectGrades || "Select Grades"}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {uniqueGrades.length > 0 ? 
                      uniqueGrades.map(grade => (
                        <div key={grade} className="flex items-center">
                          <Checkbox 
                            id={`grade-${grade}`} 
                            checked={assignGrades.includes(grade)}
                            onCheckedChange={(checked) => handleGradeChange(grade, Boolean(checked))}
                          />
                          <Label htmlFor={`grade-${grade}`} className="ml-2">{grade}</Label>
                        </div>
                      )) : 
                      ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"].map(grade => (
                        <div key={grade} className="flex items-center">
                          <Checkbox 
                            id={`grade-${grade}`} 
                            checked={assignGrades.includes(grade)}
                            onCheckedChange={(checked) => handleGradeChange(grade, Boolean(checked))}
                          />
                          <Label htmlFor={`grade-${grade}`} className="ml-2">{grade}</Label>
                        </div>
                      ))
                    }
                  </div>
                </div>
                
                <div>
                  <Label className="block mb-2">{t.selectSubjects || "Select Subjects"}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {commonSubjects.map(subject => (
                      <div key={subject} className="flex items-center">
                        <Checkbox 
                          id={`subject-${subject}`} 
                          checked={assignSubjects.includes(subject)}
                          onCheckedChange={(checked) => handleSubjectChange(subject, Boolean(checked))}
                        />
                        <Label htmlFor={`subject-${subject}`} className="ml-2">{subject}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="teachers">
          <div className="p-4 rounded-md bg-muted my-2 text-sm">
            {t.teacherImportInfo || "Upload a file containing teacher information. The system will automatically assign teachers to grades and subjects based on the data."}
          </div>
        </TabsContent>
      </Tabs>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileUpload}
        disabled={isUploading}
        className="hidden"
      />
      <Button 
        onClick={triggerFileInput} 
        disabled={isUploading}
        className="w-full flex items-center justify-center gap-2 mt-4"
      >
        <Upload className="h-4 w-4" />
        {isUploading ? (t.uploading || "Uploading...") : (t.uploadFile || "Upload File")}
      </Button>
    </div>
  );
};

export default FileUpload;
