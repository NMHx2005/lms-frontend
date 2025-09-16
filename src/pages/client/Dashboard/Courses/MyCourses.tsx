import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseStats from '@/components/Client/Dashboard/Courses/CourseStats';
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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Breadcrumbs,
  Link as MuiLink,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SchoolIcon from '@mui/icons-material/School';
import StarIcon from '@mui/icons-material/Star';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import BookIcon from '@mui/icons-material/Book';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

// Interface cho khóa học từ API
interface EnrolledCourse {
  _id: string;
  courseId: {
    _id: string;
    title: string;
    description: string;
    thumbnail: string;
    domain: string;
    level: string;
    prerequisites: string[];
    benefits: string[];
    relatedLinks: string[];
    instructorId: {
      _id: string;
      name: string;
      email: string;
      avatar: string;
    };
    price: number;
    isPublished: boolean;
    isApproved: boolean;
    upvotes: number;
    reports: number;
    enrolledStudents: string[];
    createdAt: string;
    updatedAt: string;
  };
  progress: number;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  enrolledAt: string;
  lastAccessedAt: string;
  completedAt?: string;
}

// Thêm interface CourseFilter
interface CourseFilter {
  search: string;
  domain: string;
  level: string;
  status: string;
}

// Helper functions
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

const getLevelColor = (level: string): 'success' | 'warning' | 'error' | 'default' => {
  switch (level) {
    case 'beginner': return 'success';
    case 'intermediate': return 'warning';
    case 'advanced': return 'error';
    default: return 'default';
  }
};

const getLevelText = (level: string) => {
  switch (level) {
    case 'beginner': return 'Cơ bản';
    case 'intermediate': return 'Trung cấp';
    case 'advanced': return 'Nâng cao';
    default: return level;
  }
};

const getStatusColor = (status: string): 'success' | 'info' | 'warning' | 'error' | 'default' => {
  switch (status) {
    case 'active': return 'success';
    case 'completed': return 'info';
    case 'paused': return 'warning';
    case 'cancelled': return 'error';
    default: return 'default';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'active': return 'Đang học';
    case 'completed': return 'Hoàn thành';
    case 'paused': return 'Tạm dừng';
    case 'cancelled': return 'Đã hủy';
    default: return status;
  }
};

// Course Card Component
const CourseCard = React.memo(({ enrollment, onStartLearning, onViewDetails, onViewAll }: {
  enrollment: EnrolledCourse;
  onStartLearning: (courseId: string) => void;
  onViewDetails: () => void;
  onViewAll: () => void;
}) => {
  const course = enrollment.courseId;

  return (
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 3,
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      willChange: 'transform',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: 4
      }
    }}>
      <Box sx={{ position: 'relative' }}>
        <CardMedia component="img" height="200" image={course.thumbnail} alt={course.title} />
        <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 12, left: 12 }}>
          <Chip
            size="small"
            color={getLevelColor(course.level)}
            label={getLevelText(course.level)}
            sx={{ fontWeight: 600 }}
          />
          <Chip
            size="small"
            color={getStatusColor(enrollment.status)}
            label={getStatusText(enrollment.status)}
            sx={{ fontWeight: 600 }}
          />
        </Stack>
        <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
          <Chip
            size="small"
            color="primary"
            label={`${enrollment.progress || 0}%`}
            sx={{ fontWeight: 600, bgcolor: 'rgba(0,0,0,0.8)', color: 'white' }}
          />
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom noWrap>
          {course.title}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
          <Typography variant="body2" color="text.secondary">
            {course.upvotes || 0} đánh giá
          </Typography>
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {course.description}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <LinearProgress
            variant="determinate"
            value={Math.max(0, Math.min(100, enrollment.progress || 0))}
            sx={{ borderRadius: 2, height: 8 }}
          />
        </Box>

        <Grid container spacing={1} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <LocalOfferIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">{course.domain}</Typography>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <BookIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {Array.isArray(course.prerequisites) ? course.prerequisites.length : 0} điều kiện
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <PeopleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {Array.isArray(course.enrolledStudents) ? course.enrolledStudents.length : 0} người
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <AssessmentIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {course.upvotes || 0} đánh giá
              </Typography>
            </Stack>
          </Grid>
        </Grid>

        {Array.isArray(course.benefits) && course.benefits.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              🎯 Lợi ích khóa học:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {course.benefits.slice(0, 3).map((benefit, index) => (
                <Chip key={index} size="small" label={benefit} variant="outlined" />
              ))}
              {course.benefits.length > 3 && (
                <Chip size="small" label={`+${course.benefits.length - 3} khác`} variant="outlined" />
              )}
            </Box>
          </Box>
        )}

        <Divider sx={{ my: 1 }} />

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            <CalendarTodayIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
            Đăng ký: {enrollment.enrolledAt ? new Date(enrollment.enrolledAt).toLocaleDateString('vi-VN') : 'N/A'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
            Cuối: {enrollment.lastAccessedAt ? new Date(enrollment.lastAccessedAt).toLocaleDateString('vi-VN') : 'N/A'}
          </Typography>
        </Stack>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" color="primary" fontWeight={600}>
            {formatPrice(course.price || 0)}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, pt: 0, gap: 1 }}>
        <Button
          variant="contained"
          startIcon={<PlayArrowIcon />}
          onClick={() => onStartLearning(course._id)}
          sx={{ flex: 1, minHeight: 40 }}
        >
          {enrollment.status === 'completed' ? 'Xem lại' : 'Học'}
        </Button>
        <Button
          variant="outlined"
          startIcon={<VisibilityIcon />}
          onClick={onViewDetails}
          sx={{ minHeight: 40, minWidth: 100 }}
        >
          Chi tiết
        </Button>
        <Button
          variant="outlined"
          startIcon={<SchoolIcon />}
          onClick={onViewAll}
          sx={{ minHeight: 40, minWidth: 100 }}
        >
          Tất cả
        </Button>
      </CardActions>
    </Card>
  );
});

