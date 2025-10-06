import React, { useState, useEffect } from 'react';
// import './AuditLogs.css';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Snackbar,
  TablePagination,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import AuditLogsService, {
  AuditLog,
  AuditLogFilters
} from '../../../services/admin/auditLogsService';

const AuditLogs: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<AuditLogFilters>({
    search: '',
    action: 'all',
    resource: 'all',
    dateRange: '7d',
    userId: '',
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' | 'warning' }>({
    open: false,
    message: '',
    severity: 'info'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  // Helper function to convert dateRange to start/end dates
  const getDateRange = (dateRange: string) => {
    const now = new Date();
    const end = now.toISOString();

    switch (dateRange) {
      case '1d':
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        return { start: oneDayAgo.toISOString(), end };
      case '7d':
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return { start: sevenDaysAgo.toISOString(), end };
      case '30d':
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return { start: thirtyDaysAgo.toISOString(), end };
      case '90d':
        const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        return { start: ninetyDaysAgo.toISOString(), end };
      default:
        return { start: undefined, end: undefined };
    }
  };

  // Load data from API
  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading audit logs...', filters);

      // Convert dateRange to start/end parameters
      const { start, end } = getDateRange(filters.dateRange || 'all');
      const apiFilters = {
        ...filters,
        start,
        end,
        // Remove dateRange as it's not supported by backend
        dateRange: undefined
      };

      // Remove empty values
      Object.keys(apiFilters).forEach(key => {
        if (apiFilters[key as keyof typeof apiFilters] === '' || apiFilters[key as keyof typeof apiFilters] === 'all' || apiFilters[key as keyof typeof apiFilters] === undefined) {
          delete apiFilters[key as keyof typeof apiFilters];
        }
      });

      console.log('📤 Sending filters to API:', apiFilters);
      const response = await AuditLogsService.getActivityLogs(apiFilters);
      console.log('📋 Audit Logs Response:', response);

      if (response.success) {
        setAuditLogs(response.data.items || []);
        setPagination({
          page: response.data.page || 1,
          limit: response.data.limit || 20,
          total: response.data.total || 0,
          totalPages: response.data.pages || 0
        });
      }
    } catch (error) {
      console.error('Error loading audit logs:', error);
      showSnackbar('Lỗi khi tải audit logs', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filters.search !== undefined) {
        loadAuditLogs();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters.search]);

  // Other filters effect
  useEffect(() => {
    loadAuditLogs();
  }, [filters.page, filters.limit, filters.sortBy, filters.sortOrder, filters.action, filters.resource, filters.dateRange, filters.userId]);

  // Helper functions
  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleFilterChange = (field: keyof AuditLogFilters, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value, page: 1 }));
    // Search will be handled by useEffect with debounce
    // Other filters will trigger immediate reload via useEffect
  };

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setShowDetails(true);
  };

  const handleExportCSV = async () => {
    try {
      // Convert dateRange to start/end parameters
      const { start, end } = getDateRange(filters.dateRange || 'all');
      const apiFilters = {
        ...filters,
        start,
        end,
        dateRange: undefined
      };

      // Remove empty values
      Object.keys(apiFilters).forEach(key => {
        if (apiFilters[key as keyof typeof apiFilters] === '' || apiFilters[key as keyof typeof apiFilters] === 'all' || apiFilters[key as keyof typeof apiFilters] === undefined) {
          delete apiFilters[key as keyof typeof apiFilters];
        }
      });

      const blob = await AuditLogsService.exportAuditDataCSV(apiFilters);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      showSnackbar('Đã xuất file CSV thành công', 'success');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      showSnackbar('Lỗi khi xuất file CSV', 'error');
    }
  };

  const handleExportPDF = async () => {
    try {
      // Convert dateRange to start/end parameters
      const { start, end } = getDateRange(filters.dateRange || 'all');
      const apiFilters = {
        ...filters,
        start,
        end,
        dateRange: undefined
      };

      // Remove empty values
      Object.keys(apiFilters).forEach(key => {
        if (apiFilters[key as keyof typeof apiFilters] === '' || apiFilters[key as keyof typeof apiFilters] === 'all' || apiFilters[key as keyof typeof apiFilters] === undefined) {
          delete apiFilters[key as keyof typeof apiFilters];
        }
      });

      const blob = await AuditLogsService.exportAuditDataPDF(apiFilters);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `audit-logs-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      showSnackbar('Đã xuất file PDF thành công', 'success');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      showSnackbar('Lỗi khi xuất file PDF', 'error');
    }
  };

  // Pagination handlers
  const handlePageChange = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage + 1 }));
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newLimit = parseInt(event.target.value, 10);
    setFilters(prev => ({ ...prev, limit: newLimit, page: 1 }));
  };

  const getSeverityColor = (severity?: string) => {
    if (!severity) return 'default';
    switch (severity) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status?: string) => {
    if (!status) return 'default';
    switch (status) {
      case 'success': return 'success';
      case 'failure': return 'error';
      case 'warning': return 'warning';
      default: return 'default';
    }
  };

  const getCategoryColor = (category?: string) => {
    if (!category) return 'default';
    switch (category) {
      case 'authentication': return 'primary';
      case 'data_access': return 'info';
      case 'data_modification': return 'warning';
      case 'system': return 'secondary';
      case 'security': return 'error';
      case 'learning': return 'success';
      case 'payment': return 'info';
      case 'enrollment': return 'success';
      default: return 'default';
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'course_enroll': return 'Đăng ký khóa học';
      case 'course_unenroll': return 'Hủy đăng ký khóa học';
      case 'login': return 'Đăng nhập';
      case 'logout': return 'Đăng xuất';
      case 'course_create': return 'Tạo khóa học';
      case 'course_update': return 'Cập nhật khóa học';
      case 'course_delete': return 'Xóa khóa học';
      case 'user_create': return 'Tạo người dùng';
      case 'user_update': return 'Cập nhật người dùng';
      case 'user_delete': return 'Xóa người dùng';
      default: return action.replace(/_/g, ' ').toUpperCase();
    }
  };

  const getResourceLabel = (resource: string) => {
    switch (resource) {
      case 'enrollment': return 'Đăng ký khóa học';
      case 'course': return 'Khóa học';
      case 'user': return 'Người dùng';
      case 'authentication': return 'Xác thực';
      case 'system': return 'Hệ thống';
      default: return resource;
    }
  };

  if (loading && auditLogs.length === 0) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">Đang tải audit logs...</Typography>
        </Stack>
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
              <Typography variant="h5" fontWeight={800}>Audit Logs</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Theo dõi và ghi lại tất cả hoạt động trong hệ thống</Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadAuditLogs}>
                Làm mới
              </Button>
              <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExportCSV}>
                Xuất CSV
              </Button>
              <Button variant="outlined" startIcon={<PdfIcon />} onClick={handleExportPDF}>
                Xuất PDF
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <FilterIcon />
            <Typography variant="h6">Bộ lọc</Typography>
          </Stack>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Tìm kiếm"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Tìm theo user ID, course ID..."
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Hành động</InputLabel>
                <Select
                  value={filters.action}
                  onChange={(e) => handleFilterChange('action', e.target.value)}
                  label="Hành động"
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="course_enroll">Đăng ký khóa học</MenuItem>
                  <MenuItem value="course_unenroll">Hủy đăng ký</MenuItem>
                  <MenuItem value="login">Đăng nhập</MenuItem>
                  <MenuItem value="logout">Đăng xuất</MenuItem>
                  <MenuItem value="course_create">Tạo khóa học</MenuItem>
                  <MenuItem value="course_update">Cập nhật khóa học</MenuItem>
                  <MenuItem value="course_delete">Xóa khóa học</MenuItem>
                  <MenuItem value="user_create">Tạo người dùng</MenuItem>
                  <MenuItem value="user_update">Cập nhật người dùng</MenuItem>
                  <MenuItem value="user_delete">Xóa người dùng</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Tài nguyên</InputLabel>
                <Select
                  value={filters.resource}
                  onChange={(e) => handleFilterChange('resource', e.target.value)}
                  label="Tài nguyên"
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="enrollment">Đăng ký khóa học</MenuItem>
                  <MenuItem value="course">Khóa học</MenuItem>
                  <MenuItem value="user">Người dùng</MenuItem>
                  <MenuItem value="authentication">Xác thực</MenuItem>
                  <MenuItem value="system">Hệ thống</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label="User ID"
                value={filters.userId}
                onChange={(e) => handleFilterChange('userId', e.target.value)}
                placeholder="Nhập User ID..."
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Khoảng thời gian</InputLabel>
                <Select
                  value={filters.dateRange}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                  label="Khoảng thời gian"
                >
                  <MenuItem value="1d">1 ngày</MenuItem>
                  <MenuItem value="7d">7 ngày</MenuItem>
                  <MenuItem value="30d">30 ngày</MenuItem>
                  <MenuItem value="90d">90 ngày</MenuItem>
                  <MenuItem value="all">Tất cả</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={1}>
              <Button
                variant="outlined"
                onClick={() => setFilters({
                  search: '',
                  action: 'all',
                  resource: 'all',
                  dateRange: '7d',
                  userId: '',
                  page: 1,
                  limit: 20,
                  sortBy: 'createdAt',
                  sortOrder: 'desc'
                })}
                size="small"
                fullWidth
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h6">
              Audit Logs ({pagination.total})
            </Typography>
            {loading && (
              <CircularProgress size={20} />
            )}
          </Stack>

          {auditLogs.length > 0 ? (
            <>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Thời gian</TableCell>
                    <TableCell>User ID</TableCell>
                    <TableCell>Hành động</TableCell>
                    <TableCell>Tài nguyên</TableCell>
                    <TableCell>Resource ID</TableCell>
                    <TableCell>Course ID</TableCell>
                    <TableCell>Thời gian tạo</TableCell>
                    <TableCell>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log._id} hover>
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Typography variant="body2" fontWeight={500}>
                            {new Date(log.createdAt).toLocaleString('vi-VN')}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {log.timeSinceCreation}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {log.userId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getActionLabel(log.action)}
                          color={getCategoryColor(log.resource) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getResourceLabel(log.resource)}
                          color={getCategoryColor(log.resource) as any}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {log.resourceId || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {log.courseId || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Typography variant="body2">
                            {log.formattedDuration}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            v{log.__v}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Xem chi tiết">
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetails(log)}
                            color="primary"
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <TablePagination
                component="div"
                count={pagination.total}
                page={pagination.page - 1}
                onPageChange={handlePageChange}
                rowsPerPage={pagination.limit}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPageOptions={[10, 20, 50, 100]}
                labelRowsPerPage="Số hàng mỗi trang:"
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} của ${count !== -1 ? count : `nhiều hơn ${to}`}`
                }
              />
            </>
          ) : (
            <Box textAlign="center" py={4}>
              <Typography variant="body2" color="text.secondary">
                Không có audit logs nào
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetails} onClose={() => setShowDetails(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Chi tiết Audit Log
        </DialogTitle>
        <DialogContent>
          {selectedLog && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="primary">Thông tin cơ bản</Typography>
                  <Stack spacing={1}>
                    <Typography variant="body2"><strong>ID:</strong> {selectedLog._id}</Typography>
                    <Typography variant="body2"><strong>ID (short):</strong> {selectedLog.id}</Typography>
                    <Typography variant="body2"><strong>Thời gian tạo:</strong> {new Date(selectedLog.createdAt).toLocaleString('vi-VN')}</Typography>
                    <Typography variant="body2"><strong>Thời gian từ khi tạo:</strong> {selectedLog.timeSinceCreation}</Typography>
                    <Typography variant="body2"><strong>Hành động:</strong>
                      <Chip label={getActionLabel(selectedLog.action)} color={getCategoryColor(selectedLog.resource) as any} size="small" sx={{ ml: 1 }} />
                    </Typography>
                    <Typography variant="body2"><strong>Tài nguyên:</strong>
                      <Chip label={getResourceLabel(selectedLog.resource)} color={getCategoryColor(selectedLog.resource) as any} size="small" variant="outlined" sx={{ ml: 1 }} />
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="primary">Thông tin liên kết</Typography>
                  <Stack spacing={1}>
                    <Typography variant="body2"><strong>User ID:</strong>
                      <Typography variant="body2" fontFamily="monospace" component="span" sx={{ ml: 1 }}>
                        {selectedLog.userId}
                      </Typography>
                    </Typography>
                    <Typography variant="body2"><strong>Resource ID:</strong>
                      <Typography variant="body2" fontFamily="monospace" component="span" sx={{ ml: 1 }}>
                        {selectedLog.resourceId || 'N/A'}
                      </Typography>
                    </Typography>
                    <Typography variant="body2"><strong>Course ID:</strong>
                      <Typography variant="body2" fontFamily="monospace" component="span" sx={{ ml: 1 }}>
                        {selectedLog.courseId || 'N/A'}
                      </Typography>
                    </Typography>
                    <Typography variant="body2"><strong>Version:</strong> {selectedLog.__v}</Typography>
                    <Typography variant="body2"><strong>Formatted Duration:</strong> {selectedLog.formattedDuration}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="primary">Thông tin bổ sung</Typography>
                  <Stack spacing={1}>
                    {selectedLog.userName && (
                      <Typography variant="body2"><strong>Tên người dùng:</strong> {selectedLog.userName}</Typography>
                    )}
                    {selectedLog.userEmail && (
                      <Typography variant="body2"><strong>Email:</strong> {selectedLog.userEmail}</Typography>
                    )}
                    {selectedLog.details && (
                      <Typography variant="body2"><strong>Chi tiết:</strong> {selectedLog.details}</Typography>
                    )}
                    {selectedLog.ipAddress && (
                      <Typography variant="body2"><strong>IP Address:</strong>
                        <Typography variant="body2" fontFamily="monospace" component="span" sx={{ ml: 1 }}>
                          {selectedLog.ipAddress}
                        </Typography>
                      </Typography>
                    )}
                    {selectedLog.userAgent && (
                      <Typography variant="body2"><strong>User Agent:</strong> {selectedLog.userAgent}</Typography>
                    )}
                    {selectedLog.severity && (
                      <Typography variant="body2"><strong>Mức độ:</strong>
                        <Chip label={selectedLog.severity} color={getSeverityColor(selectedLog.severity) as any} size="small" sx={{ ml: 1 }} />
                      </Typography>
                    )}
                    {selectedLog.category && (
                      <Typography variant="body2"><strong>Danh mục:</strong>
                        <Chip label={selectedLog.category} color={getCategoryColor(selectedLog.category) as any} size="small" sx={{ ml: 1 }} />
                      </Typography>
                    )}
                    {selectedLog.status && (
                      <Typography variant="body2"><strong>Trạng thái:</strong>
                        <Chip label={selectedLog.status} color={getStatusColor(selectedLog.status) as any} size="small" sx={{ ml: 1 }} />
                      </Typography>
                    )}
                    {selectedLog.metadata && (
                      <>
                        <Typography variant="body2"><strong>Metadata:</strong></Typography>
                        <Paper sx={{ p: 1, bgcolor: 'grey.50' }}>
                          <Typography variant="caption" component="pre" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                            {JSON.stringify(selectedLog.metadata, null, 2)}
                          </Typography>
                        </Paper>
                      </>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDetails(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AuditLogs;