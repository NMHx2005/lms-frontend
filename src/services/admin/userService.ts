import axios from 'axios';
import { API_CONFIG, TOKEN_CONFIG } from '../../config/api';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN}`,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY);
                if (refreshToken) {
                    const response = await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH}/refresh`, {
                        refreshToken
                    });

                    const { accessToken } = response.data.data;
                    localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY, accessToken);

                    // Retry original request with new token
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed, redirect to login
                localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
                localStorage.removeItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY);
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

// Types
export interface User {
    _id: string;
    name: string;
    email: string;
    roles: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    lastLoginAt?: string;
    avatar?: string;
    phone?: string;
    country?: string;
    bio?: string;
    subscriptionPlan?: string;
    subscriptionExpiresAt?: string;
    emailVerified?: boolean;
    socialLinks?: Record<string, any>;
    preferences?: {
        notifications: {
            email: boolean;
            push: boolean;
            sms: boolean;
        };
        language: string;
        timezone: string;
    };
    stats?: {
        totalCoursesEnrolled: number;
        totalCoursesCompleted: number;
        totalAssignmentsSubmitted: number;
        averageScore: number;
        totalLearningTime: number;
    };
    lastActivityAt?: string;
}

export interface UserFilters {
    search?: string;
    roles?: string[];
    isActive?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface UserStats {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    newUsersThisMonth: number;
    usersByRole: Array<{
        role: string;
        count: number;
    }>;
    activeUsersThisWeek: number;
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
    error?: string;
}

export interface PaginatedResponse<T> {
    users: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// User Service
export class UserService {
    // Get all users with pagination and filters
    static async getUsers(filters: UserFilters = {}): Promise<ApiResponse<PaginatedResponse<User>>> {
        const params = new URLSearchParams();

        if (filters.search) params.append('search', filters.search);
        if (filters.roles?.length) {
            // Send each role as a separate parameter
            filters.roles.forEach(role => params.append('roles', role));
        }
        if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
        if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

        const response = await apiClient.get(`/users?${params.toString()}`);
        return response.data;
    }

    // Get user by ID
    static async getUserById(id: string): Promise<ApiResponse<User>> {
        const response = await apiClient.get(`/users/${id}`);
        return response.data;
    }

    // Create new user
    static async createUser(userData: Partial<User>): Promise<ApiResponse<User>> {
        const response = await apiClient.post('/users', userData);
        return response.data;
    }

    // Update user
    static async updateUser(id: string, userData: Partial<User>): Promise<ApiResponse<User>> {
        const response = await apiClient.put(`/users/${id}`, userData);
        return response.data;
    }

    // Delete user
    static async deleteUser(id: string): Promise<ApiResponse<{ message: string }>> {
        const response = await apiClient.delete(`/users/${id}`);
        return response.data;
    }

    // Activate user
    static async activateUser(id: string): Promise<ApiResponse<User>> {
        const response = await apiClient.patch(`/users/${id}/activate`);
        return response.data;
    }

    // Deactivate user
    static async deactivateUser(id: string): Promise<ApiResponse<User>> {
        const response = await apiClient.patch(`/users/${id}/deactivate`);
        return response.data;
    }

    // Get user statistics
    static async getUserStats(): Promise<ApiResponse<UserStats>> {
        const response = await apiClient.get('/users/stats');
        return response.data;
    }

    // Search users
    static async searchUsers(query: string, limit: number = 10): Promise<ApiResponse<User[]>> {
        const response = await apiClient.get(`/users/search?q=${encodeURIComponent(query)}&limit=${limit}`);
        return response.data;
    }

    // Bulk update user status
    static async bulkUpdateUserStatus(userIds: string[], isActive: boolean): Promise<ApiResponse<{ message: string; updatedCount: number }>> {
        const response = await apiClient.patch('/users/bulk-status', { userIds, isActive });
        return response.data;
    }

    // Bulk update user roles
    static async bulkUpdateUserRoles(userIds: string[], roles: string[]): Promise<ApiResponse<{ message: string; updatedCount: number }>> {
        const response = await apiClient.patch('/users/bulk-roles', { userIds, roles });
        return response.data;
    }
}

export default UserService;
