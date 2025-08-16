import React, { useState, useEffect } from 'react';
import './Announcements.css';

interface Announcement {
  _id: string;
  title: string;
  content: string;
  type: 'system' | 'email' | 'push';
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  targetAudience: 'all' | 'students' | 'teachers' | 'admins' | 'specific';
  scheduledAt?: string;
  publishedAt?: string;
  expiresAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  readCount: number;
  clickCount: number;
  tags: string[];
  attachments?: string[];
}

const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'draft' | 'scheduled' | 'published' | 'archived'>('all');
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    priority: '',
    targetAudience: '',
    status: ''
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
    console.log(selectedAnnouncement)
  // Mock data
  useEffect(() => {
    const mockAnnouncements: Announcement[] = [
      {
        _id: '1',
        title: 'Hệ thống LMS sẽ bảo trì vào ngày 15/12',
        content: 'Hệ thống sẽ tạm ngưng hoạt động từ 02:00 - 06:00 để bảo trì và nâng cấp. Vui lòng lưu ý thời gian này.',
        type: 'system',
        status: 'published',
        priority: 'high',
        targetAudience: 'all',
        publishedAt: '2024-12-10T08:00:00Z',
        createdBy: 'Admin System',
        createdAt: '2024-12-10T08:00:00Z',
        updatedAt: '2024-12-10T08:00:00Z',
        readCount: 1247,
        clickCount: 89,
        tags: ['maintenance', 'system-update']
      },
      {
        _id: '2',
        title: 'Khóa học mới: Lập trình Python cơ bản',
        content: 'Chúng tôi vui mừng giới thiệu khóa học lập trình Python cơ bản dành cho người mới bắt đầu. Khóa học sẽ khai giảng vào ngày 20/12.',
        type: 'email',
        status: 'scheduled',
        priority: 'medium',
        targetAudience: 'students',
        scheduledAt: '2024-12-18T09:00:00Z',
        createdBy: 'Marketing Team',
        createdAt: '2024-12-10T10:00:00Z',
        updatedAt: '2024-12-10T10:00:00Z',
        readCount: 0,
        clickCount: 0,
        tags: ['new-course', 'python', 'programming']
      },
      {
        _id: '3',
        title: 'Cập nhật chính sách hoàn tiền',
        content: 'Chúng tôi đã cập nhật chính sách hoàn tiền để đảm bảo quyền lợi tốt nhất cho học viên. Xem chi tiết tại đây.',
        type: 'push',
        status: 'published',
        priority: 'medium',
        targetAudience: 'all',
        publishedAt: '2024-12-09T14:00:00Z',
        createdBy: 'Policy Team',
        createdAt: '2024-12-09T14:00:00Z',
        updatedAt: '2024-12-09T14:00:00Z',
        readCount: 892,
        clickCount: 156,
        tags: ['policy-update', 'refund']
      },
      {
        _id: '4',
        title: 'Thông báo về kỳ thi cuối khóa',
        content: 'Kỳ thi cuối khóa sẽ diễn ra từ ngày 25-30/12. Học viên vui lòng chuẩn bị và kiểm tra lịch thi.',
        type: 'email',
        status: 'draft',
        priority: 'high',
        targetAudience: 'students',
        createdBy: 'Academic Team',
        createdAt: '2024-12-10T11:00:00Z',
        updatedAt: '2024-12-10T11:00:00Z',
        readCount: 0,
        clickCount: 0,
        tags: ['exam', 'final-term']
      },
      {
        _id: '5',
        title: 'Chúc mừng năm mới 2025',
        content: 'Chúc mừng năm mới 2025! Chúng tôi chúc tất cả học viên và giảng viên một năm mới tràn đầy sức khỏe và thành công.',
        type: 'system',
        status: 'scheduled',
        priority: 'low',
        targetAudience: 'all',
        scheduledAt: '2024-12-31T00:00:00Z',
        createdBy: 'Admin System',
        createdAt: '2024-12-10T12:00:00Z',
        updatedAt: '2024-12-10T12:00:00Z',
        readCount: 0,
        clickCount: 0,
        tags: ['new-year', 'celebration']
      }
    ];

    setAnnouncements(mockAnnouncements);
    setFilteredAnnouncements(mockAnnouncements);
    setLoading(false);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = announcements;

    // Tab filter
    if (activeTab !== 'all') {
      filtered = filtered.filter(item => item.status === activeTab);
    }

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.content.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Type filter
    if (filters.type) {
      filtered = filtered.filter(item => item.type === filters.type);
    }

    // Priority filter
    if (filters.priority) {
      filtered = filtered.filter(item => item.priority === filters.priority);
    }

    // Target audience filter
    if (filters.targetAudience) {
      filtered = filtered.filter(item => item.targetAudience === filters.targetAudience);
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    setFilteredAnnouncements(filtered);
  }, [announcements, activeTab, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleCreateAnnouncement = () => {
    setShowCreateModal(true);
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setShowEditModal(true);
  };

  const handleDeleteAnnouncement = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thông báo này?')) {
      setAnnouncements(prev => prev.filter(item => item._id !== id));
    }
  };

  const handleStatusChange = (id: string, newStatus: Announcement['status']) => {
    setAnnouncements(prev => prev.map(item =>
      item._id === id ? { ...item, status: newStatus } : item
    ));
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: 'Bản nháp',
      scheduled: 'Đã lên lịch',
      published: 'Đã xuất bản',
      archived: 'Đã lưu trữ'
    };
    return labels[status] || status;
  };

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      low: 'Thấp',
      medium: 'Trung bình',
      high: 'Cao',
      urgent: 'Khẩn cấp'
    };
    return labels[priority] || priority;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      system: 'Hệ thống',
      email: 'Email',
      push: 'Push notification'
    };
    return labels[type] || type;
  };

  const getTargetAudienceLabel = (audience: string) => {
    const labels: Record<string, string> = {
      all: 'Tất cả',
      students: 'Học viên',
      teachers: 'Giảng viên',
      admins: 'Quản trị viên',
      specific: 'Cụ thể'
    };
    return labels[audience] || audience;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="announcements loading">
        <div className="loading-spinner"></div>
        <p>Đang tải thông báo...</p>
      </div>
    );
  }

  return (
    <div className="announcements">
      <div className="header">
        <div className='header__title'>
          <h1>Quản lý thông báo</h1>
          <p>Quản lý thông báo hệ thống, email campaigns và push notifications</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreateAnnouncement}>
          <span>📢</span>
          Tạo thông báo mới
        </button>
      </div>

      <div className="stats">
        <div className="stats-card">
          <div className="value">{announcements.length}</div>
          <div className="label">Tổng thông báo</div>
        </div>
        <div className="stats-card">
          <div className="value">{announcements.filter(a => a.status === 'published').length}</div>
          <div className="label">Đã xuất bản</div>
        </div>
        <div className="stats-card">
          <div className="value">{announcements.filter(a => a.status === 'scheduled').length}</div>
          <div className="label">Đã lên lịch</div>
        </div>
        <div className="stats-card">
          <div className="value">{announcements.filter(a => a.status === 'draft').length}</div>
          <div className="label">Bản nháp</div>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          Tất cả ({announcements.length})
        </button>
        <button
          className={`tab ${activeTab === 'draft' ? 'active' : ''}`}
          onClick={() => setActiveTab('draft')}
        >
          Bản nháp ({announcements.filter(a => a.status === 'draft').length})
        </button>
        <button
          className={`tab ${activeTab === 'scheduled' ? 'active' : ''}`}
          onClick={() => setActiveTab('scheduled')}
        >
          Đã lên lịch ({announcements.filter(a => a.status === 'scheduled').length})
        </button>
        <button
          className={`tab ${activeTab === 'published' ? 'active' : ''}`}
          onClick={() => setActiveTab('published')}
        >
          Đã xuất bản ({announcements.filter(a => a.status === 'published').length})
        </button>
        <button
          className={`tab ${activeTab === 'archived' ? 'active' : ''}`}
          onClick={() => setActiveTab('archived')}
        >
          Đã lưu trữ ({announcements.filter(a => a.status === 'archived').length})
        </button>
      </div>

      <div className="controls">
        <div className="filters">
          <div className="filter-group">
            <input
              type="text"
              placeholder="Tìm kiếm thông báo..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          <div className="filter-group">
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">Tất cả loại</option>
              <option value="system">Hệ thống</option>
              <option value="email">Email</option>
              <option value="push">Push notification</option>
            </select>
          </div>
          <div className="filter-group">
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
            >
              <option value="">Tất cả mức độ</option>
              <option value="low">Thấp</option>
              <option value="medium">Trung bình</option>
              <option value="high">Cao</option>
              <option value="urgent">Khẩn cấp</option>
            </select>
          </div>
          <div className="filter-group">
            <select
              value={filters.targetAudience}
              onChange={(e) => handleFilterChange('targetAudience', e.target.value)}
            >
              <option value="">Tất cả đối tượng</option>
              <option value="all">Tất cả</option>
              <option value="students">Học viên</option>
              <option value="teachers">Giảng viên</option>
              <option value="admins">Quản trị viên</option>
              <option value="specific">Cụ thể</option>
            </select>
          </div>
        </div>

        <div className="view-controls">
          <button
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            📋 Danh sách
          </button>
          <button
            className={`view-btn ${viewMode === 'calendar' ? 'active' : ''}`}
            onClick={() => setViewMode('calendar')}
          >
            📅 Lịch
          </button>
        </div>
      </div>

      {viewMode === 'list' && (
        <div className="announcements-list">
          {filteredAnnouncements.length === 0 ? (
            <div className="empty-state">
              <h3>Không có thông báo nào</h3>
              <p>Không tìm thấy thông báo nào phù hợp với bộ lọc hiện tại.</p>
            </div>
          ) : (
            filteredAnnouncements.map(announcement => (
              <div key={announcement._id} className="announcement-card">
                <div className="announcement-header">
                  <div className="announcement-meta">
                    <span className={`priority priority-${announcement.priority}`}>
                      {getPriorityLabel(announcement.priority)}
                    </span>
                    <span className={`status status-${announcement.status}`}>
                      {getStatusLabel(announcement.status)}
                    </span>
                    <span className="type">{getTypeLabel(announcement.type)}</span>
                  </div>
                  <div className="announcement-actions">
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleEditAnnouncement(announcement)}
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteAnnouncement(announcement._id)}
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                </div>

                <div className="announcement-content">
                  <h3 className="announcement-title">{announcement.title}</h3>
                  <p className="announcement-description">{announcement.content}</p>
                  
                  <div className="announcement-details">
                    <div className="detail-item">
                      <span className="label">Đối tượng:</span>
                      <span className="value">{getTargetAudienceLabel(announcement.targetAudience)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Người tạo:</span>
                      <span className="value">{announcement.createdBy}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Ngày tạo:</span>
                      <span className="value">{formatDate(announcement.createdAt)}</span>
                    </div>
                    {announcement.scheduledAt && (
                      <div className="detail-item">
                        <span className="label">Lên lịch:</span>
                        <span className="value">{formatDate(announcement.scheduledAt)}</span>
                      </div>
                    )}
                    {announcement.publishedAt && (
                      <div className="detail-item">
                        <span className="label">Xuất bản:</span>
                        <span className="value">{formatDate(announcement.publishedAt)}</span>
                      </div>
                    )}
                  </div>

                  <div className="announcement-stats">
                    <div className="stat">
                      <span className="stat-label">📖 Đã đọc:</span>
                      <span className="stat-value">{announcement.readCount}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">🖱️ Đã click:</span>
                      <span className="stat-value">{announcement.clickCount}</span>
                    </div>
                  </div>

                  {announcement.tags.length > 0 && (
                    <div className="announcement-tags">
                      {announcement.tags.map(tag => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                  )}

                  <div className="announcement-actions-bottom">
                    {announcement.status === 'draft' && (
                      <button
                        className="btn btn-success"
                        onClick={() => handleStatusChange(announcement._id, 'scheduled')}
                      >
                        📅 Lên lịch
                      </button>
                    )}
                    {announcement.status === 'scheduled' && (
                      <button
                        className="btn btn-success"
                        onClick={() => handleStatusChange(announcement._id, 'published')}
                      >
                        🚀 Xuất bản ngay
                      </button>
                    )}
                    {announcement.status === 'published' && (
                      <button
                        className="btn btn-warning"
                        onClick={() => handleStatusChange(announcement._id, 'archived')}
                      >
                        📦 Lưu trữ
                      </button>
                    )}
                    {announcement.status === 'archived' && (
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleStatusChange(announcement._id, 'draft')}
                      >
                        📝 Khôi phục
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {viewMode === 'calendar' && (
        <div className="calendar-view">
          <div className="calendar-placeholder">
            <h3>📅 Chế độ xem lịch</h3>
            <p>Chức năng xem lịch thông báo sẽ được phát triển trong phiên bản tiếp theo.</p>
            <p>Hiện tại vui lòng sử dụng chế độ xem danh sách để quản lý thông báo.</p>
          </div>
        </div>
      )}

      {/* Create/Edit Modal Placeholder */}
      {(showCreateModal || showEditModal) && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">
                {showCreateModal ? 'Tạo thông báo mới' : 'Chỉnh sửa thông báo'}
              </h2>
              <p className="modal-subtitle">
                {showCreateModal 
                  ? 'Tạo thông báo mới để gửi đến người dùng' 
                  : 'Chỉnh sửa thông tin thông báo'
                }
              </p>
            </div>
            <div className="modal-content">
              <div className="modal-placeholder">
                <h3>🔄 Modal đang phát triển</h3>
                <p>Chức năng tạo và chỉnh sửa thông báo sẽ được hoàn thiện trong phiên bản tiếp theo.</p>
                <div className="modal-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowCreateModal(false);
                      setShowEditModal(false);
                      setSelectedAnnouncement(null);
                    }}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;
