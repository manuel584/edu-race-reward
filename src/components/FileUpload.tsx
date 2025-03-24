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

  const handleImport = () => {
    if (!file) {
      toast.error(t.noFileSelected || "No file selected");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        
        const students = json.map((item: any) => ({
          name: item.name || '',
          points: parseInt(item.points) || 0,
          attendance: parseInt(item.attendance) || 0,
          booksOwned: parseInt(item.booksOwned) || 0,
          engagementScore: parseInt(item.engagementScore) || 0,
          nationality: item.nationality === 'international' ? 'international' : 'national',
          grade: item.grade || '',
          subjects: item.subjects ? item.subjects.split(',').map((s: string) => s.trim()) : [],
          helpfulness: 0,
          respect: 0,
          teamwork: 0,
          excellence: 0
        }));
        
        importStudents(students);
        toast.success(t.studentsImported || "Students imported successfully");
        onClose();
      } catch (error) {
        console.error(error);
        toast.error(t.fileReadError || "Error reading file");
      }
    };
    
    reader.readAsBinaryString(file);
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
        <Button type="button" onClick={handleImport} disabled={!file}>
          {t.upload}
        </Button>
      </div>
    </div>
  );
};

export default FileUpload;
