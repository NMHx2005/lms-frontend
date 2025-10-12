import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { progressService, ProgressOverview, Certificate, RecentActivity } from '@/services/client/progress.service';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Chip,
  Button,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  CircularProgress,
  Avatar,
  CardMedia,
  LinearProgress
} from '@mui/material';
import {
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  Book as BookIcon,
  EmojiEvents as TrophyIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  TrendingUp as TrendingUpIcon,
  PlayArrow as PlayArrowIcon
} from '@mui/icons-material';

const Progress: React.FC = () => {
  const [progressData, setProgressData] = useState<ProgressOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'completed' | 'in-progress'>('all');

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await progressService.getOverview();
      setProgressData(data);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Failed to load progress data';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching progress data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = useCallback(async (certificate: Certificate) => {
    try {
      const loadingToast = toast.loading('Đang tải chứng chỉ...');

      // Use _id as enrollmentId for download
      const blob = await progressService.downloadCertificate(certificate._id);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate-${certificate.courseTitle.replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.dismiss(loadingToast);
      toast.success('Đã tải chứng chỉ thành công!');
    } catch (err: any) {
      toast.dismiss();
      toast.error(err?.response?.data?.error || 'Không thể tải chứng chỉ');
      console.error('Error downloading certificate:', err);
    }
  }, []);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  const statsCards = useMemo(() => [
    {
      icon: <SchoolIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Tổng khóa học',
      value: progressData?.totalCourses || 0,
      color: 'primary'
    },
    {
      icon: <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      title: 'Đã hoàn thành',
      value: progressData?.completedCourses || 0,
      color: 'success'
    },
    {
      icon: <BookIcon sx={{ fontSize: 40, color: 'info.main' }} />,
      title: 'Tổng bài học',
      value: progressData?.totalLessons || 0,
      color: 'info'
    },
    {
      icon: <TrophyIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      title: 'Chứng chỉ',
      value: progressData?.certificates.length || 0,
      color: 'warning'
    }
  ], [progressData]);

  const recentActivities = useMemo(() => {
    if (!progressData?.recentActivities) return [];

    return progressData.recentActivities.map((activity: RecentActivity) => {
      let icon;
      switch (activity.icon) {
        case 'check':
          icon = <CheckCircleIcon sx={{ color: `${activity.color}.main` }} />;
          break;
        case 'trophy':
          icon = <TrophyIcon sx={{ color: `${activity.color}.main` }} />;
          break;
        case 'book':
          icon = <BookIcon sx={{ color: `${activity.color}.main` }} />;
          break;
        default:
          icon = <BookIcon sx={{ color: `${activity.color}.main` }} />;
      }

      return {
        icon,
        title: activity.title,
        subtitle: activity.subtitle,
        time: activity.time,
        color: activity.color
      };
    });
  }, [progressData]);

  // Filter courses based on selected tab
  const filteredCourses = useMemo(() => {
    if (!progressData?.courses) return [];

    switch (selectedFilter) {
      case 'completed':
        return progressData.courses.filter(course => course.isCompleted);
      case 'in-progress':
        return progressData.courses.filter(course => course.isActive && !course.isCompleted);
      case 'all':
      default:
        return progressData.courses;
    }
  }, [progressData, selectedFilter]);

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Tiến độ & Chứng chỉ
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Theo dõi tiến độ học tập và quản lý chứng chỉ của bạn
          </Typography>
        </Box>

        {/* Loading State */}
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Đang tải dữ liệu...
            </Typography>
          </CardContent>
        </Card>
      </Container>
    );
  }

  if (error || !progressData) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Tiến độ & Chứng chỉ
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Theo dõi tiến độ học tập và quản lý chứng chỉ của bạn
          </Typography>
        </Box>

        {/* Error State */}
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="h6">Không thể tải dữ liệu</Typography>
          <Typography>{error || 'Vui lòng thử lại sau'}</Typography>
        </Alert>

        <Button variant="contained" onClick={fetchProgressData}>
          🔄 Thử lại
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Tiến độ & Chứng chỉ
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Theo dõi tiến độ học tập và quản lý chứng chỉ của bạn
        </Typography>
      </Box>

      {/* Progress Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Main Progress Card */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              py: 4
            }}
          >
            <CardContent>
              <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
                <CircularProgress
                  variant="determinate"
                  value={progressData.overallProgress}
                  size={120}
                  thickness={4}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    '& .MuiCircularProgress-circle': {
                      strokeLinecap: 'round',
                    }
                  }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                    {progressData.overallProgress}%
                  </Typography>
                </Box>
              </Box>

              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Tiến độ tổng thể
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {progressData.completedLessons} / {progressData.totalLessons} bài học đã hoàn thành
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Stats Cards */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {statsCards.map((stat, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: `${stat.color}.light`, width: 60, height: 60 }}>
                        {stat.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {stat.title}
                        </Typography>
                        <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                          {stat.value}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {/* Filter Tabs */}
      <Card sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={selectedFilter}
            onChange={(_, newValue) => setSelectedFilter(newValue)}
            variant="fullWidth"
          >
            <Tab
              label={`Tất cả (${progressData.totalCourses})`}
              value="all"
              icon={<SchoolIcon />}
              iconPosition="start"
            />
            <Tab
              label={`Đã hoàn thành (${progressData.completedCourses})`}
              value="completed"
              icon={<CheckCircleIcon />}
              iconPosition="start"
            />
            <Tab
              label={`Đang học (${progressData.inProgressCourses})`}
              value="in-progress"
              icon={<TrendingUpIcon />}
              iconPosition="start"
            />
          </Tabs>
        </Box>
      </Card>

      {/* Courses List */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              {selectedFilter === 'all' && 'Tất cả khóa học'}
              {selectedFilter === 'completed' && 'Khóa học đã hoàn thành'}
              {selectedFilter === 'in-progress' && 'Khóa học đang học'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {filteredCourses.length} khóa học
            </Typography>
          </Box>

          {filteredCourses.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <SchoolIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Không có khóa học nào
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedFilter === 'completed' && 'Bạn chưa hoàn thành khóa học nào'}
                {selectedFilter === 'in-progress' && 'Bạn chưa có khóa học đang học nào'}
                {selectedFilter === 'all' && 'Bạn chưa đăng ký khóa học nào'}
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredCourses.map((course) => (
                <Grid item xs={12} sm={6} md={4} key={course._id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4
                      }
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="160"
                        image={course.courseThumbnail || '/images/default-course.jpg'}
                        alt={course.courseTitle}
                      />
                      {course.isCompleted && (
                        <Chip
                          icon={<CheckCircleIcon />}
                          label="Hoàn thành"
                          color="success"
                          size="small"
                          sx={{ position: 'absolute', top: 12, right: 12, fontWeight: 600 }}
                        />
                      )}
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          bgcolor: 'rgba(0,0,0,0.7)',
                          color: 'white',
                          px: 2,
                          py: 1
                        }}
                      >
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Typography variant="caption">Tiến độ</Typography>
                          <Typography variant="caption" fontWeight={600}>
                            {course.progress}%
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={course.progress}
                          sx={{
                            mt: 0.5,
                            height: 6,
                            borderRadius: 3,
                            bgcolor: 'rgba(255,255,255,0.3)',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: course.isCompleted ? 'success.main' : 'primary.main'
                            }
                          }}
                        />
                      </Box>
                    </Box>

                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom noWrap>
                        {course.courseTitle}
                      </Typography>

                      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        <Chip
                          size="small"
                          icon={<BookIcon />}
                          label={`${course.completedLessons}/${course.totalLessons} bài`}
                          variant="outlined"
                        />
                      </Stack>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Đăng ký: {new Date(course.enrolledAt).toLocaleDateString('vi-VN')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Hoạt động: {new Date(course.lastActivityAt).toLocaleDateString('vi-VN')}
                      </Typography>
                    </CardContent>

                    <Box sx={{ p: 2, pt: 0 }}>
                      <Button
                        component={Link}
                        to={`/learning/${course.courseId}`}
                        variant="contained"
                        startIcon={<PlayArrowIcon />}
                        fullWidth
                      >
                        {course.isCompleted ? 'Xem lại' : 'Tiếp tục học'}
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Certificates Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Chứng chỉ đã đạt được
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Bạn có thể tải xuống các chứng chỉ đã hoàn thành
            </Typography>
          </Box>

          {progressData.certificates.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <TrophyIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Chưa có chứng chỉ nào
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hoàn thành khóa học đầu tiên để nhận chứng chỉ
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {progressData.certificates.map((certificate) => (
                <Grid item xs={12} md={6} lg={4} key={certificate._id}>
                  <Card
                    sx={{
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4
                      }
                    }}
                  >
                    <CardContent>
                      <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'warning.light', width: 50, height: 50 }}>
                          <TrophyIcon sx={{ color: 'warning.main' }} />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" gutterBottom>
                            {certificate.courseTitle}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Issued: {formatDate(certificate.issuedAt)}
                          </Typography>
                          <Chip
                            label={certificate.certificateNumber}
                            color="primary"
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      </Stack>

                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="contained"
                          startIcon={<DownloadIcon />}
                          onClick={() => handleDownloadCertificate(certificate)}
                          sx={{ flex: 1 }}
                        >
                          Tải chứng chỉ
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<VisibilityIcon />}
                          sx={{ minWidth: 120 }}
                        >
                          Xem trước
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Hoạt động gần đây
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Những bài học bạn đã hoàn thành gần đây
            </Typography>
          </Box>

          {recentActivities.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <BookIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Chưa có hoạt động nào
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bắt đầu học để xem hoạt động của bạn
              </Typography>
            </Box>
          ) : (
            <List>
              {recentActivities.map((activity, index) => (
                <React.Fragment key={index}>
                  <ListItem
                    sx={{
                      py: 2,
                      transition: 'background-color 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                  >
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: `${activity.color}.light`, width: 40, height: 40 }}>
                        {activity.icon}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {activity.title}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {activity.subtitle}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {activity.time}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < recentActivities.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default Progress;
