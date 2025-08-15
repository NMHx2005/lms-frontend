import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Refunds.css';

interface RefundRequest {
  id: string;
  courseId: string;
  courseName: string;
  courseImage: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'processing';
  createdAt: string;
  updatedAt: string;
  description?: string;
  adminNote?: string;
}

const Refunds: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'processing'>('all');
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const refundRequests: RefundRequest[] = [
    {
      id: '1',
      courseId: '1',
      courseName: 'React Advanced Patterns',
      courseImage: '/images/apollo.png',
      amount: 299000,
      reason: 'Không phù hợp với nhu cầu học tập',
      status: 'pending',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      description: 'Khóa học quá nâng cao so với trình độ hiện tại của tôi'
    },
    {
      id: '2',
      courseId: '2',
      courseName: 'Node.js Backend Development',
      courseImage: '/images/aptech.png',
      amount: 399000,
      reason: 'Nội dung không đúng như mô tả',
      status: 'approved',
      createdAt: '2024-01-10T14:20:00Z',
      updatedAt: '2024-01-12T09:15:00Z',
      description: 'Khóa học không có phần thực hành như đã hứa',
      adminNote: 'Đã xác nhận vấn đề, hoàn tiền 100%'
    },
    {
      id: '3',
      courseId: '3',
      courseName: 'UI/UX Design Fundamentals',
      courseImage: '/images/codegym.png',
      amount: 199000,
      reason: 'Chất lượng video kém',
      status: 'rejected',
      createdAt: '2024-01-08T16:45:00Z',
      updatedAt: '2024-01-11T11:30:00Z',
      description: 'Video có tiếng ồn và chất lượng hình ảnh thấp',
      adminNote: 'Đã kiểm tra, chất lượng video đạt chuẩn'
    },
    {
      id: '4',
      courseId: '4',
      courseName: 'Python Data Science',
      courseImage: '/images/funix.png',
      amount: 499000,
      reason: 'Thay đổi kế hoạch học tập',
      status: 'processing',
      createdAt: '2024-01-13T08:15:00Z',
      updatedAt: '2024-01-14T15:20:00Z',
      description: 'Cần tập trung vào lĩnh vực khác'
    }
  ];

  const filteredRequests = refundRequests.filter(request => {
    const matchesTab = activeTab === 'all' || request.status === activeTab;
    const matchesSearch = request.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.reason.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Chờ xử lý', class: 'status-badge--pending' },
      approved: { label: 'Đã duyệt', class: 'status-badge--approved' },
      rejected: { label: 'Từ chối', class: 'status-badge--rejected' },
      processing: { label: 'Đang xử lý', class: 'status-badge--processing' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`status-badge ${config.class}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div className="dashboard__breadcrumbs">
          <Link to="/dashboard">Dashboard</Link>
          <span>Refund Requests</span>
        </div>
        <h1 className="dashboard__title">Yêu cầu hoàn tiền</h1>
      </div>

      <div className="dashboard__content">
        {/* Tabs */}
        <div className="dashboard__tabs">
          <button
            className={`dashboard__tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Tất cả
          </button>
          <button
            className={`dashboard__tab ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Chờ xử lý
          </button>
          <button
            className={`dashboard__tab ${activeTab === 'processing' ? 'active' : ''}`}
            onClick={() => setActiveTab('processing')}
          >
            Đang xử lý
          </button>
          <button
            className={`dashboard__tab ${activeTab === 'approved' ? 'active' : ''}`}
            onClick={() => setActiveTab('approved')}
          >
            Đã duyệt
          </button>
          <button
            className={`dashboard__tab ${activeTab === 'rejected' ? 'active' : ''}`}
            onClick={() => setActiveTab('rejected')}
          >
            Từ chối
          </button>
        </div>

        {/* Filter Bar */}
        <div className="dashboard__filter-bar">
          <div className="dashboard__search">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên khóa học hoặc lý do..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button>🔍</button>
          </div>
          <button
            className="dashboard__btn dashboard__btn--primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Đóng form' : 'Gửi yêu cầu mới'}
          </button>
        </div>

        {/* New Request Form */}
        {showForm && (
          <div className="dashboard__form-section">
            <h3>Gửi yêu cầu hoàn tiền mới</h3>
            <div className="refund-form">
              <div className="form-group">
                <label>Chọn khóa học:</label>
                <select>
                  <option value="">-- Chọn khóa học --</option>
                  <option value="1">React Advanced Patterns</option>
                  <option value="2">Node.js Backend Development</option>
                  <option value="3">UI/UX Design Fundamentals</option>
                  <option value="4">Python Data Science</option>
                </select>
              </div>
              <div className="form-group">
                <label>Lý do hoàn tiền:</label>
                <select>
                  <option value="">-- Chọn lý do --</option>
                  <option value="not-suitable">Không phù hợp với nhu cầu</option>
                  <option value="wrong-content">Nội dung không đúng mô tả</option>
                  <option value="poor-quality">Chất lượng kém</option>
                  <option value="change-plan">Thay đổi kế hoạch học tập</option>
                  <option value="other">Lý do khác</option>
                </select>
              </div>
              <div className="form-group">
                <label>Mô tả chi tiết:</label>
                <textarea
                  rows={4}
                  placeholder="Mô tả chi tiết lý do bạn muốn hoàn tiền..."
                ></textarea>
              </div>
              <div className="form-actions">
                <button className="dashboard__btn dashboard__btn--primary">
                  Gửi yêu cầu
                </button>
                <button 
                  className="dashboard__btn dashboard__btn--outline"
                  onClick={() => setShowForm(false)}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Refund Requests List */}
        <div className="dashboard__refunds">
          {filteredRequests.length === 0 ? (
            <div className="dashboard__empty">
              <div className="dashboard__empty-icon">📋</div>
              <h3>Không có yêu cầu hoàn tiền</h3>
              <p>Bạn chưa có yêu cầu hoàn tiền nào hoặc không có yêu cầu nào khớp với bộ lọc hiện tại.</p>
            </div>
          ) : (
            <div className="dashboard__refunds-list">
              {filteredRequests.map((request) => (
                <div key={request.id} className="dashboard__refund-card">
                  <div className="refund-card__header">
                    <div className="refund-card__course">
                      <img 
                        src={request.courseImage} 
                        alt={request.courseName}
                        className="refund-card__course-image"
                      />
                      <div className="refund-card__course-info">
                        <h4>{request.courseName}</h4>
                        <p className="refund-card__amount">{formatPrice(request.amount)}</p>
                      </div>
                    </div>
                    <div className="refund-card__status">
                      {getStatusBadge(request.status)}
                    </div>
                  </div>
                  
                  <div className="refund-card__content">
                    <div className="refund-card__reason">
                      <strong>Lý do:</strong> {request.reason}
                    </div>
                    {request.description && (
                      <div className="refund-card__description">
                        <strong>Mô tả:</strong> {request.description}
                      </div>
                    )}
                    {request.adminNote && (
                      <div className="refund-card__admin-note">
                        <strong>Ghi chú từ admin:</strong> {request.adminNote}
                      </div>
                    )}
                  </div>
                  
                  <div className="refund-card__footer">
                    <div className="refund-card__dates">
                      <span>Gửi: {formatDate(request.createdAt)}</span>
                      <span>Cập nhật: {formatDate(request.updatedAt)}</span>
                    </div>
                    <div className="refund-card__actions">
                      {request.status === 'pending' && (
                        <button className="dashboard__btn dashboard__btn--outline">
                          Hủy yêu cầu
                        </button>
                      )}
                      {request.status === 'approved' && (
                        <button className="dashboard__btn dashboard__btn--secondary">
                          Xem chi tiết hoàn tiền
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Refunds;
