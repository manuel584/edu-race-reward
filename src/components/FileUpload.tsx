
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { useAppContext } from '@/context/AppContext';
import { toast } from 'sonner';
import { getTranslations } from '@/lib/i18n';
import { Button } from "@/components/ui/button";
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onUploadComplete?: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const { importStudents, language } = useAppContext();
  const t = getTranslations(language);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        toast.error(t.noStudents || "No students found");
        setIsUploading(false);
        return;
      }

      // Transform data to match Student type
      const students = jsonData.map((row: any) => {
        // Ensure nationality is either 'international' or 'national'
        let nationality: 'international' | 'national' = 'national';
        if (row.nationality && 
            (row.nationality.toLowerCase() === 'international' || 
             row.nationality.toLowerCase() === 'international student')) {
          nationality = 'international';
        }

        // Process subjects if they exist
        let subjects: string[] = [];
        if (row.subjects) {
          if (Array.isArray(row.subjects)) {
            subjects = row.subjects;
          } else if (typeof row.subjects === 'string') {
            subjects = row.subjects.split(',').map((s: string) => s.trim());
          }
        }

        return {
          name: row.name || "Unknown Student",
          points: parseInt(row.points, 10) || 0,
          attendance: parseInt(row.attendance, 10) || 0,
          booksOwned: parseInt(row.booksOwned, 10) || 0,
          engagementScore: parseInt(row.engagementScore, 10) || 0,
          nationality: nationality,
          grade: row.grade || "Unknown Grade",
          subjects: subjects,
          helpfulness: parseInt(row.helpfulness, 10) || 0,
          respect: parseInt(row.respect, 10) || 0,
          teamwork: parseInt(row.teamwork, 10) || 0,
          excellence: parseInt(row.excellence, 10) || 0
        };
      });

      // Import students
      importStudents(students);
      
      toast.success(`${students.length} ${t.studentsImported || "students imported"}`);
      
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
    <div className="flex flex-col items-center">
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
        className="w-full flex items-center justify-center gap-2"
      >
        <Upload className="h-4 w-4" />
        {isUploading ? (t.uploading || "Uploading...") : (t.uploadFile || "Upload File")}
      </Button>
    </div>
  );
};

export default FileUpload;
