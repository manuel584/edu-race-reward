
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { ChevronRight, Users, BarChart2, Trophy, FileSpreadsheet } from 'lucide-react';
import Header from '@/components/Header';
import { getTranslations } from '@/lib/i18n';

const Index = () => {
  const { language } = useAppContext();
  const t = getTranslations(language);
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: custom * 0.1,
        duration: 0.5,
        ease: 'easeOut'
      }
    })
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      <main className="page-container">
        <section className="max-w-4xl mx-auto text-center py-12 md:py-20">
          <motion.h1 
            className="text-4xl md:text-5xl font-display font-bold mb-6"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            {t.welcome}
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 mb-10"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            {t.description}
          </motion.p>
          
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            <Link 
              to="/dashboard" 
              className="button-primary inline-flex items-center"
            >
              {t.getStarted}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </motion.div>
        </section>
        
        <section className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div 
              className="glass-card p-6 card-hover"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={4}
            >
              <Users className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t.students}</h3>
              <p className="text-gray-600 mb-4">Add, view, and manage students in your classes</p>
              <Link 
                to="/students" 
                className="text-blue-600 inline-flex items-center hover:text-blue-700"
              >
                View Students
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </motion.div>
            
            <motion.div 
              className="glass-card p-6 card-hover"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={5}
            >
              <BarChart2 className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t.dashboard}</h3>
              <p className="text-gray-600 mb-4">Track progress and analyze student performance</p>
              <Link 
                to="/dashboard" 
                className="text-blue-600 inline-flex items-center hover:text-blue-700"
              >
                View Dashboard
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </motion.div>
            
            <motion.div 
              className="glass-card p-6 card-hover"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={6}
            >
              <Trophy className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t.raceToGoal}</h3>
              <p className="text-gray-600 mb-4">Motivate students with a race towards achievement</p>
              <Link 
                to="/dashboard" 
                className="text-blue-600 inline-flex items-center hover:text-blue-700"
              >
                View Race
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </motion.div>
            
            <motion.div 
              className="glass-card p-6 card-hover"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={7}
            >
              <FileSpreadsheet className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t.import}</h3>
              <p className="text-gray-600 mb-4">Import student data from Excel spreadsheets</p>
              <Link 
                to="/import" 
                className="text-blue-600 inline-flex items-center hover:text-blue-700"
              >
                Import Data
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
