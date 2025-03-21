import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppContext } from '@/context/AppContext';
import { toast } from 'sonner';
import { getTranslations } from '@/lib/i18n';

interface FileUploadProps {
  onClose: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const { importStudents, language } = useAppContext();
  const t = getTranslations(language);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) {
      toast.error(t.noFileSelected);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      // Convert to array of objects, using the first row as keys
      const headers = data[0] as string[];
      const jsonData = data.slice(1).map(row => {
        const rowData: { [key: string]: any } = {};
        headers.forEach((header, index) => {
          rowData[header] = row[index];
        });
        return rowData;
      });

      try {
        const students = processExcelData(jsonData);
        importStudents(students);
        toast.success(t.studentsImported);
        onClose();
      } catch (error: any) {
        toast.error(error.message);
      }
    };
    reader.onerror = () => {
      toast.error(t.fileReadError);
    };
    reader.readAsBinaryString(file);
  };

  const processExcelData = (data: any[]): { 
    name: string;
    points: number;
    attendance: number;
    booksOwned: number;
    engagementScore: number;
    nationality: 'international' | 'national';
    grade: string;
    subjects: string[];
  }[] => {
    return data.map(row => {
      // Extract basic data
      const processedRow = {
        name: row['Student Name'] || row['Name'] || '',
        points: parseInt(row['Points'] || '0', 10),
        attendance: parseInt(row['Attendance'] || '0', 10),
        booksOwned: parseInt(row['Books Owned'] || '0', 10),
        engagementScore: parseInt(row['Engagement Score'] || '0', 10),
        nationality: (row['Nationality'] || 'national').toLowerCase() === 'international' 
          ? 'international' as const
          : 'national' as const,
        grade: row['Grade'] || 'Grade 1',
        subjects: row['Subjects'] ? row['Subjects'].split(',').map((s: string) => s.trim()) : [],
      };
      
      // Validate data
      if (!processedRow.name) {
        throw new Error('Each student must have a name');
      }
      
      return processedRow;
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      </div>
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onClose}>
          {t.cancel}
        </Button>
        <Button type="button" onClick={handleUpload} disabled={!file}>
          {t.upload}
        </Button>
      </div>
    </div>
  );
};

export default FileUpload;
