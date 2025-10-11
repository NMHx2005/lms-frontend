import api from '../api';

export interface CourseAnalytics {
    _id: string;
    name: string;
    thumbnail: string;
    students: number;
    rating: number;
    revenue: number;
    completionRate: number;
    views: number;
}

export interface CoursePerformance {
    _id: string;
    title: string;
    enrollmentCount: number;
    averageRating: number;
    completionRate: number;
}

export interface EnrollmentTrend {
    month: string;
    students: number;
    revenue: number;
}

export interface EngagementMetrics {
    totalEnrollments: number;
    activeStudents: number;
    averageProgress: number;
    completionRate: number;
}

/**
 * Get course analytics overview
 */
export const getCourseAnalyticsOverview = async () => {
    const response = await api.get('/client/analytics/courses');
    return response.data;
};

/**
 * Get course performance data
 */
export const getCoursePerformance = async () => {
    const response = await api.get('/client/analytics/courses/performance');
    return response.data;
};

/**
 * Get course comparison
 */
export const getCourseComparison = async () => {
    const response = await api.get('/client/analytics/courses/comparison');
    return response.data;
};

/**
 * Get top courses
 */
export const getTopCourses = async (limit?: number) => {
    const response = await api.get('/client/analytics/courses/top', {
        params: { limit }
    });
    return response.data;
};

/**
 * Get course revenue
 */
export const getCourseRevenue = async () => {
    const response = await api.get('/client/analytics/courses/revenue');
    return response.data;
};

/**
 * Get detailed course analytics by ID
 */
export const getCourseAnalyticsDetail = async (courseId: string) => {
    const response = await api.get(`/client/analytics/courses/${courseId}`);
    return response.data;
};

/**
 * Get enrollment trends for a course
 */
export const getCourseEnrollmentTrends = async (courseId: string) => {
    const response = await api.get(`/client/analytics/courses/${courseId}/enrollment`);
    return response.data;
};

/**
 * Get completion rates for a course
 */
export const getCourseCompletionRates = async (courseId: string) => {
    const response = await api.get(`/client/analytics/courses/${courseId}/completion`);
    return response.data;
};

/**
 * Get engagement metrics for a course
 */
export const getCourseEngagementMetrics = async (courseId: string) => {
    const response = await api.get(`/client/analytics/courses/${courseId}/engagement`);
    return response.data;
};

/**
 * Get revenue details for a course
 */
export const getCourseRevenueDetail = async (courseId: string) => {
    const response = await api.get(`/client/analytics/courses/${courseId}/revenue`);
    return response.data;
};

/**
 * Get student feedback for a course
 */
export const getCourseFeedback = async (courseId: string) => {
    const response = await api.get(`/client/analytics/courses/${courseId}/feedback`);
    return response.data;
};

