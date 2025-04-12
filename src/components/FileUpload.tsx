
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
        cellStyles: true,
        cellDates: true,
        cellNF: true,
        cellText: true,
        raw: false
      });
      
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      
      // Force text format for all cells to preserve Arabic characters
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: "A",
        defval: "",
        raw: false
      });
      
      // Skip the header row if present
      const dataRows = jsonData.length > 1 ? jsonData.slice(1) : jsonData;

      if (dataRows.length === 0) {
        toast.error(t.noStudents || "No students found");
        setIsUploading(false);
        return;
      }

      console.log("Imported rows:", dataRows);
      
      // Map Excel columns to student properties
      const students = dataRows.map((row: any) => {
        const studentName = row.A || ""; // First column should be name
        
        console.log("Processing student:", studentName);
        
        // Use the selected nationality if the row doesn't specify one
        let nationality: 'international' | 'national' = selectedNationality;
        if (row.C && 
            (row.C.toLowerCase() === 'international' || 
             row.C.toLowerCase() === 'international student')) {
          nationality = 'international';
        } else if (row.C && 
                  (row.C.toLowerCase() === 'national' || 
                   row.C.toLowerCase() === 'national student')) {
          nationality = 'national';
        }

        // Process subjects if they exist
        let subjects: string[] = [];
        if (row.F) {
          if (Array.isArray(row.F)) {
            subjects = row.F;
          } else if (typeof row.F === 'string') {
            subjects = row.F.split(',').map((s: string) => s.trim());
          }
        }

        // Use the selected grade if the row doesn't specify one
        const grade = row.B || selectedGrade || "Unknown Grade";
        
        // Convert string values to numbers safely
        const points = parseInt(row.D, 10) || 0;
        const attendance = parseInt(row.E, 10) || 0;

        return {
          name: studentName || "Unknown Student",
          points: points,
          attendance: attendance,
          booksOwned: parseInt(row.G, 10) || 0,
          engagementScore: parseInt(row.H, 10) || 0,
          nationality: nationality,
          grade: grade,
          subjects: subjects,
          helpfulness: parseInt(row.I, 10) || 0,
          respect: parseInt(row.J, 10) || 0,
          teamwork: parseInt(row.K, 10) || 0,
          excellence: parseInt(row.L, 10) || 0
        };
      });

      // Filter out empty rows
      const validStudents = students.filter(student => student.name && student.name !== "Unknown Student");
      
      if (validStudents.length === 0) {
        toast.error(t.noValidStudents || "No valid student data found");
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
