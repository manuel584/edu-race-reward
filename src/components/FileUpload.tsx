
import React, { useState, useRef } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Upload, FileText, CheckCircle, XCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

const FileUpload: React.FC = () => {
  const { importStudents, language } = useAppContext();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const translations = {
    en: {
      title: 'Import Students',
      dropExcel: 'Drop Excel file here',
      orClick: 'or click to browse',
      processing: 'Processing...',
      browse: 'Browse Files',
      uploadSuccess: 'Students imported successfully!',
      uploadError: 'Error importing students',
      fileSelected: 'File selected',
      invalidFormat: 'Invalid file format. Please use an Excel file (.xlsx, .xls)',
      requiredColumns: 'Required columns: name, points, attendance, booksOwned, engagementScore',
      missingColumns: 'Missing required columns:',
    },
    ar: {
      title: 'استيراد الطلاب',
      dropExcel: 'قم بإسقاط ملف Excel هنا',
      orClick: 'أو انقر للتصفح',
      processing: 'جاري المعالجة...',
      browse: 'تصفح الملفات',
      uploadSuccess: 'تم استيراد الطلاب بنجاح!',
      uploadError: 'خطأ في استيراد الطلاب',
      fileSelected: 'تم اختيار الملف',
      invalidFormat: 'تنسيق ملف غير صالح. يرجى استخدام ملف Excel (.xlsx, .xls)',
      requiredColumns: 'الأعمدة المطلوبة: name, points, attendance, booksOwned, engagementScore',
      missingColumns: 'الأعمدة المطلوبة المفقودة:',
    }
  };

  const t = translations[language];
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const processFile = async (file: File) => {
    // Check if file is Excel
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      toast.error(t.invalidFormat);
      return;
    }

    setFileName(file.name);
    setIsProcessing(true);

    try {
      const data = await readExcelFile(file);
      setIsProcessing(false);
      importData(data);
    } catch (error) {
      setIsProcessing(false);
      toast.error(t.uploadError);
      console.error(error);
    }
  };

  const readExcelFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const data = event.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          resolve(jsonData as any[]);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
      
      reader.readAsBinaryString(file);
    });
  };

  const importData = (data: any[]) => {
    // Check if data has the required columns
    const requiredColumns = ['name', 'points', 'attendance', 'booksOwned', 'engagementScore'];
    
    // Check if first row has all required columns
    if (data.length > 0) {
      const firstRow = data[0];
      const missingColumns = requiredColumns.filter(column => !(column in firstRow));
      
      if (missingColumns.length > 0) {
        toast.error(`${t.missingColumns} ${missingColumns.join(', ')}`);
        return;
      }
    } else {
      toast.error('No data found in the file');
      return;
    }
    
    // Transform data to match our student format
    const students = data.map(row => ({
      name: String(row.name),
      points: Number(row.points) || 0,
      attendance: Number(row.attendance) || 0,
      booksOwned: Number(row.booksOwned) || 0,
      engagementScore: Number(row.engagementScore) || 0,
    }));
    
    // Import students
    importStudents(students);
    toast.success(t.uploadSuccess);
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        } transition-colors duration-200`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleFileDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept=".xlsx,.xls"
          className="hidden"
        />
        
        {fileName ? (
          <div className="flex flex-col items-center">
            <FileText className="h-12 w-12 text-blue-500 mb-3" />
            <p className="text-gray-700 font-medium mb-1">
              {t.fileSelected}: {fileName}
            </p>
            {isProcessing ? (
              <p className="text-blue-500">{t.processing}</p>
            ) : (
              <CheckCircle className="h-6 w-6 text-green-500 mt-2" />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="h-12 w-12 text-blue-500 mb-3" />
            <p className="text-gray-700 font-medium mb-1">{t.dropExcel}</p>
            <p className="text-gray-500 text-sm mb-4">{t.orClick}</p>
            <button
              type="button"
              onClick={handleButtonClick}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              {t.browse}
            </button>
            <p className="text-xs text-gray-500 mt-4">{t.requiredColumns}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
