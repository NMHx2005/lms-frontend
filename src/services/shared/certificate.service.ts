import api from '../api';

export const sharedCertificateService = {
  // Public Verification
  async verifyCertificate(certificateId: string) {
    const response = await api.get(`/verify/${certificateId}`);
    return response.data;
  },

  async verifyByQRCode(qrData: string, includeDetails?: boolean) {
    const response = await api.post('/verify/qr', { qrData, includeDetails });
    return response.data;
  },

  async getVerificationStats() {
    const response = await api.get('/verify/stats/overview');
    return response.data;
  },
};
