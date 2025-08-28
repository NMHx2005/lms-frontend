import api from '../api';

export const clientTeacherPackagesService = {
  // Get Current Subscription
  async getTeacherSubscription() {
    const response = await api.get('/client/teacher-packages/me');
    return response.data;
  },

  // Get Available Packages
  async getAvailablePackages() {
    const response = await api.get('/client/teacher-packages/packages');
    return response.data;
  },
};
