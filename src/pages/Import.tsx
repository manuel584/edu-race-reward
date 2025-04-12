
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';
import { Home, Upload, HelpCircle } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import { useNavigate } from 'react-router-dom';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

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
                        <li><strong>name</strong> - {t.studentName || "Student name"}</li>
                        <li><strong>grade</strong> - {t.gradeLevel || "Grade level (optional if selected above)"}</li>
                        <li><strong>nationality</strong> - {t.studentNationality || "Student nationality (optional if selected above)"}</li>
                        <li><strong>points</strong> - {t.initialPoints || "Initial points"}</li>
                        <li><strong>attendance</strong> - {t.attendance || "Attendance score"}</li>
                        <li><strong>subjects</strong> - {t.subjects || "Subjects (comma separated)"}</li>
                      </ul>
                      <p className="mt-4">{t.arabicSupport || "Arabic names are fully supported in the import file."}</p>
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
