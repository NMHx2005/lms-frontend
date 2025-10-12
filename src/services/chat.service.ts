import api from './api';

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    context?: {
        courseId?: string;
        page?: string;
        metadata?: any;
    };
}

export interface ChatContext {
    currentPage?: string;
    courseId?: string;
    courseInfo?: any;
    availableCourses?: any[];
    userPreferences?: any;
}

export interface SendMessageRequest {
    message: string;
    context?: ChatContext;
}

export interface SendMessageResponse {
    response: string;
    sessionId: string;
}

export interface ChatHistoryResponse {
    _id: string;
    userId: string;
    sessionId: string;
    messages: ChatMessage[];
    context: {
        currentPage?: string;
        courseId?: string;
        userPreferences?: any;
    };
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ChatStats {
    totalMessages: number;
    totalSessions: number;
    lastActivity: Date | null;
}

export class ChatService {
    /**
     * Send message to AI chat
     */
    static async sendMessage(data: SendMessageRequest): Promise<SendMessageResponse> {
        const response = await api.post('/client/chat/send', data);
        return response.data.data;
    }

    /**
     * Get chat history for user
     */
    static async getChatHistory(limit: number = 20): Promise<ChatHistoryResponse[]> {
        const response = await api.get(`/client/chat/history?limit=${limit}`);
        return response.data.data;
    }

    /**
     * Get active chat session
     */
    static async getActiveSession(): Promise<ChatHistoryResponse | null> {
        const response = await api.get('/client/chat/session');
        return response.data.data;
    }

    /**
     * End current chat session
     */
    static async endSession(): Promise<void> {
        await api.delete('/client/chat/session');
    }

    /**
     * Get chat statistics
     */
    static async getChatStats(): Promise<ChatStats> {
        const response = await api.get('/client/chat/stats');
        return response.data.data;
    }

    /**
     * Test AI connection
     */
    static async testConnection(): Promise<{ connected: boolean }> {
        const response = await api.get('/client/chat/test');
        return response.data.data;
    }
}

export default ChatService;
