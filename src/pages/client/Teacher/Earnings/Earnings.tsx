import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Breadcrumbs, Grid, Card, CardContent, Chip, CircularProgress, Stack, Button,
  Select, MenuItem, FormControl, InputLabel, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, Divider
} from '@mui/material';
import { Download as DownloadIcon, Payment as PaymentIcon, Email as EmailIcon, Settings as SettingsIcon } from '@mui/icons-material';

interface EarningData {
  totalEarnings: number;
  monthlyEarnings: number;
  totalStudents: number;
  totalCourses: number;
  monthlyGrowth: number;
  recentTransactions: Transaction[];
  monthlyBreakdown: MonthlyData[];
}

interface Transaction {
  id: string;
  courseTitle: string;
  studentName: string;
  amount: number;
  type: 'purchase' | 'refund' | 'commission';
  status: 'completed' | 'pending' | 'failed';
  date: string;
  transactionId: string;
}

interface MonthlyData {
  month: string;
  earnings: number;
  students: number;
  courses: number;
}

const Earnings: React.FC = () => {
  const [earningData, setEarningData] = useState<EarningData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month');

  useEffect(() => {
    setTimeout(() => {
      const mockData: EarningData = {
        totalEarnings: 12500000,
        monthlyEarnings: 2800000,
        totalStudents: 245,
        totalCourses: 4,
        monthlyGrowth: 15.5,
        recentTransactions: [
          { id: '1', courseTitle: 'React Advanced Patterns', studentName: 'Nguyễn Văn A', amount: 299000, type: 'purchase', status: 'completed', date: '2024-01-15T10:30:00Z', transactionId: 'TXN_001' },
          { id: '2', courseTitle: 'Python Data Science', studentName: 'Trần Thị B', amount: 499000, type: 'purchase', status: 'completed', date: '2024-01-14T14:20:00Z', transactionId: 'TXN_002' },
          { id: '3', courseTitle: 'React Advanced Patterns', studentName: 'Lê Văn C', amount: 299000, type: 'refund', status: 'completed', date: '2024-01-13T16:45:00Z', transactionId: 'TXN_003' },
          { id: '4', courseTitle: 'UI/UX Design Fundamentals', studentName: 'Phạm Thị D', amount: 199000, type: 'purchase', status: 'pending', date: '2024-01-12T08:15:00Z', transactionId: 'TXN_004' }
        ],
        monthlyBreakdown: [
          { month: 'Tháng 1', earnings: 2800000, students: 45, courses: 4 },
          { month: 'Tháng 12', earnings: 2400000, students: 38, courses: 4 },
          { month: 'Tháng 11', earnings: 2100000, students: 32, courses: 3 },
          { month: 'Tháng 10', earnings: 1800000, students: 28, courses: 3 },
          { month: 'Tháng 9', earnings: 1500000, students: 25, courses: 3 },
          { month: 'Tháng 8', earnings: 1200000, students: 20, courses: 2 }
        ]
      };
      setEarningData(mockData);
      setLoading(false);
    }, 800);
  }, []);

  const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h6" color="text.secondary">Đang tải dữ liệu...</Typography>
        </Box>
      </Container>
    );
  }

  if (!earningData) return null;

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs sx={{ mb: 1 }}>
          <Typography color="text.primary">Teacher Dashboard</Typography>
          <Typography color="text.secondary">Doanh thu & Hóa đơn</Typography>
        </Breadcrumbs>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Doanh thu & Hóa đơn</Typography>
      </Box>

      {/* Period Selector */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 180 }} size="small">
          <InputLabel>Khoảng thời gian</InputLabel>
          <Select value={selectedPeriod} label="Khoảng thời gian" onChange={(e) => setSelectedPeriod(e.target.value as any)} MenuProps={{ disableScrollLock: true }}>
            <MenuItem value="month">Tháng này</MenuItem>
            <MenuItem value="quarter">Quý này</MenuItem>
            <MenuItem value="year">Năm nay</MenuItem>
          </Select>
        </FormControl>
        <Chip color="success" label={`Tăng trưởng +${earningData.monthlyGrowth}%`} />
      </Stack>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card><CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle2" color="text.secondary">Tổng doanh thu</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>{formatCurrency(earningData.totalEarnings)}</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card><CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle2" color="text.secondary">Doanh thu tháng này</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>{formatCurrency(earningData.monthlyEarnings)}</Typography>
            <Chip size="small" color="success" label={`+${earningData.monthlyGrowth}%`} sx={{ mt: 1 }} />
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card><CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle2" color="text.secondary">Tổng học viên</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>{earningData.totalStudents}</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card><CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle2" color="text.secondary">Khóa học đang bán</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>{earningData.totalCourses}</Typography>
          </CardContent></Card>
        </Grid>
      </Grid>

      {/* Monthly Breakdown (bar placeholder) */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Biểu đồ doanh thu theo tháng</Typography>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 220 }}>
            {earningData.monthlyBreakdown.map((m) => (
              <Box key={m.month}>
                <Box sx={{ width: 24, height: `${(m.earnings / Math.max(...earningData.monthlyBreakdown.map(mm => mm.earnings))) * 100}%`, bgcolor: 'primary.main', borderRadius: 0.5 }} />
                <Typography variant="caption" color="text.secondary">{m.month}</Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Giao dịch gần đây</Typography>
            <Button variant="outlined">Xem tất cả</Button>
          </Stack>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Khóa học</TableCell>
                  <TableCell>Học viên</TableCell>
                  <TableCell align="right">Số tiền</TableCell>
                  <TableCell>Loại</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Thời gian</TableCell>
                  <TableCell>ID giao dịch</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {earningData.recentTransactions.map((t) => (
                  <TableRow key={t.id} hover>
                    <TableCell>{t.courseTitle}</TableCell>
                    <TableCell>{t.studentName}</TableCell>
                    <TableCell align="right">{(t.type === 'refund' ? '-' : '+')}{formatCurrency(t.amount)}</TableCell>
                    <TableCell>
                      <Chip size="small" label={t.type === 'purchase' ? 'Mua' : 'Hoàn tiền'} color={t.type === 'refund' ? 'warning' : 'primary'} />
                    </TableCell>
                    <TableCell>
                      <Chip size="small" label={t.status === 'completed' ? 'Hoàn thành' : t.status === 'pending' ? 'Chờ xử lý' : 'Thất bại'} color={t.status === 'completed' ? 'success' : t.status === 'pending' ? 'warning' : 'error'} />
                    </TableCell>
                    <TableCell>{formatDate(t.date)}</TableCell>
                    <TableCell>{t.transactionId}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Divider sx={{ my: 3 }} />
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}><Button fullWidth variant="contained" startIcon={<DownloadIcon />}>Xuất báo cáo</Button></Grid>
        <Grid item xs={12} md={3}><Button fullWidth variant="outlined" startIcon={<PaymentIcon />}>Cài đặt thanh toán</Button></Grid>
        <Grid item xs={12} md={3}><Button fullWidth variant="outlined" startIcon={<EmailIcon />}>Gửi hóa đơn</Button></Grid>
        <Grid item xs={12} md={3}><Button fullWidth variant="outlined" startIcon={<SettingsIcon />}>Cài đặt hoa hồng</Button></Grid>
      </Grid>
    </Container>
  );
};

export default Earnings;
