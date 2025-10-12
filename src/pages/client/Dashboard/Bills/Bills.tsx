import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { paymentService, Bill, PaymentStats } from '@/services/client/payment.service';
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
  Tabs,
  Tab,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Alert,
  CircularProgress,
  Avatar,
  Divider
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  Receipt as ReceiptIcon,
  Redo as RedoIcon
} from '@mui/icons-material';

const Bills: React.FC = () => {
  const [billsData, setBillsData] = useState<Bill[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'completed' | 'failed' | 'refunded'>('all');

  useEffect(() => {
    fetchBillsData();
  }, []);

  const fetchBillsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch bills and stats in parallel
      const [billsResponse, statsResponse] = await Promise.all([
        paymentService.getPaymentHistory({ limit: 100 }),
        paymentService.getPaymentStats()
      ]);

      if (billsResponse.success) {
        setBillsData(billsResponse.data || []);
      }

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || 'Failed to load bills data';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching bills:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = useCallback((amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  }, []);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  const getStatusLabel = useCallback((status: Bill['status']) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'pending':
        return 'Đang xử lý';
      case 'failed':
        return 'Thất bại';
      case 'refunded':
        return 'Đã hoàn tiền';
      default:
        return status;
    }
  }, []);

  const getStatusColor = useCallback((status: Bill['status']): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      case 'refunded':
        return 'info';
      default:
        return 'default';
    }
  }, []);

  const getPaymentMethodLabel = useCallback((method: string) => {
    switch (method?.toLowerCase()) {
      case 'stripe':
        return 'Thẻ tín dụng (Stripe)';
      case 'momo':
        return 'Ví MoMo';
      case 'zalopay':
        return 'Ví ZaloPay';
      case 'vnpay':
        return 'VNPay';
      case 'bank_transfer':
        return 'Chuyển khoản ngân hàng';
      default:
        return method ? method.toUpperCase() : 'N/A';
    }
  }, []);

  const getPurposeLabel = useCallback((purpose: string) => {
    switch (purpose) {
      case 'course_purchase':
        return 'Mua khóa học';
      case 'subscription':
        return 'Đăng ký gói';
      case 'refund':
        return 'Hoàn tiền';
      default:
        return purpose;
    }
  }, []);

  // Retry failed payment
  const handleRetryPayment = useCallback(async (billId: string) => {
    try {
      const loadingToast = toast.loading('Đang khởi tạo thanh toán...');
      const response = await paymentService.retryPayment(billId);

      toast.dismiss(loadingToast);

      if (response.success && response.data.paymentUrl) {
        toast.success('Chuyển đến trang thanh toán...');
        // Redirect to payment URL
        window.location.href = response.data.paymentUrl;
      } else {
        toast.error('Không thể khởi tạo thanh toán');
      }
    } catch (err: any) {
      toast.dismiss();
      toast.error(err?.response?.data?.error || 'Retry payment failed');
      console.error('Error retrying payment:', err);
    }
  }, []);

  // Download invoice
  const handleDownloadInvoice = useCallback(async (billId: string, courseName: string) => {
    try {
      const loadingToast = toast.loading('Đang tải hóa đơn...');
      const blob = await paymentService.downloadInvoice(billId);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${courseName.replace(/\s+/g, '-')}-${billId.substring(18)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.dismiss(loadingToast);
      toast.success('Đã tải hóa đơn thành công!');
    } catch (err: any) {
      toast.dismiss();
      toast.error(err?.response?.data?.error || 'Không thể tải hóa đơn');
      console.error('Error downloading invoice:', err);
    }
  }, []);

  const filteredBills = useMemo(() => {
    if (!billsData) return [];

    switch (selectedFilter) {
      case 'pending':
        return billsData.filter((bill) => bill.status === 'pending');
      case 'completed':
        return billsData.filter((bill) => bill.status === 'completed');
      case 'failed':
        return billsData.filter((bill) => bill.status === 'failed');
      case 'refunded':
        return billsData.filter((bill) => bill.status === 'refunded');
      default:
        return billsData;
    }
  }, [billsData, selectedFilter]);

  const statsCards = useMemo(() => {
    if (!stats) {
      return [
        { icon: <MoneyIcon sx={{ fontSize: 40, color: 'primary.main' }} />, title: 'Tổng chi tiêu', value: '0₫', color: 'primary' },
        { icon: <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main' }} />, title: 'Đã hoàn thành', value: '0', color: 'success' },
        { icon: <PendingIcon sx={{ fontSize: 40, color: 'warning.main' }} />, title: 'Đang xử lý', value: '0', color: 'warning' },
        { icon: <CancelIcon sx={{ fontSize: 40, color: 'error.main' }} />, title: 'Thất bại', value: '0', color: 'error' },
        { icon: <ReceiptIcon sx={{ fontSize: 40, color: 'info.main' }} />, title: 'Tổng hóa đơn', value: '0', color: 'info' }
      ];
    }

    return [
      {
        icon: <MoneyIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
        title: 'Tổng chi tiêu',
        value: formatPrice(stats.totalSpent),
        color: 'primary'
      },
      {
        icon: <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main' }} />,
        title: 'Đã hoàn thành',
        value: stats.completedPayments.toString(),
        color: 'success'
      },
      {
        icon: <PendingIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
        title: 'Đang xử lý',
        value: stats.pendingPayments.toString(),
        color: 'warning'
      },
      {
        icon: <CancelIcon sx={{ fontSize: 40, color: 'error.main' }} />,
        title: 'Thất bại',
        value: stats.failedPayments.toString(),
        color: 'error'
      },
      {
        icon: <ReceiptIcon sx={{ fontSize: 40, color: 'info.main' }} />,
        title: 'Tổng hóa đơn',
        value: stats.totalBills.toString(),
        color: 'info'
      }
    ];
  }, [stats, formatPrice]);

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Hóa đơn & Thanh toán
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Quản lý tất cả giao dịch thanh toán của bạn
          </Typography>
        </Box>

        {/* Loading State */}
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Đang tải dữ liệu...
            </Typography>
          </CardContent>
        </Card>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Hóa đơn & Thanh toán
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Quản lý tất cả giao dịch thanh toán của bạn
          </Typography>
        </Box>

        {/* Error State */}
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="h6">Không thể tải dữ liệu</Typography>
          <Typography>{error}</Typography>
        </Alert>

        <Button variant="contained" onClick={fetchBillsData} startIcon={<RefreshIcon />}>
          🔄 Thử lại
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Hóa đơn & Thanh toán
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quản lý tất cả giao dịch thanh toán của bạn
        </Typography>
      </Box>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={2.4} key={index}>
            <Card
              sx={{
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: `${stat.color}.light`, width: 60, height: 60 }}>
                    {stat.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                      {stat.value}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filter Tabs */}
      <Card sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={selectedFilter}
            onChange={(_, newValue) => setSelectedFilter(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab
              label={`Tất cả (${billsData.length})`}
              value="all"
              icon={<MoneyIcon />}
              iconPosition="start"
            />
            <Tab
              label={`Hoàn thành (${billsData.filter((bill) => bill.status === 'completed').length})`}
              value="completed"
              icon={<CheckCircleIcon />}
              iconPosition="start"
            />
            <Tab
              label={`Đang xử lý (${billsData.filter((bill) => bill.status === 'pending').length})`}
              value="pending"
              icon={<PendingIcon />}
              iconPosition="start"
            />
            <Tab
              label={`Thất bại (${billsData.filter((bill) => bill.status === 'failed').length})`}
              value="failed"
              icon={<CancelIcon />}
              iconPosition="start"
            />
            <Tab
              label={`Đã hoàn tiền (${billsData.filter((bill) => bill.status === 'refunded').length})`}
              value="refunded"
              icon={<RefreshIcon />}
              iconPosition="start"
            />
          </Tabs>
        </Box>
      </Card>

      {/* Bills List */}
      <Card>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Danh sách hóa đơn
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Quản lý tất cả giao dịch thanh toán của bạn
            </Typography>
          </Box>

          {filteredBills.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <MoneyIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Không có hóa đơn nào
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bạn chưa có giao dịch thanh toán nào
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableBody>
                  {filteredBills.map((bill, index) => (
                    <React.Fragment key={bill._id}>
                      <TableRow
                        sx={{
                          '&:hover': {
                            backgroundColor: 'action.hover'
                          }
                        }}
                      >
                        <TableCell>
                          <Stack direction="row" spacing={2} alignItems="center">
                            {typeof bill.courseId === 'object' && bill.courseId.thumbnail && (
                              <Avatar
                                src={bill.courseId.thumbnail}
                                variant="rounded"
                                sx={{ width: 60, height: 60 }}
                              />
                            )}
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {typeof bill.courseId === 'object' ? bill.courseId.title : `Giao dịch #${bill.transactionId || bill._id.substring(18)}`}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {getPurposeLabel(bill.purpose)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatDate(bill.createdAt)}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>

                        <TableCell>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {formatPrice(bill.amount)}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={getStatusLabel(bill.status)}
                            color={getStatusColor(bill.status)}
                            size="small"
                          />
                        </TableCell>

                        <TableCell>
                          <Typography variant="body2">
                            {getPaymentMethodLabel(bill.paymentMethod)}
                          </Typography>
                          {bill.paidAt && (
                            <Typography variant="caption" color="text.secondary">
                              Thanh toán: {formatDate(bill.paidAt)}
                            </Typography>
                          )}
                        </TableCell>

                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            {bill.status === 'failed' && (
                              <Button
                                variant="contained"
                                size="small"
                                startIcon={<RedoIcon />}
                                color="warning"
                                onClick={() => handleRetryPayment(bill._id)}
                              >
                                Thử lại
                              </Button>
                            )}

                            {bill.status === 'completed' && (
                              <Button
                                variant="contained"
                                size="small"
                                startIcon={<ReceiptIcon />}
                                onClick={() => handleDownloadInvoice(
                                  bill._id,
                                  typeof bill.courseId === 'object' ? bill.courseId.title : 'course'
                                )}
                              >
                                Tải hóa đơn
                              </Button>
                            )}
                          </Stack>
                        </TableCell>
                      </TableRow>
                      {index < filteredBills.length - 1 && (
                        <TableRow>
                          <TableCell colSpan={5} sx={{ py: 0 }}>
                            <Divider />
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default Bills;