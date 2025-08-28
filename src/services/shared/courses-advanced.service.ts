import api from '../api';

export const sharedCoursesAdvancedService = {
  // Course SEO Management
  async updateCourseSeo(courseId: string, data: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    canonicalUrl?: string;
    ogImage?: string;
    ogTitle?: string;
    ogDescription?: string;
  }) {
    const response = await api.put(`/courses/${courseId}/seo`, data);
    return response.data;
  },

  // Course Localization
  async updateCourseLocalization(courseId: string, data: {
    language: string;
    title?: string;
    description?: string;
    shortDescription?: string;
    objectives?: string[];
    prerequisites?: string[];
    benefits?: string[];
    tags?: string[];
  }) {
    const response = await api.put(`/courses/${courseId}/localization`, data);
    return response.data;
  },

  // Course Compliance
  async updateCourseCompliance(courseId: string, data: {
    ageRestriction?: number;
    contentWarnings?: string[];
    accessibilityFeatures?: string[];
    complianceStandards?: string[];
    certifications?: string[];
    legalRequirements?: string[];
  }) {
    const response = await api.put(`/courses/${courseId}/compliance`, data);
    return response.data;
  },

  // Advanced Course Statistics
  async getCourseStatsByAccessibility() {
    const response = await api.get('/courses/stats/accessibility');
    return response.data;
  },

  async getCourseStatsByMonetization() {
    const response = await api.get('/courses/stats/monetization');
    return response.data;
  },

  // Course Analytics (Advanced)
  async updateCourseAnalytics(courseId: string, analytics: {
    viewCount?: number;
    uniqueViews?: number;
    conversionRate?: number;
    retentionRate?: number;
    avgCompletionTime?: number;
    completionRate?: number;
    dropoffPoints?: Array<{
      lesson: string;
      percentage: number;
      timestamp: string;
    }>;
    popularSections?: Array<{
      sectionId: string;
      viewCount: number;
      avgTimeSpent: number;
    }>;
    studentFeedbackSummary?: {
      positiveKeywords: string[];
      negativeKeywords: string[];
      overallSentiment: string;
    };
    deviceBreakdown?: {
      desktop: number;
      mobile: number;
      tablet: number;
    };
    geographicData?: {
      topCountries: string[];
      timezoneDistribution: Record<string, number>;
    };
  }) {
    const response = await api.put(`/courses/${courseId}/analytics`, analytics);
    return response.data;
  },
};
