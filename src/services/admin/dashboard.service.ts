import api from '../api';

export const adminDashboardService = {
  async getAdminDashboard() {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },
};
