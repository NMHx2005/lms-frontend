import React, { useState, useEffect } from 'react';
// import './CourseModeration.css';
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
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

interface Course {
  _id: string;
  title: string;
  instructor: {
    name: string;
    email: string;
  };
  category: string;
  price: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  description: string;
  thumbnail: string;
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
}

interface CourseFilters {
  search: string;
  status: string;
  category: string;
  level: string;
}

const CourseModeration: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<CourseFilters>({
    search: '',
    status: 'all',
    category: 'all',
    level: 'all'
  });
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    setTimeout(() => {
      const mockCourses: Course[] = [
        {
          _id: '1',
          title: 'React Advanced Patterns',
          instructor: { name: 'Nguyễn Văn A', email: 'nguyenvana@email.com' },
          category: 'Programming',
          price: 299000,
          status: 'pending',
          submittedAt: '2024-01-20T10:30:00Z',
          description: 'Khóa học nâng cao về React với các pattern và best practices hiện đại.',
          thumbnail: 'https://via.placeholder.com/300x200',
          duration: 15,
          level: 'advanced'
        },
        {
          _id: '2',
          title: 'Python Data Science',
          instructor: { name: 'Trần Thị B', email: 'tranthib@email.com' },
          category: 'Data Science',
          price: 399000,
          status: 'pending',
          submittedAt: '2024-01-19T14:20:00Z',
          description: 'Học Python để phân tích dữ liệu và machine learning cơ bản.',
          thumbnail: 'https://via.placeholder.com/300x200',
          duration: 20,
          level: 'intermediate'
        },
        {
          _id: '3',
          title: 'Web Design Fundamentals',
          instructor: { name: 'Lê Văn C', email: 'levanc@email.com' },
          category: 'Design',
          price: 199000,
          status: 'approved',
          submittedAt: '2024-01-18T09:15:00Z',
          description: 'Nguyên lý thiết kế web cơ bản cho người mới bắt đầu.',
          thumbnail: 'https://via.placeholder.com/300x200',
          duration: 12,
          level: 'beginner'
        },
        {
          _id: '4',
          title: 'Mobile App Development',
          instructor: { name: 'Phạm Thị D', email: 'phamthid@email.com' },
          category: 'Mobile',
          price: 499000,
          status: 'rejected',
          submittedAt: '2024-01-17T16:45:00Z',
          description: 'Phát triển ứng dụng mobile với React Native.',
          thumbnail: 'https://via.placeholder.com/300x200',
          duration: 25,
          level: 'intermediate'
        },
        {
          _id: '5',
          title: 'Blockchain Basics',
          instructor: { name: 'Hoàng Văn E', email: 'hoangvane@email.com' },
          category: 'Technology',
          price: 599000,
          status: 'pending',
          submittedAt: '2024-01-16T11:30:00Z',
          description: 'Giới thiệu về blockchain và cryptocurrency.',
          thumbnail: 'https://via.placeholder.com/300x200',
          duration: 18,
          level: 'beginner'
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
        course.instructor.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus = filters.status === 'all' || course.status === filters.status;
      const matchesCategory = filters.category === 'all' || course.category === filters.category;
      const matchesLevel = filters.level === 'all' || course.level === filters.level;
      return matchesSearch && matchesStatus && matchesCategory && matchesLevel;
    });
    setFilteredCourses(filtered);
  }, [courses, filters]);

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

  const handleBulkAction = (action: 'approve' | 'reject') => {
    if (selectedCourses.length === 0) return;

    const actionText = action === 'approve' ? 'duyệt' : 'từ chối';
    if (confirm(`Bạn có chắc chắn muốn ${actionText} ${selectedCourses.length} khóa học đã chọn?`)) {
      setCourses(prev => prev.map(course => {
        if (selectedCourses.includes(course._id)) {
          return { ...course, status: action === 'approve' ? 'approved' : 'rejected' as const };
        }
        return course;
      }));
      setSelectedCourses([]);
    }
  };

  const handleReviewCourse = (course: Course) => {
    setSelectedCourse(course);
    setShowReviewModal(true);
    setReviewComment('');
  };

  const handleSubmitReview = (action: 'approve' | 'reject') => {
    if (!selectedCourse) return;

    const statusMap = { approve: 'approved' as const, reject: 'rejected' as const };

    setCourses(prev => prev.map(course => {
      if (course._id === selectedCourse._id) {
        return { ...course, status: statusMap[action] };
      }
      return course;
    }));

    setShowReviewModal(false);
    setSelectedCourse(null);
    setReviewComment('');
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: 'Chờ duyệt',
      approved: 'Đã duyệt',
      rejected: 'Đã từ chối'
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

  const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('vi-VN');

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
              <Typography variant="h5" fontWeight={800}>Duyệt khóa học</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Quản lý và duyệt các khóa học mới</Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button variant="contained" color="inherit" startIcon={<AutorenewIcon />} sx={{ color: '#111827' }} onClick={() => window.location.reload()}>Làm mới</Button>
              <Button variant="contained" color="inherit" startIcon={<FileDownloadIcon />} sx={{ color: '#111827' }}>Xuất Excel</Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Stats */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}><Card><CardContent><Stack direction="row" spacing={2} alignItems="center"><Avatar>⏳</Avatar><Box><Typography variant="h6" fontWeight={700}>{courses.filter(c => c.status === 'pending').length}</Typography><Typography variant="body2" color="text.secondary">Chờ duyệt</Typography></Box></Stack></CardContent></Card></Grid>
        <Grid item xs={12} sm={6} md={3}><Card><CardContent><Stack direction="row" spacing={2} alignItems="center"><Avatar>✅</Avatar><Box><Typography variant="h6" fontWeight={700}>{courses.filter(c => c.status === 'approved').length}</Typography><Typography variant="body2" color="text.secondary">Đã duyệt</Typography></Box></Stack></CardContent></Card></Grid>
        <Grid item xs={12} sm={6} md={3}><Card><CardContent><Stack direction="row" spacing={2} alignItems="center"><Avatar>❌</Avatar><Box><Typography variant="h6" fontWeight={700}>{courses.filter(c => c.status === 'rejected').length}</Typography><Typography variant="body2" color="text.secondary">Đã từ chối</Typography></Box></Stack></CardContent></Card></Grid>
        <Grid item xs={12} sm={6} md={3}><Card><CardContent><Stack direction="row" spacing={2} alignItems="center"><Avatar>📚</Avatar><Box><Typography variant="h6" fontWeight={700}>{courses.length}</Typography><Typography variant="body2" color="text.secondary">Tổng cộng</Typography></Box></Stack></CardContent></Card></Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField fullWidth placeholder="Tìm kiếm theo tên khóa học hoặc giảng viên..." value={filters.search} onChange={(e) => handleFilterChange({ search: e.target.value })} InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }} />
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select label="Trạng thái" value={filters.status} onChange={(e) => handleFilterChange({ status: e.target.value })} MenuProps={{ disableScrollLock: true }}>
                <MenuItem value="all">Tất cả trạng thái</MenuItem>
                <MenuItem value="pending">Chờ duyệt</MenuItem>
                <MenuItem value="approved">Đã duyệt</MenuItem>
                <MenuItem value="rejected">Đã từ chối</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <FormControl fullWidth>
              <InputLabel>Danh mục</InputLabel>
              <Select label="Danh mục" value={filters.category} onChange={(e) => handleFilterChange({ category: e.target.value })} MenuProps={{ disableScrollLock: true }}>
                <MenuItem value="all">Tất cả danh mục</MenuItem>
                <MenuItem value="Programming">Programming</MenuItem>
                <MenuItem value="Data Science">Data Science</MenuItem>
                <MenuItem value="Design">Design</MenuItem>
                <MenuItem value="Mobile">Mobile</MenuItem>
                <MenuItem value="Technology">Technology</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <FormControl fullWidth>
              <InputLabel>Cấp độ</InputLabel>
              <Select label="Cấp độ" value={filters.level} onChange={(e) => handleFilterChange({ level: e.target.value })} MenuProps={{ disableScrollLock: true }}>
                <MenuItem value="all">Tất cả cấp độ</MenuItem>
                <MenuItem value="beginner">Cơ bản</MenuItem>
                <MenuItem value="intermediate">Trung cấp</MenuItem>
                <MenuItem value="advanced">Nâng cao</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Bulk Actions */}
      {selectedCourses.length > 0 && (
        <Paper sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip color="primary" label={`Đã chọn ${selectedCourses.length} khóa học`} />
            <Button onClick={() => setSelectedCourses([])}>Bỏ chọn tất cả</Button>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button variant="contained" color="success" onClick={() => handleBulkAction('approve')}>Duyệt ({selectedCourses.length})</Button>
            <Button variant="outlined" color="error" onClick={() => handleBulkAction('reject')}>Từ chối ({selectedCourses.length})</Button>
          </Stack>
        </Paper>
      )}

      {/* Courses List */}
      <Grid container spacing={2}>
        {filteredCourses.map((course) => (
          <Grid key={course._id} item xs={12}>
            <Card>
              <CardContent>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <Stack alignItems="center" spacing={1}>
                    <Checkbox checked={selectedCourses.includes(course._id)} onChange={() => handleCourseSelection(course._id)} />
                    <Chip label={getStatusLabel(course.status)} color={course.status === 'pending' ? 'warning' : course.status === 'approved' ? 'success' : 'error'} size="small" />
                  </Stack>
                  <Box sx={{ width: 240, flexShrink: 0 }}>
                    <Box component="img" src={course.thumbnail} alt={course.title} sx={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 1 }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight={800}>{course.title}</Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>{course.description}</Typography>
                    <Grid container spacing={2} mt={1}>
                      <Grid item xs={12} sm={6} md={3}><Typography variant="body2" color="text.secondary">Giảng viên</Typography><Typography fontWeight={700}>{course.instructor.name}</Typography></Grid>
                      <Grid item xs={12} sm={6} md={3}><Typography variant="body2" color="text.secondary">Danh mục</Typography><Typography fontWeight={700}>{course.category}</Typography></Grid>
                      <Grid item xs={6} md={2}><Typography variant="body2" color="text.secondary">Cấp độ</Typography><Typography fontWeight={700}>{getLevelLabel(course.level)}</Typography></Grid>
                      <Grid item xs={6} md={2}><Typography variant="body2" color="text.secondary">Thời lượng</Typography><Typography fontWeight={700}>{course.duration} giờ</Typography></Grid>
                      <Grid item xs={6} md={2}><Typography variant="body2" color="text.secondary">Giá</Typography><Typography fontWeight={700}>{formatCurrency(course.price)}</Typography></Grid>
                      <Grid item xs={6} md={2}><Typography variant="body2" color="text.secondary">Ngày nộp</Typography><Typography fontWeight={700}>{formatDate(course.submittedAt)}</Typography></Grid>
                    </Grid>
                    <Stack direction="row" spacing={1.5} mt={2}>
                      {course.status === 'pending' && (
                        <>
                          <Button variant="contained" color="success" onClick={() => handleReviewCourse(course)}>Duyệt</Button>
                          <Button variant="outlined" color="error" onClick={() => handleReviewCourse(course)}>Từ chối</Button>
                        </>
                      )}
                      <Button variant="text">Xem chi tiết</Button>
                      <Button variant="text">Chỉnh sửa</Button>
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>Không có khóa học nào</Typography>
          <Typography variant="body2" color="text.secondary">
            {filters.search || filters.status !== 'all' || filters.category !== 'all' || filters.level !== 'all'
              ? 'Không tìm thấy khóa học nào phù hợp với bộ lọc hiện tại'
              : 'Chưa có khóa học nào trong hệ thống'}
          </Typography>
        </Paper>
      )}

      {/* Review Modal */}
      <Dialog open={showReviewModal && !!selectedCourse} onClose={() => setShowReviewModal(false)} fullWidth maxWidth="sm">
        {selectedCourse && (
          <>
            <DialogTitle>Duyệt khóa học: {selectedCourse.title}</DialogTitle>
            <DialogContent dividers>
              <Stack spacing={2}>
                <Grid container spacing={2}>
                  <Grid item xs={6}><Typography variant="body2" color="text.secondary">Giảng viên</Typography><Typography fontWeight={700}>{selectedCourse.instructor.name}</Typography></Grid>
                  <Grid item xs={6}><Typography variant="body2" color="text.secondary">Danh mục</Typography><Typography fontWeight={700}>{selectedCourse.category}</Typography></Grid>
                  <Grid item xs={6}><Typography variant="body2" color="text.secondary">Giá</Typography><Typography fontWeight={700}>{formatCurrency(selectedCourse.price)}</Typography></Grid>
                </Grid>
                <Divider />
                <TextField
                  multiline
                  minRows={4}
                  label="Ghi chú (tùy chọn)"
                  placeholder="Nhập ghi chú về quyết định duyệt/từ chối..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button color="success" variant="contained" onClick={() => handleSubmitReview('approve')}>Duyệt khóa học</Button>
              <Button color="error" variant="outlined" onClick={() => handleSubmitReview('reject')}>Từ chối khóa học</Button>
              <Button onClick={() => setShowReviewModal(false)}>Hủy</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default CourseModeration;
