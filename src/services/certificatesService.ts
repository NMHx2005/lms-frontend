import api from './api';
import { ApiList, CertificateSummary } from './types';

export const certificatesService = {
	list(params?: { page?: number; limit?: number }) {
		return api.get<ApiList<CertificateSummary>>('/client/certificates', { params }).then(r => r.data);
	},
	request(payload: { courseId: string }) {
		return api.post<{ success: boolean }>('/client/certificates/request', payload).then(r => r.data);
	},
	download(certificateId: string) {
		return api.get<{ url: string }>(`/client/certificates/${certificateId}/download`).then(r => r.data);
	},
};


