import React, { useState, useEffect } from 'react';
// import './SystemSettings.css';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Chip,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  Backup as BackupIcon
} from '@mui/icons-material';
import systemService, { type SystemSettings as SystemSettingsType, SystemOverview, Refund, SystemLog, BackupStatus } from '../../../services/admin/systemService';

// Remove SystemConfig interface as we're using SystemSettings from service

const SystemSettings: React.FC = () => {
  const [config, setConfig] = useState<SystemSettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [hasChanges, setHasChanges] = useState(false);
  const [originalConfig, setOriginalConfig] = useState<SystemSettingsType | null>(null);

  // New states for additional features
  const [overview, setOverview] = useState<SystemOverview | null>(null);
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [backupStatus, setBackupStatus] = useState<BackupStatus | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' | 'warning' }>({
    open: false,
    message: '',
    severity: 'info'
  });
  const [refundDialog, setRefundDialog] = useState<{ open: boolean; refund: Refund | null }>({
    open: false,
    refund: null
  });
  const [refundPage, setRefundPage] = useState(0);
  const [refundRowsPerPage, setRefundRowsPerPage] = useState(10);
  const [refundTotal, setRefundTotal] = useState(0);

  // Load data from API
  const loadData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading system data...');

      const [settingsData, overviewData, refundsData, logsData, backupData] = await Promise.all([
        systemService.getSystemSettings(),
        systemService.getSystemOverview(),
        systemService.getRefunds({ page: 1, limit: 10 }),
        systemService.getSystemLogs({ page: 1, limit: 10 }),
        systemService.getBackupStatus()
      ]);

      console.log('📊 System Settings:', settingsData);
      console.log('📈 System Overview:', overviewData);
      console.log('💰 Refunds:', refundsData);
      console.log('📝 Logs:', logsData);
      console.log('💾 Backup Status:', backupData);

      setConfig(settingsData);
      setOriginalConfig(settingsData);
      setOverview(overviewData);
      setRefunds(refundsData.data || []);
      setRefundTotal(refundsData.pagination?.total || 0);
      setLogs(logsData.data || []);
      setBackupStatus(backupData);
    } catch (error) {
      console.error('Error loading system data:', error);
      showSnackbar('Lỗi khi tải dữ liệu hệ thống', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (config && originalConfig) setHasChanges(JSON.stringify(config) !== JSON.stringify(originalConfig));
  }, [config, originalConfig]);

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleInputChange = (field: keyof SystemSettingsType, value: any) => {
    if (!config) return;
    setConfig(prev => ({
      ...prev!,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!config) return;
    try {
      setSaving(true);
      const updatedSettings = await systemService.updateSystemSettings(config);
      setConfig(updatedSettings);
      setOriginalConfig(updatedSettings);
      setHasChanges(false);
      showSnackbar('Cài đặt đã được lưu thành công!', 'success');
    } catch (error) {
      console.error('Error saving settings:', error);
      showSnackbar('Lỗi khi lưu cài đặt', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (originalConfig) {
      setConfig(originalConfig);
      setHasChanges(false);
    }
  };


  const handleProcessRefund = async (refundId: string, action: 'approve' | 'reject') => {
    try {
      await systemService.processRefund(refundId, { action });
      showSnackbar(`Đã ${action === 'approve' ? 'phê duyệt' : 'từ chối'} hoàn tiền thành công`, 'success');
      loadData(); // Reload data
    } catch (error) {
      console.error('Error processing refund:', error);
      showSnackbar('Lỗi khi xử lý hoàn tiền', 'error');
    }
  };

  const handleCreateBackup = async () => {
    try {
      setSaving(true);
      await systemService.createBackup();
      showSnackbar('Tạo backup thành công!', 'success');
      loadData(); // Reload data
    } catch (error) {
      console.error('Error creating backup:', error);
      showSnackbar('Lỗi khi tạo backup', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">Đang tải cài đặt hệ thống...</Typography>
        </Stack>
      </Box>
    );
  }

  if (!config) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
        <Typography variant="h6" color="text.secondary">Không thể tải cài đặt hệ thống</Typography>
        <Button variant="contained" onClick={loadData}>
          Thử lại
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Header */}
      <Card sx={{ background: 'linear-gradient(135deg, #5b8def 0%, #8b5cf6 100%)', color: 'white', borderRadius: 2 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={2}>
            <Box>
              <Typography variant="h5" fontWeight={800}>Cài đặt hệ thống</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Quản lý cấu hình toàn bộ hệ thống LMS</Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              {hasChanges && (<Button variant="outlined" onClick={handleReset} disabled={saving}>Khôi phục</Button>)}
              <Button variant="contained" onClick={handleSave} disabled={saving || !hasChanges}>{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* System Overview */}
      {overview ? (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ p: 1, backgroundColor: 'primary.main', borderRadius: 1, color: 'white' }}>
                    <Typography variant="h6">👥</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={700}>{overview.totalUsers?.toLocaleString() || '0'}</Typography>
                    <Typography variant="body2" color="text.secondary">Tổng người dùng</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ p: 1, backgroundColor: 'success.main', borderRadius: 1, color: 'white' }}>
                    <Typography variant="h6">📚</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={700}>{overview.totalCourses?.toLocaleString() || '0'}</Typography>
                    <Typography variant="body2" color="text.secondary">Tổng khóa học</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ p: 1, backgroundColor: 'warning.main', borderRadius: 1, color: 'white' }}>
                    <Typography variant="h6">💰</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={700}>{overview.totalRevenue?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '0 VND'}</Typography>
                    <Typography variant="body2" color="text.secondary">Tổng doanh thu</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ p: 1, backgroundColor: 'success.main', borderRadius: 1, color: 'white' }}>
                    <Typography variant="h6">⚡</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={700}>Tốt</Typography>
                    <Typography variant="body2" color="text.secondary">Trạng thái hệ thống</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Card>
          <CardContent>
            <Typography variant="h6" color="text.secondary" textAlign="center">
              Đang tải thông tin hệ thống...
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Paper variant="outlined">
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} variant="scrollable" scrollButtons allowScrollButtonsMobile>
          <Tab value="general" label="Chung" />
          <Tab value="storage" label="Lưu trữ" />
          <Tab value="refunds" label="Hoàn tiền" />
          <Tab value="logs" label="Logs" />
          <Tab value="backup" label="Backup" />
        </Tabs>
      </Paper>

      {/* General */}
      {activeTab === 'general' && (
        <Card><CardContent>
          <Typography variant="subtitle1" fontWeight={700} mb={2}>Cài đặt chung</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tên website"
                value={config.siteName || ''}
                onChange={(e) => handleInputChange('siteName', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.maintenanceMode || false}
                    onChange={(e) => handleInputChange('maintenanceMode', e.target.checked)}
                  />
                }
                label="Chế độ bảo trì"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.emailNotifications || false}
                    onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                  />
                }
                label="Bật thông báo email"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.paymentEnabled || false}
                    onChange={(e) => handleInputChange('paymentEnabled', e.target.checked)}
                  />
                }
                label="Bật thanh toán"
              />
            </Grid>
          </Grid>
        </CardContent></Card>
      )}


      {/* Storage */}
      {activeTab === 'storage' && (
        <Card><CardContent>
          <Typography variant="subtitle1" fontWeight={700} mb={2}>Cài đặt lưu trữ</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Kích thước file tối đa (bytes)"
                inputProps={{ min: 1024, max: 104857600 }}
                value={config.maxFileSize || 10485760}
                onChange={(e) => handleInputChange('maxFileSize', parseInt(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Loại file được phép"
                helperText="Phân cách bằng dấu phẩy"
                value={config.allowedFileTypes?.join(', ') || ''}
                onChange={(e) => handleInputChange('allowedFileTypes', e.target.value.split(',').map(t => t.trim()))}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Kích thước file hiện tại: {(config.maxFileSize / 1024 / 1024).toFixed(2)} MB
              </Typography>
            </Grid>
          </Grid>
        </CardContent></Card>
      )}

      {/* Refunds Tab */}
      {activeTab === 'refunds' && (
        <Card>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="subtitle1" fontWeight={700}>Quản lý hoàn tiền</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  Tổng: {refundTotal} | Đã tải: {refunds.length}
                </Typography>
                <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadData}>
                  Làm mới
                </Button>
              </Stack>
            </Stack>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Người dùng</TableCell>
                    <TableCell>Khóa học</TableCell>
                    <TableCell>Số tiền</TableCell>
                    <TableCell>Lý do</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Ngày yêu cầu</TableCell>
                    <TableCell>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {refunds.length > 0 ? (
                    refunds.map((refund) => (
                      <TableRow key={refund._id}>
                        <TableCell>
                          <Stack>
                            <Typography variant="body2" fontWeight={600}>{refund.user?.name || 'N/A'}</Typography>
                            <Typography variant="caption" color="text.secondary">{refund.user?.email || 'N/A'}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>{refund.course?.title || 'N/A'}</TableCell>
                        <TableCell>{refund.amount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '0 VND'}</TableCell>
                        <TableCell>{refund.reason || 'N/A'}</TableCell>
                        <TableCell>
                          <Chip
                            label={refund.status === 'pending' ? 'Chờ xử lý' : refund.status === 'approved' ? 'Đã phê duyệt' : refund.status === 'rejected' ? 'Đã từ chối' : 'Không xác định'}
                            color={refund.status === 'pending' ? 'warning' : refund.status === 'approved' ? 'success' : refund.status === 'rejected' ? 'error' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{refund.requestedAt ? new Date(refund.requestedAt).toLocaleDateString('vi-VN') : '-'}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Tooltip title="Xem chi tiết">
                              <IconButton size="small" onClick={() => setRefundDialog({ open: true, refund })}>
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                            {refund.status === 'pending' && (
                              <>
                                <Tooltip title="Phê duyệt">
                                  <IconButton size="small" color="success" onClick={() => handleProcessRefund(refund._id, 'approve')}>
                                    <CheckCircleIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Từ chối">
                                  <IconButton size="small" color="error" onClick={() => handleProcessRefund(refund._id, 'reject')}>
                                    <CancelIcon />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Stack spacing={2} alignItems="center">
                          <Typography variant="body2" color="text.secondary">
                            Không có dữ liệu hoàn tiền
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Có thể database chưa có dữ liệu hoặc API chưa hoạt động
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={refundTotal}
              page={refundPage}
              onPageChange={(_, newPage) => setRefundPage(newPage)}
              rowsPerPage={refundRowsPerPage}
              onRowsPerPageChange={(e) => setRefundRowsPerPage(parseInt(e.target.value, 10))}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </CardContent>
        </Card>
      )}

      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <Card>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="subtitle1" fontWeight={700}>System Logs</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  Đã tải: {logs.length} logs
                </Typography>
                <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadData}>
                  Làm mới
                </Button>
              </Stack>
            </Stack>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Action</TableCell>
                    <TableCell>Resource</TableCell>
                    <TableCell>User ID</TableCell>
                    <TableCell>IP Address</TableCell>
                    <TableCell>Severity</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logs.length > 0 ? (
                    logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>{log.resource}</TableCell>
                        <TableCell>{log.userId}</TableCell>
                        <TableCell>{log.ipAddress}</TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={log.severity}
                            color={log.severity === 'high' ? 'error' : log.severity === 'medium' ? 'warning' : 'success'}
                          />
                        </TableCell>
                        <TableCell>{log.category}</TableCell>
                        <TableCell>{new Date(log.createdAt).toLocaleString('vi-VN')}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Stack spacing={2} alignItems="center">
                          <Typography variant="body2" color="text.secondary">
                            Không có dữ liệu logs
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Có thể database chưa có dữ liệu hoặc API chưa hoạt động
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Backup Tab */}
      {activeTab === 'backup' && (
        <Card>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="subtitle1" fontWeight={700}>Quản lý Backup</Typography>
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadData}>
                  Làm mới
                </Button>
                <Button variant="contained" startIcon={<BackupIcon />} onClick={handleCreateBackup} disabled={saving}>
                  Tạo Backup
                </Button>
              </Stack>
            </Stack>
            {backupStatus ? (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Thông tin Backup</Typography>
                      <Stack spacing={1}>
                        <Box>
                          <Typography variant="body2" component="span">
                            <strong>Lần backup cuối:</strong> {backupStatus.lastBackup ? new Date(backupStatus.lastBackup).toLocaleString('vi-VN') : 'Chưa có'}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" component="span">
                            <strong>Lần backup tiếp theo:</strong> {backupStatus.nextBackup ? new Date(backupStatus.nextBackup).toLocaleString('vi-VN') : 'Chưa có'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" component="span">
                            <strong>Trạng thái:</strong>
                          </Typography>
                          <Chip
                            label={backupStatus.status === 'scheduled' ? 'Đã lên lịch' : backupStatus.status === 'success' ? 'Thành công' : backupStatus.status === 'failed' ? 'Thất bại' : backupStatus.status === 'in_progress' ? 'Đang xử lý' : 'Không xác định'}
                            color={backupStatus.status === 'scheduled' ? 'info' : backupStatus.status === 'success' ? 'success' : backupStatus.status === 'failed' ? 'error' : backupStatus.status === 'in_progress' ? 'warning' : 'default'}
                            size="small"
                          />
                        </Box>
                        <Box>
                          <Typography variant="body2" component="span">
                            <strong>Kích thước:</strong> {backupStatus.size || '0'}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" component="span">
                            <strong>Loại:</strong> {backupStatus.type || 'N/A'}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            ) : (
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" color="text.secondary" textAlign="center">
                    Đang tải thông tin backup...
                  </Typography>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      )}

      {/* Refund Detail Dialog */}
      <Dialog open={refundDialog.open} onClose={() => setRefundDialog({ open: false, refund: null })} maxWidth="md" fullWidth>
        <DialogTitle>Chi tiết yêu cầu hoàn tiền</DialogTitle>
        <DialogContent>
          {refundDialog.refund && (
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" component="span">
                  <strong>Người dùng:</strong> {refundDialog.refund.user?.name || 'N/A'} ({refundDialog.refund.user?.email || 'N/A'})
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" component="span">
                  <strong>Khóa học:</strong> {refundDialog.refund.course?.title || 'N/A'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" component="span">
                  <strong>Số tiền:</strong> {refundDialog.refund.amount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '0 VND'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" component="span">
                  <strong>Lý do:</strong> {refundDialog.refund.reason || 'N/A'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" component="span">
                  <strong>Trạng thái:</strong>
                </Typography>
                <Chip
                  label={refundDialog.refund.status === 'pending' ? 'Chờ xử lý' : refundDialog.refund.status === 'approved' ? 'Đã phê duyệt' : refundDialog.refund.status === 'rejected' ? 'Đã từ chối' : 'Không xác định'}
                  color={refundDialog.refund.status === 'pending' ? 'warning' : refundDialog.refund.status === 'approved' ? 'success' : refundDialog.refund.status === 'rejected' ? 'error' : 'default'}
                  size="small"
                />
              </Box>
              <Box>
                <Typography variant="body2" component="span">
                  <strong>Ngày yêu cầu:</strong> {refundDialog.refund.requestedAt ? new Date(refundDialog.refund.requestedAt).toLocaleString('vi-VN') : '-'}
                </Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRefundDialog({ open: false, refund: null })}>Đóng</Button>
          {refundDialog.refund?.status === 'pending' && (
            <>
              <Button color="error" onClick={() => {
                handleProcessRefund(refundDialog.refund!._id, 'reject');
                setRefundDialog({ open: false, refund: null });
              }}>
                Từ chối
              </Button>
              <Button color="success" onClick={() => {
                handleProcessRefund(refundDialog.refund!._id, 'approve');
                setRefundDialog({ open: false, refund: null });
              }}>
                Phê duyệt
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Save Status */}
      {hasChanges && (
        <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={1} alignItems="center"><Chip label="Có thay đổi chưa lưu" color="warning" variant="outlined" /></Stack>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={handleReset} disabled={saving}>Khôi phục</Button>
            <Button variant="contained" onClick={handleSave} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</Button>
          </Stack>
        </Paper>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
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

export default SystemSettings;
