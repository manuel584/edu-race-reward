
import React, { useState, useEffect, useRef } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Save, Undo, Redo, FileDown, FileUp, BarChart } from "lucide-react";
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { StudentScore, GradeDistribution } from '@/types/student-score';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import * as XLSX from 'xlsx';
import { useAuth } from '@/hooks/useAuth';

interface GradeSpreadsheetProps {
  examName: string;
  onUpdateChartData: (distribution: GradeDistribution, average: number) => void;
}

const GradeSpreadsheet: React.FC<GradeSpreadsheetProps> = ({ examName, onUpdateChartData }) => {
  const { language, scores = [], addScore, updateScore, deleteScore } = useAppContext();
  const { user } = useAuth();
  const t = getTranslations(language);
  
  // State for the spreadsheet data
  const [rows, setRows] = useState<Array<StudentScore & { isNew?: boolean }>>([]);
  const [history, setHistory] = useState<Array<Array<StudentScore & { isNew?: boolean }>>>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  
  // Ref for keyboard navigation
  const tableRef = useRef<HTMLTableElement>(null);
  
  // Load initial data based on exam name
  useEffect(() => {
    const filteredScores = scores.filter(score => score.examName === examName);
    
    if (filteredScores.length > 0) {
      setRows(filteredScores);
      // Initialize history with the current state
      setHistory([filteredScores]);
      setHistoryIndex(0);
    } else {
      // Add an empty row if no data exists
      addNewRow();
    }
  }, [examName, scores]);
  
  // Calculate grade distribution and average whenever rows change
  useEffect(() => {
    if (rows.length > 0) {
      // Calculate letter grades if not already set
      const updatedRows = rows.map(row => {
        if (!row.letterGrade && row.score !== undefined) {
          return { ...row, letterGrade: calculateLetterGrade(row.score, row.totalPossiblePoints || 100) };
        }
        return row;
      });
      
      if (JSON.stringify(updatedRows) !== JSON.stringify(rows)) {
        setRows(updatedRows);
      }
      
      // Calculate grade distribution
      const distribution = calculateGradeDistribution(updatedRows);
      
      // Calculate average score
      const validScores = updatedRows.filter(row => row.score !== undefined);
      const average = validScores.length > 0 
        ? validScores.reduce((sum, row) => sum + (row.score || 0), 0) / validScores.length 
        : 0;
      
      // Update the chart data
      onUpdateChartData(distribution, average);
    }
  }, [rows]);
  
  // Function to calculate letter grade based on percentage
  const calculateLetterGrade = (score: number, totalPoints: number): string => {
    const percentage = (score / totalPoints) * 100;
    
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };
  
  // Function to calculate grade distribution
  const calculateGradeDistribution = (data: StudentScore[]): GradeDistribution => {
    const distribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    
    data.forEach(row => {
      if (row.letterGrade) {
        distribution[row.letterGrade as keyof GradeDistribution]++;
      } else if (row.score !== undefined) {
        const letterGrade = calculateLetterGrade(row.score, row.totalPossiblePoints || 100);
        distribution[letterGrade as keyof GradeDistribution]++;
      }
    });
    
    return distribution;
  };
  
  // Function to add a new row
  const addNewRow = () => {
    const newRow: StudentScore & { isNew: boolean } = {
      id: uuidv4(),
      studentName: '',
      examName,
      score: 0,
      date: new Date().toISOString(),
      isNew: true,
      totalPossiblePoints: 100
    };
    
    // Save current state to history before changing
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...rows]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    setRows([...rows, newRow]);
    setHasPendingChanges(true);
  };
  
  // Function to handle cell value changes
  const handleCellChange = (id: string, field: keyof StudentScore, value: any) => {
    const updatedRows = rows.map(row => {
      if (row.id === id) {
        const updatedRow = { ...row, [field]: value };
        
        // Update letter grade if score changes
        if (field === 'score' || field === 'totalPossiblePoints') {
          const score = field === 'score' ? value : row.score;
          const totalPoints = field === 'totalPossiblePoints' ? value : row.totalPossiblePoints || 100;
          updatedRow.letterGrade = calculateLetterGrade(Number(score), Number(totalPoints));
        }
        
        return updatedRow;
      }
      return row;
    });
    
    setRows(updatedRows);
    setHasPendingChanges(true);
  };
  
  // Function to save all changes
  const saveAllChanges = () => {
    // Split rows into existing (to update) and new (to add)
    const existingRows = rows.filter(row => !row.isNew && row.studentName.trim() !== '');
    const newRows = rows.filter(row => row.isNew && row.studentName.trim() !== '');
    
    // Update existing rows
    existingRows.forEach(row => {
      updateScore(row.id, row);
    });
    
    // Add new rows
    newRows.forEach(row => {
      const { isNew, ...newRow } = row;
      addScore(newRow);
    });
    
    // Save current state to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...rows]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    // Mark all rows as not new
    setRows(rows.map(row => ({ ...row, isNew: false })));
    setHasPendingChanges(false);
    
    toast.success(t.changesSaved || 'All changes saved successfully');
  };
  
  // Functions for undo/redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setRows([...history[historyIndex - 1]]);
      setHasPendingChanges(true);
    }
  };
  
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setRows([...history[historyIndex + 1]]);
      setHasPendingChanges(true);
    }
  };
  
  // Function to export data to Excel
  const exportToExcel = () => {
    // Filter out empty rows
    const dataToExport = rows.filter(row => row.studentName.trim() !== '');
    
    // Prepare data for export
    const worksheetData = dataToExport.map(row => ({
      [t.studentId || 'Student ID']: row.studentId || '',
      [t.studentName || 'Student Name']: row.studentName,
      [t.score || 'Score']: row.score,
      [t.totalPossiblePoints || 'Total Possible Points']: row.totalPossiblePoints || 100,
      [t.letterGrade || 'Letter Grade']: row.letterGrade || '',
      [t.comments || 'Comments']: row.comments || ''
    }));
    
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, examName);
    
    // Export to file
    XLSX.writeFile(workbook, `${examName}_grades.xlsx`);
    
    toast.success(t.exportSuccess || 'Grades exported successfully');
  };
  
  // Function to import data from Excel
  const importFromExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first sheet
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Map imported data to StudentScore format
        const importedRows: Array<StudentScore & { isNew: boolean }> = jsonData.map((row: any) => {
          // Find keys for expected columns (they might have different names)
          const nameKey = Object.keys(row).find(key => 
            key.toLowerCase().includes('name') || key.toLowerCase().includes('student')
          );
          const scoreKey = Object.keys(row).find(key => 
            key.toLowerCase().includes('score') || key.toLowerCase().includes('points') || key.toLowerCase().includes('mark')
          );
          const totalPointsKey = Object.keys(row).find(key => 
            key.toLowerCase().includes('total') || key.toLowerCase().includes('possible')
          );
          const letterGradeKey = Object.keys(row).find(key => 
            key.toLowerCase().includes('letter') || key.toLowerCase().includes('grade')
          );
          const commentsKey = Object.keys(row).find(key => 
            key.toLowerCase().includes('comment') || key.toLowerCase().includes('feedback') || key.toLowerCase().includes('note')
          );
          const studentIdKey = Object.keys(row).find(key => 
            key.toLowerCase().includes('id') || key.toLowerCase().includes('number')
          );
          
          return {
            id: uuidv4(),
            studentName: nameKey ? String(row[nameKey]) : '',
            examName,
            score: scoreKey ? Number(row[scoreKey]) : 0,
            date: new Date().toISOString(),
            totalPossiblePoints: totalPointsKey ? Number(row[totalPointsKey]) : 100,
            letterGrade: letterGradeKey ? String(row[letterGradeKey]) : '',
            comments: commentsKey ? String(row[commentsKey]) : '',
            studentId: studentIdKey ? String(row[studentIdKey]) : '',
            isNew: true
          };
        });
        
        // Save current state to history
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push([...rows]);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        
        // Update rows with imported data
        setRows(importedRows);
        setHasPendingChanges(true);
        
        toast.success(t.importSuccess || 'Grades imported successfully');
      } catch (error) {
        console.error('Error importing file:', error);
        toast.error(t.importError || 'Error importing file. Please check the format.');
      }
    };
    
    reader.readAsArrayBuffer(file);
    
    // Reset the input value so the same file can be selected again
    event.target.value = '';
  };
  
  // Generate template Excel file
  const downloadTemplate = () => {
    // Create sample data
    const data = [
      {
        [t.studentId || 'Student ID']: 'S-101',
        [t.studentName || 'Student Name']: 'Ahmed Ali',
        [t.score || 'Score']: 85,
        [t.totalPossiblePoints || 'Total Possible Points']: 100,
        [t.letterGrade || 'Letter Grade']: 'B',
        [t.comments || 'Comments']: 'Great effort!'
      },
      {
        [t.studentId || 'Student ID']: 'S-102',
        [t.studentName || 'Student Name']: 'Sara Mohamed',
        [t.score || 'Score']: 92,
        [t.totalPossiblePoints || 'Total Possible Points']: 100,
        [t.letterGrade || 'Letter Grade']: 'A',
        [t.comments || 'Comments']: 'Top of class!'
      },
      {
        [t.studentId || 'Student ID']: 'S-103',
        [t.studentName || 'Student Name']: 'Mariam Khalid',
        [t.score || 'Score']: 78,
        [t.totalPossiblePoints || 'Total Possible Points']: 100,
        [t.letterGrade || 'Letter Grade']: 'C',
        [t.comments || 'Comments']: 'Needs more practice'
      }
    ];
    
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Set column widths
    const colWidths = [
      { wch: 15 }, // Student ID
      { wch: 25 }, // Student Name
      { wch: 10 }, // Score
      { wch: 20 }, // Total Possible Points
      { wch: 15 }, // Letter Grade
      { wch: 30 }, // Comments
    ];
    
    worksheet['!cols'] = colWidths;
    
    // Create workbook and add worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Grade Template');
    
    // Export to file
    XLSX.writeFile(workbook, 'grade_template.xlsx');
    
    toast.success(t.templateDownloaded || 'Template downloaded successfully');
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTableElement>, rowIndex: number, field: string) => {
    if (e.key === 'Tab' || e.key === 'Enter') {
      e.preventDefault();
      
      const table = tableRef.current;
      if (!table) return;
      
      const cells = table.querySelectorAll('input, select, textarea');
      const currentIndex = Array.from(cells).findIndex(cell => cell === e.target);
      
      // Tab: move to next cell
      // Enter: move to the cell below (or first cell of next row)
      let nextIndex = e.key === 'Tab' 
        ? currentIndex + (e.shiftKey ? -1 : 1) 
        : currentIndex + (e.shiftKey ? -3 : 3); // Assuming 3 editable cells per row
      
      // Wrap around to the start or end of the table
      if (nextIndex < 0) nextIndex = cells.length - 1;
      if (nextIndex >= cells.length) {
        // If at the last cell and pressed Tab/Enter, add a new row
        if (currentIndex === cells.length - 1 && !e.shiftKey) {
          addNewRow();
          nextIndex = 0;
          
          // We need to wait for the new row to be added to the DOM
          setTimeout(() => {
            const updatedCells = tableRef.current?.querySelectorAll('input, select, textarea');
            if (updatedCells) {
              (updatedCells[updatedCells.length - 3] as HTMLElement).focus();
            }
          }, 0);
          return;
        } else {
          nextIndex = 0;
        }
      }
      
      // Focus the next cell
      (cells[nextIndex] as HTMLElement).focus();
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <div className="flex gap-2">
          <Button 
            onClick={addNewRow}
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            {t.addRow || 'Add Row'}
          </Button>
          
          <Button 
            onClick={saveAllChanges} 
            disabled={!hasPendingChanges}
            className="flex items-center gap-1"
            variant={hasPendingChanges ? "default" : "outline"}
          >
            <Save className="h-4 w-4" />
            {t.saveAll || 'Save All'}
          </Button>
          
          <Button 
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            variant="outline"
            className="flex items-center"
          >
            <Undo className="h-4 w-4" />
          </Button>
          
          <Button 
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            variant="outline"
            className="flex items-center"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={exportToExcel}
            variant="outline"
            className="flex items-center gap-1"
          >
            <FileDown className="h-4 w-4" />
            {t.export || 'Export'}
          </Button>
          
          <label>
            <Button 
              variant="outline"
              className="flex items-center gap-1"
              onClick={() => document.getElementById('import-file')?.click()}
            >
              <FileUp className="h-4 w-4" />
              {t.import || 'Import'}
            </Button>
            <input 
              id="import-file"
              type="file" 
              accept=".xlsx,.xls,.csv" 
              className="hidden" 
              onChange={importFromExcel}
            />
          </label>
          
          <Button 
            onClick={downloadTemplate}
            variant="outline"
            className="flex items-center gap-1"
          >
            {t.downloadTemplate || 'Template'}
          </Button>
        </div>
      </div>
      
      <div className="border rounded-md overflow-auto max-h-[calc(100vh-300px)]">
        <Table ref={tableRef}>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead className="w-[120px]">{t.studentId || 'Student ID'}</TableHead>
              <TableHead>{t.studentName || 'Student Name'}</TableHead>
              <TableHead className="w-[100px]">{t.score || 'Score'}</TableHead>
              <TableHead className="w-[150px]">{t.totalPossiblePoints || 'Total Points'}</TableHead>
              <TableHead className="w-[120px]">{t.letterGrade || 'Letter Grade'}</TableHead>
              <TableHead>{t.comments || 'Comments'}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow 
                key={row.id}
                className={row.isNew ? "bg-muted/30" : ""}
              >
                <TableCell>
                  <Input
                    value={row.studentId || ''}
                    onChange={(e) => handleCellChange(row.id, 'studentId', e.target.value)}
                    placeholder={t.enterStudentId || 'Enter ID'}
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, 'studentId')}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={row.studentName}
                    onChange={(e) => handleCellChange(row.id, 'studentName', e.target.value)}
                    placeholder={t.enterStudentName || 'Enter name'}
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, 'studentName')}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={row.score}
                    onChange={(e) => handleCellChange(row.id, 'score', Number(e.target.value))}
                    placeholder="0"
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, 'score')}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={row.totalPossiblePoints || 100}
                    onChange={(e) => handleCellChange(row.id, 'totalPossiblePoints', Number(e.target.value))}
                    placeholder="100"
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, 'totalPossiblePoints')}
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={row.letterGrade || ''}
                    onValueChange={(value) => handleCellChange(row.id, 'letterGrade', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t.grade || 'Grade'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                      <SelectItem value="F">F</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Textarea
                    value={row.comments || ''}
                    onChange={(e) => handleCellChange(row.id, 'comments', e.target.value)}
                    placeholder={t.enterComments || 'Enter comments'}
                    rows={1}
                    className="min-h-[40px] resize-none"
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, 'comments')}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {rows.length === 0 && (
        <div className="py-8 text-center text-muted-foreground">
          {t.noStudents || 'No students yet. Add a new row to get started.'}
        </div>
      )}
    </div>
  );
};

export default GradeSpreadsheet;
