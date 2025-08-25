import api from './api';
import { ApiList, Comment } from './types';

export const commentsService = {
	list(params?: {
		contentType?: string;
		contentId?: string;
		page?: number;
		limit?: number;
		sortBy?: string;
		sortOrder?: 'asc' | 'desc';
	}) {
		return api.get<ApiList<Comment>>('/comments', { params }).then(r => r.data);
	},
	treeByCourse(courseId: string, params?: { page?: number; limit?: number }) {
		return api.get<ApiList<Comment>>(`/comments/tree/course/${courseId}`, { params }).then(r => r.data);
	},
	getById(commentId: string) {
		return api.get<Comment>(`/comments/${commentId}`).then(r => r.data);
	},
	stats() {
		return api.get<Record<string, number>>('/comments/stats').then(r => r.data);
	},
	create(payload: { contentType: 'course' | 'lesson' | 'discussion' | 'assignment'; contentId: string; content: string; parentId?: string }) {
		return api.post<Comment>('/comments', payload).then(r => r.data);
	},
	update(commentId: string, payload: { text: string }) {
		return api.put<Comment>(`/comments/${commentId}`, payload).then(r => r.data);
	},
	remove(commentId: string) {
		return api.delete<{ success: boolean }>(`/comments/${commentId}`).then(r => r.data);
	},
	like(commentId: string) {
		return api.post<{ success: boolean }>(`/comments/${commentId}/like`).then(r => r.data);
	},
	dislike(commentId: string) {
		return api.post<{ success: boolean }>(`/comments/${commentId}/dislike`).then(r => r.data);
	},
	helpful(commentId: string) {
		return api.post<{ success: boolean }>(`/comments/${commentId}/helpful`).then(r => r.data);
	},
	report(commentId: string, payload: { reason: string }) {
		return api.post<{ success: boolean }>(`/comments/${commentId}/report`, payload).then(r => r.data);
	},
};


