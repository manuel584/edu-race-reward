
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';
import { Home, Upload, HelpCircle, Download } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import { useNavigate } from 'react-router-dom';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';

const Import = () => {
  const { language } = useAppContext();
  const navigate = useNavigate();
  const t = getTranslations(language);
  const [defaultGrade, setDefaultGrade] = useState<string>('');
  const [defaultNationality, setDefaultNationality] = useState<'international' | 'national'>('national');

  // Generate breadcrumb items
  const breadcrumbItems = [
    { label: t.home, path: '/', icon: <Home className="h-4 w-4" /> },
    { label: t.importText || "Import" },
  ];
  
  const handleUploadComplete = () => {
    // Navigate to students page after successful import
    setTimeout(() => {
      navigate('/students');
    }, 1500);
  };

  // Function to generate and download a template Excel file
  const downloadTemplate = () => {
    // Create sample data
    const data = [
      ['Student Name', 'Grade', 'Nationality', 'Points', 'Attendance', 'Subjects'],
      ['محمد أحمد', 'Grade 3', 'National', 100, 95, 'Math,Science,Arabic'],
      ['سارة خالد', 'Grade 4', 'International', 85, 90, 'English,Art,PE'],
      ['Ahmed Mohamed', 'Grade 5', 'National', 75, 88, 'Science,Social Studies'],
    ];

    // Create a new workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    
    // Set column widths
    const colWidths = [
      { wch: 25 }, // Student Name
      { wch: 15 }, // Grade
      { wch: 15 }, // Nationality
      { wch: 10 }, // Points
      { wch: 10 }, // Attendance
      { wch: 30 }, // Subjects
    ];
    
    ws['!cols'] = colWidths;
    
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Students Template');
    
    // Generate and download the file
    XLSX.writeFile(wb, 'student_import_template.xlsx');
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="page-container">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-3xl font-display font-bold">{t.importText || "Import"}</h1>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="max-w-xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              
              <h2 className="text-xl font-semibold text-center mb-6">
                {t.importText || "Import"} {t.students || "Students"}
              </h2>
              
              <p className="text-gray-500 text-center mb-8">
                {t.uploadDescription || "Upload a CSV or Excel file containing student data to import them into the system."}
              </p>
              
              <div className="flex justify-center mb-6">
                <Button variant="outline" onClick={downloadTemplate} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  {t.downloadTemplate || "Download Template"}
                </Button>
              </div>
              
              <FileUpload 
                onUploadComplete={handleUploadComplete} 
                defaultGrade={defaultGrade}
                defaultNationality={defaultNationality}
              />
              
              <Accordion type="single" collapsible className="mt-8">
                <AccordionItem value="file-format">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4" />
                      <span>{t.fileFormat || "File Format Information"}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="text-sm space-y-2 text-gray-600">
                      <p>{t.fileFormatDescription || "Your file should have the following columns:"}</p>
                      <ul className="list-disc ml-5 space-y-1">
                        <li><strong>Column 1:</strong> {t.studentName || "Student name"}</li>
                        <li><strong>Column 2:</strong> {t.grade || "Grade level"} {t.optional || "(optional if selected above)"}</li>
                        <li><strong>Column 3:</strong> {t.nationality || "Nationality"} {t.optional || "(optional if selected above)"}</li>
                        <li><strong>Column 4:</strong> {t.points || "Points"}</li>
                        <li><strong>Column 5:</strong> {t.attendance || "Attendance score"}</li>
                        <li><strong>Column 6:</strong> {t.subjects || "Subjects"} {t.commaList || "(comma separated)"}</li>
                        <li><strong>Column 7:</strong> {t.booksOwned || "Books owned"} {t.optional || "(optional)"}</li>
                        <li><strong>Column 8:</strong> {t.engagementScore || "Engagement score"} {t.optional || "(optional)"}</li>
                        <li><strong>Column 9:</strong> {t.helpfulness || "Helpfulness"} {t.optional || "(optional)"}</li>
                        <li><strong>Column 10:</strong> {t.respect || "Respect"} {t.optional || "(optional)"}</li>
                        <li><strong>Column 11:</strong> {t.teamwork || "Teamwork"} {t.optional || "(optional)"}</li>
                        <li><strong>Column 12:</strong> {t.excellence || "Excellence"} {t.optional || "(optional)"}</li>
                      </ul>
                      <p className="mt-4 font-medium">{t.arabicSupportMessage || "Arabic names are fully supported and correctly processed."}</p>
                      <div className="mt-2 p-3 bg-blue-50 rounded-md">
                        <p className="text-blue-800 font-medium">{t.tip || "Tip"}:</p>
                        <p className="text-blue-700">{t.templateUseMessage || "Use the template button above to download a sample Excel file with the correct format."}</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Import;
