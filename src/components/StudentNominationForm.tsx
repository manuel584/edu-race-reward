
import React, { useState, useEffect } from 'react';
import { useAppContext, Student } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { Search, Award, Check, ArrowUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';

type NominationCategory = {
  id: string;
  label: string;
  type: 'helpfulness' | 'respect' | 'teamwork' | 'excellence';
  description: string;
};

const nominationCategories: NominationCategory[] = [
  {
    id: 'exceptional-helpfulness',
    label: 'Exceptional Helpfulness',
    type: 'helpfulness',
    description: 'Nominated for going above and beyond to help others'
  },
  {
    id: 'outstanding-respect',
    label: 'Outstanding Respect',
    type: 'respect',
    description: 'Demonstrated exceptional respect for peers and staff'
  },
  {
    id: 'remarkable-teamwork',
    label: 'Remarkable Teamwork',
    type: 'teamwork',
    description: 'Excellent collaboration and support of team members'
  },
  {
    id: 'academic-excellence',
    label: 'Academic Excellence',
    type: 'excellence',
    description: 'Outstanding academic achievement and dedication'
  },
  {
    id: 'personal-growth',
    label: 'Personal Growth',
    type: 'excellence',
    description: 'Significant personal development and improvement'
  },
  {
    id: 'community-contribution',
    label: 'Community Contribution',
    type: 'helpfulness',
    description: 'Valuable contributions to the school community'
  },
  {
    id: 'leadership',
    label: 'Leadership',
    type: 'excellence',
    description: 'Demonstrated exceptional leadership qualities'
  },
  {
    id: 'creativity',
    label: 'Creativity',
    type: 'excellence',
    description: 'Innovative thinking and creative problem-solving'
  }
];

interface FormValues {
  student: string;
  category: string;
  comments: string;
}

const StudentNominationForm = ({ 
  open, 
  onOpenChange,
  onNominationComplete
}: { 
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNominationComplete?: () => void;
}) => {
  const { students, nominateStudent, language } = useAppContext();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const t = getTranslations(language);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'recent'>('all');
  const [recentlyNominated, setRecentlyNominated] = useState<string[]>([]);
  
  // Setup form
  const form = useForm<FormValues>({
    defaultValues: {
      student: '',
      category: '',
      comments: ''
    }
  });
  
  // Filter students based on search
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get recent students
  const recentStudents = students.filter(student => 
    recentlyNominated.includes(student.id)
  );
  
  // Handle nomination submission
  const handleSubmit = (values: FormValues) => {
    if (!user) return;
    
    const selectedCategory = nominationCategories.find(c => c.id === values.category);
    if (!selectedCategory) return;
    
    nominateStudent(
      values.student, 
      selectedCategory.label, 
      user.name
    );
    
    // Add to recently nominated
    setRecentlyNominated(prev => {
      const updated = [values.student, ...prev.filter(id => id !== values.student)].slice(0, 5);
      localStorage.setItem('recentlyNominated', JSON.stringify(updated));
      return updated;
    });
    
    // Show success toast
    toast.success(t.nominationSubmitted || "Nomination submitted", {
      description: `${students.find(s => s.id === values.student)?.name} ${t.nominatedFor || "nominated for"} ${selectedCategory.label}`
    });
    
    // Reset form
    form.reset();
    
    // Close dialog
    onOpenChange(false);
    
    // Call completion callback if provided
    if (onNominationComplete) {
      onNominationComplete();
    }
  };
  
  // Load recently nominated from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentlyNominated');
    if (saved) {
      try {
        setRecentlyNominated(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse recently nominated students", e);
      }
    }
  }, []);
  
  const formContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-base font-medium">{t.selectStudent || "Select Student"}</h3>
            </div>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t.searchStudents || "Search students..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as 'all' | 'recent')}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">{t.allStudents || "All Students"}</TabsTrigger>
                <TabsTrigger value="recent">{t.recentlyNominated || "Recently Nominated"}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="h-[200px] overflow-y-auto border rounded-md p-1">
                {filteredStudents.length > 0 ? (
                  <div className="space-y-1">
                    {filteredStudents.map((student) => (
                      <Button
                        key={student.id}
                        type="button"
                        variant={form.watch('student') === student.id ? "default" : "ghost"}
                        className="w-full justify-start h-auto py-2 px-3"
                        onClick={() => form.setValue('student', student.id)}
                      >
                        <div className="flex items-center w-full">
                          <div className="flex-grow text-left">
                            <div className="font-medium">{student.name}</div>
                            <div className="text-xs text-gray-500">{student.grade}</div>
                          </div>
                          {form.watch('student') === student.id && (
                            <Check className="h-4 w-4 ml-2" />
                          )}
                        </div>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    {t.noStudentsFound || "No students found"}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="recent" className="h-[200px] overflow-y-auto border rounded-md p-1">
                {recentStudents.length > 0 ? (
                  <div className="space-y-1">
                    {recentStudents.map((student) => (
                      <Button
                        key={student.id}
                        type="button"
                        variant={form.watch('student') === student.id ? "default" : "ghost"}
                        className="w-full justify-start h-auto py-2 px-3"
                        onClick={() => form.setValue('student', student.id)}
                      >
                        <div className="flex items-center w-full">
                          <div className="flex-grow text-left">
                            <div className="font-medium">{student.name}</div>
                            <div className="text-xs text-gray-500">{student.grade}</div>
                          </div>
                          {form.watch('student') === student.id && (
                            <Check className="h-4 w-4 ml-2" />
                          )}
                        </div>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    {t.noRecentNominations || "No recent nominations"}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.reasonForNomination || "Reason for Nomination"}</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t.selectReason || "Select reason for nomination"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {nominationCategories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {t[category.id] || category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  {form.watch('category') ? 
                    nominationCategories.find(c => c.id === form.watch('category'))?.description : 
                    t.selectReasonDescription || "Choose the primary reason for this nomination"
                  }
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="comments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.additionalComments || "Additional Comments"}</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder={t.commentsPlaceholder || "Add any additional details about this nomination..."}
                    className="resize-none min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <DialogFooter>
          <Button 
            type="submit" 
            disabled={!form.watch('student') || !form.watch('category')}
            className="w-full gap-2"
          >
            <Award className="h-4 w-4" />
            {t.submitNomination || "Submit Nomination"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
  
  // Render either drawer (mobile) or dialog (desktop)
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{t.nominateStudent || "Nominate Student"}</DrawerTitle>
            <DrawerDescription>
              {t.nominateStudentDesc || "Nominate a student who has shown exceptional qualities"}
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-2">
            {formContent}
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">{t.cancel || "Cancel"}</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t.nominateStudent || "Nominate Student"}</DialogTitle>
          <DialogDescription>
            {t.nominateStudentDesc || "Nominate a student who has shown exceptional qualities"}
          </DialogDescription>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  );
};

export default StudentNominationForm;
