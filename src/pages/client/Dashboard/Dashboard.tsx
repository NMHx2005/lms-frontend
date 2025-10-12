import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { clientAuthService } from '@/services/client/auth.service';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  Button,
  Chip,
  Stack,
  LinearProgress,
  Avatar,
  Alert,
  CircularProgress,
  useTheme,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Dashboard-specific interfaces
interface DashboardCourse {
  _id: string;
  title: string;
  thumbnail: string;
  progress: number;
  lastLesson: string;
  nextLesson: string;
  instructor: string;
  estimatedTime: number;
}

interface DashboardStats {
  totalCourses: number;
  completedCourses: number;
  totalHours: number;
  averageGrade: number;
  certificatesEarned: number;
  currentStreak: number;
}

// Small presentational components for cleaner JSX
function StatCard({ icon, value, label, color }: { icon: React.ReactNode; value: React.ReactNode; label: string; color: string }) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 'none',
        border: (t) => `1px solid ${t.palette.divider}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: 3,
          transform: 'translateY(-4px)',
          borderColor: color
        }
      }}
    >
      <CardContent sx={{ py: 2.5 }}>
        <Stack direction="column" spacing={1} alignItems="center" textAlign="center">
          <Avatar sx={{ bgcolor: `${color}15`, color: color, width: 52, height: 52 }}>
            {icon}
          </Avatar>
          <Typography variant="h4" fontWeight={700} lineHeight={1}>{value}</Typography>
          <Typography color="text.secondary" variant="caption" fontWeight={500}>
            {label}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

function CourseCard({ course }: { course: DashboardCourse }) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        transition: 'all 0.3s ease',
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: 6,
          borderColor: 'primary.main'
        }
      }}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          height="180"
          image={course.thumbnail}
          alt={course.title}
          sx={{ objectFit: 'cover' }}
        />
        <Chip
          size="small"
          label={`${course.progress}%`}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            fontWeight: 700,
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        />
      </Box>
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {course.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          👨‍🏫 {course.instructor}
        </Typography>
        <Box sx={{ mb: 1.5 }}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">Tiến độ</Typography>
            <Typography variant="caption" fontWeight={600}>{course.progress}%</Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={Math.max(0, Math.min(100, course.progress))}
            sx={{
              height: 8,
              borderRadius: 2,
              bgcolor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                borderRadius: 2
              }
            }}
          />
        </Box>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
        <Button
          component={Link}
          to={`/learning/${course._id}`}
          variant="contained"
          fullWidth
          endIcon={<ArrowForwardIosIcon sx={{ fontSize: 14 }} />}
        >
          Tiếp tục học
        </Button>
      </CardActions>
    </Card>
  );
}

const Dashboard: React.FC = () => {
  const [recentCourses, setRecentCourses] = useState<DashboardCourse[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    completedCourses: 0,
    totalHours: 0,
    averageGrade: 0,
    certificatesEarned: 0,
    currentStreak: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const theme = useTheme();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [dashboardResponse, statsResponse, certificatesResponse] = await Promise.all([
          clientAuthService.getDashboardData(),
          clientAuthService.getLearningStatistics(),
          clientAuthService.getCertificates().catch(() => ({ success: false, data: [] }))
        ]);

        // Process and set data
        if (dashboardResponse.success && dashboardResponse.data) {
          const dashboardData = dashboardResponse.data;

          // Set user name
          if (dashboardData.user) {
            setUserName(dashboardData.user.name || dashboardData.user.firstName || 'Học viên');
          }

          // Count certificates
          const certificatesCount = certificatesResponse.success && Array.isArray(certificatesResponse.data)
            ? certificatesResponse.data.length
            : 0;

          // Set stats from user data
          if (dashboardData.user && dashboardData.user.stats) {
            const userStats = dashboardData.user.stats;
            setStats({
              totalCourses: userStats.totalCoursesEnrolled || 0,
              completedCourses: userStats.totalCoursesCompleted || 0,
              totalHours: Math.round((userStats.totalLearningTime || 0) / 60), // Convert minutes to hours
              averageGrade: userStats.averageScore || 0,
              certificatesEarned: certificatesCount,
              currentStreak: userStats.currentStreak || 0
            });
          } else if (statsResponse.success && statsResponse.data) {
            // Fallback to statistics API
            const statsData = statsResponse.data;
            setStats({
              totalCourses: statsData.totalEnrollments || 0,
              completedCourses: statsData.completedCourses || 0,
              totalHours: Math.round((statsData.totalStudyTime || 0) / 60),
              averageGrade: statsData.averageProgress || 0,
              certificatesEarned: certificatesCount,
              currentStreak: statsData.currentStreak || 0
            });
          }

          // Set recent courses from dashboard data
          if (dashboardData.enrolledCourses && Array.isArray(dashboardData.enrolledCourses)) {
            // Create a map of course progress
            const progressMap = new Map();
            if (dashboardData.courseProgress && Array.isArray(dashboardData.courseProgress)) {
              dashboardData.courseProgress.forEach((cp: any) => {
                progressMap.set(cp.courseId, {
                  progress: cp.progress || 0,
                  completedLessons: cp.completedLessons || 0,
                  totalLessons: cp.totalLessons || 0
                });
              });
            }

            const processedCourses: DashboardCourse[] = dashboardData.enrolledCourses.map((course: any) => {
              const courseProgress = progressMap.get(course._id || course.id);

              // Get instructor name
              const instructorName = course.instructor?.name
                || course.instructor?.firstName
                || course.instructorName
                || 'Giảng viên';

              return {
                _id: course._id || course.id,
                title: course.title || 'Khóa học không có tên',
                thumbnail: course.thumbnail || '/images/default-course.jpg',
                progress: courseProgress?.progress || 0,
                lastLesson: courseProgress?.completedLessons
                  ? `Bài ${courseProgress.completedLessons}/${courseProgress.totalLessons}`
                  : 'Chưa bắt đầu',
                nextLesson: courseProgress?.completedLessons < courseProgress?.totalLessons
                  ? `Bài ${(courseProgress?.completedLessons || 0) + 1}`
                  : 'Đã hoàn thành',
                instructor: instructorName,
                estimatedTime: course.totalDuration || 0,
              };
            });
            setRecentCourses(processedCourses);
          } else {
            setRecentCourses([]);
          }
        }
      } catch (err: any) {
        setError(err?.message || 'Không thể tải dữ liệu dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" alignItems="center" justifyContent="center" minHeight={320}>
          <Stack spacing={2} alignItems="center">
            <CircularProgress />
            <Typography variant="h6">Đang tải...</Typography>
            <Typography variant="body2" color="text.secondary">Vui lòng chờ trong giây lát</Typography>
          </Stack>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={2}>
          <Typography variant="h4" fontWeight={800}>Lỗi tải dữ liệu</Typography>
          <Alert severity="error">{error}</Alert>
          <Box>
            <Button variant="contained" onClick={() => window.location.reload()}>
              Thử lại
            </Button>
          </Box>
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      {/* Hero */}
      <Card sx={{
        mb: 3,
        borderRadius: 3,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'common.white',
      }}>
        <CardContent sx={{ py: { xs: 3, md: 4 } }}>
          <Typography variant="h3" fontWeight={700} sx={{ letterSpacing: 0.2 }}>
            Chào mừng trở lại{userName ? `, ${userName}` : ''}! 👋
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.95, mt: 0.5 }}>
            Hãy tiếp tục hành trình học tập của bạn hôm nay
          </Typography>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={6} md={4} lg={2}>
          <StatCard
            icon={<SchoolIcon />}
            value={stats.totalCourses}
            label="Khóa học"
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={4} lg={2}>
          <StatCard
            icon={<CheckCircleIcon />}
            value={stats.completedCourses}
            label="Đã hoàn thành"
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={4} lg={2}>
          <StatCard
            icon={<AccessTimeIcon />}
            value={`${stats.totalHours}h`}
            label="Giờ học"
            color={theme.palette.warning.main}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={4} lg={2}>
          <StatCard
            icon={<StarIcon />}
            value={stats.averageGrade.toFixed(1)}
            label="Điểm TB"
            color={theme.palette.secondary.main}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={4} lg={2}>
          <StatCard
            icon={<EmojiEventsIcon />}
            value={stats.certificatesEarned}
            label="Chứng chỉ"
            color={theme.palette.info.main}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={4} lg={2}>
          <StatCard
            icon={<WhatshotIcon />}
            value={stats.currentStreak}
            label="Streak"
            color={theme.palette.error.main}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          {/* Recent Courses */}
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
              <Typography variant="h5" fontWeight={700}>
                📚 Khóa học đang học
              </Typography>
              <Button component={Link} to="/dashboard/courses" variant="text" endIcon={<ArrowForwardIosIcon />}>
                Xem tất cả
              </Button>
            </Stack>

            {recentCourses.length > 0 ? (
              <Grid container spacing={3}>
                {recentCourses.map((course) => (
                  <Grid key={course._id} item xs={12} sm={6} md={4}>
                    <CourseCard course={course} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Card sx={{ borderRadius: 3, textAlign: 'center', py: 6 }}>
                <CardContent>
                  <SchoolIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Bạn chưa đăng ký khóa học nào
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Khám phá hàng ngàn khóa học chất lượng ngay hôm nay
                  </Typography>
                  <Button component={Link} to="/courses" variant="contained" size="large">
                    Khám phá khóa học
                  </Button>
                </CardContent>
              </Card>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
          ⚡ Truy cập nhanh
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={4} md={2}>
            <Button
              component={Link}
              to="/courses"
              variant="outlined"
              fullWidth
              sx={{ py: 2, flexDirection: 'column', gap: 1 }}
            >
              <SchoolIcon />
              <Typography variant="caption">Khóa học</Typography>
            </Button>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Button
              component={Link}
              to="/dashboard/progress"
              variant="outlined"
              fullWidth
              sx={{ py: 2, flexDirection: 'column', gap: 1 }}
            >
              <CheckCircleIcon />
              <Typography variant="caption">Tiến độ</Typography>
            </Button>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Button
              component={Link}
              to="/dashboard/bills"
              variant="outlined"
              fullWidth
              sx={{ py: 2, flexDirection: 'column', gap: 1 }}
            >
              <AccessTimeIcon />
              <Typography variant="caption">Hóa đơn</Typography>
            </Button>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Button
              component={Link}
              to="/dashboard/wishlist"
              variant="outlined"
              fullWidth
              sx={{ py: 2, flexDirection: 'column', gap: 1 }}
            >
              <StarIcon />
              <Typography variant="caption">Yêu thích</Typography>
            </Button>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Button
              component={Link}
              to="/dashboard/notifications"
              variant="outlined"
              fullWidth
              sx={{ py: 2, flexDirection: 'column', gap: 1 }}
            >
              <EmojiEventsIcon />
              <Typography variant="caption">Thông báo</Typography>
            </Button>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Button
              component={Link}
              to="/dashboard/profile"
              variant="outlined"
              fullWidth
              sx={{ py: 2, flexDirection: 'column', gap: 1 }}
            >
              <WhatshotIcon />
              <Typography variant="caption">Hồ sơ</Typography>
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;