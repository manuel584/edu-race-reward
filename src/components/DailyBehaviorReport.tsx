
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Student } from '@/context/AppContext';
import { toast } from 'sonner';

const DailyBehaviorReport = () => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [bestStudents, setBestStudents] = useState<string[]>([]);
  const [worstStudents, setWorstStudents] = useState<string[]>([]);
  const { students, addBehaviorReport, getDailyBehaviorReports, language } = useAppContext();
  const t = getTranslations(language);
  
  const activeStudents = students.filter(s => !s.archived);
  const reports = getDailyBehaviorReports();
  
  const handleAddReport = () => {
    if (bestStudents.length === 0 && worstStudents.length === 0) {
      toast.error(t.selectAtLeastOneStudent || "Please select at least one student");
      return;
    }
    
    addBehaviorReport(
      format(date, 'yyyy-MM-dd'),
      worstStudents,
      bestStudents
    );
    
    setOpen(false);
    toast.success(t.behaviorReportAdded || "Behavior report added successfully");
  };
  
  const handleAddBestStudent = (studentId: string) => {
    if (bestStudents.includes(studentId)) {
      setBestStudents(bestStudents.filter(id => id !== studentId));
    } else {
      setBestStudents([...bestStudents, studentId]);
    }
  };
  
  const handleAddWorstStudent = (studentId: string) => {
    if (worstStudents.includes(studentId)) {
      setWorstStudents(worstStudents.filter(id => id !== studentId));
    } else {
      setWorstStudents([...worstStudents, studentId]);
    }
  };
  
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {t.addBehaviorReport || "Add Behavior Report"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {t.dailyBehaviorReport || "Daily Behavior Report"}
            </DialogTitle>
            <DialogDescription>
              {t.selectBestAndWorstStudents || "Select the best and worst behaved students for today."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">
                {t.selectDate || "Select Date"}
              </label>
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                className="rounded-md border"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4 text-green-500" />
                  {t.bestBehavedStudents || "Best Behaved Students"}
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto p-2 border rounded-md">
                  {activeStudents.map(student => (
                    <div 
                      key={`best-${student.id}`}
                      className={cn(
                        "p-2 rounded-md cursor-pointer transition-colors",
                        bestStudents.includes(student.id) 
                          ? "bg-green-100 dark:bg-green-900/20" 
                          : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      )}
                      onClick={() => handleAddBestStudent(student.id)}
                    >
                      <div className="flex items-center justify-between">
                        <span>{student.name}</span>
                        <span className="text-xs text-gray-500">{student.grade}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                  <ThumbsDown className="h-4 w-4 text-red-500" />
                  {t.worstBehavedStudents || "Misbehaved Students"}
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto p-2 border rounded-md">
                  {activeStudents.map(student => (
                    <div 
                      key={`worst-${student.id}`}
                      className={cn(
                        "p-2 rounded-md cursor-pointer transition-colors",
                        worstStudents.includes(student.id) 
                          ? "bg-red-100 dark:bg-red-900/20" 
                          : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      )}
                      onClick={() => handleAddWorstStudent(student.id)}
                    >
                      <div className="flex items-center justify-between">
                        <span>{student.name}</span>
                        <span className="text-xs text-gray-500">{student.grade}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t.cancel || "Cancel"}
            </Button>
            <Button onClick={handleAddReport}>
              {t.save || "Save Report"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">{t.recentBehaviorReports || "Recent Behavior Reports"}</h2>
        
        {reports.length > 0 ? (
          <div className="space-y-4">
            {reports.slice().reverse().map((report, index) => (
              <motion.div
                key={report.date}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border rounded-lg p-4 bg-white dark:bg-gray-800 dark:border-gray-700"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{format(new Date(report.date), 'PPP')}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4 text-green-500" />
                      {t.bestBehavedStudents || "Best Behaved Students"}
                    </h3>
                    {report.bestBehaved.length > 0 ? (
                      <div className="space-y-2">
                        {report.bestBehaved.map((student) => (
                          <div 
                            key={`best-${student.id}-${report.date}`}
                            className="p-2 bg-green-50 dark:bg-green-900/20 rounded-md"
                          >
                            <div className="flex items-center justify-between">
                              <span>{student.name}</span>
                              <span className="text-xs text-gray-500">{student.grade}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 italic">
                        {t.noBestStudentsSelected || "No students selected"}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                      <ThumbsDown className="h-4 w-4 text-red-500" />
                      {t.worstBehavedStudents || "Misbehaved Students"}
                    </h3>
                    {report.worstBehaved.length > 0 ? (
                      <div className="space-y-2">
                        {report.worstBehaved.map((student) => (
                          <div 
                            key={`worst-${student.id}-${report.date}`}
                            className="p-2 bg-red-50 dark:bg-red-900/20 rounded-md"
                          >
                            <div className="flex items-center justify-between">
                              <span>{student.name}</span>
                              <span className="text-xs text-gray-500">{student.grade}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 italic">
                        {t.noWorstStudentsSelected || "No students selected"}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-lg border">
            {t.noBehaviorReports || "No behavior reports available yet"}
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyBehaviorReport;
