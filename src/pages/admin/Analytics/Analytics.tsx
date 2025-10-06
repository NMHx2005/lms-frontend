import React, { useState, useEffect } from 'react';
// import './Analytics.css';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Grid,
  Button,
  Chip,
  CircularProgress,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Alert,
  Snackbar
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { AnalyticsService, DashboardAnalytics, UserAnalytics, EnrollmentAnalytics, ActivityLog, AnalyticsActivitySummary as ActivitySummary } from '../../../services/admin';
import type { RevenueAnalytics, CourseAnalytics } from '../../../services/admin/analyticsService';

// Chart colors
const CHART_COLORS = {
  primary: '#1976d2',
  secondary: '#dc004e',
  success: '#2e7d32',
  warning: '#ed6c02',
  info: '#0288d1',
  error: '#d32f2f'
};

const PIE_COLORS = ['#1976d2', '#dc004e', '#2e7d32', '#ed6c02', '#0288d1'];

const Analytics: React.FC = () => {
  const [_dashboardData, setDashboardData] = useState<DashboardAnalytics | null>(null);
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics | null>(null);
  const [courseAnalytics, setCourseAnalytics] = useState<CourseAnalytics | null>(null);
  const [revenueAnalytics, setRevenueAnalytics] = useState<RevenueAnalytics | null>(null);
  const [enrollmentAnalytics, setEnrollmentAnalytics] = useState<EnrollmentAnalytics | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [activitySummary, setActivitySummary] = useState<ActivitySummary | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'users' | 'courses' | 'enrollments'>('revenue');

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  // Load all analytics data
  const loadAnalyticsData = async () => {
    try {
      setLoading(true);

      // Fetch all analytics data in parallel
      const [
        dashboardResponse,
        userResponse,
        courseResponse,
        revenueResponse,
        enrollmentResponse,
        activityResponse,
        summaryResponse
      ] = await Promise.all([
        AnalyticsService.getDashboardAnalytics(period),
        AnalyticsService.getUserAnalytics(period),
        AnalyticsService.getCourseAnalytics(period),
        AnalyticsService.getRevenueAnalytics(period),
        AnalyticsService.getEnrollmentAnalytics(period),
        AnalyticsService.getActivityLogs({ period, limit: 10 }),
        AnalyticsService.getActivitySummary(period)
      ]);

      setDashboardData(dashboardResponse.data);
      setUserAnalytics(userResponse.data);
      setCourseAnalytics(courseResponse.data);
      setRevenueAnalytics(revenueResponse.data);
      setEnrollmentAnalytics(enrollmentResponse.data);
      setActivityLogs(activityResponse.data.items || []);
      setActivitySummary(summaryResponse.data);

    } catch (error) {
      console.error('Error loading analytics data:', error);
      showSnackbar('Lỗi khi tải dữ liệu analytics', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load data on component mount and when period changes
  useEffect(() => {
    loadAnalyticsData();
  }, [period]);

  // Helper functions
  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalyticsData();
  };

  const handlePeriodChange = (_event: React.MouseEvent<HTMLElement>, newPeriod: 'daily' | 'weekly' | 'monthly' | 'yearly' | null) => {
    if (newPeriod !== null) {
      setPeriod(newPeriod);
    }
  };

  const handleExportCSV = async () => {
    try {
      const blob = await AnalyticsService.exportActivityCSV({ period });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analytics_activity_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showSnackbar('Đã xuất file CSV thành công', 'success');
    } catch (error) {
      showSnackbar('Lỗi khi xuất file CSV', 'error');
    }
  };

  const handleExportPDF = async () => {
    try {
      const blob = await AnalyticsService.exportActivityPDF({ period });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analytics_report_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showSnackbar('Đã xuất file PDF thành công', 'success');
    } catch (error) {
      showSnackbar('Lỗi khi xuất file PDF', 'error');
    }
  };

  const formatCurrency = (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
  const formatNumber = (value: number) => new Intl.NumberFormat('vi-VN').format(value);


  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">Đang tải dữ liệu Analytics...</Typography>
        </Stack>
      </Box>
    );
  }

  if (!userAnalytics && !courseAnalytics && !revenueAnalytics && !enrollmentAnalytics) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
        <Typography variant="h6" color="text.secondary">Không có dữ liệu Analytics</Typography>
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
              <Typography variant="h5" fontWeight={800}>Analytics & Báo cáo</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Phân tích dữ liệu toàn diện về hiệu suất hệ thống LMS</Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <ToggleButtonGroup
                value={period}
                exclusive
                onChange={handlePeriodChange}
                size="small"
                color="primary"
              >
                <ToggleButton value="daily">Ngày</ToggleButton>
                <ToggleButton value="weekly">Tuần</ToggleButton>
                <ToggleButton value="monthly">Tháng</ToggleButton>
                <ToggleButton value="yearly">Năm</ToggleButton>
              </ToggleButtonGroup>
              <Button
                variant="outlined"
                onClick={handleRefresh}
                disabled={refreshing}
                startIcon={refreshing ? <CircularProgress size={16} /> : null}
              >
                {refreshing ? 'Đang tải...' : 'Làm mới'}
              </Button>
              <Button variant="contained" color="inherit" startIcon={<FileDownloadIcon />} sx={{ color: '#111827' }} onClick={handleExportPDF}>
                Xuất PDF
              </Button>
              <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={handleExportCSV}>
                Xuất CSV
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip label="Doanh thu" />
                  <Typography variant="body2" color="text.secondary">Tổng</Typography>
                </Stack>
                <Typography variant="h6" fontWeight={800}>
                  {revenueAnalytics ? formatCurrency(revenueAnalytics.totalRevenue) : '0 ₫'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Trung bình: {formatCurrency(revenueAnalytics?.averageOrderValue || 0)}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip label="Người dùng" />
                </Stack>
                <Typography variant="h6" fontWeight={800}>
                  {userAnalytics ? formatNumber(userAnalytics.activeUsers) : '0'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Mới: {formatNumber(userAnalytics?.newUsers || 0)}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip label="Khóa học" />
                </Stack>
                <Typography variant="h6" fontWeight={800}>
                  {courseAnalytics ? formatNumber(courseAnalytics.publishedCourses) : '0'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  / {courseAnalytics ? formatNumber(courseAnalytics.totalCourses) : '0'} tổng cộng
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip label="Đăng ký" />
                </Stack>
                <Typography variant="h6" fontWeight={800}>
                  {enrollmentAnalytics ? formatNumber(enrollmentAnalytics.totalEnrollments) : '0'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Mới: {formatNumber(enrollmentAnalytics?.newEnrollments || 0)}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Card>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" mb={1}>
            <Typography variant="subtitle1" fontWeight={700}>Biểu đồ xu hướng</Typography>
            <ToggleButtonGroup exclusive value={selectedMetric} onChange={(_, v) => v && setSelectedMetric(v)} size="small">
              <ToggleButton value="revenue">Doanh thu</ToggleButton>
              <ToggleButton value="users">Người dùng</ToggleButton>
              <ToggleButton value="courses">Khóa học</ToggleButton>
              <ToggleButton value="enrollments">Đăng ký</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
          {selectedMetric === 'revenue' && (
            <Box sx={{ height: 300 }}>
              <Typography variant="body2" color="text.secondary" textAlign="center" mt={10}>
                Không có dữ liệu doanh thu theo tháng
              </Typography>
            </Box>
          )}
          {selectedMetric === 'users' && userAnalytics?.usersByRole && (
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userAnalytics.usersByRole.map((item: any, index: number) => ({
                      name: item._id === 'student' ? 'Học viên' : item._id === 'teacher' ? 'Giảng viên' : 'Admin',
                      value: item.count,
                      fill: PIE_COLORS[index % PIE_COLORS.length]
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {userAnalytics.usersByRole.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          )}
          {selectedMetric === 'courses' && courseAnalytics?.coursesByDomain && (
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseAnalytics.coursesByDomain}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill={CHART_COLORS.primary} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          )}
          {selectedMetric === 'enrollments' && enrollmentAnalytics?.enrollmentsByCourse && (
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={enrollmentAnalytics.enrollmentsByCourse.slice(0, 5)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="courseName"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value: any, _: any) => [value, 'Đăng ký']}
                    labelFormatter={(label: any) => `Khóa học: ${label}`}
                  />
                  <Bar dataKey="enrollments" fill={CHART_COLORS.success} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700} mb={2}>Tóm tắt hoạt động</Typography>
              {activitySummary ? (
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Tổng hoạt động</Typography>
                    <Typography variant="h6" fontWeight={700}>
                      {formatNumber(activitySummary.byAction.reduce((sum: number, item: any) => sum + item.count, 0))}
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">Theo hành động</Typography>
                      <Stack spacing={0.5} mt={1}>
                        {activitySummary.byAction.map((item: any, index: number) => (
                          <Stack key={index} direction="row" justifyContent="space-between">
                            <Typography variant="caption">
                              {item._id.action === 'course_enroll' ? 'Đăng ký khóa học' : item._id.action}
                            </Typography>
                            <Typography variant="caption" fontWeight={600}>{item.count}</Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">Đang tải...</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700} mb={2}>Hoạt động gần đây</Typography>
              {activityLogs.length > 0 ? (
                <Stack spacing={1}>
                  {activityLogs.slice(0, 5).map((log) => (
                    <Paper key={log._id} variant="outlined" sx={{ p: 1.5 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {log.action === 'course_enroll' ? 'Đăng ký khóa học' : log.action}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">{log.resource}</Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            ID: {log.userId}
                          </Typography>
                        </Box>
                        <Stack alignItems="flex-end" spacing={0.5}>
                          <Chip
                            size="small"
                            label="Hoạt động"
                            color="info"
                          />
                          <Typography variant="caption" color="text.secondary">
                            {log.timeSinceCreation}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">Không có hoạt động nào</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Export */}
      <Card>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={700} mb={1}>Xuất báo cáo</Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={handleExportPDF}>
              Xuất PDF
            </Button>
            <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={handleExportCSV}>
              Xuất CSV
            </Button>
          </Stack>
        </CardContent>
      </Card>

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

export default Analytics;
