import React, { useState, useEffect } from 'react';
import './BackupRestore.css';

interface BackupJob {
  id: string;
  name: string;
  type: 'database' | 'files' | 'full';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  size: number;
  createdAt: string;
  completedAt?: string;
  duration?: number;
  location: string;
  retention: number;
  compression: boolean;
  encryption: boolean;
  checksum: string;
  errorMessage?: string;
}

interface RestoreJob {
  id: string;
  backupId: string;
  backupName: string;
  type: 'database' | 'files' | 'full';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
  duration?: number;
  targetEnvironment: string;
  validationStatus: 'pending' | 'passed' | 'failed';
  errorMessage?: string;
}

interface BackupSchedule {
  id: string;
  name: string;
  type: 'database' | 'files' | 'full';
  frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
  time: string;
  days?: string[];
  retention: number;
  compression: boolean;
  encryption: boolean;
  isActive: boolean;
  lastRun?: string;
  nextRun: string;
}

const BackupRestore: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'backups' | 'restore' | 'schedules' | 'settings'>('backups');
  const [backups, setBackups] = useState<BackupJob[]>([]);
  const [restoreJobs, setRestoreJobs] = useState<RestoreJob[]>([]);
  const [schedules, setSchedules] = useState<BackupSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateBackup, setShowCreateBackup] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<BackupJob | null>(null);

  // Mock data
  useEffect(() => {
    const mockBackups: BackupJob[] = [
      {
        id: '1',
        name: 'Daily Database Backup - 2024-12-10',
        type: 'database',
        status: 'completed',
        size: 2.4,
        createdAt: '2024-12-10T02:00:00Z',
        completedAt: '2024-12-10T02:15:00Z',
        duration: 15,
        location: 'S3://backups/database/2024-12-10/',
        retention: 30,
        compression: true,
        encryption: true,
        checksum: 'sha256:abc123...'
      },
      {
        id: '2',
        name: 'Weekly Full Backup - 2024-12-08',
        type: 'full',
        status: 'completed',
        size: 15.7,
        createdAt: '2024-12-08T01:00:00Z',
        completedAt: '2024-12-08T02:30:00Z',
        duration: 90,
        location: 'S3://backups/full/2024-12-08/',
        retention: 90,
        compression: true,
        encryption: true,
        checksum: 'sha256:def456...'
      },
      {
        id: '3',
        name: 'Hourly Database Backup - 2024-12-10T14:00',
        type: 'database',
        status: 'running',
        size: 0,
        createdAt: '2024-12-10T14:00:00Z',
        location: 'S3://backups/database/2024-12-10/14/',
        retention: 7,
        compression: true,
        encryption: true,
        checksum: ''
      },
      {
        id: '4',
        name: 'Monthly Files Backup - 2024-12-01',
        type: 'files',
        status: 'failed',
        size: 0,
        createdAt: '2024-12-01T03:00:00Z',
        location: 'S3://backups/files/2024-12-01/',
        retention: 365,
        compression: true,
        encryption: true,
        checksum: '',
        errorMessage: 'Network timeout during upload'
      }
    ];

    const mockRestoreJobs: RestoreJob[] = [
      {
        id: '1',
        backupId: '2',
        backupName: 'Weekly Full Backup - 2024-12-08',
        type: 'full',
        status: 'completed',
        createdAt: '2024-12-09T10:00:00Z',
        completedAt: '2024-12-09T11:45:00Z',
        duration: 105,
        targetEnvironment: 'staging',
        validationStatus: 'passed'
      },
      {
        id: '2',
        backupId: '1',
        backupName: 'Daily Database Backup - 2024-12-10',
        type: 'database',
        status: 'running',
        createdAt: '2024-12-10T15:00:00Z',
        targetEnvironment: 'development',
        validationStatus: 'pending'
      }
    ];

    const mockSchedules: BackupSchedule[] = [
      {
        id: '1',
        name: 'Daily Database Backup',
        type: 'database',
        frequency: 'daily',
        time: '02:00',
        retention: 30,
        compression: true,
        encryption: true,
        isActive: true,
        lastRun: '2024-12-10T02:00:00Z',
        nextRun: '2024-12-11T02:00:00Z'
      },
      {
        id: '2',
        name: 'Weekly Full Backup',
        type: 'full',
        frequency: 'weekly',
        time: '01:00',
        days: ['sunday'],
        retention: 90,
        compression: true,
        encryption: true,
        isActive: true,
        lastRun: '2024-12-08T01:00:00Z',
        nextRun: '2024-12-15T01:00:00Z'
      },
      {
        id: '3',
        name: 'Hourly Database Backup',
        type: 'database',
        frequency: 'hourly',
        time: '00:00',
        retention: 7,
        compression: true,
        encryption: true,
        isActive: true,
        lastRun: '2024-12-10T14:00:00Z',
        nextRun: '2024-12-10T15:00:00Z'
      },
      {
        id: '4',
        name: 'Monthly Files Backup',
        type: 'files',
        frequency: 'monthly',
        time: '03:00',
        retention: 365,
        compression: true,
        encryption: true,
        isActive: false,
        lastRun: '2024-12-01T03:00:00Z',
        nextRun: '2025-01-01T03:00:00Z'
      }
    ];

    setBackups(mockBackups);
    setRestoreJobs(mockRestoreJobs);
    setSchedules(mockSchedules);
    setLoading(false);
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: '#6b7280',
      running: '#3b82f6',
      completed: '#10b981',
      failed: '#dc2626',
      cancelled: '#f59e0b'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      pending: '⏳',
      running: '🔄',
      completed: '✅',
      failed: '❌',
      cancelled: '⏹️'
    };
    return icons[status] || '⏳';
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      database: 'Database',
      files: 'Files',
      full: 'Full System'
    };
    return labels[type] || type;
  };

  const getFrequencyLabel = (frequency: string) => {
    const labels: Record<string, string> = {
      hourly: 'Hàng giờ',
      daily: 'Hàng ngày',
      weekly: 'Hàng tuần',
      monthly: 'Hàng tháng'
    };
    return labels[frequency] || frequency;
  };

  const handleCreateBackup = () => {
    setShowCreateBackup(true);
  };

  const handleRestoreBackup = (backup: BackupJob) => {
    setSelectedBackup(backup);
    setShowRestoreModal(true);
  };

  const handleDeleteBackup = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa backup này?')) {
      setBackups(prev => prev.filter(b => b.id !== id));
    }
  };

  const handleToggleSchedule = (id: string) => {
    setSchedules(prev => prev.map(s => 
      s.id === id ? { ...s, isActive: !s.isActive } : s
    ));
  };

  const handleDeleteSchedule = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch backup này?')) {
      setSchedules(prev => prev.filter(s => s.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="backup-restore loading">
        <div className="loading-spinner"></div>
        <p>Đang tải thông tin backup...</p>
      </div>
    );
  }

  return (
    <div className="backup-restore">
      <div className="header">
        <div>
          <h1>Backup & Restore</h1>
          <p>Quản lý backup database, files và disaster recovery</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleCreateBackup}>
            <span>💾</span>
            Tạo backup mới
          </button>
          <button className="btn btn-secondary">
            <span>⚙️</span>
            Cài đặt
          </button>
        </div>
      </div>

      <div className="stats">
        <div className="stats-card">
          <div className="stats-icon">💾</div>
          <div className="stats-value">{backups.length}</div>
          <div className="stats-label">Tổng backup</div>
        </div>
        <div className="stats-card">
          <div className="stats-icon">✅</div>
          <div className="stats-value">{backups.filter(b => b.status === 'completed').length}</div>
          <div className="stats-label">Thành công</div>
        </div>
        <div className="stats-card">
          <div className="stats-icon">🔄</div>
          <div className="stats-value">{backups.filter(b => b.status === 'running').length}</div>
          <div className="stats-label">Đang chạy</div>
        </div>
        <div className="stats-card">
          <div className="stats-icon">📅</div>
          <div className="stats-value">{schedules.filter(s => s.isActive).length}</div>
          <div className="stats-label">Lịch active</div>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'backups' ? 'active' : ''}`}
          onClick={() => setActiveTab('backups')}
        >
          💾 Backups ({backups.length})
        </button>
        <button
          className={`tab ${activeTab === 'restore' ? 'active' : ''}`}
          onClick={() => setActiveTab('restore')}
        >
          🔄 Restore ({restoreJobs.length})
        </button>
        <button
          className={`tab ${activeTab === 'schedules' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedules')}
        >
          📅 Lịch backup ({schedules.length})
        </button>
        <button
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Cài đặt
        </button>
      </div>

      {/* Backups Tab */}
      {activeTab === 'backups' && (
        <div className="backups-tab">
          <div className="backups-list">
            {backups.map(backup => (
              <div key={backup.id} className="backup-item">
                <div className="backup-header">
                  <div className="backup-info">
                    <h3 className="backup-name">{backup.name}</h3>
                    <div className="backup-meta">
                      <span className={`backup-type backup-type-${backup.type}`}>
                        {getTypeLabel(backup.type)}
                      </span>
                      <span className={`backup-status backup-status-${backup.status}`}>
                        {getStatusIcon(backup.status)} {backup.status}
                      </span>
                    </div>
                  </div>
                  <div className="backup-actions">
                    {backup.status === 'completed' && (
                      <button
                        className="btn btn-primary"
                        onClick={() => handleRestoreBackup(backup)}
                      >
                        🔄 Restore
                      </button>
                    )}
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteBackup(backup.id)}
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                </div>

                <div className="backup-details">
                  <div className="backup-stats">
                    <div className="stat">
                      <span className="stat-label">Kích thước:</span>
                      <span className="stat-value">{formatBytes(backup.size * 1024 * 1024)}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Ngày tạo:</span>
                      <span className="stat-value">{formatDate(backup.createdAt)}</span>
                    </div>
                    {backup.completedAt && (
                      <div className="stat">
                        <span className="stat-label">Hoàn thành:</span>
                        <span className="stat-value">{formatDate(backup.completedAt)}</span>
                      </div>
                    )}
                    {backup.duration && (
                      <div className="stat">
                        <span className="stat-label">Thời gian:</span>
                        <span className="stat-value">{formatDuration(backup.duration)}</span>
                      </div>
                    )}
                  </div>

                  <div className="backup-properties">
                    <div className="property">
                      <span className="property-label">Vị trí:</span>
                      <span className="property-value">{backup.location}</span>
                    </div>
                    <div className="property">
                      <span className="property-label">Giữ lại:</span>
                      <span className="property-value">{backup.retention} ngày</span>
                    </div>
                    <div className="property">
                      <span className="property-label">Nén:</span>
                      <span className="property-value">{backup.compression ? 'Có' : 'Không'}</span>
                    </div>
                    <div className="property">
                      <span className="property-label">Mã hóa:</span>
                      <span className="property-value">{backup.encryption ? 'Có' : 'Không'}</span>
                    </div>
                    {backup.checksum && (
                      <div className="property">
                        <span className="property-label">Checksum:</span>
                        <span className="property-value">{backup.checksum}</span>
                      </div>
                    )}
                  </div>

                  {backup.errorMessage && (
                    <div className="backup-error">
                      <span className="error-icon">❌</span>
                      <span className="error-message">{backup.errorMessage}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Restore Tab */}
      {activeTab === 'restore' && (
        <div className="restore-tab">
          <div className="restore-jobs">
            {restoreJobs.map(job => (
              <div key={job.id} className="restore-job-item">
                <div className="restore-job-header">
                  <div className="restore-job-info">
                    <h3 className="restore-job-name">Restore: {job.backupName}</h3>
                    <div className="restore-job-meta">
                      <span className={`restore-job-type restore-job-type-${job.type}`}>
                        {getTypeLabel(job.type)}
                      </span>
                      <span className={`restore-job-status restore-job-status-${job.status}`}>
                        {getStatusIcon(job.status)} {job.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="restore-job-details">
                  <div className="restore-job-stats">
                    <div className="stat">
                      <span className="stat-label">Môi trường:</span>
                      <span className="stat-value">{job.targetEnvironment}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Ngày tạo:</span>
                      <span className="stat-value">{formatDate(job.createdAt)}</span>
                    </div>
                    {job.completedAt && (
                      <div className="stat">
                        <span className="stat-label">Hoàn thành:</span>
                        <span className="stat-value">{formatDate(job.completedAt)}</span>
                      </div>
                    )}
                    {job.duration && (
                      <div className="stat">
                        <span className="stat-label">Thời gian:</span>
                        <span className="stat-value">{formatDuration(job.duration)}</span>
                      </div>
                    )}
                  </div>

                  <div className="restore-job-validation">
                    <span className="validation-label">Trạng thái validation:</span>
                    <span className={`validation-status validation-${job.validationStatus}`}>
                      {job.validationStatus === 'passed' ? '✅ Passed' : 
                       job.validationStatus === 'failed' ? '❌ Failed' : '⏳ Pending'}
                    </span>
                  </div>

                  {job.errorMessage && (
                    <div className="restore-job-error">
                      <span className="error-icon">❌</span>
                      <span className="error-message">{job.errorMessage}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Schedules Tab */}
      {activeTab === 'schedules' && (
        <div className="schedules-tab">
          <div className="schedules-header">
            <button className="btn btn-primary" onClick={() => setShowScheduleModal(true)}>
              <span>📅</span>
              Tạo lịch mới
            </button>
          </div>

          <div className="schedules-list">
            {schedules.map(schedule => (
              <div key={schedule.id} className="schedule-item">
                <div className="schedule-header">
                  <div className="schedule-info">
                    <h3 className="schedule-name">{schedule.name}</h3>
                    <div className="schedule-meta">
                      <span className={`schedule-type schedule-type-${schedule.type}`}>
                        {getTypeLabel(schedule.type)}
                      </span>
                      <span className={`schedule-frequency schedule-frequency-${schedule.frequency}`}>
                        {getFrequencyLabel(schedule.frequency)}
                      </span>
                      <span className={`schedule-status ${schedule.isActive ? 'active' : 'inactive'}`}>
                        {schedule.isActive ? '🟢 Active' : '🔴 Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="schedule-actions">
                    <button
                      className={`btn ${schedule.isActive ? 'btn-warning' : 'btn-success'}`}
                      onClick={() => handleToggleSchedule(schedule.id)}
                    >
                      {schedule.isActive ? '⏸️ Pause' : '▶️ Activate'}
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteSchedule(schedule.id)}
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                </div>

                <div className="schedule-details">
                  <div className="schedule-timing">
                    <div className="timing-item">
                      <span className="timing-label">Thời gian:</span>
                      <span className="timing-value">{schedule.time}</span>
                    </div>
                    {schedule.days && (
                      <div className="timing-item">
                        <span className="timing-label">Ngày:</span>
                        <span className="timing-value">{schedule.days.join(', ')}</span>
                      </div>
                    )}
                    <div className="timing-item">
                      <span className="timing-label">Giữ lại:</span>
                      <span className="timing-value">{schedule.retention} ngày</span>
                    </div>
                  </div>

                  <div className="schedule-properties">
                    <div className="property">
                      <span className="property-label">Nén:</span>
                      <span className="property-value">{schedule.compression ? 'Có' : 'Không'}</span>
                    </div>
                    <div className="property">
                      <span className="property-label">Mã hóa:</span>
                      <span className="property-value">{schedule.encryption ? 'Có' : 'Không'}</span>
                    </div>
                  </div>

                  <div className="schedule-runs">
                    <div className="run-info">
                      <span className="run-label">Lần chạy cuối:</span>
                      <span className="run-value">
                        {schedule.lastRun ? formatDate(schedule.lastRun) : 'Chưa chạy'}
                      </span>
                    </div>
                    <div className="run-info">
                      <span className="run-label">Lần chạy tiếp theo:</span>
                      <span className="run-value">{formatDate(schedule.nextRun)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="settings-tab">
          <div className="settings-placeholder">
            <h3>⚙️ Cài đặt Backup & Restore</h3>
            <p>Chức năng cài đặt sẽ được phát triển trong phiên bản tiếp theo.</p>
            <p>Bao gồm:</p>
            <ul>
              <li>Cấu hình storage backend (S3, Azure, GCS)</li>
              <li>Thiết lập encryption keys</li>
              <li>Cấu hình retention policies</li>
              <li>Thiết lập monitoring và alerts</li>
              <li>Cấu hình disaster recovery</li>
            </ul>
          </div>
        </div>
      )}

      {/* Create Backup Modal Placeholder */}
      {showCreateBackup && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Tạo backup mới</h2>
              <p className="modal-subtitle">Chọn loại backup và cấu hình</p>
            </div>
            <div className="modal-content">
              <div className="modal-placeholder">
                <h3>🔄 Modal đang phát triển</h3>
                <p>Chức năng tạo backup sẽ được hoàn thiện trong phiên bản tiếp theo.</p>
                <div className="modal-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowCreateBackup(false)}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Restore Modal Placeholder */}
      {showRestoreModal && selectedBackup && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Restore Backup</h2>
              <p className="modal-subtitle">Restore: {selectedBackup.name}</p>
            </div>
            <div className="modal-content">
              <div className="modal-placeholder">
                <h3>🔄 Modal đang phát triển</h3>
                <p>Chức năng restore backup sẽ được hoàn thiện trong phiên bản tiếp theo.</p>
                <div className="modal-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowRestoreModal(false);
                      setSelectedBackup(null);
                    }}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal Placeholder */}
      {showScheduleModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Tạo lịch backup mới</h2>
              <p className="modal-subtitle">Cấu hình lịch backup tự động</p>
            </div>
            <div className="modal-content">
              <div className="modal-placeholder">
                <h3>🔄 Modal đang phát triển</h3>
                <p>Chức năng tạo lịch backup sẽ được hoàn thiện trong phiên bản tiếp theo.</p>
                <div className="modal-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowScheduleModal(false)}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackupRestore;
