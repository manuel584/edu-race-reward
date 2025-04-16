
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { formatDate } from '@/lib/utils';
import { getGradientClass } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend 
} from 'recharts';

interface RecognitionOverviewProps {
  studentId: string;
}

const RecognitionOverview: React.FC<RecognitionOverviewProps> = ({ studentId }) => {
  const { getStudentRecognitions, language } = useAppContext();
  const t = getTranslations(language);
  
  const recognitions = getStudentRecognitions(studentId);
  
  // Count recognitions by type
  const helpfulness = recognitions.filter(r => r.type === 'helpfulness').length;
  const respect = recognitions.filter(r => r.type === 'respect').length;
  const teamwork = recognitions.filter(r => r.type === 'teamwork').length;
  const excellence = recognitions.filter(r => r.type === 'excellence').length;
  
  const totalRecognitions = helpfulness + respect + teamwork + excellence;
  const maxValue = Math.max(helpfulness, respect, teamwork, excellence);
  
  // Data for radar chart
  const radarData = [
    {
      subject: t.helpfulness,
      value: helpfulness,
      fullMark: maxValue > 0 ? maxValue : 5,
    },
    {
      subject: t.respect,
      value: respect,
      fullMark: maxValue > 0 ? maxValue : 5,
    },
    {
      subject: t.teamwork,
      value: teamwork,
      fullMark: maxValue > 0 ? maxValue : 5,
    },
    {
      subject: t.excellence,
      value: excellence,
      fullMark: maxValue > 0 ? maxValue : 5,
    },
  ];
  
  // Recent recognitions
  const recentRecognitions = [...recognitions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t.recognitionSummary}</CardTitle>
            <CardDescription>{t.recognitionSummaryDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            {totalRecognitions > 0 ? (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{t.helpfulness}</span>
                    <span className="text-sm font-medium">{helpfulness}</span>
                  </div>
                  <Progress value={(helpfulness / maxValue) * 100} className={`h-2 bg-gray-200 ${getGradientClass(helpfulness, maxValue)}`} />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{t.respect}</span>
                    <span className="text-sm font-medium">{respect}</span>
                  </div>
                  <Progress value={(respect / maxValue) * 100} className={`h-2 bg-gray-200 ${getGradientClass(respect, maxValue)}`} />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{t.teamwork}</span>
                    <span className="text-sm font-medium">{teamwork}</span>
                  </div>
                  <Progress value={(teamwork / maxValue) * 100} className={`h-2 bg-gray-200 ${getGradientClass(teamwork, maxValue)}`} />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{t.excellence}</span>
                    <span className="text-sm font-medium">{excellence}</span>
                  </div>
                  <Progress value={(excellence / maxValue) * 100} className={`h-2 bg-gray-200 ${getGradientClass(excellence, maxValue)}`} />
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                {t.noRecognitionsYet}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t.recognitionRadar}</CardTitle>
            <CardDescription>{t.recognitionRadarDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            {totalRecognitions > 0 ? (
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                    <Radar
                      name={t.recognitions}
                      dataKey="value"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                {t.noRecognitionsYet}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {recentRecognitions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t.recentRecognitions}</CardTitle>
            <CardDescription>{t.recentRecognitionsDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRecognitions.map((recognition, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex justify-between mb-1">
                    <div className="font-medium">
                      {t[recognition.type as keyof typeof t]}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(recognition.date)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {recognition.description}
                  </p>
                  {recognition.givenBy && (
                    <div className="text-xs text-gray-500 mt-2">
                      {t.recognizedBy}: {recognition.givenBy}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RecognitionOverview;
