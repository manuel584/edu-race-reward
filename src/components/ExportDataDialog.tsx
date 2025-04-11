
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileDown,
  FileSpreadsheet,
  Loader2
} from 'lucide-react';
import * as XLSX from 'xlsx';

interface ExportDataDialogProps {
  studentId?: string;
  gradeLevel?: string;
  children?: React.ReactNode;
}

const ExportDataDialog: React.FC<ExportDataDialogProps> = ({ 
  studentId, 
  gradeLevel,
  children
}) => {
  const { students, language } = useAppContext();
  const t = getTranslations(language);
  
  const [open, setOpen] = useState(false);
  const [scope, setScope] = useState<'student' | 'grade' | 'all'>(
    studentId ? 'student' : (gradeLevel ? 'grade' : 'all')
  );
  const [selectedStudent, setSelectedStudent] = useState<string>(studentId || '');
  const [selectedGrade, setSelectedGrade] = useState<string>(gradeLevel || '');
  const [dataType, setDataType] = useState<'race' | 'nomination' | 'recognition' | 'all'>('all');
  const [isExporting, setIsExporting] = useState(false);
  
  // Get unique grades
  const uniqueGrades = [...new Set(students.map(student => student.grade))].sort();
  
  // Handle export
  const handleExport = () => {
    setIsExporting(true);
    
    // Filter students based on scope
    let filteredStudents = [...students];
    if (scope === 'student' && selectedStudent) {
      filteredStudents = students.filter(s => s.id === selectedStudent);
    } else if (scope === 'grade' && selectedGrade) {
      filteredStudents = students.filter(s => s.grade === selectedGrade);
    }
    
    // No data to export
    if (filteredStudents.length === 0) {
      toast.error(t.noDataToExport);
      setIsExporting(false);
      return;
    }
    
    // Prepare export data
    let exportData: any[] = [];
    
    // Export race to goal data
    if (dataType === 'race' || dataType === 'all') {
      exportData = filteredStudents.map(student => ({
        Name: student.name,
        Grade: student.grade,
        Points: student.points,
        Nationality: student.nationality,
        Attendance: student.attendance,
        EngagementScore: student.engagementScore,
        BooksOwned: student.booksOwned
      }));
    }
    
    // Export nomination data
    if (dataType === 'nomination' || dataType === 'all') {
      // If already exporting race data, we need to merge
      if (exportData.length > 0) {
        exportData = filteredStudents.map((student, index) => {
          const nominations = student.recognitions?.filter(r => r.isNomination) || [];
          return {
            ...exportData[index],
            NominationsCount: nominations.length,
            LastNomination: nominations.length > 0 ? 
              new Date(Math.max(...nominations.map(n => new Date(n.date).getTime()))).toLocaleDateString() : ''
          };
        });
      } else {
        exportData = filteredStudents.map(student => {
          const nominations = student.recognitions?.filter(r => r.isNomination) || [];
          return {
            Name: student.name,
            Grade: student.grade,
            NominationsCount: nominations.length,
            LastNomination: nominations.length > 0 ? 
              new Date(Math.max(...nominations.map(n => new Date(n.date).getTime()))).toLocaleDateString() : ''
          };
        });
      }
    }
    
    // Export recognition data
    if (dataType === 'recognition' || dataType === 'all') {
      // If already exporting other data, we need to merge
      if (exportData.length > 0) {
        exportData = filteredStudents.map((student, index) => {
          return {
            ...exportData[index],
            Helpfulness: student.helpfulness || 0,
            Respect: student.respect || 0,
            Teamwork: student.teamwork || 0,
            Excellence: student.excellence || 0,
            Awards: (student.awards || []).join(', ')
          };
        });
      } else {
        exportData = filteredStudents.map(student => {
          return {
            Name: student.name,
            Grade: student.grade,
            Helpfulness: student.helpfulness || 0,
            Respect: student.respect || 0,
            Teamwork: student.teamwork || 0,
            Excellence: student.excellence || 0,
            Awards: (student.awards || []).join(', ')
          };
        });
      }
    }
    
    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    
    // Generate filename
    let filename = "students_export.xlsx";
    if (scope === 'student' && selectedStudent) {
      const student = students.find(s => s.id === selectedStudent);
      if (student) {
        filename = `student_${student.name.replace(/\s/g, '_')}_export.xlsx`;
      }
    } else if (scope === 'grade' && selectedGrade) {
      filename = `grade_${selectedGrade}_export.xlsx`;
    }
    
    // Save file
    XLSX.writeFile(wb, filename);
    
    // Show success message
    toast.success(t.exportCompleted);
    setIsExporting(false);
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" className="flex items-center gap-2">
            <FileDown className="h-4 w-4" />
            {t.export}
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t.exportData}</DialogTitle>
          <DialogDescription>
            {t.exportOptions}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>{t.selectExportScope}</Label>
            <Tabs 
              defaultValue={scope} 
              onValueChange={(v) => setScope(v as 'student' | 'grade' | 'all')}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 mb-2">
                <TabsTrigger value="student">{t.individualStudent}</TabsTrigger>
                <TabsTrigger value="grade">{t.entireGrade}</TabsTrigger>
                <TabsTrigger value="all">{t.allStudents}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="student" className="mt-2">
                <Select 
                  value={selectedStudent} 
                  onValueChange={setSelectedStudent}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.selectStudent} />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map(student => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name} ({student.grade})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TabsContent>
              
              <TabsContent value="grade" className="mt-2">
                <Select 
                  value={selectedGrade} 
                  onValueChange={setSelectedGrade}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.selectGrade} />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueGrades.map(grade => (
                      <SelectItem key={grade} value={grade}>
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-2">
            <Label>{t.selectDataType}</Label>
            <Tabs 
              defaultValue={dataType} 
              onValueChange={(v) => setDataType(v as 'race' | 'nomination' | 'recognition' | 'all')}
              className="w-full"
            >
              <TabsList className="grid grid-cols-4 mb-2">
                <TabsTrigger value="race">{t.raceToGoalData}</TabsTrigger>
                <TabsTrigger value="nomination">{t.nominationData}</TabsTrigger>
                <TabsTrigger value="recognition">{t.recognitionData}</TabsTrigger>
                <TabsTrigger value="all">{t.allData}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t.cancel}
          </Button>
          <Button 
            onClick={handleExport} 
            className="flex items-center gap-2"
            disabled={isExporting || (scope === 'student' && !selectedStudent) || (scope === 'grade' && !selectedGrade)}
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t.exportingData}
              </>
            ) : (
              <>
                <FileSpreadsheet className="h-4 w-4" />
                {t.downloadExport}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDataDialog;
