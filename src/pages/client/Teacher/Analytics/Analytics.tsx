import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AnalyticsData } from '../../../../types/index';
import * as teacherAnalyticsService from '@/services/client/teacher-analytics.service';
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Button,
  Chip,
  CircularProgress,
  Stack,
  LinearProgress
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  AttachMoney as AttachMoneyIcon,
  Visibility as VisibilityIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  Legend,
  ComposedChart,
  Area
} from 'recharts';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'students' | 'engagement'>('revenue');

  // Load analytics data from API
  const loadAnalyticsData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Map timeRange to API format
      const apiTimeRange = timeRange === '7d' ? '1month' :
        timeRange === '30d' ? '1month' :
          timeRange === '90d' ? '3months' : '1year';

      // Get dashboard data first (faster)
      const dashboardData = await teacherAnalyticsService.getDashboardOverview();

      // Then get analytics data (slower, may timeout)
      let analyticsData = null;
      try {
        analyticsData = await teacherAnalyticsService.getAnalyticsData(apiTimeRange);
      } catch (analyticsError: any) {
        console.warn('Analytics data timeout or error, using dashboard data only:', analyticsError.message);
        // Continue with just dashboard data
      }

      if (dashboardData.success) {
        // Use dashboard stats for overview
        const stats = dashboardData.data?.statistics || {};
        const courseStats = stats.courses || {};
        const studentStats = stats.students || {};

        // Transform API data to match AnalyticsData interface
        const transformedData: AnalyticsData = {
          overview: {
            totalStudents: studentStats.totalStudents || 0,
            totalCourses: courseStats.totalCourses || 0,
            totalRevenue: courseStats.totalRevenue || 0,
            totalViews: 0, // TODO: Add to backend
            averageRating: courseStats.averageRating || 0,
            completionRate: studentStats.averageProgress || 0
          },
          revenueData: analyticsData?.success ? analyticsData.data?.revenueData || [] : [],
          coursePerformance: analyticsData?.success ? analyticsData.data?.coursePerformance || [] : [],
          studentGrowth: analyticsData?.success ? analyticsData.data?.studentGrowth || [] : [],
          topCourses: analyticsData?.success ? analyticsData.data?.topCourses || [] : [],
          studentDemographics: analyticsData?.success ? analyticsData.data?.studentDemographics || {
            ageGroups: [],
            countries: [],
            experienceLevels: []
          } : {
            ageGroups: [],
            countries: [],
            experienceLevels: []
          },
          engagementMetrics: analyticsData?.success ? analyticsData.data?.engagementMetrics || {
            averageWatchTime: 0,
            assignmentSubmissionRate: 0,
            discussionParticipation: 0,
            certificateEarned: 0
          } : {
            averageWatchTime: 0,
            assignmentSubmissionRate: 0,
            discussionParticipation: 0,
            certificateEarned: 0
          }
        };

        setAnalyticsData(transformedData);
      }
    } catch (error: any) {
      console.error('Error loading analytics:', error);
      toast.error(error.response?.data?.message || 'Lỗi khi tải dữ liệu analytics');
      // Set empty data on error
      setAnalyticsData({
        overview: {
          totalStudents: 0,
          totalCourses: 0,
          totalRevenue: 0,
          totalViews: 0,
          averageRating: 0,
          completionRate: 0
        },
        revenueData: [],
        coursePerformance: [],
        studentGrowth: [],
        topCourses: [],
        studentDemographics: {
          ageGroups: [],
          countries: [],
          experienceLevels: []
        },
        engagementMetrics: {
          averageWatchTime: 0,
          assignmentSubmissionRate: 0,
          discussionParticipation: 0,
          certificateEarned: 0
        }
      });
    } finally {
      setIsLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    loadAnalyticsData();
  }, [loadAnalyticsData]);

  // Removed unused format helpers (inlined where needed)

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h6" color="text.secondary">Đang tải dữ liệu phân tích...</Typography>
        </Box>
      </Container>
    );
  }

  if (!analyticsData) return null;

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Typography color="text.primary">Teacher Dashboard</Typography>
          <Typography color="text.secondary">Analytics</Typography>
        </Breadcrumbs>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>Analytics Dashboard</Typography>
        <Typography variant="body1" color="text.secondary">Phân tích hiệu suất giảng dạy và thu nhập của bạn</Typography>
      </Box>

      {/* Time Range Selector */}
      <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
        {(['7d', '30d', '90d', '1y'] as const).map((range) => (
          <Button key={range} variant={timeRange === range ? 'contained' : 'outlined'} size="small" onClick={() => setTimeRange(range)}>
            {range === '7d' ? '7 Ngày' : range === '30d' ? '30 Ngày' : range === '90d' ? '90 Ngày' : '1 Năm'}
          </Button>
        ))}
      </Stack>

      {/* Overview Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4} lg={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <PeopleIcon color="primary" sx={{ fontSize: 36, mb: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{new Intl.NumberFormat('en-US').format(analyticsData.overview.totalStudents)}</Typography>
              <Typography variant="body2" color="text.secondary">Tổng học viên</Typography>
              <Chip label="+12%" color="success" size="small" sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <SchoolIcon color="success" sx={{ fontSize: 36, mb: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{analyticsData.overview.totalCourses}</Typography>
              <Typography variant="body2" color="text.secondary">Khóa học</Typography>
              <Chip label="+2" color="success" size="small" sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AttachMoneyIcon color="warning" sx={{ fontSize: 36, mb: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(analyticsData.overview.totalRevenue)}</Typography>
              <Typography variant="body2" color="text.secondary">Tổng thu nhập</Typography>
              <Chip label="+18%" color="success" size="small" sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <VisibilityIcon color="info" sx={{ fontSize: 36, mb: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{new Intl.NumberFormat('en-US').format(analyticsData.overview.totalViews)}</Typography>
              <Typography variant="body2" color="text.secondary">Tổng lượt xem</Typography>
              <Chip label="+8%" color="success" size="small" sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <StarIcon color="warning" sx={{ fontSize: 36, mb: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{analyticsData.overview.averageRating}</Typography>
              <Typography variant="body2" color="text.secondary">Đánh giá trung bình</Typography>
              <Chip label="+0.2" color="success" size="small" sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircleIcon color="secondary" sx={{ fontSize: 36, mb: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{`${analyticsData.overview.completionRate.toFixed(1)}%`}</Typography>
              <Typography variant="body2" color="text.secondary">Tỷ lệ hoàn thành</Typography>
              <Chip label="+3.2%" color="success" size="small" sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section - Professional Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Thu nhập & Học viên theo thời gian</Typography>
              {analyticsData.revenueData && analyticsData.revenueData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={analyticsData.revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12 }}
                      stroke="#888"
                    />
                    <YAxis
                      yAxisId="left"
                      orientation="left"
                      tick={{ fontSize: 12 }}
                      stroke="#888"
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                      label={{ value: 'Thu nhập (VND)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fontSize: 12 }}
                      stroke="#888"
                      label={{ value: 'Học viên', angle: 90, position: 'insideRight', style: { fontSize: 12 } }}
                    />
                    <Tooltip
                      formatter={(value: number, name: string) => {
                        if (name === 'revenue') {
                          return [new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value), 'Thu nhập'];
                        }
                        return [value, 'Học viên'];
                      }}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #ccc',
                        borderRadius: 8,
                        padding: '10px'
                      }}
                    />
                    <Legend
                      wrapperStyle={{ paddingTop: '10px' }}
                      formatter={(value) => value === 'revenue' ? 'Thu nhập' : 'Học viên'}
                    />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      fill="#5b8def"
                      fillOpacity={0.1}
                      stroke="none"
                    />
                    <Bar
                      yAxisId="left"
                      dataKey="revenue"
                      fill="#5b8def"
                      radius={[8, 8, 0, 0]}
                      maxBarSize={40}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="students"
                      stroke="#4caf50"
                      strokeWidth={3}
                      dot={{ fill: '#4caf50', r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </ComposedChart>
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
                  <Typography variant="body1" color="text.secondary">
                    📊 Chưa có dữ liệu
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Dữ liệu sẽ hiển thị khi có giao dịch
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Tăng trưởng học viên</Typography>
              {analyticsData.studentGrowth && analyticsData.studentGrowth.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.studentGrowth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12 }}
                      stroke="#888"
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      stroke="#888"
                      label={{ value: 'Số học viên', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
                    />
                    <Tooltip
                      formatter={(value: number, name: string) => {
                        const label = name === 'newStudents' ? 'Học viên mới' : 'Đang hoạt động';
                        return [value, label];
                      }}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #ccc',
                        borderRadius: 8,
                        padding: '10px'
                      }}
                    />
                    <Legend
                      wrapperStyle={{ paddingTop: '10px' }}
                      formatter={(value) => value === 'newStudents' ? 'Học viên mới' : 'Đang hoạt động'}
                    />
                    <Bar
                      dataKey="newStudents"
                      fill="#29b6f6"
                      radius={[8, 8, 0, 0]}
                      maxBarSize={40}
                    />
                    <Bar
                      dataKey="activeStudents"
                      fill="#0288d1"
                      radius={[8, 8, 0, 0]}
                      maxBarSize={40}
                    />
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
                  <Typography variant="body1" color="text.secondary">
                    📊 Chưa có dữ liệu
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Dữ liệu sẽ hiển thị khi có học viên mới
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Course Performance */}
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Hiệu suất khóa học</Typography>
          <Button component={Link} to="/teacher/courses" variant="outlined" size="small">Xem tất cả khóa học</Button>
        </Stack>
        <Grid container spacing={3}>
          {analyticsData.coursePerformance.map((course) => (
            <Grid item xs={12} md={6} lg={4} key={course._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia component="img" height="160" image={course.thumbnail} alt={course.name} sx={{ objectFit: 'cover' }} />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>{course.name}</Typography>
                  <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">👥 {new Intl.NumberFormat('en-US').format(course.students)} học viên</Typography>
                    <Typography variant="caption" color="text.secondary">⭐ {course.rating}</Typography>
                  </Stack>
                  <Grid container spacing={1}>
                    <Grid item xs={4}><Typography variant="caption" color="text.secondary">Thu nhập</Typography><Typography variant="body2" sx={{ fontWeight: 600 }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.revenue)}</Typography></Grid>
                    <Grid item xs={4}><Typography variant="caption" color="text.secondary">Hoàn thành</Typography><Typography variant="body2" sx={{ fontWeight: 600 }}>{`${course.completionRate.toFixed(1)}%`}</Typography></Grid>
                    <Grid item xs={4}><Typography variant="caption" color="text.secondary">Lượt xem</Typography><Typography variant="body2" sx={{ fontWeight: 600 }}>{new Intl.NumberFormat('en-US').format(course.views)}</Typography></Grid>
                  </Grid>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button component={Link} to={`/teacher/analytics/course/${course._id}`} variant="outlined" size="small">Xem chi tiết</Button>
                  <Button component={Link} to={`/teacher/courses/${course._id}/edit`} variant="contained" size="small">Chỉnh sửa</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Student Demographics */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Thông tin học viên</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Nhóm tuổi</Typography>
                <Stack spacing={1}>
                  {analyticsData.studentDemographics.ageGroups.map((g) => (
                    <Box key={g.age}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">{g.age}</Typography>
                        <Typography variant="body2" color="text.secondary">{g.count} ({`${g.percentage.toFixed(1)}%`})</Typography>
                      </Stack>
                      <LinearProgress variant="determinate" value={g.percentage} sx={{ height: 8, borderRadius: 4 }} />
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Quốc gia</Typography>
                <Stack spacing={1}>
                  {analyticsData.studentDemographics.countries.map((c) => (
                    <Box key={c.country}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">{c.country}</Typography>
                        <Typography variant="body2" color="text.secondary">{c.count} ({`${c.percentage.toFixed(1)}%`})</Typography>
                      </Stack>
                      <LinearProgress variant="determinate" value={c.percentage} color="info" sx={{ height: 8, borderRadius: 4 }} />
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Trình độ kinh nghiệm</Typography>
                <Stack spacing={1}>
                  {analyticsData.studentDemographics.experienceLevels.map((l) => (
                    <Box key={l.level}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">{l.level}</Typography>
                        <Typography variant="body2" color="text.secondary">{l.count} ({`${l.percentage.toFixed(1)}%`})</Typography>
                      </Stack>
                      <LinearProgress variant="determinate" value={l.percentage} color="secondary" sx={{ height: 8, borderRadius: 4 }} />
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Engagement Metrics */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Chỉ số tương tác</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary">Thời gian xem trung bình</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>{analyticsData.engagementMetrics.averageWatchTime} phút</Typography>
                <Chip label="+5.2" color="success" size="small" />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary">Tỷ lệ nộp bài tập</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>{`${analyticsData.engagementMetrics.assignmentSubmissionRate.toFixed(1)}%`}</Typography>
                <Chip label="+2.1%" color="success" size="small" />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary">Tham gia thảo luận</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>{`${analyticsData.engagementMetrics.discussionParticipation.toFixed(1)}%`}</Typography>
                <Chip label="+4.3%" color="success" size="small" />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary">Chứng chỉ đạt được</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>{`${analyticsData.engagementMetrics.certificateEarned.toFixed(1)}%`}</Typography>
                <Chip label="+1.8%" color="success" size="small" />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Quick Actions */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Button component={Link} to="/teacher/courses/new" variant="contained">Tạo khóa học mới</Button>
        <Button component={Link} to="/teacher/earnings" variant="outlined">Xem thu nhập chi tiết</Button>
        <Button component={Link} to="/teacher/courses" variant="outlined">Quản lý khóa học</Button>
      </Stack>
    </Container>
  );
};

export default Analytics;
