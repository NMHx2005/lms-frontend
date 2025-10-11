import React, { useState, useEffect, useCallback } from 'react';
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
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip
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
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  Send as SendIcon
} from '@mui/icons-material';
import {
  TeacherCourse,
  TeacherCourseStats,
  getTeacherCourses,
  getTeacherCourseStats,
  deleteCourse,
  updateCourseStatus
} from '../../../../services/client/teacher-courses.service';
import { getCategoryDomains } from '../../../../services/client/category.service';
import userProfileService from '../../../../services/client/user-profile.service';

const CourseStudio: React.FC = () => {
  // ========== STATE ==========
  const [activeTab, setActiveTab] = useState<'all' | 'draft' | 'published' | 'pending' | 'rejected'>('all');
  const [courses, setCourses] = useState<TeacherCourse[]>([]);
  const [stats, setStats] = useState<TeacherCourseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [courseQuota, setCourseQuota] = useState<{
    hasActiveSubscription: boolean;
    currentCourses: number;
    maxCourses: number;
    remainingCourses: number;
    canCreateCourse: boolean;
    activePackages: Array<{ name: string; maxCourses: number; endAt: string }>;
  } | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [domainFilter, setDomainFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [availableDomains, setAvailableDomains] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'title' | 'createdAt' | 'updatedAt' | 'price' | 'studentsCount'>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 12;

  // Snackbar
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'success' });

  // Confirmation Dialog
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    content: string;
    confirmText: string;
    cancelText: string;
    onConfirm: () => void;
    severity: 'warning' | 'info' | 'error';
  }>({
    open: false,
    title: '',
    content: '',
    confirmText: 'Xác nhận',
    cancelText: 'Hủy',
    onConfirm: () => { },
    severity: 'warning'
  });

  // ========== DATA LOADING ==========
  const loadCourses = useCallback(async () => {
    try {
      setRefreshing(true);
      const response = await getTeacherCourses({
        page,
        limit,
        status: activeTab === 'all' ? undefined : activeTab,
        search: searchTerm || undefined,
        sortBy,
        sortOrder
      });

      if (response.success) {
        setCourses(response.data);
      }
    } catch (error: any) {
      console.error('Error loading courses:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Lỗi khi tải khóa học',
        severity: 'error'
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, limit, activeTab, searchTerm, sortBy, sortOrder]);

  const loadStats = useCallback(async () => {
    try {
      const response = await getTeacherCourseStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error: any) {
      console.error('Error loading stats:', error);
    }
  }, []);

  useEffect(() => {
    const loadDomains = async () => {
      try {
        const domains = await getCategoryDomains();
        setAvailableDomains(domains);
      } catch (error) {
        console.error('Error loading domains:', error);
        // Set default domains if API fails
        setAvailableDomains(['IT', 'Business', 'Design', 'Marketing', 'Science', 'Law', 'Other']);
      }
    };
    loadDomains();

    // Load course quota
    const loadQuota = async () => {
      try {
        const response = await userProfileService.getCourseQuota();
        if (response.success) {
          setCourseQuota(response.data);
        }
      } catch (error) {
        console.error('Error loading course quota:', error);
      }
    };
    loadQuota();
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // ========== HANDLERS ==========
  const handleRefresh = () => {
    loadCourses();
    loadStats();
  };

  const handleForceRefresh = () => {
    // Clear courses state first
    setCourses([]);
    setStats(null);
    // Then reload
    setTimeout(() => {
      loadCourses();
      loadStats();
    }, 100);
  };

  const handleTabChange = useCallback((_event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue as typeof activeTab);
    setPage(1);
  }, []);

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setDomainFilter('');
    setLevelFilter('');
    setSortBy('updatedAt');
    setSortOrder('desc');
    setPage(1);
  }, []);

  const handleDeleteCourse = async (courseId: string, courseTitle: string) => {
    setConfirmDialog({
      open: true,
      title: 'Xác nhận xóa khóa học',
      content: `Bạn có chắc chắn muốn xóa khóa học "${courseTitle}"?\n\nHành động này không thể hoàn tác.`,
      confirmText: 'Xóa',
      cancelText: 'Hủy',
      severity: 'error',
      onConfirm: async () => {
        try {
          const response = await deleteCourse(courseId);
          if (response.success) {
            setSnackbar({
              open: true,
              message: 'Xóa khóa học thành công',
              severity: 'success'
            });
            loadCourses();
            loadStats();
          }
        } catch (error: any) {
          console.error('Error deleting course:', error);
          setSnackbar({
            open: true,
            message: error.response?.data?.error || 'Lỗi khi xóa khóa học',
            severity: 'error'
          });
        }
        setConfirmDialog({ ...confirmDialog, open: false });
      }
    });
  };

  const handleSubmitForReview = async (courseId: string, courseTitle: string) => {
    // Find course to get current status
    const course = courses.find(c => c._id === courseId);
    const currentStatus = course?.status || 'draft';

    // Determine title and content based on status
    let title = 'Xác nhận gửi duyệt';
    let content = '';
    let confirmText = 'Gửi duyệt';

    if (currentStatus === 'published') {
      title = 'Xác nhận gửi lại duyệt';
      content = `Bạn có chắc chắn muốn gửi lại khóa học "${courseTitle}" cho admin duyệt không?\n\n` +
        `LƯU Ý QUAN TRỌNG:\n` +
        `• Khóa học đã xuất bản sẽ được tạm ngưng cho đến khi admin duyệt lại\n` +
        `• Chỉ có thể gửi lại khi đã chỉnh sửa nội dung\n` +
        `• Bạn sẽ không thể chỉnh sửa cho đến khi admin phản hồi\n` +
        `• Hãy đảm bảo nội dung khóa học đã hoàn thiện trước khi gửi`;
      confirmText = 'Gửi lại duyệt';
    } else if (currentStatus === 'rejected') {
      title = 'Xác nhận gửi lại sau khi bị từ chối';
      content = `Bạn có chắc chắn muốn gửi lại khóa học "${courseTitle}" cho admin duyệt không?\n\n` +
        `LƯU Ý QUAN TRỌNG:\n` +
        `• Khóa học đã bị từ chối trước đó\n` +
        `• Hãy đảm bảo đã khắc phục các vấn đề mà admin yêu cầu\n` +
        `• Bạn sẽ không thể chỉnh sửa cho đến khi admin phản hồi\n` +
        `• Kiểm tra kỹ nội dung trước khi gửi lại`;
      confirmText = 'Gửi lại duyệt';
    } else if (currentStatus === 'needs_revision') {
      title = 'Xác nhận gửi lại sau chỉnh sửa';
      content = `Bạn có chắc chắn muốn gửi lại khóa học "${courseTitle}" cho admin duyệt không?\n\n` +
        `LƯU Ý QUAN TRỌNG:\n` +
        `• Admin đã yêu cầu chỉnh sửa trước đó\n` +
        `• Hãy đảm bảo đã thực hiện các chỉnh sửa theo yêu cầu\n` +
        `• Bạn sẽ không thể chỉnh sửa cho đến khi admin phản hồi\n` +
        `• Kiểm tra kỹ nội dung trước khi gửi lại`;
      confirmText = 'Gửi lại duyệt';
    } else {
      // Draft course
      title = 'Xác nhận gửi duyệt';
      content = `Bạn có chắc chắn muốn gửi khóa học "${courseTitle}" cho admin duyệt không?\n\n` +
        `LƯU Ý QUAN TRỌNG:\n` +
        `• Mỗi khóa học DRAFT CHỈ ĐƯỢC GỬI DUYỆT 1 LẦN DUY NHẤT\n` +
        `• Sau khi gửi, bạn KHÔNG THỂ RÚT LẠI hoặc GỬI LẠI\n` +
        `• Bạn sẽ không thể chỉnh sửa cho đến khi admin phản hồi\n` +
        `• Hãy đảm bảo nội dung khóa học đã hoàn thiện trước khi gửi`;
      confirmText = 'Gửi duyệt';
    }

    setConfirmDialog({
      open: true,
      title,
      content,
      confirmText,
      cancelText: 'Hủy',
      severity: 'warning',
      onConfirm: async () => {
        try {
          const response = await updateCourseStatus(courseId, 'submitted');
          if (response.success) {
            setSnackbar({
              open: true,
              message: 'Đã gửi khóa học cho admin duyệt thành công',
              severity: 'success'
            });
            loadCourses();
            loadStats();
          }
        } catch (error: any) {
          console.error('Error submitting course:', error);
          setSnackbar({
            open: true,
            message: error.response?.data?.error || 'Lỗi khi gửi khóa học',
            severity: 'error'
          });
        }
        setConfirmDialog({ ...confirmDialog, open: false });
      }
    });
  };

  // REMOVED: Withdraw submission feature - One-time submission policy
  // Each course can only be submitted once for review

  // ========== HELPER FUNCTIONS ==========
  const getStatusChip = useCallback((status: string) => {
    const statusConfig = {
      draft: { label: 'Bản nháp', color: 'default' as const },
      submitted: { label: 'Chờ duyệt', color: 'info' as const },
      approved: { label: 'Đã duyệt', color: 'success' as const },
      published: { label: 'Đã xuất bản', color: 'success' as const },
      rejected: { label: 'Bị từ chối', color: 'error' as const },
      needs_revision: { label: 'Cần chỉnh sửa', color: 'warning' as const },
      delisted: { label: 'Đã gỡ bỏ', color: 'default' as const }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, color: 'default' as const };

    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        variant="filled"
        sx={{
          fontWeight: 600,
          fontSize: '0.75rem'
        }}
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

  // ========== RENDER ==========
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
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Breadcrumbs>
            <Typography color="text.primary">Teacher Dashboard</Typography>
            <Typography color="text.secondary">Course Studio</Typography>
          </Breadcrumbs>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? 'Đang tải...' : 'Làm mới'}
            </Button>
            <Button
              variant="outlined"
              color="warning"
              onClick={handleForceRefresh}
              disabled={refreshing}
              size="small"
            >
              Force Refresh
            </Button>
          </Stack>
        </Stack>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
          Course Studio
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quản lý và theo dõi tất cả khóa học của bạn
        </Typography>
      </Box>

      {/* Course Quota Alert */}
      {courseQuota && (
        <Alert
          severity={
            !courseQuota.hasActiveSubscription ? 'error' :
              courseQuota.remainingCourses === 0 ? 'error' :
                courseQuota.remainingCourses <= 2 ? 'warning' : 'info'
          }
          sx={{ mb: 3 }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              {!courseQuota.hasActiveSubscription ? (
                <Typography variant="body2">
                  ❌ Bạn chưa đăng ký gói nào. Vui lòng <strong>đăng ký gói</strong> để tạo khóa học.
                </Typography>
              ) : (
                <Typography variant="body2">
                  📊 Khóa học: <strong>{courseQuota.currentCourses}/{courseQuota.maxCourses}</strong>
                  {' | '}
                  {courseQuota.remainingCourses > 0 ? (
                    <>Còn lại: <strong>{courseQuota.remainingCourses} khóa học</strong></>
                  ) : (
                    <strong style={{ color: '#d32f2f' }}>Đã đạt giới hạn!</strong>
                  )}
                  {courseQuota.activePackages.length > 1 && (
                    <> ({courseQuota.activePackages.length} gói đang hoạt động)</>
                  )}
                </Typography>
              )}
            </Box>
            <Button
              component={Link}
              to="/teacher/advanced/packages"
              variant="outlined"
              size="small"
            >
              {!courseQuota.hasActiveSubscription ? 'Đăng ký gói' : 'Nâng cấp gói'}
            </Button>
          </Stack>
        </Alert>
      )}

      {/* Stats Overview */}
      {stats && (
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
      )}

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
              <Tooltip
                title={
                  courseQuota && !courseQuota.canCreateCourse
                    ? `Bạn đã đạt giới hạn ${courseQuota.maxCourses} khóa học. Vui lòng nâng cấp gói.`
                    : ''
                }
              >
                <span>
                  <Button
                    component={Link}
                    to="/teacher/courses/new"
                    variant="contained"
                    startIcon={<AddIcon />}
                    disabled={courseQuota ? !courseQuota.canCreateCourse : false}
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
                </span>
              </Tooltip>
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
                      onChange={(e) => setDomainFilter(e.target.value)}
                      label="Lĩnh vực"
                      MenuProps={{ disableScrollLock: true }}
                    >
                      <MenuItem value="">Tất cả</MenuItem>
                      {availableDomains.map((domain) => (
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
                      onChange={(e) => setLevelFilter(e.target.value)}
                      label="Cấp độ"
                      MenuProps={{ disableScrollLock: true }}
                    >
                      <MenuItem value="">Tất cả</MenuItem>
                      <MenuItem value="beginner">Cơ bản</MenuItem>
                      <MenuItem value="intermediate">Trung cấp</MenuItem>
                      <MenuItem value="advanced">Nâng cao</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Sắp xếp theo</InputLabel>
                    <Select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
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
                      onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}
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
      {stats && (
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
      )}

      {/* Courses List */}
      {courses.length === 0 ? (
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
          {courses.map((course) => (
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

                <CardActions sx={{ p: 2, pt: 0, gap: 1, flexWrap: 'wrap' }}>
                  {/* Edit button - enable cho draft và published (nhưng published sẽ phải gửi duyệt lại) */}
                  <Button
                    component={Link}
                    to={`/teacher/courses/${course._id}/edit`}
                    variant="outlined"
                    startIcon={<EditIcon />}
                    size="small"
                    sx={{ flex: '1 1 auto', minWidth: '100px' }}
                    disabled={course.status === 'submitted' || course.status === 'approved'}
                  >
                    Sửa
                  </Button>

                  {/* Structure button - enable cho tất cả trừ submitted/approved */}
                  <Button
                    component={Link}
                    to={`/teacher/courses/${course._id}/structure`}
                    variant="contained"
                    startIcon={<BuildIcon />}
                    size="small"
                    sx={{ flex: '1 1 auto', minWidth: '100px' }}
                    disabled={course.status === 'submitted' || course.status === 'approved'}
                  >
                    Cấu trúc
                  </Button>

                  {/* Nút Gửi duyệt - logic mới */}
                  {course.status === 'draft' && (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<SendIcon />}
                      size="small"
                      onClick={() => handleSubmitForReview(course._id, course.title)}
                      sx={{ flex: '1 1 auto', minWidth: '120px' }}
                    >
                      Gửi duyệt
                    </Button>
                  )}

                  {/* Nút Gửi lại duyệt - cho published/rejected/needs_revision */}
                  {((course.status === 'published' && course.hasUnsavedChanges) ||
                    course.status === 'rejected' ||
                    course.status === 'needs_revision') && (
                      <Button
                        variant="contained"
                        color={course.status === 'rejected' ? 'error' :
                          course.status === 'needs_revision' ? 'warning' : 'primary'}
                        startIcon={<SendIcon />}
                        size="small"
                        onClick={() => handleSubmitForReview(course._id, course.title)}
                        sx={{ flex: '1 1 auto', minWidth: '120px' }}
                      >
                        {course.status === 'rejected' ? 'Gửi lại sau khi từ chối' :
                          course.status === 'needs_revision' ? 'Gửi lại sau chỉnh sửa' :
                            'Gửi lại duyệt'}
                      </Button>
                    )}

                  {/* Thông báo cho submitted/approved courses - không thể chỉnh sửa */}
                  {(course.status === 'submitted' || course.status === 'approved') && (
                    <Button
                      variant="outlined"
                      size="small"
                      disabled
                      sx={{ flex: '1 1 auto', minWidth: '200px' }}
                    >
                      {course.status === 'submitted' ? 'Đang chờ admin duyệt' :
                        course.status === 'approved' ? 'Đã được duyệt - chờ xuất bản' :
                          'Không thể chỉnh sửa'}
                    </Button>
                  )}

                  {/* Nút Xóa - chỉ hiện cho draft */}
                  {course.status === 'draft' && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDeleteCourse(course._id, course.title)}
                      sx={{ minWidth: 'auto', px: 1 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          id="confirm-dialog-title"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: confirmDialog.severity === 'error' ? 'error.main' :
              confirmDialog.severity === 'warning' ? 'warning.main' : 'info.main'
          }}
        >
          {confirmDialog.severity === 'error' && <DeleteIcon />}
          {confirmDialog.severity === 'warning' && <SendIcon />}
          {confirmDialog.severity === 'info' && <EditIcon />}
          {confirmDialog.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="confirm-dialog-description"
            sx={{
              whiteSpace: 'pre-line',
              fontSize: '0.95rem',
              lineHeight: 1.6
            }}
          >
            {confirmDialog.content}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
            variant="outlined"
          >
            {confirmDialog.cancelText}
          </Button>
          <Button
            onClick={confirmDialog.onConfirm}
            variant="contained"
            color={confirmDialog.severity === 'error' ? 'error' : 'primary'}
            autoFocus
          >
            {confirmDialog.confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CourseStudio;
