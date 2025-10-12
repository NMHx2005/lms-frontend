import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { refundService, RefundRequest, EligibleCourse, CreateRefundData } from '@/services/client/refund.service';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Chip,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Avatar,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  IconButton,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  MonetizationOn as MoneyIcon,
  Close as CloseIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';

const Refunds: React.FC = () => {
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
  const [eligibleCourses, setEligibleCourses] = useState<EligibleCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'cancelled'>('all');
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState<CreateRefundData>({
    enrollmentId: '',
    reason: '',
    description: '',
    contactMethod: {
      type: 'email',
      email: '',
      phone: ''
    }
  });

  useEffect(() => {
    fetchRefundRequests();
    fetchEligibleCourses();
  }, []);

  const fetchRefundRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await refundService.getRefundRequests({ limit: 100 });
      if (response.success) {
        setRefundRequests(response.data || []);
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || 'Failed to load refund requests';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchEligibleCourses = async () => {
    try {
      const response = await refundService.getEligibleCourses();
      console.log('Eligible courses response:', response);
      if (response.success) {
        setEligibleCourses(response.data || []);
        console.log('Eligible courses count:', response.data?.length || 0);
      }
    } catch (err: any) {
      console.error('Error fetching eligible courses:', err);
      toast.error('Không thể tải danh sách khóa học');
    }
  };

  const handleCreateRefund = async () => {
    try {
      // Validation
      if (!formData.enrollmentId) {
        toast.error('Vui lòng chọn khóa học');
        return;
      }
      if (!formData.reason) {
        toast.error('Vui lòng nhập lý do hoàn tiền');
        return;
      }
      if (!formData.description) {
        toast.error('Vui lòng nhập mô tả chi tiết');
        return;
      }

      // Validate contact method
      if (formData.contactMethod.type === 'email' || formData.contactMethod.type === 'both') {
        if (!formData.contactMethod.email) {
          toast.error('Vui lòng nhập email liên hệ');
          return;
        }
      }
      if (formData.contactMethod.type === 'phone' || formData.contactMethod.type === 'both') {
        if (!formData.contactMethod.phone) {
          toast.error('Vui lòng nhập số điện thoại liên hệ');
          return;
        }
      }

      const loadingToast = toast.loading('Đang tạo yêu cầu hoàn tiền...');
      const response = await refundService.createRefundRequest(formData);

      toast.dismiss(loadingToast);

      if (response.success) {
        toast.success('Yêu cầu hoàn tiền đã được gửi thành công!');
        setShowForm(false);
        setFormData({
          enrollmentId: '',
          reason: '',
          description: '',
          contactMethod: { type: 'email', email: '', phone: '' }
        });
        fetchRefundRequests();
        fetchEligibleCourses();
      }
    } catch (err: any) {
      toast.dismiss();
      toast.error(err?.response?.data?.error || 'Failed to create refund request');
    }
  };

  const handleCancelRefund = async (refundId: string) => {
    if (!window.confirm('Bạn có chắc muốn hủy yêu cầu hoàn tiền này?')) {
      return;
    }

    try {
      const response = await refundService.cancelRefundRequest(refundId);
      if (response.success) {
        toast.success('Đã hủy yêu cầu hoàn tiền');
        fetchRefundRequests();
        fetchEligibleCourses();
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to cancel refund');
    }
  };

  const filteredRefunds = useMemo(() => {
    if (statusFilter === 'all') return refundRequests;
    return refundRequests.filter(r => r.status === statusFilter);
  }, [refundRequests, statusFilter]);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
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
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" alignItems="center" justifyContent="center" minHeight={400}>
          <Stack spacing={2} alignItems="center">
            <CircularProgress size={60} />
            <Typography variant="h6">Đang tải dữ liệu...</Typography>
          </Stack>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6">Đã xảy ra lỗi</Typography>
          <Typography>{error}</Typography>
        </Alert>
        <Button variant="contained" onClick={fetchRefundRequests}>
          🔄 Thử lại
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
              Yêu cầu hoàn tiền
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Quản lý các yêu cầu hoàn tiền khóa học của bạn
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowForm(true)}
            disabled={eligibleCourses.length === 0}
          >
            Tạo yêu cầu mới
          </Button>
        </Stack>

        {eligibleCourses.length === 0 && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2">
              Không có khóa học nào đủ điều kiện để hoàn tiền.
              Bạn cần có ít nhất 1 khóa học đã thanh toán và chưa có yêu cầu hoàn tiền đang chờ xử lý.
            </Typography>
          </Alert>
        )}
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.light', width: 60, height: 60 }}>
                  <AssignmentIcon sx={{ color: 'primary.main' }} />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={800}>{refundRequests.length}</Typography>
                  <Typography color="text.secondary" variant="body2">Tổng yêu cầu</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'warning.light', width: 60, height: 60 }}>
                  <PendingIcon sx={{ color: 'warning.main' }} />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={800}>
                    {refundRequests.filter(r => r.status === 'pending').length}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">Chờ duyệt</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'success.light', width: 60, height: 60 }}>
                  <CheckCircleIcon sx={{ color: 'success.main' }} />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={800}>
                    {refundRequests.filter(r => r.status === 'approved').length}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">Đã duyệt</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'error.light', width: 60, height: 60 }}>
                  <CancelIcon sx={{ color: 'error.main' }} />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={800}>
                    {refundRequests.filter(r => r.status === 'rejected').length}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">Từ chối</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  label="Trạng thái"
                >
                  <MenuItem value="all">Tất cả ({refundRequests.length})</MenuItem>
                  <MenuItem value="pending">Chờ duyệt ({refundRequests.filter(r => r.status === 'pending').length})</MenuItem>
                  <MenuItem value="approved">Đã duyệt ({refundRequests.filter(r => r.status === 'approved').length})</MenuItem>
                  <MenuItem value="rejected">Từ chối ({refundRequests.filter(r => r.status === 'rejected').length})</MenuItem>
                  <MenuItem value="cancelled">Đã hủy ({refundRequests.filter(r => r.status === 'cancelled').length})</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Refund Requests List */}
      {filteredRefunds.length === 0 ? (
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Box textAlign="center" py={8}>
              <MoneyIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Không có yêu cầu hoàn tiền nào
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {statusFilter === 'all'
                  ? 'Bạn chưa có yêu cầu hoàn tiền nào'
                  : `Không có yêu cầu ${getStatusLabel(statusFilter)}`
                }
              </Typography>
              {eligibleCourses.length > 0 && (
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowForm(true)}>
                  Tạo yêu cầu hoàn tiền
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {filteredRefunds.map((refund) => (
            <Grid item xs={12} key={refund._id}>
              <Card sx={{ borderRadius: 3, '&:hover': { boxShadow: 4 } }}>
                <CardContent>
                  <Grid container spacing={3}>
                    {/* Course Info */}
                    <Grid item xs={12} md={3}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          src={refund.courseId.thumbnail}
                          variant="rounded"
                          sx={{ width: 80, height: 80 }}
                        />
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {refund.courseId.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ID: {refund._id.substring(18)}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>

                    {/* Amount & Status */}
                    <Grid item xs={12} md={2}>
                      <Typography variant="caption" color="text.secondary">Số tiền</Typography>
                      <Typography variant="h6" fontWeight={700} color="primary">
                        {formatPrice(refund.amount)}
                      </Typography>
                      <Chip
                        label={getStatusLabel(refund.status)}
                        color={getStatusColor(refund.status)}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </Grid>

                    {/* Reason & Description */}
                    <Grid item xs={12} md={4}>
                      <Typography variant="caption" color="text.secondary">Lý do</Typography>
                      <Typography variant="body2" fontWeight={600} gutterBottom>
                        {refund.reason}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {refund.description}
                      </Typography>
                    </Grid>

                    {/* Date & Contact */}
                    <Grid item xs={12} md={2}>
                      <Typography variant="caption" color="text.secondary">Ngày tạo</Typography>
                      <Typography variant="body2">
                        {formatDate(refund.createdAt)}
                      </Typography>
                      <Stack direction="row" spacing={0.5} sx={{ mt: 1 }}>
                        {(refund.contactMethod.type === 'email' || refund.contactMethod.type === 'both') && (
                          <Chip icon={<EmailIcon />} label="Email" size="small" variant="outlined" />
                        )}
                        {(refund.contactMethod.type === 'phone' || refund.contactMethod.type === 'both') && (
                          <Chip icon={<PhoneIcon />} label="Phone" size="small" variant="outlined" />
                        )}
                      </Stack>
                    </Grid>

                    {/* Actions */}
                    <Grid item xs={12} md={1}>
                      {refund.status === 'pending' && (
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          fullWidth
                          onClick={() => handleCancelRefund(refund._id)}
                        >
                          Hủy
                        </Button>
                      )}
                    </Grid>
                  </Grid>

                  {/* Teacher/Admin Notes */}
                  {(refund.teacherNotes || refund.rejectionReason || refund.adminNotes) && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      {refund.teacherNotes && (
                        <Alert severity="info" sx={{ mb: 1 }}>
                          <Typography variant="subtitle2" fontWeight={600}>Ghi chú từ giảng viên:</Typography>
                          <Typography variant="body2">{refund.teacherNotes}</Typography>
                        </Alert>
                      )}
                      {refund.rejectionReason && (
                        <Alert severity="error" sx={{ mb: 1 }}>
                          <Typography variant="subtitle2" fontWeight={600}>Lý do từ chối:</Typography>
                          <Typography variant="body2">{refund.rejectionReason}</Typography>
                        </Alert>
                      )}
                      {refund.adminNotes && (
                        <Alert severity="warning">
                          <Typography variant="subtitle2" fontWeight={600}>Ghi chú admin:</Typography>
                          <Typography variant="body2">{refund.adminNotes}</Typography>
                        </Alert>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Refund Dialog */}
      <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight={700}>Tạo yêu cầu hoàn tiền</Typography>
            <IconButton onClick={() => setShowForm(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3}>
            {/* Select Course */}
            <FormControl fullWidth required>
              <InputLabel>Chọn khóa học cần hoàn tiền</InputLabel>
              <Select
                value={formData.enrollmentId}
                onChange={(e) => setFormData({ ...formData, enrollmentId: e.target.value })}
                label="Chọn khóa học cần hoàn tiền"
              >
                {eligibleCourses.map((course) => (
                  <MenuItem key={course.enrollmentId} value={course.enrollmentId}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
                      <Avatar src={course.courseThumbnail} variant="rounded" />
                      <Box flex={1}>
                        <Typography variant="body2" fontWeight={600}>{course.courseTitle}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatPrice(course.amount)} • Tiến độ: {course.progress}%
                        </Typography>
                      </Box>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Reason */}
            <TextField
              label="Lý do hoàn tiền"
              required
              fullWidth
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Ví dụ: Khóa học không phù hợp với mục tiêu học tập"
              inputProps={{ maxLength: 200 }}
              helperText={`${formData.reason.length}/200 ký tự`}
            />

            {/* Description */}
            <TextField
              label="Mô tả chi tiết"
              required
              fullWidth
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Vui lòng mô tả chi tiết lý do bạn muốn hoàn tiền để giảng viên có thể hỗ trợ tốt hơn..."
              inputProps={{ maxLength: 1000 }}
              helperText={`${formData.description.length}/1000 ký tự`}
            />

            {/* Contact Method */}
            <Box>
              <FormLabel component="legend" required>Phương thức liên hệ</FormLabel>
              <RadioGroup
                value={formData.contactMethod.type}
                onChange={(e) => setFormData({
                  ...formData,
                  contactMethod: { ...formData.contactMethod, type: e.target.value as any }
                })}
              >
                <FormControlLabel value="email" control={<Radio />} label="Email" />
                <FormControlLabel value="phone" control={<Radio />} label="Số điện thoại" />
                <FormControlLabel value="both" control={<Radio />} label="Cả hai" />
              </RadioGroup>
            </Box>

            {/* Email */}
            {(formData.contactMethod.type === 'email' || formData.contactMethod.type === 'both') && (
              <TextField
                label="Email liên hệ"
                type="email"
                required
                fullWidth
                value={formData.contactMethod.email}
                onChange={(e) => setFormData({
                  ...formData,
                  contactMethod: { ...formData.contactMethod, email: e.target.value }
                })}
                placeholder="your-email@example.com"
                InputProps={{ startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} /> }}
              />
            )}

            {/* Phone */}
            {(formData.contactMethod.type === 'phone' || formData.contactMethod.type === 'both') && (
              <TextField
                label="Số điện thoại liên hệ"
                type="tel"
                required
                fullWidth
                value={formData.contactMethod.phone}
                onChange={(e) => setFormData({
                  ...formData,
                  contactMethod: { ...formData.contactMethod, phone: e.target.value }
                })}
                placeholder="0987654321"
                InputProps={{ startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} /> }}
              />
            )}

            {/* Note */}
            <Alert severity="info">
              <Typography variant="body2">
                ⚠️ Yêu cầu hoàn tiền sẽ được gửi đến giảng viên của khóa học.
                Nếu được chấp nhận, bạn sẽ bị loại khỏi khóa học và nhận lại tiền.
              </Typography>
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setShowForm(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleCreateRefund}>
            Gửi yêu cầu
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Refunds;
