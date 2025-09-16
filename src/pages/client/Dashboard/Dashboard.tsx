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
  Divider,
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

interface DashboardAssignment {
  _id: string;
  title: string;
  courseTitle: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: number;
}

interface DashboardStats {
  totalCourses: number;
  completedCourses: number;
  totalHours: number;
  averageGrade: number;
  certificatesEarned: number;
  currentStreak: number;
}

// Helpers used across components
type ChipColor = 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('vi-VN');
const getStatusColor = (status: string): ChipColor => {
  switch (status) {
    case 'pending': return 'warning';
    case 'submitted': return 'info';
    case 'graded': return 'success';
    default: return 'default';
  }
};
const getStatusText = (status: string) => {
  switch (status) {
    case 'pending': return 'Chưa nộp';
    case 'submitted': return 'Đã nộp';
    case 'graded': return 'Đã chấm';
    default: return 'Không xác định';
  }
};

// Small presentational components for cleaner JSX
function StatCard({ icon, value, label, color }: { icon: React.ReactNode; value: React.ReactNode; label: string; color: string }) {
  return (
    <Card sx={{ borderRadius: 2, boxShadow: 'none', border: (t) => `1px solid ${t.palette.divider}` }}>
      <CardContent>
        <Stack direction="column" spacing={1.25} alignItems="center" textAlign="center">
          <Avatar sx={{ bgcolor: `${color}20`, color: color, width: 48, height: 48 }}>{icon}</Avatar>
          <Typography variant="h3" fontWeight={800} lineHeight={1}>{value}</Typography>
          <Typography color="text.secondary" variant="subtitle2">{label}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

function CourseCard({ course }: { course: DashboardCourse }) {
  return (
    <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, transition: 'transform .2s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
      <Box sx={{ position: 'relative' }}>
        <CardMedia component="img" height="180" image={course.thumbnail} alt={course.title} />
        <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 12, left: 12 }}>
          <Chip size="small" color="primary" label={`Tiến độ ${course.progress}%`} />
        </Stack>
        <Stack direction="row" spacing={1} sx={{ position: 'absolute', bottom: 12, right: 12 }}>
          <Chip size="small" variant="outlined" icon={<AccessTimeIcon sx={{ fontSize: 16 }} />} label={`${course.estimatedTime} phút`} />
        </Stack>
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom noWrap>{course.title}</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Giảng viên: {course.instructor}
        </Typography>
        <Box sx={{ my: 1 }}>
          <LinearProgress variant="determinate" value={Math.max(0, Math.min(100, course.progress))} sx={{ borderRadius: 2 }} />
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} divider={<Divider orientation="vertical" flexItem />}>
          <Typography variant="body2"><strong>Bài học cuối:</strong> {course.lastLesson}</Typography>
          <Typography variant="body2"><strong>Tiếp theo:</strong> {course.nextLesson}</Typography>
        </Stack>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2, pt: 0, justifyContent: 'space-between' }}>
        <Button component={Link} to={`/learning/${course._id}`} variant="contained" endIcon={<ArrowForwardIosIcon sx={{ fontSize: 16 }} />}>
          Tiếp tục học
        </Button>
        <Typography variant="body2" color="text.secondary">⏱️ {course.estimatedTime} phút</Typography>
      </CardActions>
    </Card>
  );
}

