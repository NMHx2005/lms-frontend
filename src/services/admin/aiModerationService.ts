import api from '../api';

// Types
export interface AIEvaluation {
    _id: string;
    contentId: string;
    contentType: 'course' | 'comment' | 'review' | 'assignment';
    content: string;
    confidence: number;
    flagged: boolean;
    riskLevel: 'low' | 'medium' | 'high';
    categories: string[];
    suggestions: string[];
    processedAt: string;
    status: 'pending' | 'reviewed' | 'auto-approved' | 'auto-rejected';
    reviewedBy?: string;
    reviewNotes?: string;
}

export interface AIEvaluationStats {
    totalProcessed: number;
    flaggedContent: number;
    autoApproved: number;
    autoRejected: number;
    pendingReview: number;
    accuracy: number;
    processingTime: number;
}

export interface AIEvaluationFilters {
    search?: string;
    contentType?: 'all' | 'course' | 'comment' | 'review' | 'assignment';
    riskLevel?: 'all' | 'low' | 'medium' | 'high';
    status?: 'all' | 'pending' | 'reviewed' | 'auto-approved' | 'auto-rejected';
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface AdminReviewData {
    decision: 'approve' | 'reject';
    notes?: string;
}

export interface BulkApproveData {
    evaluationIds: string[];
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

// API Functions
export const getEvaluationStatistics = async (): Promise<ApiResponse<AIEvaluationStats>> => {
    const response = await api.get('/admin/ai-evaluations/statistics');
    return response.data;
};

export const getPendingEvaluations = async (
    filters?: AIEvaluationFilters
): Promise<PaginatedResponse<AIEvaluation>> => {
    const response = await api.get('/admin/ai-evaluations/pending', { params: filters });
    return response.data;
};

export const getAllEvaluations = async (
    filters?: AIEvaluationFilters
): Promise<PaginatedResponse<AIEvaluation>> => {
    const response = await api.get('/admin/ai-evaluations', { params: filters });
    return response.data;
};

export const getEvaluationById = async (id: string): Promise<ApiResponse<AIEvaluation>> => {
    const response = await api.get(`/admin/ai-evaluations/${id}`);
    return response.data;
};

export const submitAdminReview = async (
    id: string,
    reviewData: AdminReviewData
): Promise<ApiResponse<AIEvaluation>> => {
    const response = await api.post(`/admin/ai-evaluations/${id}/review`, reviewData);
    return response.data;
};

export const retryAIEvaluation = async (id: string): Promise<ApiResponse<AIEvaluation>> => {
    const response = await api.post(`/admin/ai-evaluations/${id}/retry`);
    return response.data;
};

export const bulkApproveEvaluations = async (
    data: BulkApproveData
): Promise<ApiResponse<{ approved: number; failed: number }>> => {
    const response = await api.post('/admin/ai-evaluations/bulk/approve', data);
    return response.data;
};

export const getCourseEvaluationHistory = async (
    courseId: string
): Promise<PaginatedResponse<AIEvaluation>> => {
    const response = await api.get(`/admin/ai-evaluations/course/${courseId}/history`);
    return response.data;
};

export const exportEvaluations = async (filters?: AIEvaluationFilters): Promise<Blob> => {
    const response = await api.get('/admin/ai-evaluations/export', {
        params: filters,
        responseType: 'blob'
    });
    return response.data;
};

