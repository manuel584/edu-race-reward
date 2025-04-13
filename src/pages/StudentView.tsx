import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';
import { Home, Book, GraduationCap, Flag, User, Edit, Archive, Unarchive, Award, Clock, ListChecks, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import StudentPointsHistory from '@/components/StudentPointsHistory';
import StudentAwards from '@/components/StudentAwards';
import AddAwardDialog from '@/components/AddAwardDialog';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import EditStudentDialog from '@/components/EditStudentDialog';
import NominationDialog from '@/components/NominationDialog';
import RecognitionOverview from '@/components/RecognitionOverview';
import StudentScores from '@/components/StudentScores';
import QuickPointAdjust from '@/components/QuickPointAdjust';

const StudentView = () => {
  const { id } = useParams<{ id: string }>();
  const { students, language, archiveStudent, unarchiveStudent, goalPoints } = useAppContext();
  const t = getTranslations(language);
  const navigate = useNavigate();
  
  const [student, setStudent] = useState(students.find(s => s.id === id));
  const [addAwardOpen, setAddAwardOpen] = useState(false);
  const [editStudentOpen, setEditStudentOpen] = useState(false);
  const [nominationOpen, setNominationOpen] = useState(false);
  
  useEffect(() => {
    const currentStudent = students.find(s => s.id === id);
    setStudent(currentStudent);
  }, [id, students]);
  
  // Redirect to /students if student is not found
  useEffect(() => {
    if (!student && id) {
      navigate('/students');
    }
  }, [student, id, navigate]);
  
  if (!student) {
    return null;
  }
  
  const progressPercentage = Math.min(100, (student.points / goalPoints) * 100);
  
  const breadcrumbItems = [
    { label: t.home, path: '/', icon: <Home className="h-4 w-4" /> },
    { label: t.students, path: '/students' },
    { label: student.name },
  ];
  
  const handleArchiveStudent = () => {
    if (window.confirm(t.confirmDelete || "Are you sure you want to archive this student?")) {
      archiveStudent(student.id);
      const message = language === 'en' ? "Student archived successfully" : "تم أرشفة الطالب بنجاح";
      toast.success(message);
      navigate('/students');
    }
  };
  
  const handleUnarchiveStudent = () => {
    unarchiveStudent(student.id);
    const message = language === 'en' ? "Student unarchived successfully" : "تم إلغاء أرشفة الطالب بنجاح";
    toast.success(message);
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
          
          <div className="md:flex md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-display font-bold">{student.name}</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {t.studentDetails || "View and manage student details"}
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex gap-2 flex-wrap">
              <Button variant="outline" onClick={() => setNominationOpen(true)} className="flex items-center gap-2">
                {/* <Award className="h-4 w-4" /> */}
                <span>{t.nominateStudent || "Nominate Student"}</span>
              </Button>
              
              <Button variant="outline" onClick={() => setEditStudentOpen(true)} className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                <span>{t.editStudent || "Edit Student"}</span>
              </Button>
              
              {student.archived ? (
                <Button variant="outline" onClick={handleUnarchiveStudent} className="flex items-center gap-2">
                  <Unarchive className="h-4 w-4" />
                  <span>{t.unarchive || "Unarchive"}</span>
                </Button>
              ) : (
                <Button variant="destructive" onClick={handleArchiveStudent} className="flex items-center gap-2">
                  <Archive className="h-4 w-4" />
                  <span>{t.archiveStudent || "Archive Student"}</span>
                </Button>
              )}
            </div>
          </div>
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">
                <User className="mr-2 h-4 w-4" />
                {t.overview || "Overview"}
              </TabsTrigger>
              <TabsTrigger value="scores">
                <ListChecks className="mr-2 h-4 w-4" />
                {t.studentScores || "Scores"}
              </TabsTrigger>
              <TabsTrigger value="history">
                <Clock className="mr-2 h-4 w-4" />
                {t.history || "History"}
              </TabsTrigger>
              <TabsTrigger value="awards">
                <Award className="mr-2 h-4 w-4" />
                {t.achievements || "Achievements"}
              </TabsTrigger>
              <TabsTrigger value="recognitions">
                <TrendingUp className="mr-2 h-4 w-4" />
                {t.recognitions || "Recognitions"}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t.studentInformation || "Student Information"}</CardTitle>
                    <CardDescription>{t.generalInformation || "General information about the student"}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium mb-1">{t.points || "Points"}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-3xl font-bold">{student.points}</span>
                          <span className="text-sm text-gray-500">/ {goalPoints}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <QuickPointAdjust studentId={student.id} studentName={student.name} isAdd={true} />
                        <QuickPointAdjust studentId={student.id} studentName={student.name} isAdd={false} />
                      </div>
                    </div>
                    
                    <Progress value={progressPercentage} className="mb-4" />
                    
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2 gap-2">
                      <User className="h-4 w-4" />
                      <span>{student.name}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2 gap-2">
                      <GraduationCap className="h-4 w-4" />
                      <span>{student.grade}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2 gap-2">
                      <Flag className="h-4 w-4" />
                      <span>{student.nationality === 'international' ? t.international : t.national}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-2">
                      <Book className="h-4 w-4" />
                      <span>{student.books || t.noBooksYet || "No books yet"}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>{t.studentProgress || "Student Progress"}</CardTitle>
                    <CardDescription>{t.overviewOfStudentProgress || "Overview of student progress"}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecognitionOverview studentId={student.id} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="scores">
              <StudentScores studentId={student.id} />
            </TabsContent>
            
            <TabsContent value="history">
              <StudentPointsHistory studentId={student.id} />
            </TabsContent>
            
            <TabsContent value="awards">
              <div className="md:flex md:items-center md:justify-between mb-4">
                <h2 className="text-xl font-semibold">{t.achievements || "Achievements"}</h2>
                <Button onClick={() => setAddAwardOpen(true)} className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  <span>{t.addAchievement || "Add Achievement"}</span>
                </Button>
              </div>
              
              <StudentAwards studentId={student.id} />
            </TabsContent>
            
            <TabsContent value="recognitions">
              <div>
                <RecognitionOverview studentId={student.id} />
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
      
      <AddAwardDialog 
        studentId={student.id}
        open={addAwardOpen}
        onOpenChange={setAddAwardOpen}
      />
      
      <EditStudentDialog 
        student={student}
        open={editStudentOpen}
        onOpenChange={setEditStudentOpen}
      />
      
      <NominationDialog 
        student={student}
        open={nominationOpen}
        onOpenChange={setNominationOpen}
      />
    </div>
  );
};

export default StudentView;
