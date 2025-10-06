import api from '../api';

// ========== INTERFACES ==========

export interface SystemOverview {
    totalUsers: number;
    totalCourses: number;
    totalRevenue: number;
    pendingRefunds: number;
    systemHealth: {
        database: 'healthy' | 'unhealthy';
        storage: 'healthy' | 'unhealthy';
        email: 'healthy' | 'unhealthy';
        payment: 'healthy' | 'unhealthy';
    };
}

export interface PerformanceMetrics {
    totalUsers: number;
    totalCourses: number;
    totalEnrollments: number;
    totalRevenue: number;
    pendingCourses: number;
    activeUsers: number;
    averageRevenue: number;
}

export interface ActivitySummary {
    byAction: Array<{
        _id: {
            action: string;
        };
        count: number;
    }>;
}

export interface SystemLog {
    id: string;
    action: string;
    resource: string;
    userId: string;
    ipAddress: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    createdAt: string;
}

export interface BackupPerformance {
    lastBackup: string;
    nextBackup: string;
    status: string;
    size: string;
    type: string;
}

export interface PerformanceFilters {
    startDate?: string;
    endDate?: string;
    level?: string;
    category?: string;
    page?: number;
    limit?: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

// ========== API FUNCTIONS ==========

export const getSystemOverview = async (): Promise<ApiResponse<SystemOverview>> => {
    const response = await api.get('/admin/system/overview');
    return response.data;
};

export const getPerformanceMetrics = async (filters?: PerformanceFilters): Promise<ApiResponse<PerformanceMetrics>> => {
    const response = await api.get('/admin/analytics/dashboard', { params: filters });
    return response.data;
};

export const getActivitySummary = async (): Promise<ApiResponse<ActivitySummary>> => {
    const response = await api.get('/admin/activity/summary');
    return response.data;
};

export const getSystemLogs = async (filters?: PerformanceFilters): Promise<ApiResponse<SystemLog[]>> => {
    const response = await api.get('/admin/system/logs', { params: filters });
    return response.data;
};

export const getBackupPerformance = async (): Promise<ApiResponse<BackupPerformance>> => {
    const response = await api.get('/admin/system/backup');
    return response.data;
};

// ========== EXPORTS ==========

export default {
    getSystemOverview,
    getPerformanceMetrics,
    getActivitySummary,
    getSystemLogs,
    getBackupPerformance
};
