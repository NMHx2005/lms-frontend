import api from '../api';

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface Course {
    _id: string;
    title: string;
    description: string;
    shortDescription: string;
    thumbnail: string;
    domain: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    totalDuration: number;
    price: number;
    originalPrice: number;
    discountPercentage: number;
    isPublished: boolean;
    isApproved: boolean;
    isFeatured: boolean;
    instructorId: string;
    instructorName: string;
    totalStudents: number;
    averageRating: number;
    totalLessons: number;
    tags: string[];
    prerequisites: string[];
    benefits: string[];
    relatedLinks: string[];
    language: string;
    certificate: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
    approvedAt: string | null;
}

export interface CourseFilters {
    search?: string;
    domain?: string; // Changed from category to domain to match API
    instructor?: string;
    level?: string;
    priceMin?: number;
    priceMax?: number;
    isApproved?: boolean;
    isPublished?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

export interface CourseAnalytics {
    totalCourses: number;
    publishedCourses: number;
    pendingCourses: number;
    coursesByDomain: {
        _id: string;
        count: number;
    }[];
    averageRating: number;
}

export interface PaginatedResponse<T> {
    courses: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface CategoryStats {
    totalCategories: number;
    activeCategories: number;
    totalCourses: number;
    totalEnrollments: number;
}

export interface UpdateCourseCategoryData {
    domain: string;
}

export interface Category {
    _id: string;
    name: string;
    description?: string;
    isActive: boolean;
    courseCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface CategoryCreateData {
    name: string;
    description?: string;
}

export interface CategoryUpdateData {
    name?: string;
    description?: string;
    isActive?: boolean;
}

class CategoryManagementService {
    // Get courses for category management
    async getCourses(filters: CourseFilters = {}): Promise<ApiResponse<PaginatedResponse<Course>>> {
        const response = await api.get('/admin/courses', { params: filters });
        return response.data;
    }

    // Get course analytics for categories
    async getCourseAnalytics(filters: { period?: string; category?: string } = {}): Promise<ApiResponse<CourseAnalytics>> {
        // Clean filters - use valid period values only
        const cleanFilters = { ...filters };

        // Convert period to valid format
        if (cleanFilters.period === '30' || cleanFilters.period === '30d') {
            cleanFilters.period = 'monthly'; // Convert to valid period
        }

        const response = await api.get('/admin/analytics/courses', { params: cleanFilters });
        return response.data;
    }

    // Update course category
    async updateCourseCategory(courseId: string, data: UpdateCourseCategoryData): Promise<ApiResponse<Course>> {
        const response = await api.put(`/admin/courses/${courseId}`, { domain: data.domain });
        return response.data;
    }

    // Get category statistics (derived from analytics)
    async getCategoryStats(): Promise<ApiResponse<CategoryStats>> {
        // Since we don't have a specific stats endpoint, we'll derive stats from analytics
        const analyticsResponse = await this.getCourseAnalytics({ period: 'monthly' });

        if (analyticsResponse.success) {
            const analytics = analyticsResponse.data;
            const stats: CategoryStats = {
                totalCategories: analytics.coursesByDomain.length,
                activeCategories: analytics.publishedCourses,
                totalCourses: analytics.totalCourses,
                totalEnrollments: 0 // This would need to be calculated from course data
            };

            return {
                success: true,
                data: stats
            };
        }

        return {
            success: false,
            data: {
                totalCategories: 0,
                activeCategories: 0,
                totalCourses: 0,
                totalEnrollments: 0
            }
        };
    }

    // Get courses by category
    async getCoursesByCategory(categoryId: string, filters: CourseFilters = {}): Promise<ApiResponse<PaginatedResponse<Course>>> {
        const response = await api.get(`/admin/courses/category/${categoryId}`, { params: filters });
        return response.data;
    }

    // Bulk update course categories
    async bulkUpdateCourseCategories(courseIds: string[], categoryId: string): Promise<ApiResponse<any>> {
        const response = await api.patch('/admin/courses/bulk-category', {
            courseIds,
            categoryId
        });
        return response.data;
    }

    // Get course by ID
    async getCourseById(courseId: string): Promise<ApiResponse<Course>> {
        const response = await api.get(`/admin/courses/${courseId}`);
        return response.data;
    }

    // Search courses
    async searchCourses(query: string, filters: CourseFilters = {}): Promise<ApiResponse<PaginatedResponse<Course>>> {
        const response = await api.get('/admin/courses/search', {
            params: {
                q: query,
                ...filters
            }
        });
        return response.data;
    }

    // Create new category/domain
    async createCategory(name: string): Promise<ApiResponse<{ domain: string }>> {
        const response = await api.post('/admin/categories', { name });
        return response.data;
    }

    // ========== CATEGORY CRUD OPERATIONS ==========

    // Get all categories
    async getCategories(): Promise<ApiResponse<Category[]>> {
        const response = await api.get('/admin/categories');
        return response.data;
    }

    // Get category by ID
    async getCategoryById(id: string): Promise<ApiResponse<Category>> {
        const response = await api.get(`/admin/categories/${id}`);
        return response.data;
    }

    // Create new category
    async createCategoryData(data: CategoryCreateData): Promise<ApiResponse<Category>> {
        const response = await api.post('/admin/categories', data);
        return response.data;
    }

    // Update category
    async updateCategory(id: string, data: CategoryUpdateData): Promise<ApiResponse<Category>> {
        const response = await api.put(`/admin/categories/${id}`, data);
        return response.data;
    }

    // Delete category
    async deleteCategory(id: string): Promise<ApiResponse<{ message: string }>> {
        const response = await api.delete(`/admin/categories/${id}`);
        return response.data;
    }

    // Bulk delete categories
    async bulkDeleteCategories(ids: string[]): Promise<ApiResponse<{ deletedCount: number }>> {
        const response = await api.delete('/admin/categories/bulk', { data: { ids } });
        return response.data;
    }

    // Toggle category status
    async toggleCategoryStatus(id: string): Promise<ApiResponse<Category>> {
        const response = await api.patch(`/admin/categories/${id}/toggle-status`);
        return response.data;
    }
}

export default new CategoryManagementService();
