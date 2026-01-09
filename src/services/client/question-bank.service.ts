import api from '../api';
import { ApiResponse } from '../api';

export interface QuestionBankItem {
  _id?: string;
  teacherId: string;
  courseId?: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'multiple-select' | 'fill-blank' | 'short-answer' | 'matching' | 'ordering' | 'essay';
  answers: string[];
  correctAnswer: any;
  explanation?: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  topic?: string;
  subject?: string;
  bloomLevel?: string;
  isPublic: boolean;
  usageCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuestionBankFilters {
  search?: string;
  type?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  topic?: string;
  subject?: string;
  isPublic?: boolean;
  courseId?: string;
  page?: number;
  limit?: number;
}

/**
 * Get question bank items
 */
export const getQuestionBank = async (filters?: QuestionBankFilters): Promise<ApiResponse<{
  questions: QuestionBankItem[];
  total: number;
  page: number;
  limit: number;
}>> => {
  const response = await api.get('/client/question-bank', { params: filters });
  return response.data;
};

/**
 * Create question in bank
 */
export const createQuestionInBank = async (question: Omit<QuestionBankItem, '_id' | 'usageCount' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<QuestionBankItem>> => {
  const response = await api.post('/client/question-bank', question);
  return response.data;
};

/**
 * Update question in bank
 */
export const updateQuestionInBank = async (questionId: string, updates: Partial<QuestionBankItem>): Promise<ApiResponse<QuestionBankItem>> => {
  const response = await api.put(`/client/question-bank/${questionId}`, updates);
  return response.data;
};

/**
 * Delete question from bank
 */
export const deleteQuestionFromBank = async (questionId: string): Promise<ApiResponse<void>> => {
  const response = await api.delete(`/client/question-bank/${questionId}`);
  return response.data;
};

/**
 * Add questions from bank to lesson
 */
export const addQuestionsFromBank = async (lessonId: string, questionIds: string[]): Promise<ApiResponse<any>> => {
  const response = await api.post(`/client/question-bank/add-to-lesson`, { lessonId, questionIds });
  return response.data;
};
