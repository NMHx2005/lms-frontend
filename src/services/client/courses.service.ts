import api from '../api';

export const clientCoursesService = {
  // Course Browsing
  async getCourses(params: {
    page?: number;
    limit?: number;
    category?: string;
    difficulty?: string;
    priceRange?: string;
    rating?: string;
    duration?: string;
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
    paymentMethod: string;
    agreeToTerms: boolean;
    couponCode?: string;
  }) {
    // First create payment for the course
    const paymentResponse = await api.post(`/client/payments/course/${courseId}`, {
      paymentMethod: data.paymentMethod,
      amount: undefined // Will use course price from backend
    });

    if (paymentResponse.data.success) {
      // After payment is created, enroll in the course
      const enrollmentResponse = await api.post(`/client/courses/${courseId}/enroll`, {
        paymentMethod: data.paymentMethod,
        couponCode: data.couponCode,
        agreeToTerms: data.agreeToTerms
      });

      return enrollmentResponse.data;
    } else {
      throw new Error(paymentResponse.data.error || 'Payment creation failed');
    }
  },

  // Direct enrollment (contact teacher)
  async enrollInCourseDirect(courseId: string, data: {
    paymentMethod: string;
    agreeToTerms: boolean;
  }) {
    const response = await api.post(`/client/courses/${courseId}/enroll-direct`, data);
    return response.data;
  },

  async unenrollFromCourse(courseId: string, data: {
    reason: string;
    feedback?: string;
  }) {
    // Get enrollment by courseId first, then delete it
    const enrollments = await api.get('/client/enrollments', {
      params: { courseId, status: 'active' }
    });

    if (enrollments.data?.data?.length > 0) {
      const enrollmentId = enrollments.data.data[0]._id;
      const response = await api.delete(`/client/enrollments/${enrollmentId}`, { data });
      return response.data;
    } else {
      return {
        success: false,
        error: 'Không tìm thấy enrollment cho khóa học này'
      };
    }
  },

  // Course Progress
  async getCourseProgress(courseId: string) {
    const response = await api.get(`/client/courses/${courseId}/progress`);
    return response.data;
  },

  // Get user enrollments
  async getUserEnrollments() {
    const response = await api.get('/client/enrollments');
    return response.data;
  },

  async updateLessonProgress(lessonId: string, data: {
    completed: boolean;
    timeSpent: number;
    notes?: string;
  }) {
    // Mark lesson as completed using lesson endpoint
    const response = await api.post(`/client/lessons/${lessonId}/complete`, {
      completed: data.completed,
      timeSpent: data.timeSpent,
      notes: data.notes
    });
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

  // Get payment history
  async getPaymentHistory(params: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const response = await api.get('/client/payments/history', { params });
    return response.data;
  },

  // Get filter options for advanced search
  async getFilterOptions() {
    const response = await api.get('/client/courses/filter-options');
    return response.data;
  },

  // Get popular tags
  async getPopularTags(limit: number = 20) {
    const response = await api.get(`/client/courses/popular-tags?limit=${limit}`);
    return response.data;
  },

  // Advanced search with multiple filters
  async advancedSearch(params: {
    search?: string;
    domain?: string;
    level?: string;
    instructorId?: string;
    priceRange?: string;
    rating?: string;
    duration?: string;
    language?: string;
    certificate?: boolean;
    tags?: string[];
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, v));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    const response = await api.get(`/client/courses/search?${queryParams.toString()}`);
    return response.data;
  },

  // Create VNPay payment (mock)
  async createVNPayPayment(courseId: string, data: {
    amount: number;
    courseTitle: string;
    userInfo?: {
      fullName: string;
      phone: string;
      address: string;
    };
  }) {
    const response = await api.post(`/client/payments/vnpay/${courseId}`, {
      amount: data.amount,
      courseTitle: data.courseTitle,
      userInfo: data.userInfo,
      returnUrl: `${import.meta.env.VITE_API_BASE_URL || 'https://lms-backend-cf11.onrender.com'}/api/client/payments/vnpay/return`,
      cancelUrl: `${window.location.origin}/courses/${courseId}`
    });
    return response.data;
  },

  // Create VNPay payment (real)
  async createVNPayPaymentReal(courseId: string, data: {
    amount: number;
    courseTitle: string;
    userInfo?: {
      fullName: string;
      phone: string;
      address: string;
    };
  }) {
    const response = await api.post(`/client/payments/vnpay-real/${courseId}`, {
      amount: data.amount,
      courseTitle: data.courseTitle,
      userInfo: data.userInfo,
      returnUrl: `${import.meta.env.VITE_API_BASE_URL || 'https://lms-backend-cf11.onrender.com'}/api/client/payments/vnpay/return`,
      cancelUrl: `${window.location.origin}/courses/${courseId}`
    });
    return response.data;
  },
};
