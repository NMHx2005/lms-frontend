import api from '../api';

export interface Bill {
    _id: string;
    studentId: string;
    courseId: {
        _id: string;
        title: string;
        thumbnail?: string;
    };
    amount: number;
    currency: string;
    purpose: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
    paymentMethod: string;
    description?: string;
    transactionId?: string;
    paidAt?: string;
    createdAt: string;
    updatedAt: string;
    metadata?: any;
}

export interface PaymentStats {
    totalSpent: number;
    totalBills: number;
    completedPayments: number;
    pendingPayments: number;
    failedPayments: number;
    averageSpent: number;
}

export interface PaymentHistoryResponse {
    success: boolean;
    data: Bill[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export const paymentService = {
    /**
     * Get payment history
     */
    async getPaymentHistory(params?: {
        page?: number;
        limit?: number;
        status?: string;
    }): Promise<PaymentHistoryResponse> {
        const response = await api.get('/client/payments/history', { params });
        return response.data;
    },

    /**
     * Get bill by ID
     */
    async getBillById(billId: string): Promise<{ success: boolean; data: Bill }> {
        const response = await api.get(`/client/payments/bills/${billId}`);
        return response.data;
    },

    /**
     * Get payment statistics
     */
    async getPaymentStats(): Promise<{ success: boolean; data: PaymentStats }> {
        const response = await api.get('/client/payments/stats');
        return response.data;
    },

    /**
     * Retry failed payment
     */
    async retryPayment(billId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            paymentUrl: string;
            billId: string;
            orderId: string;
            amount: number;
        };
    }> {
        const response = await api.post(`/client/payments/bills/${billId}/retry`);
        return response.data;
    },

    /**
     * Download invoice PDF
     */
    async downloadInvoice(billId: string): Promise<Blob> {
        const response = await api.get(`/client/payments/bills/${billId}/invoice`, {
            responseType: 'blob'
        });
        return response.data;
    },

    /**
     * Create payment for course
     */
    async createPayment(courseId: string, data: {
        paymentMethod: string;
        amount: number;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            billId: string;
            amount: number;
            status: string;
        };
    }> {
        const response = await api.post(`/client/payments/course/${courseId}`, data);
        return response.data;
    },

    /**
     * Create VNPay payment for course
     */
    async createVNPayPayment(courseId: string, data: {
        amount: number;
        courseTitle: string;
        userInfo?: {
            fullName: string;
            phone?: string;
            address?: string;
        };
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            paymentUrl: string;
            billId: string;
            orderId: string;
            amount: number;
        };
    }> {
        const response = await api.post(`/client/payments/vnpay/${courseId}`, data);
        return response.data;
    }
};

