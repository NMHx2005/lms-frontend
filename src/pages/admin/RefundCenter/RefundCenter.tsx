import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { adminRefundService, RefundStats } from '@/services/admin/refundService';
import { RefundRequest } from '@/services/client/refund.service';
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
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import VisibilityIcon from '@mui/icons-material/Visibility';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import MoneyIcon from '@mui/icons-material/MonetizationOn';
import CloseIcon from '@mui/icons-material/Close';

const RefundCenter: React.FC = () => {
  const [refunds, setRefunds] = useState<RefundRequest[]>([]);
  const [stats, setStats] = useState<RefundStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all'
  });
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [adminNote, setAdminNote] = useState('');

  useEffect(() => {
    loadRefunds();
  }, [filters.status]);

  const loadRefunds = async () => {
    try {
      setLoading(true);
      setError(null);

      const [refundsResponse, statsResponse] = await Promise.all([
        adminRefundService.getAllRefundRequests({
          status: filters.status !== 'all' ? filters.status : undefined,
          limit: 100
        }),
        adminRefundService.getRefundStats()
      ]);

      if (refundsResponse.success) {
        setRefunds(refundsResponse.data || []);
      }

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || 'Failed to load refunds';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!selectedRefund || !adminNote.trim()) {
      toast.error('Please enter a note');
      return;
    }

    try {
      const loadingToast = toast.loading('Adding note...');
      const response = await adminRefundService.addAdminNote(selectedRefund._id, adminNote);

      toast.dismiss(loadingToast);

      if (response.success) {
        toast.success('Admin note added successfully');
        setShowNoteModal(false);
        setAdminNote('');
        setSelectedRefund(null);
        loadRefunds();
      }
    } catch (err: any) {
      toast.dismiss();
      toast.error(err?.response?.data?.error || 'Failed to add note');
    }
  };

  const filteredRefunds = useMemo(() => {
    let result = refunds;

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(r =>
        (typeof r.courseId === 'object' && r.courseId.title?.toLowerCase().includes(searchLower)) ||
        r.reason?.toLowerCase().includes(searchLower)
      );
    }

    return result;
  }, [refunds, filters.search]);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'info' | 'default' => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      case 'cancelled': return 'info';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Đã duyệt';
      case 'pending': return 'Chờ duyệt';
      case 'rejected': return 'Từ chối';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  if (loading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="80vh">
        <Stack spacing={2} alignItems="center">
          <CircularProgress size={60} />
          <Typography variant="h6">Đang tải dữ liệu...</Typography>
        </Stack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6">Đã xảy ra lỗi</Typography>
          <Typography>{error}</Typography>
        </Alert>
        <Button variant="contained" onClick={loadRefunds} startIcon={<AutorenewIcon />}>
          Thử lại
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Quản lý Hoàn tiền
        </Typography>
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            ℹ️ Admin chỉ có quyền xem và theo dõi. Quyết định duyệt/từ chối thuộc về giảng viên.
          </Typography>
        </Alert>
      </Box>

      {/* Stats */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: 'primary.light', width: 60, height: 60 }}>
                    <MoneyIcon sx={{ color: 'primary.main' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={800}>{stats.totalRefunds}</Typography>
                    <Typography color="text.secondary" variant="body2">Tổng yêu cầu</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: 'warning.light', width: 60, height: 60 }}>
                    <PendingIcon sx={{ color: 'warning.main' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={800}>{stats.pendingRefunds}</Typography>
                    <Typography color="text.secondary" variant="body2">Chờ duyệt</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: 'success.light', width: 60, height: 60 }}>
                    <CheckCircleIcon sx={{ color: 'success.main' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={800}>{stats.approvedRefunds}</Typography>
                    <Typography color="text.secondary" variant="body2">Đã duyệt</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: 'error.light', width: 60, height: 60 }}>
                    <CancelIcon sx={{ color: 'error.main' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={800}>{stats.rejectedRefunds}</Typography>
                    <Typography color="text.secondary" variant="body2">Từ chối</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: 'success.light', width: 60, height: 60 }}>
                    <MoneyIcon sx={{ color: 'success.main' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={800}>
                      {formatPrice(stats.totalRefundedAmount)}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">Đã hoàn</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Filters */}
      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Tìm kiếm theo khóa học hoặc lý do..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  label="Trạng thái"
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="pending">Chờ duyệt</MenuItem>
                  <MenuItem value="approved">Đã duyệt</MenuItem>
                  <MenuItem value="rejected">Từ chối</MenuItem>
                  <MenuItem value="cancelled">Đã hủy</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Refunds Table */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Danh sách yêu cầu hoàn tiền ({filteredRefunds.length})
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Theo dõi các yêu cầu hoàn tiền từ học viên (chỉ xem)
          </Typography>

          {filteredRefunds.length === 0 ? (
            <Box textAlign="center" py={8}>
              <MoneyIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Không có yêu cầu hoàn tiền nào
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Khóa học</strong></TableCell>
                    <TableCell><strong>Học viên</strong></TableCell>
                    <TableCell><strong>Giảng viên</strong></TableCell>
                    <TableCell><strong>Số tiền</strong></TableCell>
                    <TableCell><strong>Trạng thái</strong></TableCell>
                    <TableCell><strong>Ngày tạo</strong></TableCell>
                    <TableCell align="center"><strong>Hành động</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRefunds.map((refund) => (
                    <TableRow key={refund._id} hover>
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          {typeof refund.courseId === 'object' && refund.courseId.thumbnail && (
                            <Avatar src={refund.courseId.thumbnail} variant="rounded" />
                          )}
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {typeof refund.courseId === 'object' ? refund.courseId.title : 'N/A'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {refund._id.substring(18)}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {typeof refund.studentId === 'object'
                            ? (refund.studentId as any).name || 'N/A'
                            : 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {typeof refund.teacherId === 'object'
                            ? refund.teacherId.name || refund.teacherId.firstName || 'N/A'
                            : 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600} color="primary">
                          {formatPrice(refund.amount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(refund.status)}
                          color={getStatusColor(refund.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {formatDate(refund.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="Xem chi tiết">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedRefund(refund);
                                setShowDetailModal(true);
                              }}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Thêm ghi chú">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedRefund(refund);
                                setAdminNote(refund.adminNotes || '');
                                setShowNoteModal(true);
                              }}
                            >
                              <NoteAddIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onClose={() => setShowDetailModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight={700}>Chi tiết yêu cầu hoàn tiền</Typography>
            <IconButton onClick={() => setShowDetailModal(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          {selectedRefund && (
            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Khóa học</Typography>
                <Typography variant="body1" fontWeight={600}>
                  {typeof selectedRefund.courseId === 'object' ? selectedRefund.courseId.title : 'N/A'}
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Số tiền</Typography>
                  <Typography variant="h6" color="primary">{formatPrice(selectedRefund.amount)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Trạng thái</Typography>
                  <Chip
                    label={getStatusLabel(selectedRefund.status)}
                    color={getStatusColor(selectedRefund.status)}
                  />
                </Grid>
              </Grid>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">Lý do</Typography>
                <Typography variant="body1">{selectedRefund.reason}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">Mô tả chi tiết</Typography>
                <Typography variant="body1">{selectedRefund.description}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">Phương thức liên hệ</Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  {selectedRefund.contactMethod.email && (
                    <Chip icon={<VisibilityIcon />} label={selectedRefund.contactMethod.email} size="small" />
                  )}
                  {selectedRefund.contactMethod.phone && (
                    <Chip icon={<VisibilityIcon />} label={selectedRefund.contactMethod.phone} size="small" />
                  )}
                </Stack>
              </Box>

              {selectedRefund.teacherNotes && (
                <Alert severity="info">
                  <Typography variant="subtitle2" fontWeight={600}>Ghi chú từ giảng viên:</Typography>
                  <Typography variant="body2">{selectedRefund.teacherNotes}</Typography>
                </Alert>
              )}

              {selectedRefund.rejectionReason && (
                <Alert severity="error">
                  <Typography variant="subtitle2" fontWeight={600}>Lý do từ chối:</Typography>
                  <Typography variant="body2">{selectedRefund.rejectionReason}</Typography>
                </Alert>
              )}

              {selectedRefund.adminNotes && (
                <Alert severity="warning">
                  <Typography variant="subtitle2" fontWeight={600}>Ghi chú admin:</Typography>
                  <Typography variant="body2">{selectedRefund.adminNotes}</Typography>
                </Alert>
              )}

              <Divider />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Ngày tạo</Typography>
                  <Typography variant="body2">{formatDate(selectedRefund.createdAt)}</Typography>
                </Grid>
                {selectedRefund.processedAt && (
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Ngày xử lý</Typography>
                    <Typography variant="body2">{formatDate(selectedRefund.processedAt)}</Typography>
                  </Grid>
                )}
              </Grid>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDetailModal(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Add Note Modal */}
      <Dialog open={showNoteModal} onClose={() => setShowNoteModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight={700}>Thêm ghi chú admin</Typography>
            <IconButton onClick={() => setShowNoteModal(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Ghi chú"
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            placeholder="Nhập ghi chú theo dõi của admin..."
            helperText="Ghi chú này chỉ để theo dõi, không ảnh hưởng đến quyết định của giảng viên"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowNoteModal(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleAddNote}>Lưu ghi chú</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RefundCenter;
