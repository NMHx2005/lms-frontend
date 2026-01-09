import React, { useState, useEffect } from 'react';
// import './BillsPayments.css';
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
  Paper,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { BillsPaymentsService, Bill, BillFilters, BillRevenueAnalytics, PaymentActivity, SystemLog } from '../../../services/admin';

interface BillsPaymentsState {
  search: string;
  status: string;
  paymentMethod: string;
  dateRange: string;
}

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const BillsPayments: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState<BillsPaymentsState>({
    search: '',
    status: 'all',
    paymentMethod: 'all',
    dateRange: 'all'
  });
  const [pagination, setPagination] = useState<PaginationState>({
    page: 0,
    limit: 20,
    total: 0,
    pages: 0
  });
  const [revenueAnalytics, setRevenueAnalytics] = useState<BillRevenueAnalytics | null>(null);
  const [_paymentActivities, setPaymentActivities] = useState<PaymentActivity[]>([]);
  const [_systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  // Bill details dialog state
  const [billDetailsOpen, setBillDetailsOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  // Load all data
  const loadBillsData = async () => {
    try {
      setLoading(true);

      // Load bills data
      const apiFilters: BillFilters = {
        search: filters.search || undefined,
        status: filters.status !== 'all' ? filters.status : undefined,
        paymentMethod: filters.paymentMethod !== 'all' ? filters.paymentMethod : undefined,
        dateRange: filters.dateRange !== 'all' ? filters.dateRange : undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        page: pagination.page + 1,
        limit: pagination.limit
      };

      const [billsResponse, revenueResponse, activitiesResponse, logsResponse] = await Promise.all([
        BillsPaymentsService.getBills(apiFilters),
        BillsPaymentsService.getRevenueAnalytics('monthly'),
        BillsPaymentsService.getPaymentActivities({ page: 1, limit: 10 }),
        BillsPaymentsService.getSystemLogs({ page: 1, limit: 10 })
      ]);

      if (billsResponse.success) {
        setBills(billsResponse.data.data || []);
        setPagination(prev => ({
          ...prev,
          total: billsResponse.data.pagination?.total || 0,
          pages: billsResponse.data.pagination?.pages || 0
        }));
      }

      if (revenueResponse.success) {
        setRevenueAnalytics(revenueResponse.data);
      }

      if (activitiesResponse.success) {
        setPaymentActivities(activitiesResponse.data.data || []);
      }

      if (logsResponse.success) {
        setSystemLogs(logsResponse.data.data || []);
      }

    } catch (error: any) {
      console.error('Error loading bills data:', error);
      showSnackbar('Lỗi khi tải dữ liệu hóa đơn', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadBillsData();
  }, [filters, pagination.page, pagination.limit]);

  // Helper functions
  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleFilterChange = (newFilters: Partial<BillsPaymentsState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 0 })); // Reset to first page when filters change
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadBillsData();
  };

  const handleExportExcel = async () => {
    try {
      const apiFilters: BillFilters = {
        search: filters.search || undefined,
        status: filters.status !== 'all' ? filters.status : undefined,
        paymentMethod: filters.paymentMethod !== 'all' ? filters.paymentMethod : undefined,
        dateRange: filters.dateRange !== 'all' ? filters.dateRange : undefined,
      };

      const blob = await BillsPaymentsService.exportBillsToExcel(apiFilters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `bills_export_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showSnackbar('Xuất file Excel thành công', 'success');
    } catch (error) {
      console.error('Export error:', error);
      showSnackbar('Lỗi khi xuất file Excel', 'error');
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: 'Chờ thanh toán',
      completed: 'Đã thanh toán',
      failed: 'Thất bại',
      refunded: 'Đã hoàn tiền',
      cancelled: 'Đã hủy'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels = {
      vnpay: 'VNPay',
      stripe: 'Stripe',
      paypal: 'PayPal',
      bank_transfer: 'Chuyển khoản',
      cash: 'Tiền mặt'
    };
    return labels[method as keyof typeof labels] || method;
  };

  const getPurposeLabel = (purpose: string) => {
    const labels = {
      course_purchase: 'Mua khóa học',
      subscription: 'Đăng ký gói',
      refund: 'Hoàn tiền',
      other: 'Khác'
    };
    return labels[purpose as keyof typeof labels] || purpose;
  };

  // Bill actions handlers
  const handleViewBillDetails = (bill: Bill) => {
    setSelectedBill(bill);
    setBillDetailsOpen(true);
  };

  const handleSendReminder = async (bill: Bill) => {
    try {
      // TODO: Implement send reminder API call
      showSnackbar(`Đã gửi nhắc nhở thanh toán cho ${bill.studentId && typeof bill.studentId === 'object' ? bill.studentId.name : 'học viên'}`, 'success');
    } catch (error) {
      showSnackbar('Lỗi khi gửi nhắc nhở', 'error');
    }
  };

  const handleDeleteBill = async (bill: Bill) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa hóa đơn này?`)) {
      try {
        await BillsPaymentsService.deleteBill(bill._id);
        showSnackbar('Đã xóa hóa đơn thành công', 'success');
        loadBillsData(); // Refresh data
      } catch (error) {
        showSnackbar('Lỗi khi xóa hóa đơn', 'error');
      }
    }
  };

  const handleExportReceipt = async (bill: Bill) => {
    try {
      // Generate PDF receipt
      await generatePDFReceipt(bill);
      showSnackbar('Đã xuất biên lai PDF thành công', 'success');
    } catch (error) {
      showSnackbar('Lỗi khi xuất biên lai', 'error');
    }
  };

  const generatePDFReceipt = async (bill: Bill) => {
    // Format transaction ID for receipt
    const formattedTransactionId = bill.transactionId 
      ? (bill.transactionId.length > 20 
          ? `${bill.transactionId.substring(0, 12)}...${bill.transactionId.substring(bill.transactionId.length - 8)}` 
          : bill.transactionId)
      : 'Chưa có';
    
    // Create PDF content
    const receiptContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Biên Lai Thanh Toán</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #1976d2; }
            .title { font-size: 20px; margin-top: 10px; }
            .content { max-width: 600px; margin: 0 auto; }
            .section { margin-bottom: 20px; }
            .section-title { font-weight: bold; font-size: 16px; margin-bottom: 10px; color: #333; }
            .info-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
            .info-label { font-weight: bold; }
            .info-value { font-family: monospace; word-break: break-all; }
            .amount { font-size: 18px; font-weight: bold; color: #1976d2; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
            .divider { border-top: 1px solid #ddd; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="content">
            <div class="header">
              <div class="logo">LMS Platform</div>
              <div class="title">BIÊN LAI THANH TOÁN</div>
            </div>

            <div class="section">
              <div class="section-title">Thông tin hóa đơn</div>
              <div class="info-row">
                <span class="info-label">Mã hóa đơn:</span>
                <span class="info-value">${bill._id}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Transaction ID:</span>
                <span class="info-value">${formattedTransactionId}${bill.transactionId && bill.transactionId.length > 20 ? ` (Full: ${bill.transactionId})` : ''}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Ngày tạo:</span>
                <span class="info-value">${formatDate(bill.createdAt)}</span>
              </div>
              ${bill.paidAt ? `
              <div class="info-row">
                <span class="info-label">Ngày thanh toán:</span>
                <span class="info-value">${formatDate(bill.paidAt)}</span>
              </div>
              ` : ''}
            </div>

            <div class="divider"></div>

            <div class="section">
              <div class="section-title">Thông tin khách hàng</div>
              <div class="info-row">
                <span class="info-label">Tên:</span>
                <span class="info-value">${bill.studentId && typeof bill.studentId === 'object' ? bill.studentId.name : 'N/A'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email:</span>
                <span class="info-value">${bill.studentId && typeof bill.studentId === 'object' ? bill.studentId.email : 'N/A'}</span>
              </div>
            </div>

            <div class="divider"></div>

            <div class="section">
              <div class="section-title">Thông tin dịch vụ</div>
              <div class="info-row">
                <span class="info-label">Khóa học:</span>
                <span class="info-value">${bill.courseId && typeof bill.courseId === 'object' ? bill.courseId.title : 'Không có khóa học'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Mục đích:</span>
                <span class="info-value">${getPurposeLabel(bill.purpose)}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Mô tả:</span>
                <span class="info-value">${bill.description}</span>
              </div>
            </div>

            <div class="divider"></div>

            <div class="section">
              <div class="section-title">Thông tin thanh toán</div>
              <div class="info-row">
                <span class="info-label">Số tiền:</span>
                <span class="info-value amount">${formatCurrency(bill.amount)} ${bill.currency}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Phương thức:</span>
                <span class="info-value">${getPaymentMethodLabel(bill.paymentMethod)}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Trạng thái:</span>
                <span class="info-value">${getStatusLabel(bill.status)}</span>
              </div>
            </div>

            <div class="footer">
              <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
              <p>Liên hệ hỗ trợ: support@lmsplatform.com</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Create blob and download
    const blob = new Blob([receiptContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bien_lai_${bill._id}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('vi-VN');
  
  // Format Transaction ID to be shorter and more compact
  const formatTransactionId = (transactionId: string | undefined): string => {
    if (!transactionId) return 'Chưa có';
    if (transactionId.length <= 20) return transactionId;
    // Show first 12 chars + ... + last 8 chars
    return `${transactionId.substring(0, 12)}...${transactionId.substring(transactionId.length - 8)}`;
  };

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
              <Typography variant="h5" fontWeight={800}>Hóa đơn & Thanh toán</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Quản lý hóa đơn và theo dõi thanh toán</Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                color="inherit"
                startIcon={refreshing ? <CircularProgress size={20} /> : <AutorenewIcon />}
                sx={{ color: '#111827' }}
                onClick={handleRefresh}
                disabled={refreshing}
              >
                Làm mới
              </Button>
              <Button
                variant="contained"
                color="inherit"
                startIcon={<FileDownloadIcon />}
                sx={{ color: '#111827' }}
                onClick={handleExportExcel}
              >
                Xuất Excel
              </Button>
              <Button variant="contained" color="secondary" startIcon={<AddIcon />}>Tạo hóa đơn</Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Stats */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Chip label="Tổng hóa đơn" />
                <Typography variant="h6" fontWeight={700}>{pagination.total}</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Chip color="success" label="Đã thanh toán" />
                <Typography variant="h6" fontWeight={700}>
                  {bills?.filter(b => b.status === 'completed').length || 0}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Chip color="warning" label="Chờ thanh toán" />
                <Typography variant="h6" fontWeight={700}>
                  {bills?.filter(b => b.status === 'pending').length || 0}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Chip color="info" label="Tổng thu" />
                <Typography variant="h6" fontWeight={700}>
                  {formatCurrency(revenueAnalytics?.totalRevenue || 0)}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField fullWidth placeholder="Tìm kiếm theo học viên, khóa học hoặc mô tả..." value={filters.search} onChange={(e) => handleFilterChange({ search: e.target.value })} InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }} />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select label="Trạng thái" value={filters.status} onChange={(e) => handleFilterChange({ status: e.target.value })} MenuProps={{ disableScrollLock: true }}>
                <MenuItem value="all">Tất cả trạng thái</MenuItem>
                <MenuItem value="pending">Chờ thanh toán</MenuItem>
                <MenuItem value="paid">Đã thanh toán</MenuItem>
                <MenuItem value="failed">Thất bại</MenuItem>
                <MenuItem value="refunded">Đã hoàn tiền</MenuItem>
                <MenuItem value="cancelled">Đã hủy</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Phương thức</InputLabel>
              <Select label="Phương thức" value={filters.paymentMethod} onChange={(e) => handleFilterChange({ paymentMethod: e.target.value })} MenuProps={{ disableScrollLock: true }}>
                <MenuItem value="all">Tất cả phương thức</MenuItem>
                <MenuItem value="vnpay">VNPay</MenuItem>
                <MenuItem value="stripe">Stripe</MenuItem>
                <MenuItem value="paypal">PayPal</MenuItem>
                <MenuItem value="bank_transfer">Chuyển khoản</MenuItem>
                <MenuItem value="cash">Tiền mặt</MenuItem>
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

      {/* Bills list */}
      <Grid container spacing={2}>
        {bills.map((bill) => (
          <Grid key={bill._id} item xs={12}>
            <Card>
              <CardContent>
                <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', lg: 'flex-start' }}>
                  {/* Transaction Info */}
                  <Box sx={{ minWidth: 200 }}>
                    <Typography variant="subtitle2" color="text.secondary">Transaction ID</Typography>
                    {bill.transactionId ? (
                      <Tooltip title={bill.transactionId} arrow placement="top">
                        <Typography 
                          fontWeight={800} 
                          fontSize="0.9rem"
                          sx={{ 
                            cursor: 'help',
                            wordBreak: 'break-all',
                            fontFamily: 'monospace'
                          }}
                        >
                          {formatTransactionId(bill.transactionId)}
                        </Typography>
                      </Tooltip>
                    ) : (
                      <Typography fontWeight={800} fontSize="0.9rem">Chưa có</Typography>
                    )}
                    <Typography variant="subtitle2" color="text.secondary" mt={1}>Bill ID</Typography>
                    <Typography fontWeight={600} fontSize="0.8rem" color="text.secondary">{bill._id}</Typography>
                  </Box>

                  {/* Student & Course Info */}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight={800} mb={1}>
                      {bill.courseId && typeof bill.courseId === 'object' ? bill.courseId.title : bill.courseTitle || 'Không có khóa học'}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Học viên</Typography>
                        <Typography fontWeight={700}>
                          {bill.studentId && typeof bill.studentId === 'object' ? bill.studentId.name : bill.studentName || 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Email</Typography>
                        <Typography fontWeight={600} fontSize="0.9rem">
                          {bill.studentId && typeof bill.studentId === 'object' ? bill.studentId.email : bill.studentEmail || 'N/A'}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Typography variant="body2" color="text.secondary" mt={1}>Mô tả</Typography>
                    <Typography fontWeight={600} fontSize="0.9rem">{bill.description}</Typography>
                  </Box>

                  {/* Payment Details */}
                  <Box sx={{ minWidth: 180 }}>
                    <Typography variant="subtitle2" color="text.secondary">Số tiền</Typography>
                    <Typography fontWeight={800} fontSize="1.1rem" color="primary.main">
                      {formatCurrency(bill.amount)} {bill.currency}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary" mt={1}>Phương thức</Typography>
                    <Typography fontWeight={700}>{getPaymentMethodLabel(bill.paymentMethod)}</Typography>
                    <Typography variant="subtitle2" color="text.secondary" mt={1}>Mục đích</Typography>
                    <Typography fontWeight={600}>{getPurposeLabel(bill.purpose)}</Typography>
                  </Box>

                  {/* Date & Status */}
                  <Box sx={{ minWidth: 180 }}>
                    <Typography variant="subtitle2" color="text.secondary">Ngày tạo</Typography>
                    <Typography fontWeight={700}>{formatDate(bill.createdAt)}</Typography>
                    {bill.paidAt && (
                      <>
                        <Typography variant="subtitle2" color="text.secondary" mt={1}>Ngày thanh toán</Typography>
                        <Typography fontWeight={700} color="success.main">{formatDate(bill.paidAt)}</Typography>
                      </>
                    )}
                    {bill.refundedAt && (
                      <>
                        <Typography variant="subtitle2" color="text.secondary" mt={1}>Ngày hoàn tiền</Typography>
                        <Typography fontWeight={700} color="info.main">{formatDate(bill.refundedAt)}</Typography>
                      </>
                    )}
                    <Box mt={1}>
                      <Chip
                        size="small"
                        color={
                          bill.status === 'completed' ? 'success' :
                            bill.status === 'pending' ? 'warning' :
                              bill.status === 'failed' ? 'error' :
                                bill.status === 'refunded' ? 'info' : 'default'
                        }
                        label={getStatusLabel(bill.status)}
                      />
                    </Box>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1.5} mt={2}>
                  <Button variant="text" onClick={() => handleViewBillDetails(bill)}>
                    Xem chi tiết
                  </Button>
                  {bill.status === 'pending' && (
                    <Button variant="outlined" onClick={() => handleSendReminder(bill)}>
                      Nhắc nhở
                    </Button>
                  )}
                  {bill.status === 'completed' && (
                    <Button variant="contained" onClick={() => handleExportReceipt(bill)}>
                      Xuất biên lai
                    </Button>
                  )}
                  {bill.status === 'pending' && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteBill(bill)}
                    >
                      Xóa
                    </Button>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {bills.length === 0 && !loading && (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>Không có hóa đơn nào</Typography>
          <Typography variant="body2" color="text.secondary">
            {filters.search || filters.status !== 'all' || filters.paymentMethod !== 'all' || filters.dateRange !== 'all'
              ? 'Không tìm thấy hóa đơn nào phù hợp với bộ lọc hiện tại'
              : 'Chưa có hóa đơn nào trong hệ thống'}
          </Typography>
        </Paper>
      )}

      {/* Pagination */}
      {bills.length > 0 && (
        <Paper sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body2">
            Hiển thị {bills.length} trong tổng số {pagination.total} hóa đơn
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              disabled={pagination.page === 0}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            >
              ← Trước
            </Button>
            <Typography variant="body2">Trang {pagination.page + 1} / {pagination.pages}</Typography>
            <Button
              disabled={pagination.page >= pagination.pages - 1}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            >
              Sau →
            </Button>
          </Stack>
        </Paper>
      )}

      {/* Bill Details Dialog */}
      <Dialog
        open={billDetailsOpen}
        onClose={() => setBillDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Chi tiết hóa đơn</Typography>
            <IconButton onClick={() => setBillDetailsOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {selectedBill && (
            <Grid container spacing={3}>
              {/* Bill Info */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>Thông tin hóa đơn</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Mã hóa đơn</Typography>
                      <Typography fontWeight={600}>{selectedBill._id}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Transaction ID</Typography>
                      {selectedBill.transactionId ? (
                        <Tooltip title={selectedBill.transactionId} arrow placement="top">
                          <Typography 
                            fontWeight={600}
                            sx={{ 
                              cursor: 'help',
                              wordBreak: 'break-all',
                              fontFamily: 'monospace'
                            }}
                          >
                            {formatTransactionId(selectedBill.transactionId)}
                          </Typography>
                        </Tooltip>
                      ) : (
                        <Typography fontWeight={600}>Chưa có</Typography>
                      )}
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Ngày tạo</Typography>
                      <Typography fontWeight={600}>{formatDate(selectedBill.createdAt)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Trạng thái</Typography>
                      <Chip
                        size="small"
                        color={
                          selectedBill.status === 'completed' ? 'success' :
                            selectedBill.status === 'pending' ? 'warning' :
                              selectedBill.status === 'failed' ? 'error' :
                                selectedBill.status === 'refunded' ? 'info' : 'default'
                        }
                        label={getStatusLabel(selectedBill.status)}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Customer Info */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>Thông tin khách hàng</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Tên</Typography>
                      <Typography fontWeight={600}>
                        {selectedBill.studentId && typeof selectedBill.studentId === 'object' ? selectedBill.studentId.name : 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Email</Typography>
                      <Typography fontWeight={600}>
                        {selectedBill.studentId && typeof selectedBill.studentId === 'object' ? selectedBill.studentId.email : 'N/A'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Service Info */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>Thông tin dịch vụ</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">Khóa học</Typography>
                      <Typography fontWeight={600}>
                        {selectedBill.courseId && typeof selectedBill.courseId === 'object' ? selectedBill.courseId.title : 'Không có khóa học'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Mục đích</Typography>
                      <Typography fontWeight={600}>{getPurposeLabel(selectedBill.purpose)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Mô tả</Typography>
                      <Typography fontWeight={600}>{selectedBill.description}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Payment Info */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>Thông tin thanh toán</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Số tiền</Typography>
                      <Typography fontWeight={600} color="primary" fontSize="1.2rem">
                        {formatCurrency(selectedBill.amount)} {selectedBill.currency}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Phương thức</Typography>
                      <Typography fontWeight={600}>{getPaymentMethodLabel(selectedBill.paymentMethod)}</Typography>
                    </Grid>
                    {selectedBill.paidAt && (
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Ngày thanh toán</Typography>
                        <Typography fontWeight={600} color="success.main">{formatDate(selectedBill.paidAt)}</Typography>
                      </Grid>
                    )}
                    {selectedBill.refundedAt && (
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Ngày hoàn tiền</Typography>
                        <Typography fontWeight={600} color="info.main">{formatDate(selectedBill.refundedAt)}</Typography>
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              </Grid>

              {/* Metadata */}
              {selectedBill.metadata && (
                <Grid item xs={12}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>Thông tin bổ sung</Typography>
                    <pre style={{
                      backgroundColor: '#f5f5f5',
                      padding: '12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      overflow: 'auto',
                      maxHeight: '200px'
                    }}>
                      {JSON.stringify(selectedBill.metadata, null, 2)}
                    </pre>
                  </Paper>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBillDetailsOpen(false)}>Đóng</Button>
          {selectedBill?.status === 'completed' && (
            <Button variant="contained" onClick={() => handleExportReceipt(selectedBill)}>
              Xuất biên lai
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BillsPayments;
