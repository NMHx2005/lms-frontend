import React, { useState, useEffect, useRef } from 'react';
import { ChatService, ChatMessage, ChatContext } from '../../services/chat.service';
import { toast } from 'react-toastify';
import './ChatBot.css';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PersonIcon from '@mui/icons-material/Person';
import CircleIcon from '@mui/icons-material/Circle';
import RefreshIcon from '@mui/icons-material/Refresh';

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

    const getConnectionStatus = () => {
        switch (connectionStatus) {
            case 'connected':
                return { text: 'Đang hoạt động', color: '#10b981' };
            case 'disconnected':
                return { text: 'Mất kết nối', color: '#ef4444' };
            default:
                return { text: 'Đang kiểm tra...', color: '#f59e0b' };
        }
    };

    const status = getConnectionStatus();

    return (
        <div className={`chatbot-container ${className}`}>
            {/* Chat Toggle Button */}
            <button
                className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
                onClick={toggleChat}
                title={isOpen ? 'Đóng AI Assistant' : 'Mở AI Assistant'}
                aria-label={isOpen ? 'Đóng AI Assistant' : 'Mở AI Assistant'}
            >
                <div className="chatbot-toggle-icon">
                    {isOpen ? <CloseIcon /> : <SmartToyIcon />}
                </div>
                {!isOpen && (
                    <div
                        className="chatbot-toggle-badge"
                        style={{ backgroundColor: status.color }}
                    >
                        <CircleIcon sx={{ fontSize: 8 }} />
                    </div>
                )}
                {!isOpen && (
                    <div className="chatbot-toggle-pulse"></div>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="chatbot-window">
                    {/* Header */}
                    <div className="chatbot-header">
                        <div className="chatbot-header-info">
                            <div className="chatbot-avatar">
                                <SmartToyIcon sx={{ fontSize: 24 }} />
                            </div>
                            <div className="chatbot-header-text">
                                <h3>AI Assistant</h3>
                                <div className="chatbot-status">
                                    <CircleIcon
                                        sx={{ fontSize: 8 }}
                                        style={{ color: status.color }}
                                    />
                                    <span>{status.text}</span>
                                </div>
                            </div>
                        </div>
                        <div className="chatbot-header-actions">
                            <button
                                className="chatbot-action-btn"
                                onClick={checkConnection}
                                title="Kiểm tra kết nối"
                                aria-label="Kiểm tra kết nối"
                            >
                                <RefreshIcon sx={{ fontSize: 18 }} />
                            </button>
                            <button
                                className="chatbot-action-btn"
                                onClick={clearChat}
                                title="Bắt đầu cuộc trò chuyện mới"
                                aria-label="Xóa lịch sử chat"
                            >
                                <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                            </button>
                            <button
                                className="chatbot-action-btn close-btn"
                                onClick={toggleChat}
                                title="Đóng chat"
                                aria-label="Đóng chat"
                            >
                                <CloseIcon sx={{ fontSize: 18 }} />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="chatbot-messages">
                        {messages.length === 0 ? (
                            <div className="chatbot-empty-state">
                                <div className="empty-state-icon">
                                    <SmartToyIcon sx={{ fontSize: 64 }} />
                                </div>
                                <h4>Xin chào! 👋</h4>
                                <p>Tôi là AI Assistant. Tôi có thể giúp bạn:</p>
                                <ul className="empty-state-features">
                                    <li>🔍 Tìm khóa học phù hợp</li>
                                    <li>💡 Tư vấn lộ trình học tập</li>
                                    <li>❓ Trả lời câu hỏi về hệ thống</li>
                                    <li>📚 Gợi ý nội dung học</li>
                                </ul>
                                <p className="empty-state-cta">Hãy đặt câu hỏi để bắt đầu!</p>
                            </div>
                        ) : (
                            <>
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`chatbot-message ${message.role}`}
                                    >
                                        <div className="chatbot-message-avatar">
                                            {message.role === 'user' ? (
                                                <PersonIcon sx={{ fontSize: 18 }} />
                                            ) : (
                                                <SmartToyIcon sx={{ fontSize: 18 }} />
                                            )}
                                        </div>
                                        <div className="chatbot-message-bubble">
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
                                        <div className="chatbot-message-avatar">
                                            <SmartToyIcon sx={{ fontSize: 18 }} />
                                        </div>
                                        <div className="chatbot-message-bubble">
                                            <div className="chatbot-typing">
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
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
                                disabled={isLoading || connectionStatus === 'disconnected'}
                                className="chatbot-input-field"
                                aria-label="Nhập tin nhắn"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!inputMessage.trim() || isLoading || connectionStatus === 'disconnected'}
                                className="chatbot-send-btn"
                                title="Gửi tin nhắn"
                                aria-label="Gửi tin nhắn"
                            >
                                {isLoading ? (
                                    <div className="btn-spinner"></div>
                                ) : (
                                    <SendIcon sx={{ fontSize: 20 }} />
                                )}
                            </button>
                        </div>
                        {connectionStatus === 'disconnected' ? (
                            <div className="chatbot-input-hint error">
                                ⚠️ Mất kết nối. Vui lòng thử lại sau.
                            </div>
                        ) : (
                            <div className="chatbot-input-hint">
                                Nhấn <strong>Enter</strong> để gửi • <strong>Shift + Enter</strong> để xuống dòng
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBot;
