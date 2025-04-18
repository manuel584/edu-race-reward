
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';
import { Users, Home } from 'lucide-react';
import TeacherAssignmentPanel from '@/components/TeacherAssignmentPanel';
import TeacherList from '@/components/TeacherList';
import { Teacher } from '@/types/teacher';
import { Button } from '@/components/ui/button';

const TeacherAssignment = () => {
  const { language } = useAppContext();
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [showAssignmentPanel, setShowAssignmentPanel] = useState(false);

  // Sample data - in a real app, this would come from an API
  const [teachers] = useState<Teacher[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@school.edu',
      role: 'teacher',
      department: 'Science',
      subjects: ['Biology', 'Chemistry'],
      assignedClasses: [],
      status: 'active',
      qualifications: [],
      createdAt: new Date().toISOString(),
    },
    // Add more sample teachers as needed
  ]);

  const breadcrumbItems = [
    { label: language === 'en' ? 'Home' : 'الرئيسية', path: '/', icon: <Home className="h-4 w-4" /> },
    { label: language === 'en' ? 'Teacher Assignment' : 'تعيين المعلمين' },
  ];

  const handleTeacherSelect = (id: string) => {
    setSelectedTeachers(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">
              {language === 'en' ? 'Teacher Assignment' : 'تعيين المعلمين'}
            </h1>
            
            <Button
              onClick={() => setShowAssignmentPanel(true)}
              disabled={selectedTeachers.length === 0}
            >
              <Users className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Assign Selected' : 'تعيين المحددين'}
            </Button>
          </div>

          {showAssignmentPanel ? (
            <TeacherAssignmentPanel
              teachers={teachers.filter(t => selectedTeachers.includes(t.id))}
              onAssign={() => {
                setShowAssignmentPanel(false);
                setSelectedTeachers([]);
              }}
              onCancel={() => setShowAssignmentPanel(false)}
              language={language}
            />
          ) : (
            <TeacherList
              teachers={teachers}
              selectedTeachers={selectedTeachers}
              onTeacherSelect={handleTeacherSelect}
              language={language}
            />
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default TeacherAssignment;
