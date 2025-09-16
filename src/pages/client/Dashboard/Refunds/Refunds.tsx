import React, { useState, useMemo, useCallback } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Chip,
  Button,
  Tabs,
  Tab,
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
  Avatar,
  Divider,
  IconButton
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Refresh as RefreshIcon,
  Assignment as AssignmentIcon,
  MonetizationOn as MoneyIcon,
  Close as CloseIcon
} from '@mui/icons-material';

interface RefundRequest {
  id: string;
  courseId: string;
  courseName: string;
  courseImage: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'processing';
  createdAt: string;
  updatedAt: string;
  description?: string;
  adminNote?: string;
}

const Refunds: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'processing'>('all');
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [description, setDescription] = useState('');

  // Mock data
  const refundRequests: RefundRequest[] = [
    {
      id: '1',
      courseId: '1',
      courseName: 'React Advanced Patterns',
      courseImage: '/images/apollo.png',
      amount: 299000,
      reason: 'Không phù hợp với nhu cầu học tập',
      status: 'pending',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      description: 'Khóa học quá nâng cao so với trình độ hiện tại của tôi'
    },
    {
      id: '2',
      courseId: '2',
      courseName: 'Node.js Backend Development',
      courseImage: '/images/aptech.png',
      amount: 399000,
      reason: 'Nội dung không đúng như mô tả',
      status: 'approved',
      createdAt: '2024-01-10T14:20:00Z',
      updatedAt: '2024-01-12T09:15:00Z',
      description: 'Khóa học không có phần thực hành như đã hứa',
      adminNote: 'Đã xác nhận vấn đề, hoàn tiền 100%'
    },
    {
      id: '3',
      courseId: '3',
      courseName: 'UI/UX Design Fundamentals',
      courseImage: '/images/codegym.png',
      amount: 199000,
      reason: 'Chất lượng video kém',
      status: 'rejected',
      createdAt: '2024-01-08T16:45:00Z',
      updatedAt: '2024-01-11T11:30:00Z',
      description: 'Video có tiếng ồn và chất lượng hình ảnh thấp',
      adminNote: 'Đã kiểm tra, chất lượng video đạt chuẩn'
    },
    {
      id: '4',
      courseId: '4',
      courseName: 'Python Data Science',
      courseImage: '/images/funix.png',
      amount: 499000,
      reason: 'Thay đổi kế hoạch học tập',
      status: 'processing',
      createdAt: '2024-01-13T08:15:00Z',
      updatedAt: '2024-01-14T15:20:00Z',
      description: 'Cần tập trung vào lĩnh vực khác'
    }
  ];

  const filteredRequests = useMemo(() => {
    return refundRequests.filter(request => {
      const matchesTab = activeTab === 'all' || request.status === activeTab;
      const matchesSearch = request.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.reason.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [refundRequests, activeTab, searchTerm]);

  const getStatusColor = useCallback((status: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'processing':
        return 'info';
      default:
        return 'default';
    }
  }, []);

  const getStatusLabel = useCallback((status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý';
      case 'approved':
        return 'Đã duyệt';
      case 'rejected':
        return 'Từ chối';
      case 'processing':
        return 'Đang xử lý';
      default:
        return status;
    }
  }, []);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  const formatPrice = useCallback((amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }, []);

  const handleSubmitRequest = useCallback(() => {
    // Handle form submission
    console.log('Submitting refund request:', {
      courseId: selectedCourse,
      reason: selectedReason,
      description
    });
    setShowForm(false);
    setSelectedCourse('');
    setSelectedReason('');
    setDescription('');
  }, [selectedCourse, selectedReason, description]);

  const handleCancelRequest = useCallback((requestId: string) => {
    // Handle cancel request
    console.log('Canceling request:', requestId);
  }, []);

  const handleViewDetails = useCallback((requestId: string) => {
    // Handle view details
    console.log('Viewing details for request:', requestId);
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Yêu cầu hoàn tiền
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quản lý các yêu cầu hoàn tiền của bạn
        </Typography>
      </Box>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab
              label="Tất cả"
              value="all"
              icon={<AssignmentIcon />}
              iconPosition="start"
            />
            <Tab
              label="Chờ xử lý"
              value="pending"
              icon={<PendingIcon />}
              iconPosition="start"
            />
            <Tab
              label="Đang xử lý"
              value="processing"
              icon={<RefreshIcon />}
              iconPosition="start"
            />
            <Tab
              label="Đã duyệt"
              value="approved"
              icon={<CheckCircleIcon />}
              iconPosition="start"
            />
            <Tab
              label="Từ chối"
              value="rejected"
              icon={<CancelIcon />}
              iconPosition="start"
            />
          </Tabs>
        </Box>
      </Card>

      {/* Filter Bar */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <TextField
              fullWidth
              placeholder="Tìm kiếm theo tên khóa học hoặc lý do..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              sx={{ maxWidth: 500 }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowForm(true)}
              sx={{ minWidth: 180 }}
            >
              Gửi yêu cầu mới
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Refund Requests List */}
      <Card>
        <CardContent>
          {filteredRequests.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <AssignmentIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Không có yêu cầu hoàn tiền
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bạn chưa có yêu cầu hoàn tiền nào hoặc không có yêu cầu nào khớp với bộ lọc hiện tại.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={3}>
              {filteredRequests.map((request) => (
                <Card key={request.id} variant="outlined">
                  <CardContent>
                    {/* Header */}
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
                      <Avatar
                        src={request.courseImage}
                        alt={request.courseName}
                        sx={{ width: 80, height: 60 }}
                        variant="rounded"
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          {request.courseName}
                        </Typography>
                        <Typography variant="h6" color="success.main" sx={{ fontWeight: 700 }}>
                          {formatPrice(request.amount)}
                        </Typography>
                      </Box>
                      <Chip
                        label={getStatusLabel(request.status)}
                        color={getStatusColor(request.status)}
                        size="small"
                      />
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    {/* Content */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" gutterBottom>
                        <strong>Lý do:</strong> {request.reason}
                      </Typography>
                      {request.description && (
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <strong>Mô tả:</strong> {request.description}
                        </Typography>
                      )}
                      {request.adminNote && (
                        <Alert severity="info" sx={{ mt: 1 }}>
                          <Typography variant="body2">
                            <strong>Ghi chú từ admin:</strong> {request.adminNote}
                          </Typography>
                        </Alert>
                      )}
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Footer */}
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Gửi: {formatDate(request.createdAt)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Cập nhật: {formatDate(request.updatedAt)}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={1}>
                        {request.status === 'pending' && (
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<CancelIcon />}
                            onClick={() => handleCancelRequest(request.id)}
                          >
                            Hủy yêu cầu
                          </Button>
                        )}
                        {request.status === 'approved' && (
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<MoneyIcon />}
                            onClick={() => handleViewDetails(request.id)}
                          >
                            Xem chi tiết hoàn tiền
                          </Button>
                        )}
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<AssignmentIcon />}
                          onClick={() => handleViewDetails(request.id)}
                        >
                          Chi tiết
                        </Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>

      {/* New Request Dialog */}
      <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Gửi yêu cầu hoàn tiền mới</Typography>
            <IconButton
              onClick={() => setShowForm(false)}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Chọn khóa học</InputLabel>
              <Select
                value={selectedCourse}
                label="Chọn khóa học"
                onChange={(e) => setSelectedCourse(e.target.value)}
                MenuProps={{ disableScrollLock: true }}
              >
                <MenuItem value="">-- Chọn khóa học --</MenuItem>
                <MenuItem value="1">React Advanced Patterns</MenuItem>
                <MenuItem value="2">Node.js Backend Development</MenuItem>
                <MenuItem value="3">UI/UX Design Fundamentals</MenuItem>
                <MenuItem value="4">Python Data Science</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Lý do hoàn tiền</InputLabel>
              <Select
                value={selectedReason}
                label="Lý do hoàn tiền"
                onChange={(e) => setSelectedReason(e.target.value)}
                MenuProps={{ disableScrollLock: true }}
              >
                <MenuItem value="">-- Chọn lý do --</MenuItem>
                <MenuItem value="not-suitable">Không phù hợp với nhu cầu</MenuItem>
                <MenuItem value="wrong-content">Nội dung không đúng mô tả</MenuItem>
                <MenuItem value="poor-quality">Chất lượng kém</MenuItem>
                <MenuItem value="change-plan">Thay đổi kế hoạch học tập</MenuItem>
                <MenuItem value="other">Lý do khác</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Mô tả chi tiết"
              placeholder="Mô tả chi tiết lý do bạn muốn hoàn tiền..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowForm(false)}>
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitRequest}
            disabled={!selectedCourse || !selectedReason}
          >
            Gửi yêu cầu
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Refunds;
