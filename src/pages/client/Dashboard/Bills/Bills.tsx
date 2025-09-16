import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  Visibility as VisibilityIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  Redo as RedoIcon
} from '@mui/icons-material';

interface Bill {
  _id: string;
  studentId: string;
  courseId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  transactionId: string;
  purpose: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

const Bills: React.FC = () => {
  const [billsData, setBillsData] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'completed' | 'failed' | 'refunded'>('all');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockData: Bill[] = [
        {
          _id: 'bill_001',
          studentId: 'student_001',
          courseId: 'course_001',
          amount: 500000,
          currency: 'VND',
          paymentMethod: 'stripe',
          status: 'completed',
          transactionId: 'txn_123456789',
          purpose: 'course_purchase',
          paidAt: '2025-01-15T10:30:00Z',
          createdAt: '2025-01-15T10:25:00Z',
          updatedAt: '2025-01-15T10:30:00Z'
        },
        {
          _id: 'bill_002',
          studentId: 'student_001',
          courseId: 'course_002',
          amount: 800000,
          currency: 'VND',
          paymentMethod: 'momo',
          status: 'pending',
          transactionId: 'txn_123456790',
          paidAt: '2025-01-15T10:30:00Z',
          purpose: 'course_purchase',
          createdAt: '2025-01-14T14:20:00Z',
          updatedAt: '2025-01-14T14:20:00Z'
        },
        {
          _id: 'bill_003',
          studentId: 'student_001',
          courseId: 'course_003',
          amount: 600000,
          currency: 'VND',
          paymentMethod: 'zalopay',
          status: 'failed',
          paidAt: '2025-01-15T10:30:00Z',
          transactionId: 'txn_123456791',
          purpose: 'course_purchase',
          createdAt: '2025-01-13T09:15:00Z',
          updatedAt: '2025-01-13T09:20:00Z'
        },
        {
          _id: 'bill_004',
          studentId: 'student_001',
          courseId: 'course_004',
          amount: 700000,
          currency: 'VND',
          paymentMethod: 'bank_transfer',
          status: 'refunded',
          transactionId: 'txn_123456792',
          purpose: 'refund',
          paidAt: '2025-01-12T08:10:00Z',
          createdAt: '2025-01-12T08:10:00Z',
          updatedAt: '2025-01-20T10:00:00Z'
        }
      ];
      setBillsData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

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
    switch (method) {
      case 'stripe':
        return 'Thẻ tín dụng (Stripe)';
      case 'momo':
        return 'Ví MoMo';
      case 'zalopay':
        return 'Ví ZaloPay';
      case 'bank_transfer':
        return 'Chuyển khoản ngân hàng';
      default:
        return method;
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

  // Tính toán stats từ billsData array
  const stats = useMemo(() => {
    const totalAmount = billsData.reduce((sum, bill) => sum + bill.amount, 0);
    const completedAmount = billsData.filter(bill => bill.status === 'completed').reduce((sum, bill) => sum + bill.amount, 0);
    const pendingAmount = billsData.filter(bill => bill.status === 'pending').reduce((sum, bill) => sum + bill.amount, 0);
    const failedAmount = billsData.filter(bill => bill.status === 'failed').reduce((sum, bill) => sum + bill.amount, 0);
    const refundedAmount = billsData.filter(bill => bill.status === 'refunded').reduce((sum, bill) => sum + bill.amount, 0);

    return {
      totalAmount,
      completedAmount,
      pendingAmount,
      failedAmount,
      refundedAmount
    };
  }, [billsData]);

  const statsCards = useMemo(() => [
    {
      icon: <MoneyIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Tổng giao dịch',
      value: formatPrice(stats.totalAmount),
      color: 'primary'
    },
    {
      icon: <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      title: 'Đã hoàn thành',
      value: formatPrice(stats.completedAmount),
      color: 'success'
    },
    {
      icon: <PendingIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      title: 'Đang xử lý',
      value: formatPrice(stats.pendingAmount),
      color: 'warning'
    },
    {
      icon: <CancelIcon sx={{ fontSize: 40, color: 'error.main' }} />,
      title: 'Thất bại',
      value: formatPrice(stats.failedAmount),
      color: 'error'
    },
    {
      icon: <RefreshIcon sx={{ fontSize: 40, color: 'info.main' }} />,
      title: 'Đã hoàn tiền',
      value: formatPrice(stats.refundedAmount),
      color: 'info'
    }
  ], [stats, formatPrice]);

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

  if (!billsData) {
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
          <Typography>Vui lòng thử lại sau</Typography>
        </Alert>
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
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              Giao dịch #{bill.transactionId}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {getPurposeLabel(bill.purpose)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(bill.createdAt)}
                            </Typography>
                          </Box>
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
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<VisibilityIcon />}
                            >
                              Chi tiết
                            </Button>

                            {bill.status === 'pending' && (
                              <Button
                                variant="contained"
                                size="small"
                                startIcon={<PaymentIcon />}
                              >
                                Thanh toán
                              </Button>
                            )}

                            {bill.status === 'failed' && (
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<RedoIcon />}
                                color="warning"
                              >
                                Thử lại
                              </Button>
                            )}

                            {bill.status === 'completed' && (
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<ReceiptIcon />}
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