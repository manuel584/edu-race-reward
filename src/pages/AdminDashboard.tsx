
import React from "react";
import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@/hooks/useAuth";
import { getTranslations } from "@/lib/i18n";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { students, language } = useAppContext();
  const { user } = useAuth();
  const t = getTranslations(language);
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 py-8 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-6">{t.adminDashboard}</h1>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{t.adminOverview}</CardTitle>
              <CardDescription>{t.adminWelcome} {user?.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-primary/10">
                  <h3 className="text-sm font-medium text-muted-foreground">{t.totalStudents}</h3>
                  <p className="text-2xl font-bold">{students.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <h2 className="text-xl font-semibold mb-4">{t.adminTools}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Link to="/user-management" className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{t.userManagement}</CardTitle>
                  <CardDescription>{t.manageUsers}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
            
            <Link to="/import" className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{t.dataImport}</CardTitle>
                  <CardDescription>{t.importDataDesc}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
            
            <Link to="/class-sections" className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{t.classSections}</CardTitle>
                  <CardDescription>{t.manageSections}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboard;
