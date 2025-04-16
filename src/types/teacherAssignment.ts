
import { ClassAssignment, Teacher } from './teacher';

export type AssignmentPeriod = {
  startDate: string;
  endDate: string;
  term: 'full-year' | 'semester-1' | 'semester-2' | 'custom';
};

export type TeacherAssignmentStats = {
  totalClasses: number;
  totalHours: number;
  subjectsCount: number;
  gradesCount: number;
  isOverloaded: boolean;
};

export type AssignmentValidation = {
  hasScheduleConflict: boolean;
  isQualified: boolean;
  workloadStatus: 'optimal' | 'light' | 'heavy' | 'overloaded';
  conflicts: string[];
};

export type TeacherFilters = {
  department?: string;
  grade?: string;
  subject?: string;
  status?: 'active' | 'inactive' | 'on-leave';
};
