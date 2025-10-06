import api from '../api';

// Interfaces for Dashboard Data
export interface DashboardOverview {
    totalUsers: number;
    totalCourses: number;
    totalEnrollments: number;
    totalRevenue: number;
    pendingCourses: number;
    pendingRefunds: number;
    activeUsers: number;
    newUsersToday: number;
    systemHealth: 'healthy' | 'warning' | 'critical';
    lastBackup: string;
    serverUptime: string;
}

export interface DashboardAnalytics {
    userGrowth: {
        period: string;
        data: Array<{
            date: string;
            users: number;
            growth: number;
        }>;
    };
    revenueAnalytics: {
        period: string;
        data: Array<{
            month: string;
            revenue: number;
            growth: number;
        }>;
    };
    enrollmentTrends: {
        period: string;
        data: Array<{
            date: string;
            enrollments: number;
        }>;
    };
    courseStats: {
        published: number;
        pending: number;
        rejected: number;
        draft: number;
    };
}

export interface SystemOverview {
    serverStatus: 'online' | 'offline' | 'maintenance';
    databaseStatus: 'connected' | 'disconnected' | 'slow';
    storageUsage: {
        used: number;
        total: number;
        percentage: number;
    };
    memoryUsage: {
        used: number;
        total: number;
        percentage: number;
    };
    cpuUsage: {
        current: number;
        average: number;
    };
    activeConnections: number;
    lastMaintenance: string;
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

export interface DashboardCourseAnalytics {
    totalCourses: number;
    publishedCourses: number;
    pendingCourses: number;
    coursesByDomain: Array<{
        _id: string;
        count: number;
    }>;
    averageRating: number;
}

export interface DashboardRevenueAnalytics {
    totalRevenue: number;
    monthlyRevenue: Array<{
        month: string;
        revenue: number;
    }>;
    revenueByCourse: Array<{
        _id: string;
        courseName: string;
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

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    error?: string;
}

export class AdminDashboardService {
    // Get dashboard overview
    static async getDashboardOverview(): Promise<ApiResponse<DashboardOverview>> {
        const response = await api.get('/admin/dashboard');
        return response.data;
    }

    // Get dashboard analytics
    static async getDashboardAnalytics(period?: 'daily' | 'weekly' | 'monthly' | 'yearly'): Promise<ApiResponse<DashboardAnalytics>> {
        const params = period ? { period } : {};
        const response = await api.get('/admin/analytics/dashboard', { params });
        return response.data;
    }

    // Get system overview
    static async getSystemOverview(): Promise<ApiResponse<SystemOverview>> {
        const response = await api.get('/admin/system/overview');
        return response.data;
    }

    // Get user analytics
    static async getUserAnalytics(period?: 'daily' | 'weekly' | 'monthly' | 'yearly'): Promise<ApiResponse<UserAnalytics>> {
        const params = period ? { period } : {};
        const response = await api.get('/admin/analytics/users', { params });
        return response.data;
    }

    // Get course analytics
    static async getCourseAnalytics(period?: 'daily' | 'weekly' | 'monthly' | 'yearly'): Promise<ApiResponse<DashboardCourseAnalytics>> {
        const params = period ? { period } : {};
        const response = await api.get('/admin/analytics/courses', { params });
        return response.data;
    }

    // Get revenue analytics
    static async getRevenueAnalytics(period?: 'daily' | 'weekly' | 'monthly' | 'yearly'): Promise<ApiResponse<DashboardRevenueAnalytics>> {
        const params = period ? { period } : {};
        const response = await api.get('/admin/analytics/revenue', { params });
        return response.data;
    }

    // Get enrollment analytics
    static async getEnrollmentAnalytics(period?: 'daily' | 'weekly' | 'monthly' | 'yearly'): Promise<ApiResponse<EnrollmentAnalytics>> {
        const params = period ? { period } : {};
        const response = await api.get('/admin/analytics/enrollments', { params });
        return response.data;
    }

    // Refresh all dashboard data
    static async refreshDashboardData(): Promise<ApiResponse<{
        overview: DashboardOverview;
        analytics: DashboardAnalytics;
        systemOverview: SystemOverview;
    }>> {
        const response = await api.get('/admin/dashboard/refresh');
        return response.data;
    }
}
