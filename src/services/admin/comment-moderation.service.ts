import api from '../api';

export const adminCommentModerationService = {
  // Get Moderation Queue
  async getModerationQueue(params: {
    status?: string;
    page?: number;
    limit?: number;
    priority?: string;
    contentType?: string;
    reportCount?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const response = await api.get('/admin/comments/moderation', { params });
    return response.data;
  },

  // Moderate Comment
  async moderateComment(commentId: string, data: {
    action: string;
    reason: string;
    moderatorNotes: string;
    notifyAuthor: boolean;
    publicReason: string;
    escalate: boolean;
    tags: string[];
    reviewedBy: string;
  }) {
    const response = await api.post(`/admin/comments/${commentId}/moderate`, data);
    return response.data;
  },

  // Bulk Moderate Comments
  async bulkModerateComments(data: {
    commentIds: string[];
    action: string;
    reason: string;
    moderatorNotes: string;
    notifyAuthors: boolean;
    applyToSimilar: boolean;
    similarityThreshold: number;
  }) {
    const response = await api.post('/admin/comments/bulk-moderate', data);
    return response.data;
  },

  // Get Moderation Stats
  async getModerationStats(params: {
    period?: string;
    groupBy?: string;
    includeTrends?: boolean;
  }) {
    const response = await api.get('/admin/comments/moderation-stats', { params });
    return response.data;
  },
};
