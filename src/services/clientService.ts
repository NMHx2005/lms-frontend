import api from './api';

export const clientService = {
	dashboard() {
		return api.get('/client/dashboard').then(r => r.data);
	},
	teacherDashboard() {
		return api.get('/client/teacher-dashboard').then(r => r.data);
	},
	teacherPerformance() {
		return api.get('/client/teacher-dashboard/performance').then(r => r.data);
	},
	submitTeacherRating(payload: { teacherId: string; rating: number; comment?: string }) {
		return api.post('/client/teacher-rating/submit', payload).then(r => r.data);
	},
};


