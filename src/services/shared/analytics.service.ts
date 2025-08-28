import api from '../api';

export const sharedAnalyticsService = {
  // Reports
  async getReportsOverview() {
    const response = await api.get('/reports/overview');
    return response.data;
  },

  async createCustomReport(data: {
    name: string;
    type: string;
    filters: {
      startDate: string;
      endDate: string;
      courseIds?: string[];
      instructorIds?: string[];
      categories?: string[];
    };
    metrics: string[];
    format: string;
    schedule?: {
      enabled: boolean;
      frequency: string;
      recipients: string[];
    };
    visualization?: {
      charts: string[];
      includeComparisons: boolean;
      previousPeriod: boolean;
    };
  }) {
    const response = await api.post('/reports/custom', data);
    return response.data;
  },

  // Metrics
  async getSystemMetrics() {
    const response = await api.get('/metrics/system');
    return response.data;
  },
};
