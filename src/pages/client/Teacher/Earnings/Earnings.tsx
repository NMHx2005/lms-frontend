import React, { useState, useEffect } from 'react';
import './Earnings.css';

interface EarningData {
  totalEarnings: number;
  monthlyEarnings: number;
  totalStudents: number;
  totalCourses: number;
  monthlyGrowth: number;
  recentTransactions: Transaction[];
  monthlyBreakdown: MonthlyData[];
}

interface Transaction {
  id: string;
  courseTitle: string;
  studentName: string;
  amount: number;
  type: 'purchase' | 'refund' | 'commission';
  status: 'completed' | 'pending' | 'failed';
  date: string;
  transactionId: string;
}

interface MonthlyData {
  month: string;
  earnings: number;
  students: number;
  courses: number;
}

const Earnings: React.FC = () => {
  const [earningData, setEarningData] = useState<EarningData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockData: EarningData = {
        totalEarnings: 12500000,
        monthlyEarnings: 2800000,
        totalStudents: 245,
        totalCourses: 4,
        monthlyGrowth: 15.5,
        recentTransactions: [
          {
            id: '1',
            courseTitle: 'React Advanced Patterns',
            studentName: 'Nguyễn Văn A',
            amount: 299000,
            type: 'purchase',
            status: 'completed',
            date: '2024-01-15T10:30:00Z',
            transactionId: 'TXN_001'
          },
          {
            id: '2',
            courseTitle: 'Python Data Science',
            studentName: 'Trần Thị B',
            amount: 499000,
            type: 'purchase',
            status: 'completed',
            date: '2024-01-14T14:20:00Z',
            transactionId: 'TXN_002'
          },
          {
            id: '3',
            courseTitle: 'React Advanced Patterns',
            studentName: 'Lê Văn C',
            amount: 299000,
            type: 'refund',
            status: 'completed',
            date: '2024-01-13T16:45:00Z',
            transactionId: 'TXN_003'
          },
          {
            id: '4',
            courseTitle: 'UI/UX Design Fundamentals',
            studentName: 'Phạm Thị D',
            amount: 199000,
            type: 'purchase',
            status: 'pending',
            date: '2024-01-12T08:15:00Z',
            transactionId: 'TXN_004'
          }
        ],
        monthlyBreakdown: [
          { month: 'Tháng 1', earnings: 2800000, students: 45, courses: 4 },
          { month: 'Tháng 12', earnings: 2400000, students: 38, courses: 4 },
          { month: 'Tháng 11', earnings: 2100000, students: 32, courses: 3 },
          { month: 'Tháng 10', earnings: 1800000, students: 28, courses: 3 },
          { month: 'Tháng 9', earnings: 1500000, students: 25, courses: 3 },
          { month: 'Tháng 8', earnings: 1200000, students: 20, courses: 2 }
        ]
      };
      setEarningData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
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

  const getTransactionIcon = (type: string) => {
    const icons = {
      purchase: '💰',
      refund: '↩️',
      commission: '💸'
    };
    return icons[type as keyof typeof icons] || '💰';
  };

  const getTransactionClass = (type: string) => {
    return `transaction-item--${type}`;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: 'Hoàn thành', class: 'status-badge--completed' },
      pending: { label: 'Chờ xử lý', class: 'status-badge--pending' },
      failed: { label: 'Thất bại', class: 'status-badge--failed' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`status-badge ${config.class}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="teacher-dashboard">
        <div className="teacher-dashboard__header">
          <div className="teacher-dashboard__breadcrumbs">
            <span>Teacher Dashboard</span>
            <span>/</span>
            <span>Doanh thu & Hóa đơn</span>
          </div>
          <h1 className="teacher-dashboard__title">Doanh thu & Hóa đơn</h1>
        </div>
        <div className="teacher-dashboard__content">
          <div className="dashboard__loading">
            <div className="dashboard__loading-spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!earningData) return null;

  return (
    <div className="teacher-dashboard">
      <div className="teacher-dashboard__header">
        <div className="teacher-dashboard__breadcrumbs">
          <span>Teacher Dashboard</span>
          <span>/</span>
          <span>Doanh thu & Hóa đơn</span>
        </div>
        <h1 className="teacher-dashboard__title">Doanh thu & Hóa đơn</h1>
      </div>

      <div className="teacher-dashboard__content">
        {/* Period Selector */}
        <div className="earnings__period-selector">
          <button
            className={`period-btn ${selectedPeriod === 'month' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('month')}
          >
            Tháng này
          </button>
          <button
            className={`period-btn ${selectedPeriod === 'quarter' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('quarter')}
          >
            Quý này
          </button>
          <button
            className={`period-btn ${selectedPeriod === 'year' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('year')}
          >
            Năm nay
          </button>
        </div>

        {/* Stats Overview */}
        <div className="earnings__stats">
          <div className="stat-card">
            <div className="stat-card__icon">💰</div>
            <div className="stat-card__content">
              <h3>{formatCurrency(earningData.totalEarnings)}</h3>
              <p>Tổng doanh thu</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card__icon">📈</div>
            <div className="stat-card__content">
              <h3>{formatCurrency(earningData.monthlyEarnings)}</h3>
              <p>Doanh thu tháng này</p>
              <span className="growth-indicator positive">
                +{earningData.monthlyGrowth}%
              </span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card__icon">👥</div>
            <div className="stat-card__content">
              <h3>{earningData.totalStudents}</h3>
              <p>Tổng học viên</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card__icon">📚</div>
            <div className="stat-card__content">
              <h3>{earningData.totalCourses}</h3>
              <p>Khóa học đang bán</p>
            </div>
          </div>
        </div>

        {/* Monthly Breakdown Chart */}
        <div className="earnings__chart-section">
          <h3>Biểu đồ doanh thu theo tháng</h3>
          <div className="monthly-chart">
            {earningData.monthlyBreakdown.map((month, index) => (
              <div key={month.month} className="chart-bar">
                <div className="chart-bar__label">{month.month}</div>
                <div className="chart-bar__container">
                  <div 
                    className="chart-bar__fill"
                    style={{ 
                      height: `${(month.earnings / Math.max(...earningData.monthlyBreakdown.map(m => m.earnings))) * 100}%` 
                    }}
                  ></div>
                </div>
                <div className="chart-bar__value">{formatCurrency(month.earnings)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="earnings__transactions">
          <div className="transactions__header">
            <h3>Giao dịch gần đây</h3>
            <button className="teacher-dashboard__btn teacher-dashboard__btn--outline">
              Xem tất cả
            </button>
          </div>
          
          <div className="transactions__list">
            {earningData.recentTransactions.map((transaction) => (
              <div key={transaction.id} className={`transaction-item ${getTransactionClass(transaction.type)}`}>
                <div className="transaction__icon">
                  {getTransactionIcon(transaction.type)}
                </div>
                
                <div className="transaction__content">
                  <div className="transaction__header">
                    <h4 className="transaction__title">{transaction.courseTitle}</h4>
                    <div className="transaction__meta">
                      <span className="transaction__student">{transaction.studentName}</span>
                      <span className="transaction__date">{formatDate(transaction.date)}</span>
                    </div>
                  </div>
                  
                  <div className="transaction__details">
                    <span className="transaction__amount">
                      {transaction.type === 'refund' ? '-' : '+'}{formatCurrency(transaction.amount)}
                    </span>
                    <span className="transaction__id">ID: {transaction.transactionId}</span>
                  </div>
                </div>
                
                <div className="transaction__status">
                  {getStatusBadge(transaction.status)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="earnings__quick-actions">
          <h3>Thao tác nhanh</h3>
          <div className="quick-actions__grid">
            <button className="quick-action-btn">
              <span className="quick-action__icon">📊</span>
              <span className="quick-action__label">Xuất báo cáo</span>
            </button>
            <button className="quick-action-btn">
              <span className="quick-action__icon">💳</span>
              <span className="quick-action__label">Cài đặt thanh toán</span>
            </button>
            <button className="quick-action-btn">
              <span className="quick-action__icon">📧</span>
              <span className="quick-action__label">Gửi hóa đơn</span>
            </button>
            <button className="quick-action-btn">
              <span className="quick-action__icon">⚙️</span>
              <span className="quick-action__label">Cài đặt hoa hồng</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earnings;
