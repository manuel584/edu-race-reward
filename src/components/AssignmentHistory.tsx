
import React from 'react';
import { Teacher } from '@/types/teacher';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface AssignmentHistoryProps {
  teachers: Teacher[];
  language: string;
}

const AssignmentHistory: React.FC<AssignmentHistoryProps> = ({
  teachers,
  language
}) => {
  // Sample assignment history data - in a real app, this would come from an API
  const historyData = [
    {
      teacherId: '1',
      teacherName: 'John Smith',
      action: 'assigned',
      details: 'Biology, Grade 10, Class 10A',
      timestamp: '2023-08-20T10:30:00.000Z',
      assignedBy: 'Admin User'
    },
    {
      teacherId: '1',
      teacherName: 'John Smith',
      action: 'removed',
      details: 'Physics, Grade 11, Class 11B',
      timestamp: '2023-07-15T14:45:00.000Z',
      assignedBy: 'Admin User'
    },
    {
      teacherId: '2',
      teacherName: 'Sarah Johnson',
      action: 'assigned',
      details: 'Calculus, Grade 11, Class 11B',
      timestamp: '2023-09-05T09:15:00.000Z',
      assignedBy: 'Admin User'
    }
  ];
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{language === 'en' ? 'Teacher' : 'المعلم'}</TableHead>
            <TableHead>{language === 'en' ? 'Action' : 'الإجراء'}</TableHead>
            <TableHead>{language === 'en' ? 'Details' : 'التفاصيل'}</TableHead>
            <TableHead>{language === 'en' ? 'Date' : 'التاريخ'}</TableHead>
            <TableHead>{language === 'en' ? 'By' : 'بواسطة'}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {historyData.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.teacherName}</TableCell>
              <TableCell>
                <Badge variant={item.action === 'assigned' ? 'default' : 'destructive'}>
                  {item.action === 'assigned' 
                    ? (language === 'en' ? 'Assigned' : 'تم التعيين')
                    : (language === 'en' ? 'Removed' : 'تمت الإزالة')}
                </Badge>
              </TableCell>
              <TableCell>{item.details}</TableCell>
              <TableCell>{formatDate(item.timestamp)}</TableCell>
              <TableCell>{item.assignedBy}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {historyData.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {language === 'en' ? 'No assignment history available' : 'لا يوجد تاريخ تعيين متاح'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AssignmentHistory;
