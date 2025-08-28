import api from '../api';

export const clientCertificatesService = {
  // Get Certificates
  async getCertificates(params: {
    page?: number;
    limit?: number;
    status?: string;
    courseId?: string;
    issueDate?: string;
  }) {
    const response = await api.get('/client/certificates', { params });
    return response.data;
  },

  async getCertificateById(certificateId: string) {
    const response = await api.get(`/client/certificates/${certificateId}`);
    return response.data;
  },

  // Certificate Actions
  async downloadCertificate(certificateId: string, format: string) {
    const response = await api.get(`/client/certificates/${certificateId}/download`, {
      params: { format }
    });
    return response.data;
  },

  async shareCertificate(certificateId: string, data: {
    platform: string;
    message?: string;
    privacy: string;
  }) {
    const response = await api.post(`/client/certificates/${certificateId}/share`, data);
    return response.data;
  },

  async verifyCertificate(certificateId: string) {
    const response = await api.get(`/client/certificates/${certificateId}/verify`);
    return response.data;
  },

  // Certificate Settings
  async updateCertificateSettings(certificateId: string, data: {
    isPublic: boolean;
    allowSharing: boolean;
    displayName: string;
  }) {
    const response = await api.put(`/client/certificates/${certificateId}/settings`, data);
    return response.data;
  },

  async getCertificateSettings(certificateId: string) {
    const response = await api.get(`/client/certificates/${certificateId}/settings`);
    return response.data;
  },
};
