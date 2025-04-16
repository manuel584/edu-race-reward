
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { getTranslations } from "@/lib/i18n";
import { useAppContext } from "@/context/AppContext";
import Header from "@/components/Header";

const Home = () => {
  const { user } = useAuth();
  const { language } = useAppContext();
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
          <h1 className="text-3xl font-bold mb-6">{t.welcome}, {user?.name}!</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user?.role === 'admin' && (
              <Link to="/admin-dashboard" className="block">
                <div className="p-6 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
                  <h2 className="text-xl font-semibold mb-2">{t.adminDashboard}</h2>
                  <p className="text-muted-foreground">{t.adminDashboardDesc}</p>
                </div>
              </Link>
            )}
            
            {(user?.role === 'teacher' || user?.role === 'admin' || user?.role === 'supervisor') && (
              <Link to="/teacher-dashboard" className="block">
                <div className="p-6 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
                  <h2 className="text-xl font-semibold mb-2">{t.teacherDashboard}</h2>
                  <p className="text-muted-foreground">{t.teacherDashboardDesc}</p>
                </div>
              </Link>
            )}
            
            <Link to="/student-dashboard" className="block">
              <div className="p-6 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-xl font-semibold mb-2">{t.studentDashboard}</h2>
                <p className="text-muted-foreground">{t.studentDashboardDesc}</p>
              </div>
            </Link>
            
            <Link to="/dashboard" className="block">
              <div className="p-6 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-xl font-semibold mb-2">{t.mainDashboard}</h2>
                <p className="text-muted-foreground">{t.mainDashboardDesc}</p>
              </div>
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Home;
