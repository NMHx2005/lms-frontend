import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './TeacherLayout.css';

const TeacherLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedTabs, setExpandedTabs] = useState<string[]>([]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleTab = (tabPath: string) => {
    setExpandedTabs(prev => 
      prev.includes(tabPath) 
        ? prev.filter(path => path !== tabPath)
        : [...prev, tabPath]
    );
  };

  // Main navigation items for Teacher Dashboard
  const navItems = [
    {
      path: '/teacher/courses',
      icon: '📚',
      label: 'Course Studio',
      description: 'Quản lý khóa học của bạn'
    },
    {
      path: '/teacher/analytics',
      icon: '📊',
      label: 'Analytics',
      description: 'Phân tích hiệu suất và thu nhập'
    },
    {
      path: '/teacher/messages',
      icon: '💬',
      label: 'Communication Center',
      description: 'Giao tiếp với học viên'
    },
    {
      path: '/teacher/earnings',
      icon: '💰',
      label: 'Doanh thu & Hóa đơn',
      description: 'Theo dõi thu nhập và thanh toán'
    },
    {
      path: '/teacher/ai',
      icon: '🤖',
      label: 'AI Tools',
      description: 'Công cụ AI hỗ trợ giảng dạy'
    }
  ];

  // Sub-navigation items for detailed course management
  // These provide quick access to specific course-related functions
  // const subNavItems = [
  //   {
  //     path: '/teacher/courses',
  //     icon: '📚',
  //     label: 'Course Studio',
  //     description: 'Quản lý khóa học của bạn'
  //   },
  //   {
  //     path: '/teacher/courses/new',
  //     icon: '➕',
  //     label: 'Tạo khóa học mới',
  //     description: 'Tạo khóa học mới'
  //   },
  //   {
  //     path: '/teacher/analytics',
  //     icon: '📊',
  //     label: 'Analytics',
  //     description: 'Phân tích hiệu suất và thu nhập'
  //   },
  //   {
  //     path: '/teacher/earnings',
  //     icon: '💰',
  //     label: 'Doanh thu & Hóa đơn',
  //     description: 'Theo dõi thu nhập và thanh toán'
  //   },
  //   {
  //     path: '/teacher/ai',
  //     icon: '🤖',
  //     label: 'AI Tools',
  //     description: 'Công cụ AI hỗ trợ giảng dạy'
  //   }
  // ];

  
  return (
    <div className="teacher-layout">
      {/* Mobile Header */}
      <div className="teacher-mobile-header">
        <div className="mobile-header__brand">
          <h2>Teacher Dashboard</h2>
        </div>
        <button 
          className="teacher-mobile-header__menu-toggle"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`teacher-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar__header">
          <div className="sidebar__brand">
            <h2>Teacher Dashboard</h2>
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
                <div className="sidebar__nav-header" onClick={() => toggleTab(item.path)}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => 
                      `sidebar__nav-link ${isActive ? 'active' : ''}`
                    }
                  >
                    <span className="sidebar__nav-icon">{item.icon}</span>
                    <div className="sidebar__nav-content">
                      <span className="sidebar__nav-label">{item.label}</span>
                      <span className="sidebar__nav-description">{item.description}</span>
                    </div>
                  </NavLink>
                </div>
                
                {/* Sub-navigation for Course Studio */}
                {item.path === '/teacher/courses' && expandedTabs.includes(item.path) && (
                  <ul className="sidebar__sub-nav">
                    <li className="sidebar__sub-nav-item">
                      <NavLink
                        to="/teacher/courses"
                        className={({ isActive }) => 
                          `sidebar__sub-nav-link ${isActive ? 'active' : ''}`
                        }
                      >
                        <span className="sidebar__sub-nav-icon">📋</span>
                        <span className="sidebar__sub-nav-label">Danh sách khóa học</span>
                      </NavLink>
                    </li>
                    <li className="sidebar__sub-nav-item">
                      <NavLink
                        to="/teacher/courses/new"
                        className={({ isActive }) => 
                          `sidebar__sub-nav-link ${isActive ? 'active' : ''}`
                        }
                      >
                        <span className="sidebar__sub-nav-icon">➕</span>
                        <span className="sidebar__sub-nav-label">Tạo khóa học mới</span>
                      </NavLink>
                    </li>
                    <li className="sidebar__sub-nav-item">
                      <NavLink
                        to="/teacher/student-management"
                        className={({ isActive }) => 
                          `sidebar__sub-nav-link ${isActive ? 'active' : ''}`
                        }
                      >
                        <span className="sidebar__sub-nav-icon">👥</span>
                        <span className="sidebar__sub-nav-label">Quản lý học viên</span>
                      </NavLink>
                    </li>
                    <li className="sidebar__sub-nav-item">
                      <NavLink
                        to="/teacher/course-reviews"
                        className={({ isActive }) => 
                          `sidebar__sub-nav-link ${isActive ? 'active' : ''}`
                        }
                      >
                        <span className="sidebar__sub-nav-icon">⭐</span>
                        <span className="sidebar__sub-nav-label">Quản lý đánh giá</span>
                      </NavLink>
                    </li>
                  </ul>
                )}

                {/* Sub-navigation for Analytics */}
                {item.path === '/teacher/analytics' && expandedTabs.includes(item.path) && (
                  <ul className="sidebar__sub-nav">
                    <li className="sidebar__sub-nav-item">
                      <NavLink
                        to="/teacher/analytics"
                        className={({ isActive }) => 
                          `sidebar__sub-nav-link ${isActive ? 'active' : ''}`
                        }
                      >
                        <span className="sidebar__sub-nav-icon">📈</span>
                        <span className="sidebar__sub-nav-label">Tổng quan</span>
                      </NavLink>
                    </li>
                    <li className="sidebar__sub-nav-item">
                      <NavLink
                        to="/teacher/analytics/courses"
                        className={({ isActive }) => 
                          `sidebar__sub-nav-link ${isActive ? 'active' : ''}`
                        }
                      >
                        <span className="sidebar__sub-nav-icon">📊</span>
                        <span className="sidebar__sub-nav-label">Phân tích khóa học</span>
                      </NavLink>
                    </li>
                    <li className="sidebar__sub-nav-item">
                      <NavLink
                        to="/teacher/analytics/students"
                        className={({ isActive }) => 
                          `sidebar__sub-nav-link ${isActive ? 'active' : ''}`
                        }
                      >
                        <span className="sidebar__sub-nav-icon">👥</span>
                        <span className="sidebar__sub-nav-label">Phân tích học viên</span>
                      </NavLink>
                    </li>
                  </ul>
                )}

                {/* Sub-navigation for Earnings & Bills */}
                {item.path === '/teacher/earnings' && expandedTabs.includes(item.path) && (
                  <ul className="sidebar__sub-nav">
                    <li className="sidebar__sub-nav-item">
                      <NavLink
                        to="/teacher/earnings"
                        className={({ isActive }) => 
                          `sidebar__sub-nav-link ${isActive ? 'active' : ''}`
                        }
                      >
                        <span className="sidebar__sub-nav-icon">📊</span>
                        <span className="sidebar__sub-nav-label">Tổng quan doanh thu</span>
                      </NavLink>
                    </li>
                    <li className="sidebar__sub-nav-item">
                      <NavLink
                        to="/teacher/earnings/transactions"
                        className={({ isActive }) => 
                          `sidebar__sub-nav-link ${isActive ? 'active' : ''}`
                        }
                      >
                        <span className="sidebar__sub-nav-icon">💳</span>
                        <span className="sidebar__sub-nav-label">Giao dịch</span>
                      </NavLink>
                    </li>
                    <li className="sidebar__sub-nav-item">
                      <NavLink
                        to="/teacher/earnings/analytics"
                        className={({ isActive }) => 
                          `sidebar__sub-nav-link ${isActive ? 'active' : ''}`
                        }
                      >
                        <span className="sidebar__sub-nav-icon">📈</span>
                        <span className="sidebar__sub-nav-label">Phân tích</span>
                      </NavLink>
                    </li>
                  </ul>
                )}

                {/* Sub-navigation for AI Tools */}
                {item.path === '/teacher/ai' && expandedTabs.includes(item.path) && (
                  <ul className="sidebar__sub-nav">
                    <li className="sidebar__sub-nav-item">
                      <NavLink
                        to="/teacher/ai"
                        className={({ isActive }) => 
                          `sidebar__sub-nav-link ${isActive ? 'active' : ''}`
                        }
                      >
                        <span className="sidebar__sub-nav-icon">🤖</span>
                        <span className="sidebar__sub-nav-label">Tổng quan AI Tools</span>
                      </NavLink>
                    </li>
                    <li className="sidebar__sub-nav-item">
                      <NavLink
                        to="/teacher/ai/avatar"
                        className={({ isActive }) => 
                          `sidebar__sub-nav-link ${isActive ? 'active' : ''}`
                        }
                      >
                        <span className="sidebar__sub-nav-icon">👤</span>
                        <span className="sidebar__sub-nav-label">Tạo Avatar</span>
                      </NavLink>
                    </li>
                    <li className="sidebar__sub-nav-item">
                      <NavLink
                        to="/teacher/ai/thumbnail"
                        className={({ isActive }) => 
                          `sidebar__sub-nav-link ${isActive ? 'active' : ''}`
                        }
                      >
                        <span className="sidebar__sub-nav-icon">🖼️</span>
                        <span className="sidebar__sub-nav-label">Tạo Thumbnail</span>
                      </NavLink>
                    </li>
                    <li className="sidebar__sub-nav-item">
                      <NavLink
                        to="/teacher/ai/moderation"
                        className={({ isActive }) => 
                          `sidebar__sub-nav-link ${isActive ? 'active' : ''}`
                        }
                      >
                        <span className="sidebar__sub-nav-icon">🛡️</span>
                        <span className="sidebar__sub-nav-label">Content Moderation</span>
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>
            ))}

            {/* Additional Quick Access Links */}
            <li className="sidebar__nav-item sidebar__nav-item--separator">
              <div className="sidebar__separator">
                <span>Quản lý nâng cao</span>
              </div>
            </li>

            <li className="sidebar__nav-item">
              <NavLink
                to="/teacher/lessons/assignments"
                className={({ isActive }) => 
                  `sidebar__nav-link sidebar__nav-link--secondary ${isActive ? 'active' : ''}`
                }
                onClick={closeSidebar}
              >
                <span className="sidebar__nav-icon">📝</span>
                <div className="sidebar__nav-content">
                  <span className="sidebar__nav-label">Quản lý bài tập</span>
                  <span className="sidebar__nav-description">Tạo và quản lý assignments</span>
                </div>
              </NavLink>
            </li>

            <li className="sidebar__nav-item">
              <NavLink
                to="/teacher/assignments/submissions"
                className={({ isActive }) => 
                  `sidebar__nav-link sidebar__nav-link--secondary ${isActive ? 'active' : ''}`
                }
                onClick={closeSidebar}
              >
                <span className="sidebar__nav-icon">✅</span>
                <div className="sidebar__nav-content">
                  <span className="sidebar__nav-label">Chấm điểm</span>
                  <span className="sidebar__nav-description">Chấm điểm bài nộp</span>
                </div>
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__user-info">
            <div className="sidebar__user-avatar">
              <img src="/images/default-avatar.png" alt="Teacher Avatar" />
            </div>
            <div className="sidebar__user-details">
              <h4>Hieu Doan</h4>
              <p>Instructor</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}

      {/* Main Content */}
      <main className="teacher-main">
        <Outlet />
      </main>
    </div>
  );
};

export default TeacherLayout;
