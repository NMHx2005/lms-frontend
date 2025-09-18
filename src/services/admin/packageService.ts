import api from '../api';

// Types
export interface Package {
    _id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    duration: number; // in days
    maxStudents: number;
    features: string[];
    isActive: boolean;
    thumbnail?: string;
    createdAt: string;
    updatedAt: string;
    stats?: {
        totalSold: number;
        totalRevenue: number;
        averageRating: number;
    };
}

export interface PackageFilters {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    priceRange?: string;
    duration?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface PackageStats {
    totalPackages: number;
    activePackages: number;
    totalRevenue: number;
    totalSold: number;
    averagePrice: number;
}

export interface CreatePackageData {
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    duration: number;
    maxStudents: number;
    features: string[];
    isActive: boolean;
    thumbnail?: string;
}

export interface UpdatePackageData {
    name?: string;
    description?: string;
    price?: number;
    originalPrice?: number;
    duration?: number;
    maxStudents?: number;
    features?: string[];
    isActive?: boolean;
    thumbnail?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    packages: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

const BASE_PATH = '/admin/packages-management';

class PackageService {
    // Get all packages with pagination and filters
    static async getPackages(filters: PackageFilters = {}): Promise<ApiResponse<Package[]>> {
        try {
            const params: any = {};
            if (typeof filters.search === 'string' && filters.search.trim()) params.search = filters.search.trim();
            if (filters.status === 'active') params.isActive = true;
            if (filters.status === 'inactive') params.isActive = false;

            const response = await api.get(`${BASE_PATH}/packages`, { params });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Failed to fetch packages');
        }
    }

    // Get package by ID
    static async getPackageById(id: string): Promise<ApiResponse<Package>> {
        try {
            const response = await api.get(`${BASE_PATH}/packages/${id}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Failed to fetch package');
        }
    }

    // Create new package
    static async createPackage(data: any): Promise<ApiResponse<Package>> {
        try {
            const response = await api.post(`${BASE_PATH}/packages`, data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Failed to create package');
        }
    }

    // Update package
    static async updatePackage(id: string, data: any): Promise<ApiResponse<Package>> {
        try {
            const response = await api.put(`${BASE_PATH}/packages/${id}`, data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Failed to update package');
        }
    }

    // Delete package
    static async deletePackage(id: string): Promise<ApiResponse<{ message?: string }>> {
        try {
            const response = await api.delete(`${BASE_PATH}/packages/${id}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Failed to delete package');
        }
    }

    // Activate package
    static async activatePackage(id: string): Promise<ApiResponse<Package>> {
        try {
            const response = await api.patch(`${BASE_PATH}/packages/${id}/activate`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Failed to activate package');
        }
    }

    // Deactivate package
    static async deactivatePackage(id: string): Promise<ApiResponse<Package>> {
        try {
            const response = await api.patch(`${BASE_PATH}/packages/${id}/deactivate`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Failed to deactivate package');
        }
    }

    // Bulk update package status
    static async bulkUpdatePackageStatus(ids: string[], isActive: boolean): Promise<ApiResponse<{ message: string; updated: number }>> {
        try {
            const response = await api.patch(`${BASE_PATH}/packages/bulk-status`, { packageIds: ids, isActive });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Failed to bulk update package status');
        }
    }

    // Get package statistics
    static async getPackageStats(): Promise<ApiResponse<PackageStats>> {
        try {
            const response = await api.get(`${BASE_PATH}/packages/stats`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Failed to fetch package statistics');
        }
    }

    // Search packages
    static async searchPackages(query: string, limit: number = 10): Promise<ApiResponse<Package[]>> {
        try {
            const response = await api.get(`${BASE_PATH}/packages/search`, {
                params: { q: query, limit }
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Failed to search packages');
        }
    }

    // Upload package thumbnail
    static async uploadThumbnail(id: string, file: File): Promise<ApiResponse<{ thumbnail: string }>> {
        try {
            const formData = new FormData();
            formData.append('thumbnail', file);

            const response = await api.post(`${BASE_PATH}/packages/${id}/thumbnail`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Failed to upload thumbnail');
        }
    }

    // Get package analytics
    static async getPackageAnalytics(id: string, period: string = '30d'): Promise<ApiResponse<any>> {
        try {
            const response = await api.get(`${BASE_PATH}/packages/${id}/analytics`, {
                params: { period }
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Failed to fetch package analytics');
        }
    }

    // Duplicate package
    static async duplicatePackage(id: string, newName: string): Promise<ApiResponse<Package>> {
        try {
            const response = await api.post(`${BASE_PATH}/packages/${id}/duplicate`, { name: newName });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Failed to duplicate package');
        }
    }

    // Export packages to CSV
    static async exportPackages(filters: PackageFilters = {}): Promise<Blob> {
        try {
            const response = await api.get(`${BASE_PATH}/packages/export`, {
                params: filters,
                responseType: 'blob'
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Failed to export packages');
        }
    }

    // Export packages to CSV (client-side fallback)
    static exportPackagesToCSV(packages: Package[]): void {
        const headers = [
            'Tên gói',
            'Mô tả',
            'Giá (VND)',
            'Số học viên tối đa',
            'Chu kỳ thanh toán',
            'Trạng thái',
            'Phiên bản',
            'Ngày tạo',
            'Cập nhật lần cuối'
        ];

        const csvContent = [
            headers.join(','),
            ...packages.map(pkg => [
                `"${pkg.name || ''}"`,
                `"${pkg.description || ''}"`,
                pkg.price || 0,
                (pkg as any).maxCourses || 0,
                `"${(pkg as any).billingCycle === 'monthly' ? 'Hàng tháng' : 'Hàng năm'}"`,
                `"${pkg.isActive ? 'Hoạt động' : 'Tạm dừng'}"`,
                (pkg as any).version || 1,
                `"${new Date(pkg.createdAt).toLocaleDateString('vi-VN')}"`,
                `"${new Date(pkg.updatedAt).toLocaleDateString('vi-VN')}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `packages_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

export default PackageService;
