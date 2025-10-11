import api from '../api';

export interface EarningsOverview {
    totalEarnings: number;
    availableBalance: number;
    pendingEarnings: number;
    totalWithdrawn: number;
    currentMonthEarnings: number;
    lastMonthEarnings: number;
    growthRate: number;
    topCourse?: {
        id: string;
        title: string;
        earnings: number;
    };
    totalStudents?: number;
    totalCourses?: number;
    note?: string;
}

export interface EarningsHistory {
    _id: string;
    courseId: string;
    courseTitle: string;
    studentId: string;
    studentName: string;
    amount: number;
    netAmount: number;
    type: 'sale' | 'refund' | 'adjustment';
    status: 'pending' | 'completed' | 'failed';
    createdAt: Date;
    transactionId: string;
}

export interface EarningsStats {
    totalRevenue: number;
    totalTransactions: number;
    averageTransactionValue: number;
    refundRate: number;
    topSellingCourse?: {
        courseId: string;
        courseTitle: string;
        revenue: number;
    };
}

/**
 * Get earnings overview
 */
export const getEarningsOverview = async () => {
    const response = await api.get('/client/earnings/overview');
    return response.data;
};

/**
 * Get earnings history
 */
export const getEarningsHistory = async (params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    courseId?: string;
}) => {
    const response = await api.get('/client/earnings/history', { params });
    return response.data;
};

/**
 * Get earnings stats
 */
export const getEarningsStats = async (period?: string) => {
    const response = await api.get('/client/earnings/stats', {
        params: { period }
    });
    return response.data;
};

/**
 * Get current balance
 */
export const getBalance = async () => {
    const response = await api.get('/client/earnings/balance');
    return response.data;
};

/**
 * Get pending earnings
 */
export const getPendingEarnings = async () => {
    const response = await api.get('/client/earnings/pending');
    return response.data;
};

/**
 * Get earnings transactions
 */
export const getTransactions = async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    startDate?: string;
    endDate?: string;
    courseId?: string;
    status?: string;
}) => {
    const response = await api.get('/client/earnings/transactions', { params });
    return response.data;
};

/**
 * Request withdrawal
 */
export const requestWithdrawal = async (data: {
    amount: number;
    method: string;
    accountDetails: {
        accountName: string;
        accountNumber: string;
        [key: string]: any;
    };
    notes?: string;
}) => {
    const response = await api.post('/client/earnings/withdraw', data);
    return response.data;
};

/**
 * Get withdrawal history
 */
export const getWithdrawals = async (params?: {
    page?: number;
    limit?: number;
    status?: string;
}) => {
    const response = await api.get('/client/earnings/withdrawals', { params });
    return response.data;
};

/**
 * Get monthly breakdown for chart
 */
export const getMonthlyBreakdown = async (months?: number) => {
    const response = await api.get('/client/earnings/monthly-breakdown', {
        params: { months }
    });
    return response.data;
};

