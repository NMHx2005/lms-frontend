import api from '../api';

// ========== INTERFACES ==========

export interface SupportTicket {
    _id: string;
    ticketNumber: string;
    userId: string;
    userName: string;
    userEmail: string;
    subject: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'open' | 'in_progress' | 'waiting_user' | 'resolved' | 'closed';
    category: 'technical' | 'billing' | 'course' | 'account' | 'general';
    assignedTo?: string;
    assignedToName?: string;
    createdAt: string;
    updatedAt: string;
    lastResponseAt?: string;
    responseCount: number;
    tags: string[];
}

export interface FAQ {
    _id: string;
    question: string;
    answer: string;
    category: string;
    isPublished: boolean;
    viewCount: number;
    helpfulCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface SupportStaff {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'support_agent' | 'supervisor';
    isActive: boolean;
    ticketCount: number;
    averageResponseTime: number;
}

export interface TicketStats {
    totalTickets: number;
    openTickets: number;
    inProgressTickets: number;
    resolvedTickets: number;
    closedTickets: number;
    averageResponseTime: number;
    averageResolutionTime: number;
    ticketsByCategory: Array<{ category: string; count: number }>;
    ticketsByPriority: Array<{ priority: string; count: number }>;
}

export interface TicketFilters {
    search?: string;
    status?: string;
    priority?: string;
    category?: string;
    assignedTo?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface AssignTicketData {
    assignedTo: string;
    note?: string;
}

export interface UpdateTicketStatusData {
    status: string;
    note?: string;
}

export interface AddTicketNoteData {
    note: string;
    isInternal?: boolean;
}

export interface CreateFAQData {
    question: string;
    answer: string;
    category: string;
    isPublished?: boolean;
}

export interface UpdateFAQData {
    question?: string;
    answer?: string;
    category?: string;
    isPublished?: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
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

// ========== SUPPORT TICKET OPERATIONS ==========

export const getSupportTickets = async (filters: TicketFilters = {}): Promise<ApiResponse<PaginatedResponse<SupportTicket>>> => {
    try {
        // Clean filters - remove empty values
        const cleanFilters: any = {};
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '' && value !== 'all') {
                cleanFilters[key] = value;
            }
        });

        const response = await api.get('/admin/support/tickets', { params: cleanFilters });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

export const getSupportTicketById = async (id: string): Promise<ApiResponse<SupportTicket>> => {
    try {
        const response = await api.get(`/admin/support/tickets/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

export const assignTicket = async (id: string, data: AssignTicketData): Promise<ApiResponse<SupportTicket>> => {
    try {
        const response = await api.put(`/admin/support/tickets/${id}/assign`, data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

export const updateTicketStatus = async (id: string, data: UpdateTicketStatusData): Promise<ApiResponse<SupportTicket>> => {
    try {
        const response = await api.put(`/admin/support/tickets/${id}/status`, data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

export const addTicketNote = async (id: string, data: AddTicketNoteData): Promise<ApiResponse<{ message: string }>> => {
    try {
        const response = await api.post(`/admin/support/tickets/${id}/notes`, data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

// ========== SUPPORT STAFF OPERATIONS ==========

export const getSupportStaff = async (): Promise<ApiResponse<SupportStaff[]>> => {
    try {
        const response = await api.get('/admin/support/staff');
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

// ========== SUPPORT STATISTICS ==========

export const getSupportStats = async (): Promise<ApiResponse<TicketStats>> => {
    try {
        const response = await api.get('/admin/support/stats');
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

// ========== SEARCH OPERATIONS ==========

export const searchTickets = async (query: string, filters: TicketFilters = {}): Promise<ApiResponse<PaginatedResponse<SupportTicket>>> => {
    try {
        const cleanFilters: any = { search: query };
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '' && value !== 'all') {
                cleanFilters[key] = value;
            }
        });

        const response = await api.get('/admin/support/search', { params: cleanFilters });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

// ========== FAQ OPERATIONS ==========

export const getFAQs = async (): Promise<ApiResponse<FAQ[]>> => {
    try {
        const response = await api.get('/admin/support/faqs');
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

export const getFAQById = async (id: string): Promise<ApiResponse<FAQ>> => {
    try {
        const response = await api.get(`/admin/support/faqs/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

export const createFAQ = async (data: CreateFAQData): Promise<ApiResponse<FAQ>> => {
    try {
        const response = await api.post('/admin/support/faqs', data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

export const updateFAQ = async (id: string, data: UpdateFAQData): Promise<ApiResponse<FAQ>> => {
    try {
        const response = await api.put(`/admin/support/faqs/${id}`, data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

export const deleteFAQ = async (id: string): Promise<ApiResponse<{ message: string }>> => {
    try {
        const response = await api.delete(`/admin/support/faqs/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

export const toggleFAQStatus = async (id: string): Promise<ApiResponse<FAQ>> => {
    try {
        const response = await api.patch(`/admin/support/faqs/${id}/toggle-status`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};
