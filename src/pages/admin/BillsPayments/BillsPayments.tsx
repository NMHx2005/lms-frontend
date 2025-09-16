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
  Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AddIcon from '@mui/icons-material/Add';

interface Bill {
  _id: string;
  billNumber: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  tax: number;
  total: number;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  paymentMethod: string;
  paymentDate?: string;
  dueDate: string;
  createdAt: string;
  invoiceUrl?: string;
  receiptUrl?: string;
}

interface BillFilters {
  search: string;
  status: string;
  paymentMethod: string;
  dateRange: string;
}

const BillsPayments: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [filteredBills, setFilteredBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<BillFilters>({
    search: '',
    status: 'all',
    paymentMethod: 'all',
    dateRange: 'all'
  });

  useEffect(() => {
    setTimeout(() => {
      const mockBills: Bill[] = [
        {
          _id: '1',
          billNumber: 'INV-2024-001',
          studentId: 'student-1',
          studentName: 'Nguyễn Văn A',
          studentEmail: 'nguyenvana@email.com',
          courseId: 'course-1',
          courseTitle: 'React Advanced Patterns',
          amount: 299000,
          tax: 29900,
          total: 328900,
          status: 'paid',
          paymentMethod: 'Credit Card',
          paymentDate: '2024-01-20T10:30:00Z',
          dueDate: '2024-01-25T00:00:00Z',
          createdAt: '2024-01-18T00:00:00Z'
        },
        {
          _id: '2',
          billNumber: 'INV-2024-002',
          studentId: 'student-2',
          studentName: 'Trần Thị B',
          studentEmail: 'tranthib@email.com',
          courseId: 'course-2',
          courseTitle: 'Python Data Science',
          amount: 399000,
          tax: 39900,
          total: 438900,
          status: 'pending',
          paymentMethod: 'Bank Transfer',
          dueDate: '2024-01-30T00:00:00Z',
          createdAt: '2024-01-19T00:00:00Z'
        },
        {
          _id: '3',
          billNumber: 'INV-2024-003',
          studentId: 'student-3',
          studentName: 'Lê Văn C',
          studentEmail: 'levanc@email.com',
          courseId: 'course-3',
          courseTitle: 'Web Design Principles',
          amount: 199000,
          tax: 19900,
          total: 218900,
          status: 'overdue',
          paymentMethod: 'Credit Card',
          dueDate: '2024-01-15T00:00:00Z',
          createdAt: '2024-01-10T00:00:00Z'
        }
      ];
      setBills(mockBills);
      setFilteredBills(mockBills);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const filtered = bills.filter(bill => {
      const matchesSearch = bill.billNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
        bill.studentName.toLowerCase().includes(filters.search.toLowerCase()) ||
        bill.courseTitle.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus = filters.status === 'all' || bill.status === filters.status;
      const matchesPaymentMethod = filters.paymentMethod === 'all' || bill.paymentMethod === filters.paymentMethod;

      let matchesDateRange = true;
      if (filters.dateRange !== 'all') {
        const dueDate = new Date(bill.dueDate);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - dueDate.getTime());
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

      return matchesSearch && matchesStatus && matchesPaymentMethod && matchesDateRange;
    });
    setFilteredBills(filtered);
  }, [bills, filters]);

  const handleFilterChange = (newFilters: Partial<BillFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: 'Chờ thanh toán',
      paid: 'Đã thanh toán',
      overdue: 'Quá hạn',
      cancelled: 'Đã hủy'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('vi-VN');

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
              <Button variant="contained" color="inherit" startIcon={<AutorenewIcon />} sx={{ color: '#111827' }} onClick={() => window.location.reload()}>Làm mới</Button>
              <Button variant="contained" color="inherit" startIcon={<FileDownloadIcon />} sx={{ color: '#111827' }}>Xuất Excel</Button>
              <Button variant="contained" color="secondary" startIcon={<AddIcon />}>Tạo hóa đơn</Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Stats */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}><Card><CardContent><Stack direction="row" spacing={2} alignItems="center"><Chip label="Tổng hóa đơn" /><Typography variant="h6" fontWeight={700}>{filteredBills.length}</Typography></Stack></CardContent></Card></Grid>
        <Grid item xs={12} sm={6} md={3}><Card><CardContent><Stack direction="row" spacing={2} alignItems="center"><Chip color="success" label="Đã thanh toán" /><Typography variant="h6" fontWeight={700}>{bills.filter(b => b.status === 'paid').length}</Typography></Stack></CardContent></Card></Grid>
        <Grid item xs={12} sm={6} md={3}><Card><CardContent><Stack direction="row" spacing={2} alignItems="center"><Chip color="warning" label="Chờ thanh toán" /><Typography variant="h6" fontWeight={700}>{bills.filter(b => b.status === 'pending').length}</Typography></Stack></CardContent></Card></Grid>
        <Grid item xs={12} sm={6} md={3}><Card><CardContent><Stack direction="row" spacing={2} alignItems="center"><Chip color="info" label="Tổng thu" /><Typography variant="h6" fontWeight={700}>{formatCurrency(bills.filter(b => b.status === 'paid').reduce((sum, b) => sum + b.total, 0))}</Typography></Stack></CardContent></Card></Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField fullWidth placeholder="Tìm kiếm theo số hóa đơn, học viên hoặc khóa học..." value={filters.search} onChange={(e) => handleFilterChange({ search: e.target.value })} InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }} />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select label="Trạng thái" value={filters.status} onChange={(e) => handleFilterChange({ status: e.target.value })} MenuProps={{ disableScrollLock: true }}>
                <MenuItem value="all">Tất cả trạng thái</MenuItem>
                <MenuItem value="pending">Chờ thanh toán</MenuItem>
                <MenuItem value="paid">Đã thanh toán</MenuItem>
                <MenuItem value="overdue">Quá hạn</MenuItem>
                <MenuItem value="cancelled">Đã hủy</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Phương thức</InputLabel>
              <Select label="Phương thức" value={filters.paymentMethod} onChange={(e) => handleFilterChange({ paymentMethod: e.target.value })} MenuProps={{ disableScrollLock: true }}>
                <MenuItem value="all">Tất cả phương thức</MenuItem>
                <MenuItem value="Credit Card">Credit Card</MenuItem>
                <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                <MenuItem value="Cash">Cash</MenuItem>
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
        {filteredBills.map((bill) => (
          <Grid key={bill._id} item xs={12}>
            <Card>
              <CardContent>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }}>
                  <Box sx={{ minWidth: 120 }}>
                    <Typography variant="subtitle2" color="text.secondary">Số hóa đơn</Typography>
                    <Typography fontWeight={800}>{bill.billNumber}</Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight={800}>{bill.courseTitle}</Typography>
                    <Grid container spacing={2} mt={0.5}>
                      <Grid item xs={12} sm={4}><Typography variant="body2" color="text.secondary">Học viên</Typography><Typography fontWeight={700}>{bill.studentName}</Typography></Grid>
                      <Grid item xs={12} sm={4}><Typography variant="body2" color="text.secondary">Email</Typography><Typography fontWeight={700}>{bill.studentEmail}</Typography></Grid>
                      <Grid item xs={12} sm={4}><Typography variant="body2" color="text.secondary">Phương thức</Typography><Typography fontWeight={700}>{bill.paymentMethod}</Typography></Grid>
                    </Grid>
                  </Box>
                  <Box sx={{ minWidth: 240 }}>
                    <Grid container>
                      <Grid item xs={6}><Typography variant="body2" color="text.secondary">Giá gốc</Typography><Typography fontWeight={700}>{formatCurrency(bill.amount)}</Typography></Grid>
                      <Grid item xs={6}><Typography variant="body2" color="text.secondary">Thuế</Typography><Typography fontWeight={700}>{formatCurrency(bill.tax)}</Typography></Grid>
                      <Grid item xs={12} mt={0.5}><Typography variant="body2" color="text.secondary">Tổng cộng</Typography><Typography fontWeight={800}>{formatCurrency(bill.total)}</Typography></Grid>
                    </Grid>
                  </Box>
                  <Box sx={{ minWidth: 220 }}>
                    <Grid container>
                      <Grid item xs={12}><Typography variant="body2" color="text.secondary">Ngày tạo</Typography><Typography fontWeight={700}>{formatDate(bill.createdAt)}</Typography></Grid>
                      <Grid item xs={12}><Typography variant="body2" color="text.secondary">Hạn thanh toán</Typography><Typography fontWeight={700}>{formatDate(bill.dueDate)}</Typography></Grid>
                      {bill.paymentDate && (
                        <Grid item xs={12}><Typography variant="body2" color="text.secondary">Ngày thanh toán</Typography><Typography fontWeight={700}>{formatDate(bill.paymentDate)}</Typography></Grid>
                      )}
                    </Grid>
                  </Box>
                  <Box>
                    <Chip size="small" color={bill.status === 'paid' ? 'success' : bill.status === 'pending' ? 'warning' : bill.status === 'overdue' ? 'error' : 'default'} label={getStatusLabel(bill.status)} />
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1.5} mt={2}>
                  <Button variant="text">Xem chi tiết</Button>
                  <Button variant="text">Chỉnh sửa</Button>
                  {bill.status === 'pending' && (<Button variant="outlined">Nhắc nhở</Button>)}
                  {bill.status === 'paid' && (<Button variant="contained">Xuất biên lai</Button>)}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {filteredBills.length === 0 && (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>Không có hóa đơn nào</Typography>
          <Typography variant="body2" color="text.secondary">
            {filters.search || filters.status !== 'all' || filters.paymentMethod !== 'all' || filters.dateRange !== 'all'
              ? 'Không tìm thấy hóa đơn nào phù hợp với bộ lọc hiện tại'
              : 'Chưa có hóa đơn nào trong hệ thống'}
          </Typography>
        </Paper>
      )}

      {/* Pagination (static like original) */}
      {filteredBills.length > 0 && (
        <Paper sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body2">Hiển thị {filteredBills.length} trong tổng số {bills.length} hóa đơn</Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button disabled>← Trước</Button>
            <Typography variant="body2">Trang 1</Typography>
            <Button disabled>Sau →</Button>
          </Stack>
        </Paper>
      )}
    </Box>
  );
};

export default BillsPayments;
