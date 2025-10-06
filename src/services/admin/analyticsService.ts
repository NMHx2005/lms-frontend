import api from '../api';
import type { ApiResponse } from './userService';

export interface DashboardAnalytics {
    totalUsers: number;
    totalCourses: number;
    totalEnrollments: number;
    totalRevenue: number;
    pendingCourses: number;
    activeUsers: number;
    averageRevenue: number;
}

export interface UserAnalytics {
    totalUsers: number;
    newUsers: number;
    activeUsers: number;
    usersByRole: Array<{
        _id: string;
        count: number;
    }>;
    retentionRate: number;
}

export interface CourseAnalytics {
    totalCourses: number;
    publishedCourses: number;
    pendingCourses: number;
    coursesByDomain: Array<{
        _id: string;
        count: number;
    }>;
    averageRating: number;
}

export interface RevenueAnalytics {
    totalRevenue: number;
    monthlyRevenue: Array<{
        month: string;
        amount: number;
    }>;
    revenueByCourse: Array<{
        courseId: string;
        courseTitle: string;
        revenue: number;
    }>;
    averageOrderValue: number;
}

export interface EnrollmentAnalytics {
    totalEnrollments: number;
    newEnrollments: number;
    completionRate: number;
    enrollmentsByCourse: Array<{
        _id: string;
        courseName: string;
        enrollments: number;
    }>;
}

export interface ActivityLog {
    _id: string;
    userId: string;
    action: string;
    resource: string;
    resourceId: string;
    courseId?: string;
    createdAt: string;
    formattedDuration?: string;
    timeSinceCreation: string;
    id: string;
}

export interface ActivitySummary {
    byAction: Array<{
        _id: {
            action: string;
        };
        count: number;
    }>;
}

export interface AnalyticsFilters {
    period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    startDate?: string;
    endDate?: string;
    category?: string;
    severity?: string;
    page?: number;
    limit?: number;
}

class AnalyticsService {
    /**
     * Get dashboard analytics overview
     */
    static async getDashboardAnalytics(period?: 'daily' | 'weekly' | 'monthly' | 'yearly'): Promise<ApiResponse<DashboardAnalytics>> {
        const params = period ? { period } : {};
        const response = await api.get('/admin/analytics/dashboard', { params });
        return response.data;
    }

    /**
     * Get user analytics
     */
    static async getUserAnalytics(period?: 'daily' | 'weekly' | 'monthly' | 'yearly'): Promise<ApiResponse<UserAnalytics>> {
        const params = period ? { period } : {};
        const response = await api.get('/admin/analytics/users', { params });
        return response.data;
    }

    /**
     * Get course analytics
     */
    static async getCourseAnalytics(period?: 'daily' | 'weekly' | 'monthly' | 'yearly'): Promise<ApiResponse<CourseAnalytics>> {
        const params = period ? { period } : {};
        const response = await api.get('/admin/analytics/courses', { params });
        return response.data;
    }

    /**
     * Get revenue analytics
     */
    static async getRevenueAnalytics(period?: 'daily' | 'weekly' | 'monthly' | 'yearly'): Promise<ApiResponse<RevenueAnalytics>> {
        const params = period ? { period } : {};
        const response = await api.get('/admin/analytics/revenue', { params });
        return response.data;
    }

    /**
     * Get enrollment analytics
     */
    static async getEnrollmentAnalytics(period?: 'daily' | 'weekly' | 'monthly' | 'yearly'): Promise<ApiResponse<EnrollmentAnalytics>> {
        const params = period ? { period } : {};
        const response = await api.get('/admin/analytics/enrollments', { params });
        return response.data;
    }

    /**
     * Get activity logs
     */
    static async getActivityLogs(filters?: AnalyticsFilters): Promise<ApiResponse<{
        items: ActivityLog[];
        page: number;
        limit: number;
        total: number;
        pages: number;
    }>> {
        const response = await api.get('/admin/activity', { params: filters });
        return response.data;
    }

    /**
     * Get activity summary
     */
    static async getActivitySummary(period?: 'daily' | 'weekly' | 'monthly' | 'yearly'): Promise<ApiResponse<ActivitySummary>> {
        const params = period ? { period } : {};
        const response = await api.get('/admin/activity/summary', { params });
        return response.data;
    }

    /**
     * Export activity data to CSV
     */
    static async exportActivityCSV(filters?: AnalyticsFilters): Promise<Blob> {
        const response = await api.get('/admin/activity/export.csv', {
            params: filters,
            responseType: 'blob'
        });
        return response.data;
    }

    /**
     * Export activity data to PDF
     */
    static async exportActivityPDF(filters?: AnalyticsFilters): Promise<Blob> {
        const response = await api.get('/admin/activity/export.pdf', {
            params: filters,
            responseType: 'blob'
        });
        return response.data;
    }
}

export default AnalyticsService;
