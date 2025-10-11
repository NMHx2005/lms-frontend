import api from '../api';

export interface Category {
    _id: string;
    name: string;
    description: string;
    courseCount: number;
    isActive: boolean;
}

/**
 * Get all active categories
 */
export const getCategories = async () => {
    const response = await api.get('/client/categories');
    return response.data;
};

/**
 * Get category domains (names only) for dropdown
 */
export const getCategoryDomains = async (): Promise<string[]> => {
    const response = await api.get('/client/categories/domains');
    return response.data.data;
};

/**
 * Get category stats
 */
export const getCategoryStats = async () => {
    const response = await api.get('/client/categories/stats');
    return response.data;
};