function AssignmentItem({ a, toLink }: { a: DashboardAssignment; toLink: string }) {
  const chipColor: ChipColor = getStatusColor(a.status);
  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>{a.title}</Typography>
            <Typography variant="body2" color="text.secondary">{a.courseTitle}</Typography>
            <Typography variant="body2" color="error.main">Hạn nộp: {formatDate(a.dueDate)}</Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip color={chipColor} label={getStatusText(a.status)} size="small" />
              {a.grade !== undefined && (
                <Chip label={`Điểm: ${a.grade}`} color="success" size="small" variant="outlined" />
              )}
            </Stack>
          </Grid>
          <Grid item xs={12} md={3} textAlign={{ xs: 'left', md: 'right' }}>
            <Button component={Link} to={toLink} variant="outlined">
              Xem chi tiết
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

const Dashboard: React.FC = () => {
  const [recentCourses, setRecentCourses] = useState<DashboardCourse[]>([]);
  const [upcomingAssignments, setUpcomingAssignments] = useState<DashboardAssignment[]>([]);
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
  const theme = useTheme();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch dashboard data
        const dashboardResponse = await clientAuthService.getDashboardData();
        // Fetch learning statistics
        const statsResponse = await clientAuthService.getLearningStatistics();
        // Fetch recent activity (hiện tại chỉ log, UI chưa dùng dữ liệu này)
        await clientAuthService.getRecentActivity();

        // Process and set data
        if (dashboardResponse.success && dashboardResponse.data) {
          const dashboardData = dashboardResponse.data;

          // Set stats from user data
          if (dashboardData.user && dashboardData.user.stats) {
            const userStats = dashboardData.user.stats;
            setStats({
              totalCourses: userStats.totalCoursesEnrolled || 0,
              completedCourses: userStats.totalCoursesCompleted || 0,
              totalHours: userStats.totalLearningTime || 0,
              averageGrade: userStats.averageScore || 0,
              certificatesEarned: 0,
              currentStreak: 0
            });
          } else if (statsResponse.success && statsResponse.data) {
            // Fallback to statistics API
            const statsData = statsResponse.data;
            setStats({
              totalCourses: statsData.totalEnrollments || 0,
              completedCourses: statsData.completedCourses || 0,
              totalHours: statsData.totalStudyTime || 0,
              averageGrade: statsData.averageProgress || 0,
              certificatesEarned: 0,
              currentStreak: 0
            });
          }

          // Set recent courses from dashboard data
          if (dashboardData.enrolledCourses && Array.isArray(dashboardData.enrolledCourses)) {
            const processedCourses: DashboardCourse[] = dashboardData.enrolledCourses.map((course: any) => ({
              _id: course._id || course.id,
              title: course.name || course.title || 'Khóa học không có tên',
              thumbnail: course.thumbnail || '/images/default-course.jpg',
              progress: course.progress || 0,
              lastLesson: 'Chưa có bài học nào',
              nextLesson: 'Bắt đầu khóa học',
              instructor: 'Giảng viên không xác định',
              estimatedTime: course.totalDuration || 0,
            }));
            setRecentCourses(processedCourses);
          } else {
            setRecentCourses([]);
          }

          // Set assignments (if available in dashboard data)
          if (dashboardData.upcomingAssignments && Array.isArray(dashboardData.upcomingAssignments)) {
            const processedAssignments: DashboardAssignment[] = dashboardData.upcomingAssignments.map((assignment: any) => ({
              _id: assignment._id || assignment.id,
              title: assignment.title || 'Bài tập không có tên',
              courseTitle: assignment.courseTitle || assignment.course?.name || 'Khóa học không xác định',
              dueDate: assignment.dueDate || new Date().toISOString(),
              status: assignment.status || 'pending',
              grade: assignment.grade,
            }));
            setUpcomingAssignments(processedAssignments);
          } else {
            setUpcomingAssignments([]);
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
        borderRadius: 2,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #7c8cf8 0%, #8a6fd6 100%)',
        color: 'common.white',
      }}>
        <CardContent sx={{ py: { xs: 3, md: 4 } }}>
          <Typography variant="h3" fontWeight={700} sx={{ letterSpacing: 0.2 }}>Chào mừng trở lại!</Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.95, mt: 0.5 }}>Đây là tổng quan về hành trình học tập của bạn</Typography>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard icon={<SchoolIcon />} value={stats.totalCourses} label="Khóa học đã đăng ký" color={theme.palette.primary.main} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard icon={<CheckCircleIcon />} value={stats.completedCourses} label="Khóa học đã hoàn thành" color={theme.palette.success.main} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard icon={<AccessTimeIcon />} value={`${stats.totalHours}h`} label="Tổng thời gian học" color={theme.palette.warning.main} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard icon={<StarIcon />} value={stats.averageGrade} label="Điểm trung bình" color={theme.palette.secondary.main} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard icon={<EmojiEventsIcon />} value={stats.certificatesEarned} label="Chứng chỉ đã nhận" color={theme.palette.info.main} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard icon={<WhatshotIcon />} value={stats.currentStreak} label="Ngày học liên tiếp" color={theme.palette.error.main} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          {/* Recent Courses */}
          <Card sx={{ mb: 3, borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="h5" fontWeight={700}>Khóa học gần đây</Typography>
                <Button component={Link} to="/dashboard/courses" variant="text">Xem tất cả</Button>
              </Stack>

              {recentCourses.length > 0 ? (
                <Grid container spacing={2}>
                  {recentCourses.map((course) => (
                    <Grid key={course._id} item xs={12} sm={6} md={4}>
                      <CourseCard course={course} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box textAlign="center" py={4}>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    Bạn chưa đăng ký khóa học nào
                  </Typography>
                  <Button component={Link} to="/courses" variant="contained">Khám phá khóa học</Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          {/* Upcoming Assignments */}
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="h5" fontWeight={700}>Bài tập sắp đến hạn</Typography>
                <Button component={Link} to="/dashboard/assignments" variant="text">Xem tất cả</Button>
              </Stack>

              {upcomingAssignments.length > 0 ? (
                <Stack spacing={2}>
                  {upcomingAssignments.map((assignment) => (
                    <AssignmentItem key={assignment._id} a={assignment} toLink={`/assignments/${assignment._id}`} />
                  ))}
                </Stack>
              ) : (
                <Box textAlign="center" py={4}>
                  <Typography variant="body1" color="text.secondary">
                    Không có bài tập nào sắp đến hạn
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;