
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { calculateAverageScore } from '@/lib/utils';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface StudentScoresProps {
  studentId: string;
}

const StudentScores: React.FC<StudentScoresProps> = ({ studentId }) => {
  const { getStudentScores, language } = useAppContext();
  const t = getTranslations(language);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  
  const scores = getStudentScores(studentId);
  
  // Group scores by subject
  const subjectScores: Record<string, number[]> = {};
  
  scores.forEach(score => {
    if (!subjectScores[score.subject]) {
      subjectScores[score.subject] = [];
    }
    subjectScores[score.subject].push(score.score);
  });
  
  // Sort subjects alphabetically
  const subjects = Object.keys(subjectScores).sort();
  
  // Calculate averages
  const chartData = subjects.map(subject => {
    const average = calculateAverageScore(subjectScores[subject]);
    return {
      subject,
      average,
    };
  });
  
  // Get selected subject's scores
  const selectedSubjectScores = selectedSubject
    ? scores.filter(score => score.subject === selectedSubject)
    : [];
  
  if (!scores.length) {
    return (
      <div className="text-center py-8 text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-lg border">
        {t.noScores}
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t.subjectAverages}</CardTitle>
          <CardDescription>{t.subjectAveragesDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                onClick={(data) => {
                  if (data && data.activePayload && data.activePayload[0]) {
                    const clickedSubject = data.activePayload[0].payload.subject;
                    setSelectedSubject(clickedSubject === selectedSubject ? null : clickedSubject);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="average"
                  name={t.averageScore}
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-center text-sm text-gray-500">
            {t.clickBarForDetails}
          </div>
        </CardContent>
      </Card>
      
      {selectedSubject && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{selectedSubject} {t.scores}</CardTitle>
              <CardDescription>
                {t.totalScores}: {selectedSubjectScores.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedSubjectScores
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((score, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">
                          {score.testName || `${t.test} #${index + 1}`}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(score.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className={`text-lg font-bold ${
                        score.score >= 90 ? 'text-green-600' :
                        score.score >= 80 ? 'text-emerald-600' :
                        score.score >= 70 ? 'text-blue-600' :
                        score.score >= 60 ? 'text-amber-600' :
                        'text-red-600'
                      }`}>
                        {score.score}%
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default StudentScores;
