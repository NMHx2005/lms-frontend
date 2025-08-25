import api from './api';

export const reportsService = {
	overview() {
		return api.get('/reports/overview').then(r => r.data);
	},
	createCustom(payload: any) {
		return api.post('/reports/custom', payload).then(r => r.data);
	},
};


