
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { GradeDistribution } from '@/types/student-score';

interface GradePerformanceChartProps {
  distribution: GradeDistribution;
  average: number;
  type?: 'bar' | 'pie';
}

const GradePerformanceChart: React.FC<GradePerformanceChartProps> = ({ 
  distribution, 
  average, 
  type = 'bar' 
}) => {
  const { language } = useAppContext();
  const t = getTranslations(language);
  
  // Define colors for the chart
  const COLORS = ['#4CAF50', '#8BC34A', '#FFC107', '#FF9800', '#F44336'];
  
  // Convert the distribution object to an array for the chart
  const chartData = Object.entries(distribution).map(([grade, count], index) => ({
    name: grade,
    count,
    color: COLORS[index]
  }));
  
  // Format the average
  const formattedAverage = average.toFixed(1);
  
  // Determine letter grade for average
  const getAverageGrade = () => {
    if (average >= 90) return 'A';
    if (average >= 80) return 'B';
    if (average >= 70) return 'C';
    if (average >= 60) return 'D';
    return 'F';
  };
  
  const averageGrade = getAverageGrade();
  
  // Calculate total students
  const totalStudents = Object.values(distribution).reduce((sum, count) => sum + count, 0);
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t.classPerformance || 'Class Performance'}</CardTitle>
        <CardDescription>
          {t.average || 'Average'}: {formattedAverage} ({averageGrade}) • 
          {t.totalStudents || 'Total Students'}: {totalStudents}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] pt-2">
        {type === 'bar' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: any) => [`${value} ${t.students || 'students'}`, t.count || 'Count']}
                labelFormatter={(label) => `${t.grade || 'Grade'}: ${label}`}
              />
              <Bar dataKey="count" name={t.students || 'Students'}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                nameKey="name"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => [`${value} ${t.students || 'students'}`, t.count || 'Count']}
                labelFormatter={(label) => `${t.grade || 'Grade'}: ${label}`}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default GradePerformanceChart;
