import api from '../api';

export interface Message {
    _id: string;
    senderId: {
        _id: string;
        firstName: string;
        lastName: string;
        avatar?: string;
        roles: string[];
    };
    recipientId: {
        _id: string;
        firstName: string;
        lastName: string;
        avatar?: string;
        roles: string[];
    };
    conversationId: string;
    subject: string;
    content: string;
    isRead: boolean;
    readAt?: Date;
    isArchived: boolean;
    archivedAt?: Date;
    attachments?: Array<{
        url: string;
        name: string;
        type: string;
        size?: number;
    }>;
    parentMessageId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Conversation {
    conversationId: string;
    participant: {
        _id: string;
        firstName: string;
        lastName: string;
        avatar?: string;
    };
    lastMessage: {
        subject: string;
        content: string;
        createdAt: Date;
        isRead: boolean;
    };
    unreadCount: number;
}

export interface SendMessageData {
    recipientId: string;
    subject: string;
    content: string;
    conversationId?: string;
    attachments?: Array<{
        url: string;
        name: string;
        type: string;
        size?: number;
    }>;
}

/**
 * Get user messages
 */
export const getMessages = async (params?: {
    page?: number;
    limit?: number;
    type?: 'inbox' | 'sent' | 'archived';
    conversationId?: string;
    search?: string;
}) => {
    const response = await api.get('/client/messages', { params });
    return response.data;
};

/**
 * Get user conversations
 */
export const getConversations = async (params?: {
    page?: number;
    limit?: number;
}) => {
    const response = await api.get('/client/messages/conversations', { params });
    return response.data;
};

/**
 * Get unread messages count
 */
export const getUnreadCount = async () => {
    const response = await api.get('/client/messages/unread-count');
    return response.data;
};

/**
 * Get message by ID
 */
export const getMessageById = async (id: string) => {
    const response = await api.get(`/client/messages/${id}`);
    return response.data;
};

/**
 * Send new message
 */
export const sendMessage = async (data: SendMessageData) => {
    const response = await api.post('/client/messages', data);
    return response.data;
};

/**
 * Update message (edit draft)
 */
export const updateMessage = async (id: string, data: Partial<SendMessageData>) => {
    const response = await api.put(`/client/messages/${id}`, data);
    return response.data;
};

/**
 * Delete message
 */
export const deleteMessage = async (id: string) => {
    const response = await api.delete(`/client/messages/${id}`);
    return response.data;
};

/**
 * Mark message as read
 */
export const markAsRead = async (id: string) => {
    const response = await api.patch(`/client/messages/${id}/read`);
    return response.data;
};

/**
 * Archive message
 */
export const archiveMessage = async (id: string) => {
    const response = await api.patch(`/client/messages/${id}/archive`);
    return response.data;
};

/**
 * Bulk mark messages as read
 */
export const bulkMarkAsRead = async (messageIds: string[]) => {
    const response = await api.patch('/client/messages/bulk/read', { messageIds });
    return response.data;
};

/**
 * Send typing indicator
 */
export const sendTypingIndicator = async (conversationId: string) => {
    const response = await api.post(`/client/messages/conversations/${conversationId}/typing`);
    return response.data;
};

