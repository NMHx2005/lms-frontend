export interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions: string;
  dueDate: string;
  maxScore: number;
  type: 'file' | 'quiz' | 'text';
  attachments: {
    name: string;
    size: number;
    type: string;
    url: string;
  }[];
  gradingCriteria: string[];
  importantNotes: string[];
  // Add quiz questions for quiz type assignments
  quizQuestions?: {
    id: string;
    question: string;
    type: 'multiple-choice' | 'text' | 'file';
    options?: string[];
    required: boolean;
  }[];
}

export interface Submission {
  id: string;
  submittedAt: string;
  type: 'file' | 'quiz' | 'text';
  files?: {
    name: string;
    size: number;
    type: string;
    url: string;
  }[];
  quizAnswers?: string[];
  textSubmission?: string;
  comment?: string;
  status: 'pending' | 'graded' | 'late';
  score?: number;
  feedback?: string;
  gradedAt?: string;
  gradedBy?: string;
}
