
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { StudentScore } from '@/types/student-score';
import { toast } from "sonner";

interface RecordResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: StudentScore | null;
}

const RecordResultDialog: React.FC<RecordResultDialogProps> = ({
  open,
  onOpenChange,
  initialData
}) => {
  const { language, addScore, updateScore, students = [] } = useAppContext();
  const t = getTranslations(language);
  
  // Define the form schema with Zod
  const formSchema = z.object({
    examName: z.string().min(1, { message: t.required || "Required" }),
    studentName: z.string().min(1, { message: t.required || "Required" }),
    score: z.coerce.number().min(0, { message: t.mustBePositive || "Must be positive" }),
    totalPossiblePoints: z.coerce.number().min(1, { message: t.mustBePositive || "Must be positive" }),
    date: z.date(),
    comments: z.string().optional(),
    grade: z.string().optional(),
    subject: z.string().optional(),
  });

  type FormValues = z.infer<typeof formSchema>;

  // Set up form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      examName: "",
      studentName: "",
      score: 0,
      totalPossiblePoints: 100,
      date: new Date(),
      comments: "",
      grade: "",
      subject: "",
    },
  });

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        examName: initialData.examName,
        studentName: initialData.studentName,
        score: initialData.score,
        totalPossiblePoints: initialData.totalPossiblePoints || 100,
        date: new Date(initialData.date),
        comments: initialData.comments || "",
        grade: initialData.grade || "",
        subject: initialData.subject || "",
      });
    } else {
      form.reset({
        examName: "",
        studentName: "",
        score: 0,
        totalPossiblePoints: 100,
        date: new Date(),
        comments: "",
        grade: "",
        subject: "",
      });
    }
  }, [initialData, form]);

  // Submit handler
  const onSubmit = (values: FormValues) => {
    try {
      if (initialData) {
        // Update existing score
        updateScore(initialData.id, {
          ...values,
          id: initialData.id,
          date: values.date.toISOString(),
        });
        toast.success(t.resultUpdated || "Result updated successfully");
      } else {
        // Add new score
        addScore({
          ...values,
          date: values.date.toISOString(),
        });
        toast.success(t.resultAdded || "Result added successfully");
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving result:", error);
      toast.error(t.errorSavingResult || "Error saving result");
    }
  };

  // Get unique grades from students
  const grades = [...new Set(students.map(student => student.grade))].sort();
  
  // Get unique subjects across all students
  const subjects = [...new Set(students.flatMap(student => student.subjects))].sort();
  
  // Get student names from the grade selected (if any)
  const selectedGrade = form.watch("grade");
  const filteredStudents = selectedGrade 
    ? students.filter(student => student.grade === selectedGrade)
    : students;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? (t.editResult || "Edit Result") : (t.recordResult || "Record Result")}
          </DialogTitle>
          <DialogDescription>
            {t.enterTestDetails || "Enter the test details to record student performance"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Test Name */}
            <FormField
              control={form.control}
              name="examName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.testName || "Test Name"} *</FormLabel>
                  <FormControl>
                    <Input placeholder={t.enterTestName || "Enter test name"} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Subject (Optional) */}
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.subject || "Subject"}</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t.selectSubject || "Select subject"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subjects.map(subject => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Grade (Optional) */}
            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.grade || "Grade"}</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t.selectGrade || "Select grade"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {grades.map(grade => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Student Name */}
            <FormField
              control={form.control}
              name="studentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.studentName || "Student Name"} *</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t.selectStudent || "Select student"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredStudents.map(student => (
                        <SelectItem key={student.id} value={student.name}>
                          {student.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Score */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="score"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.scoreAchieved || "Score Achieved"} *</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="totalPossiblePoints"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.totalPossiblePoints || "Total Possible Points"} *</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t.dateCompleted || "Date Completed"}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>{t.selectDate || "Select date"}</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Comments */}
            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.comments || "Comments"}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={t.addComments || "Add any feedback or notes"} 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t.cancel || "Cancel"}
              </Button>
              <Button type="submit">
                {initialData ? (t.updateResult || "Update Result") : (t.recordResult || "Record Result")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RecordResultDialog;
