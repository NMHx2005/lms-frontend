import api from '../api';

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    roles: string[];  // Changed from role: string to roles: string[]
    isActive: boolean;
    createdAt: string;
    lastLoginAt?: string;
    avatar?: string;
    phone?: string;
    country?: string;
    bio?: string;
    subscriptionPlan?: string;
    emailVerified?: boolean;
    stats?: {
        totalCoursesEnrolled: number;
        totalCoursesCompleted: number;
        totalAssignmentsSubmitted: number;
        averageScore: number;
        totalLearningTime: number;
    };
}

export interface UserFilters {
    role?: string;
    isActive?: boolean;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
    users: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface BulkRoleUpdate {
    userIds: string[];
    roles: string[];  // Changed from role: string to roles: string[]
    reason?: string;
}

export interface AuthUser {
    _id: string;
    userId: string;
    username: string;
    email: string;
    roles: string[];
    permissions: string[];
    isActive: boolean;
    lastLogin?: string;
    createdAt: string;
}

export interface BulkAuthRoleUpdate {
    userIds: string[];
    roles: string[];
    reason?: string;
}

class PermissionsService {
    // Get users for permissions management
    async getUsers(filters: UserFilters = {}): Promise<ApiResponse<{ users: User[]; total: number; page: number; pages: number }>> {
        const response = await api.get('/admin/users', { params: filters });
        return response.data;
    }

    // Bulk update user roles
    async bulkUpdateRoles(data: BulkRoleUpdate): Promise<ApiResponse<any>> {
        const response = await api.patch('/admin/users/bulk-roles', data);
        return response.data;
    }

    // Get auth users
    async getAuthUsers(filters: UserFilters = {}): Promise<ApiResponse<{ users: AuthUser[]; total: number; page: number; pages: number }>> {
        const response = await api.get('/admin/auth/users', { params: filters });
        return response.data;
    }

    // Bulk update auth user roles
    async bulkUpdateAuthRoles(data: BulkAuthRoleUpdate): Promise<ApiResponse<any>> {
        const response = await api.post('/admin/auth/users/bulk-update-roles', data);
        return response.data;
    }

    // Get available roles
    async getRoles(): Promise<ApiResponse<string[]>> {
        const response = await api.get('/admin/auth/roles');
        return response.data;
    }

    // Get available permissions
    async getPermissions(): Promise<ApiResponse<string[]>> {
        const response = await api.get('/admin/auth/permissions');
        return response.data;
    }
}

export default new PermissionsService();
