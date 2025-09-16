import React, { useState, useEffect } from 'react';
// import './BackupRestore.css';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Grid,
  Paper,
  Tabs,
  Tab,
  Button,
  Chip,
  Divider,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';

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
  const [autoCleanup, setAutoCleanup] = useState(true);

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

  // const getStatusColor = (status: string) => {
  //   const colors: Record<string, string> = {
  //     pending: '#6b7280',
  //     running: '#3b82f6',
  //     completed: '#10b981',
  //     failed: '#dc2626',
  //     cancelled: '#f59e0b'
  //   };
  //   return colors[status] || '#6b7280';
  // };

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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">Đang tải thông tin backup...</Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Card sx={{ background: 'linear-gradient(135deg, #5b8def 0%, #8b5cf6 100%)', color: 'white', borderRadius: 2 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between" spacing={2}>
            <Box>
              <Typography variant="h5" fontWeight={800}>Backup & Restore</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Quản lý backup database, files và disaster recovery</Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button variant="contained" onClick={handleCreateBackup}>💾 Tạo backup mới</Button>
              <Button variant="outlined">⚙️ Cài đặt</Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        <Grid item xs={6} md={3}><Card variant="outlined"><CardContent><Stack alignItems="center"><Typography variant="h6" fontWeight={800}>{backups.length}</Typography><Typography variant="caption">Tổng backup</Typography></Stack></CardContent></Card></Grid>
        <Grid item xs={6} md={3}><Card variant="outlined"><CardContent><Stack alignItems="center"><Typography variant="h6" fontWeight={800}>{backups.filter(b => b.status === 'completed').length}</Typography><Typography variant="caption">Thành công</Typography></Stack></CardContent></Card></Grid>
        <Grid item xs={6} md={3}><Card variant="outlined"><CardContent><Stack alignItems="center"><Typography variant="h6" fontWeight={800}>{backups.filter(b => b.status === 'running').length}</Typography><Typography variant="caption">Đang chạy</Typography></Stack></CardContent></Card></Grid>
        <Grid item xs={6} md={3}><Card variant="outlined"><CardContent><Stack alignItems="center"><Typography variant="h6" fontWeight={800}>{schedules.filter(s => s.isActive).length}</Typography><Typography variant="caption">Lịch active</Typography></Stack></CardContent></Card></Grid>
      </Grid>

      <Paper variant="outlined">
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} variant="scrollable" scrollButtons allowScrollButtonsMobile>
          <Tab value="backups" label={`💾 Backups (${backups.length})`} />
          <Tab value="restore" label={`🔄 Restore (${restoreJobs.length})`} />
          <Tab value="schedules" label={`📅 Lịch backup (${schedules.length})`} />
          <Tab value="settings" label="⚙️ Cài đặt" />
        </Tabs>
      </Paper>

      {/* Backups Tab */}
      {activeTab === 'backups' && (
        <Stack spacing={2}>
          {backups.map(backup => (
            <Card key={backup.id} variant="outlined">
              <CardContent>
                <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={1}>
                  <Stack spacing={0.5}>
                    <Typography variant="h6" fontWeight={800}>{backup.name}</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip size="small" label={getTypeLabel(backup.type)} />
                      <Chip size="small" color={backup.status === 'completed' ? 'success' : backup.status === 'running' ? 'info' : backup.status === 'failed' ? 'error' : backup.status === 'cancelled' ? 'warning' : 'default'} label={`${getStatusIcon(backup.status)} ${backup.status}`} />
                    </Stack>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    {backup.status === 'completed' && (<Button variant="contained" size="small" onClick={() => handleRestoreBackup(backup)}>🔄 Restore</Button>)}
                    <Button variant="outlined" color="error" size="small" onClick={() => handleDeleteBackup(backup.id)}>🗑️ Xóa</Button>
                  </Stack>
                </Stack>

                <Grid container spacing={2} mt={0.5}>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={0.5}>
                      <Typography variant="body2" color="text.secondary">Kích thước</Typography>
                      <Typography>{formatBytes(backup.size)}</Typography>
                      <Typography variant="body2" color="text.secondary">Ngày tạo</Typography>
                      <Typography>{formatDate(backup.createdAt)}</Typography>
                      {backup.completedAt && (<><Typography variant="body2" color="text.secondary">Hoàn thành</Typography><Typography>{formatDate(backup.completedAt)}</Typography></>)}
                      {backup.duration && (<><Typography variant="body2" color="text.secondary">Thời gian</Typography><Typography>{formatDuration(backup.duration)}</Typography></>)}
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={0.5}>
                      <Typography variant="body2" color="text.secondary">Vị trí</Typography>
                      <Typography>{backup.location}</Typography>
                      <Typography variant="body2" color="text.secondary">Giữ lại</Typography>
                      <Typography>{backup.retention} ngày</Typography>
                      <Typography variant="body2" color="text.secondary">Nén</Typography>
                      <Typography>{backup.compression ? 'Có' : 'Không'}</Typography>
                      <Typography variant="body2" color="text.secondary">Mã hóa</Typography>
                      <Typography>{backup.encryption ? 'Có' : 'Không'}</Typography>
                      {backup.checksum && (<><Typography variant="body2" color="text.secondary">Checksum</Typography><Typography>{backup.checksum}</Typography></>)}
                    </Stack>
                  </Grid>
                </Grid>

                {backup.errorMessage && (
                  <Paper variant="outlined" sx={{ p: 1.5, mt: 1, borderLeft: 4, borderColor: 'error.main' }}>
                    <Stack direction="row" spacing={1} alignItems="center"><Typography>❌</Typography><Typography variant="body2" color="error.main">{backup.errorMessage}</Typography></Stack>
                  </Paper>
                )}
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {/* Restore Tab */}
      {activeTab === 'restore' && (
        <Stack spacing={2}>
          {restoreJobs.map(job => (
            <Paper key={job.id} variant="outlined" sx={{ p: 2 }}>
              <Stack spacing={1}>
                <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
                  <Stack spacing={0.5}>
                    <Typography variant="h6" fontWeight={800}>Restore: {job.backupName}</Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip size="small" label={getTypeLabel(job.type)} />
                      <Chip size="small" color={job.status === 'completed' ? 'success' : job.status === 'running' ? 'info' : job.status === 'failed' ? 'error' : job.status === 'cancelled' ? 'warning' : 'default'} label={`${getStatusIcon(job.status)} ${job.status}`} />
                    </Stack>
                  </Stack>
                </Stack>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={0.5}>
                      <Typography variant="body2" color="text.secondary">Môi trường</Typography>
                      <Typography>{job.targetEnvironment}</Typography>
                      <Typography variant="body2" color="text.secondary">Ngày tạo</Typography>
                      <Typography>{formatDate(job.createdAt)}</Typography>
                      {job.completedAt && (<><Typography variant="body2" color="text.secondary">Hoàn thành</Typography><Typography>{formatDate(job.completedAt)}</Typography></>)}
                      {job.duration && (<><Typography variant="body2" color="text.secondary">Thời gian</Typography><Typography>{formatDuration(job.duration)}</Typography></>)}
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={0.5}>
                      <Typography variant="body2" color="text.secondary">Trạng thái validation</Typography>
                      <Typography>{job.validationStatus === 'passed' ? '✅ Passed' : job.validationStatus === 'failed' ? '❌ Failed' : '⏳ Pending'}</Typography>
                      {job.errorMessage && (<><Typography variant="body2" color="error.main">Lỗi</Typography><Typography color="error.main">{job.errorMessage}</Typography></>)}
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}

      {/* Schedules Tab */}
      {activeTab === 'schedules' && (
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Button variant="contained" onClick={() => setShowScheduleModal(true)}>📅 Tạo lịch mới</Button>
            <FormControlLabel control={<Switch checked={autoCleanup} onChange={(e) => setAutoCleanup(e.target.checked)} />} label="Tự động dọn dẹp bản cũ" />
          </Stack>
          {schedules.map(schedule => (
            <Card key={schedule.id} variant="outlined">
              <CardContent>
                <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={1}>
                  <Stack spacing={0.5}>
                    <Typography variant="h6" fontWeight={800}>{schedule.name}</Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip size="small" label={getTypeLabel(schedule.type)} />
                      <Chip size="small" label={getFrequencyLabel(schedule.frequency)} />
                      <Chip size="small" color={schedule.isActive ? 'success' : 'default'} label={schedule.isActive ? '🟢 Active' : '🔴 Inactive'} />
                    </Stack>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Button variant="outlined" color={schedule.isActive ? 'warning' : 'success'} onClick={() => handleToggleSchedule(schedule.id)}>{schedule.isActive ? '⏸️ Pause' : '▶️ Activate'}</Button>
                    <Button variant="outlined" color="error" onClick={() => handleDeleteSchedule(schedule.id)}>🗑️ Xóa</Button>
                  </Stack>
                </Stack>
                <Grid container spacing={2} mt={0.5}>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={0.5}>
                      <Typography variant="body2" color="text.secondary">Thời gian</Typography>
                      <Typography>{schedule.time}</Typography>
                      {schedule.days && (<><Typography variant="body2" color="text.secondary">Ngày</Typography><Typography>{schedule.days.join(', ')}</Typography></>)}
                      <Typography variant="body2" color="text.secondary">Giữ lại</Typography>
                      <Typography>{schedule.retention} ngày</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={0.5}>
                      <Typography variant="body2" color="text.secondary">Nén</Typography>
                      <Typography>{schedule.compression ? 'Có' : 'Không'}</Typography>
                      <Typography variant="body2" color="text.secondary">Mã hóa</Typography>
                      <Typography>{schedule.encryption ? 'Có' : 'Không'}</Typography>
                      <Typography variant="body2" color="text.secondary">Lần chạy cuối</Typography>
                      <Typography>{schedule.lastRun ? formatDate(schedule.lastRun) : 'Chưa chạy'}</Typography>
                      <Typography variant="body2" color="text.secondary">Lần chạy tiếp theo</Typography>
                      <Typography>{formatDate(schedule.nextRun)}</Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h6">⚙️ Cài đặt Backup & Restore</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Chức năng cài đặt sẽ được phát triển trong phiên bản tiếp theo.</Typography>
          <Divider sx={{ my: 2 }} />
          <Stack spacing={0.5}>
            <Typography>- Cấu hình storage backend (S3, Azure, GCS)</Typography>
            <Typography>- Thiết lập encryption keys</Typography>
            <Typography>- Cấu hình retention policies</Typography>
            <Typography>- Thiết lập monitoring và alerts</Typography>
            <Typography>- Cấu hình disaster recovery</Typography>
          </Stack>
        </Paper>
      )}

      {/* Create Backup Dialog Placeholder */}
      <Dialog open={showCreateBackup} onClose={() => setShowCreateBackup(false)} fullWidth maxWidth="sm">
        <DialogTitle>Tạo backup mới</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">Chọn loại backup và cấu hình (sẽ được bổ sung biểu mẫu thật ở phiên bản sau).</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateBackup(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Restore Dialog Placeholder */}
      <Dialog open={showRestoreModal && Boolean(selectedBackup)} onClose={() => { setShowRestoreModal(false); setSelectedBackup(null); }} fullWidth maxWidth="sm">
        <DialogTitle>Restore Backup</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">Restore: {selectedBackup?.name}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Chức năng restore sẽ được hoàn thiện sau.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setShowRestoreModal(false); setSelectedBackup(null); }}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Schedule Dialog Placeholder */}
      <Dialog open={showScheduleModal} onClose={() => setShowScheduleModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>Tạo lịch backup mới</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">Cấu hình lịch backup tự động (sẽ có form chi tiết sau).</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowScheduleModal(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BackupRestore;
