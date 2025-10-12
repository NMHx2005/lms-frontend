import api from '../api';

export interface EligibleCourse {
    enrollmentId: string;
    courseId: string;
    courseTitle: string;
    courseThumbnail: string;
    amount: number;
    enrolledAt: string;
    progress: number;
    teacherId: string;
    teacherName: string;
}

export interface RefundRequest {
    _id: string;
    studentId: string;
    teacherId: {
        _id: string;
        name?: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        avatar?: string;
    };
    courseId: {
        _id: string;
        title: string;
        thumbnail?: string;
    };
    enrollmentId: string;
    billId: string;
    amount: number;
    reason: string;
    description?: string;
    contactMethod: {
        type: 'email' | 'phone' | 'both';
        email?: string;
        phone?: string;
    };
    status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed';
    refundMethod?: string;
    processedBy?: any;
    processedAt?: string;
    adminNotes?: string;
    teacherNotes?: string;
    rejectionReason?: string;
    requestedAt: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateRefundData {
    enrollmentId: string;
    reason: string;
    description: string;
    contactMethod: {
        type: 'email' | 'phone' | 'both';
        email?: string;
        phone?: string;
    };
}

export const refundService = {
    /**
     * Get eligible courses for refund
     */
    async getEligibleCourses(): Promise<{ success: boolean; data: EligibleCourse[] }> {
        const response = await api.get('/client/refunds/eligible-courses');
        return response.data;
    },

    /**
     * Create refund request
     */
    async createRefundRequest(data: CreateRefundData): Promise<{
        success: boolean;
        message: string;
        data: RefundRequest;
    }> {
        const response = await api.post('/client/refunds', data);
        return response.data;
    },

    /**
     * Get user's refund requests
     */
    async getRefundRequests(params?: {
        status?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        success: boolean;
        data: RefundRequest[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }> {
        const response = await api.get('/client/refunds', { params });
        return response.data;
    },

    /**
     * Get refund request details
     */
    async getRefundDetails(refundId: string): Promise<{
        success: boolean;
        data: RefundRequest;
    }> {
        const response = await api.get(`/client/refunds/${refundId}`);
        return response.data;
    },

    /**
     * Cancel refund request
     */
    async cancelRefundRequest(refundId: string): Promise<{
        success: boolean;
        message: string;
        data: RefundRequest;
    }> {
        const response = await api.delete(`/client/refunds/${refundId}`);
        return response.data;
    },

    // ========== TEACHER ENDPOINTS ==========

    /**
     * Get teacher's refund requests
     */
    async getTeacherRefundRequests(params?: {
        status?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        success: boolean;
        data: RefundRequest[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }> {
        const response = await api.get('/client/refunds/teacher/requests', { params });
        return response.data;
    },

    /**
     * Approve refund (teacher)
     */
    async approveRefund(refundId: string, data: {
        notes?: string;
        refundMethod?: string;
    }): Promise<{
        success: boolean;
        message: string;
        data: RefundRequest;
    }> {
        const response = await api.post(`/client/refunds/${refundId}/approve`, data);
        return response.data;
    },

    /**
     * Reject refund (teacher)
     */
    async rejectRefund(refundId: string, data: {
        reason: string;
        notes?: string;
    }): Promise<{
        success: boolean;
        message: string;
        data: RefundRequest;
    }> {
        const response = await api.post(`/client/refunds/${refundId}/reject`, data);
        return response.data;
    }
};

