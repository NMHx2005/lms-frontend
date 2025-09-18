import api from '../api';

export interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  maxCourses: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  version: number;
  isActive: boolean;
  durationMonths: number;
}

export interface Subscription {
  _id: string;
  packageId: string | Package;
  status: 'active' | 'cancelled' | 'expired';
  startAt: string;
  endAt: string;
  renewedAt?: string;
  snapshot: {
    name: string;
    maxCourses: number;
    billingCycle: string;
    features: string[];
    version: number;
    price: number;
  };
  daysRemaining?: number;
  createdAt?: string;
}

export interface SubscriptionHistory {
  subscriptions: Subscription[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const teacherPackagesService = {
  // Get available packages for teachers
  async getAvailablePackages(status: string = 'active') {
    const response = await api.get('/client/teacher-packages/available', {
      params: { status }
    });
    return response.data;
  },

  // Get teacher's current subscription
  async getCurrentSubscription() {
    const response = await api.get('/client/teacher-packages/current');
    return response.data;
  },

  // Get all active subscriptions (list)
  async getActiveSubscriptionsList() {
    const response = await api.get('/client/teacher-packages/current/list');
    return response.data;
  },

  // Get teacher's subscription history
  async getSubscriptionHistory(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await api.get('/client/teacher-packages/history', {
      params
    });
    return response.data;
  },

  // Subscribe to a package
  async subscribeToPackage(data: {
    packageId: string;
    paymentMethod?: 'credit_card' | 'bank_transfer' | 'wallet' | 'vnpay';
    couponCode?: string;
  }) {
    const response = await api.post('/client/teacher-packages/subscribe', data);
    return response.data;
  },

  // Renew current subscription
  async renewSubscription(data?: {
    paymentMethod?: 'credit_card' | 'bank_transfer' | 'wallet';
    couponCode?: string;
  }) {
    const response = await api.post('/client/teacher-packages/renew', data || {});
    return response.data;
  },

  // Cancel current subscription
  async cancelSubscription() {
    const response = await api.post('/client/teacher-packages/cancel');
    return response.data;
  },

  // Cancel specific package subscription
  async cancelPackageSubscription(packageId: string) {
    const response = await api.post(`/client/teacher-packages/cancel/${packageId}`);
    return response.data;
  },

  // Get package details
  async getPackageDetails(packageId: string) {
    const response = await api.get(`/client/teacher-packages/packages/${packageId}`);
    return response.data;
  }
};