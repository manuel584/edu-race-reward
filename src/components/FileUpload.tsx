
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { useAppContext } from '@/context/AppContext';
import { toast } from 'sonner';
import { getTranslations } from '@/lib/i18n';
import { Button } from "@/components/ui/button";
import { Upload } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const { importStudents, language, students } = useAppContext();
  const t = getTranslations(language);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Extract unique grades from existing students for the dropdown
  const uniqueGrades = [...new Set(students.map(student => student.grade))].sort();

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

        return {
          name: studentName.trim(),
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
      
      toast.success(`${validStudents.length} ${t.studentsImported || "students imported"}`);
      
      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error) {
      console.error('Error parsing file:', error);
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

  return (
    <div className="flex flex-col gap-4">
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
