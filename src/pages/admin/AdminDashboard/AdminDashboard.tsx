import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  pendingCourses: number;
  pendingRefunds: number;
  activeUsers: number;
  newUsersToday: number;
}

// interface ChartData {
//   labels: string[];
//   datasets: {
//     label: string;
//     data: number[];
//     backgroundColor: string;
//     borderColor: string;
//   }[];
// }

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalRevenue: 0,
    pendingCourses: 5,
    pendingRefunds: 2,
    activeUsers: 0,
    newUsersToday: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalUsers: 1247,
        totalCourses: 89,
        totalEnrollments: 3456,
        totalRevenue: 125000000,
        pendingCourses: 5,
        pendingRefunds: 2,
        activeUsers: 892,
        newUsersToday: 23
      });
      setLoading(false);
    }, 1000);
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  // const formatCurrency = (amount: number) => {
  //   return new Intl.NumberFormat('vi-VN', {
  //     style: 'currency',
  //     currency: 'VND',
  //     minimumFractionDigits: 0
  //   }).format(amount);
  // };

  const formatCurrencyShort = (amount: number) => {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)}T`;
    } else if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    }
    return amount.toString();
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-dashboard__loading">
          <div className="admin-dashboard__loading-spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-dashboard__header">
        <div className="admin-dashboard__header-content">
          <h1 className="admin-dashboard__title">Dashboard</h1>
          <p className="admin-dashboard__subtitle">
            Tổng quan hệ thống LMS
          </p>
        </div>
        <div className="admin-dashboard__header-actions">
          <button className="admin-dashboard__refresh-btn">
            🔄 Làm mới
          </button>
          <div className="admin-dashboard__last-updated">
            Cập nhật: {new Date().toLocaleTimeString('vi-VN')}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="admin-dashboard__stats">
        <div className="admin-dashboard__stat-card admin-dashboard__stat-card--primary">
          <div className="admin-dashboard__stat-icon">👥</div>
          <div className="admin-dashboard__stat-content">
            <div className="admin-dashboard__stat-value">{formatNumber(stats.totalUsers)}</div>
            <div className="admin-dashboard__stat-label">Tổng người dùng</div>
            <div className="admin-dashboard__stat-change">
              <span className="admin-dashboard__stat-change-icon">📈</span>
              +{stats.newUsersToday} hôm nay
            </div>
          </div>
        </div>

        <div className="admin-dashboard__stat-card admin-dashboard__stat-card--success">
          <div className="admin-dashboard__stat-icon">📚</div>
          <div className="admin-dashboard__stat-content">
            <div className="admin-dashboard__stat-value">{formatNumber(stats.totalCourses)}</div>
            <div className="admin-dashboard__stat-label">Tổng khóa học</div>
            <div className="admin-dashboard__stat-change">
              <span className="admin-dashboard__stat-change-icon">⏳</span>
              {stats.pendingCourses} chờ duyệt
            </div>
          </div>
        </div>

        <div className="admin-dashboard__stat-card admin-dashboard__stat-card--info">
          <div className="admin-dashboard__stat-icon">🎓</div>
          <div className="admin-dashboard__stat-content">
            <div className="admin-dashboard__stat-value">{formatNumber(stats.totalEnrollments)}</div>
            <div className="admin-dashboard__stat-label">Tổng đăng ký</div>
            <div className="admin-dashboard__stat-change">
              <span className="admin-dashboard__stat-change-icon">📊</span>
              {stats.activeUsers} đang hoạt động
            </div>
          </div>
        </div>

        <div className="admin-dashboard__stat-card admin-dashboard__stat-card--warning">
          <div className="admin-dashboard__stat-icon">💰</div>
          <div className="admin-dashboard__stat-content">
            <div className="admin-dashboard__stat-value">{formatCurrencyShort(stats.totalRevenue)}</div>
            <div className="admin-dashboard__stat-label">Tổng doanh thu</div>
            <div className="admin-dashboard__stat-change">
              <span className="admin-dashboard__stat-change-icon">⚠️</span>
              {stats.pendingRefunds} yêu cầu hoàn tiền
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="admin-dashboard__charts">
        <div className="admin-dashboard__chart-container">
          <div className="admin-dashboard__chart-header">
            <h3 className="admin-dashboard__chart-title">📈 Tăng trưởng người dùng</h3>
            <div className="admin-dashboard__chart-actions">
              <button className="admin-dashboard__chart-btn active">7 ngày</button>
              <button className="admin-dashboard__chart-btn">30 ngày</button>
              <button className="admin-dashboard__chart-btn">90 ngày</button>
            </div>
          </div>
          <div className="admin-dashboard__chart-placeholder">
            <div className="admin-dashboard__chart-mock">
              <div className="admin-dashboard__chart-line"></div>
              <div className="admin-dashboard__chart-line"></div>
              <div className="admin-dashboard__chart-line"></div>
              <div className="admin-dashboard__chart-line"></div>
              <div className="admin-dashboard__chart-line"></div>
              <div className="admin-dashboard__chart-line"></div>
              <div className="admin-dashboard__chart-line"></div>
            </div>
            <p className="admin-dashboard__chart-note">
              Biểu đồ tăng trưởng người dùng theo thời gian
            </p>
          </div>
        </div>

        <div className="admin-dashboard__chart-container">
          <div className="admin-dashboard__chart-header">
            <h3 className="admin-dashboard__chart-title">📊 Doanh thu theo tháng</h3>
            <div className="admin-dashboard__chart-actions">
              <button className="admin-dashboard__chart-btn active">2024</button>
              <button className="admin-dashboard__chart-btn">2023</button>
            </div>
          </div>
          <div className="admin-dashboard__chart-placeholder">
            <div className="admin-dashboard__chart-mock">
              <div className="admin-dashboard__chart-bar" style={{ height: '60%' }}></div>
              <div className="admin-dashboard__chart-bar" style={{ height: '80%' }}></div>
              <div className="admin-dashboard__chart-bar" style={{ height: '45%' }}></div>
              <div className="admin-dashboard__chart-bar" style={{ height: '90%' }}></div>
              <div className="admin-dashboard__chart-bar" style={{ height: '70%' }}></div>
              <div className="admin-dashboard__chart-bar" style={{ height: '85%' }}></div>
            </div>
            <p className="admin-dashboard__chart-note">
              Biểu đồ doanh thu theo tháng
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-dashboard__quick-actions">
        <h3 className="admin-dashboard__section-title">⚡ Hành động nhanh</h3>
        <div className="admin-dashboard__quick-actions-grid">
          <button className="admin-dashboard__quick-action">
            <span className="admin-dashboard__quick-action-icon">📝</span>
            <span className="admin-dashboard__quick-action-label">Duyệt khóa học</span>
            <span className="admin-dashboard__quick-action-badge">{stats.pendingCourses}</span>
          </button>
          <button className="admin-dashboard__quick-action">
            <span className="admin-dashboard__quick-action-icon">⭐</span>
            <span className="admin-dashboard__quick-action-label">Xử lý báo cáo</span>
            <span className="admin-dashboard__quick-action-badge">3</span>
          </button>
          <button className="admin-dashboard__quick-action">
            <span className="admin-dashboard__quick-action-icon">💰</span>
            <span className="admin-dashboard__quick-action-label">Xử lý hoàn tiền</span>
            <span className="admin-dashboard__quick-action-badge">{stats.pendingRefunds}</span>
          </button>
          <button className="admin-dashboard__quick-action">
            <span className="admin-dashboard__quick-action-icon">👥</span>
            <span className="admin-dashboard__quick-action-label">Quản lý user</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="admin-dashboard__recent-activity">
        <h3 className="admin-dashboard__section-title">🕒 Hoạt động gần đây</h3>
        <div className="admin-dashboard__activity-list">
          <div className="admin-dashboard__activity-item">
            <div className="admin-dashboard__activity-icon">👤</div>
            <div className="admin-dashboard__activity-content">
              <div className="admin-dashboard__activity-title">User mới đăng ký</div>
              <div className="admin-dashboard__activity-desc">Nguyễn Văn A đã đăng ký tài khoản</div>
              <div className="admin-dashboard__activity-time">2 phút trước</div>
            </div>
          </div>
          <div className="admin-dashboard__activity-item">
            <div className="admin-dashboard__activity-icon">📚</div>
            <div className="admin-dashboard__activity-content">
              <div className="admin-dashboard__activity-title">Khóa học mới</div>
              <div className="admin-dashboard__activity-desc">"React Advanced" đang chờ duyệt</div>
              <div className="admin-dashboard__activity-time">15 phút trước</div>
            </div>
          </div>
          <div className="admin-dashboard__activity-item">
            <div className="admin-dashboard__activity-icon">💰</div>
            <div className="admin-dashboard__activity-content">
              <div className="admin-dashboard__activity-title">Thanh toán thành công</div>
              <div className="admin-dashboard__activity-desc">Khóa học "Python Basics" - 299,000 VND</div>
              <div className="admin-dashboard__activity-time">1 giờ trước</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
