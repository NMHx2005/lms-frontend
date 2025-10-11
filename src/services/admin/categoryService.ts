import api from '../api';

export interface Category {
    _id: string;
    name: string;
    description: string;
    courseCount: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

/**
 * Get all categories
 */
export const getCategories = async () => {
    const response = await api.get('/admin/categories');
    return response.data;
};

/**
 * Get category by ID
 */
export const getCategoryById = async (id: string) => {
    const response = await api.get(`/admin/categories/${id}`);
    return response.data;
};

/**
 * Create new category
 */
export const createCategory = async (data: { name: string; description: string }) => {
    const response = await api.post('/admin/categories', data);
    return response.data;
};

/**
 * Update category
 */
export const updateCategory = async (id: string, data: { name?: string; description?: string; isActive?: boolean }) => {
    const response = await api.put(`/admin/categories/${id}`, data);
    return response.data;
};

/**
 * Delete category
 */
export const deleteCategory = async (id: string) => {
    const response = await api.delete(`/admin/categories/${id}`);
    return response.data;
};

/**
 * Bulk delete categories
 */
export const bulkDeleteCategories = async (ids: string[]) => {
    const response = await api.post('/admin/categories/bulk-delete', { ids });
    return response.data;
};

/**
 * Toggle category status
 */
export const toggleCategoryStatus = async (id: string) => {
    const response = await api.patch(`/admin/categories/${id}/toggle-status`);
    return response.data;
};

const categoryService = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    bulkDeleteCategories,
    toggleCategoryStatus
};

export default categoryService;

