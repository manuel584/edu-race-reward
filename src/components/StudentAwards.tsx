
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Calendar, Star } from 'lucide-react';

interface StudentAwardsProps {
  studentId: string;
}

const StudentAwards: React.FC<StudentAwardsProps> = ({ studentId }) => {
  const { awards, language } = useAppContext();
  const t = getTranslations(language);
  
  // Filter awards for this student
  const studentAwards = awards.filter(award => award.studentId === studentId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      {studentAwards.length > 0 ? (
        studentAwards.map((award, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-lg">
                  <Award className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">{award.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {new Date(award.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{award.description}</p>
                  
                  {award.points > 0 && (
                    <div className="mt-3 flex items-center gap-2 text-amber-600 dark:text-amber-400">
                      <Star className="h-4 w-4" />
                      <span>{award.points} {t.points || "points"}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Award className="h-10 w-10 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">{t.noAwards || "No awards yet"}</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            {t.noAwardsMessage || "This student hasn't received any awards or achievements yet."}
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentAwards;
