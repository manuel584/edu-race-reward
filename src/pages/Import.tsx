
import React from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import Header from '@/components/Header';
import FileUpload from '@/components/FileUpload';
import { Download, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

const Import = () => {
  const { students, language } = useAppContext();
  const t = getTranslations(language);

  // Handle exporting students data to Excel
  const handleExportToExcel = () => {
    if (students.length === 0) return;

    // Prepare data for export
    const exportData = students.map(student => ({
      name: student.name,
      points: student.points,
      attendance: student.attendance,
      booksOwned: student.booksOwned,
      engagementScore: student.engagementScore,
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

    // Generate Excel file
    XLSX.writeFile(workbook, 'students_data.xlsx');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="page-container">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-display font-bold">{t.importStudents}</h1>
            
            <button 
              onClick={handleExportToExcel}
              disabled={students.length === 0}
              className={`
                px-4 py-2 rounded-lg text-sm flex items-center transition-all duration-200
                ${students.length > 0 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
              `}
            >
              <Download className="mr-2 h-4 w-4" />
              {t.exportStudents}
            </button>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            <div className="p-8">
              <FileUpload />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8">
              <div className="flex items-start mb-6">
                <FileSpreadsheet className="h-8 w-8 text-blue-600 mr-4 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold mb-2">Excel Template Format</h2>
                  <p className="text-gray-600 mb-4">
                    Your Excel file should include the following columns to import students successfully:
                  </p>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-6 overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            name
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            points
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            attendance
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            booksOwned
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            engagementScore
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="px-4 py-2 text-sm text-gray-500 border-b">
                            Ahmed Ali
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500 border-b">
                            50
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500 border-b">
                            8
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500 border-b">
                            3
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500 border-b">
                            7
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm text-gray-500">
                            Sara Mohammad
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500">
                            75
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500">
                            10
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500">
                            4
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500">
                            9
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Notes:</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>Make sure your Excel file has these exact column names</li>
                      <li>All numeric values should be positive numbers</li>
                      <li>The first row should be the header row</li>
                      <li>You can download a template by exporting your current data</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Import;
