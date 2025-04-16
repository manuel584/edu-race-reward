
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';
import { Home } from 'lucide-react';
import StudentScoreTable from '@/components/StudentScoreTable';
import EditScoreDialog from '@/components/EditScoreDialog';
import { StudentScore } from '@/types/student-score';
import { toast } from 'sonner';

const Scores = () => {
  const { language, scores, deleteScore } = useAppContext();
  const t = getTranslations(language);
  
  const [scoreToEdit, setScoreToEdit] = useState<StudentScore | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Generate breadcrumb items
  const breadcrumbItems = [
    { label: t.home, path: '/', icon: <Home className="h-4 w-4" /> },
    { label: t.scores || "Scores" },
  ];
  
  const handleEditScore = (score: StudentScore) => {
    setScoreToEdit(score);
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteScore = (id: string) => {
    if (window.confirm(t.confirmDelete || "Are you sure you want to delete this score?")) {
      deleteScore(id);
      toast.success(t.scoreDeleted || "Score deleted successfully");
    }
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
            <h1 className="text-3xl font-display font-bold">{t.scores || "Scores"}</h1>
          </div>
          
          <StudentScoreTable 
            scores={scores} 
            onEditScore={handleEditScore}
            onDeleteScore={handleDeleteScore}
          />
        </motion.div>
      </main>
      
      <EditScoreDialog 
        score={scoreToEdit}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </div>
  );
};

export default Scores;
