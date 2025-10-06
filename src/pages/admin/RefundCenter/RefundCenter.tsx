import React, { useState, useEffect } from 'react';
// import './RefundCenter.css';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  CircularProgress,
  Avatar,
  Checkbox,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SettingsIcon from '@mui/icons-material/Settings';
import RefundService, { RefundRequest, RefundFilters as RefundFiltersType, ProcessRefundData, RefundStats } from '../../../services/admin/refundService';

interface RefundFiltersState {
  search: string;
  status: string;
  refundMethod: string;
  dateRange: string;
}

const RefundCenter: React.FC = () => {
  const [refunds, setRefunds] = useState<RefundRequest[]>([]);
  const [filteredRefunds, setFilteredRefunds] = useState<RefundRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [_refundStats, setRefundStats] = useState<RefundStats | null>(null);
  const [pagination, setPagination] = useState({
    page: 0,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState<RefundFiltersState>({
    search: '',
    status: 'all',
    refundMethod: 'all',
    dateRange: 'all'
  });
  const [selectedRefunds, setSelectedRefunds] = useState<string[]>([]);
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [processNotes, setProcessNotes] = useState('');
  const [processAction, setProcessAction] = useState<'approve' | 'reject'>('approve');
  const [_actionLoading, setActionLoading] = useState(false);

  // Load refunds data
  const loadRefunds = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiFilters: RefundFiltersType = {
        search: filters.search,
        status: filters.status !== 'all' ? filters.status : undefined,
        refundMethod: filters.refundMethod !== 'all' ? filters.refundMethod : undefined,
        dateRange: filters.dateRange !== 'all' ? filters.dateRange : undefined,
        page: pagination.page + 1,
        limit: pagination.limit,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };

      const [refundsResponse, statsResponse] = await Promise.all([
        RefundService.getRefunds(apiFilters),
        RefundService.getRefundStats()
      ]);

      if (refundsResponse.success) {
        setRefunds(refundsResponse.data.data || []);
        setPagination(prev => ({
          ...prev,
          total: refundsResponse.data.pagination?.total || 0,
          totalPages: refundsResponse.data.pagination?.pages || 0
        }));
      }

      if (statsResponse.success) {
        setRefundStats(statsResponse.data);
      }
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu refunds');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRefunds();
  }, [filters, pagination.page, pagination.limit]);


  // Use API data directly, no client-side filtering needed
  useEffect(() => {
    setFilteredRefunds(refunds);
  }, [refunds]);

  const handleFilterChange = (newFilters: Partial<RefundFiltersState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 0 })); // Reset to first page when filters change
  };

  const handleRefundSelection = (refundId: string) => {
    setSelectedRefunds(prev =>
      prev.includes(refundId)
        ? prev.filter(id => id !== refundId)
        : [...prev, refundId]
    );
  };

  const handleBulkAction = async (action: 'approve' | 'reject') => {
    if (selectedRefunds.length === 0) return;

    const actionText = action === 'approve' ? 'duyệt' : 'từ chối';
    if (confirm(`Bạn có chắc chắn muốn ${actionText} ${selectedRefunds.length} yêu cầu hoàn tiền đã chọn?`)) {
      try {
        setActionLoading(true);
        setError(null);

        const processData: ProcessRefundData = {
          action,
          notes: `Bulk ${action} - ${selectedRefunds.length} refunds`
        };

        const response = await RefundService.bulkProcessRefunds(selectedRefunds, processData);

        if (response.success) {
          setSuccessMessage(`${actionText.charAt(0).toUpperCase() + actionText.slice(1)} thành công ${selectedRefunds.length} yêu cầu hoàn tiền`);
          setSelectedRefunds([]);
          loadRefunds(); // Reload data
        } else {
          setError(response.error || `Không thể ${actionText} yêu cầu hoàn tiền`);
        }
      } catch (err: any) {
        setError(err.message || `Không thể ${actionText} yêu cầu hoàn tiền`);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleProcessRefund = (refund: RefundRequest, action: 'approve' | 'reject') => {
    setSelectedRefund(refund);
    setProcessAction(action);
    setProcessNotes('');
    setShowProcessModal(true);
  };

  const handleSubmitProcess = async () => {
    if (!selectedRefund) return;

    try {
      setActionLoading(true);
      setError(null);

      const processData: ProcessRefundData = {
        action: processAction,
        notes: processNotes
      };

      const response = await RefundService.processRefund(selectedRefund._id, processData);

      if (response.success) {
        const actionText = processAction === 'approve' ? 'Duyệt' : 'Từ chối';
        setSuccessMessage(`${actionText} thành công yêu cầu hoàn tiền`);
        setShowProcessModal(false);
        setSelectedRefund(null);
        setProcessNotes('');
        loadRefunds(); // Reload data
      } else {
        setError(response.error || `Không thể ${processAction} yêu cầu hoàn tiền`);
      }
    } catch (err: any) {
      setError(err.message || `Không thể ${processAction} yêu cầu hoàn tiền`);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: 'Chờ xử lý',
      approved: 'Đã duyệt',
      rejected: 'Đã từ chối',
      completed: 'Hoàn thành'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getRefundMethodLabel = (method: string) => {
    const labels = {
      original_payment: 'Hoàn về phương thức gốc',
      credit: 'Tín dụng nội bộ',
      bank_transfer: 'Chuyển khoản ngân hàng'
    };
    return labels[method as keyof typeof labels] || method;
  };

  const _handleRefresh = () => {
    loadRefunds();
  };

  const _handleExportCSV = async () => {
    try {
      setActionLoading(true);
      setError(null);

      const apiFilters: RefundFiltersType = {
        search: filters.search,
        status: filters.status !== 'all' ? filters.status : undefined,
        refundMethod: filters.refundMethod !== 'all' ? filters.refundMethod : undefined,
        dateRange: filters.dateRange !== 'all' ? filters.dateRange : undefined
      };

      try {
        const blob = await RefundService.exportRefunds(apiFilters);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `refunds_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        setSuccessMessage('Xuất CSV thành công');
      } catch (serverError) {
        // Fallback to client-side export
        RefundService.exportRefundsToCSV(refunds);
        setSuccessMessage('Xuất CSV thành công (client-side)');
      }
    } catch (err: any) {
      setError(err.message || 'Không thể xuất CSV');
    } finally {
      setActionLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => new Date(dateString).toLocaleString('vi-VN');

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">Đang tải dữ liệu...</Typography>
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
              <Typography variant="h5" fontWeight={800}>Trung tâm hoàn tiền</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Quản lý các yêu cầu hoàn tiền từ học viên</Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button variant="contained" color="inherit" startIcon={<AutorenewIcon />} sx={{ color: '#111827' }} onClick={() => window.location.reload()}>Làm mới</Button>
              <Button variant="contained" color="inherit" startIcon={<FileDownloadIcon />} sx={{ color: '#111827' }}>Xuất Excel</Button>
              <Button variant="contained" color="inherit" startIcon={<SettingsIcon />} sx={{ color: '#111827' }}>Cài đặt</Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Stats */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}><Card><CardContent><Stack direction="row" spacing={2} alignItems="center"><Avatar>⏳</Avatar><Box><Typography variant="h6" fontWeight={700}>{refunds?.filter(r => r.status === 'pending').length || 0}</Typography><Typography variant="body2" color="text.secondary">Chờ xử lý</Typography></Box></Stack></CardContent></Card></Grid>
        <Grid item xs={12} sm={6} md={3}><Card><CardContent><Stack direction="row" spacing={2} alignItems="center"><Avatar>✅</Avatar><Box><Typography variant="h6" fontWeight={700}>{refunds?.filter(r => r.status === 'approved').length || 0}</Typography><Typography variant="body2" color="text.secondary">Đã duyệt</Typography></Box></Stack></CardContent></Card></Grid>
        <Grid item xs={12} sm={6} md={3}><Card><CardContent><Stack direction="row" spacing={2} alignItems="center"><Avatar>❌</Avatar><Box><Typography variant="h6" fontWeight={700}>{refunds?.filter(r => r.status === 'rejected').length || 0}</Typography><Typography variant="body2" color="text.secondary">Đã từ chối</Typography></Box></Stack></CardContent></Card></Grid>
        <Grid item xs={12} sm={6} md={3}><Card><CardContent><Stack direction="row" spacing={2} alignItems="center"><Avatar>💰</Avatar><Box><Typography variant="h6" fontWeight={700}>{formatCurrency(refunds?.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.amount, 0) || 0)}</Typography><Typography variant="body2" color="text.secondary">Tổng hoàn tiền</Typography></Box></Stack></CardContent></Card></Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField fullWidth placeholder="Tìm kiếm theo khóa học, học viên hoặc mã đơn hàng..." value={filters.search} onChange={(e) => handleFilterChange({ search: e.target.value })} InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }} />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select label="Trạng thái" value={filters.status} onChange={(e) => handleFilterChange({ status: e.target.value })} MenuProps={{ disableScrollLock: true }}>
                <MenuItem value="all">Tất cả trạng thái</MenuItem>
                <MenuItem value="pending">Chờ xử lý</MenuItem>
                <MenuItem value="approved">Đã duyệt</MenuItem>
                <MenuItem value="rejected">Đã từ chối</MenuItem>
                <MenuItem value="completed">Hoàn thành</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Phương thức</InputLabel>
              <Select label="Phương thức" value={filters.refundMethod} onChange={(e) => handleFilterChange({ refundMethod: e.target.value })} MenuProps={{ disableScrollLock: true }}>
                <MenuItem value="all">Tất cả phương thức</MenuItem>
                <MenuItem value="original_payment">Hoàn về phương thức gốc</MenuItem>
                <MenuItem value="credit">Tín dụng nội bộ</MenuItem>
                <MenuItem value="bank_transfer">Chuyển khoản ngân hàng</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Thời gian</InputLabel>
              <Select label="Thời gian" value={filters.dateRange} onChange={(e) => handleFilterChange({ dateRange: e.target.value })} MenuProps={{ disableScrollLock: true }}>
                <MenuItem value="all">Tất cả thời gian</MenuItem>
                <MenuItem value="today">Hôm nay</MenuItem>
                <MenuItem value="week">7 ngày qua</MenuItem>
                <MenuItem value="month">30 ngày qua</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Bulk Actions */}
      {selectedRefunds.length > 0 && (
        <Paper sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip color="primary" label={`Đã chọn ${selectedRefunds.length} yêu cầu hoàn tiền`} />
            <Button onClick={() => setSelectedRefunds([])}>Bỏ chọn tất cả</Button>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button variant="contained" color="success" onClick={() => handleBulkAction('approve')}>Duyệt ({selectedRefunds.length})</Button>
            <Button variant="outlined" color="error" onClick={() => handleBulkAction('reject')}>Từ chối ({selectedRefunds.length})</Button>
          </Stack>
        </Paper>
      )}

      {/* Refund list */}
      <Grid container spacing={2}>
        {filteredRefunds.map((refund) => (
          <Grid key={refund._id} item xs={12}>
            <Card>
              <CardContent>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <Stack alignItems="center" spacing={1}>
                    <Checkbox checked={selectedRefunds.includes(refund._id)} onChange={() => handleRefundSelection(refund._id)} />
                    <Chip label={getStatusLabel(refund.status)} color={refund.status === 'pending' ? 'warning' : refund.status === 'approved' ? 'success' : refund.status === 'rejected' ? 'error' : 'info'} size="small" />
                  </Stack>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight={800}>{refund.courseTitle}</Typography>
                    <Grid container spacing={2} mt={0.5}>
                      <Grid item xs={12} sm={6} md={3}><Typography variant="body2" color="text.secondary">Mã đơn hàng</Typography><Typography fontWeight={700}>{refund.orderId}</Typography></Grid>
                      <Grid item xs={12} sm={6} md={3}><Typography variant="body2" color="text.secondary">Số tiền</Typography><Typography fontWeight={700}>{formatCurrency(refund.amount)}</Typography></Grid>
                      <Grid item xs={12} sm={6} md={3}><Typography variant="body2" color="text.secondary">Phương thức</Typography><Typography fontWeight={700}>{getRefundMethodLabel(refund.refundMethod)}</Typography></Grid>
                      <Grid item xs={12} sm={6} md={3}><Typography variant="body2" color="text.secondary">Ngày yêu cầu</Typography><Typography fontWeight={700}>{formatDateTime(refund.requestDate)}</Typography></Grid>
                    </Grid>
                    <Typography variant="body2" color="text.secondary" mt={1}><strong>Lý do:</strong> {refund.reason}</Typography>
                    <Grid container spacing={2} mt={0.5}>
                      <Grid item xs={12} sm={6}><Typography variant="body2" color="text.secondary">Học viên</Typography><Typography fontWeight={700}>{refund.studentName} — {refund.studentEmail}</Typography></Grid>
                      <Grid item xs={12} sm={6}><Typography variant="body2" color="text.secondary">Giảng viên</Typography><Typography fontWeight={700}>{refund.instructorName}</Typography></Grid>
                      {refund.processedDate && (
                        <Grid item xs={12} sm={6}><Typography variant="body2" color="text.secondary">Đã xử lý</Typography><Typography fontWeight={700}>{formatDateTime(refund.processedDate)}</Typography></Grid>
                      )}
                      {refund.notes && (
                        <Grid item xs={12}><Typography variant="body2" color="text.secondary">Ghi chú</Typography><Typography>{refund.notes}</Typography></Grid>
                      )}
                    </Grid>
                    <Stack direction="row" spacing={1.5} mt={2}>
                      {refund.status === 'pending' && (
                        <>
                          <Button variant="contained" color="success" onClick={() => handleProcessRefund(refund, 'approve')}>Duyệt</Button>
                          <Button variant="outlined" color="error" onClick={() => handleProcessRefund(refund, 'reject')}>Từ chối</Button>
                        </>
                      )}
                      <Button variant="text">Xem chi tiết</Button>
                      <Button variant="text">Chỉnh sửa</Button>
                      {refund.status === 'approved' && (
                        <Button variant="contained" color="info">Hoàn tiền</Button>
                      )}
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {filteredRefunds.length === 0 && (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>Không có yêu cầu hoàn tiền nào</Typography>
          <Typography variant="body2" color="text.secondary">
            {filters.search || filters.status !== 'all' || filters.refundMethod !== 'all' || filters.dateRange !== 'all'
              ? 'Không tìm thấy yêu cầu hoàn tiền nào phù hợp với bộ lọc hiện tại'
              : 'Chưa có yêu cầu hoàn tiền nào trong hệ thống'}
          </Typography>
        </Paper>
      )}

      {/* Pagination (static like original) */}
      {filteredRefunds.length > 0 && (
        <Paper sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body2">Hiển thị {filteredRefunds.length} trong tổng số {refunds.length} yêu cầu hoàn tiền</Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button disabled>← Trước</Button>
            <Typography variant="body2">Trang 1</Typography>
            <Button disabled>Sau →</Button>
          </Stack>
        </Paper>
      )}

      {/* Process Modal */}
      <Dialog open={showProcessModal && !!selectedRefund} onClose={() => setShowProcessModal(false)} fullWidth maxWidth="sm">
        {selectedRefund && (
          <>
            <DialogTitle>{processAction === 'approve' ? 'Duyệt' : 'Từ chối'} yêu cầu hoàn tiền</DialogTitle>
            <DialogContent dividers>
              <Stack spacing={2}>
                <Typography><strong>Khóa học:</strong> {selectedRefund.courseTitle}</Typography>
                <Typography><strong>Học viên:</strong> {selectedRefund.studentName}</Typography>
                <Typography><strong>Số tiền:</strong> {formatCurrency(selectedRefund.amount)}</Typography>
                <Typography><strong>Lý do:</strong> {selectedRefund.reason}</Typography>
                <TextField
                  multiline
                  minRows={4}
                  label="Ghi chú xử lý"
                  placeholder={`Nhập ghi chú về việc ${processAction === 'approve' ? 'duyệt' : 'từ chối'} yêu cầu hoàn tiền...`}
                  value={processNotes}
                  onChange={(e) => setProcessNotes(e.target.value)}
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" color={processAction === 'approve' ? 'success' : 'error'} onClick={handleSubmitProcess}>
                {processAction === 'approve' ? 'Duyệt' : 'Từ chối'}
              </Button>
              <Button onClick={() => setShowProcessModal(false)}>Hủy</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccessMessage(null)} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RefundCenter;
