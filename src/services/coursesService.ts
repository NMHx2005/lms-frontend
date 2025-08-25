import api from './api';
import { ApiList, CourseSummary } from './types';

export const coursesService = {
	enhancedList(params?: Record<string, any>) {
		return api.get<ApiList<CourseSummary>>('/courses/enhanced', { params }).then(r => r.data);
	},
	search(params: { q: string; page?: number; limit?: number; filters?: string }) {
		return api.get<ApiList<CourseSummary>>('/courses/search', { params: params as any }).then(r => r.data);
	},
	statsByCategory() {
		return api.get<Record<string, number>>('/courses/stats/category').then(r => r.data);
	},
	statsByAccessibility() {
		return api.get<Record<string, number>>('/courses/stats/accessibility').then(r => r.data);
	},
	statsByMonetization() {
		return api.get<Record<string, number>>('/courses/stats/monetization').then(r => r.data);
	},
	updateAnalytics(courseId: string, payload: any) {
		return api.put(`/courses/${courseId}/analytics`, payload).then(r => r.data);
	},
	updateSeo(courseId: string, payload: any) {
		return api.put(`/courses/${courseId}/seo`, payload).then(r => r.data);
	},
	updateLocalization(courseId: string, payload: any) {
		return api.put(`/courses/${courseId}/localization`, payload).then(r => r.data);
	},
	updateCompliance(courseId: string, payload: any) {
		return api.put(`/courses/${courseId}/compliance`, payload).then(r => r.data);
	},
	recommendations(payload: any) {
		return api.post<CourseSummary[]>('/courses/recommendations', payload).then(r => r.data);
	},
};


