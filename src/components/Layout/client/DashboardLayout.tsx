import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import './DashboardLayout.css';

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Debug: Log location changes
  useEffect(() => {
    console.log('Location changed to:', location.pathname);
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const navItems = [
    {
      path: '/dashboard',
      icon: '🏠',
      label: 'Tổng quan',
      description: 'Tổng quan dashboard'
    },
    {
      path: '/dashboard/courses',
      icon: '📚',
      label: 'Khóa học của tôi',
      description: 'Danh sách khóa học đã mua'
    },
    {
      path: '/dashboard/wishlist',
      icon: '❤️',
      label: 'Danh sách yêu thích',
      description: 'Khóa học bạn quan tâm'
    },
    {
      path: '/dashboard/groups',
      icon: '👥',
      label: 'Nhóm học tập',
      description: 'Tham gia nhóm học tập'
    },
    {
      path: '/dashboard/calendar',
      icon: '📅',
      label: 'Lịch học',
      description: 'Quản lý lịch học và deadline'
    },
    {
      path: '/dashboard/progress',
      icon: '📊',
      label: 'Tiến độ & Chứng chỉ',
      description: 'Theo dõi tiến độ học tập'
    },
    {
      path: '/dashboard/bills',
      icon: '💰',
      label: 'Hóa đơn & Thanh toán',
      description: 'Quản lý hóa đơn và giao dịch'
    },
    {
      path: '/dashboard/refunds',
      icon: '🔄',
      label: 'Yêu cầu hoàn tiền',
      description: 'Gửi và theo dõi yêu cầu'
    },
    {
      path: '/dashboard/ratings',
      icon: '⭐',
      label: 'Đánh giá & Báo cáo',
      description: 'Lịch sử upvote/report'
    },
    {
      path: '/dashboard/profile',
      icon: '👤',
      label: 'Hồ sơ cá nhân',
      description: 'Thông tin cá nhân và cài đặt'
    },
    {
      path: '/dashboard/notifications',
      icon: '🔔',
      label: 'Thông báo',
      description: 'Trung tâm thông báo'
    }
  ];

  return (
    <div className="dashboard-layout">
      {/* Mobile Header */}
      <div className="dashboard-mobile-header">
        <div className="mobile-header__brand">
          <h2>LMS Dashboard</h2>
        </div>
        <button 
          className="mobile-header__menu-toggle"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar__header">
          <div className="sidebar__brand">
            <h2>LMS Dashboard</h2>
          </div>
          <button 
            className="sidebar__close-btn"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        <nav className="sidebar__nav">
          <ul className="sidebar__nav-list">
            {navItems.map((item) => (
              <li key={item.path} className="sidebar__nav-item">
                <NavLink
                  to={item.path}
                  className={({ isActive, isPending }) => {
                    // Special handling for dashboard index route - only active when exactly at /dashboard
                    if (item.path === '/dashboard') {
                      const isExactDashboard = location.pathname === '/dashboard';
                      console.log('Dashboard route check:', { 
                        itemPath: item.path, 
                        currentPath: location.pathname, 
                        isActive, 
                        isPending, 
                        isExactDashboard,
                        result: isExactDashboard ? 'active' : 'inactive'
                      });
                      return `sidebar__nav-link ${isExactDashboard ? 'active' : ''}`;
                    }
                    
                    // For other routes, use normal isActive logic
                    const result = `sidebar__nav-link ${isActive ? 'active' : ''}`;
                    console.log('Other route check:', { 
                      itemPath: item.path, 
                      currentPath: location.pathname, 
                      isActive, 
                      result 
                    });
                    return result;
                  }}
                  onClick={closeSidebar}
                >
                  <span className="sidebar__nav-icon">{item.icon}</span>
                  <div className="sidebar__nav-content">
                    <span className="sidebar__nav-label">{item.label}</span>
                    <span className="sidebar__nav-description">{item.description}</span>
                  </div>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__user-info">
            <div className="sidebar__user-avatar">
              <img src="/images/default-avatar.png" alt="User Avatar" />
            </div>
            <div className="sidebar__user-details">
              <h4>Hieu Doan</h4>
              <p>Student</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}

      {/* Main Content */}
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
