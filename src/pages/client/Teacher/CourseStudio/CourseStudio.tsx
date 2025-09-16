import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Chip,
  Grid,
  Stack,
  Avatar,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Build as BuildIcon,
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  People as PeopleIcon,
  MonetizationOn as MonetizationOnIcon,
  Book as BookIcon,
  Assignment as AssignmentIcon,
  Star as StarIcon,
  Schedule as ScheduleIcon,
  Clear as ClearIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';

interface TeacherCourse {
  _id: string;
  title: string;
  thumbnail: string;
  domain: string;
  level: string;
  price: number;
  status: 'draft' | 'published' | 'pending' | 'rejected';
  studentsCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
  sectionsCount: number;
  lessonsCount: number;
}

const CourseStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'draft' | 'published' | 'pending' | 'rejected'>('all');
  const [courses, setCourses] = useState<TeacherCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [domainFilter, setDomainFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'createdAt' | 'updatedAt' | 'price' | 'studentsCount'>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockCourses: TeacherCourse[] = [
        {
          _id: '1',
          title: 'React Advanced Patterns',
          thumbnail: '/images/apollo.png',
          domain: 'Web Development',
          level: 'advanced',
          price: 299000,
          status: 'published',
          studentsCount: 156,
          rating: 4.8,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T00:00:00Z',
          sectionsCount: 8,
          lessonsCount: 45
        },
        {
          _id: '2',
          title: 'Node.js Backend Development',
          thumbnail: '/images/aptech.png',
          domain: 'Backend Development',
          level: 'intermediate',
          price: 399000,
          status: 'draft',
          studentsCount: 0,
          rating: 0,
          createdAt: '2024-01-10T00:00:00Z',
          updatedAt: '2024-01-14T00:00:00Z',
          sectionsCount: 6,
          lessonsCount: 32
        },
        {
          _id: '3',
          title: 'UI/UX Design Fundamentals',
          thumbnail: '/images/codegym.png',
          domain: 'Design',
          level: 'beginner',
          price: 199000,
          status: 'pending',
          studentsCount: 0,
          rating: 0,
          createdAt: '2024-01-05T00:00:00Z',
          updatedAt: '2024-01-12T00:00:00Z',
          sectionsCount: 5,
          lessonsCount: 28
        },
        {
          _id: '4',
          title: 'Python Data Science',
          thumbnail: '/images/funix.png',
          domain: 'Data Science',
          level: 'advanced',
          price: 499000,
          status: 'published',
          studentsCount: 89,
          rating: 4.9,
          createdAt: '2023-12-15T00:00:00Z',
          updatedAt: '2024-01-10T00:00:00Z',
          sectionsCount: 10,
          lessonsCount: 52
        }
      ];
      setCourses(mockCourses);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCourses = useMemo(() => {
    let filtered = courses.filter(course => {
      const matchesTab = activeTab === 'all' || course.status === activeTab;
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.domain.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDomain = !domainFilter || course.domain === domainFilter;
      const matchesLevel = !levelFilter || course.level === levelFilter;

      return matchesTab && matchesSearch && matchesDomain && matchesLevel;
    });

    // Sort courses
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
          aValue = new Date(a.updatedAt).getTime();
          bValue = new Date(b.updatedAt).getTime();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'studentsCount':
          aValue = a.studentsCount;
          bValue = b.studentsCount;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [courses, activeTab, searchTerm, domainFilter, levelFilter, sortBy, sortOrder]);

  const getStatusChip = useCallback((status: string) => {
    const statusConfig = {
      draft: { label: 'Bản nháp', color: 'warning' as const },
      published: { label: 'Đã xuất bản', color: 'success' as const },
      pending: { label: 'Chờ duyệt', color: 'info' as const },
      rejected: { label: 'Bị từ chối', color: 'error' as const }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        variant="filled"
      />
    );
  }, []);

  const getLevelChip = useCallback((level: string) => {
    const levelConfig = {
      beginner: { label: 'Cơ bản', color: 'success' as const },
      intermediate: { label: 'Trung cấp', color: 'warning' as const },
      advanced: { label: 'Nâng cao', color: 'error' as const }
    };

    const config = levelConfig[level as keyof typeof levelConfig];
    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        variant="outlined"
      />
    );
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const stats = useMemo(() => {
    const total = courses.length;
    const published = courses.filter(c => c.status === 'published').length;
    const draft = courses.filter(c => c.status === 'draft').length;
    const pending = courses.filter(c => c.status === 'pending').length;
    const totalStudents = courses.reduce((sum, c) => sum + c.studentsCount, 0);
    const totalRevenue = courses
      .filter(c => c.status === 'published')
      .reduce((sum, c) => sum + (c.price * c.studentsCount), 0);

    return { total, published, draft, pending, totalStudents, totalRevenue };
  }, [courses]);

  const handleTabChange = useCallback((_event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue as typeof activeTab);
  }, []);

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, []);

  const handleDomainFilterChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setDomainFilter(event.target.value);
  }, []);

  const handleLevelFilterChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setLevelFilter(event.target.value);
  }, []);

  const handleSortByChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSortBy(event.target.value as typeof sortBy);
  }, []);

  const handleSortOrderChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSortOrder(event.target.value as typeof sortOrder);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setDomainFilter('');
    setLevelFilter('');
    setSortBy('updatedAt');
    setSortOrder('desc');
  }, []);

  // Get unique domains and levels from courses
  const domains = useMemo(() => {
    const uniqueDomains = [...new Set(courses.map(course => course.domain))];
    return uniqueDomains.sort();
  }, [courses]);

  const levels = useMemo(() => {
    const uniqueLevels = [...new Set(courses.map(course => course.level))];
    return uniqueLevels.sort();
  }, [courses]);

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Breadcrumbs sx={{ mb: 2 }}>
            <Typography color="text.primary">Teacher Dashboard</Typography>
            <Typography color="text.secondary">Course Studio</Typography>
          </Breadcrumbs>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            Course Studio
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h6" color="text.secondary">
            Đang tải dữ liệu...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Typography color="text.primary">Teacher Dashboard</Typography>
          <Typography color="text.secondary">Course Studio</Typography>
        </Breadcrumbs>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
          Course Studio
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quản lý và theo dõi tất cả khóa học của bạn
        </Typography>
      </Box>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <SchoolIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 600, mb: 1 }}>
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng khóa học
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main', mb: 2 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 600, mb: 1 }}>
                {stats.published}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đã xuất bản
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <PeopleIcon sx={{ fontSize: 40, color: 'info.main', mb: 2 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 600, mb: 1 }}>
                {stats.totalStudents}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng học viên
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <MonetizationOnIcon sx={{ fontSize: 40, color: 'warning.main', mb: 2 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 600, mb: 1 }}>
                {formatPrice(stats.totalRevenue)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Doanh thu
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Header Actions */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack spacing={3}>
            {/* Search and Create Button */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
              <TextField
                placeholder="Tìm kiếm khóa học..."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 300 }}
              />
              <Button
                component={Link}
                to="/teacher/courses/new"
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  },
                  px: 3,
                  py: 1.5
                }}
              >
                Tạo khóa học mới
              </Button>
            </Stack>

            {/* Filters */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <FilterListIcon color="action" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Bộ lọc
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Button
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={clearFilters}
                  size="small"
                >
                  Xóa bộ lọc
                </Button>
              </Stack>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Lĩnh vực</InputLabel>
                    <Select
                      value={domainFilter}
                      onChange={handleDomainFilterChange as unknown as (event: SelectChangeEvent<string>, child: React.ReactNode) => void}
                      label="Lĩnh vực"
                      MenuProps={{ disableScrollLock: true }}
                    >
                      <MenuItem value="">Tất cả lĩnh vực</MenuItem>
                      {domains.map((domain) => (
                        <MenuItem key={domain} value={domain}>
                          {domain}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Cấp độ</InputLabel>
                    <Select
                      value={levelFilter}
                      onChange={handleLevelFilterChange as unknown as (event: SelectChangeEvent<string>, child: React.ReactNode) => void}
                      label="Cấp độ"
                      MenuProps={{ disableScrollLock: true }}
                    >
                      <MenuItem value="">Tất cả cấp độ</MenuItem>
                      {levels.map((level) => (
                        <MenuItem key={level} value={level}>
                          {level === 'beginner' ? 'Cơ bản' :
                            level === 'intermediate' ? 'Trung cấp' :
                              level === 'advanced' ? 'Nâng cao' : level}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Sắp xếp theo</InputLabel>
                    <Select
                      value={sortBy}
                      onChange={handleSortByChange as unknown as (event: SelectChangeEvent<string>, child: React.ReactNode) => void}
                      label="Sắp xếp theo"
                      MenuProps={{ disableScrollLock: true }}
                    >
                      <MenuItem value="title">Tên khóa học</MenuItem>
                      <MenuItem value="createdAt">Ngày tạo</MenuItem>
                      <MenuItem value="updatedAt">Ngày cập nhật</MenuItem>
                      <MenuItem value="price">Giá</MenuItem>
                      <MenuItem value="studentsCount">Số học viên</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Thứ tự</InputLabel>
                    <Select
                      value={sortOrder}
                      onChange={handleSortOrderChange as unknown as (event: SelectChangeEvent<string>, child: React.ReactNode) => void}
                      label="Thứ tự"
                      MenuProps={{ disableScrollLock: true }}
                    >
                      <MenuItem value="desc">Giảm dần</MenuItem>
                      <MenuItem value="asc">Tăng dần</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              minHeight: 48,
              fontWeight: 600,
            },
          }}
        >
          <Tab label={`Tất cả (${stats.total})`} value="all" />
          <Tab label={`Đã xuất bản (${stats.published})`} value="published" />
          <Tab label={`Bản nháp (${stats.draft})`} value="draft" />
          <Tab label={`Chờ duyệt (${stats.pending})`} value="pending" />
        </Tabs>
      </Card>

      {/* Courses List */}
      {filteredCourses.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Avatar sx={{ bgcolor: 'grey.100', mx: 'auto', mb: 3, width: 80, height: 80 }}>
              <SchoolIcon fontSize="large" color="disabled" />
            </Avatar>
            <Typography variant="h5" component="h3" sx={{ mb: 2, fontWeight: 600 }}>
              Không có khóa học nào
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
              Bạn chưa có khóa học nào hoặc không có khóa học nào khớp với bộ lọc hiện tại.
            </Typography>
            <Button
              component={Link}
              to="/teacher/courses/new"
              variant="contained"
              startIcon={<AddIcon />}
              size="large"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                },
              }}
            >
              Tạo khóa học đầu tiên
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {filteredCourses.map((course) => (
            <Grid item xs={12} sm={6} lg={4} key={course._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={course.thumbnail}
                    alt={course.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                    {getStatusChip(course.status)}
                  </Box>
                </Box>

                <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2, lineHeight: 1.3 }}>
                    {course.title}
                  </Typography>

                  <Stack spacing={1.5} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Lĩnh vực:
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {course.domain}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Cấp độ:
                      </Typography>
                      {getLevelChip(course.level)}
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Giá:
                      </Typography>
                      <Typography variant="body2" fontWeight={600} color="primary">
                        {formatPrice(course.price)}
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  <Grid container spacing={1} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <BookIcon fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {course.sectionsCount} sections
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AssignmentIcon fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {course.lessonsCount} lessons
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PeopleIcon fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {course.studentsCount} students
                        </Typography>
                      </Box>
                    </Grid>
                    {course.rating > 0 && (
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <StarIcon fontSize="small" color="warning" />
                          <Typography variant="caption" color="text.secondary">
                            {course.rating}
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>

                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ScheduleIcon fontSize="small" />
                    Cập nhật: {formatDate(course.updatedAt)}
                  </Typography>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    component={Link}
                    to={`/teacher/courses/${course._id}/edit`}
                    variant="outlined"
                    startIcon={<EditIcon />}
                    size="small"
                    sx={{ flex: 1 }}
                  >
                    Chỉnh sửa
                  </Button>
                  <Button
                    component={Link}
                    to={`/teacher/courses/${course._id}/structure`}
                    variant="contained"
                    startIcon={<BuildIcon />}
                    size="small"
                    sx={{ flex: 1 }}
                  >
                    Cấu trúc
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default CourseStudio;
