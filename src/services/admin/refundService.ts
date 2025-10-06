import api from '../api';

// Types
export interface RefundRequest {
    _id: string;
    orderId: string;
    courseId: string;
    courseTitle: string;
    studentId: string;
    studentName: string;
    studentEmail: string;
    instructorId: string;
    instructorName: string;
    amount: number;
    reason: string;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    requestDate: string;
    processedDate?: string;
    processedBy?: string;
    notes?: string;
    evidence?: string[];
    refundMethod: 'original_payment' | 'credit' | 'bank_transfer';
    originalPaymentMethod: string;
    originalTransactionId: string;
}

export interface RefundFilters {
    search?: string;
    status?: string;
    refundMethod?: string;
    dateRange?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface ProcessRefundData {
    action: 'approve' | 'reject';
    notes?: string;
    refundMethod?: 'original_payment' | 'credit' | 'bank_transfer';
}

export interface RefundStats {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    completed: number;
    totalAmount: number;
    pendingAmount: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    error?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

class RefundService {
    // Get all refunds with pagination and filters
    static async getRefunds(filters: RefundFilters = {}): Promise<ApiResponse<PaginatedResponse<RefundRequest>>> {
        try {
            const params: any = {};
            if (filters.search) params.search = filters.search;
            if (filters.status && filters.status !== 'all') params.status = filters.status;
            if (filters.refundMethod && filters.refundMethod !== 'all') params.refundMethod = filters.refundMethod;
            if (filters.dateRange && filters.dateRange !== 'all') params.dateRange = filters.dateRange;
            if (filters.page) params.page = filters.page;
            if (filters.limit) params.limit = filters.limit;
            if (filters.sortBy) params.sortBy = filters.sortBy;
            if (filters.sortOrder) params.sortOrder = filters.sortOrder;

            const response = await api.get('/admin/system/refunds', { params });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Failed to fetch refunds');
        }
    }

    // Get refund by ID
    static async getRefundById(id: string): Promise<ApiResponse<RefundRequest>> {
        try {
            const response = await api.get(`/admin/system/refunds/${id}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Failed to fetch refund');
        }
    }

    // Process refund request
    static async processRefund(id: string, data: ProcessRefundData): Promise<ApiResponse<RefundRequest>> {
        try {
            const response = await api.put(`/admin/system/refunds/${id}/process`, data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Failed to process refund');
        }
    }

    // Get refund statistics
    static async getRefundStats(): Promise<ApiResponse<RefundStats>> {
        try {
            const response = await api.get('/admin/system/refunds/stats');
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Failed to fetch refund stats');
        }
    }

    // Get system overview for refunds
    static async getSystemOverview(): Promise<ApiResponse<any>> {
        try {
            const response = await api.get('/admin/system/overview');
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Failed to fetch system overview');
        }
    }

    // Bulk process refunds
    static async bulkProcessRefunds(refundIds: string[], data: ProcessRefundData): Promise<ApiResponse<any>> {
        try {
            const response = await api.put('/admin/system/refunds/bulk-process', {
                refundIds,
                ...data
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Failed to bulk process refunds');
        }
    }

    // Export refunds to CSV
    static async exportRefunds(filters: RefundFilters = {}): Promise<Blob> {
        try {
            const params: any = {};
            if (filters.search) params.search = filters.search;
            if (filters.status && filters.status !== 'all') params.status = filters.status;
            if (filters.refundMethod && filters.refundMethod !== 'all') params.refundMethod = filters.refundMethod;
            if (filters.dateRange && filters.dateRange !== 'all') params.dateRange = filters.dateRange;

            const response = await api.get('/admin/system/refunds/export', {
                params,
                responseType: 'blob'
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Failed to export refunds');
        }
    }

    // Export refunds to CSV (client-side fallback)
    static exportRefundsToCSV(refunds: RefundRequest[]): void {
        const headers = [
            'ID',
            'Order ID',
            'Course Title',
            'Student Name',
            'Student Email',
            'Instructor Name',
            'Amount (VND)',
            'Reason',
            'Status',
            'Refund Method',
            'Request Date',
            'Processed Date',
            'Notes'
        ];

        const csvContent = [
            headers.join(','),
            ...refunds.map(refund => [
                refund._id,
                `"${refund.orderId}"`,
                `"${refund.courseTitle}"`,
                `"${refund.studentName}"`,
                `"${refund.studentEmail}"`,
                `"${refund.instructorName}"`,
                refund.amount,
                `"${refund.reason}"`,
                `"${refund.status}"`,
                `"${refund.refundMethod}"`,
                `"${new Date(refund.requestDate).toLocaleDateString('vi-VN')}"`,
                refund.processedDate ? `"${new Date(refund.processedDate).toLocaleDateString('vi-VN')}"` : '',
                `"${refund.notes || ''}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `refunds_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

export default RefundService;
