
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';
import { Home, Book, File, FilePlus, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ExamList from '@/components/ExamList';
import CreateExamDialog from '@/components/CreateExamDialog';

const ExamCenter = () => {
  const { language } = useAppContext();
  const t = getTranslations(language);
  const [isCreateExamDialogOpen, setIsCreateExamDialogOpen] = useState(false);
  
  // Generate breadcrumb items
  const breadcrumbItems = [
    { label: t.home, path: '/', icon: <Home className="h-4 w-4" /> },
    { label: t.examCenter || "Exam Center" },
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
            <h1 className="text-3xl font-display font-bold">{t.examCenter || "Exam Center"}</h1>
            <Button 
              className="mt-4 md:mt-0 flex items-center gap-2"
              onClick={() => setIsCreateExamDialogOpen(true)}
            >
              <FilePlus className="h-4 w-4" />
              {t.createExam || "Create Exam"}
            </Button>
          </div>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="all">
                <Book className="h-4 w-4 mr-2" />
                {t.allExams || "All Exams"}
              </TabsTrigger>
              <TabsTrigger value="upcoming">
                <Calendar className="h-4 w-4 mr-2" />
                {t.upcoming || "Upcoming"}
              </TabsTrigger>
              <TabsTrigger value="archived">
                <File className="h-4 w-4 mr-2" />
                {t.archived || "Archived"}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <ExamList filter="all" />
            </TabsContent>
            
            <TabsContent value="upcoming" className="mt-0">
              <ExamList filter="upcoming" />
            </TabsContent>
            
            <TabsContent value="archived" className="mt-0">
              <ExamList filter="archived" />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
      
      <CreateExamDialog 
        open={isCreateExamDialogOpen}
        onOpenChange={setIsCreateExamDialogOpen}
      />
    </div>
  );
};

export default ExamCenter;
