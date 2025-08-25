import api from './api';

export const verifyService = {
	verifyById(certificateId: string) {
		return api.get(`/verify/${certificateId}`).then(r => r.data);
	},
	verifyByQr(payload: { data: string }) {
		return api.post('/verify/qr', payload).then(r => r.data);
	},
	statsOverview() {
		return api.get('/verify/stats/overview').then(r => r.data);
	},
};


