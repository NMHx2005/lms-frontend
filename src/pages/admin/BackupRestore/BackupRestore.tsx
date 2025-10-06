import React, { useState, useEffect, useCallback } from 'react';
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
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
  TablePagination
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Add as AddIcon,
  Schedule as ScheduleIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import {
  BackupJob,
  RestoreJob,
  BackupSchedule,
  BackupSettings,
  getBackups,
  getRestoreJobs,
  getBackupSchedules,
  getBackupSettings,
  updateBackupSettings
} from '../../../services/admin/backupService';


const BackupRestore: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'backups' | 'restore' | 'schedules' | 'settings'>('backups');
  const [backups, setBackups] = useState<BackupJob[]>([]);
  const [restoreJobs, setRestoreJobs] = useState<RestoreJob[]>([]);
  const [schedules, setSchedules] = useState<BackupSchedule[]>([]);
  const [backupSettings, setBackupSettings] = useState<BackupSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateBackup, setShowCreateBackup] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<BackupJob | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalBackups, setTotalBackups] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  });

  // ========== API FUNCTIONS ==========
  const showNotification = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const loadBackups = useCallback(async () => {
    try {
      const response = await getBackups({
        page: page + 1,
        limit: rowsPerPage
      });
      if (response.success) {
        setBackups(response.data.data || []);
        setTotalBackups(response.data.total || 0);
      }
    } catch (error: any) {
      console.error('Error loading backups:', error);
      // Set empty data for graceful loading
      setBackups([]);
      setTotalBackups(0);
    }
  }, [page, rowsPerPage]);

  const loadRestoreJobs = useCallback(async () => {
    try {
      const response = await getRestoreJobs();
      if (response.success) {
        setRestoreJobs(response.data.data || []);
      }
    } catch (error: any) {
      console.error('Error loading restore jobs:', error);
      setRestoreJobs([]);
    }
  }, []);

  const loadBackupSchedules = useCallback(async () => {
    try {
      const response = await getBackupSchedules();
      if (response.success) {
        setSchedules(response.data || []);
      }
    } catch (error: any) {
      console.error('Error loading backup schedules:', error);
      setSchedules([]);
    }
  }, []);

  const loadBackupSettings = useCallback(async () => {
    try {
      const response = await getBackupSettings();
      if (response.success) {
        setBackupSettings(response.data);
      }
    } catch (error: any) {
      console.error('Error loading backup settings:', error);
      setBackupSettings({
        autoCleanup: true,
        maxRetentionDays: 30,
        compressionEnabled: true,
        encryptionEnabled: true,
        notificationEmail: '',
        storageLocation: '',
        maxBackupSize: 1000
      });
    }
  }, []);


  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadBackups(),
        loadRestoreJobs(),
        loadBackupSchedules(),
        loadBackupSettings()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [loadBackups, loadRestoreJobs, loadBackupSchedules, loadBackupSettings]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
    showNotification('Đã làm mới dữ liệu', 'success');
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ========== EFFECTS ==========
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  useEffect(() => {
    loadBackups();
  }, [loadBackups]);

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
              <Tooltip title="Làm mới dữ liệu">
                <IconButton color="inherit" onClick={handleRefresh} disabled={refreshing}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Button variant="contained" onClick={() => setShowCreateBackup(true)} startIcon={<AddIcon />}>
                Tạo backup mới
              </Button>
              <Button variant="outlined" onClick={() => setActiveTab('settings')} startIcon={<SettingsIcon />}>
                Cài đặt
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Stats */}
      <Grid container spacing={2}>
        <Grid item xs={6} md={3}>
          <Card variant="outlined">
            <CardContent>
              <Stack alignItems="center">
                <Typography variant="h6" fontWeight={800}>{totalBackups}</Typography>
                <Typography variant="caption">Tổng backup</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card variant="outlined">
            <CardContent>
              <Stack alignItems="center">
                <Typography variant="h6" fontWeight={800}>
                  {backups?.filter(b => b.status === 'completed').length || 0}
                </Typography>
                <Typography variant="caption">Thành công</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card variant="outlined">
            <CardContent>
              <Stack alignItems="center">
                <Typography variant="h6" fontWeight={800}>
                  {backups?.filter(b => b.status === 'running').length || 0}
                </Typography>
                <Typography variant="caption">Đang chạy</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card variant="outlined">
            <CardContent>
              <Stack alignItems="center">
                <Typography variant="h6" fontWeight={800}>
                  {schedules?.filter(s => s.isActive).length || 0}
                </Typography>
                <Typography variant="caption">Lịch active</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper variant="outlined">
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} variant="scrollable" scrollButtons allowScrollButtonsMobile>
          <Tab value="backups" label={`💾 Backups (${backups?.length || 0})`} />
          <Tab value="restore" label={`🔄 Restore (${restoreJobs?.length || 0})`} />
          <Tab value="schedules" label={`📅 Lịch backup (${schedules?.length || 0})`} />
          <Tab value="settings" label="⚙️ Cài đặt" />
        </Tabs>
      </Paper>

      {/* Backups Tab */}
      {activeTab === 'backups' && (
        <Stack spacing={2}>
          {(!backups || backups.length === 0) ? (
            <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6">Không có backup nào</Typography>
              <Typography variant="body2" color="text.secondary">Chưa có backup nào được tạo.</Typography>
            </Paper>
          ) : (
            backups?.map(backup => (
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
            ))
          )}

          {/* Pagination */}
          {backups && backups.length > 0 && (
            <TablePagination
              component="div"
              count={totalBackups}
              page={page}
              onPageChange={handlePageChange}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPageOptions={[5, 10, 25]}
              labelRowsPerPage="Số dòng mỗi trang:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} trong ${count !== -1 ? count : `nhiều hơn ${to}`}`}
            />
          )}
        </Stack>
      )}

      {/* Restore Tab */}
      {activeTab === 'restore' && (
        <Stack spacing={2}>
          {(!restoreJobs || restoreJobs.length === 0) ? (
            <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6">Không có restore job nào</Typography>
              <Typography variant="body2" color="text.secondary">Chưa có restore job nào được tạo.</Typography>
            </Paper>
          ) : (
            restoreJobs?.map(job => (
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
            ))
          )}
        </Stack>
      )}

      {/* Schedules Tab */}
      {activeTab === 'schedules' && (
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Button variant="contained" onClick={() => setShowScheduleModal(true)} startIcon={<ScheduleIcon />}>
              Tạo lịch mới
            </Button>
            <FormControlLabel
              control={
                <Switch
                  checked={backupSettings?.autoCleanup || false}
                  onChange={(e) => {
                    if (backupSettings) {
                      updateBackupSettings({ autoCleanup: e.target.checked });
                    }
                  }}
                />
              }
              label="Tự động dọn dẹp bản cũ"
            />
          </Stack>
          {(!schedules || schedules.length === 0) ? (
            <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6">Không có lịch backup nào</Typography>
              <Typography variant="body2" color="text.secondary">Chưa có lịch backup nào được tạo.</Typography>
            </Paper>
          ) : (
            schedules?.map(schedule => (
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
            ))
          )}
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

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BackupRestore;
