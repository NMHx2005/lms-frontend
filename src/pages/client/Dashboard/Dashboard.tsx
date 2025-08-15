import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard__header">
        <div className="dashboard__breadcrumbs">
          <span>Dashboard</span>
        </div>
        <h1 className="dashboard__title">Chào mừng bạn trở lại!</h1>
      </div>

      {/* Content */}
      <div className="dashboard__content">
        {/* Welcome Section */}
        <div className="dashboard__welcome">
          <div className="dashboard__welcome-content">
            <h2>🎓 Học tập hiệu quả hơn với LMS Platform</h2>
            <p>Khám phá các tính năng mới và theo dõi tiến độ học tập của bạn</p>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="dashboard__quick-nav">
          <h3>📚 Truy cập nhanh</h3>
          <div className="dashboard__quick-nav-grid">
            <Link to="/dashboard/courses" className="dashboard__quick-nav-item">
              <div className="dashboard__quick-nav-icon">📚</div>
              <div className="dashboard__quick-nav-content">
                <h4>Khóa học của tôi</h4>
                <p>Xem danh sách khóa học đã mua và tiến độ học tập</p>
              </div>
            </Link>

            <Link to="/dashboard/progress" className="dashboard__quick-nav-item">
              <div className="dashboard__quick-nav-icon">📊</div>
              <div className="dashboard__quick-nav-content">
                <h4>Tiến độ & Chứng chỉ</h4>
                <p>Theo dõi tiến độ học tập và tải chứng chỉ</p>
              </div>
            </Link>

            <Link to="/dashboard/bills" className="dashboard__quick-nav-item">
              <div className="dashboard__quick-nav-icon">💰</div>
              <div className="dashboard__quick-nav-content">
                <h4>Hóa đơn & Thanh toán</h4>
                <p>Quản lý hóa đơn và giao dịch thanh toán</p>
              </div>
            </Link>

            <Link to="/dashboard/refunds" className="dashboard__quick-nav-item">
              <div className="dashboard__quick-nav-icon">🔄</div>
              <div className="dashboard__quick-nav-content">
                <h4>Yêu cầu hoàn tiền</h4>
                <p>Gửi và theo dõi yêu cầu hoàn tiền</p>
              </div>
            </Link>

            <Link to="/dashboard/ratings" className="dashboard__quick-nav-item">
              <div className="dashboard__quick-nav-icon">⭐</div>
              <div className="dashboard__quick-nav-content">
                <h4>Đánh giá & Báo cáo</h4>
                <p>Lịch sử upvote/report và quản lý đánh giá</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard__section">
          <div className="dashboard__section-header">
            <h2>Hoạt động gần đây</h2>
            <p>Những gì bạn đã làm gần đây</p>
          </div>
          
          <div className="dashboard__activity-list">
            <div className="dashboard__activity-item">
              <div className="dashboard__activity-icon">✅</div>
              <div className="dashboard__activity-content">
                <h4>Hoàn thành bài học "React Hooks"</h4>
                <p>Khóa học: React Fundamentals</p>
                <span className="dashboard__activity-time">2 giờ trước</span>
              </div>
            </div>
            
            <div className="dashboard__activity-item">
              <div className="dashboard__activity-icon">💰</div>
              <div className="dashboard__activity-content">
                <h4>Thanh toán khóa học "Node.js Backend"</h4>
                <p>Số tiền: 800,000 VND</p>
                <span className="dashboard__activity-time">1 ngày trước</span>
              </div>
            </div>
            
            <div className="dashboard__activity-item">
              <div className="dashboard__activity-icon">🏆</div>
              <div className="dashboard__activity-content">
                <h4>Nhận chứng chỉ "Database Design"</h4>
                <p>Điểm: A+</p>
                <span className="dashboard__activity-time">3 ngày trước</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;