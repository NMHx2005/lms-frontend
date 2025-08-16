import React, { useState, useEffect } from 'react';
import './SupportCenter.css';

interface SupportTicket {
  _id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting_user' | 'resolved' | 'closed';
  category: 'technical' | 'billing' | 'course' | 'account' | 'general';
  assignedTo?: string;
  assignedToName?: string;
  createdAt: string;
  updatedAt: string;
  lastResponseAt?: string;
  responseCount: number;
  tags: string[];
}

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
  isPublished: boolean;
  viewCount: number;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

const SupportCenter: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<SupportTicket[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tickets' | 'faqs' | 'chat'>('tickets');
  const [ticketFilters, setTicketFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    category: 'all',
    assignedTo: 'all'
  });
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showTicketDetails, setShowTicketDetails] = useState(false);
  const [showCreateFAQ, setShowCreateFAQ] = useState(false);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockTickets: SupportTicket[] = [
        {
          _id: 'ticket-1',
          ticketNumber: 'TKT-2024-001',
          userId: 'user-1',
          userName: 'Nguyễn Văn A',
          userEmail: 'nguyenvana@email.com',
          subject: 'Không thể truy cập khóa học React',
          description: 'Tôi đã mua khóa học React nhưng không thể truy cập được. Hiện tại đang bị lỗi 404 khi click vào khóa học.',
          priority: 'high',
          status: 'open',
          category: 'course',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
          responseCount: 0,
          tags: ['react', 'access', '404']
        },
        {
          _id: 'ticket-2',
          ticketNumber: 'TKT-2024-002',
          userId: 'user-2',
          userName: 'Trần Thị B',
          userEmail: 'tranthib@email.com',
          subject: 'Vấn đề về thanh toán',
          description: 'Tôi đã thanh toán bằng thẻ tín dụng nhưng hệ thống vẫn hiển thị chưa thanh toán. Cần hỗ trợ kiểm tra.',
          priority: 'urgent',
          status: 'in_progress',
          category: 'billing',
          assignedTo: 'admin-1',
          assignedToName: 'Admin User',
          createdAt: '2024-01-15T09:15:00Z',
          updatedAt: '2024-01-15T11:00:00Z',
          lastResponseAt: '2024-01-15T11:00:00Z',
          responseCount: 2,
          tags: ['payment', 'credit-card', 'billing']
        },
        {
          _id: 'ticket-3',
          ticketNumber: 'TKT-2024-003',
          userId: 'user-3',
          userName: 'Lê Văn C',
          userEmail: 'levanc@email.com',
          subject: 'Quên mật khẩu tài khoản',
          description: 'Tôi không thể đăng nhập vào tài khoản vì quên mật khẩu. Đã thử reset password nhưng không nhận được email.',
          priority: 'medium',
          status: 'waiting_user',
          category: 'account',
          assignedTo: 'admin-2',
          assignedToName: 'Support Agent',
          createdAt: '2024-01-14T16:45:00Z',
          updatedAt: '2024-01-15T08:30:00Z',
          lastResponseAt: '2024-01-15T08:30:00Z',
          responseCount: 1,
          tags: ['password', 'login', 'reset']
        },
        {
          _id: 'ticket-4',
          ticketNumber: 'TKT-2024-004',
          userId: 'user-4',
          userName: 'Phạm Thị D',
          userEmail: 'phamthid@email.com',
          subject: 'Video không phát được',
          description: 'Khi xem video bài giảng, video bị giật lag và không thể phát được. Đã thử nhiều trình duyệt khác nhau.',
          priority: 'medium',
          status: 'resolved',
          category: 'technical',
          assignedTo: 'admin-1',
          assignedToName: 'Admin User',
          createdAt: '2024-01-13T14:20:00Z',
          updatedAt: '2024-01-14T15:30:00Z',
          lastResponseAt: '2024-01-14T15:30:00Z',
          responseCount: 3,
          tags: ['video', 'streaming', 'technical']
        }
      ];

      const mockFAQs: FAQ[] = [
        {
          _id: 'faq-1',
          question: 'Làm thế nào để đăng ký tài khoản?',
          answer: 'Bạn có thể đăng ký tài khoản bằng cách click vào nút "Đăng ký" ở góc trên bên phải, sau đó điền đầy đủ thông tin cá nhân và xác nhận email.',
          category: 'account',
          isPublished: true,
          viewCount: 1250,
          helpfulCount: 89,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-10'
        },
        {
          _id: 'faq-2',
          question: 'Có thể học offline không?',
          answer: 'Hiện tại tất cả khóa học đều được thiết kế để học online. Bạn có thể học mọi lúc, mọi nơi chỉ cần có kết nối internet.',
          category: 'course',
          isPublished: true,
          viewCount: 890,
          helpfulCount: 67,
          createdAt: '2024-01-02',
          updatedAt: '2024-01-12'
        },
        {
          _id: 'faq-3',
          question: 'Làm sao để hoàn tiền?',
          answer: 'Bạn có thể yêu cầu hoàn tiền trong vòng 30 ngày kể từ ngày mua khóa học. Liên hệ support team để được hướng dẫn chi tiết.',
          category: 'billing',
          isPublished: true,
          viewCount: 567,
          helpfulCount: 45,
          createdAt: '2024-01-03',
          updatedAt: '2024-01-15'
        }
      ];

      setTickets(mockTickets);
      setFilteredTickets(mockTickets);
      setFaqs(mockFAQs);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Apply ticket filters
    let filtered = tickets;

    if (ticketFilters.search) {
      filtered = filtered.filter(ticket =>
        ticket.subject.toLowerCase().includes(ticketFilters.search.toLowerCase()) ||
        ticket.description.toLowerCase().includes(ticketFilters.search.toLowerCase()) ||
        ticket.userName.toLowerCase().includes(ticketFilters.search.toLowerCase())
      );
    }

    if (ticketFilters.status !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === ticketFilters.status);
    }

    if (ticketFilters.priority !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === ticketFilters.priority);
    }

    if (ticketFilters.category !== 'all') {
      filtered = filtered.filter(ticket => ticket.category === ticketFilters.category);
    }

    if (ticketFilters.assignedTo !== 'all') {
      if (ticketFilters.assignedTo === 'unassigned') {
        filtered = filtered.filter(ticket => !ticket.assignedTo);
      } else {
        filtered = filtered.filter(ticket => ticket.assignedTo === ticketFilters.assignedTo);
      }
    }

    setFilteredTickets(filtered);
  }, [ticketFilters, tickets]);

  const handleTicketFilterChange = (key: string, value: string) => {
    setTicketFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleTicketClick = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setShowTicketDetails(true);
  };

  const handleStatusChange = (ticketId: string, newStatus: string) => {
    setTickets(tickets.map(ticket =>
      ticket._id === ticketId ? { ...ticket, status: newStatus as any } : ticket
    ));
  };

  const handlePriorityChange = (ticketId: string, newPriority: string) => {
    setTickets(tickets.map(ticket =>
      ticket._id === ticketId ? { ...ticket, priority: newPriority as any } : ticket
    ));
  };

  const handleAssignTicket = (ticketId: string, assignTo: string) => {
    setTickets(tickets.map(ticket =>
      ticket._id === ticketId ? { ...ticket, assignedTo: assignTo, assignedToName: 'Admin User' } : ticket
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      case 'urgent': return '#7c2d12';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#3b82f6';
      case 'in_progress': return '#f59e0b';
      case 'waiting_user': return '#8b5cf6';
      case 'resolved': return '#10b981';
      case 'closed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Mới';
      case 'in_progress': return 'Đang xử lý';
      case 'waiting_user': return 'Chờ phản hồi';
      case 'resolved': return 'Đã giải quyết';
      case 'closed': return 'Đã đóng';
      default: return status;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'low': return 'Thấp';
      case 'medium': return 'Trung bình';
      case 'high': return 'Cao';
      case 'urgent': return 'Khẩn cấp';
      default: return priority;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  if (loading) {
    return (
      <div className="support-center">
        <div className="support-center__loading">
          <div className="loading-spinner"></div>
          <p>Đang tải Support Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="support-center">
      <div className="support-center__header">
        <div className="support-center__title">
          <h1>💬 Support Center</h1>
          <p>Quản lý ticket hỗ trợ, FAQ management và live chat monitoring</p>
        </div>
        <div className="support-center__actions">
          <button className="support-center__create-faq-btn" onClick={() => setShowCreateFAQ(true)}>
            + Tạo FAQ mới
          </button>
        </div>
      </div>

      <div className="support-center__stats">
        <div className="support-stat">
          <span className="support-stat__value">{tickets.length}</span>
          <span className="support-stat__label">Tổng ticket</span>
        </div>
        <div className="support-stat">
          <span className="support-stat__value">
            {tickets.filter(t => t.status === 'open').length}
          </span>
          <span className="support-stat__label">Ticket mới</span>
        </div>
        <div className="support-stat">
          <span className="support-stat__value">
            {tickets.filter(t => t.status === 'in_progress').length}
          </span>
          <span className="support-stat__label">Đang xử lý</span>
        </div>
        <div className="support-stat">
          <span className="support-stat__value">
            {tickets.filter(t => t.status === 'resolved').length}
          </span>
          <span className="support-stat__label">Đã giải quyết</span>
        </div>
      </div>

      <div className="support-center__tabs">
        <button
          className={`support-center__tab ${activeTab === 'tickets' ? 'active' : ''}`}
          onClick={() => setActiveTab('tickets')}
        >
          🎫 Tickets ({tickets.length})
        </button>
        <button
          className={`support-center__tab ${activeTab === 'faqs' ? 'active' : ''}`}
          onClick={() => setActiveTab('faqs')}
        >
          ❓ FAQ ({faqs.length})
        </button>
        <button
          className={`support-center__tab ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          💬 Live Chat
        </button>
      </div>

      <div className="support-center__content">
        {activeTab === 'tickets' && (
          <div className="support-center__tickets">
            <div className="ticket-filters">
              <input
                type="text"
                placeholder="Tìm kiếm tickets..."
                value={ticketFilters.search}
                onChange={(e) => handleTicketFilterChange('search', e.target.value)}
                className="ticket-search"
              />
              <select
                value={ticketFilters.status}
                onChange={(e) => handleTicketFilterChange('status', e.target.value)}
                className="ticket-filter"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="open">Mới</option>
                <option value="in_progress">Đang xử lý</option>
                <option value="waiting_user">Chờ phản hồi</option>
                <option value="resolved">Đã giải quyết</option>
                <option value="closed">Đã đóng</option>
              </select>
              <select
                value={ticketFilters.priority}
                onChange={(e) => handleTicketFilterChange('priority', e.target.value)}
                className="ticket-filter"
              >
                <option value="all">Tất cả mức độ</option>
                <option value="low">Thấp</option>
                <option value="medium">Trung bình</option>
                <option value="high">Cao</option>
                <option value="urgent">Khẩn cấp</option>
              </select>
              <select
                value={ticketFilters.category}
                onChange={(e) => handleTicketFilterChange('category', e.target.value)}
                className="ticket-filter"
              >
                <option value="all">Tất cả danh mục</option>
                <option value="technical">Kỹ thuật</option>
                <option value="billing">Thanh toán</option>
                <option value="course">Khóa học</option>
                <option value="account">Tài khoản</option>
                <option value="general">Chung</option>
              </select>
            </div>

            <div className="ticket-list">
              {filteredTickets.map((ticket) => (
                <div key={ticket._id} className="ticket-card" onClick={() => handleTicketClick(ticket)}>
                  <div className="ticket-header">
                    <div className="ticket-number">{ticket.ticketNumber}</div>
                    <div className="ticket-priority" style={{ backgroundColor: getPriorityColor(ticket.priority) }}>
                      {getPriorityLabel(ticket.priority)}
                    </div>
                    <div className="ticket-status" style={{ backgroundColor: getStatusColor(ticket.status) }}>
                      {getStatusLabel(ticket.status)}
                    </div>
                  </div>
                  <div className="ticket-content">
                    <h3 className="ticket-subject">{ticket.subject}</h3>
                    <p className="ticket-description">{ticket.description}</p>
                  </div>
                  <div className="ticket-meta">
                    <div className="ticket-user">
                      <span className="ticket-user-name">{ticket.userName}</span>
                      <span className="ticket-user-email">{ticket.userEmail}</span>
                    </div>
                    <div className="ticket-info">
                      <span className="ticket-category">{ticket.category}</span>
                      <span className="ticket-date">{formatDate(ticket.createdAt)}</span>
                      {ticket.assignedTo && (
                        <span className="ticket-assigned">→ {ticket.assignedToName}</span>
                      )}
                    </div>
                    <div className="ticket-stats">
                      <span className="ticket-responses">{ticket.responseCount} phản hồi</span>
                      {ticket.tags.map((tag, index) => (
                        <span key={index} className="ticket-tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'faqs' && (
          <div className="support-center__faqs">
            <div className="faq-list">
              {faqs.map((faq) => (
                <div key={faq._id} className="faq-item">
                  <div className="faq-header">
                    <h3 className="faq-question">{faq.question}</h3>
                    <div className="faq-meta">
                      <span className="faq-category">{faq.category}</span>
                      <span className="faq-status">{faq.isPublished ? 'Đã xuất bản' : 'Bản nháp'}</span>
                    </div>
                  </div>
                  <div className="faq-content">
                    <p className="faq-answer">{faq.answer}</p>
                  </div>
                  <div className="faq-footer">
                    <div className="faq-stats">
                      <span className="faq-views">👁️ {faq.viewCount} lượt xem</span>
                      <span className="faq-helpful">👍 {faq.helpfulCount} hữu ích</span>
                    </div>
                    <div className="faq-actions">
                      <button className="faq-edit-btn">Sửa</button>
                      <button className="faq-toggle-btn">
                        {faq.isPublished ? 'Ẩn' : 'Xuất bản'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="support-center__chat">
            <div className="chat-placeholder">
              <h3>💬 Live Chat Monitoring</h3>
              <p>Hệ thống live chat sẽ được tích hợp ở đây để theo dõi các cuộc hội thoại real-time.</p>
              <div className="chat-stats">
                <div className="chat-stat">
                  <span className="chat-stat__value">0</span>
                  <span className="chat-stat__label">Cuộc hội thoại đang diễn ra</span>
                </div>
                <div className="chat-stat">
                  <span className="chat-stat__value">0</span>
                  <span className="chat-stat__label">Người dùng đang chờ</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ticket Details Modal */}
      {showTicketDetails && selectedTicket && (
        <div className="modal-overlay" onClick={() => setShowTicketDetails(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3>Chi tiết Ticket: {selectedTicket.ticketNumber}</h3>
              <button
                className="modal__close-btn"
                onClick={() => setShowTicketDetails(false)}
              >
                ×
              </button>
            </div>
            <div className="modal__content">
              <div className="ticket-detail">
                <div className="ticket-detail__section">
                  <h4>Thông tin cơ bản</h4>
                  <div className="ticket-detail__grid">
                    <div className="ticket-detail__item">
                      <label>Tiêu đề:</label>
                      <span>{selectedTicket.subject}</span>
                    </div>
                    <div className="ticket-detail__item">
                      <label>Mức độ:</label>
                      <span
                        className="ticket-detail__priority"
                        style={{ backgroundColor: getPriorityColor(selectedTicket.priority) }}
                      >
                        {getPriorityLabel(selectedTicket.priority)}
                      </span>
                    </div>
                    <div className="ticket-detail__item">
                      <label>Trạng thái:</label>
                      <span
                        className="ticket-detail__status"
                        style={{ backgroundColor: getStatusColor(selectedTicket.status) }}
                      >
                        {getStatusLabel(selectedTicket.status)}
                      </span>
                    </div>
                    <div className="ticket-detail__item">
                      <label>Danh mục:</label>
                      <span>{selectedTicket.category}</span>
                    </div>
                  </div>
                </div>

                <div className="ticket-detail__section">
                  <h4>Mô tả vấn đề</h4>
                  <p className="ticket-detail__description">{selectedTicket.description}</p>
                </div>

                <div className="ticket-detail__section">
                  <h4>Thông tin người dùng</h4>
                  <div className="ticket-detail__grid">
                    <div className="ticket-detail__item">
                      <label>Tên:</label>
                      <span>{selectedTicket.userName}</span>
                    </div>
                    <div className="ticket-detail__item">
                      <label>Email:</label>
                      <span>{selectedTicket.userEmail}</span>
                    </div>
                    <div className="ticket-detail__item">
                      <label>Ngày tạo:</label>
                      <span>{formatDate(selectedTicket.createdAt)}</span>
                    </div>
                    <div className="ticket-detail__item">
                      <label>Cập nhật lần cuối:</label>
                      <span>{formatDate(selectedTicket.updatedAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="ticket-detail__section">
                  <h4>Thao tác</h4>
                  <div className="ticket-detail__actions">
                    <select
                      value={selectedTicket.status}
                      onChange={(e) => handleStatusChange(selectedTicket._id, e.target.value)}
                      className="ticket-detail__select"
                    >
                      <option value="open">Mới</option>
                      <option value="in_progress">Đang xử lý</option>
                      <option value="waiting_user">Chờ phản hồi</option>
                      <option value="resolved">Đã giải quyết</option>
                      <option value="closed">Đã đóng</option>
                    </select>
                    <select
                      value={selectedTicket.priority}
                      onChange={(e) => handlePriorityChange(selectedTicket._id, e.target.value)}
                      className="ticket-detail__select"
                    >
                      <option value="low">Thấp</option>
                      <option value="medium">Trung bình</option>
                      <option value="high">Cao</option>
                      <option value="urgent">Khẩn cấp</option>
                    </select>
                    <select
                      value={selectedTicket.assignedTo || 'unassigned'}
                      onChange={(e) => handleAssignTicket(selectedTicket._id, e.target.value)}
                      className="ticket-detail__select"
                    >
                      <option value="unassigned">Chưa phân công</option>
                      <option value="admin-1">Admin User</option>
                      <option value="admin-2">Support Agent</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create FAQ Modal */}
      {showCreateFAQ && (
        <div className="modal-overlay" onClick={() => setShowCreateFAQ(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Tạo FAQ mới</h3>
            <p>Modal tạo FAQ sẽ được implement ở đây...</p>
            <button onClick={() => setShowCreateFAQ(false)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportCenter;
