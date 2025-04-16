
import React from "react";
import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@/hooks/useAuth";
import { getTranslations } from "@/lib/i18n";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const TeacherDashboard = () => {
  const { students, language } = useAppContext();
  const { user } = useAuth();
  const t = getTranslations(language);
  
  // Filter active students only
  const activeStudents = students.filter(student => !student.archived);
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 py-8 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-6">{t.teacherDashboard}</h1>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{t.teacherOverview}</CardTitle>
              <CardDescription>{t.teacherWelcome} {user?.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-primary/10">
                  <h3 className="text-sm font-medium text-muted-foreground">{t.assignedStudents}</h3>
                  <p className="text-2xl font-bold">{activeStudents.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <h2 className="text-xl font-semibold mb-4">{t.quickAccess}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Link to="/students" className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{t.students}</CardTitle>
                  <CardDescription>{t.manageStudents}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
            
            <Link to="/scores" className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{t.scores}</CardTitle>
                  <CardDescription>{t.manageScores}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
            
            <Link to="/exam-center" className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{t.examCenter}</CardTitle>
                  <CardDescription>{t.manageExams}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
