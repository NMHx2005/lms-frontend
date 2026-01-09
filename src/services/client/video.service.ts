import api from '../api';

export interface VideoFile {
    _id: string;
    lessonId: string;
    originalFileName: string;
    fileUrl: string; // Cloudinary secureUrl
    fileSize: number;
    duration: number;
    formats?: Array<{
        quality: '360p' | '480p' | '720p' | '1080p' | 'original';
        url: string;
        fileSize: number;
        width?: number;
        height?: number;
    }>;
    thumbnails?: string[];
    processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
    processingError?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface VideoProgress {
    _id: string;
    lessonId: string;
    studentId: string;
    currentTime: number;
    progress: number;
    watchTime: number;
    completed: boolean;
    lastWatchedAt: string;
}

export interface VideoNote {
    _id: string;
    lessonId: string;
    studentId: string;
    timestamp: number;
    content: string;
    tags?: string[];
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface VideoSubtitle {
    _id: string;
    lessonId: string;
    language: string;
    fileUrl: string;
    fileName: string;
    fileSize: number;
}

export interface WatchEvent {
    timestamp: number;
    action: 'play' | 'pause' | 'seek' | 'complete' | 'exit';
    timeSpent?: number;
}

export const videoService = {
    // ==================== VIDEO UPLOAD ====================
    async uploadVideo(lessonId: string, file: File, onProgress?: (progress: number) => void) {
        const formData = new FormData();
        formData.append('video', file);

        const response = await api.post(`/client/teacher/lessons/${lessonId}/video/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(percentCompleted);
                }
            },
        });
        return response.data;
    },

    async getVideoFile(lessonId: string) {
        const response = await api.get(`/client/lessons/${lessonId}/video`);
        return response.data;
    },

    async getVideoStatus(lessonId: string) {
        const response = await api.get(`/client/teacher/lessons/${lessonId}/video/status`);
        return response.data;
    },

    async deleteVideo(lessonId: string) {
        const response = await api.delete(`/client/teacher/lessons/${lessonId}/video`);
        return response.data;
    },

    // ==================== VIDEO PROGRESS ====================
    async saveProgress(lessonId: string, data: {
        currentTime: number;
        progress?: number;
        watchTime?: number;
    }) {
        const response = await api.post(`/client/lessons/${lessonId}/progress`, data);
        return response.data;
    },

    async getProgress(lessonId: string) {
        const response = await api.get(`/client/lessons/${lessonId}/progress`);
        return response.data;
    },

    async getCourseProgress(courseId: string) {
        const response = await api.get(`/client/courses/${courseId}/progress`);
        return response.data;
    },

    async markCompleted(lessonId: string) {
        const response = await api.post(`/client/lessons/${lessonId}/complete`);
        return response.data;
    },

    // ==================== VIDEO ANALYTICS ====================
    async recordEvent(lessonId: string, event: WatchEvent) {
        const response = await api.post(`/client/lessons/${lessonId}/analytics/event`, event);
        return response.data;
    },

    async getStudentAnalytics(lessonId: string) {
        const response = await api.get(`/client/lessons/${lessonId}/analytics`);
        return response.data;
    },

    async getLessonAnalytics(lessonId: string) {
        const response = await api.get(`/client/teacher/lessons/${lessonId}/analytics`);
        return response.data;
    },

    async getCourseAnalytics(courseId: string) {
        const response = await api.get(`/client/teacher/courses/${courseId}/video-analytics`);
        return response.data;
    },

    // ==================== VIDEO NOTES ====================
    async createNote(lessonId: string, data: {
        timestamp: number;
        content: string;
        tags?: string[];
        isPublic?: boolean;
    }) {
        const response = await api.post(`/client/lessons/${lessonId}/notes`, data);
        return response.data;
    },

    async getNotes(lessonId: string) {
        const response = await api.get(`/client/lessons/${lessonId}/notes`);
        return response.data;
    },

    async getPublicNotes(lessonId: string) {
        const response = await api.get(`/client/lessons/${lessonId}/notes/public`);
        return response.data;
    },

    async updateNote(lessonId: string, noteId: string, data: {
        content?: string;
        tags?: string[];
        isPublic?: boolean;
    }) {
        const response = await api.put(`/client/lessons/${lessonId}/notes/${noteId}`, data);
        return response.data;
    },

    async deleteNote(lessonId: string, noteId: string) {
        const response = await api.delete(`/client/lessons/${lessonId}/notes/${noteId}`);
        return response.data;
    },

    async searchNotes(lessonId: string, query: string) {
        const response = await api.get(`/client/lessons/${lessonId}/notes/search`, {
            params: { q: query },
        });
        return response.data;
    },

    async exportNotes(lessonId: string) {
        const response = await api.get(`/client/lessons/${lessonId}/notes/export`, {
            responseType: 'blob',
        });
        return response.data;
    },

    // ==================== SUBTITLES ====================
    async uploadSubtitle(lessonId: string, language: string, file: File) {
        const formData = new FormData();
        formData.append('subtitle', file);
        formData.append('language', language);

        const response = await api.post(`/client/teacher/lessons/${lessonId}/subtitle`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    async getSubtitles(lessonId: string) {
        const response = await api.get(`/client/lessons/${lessonId}/subtitles`);
        return response.data;
    },

    async getSubtitleByLanguage(lessonId: string, language: string) {
        const response = await api.get(`/client/lessons/${lessonId}/subtitles/${language}`);
        return response.data;
    },

    async deleteSubtitle(lessonId: string, subtitleId: string) {
        const response = await api.delete(`/client/teacher/lessons/${lessonId}/subtitle/${subtitleId}`);
        return response.data;
    },

    async updateSubtitle(lessonId: string, subtitleId: string, language: string) {
        const response = await api.put(`/client/teacher/lessons/${lessonId}/subtitle/${subtitleId}`, {
            language,
        });
        return response.data;
    },
};
