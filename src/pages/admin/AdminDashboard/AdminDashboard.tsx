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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SchoolIcon from '@mui/icons-material/School';
import PaidIcon from '@mui/icons-material/Paid';

interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  pendingCourses: number;
  pendingRefunds: number;
  activeUsers: number;
  newUsersToday: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalRevenue: 0,
    pendingCourses: 5,
    pendingRefunds: 2,
    activeUsers: 0,
    newUsersToday: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalUsers: 1247,
        totalCourses: 89,
        totalEnrollments: 3456,
        totalRevenue: 125000000,
        pendingCourses: 5,
        pendingRefunds: 2,
        activeUsers: 892,
        newUsersToday: 23
      });
      setLoading(false);
    }, 1000);
  }, []);

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
              <Chip color="success" variant="filled" icon={<TrendingUpIcon />} label={`+${stats.newUsersToday} user hôm nay`} sx={{ bgcolor: 'rgba(34,197,94,0.2)', color: '#e6ffed' }} />
              <Button variant="contained" color="inherit" startIcon={<RefreshIcon />} onClick={() => window.location.reload()} sx={{ color: '#1f2937' }}>
                Làm mới
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
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.light' }}>
                  <PeopleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700}>{formatNumber(stats.totalUsers)}</Typography>
                  <Typography variant="body2" color="text.secondary">Tổng người dùng</Typography>
                  <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                    <TrendingUpIcon color="success" fontSize="small" />
                    <Typography variant="caption" color="success.main">+{stats.newUsersToday} hôm nay</Typography>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'success.light' }}>
                  <LibraryBooksIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700}>{formatNumber(stats.totalCourses)}</Typography>
                  <Typography variant="body2" color="text.secondary">Tổng khóa học</Typography>
                  <Typography variant="caption" color="warning.main">{stats.pendingCourses} chờ duyệt</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'info.light' }}>
                  <SchoolIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700}>{formatNumber(stats.totalEnrollments)}</Typography>
                  <Typography variant="body2" color="text.secondary">Tổng đăng ký</Typography>
                  <Typography variant="caption" color="info.main">{stats.activeUsers} đang hoạt động</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'warning.light' }}>
                  <PaidIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700}>{formatCurrencyShort(stats.totalRevenue)}</Typography>
                  <Typography variant="body2" color="text.secondary">Tổng doanh thu</Typography>
                  <Typography variant="caption" color="error.main">{stats.pendingRefunds} yêu cầu hoàn tiền</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section (placeholders) */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="subtitle1" fontWeight={700}>Tăng trưởng người dùng</Typography>
                <Stack direction="row" spacing={1}>
                  <Button size="small" variant="contained">7 ngày</Button>
                  <Button size="small" variant="outlined">30 ngày</Button>
                  <Button size="small" variant="outlined">90 ngày</Button>
                </Stack>
              </Stack>
              <Box sx={{ height: 220, borderRadius: 2, bgcolor: 'action.hover', position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', inset: 0, p: 2, display: 'grid', gridTemplateRows: 'repeat(7,1fr)', gap: 1 }}>
                  {[...Array(7)].map((_, i) => (
                    <Box key={i} sx={{ height: 2, bgcolor: 'divider', opacity: 0.7 }} />
                  ))}
                </Box>
                <Typography variant="caption" sx={{ position: 'absolute', bottom: 8, left: 12, color: 'text.secondary' }}>
                  Biểu đồ tăng trưởng người dùng theo thời gian
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="subtitle1" fontWeight={700}>Doanh thu theo tháng</Typography>
                <Stack direction="row" spacing={1}>
                  <Button size="small" variant="contained">2024</Button>
                  <Button size="small" variant="outlined">2023</Button>
                </Stack>
              </Stack>
              <Box sx={{ height: 220, borderRadius: 2, bgcolor: 'action.hover', position: 'relative', p: 2, display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                {[60, 80, 45, 90, 70, 85].map((h, i) => (
                  <Box key={i} sx={{ width: '12%', height: `${h}%`, bgcolor: 'primary.main', borderRadius: 1 }} />
                ))}
                <Typography variant="caption" sx={{ position: 'absolute', bottom: 8, left: 12, color: 'text.secondary' }}>
                  Biểu đồ doanh thu theo tháng
                </Typography>
              </Box>
            </CardContent>
          </Card>
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
                  <Avatar sx={{ bgcolor: 'warning.main', width: 24, height: 24, fontSize: 12 }}>{stats.pendingCourses}</Avatar>
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
                  <Avatar sx={{ bgcolor: 'error.main', width: 24, height: 24, fontSize: 12 }}>{stats.pendingRefunds}</Avatar>
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

      {/* Recent Activity */}
      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={700} mb={1}>Hoạt động gần đây</Typography>
          <Divider sx={{ mb: 1 }} />
          <List>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <PeopleIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="User mới đăng ký" secondary="Nguyễn Văn A đã đăng ký tài khoản — 2 phút trước" />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <LibraryBooksIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Khóa học mới" secondary={'"React Advanced" đang chờ duyệt — 15 phút trước'} />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <PaidIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Thanh toán thành công" secondary={'Khóa học "Python Basics" - 299,000 VND — 1 giờ trước'} />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminDashboard;
