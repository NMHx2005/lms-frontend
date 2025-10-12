import React, { useState, useEffect, useRef } from 'react';
import { ChatService, ChatMessage, ChatContext } from '../../services/chat.service';
import { toast } from 'react-toastify';
import './ChatBot.css';

interface ChatBotProps {
    context?: ChatContext;
    className?: string;
}

const ChatBot: React.FC<ChatBotProps> = ({ context, className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [, setSessionId] = useState<string | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Check AI connection on mount
    useEffect(() => {
        checkConnection();
    }, []);

    // Load chat history when opening
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            loadChatHistory();
        }
    }, [isOpen]);

    // Focus input when opening
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const checkConnection = async () => {
        try {
            const result = await ChatService.testConnection();
            setConnectionStatus(result.connected ? 'connected' : 'disconnected');
        } catch (error) {
            console.error('Connection test failed:', error);
            setConnectionStatus('disconnected');
        }
    };

    const loadChatHistory = async () => {
        try {
            const history = await ChatService.getChatHistory(20);
            if (history.length > 0) {
                // Get the most recent active session
                const activeSession = history.find(session => session.isActive) || history[0];
                setMessages(activeSession.messages || []);
                setSessionId(activeSession.sessionId);
            }
        } catch (error) {
            console.error('Failed to load chat history:', error);
            // Add welcome message if no history
            if (messages.length === 0) {
                setMessages([{
                    role: 'assistant',
                    content: 'Xin chào! Tôi là AI Assistant, có thể giúp bạn tìm khóa học phù hợp. Bạn muốn học gì hôm nay?',
                    timestamp: new Date()
                }]);
            }
        }
    };

    const sendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            role: 'user',
            content: inputMessage.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);
        setIsTyping(true);

        try {
            const response = await ChatService.sendMessage({
                message: userMessage.content,
                context: context
            });

            const aiMessage: ChatMessage = {
                role: 'assistant',
                content: response.response,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMessage]);
            setSessionId(response.sessionId);
        } catch (error: any) {
            console.error('Failed to send message:', error);
            toast.error('Không thể gửi tin nhắn. Vui lòng thử lại sau.');

            const errorMessage: ChatMessage = {
                role: 'assistant',
                content: 'Xin lỗi, tôi không thể trả lời lúc này. Vui lòng thử lại sau.',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const clearChat = async () => {
        try {
            await ChatService.endSession();
            setMessages([{
                role: 'assistant',
                content: 'Cuộc trò chuyện đã được bắt đầu lại. Tôi có thể giúp gì cho bạn?',
                timestamp: new Date()
            }]);
            setSessionId(null);
            toast.success('Đã bắt đầu cuộc trò chuyện mới');
        } catch (error) {
            console.error('Failed to clear chat:', error);
            toast.error('Không thể bắt đầu cuộc trò chuyện mới');
        }
    };

    const getConnectionIcon = () => {
        switch (connectionStatus) {
            case 'connected':
                return '🟢';
            case 'disconnected':
                return '🔴';
            default:
                return '🟡';
        }
    };

    return (
        <div className={`chatbot-container ${className}`}>
            {/* Chat Toggle Button */}
            <button
                className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
                onClick={toggleChat}
                title="Mở AI Assistant"
            >
                <div className="chatbot-toggle-icon">
                    {isOpen ? '✕' : '🤖'}
                </div>
                {!isOpen && (
                    <div className="chatbot-toggle-badge">
                        {getConnectionIcon()}
                    </div>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="chatbot-window">
                    {/* Header */}
                    <div className="chatbot-header">
                        <div className="chatbot-header-info">
                            <div className="chatbot-avatar">🤖</div>
                            <div className="chatbot-header-text">
                                <h3>AI Assistant</h3>
                                <span className="chatbot-status">
                                    {connectionStatus === 'connected' ? 'Đang hoạt động' :
                                        connectionStatus === 'disconnected' ? 'Mất kết nối' : 'Đang kiểm tra...'}
                                </span>
                            </div>
                        </div>
                        <div className="chatbot-header-actions">
                            <button
                                className="chatbot-action-btn"
                                onClick={clearChat}
                                title="Bắt đầu cuộc trò chuyện mới"
                            >
                                🗑️
                            </button>
                            <button
                                className="chatbot-action-btn"
                                onClick={toggleChat}
                                title="Đóng chat"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="chatbot-messages">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`chatbot-message ${message.role}`}
                            >
                                <div className="chatbot-message-avatar">
                                    {message.role === 'user' ? '👤' : '🤖'}
                                </div>
                                <div className="chatbot-message-content">
                                    <div className="chatbot-message-text">
                                        {message.content}
                                    </div>
                                    <div className="chatbot-message-time">
                                        {new Date(message.timestamp).toLocaleTimeString('vi-VN', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="chatbot-message assistant">
                                <div className="chatbot-message-avatar">🤖</div>
                                <div className="chatbot-message-content">
                                    <div className="chatbot-typing">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="chatbot-input">
                        <div className="chatbot-input-container">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Nhập câu hỏi của bạn..."
                                disabled={isLoading}
                                className="chatbot-input-field"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!inputMessage.trim() || isLoading}
                                className="chatbot-send-btn"
                            >
                                {isLoading ? '⏳' : '📤'}
                            </button>
                        </div>
                        <div className="chatbot-input-hint">
                            Nhấn Enter để gửi, Shift + Enter để xuống dòng
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBot;
