
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppContext, ClassMetrics } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { Trophy, Star, Award, ArrowUp, ArrowDown, Check, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ClassCardProps {
  classData: ClassMetrics;
  onActionClick: (action: string, classId: string) => void;
}

const ClassCard: React.FC<ClassCardProps> = ({ classData, onActionClick }) => {
  const { language } = useAppContext();
  const t = getTranslations(language);
  const navigate = useNavigate();
  
  // Get improvement indicator
  const getImprovementIndicator = () => {
    if (typeof classData.weeklyImprovement === 'number') {
      if (classData.weeklyImprovement > 5) {
        return { color: 'text-green-600', icon: <ArrowUp className="h-4 w-4" />, text: t.significantImprovement || "Significant improvement" };
      } else if (classData.weeklyImprovement > 0) {
        return { color: 'text-blue-600', icon: <ArrowUp className="h-4 w-4" />, text: t.improving || "Improving" };
      } else if (classData.weeklyImprovement === 0) {
        return { color: 'text-gray-600', icon: null, text: t.steady || "Steady" };
      } else {
        return { color: 'text-orange-600', icon: <ArrowDown className="h-4 w-4" />, text: t.needsAttention || "Needs attention" };
      }
    }
    return { color: 'text-gray-600', icon: null, text: t.noData || "No data" };
  };
  
  const improvement = getImprovementIndicator();
  
  // Function to view class students
  const viewClassStudents = () => {
    navigate(`/students?grade=${classData.name}`);
  };
  
  return (
    <motion.div
      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold mb-1 flex items-center">
              <GraduationCap className="h-5 w-5 mr-2 text-blue-600" />
              {classData.name}
            </h3>
            <div className={`text-sm flex items-center ${improvement.color}`}>
              {improvement.icon && <span className="mr-1">{improvement.icon}</span>}
              <span>{improvement.text}</span>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="19" r="1" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>{t.actions || "Actions"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={viewClassStudents} className="cursor-pointer">
                {t.viewStudents || "View Students"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onActionClick('achievement', classData.id)} className="cursor-pointer">
                {t.addAchievement || "Add Achievement"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onActionClick('report', classData.id)} className="cursor-pointer">
                {t.generateReport || "Generate Report"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="space-y-3 mb-4">
          <div>
            <div className="flex justify-between mb-1 text-sm">
              <span className="text-gray-600">{t.totalPoints || "Total Points"}</span>
              <span className="font-medium">{classData.totalPoints}</span>
            </div>
            <Progress value={Math.min(100, (classData.totalPoints / 1000) * 100)} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between mb-1 text-sm">
              <span className="text-gray-600">{t.averageAttendance || "Avg. Attendance"}</span>
              <span className="font-medium">{classData.averageAttendance.toFixed(1)}/10</span>
            </div>
            <Progress value={classData.averageAttendance * 10} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between mb-1 text-sm">
              <span className="text-gray-600">{t.engagement || "Engagement"}</span>
              <span className="font-medium">{classData.averageEngagement.toFixed(1)}/10</span>
            </div>
            <Progress value={classData.averageEngagement * 10} className="h-2" />
          </div>
        </div>
        
        {classData.achievements && classData.achievements.length > 0 ? (
          <div className="mt-4">
            <h4 className="text-xs uppercase text-gray-500 font-medium mb-2">{t.achievements || "Achievements"}</h4>
            <div className="space-y-1.5">
              {classData.achievements.slice(0, 2).map((achievement, index) => (
                <div key={index} className="flex items-center text-sm">
                  <Trophy className="h-3.5 w-3.5 text-amber-500 mr-1.5" />
                  <span>{achievement}</span>
                </div>
              ))}
              {classData.achievements.length > 2 && (
                <div className="text-xs text-gray-500">
                  +{classData.achievements.length - 2} {t.more || "more"}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-4 text-sm text-gray-500">
            {t.noAchievementsYet || "No achievements yet"}
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-100 bg-gray-50 px-4 py-3">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-center"
          onClick={viewClassStudents}
        >
          {t.viewClass || "View Class"}
        </Button>
      </div>
    </motion.div>
  );
};

const ClassRecognition = () => {
  const { getClassMetrics, addClassAchievement, language } = useAppContext();
  const t = getTranslations(language);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [achievementText, setAchievementText] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  
  // Get class metrics
  const classMetrics = getClassMetrics();
  
  // Handle class action
  const handleClassAction = (action: string, classId: string) => {
    setSelectedClass(classId);
    
    if (action === 'achievement') {
      setDialogOpen(true);
    } else if (action === 'report') {
      toast.info(`${t.generatingReportFor || "Generating report for"} ${classId}`, {
        description: t.reportNotImplemented || "This feature is not implemented yet"
      });
    }
  };
  
  // Handle add achievement
  const handleAddAchievement = () => {
    if (!selectedClass || !achievementText) return;
    
    addClassAchievement(selectedClass, achievementText);
    
    toast.success(t.achievementAdded || "Achievement added", {
      description: `${achievementText} ${t.addedTo || "added to"} ${selectedClass}`
    });
    
    setAchievementText('');
    setDialogOpen(false);
  };
  
  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold mb-4">{t.classes || "Classes"}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {classMetrics.map((classData) => (
            <ClassCard 
              key={classData.id} 
              classData={classData} 
              onActionClick={handleClassAction} 
            />
          ))}
        </div>
      </div>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.addClassAchievement || "Add Class Achievement"}</DialogTitle>
            <DialogDescription>
              {t.addAchievementDescription || "Add a new achievement for this class"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.achievement || "Achievement"}</label>
              <input 
                type="text" 
                value={achievementText}
                onChange={(e) => setAchievementText(e.target.value)}
                placeholder={t.achievementPlaceholder || "Enter achievement description"}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t.cancel || "Cancel"}
            </Button>
            <Button onClick={handleAddAchievement} disabled={!achievementText}>
              <Check className="mr-2 h-4 w-4" />
              {t.addAchievement || "Add Achievement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClassRecognition;
