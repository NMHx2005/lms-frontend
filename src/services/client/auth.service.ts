import api from '../api';

export const clientAuthService = {
  // Profile Management
  async getProfile() {
    const response = await api.get('/client/auth/me');
    return response.data;
  },

  async updateProfile(userData: any) {
    const response = await api.put('/client/auth/profile', userData);
    return response.data;
  },

  async changePassword(passwordData: any) {
    const response = await api.post('/client/auth/change-password', passwordData);
    return response.data;
  },

  // Dashboard & Analytics
  async getDashboardData() {
    const response = await api.get('/client/auth/dashboard');
    return response.data;
  },

  async getEnrolledCourses(params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    category?: string;
  }) {
    const response = await api.get('/client/auth/enrolled-courses', { params });
    return response.data;
  },

  async getCourseProgress(courseId: string) {
    const response = await api.get(`/client/auth/courses/${courseId}/progress`);
    return response.data;
  },

  async getLearningStatistics() {
    const response = await api.get('/client/auth/statistics');
    return response.data;
  },

  async getRecentActivity() {
    const response = await api.get('/client/auth/activity');
    return response.data;
  },

  async getCertificates() {
    const response = await api.get('/client/auth/certificates');
    return response.data;
  },

  async getAchievements() {
    const response = await api.get('/client/auth/achievements');
    return response.data;
  },

  async getStudySchedule() {
    const response = await api.get('/client/auth/schedule');
    return response.data;
  },
};
