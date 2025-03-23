
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppContext, Student } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { useAuth } from '@/hooks/useAuth';
import { Badge, HandHeart, Shield, Users, Gem, Heart, MessageSquareHeart } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface RecognitionCardProps {
  student: Student;
  type: 'helpfulness' | 'respect' | 'teamwork' | 'excellence';
  onClick: () => void;
}

const RecognitionCard: React.FC<RecognitionCardProps> = ({ student, type, onClick }) => {
  const { language } = useAppContext();
  const t = getTranslations(language);
  
  const getTypeIcon = () => {
    switch (type) {
      case 'helpfulness':
        return <HandHeart className="h-4 w-4 text-rose-500" />;
      case 'respect':
        return <Shield className="h-4 w-4 text-blue-500" />;
      case 'teamwork':
        return <Users className="h-4 w-4 text-green-500" />;
      case 'excellence':
        return <Gem className="h-4 w-4 text-amber-500" />;
    }
  };
  
  const getTypeLabel = () => {
    switch (type) {
      case 'helpfulness':
        return t.helpfulness;
      case 'respect':
        return t.respect;
      case 'teamwork':
        return t.teamwork;
      case 'excellence':
        return t.excellence;
    }
  };
  
  const getTypeColor = () => {
    switch (type) {
      case 'helpfulness':
        return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'respect':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'teamwork':
        return 'bg-green-50 text-green-600 border-green-100';
      case 'excellence':
        return 'bg-amber-50 text-amber-600 border-amber-100';
    }
  };
  
  // Get amount of recognitions of this type
  const recognitionCount = student[type];
  
  // Calculate level based on count (every 5 recognitions = 1 level)
  const level = Math.floor(recognitionCount / 5) + (recognitionCount % 5 > 0 ? 1 : 0);
  
  // Get progress to next level (0-100%)
  const progress = ((recognitionCount % 5) / 5) * 100;
  
  return (
    <motion.div
      className={`p-3 rounded-lg border ${getTypeColor()} cursor-pointer hover:shadow-md transition-all`}
      whileHover={{ y: -3 }}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-1">
          {getTypeIcon()}
          <span className="font-medium text-sm">{getTypeLabel()}</span>
        </div>
        <div className="flex items-center px-2 py-0.5 bg-white bg-opacity-50 rounded text-xs">
          <Badge className="h-3 w-3 mr-1" />
          <span>Lvl {level}</span>
        </div>
      </div>
      
      <div className="text-xs mb-1">
        {recognitionCount} {t.recognitions}
      </div>
      
      <div className="w-full bg-white bg-opacity-50 h-1.5 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full bg-current"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </motion.div>
  );
};

