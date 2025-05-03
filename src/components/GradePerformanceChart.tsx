
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { GradeDistribution } from '@/types/student-score';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

interface GradePerformanceChartProps {
  distribution: GradeDistribution;
  average: number;
  type?: 'bar' | 'pie';
  onUpdateDistribution?: (newDistribution: GradeDistribution) => void;
}

const GradePerformanceChart: React.FC<GradePerformanceChartProps> = ({ 
  distribution, 
  average, 
  type = 'bar',
  onUpdateDistribution
}) => {
  const { language } = useAppContext();
  const t = getTranslations(language);
  
  // State for interactive editing
  const [editingGrade, setEditingGrade] = useState<keyof GradeDistribution | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  
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
  
  // Handle chart bar click for editing
  const handleBarClick = (data: any, index: number) => {
    if (!onUpdateDistribution) return; // Only enable interactive editing if callback provided
    
    const gradeLetter = data.name as keyof GradeDistribution;
    setEditingGrade(gradeLetter);
    setEditValue(distribution[gradeLetter]);
    setIsDialogOpen(true);
  };
  
  // Handle saving the edited value
  const handleSaveEdit = () => {
    if (!editingGrade || !onUpdateDistribution) return;
    
    // Create a new distribution with the updated value
    const newDistribution = {
      ...distribution,
      [editingGrade]: editValue
    };
    
    // Call the parent's update function
    onUpdateDistribution(newDistribution);
    
    // Reset editing state
    setIsDialogOpen(false);
    setEditingGrade(null);
    
    // Show confirmation toast
    toast.success(`${t.updated || "Updated"} ${editingGrade}: ${editValue} ${t.students || "students"}`);
  };
  
  return (
    <>
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
                onClick={onUpdateDistribution ? handleBarClick : undefined}
                className={onUpdateDistribution ? "cursor-pointer" : ""}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [`${value} ${t.students || 'students'}`, t.count || 'Count']}
                  labelFormatter={(label) => `${t.grade || 'Grade'}: ${label}`}
                  cursor={onUpdateDistribution ? { fill: 'rgba(0, 0, 0, 0.1)' } : undefined}
                />
                <Bar dataKey="count" name={t.students || 'Students'}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      className={onUpdateDistribution ? "hover:opacity-80 transition-opacity" : ""}
                    />
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
                  onClick={onUpdateDistribution ? handleBarClick : undefined}
                  className={onUpdateDistribution ? "cursor-pointer" : ""}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      className={onUpdateDistribution ? "hover:opacity-80 transition-opacity" : ""}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`${value} ${t.students || 'students'}`, t.count || 'Count']}
                  labelFormatter={(label) => `${t.grade || 'Grade'}: ${label}`}
                  cursor={onUpdateDistribution ? { fill: 'rgba(0, 0, 0, 0.1)' } : undefined}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
      
      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t.edit || 'Edit'} {editingGrade} {t.count || 'Count'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-between">
              <span>{t.students || 'Students'}: {editValue}</span>
              <Input
                type="number"
                value={editValue}
                onChange={(e) => setEditValue(parseInt(e.target.value) || 0)}
                className="w-24"
                min={0}
                max={100}
              />
            </div>
            
            <Slider
              value={[editValue]}
              min={0}
              max={Math.max(50, editValue * 2)} // Dynamic max range
              step={1}
              onValueChange={(values) => setEditValue(values[0])}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t.cancel || 'Cancel'}
            </Button>
            <Button onClick={handleSaveEdit}>
              {t.save || 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GradePerformanceChart;
