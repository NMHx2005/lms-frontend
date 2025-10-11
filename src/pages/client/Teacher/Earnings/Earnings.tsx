import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  Box, Container, Typography, Breadcrumbs, Grid, Card, CardContent, CircularProgress, Stack, Button,
  Select, MenuItem, FormControl, InputLabel, Divider,
  Tabs, Tab
} from '@mui/material';
import { Download as DownloadIcon, Payment as PaymentIcon, Email as EmailIcon, Settings as SettingsIcon } from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import * as earningsService from '@/services/client/earnings.service';
import generateEarningsPDF from '@/components/PDFReportGenerator';
import EarningsAnalytics from './EarningsAnalytics';

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
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch earnings overview
        const overviewRes = await earningsService.getEarningsOverview();

        // Fetch monthly breakdown
        const breakdownRes = await earningsService.getMonthlyBreakdown(6);

        if (overviewRes.success) {
          const overview = overviewRes.data;

          setEarningData({
            totalEarnings: overview.totalEarnings || 0,
            monthlyEarnings: overview.currentMonthEarnings || 0,
            totalStudents: overview.totalStudents || 0,
            totalCourses: overview.totalCourses || 0,
            monthlyGrowth: overview.growthRate || 0,
            recentTransactions: [], // No longer needed
            monthlyBreakdown: breakdownRes.success ? breakdownRes.data : []
          });
        }
      } catch (error: any) {
        console.error('Error loading earnings:', error);
        toast.error(error.response?.data?.message || 'Error loading earnings data');

        // Set empty data on error
        setEarningData({
          totalEarnings: 0,
          monthlyEarnings: 0,
          totalStudents: 0,
          totalCourses: 0,
          monthlyGrowth: 0,
          recentTransactions: [],
          monthlyBreakdown: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const handleExportPDF = async () => {
    if (!earningData) {
      toast.error('No data available for report generation');
      return;
    }

    try {
      await generateEarningsPDF({
        totalEarnings: earningData.totalEarnings,
        monthlyEarnings: earningData.monthlyEarnings,
        totalStudents: earningData.totalStudents,
        totalCourses: earningData.totalCourses,
        monthlyBreakdown: earningData.monthlyBreakdown,
        teacherName: 'Instructor', // TODO: Get from user context
        reportDate: new Date()
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Error generating PDF report');
    }
  };

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

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_e, newValue) => setActiveTab(newValue)}>
          <Tab label="Overview" />
          <Tab label="Analytics" />
        </Tabs>
      </Box>

      {activeTab === 1 && <EarningsAnalytics />}
      {activeTab === 0 && (
        <>
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
          </Stack>

          {/* Stats Overview */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography variant="subtitle2" color="text.secondary">Tổng doanh thu</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>{formatCurrency(earningData.totalEarnings)}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography variant="subtitle2" color="text.secondary">Doanh thu tháng này</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>{formatCurrency(earningData.monthlyEarnings)}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography variant="subtitle2" color="text.secondary">Tổng học viên</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>{earningData.totalStudents}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography variant="subtitle2" color="text.secondary">Khóa học đang bán</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>{earningData.totalCourses}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Monthly Breakdown Chart */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Biểu đồ doanh thu theo tháng</Typography>
              {earningData.monthlyBreakdown && earningData.monthlyBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={earningData.monthlyBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `${value / 1000}K`} />
                    <Tooltip
                      formatter={(value: number) => [formatCurrency(value), 'Doanh thu']}
                      labelFormatter={(label) => `Tháng: ${label}`}
                    />
                    <Bar dataKey="earnings" fill="#5b8def" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{
                  height: 300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  color: 'text.secondary'
                }}>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    📊 Chưa có dữ liệu biểu đồ
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Dữ liệu biểu đồ sẽ hiển thị khi có nhiều giao dịch hơn
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Divider sx={{ my: 3 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={handleExportPDF}
                disabled={loading || !earningData}
              >
                Xuất báo cáo PDF
              </Button>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button fullWidth variant="outlined" startIcon={<PaymentIcon />}>
                Cài đặt thanh toán
              </Button>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button fullWidth variant="outlined" startIcon={<EmailIcon />}>
                Gửi hóa đơn
              </Button>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button fullWidth variant="outlined" startIcon={<SettingsIcon />}>
                Cài đặt hoa hồng
              </Button>
            </Grid>
          </Grid>
        </>
      )}
    </Container >
  );
};

export default Earnings;
