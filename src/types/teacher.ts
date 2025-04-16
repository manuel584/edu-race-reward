
import { UserRole } from "@/hooks/useAuth";

export type TeacherQualification = {
  subject: string;
  level: string; // e.g., "Beginner", "Intermediate", "Advanced"
  yearsOfExperience: number;
  certifications?: string[];
};

export type ClassAssignment = {
  id: string;
  className: string; // e.g. "5A", "6B"
  grade: string; // e.g. "Grade 5", "Grade 6"
  subject: string;
  schedule: {
    day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday";
    startTime: string; // "HH:MM" format
    endTime: string; // "HH:MM" format
  }[];
  room?: string;
};

export type Teacher = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  subjects: string[];
  qualifications: TeacherQualification[];
  assignedClasses: ClassAssignment[];
  maxWeeklyHours?: number;
  weeklyHours?: number;
  status: "active" | "inactive" | "on-leave";
  hasChangedInitialPassword?: boolean;
  permissions?: string[];
  createdAt: string;
  lastLogin?: string;
};

export type TeacherAssignment = {
  teacherId: string;
  classAssignmentId: string;
  assignedDate: string;
  assignedBy: string;
  status: "current" | "previous" | "scheduled" | "temporary";
  startDate: string;
  endDate?: string;
};

// For visualization and assignment interface
export type TeacherWorkload = {
  teacherId: string;
  teacherName: string;
  totalAssignedHours: number;
  subjectDistribution: Record<string, number>; // subject -> hours
  gradeDistribution: Record<string, number>; // grade -> hours
  remainingCapacity: number;
};
