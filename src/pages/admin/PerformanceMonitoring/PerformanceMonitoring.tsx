import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Memory as MemoryIcon,
  Storage as StorageIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import {
  getSystemOverview,
  getPerformanceMetrics,
  getActivitySummary,
  getSystemLogs,
  getBackupPerformance,
  SystemOverview,
  PerformanceMetrics,
  ActivitySummary,
  SystemLog,
  BackupPerformance,
  PerformanceFilters
} from '../../../services/admin/performanceService';

const PerformanceMonitoring: React.FC = () => {
  // ========== STATE ==========
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Data states
  const [systemOverview, setSystemOverview] = useState<SystemOverview | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [activitySummary, setActivitySummary] = useState<ActivitySummary | null>(null);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [backupPerformance, setBackupPerformance] = useState<BackupPerformance | null>(null);

  // Notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  });

  // ========== API FUNCTIONS ==========
  const loadSystemOverview = useCallback(async () => {
    try {
      const response = await getSystemOverview();
      if (response.success) {
        setSystemOverview(response.data);
      }
    } catch (error: any) {
      console.error('Error loading system overview:', error);
      // Set default data for graceful loading
      setSystemOverview({
        totalUsers: 0,
        totalCourses: 0,
        totalRevenue: 0,
        pendingRefunds: 0,
        systemHealth: {
          database: 'healthy',
          storage: 'healthy',
          email: 'healthy',
          payment: 'healthy'
        }
      });
    }
  }, []);

  const loadPerformanceMetrics = useCallback(async () => {
    try {
      const filters: PerformanceFilters = {
        startDate: selectedTimeRange === '1h' ? new Date(Date.now() - 3600000).toISOString() : undefined,
        endDate: new Date().toISOString()
      };
      const response = await getPerformanceMetrics(filters);
      if (response.success) {
        setPerformanceMetrics(response.data);
      }
    } catch (error: any) {
      console.error('Error loading performance metrics:', error);
      // Set default data for graceful loading
      setPerformanceMetrics({
        totalUsers: 0,
        totalCourses: 0,
        totalEnrollments: 0,
        totalRevenue: 0,
        pendingCourses: 0,
        activeUsers: 0,
        averageRevenue: 0
      });
    }
  }, [selectedTimeRange]);

  const loadActivitySummary = useCallback(async () => {
    try {
      const response = await getActivitySummary();
      if (response.success) {
        setActivitySummary(response.data);
      }
    } catch (error: any) {
      console.error('Error loading activity summary:', error);
      // Set default data for graceful loading
      setActivitySummary({
        byAction: []
      });
    }
  }, []);

  const loadSystemLogs = useCallback(async () => {
    try {
      const filters: PerformanceFilters = {
        level: selectedMetric === 'all' ? undefined : selectedMetric,
        page: page + 1,
        limit: rowsPerPage
      };
      const response = await getSystemLogs(filters);
      if (response.success) {
        setSystemLogs(response.data);
      }
    } catch (error: any) {
      console.error('Error loading system logs:', error);
      setSystemLogs([]);
    }
  }, [selectedMetric, page, rowsPerPage]);

  const loadBackupPerformance = useCallback(async () => {
    try {
      const response = await getBackupPerformance();
      if (response.success) {
        setBackupPerformance(response.data);
      }
    } catch (error: any) {
      console.error('Error loading backup performance:', error);
      // Set default data for graceful loading
      setBackupPerformance({
        lastBackup: new Date().toISOString(),
        nextBackup: new Date(Date.now() + 86400000).toISOString(),
        status: 'scheduled',
        size: 'N/A',
        type: 'N/A'
      });
    }
  }, []);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadSystemOverview(),
        loadPerformanceMetrics(),
        loadActivitySummary(),
        loadSystemLogs(),
        loadBackupPerformance()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [loadSystemOverview, loadPerformanceMetrics, loadActivitySummary, loadSystemLogs, loadBackupPerformance]);

  // ========== EFFECTS ==========
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Auto refresh effect
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadAllData();
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, loadAllData]);

  // ========== HANDLER FUNCTIONS ==========
  const showNotification = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
    showNotification('Đã làm mới dữ liệu', 'success');
  };

  const handleLogPageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return '#dc2626';
      case 'error': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  };


  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">Đang tải dữ liệu hiệu suất...</Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Header */}
      <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: 2 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={2}>
            <Box>
              <Typography variant="h5" fontWeight={800}>Giám sát hiệu suất hệ thống</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Theo dõi và phân tích hiệu suất hệ thống, database và trải nghiệm người dùng</Typography>
            </Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Tooltip title="Làm mới dữ liệu">
                <IconButton color="inherit" onClick={handleRefresh} disabled={refreshing}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <FormControlLabel
                control={<Switch checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} />}
                label="Tự động làm mới"
                sx={{ color: 'white' }}
              />
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel sx={{ color: 'white' }}>Khoảng thời gian</InputLabel>
                <Select
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(Number(e.target.value))}
                  sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' } }}
                >
                  <MenuItem key="10" value={10}>10s</MenuItem>
                  <MenuItem key="30" value={30}>30s</MenuItem>
                  <MenuItem key="60" value={60}>1m</MenuItem>
                  <MenuItem key="300" value={300}>5m</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* System Overview */}
      {systemOverview && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CheckCircleIcon color="success" />
                  <Typography variant="h6" fontWeight={800}>
                    {systemOverview.totalUsers?.toLocaleString() || 0}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">Tổng người dùng</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <MemoryIcon color="primary" />
                  <Typography variant="h6" fontWeight={800}>
                    {systemOverview.totalCourses?.toLocaleString() || 0}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">Tổng khóa học</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <StorageIcon color="secondary" />
                  <Typography variant="h6" fontWeight={800}>
                    {(systemOverview.totalRevenue || 0).toLocaleString('vi-VN')}₫
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">Tổng doanh thu</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <SpeedIcon color="warning" />
                  <Typography variant="h6" fontWeight={800}>
                    {systemOverview.pendingRefunds?.toLocaleString() || 0}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">Hoàn tiền chờ xử lý</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* System Health Status */}
      {systemOverview?.systemHealth && (
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={800} mb={2}>Trạng thái hệ thống</Typography>
            <Grid container spacing={2}>
              {Object.entries(systemOverview.systemHealth).map(([key, value]) => (
                <Grid item xs={6} md={3} key={key}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CheckCircleIcon color={value === 'healthy' ? 'success' : 'error'} />
                    <Typography variant="body2" color="text.secondary">
                      {key === 'database' ? 'Database' :
                        key === 'storage' ? 'Storage' :
                          key === 'email' ? 'Email' :
                            key === 'payment' ? 'Payment' : key}
                    </Typography>
                    <Chip
                      label={value === 'healthy' ? 'Khỏe mạnh' : 'Lỗi'}
                      color={value === 'healthy' ? 'success' : 'error'}
                      size="small"
                    />
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Performance Metrics */}
      {performanceMetrics && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={800} mb={2}>Thống kê người dùng</Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Tổng người dùng</Typography>
                    <Typography variant="h6">{performanceMetrics.totalUsers?.toLocaleString() || 0}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Người dùng hoạt động</Typography>
                    <Typography variant="h6">{performanceMetrics.activeUsers?.toLocaleString() || 0}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Tổng đăng ký khóa học</Typography>
                    <Typography variant="h6">{performanceMetrics.totalEnrollments?.toLocaleString() || 0}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={800} mb={2}>Thống kê doanh thu</Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Tổng doanh thu</Typography>
                    <Typography variant="h6">{(performanceMetrics.totalRevenue || 0).toLocaleString('vi-VN')}₫</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Doanh thu trung bình</Typography>
                    <Typography variant="h6">{(performanceMetrics.averageRevenue || 0).toLocaleString('vi-VN')}₫</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Khóa học chờ duyệt</Typography>
                    <Typography variant="h6">{performanceMetrics.pendingCourses?.toLocaleString() || 0}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Activity Summary */}
      {activitySummary && (
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={800} mb={2}>Hoạt động hệ thống</Typography>
            <Grid container spacing={2}>
              {activitySummary.byAction?.map((action: any, index: number) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card variant="outlined">
                    <CardContent>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Box>
                          <Typography variant="h6" fontWeight={800}>
                            {action.count?.toLocaleString() || 0}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {action._id?.action === 'course_enroll' ? 'Đăng ký khóa học' :
                              action._id?.action === 'user_login' ? 'Đăng nhập' :
                                action._id?.action === 'course_create' ? 'Tạo khóa học' :
                                  action._id?.action || 'Hoạt động khác'}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* System Logs */}
      <Card>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} mb={2}>
            <Typography variant="h6" fontWeight={800}>System Logs</Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Time Range</InputLabel>
                <Select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                >
                  <MenuItem key="1h" value="1h">Last Hour</MenuItem>
                  <MenuItem key="6h" value="6h">Last 6 Hours</MenuItem>
                  <MenuItem key="24h" value="24h">Last 24 Hours</MenuItem>
                  <MenuItem key="7d" value="7d">Last 7 Days</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Level</InputLabel>
                <Select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                >
                  <MenuItem key="all" value="all">All Levels</MenuItem>
                  <MenuItem key="critical" value="critical">Critical</MenuItem>
                  <MenuItem key="error" value="error">Error</MenuItem>
                  <MenuItem key="warning" value="warning">Warning</MenuItem>
                  <MenuItem key="info" value="info">Info</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Stack>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Thời gian</TableCell>
                  <TableCell>Mức độ</TableCell>
                  <TableCell>Loại</TableCell>
                  <TableCell>Hành động</TableCell>
                  <TableCell>Tài nguyên</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {systemLogs?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body2" color="text.secondary">
                        No system logs found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  systemLogs?.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <Typography variant="body2">
                          {log.createdAt ? new Date(log.createdAt).toLocaleString() : 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={log.severity}
                          size="small"
                          sx={{
                            backgroundColor: getLogLevelColor(log.severity),
                            color: 'white',
                            fontWeight: 600
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{log.category}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{log.action}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{log.resource}</Typography>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={systemLogs?.length || 0}
            page={page}
            onPageChange={handleLogPageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="Số dòng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} trong ${count !== -1 ? count : `nhiều hơn ${to}`}`}
          />
        </CardContent>
      </Card>

      {/* Backup Performance */}
      {backupPerformance && (
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={800} mb={2}>Sao lưu hệ thống</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Lần sao lưu cuối</Typography>
                  <Typography variant="h6">
                    {backupPerformance.lastBackup ? new Date(backupPerformance.lastBackup).toLocaleString() : 'N/A'}
                  </Typography>
                  <Chip
                    label={backupPerformance.status || 'unknown'}
                    size="small"
                    color={backupPerformance.status === 'scheduled' ? 'info' : backupPerformance.status === 'completed' ? 'success' : 'warning'}
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Lần sao lưu tiếp theo</Typography>
                  <Typography variant="h6">
                    {backupPerformance.nextBackup ? new Date(backupPerformance.nextBackup).toLocaleString() : 'N/A'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Kích thước</Typography>
                  <Typography variant="h6">
                    {backupPerformance.size || 'N/A'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Loại: {backupPerformance.type || 'N/A'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

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

export default PerformanceMonitoring;