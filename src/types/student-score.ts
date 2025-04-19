
export interface StudentScore {
  id: string;
  studentName: string;
  examName: string;
  score: number;
  date: string;
  totalPossiblePoints?: number;
  comments?: string;
  grade?: string;
  subject?: string;
  letterGrade?: string;
  studentId?: string;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'exam' | 'test';
  totalPoints: number;
  duration: number; // in minutes
  createdAt: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  points: number;
  options?: string[];
  correctAnswer?: string | string[];
}

export type QuestionType = 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';

export interface GradeDistribution {
  A: number;
  B: number;
  C: number;
  D: number;
  F: number;
}
