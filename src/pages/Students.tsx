
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { Search, UserPlus, Filter } from 'lucide-react';
import { toast } from 'sonner';

const Students = () => {
  const { students, language } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  
  const t = getTranslations(language);
  
  // Filter students based on search term
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="page-container">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-3xl font-display font-bold">{t.students}</h1>
            
            <div className="mt-4 md:mt-0">
              <Link 
                to="/dashboard" 
                className="button-primary inline-flex items-center"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                {t.addStudent}
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder={t.searchStudents}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              
              <button className="button-secondary inline-flex items-center md:w-auto">
                <Filter className="mr-2 h-4 w-4" />
                {t.filterStudents}
              </button>
            </div>
          </div>
          
          {filteredStudents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map(student => (
                <motion.div 
                  key={student.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:border-blue-200 hover:shadow-md transition-all duration-200"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link to={`/student/${student.id}`} className="block p-6">
                    <h3 className="text-xl font-semibold mb-2">{student.name}</h3>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">{t.points}:</span>
                      <span className="font-medium text-blue-600">{student.points}</span>
                    </div>
                    
                    <div className="mt-4 w-full bg-gray-100 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
                        style={{ width: `${Math.min(100, (student.points / 500) * 100)}%` }}
                      ></div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <p className="text-gray-500">{t.noStudents}</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Students;
