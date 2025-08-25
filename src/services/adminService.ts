import api from './api';

export const adminService = {
	dashboard() {
		return api.get('/admin/dashboard').then(r => r.data);
	},
	listUsers(params?: { page?: number; limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc' }) {
		return api.get('/admin/users', { params }).then(r => r.data);
	},
	createUser(payload: any) {
		return api.post('/admin/users', payload).then(r => r.data);
	},
	getUser(userId: string) {
		return api.get(`/admin/users/${userId}`).then(r => r.data);
	},
	updateUser(userId: string, payload: any) {
		return api.put(`/admin/users/${userId}`, payload).then(r => r.data);
	},
	deleteUser(userId: string) {
		return api.delete(`/admin/users/${userId}`).then(r => r.data);
	},
	bulkUpdateUserStatus(payload: { userIds: string[]; status: string }) {
		return api.put('/admin/users/bulk/status', payload).then(r => r.data);
	},
	moderationQueue(params?: { page?: number; limit?: number }) {
		return api.get('/admin/comments/moderation', { params }).then(r => r.data);
	},
	moderateComment(id: string, payload: { action: 'approve' | 'reject' | 'flag'; note?: string }) {
		return api.post(`/admin/comments/${id}/moderate`, payload).then(r => r.data);
	},
	bulkModerate(payload: Array<{ id: string; action: 'approve' | 'reject' | 'flag'; note?: string }>) {
		return api.post('/admin/comments/bulk-moderate', payload).then(r => r.data);
	},
	moderationStats() {
		return api.get('/admin/comments/moderation-stats').then(r => r.data);
	},
};


