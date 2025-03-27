
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { useAppContext } from '@/context/AppContext';
import { toast } from 'sonner';
import { getTranslations } from '@/lib/i18n';

interface FileUploadProps {
  onUploadComplete?: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const { importStudents, language } = useAppContext();
  const t = getTranslations(language);

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
        toast.error(t.noStudentsFound);
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
      
      toast.success(`${students.length} ${t.studentsImported}`);
      
      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error) {
      console.error('Error parsing file:', error);
      toast.error(t.errorParsingFile);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <input
      type="file"
      accept=".xlsx,.xls,.csv"
      onChange={handleFileUpload}
      disabled={isUploading}
      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-solid file:border-gray-300 file:text-sm file:font-semibold file:bg-white file:text-gray-700 hover:file:bg-gray-50"
    />
  );
};

export default FileUpload;
