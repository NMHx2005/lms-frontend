import React, { useState, useEffect } from 'react';
// import './CategoryManagement.css';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  TablePagination,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Checkbox
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon
} from '@mui/icons-material';
import CategoryManagementService, {
  Course,
  CourseFilters,
  CourseAnalytics,
  Category,
  CategoryCreateData
} from '../../../services/admin/categoryManagementService';

const CategoryManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<CourseFilters>({
    search: '',
    domain: 'all', // Changed from category to domain to match API
    level: 'all',
    isApproved: undefined,
    isPublished: undefined,
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [analytics, setAnalytics] = useState<CourseAnalytics | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Tab system
  const [activeTab, setActiveTab] = useState(0);

  // Category management states
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showCreateCategoryDataModal, setShowCreateCategoryDataModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [categoryForm, setCategoryForm] = useState<CategoryCreateData>({ name: '', description: '' });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' | 'warning' }>({
    open: false,
    message: '',
    severity: 'info'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  // Load data from API
  const loadData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading category management data...', filters);

      // Clean filters for API - remove empty/invalid values
      const cleanFilters = { ...filters };

      // Remove empty search
      if (!cleanFilters.search || cleanFilters.search.trim() === '') {
        delete cleanFilters.search;
      }

      // Remove invalid level values
      if (cleanFilters.level === 'all') {
        delete cleanFilters.level;
      }

      // Remove invalid domain values
      if (cleanFilters.domain === 'all') {
        delete cleanFilters.domain;
      }

      // Remove invalid approval values - only send if explicitly set
      if (cleanFilters.isApproved === undefined) {
        delete cleanFilters.isApproved;
      }

      // Remove invalid published values - only send if explicitly set
      if (cleanFilters.isPublished === undefined) {
        delete cleanFilters.isPublished;
      }

      const [coursesResponse, analyticsResponse] = await Promise.all([
        CategoryManagementService.getCourses(cleanFilters),
        CategoryManagementService.getCourseAnalytics({ period: 'monthly' }) // Use valid period format
      ]);

      console.log('📚 Courses:', coursesResponse);
      console.log('📊 Analytics:', analyticsResponse);
      console.log('🔍 Clean Filters:', cleanFilters);

      if (coursesResponse.success) {
        setCourses(coursesResponse.data.courses || []);
        setPagination({
          page: coursesResponse.data.page || 1,
          limit: coursesResponse.data.limit || 20,
          total: coursesResponse.data.total || 0,
          totalPages: coursesResponse.data.totalPages || 0
        });
      }
      if (analyticsResponse.success) {
        setAnalytics(analyticsResponse.data);
      }
    } catch (error) {
      console.error('Error loading category management data:', error);
      showSnackbar('Lỗi khi tải dữ liệu quản lý danh mục', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters.page, filters.limit, filters.sortBy, filters.sortOrder, filters.domain, filters.level, filters.isApproved, filters.isPublished]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filters.search !== undefined) {
        loadData();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters.search]);

  // Load categories when tab changes
  useEffect(() => {
    if (activeTab === 1) {
      loadCategories();
    }
  }, [activeTab]);

  // Helper functions
  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleFilterChange = (field: keyof CourseFilters, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value, page: 1 }));
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setShowEditModal(true);
  };

  const handleUpdateCourseCategory = async (courseId: string, domain: string) => {
    try {
      const response = await CategoryManagementService.updateCourseCategory(courseId, { domain });
      if (response.success) {
        showSnackbar('Đã cập nhật danh mục khóa học thành công', 'success');
        loadData(); // Reload data
      }
    } catch (error) {
      console.error('Error updating course category:', error);
      showSnackbar('Lỗi khi cập nhật danh mục khóa học', 'error');
    }
  };


  // ========== CATEGORY MANAGEMENT FUNCTIONS ==========

  // Load categories
  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await CategoryManagementService.getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      showSnackbar('Lỗi khi tải danh mục', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Create category
  const handleCreateCategoryData = async () => {
    if (!categoryForm.name.trim()) {
      showSnackbar('Vui lòng nhập tên danh mục', 'error');
      return;
    }

    try {
      const response = await CategoryManagementService.createCategoryData(categoryForm);
      if (response.success) {
        showSnackbar('Đã tạo danh mục mới thành công', 'success');
        setCategoryForm({ name: '', description: '' });
        setShowCreateCategoryDataModal(false);
        loadCategories();
      }
    } catch (error) {
      console.error('Error creating category:', error);
      showSnackbar('Lỗi khi tạo danh mục mới', 'error');
    }
  };

  // Update category
  const handleUpdateCategory = async () => {
    if (!selectedCategory || !categoryForm.name.trim()) {
      showSnackbar('Vui lòng nhập tên danh mục', 'error');
      return;
    }

    try {
      const response = await CategoryManagementService.updateCategory(selectedCategory._id, categoryForm);
      if (response.success) {
        showSnackbar('Đã cập nhật danh mục thành công', 'success');
        setCategoryForm({ name: '', description: '' });
        setShowEditCategoryModal(false);
        setSelectedCategory(null);
        loadCategories();
      }
    } catch (error) {
      console.error('Error updating category:', error);
      showSnackbar('Lỗi khi cập nhật danh mục', 'error');
    }
  };

  // Delete category
  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      return;
    }

    try {
      const response = await CategoryManagementService.deleteCategory(id);
      if (response.success) {
        showSnackbar('Đã xóa danh mục thành công', 'success');
        loadCategories();
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      showSnackbar('Lỗi khi xóa danh mục', 'error');
    }
  };

  // Toggle category status
  const handleToggleCategoryStatus = async (id: string) => {
    try {
      const response = await CategoryManagementService.toggleCategoryStatus(id);
      if (response.success) {
        showSnackbar('Đã cập nhật trạng thái danh mục', 'success');
        loadCategories();
      }
    } catch (error) {
      console.error('Error toggling category status:', error);
      showSnackbar('Lỗi khi cập nhật trạng thái danh mục', 'error');
    }
  };

  // Bulk delete categories
  const handleBulkDeleteCategories = async () => {
    if (selectedCategories.length === 0) {
      showSnackbar('Vui lòng chọn danh mục để xóa', 'error');
      return;
    }

    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${selectedCategories.length} danh mục?`)) {
      return;
    }

    try {
      const response = await CategoryManagementService.bulkDeleteCategories(selectedCategories);
      if (response.success) {
        showSnackbar(`Đã xóa ${response.data.deletedCount} danh mục thành công`, 'success');
        setSelectedCategories([]);
        loadCategories();
      }
    } catch (error) {
      console.error('Error bulk deleting categories:', error);
      showSnackbar('Lỗi khi xóa danh mục', 'error');
    }
  };

  // Handle category selection
  const handleCategorySelection = (id: string) => {
    setSelectedCategories(prev =>
      prev.includes(id)
        ? prev.filter(catId => catId !== id)
        : [...prev, id]
    );
  };

  // Handle select all categories
  const handleSelectAllCategories = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(categories.map(cat => cat._id));
    }
  };

  // Pagination handlers
  const handlePageChange = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage + 1 }));
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newLimit = parseInt(event.target.value, 10);
    setFilters(prev => ({ ...prev, limit: newLimit, page: 1 }));
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'error';
      default: return 'default';
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'beginner': return 'Cơ bản';
      case 'intermediate': return 'Trung bình';
      case 'advanced': return 'Nâng cao';
      default: return level;
    }
  };

  if (loading && courses.length === 0 && activeTab === 0) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">Đang tải quản lý danh mục...</Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Tab Navigation */}
      <Card>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ px: 2 }}
        >
          <Tab label="Quản lý khóa học" />
          <Tab label="Quản lý danh mục" />
        </Tabs>
      </Card>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Box>
          {/* Header */}
          <Card sx={{ background: 'linear-gradient(135deg, #5b8def 0%, #8b5cf6 100%)', color: 'white', borderRadius: 2 }}>
            <CardContent>
              <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={2}>
                <Box>
                  <Typography variant="h5" fontWeight={800}>Quản lý danh mục khóa học</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Quản lý và phân loại khóa học theo danh mục</Typography>
                </Box>
                <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadData} sx={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderColor: 'rgba(255,255,255,0.3)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderColor: 'rgba(255,255,255,0.5)'
                  }
                }}>
                  Làm mới
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Stats */}
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Card>
                <CardContent>
                  <Stack alignItems="center">
                    <Typography variant="h6" fontWeight={800}>
                      {analytics?.coursesByDomain?.length || 0}
                    </Typography>
                    <Typography variant="caption">Tổng danh mục</Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card>
                <CardContent>
                  <Stack alignItems="center">
                    <Typography variant="h6" fontWeight={800}>
                      {analytics?.publishedCourses || 0}
                    </Typography>
                    <Typography variant="caption">Khóa học đã xuất bản</Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card>
                <CardContent>
                  <Stack alignItems="center">
                    <Typography variant="h6" fontWeight={800}>
                      {analytics?.totalCourses || 0}
                    </Typography>
                    <Typography variant="caption">Tổng khóa học</Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card>
                <CardContent>
                  <Stack alignItems="center">
                    <Typography variant="h6" fontWeight={800}>
                      {analytics?.pendingCourses || 0}
                    </Typography>
                    <Typography variant="caption">Khóa học chờ duyệt</Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Filters */}
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Tìm kiếm khóa học..."
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Lĩnh vực</InputLabel>
                  <Select
                    label="Lĩnh vực"
                    value={filters.domain || 'all'}
                    onChange={(e) => handleFilterChange('domain', e.target.value)}
                    MenuProps={{ disableScrollLock: true }}
                  >
                    <MenuItem value="all">Tất cả lĩnh vực</MenuItem>
                    {analytics?.coursesByDomain?.map((domain) => (
                      <MenuItem key={domain._id} value={domain._id}>
                        {domain._id} ({domain.count})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Cấp độ</InputLabel>
                  <Select
                    label="Cấp độ"
                    value={filters.level || 'all'}
                    onChange={(e) => handleFilterChange('level', e.target.value)}
                    MenuProps={{ disableScrollLock: true }}
                  >
                    <MenuItem value="all">Tất cả cấp độ</MenuItem>
                    <MenuItem value="beginner">Cơ bản</MenuItem>
                    <MenuItem value="intermediate">Trung bình</MenuItem>
                    <MenuItem value="advanced">Nâng cao</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Duyệt</InputLabel>
                  <Select
                    label="Duyệt"
                    value={filters.isApproved === undefined ? 'all' : filters.isApproved ? 'approved' : 'pending'}
                    onChange={(e) => handleFilterChange('isApproved', e.target.value === 'all' ? undefined : e.target.value === 'approved')}
                    MenuProps={{ disableScrollLock: true }}
                  >
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="approved">Đã duyệt</MenuItem>
                    <MenuItem value="pending">Chờ duyệt</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Xuất bản</InputLabel>
                  <Select
                    label="Xuất bản"
                    value={filters.isPublished === undefined ? 'all' : filters.isPublished ? 'published' : 'unpublished'}
                    onChange={(e) => handleFilterChange('isPublished', e.target.value === 'all' ? undefined : e.target.value === 'published')}
                    MenuProps={{ disableScrollLock: true }}
                  >
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="published">Đã xuất bản</MenuItem>
                    <MenuItem value="unpublished">Chưa xuất bản</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          {/* Content */}
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6">
                  Khóa học ({pagination.total})
                </Typography>
                {loading && (
                  <CircularProgress size={20} />
                )}
              </Stack>

              {courses.length > 0 ? (
                <>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Khóa học</TableCell>
                        <TableCell>Danh mục</TableCell>
                        <TableCell>Cấp độ</TableCell>
                        <TableCell>Giảng viên</TableCell>
                        <TableCell>Giá</TableCell>
                        <TableCell>Học viên</TableCell>
                        <TableCell>Đánh giá</TableCell>
                        <TableCell>Trạng thái</TableCell>
                        <TableCell>Thao tác</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {courses.map((course) => (
                        <TableRow key={course._id} hover>
                          <TableCell>
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Box
                                component="img"
                                src={course.thumbnail}
                                alt={course.title}
                                sx={{
                                  width: 60,
                                  height: 40,
                                  objectFit: 'cover',
                                  borderRadius: 1
                                }}
                              />
                              <Stack>
                                <Typography fontWeight={700}>{course.title}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {course.shortDescription}
                                </Typography>
                              </Stack>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={course.domain || 'Chưa phân loại'}
                              color="primary"
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={getLevelLabel(course.level)}
                              color={getLevelColor(course.level) as any}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{course.instructorName || 'N/A'}</Typography>
                          </TableCell>
                          <TableCell>
                            <Stack>
                              <Typography variant="body2" fontWeight={500}>
                                {course.price?.toLocaleString('vi-VN')} VNĐ
                              </Typography>
                              {course.originalPrice && course.originalPrice > course.price && (
                                <>
                                  <Typography variant="caption" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                                    {course.originalPrice.toLocaleString('vi-VN')} VNĐ
                                  </Typography>
                                  <Typography variant="caption" color="error.main" fontWeight={600}>
                                    -{course.discountPercentage}%
                                  </Typography>
                                </>
                              )}
                            </Stack>
                          </TableCell>
                          <TableCell>{course.totalStudents || 0}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Typography variant="body2">{course.averageRating?.toFixed(1) || 'N/A'}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                ⭐
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              <Chip
                                label={course.isApproved ? 'Đã duyệt' : 'Chờ duyệt'}
                                color={course.isApproved ? 'success' : 'warning'}
                                size="small"
                              />
                              <Chip
                                label={course.isPublished ? 'Đã xuất bản' : 'Chưa xuất bản'}
                                color={course.isPublished ? 'success' : 'error'}
                                size="small"
                              />
                              {course.isFeatured && (
                                <Chip
                                  label="Nổi bật"
                                  color="secondary"
                                  size="small"
                                />
                              )}
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <Tooltip title="Xem chi tiết">
                                <IconButton size="small" color="primary">
                                  <ViewIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Sửa danh mục">
                                <IconButton
                                  size="small"
                                  color="secondary"
                                  onClick={() => handleEditCourse(course)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  <TablePagination
                    component="div"
                    count={pagination.total}
                    page={pagination.page - 1}
                    onPageChange={handlePageChange}
                    rowsPerPage={pagination.limit}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    rowsPerPageOptions={[10, 20, 50, 100]}
                    labelRowsPerPage="Số hàng mỗi trang:"
                    labelDisplayedRows={({ from, to, count }) =>
                      `${from}-${to} của ${count !== -1 ? count : `nhiều hơn ${to}`}`
                    }
                  />
                </>
              ) : (
                <Box textAlign="center" py={4}>
                  <Typography variant="body2" color="text.secondary">
                    Không có khóa học nào
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Edit Course Category Dialog */}
          <Dialog open={showEditModal} onClose={() => setShowEditModal(false)} fullWidth maxWidth="sm">
            <DialogTitle>
              Sửa danh mục khóa học: {selectedCourse?.title}
            </DialogTitle>
            <DialogContent dividers>
              {selectedCourse && (
                <Stack spacing={2} sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Chọn danh mục mới cho khóa học này:
                  </Typography>
                  <FormControl fullWidth>
                    <InputLabel>Danh mục</InputLabel>
                    <Select
                      value={selectedCourse.domain || ''}
                      onChange={(e) => {
                        const domain = e.target.value;
                        handleUpdateCourseCategory(selectedCourse._id, domain);
                        setShowEditModal(false);
                      }}
                      label="Danh mục"
                    >
                      {analytics?.coursesByDomain?.map((domain) => (
                        <MenuItem key={domain._id} value={domain._id}>
                          {domain._id}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowEditModal(false)}>
                Đóng
              </Button>
            </DialogActions>
          </Dialog>

        </Box>
      )}

      {/* Category Management Tab */}
      {activeTab === 1 && (
        <Box>
          {/* Category Header */}
          <Card sx={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #5b8def 100%)', color: 'white', borderRadius: 2 }}>
            <CardContent>
              <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={2}>
                <Box>
                  <Typography variant="h5" fontWeight={800}>Quản lý danh mục</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Tạo, sửa, xóa và quản lý các danh mục khóa học</Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setCategoryForm({ name: '', description: '' });
                      setShowCreateCategoryDataModal(true);
                    }}
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
                    }}
                  >
                    Tạo danh mục
                  </Button>
                  {selectedCategories.length > 0 && (
                    <Button
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      onClick={handleBulkDeleteCategories}
                      sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
                    >
                      Xóa ({selectedCategories.length})
                    </Button>
                  )}
                  <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadCategories}>
                    Làm mới
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {/* Categories Table */}
          <Paper sx={{ borderRadius: 2 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={selectedCategories.length > 0 && selectedCategories.length < categories.length}
                        checked={categories.length > 0 && selectedCategories.length === categories.length}
                        onChange={handleSelectAllCategories}
                      />
                    </TableCell>
                    <TableCell>Tên danh mục</TableCell>
                    <TableCell>Mô tả</TableCell>
                    <TableCell>Số khóa học</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Ngày tạo</TableCell>
                    <TableCell align="center">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category._id} hover>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedCategories.includes(category._id)}
                          onChange={() => handleCategorySelection(category._id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {category.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {category.description || 'Không có mô tả'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={category.courseCount}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={category.isActive ? 'Hoạt động' : 'Không hoạt động'}
                          color={category.isActive ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {new Date(category.createdAt).toLocaleDateString('vi-VN')}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="Chuyển đổi trạng thái">
                            <IconButton
                              size="small"
                              onClick={() => handleToggleCategoryStatus(category._id)}
                            >
                              {category.isActive ? <ToggleOnIcon color="success" /> : <ToggleOffIcon color="disabled" />}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Sửa">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => {
                                setSelectedCategory(category);
                                setCategoryForm({
                                  name: category.name,
                                  description: category.description || ''
                                });
                                setShowEditCategoryModal(true);
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xóa">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteCategory(category._id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {categories.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                          Chưa có danh mục nào
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </Paper>

          {/* Create Category Dialog */}
          <Dialog open={showCreateCategoryDataModal} onClose={() => {
            setShowCreateCategoryDataModal(false);
            setCategoryForm({ name: '', description: '' });
          }} maxWidth="sm" fullWidth>
            <DialogTitle>Tạo danh mục mới</DialogTitle>
            <DialogContent>
              <Stack spacing={2} sx={{ mt: 1 }}>
                <TextField
                  fullWidth
                  label="Tên danh mục"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nhập tên danh mục..."
                  required
                />
                <TextField
                  fullWidth
                  label="Mô tả"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Nhập mô tả danh mục..."
                  multiline
                  rows={3}
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => {
                setShowCreateCategoryDataModal(false);
                setCategoryForm({ name: '', description: '' });
              }}>
                Hủy
              </Button>
              <Button onClick={handleCreateCategoryData} variant="contained" color="primary">
                Tạo danh mục
              </Button>
            </DialogActions>
          </Dialog>

          {/* Edit Category Dialog */}
          <Dialog open={showEditCategoryModal} onClose={() => {
            setShowEditCategoryModal(false);
            setCategoryForm({ name: '', description: '' });
            setSelectedCategory(null);
          }} maxWidth="sm" fullWidth>
            <DialogTitle>Sửa danh mục</DialogTitle>
            <DialogContent>
              <Stack spacing={2} sx={{ mt: 1 }}>
                <TextField
                  fullWidth
                  label="Tên danh mục"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nhập tên danh mục..."
                  required
                />
                <TextField
                  fullWidth
                  label="Mô tả"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Nhập mô tả danh mục..."
                  multiline
                  rows={3}
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => {
                setShowEditCategoryModal(false);
                setCategoryForm({ name: '', description: '' });
                setSelectedCategory(null);
              }}>
                Hủy
              </Button>
              <Button onClick={handleUpdateCategory} variant="contained" color="primary">
                Cập nhật
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CategoryManagement;
