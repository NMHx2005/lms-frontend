import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Notifications.css';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  category: 'course' | 'system' | 'payment' | 'achievement';
  actionUrl?: string;
}

const Notifications: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'course' | 'system' | 'payment' | 'achievement'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Mock data
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'success',
      title: 'Khóa học mới',
      message: 'Khóa học "React Advanced Patterns" đã được thêm vào danh sách yêu thích của bạn',
      timestamp: '2024-01-15T10:30:00Z',
      isRead: false,
      category: 'course',
      actionUrl: '/courses/1'
    },
    {
      id: '2',
      type: 'info',
      title: 'Cập nhật hệ thống',
      message: 'Hệ thống sẽ được bảo trì từ 02:00 - 04:00 ngày mai. Vui lòng lưu công việc của bạn',
      timestamp: '2024-01-15T09:15:00Z',
      isRead: false,
      category: 'system'
    },
    {
      id: '3',
      type: 'success',
      title: 'Thanh toán thành công',
      message: 'Bạn đã thanh toán thành công khóa học "Node.js Backend Development" với số tiền 399,000 VND',
      timestamp: '2024-01-14T16:45:00Z',
      isRead: true,
      category: 'payment'
    },
    {
      id: '4',
      type: 'warning',
      title: 'Nhắc nhở học tập',
      message: 'Bạn chưa hoàn thành bài học nào trong 3 ngày qua. Hãy tiếp tục học tập để duy trì tiến độ!',
      timestamp: '2024-01-14T14:20:00Z',
      isRead: true,
      category: 'course'
    },
    {
      id: '5',
      type: 'success',
      title: 'Chứng chỉ mới',
      message: 'Chúc mừng! Bạn đã hoàn thành khóa học "Python Basics" và nhận được chứng chỉ',
      timestamp: '2024-01-13T11:30:00Z',
      isRead: true,
      category: 'achievement'
    },
    {
      id: '6',
      type: 'error',
      title: 'Lỗi thanh toán',
      message: 'Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại hoặc liên hệ hỗ trợ',
      timestamp: '2024-01-12T08:15:00Z',
      isRead: true,
      category: 'payment'
    }
  ];

  useEffect(() => {
    setNotifications(mockNotifications);
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.isRead;
    return notification.category === activeTab;
  });

  const getNotificationIcon = (type: string) => {
    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    };
    return icons[type as keyof typeof icons] || 'ℹ️';
  };

  const getNotificationClass = (type: string) => {
    return `notification-item--${type}`;
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      course: 'Khóa học',
      system: 'Hệ thống',
      payment: 'Thanh toán',
      achievement: 'Thành tích'
    };
    return labels[category as keyof typeof labels] || category;
  };

  const formatDate = (dateString: string) => {
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Vừa xong';
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    if (diffInHours < 48) return 'Hôm qua';
    
    return notificationDate.toLocaleDateString('vi-VN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    showToastMessage('Đã đánh dấu tất cả thông báo là đã đọc');
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    showToastMessage('Đã xóa thông báo');
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div className="dashboard__breadcrumbs">
          <Link to="/dashboard">Dashboard</Link>
          <span>Thông báo</span>
        </div>
        <h1 className="dashboard__title">Trung tâm thông báo</h1>
      </div>

      <div className="dashboard__content">
        {/* Header Actions */}
        <div className="notifications__header">
          <div className="notifications__stats">
            <span className="stat-item">
              <strong>Tổng:</strong> {notifications.length}
            </span>
            <span className="stat-item">
              <strong>Chưa đọc:</strong> {unreadCount}
            </span>
          </div>
          <div className="notifications__actions">
            <button 
              className="dashboard__btn dashboard__btn--secondary"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              Đánh dấu tất cả đã đọc
            </button>
            <button 
              className="dashboard__btn dashboard__btn--outline"
              onClick={() => showToastMessage('Đang làm mới thông báo...')}
            >
              Làm mới
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="dashboard__tabs">
          <button
            className={`dashboard__tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Tất cả
          </button>
          <button
            className={`dashboard__tab ${activeTab === 'unread' ? 'active' : ''}`}
            onClick={() => setActiveTab('unread')}
          >
            Chưa đọc ({unreadCount})
          </button>
          <button
            className={`dashboard__tab ${activeTab === 'course' ? 'active' : ''}`}
            onClick={() => setActiveTab('course')}
          >
            Khóa học
          </button>
          <button
            className={`dashboard__tab ${activeTab === 'system' ? 'active' : ''}`}
            onClick={() => setActiveTab('system')}
          >
            Hệ thống
          </button>
          <button
            className={`dashboard__tab ${activeTab === 'payment' ? 'active' : ''}`}
            onClick={() => setActiveTab('payment')}
          >
            Thanh toán
          </button>
          <button
            className={`dashboard__tab ${activeTab === 'achievement' ? 'active' : ''}`}
            onClick={() => setActiveTab('achievement')}
          >
            Thành tích
          </button>
        </div>

        {/* Notifications List */}
        <div className="dashboard__notifications">
          {filteredNotifications.length === 0 ? (
            <div className="dashboard__empty">
              <div className="dashboard__empty-icon">🔔</div>
              <h3>Không có thông báo nào</h3>
              <p>Bạn chưa có thông báo nào hoặc không có thông báo nào khớp với bộ lọc hiện tại.</p>
            </div>
          ) : (
            <div className="notifications__list">
              {filteredNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${getNotificationClass(notification.type)} ${!notification.isRead ? 'unread' : ''}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="notification__icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="notification__content">
                    <div className="notification__header">
                      <h4 className="notification__title">{notification.title}</h4>
                      <div className="notification__meta">
                        <span className="notification__category">
                          {getCategoryLabel(notification.category)}
                        </span>
                        <span className="notification__time">
                          {formatDate(notification.timestamp)}
                        </span>
                      </div>
                    </div>
                    
                    <p className="notification__message">{notification.message}</p>
                    
                    {notification.actionUrl && (
                      <div className="notification__actions">
                        <Link 
                          to={notification.actionUrl}
                          className="notification__action-link"
                        >
                          Xem chi tiết →
                        </Link>
                      </div>
                    )}
                  </div>
                  
                  <div className="notification__actions-menu">
                    <button 
                      className="notification__action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      title="Xóa thông báo"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="toast-notification">
          <div className="toast__content">
            <span className="toast__icon">ℹ️</span>
            <span className="toast__message">{toastMessage}</span>
          </div>
          <button 
            className="toast__close"
            onClick={() => setShowToast(false)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default Notifications;
