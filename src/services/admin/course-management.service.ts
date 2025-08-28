import api from '../api';

export const adminCourseManagementService = {
  // Get All Courses
  async getAllCourses(params: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    instructor?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const response = await api.get('/admin/courses', { params });
    return response.data;
  },

  // Create Course
  async createCourse(data: {
    title: string;
    description: string;
    shortDescription: string;
    price: number;
    originalPrice: number;
    currency: string;
    duration: number;
    difficulty: string;
    category: string;
    subcategory: string;
    targetAudience: string;
    ageGroup: string;
    instructorId: string;
    thumbnail: string;
    previewVideo: string;
    objectives: string[];
    prerequisites: string[];
    tags: string[];
    language: string;
    status: string;
    isPublished: boolean;
    isFeatured: boolean;
    accessibility: {
      subtitles: boolean;
      audioDescription: boolean;
      screenReaderCompatible: boolean;
      slowPaced: boolean;
    };
    technicalRequirements: {
      bandwidth: string;
      devices: string[];
      software: string[];
      browsers: string[];
    };
    learningPath: string;
    gamification: {
      enabled: boolean;
      badges: string[];
      points: number;
      leaderboard: boolean;
    };
  }) {
    const response = await api.post('/admin/courses', data);
    return response.data;
  },

  // Update Course
  async updateCourse(courseId: string, data: {
    title?: string;
    description?: string;
    price?: number;
    status?: string;
    isPublished?: boolean;
    isFeatured?: boolean;
    adminNotes?: string;
    changeReason?: string;
    notifyEnrolledStudents?: boolean;
  }) {
    const response = await api.put(`/admin/courses/${courseId}`, data);
    return response.data;
  },

  // Delete Course
  async deleteCourse(courseId: string, data: {
    reason: string;
    retainEnrollmentData: boolean;
    refundStudents: boolean;
    notifyInstructor: boolean;
    transferToAlternativeCourse?: string;
  }) {
    const response = await api.delete(`/admin/courses/${courseId}`, { data });
    return response.data;
  },
};
