
import React from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Award, TrendingUp } from 'lucide-react';

const RecognitionRace: React.FC = () => {
  const { language } = useAppContext();
  const t = getTranslations(language);

  // Sample data to mimic the image charts
  const classPerformanceData = [
    { name: '1', score: 88 },
    { name: '2', score: 80 },
    { name: '3 ب', score: 78 },
    { name: '2', score: 76 },
    { name: '31', score: 74 },
    { name: '4 ب', score: 72 }
  ];

  const attendanceData = [
    { name: '5', score: 10 },
    { name: '2', score: 8 },
    { name: '3', score: 6 },
    { name: '4', score: 5 },
    { name: '1', score: 4 },
    { name: '6', score: 3 }
  ];

  const parentReportData = [
    { name: '4', score: 25 },
    { name: '5', score: 20 },
    { name: '6', score: 15 },
    { name: '3', score: 10 },
    { name: '2', score: 8 },
    { name: '1', score: 5 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="page-container">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center mb-6">
            <Award className="h-8 w-8 mr-3 text-purple-600" />
            <h1 className="text-3xl font-display font-bold">
              {language === 'en' ? 'Recognition Race' : 'سباق التمييز'}
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Class Performance Chart */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                  {language === 'en' ? 'Class Performance' : 'أداء الفصول'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={classPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="score" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Attendance Chart */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                  {language === 'en' ? 'Attendance' : 'الحضور'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={attendanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="score" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Parent Report Chart */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-red-500" />
                  {language === 'en' ? 'Parent Engagement' : 'تواصل الوالدين'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={parentReportData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="score" fill="#EF4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default RecognitionRace;
