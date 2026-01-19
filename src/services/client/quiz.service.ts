import api, { ApiResponse } from '../api';

export interface QuizAttempt {
  _id?: string;
  lessonId: string | {
    _id: string;
    title: string;
    lessonNumber?: number;
  };
  courseId: string | {
    _id: string;
    title: string;
    thumbnail?: string;
  };
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
  startedAt?: Date;
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
    startedAt?: Date;
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

/**
 * Get quiz history for current user
 */
export interface QuizHistoryParams {
  courseId?: string;
  limit?: number;
  page?: number;
}

export interface QuizHistoryResponse {
  attempts: QuizAttempt[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const getQuizHistory = async (params?: QuizHistoryParams): Promise<ApiResponse<QuizHistoryResponse>> => {
  const response = await api.get('/client/quiz/history', { params });
  return response.data;
};

/**
 * Get quiz attempt by ID
 */
export const getQuizAttemptById = async (attemptId: string): Promise<ApiResponse<QuizAttempt>> => {
  const response = await api.get(`/client/quiz/history/${attemptId}`);
  return response.data;
};
