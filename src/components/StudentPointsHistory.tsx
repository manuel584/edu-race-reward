
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Minus, User, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StudentPointsHistoryProps {
  studentId: string;
}

const StudentPointsHistory: React.FC<StudentPointsHistoryProps> = ({ studentId }) => {
  const { getPointsHistory, language } = useAppContext();
  const t = getTranslations(language);
  const [filter, setFilter] = useState('all');
  
  const history = getPointsHistory(studentId);
  
  const filteredHistory = filter === 'all' 
    ? history 
    : filter === 'add' 
      ? history.filter(h => h.change > 0) 
      : history.filter(h => h.change < 0);
  
  const renderChangeValue = (change: number) => {
    const isPositive = change > 0;
    return (
      <span className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <Plus className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
        {Math.abs(change)}
      </span>
    );
  };
  
  if (!history.length) {
    return (
      <div className="text-center py-8 text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-lg border">
        {t.noPointsHistory}
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex gap-2 mb-4">
        <Badge 
          variant={filter === 'all' ? 'default' : 'outline'} 
          onClick={() => setFilter('all')}
          className="cursor-pointer"
        >
          {t.all}
        </Badge>
        <Badge 
          variant={filter === 'add' ? 'default' : 'outline'} 
          onClick={() => setFilter('add')}
          className="cursor-pointer"
        >
          {t.added}
        </Badge>
        <Badge 
          variant={filter === 'subtract' ? 'default' : 'outline'} 
          onClick={() => setFilter('subtract')}
          className="cursor-pointer"
        >
          {t.subtracted}
        </Badge>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t.pointsHistory}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {filteredHistory.map((item, index) => (
              <div key={index} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{item.reason}</div>
                    <div className="text-sm text-gray-500">{item.subject}</div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(item.date)}
                      </span>
                      {item.givenBy && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {item.givenBy}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-lg font-semibold">
                    {renderChangeValue(item.change)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentPointsHistory;
