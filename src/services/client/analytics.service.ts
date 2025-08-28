import api from '../api';

export const clientAnalyticsService = {
  // Learning Analytics
  async getLearningAnalytics(params: {
    period?: string;
    courseId?: string;
    includeComparisons?: boolean;
  }) {
    const response = await api.get('/client/analytics/learning', { params });
    return response.data;
  },

  async getProgressAnalytics(params: {
    courseId?: string;
    timeRange?: string;
    groupBy?: string;
  }) {
    const response = await api.get('/client/analytics/progress', { params });
    return response.data;
  },

  async getTimeSpentAnalytics(params: {
    courseId?: string;
    period?: string;
    breakdown?: string;
  }) {
    const response = await api.get('/client/analytics/time-spent', { params });
    return response.data;
  },

  async getPerformanceAnalytics(params: {
    courseId?: string;
    assignmentType?: string;
    timeRange?: string;
  }) {
    const response = await api.get('/client/analytics/performance', { params });
    return response.data;
  },

  // Study Habits
  async getStudyHabitsAnalytics(params: {
    period?: string;
    includeRecommendations?: boolean;
  }) {
    const response = await api.get('/client/analytics/study-habits', { params });
    return response.data;
  },

  async getLearningStreakAnalytics() {
    const response = await api.get('/client/analytics/learning-streak');
    return response.data;
  },

  // Goals & Achievements
  async getGoalsProgressAnalytics() {
    const response = await api.get('/client/analytics/goals-progress');
    return response.data;
  },

  async getAchievementsAnalytics(params: {
    period?: string;
    category?: string;
  }) {
    const response = await api.get('/client/analytics/achievements', { params });
    return response.data;
  },

  // Recommendations
  async getPersonalizedRecommendations(params: {
    limit?: number;
    includeReasoning?: boolean;
    excludeCompleted?: boolean;
  }) {
    const response = await api.get('/client/analytics/recommendations', { params });
    return response.data;
  },

  async getSimilarLearnersAnalytics() {
    const response = await api.get('/client/analytics/similar-learners');
    return response.data;
  },
};
