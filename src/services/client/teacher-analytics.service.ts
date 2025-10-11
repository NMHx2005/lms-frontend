import api from '../api';

export interface AnalyticsOverview {
    totalStudents: number;
    totalCourses: number;
    totalRevenue: number;
    totalViews: number;
    averageRating: number;
    completionRate: number;
}

export interface RevenueData {
    month: string;
    revenue: number;
    students: number;
    courses: number;
}

export interface CoursePerformance {
    _id: string;
    name: string;
    students: number;
    rating: number;
    revenue: number;
    completionRate: number;
    views: number;
    thumbnail: string;
}

export interface StudentEngagement {
    date: string;
    activeStudents: number;
    newEnrollments: number;
    completions: number;
}

export interface TrendData {
    label: string;
    value: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
}

/**
 * Get teacher dashboard overview
 */
export const getDashboardOverview = async () => {
    const response = await api.get('/client/teacher-dashboard');
    return response.data;
};

/**
 * Get performance metrics
 */
export const getPerformanceMetrics = async (period?: 'monthly' | 'quarterly' | 'yearly') => {
    const response = await api.get('/client/teacher-dashboard/performance', {
        params: { period }
    });
    return response.data;
};

/**
 * Get analytics data
 */
export const getAnalyticsData = async (timeRange?: '1month' | '3months' | '6months' | '1year') => {
    const response = await api.get('/client/teacher-dashboard/analytics', {
        params: { timeRange }
    });
    return response.data;
};

/**
 * Get revenue analytics
 */
export const getRevenueAnalytics = async (timeRange?: string) => {
    const response = await api.get('/client/analytics/revenue', {
        params: { timeRange }
    });
    return response.data;
};

/**
 * Get student analytics
 */
export const getStudentAnalytics = async (timeRange?: string) => {
    const response = await api.get('/client/analytics/students', {
        params: { timeRange }
    });
    return response.data;
};

/**
 * Get engagement analytics
 */
export const getEngagementAnalytics = async (timeRange?: string) => {
    const response = await api.get('/client/analytics/engagement', {
        params: { timeRange }
    });
    return response.data;
};

/**
 * Get trends data
 */
export const getTrendsData = async (timeRange?: string) => {
    const response = await api.get('/client/analytics/trends', {
        params: { timeRange }
    });
    return response.data;
};

/**
 * Get peer comparison
 */
export const getPeerComparison = async () => {
    const response = await api.get('/client/teacher-dashboard/peer-comparison');
    return response.data;
};

