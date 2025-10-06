import api from '../api';

// ========== INTERFACES ==========

export interface Announcement {
    _id: string;
    title: string;
    content: string;
    type: 'general' | 'course' | 'urgent' | 'maintenance' | 'update';
    status: 'draft' | 'scheduled' | 'published' | 'expired' | 'cancelled';
    priority: 'low' | 'normal' | 'high' | 'urgent';
    target: {
        type: 'all' | 'role' | 'course' | 'user';
        value?: string[] | string;
    };
    scheduledAt?: string;
    publishedAt?: string;
    expiresAt?: string;
    isScheduled: boolean;
    displayOptions: {
        showAsPopup: boolean;
        showOnDashboard: boolean;
        sendEmail: boolean;
        sendPush: boolean;
        requireAcknowledgment: boolean;
    };
    analytics: {
        totalViews: number;
        totalClicks: number;
        totalAcknowledgments: number;
    };
    acknowledgedBy: string[];
    createdBy: string | { userId: string; name: string; role: string };
    createdAt: string;
    updatedAt: string;
    tags: string[];
    attachments?: string[];
}

export interface AnnouncementStats {
    totalAnnouncements: number;
    publishedAnnouncements: number;
    scheduledAnnouncements: number;
    draftAnnouncements: number;
    expiredAnnouncements: number;
    cancelledAnnouncements: number;
    totalReads: number;
    totalClicks: number;
    averageReadRate: number;
    averageClickRate: number;
    announcementsByType: Array<{ type: string; count: number }>;
    announcementsByPriority: Array<{ priority: string; count: number }>;
    announcementsByAudience: Array<{ audience: string; count: number }>;
}

export interface AnnouncementFilters {
    search?: string;
    type?: string;
    priority?: string;
    targetAudience?: string;
    status?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface CreateAnnouncementData {
    title: string;
    content: string;
    type: 'general' | 'course' | 'urgent' | 'maintenance' | 'update';
    priority: 'low' | 'normal' | 'high' | 'urgent';
    target: {
        type: 'all' | 'role' | 'course' | 'user';
        value?: string;
    };
    scheduledAt?: string;
    expiresAt?: string;
    tags?: string[];
    attachments?: string[];
}

export interface UpdateAnnouncementData {
    title?: string;
    content?: string;
    type?: 'general' | 'course' | 'urgent' | 'maintenance' | 'update';
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    target?: {
        type: 'all' | 'role' | 'course' | 'user';
        value?: string;
    };
    scheduledAt?: string;
    expiresAt?: string;
    tags?: string[];
    attachments?: string[];
}

export interface AnnouncementAnalytics {
    _id: string;
    title: string;
    readCount: number;
    clickCount: number;
    readRate: number;
    clickRate: number;
    audienceBreakdown: Array<{
        audience: string;
        readCount: number;
        clickCount: number;
    }>;
    deviceBreakdown: Array<{
        device: string;
        readCount: number;
        clickCount: number;
    }>;
    timeBreakdown: Array<{
        date: string;
        readCount: number;
        clickCount: number;
    }>;
}

export interface BulkActionData {
    ids: string[];
    action: 'publish' | 'archive' | 'delete';
}

export interface PaginatedResponse<T> {
    announcements?: T[];
    data?: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    error?: {
        message: string;
        code: string;
        statusCode: number;
        timestamp: string;
        path: string;
        details?: Array<{
            field: string;
            message: string;
            value: any;
        }>;
        requestId: string;
    };
}

// ========== ANNOUNCEMENT OPERATIONS ==========

export const getAnnouncements = async (filters: AnnouncementFilters = {}): Promise<ApiResponse<PaginatedResponse<Announcement>>> => {
    try {
        const response = await api.get('/admin/announcements', { params: filters });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

export const getAnnouncementById = async (id: string): Promise<ApiResponse<Announcement>> => {
    try {
        const response = await api.get(`/admin/announcements/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

export const createAnnouncement = async (data: CreateAnnouncementData): Promise<ApiResponse<Announcement>> => {
    try {
        const response = await api.post('/admin/announcements', data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

export const updateAnnouncement = async (id: string, data: UpdateAnnouncementData): Promise<ApiResponse<Announcement>> => {
    try {
        const response = await api.put(`/admin/announcements/${id}`, data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

export const deleteAnnouncement = async (id: string): Promise<ApiResponse<{ message: string }>> => {
    try {
        const response = await api.delete(`/admin/announcements/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

export const publishAnnouncement = async (id: string): Promise<ApiResponse<Announcement>> => {
    try {
        const response = await api.post(`/admin/announcements/${id}/publish`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

export const cancelAnnouncement = async (id: string): Promise<ApiResponse<Announcement>> => {
    try {
        const response = await api.post(`/admin/announcements/${id}/cancel`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

export const getAnnouncementAnalytics = async (id: string): Promise<ApiResponse<AnnouncementAnalytics>> => {
    try {
        const response = await api.get(`/admin/announcements/${id}/analytics`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

// ========== BULK OPERATIONS ==========

export const bulkPublishAnnouncements = async (data: BulkActionData): Promise<ApiResponse<{ message: string; updatedCount: number }>> => {
    try {
        const response = await api.post('/admin/announcements/bulk/publish', data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

export const bulkDeleteAnnouncements = async (data: BulkActionData): Promise<ApiResponse<{ message: string; deletedCount: number }>> => {
    try {
        const response = await api.post('/admin/announcements/bulk/delete', data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

// ========== STATISTICS ==========

export const getAnnouncementStats = async (): Promise<ApiResponse<AnnouncementStats>> => {
    try {
        const response = await api.get('/admin/announcements/stats');
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};
