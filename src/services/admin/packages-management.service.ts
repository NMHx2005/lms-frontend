import api from '../api';

export const adminPackagesManagementService = {
  // Package Management
  async listPackages() {
    const response = await api.get('/admin/packages-management/packages');
    return response.data;
  },

  async createPackage(data: {
    name: string;
    description: string;
    maxCourses: number;
    price: number;
    billingCycle: string;
    features: string[];
    isActive: boolean;
  }) {
    const response = await api.post('/admin/packages-management/packages', data);
    return response.data;
  },

  async getPackageById(packageId: string) {
    const response = await api.get(`/admin/packages-management/packages/${packageId}`);
    return response.data;
  },

  async updatePackage(packageId: string, data: {
    name?: string;
    maxCourses?: number;
    price?: number;
  }) {
    const response = await api.put(`/admin/packages-management/packages/${packageId}`, data);
    return response.data;
  },

  async deletePackage(packageId: string) {
    const response = await api.delete(`/admin/packages-management/packages/${packageId}`);
    return response.data;
  },

  // Subscription Management
  async listSubscriptions(params?: {
    teacherId?: string;
  }) {
    const response = await api.get('/admin/packages-management/subscriptions', { params });
    return response.data;
  },

  async createSubscriptionForTeacher(data: {
    teacherId: string;
    packageId: string;
  }) {
    const response = await api.post('/admin/packages-management/subscriptions', data);
    return response.data;
  },

  async updateSubscription(subscriptionId: string, data: {
    action: string;
  }) {
    const response = await api.put(`/admin/packages-management/subscriptions/${subscriptionId}`, data);
    return response.data;
  },
};
