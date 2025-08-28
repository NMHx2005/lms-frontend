import api from '../api';

export const clientTeacherDashboardService = {
  // Teacher Dashboard
  async getTeacherDashboard() {
    const response = await api.get('/client/teacher-dashboard');
    return response.data;
  },

  async getTeacherPerformance() {
    const response = await api.get('/client/teacher-dashboard/performance');
    return response.data;
  },

  // Teacher Rating
  async submitTeacherRating(data: {
    teacherId: string;
    rating: number;
    comment?: string;
  }) {
    const response = await api.post('/client/teacher-rating/submit', data);
    return response.data;
  },

  async getTeacherRatings(teacherId: string, params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const response = await api.get(`/client/teacher-rating/${teacherId}`, { params });
    return response.data;
  },

  async updateTeacherRating(ratingId: string, data: {
    rating: number;
    comment?: string;
  }) {
    const response = await api.put(`/client/teacher-rating/${ratingId}`, data);
    return response.data;
  },

  async deleteTeacherRating(ratingId: string) {
    const response = await api.delete(`/client/teacher-rating/${ratingId}`);
    return response.data;
  },
};
