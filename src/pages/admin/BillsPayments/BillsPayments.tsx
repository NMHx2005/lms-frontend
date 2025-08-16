import React, { useState, useEffect } from 'react';
import './BillsPayments.css';

interface Bill {
  _id: string;
  billNumber: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  tax: number;
  total: number;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  paymentMethod: string;
  paymentDate?: string;
  dueDate: string;
  createdAt: string;
  invoiceUrl?: string;
  receiptUrl?: string;
}

interface BillFilters {
  search: string;
  status: string;
  paymentMethod: string;
  dateRange: string;
}

const BillsPayments: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [filteredBills, setFilteredBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<BillFilters>({
    search: '',
    status: 'all',
    paymentMethod: 'all',
    dateRange: 'all'
  });

  useEffect(() => {
    setTimeout(() => {
      const mockBills: Bill[] = [
        {
          _id: '1',
          billNumber: 'INV-2024-001',
          studentId: 'student-1',
          studentName: 'Nguyễn Văn A',
          studentEmail: 'nguyenvana@email.com',
          courseId: 'course-1',
          courseTitle: 'React Advanced Patterns',
          amount: 299000,
          tax: 29900,
          total: 328900,
          status: 'paid',
          paymentMethod: 'Credit Card',
          paymentDate: '2024-01-20T10:30:00Z',
          dueDate: '2024-01-25T00:00:00Z',
          createdAt: '2024-01-18T00:00:00Z'
        },
        {
          _id: '2',
          billNumber: 'INV-2024-002',
          studentId: 'student-2',
          studentName: 'Trần Thị B',
          studentEmail: 'tranthib@email.com',
          courseId: 'course-2',
          courseTitle: 'Python Data Science',
          amount: 399000,
          tax: 39900,
          total: 438900,
          status: 'pending',
          paymentMethod: 'Bank Transfer',
          dueDate: '2024-01-30T00:00:00Z',
          createdAt: '2024-01-19T00:00:00Z'
        },
        {
          _id: '3',
          billNumber: 'INV-2024-003',
          studentId: 'student-3',
          studentName: 'Lê Văn C',
          studentEmail: 'levanc@email.com',
          courseId: 'course-3',
          courseTitle: 'Web Design Principles',
          amount: 199000,
          tax: 19900,
          total: 218900,
          status: 'overdue',
          paymentMethod: 'Credit Card',
          dueDate: '2024-01-15T00:00:00Z',
          createdAt: '2024-01-10T00:00:00Z'
        }
      ];
      setBills(mockBills);
      setFilteredBills(mockBills);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const filtered = bills.filter(bill => {
      const matchesSearch = bill.billNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
                          bill.studentName.toLowerCase().includes(filters.search.toLowerCase()) ||
                          bill.courseTitle.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus = filters.status === 'all' || bill.status === filters.status;
      const matchesPaymentMethod = filters.paymentMethod === 'all' || bill.paymentMethod === filters.paymentMethod;
      
      let matchesDateRange = true;
      if (filters.dateRange !== 'all') {
        const dueDate = new Date(bill.dueDate);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - dueDate.getTime());
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
      
      return matchesSearch && matchesStatus && matchesPaymentMethod && matchesDateRange;
    });
    setFilteredBills(filtered);
  }, [bills, filters]);

  const handleFilterChange = (newFilters: Partial<BillFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const getStatusLabel = (status: string) => {
    const labels = { 
      pending: 'Chờ thanh toán', 
      paid: 'Đã thanh toán', 
      overdue: 'Quá hạn',
      cancelled: 'Đã hủy'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusClass = (status: string) => {
    const classes = { 
      pending: 'status-pending', 
      paid: 'status-paid', 
      overdue: 'status-overdue',
      cancelled: 'status-cancelled'
    };
    return classes[status as keyof typeof classes] || '';
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

  if (loading) {
    return (
      <div className="bills-payments">
        <div className="bills-payments__loading">
          <div className="bills-payments__loading-spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bills-payments">
      <div className="bills-payments__header">
        <div className="bills-payments__header-content">
          <h1 className="bills-payments__title">Hóa đơn & Thanh toán</h1>
          <p className="bills-payments__subtitle">Quản lý hóa đơn và theo dõi thanh toán</p>
        </div>
        <div className="bills-payments__header-actions">
          <button className="bills-payments__refresh-btn">🔄 Làm mới</button>
          <button className="bills-payments__export-btn">📊 Xuất Excel</button>
          <button className="bills-payments__create-btn">➕ Tạo hóa đơn</button>
        </div>
      </div>

      <div className="bills-payments__stats">
        <div className="bills-payments__stat-card">
          <div className="bills-payments__stat-icon">📄</div>
          <div className="bills-payments__stat-content">
            <div className="bills-payments__stat-value">{bills.length}</div>
            <div className="bills-payments__stat-label">Tổng hóa đơn</div>
          </div>
        </div>
        <div className="bills-payments__stat-card">
          <div className="bills-payments__stat-icon">✅</div>
          <div className="bills-payments__stat-content">
            <div className="bills-payments__stat-value">
              {bills.filter(b => b.status === 'paid').length}
            </div>
            <div className="bills-payments__stat-label">Đã thanh toán</div>
          </div>
        </div>
        <div className="bills-payments__stat-card">
          <div className="bills-payments__stat-icon">⏳</div>
          <div className="bills-payments__stat-content">
            <div className="bills-payments__stat-value">
              {bills.filter(b => b.status === 'pending').length}
            </div>
            <div className="bills-payments__stat-label">Chờ thanh toán</div>
          </div>
        </div>
        <div className="bills-payments__stat-card">
          <div className="bills-payments__stat-icon">💰</div>
          <div className="bills-payments__stat-content">
            <div className="bills-payments__stat-value">
              {formatCurrency(bills.filter(b => b.status === 'paid').reduce((sum, b) => sum + b.total, 0))}
            </div>
            <div className="bills-payments__stat-label">Tổng thu</div>
          </div>
        </div>
      </div>

      <div className="bills-payments__filters">
        <div className="bills-payments__search">
          <input
            type="text"
            placeholder="Tìm kiếm theo số hóa đơn, học viên hoặc khóa học..."
            value={filters.search}
            onChange={(e) => handleFilterChange({ search: e.target.value })}
            className="bills-payments__search-input"
          />
          <span className="bills-payments__search-icon">🔍</span>
        </div>
        <div className="bills-payments__filter-controls">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange({ status: e.target.value })}
            className="bills-payments__filter-select"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ thanh toán</option>
            <option value="paid">Đã thanh toán</option>
            <option value="overdue">Quá hạn</option>
            <option value="cancelled">Đã hủy</option>
          </select>
          <select
            value={filters.paymentMethod}
            onChange={(e) => handleFilterChange({ paymentMethod: e.target.value })}
            className="bills-payments__filter-select"
          >
            <option value="all">Tất cả phương thức</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cash">Cash</option>
          </select>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange({ dateRange: e.target.value })}
            className="bills-payments__filter-select"
          >
            <option value="all">Tất cả thời gian</option>
            <option value="today">Hôm nay</option>
            <option value="week">7 ngày qua</option>
            <option value="month">30 ngày qua</option>
          </select>
        </div>
      </div>

      <div className="bills-payments__bills">
        {filteredBills.map((bill) => (
          <div key={bill._id} className="bills-payments__bill-card">
            <div className="bills-payments__bill-header">
              <div className="bills-payments__bill-number">{bill.billNumber}</div>
              <span className={`bills-payments__status-badge ${getStatusClass(bill.status)}`}>
                {getStatusLabel(bill.status)}
              </span>
            </div>
            
            <div className="bills-payments__bill-content">
              <div className="bills-payments__bill-info">
                <h3 className="bills-payments__bill-title">{bill.courseTitle}</h3>
                <div className="bills-payments__bill-meta">
                  <div className="bills-payments__bill-meta-item">
                    <span className="bills-payments__bill-meta-label">Học viên:</span>
                    <span className="bills-payments__bill-meta-value">{bill.studentName}</span>
                  </div>
                  <div className="bills-payments__bill-meta-item">
                    <span className="bills-payments__bill-meta-label">Email:</span>
                    <span className="bills-payments__bill-meta-value">{bill.studentEmail}</span>
                  </div>
                  <div className="bills-payments__bill-meta-item">
                    <span className="bills-payments__bill-meta-label">Phương thức:</span>
                    <span className="bills-payments__bill-meta-value">{bill.paymentMethod}</span>
                  </div>
                </div>
              </div>
              
              <div className="bills-payments__bill-amounts">
                <div className="bills-payments__bill-amount-item">
                  <span className="bills-payments__bill-amount-label">Giá gốc:</span>
                  <span className="bills-payments__bill-amount-value">{formatCurrency(bill.amount)}</span>
                </div>
                <div className="bills-payments__bill-amount-item">
                  <span className="bills-payments__bill-amount-label">Thuế:</span>
                  <span className="bills-payments__bill-amount-value">{formatCurrency(bill.tax)}</span>
                </div>
                <div className="bills-payments__bill-amount-item bills-payments__bill-amount-total">
                  <span className="bills-payments__bill-amount-label">Tổng cộng:</span>
                  <span className="bills-payments__bill-amount-value">{formatCurrency(bill.total)}</span>
                </div>
              </div>
              
              <div className="bills-payments__bill-timeline">
                <div className="bills-payments__bill-timeline-item">
                  <span className="bills-payments__bill-timeline-label">Ngày tạo:</span>
                  <span className="bills-payments__bill-timeline-value">
                    {formatDate(bill.createdAt)}
                  </span>
                </div>
                <div className="bills-payments__bill-timeline-item">
                  <span className="bills-payments__bill-timeline-label">Hạn thanh toán:</span>
                  <span className="bills-payments__bill-timeline-value">
                    {formatDate(bill.dueDate)}
                  </span>
                </div>
                {bill.paymentDate && (
                  <div className="bills-payments__bill-timeline-item">
                    <span className="bills-payments__bill-timeline-label">Ngày thanh toán:</span>
                    <span className="bills-payments__bill-timeline-value">
                      {formatDate(bill.paymentDate)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bills-payments__bill-actions">
              <button className="bills-payments__action-btn bills-payments__action-btn--view">
                👁️ Xem chi tiết
              </button>
              <button className="bills-payments__action-btn bills-payments__action-btn--edit">
                ✏️ Chỉnh sửa
              </button>
              {bill.status === 'pending' && (
                <button className="bills-payments__action-btn bills-payments__action-btn--remind">
                  📧 Nhắc nhở
                </button>
              )}
              {bill.status === 'paid' && (
                <button className="bills-payments__action-btn bills-payments__action-btn--receipt">
                  🧾 Xuất biên lai
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredBills.length === 0 && (
        <div className="bills-payments__empty">
          <div className="bills-payments__empty-icon">🧾</div>
          <h3>Không có hóa đơn nào</h3>
          <p>
            {filters.search || filters.status !== 'all' || filters.paymentMethod !== 'all' || filters.dateRange !== 'all'
              ? 'Không tìm thấy hóa đơn nào phù hợp với bộ lọc hiện tại'
              : 'Chưa có hóa đơn nào trong hệ thống'
            }
          </p>
        </div>
      )}

      {filteredBills.length > 0 && (
        <div className="bills-payments__pagination">
          <div className="bills-payments__pagination-info">
            Hiển thị {filteredBills.length} trong tổng số {bills.length} hóa đơn
          </div>
          <div className="bills-payments__pagination-controls">
            <button className="bills-payments__pagination-btn" disabled>← Trước</button>
            <span className="bills-payments__pagination-page">Trang 1</span>
            <button className="bills-payments__pagination-btn" disabled>Sau →</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillsPayments;
