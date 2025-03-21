
import React from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';
import { Home, Upload } from 'lucide-react';
import FileUpload from '@/components/FileUpload';

const Import = () => {
  const { language } = useAppContext();
  const t = getTranslations(language);

  // Generate breadcrumb items
  const breadcrumbItems = [
    { label: t.home, path: '/', icon: <Home className="h-4 w-4" /> },
    { label: t.import },
  ];

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
            <h1 className="text-3xl font-display font-bold">{t.import}</h1>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="max-w-xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              
              <h2 className="text-xl font-semibold text-center mb-6">{t.import} {t.students}</h2>
              
              <p className="text-gray-500 text-center mb-8">
                Upload a CSV or Excel file containing student data to import them into the system.
              </p>
              
              <FileUpload onClose={() => {}} />
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Import;
