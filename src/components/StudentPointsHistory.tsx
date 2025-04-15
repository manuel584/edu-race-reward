
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, ArrowUp, ArrowDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface StudentPointsHistoryProps {
  studentId: string;
}

const StudentPointsHistory: React.FC<StudentPointsHistoryProps> = ({ studentId }) => {
  const { pointHistory, language } = useAppContext();
  const t = getTranslations(language);
  
  // Filter history for this student
  const studentHistory = pointHistory.filter(entry => entry.studentId === studentId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {t.pointHistory || "Point History"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {studentHistory.length > 0 ? (
          <div className="space-y-4">
            {studentHistory.map((entry, index) => (
              <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                <div className={`mt-1 p-2 rounded-full ${entry.amount > 0 ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
                  {entry.amount > 0 ? (
                    <ArrowUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium">{entry.description}</h4>
                    <span className={`font-bold ${entry.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {entry.amount > 0 ? `+${entry.amount}` : entry.amount}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(entry.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            {t.noPointHistory || "No point history available"}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentPointsHistory;
