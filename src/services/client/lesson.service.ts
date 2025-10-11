import api from '../api';

export interface Lesson {
    _id: string;
    sectionId: string;
    courseId: string;
    title: string;
    description?: string;
    type: 'video' | 'text' | 'file' | 'link' | 'quiz' | 'assignment';
    content?: string;
    videoUrl?: string;
    fileUrl?: string;
    linkUrl?: string;
    duration: number;
    order: number;
    isPublished: boolean;
    isFree?: boolean;
    isRequired?: boolean;
    attachments?: Array<{
        name: string;
        url: string;
        type: string;
        size: number;
    }>;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateLessonData {
    sectionId: string;
    courseId: string;
    title: string;
    description?: string;
    type: 'video' | 'text' | 'file' | 'link' | 'quiz' | 'assignment';
    content?: string;
    videoUrl?: string;
    fileUrl?: string;
    linkUrl?: string;
    duration?: number;
    order?: number;
    isPublished?: boolean;
    isFree?: boolean;
    isRequired?: boolean;
}

export interface UpdateLessonData {
    title?: string;
    description?: string;
    type?: 'video' | 'text' | 'file' | 'link' | 'quiz' | 'assignment';
    content?: string;
    videoUrl?: string;
    fileUrl?: string;
    linkUrl?: string;
    duration?: number;
    order?: number;
    isPublished?: boolean;
    isFree?: boolean;
    isRequired?: boolean;
}

export interface ReorderLessonData {
    lessonId: string;
    newOrder: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

/**
 * Get all lessons for a section
 */
export const getLessonsBySection = async (sectionId: string): Promise<ApiResponse<Lesson[]>> => {
    const response = await api.get(`/client/lessons/section/${sectionId}`);
    return response.data;
};

/**
 * Get all lessons for a course
 */
export const getLessonsByCourse = async (courseId: string): Promise<ApiResponse<Lesson[]>> => {
    const response = await api.get(`/admin/lessons/course/${courseId}`);
    return response.data;
};

/**
 * Get lesson by ID
 */
export const getLessonById = async (lessonId: string): Promise<ApiResponse<Lesson>> => {
    const response = await api.get(`/admin/lessons/${lessonId}`);
    return response.data;
};

/**
 * Create a new lesson
 */
export const createLesson = async (data: CreateLessonData): Promise<ApiResponse<Lesson>> => {
    const response = await api.post('/client/lessons', data);
    return response.data;
};

/**
 * Update lesson
 */
export const updateLesson = async (lessonId: string, data: UpdateLessonData): Promise<ApiResponse<Lesson>> => {
    const response = await api.put(`/client/lessons/${lessonId}`, data);
    return response.data;
};

/**
 * Delete lesson
 */
export const deleteLesson = async (lessonId: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/client/lessons/${lessonId}`);
    return response.data;
};

/**
 * Reorder lessons in a section
 */
export const reorderLessons = async (sectionId: string, lessons: ReorderLessonData[]): Promise<ApiResponse<Lesson[]>> => {
    const response = await api.patch(`/client/lessons/section/${sectionId}/reorder`, { lessons });
    return response.data;
};

/**
 * Toggle lesson preview (free preview)
 */
export const toggleLessonPreview = async (lessonId: string): Promise<ApiResponse<Lesson>> => {
    const response = await api.patch(`/admin/lessons/${lessonId}/preview`);
    return response.data;
};

/**
 * Toggle lesson required status
 */
export const toggleLessonRequired = async (lessonId: string): Promise<ApiResponse<Lesson>> => {
    const response = await api.patch(`/admin/lessons/${lessonId}/required`);
    return response.data;
};

/**
 * Add attachment to lesson
 */
export const addAttachment = async (lessonId: string, attachment: any): Promise<ApiResponse<Lesson>> => {
    const response = await api.post(`/admin/lessons/${lessonId}/attachments`, { attachment });
    return response.data;
};

/**
 * Remove attachment from lesson
 */
export const removeAttachment = async (lessonId: string, attachmentIndex: number): Promise<ApiResponse<Lesson>> => {
    const response = await api.delete(`/admin/lessons/${lessonId}/attachments/${attachmentIndex}`);
    return response.data;
};

/**
 * Move lesson to different section
 */
export const moveLesson = async (lessonId: string, newSectionId: string): Promise<ApiResponse<Lesson>> => {
    const response = await api.patch(`/admin/lessons/${lessonId}/move`, { newSectionId });
    return response.data;
};

/**
 * Get lesson statistics
 */
export const getLessonStats = async (courseId: string): Promise<ApiResponse<any>> => {
    const response = await api.get(`/admin/lessons/course/${courseId}/stats`);
    return response.data;
};

