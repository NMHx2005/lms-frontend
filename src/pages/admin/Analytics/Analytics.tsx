import React, { useState, useEffect } from 'react';
// import './Analytics.css';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  CircularProgress,
  Paper,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

interface AnalyticsData {
  revenue: {
    total: number;
    monthly: number;
    growth: number;
    chartData: { month: string; value: number }[];
  };
  users: {
    total: number;
    active: number;
    new: number;
    growth: number;
    chartData: { month: string; value: number }[];
  };
  courses: {
    total: number;
    published: number;
    draft: number;
    enrollment: number;
    chartData: { month: string; value: number }[];
  };
  engagement: {
    completionRate: number;
    avgSessionTime: number;
    bounceRate: number;
    chartData: { month: string; value: number }[];
  };
}

interface TopPerformer {
  _id: string;
  name: string;
  type: 'course' | 'instructor' | 'category';
  metric: string;
  value: number;
  change: number;
  icon: string;
}

const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'users' | 'courses' | 'engagement'>('revenue');

  useEffect(() => {
    setTimeout(() => {
      const mockAnalyticsData: AnalyticsData = {
        revenue: { total: 1250000, monthly: 98000, growth: 12.5, chartData: [{ month: 'T1', value: 85000 }, { month: 'T2', value: 92000 }, { month: 'T3', value: 88000 }, { month: 'T4', value: 95000 }, { month: 'T5', value: 102000 }, { month: 'T6', value: 98000 }] },
        users: { total: 15420, active: 8920, new: 1250, growth: 8.3, chartData: [{ month: 'T1', value: 8200 }, { month: 'T2', value: 8400 }, { month: 'T3', value: 8600 }, { month: 'T4', value: 8800 }, { month: 'T5', value: 9000 }, { month: 'T6', value: 8920 }] },
        courses: { total: 1247, published: 1189, draft: 58, enrollment: 45620, chartData: [{ month: 'T1', value: 42000 }, { month: 'T2', value: 43500 }, { month: 'T3', value: 44800 }, { month: 'T4', value: 45200 }, { month: 'T5', value: 45500 }, { month: 'T6', value: 45620 }] },
        engagement: { completionRate: 78.5, avgSessionTime: 24.3, bounceRate: 32.1, chartData: [{ month: 'T1', value: 75.2 }, { month: 'T2', value: 76.8 }, { month: 'T3', value: 77.5 }, { month: 'T4', value: 78.1 }, { month: 'T5', value: 78.3 }, { month: 'T6', value: 78.5 }] }
      };

      const mockTopPerformers: TopPerformer[] = [
        { _id: '1', name: 'React Advanced Patterns', type: 'course', metric: 'Doanh thu', value: 125000, change: 15.2, icon: '📚' },
        { _id: '2', name: 'Nguyễn Văn A', type: 'instructor', metric: 'Học viên', value: 1247, change: 8.7, icon: '👨‍🏫' },
        { _id: '3', name: 'Lập trình Web', type: 'category', metric: 'Khóa học', value: 89, change: 12.3, icon: '🌐' },
        { _id: '4', name: 'Machine Learning Basics', type: 'course', metric: 'Đánh giá', value: 4.8, change: 5.2, icon: '📚' },
        { _id: '5', name: 'Trần Thị B', type: 'instructor', metric: 'Doanh thu', value: 89000, change: 22.1, icon: '👩‍🏫' }
      ];

      setAnalyticsData(mockAnalyticsData);
      setTopPerformers(mockTopPerformers);
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
  const formatNumber = (value: number) => new Intl.NumberFormat('vi-VN').format(value);
  const formatPercentage = (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  const getGrowthColor = (value: number) => (value >= 0 ? 'success' : 'error');

  const renderChart = (data: { month: string; value: number }[], metric: string) => {
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue;

    return (
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 1, alignItems: 'end', height: 220 }}>
          {data.map((item, index) => {
            const height = range > 0 ? ((item.value - minValue) / range) * 100 : 50;
            return (
              <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: '100%', height: `${height}%`, bgcolor: 'primary.main', borderRadius: 1 }} />
                <Typography variant="caption" color="text.secondary">{item.month}</Typography>
                <Typography variant="caption">
                  {metric === 'revenue' ? formatCurrency(item.value) : metric === 'users' || metric === 'courses' ? formatNumber(item.value) : `${item.value.toFixed(1)}%`}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    );
  };

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

  if (!analyticsData) return <div>Không có dữ liệu</div>;

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
              <FormControl size="small">
                <InputLabel>Thời gian</InputLabel>
                <Select label="Thời gian" value={dateRange} onChange={(e) => setDateRange(String(e.target.value))} MenuProps={{ disableScrollLock: true }}>
                  <MenuItem value="7d">7 ngày qua</MenuItem>
                  <MenuItem value="30d">30 ngày qua</MenuItem>
                  <MenuItem value="90d">90 ngày qua</MenuItem>
                  <MenuItem value="1y">1 năm qua</MenuItem>
                </Select>
              </FormControl>
              <Button variant="contained" color="inherit" startIcon={<FileDownloadIcon />} sx={{ color: '#111827' }}>Xuất báo cáo</Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}><Card><CardContent><Stack spacing={1}><Stack direction="row" spacing={1} alignItems="center"><Chip label="Doanh thu" /><Typography variant="body2" color="text.secondary">Tháng này</Typography></Stack><Typography variant="h6" fontWeight={800}>{formatCurrency(analyticsData.revenue.monthly)}</Typography><Typography variant="body2" color={`${getGrowthColor(analyticsData.revenue.growth)}.main`}>{formatPercentage(analyticsData.revenue.growth)}</Typography></Stack></CardContent></Card></Grid>
        <Grid item xs={12} sm={6} md={3}><Card><CardContent><Stack spacing={1}><Stack direction="row" spacing={1} alignItems="center"><Chip label="Người dùng" /></Stack><Typography variant="h6" fontWeight={800}>{formatNumber(analyticsData.users.active)}</Typography><Typography variant="body2" color={`${getGrowthColor(analyticsData.users.growth)}.main`}>{formatPercentage(analyticsData.users.growth)}</Typography></Stack></CardContent></Card></Grid>
        <Grid item xs={12} sm={6} md={3}><Card><CardContent><Stack spacing={1}><Stack direction="row" spacing={1} alignItems="center"><Chip label="Khóa học" /></Stack><Typography variant="h6" fontWeight={800}>{formatNumber(analyticsData.courses.published)}</Typography><Typography variant="body2" color="text.secondary">/ {formatNumber(analyticsData.courses.total)} tổng cộng</Typography></Stack></CardContent></Card></Grid>
        <Grid item xs={12} sm={6} md={3}><Card><CardContent><Stack spacing={1}><Stack direction="row" spacing={1} alignItems="center"><Chip label="Tỷ lệ hoàn thành" /></Stack><Typography variant="h6" fontWeight={800}>{analyticsData.engagement.completionRate}%</Typography><Typography variant="body2" color="text.secondary">Thời gian TB: {analyticsData.engagement.avgSessionTime} phút</Typography></Stack></CardContent></Card></Grid>
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
              <ToggleButton value="engagement">Tương tác</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
          {selectedMetric === 'revenue' && renderChart(analyticsData.revenue.chartData, 'revenue')}
          {selectedMetric === 'users' && renderChart(analyticsData.users.chartData, 'users')}
          {selectedMetric === 'courses' && renderChart(analyticsData.courses.chartData, 'courses')}
          {selectedMetric === 'engagement' && renderChart(analyticsData.engagement.chartData, 'engagement')}
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={700} mb={1}>Top Performers</Typography>
          <Grid container spacing={2}>
            {topPerformers.map(performer => (
              <Grid key={performer._id} item xs={12} sm={6} md={4} lg={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography fontSize={20}>{performer.icon}</Typography>
                      <Box>
                        <Typography fontWeight={700}>{performer.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{performer.type}</Typography>
                      </Box>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                      <Typography variant="body2" color="text.secondary">{performer.metric}</Typography>
                      <Typography fontWeight={800}>{performer.metric === 'Doanh thu' ? formatCurrency(performer.value) : performer.metric === 'Đánh giá' ? `${performer.value}/5.0` : formatNumber(performer.value)}</Typography>
                      <Chip size="small" label={formatPercentage(performer.change)} color={getGrowthColor(performer.change)} variant="outlined" />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Detailed Stats */}
      <Card>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={700} mb={1}>Thống kê chi tiết</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={3}><Paper variant="outlined" sx={{ p: 2 }}><Typography fontWeight={700}>Tài chính</Typography><Stack mt={1} spacing={0.5}><Stack direction="row" justifyContent="space-between"><Typography variant="body2">Doanh thu tổng</Typography><Typography fontWeight={700}>{formatCurrency(analyticsData.revenue.total)}</Typography></Stack><Stack direction="row" justifyContent="space-between"><Typography variant="body2">Tăng trưởng TB</Typography><Chip size="small" label={formatPercentage(analyticsData.revenue.growth)} color={getGrowthColor(analyticsData.revenue.growth)} variant="outlined" /></Stack></Stack></Paper></Grid>
            <Grid item xs={12} md={6} lg={3}><Paper variant="outlined" sx={{ p: 2 }}><Typography fontWeight={700}>Người dùng</Typography><Stack mt={1} spacing={0.5}><Stack direction="row" justifyContent="space-between"><Typography variant="body2">Tổng số</Typography><Typography fontWeight={700}>{formatNumber(analyticsData.users.total)}</Typography></Stack><Stack direction="row" justifyContent="space-between"><Typography variant="body2">Mới tháng này</Typography><Typography fontWeight={700}>{formatNumber(analyticsData.users.new)}</Typography></Stack></Stack></Paper></Grid>
            <Grid item xs={12} md={6} lg={3}><Paper variant="outlined" sx={{ p: 2 }}><Typography fontWeight={700}>Khóa học</Typography><Stack mt={1} spacing={0.5}><Stack direction="row" justifyContent="space-between"><Typography variant="body2">Tổng số</Typography><Typography fontWeight={700}>{formatNumber(analyticsData.courses.total)}</Typography></Stack><Stack direction="row" justifyContent="space-between"><Typography variant="body2">Đăng ký</Typography><Typography fontWeight={700}>{formatNumber(analyticsData.courses.enrollment)}</Typography></Stack></Stack></Paper></Grid>
            <Grid item xs={12} md={6} lg={3}><Paper variant="outlined" sx={{ p: 2 }}><Typography fontWeight={700}>Tương tác</Typography><Stack mt={1} spacing={0.5}><Stack direction="row" justifyContent="space-between"><Typography variant="body2">Tỷ lệ bounce</Typography><Typography fontWeight={700}>{analyticsData.engagement.bounceRate}%</Typography></Stack><Stack direction="row" justifyContent="space-between"><Typography variant="body2">Thời gian TB</Typography><Typography fontWeight={700}>{analyticsData.engagement.avgSessionTime} phút</Typography></Stack></Stack></Paper></Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Export */}
      <Card>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={700} mb={1}>Xuất báo cáo</Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<FileDownloadIcon />}>PDF</Button>
            <Button variant="outlined" startIcon={<FileDownloadIcon />}>Excel</Button>
            <Button variant="outlined" startIcon={<FileDownloadIcon />}>CSV</Button>
            <Button variant="contained">Tự động gửi email</Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Analytics;
