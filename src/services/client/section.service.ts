import api from '../api';

export interface Section {
    _id: string;
    courseId: string;
    title: string;
    description?: string;
    order: number;
    isPublished: boolean;
    duration?: number;
    lessonsCount?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateSectionData {
    courseId: string;
    title: string;
    description?: string;
    order?: number;
}

export interface UpdateSectionData {
    title?: string;
    description?: string;
    order?: number;
    isPublished?: boolean;
}

export interface ReorderSectionData {
    sectionId: string;
    newOrder: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

/**
 * Get all sections for a course (requires enrollment)
 * @param courseId - Course ID
 * @param previewMode - If true, returns only preview lessons (no enrollment required)
 */
export const getSectionsByCourse = async (courseId: string, previewMode: boolean = false): Promise<ApiResponse<Section[]>> => {
    const response = await api.get(`/client/sections/course/${courseId}`, {
        params: previewMode ? { preview: 'true' } : {}
    });
    return response.data;
};

/**
 * Get sections preview for a course (public - no enrollment required)
 * This endpoint shows course structure but without sensitive content
 */
export const getSectionsPreview = async (courseId: string): Promise<ApiResponse<Section[]>> => {
    const response = await api.get(`/client/sections/course/${courseId}/preview`);
    return response.data;
};

/**
 * Get section by ID
 */
export const getSectionById = async (sectionId: string): Promise<ApiResponse<Section>> => {
    const response = await api.get(`/admin/sections/${sectionId}`);
    return response.data;
};

/**
 * Create a new section
 */
export const createSection = async (data: CreateSectionData): Promise<ApiResponse<Section>> => {
    const response = await api.post('/client/sections', data);
    return response.data;
};

/**
 * Update section
 */
export const updateSection = async (sectionId: string, data: UpdateSectionData): Promise<ApiResponse<Section>> => {
    const response = await api.put(`/client/sections/${sectionId}`, data);
    return response.data;
};

/**
 * Delete section
 */
export const deleteSection = async (sectionId: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/client/sections/${sectionId}`);
    return response.data;
};

/**
 * Reorder sections
 */
export const reorderSections = async (courseId: string, sections: ReorderSectionData[]): Promise<ApiResponse<Section[]>> => {
    const response = await api.patch(`/client/sections/course/${courseId}/reorder`, { sections });
    return response.data;
};

/**
 * Toggle section visibility
 */
export const toggleSectionVisibility = async (sectionId: string): Promise<ApiResponse<Section>> => {
    const response = await api.patch(`/admin/sections/${sectionId}/visibility`);
    return response.data;
};

/**
 * Get section statistics
 */
export const getSectionStats = async (courseId: string): Promise<ApiResponse<any>> => {
    const response = await api.get(`/admin/sections/course/${courseId}/stats`);
    return response.data;
};

