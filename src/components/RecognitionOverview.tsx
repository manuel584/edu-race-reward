
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThumbsUp, Users, Sparkles } from 'lucide-react';

interface RecognitionOverviewProps {
  studentId: string;
}

const RecognitionOverview: React.FC<RecognitionOverviewProps> = ({ studentId }) => {
  const { recognitions, language } = useAppContext();
  const t = getTranslations(language);
  
  // Filter recognitions for this student
  const studentRecognitions = recognitions.filter(rec => rec.studentId === studentId);
  
  // Count recognitions by type
  const counts = {
    helpfulness: studentRecognitions.filter(rec => rec.type === 'helpfulness').length,
    respect: studentRecognitions.filter(rec => rec.type === 'respect').length,
    teamwork: studentRecognitions.filter(rec => rec.type === 'teamwork').length,
    excellence: studentRecognitions.filter(rec => rec.type === 'excellence').length
  };
  
  // Data for chart
  const data = [
    { name: t.helpfulness || 'Helpfulness', value: counts.helpfulness, color: '#34D399' },
    { name: t.respect || 'Respect', value: counts.respect, color: '#60A5FA' },
    { name: t.teamwork || 'Teamwork', value: counts.teamwork, color: '#F59E0B' },
    { name: t.excellence || 'Excellence', value: counts.excellence, color: '#A855F7' }
  ];
  
  // Recent recognitions
  const recentRecognitions = [...studentRecognitions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t.recognitionsBreakdown || "Recognitions Breakdown"}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {studentRecognitions.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20, top: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8">
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-64">
                <p className="text-gray-500 dark:text-gray-400 mb-2">
                  {t.noRecognitionsYet || "No recognitions yet"}
                </p>
                <p className="text-sm text-gray-400 max-w-xs text-center">
                  {t.recognitionExplanation || 
                    "Recognitions are awarded for exceptional behavior in helpfulness, respect, teamwork and excellence."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t.recentRecognitions || "Recent Recognitions"}</CardTitle>
          </CardHeader>
          <CardContent>
            {recentRecognitions.length > 0 ? (
              <div className="space-y-4">
                {recentRecognitions.map((recognition, index) => {
                  let Icon;
                  let color;
                  
                  switch (recognition.type) {
                    case 'helpfulness':
                      Icon = ThumbsUp;
                      color = 'text-green-500 bg-green-100 dark:bg-green-900';
                      break;
                    case 'respect':
                      Icon = Users;
                      color = 'text-blue-500 bg-blue-100 dark:bg-blue-900';
                      break;
                    case 'teamwork':
                      Icon = Users;
                      color = 'text-amber-500 bg-amber-100 dark:bg-amber-900';
                      break;
                    case 'excellence':
                      Icon = Sparkles;
                      color = 'text-purple-500 bg-purple-100 dark:bg-purple-900';
                      break;
                    default:
                      Icon = ThumbsUp;
                      color = 'text-gray-500 bg-gray-100 dark:bg-gray-800';
                  }
                  
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`mt-1 p-2 rounded-full ${color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium capitalize">
                          {recognition.type}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {recognition.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(recognition.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  {t.noRecentRecognitions || "No recent recognitions"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecognitionOverview;
