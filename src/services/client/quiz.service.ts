import api from '../api';
import { ApiResponse } from '../api';

export interface QuizAttempt {
  _id?: string;
  lessonId: string;
  courseId: string;
  studentId?: string;
  attemptNumber: number;
  answers: Array<{
    questionIndex: number;
    answer: any;
    isCorrect: boolean;
    points: number;
  }>;
  score: number;
  totalPoints: number;
  percentage: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  timeSpent: number;
  submittedAt: Date;
}

export interface QuizAttemptsSummary {
  attempts: QuizAttempt[];
  bestScore: number;
  averageScore: number;
  lastScore: number;
  remainingAttempts: number | null; // null = unlimited
  canRetake: boolean;
  nextAttemptAvailableAt?: Date; // If cooldown period
}

/**
 * Get quiz attempts for a lesson
 */
export const getQuizAttempts = async (lessonId: string): Promise<ApiResponse<QuizAttemptsSummary>> => {
  const response = await api.get(`/client/lessons/${lessonId}/quiz/attempts`);
  return response.data;
};

/**
 * Submit quiz attempt
 */
export const submitQuizAttempt = async (
  lessonId: string,
  attemptData: {
    answers: Array<{
      questionIndex: number;
      answer: any;
      isCorrect: boolean;
      points: number;
    }>;
    score: number;
    totalPoints: number;
    percentage: number;
    correct: number;
    incorrect: number;
    unanswered: number;
    timeSpent: number;
  }
): Promise<ApiResponse<QuizAttempt>> => {
  const response = await api.post(`/client/lessons/${lessonId}/quiz/attempts`, attemptData);
  return response.data;
};

/**
 * Get quiz settings for a lesson
 */
export const getQuizSettings = async (lessonId: string): Promise<ApiResponse<any>> => {
  const response = await api.get(`/client/lessons/${lessonId}/quiz/settings`);
  return response.data;
};
