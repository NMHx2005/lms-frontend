import React, { useState, useEffect } from 'react';
import './UserManagement.css';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  status: 'active' | 'banned' | 'pending';
  createdAt: string;
  lastLogin: string;
  courseCount: number;
  enrollmentCount: number;
}

interface UserFilters {
  search: string;
  role: string;
  status: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    role: 'all',
    status: 'all'
  });
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockUsers: User[] = [
        {
          _id: '1',
          name: 'Nguyễn Văn A',
          email: 'nguyenvana@email.com',
          role: 'student',
          status: 'active',
          createdAt: '2024-01-15T00:00:00Z',
          lastLogin: '2024-01-20T10:30:00Z',
          courseCount: 0,
          enrollmentCount: 3
        },
        {
          _id: '2',
          name: 'Trần Thị B',
          email: 'tranthib@email.com',
          role: 'teacher',
          status: 'active',
          createdAt: '2024-01-10T00:00:00Z',
          lastLogin: '2024-01-20T09:15:00Z',
          courseCount: 2,
          enrollmentCount: 0
        },
        {
          _id: '3',
          name: 'Lê Văn C',
          email: 'levanc@email.com',
          role: 'student',
          status: 'banned',
          createdAt: '2024-01-05T00:00:00Z',
          lastLogin: '2024-01-18T14:20:00Z',
          courseCount: 0,
          enrollmentCount: 1
        },
        {
          _id: '4',
          name: 'Phạm Thị D',
          email: 'phamthid@email.com',
          role: 'teacher',
          status: 'pending',
          createdAt: '2024-01-20T00:00:00Z',
          lastLogin: '2024-01-20T08:45:00Z',
          courseCount: 0,
          enrollmentCount: 0
        },
        {
          _id: '5',
          name: 'Hoàng Văn E',
          email: 'hoangvane@email.com',
          role: 'admin',
          status: 'active',
          createdAt: '2024-01-01T00:00:00Z',
          lastLogin: '2024-01-20T11:00:00Z',
          courseCount: 0,
          enrollmentCount: 0
        }
      ];
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Filter users based on current filters
    const filtered = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                           user.email.toLowerCase().includes(filters.search.toLowerCase());
      const matchesRole = filters.role === 'all' || user.role === filters.role;
      const matchesStatus = filters.status === 'all' || user.status === filters.status;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
    
    setFilteredUsers(filtered);
  }, [users, filters]);

  const handleFilterChange = (newFilters: Partial<UserFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user._id));
    }
  };

  const handleBulkAction = (action: 'ban' | 'unban' | 'delete') => {
    if (selectedUsers.length === 0) return;
    
    const actionText = {
      ban: 'khóa',
      unban: 'mở khóa',
      delete: 'xóa'
    }[action];
    
    if (confirm(`Bạn có chắc chắn muốn ${actionText} ${selectedUsers.length} user đã chọn?`)) {
      // Simulate API call
      setUsers(prev => prev.map(user => {
        if (selectedUsers.includes(user._id)) {
          if (action === 'delete') {
            return { ...user, _id: `deleted-${user._id}` };
          } else if (action === 'ban') {
            return { ...user, status: 'banned' as const };
          } else if (action === 'unban') {
            return { ...user, status: 'active' as const };
          }
        }
        return user;
      }));
      
      setSelectedUsers([]);
      setShowBulkActions(false);
    }
  };

  const handleUserAction = (userId: string, action: 'ban' | 'unban' | 'delete') => {
    const user = users.find(u => u._id === userId);
    if (!user) return;
    
    const actionText = {
      ban: 'khóa',
      unban: 'mở khóa',
      delete: 'xóa'
    }[action];
    
    if (confirm(`Bạn có chắc chắn muốn ${actionText} user "${user.name}"?`)) {
      // Simulate API call
      setUsers(prev => prev.map(u => {
        if (u._id === userId) {
          if (action === 'delete') {
            return { ...u, _id: `deleted-${u._id}` };
          } else if (action === 'ban') {
            return { ...u, status: 'banned' as const };
          } else if (action === 'unban') {
            return { ...u, status: 'active' as const };
          }
        }
        return u;
      }));
    }
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      student: 'Học viên',
      teacher: 'Giảng viên',
      admin: 'Quản trị viên'
    };
    return labels[role as keyof typeof labels] || role;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      active: 'Hoạt động',
      banned: 'Đã khóa',
      pending: 'Chờ duyệt'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusClass = (status: string) => {
    const classes = {
      active: 'status-active',
      banned: 'status-banned',
      pending: 'status-pending'
    };
    return classes[status as keyof typeof classes] || '';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="user-management">
        <div className="user-management__loading">
          <div className="user-management__loading-spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-management">
      {/* Header */}
      <div className="user-management__header">
        <div className="user-management__header-content">
          <h1 className="user-management__title">Quản lý User</h1>
          <p className="user-management__subtitle">
            Quản lý tất cả người dùng trong hệ thống
          </p>
        </div>
        <div className="user-management__header-actions">
          <button className="user-management__export-btn">
            📊 Xuất Excel
          </button>
          <button className="user-management__add-btn">
            ➕ Thêm User
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="user-management__filters">
        <div className="user-management__search">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={filters.search}
            onChange={(e) => handleFilterChange({ search: e.target.value })}
            className="user-management__search-input"
          />
          <span className="user-management__search-icon">🔍</span>
        </div>
        
        <div className="user-management__filter-controls">
          <select
            value={filters.role}
            onChange={(e) => handleFilterChange({ role: e.target.value })}
            className="user-management__filter-select"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="student">Học viên</option>
            <option value="teacher">Giảng viên</option>
            <option value="admin">Quản trị viên</option>
          </select>
          
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange({ status: e.target.value })}
            className="user-management__filter-select"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="banned">Đã khóa</option>
            <option value="pending">Chờ duyệt</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="user-management__bulk-actions">
          <div className="user-management__bulk-info">
            <span className="user-management__bulk-count">
              Đã chọn {selectedUsers.length} user
            </span>
            <button
              className="user-management__bulk-clear"
              onClick={() => setSelectedUsers([])}
            >
              Bỏ chọn tất cả
            </button>
          </div>
          <div className="user-management__bulk-buttons">
            <button
              className="user-management__bulk-btn user-management__bulk-btn--ban"
              onClick={() => handleBulkAction('ban')}
            >
              🚫 Khóa ({selectedUsers.length})
            </button>
            <button
              className="user-management__bulk-btn user-management__bulk-btn--unban"
              onClick={() => handleBulkAction('unban')}
            >
              ✅ Mở khóa ({selectedUsers.length})
            </button>
            <button
              className="user-management__bulk-btn user-management__bulk-btn--delete"
              onClick={() => handleBulkAction('delete')}
            >
              🗑️ Xóa ({selectedUsers.length})
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="user-management__table-container">
        <table className="user-management__table">
          <thead className="user-management__table-header">
            <tr>
              <th className="user-management__table-th">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  onChange={handleSelectAll}
                  className="user-management__checkbox"
                />
              </th>
              <th className="user-management__table-th">Thông tin</th>
              <th className="user-management__table-th">Vai trò</th>
              <th className="user-management__table-th">Trạng thái</th>
              <th className="user-management__table-th">Thống kê</th>
              <th className="user-management__table-th">Ngày tạo</th>
          <th className="user-management__table-th">Hành động</th>
            </tr>
          </thead>
          <tbody className="user-management__table-body">
            {filteredUsers.map((user) => (
              <tr key={user._id} className="user-management__table-row">
                <td className="user-management__table-td">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => handleUserSelection(user._id)}
                    className="user-management__checkbox"
                  />
                </td>
                <td className="user-management__table-td">
                  <div className="user-management__user-info">
                    <div className="user-management__user-avatar">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-management__user-details">
                      <div className="user-management__user-name">{user.name}</div>
                      <div className="user-management__user-email">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="user-management__table-td">
                  <span className={`user-management__role-badge user-management__role-badge--${user.role}`}>
                    {getRoleLabel(user.role)}
                  </span>
                </td>
                <td className="user-management__table-td">
                  <span className={`user-management__status-badge ${getStatusClass(user.status)}`}>
                    {getStatusLabel(user.status)}
                  </span>
                </td>
                <td className="user-management__table-td">
                  <div className="user-management__user-stats">
                    <div className="user-management__stat-item">
                      <span className="user-management__stat-label">Khóa học:</span>
                      <span className="user-management__stat-value">{user.courseCount}</span>
                    </div>
                    <div className="user-management__stat-item">
                      <span className="user-management__stat-label">Đăng ký:</span>
                      <span className="user-management__stat-value">{user.enrollmentCount}</span>
                    </div>
                  </div>
                </td>
                <td className="user-management__table-td">
                  {formatDate(user.createdAt)}
                </td>
                <td className="user-management__table-td">
                  <div className="user-management__actions">
                    {user.status === 'active' ? (
                      <button
                        className="user-management__action-btn user-management__action-btn--ban"
                        onClick={() => handleUserAction(user._id, 'ban')}
                        title="Khóa user"
                      >
                        🚫
                      </button>
                    ) : (
                      <button
                        className="user-management__action-btn user-management__action-btn--unban"
                        onClick={() => handleUserAction(user._id, 'unban')}
                        title="Mở khóa user"
                      >
                        ✅
                      </button>
                    )}
                    <button
                      className="user-management__action-btn user-management__action-btn--edit"
                      title="Chỉnh sửa"
                    >
                      ✏️
                    </button>
                    <button
                      className="user-management__action-btn user-management__action-btn--delete"
                      onClick={() => handleUserAction(user._id, 'delete')}
                      title="Xóa user"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="user-management__empty">
          <div className="user-management__empty-icon">👥</div>
          <h3>Không có user nào</h3>
          <p>
            {filters.search || filters.role !== 'all' || filters.status !== 'all'
              ? 'Không tìm thấy user nào phù hợp với bộ lọc hiện tại'
              : 'Chưa có user nào trong hệ thống'
            }
          </p>
        </div>
      )}

      {/* Pagination */}
      {filteredUsers.length > 0 && (
        <div className="user-management__pagination">
          <div className="user-management__pagination-info">
            Hiển thị {filteredUsers.length} trong tổng số {users.length} user
          </div>
          <div className="user-management__pagination-controls">
            <button className="user-management__pagination-btn" disabled>
              ← Trước
            </button>
            <span className="user-management__pagination-page">Trang 1</span>
            <button className="user-management__pagination-btn" disabled>
              Sau →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
