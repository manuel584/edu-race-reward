
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import Header from '@/components/Header';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
  const location = useLocation();
  const { language } = useAppContext();
  const t = getTranslations(language);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="page-container">
        <motion.div 
          className="max-w-md mx-auto text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="bg-red-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          
          <h1 className="text-4xl font-display font-bold mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">Oops! Page not found</p>
          
          <Link 
            to="/" 
            className="button-primary inline-block"
          >
            {t.back}
          </Link>
        </motion.div>
      </main>
    </div>
  );
};

export default NotFound;
