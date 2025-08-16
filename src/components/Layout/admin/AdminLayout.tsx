import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import './AdminLayout.css';

interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number;
}

const AdminLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const sidebarItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/admin' },
    { id: 'users', label: 'Quản lý User', icon: '👥', path: '/admin/users' },
    { id: 'courses', label: 'Quản lý khóa học', icon: '📚', path: '/admin/courses', badge: 12 },
    { id: 'courses-review', label: 'Duyệt khóa học', icon: '📝', path: '/admin/courses/review', badge: 5 },
    { id: 'refunds', label: 'Trung tâm hoàn tiền', icon: '💰', path: '/admin/refunds', badge: 2 },
    { id: 'bills', label: 'Hóa đơn & Thanh toán', icon: '🧾', path: '/admin/bills', badge: 8 },
    { id: 'ai', label: 'AI Moderation', icon: '🤖', path: '/admin/ai' },
    { id: 'reports', label: 'Báo cáo & Analytics', icon: '📈', path: '/admin/reports' },
    { id: 'settings', label: 'Cài đặt hệ thống', icon: '⚙️', path: '/admin/settings' },
    { id: 'permissions', label: 'Quản lý quyền', icon: '🔐', path: '/admin/permissions' },
    { id: 'audit-logs', label: 'Audit Logs', icon: '📋', path: '/admin/audit-logs' },
    { id: 'category-management', label: 'Quản lý danh mục', icon: '🏷️', path: '/admin/category-management' },
    { id: 'support-center', label: 'Support Center', icon: '💬', path: '/admin/support-center' },
    { id: 'announcements', label: 'Thông báo', icon: '📢', path: '/admin/announcements' },
    { id: 'performance', label: 'Giám sát hiệu suất', icon: '📊', path: '/admin/performance' },
    { id: 'backup', label: 'Backup & Restore', icon: '💾', path: '/admin/backup' },
  ];

  const handleSidebarItemClick = (path: string) => {
    navigate(path);
  };

  const isActiveItem = (path: string) => {
    // Find all items that could be active based on the current path
    const matchingItems = sidebarItems.filter(
      (item) =>
        location.pathname === item.path ||
        (item.path !== '/admin' && location.pathname.startsWith(item.path + '/'))
    );

    // If the current path matches this item's path exactly, it's active
    if (location.pathname === path) {
      return true;
    }

    // For non-exact matches, only mark as active if this item's path is the longest match
    if (path !== '/admin' && location.pathname.startsWith(path + '/')) {
      // Check if there's any other item with a longer path that also matches
      const hasMoreSpecificMatch = matchingItems.some(
        (item) => item.path !== path && item.path.length > path.length
      );
      // Only mark this item as active if no more specific (longer) path matches
      return !hasMoreSpecificMatch;
    }

    return false;
  };

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="admin-sidebar__header">
          <div className="admin-sidebar__logo">
            {!sidebarCollapsed && (
              <>
                <span className="admin-sidebar__logo-icon">🏛️</span>
                <span className="admin-sidebar__logo-text">Admin Panel</span>
              </>
            )}
          </div>
          <button
            className="admin-sidebar__toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>
        <nav className="admin-sidebar__nav">
          <ul className="admin-sidebar__nav-list">
            {sidebarItems.map((item) => {
              const isActive = isActiveItem(item.path);
              const className = `admin-sidebar__nav-link ${isActive ? 'active' : ''}`;

              return (
                <li key={item.id} className="admin-sidebar__nav-item">
                  <button
                    className={className}
                    onClick={() => handleSidebarItemClick(item.path)}
                    title={item.label}
                  >
                    <span className="admin-sidebar__nav-icon">{item.icon}</span>
                    {!sidebarCollapsed && (
                      <>
                        <span className="admin-sidebar__nav-label">{item.label}</span>
                        {item.badge && <span className="admin-sidebar__nav-badge">{item.badge}</span>}
                      </>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="admin-sidebar__footer">
          <button
            className="admin-sidebar__logout"
            onClick={() => navigate('/admin/login')}
            title="Đăng xuất"
          >
            <span className="admin-sidebar__logout-icon">🚪</span>
            {!sidebarCollapsed && <span className="admin-sidebar__logout-text">Đăng xuất</span>}
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <div className="admin-main__content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;