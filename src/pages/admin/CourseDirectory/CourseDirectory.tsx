import React, { useState, useEffect } from 'react';
// import './CourseDirectory.css';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  CircularProgress,
  Avatar,
  Checkbox,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Tooltip,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  TableSortLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PublishIcon from '@mui/icons-material/Publish';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import StarIcon from '@mui/icons-material/Star';

interface Course {
  _id: string;
  title: string;
  instructor: {
    name: string;
    email: string;
    avatar: string;
  };
  category: string;
  subcategory: string;
  price: number;
  originalPrice?: number;
  status: 'published' | 'draft' | 'archived' | 'suspended';
  enrollmentCount: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  featured: boolean;
  tags: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  lessons: number;
  language: string;
  certificate: boolean;
  lastEnrollment: string;
  revenue: number;
}

interface CourseFilters {
  search: string;
  status: string;
  category: string;
  level: string;
  featured: string;
  instructor: string;
}

const CourseDirectory: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<CourseFilters>({
    search: '',
    status: 'all',
    category: 'all',
    level: 'all',
    featured: 'all',
    instructor: ''
  });
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    setTimeout(() => {
      const mockCourses: Course[] = [
        {
          _id: '1',
          title: 'React Advanced Patterns & Best Practices',
          instructor: {
            name: 'Nguyễn Văn A',
            email: 'nguyenvana@email.com',
            avatar: 'https://via.placeholder.com/40x40'
          },
          category: 'Programming',
          subcategory: 'Frontend Development',
          price: 299000,
          originalPrice: 399000,
          status: 'published',
          enrollmentCount: 1247,
          rating: 4.8,
          reviewCount: 89,
          createdAt: '2024-01-15T00:00:00Z',
          updatedAt: '2024-01-20T10:30:00Z',
          publishedAt: '2024-01-18T00:00:00Z',
          featured: true,
          tags: ['React', 'JavaScript', 'Frontend', 'Advanced'],
          level: 'advanced',
          duration: 15,
          lessons: 45,
          language: 'Vietnamese',
          certificate: true,
          lastEnrollment: '2024-01-20T15:45:00Z',
          revenue: 372653000
        },
        {
          _id: '2',
          title: 'Python Data Science Fundamentals',
          instructor: {
            name: 'Trần Thị B',
            email: 'tranthib@email.com',
            avatar: 'https://via.placeholder.com/40x40'
          },
          category: 'Data Science',
          subcategory: 'Machine Learning',
          price: 399000,
          status: 'published',
          enrollmentCount: 892,
          rating: 4.6,
          reviewCount: 67,
          createdAt: '2024-01-10T00:00:00Z',
          updatedAt: '2024-01-19T14:20:00Z',
          publishedAt: '2024-01-12T00:00:00Z',
          featured: false,
          tags: ['Python', 'Data Science', 'Machine Learning', 'Beginner'],
          level: 'beginner',
          duration: 20,
          lessons: 38,
          language: 'Vietnamese',
          certificate: true,
          lastEnrollment: '2024-01-20T12:30:00Z',
          revenue: 355908000
        },
        {
          _id: '3',
          title: 'Web Design Principles & UI/UX',
          instructor: {
            name: 'Lê Văn C',
            email: 'levanc@email.com',
            avatar: 'https://via.placeholder.com/40x40'
          },
          category: 'Design',
          subcategory: 'Web Design',
          price: 199000,
          status: 'draft',
          enrollmentCount: 0,
          rating: 0,
          reviewCount: 0,
          createdAt: '2024-01-18T00:00:00Z',
          updatedAt: '2024-01-20T09:15:00Z',
          featured: false,
          tags: ['Design', 'UI/UX', 'Web Design', 'Principles'],
          level: 'beginner',
          duration: 12,
          lessons: 24,
          language: 'Vietnamese',
          certificate: false,
          lastEnrollment: '',
          revenue: 0
        },
        {
          _id: '4',
          title: 'Mobile App Development with React Native',
          instructor: {
            name: 'Phạm Thị D',
            email: 'phamthid@email.com',
            avatar: 'https://via.placeholder.com/40x40'
          },
          category: 'Mobile',
          subcategory: 'Cross-platform',
          price: 499000,
          status: 'suspended',
          enrollmentCount: 156,
          rating: 4.2,
          reviewCount: 23,
          createdAt: '2024-01-17T00:00:00Z',
          updatedAt: '2024-01-20T16:45:00Z',
          publishedAt: '2024-01-19T00:00:00Z',
          featured: false,
          tags: ['React Native', 'Mobile', 'Cross-platform', 'JavaScript'],
          level: 'intermediate',
          duration: 25,
          lessons: 52,
          language: 'Vietnamese',
          certificate: true,
          lastEnrollment: '2024-01-19T11:20:00Z',
          revenue: 77844000
        },
        {
          _id: '5',
          title: 'Blockchain & Cryptocurrency Basics',
          instructor: {
            name: 'Hoàng Văn E',
            email: 'hoangvane@email.com',
            avatar: 'https://via.placeholder.com/40x40'
          },
          category: 'Technology',
          subcategory: 'Blockchain',
          price: 599000,
          status: 'published',
          enrollmentCount: 234,
          rating: 4.7,
          reviewCount: 31,
          createdAt: '2024-01-16T00:00:00Z',
          updatedAt: '2024-01-20T11:30:00Z',
          publishedAt: '2024-01-17T00:00:00Z',
          featured: true,
          tags: ['Blockchain', 'Cryptocurrency', 'Technology', 'Basics'],
          level: 'beginner',
          duration: 18,
          lessons: 36,
          language: 'Vietnamese',
          certificate: true,
          lastEnrollment: '2024-01-20T14:15:00Z',
          revenue: 140166000
        }
      ];
      setCourses(mockCourses);
      setFilteredCourses(mockCourses);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const filtered = courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        course.instructor.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()));
      const matchesStatus = filters.status === 'all' || course.status === filters.status;
      const matchesCategory = filters.category === 'all' || course.category === filters.category;
      const matchesLevel = filters.level === 'all' || course.level === filters.level;
      const matchesFeatured = filters.featured === 'all' ||
        (filters.featured === 'true' && course.featured) ||
        (filters.featured === 'false' && !course.featured);
      const matchesInstructor = !filters.instructor || course.instructor.name.toLowerCase().includes(filters.instructor.toLowerCase());

      return matchesSearch && matchesStatus && matchesCategory && matchesLevel && matchesFeatured && matchesInstructor;
    });

    // Sort courses
    const sorted = [...filtered].sort((a, b) => {
      let aValue: any = a[sortBy as keyof Course];
      let bValue: any = b[sortBy as keyof Course];

      if (sortBy === 'instructor') {
        aValue = a.instructor.name;
        bValue = b.instructor.name;
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredCourses(sorted);
  }, [courses, filters, sortBy, sortOrder]);

  const handleFilterChange = (newFilters: Partial<CourseFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleCourseSelection = (courseId: string) => {
    setSelectedCourses(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCourses.length === filteredCourses.length) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(filteredCourses.map(course => course._id));
    }
  };

  const handleBulkAction = (action: 'publish' | 'suspend' | 'archive' | 'feature' | 'unfeature') => {
    if (selectedCourses.length === 0) return;

    const actionText = {
      publish: 'xuất bản',
      suspend: 'tạm ngưng',
      archive: 'lưu trữ',
      feature: 'đánh dấu nổi bật',
      unfeature: 'bỏ đánh dấu nổi bật'
    }[action];

    if (confirm(`Bạn có chắc chắn muốn ${actionText} ${selectedCourses.length} khóa học đã chọn?`)) {
      setCourses(prev => prev.map(course => {
        if (selectedCourses.includes(course._id)) {
          switch (action) {
            case 'publish':
              return { ...course, status: 'published' as const, publishedAt: new Date().toISOString() };
            case 'suspend':
              return { ...course, status: 'suspended' as const };
            case 'archive':
              return { ...course, status: 'archived' as const };
            case 'feature':
              return { ...course, featured: true };
            case 'unfeature':
              return { ...course, featured: false };
            default:
              return course;
          }
        }
        return course;
      }));
      setSelectedCourses([]);
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      published: 'Đã xuất bản',
      draft: 'Bản nháp',
      archived: 'Đã lưu trữ',
      suspended: 'Tạm ngưng'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getLevelLabel = (level: string) => {
    const labels = {
      beginner: 'Cơ bản',
      intermediate: 'Trung cấp',
      advanced: 'Nâng cao'
    };
    return labels[level as keyof typeof labels] || level;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Header */}
      <Card sx={{ background: 'linear-gradient(135deg, #5b8def 0%, #8b5cf6 100%)', color: 'white', borderRadius: 2 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={2}>
            <Box>
              <Typography variant="h5" fontWeight={800}>Quản lý khóa học</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Quản lý tất cả khóa học trong hệ thống</Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button variant="contained" color="inherit" startIcon={<AutorenewIcon />} sx={{ color: '#111827' }} onClick={() => window.location.reload()}>Làm mới</Button>
              <Button variant="contained" color="inherit" startIcon={<FileDownloadIcon />} sx={{ color: '#111827' }}>Xuất Excel</Button>
              <Button variant="contained" color="secondary" startIcon={<AddIcon />}>Thêm khóa học</Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Stats */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar>📚</Avatar>
              <Box>
                <Typography variant="h6" fontWeight={700}>{formatNumber(courses.length)}</Typography>
                <Typography variant="body2" color="text.secondary">Tổng khóa học</Typography>
              </Box>
            </Stack>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar>✅</Avatar>
              <Box>
                <Typography variant="h6" fontWeight={700}>{formatNumber(courses.filter(c => c.status === 'published').length)}</Typography>
                <Typography variant="body2" color="text.secondary">Đã xuất bản</Typography>
              </Box>
            </Stack>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar><StarIcon /></Avatar>
              <Box>
                <Typography variant="h6" fontWeight={700}>{formatNumber(courses.filter(c => c.featured).length)}</Typography>
                <Typography variant="body2" color="text.secondary">Nổi bật</Typography>
              </Box>
            </Stack>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar>💰</Avatar>
              <Box>
                <Typography variant="h6" fontWeight={700}>{formatCurrency(courses.reduce((sum, c) => sum + c.revenue, 0))}</Typography>
                <Typography variant="body2" color="text.secondary">Tổng doanh thu</Typography>
              </Box>
            </Stack>
          </CardContent></Card>
        </Grid>
      </Grid>

      {/* Filters & Controls */}
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm khóa học, giảng viên hoặc tags..."
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select label="Trạng thái" value={filters.status} onChange={(e) => handleFilterChange({ status: e.target.value })} MenuProps={{ disableScrollLock: true }}>
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="published">Đã xuất bản</MenuItem>
                <MenuItem value="draft">Bản nháp</MenuItem>
                <MenuItem value="archived">Đã lưu trữ</MenuItem>
                <MenuItem value="suspended">Tạm ngưng</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Danh mục</InputLabel>
              <Select label="Danh mục" value={filters.category} onChange={(e) => handleFilterChange({ category: e.target.value })} MenuProps={{ disableScrollLock: true }}>
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="Programming">Programming</MenuItem>
                <MenuItem value="Data Science">Data Science</MenuItem>
                <MenuItem value="Design">Design</MenuItem>
                <MenuItem value="Mobile">Mobile</MenuItem>
                <MenuItem value="Technology">Technology</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Cấp độ</InputLabel>
              <Select label="Cấp độ" value={filters.level} onChange={(e) => handleFilterChange({ level: e.target.value })} MenuProps={{ disableScrollLock: true }}>
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="beginner">Cơ bản</MenuItem>
                <MenuItem value="intermediate">Trung cấp</MenuItem>
                <MenuItem value="advanced">Nâng cao</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={1.5}>
            <FormControl fullWidth>
              <InputLabel>Nổi bật</InputLabel>
              <Select label="Nổi bật" value={filters.featured} onChange={(e) => handleFilterChange({ featured: e.target.value })} MenuProps={{ disableScrollLock: true }}>
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="true">Nổi bật</MenuItem>
                <MenuItem value="false">Không nổi bật</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={1.5}>
            <TextField fullWidth label="Giảng viên" value={filters.instructor} onChange={(e) => handleFilterChange({ instructor: e.target.value })} />
          </Grid>
        </Grid>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" mt={2}>
          <ToggleButtonGroup exclusive value={viewMode} onChange={(_, v) => v && setViewMode(v)} size="small">
            <ToggleButton value="table">Bảng</ToggleButton>
            <ToggleButton value="grid">Lưới</ToggleButton>
          </ToggleButtonGroup>
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel>Sắp xếp</InputLabel>
            <Select label="Sắp xếp" value={`${sortBy}-${sortOrder}`} onChange={(e) => { const [field, order] = String(e.target.value).split('-'); setSortBy(field); setSortOrder(order as 'asc' | 'desc'); }} MenuProps={{ disableScrollLock: true }}>
              <MenuItem value="createdAt-desc">Mới nhất</MenuItem>
              <MenuItem value="createdAt-asc">Cũ nhất</MenuItem>
              <MenuItem value="title-asc">Tên A-Z</MenuItem>
              <MenuItem value="title-desc">Tên Z-A</MenuItem>
              <MenuItem value="enrollmentCount-desc">Nhiều học viên nhất</MenuItem>
              <MenuItem value="rating-desc">Đánh giá cao nhất</MenuItem>
              <MenuItem value="price-desc">Giá cao nhất</MenuItem>
              <MenuItem value="price-asc">Giá thấp nhất</MenuItem>
              <MenuItem value="revenue-desc">Doanh thu cao nhất</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* Bulk Actions */}
      {selectedCourses.length > 0 && (
        <Paper sx={{ p: 2, borderRadius: 2 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip color="primary" label={`Đã chọn ${selectedCourses.length} khóa học`} />
              <Button onClick={() => setSelectedCourses([])}>Bỏ chọn tất cả</Button>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Button variant="contained" color="success" onClick={() => handleBulkAction('publish')}>Xuất bản ({selectedCourses.length})</Button>
              <Button variant="outlined" color="warning" onClick={() => handleBulkAction('suspend')}>Tạm ngưng ({selectedCourses.length})</Button>
              <Button variant="outlined" onClick={() => handleBulkAction('archive')}>Lưu trữ ({selectedCourses.length})</Button>
              <Button variant="outlined" startIcon={<StarIcon />} onClick={() => handleBulkAction('feature')}>Nổi bật</Button>
              <Button variant="outlined" onClick={() => handleBulkAction('unfeature')}>Bỏ nổi bật</Button>
            </Stack>
          </Stack>
        </Paper>
      )}

      {viewMode === 'table' ? (
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCourses.length === filteredCourses.length && filteredCourses.length > 0}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell sortDirection={sortBy === 'title' ? sortOrder : false} sx={{ fontWeight: 700 }}>
                  <TableSortLabel
                    active={sortBy === 'title'}
                    direction={sortBy === 'title' ? sortOrder : 'asc'}
                    onClick={() => handleSort('title')}
                  >
                    Khóa học
                  </TableSortLabel>
                </TableCell>
                <TableCell sortDirection={sortBy === 'instructor' ? sortOrder : false} sx={{ fontWeight: 700 }}>
                  <TableSortLabel
                    active={sortBy === 'instructor'}
                    direction={sortBy === 'instructor' ? sortOrder : 'asc'}
                    onClick={() => handleSort('instructor')}
                  >
                    Giảng viên
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Danh mục</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                <TableCell align="right" sortDirection={sortBy === 'enrollmentCount' ? sortOrder : false} sx={{ fontWeight: 700 }}>
                  <TableSortLabel
                    active={sortBy === 'enrollmentCount'}
                    direction={sortBy === 'enrollmentCount' ? sortOrder : 'asc'}
                    onClick={() => handleSort('enrollmentCount')}
                  >
                    Học viên
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right" sortDirection={sortBy === 'rating' ? sortOrder : false} sx={{ fontWeight: 700 }}>
                  <TableSortLabel
                    active={sortBy === 'rating'}
                    direction={sortBy === 'rating' ? sortOrder : 'asc'}
                    onClick={() => handleSort('rating')}
                  >
                    Đánh giá
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right" sortDirection={sortBy === 'price' ? sortOrder : false} sx={{ fontWeight: 700 }}>
                  <TableSortLabel
                    active={sortBy === 'price'}
                    direction={sortBy === 'price' ? sortOrder : 'asc'}
                    onClick={() => handleSort('price')}
                  >
                    Giá
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right" sortDirection={sortBy === 'revenue' ? sortOrder : false} sx={{ fontWeight: 700 }}>
                  <TableSortLabel
                    active={sortBy === 'revenue'}
                    direction={sortBy === 'revenue' ? sortOrder : 'asc'}
                    onClick={() => handleSort('revenue')}
                  >
                    Doanh thu
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course._id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedCourses.includes(course._id)}
                      onChange={() => handleCourseSelection(course._id)}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 1.25 }}>
                    <Stack spacing={0.5}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography fontWeight={700}>{course.title}</Typography>
                        {course.featured && (<Chip size="small" color="warning" icon={<StarIcon />} label="Nổi bật" />)}
                      </Stack>
                      <Stack direction="row" spacing={1}>
                        <Chip size="small" label={getLevelLabel(course.level)} />
                        <Chip size="small" label={`${course.duration}h`} />
                        <Chip size="small" label={`${course.lessons} bài`} />
                      </Stack>
                      <Stack direction="row" spacing={1}>
                        {course.tags.slice(0, 3).map((tag, idx) => (<Chip key={idx} size="small" variant="outlined" label={tag} />))}
                        {course.tags.length > 3 && (<Chip size="small" label={`+${course.tags.length - 3}`} />)}
                      </Stack>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ py: 1.25 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar src={course.instructor.avatar} alt={course.instructor.name} />
                      <Box>
                        <Typography>{course.instructor.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{course.instructor.email}</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ py: 1.25 }}>
                    <Typography>{course.category}</Typography>
                    <Typography variant="body2" color="text.secondary">{course.subcategory}</Typography>
                  </TableCell>
                  <TableCell sx={{ py: 1.25 }}>
                    <Chip
                      label={getStatusLabel(course.status)}
                      color={course.status === 'published' ? 'success' : course.status === 'draft' ? 'default' : course.status === 'archived' ? 'info' : 'warning'}
                      variant={course.status === 'draft' ? 'outlined' : 'filled'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ py: 1.25 }}>
                    <Typography fontWeight={700}>{formatNumber(course.enrollmentCount)}</Typography>
                    <Typography variant="body2" color="text.secondary">Cuối: {course.lastEnrollment ? formatDate(course.lastEnrollment) : 'N/A'}</Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ py: 1.25 }}>
                    <Typography fontWeight={700}>⭐ {course.rating.toFixed(1)}</Typography>
                    <Typography variant="body2" color="text.secondary">({formatNumber(course.reviewCount)} đánh giá)</Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ py: 1.25 }}>
                    <Typography fontWeight={700}>{formatCurrency(course.price)}</Typography>
                    {course.originalPrice && course.originalPrice > course.price && (
                      <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                        {formatCurrency(course.originalPrice)}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right" sx={{ py: 1.25 }}>
                    <Typography fontWeight={700}>{formatCurrency(course.revenue)}</Typography>
                  </TableCell>
                  <TableCell align="center" sx={{ py: 1.25 }}>
                    <Stack direction="row" spacing={0.5} justifyContent="center">
                      <Tooltip title="Xem chi tiết"><span><IconButton size="small"><VisibilityIcon /></IconButton></span></Tooltip>
                      <Tooltip title="Chỉnh sửa"><span><IconButton size="small" color="primary"><EditIcon /></IconButton></span></Tooltip>
                      {course.status === 'published' ? (
                        <Tooltip title="Tạm ngưng"><span><IconButton size="small" color="warning"><PauseCircleOutlineIcon /></IconButton></span></Tooltip>
                      ) : (
                        <Tooltip title="Xuất bản"><span><IconButton size="small" color="success"><PublishIcon /></IconButton></span></Tooltip>
                      )}
                      <Tooltip title="Xóa"><span><IconButton size="small" color="error"><DeleteOutlineIcon /></IconButton></span></Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Grid container spacing={2}>
          {filteredCourses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Checkbox checked={selectedCourses.includes(course._id)} onChange={() => handleCourseSelection(course._id)} />
                    <Chip
                      label={getStatusLabel(course.status)}
                      color={course.status === 'published' ? 'success' : course.status === 'draft' ? 'default' : course.status === 'archived' ? 'info' : 'warning'}
                      size="small"
                    />
                  </Stack>
                  <Typography variant="h6" fontWeight={800} mt={1}>
                    {course.title} {course.featured && <Chip size="small" color="warning" icon={<StarIcon />} label="Nổi bật" sx={{ ml: 1 }} />}
                  </Typography>
                  <Stack direction="row" spacing={1.5} alignItems="center" mt={1}>
                    <Avatar src={course.instructor.avatar} />
                    <Typography>{course.instructor.name}</Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    {course.category} • {course.subcategory}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={0.5}>
                    {getLevelLabel(course.level)} • {course.duration}h • {course.lessons} bài
                  </Typography>
                  <Stack direction="row" spacing={1} mt={1}>
                    {course.tags.slice(0, 3).map((tag, idx) => (<Chip key={idx} size="small" variant="outlined" label={tag} />))}
                  </Stack>
                  <Divider sx={{ my: 1.5 }} />
                  <Grid container>
                    <Grid item xs={6}><Typography variant="body2" color="text.secondary">Học viên</Typography><Typography fontWeight={700}>{formatNumber(course.enrollmentCount)}</Typography></Grid>
                    <Grid item xs={6}><Typography variant="body2" color="text.secondary">Đánh giá</Typography><Typography fontWeight={700}>⭐ {course.rating.toFixed(1)}</Typography></Grid>
                    <Grid item xs={6} mt={1}><Typography variant="body2" color="text.secondary">Giá</Typography><Typography fontWeight={700}>{formatCurrency(course.price)}</Typography></Grid>
                    <Grid item xs={6} mt={1}><Typography variant="body2" color="text.secondary">Doanh thu</Typography><Typography fontWeight={700}>{formatCurrency(course.revenue)}</Typography></Grid>
                  </Grid>
                  <Stack direction="row" spacing={1} mt={1.5}>
                    <Button size="small" startIcon={<VisibilityIcon />}>Xem</Button>
                    <Button size="small" startIcon={<EditIcon />} color="primary">Sửa</Button>
                    {course.status === 'published' ? (
                      <Button size="small" startIcon={<PauseCircleOutlineIcon />} color="warning">Tạm ngưng</Button>
                    ) : (
                      <Button size="small" startIcon={<PublishIcon />} color="success">Xuất bản</Button>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>Không có khóa học nào</Typography>
          <Typography variant="body2" color="text.secondary">
            {filters.search || filters.status !== 'all' || filters.category !== 'all' ||
              filters.level !== 'all' || filters.featured !== 'all' || filters.instructor
              ? 'Không tìm thấy khóa học nào phù hợp với bộ lọc hiện tại'
              : 'Chưa có khóa học nào trong hệ thống'}
          </Typography>
        </Paper>
      )}

      {/* Simple Pagination (static like original) */}
      {filteredCourses.length > 0 && (
        <Paper sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body2">Hiển thị {filteredCourses.length} trong tổng số {courses.length} khóa học</Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button disabled>← Trước</Button>
            <Typography variant="body2">Trang 1</Typography>
            <Button disabled>Sau →</Button>
          </Stack>
        </Paper>
      )}
    </Box>
  );
};

export default CourseDirectory;
