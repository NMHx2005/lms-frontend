import api from '../api';

export interface LinkMetadata {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  favicon?: string;
  siteName?: string;
  domain?: string;
  type?: string;
  isValid?: boolean;
  isAccessible?: boolean;
  statusCode?: number;
  error?: string;
}

export interface LinkPreviewResponse {
  success: boolean;
  data?: LinkMetadata;
  error?: string;
}

/**
 * Fetch link metadata (Open Graph, Twitter Cards, etc.)
 * This will be handled by backend to avoid CORS issues
 */
export const fetchLinkMetadata = async (url: string): Promise<LinkMetadata> => {
  try {
    const response = await api.post<LinkPreviewResponse>('/client/links/preview', { url });
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    throw new Error(response.data.error || 'Failed to fetch link metadata');
  } catch (error: any) {
    console.error('Error fetching link metadata:', error);
    // Return basic metadata from URL
    const urlObj = new URL(url);
    return {
      url,
      domain: urlObj.hostname,
      isValid: true,
      isAccessible: false,
      error: error.message || 'Failed to fetch metadata',
    };
  }
};

/**
 * Validate URL format
 */
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Check if URL is accessible
 */
export const checkUrlAccessibility = async (url: string): Promise<{ accessible: boolean; statusCode?: number }> => {
  try {
    const response = await api.post<{ success: boolean; accessible: boolean; statusCode?: number }>(
      '/client/links/validate',
      { url }
    );
    
    return {
      accessible: response.data.accessible,
      statusCode: response.data.statusCode,
    };
  } catch (error: any) {
    console.error('Error checking URL accessibility:', error);
    return { accessible: false };
  }
};

/**
 * Track link click
 */
export const trackLinkClick = async (lessonId: string, url: string): Promise<void> => {
  try {
    await api.post('/client/links/track', {
      lessonId,
      url,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error tracking link click:', error);
    // Don't throw - tracking failure shouldn't break the app
  }
};

/**
 * Get link analytics
 */
export const getLinkAnalytics = async (lessonId: string) => {
  try {
    const response = await api.get(`/client/links/analytics/${lessonId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching link analytics:', error);
    throw error;
  }
};
