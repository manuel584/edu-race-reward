
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';
import { Home, FileText, File, FilePlus, Calendar, Table } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ExamList from '@/components/ExamList';
import RecordResultDialog from '@/components/RecordResultDialog';
import { Link } from 'react-router-dom';

const ExamCenter = () => {
  const { language } = useAppContext();
  const t = getTranslations(language);
  const [isRecordResultDialogOpen, setIsRecordResultDialogOpen] = useState(false);
  
  // Generate breadcrumb items
  const breadcrumbItems = [
    { label: t.home || "Home", path: '/', icon: <Home className="h-4 w-4" /> },
    { label: t.enterResults || "Enter Results" },
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
            <h1 className="text-3xl font-display font-bold">{t.enterResults || "Enter Results"}</h1>
            <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
              <Button variant="outline" asChild>
                <Link to="/grade-entry">
                  <Table className="h-4 w-4 mr-2" />
                  {t.gradeEntry || "Grade Entry"}
                </Link>
              </Button>
              <Button 
                className="flex items-center gap-2"
                onClick={() => setIsRecordResultDialogOpen(true)}
              >
                <FilePlus className="h-4 w-4" />
                {t.recordResult || "Record Result"}
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="all">
                <FileText className="h-4 w-4 mr-2" />
                {t.allResults || "All Results"}
              </TabsTrigger>
              <TabsTrigger value="recent">
                <Calendar className="h-4 w-4 mr-2" />
                {t.recentResults || "Recent"}
              </TabsTrigger>
              <TabsTrigger value="historical">
                <File className="h-4 w-4 mr-2" />
                {t.historicalResults || "Historical"}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <ExamList filter="all" />
            </TabsContent>
            
            <TabsContent value="recent" className="mt-0">
              <ExamList filter="recent" />
            </TabsContent>
            
            <TabsContent value="historical" className="mt-0">
              <ExamList filter="historical" />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
      
      <RecordResultDialog 
        open={isRecordResultDialogOpen}
        onOpenChange={setIsRecordResultDialogOpen}
      />
    </div>
  );
};

export default ExamCenter;
