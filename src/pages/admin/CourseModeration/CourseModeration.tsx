import React, { useState, useEffect } from 'react';
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
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import courseModerationService from '../../../services/admin/courseModerationService';
import type {
  CourseModeration,
  CourseModerationFilters,
  CourseModerationStats
} from '../../../services/admin/courseModerationService';

const CourseModeration: React.FC = () => {
  const [courses, setCourses] = useState<CourseModeration[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [stats, setStats] = useState<CourseModerationStats | null>(null);
  const [filters, setFilters] = useState<CourseModerationFilters>({
    search: '',
    status: 'all',
    category: 'all',
    level: 'all',
    page: 1,
    limit: 20
  });
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseModeration | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewComment, setReviewComment] = useState('');
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({ open: false, message: '', severity: 'info' });

  // Load courses and stats
  const loadCourses = async (showNotification = true) => {
    try {
      if (showNotification) {
        setLoading(true);
      } else {
        setTableLoading(true);
      }

      const apiFilters: CourseModerationFilters = {
        search: filters.search || undefined,
        status: filters.status === 'all' ? undefined : filters.status,
        domain: filters.category === 'all' ? undefined : filters.category,
        level: filters.level === 'all' ? undefined : filters.level,
        page: filters.page,
        limit: filters.limit,
        sortBy: 'createdAt', // Use createdAt instead of submittedAt
        sortOrder: 'desc'
      };

      console.log('🚀 Loading courses for moderation with filters:', apiFilters);

      const [coursesResponse, statsResponse] = await Promise.all([
        courseModerationService.getCoursesForModeration(apiFilters),
        courseModerationService.getModerationStats()
      ]);

      console.log('✅ Courses loaded:', coursesResponse);
      console.log('✅ Stats loaded:', statsResponse);

      // Handle different response structures
      const coursesData = coursesResponse?.data?.courses || coursesResponse?.courses || coursesResponse || [];
      const statsData = statsResponse?.data || statsResponse || {};

      setCourses(Array.isArray(coursesData) ? coursesData : []);
      setStats(statsData);

    } catch (error) {
      console.error('Error loading courses:', error);
      showSnackbar('Lỗi khi tải danh sách khóa học', 'error');
    } finally {
      setLoading(false);
      setTableLoading(false);
    }
  };

  useEffect(() => {
    loadCourses(false); // Load data without notification on filter changes
  }, [filters]);

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleFilterChange = (newFilters: Partial<CourseModerationFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 })); // Reset to first page when filtering
  };

  const handleCourseSelection = (courseId: string) => {
    setSelectedCourses(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleBulkAction = async (action: 'approve' | 'reject') => {
    if (selectedCourses.length === 0) return;

    const actionText = action === 'approve' ? 'duyệt' : 'từ chối';
    if (confirm(`Bạn có chắc chắn muốn ${actionText} ${selectedCourses.length} khóa học đã chọn?`)) {
      try {
        await courseModerationService.bulkApproveCourses(
          selectedCourses,
          action,
          `Bulk ${actionText} by admin`
        );

        showSnackbar(`Đã ${actionText} ${selectedCourses.length} khóa học thành công`, 'success');
        setSelectedCourses([]);
        loadCourses(false); // Reload data without notification
      } catch (error) {
        console.error('Error bulk approving courses:', error);
        showSnackbar(`Lỗi khi ${actionText} khóa học`, 'error');
      }
    }
  };

  const handleReviewCourse = (course: CourseModeration) => {
    setSelectedCourse(course);
    setShowReviewModal(true);
    setReviewComment('');
  };

  const handleSubmitReview = async (action: 'approve' | 'reject') => {
    if (!selectedCourse) return;

    try {
      await courseModerationService.approveCourse({
        courseId: selectedCourse._id,
        action,
        comment: reviewComment
      });

      const actionText = action === 'approve' ? 'duyệt' : 'từ chối';
      showSnackbar(`Đã ${actionText} khóa học "${selectedCourse.title}" thành công`, 'success');

      setShowReviewModal(false);
      setSelectedCourse(null);
      setReviewComment('');
      loadCourses(false); // Reload data without notification
    } catch (error) {
      console.error('Error approving course:', error);
      showSnackbar('Lỗi khi xử lý khóa học', 'error');
    }
  };

  const handleExportExcel = async () => {
    try {
      const exportFilters: CourseModerationFilters = {
        search: filters.search || undefined,
        status: filters.status === 'all' ? undefined : filters.status,
        domain: filters.category === 'all' ? undefined : filters.category,
        level: filters.level === 'all' ? undefined : filters.level,
        page: 1,
        limit: 10000,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };

      const response = await courseModerationService.exportCourses(exportFilters);

      // Create download link
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `course-moderation-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showSnackbar('Xuất file Excel thành công', 'success');
    } catch (error) {
      console.error('Error exporting courses:', error);
      showSnackbar('Lỗi khi xuất file Excel', 'error');
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      draft: 'Nháp',
      submitted: 'Chờ duyệt',
      approved: 'Đã duyệt',
      published: 'Đã xuất bản',
      rejected: 'Đã từ chối',
      needs_revision: 'Cần chỉnh sửa',
      delisted: 'Đã gỡ bỏ'
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

  const getInstructorName = (course: CourseModeration) => {
    if (course.instructorName) return course.instructorName;
    if (typeof course.instructorId === 'object') {
      return course.instructorId.fullName || course.instructorId.name || 'N/A';
    }
    if (course.instructor) {
      return course.instructor.name || 'N/A';
    }
    return 'N/A';
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
              <Button
                variant="contained"
                color="inherit"
                startIcon={<AutorenewIcon />}
                sx={{ color: '#111827' }}
                onClick={() => loadCourses(false)}
                disabled={loading}
              >
                {loading ? 'Đang tải...' : 'Làm mới'}
              </Button>
              <Button
                variant="contained"
                color="inherit"
                startIcon={<FileDownloadIcon />}
                sx={{ color: '#111827' }}
                onClick={handleExportExcel}
              >
                Xuất Excel
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Stats */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar>⏳</Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    {stats?.pendingApproval || courses.filter(c => c.status === 'submitted').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Chờ duyệt</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar>✅</Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    {stats?.approvedCourses || courses.filter(c => c.status === 'approved').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Đã duyệt</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar>❌</Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    {stats?.rejectedCourses || courses.filter(c => c.status === 'rejected').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Đã từ chối</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar>📚</Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    {stats?.totalCourses || courses.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Tổng cộng</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
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
                <MenuItem value="draft">Nháp</MenuItem>
                <MenuItem value="submitted">Chờ duyệt</MenuItem>
                <MenuItem value="approved">Đã duyệt</MenuItem>
                <MenuItem value="published">Đã xuất bản</MenuItem>
                <MenuItem value="rejected">Đã từ chối</MenuItem>
                <MenuItem value="needs_revision">Cần chỉnh sửa</MenuItem>
                <MenuItem value="delisted">Đã gỡ bỏ</MenuItem>
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
        {courses.map((course) => (
          <Grid key={course._id} item xs={12}>
            <Card>
              <CardContent>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <Stack alignItems="center" spacing={1}>
                    <Checkbox checked={selectedCourses.includes(course._id)} onChange={() => handleCourseSelection(course._id)} />
                    <Chip
                      label={getStatusLabel(course.status)}
                      color={
                        course.status === 'submitted' ? 'warning' :
                          course.status === 'approved' || course.status === 'published' ? 'success' :
                            course.status === 'rejected' ? 'error' :
                              course.status === 'needs_revision' ? 'warning' :
                                course.status === 'delisted' ? 'default' : 'info'
                      }
                      size="small"
                    />
                  </Stack>
                  <Box sx={{ width: 240, flexShrink: 0 }}>
                    <Box component="img" src={course.thumbnail} alt={course.title} sx={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 1 }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight={800}>{course.title}</Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>{course.description}</Typography>
                    <Grid container spacing={2} mt={1}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body2" color="text.secondary">Giảng viên</Typography>
                        <Typography fontWeight={700}>{getInstructorName(course)}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body2" color="text.secondary">Danh mục</Typography>
                        <Typography fontWeight={700}>{course.category}</Typography>
                      </Grid>
                      <Grid item xs={6} md={2}>
                        <Typography variant="body2" color="text.secondary">Cấp độ</Typography>
                        <Typography fontWeight={700}>{getLevelLabel(course.level)}</Typography>
                      </Grid>
                      <Grid item xs={6} md={2}>
                        <Typography variant="body2" color="text.secondary">Thời lượng</Typography>
                        <Typography fontWeight={700}>{course.totalDuration || 0} giờ</Typography>
                      </Grid>
                      <Grid item xs={6} md={2}>
                        <Typography variant="body2" color="text.secondary">Giá</Typography>
                        <Typography fontWeight={700}>{formatCurrency(course.price)}</Typography>
                      </Grid>
                      <Grid item xs={6} md={2}>
                        <Typography variant="body2" color="text.secondary">Ngày tạo</Typography>
                        <Typography fontWeight={700}>{course.createdAt ? formatDate(course.createdAt) : 'N/A'}</Typography>
                      </Grid>
                    </Grid>
                    <Stack direction="row" spacing={1.5} mt={2}>
                      {course.status === 'submitted' && (
                        <>
                          <Button variant="contained" color="success" onClick={() => handleReviewCourse(course)}>Duyệt</Button>
                          <Button variant="outlined" color="error" onClick={() => handleReviewCourse(course)}>Từ chối</Button>
                        </>
                      )}
                      {(course.status === 'approved' || course.status === 'published') && (
                        <Button variant="outlined" color="warning" onClick={() => handleReviewCourse(course)}>Đánh giá lại</Button>
                      )}
                      {course.status === 'needs_revision' && (
                        <Button variant="contained" color="info" onClick={() => handleReviewCourse(course)}>Xem lại</Button>
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
      {courses.length === 0 && !loading && (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>Không có khóa học nào</Typography>
          <Typography variant="body2" color="text.secondary">
            {filters.search || filters.status !== 'all' || filters.category !== 'all' || filters.level !== 'all'
              ? 'Không tìm thấy khóa học nào phù hợp với bộ lọc hiện tại'
              : 'Chưa có khóa học nào chờ duyệt trong hệ thống'}
          </Typography>
        </Paper>
      )}

      {/* Loading overlay for table */}
      {tableLoading && (
        <Box sx={{ position: 'relative', minHeight: 200 }}>
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 1
          }}>
            <Stack spacing={2} alignItems="center">
              <CircularProgress />
              <Typography variant="body2" color="text.secondary">Đang cập nhật...</Typography>
            </Stack>
          </Box>
        </Box>
      )}

      {/* Review Modal */}
      <Dialog open={showReviewModal && !!selectedCourse} onClose={() => setShowReviewModal(false)} fullWidth maxWidth="sm">
        {selectedCourse && (
          <>
            <DialogTitle>Duyệt khóa học: {selectedCourse.title}</DialogTitle>
            <DialogContent dividers>
              <Stack spacing={2}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Giảng viên</Typography>
                    <Typography fontWeight={700}>{getInstructorName(selectedCourse)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Danh mục</Typography>
                    <Typography fontWeight={700}>{selectedCourse.category}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Giá</Typography>
                    <Typography fontWeight={700}>{formatCurrency(selectedCourse.price)}</Typography>
                  </Grid>
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

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CourseModeration;
