import api from '../api';

export interface EnrollmentResponse {
    success: boolean;
    message?: string;
    data?: any;
    error?: string;
}

export interface EnrollmentRequest {
    courseId: string;
}

class EnrollmentService {
    // Enroll in a course
    async enrollInCourse(courseId: string): Promise<EnrollmentResponse> {
        try {
            const response = await api.post('/client/enrollments', {
                courseId
            });
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.error || 'Có lỗi xảy ra khi đăng ký khóa học'
            };
        }
    }

    // Get user enrollments
    async getUserEnrollments(params?: {
        page?: number;
        limit?: number;
        status?: 'active' | 'completed' | 'inactive';
    }): Promise<EnrollmentResponse> {
        try {
            const response = await api.get('/client/enrollments', { params });
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.error || 'Có lỗi xảy ra khi lấy danh sách khóa học đã đăng ký'
            };
        }
    }

    // Get enrollment by ID
    async getEnrollmentById(enrollmentId: string): Promise<EnrollmentResponse> {
        try {
            const response = await api.get(`/client/enrollments/${enrollmentId}`);
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.error || 'Có lỗi xảy ra khi lấy thông tin đăng ký'
            };
        }
    }

    // Update enrollment progress
    async updateProgress(enrollmentId: string, data: {
        progress?: number;
        currentLesson?: string;
        currentSection?: string;
        timeSpent?: number;
    }): Promise<EnrollmentResponse> {
        try {
            const response = await api.put(`/client/enrollments/${enrollmentId}/progress`, data);
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.error || 'Có lỗi xảy ra khi cập nhật tiến độ'
            };
        }
    }

    // Cancel enrollment
    async cancelEnrollment(enrollmentId: string): Promise<EnrollmentResponse> {
        try {
            const response = await api.delete(`/client/enrollments/${enrollmentId}`);
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.error || 'Có lỗi xảy ra khi hủy đăng ký'
            };
        }
    }

    // Get enrollment statistics
    async getEnrollmentStats(): Promise<EnrollmentResponse> {
        try {
            const response = await api.get('/client/enrollments/stats');
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.error || 'Có lỗi xảy ra khi lấy thống kê đăng ký'
            };
        }
    }
}

export const enrollmentService = new EnrollmentService();
