import api from '../api';

export const clientCoursesService = {
  // Course Browsing
  async getCourses(params: {
    page?: number;
    limit?: number;
    category?: string;
    difficulty?: string;
    price?: string;
    rating?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const response = await api.get('/client/courses', { params });
    return response.data;
  },

  async getCourseById(courseId: string) {
    const response = await api.get(`/client/courses/${courseId}`);
    return response.data;
  },

  // Course Enrollment
  async enrollInCourse(courseId: string, data: {
    paymentMethod?: string;
    couponCode?: string;
    agreeToTerms: boolean;
  }) {
    const response = await api.post(`/client/courses/${courseId}/enroll`, data);
    return response.data;
  },

  async unenrollFromCourse(courseId: string, data: {
    reason: string;
    feedback?: string;
  }) {
    const response = await api.delete(`/client/courses/${courseId}/enroll`, { data });
    return response.data;
  },

  // Course Progress
  async getCourseProgress(courseId: string) {
    const response = await api.get(`/client/courses/${courseId}/progress`);
    return response.data;
  },

  async updateLessonProgress(courseId: string, lessonId: string, data: {
    completed: boolean;
    timeSpent: number;
    notes?: string;
  }) {
    const response = await api.put(`/client/courses/${courseId}/lessons/${lessonId}/progress`, data);
    return response.data;
  },

  // Course Reviews & Ratings
  async submitCourseReview(courseId: string, data: {
    rating: number;
    review: string;
    anonymous: boolean;
  }) {
    const response = await api.post(`/client/courses/${courseId}/reviews`, data);
    return response.data;
  },

  async updateCourseReview(courseId: string, reviewId: string, data: {
    rating: number;
    review: string;
  }) {
    const response = await api.put(`/client/courses/${courseId}/reviews/${reviewId}`, data);
    return response.data;
  },

  async deleteCourseReview(courseId: string, reviewId: string) {
    const response = await api.delete(`/client/courses/${courseId}/reviews/${reviewId}`);
    return response.data;
  },

  // Course Certificates
  async getCourseCertificate(courseId: string) {
    const response = await api.get(`/client/courses/${courseId}/certificate`);
    return response.data;
  },

  async downloadCertificate(courseId: string, format: string) {
    const response = await api.get(`/client/courses/${courseId}/certificate/download`, {
      params: { format }
    });
    return response.data;
  },
};
