import api from '../api';

export const sharedCommentsService = {
  // Public Comment Operations
  async getComments(params: {
    contentType: string;
    contentId: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: string;
  }) {
    const response = await api.get('/comments', { params });
    return response.data;
  },

  async getCommentTree(contentType: string, contentId: string, params?: {
    maxDepth?: number;
    includeDeleted?: boolean;
  }) {
    const response = await api.get(`/comments/tree/${contentType}/${contentId}`, { params });
    return response.data;
  },

  async getCommentById(commentId: string, params?: {
    includeReplies?: boolean;
    includeAuthor?: boolean;
  }) {
    const response = await api.get(`/comments/${commentId}`, { params });
    return response.data;
  },

  async getCommentStats(params: {
    contentType: string;
    contentId: string;
    period: string;
  }) {
    const response = await api.get('/comments/stats', { params });
    return response.data;
  },

  // Protected Comment Operations
  async createComment(data: {
    content: string;
    contentType: string;
    contentId: string;
    parentId?: string;
    isAnonymous?: boolean;
    metadata?: any;
  }) {
    const response = await api.post('/comments', data);
    return response.data;
  },

  async updateComment(commentId: string, data: {
    content: string;
    editReason?: string;
    metadata?: any;
  }) {
    const response = await api.put(`/comments/${commentId}`, data);
    return response.data;
  },

  async deleteComment(commentId: string, data: {
    reason: string;
    softDelete?: boolean;
  }) {
    const response = await api.delete(`/comments/${commentId}`, { data });
    return response.data;
  },

  // Engagement Actions
  async toggleLikeComment(commentId: string, data: {
    action: 'like' | 'unlike';
    metadata?: any;
  }) {
    const response = await api.post(`/comments/${commentId}/like`, data);
    return response.data;
  },

  async toggleDislikeComment(commentId: string, data: {
    action: 'dislike' | 'remove';
    metadata?: any;
  }) {
    const response = await api.post(`/comments/${commentId}/dislike`, data);
    return response.data;
  },

  async markCommentHelpful(commentId: string, data: {
    helpful: boolean;
    reason?: string;
    metadata?: any;
  }) {
    const response = await api.post(`/comments/${commentId}/helpful`, data);
    return response.data;
  },

  async reportComment(commentId: string, data: {
    reason: string;
    category: string;
    details: string;
    evidence?: any;
    priority?: string;
    anonymous?: boolean;
  }) {
    const response = await api.post(`/comments/${commentId}/report`, data);
    return response.data;
  },
};
