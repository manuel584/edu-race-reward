
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { TeacherWorkload } from '@/types/teacher';

interface WorkloadChartProps {
  data: TeacherWorkload[];
  type: 'hours' | 'subjects' | 'grades';
  language: string;
}

const WorkloadChart: React.FC<WorkloadChartProps> = ({ data, type, language }) => {
  // Colors for the chart
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a4de6c'];
  
  if (type === 'hours') {
    // Teacher hours chart data
    const chartData = data.map(item => ({
      name: item.teacherName,
      hours: item.totalAssignedHours,
      capacity: item.remainingCapacity
    }));
    
    return (
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            barGap={4}
          >
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={70}
            />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(1)} ${language === 'en' ? 'hours' : 'ساعة'}`, '']}
              labelFormatter={(label) => `${language === 'en' ? 'Teacher' : 'المعلم'}: ${label}`}
            />
            <Bar 
              dataKey="hours" 
              fill="#8884d8" 
              name={language === 'en' ? 'Assigned Hours' : 'الساعات المخصصة'}
            />
            <Bar 
              dataKey="capacity" 
              fill="#82ca9d" 
              name={language === 'en' ? 'Remaining Capacity' : 'السعة المتبقية'}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
  
  if (type === 'subjects') {
    // Calculate subject distribution across all teachers
    const subjectCounts: Record<string, number> = {};
    
    data.forEach(teacher => {
      Object.keys(teacher.subjectDistribution).forEach(subject => {
        if (subjectCounts[subject]) {
          subjectCounts[subject] += 1;
        } else {
          subjectCounts[subject] = 1;
        }
      });
    });
    
    const pieData = Object.entries(subjectCounts).map(([name, value], index) => ({
      name,
      value,
      color: COLORS[index % COLORS.length]
    }));
    
    return (
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`${value} ${language === 'en' ? 'teachers' : 'معلم'}`, '']}
              labelFormatter={(label) => `${language === 'en' ? 'Subject' : 'المادة'}: ${label}`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
  
  // Default return (for grades or other types)
  return (
    <Card>
      <CardContent className="h-[300px] flex items-center justify-center">
        {language === 'en' 
          ? 'Chart visualization for this type is not available' 
          : 'الرسم البياني لهذا النوع غير متوفر'}
      </CardContent>
    </Card>
  );
};

export default WorkloadChart;
