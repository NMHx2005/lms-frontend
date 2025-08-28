import api from '../api';

export const sharedCoursesService = {
  // Enhanced Course Operations
  async getCoursesEnhanced(params: {
    category?: string;
    subcategory?: string;
    difficulty?: string;
    targetAudience?: string;
    ageGroup?: string;
    'accessibility.subtitles'?: boolean;
    'technicalRequirements.bandwidth'?: string;
    learningPath?: string;
    'gamification.enabled'?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const response = await api.get('/courses/enhanced', { params });
    return response.data;
  },

  async searchCourses(params: {
    q: string;
    'filters[difficulty]'?: string;
    'filters[category]'?: string;
    'filters[duration][min]'?: number;
    'filters[duration][max]'?: number;
    'filters[price][min]'?: number;
    'filters[price][max]'?: number;
    'filters[rating][min]'?: number;
    highlightMatches?: boolean;
    includeSnippets?: boolean;
    page?: number;
    limit?: number;
  }) {
    const response = await api.get('/courses/search', { params });
    return response.data;
  },

  async getCourseStatsByCategory(params: {
    includeSubcategories?: boolean;
    period?: string;
    groupBy?: string;
  }) {
    const response = await api.get('/courses/stats/category', { params });
    return response.data;
  },

  // Course Analytics (Protected)
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
    const response = await api.put(`/courses/${courseId}/analytics`, { analytics });
    return response.data;
  },

  async getCourseRecommendations(preferences: {
    categories?: string[];
    subcategories?: string[];
    difficulty?: string;
    maxDuration?: number;
    minDuration?: number;
    priceRange?: {
      min: number;
      max: number;
    };
    learningStyle?: string;
    timeAvailability?: {
      hoursPerWeek: number;
      preferredSchedule: string;
      timezone: string;
    };
    accessibilityNeeds?: {
      subtitles: boolean;
      slowPaced: boolean;
      screenReaderCompatible: boolean;
    };
    devicePreference?: string;
    languagePreference?: string;
    goals?: string[];
    excludeCompleted?: boolean;
    excludeEnrolled?: boolean;
    includePrerequisites?: boolean;
    recommendationContext?: {
      currentCourse?: string;
      completionPercentage?: number;
      strugglingTopics?: string[];
      strongTopics?: string[];
    };
    limit?: number;
    includeSimilarUsers?: boolean;
    includeReasoningExplanation?: boolean;
  }) {
    const response = await api.post('/courses/recommendations', preferences);
    return response.data;
  },
};
