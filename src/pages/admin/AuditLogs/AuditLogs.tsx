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
  Button
} from '@mui/material';

interface AuditLog { _id: string; timestamp: string; userId: string; userName: string; userEmail: string; action: string; resource: string; resourceId?: string; details: string; ipAddress: string; userAgent: string; severity: 'low' | 'medium' | 'high' | 'critical'; category: 'authentication' | 'data_access' | 'data_modification' | 'system' | 'security'; status: 'success' | 'failure' | 'warning'; metadata?: Record<string, any>; }

const AuditLogs: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', severity: 'all', category: 'all', status: 'all', dateRange: '7d', userId: '' });
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const mockAuditLogs: AuditLog[] = [
        { _id: 'log-1', timestamp: '2024-01-15T10:30:00Z', userId: 'user-1', userName: 'Admin User', userEmail: 'admin@lms.com', action: 'LOGIN_SUCCESS', resource: 'authentication', details: 'User logged in successfully', ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', severity: 'low', category: 'authentication', status: 'success' },
        { _id: 'log-2', timestamp: '2024-01-15T10:35:00Z', userId: 'user-1', userName: 'Admin User', userEmail: 'admin@lms.com', action: 'USER_ROLE_MODIFIED', resource: 'user_management', resourceId: 'user-2', details: 'Changed user role from Student to Teacher', ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', severity: 'medium', category: 'data_modification', status: 'success', metadata: { oldRole: 'Student', newRole: 'Teacher', reason: 'User requested role change' } },
        { _id: 'log-3', timestamp: '2024-01-15T10:40:00Z', userId: 'user-1', userName: 'Admin User', userEmail: 'admin@lms.com', action: 'COURSE_APPROVED', resource: 'course_moderation', resourceId: 'course-123', details: 'Course "Advanced React Development" approved for publication', ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', severity: 'low', category: 'data_modification', status: 'success' },
        { _id: 'log-4', timestamp: '2024-01-15T10:45:00Z', userId: 'user-2', userName: 'Moderator User', userEmail: 'mod@lms.com', action: 'LOGIN_FAILED', resource: 'authentication', details: 'Failed login attempt - incorrect password', ipAddress: '192.168.1.101', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', severity: 'medium', category: 'authentication', status: 'failure' },
        { _id: 'log-5', timestamp: '2024-01-15T10:50:00Z', userId: 'user-1', userName: 'Admin User', userEmail: 'admin@lms.com', action: 'SYSTEM_SETTINGS_MODIFIED', resource: 'system_configuration', details: 'Modified email server settings', ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', severity: 'high', category: 'system', status: 'success', metadata: { setting: 'email.smtp.host', oldValue: 'smtp.gmail.com', newValue: 'smtp.outlook.com' } },
        { _id: 'log-6', timestamp: '2024-01-15T11:00:00Z', userId: 'user-3', userName: 'Regular User', userEmail: 'user@lms.com', action: 'UNAUTHORIZED_ACCESS_ATTEMPT', resource: 'admin_panel', details: 'Attempted to access admin panel without proper permissions', ipAddress: '192.168.1.102', userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1)', severity: 'critical', category: 'security', status: 'failure' }
      ];
      setAuditLogs(mockAuditLogs); setFilteredLogs(mockAuditLogs); setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = auditLogs;
    if (filters.search) filtered = filtered.filter(log => log.userName.toLowerCase().includes(filters.search.toLowerCase()) || log.action.toLowerCase().includes(filters.search.toLowerCase()) || log.details.toLowerCase().includes(filters.search.toLowerCase()));
    if (filters.severity !== 'all') filtered = filtered.filter(log => log.severity === filters.severity);
    if (filters.category !== 'all') filtered = filtered.filter(log => log.category === filters.category);
    if (filters.status !== 'all') filtered = filtered.filter(log => log.status === filters.status);
    if (filters.userId) filtered = filtered.filter(log => log.userId === filters.userId);
    setFilteredLogs(filtered);
  }, [filters, auditLogs]);

  const handleFilterChange = (key: string, value: string) => setFilters(prev => ({ ...prev, [key]: value }));
  const handleLogClick = (log: AuditLog) => { setSelectedLog(log); setShowDetails(true); };

  const formatTimestamp = (timestamp: string) => new Date(timestamp).toLocaleString('vi-VN');

  if (loading) {
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
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Lịch sử thao tác admin và theo dõi hoạt động</Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              <Stack alignItems="center"><Typography variant="h6" fontWeight={800}>{filteredLogs.length}</Typography><Typography variant="caption">Logs</Typography></Stack>
              <Stack alignItems="center"><Typography variant="h6" fontWeight={800}>{filteredLogs.filter(l => l.severity === 'critical').length}</Typography><Typography variant="caption">Critical</Typography></Stack>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Filters */}
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}><TextField fullWidth placeholder="Tìm kiếm logs..." value={filters.search} onChange={(e) => handleFilterChange('search', e.target.value)} /></Grid>
          <Grid item xs={12} sm={6} md={2}><FormControl fullWidth><InputLabel>Mức độ</InputLabel><Select label="Mức độ" value={filters.severity} onChange={(e) => handleFilterChange('severity', String(e.target.value))} MenuProps={{ disableScrollLock: true }}><MenuItem value="all">Tất cả mức độ</MenuItem><MenuItem value="low">Thấp</MenuItem><MenuItem value="medium">Trung bình</MenuItem><MenuItem value="high">Cao</MenuItem><MenuItem value="critical">Nghiêm trọng</MenuItem></Select></FormControl></Grid>
          <Grid item xs={12} sm={6} md={2}><FormControl fullWidth><InputLabel>Danh mục</InputLabel><Select label="Danh mục" value={filters.category} onChange={(e) => handleFilterChange('category', String(e.target.value))} MenuProps={{ disableScrollLock: true }}><MenuItem value="all">Tất cả danh mục</MenuItem><MenuItem value="authentication">Xác thực</MenuItem><MenuItem value="data_access">Truy cập dữ liệu</MenuItem><MenuItem value="data_modification">Sửa đổi dữ liệu</MenuItem><MenuItem value="system">Hệ thống</MenuItem><MenuItem value="security">Bảo mật</MenuItem></Select></FormControl></Grid>
          <Grid item xs={12} sm={6} md={2}><FormControl fullWidth><InputLabel>Trạng thái</InputLabel><Select label="Trạng thái" value={filters.status} onChange={(e) => handleFilterChange('status', String(e.target.value))} MenuProps={{ disableScrollLock: true }}><MenuItem value="all">Tất cả trạng thái</MenuItem><MenuItem value="success">Thành công</MenuItem><MenuItem value="failure">Thất bại</MenuItem><MenuItem value="warning">Cảnh báo</MenuItem></Select></FormControl></Grid>
        </Grid>
      </Paper>

      {/* Table */}
      <Card>
        <CardContent>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Thời gian</TableCell>
                <TableCell>Người dùng</TableCell>
                <TableCell>Hành động</TableCell>
                <TableCell>Tài nguyên</TableCell>
                <TableCell>Mức độ</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>IP Address</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log._id} hover sx={{ cursor: 'pointer' }} onClick={() => handleLogClick(log)}>
                  <TableCell>{formatTimestamp(log.timestamp)}</TableCell>
                  <TableCell>
                    <Stack>
                      <Typography fontWeight={700}>{log.userName}</Typography>
                      <Typography variant="caption" color="text.secondary">{log.userEmail}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell><Chip size="small" variant="outlined" label={log.action} /></TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip size="small" label={log.resource} />
                      {log.resourceId && <Chip size="small" variant="outlined" label={`#${log.resourceId}`} />}
                    </Stack>
                  </TableCell>
                  <TableCell><Chip size="small" color={log.severity === 'critical' ? 'error' : log.severity === 'high' ? 'error' : log.severity === 'medium' ? 'warning' : 'success'} label={log.severity.toUpperCase()} /></TableCell>
                  <TableCell><Chip size="small" color={log.status === 'success' ? 'success' : log.status === 'failure' ? 'error' : 'warning'} label={log.status.toUpperCase()} /></TableCell>
                  <TableCell><Typography component="code">{log.ipAddress}</Typography></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetails && !!selectedLog} onClose={() => setShowDetails(false)} fullWidth maxWidth="md">
        {selectedLog && (
          <>
            <DialogTitle>Chi tiết Audit Log</DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}><Typography variant="body2" color="text.secondary">Thời gian</Typography><Typography fontWeight={700}>{formatTimestamp(selectedLog.timestamp)}</Typography></Grid>
                <Grid item xs={12} md={6}><Typography variant="body2" color="text.secondary">Hành động</Typography><Typography fontWeight={700}>{selectedLog.action}</Typography></Grid>
                <Grid item xs={12} md={6}><Typography variant="body2" color="text.secondary">Tài nguyên</Typography><Typography fontWeight={700}>{selectedLog.resource}</Typography></Grid>
                <Grid item xs={12} md={6}><Typography variant="body2" color="text.secondary">Mức độ</Typography><Chip size="small" label={selectedLog.severity.toUpperCase()} color={selectedLog.severity === 'critical' ? 'error' : selectedLog.severity === 'high' ? 'error' : selectedLog.severity === 'medium' ? 'warning' : 'success'} /></Grid>
                <Grid item xs={12} md={6}><Typography variant="body2" color="text.secondary">Người dùng</Typography><Typography fontWeight={700}>{selectedLog.userName} — {selectedLog.userEmail}</Typography></Grid>
                <Grid item xs={12} md={6}><Typography variant="body2" color="text.secondary">IP</Typography><Typography component="code">{selectedLog.ipAddress}</Typography></Grid>
                <Grid item xs={12}><Typography variant="body2" color="text.secondary">Chi tiết</Typography><Typography>{selectedLog.details}</Typography></Grid>
                {selectedLog.metadata && (<Grid item xs={12}><Typography variant="body2" color="text.secondary">Metadata</Typography><Paper variant="outlined" sx={{ p: 1, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>{JSON.stringify(selectedLog.metadata, null, 2)}</Paper></Grid>)}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowDetails(false)}>Đóng</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default AuditLogs;
