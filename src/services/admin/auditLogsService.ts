import api from '../api';

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface AuditLog {
    _id: string;
    id: string;
    userId: string;
    action: string;
    resource: string;
    resourceId?: string;
    courseId?: string;
    createdAt: string;
    __v: number;
    formattedDuration: string;
    timeSinceCreation: string;
    // Optional fields that might be populated
    userName?: string;
    userEmail?: string;
    details?: string;
    ipAddress?: string;
    userAgent?: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    category?: 'authentication' | 'data_access' | 'data_modification' | 'system' | 'security' | 'learning' | 'payment';
    status?: 'success' | 'failure' | 'warning';
    metadata?: Record<string, any>;
}

export interface AuditLogFilters {
    search?: string;
    action?: string;
    resource?: string;
    dateRange?: string;
    userId?: string;
    courseId?: string;
    start?: string;
    end?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface ActivityPreset {
    id: string;
    name: string;
    description: string;
    filters: Partial<AuditLogFilters>;
    icon?: string;
    color?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    pages: number; // Changed from totalPages to pages to match API response
}

class AuditLogsService {
    // Get activity logs
    async getActivityLogs(filters: AuditLogFilters = {}): Promise<ApiResponse<PaginatedResponse<AuditLog>>> {
        const response = await api.get('/admin/activity', { params: filters });
        return response.data;
    }

    // Get learning activities preset
    async getLearningActivities(filters: AuditLogFilters = {}): Promise<ApiResponse<PaginatedResponse<AuditLog>>> {
        const response = await api.get('/admin/activity/presets/learning', { params: filters });
        return response.data;
    }

    // Get payment activities preset
    async getPaymentActivities(filters: AuditLogFilters = {}): Promise<ApiResponse<PaginatedResponse<AuditLog>>> {
        const response = await api.get('/admin/activity/presets/payment', { params: filters });
        return response.data;
    }

    // Get system activities preset
    async getSystemActivities(filters: AuditLogFilters = {}): Promise<ApiResponse<PaginatedResponse<AuditLog>>> {
        const response = await api.get('/admin/activity/presets/system', { params: filters });
        return response.data;
    }

    // Export audit data to CSV
    async exportAuditDataCSV(filters: AuditLogFilters = {}): Promise<Blob> {
        const response = await api.get('/admin/activity/export.csv', {
            params: filters,
            responseType: 'blob'
        });
        return response.data;
    }

    // Export audit data to PDF
    async exportAuditDataPDF(filters: AuditLogFilters = {}): Promise<Blob> {
        const response = await api.get('/admin/activity/export.pdf', {
            params: filters,
            responseType: 'blob'
        });
        return response.data;
    }

    // Get activity presets
    async getActivityPresets(): Promise<ApiResponse<ActivityPreset[]>> {
        const response = await api.get('/admin/activity/presets');
        return response.data;
    }

    // Get audit log by ID
    async getAuditLogById(id: string): Promise<ApiResponse<AuditLog>> {
        const response = await api.get(`/admin/activity/${id}`);
        return response.data;
    }

    // Get audit statistics
    async getAuditStatistics(filters: AuditLogFilters = {}): Promise<ApiResponse<{
        totalLogs: number;
        logsByCategory: Record<string, number>;
        logsBySeverity: Record<string, number>;
        logsByStatus: Record<string, number>;
        recentActivity: AuditLog[];
    }>> {
        const response = await api.get('/admin/activity/statistics', { params: filters });
        return response.data;
    }
}

export default new AuditLogsService();
