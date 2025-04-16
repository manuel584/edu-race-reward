
import React from "react";
import { useAppContext } from "@/context/AppContext";
import { getTranslations } from "@/lib/i18n";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
  const { students, language } = useAppContext();
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
          <h1 className="text-3xl font-bold mb-6">{t.studentDashboard}</h1>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{t.studentOverview}</CardTitle>
              <CardDescription>{t.studentOverviewDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-primary/10">
                  <h3 className="text-sm font-medium text-muted-foreground">{t.totalStudents}</h3>
                  <p className="text-2xl font-bold">{activeStudents.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <h2 className="text-xl font-semibold mb-4">{t.recentStudents}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {activeStudents.slice(0, 6).map(student => (
              <Link key={student.id} to={`/student/${student.id}`} className="block">
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{student.name}</CardTitle>
                    <CardDescription>{student.grade}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="flex justify-between">
                      <span>{t.points}:</span>
                      <span className="font-medium">{student.points}</span>
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          <div className="text-center">
            <Link 
              to="/students" 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2"
            >
              {t.viewAllStudents}
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default StudentDashboard;