const MyCourses: React.FC = () => {
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CourseFilter>({
    search: '',
    domain: 'all',
    level: 'all',
    status: 'all'
  });
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchInput }));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      // Gọi API để lấy danh sách khóa học đã đăng ký
      const response = await clientAuthService.getEnrolledCourses({ limit: 100 });

      if (response.success && response.data) {
        const coursesData = response.data.enrollments || response.data;
        if (Array.isArray(coursesData)) {
          setEnrolledCourses(coursesData);
        } else {
          setEnrolledCourses([]);
        }
      } else {
        setEnrolledCourses([]);
      }
    } catch (err: any) {
      console.error('Error fetching enrolled courses:', err);
      setError(err?.message || 'Không thể tải danh sách khóa học');
      setEnrolledCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = useMemo(() => {
    return enrolledCourses.filter(enrollment => {
      // Kiểm tra xem enrollment.courseId có tồn tại không
      if (!enrollment || !enrollment.courseId) {
        return false;
      }

      const course = enrollment.courseId;

      // Kiểm tra xem các thuộc tính cần thiết có tồn tại không
      if (!course.title || !course.description) {
        return false;
      }

      const matchesSearch = course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        course.description.toLowerCase().includes(filters.search.toLowerCase());
      const matchesDomain = filters.domain === 'all' || course.domain === filters.domain;
      const matchesLevel = filters.level === 'all' || course.level === filters.level;
      const matchesStatus = filters.status === 'all' || enrollment.status === filters.status;

      return matchesSearch && matchesDomain && matchesLevel && matchesStatus;
    });
  }, [enrolledCourses, filters]);

  const handleFilterChange = useCallback((newFilters: Partial<CourseFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Memoize filter handlers để tránh re-render
  const handleDomainChange = useCallback((domain: string) => {
    handleFilterChange({ domain });
  }, [handleFilterChange]);

  const handleLevelChange = useCallback((level: string) => {
    handleFilterChange({ level: level as 'all' | 'beginner' | 'intermediate' | 'advanced' });
  }, [handleFilterChange]);

  const handleStatusChange = useCallback((status: string) => {
    handleFilterChange({ status });
  }, [handleFilterChange]);

  const handleStartLearning = useCallback((courseId: string) => {
    navigate(`/learning/${courseId}`);
  }, [navigate]);

  const handleViewDetails = useCallback(() => {
    // Navigate to course detail page
    console.log('View details');
  }, []);

  const handleViewAll = useCallback(() => {
    navigate('/learning');
  }, [navigate]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Breadcrumbs sx={{ mb: 3 }}>
          <MuiLink color="inherit" href="/dashboard">Dashboard</MuiLink>
          <Typography color="text.primary">Khóa học của tôi</Typography>
        </Breadcrumbs>

        <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>Khóa học của tôi</Typography>

        <Box display="flex" alignItems="center" justifyContent="center" minHeight={400}>
          <Stack spacing={2} alignItems="center">
            <CircularProgress />
            <Typography variant="h6">Đang tải dữ liệu...</Typography>
          </Stack>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Breadcrumbs sx={{ mb: 3 }}>
          <MuiLink color="inherit" href="/dashboard">Dashboard</MuiLink>
          <Typography color="text.primary">Khóa học của tôi</Typography>
        </Breadcrumbs>

        <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>Khóa học của tôi</Typography>

        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>Lỗi tải dữ liệu</Typography>
          <Typography>{error}</Typography>
        </Alert>

        <Button variant="contained" onClick={fetchEnrolledCourses}>
          Thử lại
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <MuiLink color="inherit" href="/dashboard">Dashboard</MuiLink>
        <Typography color="text.primary">Khóa học của tôi</Typography>
      </Breadcrumbs>

      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>Khóa học của tôi</Typography>

      {/* Stats */}
      <Box sx={{ mb: 4 }}>
        <CourseStats courses={enrolledCourses
          .filter(enrollment => enrollment && enrollment.courseId)
          .map(enrollment => ({
            _id: enrollment.courseId._id || '',
            title: enrollment.courseId.title || '',
            description: enrollment.courseId.description || '',
            thumbnail: enrollment.courseId.thumbnail || '',
            domain: enrollment.courseId.domain || '',
            level: (enrollment.courseId.level as 'beginner' | 'intermediate' | 'advanced') || 'beginner',
            prerequisites: enrollment.courseId.prerequisites || [],
            benefits: enrollment.courseId.benefits || [],
            relatedLinks: enrollment.courseId.relatedLinks || [],
            instructorId: enrollment.courseId.instructorId?._id || '',
            price: enrollment.courseId.price || 0,
            isPublished: enrollment.courseId.isPublished || false,
            isApproved: enrollment.courseId.isApproved || false,
            upvotes: enrollment.courseId.upvotes || 0,
            reports: enrollment.courseId.reports || 0,
            enrolledStudents: enrollment.courseId.enrolledStudents || [],
            createdAt: enrollment.courseId.createdAt || new Date().toISOString(),
            updatedAt: enrollment.courseId.updatedAt || new Date().toISOString()
          }))} />
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 4, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>Bộ lọc</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Tìm kiếm và lọc khóa học theo nhu cầu
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Tìm kiếm khóa học..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Lĩnh vực</InputLabel>
                <Select
                  value={filters.domain}
                  onChange={(e) => handleDomainChange(e.target.value)}
                  label="Lĩnh vực"
                  MenuProps={{
                    disableScrollLock: true
                  }}
                >
                  <MenuItem value="all">Tất cả lĩnh vực</MenuItem>
                  <MenuItem value="IT">IT</MenuItem>
                  <MenuItem value="Design">Design</MenuItem>
                  <MenuItem value="Business">Business</MenuItem>
                  <MenuItem value="Marketing">Marketing</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Cấp độ</InputLabel>
                <Select
                  value={filters.level}
                  onChange={(e) => handleLevelChange(e.target.value)}
                  label="Cấp độ"
                  MenuProps={{
                    disableScrollLock: true
                  }}
                >
                  <MenuItem value="all">Tất cả cấp độ</MenuItem>
                  <MenuItem value="beginner">Cơ bản</MenuItem>
                  <MenuItem value="intermediate">Trung cấp</MenuItem>
                  <MenuItem value="advanced">Nâng cao</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={filters.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  label="Trạng thái"
                  MenuProps={{
                    disableScrollLock: true
                  }}
                >
                  <MenuItem value="all">Tất cả trạng thái</MenuItem>
                  <MenuItem value="active">Đang học</MenuItem>
                  <MenuItem value="completed">Hoàn thành</MenuItem>
                  <MenuItem value="paused">Tạm dừng</MenuItem>
                  <MenuItem value="cancelled">Đã hủy</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Courses List */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Danh sách khóa học ({filteredCourses.length})
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Quản lý tất cả khóa học bạn đã đăng ký
          </Typography>

          {filteredCourses.length === 0 ? (
            <Box textAlign="center" py={6}>
              <EmojiEventsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>Không có khóa học nào</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Bạn chưa đăng ký khóa học nào hoặc không có kết quả tìm kiếm
              </Typography>
              <Button variant="contained" onClick={() => navigate('/courses')}>
                Khám phá khóa học
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3} sx={{ contain: 'layout' }}>
              {filteredCourses.map((enrollment) => (
                <Grid key={enrollment._id} item xs={12} sm={6} lg={4}>
                  <CourseCard
                    enrollment={enrollment}
                    onStartLearning={handleStartLearning}
                    onViewDetails={handleViewDetails}
                    onViewAll={handleViewAll}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default MyCourses;