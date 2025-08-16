import React, { useState, useEffect } from 'react';
import './RefundCenter.css';

interface RefundRequest {
  _id: string;
  orderId: string;
  courseId: string;
  courseTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  instructorId: string;
  instructorName: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requestDate: string;
  processedDate?: string;
  processedBy?: string;
  notes?: string;
  evidence?: string[];
  refundMethod: 'original_payment' | 'credit' | 'bank_transfer';
  originalPaymentMethod: string;
  originalTransactionId: string;
}

interface RefundFilters {
  search: string;
  status: string;
  refundMethod: string;
  dateRange: string;
}

const RefundCenter: React.FC = () => {
  const [refunds, setRefunds] = useState<RefundRequest[]>([]);
  const [filteredRefunds, setFilteredRefunds] = useState<RefundRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<RefundFilters>({
    search: '',
    status: 'all',
    refundMethod: 'all',
    dateRange: 'all'
  });
  const [selectedRefunds, setSelectedRefunds] = useState<string[]>([]);
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [processNotes, setProcessNotes] = useState('');
  const [processAction, setProcessAction] = useState<'approve' | 'reject'>('approve');

  useEffect(() => {
    setTimeout(() => {
      const mockRefunds: RefundRequest[] = [
        {
          _id: '1',
          orderId: 'ORD-2024-001',
          courseId: 'course-1',
          courseTitle: 'React Advanced Patterns & Best Practices',
          studentId: 'student-1',
          studentName: 'Nguyễn Văn A',
          studentEmail: 'nguyenvana@email.com',
          instructorId: 'instructor-1',
          instructorName: 'Trần Thị B',
          amount: 299000,
          reason: 'Khóa học không phù hợp với nhu cầu học tập',
          status: 'pending',
          requestDate: '2024-01-20T10:30:00Z',
          refundMethod: 'original_payment',
          originalPaymentMethod: 'Credit Card',
          originalTransactionId: 'TXN-2024-001'
        },
        {
          _id: '2',
          orderId: 'ORD-2024-002',
          courseId: 'course-2',
          courseTitle: 'Python Data Science Fundamentals',
          studentId: 'student-2',
          studentName: 'Lê Văn C',
          studentEmail: 'levanc@email.com',
          instructorId: 'instructor-2',
          instructorName: 'Phạm Thị D',
          amount: 399000,
          reason: 'Chất lượng nội dung không như mong đợi',
          status: 'approved',
          requestDate: '2024-01-19T14:20:00Z',
          processedDate: '2024-01-20T09:15:00Z',
          processedBy: 'admin-1',
          notes: 'Đã xác minh và chấp thuận yêu cầu hoàn tiền',
          refundMethod: 'credit',
          originalPaymentMethod: 'Bank Transfer',
          originalTransactionId: 'TXN-2024-002'
        },
        {
          _id: '3',
          orderId: 'ORD-2024-003',
          courseId: 'course-3',
          courseTitle: 'Web Design Principles & UI/UX',
          studentId: 'student-3',
          studentName: 'Hoàng Văn E',
          studentEmail: 'hoangvane@email.com',
          instructorId: 'instructor-3',
          instructorName: 'Vũ Thị F',
          amount: 199000,
          reason: 'Kỹ thuật giảng dạy không hiệu quả',
          status: 'rejected',
          requestDate: '2024-01-18T16:45:00Z',
          processedDate: '2024-01-19T11:30:00Z',
          processedBy: 'admin-1',
          notes: 'Khóa học đã hoàn thành 70%, không đủ điều kiện hoàn tiền',
          refundMethod: 'original_payment',
          originalPaymentMethod: 'Credit Card',
          originalTransactionId: 'TXN-2024-003'
        },
        {
          _id: '4',
          orderId: 'ORD-2024-004',
          courseId: 'course-4',
          courseTitle: 'Mobile App Development with React Native',
          studentId: 'student-4',
          studentName: 'Đỗ Thị G',
          studentEmail: 'dothig@email.com',
          instructorId: 'instructor-4',
          instructorName: 'Ngô Văn H',
          amount: 499000,
          reason: 'Gặp vấn đề kỹ thuật không thể truy cập khóa học',
          status: 'completed',
          requestDate: '2024-01-17T09:15:00Z',
          processedDate: '2024-01-18T14:20:00Z',
          processedBy: 'admin-2',
          notes: 'Đã xác nhận vấn đề kỹ thuật và hoàn tiền thành công',
          refundMethod: 'bank_transfer',
          originalPaymentMethod: 'Credit Card',
          originalTransactionId: 'TXN-2024-004'
        },
        {
          _id: '5',
          orderId: 'ORD-2024-005',
          courseId: 'course-5',
          courseTitle: 'Blockchain & Cryptocurrency Basics',
          studentId: 'student-5',
          studentName: 'Bùi Văn I',
          studentEmail: 'buivani@email.com',
          instructorId: 'instructor-5',
          instructorName: 'Lý Thị K',
          amount: 599000,
          reason: 'Thay đổi kế hoạch học tập',
          status: 'pending',
          requestDate: '2024-01-16T11:30:00Z',
          refundMethod: 'credit',
          originalPaymentMethod: 'Bank Transfer',
          originalTransactionId: 'TXN-2024-005'
        }
      ];
      setRefunds(mockRefunds);
      setFilteredRefunds(mockRefunds);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const filtered = refunds.filter(refund => {
      const matchesSearch = refund.courseTitle.toLowerCase().includes(filters.search.toLowerCase()) ||
                          refund.studentName.toLowerCase().includes(filters.search.toLowerCase()) ||
                          refund.orderId.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus = filters.status === 'all' || refund.status === filters.status;
      const matchesRefundMethod = filters.refundMethod === 'all' || refund.refundMethod === filters.refundMethod;
      
      let matchesDateRange = true;
      if (filters.dateRange !== 'all') {
        const requestDate = new Date(refund.requestDate);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - requestDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        switch (filters.dateRange) {
          case 'today':
            matchesDateRange = diffDays === 0;
            break;
          case 'week':
            matchesDateRange = diffDays <= 7;
            break;
          case 'month':
            matchesDateRange = diffDays <= 30;
            break;
        }
      }
      
      return matchesSearch && matchesStatus && matchesRefundMethod && matchesDateRange;
    });
    setFilteredRefunds(filtered);
  }, [refunds, filters]);

  const handleFilterChange = (newFilters: Partial<RefundFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleRefundSelection = (refundId: string) => {
    setSelectedRefunds(prev => 
      prev.includes(refundId) 
        ? prev.filter(id => id !== refundId) 
        : [...prev, refundId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRefunds.length === filteredRefunds.length) {
      setSelectedRefunds([]);
    } else {
      setSelectedRefunds(filteredRefunds.map(refund => refund._id));
    }
  };

  const handleBulkAction = (action: 'approve' | 'reject') => {
    if (selectedRefunds.length === 0) return;
    
    const actionText = action === 'approve' ? 'duyệt' : 'từ chối';
    if (confirm(`Bạn có chắc chắn muốn ${actionText} ${selectedRefunds.length} yêu cầu hoàn tiền đã chọn?`)) {
      setRefunds(prev => prev.map(refund => {
        if (selectedRefunds.includes(refund._id)) {
          return { 
            ...refund, 
            status: action === 'approve' ? 'approved' : 'rejected' as const,
            processedDate: new Date().toISOString(),
            processedBy: 'admin-1'
          };
        }
        return refund;
      }));
      setSelectedRefunds([]);
    }
  };

  const handleProcessRefund = (refund: RefundRequest, action: 'approve' | 'reject') => {
    setSelectedRefund(refund);
    setProcessAction(action);
    setProcessNotes('');
    setShowProcessModal(true);
  };

  const handleSubmitProcess = () => {
    if (!selectedRefund) return;
    
    setRefunds(prev => prev.map(refund => {
      if (refund._id === selectedRefund._id) {
        return { 
          ...refund, 
          status: processAction === 'approve' ? 'approved' : 'rejected' as const,
          processedDate: new Date().toISOString(),
          processedBy: 'admin-1',
          notes: processNotes
        };
      }
      return refund;
    }));
    
    setShowProcessModal(false);
    setSelectedRefund(null);
    setProcessNotes('');
  };

  const getStatusLabel = (status: string) => {
    const labels = { 
      pending: 'Chờ xử lý', 
      approved: 'Đã duyệt', 
      rejected: 'Đã từ chối',
      completed: 'Hoàn thành'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusClass = (status: string) => {
    const classes = { 
      pending: 'status-pending', 
      approved: 'status-approved', 
      rejected: 'status-rejected',
      completed: 'status-completed'
    };
    return classes[status as keyof typeof labels] || '';
  };

  const getRefundMethodLabel = (method: string) => {
    const labels = { 
      original_payment: 'Hoàn về phương thức gốc', 
      credit: 'Tín dụng nội bộ', 
      bank_transfer: 'Chuyển khoản ngân hàng'
    };
    return labels[method as keyof typeof labels] || method;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  if (loading) {
    return (
      <div className="refund-center">
        <div className="refund-center__loading">
          <div className="refund-center__loading-spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="refund-center">
      <div className="refund-center__header">
        <div className="refund-center__header-content">
          <h1 className="refund-center__title">Trung tâm hoàn tiền</h1>
          <p className="refund-center__subtitle">Quản lý các yêu cầu hoàn tiền từ học viên</p>
        </div>
        <div className="refund-center__header-actions">
          <button className="refund-center__refresh-btn">🔄 Làm mới</button>
          <button className="refund-center__export-btn">📊 Xuất Excel</button>
          <button className="refund-center__settings-btn">⚙️ Cài đặt</button>
        </div>
      </div>

      <div className="refund-center__stats">
        <div className="refund-center__stat-card">
          <div className="refund-center__stat-icon">⏳</div>
          <div className="refund-center__stat-content">
            <div className="refund-center__stat-value">
              {refunds.filter(r => r.status === 'pending').length}
            </div>
            <div className="refund-center__stat-label">Chờ xử lý</div>
          </div>
        </div>
        <div className="refund-center__stat-card">
          <div className="refund-center__stat-icon">✅</div>
          <div className="refund-center__stat-content">
            <div className="refund-center__stat-value">
              {refunds.filter(r => r.status === 'approved').length}
            </div>
            <div className="refund-center__stat-label">Đã duyệt</div>
          </div>
        </div>
        <div className="refund-center__stat-card">
          <div className="refund-center__stat-icon">❌</div>
          <div className="refund-center__stat-content">
            <div className="refund-center__stat-value">
              {refunds.filter(r => r.status === 'rejected').length}
            </div>
            <div className="refund-center__stat-label">Đã từ chối</div>
          </div>
        </div>
        <div className="refund-center__stat-card">
          <div className="refund-center__stat-icon">💰</div>
          <div className="refund-center__stat-content">
            <div className="refund-center__stat-value">
              {formatCurrency(refunds.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.amount, 0))}
            </div>
            <div className="refund-center__stat-label">Tổng hoàn tiền</div>
          </div>
        </div>
      </div>

      <div className="refund-center__filters">
        <div className="refund-center__search">
          <input
            type="text"
            placeholder="Tìm kiếm theo khóa học, học viên hoặc mã đơn hàng..."
            value={filters.search}
            onChange={(e) => handleFilterChange({ search: e.target.value })}
            className="refund-center__search-input"
          />
          <span className="refund-center__search-icon">🔍</span>
        </div>
        <div className="refund-center__filter-controls">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange({ status: e.target.value })}
            className="refund-center__filter-select"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xử lý</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Đã từ chối</option>
            <option value="completed">Hoàn thành</option>
          </select>
          <select
            value={filters.refundMethod}
            onChange={(e) => handleFilterChange({ refundMethod: e.target.value })}
            className="refund-center__filter-select"
          >
            <option value="all">Tất cả phương thức</option>
            <option value="original_payment">Hoàn về phương thức gốc</option>
            <option value="credit">Tín dụng nội bộ</option>
            <option value="bank_transfer">Chuyển khoản ngân hàng</option>
          </select>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange({ dateRange: e.target.value })}
            className="refund-center__filter-select"
          >
            <option value="all">Tất cả thời gian</option>
            <option value="today">Hôm nay</option>
            <option value="week">7 ngày qua</option>
            <option value="month">30 ngày qua</option>
          </select>
        </div>
      </div>

      {selectedRefunds.length > 0 && (
        <div className="refund-center__bulk-actions">
          <div className="refund-center__bulk-info">
            <span className="refund-center__bulk-count">
              Đã chọn {selectedRefunds.length} yêu cầu hoàn tiền
            </span>
            <button 
              className="refund-center__bulk-clear"
              onClick={() => setSelectedRefunds([])}
            >
              Bỏ chọn tất cả
            </button>
          </div>
          <div className="refund-center__bulk-buttons">
            <button 
              className="refund-center__bulk-btn refund-center__bulk-btn--approve"
              onClick={() => handleBulkAction('approve')}
            >
              ✅ Duyệt ({selectedRefunds.length})
            </button>
            <button 
              className="refund-center__bulk-btn refund-center__bulk-btn--reject"
              onClick={() => handleBulkAction('reject')}
            >
              ❌ Từ chối ({selectedRefunds.length})
            </button>
          </div>
        </div>
      )}

      <div className="refund-center__refunds">
        {filteredRefunds.map((refund) => (
          <div key={refund._id} className="refund-center__refund-card">
            <div className="refund-center__refund-header">
              <div className="refund-center__refund-selection">
                <input
                  type="checkbox"
                  checked={selectedRefunds.includes(refund._id)}
                  onChange={() => handleRefundSelection(refund._id)}
                  className="refund-center__checkbox"
                />
              </div>
              <div className="refund-center__refund-status">
                <span className={`refund-center__status-badge ${getStatusClass(refund.status)}`}>
                  {getStatusLabel(refund.status)}
                </span>
              </div>
            </div>
            
            <div className="refund-center__refund-content">
              <div className="refund-center__refund-main">
                <div className="refund-center__refund-info">
                  <h3 className="refund-center__refund-title">{refund.courseTitle}</h3>
                  <div className="refund-center__refund-meta">
                    <div className="refund-center__refund-meta-item">
                      <span className="refund-center__refund-meta-label">Mã đơn hàng:</span>
                      <span className="refund-center__refund-meta-value">{refund.orderId}</span>
                    </div>
                    <div className="refund-center__refund-meta-item">
                      <span className="refund-center__refund-meta-label">Số tiền:</span>
                      <span className="refund-center__refund-meta-value refund-center__amount">
                        {formatCurrency(refund.amount)}
                      </span>
                    </div>
                    <div className="refund-center__refund-meta-item">
                      <span className="refund-center__refund-meta-label">Phương thức hoàn tiền:</span>
                      <span className="refund-center__refund-meta-value">
                        {getRefundMethodLabel(refund.refundMethod)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="refund-center__refund-reason">
                  <h4 className="refund-center__refund-reason-title">Lý do hoàn tiền:</h4>
                  <p className="refund-center__refund-reason-text">{refund.reason}</p>
                </div>
              </div>
              
              <div className="refund-center__refund-details">
                <div className="refund-center__refund-party">
                  <div className="refund-center__refund-party-item">
                    <h4 className="refund-center__refund-party-title">Học viên</h4>
                    <div className="refund-center__refund-party-info">
                      <div className="refund-center__refund-party-name">{refund.studentName}</div>
                      <div className="refund-center__refund-party-email">{refund.studentEmail}</div>
                    </div>
                  </div>
                  
                  <div className="refund-center__refund-party-item">
                    <h4 className="refund-center__refund-party-title">Giảng viên</h4>
                    <div className="refund-center__refund-party-info">
                      <div className="refund-center__refund-party-name">{refund.instructorName}</div>
                    </div>
                  </div>
                </div>
                
                <div className="refund-center__refund-timeline">
                  <div className="refund-center__refund-timeline-item">
                    <span className="refund-center__refund-timeline-label">Yêu cầu:</span>
                    <span className="refund-center__refund-timeline-value">
                      {formatDateTime(refund.requestDate)}
                    </span>
                  </div>
                  {refund.processedDate && (
                    <div className="refund-center__refund-timeline-item">
                      <span className="refund-center__refund-timeline-label">Xử lý:</span>
                      <span className="refund-center__refund-timeline-value">
                        {formatDateTime(refund.processedDate)}
                      </span>
                    </div>
                  )}
                  {refund.notes && (
                    <div className="refund-center__refund-notes">
                      <span className="refund-center__refund-notes-label">Ghi chú:</span>
                      <span className="refund-center__refund-notes-text">{refund.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="refund-center__refund-actions">
              {refund.status === 'pending' && (
                <>
                  <button 
                    className="refund-center__action-btn refund-center__action-btn--approve"
                    onClick={() => handleProcessRefund(refund, 'approve')}
                  >
                    ✅ Duyệt
                  </button>
                  <button 
                    className="refund-center__action-btn refund-center__action-btn--reject"
                    onClick={() => handleProcessRefund(refund, 'reject')}
                  >
                    ❌ Từ chối
                  </button>
                </>
              )}
              <button className="refund-center__action-btn refund-center__action-btn--view">
                👁️ Xem chi tiết
              </button>
              <button className="refund-center__action-btn refund-center__action-btn--edit">
                ✏️ Chỉnh sửa
              </button>
              {refund.status === 'approved' && (
                <button className="refund-center__action-btn refund-center__action-btn--complete">
                  💰 Hoàn tiền
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredRefunds.length === 0 && (
        <div className="refund-center__empty">
          <div className="refund-center__empty-icon">💰</div>
          <h3>Không có yêu cầu hoàn tiền nào</h3>
          <p>
            {filters.search || filters.status !== 'all' || filters.refundMethod !== 'all' || filters.dateRange !== 'all'
              ? 'Không tìm thấy yêu cầu hoàn tiền nào phù hợp với bộ lọc hiện tại'
              : 'Chưa có yêu cầu hoàn tiền nào trong hệ thống'
            }
          </p>
        </div>
      )}

      {filteredRefunds.length > 0 && (
        <div className="refund-center__pagination">
          <div className="refund-center__pagination-info">
            Hiển thị {filteredRefunds.length} trong tổng số {refunds.length} yêu cầu hoàn tiền
          </div>
          <div className="refund-center__pagination-controls">
            <button className="refund-center__pagination-btn" disabled>← Trước</button>
            <span className="refund-center__pagination-page">Trang 1</span>
            <button className="refund-center__pagination-btn" disabled>Sau →</button>
          </div>
        </div>
      )}

      {/* Process Modal */}
      {showProcessModal && selectedRefund && (
        <div className="refund-center__modal-overlay">
          <div className="refund-center__modal">
            <div className="refund-center__modal-header">
              <h3>
                {processAction === 'approve' ? 'Duyệt' : 'Từ chối'} yêu cầu hoàn tiền
              </h3>
              <button 
                className="refund-center__modal-close"
                onClick={() => setShowProcessModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="refund-center__modal-content">
              <div className="refund-center__modal-info">
                <p><strong>Khóa học:</strong> {selectedRefund.courseTitle}</p>
                <p><strong>Học viên:</strong> {selectedRefund.studentName}</p>
                <p><strong>Số tiền:</strong> {formatCurrency(selectedRefund.amount)}</p>
                <p><strong>Lý do:</strong> {selectedRefund.reason}</p>
              </div>
              
              <div className="refund-center__modal-notes">
                <label htmlFor="processNotes" className="refund-center__modal-label">
                  Ghi chú xử lý:
                </label>
                <textarea
                  id="processNotes"
                  value={processNotes}
                  onChange={(e) => setProcessNotes(e.target.value)}
                  placeholder={`Nhập ghi chú về việc ${processAction === 'approve' ? 'duyệt' : 'từ chối'} yêu cầu hoàn tiền...`}
                  className="refund-center__modal-textarea"
                  rows={4}
                />
              </div>
            </div>
            
            <div className="refund-center__modal-actions">
              <button 
                className={`refund-center__modal-btn ${
                  processAction === 'approve' 
                    ? 'refund-center__modal-btn--approve' 
                    : 'refund-center__modal-btn--reject'
                }`}
                onClick={handleSubmitProcess}
              >
                {processAction === 'approve' ? '✅ Duyệt' : '❌ Từ chối'}
              </button>
              <button 
                className="refund-center__modal-btn refund-center__modal-btn--cancel"
                onClick={() => setShowProcessModal(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefundCenter;
