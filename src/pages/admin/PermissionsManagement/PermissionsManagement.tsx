import React, { useState, useEffect } from 'react';
import './PermissionsManagement.css';

interface Role {
  _id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  createdAt: string;
  isSystem: boolean;
}

interface Permission {
  _id: string;
  name: string;
  description: string;
  category: string;
  isActive: boolean;
}

interface UserRole {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  currentRole: string;
  assignedBy: string;
  assignedAt: string;
}

const PermissionsManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'roles' | 'permissions' | 'users'>('roles');
  const [showCreateRole, setShowCreateRole] = useState(false);
  const [showEditRole, setShowEditRole] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockRoles: Role[] = [
        {
          _id: 'role-1',
          name: 'Super Admin',
          description: 'Toàn quyền truy cập hệ thống',
          permissions: ['all'],
          userCount: 1,
          createdAt: '2024-01-01',
          isSystem: true
        },
        {
          _id: 'role-2',
          name: 'Content Moderator',
          description: 'Quản lý nội dung và duyệt khóa học',
          permissions: ['courses:read', 'courses:moderate', 'content:moderate'],
          userCount: 3,
          createdAt: '2024-01-15',
          isSystem: false
        },
        {
          _id: 'role-3',
          name: 'User Manager',
          description: 'Quản lý người dùng và quyền truy cập',
          permissions: ['users:read', 'users:write', 'roles:read'],
          userCount: 2,
          createdAt: '2024-02-01',
          isSystem: false
        }
      ];

      const mockPermissions: Permission[] = [
        { _id: 'perm-1', name: 'users:read', description: 'Xem danh sách người dùng', category: 'User Management', isActive: true },
        { _id: 'perm-2', name: 'users:write', description: 'Tạo/sửa/xóa người dùng', category: 'User Management', isActive: true },
        { _id: 'perm-3', name: 'courses:read', description: 'Xem danh sách khóa học', category: 'Course Management', isActive: true },
        { _id: 'perm-4', name: 'courses:moderate', description: 'Duyệt khóa học', category: 'Course Management', isActive: true },
        { _id: 'perm-5', name: 'content:moderate', description: 'Duyệt nội dung', category: 'Content Management', isActive: true },
        { _id: 'perm-6', name: 'reports:read', description: 'Xem báo cáo', category: 'Analytics', isActive: true },
        { _id: 'perm-7', name: 'settings:write', description: 'Thay đổi cài đặt hệ thống', category: 'System', isActive: true }
      ];

      const mockUserRoles: UserRole[] = [
        {
          _id: 'ur-1',
          userId: 'user-1',
          userName: 'Admin User',
          userEmail: 'admin@lms.com',
          currentRole: 'Super Admin',
          assignedBy: 'System',
          assignedAt: '2024-01-01'
        },
        {
          _id: 'ur-2',
          userId: 'user-2',
          userName: 'Moderator User',
          userEmail: 'mod@lms.com',
          currentRole: 'Content Moderator',
          assignedBy: 'Admin User',
          assignedAt: '2024-01-15'
        }
      ];

      setRoles(mockRoles);
      setPermissions(mockPermissions);
      setUserRoles(mockUserRoles);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreateRole = () => {
    setShowCreateRole(true);
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setShowEditRole(role._id);
  };

  const handleDeleteRole = (roleId: string) => {
    if (window.confirm('Bạn có chắc muốn xóa role này?')) {
      setRoles(roles.filter(role => role._id !== roleId));
    }
  };

  const getPermissionCategory = (permissionName: string) => {
    const perm = permissions.find(p => p.name === permissionName);
    return perm?.category || 'Unknown';
  };

  if (loading) {
    return (
      <div className="permissions-management">
        <div className="permissions-management__loading">
          <div className="loading-spinner"></div>
          <p>Đang tải quản lý quyền...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="permissions-management">
      <div className="permissions-management__header">
        <div className="permissions-management__title">
          <h1>🔐 Quản lý quyền & vai trò</h1>
          <p>Phân quyền chi tiết cho admin và quản lý role-based access control</p>
        </div>
        <button className="permissions-management__create-btn" onClick={handleCreateRole}>
          + Tạo Role mới
        </button>
      </div>

      <div className="permissions-management__tabs">
        <button
          className={`permissions-management__tab ${activeTab === 'roles' ? 'active' : ''}`}
          onClick={() => setActiveTab('roles')}
        >
          👥 Vai trò ({roles.length})
        </button>
        <button
          className={`permissions-management__tab ${activeTab === 'permissions' ? 'active' : ''}`}
          onClick={() => setActiveTab('permissions')}
        >
          🔑 Quyền ({permissions.length})
        </button>
        <button
          className={`permissions-management__tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👤 Phân quyền người dùng ({userRoles.length})
        </button>
      </div>

      <div className="permissions-management__content">
        {activeTab === 'roles' && (
          <div className="permissions-management__roles">
            <div className="permissions-management__roles-grid">
              {roles.map((role) => (
                <div key={role._id} className="role-card">
                  <div className="role-card__header">
                    <h3>{role.name}</h3>
                    {role.isSystem && <span className="role-card__system-badge">Hệ thống</span>}
                  </div>
                  <p className="role-card__description">{role.description}</p>
                  <div className="role-card__stats">
                    <span className="role-card__stat">
                      <strong>{role.userCount}</strong> người dùng
                    </span>
                    <span className="role-card__stat">
                      <strong>{role.permissions.length}</strong> quyền
                    </span>
                  </div>
                  <div className="role-card__permissions">
                    <h4>Quyền:</h4>
                    <div className="role-card__permissions-list">
                      {role.permissions.map((perm) => (
                        <span key={perm} className="role-card__permission">
                          {perm === 'all' ? 'Tất cả quyền' : perm}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="role-card__actions">
                    {!role.isSystem && (
                      <>
                        <button
                          className="role-card__edit-btn"
                          onClick={() => handleEditRole(role)}
                        >
                          Sửa
                        </button>
                        <button
                          className="role-card__delete-btn"
                          onClick={() => handleDeleteRole(role._id)}
                        >
                          Xóa
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'permissions' && (
          <div className="permissions-management__permissions">
            <div className="permissions-management__permissions-table">
              <table>
                <thead>
                  <tr>
                    <th>Quyền</th>
                    <th>Mô tả</th>
                    <th>Danh mục</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {permissions.map((permission) => (
                    <tr key={permission._id}>
                      <td>
                        <code className="permission-name">{permission.name}</code>
                      </td>
                      <td>{permission.description}</td>
                      <td>
                        <span className="permission-category">{permission.category}</span>
                      </td>
                      <td>
                        <span className={`permission-status ${permission.isActive ? 'active' : 'inactive'}`}>
                          {permission.isActive ? 'Hoạt động' : 'Không hoạt động'}
                        </span>
                      </td>
                      <td>
                        <button className="permission-toggle-btn">
                          {permission.isActive ? 'Tắt' : 'Bật'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="permissions-management__users">
            <div className="permissions-management__users-table">
              <table>
                <thead>
                  <tr>
                    <th>Người dùng</th>
                    <th>Email</th>
                    <th>Vai trò hiện tại</th>
                    <th>Được phân quyền bởi</th>
                    <th>Ngày phân quyền</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {userRoles.map((userRole) => (
                    <tr key={userRole._id}>
                      <td>
                        <div className="user-info">
                          <div className="user-avatar">👤</div>
                          <span>{userRole.userName}</span>
                        </div>
                      </td>
                      <td>{userRole.userEmail}</td>
                      <td>
                        <span className="user-role">{userRole.currentRole}</span>
                      </td>
                      <td>{userRole.assignedBy}</td>
                      <td>{new Date(userRole.assignedAt).toLocaleDateString('vi-VN')}</td>
                      <td>
                        <button className="user-role-edit-btn">Thay đổi vai trò</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Role Modal would go here */}
      {showCreateRole && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Tạo Role mới</h3>
            <p>Modal tạo role sẽ được implement ở đây...</p>
            <button onClick={() => setShowCreateRole(false)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PermissionsManagement;
