import React, { useState, useEffect } from 'react';
// import './AdminDashboard.css';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Stack,
  Divider,
  CircularProgress,
  Avatar,
  Snackbar,
  Alert
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SchoolIcon from '@mui/icons-material/School';
import PaidIcon from '@mui/icons-material/Paid';
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
import { motion } from 'framer-motion';
import {
  AdminDashboardService,
  DashboardOverview,
  DashboardAnalytics,
  SystemOverview,
  UserAnalytics,
  DashboardCourseAnalytics,
  DashboardRevenueAnalytics,
  EnrollmentAnalytics
} from '../../../services/admin/adminDashboardService';

// Chart colors
const CHART_COLORS = {
  primary: '#5b8def',
  secondary: '#8b5cf6',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#06b6d4',
  purple: '#a855f7',
  pink: '#ec4899',
  indigo: '#6366f1',
  teal: '#14b8a6'
};

const PIE_COLORS = [CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.success, CHART_COLORS.warning, CHART_COLORS.error];

const AdminDashboard: React.FC = () => {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [_analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [_systemOverview, setSystemOverview] = useState<SystemOverview | null>(null);
  const [_userAnalytics, setUserAnalytics] = useState<UserAnalytics | null>(null);
  const [_courseAnalytics, setCourseAnalytics] = useState<DashboardCourseAnalytics | null>(null);
  const [_revenueAnalytics, setRevenueAnalytics] = useState<DashboardRevenueAnalytics | null>(null);
  const [_enrollmentAnalytics, setEnrollmentAnalytics] = useState<EnrollmentAnalytics | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Load all dashboard data
  const loadDashboardData = async (showNotification = false) => {
    try {
      if (showNotification) setRefreshing(true);
      else setLoading(true);
      setError(null);

      // Load all dashboard data in parallel
      const [
        overviewRes,
        analyticsRes,
        systemRes,
        userRes,
        courseRes,
        revenueRes,
        enrollmentRes
      ] = await Promise.all([
        AdminDashboardService.getDashboardOverview(),
        AdminDashboardService.getDashboardAnalytics('monthly'),
        AdminDashboardService.getSystemOverview(),
        AdminDashboardService.getUserAnalytics('monthly'),
        AdminDashboardService.getCourseAnalytics('monthly'),
        AdminDashboardService.getRevenueAnalytics('monthly'),
        AdminDashboardService.getEnrollmentAnalytics('monthly')
      ]);

      // Set all data
      if (overviewRes.success) setOverview(overviewRes.data);
      if (analyticsRes.success) setAnalytics(analyticsRes.data);
      if (systemRes.success) setSystemOverview(systemRes.data);
      if (userRes.success) setUserAnalytics(userRes.data);
      if (courseRes.success) setCourseAnalytics(courseRes.data);
      if (revenueRes.success) setRevenueAnalytics(revenueRes.data);
      if (enrollmentRes.success) setEnrollmentAnalytics(enrollmentRes.data);

      if (showNotification) {
        setSuccessMessage('Đã làm mới dữ liệu dashboard thành công!');
      }
    } catch (err: any) {
      console.error('Error loading dashboard data:', err);
      setError(err.response?.data?.error || 'Có lỗi xảy ra khi tải dữ liệu dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleRefresh = () => {
    loadDashboardData(true);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  const formatCurrencyShort = (amount: number) => {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)}T`;
    } else if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    }
    return amount.toString();
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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Card sx={{
        background: 'linear-gradient(135deg, #5b8def 0%, #8b5cf6 100%)',
        color: 'white',
        borderRadius: 2
      }}>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={2}>
            <Box>
              <Typography variant="h5" fontWeight={800}>Dashboard</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Tổng quan hệ thống LMS</Typography>
            </Box>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Chip
                color="success"
                variant="filled"
                icon={<TrendingUpIcon />}
                label={`+${overview?.newUsersToday || 0} user hôm nay`}
                sx={{ bgcolor: 'rgba(34,197,94,0.2)', color: '#e6ffed' }}
              />
              <Button
                variant="contained"
                color="inherit"
                startIcon={refreshing ? <CircularProgress size={16} /> : <RefreshIcon />}
                onClick={handleRefresh}
                disabled={refreshing}
                sx={{ color: '#1f2937' }}
              >
                {refreshing ? 'Đang tải...' : 'Làm mới'}
              </Button>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Cập nhật: {new Date().toLocaleTimeString('vi-VN')}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card sx={{ borderRadius: 2, cursor: 'pointer', transition: 'all 0.3s ease' }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    <PeopleIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={700}>{formatNumber(overview?.totalUsers || 0)}</Typography>
                    <Typography variant="body2" color="text.secondary">Tổng người dùng</Typography>
                    <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                      <TrendingUpIcon color="success" fontSize="small" />
                      <Typography variant="caption" color="success.main">+{overview?.newUsersToday || 0} hôm nay</Typography>
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card sx={{ borderRadius: 2, cursor: 'pointer', transition: 'all 0.3s ease' }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: 'success.light' }}>
                    <LibraryBooksIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={700}>{formatNumber(overview?.totalCourses || 0)}</Typography>
                    <Typography variant="body2" color="text.secondary">Tổng khóa học</Typography>
                    <Typography variant="caption" color="warning.main">{overview?.pendingCourses || 0} chờ duyệt</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card sx={{ borderRadius: 2, cursor: 'pointer', transition: 'all 0.3s ease' }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: 'info.light' }}>
                    <SchoolIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={700}>{formatNumber(overview?.totalEnrollments || 0)}</Typography>
                    <Typography variant="body2" color="text.secondary">Tổng đăng ký</Typography>
                    <Typography variant="caption" color="info.main">{overview?.activeUsers || 0} đang hoạt động</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card sx={{ borderRadius: 2, cursor: 'pointer', transition: 'all 0.3s ease' }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: 'warning.light' }}>
                    <PaidIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={700}>{formatCurrencyShort(overview?.totalRevenue || 0)}</Typography>
                    <Typography variant="body2" color="text.secondary">Tổng doanh thu</Typography>
                    <Typography variant="caption" color="error.main">{overview?.pendingRefunds || 0} yêu cầu hoàn tiền</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={2}>
        {/* User Growth Chart */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card sx={{ borderRadius: 2, height: '100%' }}>
              <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="h6" fontWeight={700} color="primary">
                    📊 Phân bố người dùng theo vai trò
                  </Typography>
                </Stack>
                {_userAnalytics?.usersByRole ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={_userAnalytics.usersByRole.map((item: any, index: number) => ({
                          name: item._id === 'student' ? 'Học viên' :
                            item._id === 'teacher' ? 'Giảng viên' :
                              item._id === 'admin' ? 'Quản trị viên' : item._id,
                          value: item.count,
                          fill: PIE_COLORS[index % PIE_COLORS.length]
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={1000}
                      >
                        {_userAnalytics.usersByRole.map((_: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Box sx={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress />
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Course Distribution Chart */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card sx={{ borderRadius: 2, height: '100%' }}>
              <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="h6" fontWeight={700} color="success.main">
                    🎯 Phân bố khóa học theo lĩnh vực
                  </Typography>
                </Stack>
                {_courseAnalytics?.coursesByDomain ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={_courseAnalytics.coursesByDomain.map((item: any, index: number) => ({
                      name: item._id,
                      value: item.count,
                      fill: PIE_COLORS[index % PIE_COLORS.length]
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        fill={CHART_COLORS.success}
                        animationBegin={0}
                        animationDuration={1200}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Box sx={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress />
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Enrollment Trends */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="h6" fontWeight={700} color="info.main">
                    📈 Top khóa học có nhiều đăng ký nhất
                  </Typography>
                </Stack>
                {_enrollmentAnalytics?.enrollmentsByCourse ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={_enrollmentAnalytics.enrollmentsByCourse.map((item: any) => ({
                        name: item.courseName.length > 20 ?
                          item.courseName.substring(0, 20) + '...' :
                          item.courseName,
                        enrollments: item.enrollments,
                        fullName: item.courseName
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis />
                      <Tooltip
                        formatter={(value: any) => [
                          value,
                          'Số đăng ký'
                        ]}
                        labelFormatter={(label: string, payload: any) =>
                          payload && payload[0] ? payload[0].payload.fullName : label
                        }
                      />
                      <Bar
                        dataKey="enrollments"
                        fill={CHART_COLORS.info}
                        animationBegin={0}
                        animationDuration={1500}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress />
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={700} mb={2}>Hành động nhanh</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button fullWidth variant="outlined" sx={{ justifyContent: 'flex-start', py: 1.5 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar sx={{ bgcolor: 'warning.main', width: 24, height: 24, fontSize: 12 }}>{overview?.pendingCourses || 0}</Avatar>
                  <Typography fontWeight={700}>Duyệt khóa học</Typography>
                </Stack>
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button fullWidth variant="outlined" sx={{ justifyContent: 'flex-start', py: 1.5 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar sx={{ bgcolor: 'secondary.main', width: 24, height: 24, fontSize: 12 }}>3</Avatar>
                  <Typography fontWeight={700}>Xử lý báo cáo</Typography>
                </Stack>
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button fullWidth variant="outlined" sx={{ justifyContent: 'flex-start', py: 1.5 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar sx={{ bgcolor: 'error.main', width: 24, height: 24, fontSize: 12 }}>{overview?.pendingRefunds || 0}</Avatar>
                  <Typography fontWeight={700}>Xử lý hoàn tiền</Typography>
                </Stack>
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button fullWidth variant="outlined" sx={{ justifyContent: 'flex-start', py: 1.5 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar sx={{ bgcolor: 'primary.main', width: 24, height: 24 }}>
                    <PeopleIcon fontSize="small" />
                  </Avatar>
                  <Typography fontWeight={700}>Quản lý user</Typography>
                </Stack>
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Recent Activity & System Status */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} mb={2} color="primary">
                  📋 Thống kê tổng quan
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" fontWeight={700} color="primary">
                        {_userAnalytics?.totalUsers || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tổng người dùng
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" fontWeight={700} color="success.main">
                        {_courseAnalytics?.totalCourses || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tổng khóa học
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" fontWeight={700} color="info.main">
                        {_enrollmentAnalytics?.totalEnrollments || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tổng đăng ký
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" fontWeight={700} color="warning.main">
                        {formatCurrencyShort(overview?.totalRevenue || 0)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tổng doanh thu
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} mb={2} color="success.main">
                  🔧 Trạng thái hệ thống
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Trạng thái hệ thống</Typography>
                    <Chip
                      label={overview?.systemHealth === 'healthy' ? 'Khỏe mạnh' : 'Cảnh báo'}
                      color={overview?.systemHealth === 'healthy' ? 'success' : 'warning'}
                      size="small"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Uptime Server</Typography>
                    <Chip
                      label={overview?.serverUptime || '99.9%'}
                      color="success"
                      size="small"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Người dùng mới hôm nay</Typography>
                    <Chip
                      label={_userAnalytics?.newUsers || 0}
                      color="primary"
                      size="small"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Khóa học chờ duyệt</Typography>
                    <Chip
                      label={_courseAnalytics?.pendingCourses || 0}
                      color="warning"
                      size="small"
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccessMessage(null)} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminDashboard;
