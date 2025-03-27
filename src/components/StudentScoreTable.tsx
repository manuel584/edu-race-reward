
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, FileDown } from 'lucide-react';
import * as XLSX from 'xlsx';
import { StudentScore } from '@/types/student-score';
import AddScoreDialog from './AddScoreDialog';
import { toast } from 'sonner';

interface StudentScoreTableProps {
  scores: StudentScore[];
  onEditScore: (score: StudentScore) => void;
  onDeleteScore: (id: string) => void;
}

const StudentScoreTable: React.FC<StudentScoreTableProps> = ({
  scores,
  onEditScore,
  onDeleteScore
}) => {
  const { language } = useAppContext();
  const t = getTranslations(language);
  
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(scores.map(score => ({
      [t.studentName || "Student Name"]: score.studentName,
      [t.examName || "Exam Name"]: score.examName,
      [t.score || "Score"]: score.score,
      [t.date || "Date"]: new Date(score.date).toLocaleDateString()
    })));
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, t.studentScores || "Student Scores");
    
    // Generate Excel file and download
    XLSX.writeFile(workbook, `${t.studentScores || "Student Scores"}.xlsx`);
    toast.success(t.exportSuccess || "Exported successfully");
  };
  
  const calculateAverage = () => {
    if (scores.length === 0) return 0;
    const sum = scores.reduce((acc, score) => acc + score.score, 0);
    return (sum / scores.length).toFixed(2);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">{t.studentScores || "Student Scores"}</h2>
          {scores.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {t.average || "Average"}: <span className="font-medium">{calculateAverage()}</span>
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={exportToExcel}
            className="flex items-center gap-2"
            disabled={scores.length === 0}
          >
            <FileDown className="h-4 w-4" />
            {t.export || "Export"}
          </Button>
          <AddScoreDialog />
        </div>
      </div>
      
      {scores.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.studentName || "Student Name"}</TableHead>
                <TableHead>{t.examName || "Exam Name"}</TableHead>
                <TableHead className="text-right">{t.score || "Score"}</TableHead>
                <TableHead>{t.date || "Date"}</TableHead>
                <TableHead className="text-right">{t.actions || "Actions"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scores.map((score) => (
                <TableRow key={score.id}>
                  <TableCell className="font-medium">{score.studentName}</TableCell>
                  <TableCell>{score.examName}</TableCell>
                  <TableCell className="text-right">{score.score}</TableCell>
                  <TableCell>{new Date(score.date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => onEditScore(score)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onDeleteScore(score.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          {t.noScoresYet || "No scores added yet"}
        </div>
      )}
    </div>
  );
};

export default StudentScoreTable;
