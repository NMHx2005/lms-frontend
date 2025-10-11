import api from '../api';

// Types
export interface TeacherCourse {
    _id: string;
    title: string;
    thumbnail: string;
    domain: string;
    level: string;
    price: number;
    status: 'draft' | 'submitted' | 'approved' | 'published' | 'rejected' | 'needs_revision' | 'delisted';
    hasUnsavedChanges?: boolean; // Track if course has been modified after publishing
    studentsCount: number;
    rating: number;
    createdAt: string;
    updatedAt: string;
    sectionsCount: number;
    lessonsCount: number;
}

export interface TeacherCourseStats {
    total: number;
    published: number;
    draft: number;
    pending: number;
    totalStudents: number;
    totalRevenue: number;
}

export interface CourseFilters {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

// API Functions
export const getTeacherCourses = async (
    filters?: CourseFilters
): Promise<PaginatedResponse<TeacherCourse>> => {
    const response = await api.get('/client/courses/my-courses', { params: filters });
    return response.data;
};

export const getTeacherCourseStats = async (): Promise<ApiResponse<TeacherCourseStats>> => {
    const response = await api.get('/client/courses/stats');
    return response.data;
};

export const getCourseById = async (courseId: string): Promise<ApiResponse<any>> => {
    // Use teacher-specific route to ensure authentication and permission check
    const response = await api.get(`/client/courses/my-courses/${courseId}`);
    return response.data;
};

export const createCourse = async (courseData: any): Promise<ApiResponse<TeacherCourse>> => {
    const response = await api.post('/client/courses', courseData);
    return response.data;
};

export const updateCourse = async (
    courseId: string,
    updates: any
): Promise<ApiResponse<TeacherCourse>> => {
    const response = await api.put(`/client/courses/${courseId}`, updates);
    return response.data;
};

export const deleteCourse = async (courseId: string): Promise<ApiResponse<any>> => {
    const response = await api.delete(`/client/courses/${courseId}`);
    return response.data;
};

export const updateCourseStatus = async (
    courseId: string,
    status: string
): Promise<ApiResponse<TeacherCourse>> => {
    const response = await api.patch(`/client/courses/${courseId}/status`, { status });
    return response.data;
};