const StudentRecognition = () => {
  const { students, addRecognition, nominateStudent, language } = useAppContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const t = getTranslations(language);
  
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [recognitionType, setRecognitionType] = useState<'helpfulness' | 'respect' | 'teamwork' | 'excellence'>('helpfulness');
  const [reason, setReason] = useState<string>('');
  const [nominationCategory, setNominationCategory] = useState<string>('');
  
  // Get top students for each category
  const topHelpfulStudents = [...students].sort((a, b) => b.helpfulness - a.helpfulness).slice(0, 2);
  const topRespectfulStudents = [...students].sort((a, b) => b.respect - a.respect).slice(0, 2);
  const topTeamworkStudents = [...students].sort((a, b) => b.teamwork - a.teamwork).slice(0, 2);
  const topExcellenceStudents = [...students].sort((a, b) => b.excellence - a.excellence).slice(0, 2);
  
  const handleRecognition = () => {
    if (!selectedStudent) return;
    
    addRecognition(selectedStudent.id, recognitionType, reason);
    setSelectedStudent(null);
    setReason('');
    
    // Safe version with null check for translation strings
    const recognitionMessage = t.recognitionAdded || "Recognition added";
    const receivedMessage = t.receivedRecognitionFor || "received recognition for";
    const typeMessage = t[recognitionType] || recognitionType;
    
    toast.success(recognitionMessage, {
      description: `${selectedStudent.name} ${receivedMessage} ${typeMessage}`
    });
  };
  
  const handleNomination = () => {
    if (!selectedStudent || !user) return;
    
    nominateStudent(selectedStudent.id, nominationCategory, user.name);
    setSelectedStudent(null);
    setNominationCategory('');
    
    // Safe version with null check for translation strings
    const nominationMessage = t.nominationSubmitted || "Nomination submitted";
    const nominatedForMessage = t.nominatedFor || "nominated for";
    
    toast.success(nominationMessage, {
      description: `${selectedStudent.name} ${nominatedForMessage} ${nominationCategory}`
    });
  };
  
  const handleStudentClick = (student: Student, type: 'helpfulness' | 'respect' | 'teamwork' | 'excellence') => {
    setSelectedStudent(student);
    setRecognitionType(type);
  };
  
  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold mb-4">{t.studentRecognitions || "Student Recognitions"}</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Helpfulness Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <HandHeart className="h-5 w-5 text-rose-500" />
              <h3 className="font-medium">{t.helpfulness}</h3>
            </div>
            
            <div className="space-y-3">
              {topHelpfulStudents.length > 0 ? (
                topHelpfulStudents.map(student => (
                  <RecognitionCard 
                    key={student.id} 
                    student={student} 
                    type="helpfulness" 
                    onClick={() => handleStudentClick(student, 'helpfulness')}
                  />
                ))
              ) : (
                <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded">
                  {t.noRecognitionsYet || "No recognitions yet"}
                </div>
              )}
            </div>
          </div>
          
          {/* Respect Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-5 w-5 text-blue-500" />
              <h3 className="font-medium">{t.respect}</h3>
            </div>
            
            <div className="space-y-3">
              {topRespectfulStudents.length > 0 ? (
                topRespectfulStudents.map(student => (
                  <RecognitionCard 
                    key={student.id} 
                    student={student} 
                    type="respect" 
                    onClick={() => handleStudentClick(student, 'respect')}
                  />
                ))
              ) : (
                <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded">
                  {t.noRecognitionsYet || "No recognitions yet"}
                </div>
              )}
            </div>
          </div>
          
          {/* Teamwork Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-5 w-5 text-green-500" />
              <h3 className="font-medium">{t.teamwork}</h3>
            </div>
            
            <div className="space-y-3">
              {topTeamworkStudents.length > 0 ? (
                topTeamworkStudents.map(student => (
                  <RecognitionCard 
                    key={student.id} 
                    student={student} 
                    type="teamwork" 
                    onClick={() => handleStudentClick(student, 'teamwork')}
                  />
                ))
              ) : (
                <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded">
                  {t.noRecognitionsYet || "No recognitions yet"}
                </div>
              )}
            </div>
          </div>
          
          {/* Excellence Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Gem className="h-5 w-5 text-amber-500" />
              <h3 className="font-medium">{t.excellence}</h3>
            </div>
            
            <div className="space-y-3">
              {topExcellenceStudents.length > 0 ? (
                topExcellenceStudents.map(student => (
                  <RecognitionCard 
                    key={student.id} 
                    student={student} 
                    type="excellence" 
                    onClick={() => handleStudentClick(student, 'excellence')}
                  />
                ))
              ) : (
                <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded">
                  {t.noRecognitionsYet || "No recognitions yet"}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Heart className="h-4 w-4 text-rose-500" />
                {t.nominateStudent}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t.nominateStudent}</DialogTitle>
                <DialogDescription>
                  {t.nominateStudentDesc || "Nominate a student who has shown exceptional qualities"}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.selectStudent || "Select Student"}</label>
                  <select 
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={selectedStudent?.id || ''}
                    onChange={(e) => {
                      const selected = students.find(s => s.id === e.target.value);
                      setSelectedStudent(selected || null);
                    }}
                  >
                    <option value="">{t.selectStudent || "Select Student"}</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>
                        {student.name} ({student.grade})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.nominationCategory || "Nomination Category"}</label>
                  <select 
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={nominationCategory}
                    onChange={(e) => setNominationCategory(e.target.value)}
                  >
                    <option value="">{t.selectCategory || "Select Category"}</option>
                    <optgroup label={t.helpfulness}>
                      <option value="academic help">{t.academicHelp}</option>
                      <option value="emotional support">{t.emotionalSupport}</option>
                    </optgroup>
                    <optgroup label={t.respect}>
                      <option value="cultural sensitivity">{t.culturalSensitivity}</option>
                      <option value="conflict resolution">{t.conflictResolution}</option>
                    </optgroup>
                    <optgroup label={t.teamwork}>
                      <option value="group contribution">{t.groupContribution}</option>
                      <option value="collaboration">{t.collaboration}</option>
                    </optgroup>
                    <optgroup label={t.excellence}>
                      <option value="academic excellence">{t.academicExcellence || "Academic Excellence"}</option>
                      <option value="special talent">{t.specialTalent || "Special Talent"}</option>
                    </optgroup>
                  </select>
                </div>
              </div>
              
              <DialogFooter>
                <Button onClick={handleNomination} disabled={!selectedStudent || !nominationCategory}>
                  <MessageSquareHeart className="mr-2 h-4 w-4" />
                  {t.submitNomination || "Submit Nomination"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Recognition Dialog */}
      <Dialog open={!!selectedStudent} onOpenChange={(open) => !open && setSelectedStudent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {recognitionType && t[recognitionType]} {t.recognition || "Recognition"}
            </DialogTitle>
            <DialogDescription>
              {selectedStudent ? 
                (t.addRecognitionFor ? 
                  t.addRecognitionFor.replace('{name}', selectedStudent.name) : 
                  `Add recognition for ${selectedStudent.name}`
                ) : ''}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.reason}</label>
              <textarea 
                className="w-full border border-gray-300 rounded-md p-2 min-h-[100px]"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={t.enterReason || "Enter reason for recognition"}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedStudent(null)}>
              {t.cancel}
            </Button>
            <Button onClick={handleRecognition} disabled={!reason}>
              {t.addRecognition}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StudentRecognition;
