import api from '../api';
import { RefundRequest } from '../client/refund.service';

export interface RefundStats {
    totalRefunds: number;
    pendingRefunds: number;
    approvedRefunds: number;
    rejectedRefunds: number;
    cancelledRefunds: number;
    totalRefundedAmount: number;
    averageRefundAmount: number;
}

export const adminRefundService = {
    /**
     * Get all refund requests (admin view - read only)
     */
    async getAllRefundRequests(params?: {
        status?: string;
        page?: number;
        limit?: number;
        search?: string;
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
        const response = await api.get('/admin/refunds', { params });
        return response.data;
    },

    /**
     * Get refund request details
     */
    async getRefundDetails(refundId: string): Promise<{
        success: boolean;
        data: RefundRequest;
    }> {
        const response = await api.get(`/admin/refunds/${refundId}`);
        return response.data;
    },

    /**
     * Get refund statistics
     */
    async getRefundStats(): Promise<{
        success: boolean;
        data: RefundStats;
    }> {
        const response = await api.get('/admin/refunds/stats');
        return response.data;
    },

    /**
     * Add admin note (monitoring only, no approval power)
     */
    async addAdminNote(refundId: string, note: string): Promise<{
        success: boolean;
        message: string;
        data: RefundRequest;
    }> {
        const response = await api.post(`/admin/refunds/${refundId}/note`, { note });
        return response.data;
    }
};
