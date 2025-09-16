import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnalyticsData } from '../../../../types/index';
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
  LinearProgress,
  Divider
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  AttachMoney as AttachMoneyIcon,
  Visibility as VisibilityIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'students' | 'engagement'>('revenue');

  // Mock data - replace with API call
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const mockData: AnalyticsData = {
        overview: {
          totalStudents: 1247,
          totalCourses: 23,
          totalRevenue: 45678,
          totalViews: 89234,
          averageRating: 4.7,
          completionRate: 78.5
        },
        revenueData: [
          { month: 'Jan', revenue: 3200, students: 45, courses: 2 },
          { month: 'Feb', revenue: 4100, students: 52, courses: 3 },
          { month: 'Mar', revenue: 3800, students: 48, courses: 2 },
          { month: 'Apr', revenue: 5200, students: 67, courses: 4 },
          { month: 'May', revenue: 4800, students: 61, courses: 3 },
          { month: 'Jun', revenue: 6100, students: 78, courses: 5 }
        ],
        coursePerformance: [
          {
            _id: 'course1',
            name: 'React Advanced Patterns',
            students: 234,
            rating: 4.8,
            revenue: 8900,
            completionRate: 82,
            views: 15420,
            thumbnail: '/images/course1.jpg'
          },
          {
            _id: 'course2',
            name: 'Node.js Backend Development',
            students: 189,
            rating: 4.6,
            revenue: 7200,
            completionRate: 75,
            views: 12890,
            thumbnail: '/images/course2.jpg'
          },
          {
            _id: 'course3',
            name: 'UI/UX Design Fundamentals',
            students: 156,
            rating: 4.9,
            revenue: 6800,
            completionRate: 88,
            views: 11230,
            thumbnail: '/images/course3.jpg'
          },
          {
            _id: 'course4',
            name: 'Machine Learning Basics',
            students: 134,
            rating: 4.7,
            revenue: 5900,
            completionRate: 71,
            views: 9870,
            thumbnail: '/images/course4.jpg'
          },
          {
            _id: 'course5',
            name: 'Mobile App Development',
            students: 98,
            rating: 4.5,
            revenue: 4200,
            completionRate: 68,
            views: 7650,
            thumbnail: '/images/course5.jpg'
          }
        ],
        studentGrowth: [
          { month: 'Jan', newStudents: 45, activeStudents: 180, returningStudents: 135 },
          { month: 'Feb', newStudents: 52, activeStudents: 195, returningStudents: 143 },
          { month: 'Mar', newStudents: 48, activeStudents: 210, returningStudents: 162 },
          { month: 'Apr', newStudents: 67, activeStudents: 245, returningStudents: 178 },
          { month: 'May', newStudents: 61, activeStudents: 268, returningStudents: 207 },
          { month: 'Jun', newStudents: 78, activeStudents: 312, returningStudents: 234 }
        ],
        topCourses: [
          { _id: 'course1', name: 'React Advanced Patterns', views: 15420, enrollments: 234, rating: 4.8, revenue: 8900, thumbnail: '/images/course1.jpg' },
          { _id: 'course2', name: 'Node.js Backend Development', views: 12890, enrollments: 189, rating: 4.6, revenue: 7200, thumbnail: '/images/course2.jpg' },
          { _id: 'course3', name: 'UI/UX Design Fundamentals', views: 11230, enrollments: 156, rating: 4.9, revenue: 6800, thumbnail: '/images/course3.jpg' },
          { _id: 'course4', name: 'Machine Learning Basics', views: 9870, enrollments: 134, rating: 4.7, revenue: 5900, thumbnail: '/images/course4.jpg' },
          { _id: 'course5', name: 'Mobile App Development', views: 7650, enrollments: 98, rating: 4.5, revenue: 4200, thumbnail: '/images/course5.jpg' }
        ],
        studentDemographics: {
          ageGroups: [
            { age: '18-24', count: 456, percentage: 36.6 },
            { age: '25-34', count: 523, percentage: 42.0 },
            { age: '35-44', count: 189, percentage: 15.2 },
            { age: '45+', count: 79, percentage: 6.3 }
          ],
          countries: [
            { country: 'Vietnam', count: 623, percentage: 50.0 },
            { country: 'United States', count: 187, percentage: 15.0 },
            { country: 'Singapore', count: 124, percentage: 10.0 },
            { country: 'Australia', count: 93, percentage: 7.5 },
            { country: 'Others', count: 220, percentage: 17.6 }
          ],
          experienceLevels: [
            { level: 'Beginner', count: 498, percentage: 40.0 },
            { level: 'Intermediate', count: 561, percentage: 45.0 },
            { level: 'Advanced', count: 188, percentage: 15.0 }
          ]
        },
        engagementMetrics: {
          averageWatchTime: 42.5,
          assignmentSubmissionRate: 76.8,
          discussionParticipation: 68.3,
          certificateEarned: 72.1
        }
      };

      setAnalyticsData(mockData);
      setIsLoading(false);
    }, 1000);
  }, []);

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
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(analyticsData.overview.totalRevenue)}</Typography>
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

      {/* Charts Section (simple placeholders) */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Thu nhập & Học viên theo thời gian</Typography>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 180 }}>
                {analyticsData.revenueData.map((d) => (
                  <Box key={d.month} sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.5, width: 24 }}>
                    <Box sx={{ width: 10, height: `${(d.revenue / 7000) * 100}%`, bgcolor: 'primary.main', borderRadius: 0.5 }} />
                    <Box sx={{ width: 10, height: `${(d.students / 100) * 100}%`, bgcolor: 'success.main', borderRadius: 0.5 }} />
                  </Box>
                ))}
              </Box>
              <Divider sx={{ my: 1 }} />
              <Stack direction="row" spacing={2}>
                <Chip label="Thu nhập ($)" color="primary" size="small" />
                <Chip label="Học viên" color="success" size="small" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Tăng trưởng học viên</Typography>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 180 }}>
                {analyticsData.studentGrowth.map((d) => (
                  <Box key={d.month} sx={{ width: 24 }}>
                    <Box sx={{ height: `${(d.newStudents / 100) * 100}%`, bgcolor: 'info.light', borderRadius: 0.5 }} />
                    <Box sx={{ height: 4 }} />
                    <Box sx={{ height: `${(d.activeStudents / 400) * 100}%`, bgcolor: 'info.main', borderRadius: 0.5 }} />
                  </Box>
                ))}
              </Box>
              <Divider sx={{ my: 1 }} />
              <Stack direction="row" spacing={2}>
                <Chip label="Học viên mới" color="info" size="small" variant="outlined" />
                <Chip label="Hoạt động" color="info" size="small" />
              </Stack>
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
                    <Grid item xs={4}><Typography variant="caption" color="text.secondary">Thu nhập</Typography><Typography variant="body2" sx={{ fontWeight: 600 }}>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(course.revenue)}</Typography></Grid>
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
