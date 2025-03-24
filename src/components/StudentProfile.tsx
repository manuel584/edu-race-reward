
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  ImagePlus, 
  RotateCw, 
  Scissors, 
  Save, 
  X, 
  Camera,
  Trash2,
  GraduationCap
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTranslations } from '@/lib/i18n';
import { useAppContext, Student } from '@/context/AppContext';
import { toast } from 'sonner';

// Available grades
const grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];

interface StudentProfileProps {
  student: Student;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ student }) => {
  const { language, updateStudent } = useAppContext();
  const navigate = useNavigate();
  const t = getTranslations(language);
  
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedStudent, setEditedStudent] = useState<Partial<Student>>({
    name: student.name,
    grade: student.grade,
    nationality: student.nationality,
  });
  
  const handleUploadPhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPhotoUrl(result);
        toast.success('Photo uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSaveProfile = () => {
    updateStudent(student.id, {
      ...editedStudent,
      // Add photo URL to student data if needed
    });
    setIsEditingProfile(false);
    toast.success(t.studentUpdated || 'Student updated successfully');
  };
  
  const handleCancelEdit = () => {
    setEditedStudent({
      name: student.name,
      grade: student.grade,
      nationality: student.nationality,
    });
    setIsEditingProfile(false);
  };
  
  const handleChangeGrade = (grade: string) => {
    setEditedStudent(prev => ({ ...prev, grade }));
  };
  
  const handleChangeNationality = (nationality: 'international' | 'national') => {
    setEditedStudent(prev => ({ ...prev, nationality }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Photo/Avatar Section */}
        <div className="flex flex-col items-center space-y-4 w-full md:w-1/3">
          <div className="relative">
            <Avatar className="w-32 h-32 border-4 border-blue-100">
              {photoUrl ? (
                <AvatarImage src={photoUrl} alt={student.name} />
              ) : (
                <AvatarFallback className="bg-blue-50 text-blue-600 text-4xl">
                  {student.name.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="absolute bottom-0 right-0 rounded-full bg-blue-600 text-white hover:bg-blue-700 border-2 border-white"
                >
                  <ImagePlus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Student Photo</DialogTitle>
                  <DialogDescription>
                    Upload a new photo for the student profile
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <Avatar className="w-24 h-24">
                      {photoUrl ? (
                        <AvatarImage src={photoUrl} alt={student.name} />
                      ) : (
                        <AvatarFallback className="bg-blue-50 text-blue-600 text-2xl">
                          {student.name.charAt(0)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Label 
                        htmlFor="photo-upload" 
                        className="cursor-pointer inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                      >
                        <ImagePlus className="mr-2 h-4 w-4" />
                        Upload
                      </Label>
                      <Input 
                        id="photo-upload" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleUploadPhoto}
                      />
                      <Button variant="outline" size="sm">
                        <Camera className="mr-2 h-4 w-4" />
                        Take Photo
                      </Button>
                    </div>
                  </div>
                  
                  {photoUrl && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Photo Tools</div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <RotateCw className="mr-2 h-4 w-4" />
                          Rotate
                        </Button>
                        <Button variant="outline" size="sm">
                          <Scissors className="mr-2 h-4 w-4" />
                          Crop
                        </Button>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button type="submit">Save Photo</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="text-center space-y-1">
            <h3 className="font-semibold text-lg">{student.name}</h3>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <GraduationCap className="h-4 w-4" />
              <span>{student.grade}</span>
            </div>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <User className="mr-2 h-4 w-4" />
                Customize Avatar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Avatar Customization</DialogTitle>
                <DialogDescription>
                  Personalize the student's avatar with different options
                </DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="appearance" className="w-full">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="appearance">Appearance</TabsTrigger>
                  <TabsTrigger value="clothing">Clothing</TabsTrigger>
                  <TabsTrigger value="accessories">Accessories</TabsTrigger>
                </TabsList>
                <TabsContent value="appearance" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Hair Style</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center">
                          {i}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Hair Color</Label>
                    <div className="flex gap-2">
                      {['#000000', '#5E3B28', '#DDBC7B', '#700B0B'].map(color => (
                        <div 
                          key={color} 
                          className="h-8 w-8 rounded-full cursor-pointer border-2 border-transparent hover:border-blue-600"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="clothing" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Tops</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center">
                          {i}
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="accessories" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Glasses</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center">
                          {i}
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <DialogFooter>
                <Button type="submit">Save Avatar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Student Information Section */}
        <div className="w-full md:w-2/3">
          {isEditingProfile ? (
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Edit Profile</h2>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCancelEdit}
                  >
                    <X className="mr-2 h-4 w-4" />
                    {t.cancel || "Cancel"}
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleSaveProfile}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {t.save || "Save"}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="student-name">{t.studentName || "Student Name"}</Label>
                  <Input 
                    id="student-name" 
                    value={editedStudent.name} 
                    onChange={(e) => setEditedStudent(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="student-grade">{t.grade}</Label>
                  <Select 
                    value={editedStudent.grade} 
                    onValueChange={handleChangeGrade}
                  >
                    <SelectTrigger id="student-grade">
                      <SelectValue placeholder={t.selectGrade || "Select Grade"} />
                    </SelectTrigger>
                    <SelectContent>
                      {grades.map(grade => (
                        <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="student-nationality">{t.nationality}</Label>
                  <Select 
                    value={editedStudent.nationality} 
                    onValueChange={handleChangeNationality as (value: string) => void}
                  >
                    <SelectTrigger id="student-nationality">
                      <SelectValue placeholder={t.selectNationality || "Select Nationality"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="national">{t.national || "National"}</SelectItem>
                      <SelectItem value="international">{t.international || "International"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Student Information</h2>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditingProfile(true)}
                >
                  Edit Profile
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500">{t.studentName || "Student Name"}</div>
                    <div className="font-medium">{student.name}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-500">{t.grade}</div>
                    <div className="font-medium">{student.grade}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-500">{t.nationality}</div>
                    <div className="font-medium">{student.nationality === 'international' ? (t.international || "International") : (t.national || "National")}</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500">{t.points}</div>
                    <div className="font-medium">{student.points}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-500">{t.attendance}</div>
                    <div className="font-medium">{student.attendance}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-500">{t.engagement || "Engagement"}</div>
                    <div className="font-medium">{student.engagementScore}%</div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-md font-medium mb-2">{t.subjects}</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(student.subjects) ? (
                    student.subjects.map(subject => (
                      <span 
                        key={subject} 
                        className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                      >
                        {subject}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">No subjects enrolled</span>
                  )}
                  {Array.isArray(student.subjects) && student.subjects.length === 0 && (
                    <span className="text-gray-500 text-sm">No subjects enrolled</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
