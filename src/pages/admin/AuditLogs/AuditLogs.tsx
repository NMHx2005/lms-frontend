import React, { useState, useEffect } from 'react';
import './AuditLogs.css';

interface AuditLog {
  _id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'authentication' | 'data_access' | 'data_modification' | 'system' | 'security';
  status: 'success' | 'failure' | 'warning';
  metadata?: Record<string, any>;
}

const AuditLogs: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    severity: 'all',
    category: 'all',
    status: 'all',
    dateRange: '7d',
    userId: ''
  });
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockAuditLogs: AuditLog[] = [
        {
          _id: 'log-1',
          timestamp: '2024-01-15T10:30:00Z',
          userId: 'user-1',
          userName: 'Admin User',
          userEmail: 'admin@lms.com',
          action: 'LOGIN_SUCCESS',
          resource: 'authentication',
          details: 'User logged in successfully',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          severity: 'low',
          category: 'authentication',
          status: 'success'
        },
        {
          _id: 'log-2',
          timestamp: '2024-01-15T10:35:00Z',
          userId: 'user-1',
          userName: 'Admin User',
          userEmail: 'admin@lms.com',
          action: 'USER_ROLE_MODIFIED',
          resource: 'user_management',
          resourceId: 'user-2',
          details: 'Changed user role from Student to Teacher',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          severity: 'medium',
          category: 'data_modification',
          status: 'success',
          metadata: {
            oldRole: 'Student',
            newRole: 'Teacher',
            reason: 'User requested role change'
          }
        },
        {
          _id: 'log-3',
          timestamp: '2024-01-15T10:40:00Z',
          userId: 'user-1',
          userName: 'Admin User',
          userEmail: 'admin@lms.com',
          action: 'COURSE_APPROVED',
          resource: 'course_moderation',
          resourceId: 'course-123',
          details: 'Course "Advanced React Development" approved for publication',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          severity: 'low',
          category: 'data_modification',
          status: 'success'
        },
        {
          _id: 'log-4',
          timestamp: '2024-01-15T10:45:00Z',
          userId: 'user-2',
          userName: 'Moderator User',
          userEmail: 'mod@lms.com',
          action: 'LOGIN_FAILED',
          resource: 'authentication',
          details: 'Failed login attempt - incorrect password',
          ipAddress: '192.168.1.101',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          severity: 'medium',
          category: 'authentication',
          status: 'failure'
        },
        {
          _id: 'log-5',
          timestamp: '2024-01-15T10:50:00Z',
          userId: 'user-1',
          userName: 'Admin User',
          userEmail: 'admin@lms.com',
          action: 'SYSTEM_SETTINGS_MODIFIED',
          resource: 'system_configuration',
          details: 'Modified email server settings',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          severity: 'high',
          category: 'system',
          status: 'success',
          metadata: {
            setting: 'email.smtp.host',
            oldValue: 'smtp.gmail.com',
            newValue: 'smtp.outlook.com'
          }
        },
        {
          _id: 'log-6',
          timestamp: '2024-01-15T11:00:00Z',
          userId: 'user-3',
          userName: 'Regular User',
          userEmail: 'user@lms.com',
          action: 'UNAUTHORIZED_ACCESS_ATTEMPT',
          resource: 'admin_panel',
          details: 'Attempted to access admin panel without proper permissions',
          ipAddress: '192.168.1.102',
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1)',
          severity: 'critical',
          category: 'security',
          status: 'failure'
        }
      ];

      setAuditLogs(mockAuditLogs);
      setFilteredLogs(mockAuditLogs);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = auditLogs;

    if (filters.search) {
      filtered = filtered.filter(log =>
        log.userName.toLowerCase().includes(filters.search.toLowerCase()) ||
        log.action.toLowerCase().includes(filters.search.toLowerCase()) ||
        log.details.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.severity !== 'all') {
      filtered = filtered.filter(log => log.severity === filters.severity);
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(log => log.category === filters.category);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(log => log.status === filters.status);
    }

    if (filters.userId) {
      filtered = filtered.filter(log => log.userId === filters.userId);
    }

    setFilteredLogs(filtered);
  }, [filters, auditLogs]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleLogClick = (log: AuditLog) => {
    setSelectedLog(log);
    setShowDetails(true);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      case 'critical': return '#7c2d12';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return '#10b981';
      case 'failure': return '#ef4444';
      case 'warning': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('vi-VN');
  };

  if (loading) {
    return (
      <div className="audit-logs">
        <div className="audit-logs__loading">
          <div className="loading-spinner"></div>
          <p>Đang tải audit logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="audit-logs">
      <div className="audit-logs__header">
        <div className="audit-logs__title">
          <h1>📋 Audit Logs</h1>
          <p>Lịch sử tất cả thao tác admin, tracking user actions và compliance reporting</p>
        </div>
        <div className="audit-logs__stats">
          <div className="audit-logs__stat">
            <span className="audit-logs__stat-value">{filteredLogs.length}</span>
            <span className="audit-logs__stat-label">Logs</span>
          </div>
          <div className="audit-logs__stat">
            <span className="audit-logs__stat-value">
              {filteredLogs.filter(log => log.severity === 'critical').length}
            </span>
            <span className="audit-logs__stat-label">Critical</span>
          </div>
        </div>
      </div>

      <div className="audit-logs__filters">
        <div className="audit-logs__search">
          <input
            type="text"
            placeholder="Tìm kiếm logs..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="audit-logs__search-input"
          />
        </div>
        <div className="audit-logs__filter-controls">
          <select
            value={filters.severity}
            onChange={(e) => handleFilterChange('severity', e.target.value)}
            className="audit-logs__filter-select"
          >
            <option value="all">Tất cả mức độ</option>
            <option value="low">Thấp</option>
            <option value="medium">Trung bình</option>
            <option value="high">Cao</option>
            <option value="critical">Nghiêm trọng</option>
          </select>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="audit-logs__filter-select"
          >
            <option value="all">Tất cả danh mục</option>
            <option value="authentication">Xác thực</option>
            <option value="data_access">Truy cập dữ liệu</option>
            <option value="data_modification">Sửa đổi dữ liệu</option>
            <option value="system">Hệ thống</option>
            <option value="security">Bảo mật</option>
          </select>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="audit-logs__filter-select"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="success">Thành công</option>
            <option value="failure">Thất bại</option>
            <option value="warning">Cảnh báo</option>
          </select>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="audit-logs__filter-select"
          >
            <option value="1d">1 ngày qua</option>
            <option value="7d">7 ngày qua</option>
            <option value="30d">30 ngày qua</option>
            <option value="90d">90 ngày qua</option>
            <option value="all">Tất cả</option>
          </select>
        </div>
      </div>

      <div className="audit-logs__content">
        <div className="audit-logs__table">
          <table>
            <thead>
              <tr>
                <th>Thời gian</th>
                <th>Người dùng</th>
                <th>Hành động</th>
                <th>Tài nguyên</th>
                <th>Mức độ</th>
                <th>Trạng thái</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log._id} onClick={() => handleLogClick(log)} className="audit-log-row">
                  <td className="audit-log__timestamp">
                    {formatTimestamp(log.timestamp)}
                  </td>
                  <td>
                    <div className="audit-log__user">
                      <span className="audit-log__user-name">{log.userName}</span>
                      <span className="audit-log__user-email">{log.userEmail}</span>
                    </div>
                  </td>
                  <td>
                    <code className="audit-log__action">{log.action}</code>
                  </td>
                  <td>
                    <span className="audit-log__resource">{log.resource}</span>
                    {log.resourceId && (
                      <span className="audit-log__resource-id">#{log.resourceId}</span>
                    )}
                  </td>
                  <td>
                    <span
                      className="audit-log__severity"
                      style={{ backgroundColor: getSeverityColor(log.severity) }}
                    >
                      {log.severity.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span
                      className="audit-log__status"
                      style={{ backgroundColor: getStatusColor(log.status) }}
                    >
                      {log.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <code className="audit-log__ip">{log.ipAddress}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Details Modal */}
      {showDetails && selectedLog && (
        <div className="modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3>Chi tiết Audit Log</h3>
              <button
                className="modal__close-btn"
                onClick={() => setShowDetails(false)}
              >
                ×
              </button>
            </div>
            <div className="modal__content">
              <div className="log-detail">
                <div className="log-detail__section">
                  <h4>Thông tin cơ bản</h4>
                  <div className="log-detail__grid">
                    <div className="log-detail__item">
                      <label>Thời gian:</label>
                      <span>{formatTimestamp(selectedLog.timestamp)}</span>
                    </div>
                    <div className="log-detail__item">
                      <label>Hành động:</label>
                      <code>{selectedLog.action}</code>
                    </div>
                    <div className="log-detail__item">
                      <label>Tài nguyên:</label>
                      <span>{selectedLog.resource}</span>
                    </div>
                    <div className="log-detail__item">
                      <label>Mức độ:</label>
                      <span
                        className="log-detail__severity"
                        style={{ backgroundColor: getSeverityColor(selectedLog.severity) }}
                      >
                        {selectedLog.severity.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="log-detail__section">
                  <h4>Người dùng</h4>
                  <div className="log-detail__grid">
                    <div className="log-detail__item">
                      <label>Tên:</label>
                      <span>{selectedLog.userName}</span>
                    </div>
                    <div className="log-detail__item">
                      <label>Email:</label>
                      <span>{selectedLog.userEmail}</span>
                    </div>
                    <div className="log-detail__item">
                      <label>IP Address:</label>
                      <code>{selectedLog.ipAddress}</code>
                    </div>
                    <div className="log-detail__item">
                      <label>User Agent:</label>
                      <span className="log-detail__user-agent">{selectedLog.userAgent}</span>
                    </div>
                  </div>
                </div>

                <div className="log-detail__section">
                  <h4>Chi tiết</h4>
                  <p className="log-detail__description">{selectedLog.details}</p>
                </div>

                {selectedLog.metadata && (
                  <div className="log-detail__section">
                    <h4>Metadata</h4>
                    <pre className="log-detail__metadata">
                      {JSON.stringify(selectedLog.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
