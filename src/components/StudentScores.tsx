
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface StudentScoresProps {
  studentId: string;
}

const StudentScores: React.FC<StudentScoresProps> = ({ studentId }) => {
  const { scores, language } = useAppContext();
  const t = getTranslations(language);
  
  // Filter scores for this student
  const studentScores = scores.filter(score => score.studentId === studentId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Prepare data for chart
  const chartData = studentScores.map(score => ({
    date: new Date(score.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { 
      month: 'short', 
      day: 'numeric'
    }),
    score: score.score,
    subject: score.subject,
  }));
  
  // Group scores by subject
  const scoresBySubject = studentScores.reduce((acc, score) => {
    if (!acc[score.subject]) {
      acc[score.subject] = [];
    }
    acc[score.subject].push(score);
    return acc;
  }, {} as Record<string, typeof scores>);
  
  // Calculate average score by subject
  const averageBySubject = Object.entries(scoresBySubject).map(([subject, scores]) => {
    const total = scores.reduce((sum, score) => sum + score.score, 0);
    const average = total / scores.length;
    return { subject, average };
  });
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t.scoreTimeline || "Score Timeline"}</CardTitle>
        </CardHeader>
        <CardContent>
          {studentScores.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="score" name={t.score || "Score"} stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-gray-500 dark:text-gray-400 mb-2">
                {t.noScoresYet || "No scores recorded yet"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Subject Performance */}
        <Card>
          <CardHeader>
            <CardTitle>{t.subjectPerformance || "Subject Performance"}</CardTitle>
          </CardHeader>
          <CardContent>
            {averageBySubject.length > 0 ? (
              <div className="space-y-4">
                {averageBySubject.map(({ subject, average }, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{subject}</span>
                      <span className="font-bold">{Math.round(average)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{ width: `${average}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  {t.noSubjectData || "No subject data available"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Recent Scores */}
        <Card>
          <CardHeader>
            <CardTitle>{t.recentScores || "Recent Scores"}</CardTitle>
          </CardHeader>
          <CardContent>
            {studentScores.length > 0 ? (
              <div className="space-y-4">
                {[...studentScores].reverse().slice(0, 5).map((score, index) => (
                  <div key={index} className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                    <div>
                      <h4 className="font-medium">{score.subject}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {score.title || t.examination || "Examination"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(score.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold">{score.score}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">/100</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  {t.noRecentScores || "No recent scores"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentScores;
