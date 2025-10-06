import api from '../api';

export interface SystemOverview {
    totalUsers: number;
    totalCourses: number;
    totalRevenue: number;
    pendingRefunds: number;
    systemHealth: {
        database: 'healthy' | 'warning' | 'critical';
        storage: 'healthy' | 'warning' | 'critical';
        email: 'healthy' | 'warning' | 'critical';
        payment: 'healthy' | 'warning' | 'critical';
    };
}

export interface Refund {
    _id: string;
    userId: string;
    courseId: string;
    amount: number;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    requestedAt: string;
    processedAt?: string;
    processedBy?: string;
    user: {
        _id: string;
        name: string;
        email: string;
    };
    course: {
        _id: string;
        title: string;
    };
}

export interface RefundQuery {
    status?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface ProcessRefundData {
    action: 'approve' | 'reject';
    reason?: string;
}

export interface SystemLog {
    id: string;
    action: string;
    resource: string;
    userId: string;
    ipAddress: string;
    severity: 'low' | 'medium' | 'high';
    category: string;
    createdAt: string;
}

export interface SystemLogsQuery {
    level?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface SystemSettings {
    siteName: string;
    maintenanceMode: boolean;
    maxFileSize: number;
    allowedFileTypes: string[];
    emailNotifications: boolean;
    paymentEnabled: boolean;
}

export interface BackupStatus {
    lastBackup: string;
    nextBackup: string;
    status: 'scheduled' | 'success' | 'failed' | 'in_progress';
    size: string;
    type: string;
}

class SystemService {
    // Get system overview
    async getSystemOverview(): Promise<SystemOverview> {
        const response = await api.get('/admin/system/overview');
        return response.data;
    }

    // Get pending refunds
    async getRefunds(query: RefundQuery = {}): Promise<{ data: Refund[]; pagination: any }> {
        const response = await api.get('/admin/system/refunds', { params: query });
        return response.data;
    }

    // Process refund request
    async processRefund(refundId: string, data: ProcessRefundData): Promise<any> {
        const response = await api.put(`/admin/system/refunds/${refundId}/process`, data);
        return response.data;
    }

    // Get system logs
    async getSystemLogs(query: SystemLogsQuery = {}): Promise<{ data: SystemLog[]; pagination: any }> {
        const response = await api.get('/admin/system/logs', { params: query });
        return response.data;
    }

    // Get system settings
    async getSystemSettings(): Promise<SystemSettings> {
        const response = await api.get('/admin/system/settings');
        return response.data;
    }

    // Update system settings
    async updateSystemSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
        const response = await api.put('/admin/system/settings', settings);
        return response.data;
    }

    // Get backup status
    async getBackupStatus(): Promise<BackupStatus> {
        const response = await api.get('/admin/system/backup');
        return response.data;
    }

    // Test email configuration
    async testEmail(): Promise<any> {
        const response = await api.post('/admin/system/test-email');
        return response.data;
    }

    // Test storage configuration
    async testStorage(): Promise<any> {
        const response = await api.post('/admin/system/test-storage');
        return response.data;
    }

    // Create manual backup
    async createBackup(): Promise<any> {
        const response = await api.post('/admin/system/backup');
        return response.data;
    }

    // Restore from backup
    async restoreBackup(backupId: string): Promise<any> {
        const response = await api.post(`/admin/system/backup/${backupId}/restore`);
        return response.data;
    }
}

export default new SystemService();
