import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  Avatar
} from '@mui/material';
import {
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  Book as BookIcon,
  EmojiEvents as TrophyIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon
} from '@mui/icons-material';

interface ProgressData {
  totalCourses: number;
  completedCourses: number;
  totalLessons: number;
  completedLessons: number;
  overallProgress: number;
  certificates: Certificate[];
}

interface Certificate {
  _id: string;
  courseId: string;
  courseTitle: string;
  issuedAt: string;
  downloadUrl: string;
  grade?: string;
}

const Progress: React.FC = () => {
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'completed' | 'in-progress'>('all');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockData: ProgressData = {
        totalCourses: 8,
        completedCourses: 3,
        totalLessons: 156,
        completedLessons: 89,
        overallProgress: 57,
        certificates: [
          {
            _id: 'cert_001',
            courseId: 'course_001',
            courseTitle: 'React Fundamentals',
            issuedAt: '2025-01-15T10:30:00Z',
            downloadUrl: '/certificates/react-fundamentals.pdf',
            grade: 'A+'
          },
          {
            _id: 'cert_002',
            courseId: 'course_002',
            courseTitle: 'Node.js Backend Development',
            issuedAt: '2025-01-10T14:20:00Z',
            downloadUrl: '/certificates/nodejs-backend.pdf',
            grade: 'A'
          },
          {
            _id: 'cert_003',
            courseId: 'course_003',
            courseTitle: 'Database Design & SQL',
            issuedAt: '2025-01-05T09:15:00Z',
            downloadUrl: '/certificates/database-design.pdf',
            grade: 'A+'
          }
        ]
      };
      setProgressData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleDownloadCertificate = useCallback((certificate: Certificate) => {
    // Simulate download
    console.log('Downloading certificate:', certificate.courseTitle);
    // In real app, this would trigger actual download
    window.open(certificate.downloadUrl, '_blank');
  }, []);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  const getGradeColor = useCallback((grade: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    if (grade.includes('A+')) return 'success';
    if (grade.includes('A')) return 'primary';
    if (grade.includes('B')) return 'info';
    return 'default';
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

  const recentActivities = useMemo(() => [
    {
      icon: <CheckCircleIcon sx={{ color: 'success.main' }} />,
      title: 'Hoàn thành bài học "React Hooks"',
      subtitle: 'Khóa học: React Fundamentals',
      time: '2 giờ trước',
      color: 'success'
    },
    {
      icon: <TrophyIcon sx={{ color: 'warning.main' }} />,
      title: 'Nhận chứng chỉ "Database Design"',
      subtitle: 'Điểm: A+',
      time: '1 ngày trước',
      color: 'warning'
    },
    {
      icon: <BookIcon sx={{ color: 'info.main' }} />,
      title: 'Bắt đầu khóa học "Node.js Backend"',
      subtitle: 'Tiến độ: 15%',
      time: '3 ngày trước',
      color: 'info'
    }
  ], []);

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

  if (!progressData) {
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
          <Typography>Vui lòng thử lại sau</Typography>
        </Alert>
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
              label={`Đang học (${progressData.totalCourses - progressData.completedCourses})`}
              value="in-progress"
              icon={<TrendingUpIcon />}
              iconPosition="start"
            />
          </Tabs>
        </Box>
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
                            Phát hành: {formatDate(certificate.issuedAt)}
                          </Typography>
                          {certificate.grade && (
                            <Chip
                              label={`Điểm: ${certificate.grade}`}
                              color={getGradeColor(certificate.grade)}
                              size="small"
                              icon={<StarIcon />}
                            />
                          )}
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
        </CardContent>
      </Card>
    </Container>
  );
};

export default Progress;
