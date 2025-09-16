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
  DialogActions
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SettingsIcon from '@mui/icons-material/Settings';

interface RefundRequest {
  _id: string;
  orderId: string;
  courseId: string;
  courseTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  instructorId: string;
  instructorName: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requestDate: string;
  processedDate?: string;
  processedBy?: string;
  notes?: string;
  evidence?: string[];
  refundMethod: 'original_payment' | 'credit' | 'bank_transfer';
  originalPaymentMethod: string;
  originalTransactionId: string;
}

interface RefundFilters {
  search: string;
  status: string;
  refundMethod: string;
  dateRange: string;
}

const RefundCenter: React.FC = () => {
  const [refunds, setRefunds] = useState<RefundRequest[]>([]);
  const [filteredRefunds, setFilteredRefunds] = useState<RefundRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<RefundFilters>({
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

  useEffect(() => {
    setTimeout(() => {
      const mockRefunds: RefundRequest[] = [
        {
          _id: '1',
          orderId: 'ORD-2024-001',
          courseId: 'course-1',
          courseTitle: 'React Advanced Patterns & Best Practices',
          studentId: 'student-1',
          studentName: 'Nguyễn Văn A',
          studentEmail: 'nguyenvana@email.com',
          instructorId: 'instructor-1',
          instructorName: 'Trần Thị B',
          amount: 299000,
          reason: 'Khóa học không phù hợp với nhu cầu học tập',
          status: 'pending',
          requestDate: '2024-01-20T10:30:00Z',
          refundMethod: 'original_payment',
          originalPaymentMethod: 'Credit Card',
          originalTransactionId: 'TXN-2024-001'
        },
        {
          _id: '2',
          orderId: 'ORD-2024-002',
          courseId: 'course-2',
          courseTitle: 'Python Data Science Fundamentals',
          studentId: 'student-2',
          studentName: 'Lê Văn C',
          studentEmail: 'levanc@email.com',
          instructorId: 'instructor-2',
          instructorName: 'Phạm Thị D',
          amount: 399000,
          reason: 'Chất lượng nội dung không như mong đợi',
          status: 'approved',
          requestDate: '2024-01-19T14:20:00Z',
          processedDate: '2024-01-20T09:15:00Z',
          processedBy: 'admin-1',
          notes: 'Đã xác minh và chấp thuận yêu cầu hoàn tiền',
          refundMethod: 'credit',
          originalPaymentMethod: 'Bank Transfer',
          originalTransactionId: 'TXN-2024-002'
        },
        {
          _id: '3',
          orderId: 'ORD-2024-003',
          courseId: 'course-3',
          courseTitle: 'Web Design Principles & UI/UX',
          studentId: 'student-3',
          studentName: 'Hoàng Văn E',
          studentEmail: 'hoangvane@email.com',
          instructorId: 'instructor-3',
          instructorName: 'Vũ Thị F',
          amount: 199000,
          reason: 'Kỹ thuật giảng dạy không hiệu quả',
          status: 'rejected',
          requestDate: '2024-01-18T16:45:00Z',
          processedDate: '2024-01-19T11:30:00Z',
          processedBy: 'admin-1',
          notes: 'Khóa học đã hoàn thành 70%, không đủ điều kiện hoàn tiền',
          refundMethod: 'original_payment',
          originalPaymentMethod: 'Credit Card',
          originalTransactionId: 'TXN-2024-003'
        },
        {
          _id: '4',
          orderId: 'ORD-2024-004',
          courseId: 'course-4',
          courseTitle: 'Mobile App Development with React Native',
          studentId: 'student-4',
          studentName: 'Đỗ Thị G',
          studentEmail: 'dothig@email.com',
          instructorId: 'instructor-4',
          instructorName: 'Ngô Văn H',
          amount: 499000,
          reason: 'Gặp vấn đề kỹ thuật không thể truy cập khóa học',
          status: 'completed',
          requestDate: '2024-01-17T09:15:00Z',
          processedDate: '2024-01-18T14:20:00Z',
          processedBy: 'admin-2',
          notes: 'Đã xác nhận vấn đề kỹ thuật và hoàn tiền thành công',
          refundMethod: 'bank_transfer',
          originalPaymentMethod: 'Credit Card',
          originalTransactionId: 'TXN-2024-004'
        },
        {
          _id: '5',
          orderId: 'ORD-2024-005',
          courseId: 'course-5',
          courseTitle: 'Blockchain & Cryptocurrency Basics',
          studentId: 'student-5',
          studentName: 'Bùi Văn I',
          studentEmail: 'buivani@email.com',
          instructorId: 'instructor-5',
          instructorName: 'Lý Thị K',
          amount: 599000,
          reason: 'Thay đổi kế hoạch học tập',
          status: 'pending',
          requestDate: '2024-01-16T11:30:00Z',
          refundMethod: 'credit',
          originalPaymentMethod: 'Bank Transfer',
          originalTransactionId: 'TXN-2024-005'
        }
      ];
      setRefunds(mockRefunds);
      setFilteredRefunds(mockRefunds);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const filtered = refunds.filter(refund => {
      const matchesSearch = refund.courseTitle.toLowerCase().includes(filters.search.toLowerCase()) ||
        refund.studentName.toLowerCase().includes(filters.search.toLowerCase()) ||
        refund.orderId.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus = filters.status === 'all' || refund.status === filters.status;
      const matchesRefundMethod = filters.refundMethod === 'all' || refund.refundMethod === filters.refundMethod;

      let matchesDateRange = true;
      if (filters.dateRange !== 'all') {
        const requestDate = new Date(refund.requestDate);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - requestDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        switch (filters.dateRange) {
          case 'today':
            matchesDateRange = diffDays === 0;
            break;
          case 'week':
            matchesDateRange = diffDays <= 7;
            break;
          case 'month':
            matchesDateRange = diffDays <= 30;
            break;
        }
      }

      return matchesSearch && matchesStatus && matchesRefundMethod && matchesDateRange;
    });
    setFilteredRefunds(filtered);
  }, [refunds, filters]);

  const handleFilterChange = (newFilters: Partial<RefundFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleRefundSelection = (refundId: string) => {
    setSelectedRefunds(prev =>
      prev.includes(refundId)
        ? prev.filter(id => id !== refundId)
        : [...prev, refundId]
    );
  };

  const handleBulkAction = (action: 'approve' | 'reject') => {
    if (selectedRefunds.length === 0) return;

    const actionText = action === 'approve' ? 'duyệt' : 'từ chối';
    if (confirm(`Bạn có chắc chắn muốn ${actionText} ${selectedRefunds.length} yêu cầu hoàn tiền đã chọn?`)) {
      setRefunds(prev => prev.map(refund => {
        if (selectedRefunds.includes(refund._id)) {
          return {
            ...refund,
            status: action === 'approve' ? 'approved' : 'rejected' as const,
            processedDate: new Date().toISOString(),
            processedBy: 'admin-1'
          };
        }
        return refund;
      }));
      setSelectedRefunds([]);
    }
  };

  const handleProcessRefund = (refund: RefundRequest, action: 'approve' | 'reject') => {
    setSelectedRefund(refund);
    setProcessAction(action);
    setProcessNotes('');
    setShowProcessModal(true);
  };

  const handleSubmitProcess = () => {
    if (!selectedRefund) return;

    setRefunds(prev => prev.map(refund => {
      if (refund._id === selectedRefund._id) {
        return {
          ...refund,
          status: processAction === 'approve' ? 'approved' : 'rejected' as const,
          processedDate: new Date().toISOString(),
          processedBy: 'admin-1',
          notes: processNotes
        };
      }
      return refund;
    }));

    setShowProcessModal(false);
    setSelectedRefund(null);
    setProcessNotes('');
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

  const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
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
        <Grid item xs={12} sm={6} md={3}><Card><CardContent><Stack direction="row" spacing={2} alignItems="center"><Avatar>⏳</Avatar><Box><Typography variant="h6" fontWeight={700}>{refunds.filter(r => r.status === 'pending').length}</Typography><Typography variant="body2" color="text.secondary">Chờ xử lý</Typography></Box></Stack></CardContent></Card></Grid>
        <Grid item xs={12} sm={6} md={3}><Card><CardContent><Stack direction="row" spacing={2} alignItems="center"><Avatar>✅</Avatar><Box><Typography variant="h6" fontWeight={700}>{refunds.filter(r => r.status === 'approved').length}</Typography><Typography variant="body2" color="text.secondary">Đã duyệt</Typography></Box></Stack></CardContent></Card></Grid>
        <Grid item xs={12} sm={6} md={3}><Card><CardContent><Stack direction="row" spacing={2} alignItems="center"><Avatar>❌</Avatar><Box><Typography variant="h6" fontWeight={700}>{refunds.filter(r => r.status === 'rejected').length}</Typography><Typography variant="body2" color="text.secondary">Đã từ chối</Typography></Box></Stack></CardContent></Card></Grid>
        <Grid item xs={12} sm={6} md={3}><Card><CardContent><Stack direction="row" spacing={2} alignItems="center"><Avatar>💰</Avatar><Box><Typography variant="h6" fontWeight={700}>{formatCurrency(refunds.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.amount, 0))}</Typography><Typography variant="body2" color="text.secondary">Tổng hoàn tiền</Typography></Box></Stack></CardContent></Card></Grid>
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
    </Box>
  );
};

export default RefundCenter;
