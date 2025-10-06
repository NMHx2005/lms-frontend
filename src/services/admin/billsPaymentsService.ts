import api from '../api';
import type { ApiResponse } from './userService';
import type { SystemLog } from './systemService';

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        total: number;
        pages: number;
        page: number;
        limit: number;
    };
}

export interface Bill {
    _id: string;
    studentId: string | { _id: string; name: string; email: string } | null;
    studentName?: string;
    studentEmail?: string;
    courseId?: string | { _id: string; title: string } | null;
    courseTitle?: string;
    amount: number;
    currency: string;
    purpose: 'course_purchase' | 'subscription' | 'refund' | 'other';
    status: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
    paymentMethod: 'stripe' | 'paypal' | 'bank_transfer' | 'cash' | 'vnpay';
    paymentGateway?: string;
    transactionId?: string;
    description: string;
    metadata?: any;
    paidAt?: string;
    refundedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface BillFilters {
    search?: string;
    status?: string;
    paymentMethod?: string;
    dateRange?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

export interface PaymentActivity {
    _id: string;
    type: 'payment' | 'refund' | 'invoice';
    amount: number;
    status: 'completed' | 'pending' | 'failed';
    description: string;
    timestamp: string;
    userId: string;
    userName: string;
    orderId?: string;
    paymentMethod: string;
}


export interface BillRevenueAnalytics {
    totalRevenue: number;
    monthlyRevenue: Array<{
        month: string;
        amount: number;
    }>;
    revenueByPaymentMethod: Array<{
        method: string;
        amount: number;
        count: number;
    }>;
    revenueByCourse: Array<{
        courseId: string;
        courseTitle: string;
        amount: number;
        enrollments: number;
    }>;
    pendingAmount: number;
    overdueAmount: number;
}


class BillsPaymentsService {
    // Revenue Analytics
    static async getRevenueAnalytics(period?: 'daily' | 'weekly' | 'monthly' | 'yearly'): Promise<ApiResponse<BillRevenueAnalytics>> {
        const params = period ? { period } : {};
        const response = await api.get('/admin/analytics/revenue', { params });
        return response.data;
    }

    // Payment Activities
    static async getPaymentActivities(filters?: Partial<BillFilters>): Promise<ApiResponse<PaginatedResponse<PaymentActivity>>> {
        const response = await api.get('/admin/activity/presets/payment', { params: filters });
        return response.data;
    }

    // Export Payment Data
    static async exportPaymentData(filters?: Partial<BillFilters>): Promise<Blob> {
        const response = await api.get('/admin/activity/export.csv', {
            params: filters,
            responseType: 'blob'
        });
        return response.data;
    }

    // System Logs
    static async getSystemLogs(filters?: Partial<BillFilters>): Promise<ApiResponse<PaginatedResponse<SystemLog>>> {
        const response = await api.get('/admin/system/logs', { params: filters });
        return response.data;
    }

    // Bills Management (if needed)
    static async getBills(filters?: Partial<BillFilters>): Promise<ApiResponse<PaginatedResponse<Bill>>> {
        const response = await api.get('/admin/bills', { params: filters });
        return response.data;
    }

    static async getBillById(billId: string): Promise<ApiResponse<Bill>> {
        const response = await api.get(`/admin/bills/${billId}`);
        return response.data;
    }

    static async createBill(billData: Partial<Bill>): Promise<ApiResponse<Bill>> {
        const response = await api.post('/admin/bills', billData);
        return response.data;
    }

    static async updateBill(billId: string, billData: Partial<Bill>): Promise<ApiResponse<Bill>> {
        const response = await api.put(`/admin/bills/${billId}`, billData);
        return response.data;
    }

    static async deleteBill(billId: string): Promise<ApiResponse<void>> {
        const response = await api.delete(`/admin/bills/${billId}`);
        return response.data;
    }

    // Export functions
    static async exportBillsToCSV(filters?: Partial<BillFilters>): Promise<Blob> {
        const response = await api.get('/admin/bills/export/csv', {
            params: filters,
            responseType: 'blob'
        });
        return response.data;
    }

    static async exportBillsToExcel(filters?: Partial<BillFilters>): Promise<Blob> {
        const response = await api.get('/admin/bills/export/excel', {
            params: filters,
            responseType: 'blob'
        });
        return response.data;
    }
}

export default BillsPaymentsService;
