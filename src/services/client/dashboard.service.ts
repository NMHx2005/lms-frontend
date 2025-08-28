import api from '../api';

export const clientDashboardService = {
  async getClientDashboard() {
    const response = await api.get('/client/dashboard');
    return response.data;
  },
};
