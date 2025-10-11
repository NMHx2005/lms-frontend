import api from '../api';

export interface EnrollmentStudent {
    _id: string;
    studentId: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        avatar?: string;
    };
    courseId: string;
    enrolledAt: string;
    lastAccessedAt?: string;
    progress: number;
    completedLessons: number;
    totalLessons: number;
    status: 'active' | 'completed' | 'inactive' | 'suspended';
    certificateIssued?: boolean;
}

export interface EnrollmentProgress {
    enrollmentId: string;
    studentName: string;
    progress: number;
    completedLessons: number;
    totalLessons: number;
    sections: Array<{
        sectionId: string;
        sectionTitle: string;
        progress: number;
        lessons: Array<{
            lessonId: string;
            lessonTitle: string;
            isCompleted: boolean;
            timeSpent: number;
        }>;
    }>;
}

export interface EnrollmentStats {
    totalStudents: number;
    activeStudents: number;
    completedStudents: number;
    averageProgress: number;
    averageCompletionTime: number;
    topPerformers: Array<{
        studentId: string;
        studentName: string;
        progress: number;
    }>;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

/**
 * Get enrollments for a course (teacher view)
 */
export const getCourseEnrollments = async (courseId: string, params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
}): Promise<ApiResponse<{
    enrollments: EnrollmentStudent[];
    total: number;
    page: number;
    limit: number;
}>> => {
    const response = await api.get(`/client/enrollments/course/${courseId}`, { params });
    return response.data;
};

/**
 * Get enrollment progress details
 */
export const getEnrollmentProgress = async (enrollmentId: string): Promise<ApiResponse<EnrollmentProgress>> => {
    const response = await api.get(`/client/enrollments/${enrollmentId}/progress`);
    return response.data;
};

/**
 * Get enrollment statistics for a course
 */
export const getEnrollmentStats = async (courseId: string): Promise<ApiResponse<EnrollmentStats>> => {
    const response = await api.get(`/client/enrollments/stats/${courseId}`);
    return response.data;
};

/**
 * Send message to a student
 */
export const sendMessageToStudent = async (enrollmentId: string, message: string): Promise<ApiResponse<any>> => {
    const response = await api.post(`/client/enrollments/${enrollmentId}/message`, { message });
    return response.data;
};

/**
 * Get student activity log
 */
export const getStudentActivity = async (enrollmentId: string): Promise<ApiResponse<any[]>> => {
    const response = await api.get(`/client/enrollments/${enrollmentId}/activity`);
    return response.data;
};

/**
 * Export student list to CSV/Excel
 */
export const exportStudentList = async (courseId: string, format: 'csv' | 'excel' = 'csv'): Promise<ApiResponse<any>> => {
    const response = await api.post('/client/enrollments/export', { courseId, format }, {
        responseType: 'blob'
    });
    return response.data;
};

