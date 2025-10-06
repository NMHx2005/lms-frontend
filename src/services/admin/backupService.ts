import api from '../api';

// ========== INTERFACES ==========

export interface BackupJob {
    id: string;
    name: string;
    type: 'database' | 'files' | 'full';
    status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
    size: number;
    createdAt: string;
    completedAt?: string;
    duration?: number;
    location: string;
    retention: number;
    compression: boolean;
    encryption: boolean;
    checksum: string;
    errorMessage?: string;
}

export interface RestoreJob {
    id: string;
    backupId: string;
    backupName: string;
    type: 'database' | 'files' | 'full';
    status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
    createdAt: string;
    completedAt?: string;
    duration?: number;
    targetEnvironment: string;
    validationStatus: 'pending' | 'passed' | 'failed';
    errorMessage?: string;
}

export interface BackupSchedule {
    id: string;
    name: string;
    type: 'database' | 'files' | 'full';
    frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
    time: string;
    days?: string[];
    retention: number;
    compression: boolean;
    encryption: boolean;
    isActive: boolean;
    lastRun?: string;
    nextRun: string;
}

export interface BackupSettings {
    autoCleanup: boolean;
    maxRetentionDays: number;
    compressionEnabled: boolean;
    encryptionEnabled: boolean;
    notificationEmail: string;
    storageLocation: string;
    maxBackupSize: number;
}

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

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// ========== API METHODS ==========

export const getBackupStatus = async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/admin/system/backup');
    return response.data;
};

export const getSystemOverview = async (): Promise<ApiResponse<SystemOverview>> => {
    const response = await api.get('/admin/system/overview');
    return response.data;
};

export const getSystemLogs = async (params?: {
    page?: number;
    limit?: number;
    level?: string;
    category?: string;
}): Promise<ApiResponse<PaginatedResponse<SystemLog>>> => {
    const response = await api.get('/admin/system/logs', { params });
    return response.data;
};

export const getBackups = async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
}): Promise<ApiResponse<PaginatedResponse<BackupJob>>> => {
    const response = await api.get('/admin/backups', { params });
    return response.data;
};

export const getRestoreJobs = async (params?: {
    page?: number;
    limit?: number;
    status?: string;
}): Promise<ApiResponse<PaginatedResponse<RestoreJob>>> => {
    const response = await api.get('/admin/restore-jobs', { params });
    return response.data;
};

export const getBackupSchedules = async (): Promise<ApiResponse<BackupSchedule[]>> => {
    const response = await api.get('/admin/backup-schedules');
    return response.data;
};

export const getBackupSettings = async (): Promise<ApiResponse<BackupSettings>> => {
    const response = await api.get('/admin/backup-settings');
    return response.data;
};

export const createBackup = async (data: {
    name: string;
    type: 'database' | 'files' | 'full';
    compression?: boolean;
    encryption?: boolean;
    retention?: number;
}): Promise<ApiResponse<BackupJob>> => {
    const response = await api.post('/admin/backups', data);
    return response.data;
};

export const restoreBackup = async (data: {
    backupId: string;
    targetEnvironment: string;
}): Promise<ApiResponse<RestoreJob>> => {
    const response = await api.post('/admin/restore-jobs', data);
    return response.data;
};

export const createBackupSchedule = async (data: {
    name: string;
    type: 'database' | 'files' | 'full';
    frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
    time: string;
    days?: string[];
    retention: number;
    compression: boolean;
    encryption: boolean;
}): Promise<ApiResponse<BackupSchedule>> => {
    const response = await api.post('/admin/backup-schedules', data);
    return response.data;
};

export const updateBackupSettings = async (data: Partial<BackupSettings>): Promise<ApiResponse<BackupSettings>> => {
    const response = await api.put('/admin/backup-settings', data);
    return response.data;
};

export const deleteBackup = async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/admin/backups/${id}`);
    return response.data;
};

export const deleteBackupSchedule = async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/admin/backup-schedules/${id}`);
    return response.data;
};

export const cancelBackup = async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.post(`/admin/backups/${id}/cancel`);
    return response.data;
};

export const cancelRestore = async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.post(`/admin/restore-jobs/${id}/cancel`);
    return response.data;
};
