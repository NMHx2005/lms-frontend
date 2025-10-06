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
  TableSortLabel,
  Alert,
  Snackbar,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Menu,
  ListItemIcon,
  ListItemText,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Switch,
  Autocomplete
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PublishIcon from '@mui/icons-material/Publish';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import StarIcon from '@mui/icons-material/Star';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import SchoolIcon from '@mui/icons-material/School';
import CategoryIcon from '@mui/icons-material/Category';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LanguageIcon from '@mui/icons-material/Language';
import courseService, { Course, CourseFilters, CourseStats, BulkStatusUpdate } from '../../../services/admin/courseService';

interface LocalCourseFilters {
  search: string;
  status: string;
  category: string;
  level: string;
  featured: string;
  instructor: string;
  priceRange: [number, number];
  ratingRange: [number, number];
  dateRange: {
    start: string;
    end: string;
  };
  tags: string[];
}

interface AdvancedFilters {
  showAdvanced: boolean;
  priceRange: [number, number];
  ratingRange: [number, number];
  dateRange: {
    start: string;
    end: string;
  };
  tags: string[];
  hasDiscount: boolean;
  hasCertificate: boolean;
  language: string;
}


const CourseDirectory: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [stats, setStats] = useState<CourseStats | null>(null);
  const [filters, setFilters] = useState<LocalCourseFilters>({
    search: '',
    status: 'all',
    category: 'all',
    level: 'all',
    featured: 'all',
    instructor: '',
    priceRange: [0, 10000000],
    ratingRange: [0, 5],
    dateRange: {
      start: '',
      end: ''
    },
    tags: []
  });
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
    showAdvanced: false,
    priceRange: [0, 10000000],
    ratingRange: [0, 5],
    dateRange: {
      start: '',
      end: ''
    },
    tags: [],
    hasDiscount: false,
    hasCertificate: false,
    language: 'all'
  });
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' | 'warning' }>({
    open: false,
    message: '',
    severity: 'info'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // CRUD states (commented out for admin permissions)
  // const [showCourseForm, setShowCourseForm] = useState(false);
  // const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  // const [courseFormData, setCourseFormData] = useState<CourseFormData>({
  //   title: '',
  //   description: '',
  //   shortDescription: '',
  //   domain: 'IT',
  //   level: 'beginner',
  //   price: 0,
  //   originalPrice: 0,
  //   tags: [],
  //   prerequisites: [],
  //   benefits: [],
  //   language: 'vi',
  //   certificate: false
  // });

  // Dialog states
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; courseId: string | null }>({
    open: false,
    courseId: null
  });
  const [viewCourseDialog, setViewCourseDialog] = useState(false);
  const [viewingCourse, setViewingCourse] = useState<Course | null>(null);

  // Menu states
  const [courseMenuAnchor, setCourseMenuAnchor] = useState<{ [key: string]: HTMLElement | null }>({});
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<HTMLElement | null>(null);

  // Export states
  const [exporting, setExporting] = useState(false);

  // Load courses and stats
  const loadCourses = async (showNotification = true) => {
    try {
      if (showNotification) {
        setLoading(true);
      } else {
        setTableLoading(true);
      }

      // Map frontend sortBy to backend sortBy
      const getBackendSortBy = (frontendSortBy: string) => {
        const sortMapping: { [key: string]: string } = {
          'enrollmentCount': 'totalStudents',
          'rating': 'averageRating',
          'revenue': 'totalRevenue',
          'duration': 'totalDuration',
          'lessons': 'totalLessons'
        };
        return sortMapping[frontendSortBy] || frontendSortBy;
      };

      const apiFilters: CourseFilters = {
        search: filters.search || undefined,
        status: filters.status === 'all' ? undefined : filters.status,
        domain: filters.category === 'all' ? undefined : filters.category, // Map category filter to domain
        level: filters.level === 'all' ? undefined : filters.level,
        featured: filters.featured === 'all' ? undefined : filters.featured === 'true',
        instructor: filters.instructor || undefined,
        page: pagination.page,
        limit: pagination.limit,
        sortBy: getBackendSortBy(sortBy),
        sortOrder: sortOrder
      };

      console.log('🚀 Loading courses with API filters:', apiFilters);

      const [coursesResponse, statsResponse] = await Promise.all([
        courseService.getCourses(apiFilters),
        courseService.getCourseStats()
      ]);

      console.log('✅ Courses loaded:', coursesResponse);
      console.log('✅ Stats loaded:', statsResponse);

      // Handle different response structures
      const coursesData = coursesResponse?.data?.courses || coursesResponse?.courses || coursesResponse || [];
      const statsData = statsResponse?.data || statsResponse || {};

      setCourses(Array.isArray(coursesData) ? coursesData : []);
      setStats(statsData);

      // Handle pagination
      if (coursesResponse?.data?.pagination) {
        setPagination(prev => ({
          ...prev,
          total: coursesResponse.data.pagination.total,
          totalPages: coursesResponse.data.pagination.totalPages
        }));
      } else if (coursesResponse?.data?.total) {
        setPagination(prev => ({
          ...prev,
          total: coursesResponse.data.total,
          totalPages: coursesResponse.data.totalPages || Math.ceil(coursesResponse.data.total / pagination.limit)
        }));
      } else if (coursesResponse?.total) {
        setPagination(prev => ({
          ...prev,
          total: coursesResponse.total,
          totalPages: Math.ceil(coursesResponse.total / pagination.limit)
        }));
      }

      if (showNotification) {
        showSnackbar('Tải dữ liệu thành công', 'success');
      }
    } catch (error: any) {
      console.error('❌ Error loading courses:', error);
      console.error('❌ Error details:', error.response?.data || error.message);

      const errorMessage = error.response?.data?.message ||
        error.message ||
        'Lỗi khi tải danh sách khóa học';

      if (showNotification) {
        showSnackbar(errorMessage, 'error');
      }

      // Set empty data on error
      setCourses([]);
      setStats(null);
    } finally {
      setLoading(false);
      setTableLoading(false);
    }
  };

  useEffect(() => {
    loadCourses(false); // Load data without notification on filter/sort changes
  }, [filters, pagination.page, sortBy, sortOrder]);

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  // CRUD Functions (commented out for admin permissions)
  // const handleCreateCourse = () => {
  //   setEditingCourse(null);
  //   setCourseFormData({
  //     title: '',
  //     description: '',
  //     shortDescription: '',
  //     domain: 'IT',
  //     level: 'beginner',
  //     price: 0,
  //     originalPrice: 0,
  //     tags: [],
  //     prerequisites: [],
  //     benefits: [],
  //     language: 'vi',
  //     certificate: false
  //   });
  //   setShowCourseForm(true);
  // };

  // const handleEditCourse = (course: Course) => {
  //   setEditingCourse(course);
  //   setCourseFormData({
  //     title: course.title,
  //     description: course.description || '',
  //     shortDescription: course.shortDescription || '',
  //     domain: course.domain,
  //     level: course.level,
  //     price: course.price,
  //     originalPrice: course.originalPrice || 0,
  //     tags: course.tags || [],
  //     prerequisites: course.prerequisites || [],
  //     benefits: course.benefits || [],
  //     language: course.language || 'vi',
  //     certificate: course.certificate || false
  //   });
  //   setShowCourseForm(true);
  // };

  // const handleSaveCourse = async () => {
  //   try {
  //     if (editingCourse) {
  //       // Update existing course
  //       await courseService.updateCourse(editingCourse._id, courseFormData as Partial<Course>);
  //       showSnackbar('Cập nhật khóa học thành công', 'success');
  //     } else {
  //       // Create new course
  //       await courseService.createCourse(courseFormData as Partial<Course>);
  //       showSnackbar('Tạo khóa học thành công', 'success');
  //     }
  //     setShowCourseForm(false);
  //     loadCourses(false); // Reload data without notification
  //   } catch (error) {
  //     console.error('Error saving course:', error);
  //     showSnackbar('Lỗi khi lưu khóa học', 'error');
  //   }
  // };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await courseService.deleteCourse(courseId);
      showSnackbar('Xóa khóa học thành công', 'success');
      setDeleteDialog({ open: false, courseId: null });
      loadCourses(false); // Reload data without notification
    } catch (error: any) {
      console.error('Error deleting course:', error);

      // Extract error message from API response
      let errorMessage = 'Lỗi khi xóa khóa học';

      if (error?.response?.data?.error) {
        const apiError = error.response.data.error;

        // Handle specific error messages
        if (apiError.includes('existing enrollments')) {
          errorMessage = 'Không thể xóa khóa học đã có học viên đăng ký. Vui lòng hoàn trả học phí cho tất cả học viên trước khi xóa.';
        } else if (apiError.includes('published')) {
          errorMessage = 'Không thể xóa khóa học đã được xuất bản. Vui lòng chuyển về trạng thái nháp trước khi xóa.';
        } else if (apiError.includes('not found')) {
          errorMessage = 'Khóa học không tồn tại hoặc đã bị xóa.';
        } else if (apiError.includes('permission')) {
          errorMessage = 'Bạn không có quyền xóa khóa học này.';
        } else {
          errorMessage = `Lỗi: ${apiError}`;
        }
      } else if (error?.message) {
        errorMessage = `Lỗi: ${error.message}`;
      }

      showSnackbar(errorMessage, 'error');
    }
  };

  const handleViewCourse = async (courseId: string) => {
    try {
      const response = await courseService.getCourseById(courseId);
      console.log('🔍 Course API response:', response);

      // Handle different response structures
      const courseData = response?.data || response;
      console.log('🔍 Course data extracted:', courseData);

      // Ensure we have the course object, not instructor or other nested objects
      if (courseData && typeof courseData === 'object') {
        // If courseData has instructor as an object, extract the course info
        if (courseData.instructor && typeof courseData.instructor === 'object') {
          console.log('🔍 Instructor object found:', courseData.instructor);
          // Extract instructor name from the instructor object
          courseData.instructorName = courseData.instructor.name || courseData.instructor.fullName || courseData.instructorName;
          courseData.instructorId = courseData.instructor._id || courseData.instructor.id || courseData.instructorId;
        }

        // Ensure all nested objects are properly handled and converted to safe values
        const processedCourse = {
          ...courseData,
          // Ensure instructor is not rendered as object
          instructor: courseData.instructor ? {
            _id: String(courseData.instructor._id || courseData.instructor.id || ''),
            name: String(courseData.instructor.name || courseData.instructor.fullName || ''),
            email: String(courseData.instructor.email || ''),
            fullName: String(courseData.instructor.fullName || ''),
            subscriptionStatus: String(courseData.instructor.subscriptionStatus || ''),
            isPremium: Boolean(courseData.instructor.isPremium)
          } : null,
          // Ensure all other fields are properly converted
          title: String(courseData.title || ''),
          description: String(courseData.description || ''),
          shortDescription: String(courseData.shortDescription || ''),
          domain: String(courseData.domain || ''),
          level: String(courseData.level || ''),
          instructorName: String(courseData.instructorName || courseData.instructor?.name || courseData.instructor?.fullName || ''),
          // Keep instructorId as object if it's populated, otherwise convert to string
          instructorId: courseData.instructorId && typeof courseData.instructorId === 'object'
            ? courseData.instructorId
            : String(courseData.instructorId || courseData.instructor?._id || courseData.instructor?.id || ''),
          language: String(courseData.language || ''),
          tags: Array.isArray(courseData.tags) ? courseData.tags.map((tag: any) => String(tag)) : [],
          prerequisites: Array.isArray(courseData.prerequisites) ? courseData.prerequisites.map((prereq: any) => String(prereq)) : [],
          benefits: Array.isArray(courseData.benefits) ? courseData.benefits.map((benefit: any) => String(benefit)) : []
        };

        console.log('🔍 Final processed course data:', processedCourse);
        setViewingCourse(processedCourse);
        setViewCourseDialog(true);
      } else {
        throw new Error('Invalid course data structure');
      }
    } catch (error) {
      console.error('Error viewing course:', error);
      showSnackbar('Lỗi khi tải chi tiết khóa học', 'error');
    }
  };

  // Export Functions
  const handleExportExcel = async () => {
    try {
      setExporting(true);
      const exportFilters: CourseFilters = {
        search: filters.search || undefined,
        status: filters.status === 'all' ? undefined : filters.status,
        domain: filters.category === 'all' ? undefined : filters.category,
        level: filters.level === 'all' ? undefined : filters.level,
        featured: filters.featured === 'all' ? undefined : filters.featured === 'true',
        instructor: filters.instructor || undefined,
        page: 1,
        limit: 10000
      };
      const response = await courseService.exportCourses(exportFilters);

      // Create download link
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `courses_export_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showSnackbar('Xuất Excel thành công', 'success');
    } catch (error) {
      console.error('Error exporting Excel:', error);
      showSnackbar('Lỗi khi xuất Excel', 'error');
    } finally {
      setExporting(false);
    }
  };

  // Advanced Filter Functions
  const handleAdvancedFilterChange = (newFilters: Partial<AdvancedFilters>) => {
    setAdvancedFilters(prev => ({ ...prev, ...newFilters }));
  };

  const applyAdvancedFilters = () => {
    setFilters(prev => ({
      ...prev,
      priceRange: advancedFilters.priceRange,
      ratingRange: advancedFilters.ratingRange,
      dateRange: advancedFilters.dateRange,
      tags: advancedFilters.tags
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
    setFilterMenuAnchor(null);
  };

  const clearAllFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      category: 'all',
      level: 'all',
      featured: 'all',
      instructor: '',
      priceRange: [0, 10000000],
      ratingRange: [0, 5],
      dateRange: { start: '', end: '' },
      tags: []
    });
    setAdvancedFilters({
      showAdvanced: false,
      priceRange: [0, 10000000],
      ratingRange: [0, 5],
      dateRange: { start: '', end: '' },
      tags: [],
      hasDiscount: false,
      hasCertificate: false,
      language: 'all'
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Menu Functions
  const handleCourseMenuOpen = (event: React.MouseEvent<HTMLElement>, courseId: string) => {
    setCourseMenuAnchor(prev => ({ ...prev, [courseId]: event.currentTarget }));
  };

  const handleCourseMenuClose = (courseId: string) => {
    setCourseMenuAnchor(prev => ({ ...prev, [courseId]: null }));
  };

  const handleFilterMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterMenuAnchor(null);
  };

  // Remove local filtering since we're using server-side filtering

  const handleFilterChange = (newFilters: Partial<LocalCourseFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page when filtering
  };

  const handleCourseSelection = (courseId: string) => {
    setSelectedCourses(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCourses.length === courses.length) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(courses.map(course => course._id));
    }
  };

  const handleBulkAction = async (action: 'publish' | 'suspend' | 'archive' | 'feature' | 'unfeature') => {
    if (selectedCourses.length === 0) return;

    const actionText = {
      publish: 'kích hoạt',
      suspend: 'vô hiệu hóa',
      archive: 'lưu trữ',
      feature: 'đánh dấu nổi bật',
      unfeature: 'bỏ đánh dấu nổi bật'
    }[action];

    if (confirm(`Bạn có chắc chắn muốn ${actionText} ${selectedCourses.length} khóa học đã chọn?`)) {
      try {
        let status = '';
        switch (action) {
          case 'publish':
            // Handle publish separately using updateCourseStatus
            for (const courseId of selectedCourses) {
              await courseService.updateCourseStatus(courseId, { isPublished: true });
            }
            showSnackbar(`Đã ${actionText} ${selectedCourses.length} khóa học thành công`, 'success');
            setSelectedCourses([]);
            loadCourses(false); // Reload data without notification
            return;
          case 'suspend':
            // Handle suspend separately using updateCourseStatus
            for (const courseId of selectedCourses) {
              await courseService.updateCourseStatus(courseId, { isPublished: false });
            }
            showSnackbar(`Đã ${actionText} ${selectedCourses.length} khóa học thành công`, 'success');
            setSelectedCourses([]);
            loadCourses(false); // Reload data without notification
            return;
          case 'archive':
            status = 'archived';
            break;
          case 'feature':
            // Handle feature/unfeature separately
            for (const courseId of selectedCourses) {
              await courseService.toggleCourseFeature(courseId, true);
            }
            showSnackbar(`Đã ${actionText} ${selectedCourses.length} khóa học thành công`, 'success');
            setSelectedCourses([]);
            loadCourses(false); // Reload data without notification
            return;
          case 'unfeature':
            // Handle feature/unfeature separately
            for (const courseId of selectedCourses) {
              await courseService.toggleCourseFeature(courseId, false);
            }
            showSnackbar(`Đã ${actionText} ${selectedCourses.length} khóa học thành công`, 'success');
            setSelectedCourses([]);
            loadCourses(false); // Reload data without notification
            return;
        }

        if (status) {
          const updateData: BulkStatusUpdate = {
            courseIds: selectedCourses,
            status,
            comment: `Bulk ${actionText} by admin`
          };

          await courseService.bulkUpdateCourseStatus(updateData);
          showSnackbar(`Đã ${actionText} ${selectedCourses.length} khóa học thành công`, 'success');
          setSelectedCourses([]);
          loadCourses(false); // Reload data without notification
        }
      } catch (error) {
        console.error('Error updating course status:', error);
        showSnackbar(`Lỗi khi ${actionText} khóa học`, 'error');
      }
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

  const getCourseStatus = (course: Course) => {
    if (course.isPublished) return 'published';
    return 'draft';
  };

  const getStatusLabel = (course: Course) => {
    const status = getCourseStatus(course);
    const labels = {
      draft: 'Bản nháp',
      published: 'Đã xuất bản',
      archived: 'Đã lưu trữ'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusColor = (course: Course) => {
    const status = getCourseStatus(course);
    const colors = {
      draft: 'default',
      published: 'success',
      archived: 'info'
    };
    return colors[status as keyof typeof colors] || 'default';
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

  // Helper function to get instructor info safely
  const getInstructorInfo = (course: Course) => {
    const instructorId = (course as any).instructorId;
    console.log('🔍 getInstructorInfo - instructorId:', instructorId);
    console.log('🔍 getInstructorInfo - typeof instructorId:', typeof instructorId);

    // If instructorId is an object (populated)
    if (instructorId && typeof instructorId === 'object' && !Array.isArray(instructorId)) {
      console.log('🔍 Using populated instructorId object');
      const result = {
        name: instructorId.fullName || instructorId.name || 'N/A',
        id: instructorId._id || instructorId.id || 'N/A',
        email: instructorId.email || null,
        subscriptionStatus: instructorId.subscriptionStatus || null,
        isPremium: instructorId.isPremium || false
      };
      console.log('🔍 Instructor result:', result);
      return result;
    }

    // If instructorId is a string (not populated)
    console.log('🔍 Using fallback instructor info');
    const result = {
      name: course.instructorName || 'N/A',
      id: instructorId || 'N/A',
      email: null,
      subscriptionStatus: null,
      isPremium: false
    };
    console.log('🔍 Fallback result:', result);
    return result;
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
      {/* Global CSS to prevent body padding when dialog opens */}
      <style>
        {`
          body.MuiDialog-scrollPaper {
            padding-right: 0 !important;
            overflow: visible !important;
          }
          .MuiDialog-root {
            z-index: 1300;
          }
        `}
      </style>
      {/* Header */}
      <Card sx={{ background: 'linear-gradient(135deg, #5b8def 0%, #8b5cf6 100%)', color: 'white', borderRadius: 2 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={2}>
            <Box>
              <Typography variant="h5" fontWeight={800}>Quản lý khóa học</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Quản lý tất cả khóa học trong hệ thống</Typography>
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
                startIcon={<FilterListIcon />}
                sx={{ color: '#111827' }}
                onClick={handleFilterMenuOpen}
              >
                Bộ lọc
              </Button>
              <Button
                variant="contained"
                color="inherit"
                startIcon={exporting ? <CircularProgress size={16} /> : <CloudDownloadIcon />}
                sx={{ color: '#111827' }}
                onClick={handleExportExcel}
                disabled={exporting}
              >
                {exporting ? 'Đang xuất...' : 'Xuất Excel'}
              </Button>
              {/* Admin chỉ có quyền xem, không có quyền tạo mới */}
              {/* <Button
                variant="contained"
                color="secondary"
                startIcon={<AddIcon />}
                onClick={handleCreateCourse}
              >
                Thêm khóa học
              </Button> */}
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
                <Typography variant="h6" fontWeight={700}>{formatNumber(stats?.totalCourses || courses.length)}</Typography>
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
                <Typography variant="h6" fontWeight={700}>{formatNumber(stats?.publishedCourses || courses.filter(c => c.isPublished).length)}</Typography>
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
                <Typography variant="h6" fontWeight={700}>{formatNumber(courses.filter(c => c.isFeatured).length)}</Typography>
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
                <Typography variant="h6" fontWeight={700}>{formatCurrency(stats?.totalRevenue || courses.reduce((sum, c) => sum + (c.price * c.totalStudents), 0))}</Typography>
                <Typography variant="body2" color="text.secondary">Tổng doanh thu</Typography>
              </Box>
            </Stack>
          </CardContent></Card>
        </Grid>
      </Grid>

      {/* Advanced Filters */}
      <Accordion expanded={advancedFilters.showAdvanced} onChange={() => setAdvancedFilters(prev => ({ ...prev, showAdvanced: !prev.showAdvanced }))}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Stack direction="row" spacing={1} alignItems="center">
            <FilterListIcon />
            <Typography variant="h6">Bộ lọc nâng cao</Typography>
            {(filters.priceRange[0] > 0 || filters.priceRange[1] < 10000000 ||
              filters.ratingRange[0] > 0 || filters.ratingRange[1] < 5 ||
              filters.dateRange.start || filters.dateRange.end ||
              filters.tags.length > 0) && (
                <Chip size="small" color="primary" label="Đang áp dụng" />
              )}
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>Khoảng giá (VNĐ)</Typography>
              <Slider
                value={advancedFilters.priceRange}
                onChange={(_, newValue) => handleAdvancedFilterChange({ priceRange: newValue as [number, number] })}
                valueLabelDisplay="auto"
                min={0}
                max={10000000}
                step={100000}
                valueLabelFormat={(value) => formatCurrency(value)}
              />
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2">{formatCurrency(advancedFilters.priceRange[0])}</Typography>
                <Typography variant="body2">{formatCurrency(advancedFilters.priceRange[1])}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>Đánh giá</Typography>
              <Slider
                value={advancedFilters.ratingRange}
                onChange={(_, newValue) => handleAdvancedFilterChange({ ratingRange: newValue as [number, number] })}
                valueLabelDisplay="auto"
                min={0}
                max={5}
                step={0.1}
                valueLabelFormat={(value) => `${value} ⭐`}
              />
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2">{advancedFilters.ratingRange[0]} ⭐</Typography>
                <Typography variant="body2">{advancedFilters.ratingRange[1]} ⭐</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>Ngày tạo</Typography>
              <Stack direction="row" spacing={1}>
                <TextField
                  type="date"
                  label="Từ ngày"
                  value={advancedFilters.dateRange.start}
                  onChange={(e) => handleAdvancedFilterChange({
                    dateRange: { ...advancedFilters.dateRange, start: e.target.value }
                  })}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  type="date"
                  label="Đến ngày"
                  value={advancedFilters.dateRange.end}
                  onChange={(e) => handleAdvancedFilterChange({
                    dateRange: { ...advancedFilters.dateRange, end: e.target.value }
                  })}
                  InputLabelProps={{ shrink: true }}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>Tags</Typography>
              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={advancedFilters.tags}
                onChange={(_, newValue) => handleAdvancedFilterChange({ tags: newValue })}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Nhập tags..."
                    variant="outlined"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={advancedFilters.hasDiscount}
                      onChange={(e) => handleAdvancedFilterChange({ hasDiscount: e.target.checked })}
                    />
                  }
                  label="Có giảm giá"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={advancedFilters.hasCertificate}
                      onChange={(e) => handleAdvancedFilterChange({ hasCertificate: e.target.checked })}
                    />
                  }
                  label="Có chứng chỉ"
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Ngôn ngữ</InputLabel>
                <Select
                  value={advancedFilters.language}
                  onChange={(e) => handleAdvancedFilterChange({ language: e.target.value })}
                  label="Ngôn ngữ"
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="vi">Tiếng Việt</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Button onClick={clearAllFilters} startIcon={<CloseIcon />}>
                  Xóa tất cả
                </Button>
                <Button variant="contained" onClick={applyAdvancedFilters} startIcon={<FilterListIcon />}>
                  Áp dụng bộ lọc
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Basic Filters & Controls */}
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
                <MenuItem value="draft">Bản nháp</MenuItem>
                <MenuItem value="published">Đã xuất bản</MenuItem>
                <MenuItem value="archived">Đã lưu trữ</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Lĩnh vực</InputLabel>
              <Select label="Lĩnh vực" value={filters.category} onChange={(e) => handleFilterChange({ category: e.target.value })} MenuProps={{ disableScrollLock: true }}>
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="IT">IT</MenuItem>
                <MenuItem value="Design">Design</MenuItem>
                <MenuItem value="Science">Science</MenuItem>
                <MenuItem value="Business">Business</MenuItem>
                <MenuItem value="Marketing">Marketing</MenuItem>
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
              <MenuItem value="enrollmentCount-asc">Ít học viên nhất</MenuItem>
              <MenuItem value="rating-desc">Đánh giá cao nhất</MenuItem>
              <MenuItem value="rating-asc">Đánh giá thấp nhất</MenuItem>
              <MenuItem value="price-desc">Giá cao nhất</MenuItem>
              <MenuItem value="price-asc">Giá thấp nhất</MenuItem>
              <MenuItem value="revenue-desc">Doanh thu cao nhất</MenuItem>
              <MenuItem value="revenue-asc">Doanh thu thấp nhất</MenuItem>
              <MenuItem value="duration-desc">Thời lượng dài nhất</MenuItem>
              <MenuItem value="duration-asc">Thời lượng ngắn nhất</MenuItem>
              <MenuItem value="lessons-desc">Nhiều bài học nhất</MenuItem>
              <MenuItem value="lessons-asc">Ít bài học nhất</MenuItem>
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
              <Button variant="contained" color="success" onClick={() => handleBulkAction('publish')}>Kích hoạt ({selectedCourses.length})</Button>
              <Button variant="outlined" color="warning" onClick={() => handleBulkAction('suspend')}>Vô hiệu hóa ({selectedCourses.length})</Button>
              <Button variant="outlined" onClick={() => handleBulkAction('archive')}>Lưu trữ ({selectedCourses.length})</Button>
              <Button variant="outlined" startIcon={<StarIcon />} onClick={() => handleBulkAction('feature')}>Nổi bật</Button>
              <Button variant="outlined" onClick={() => handleBulkAction('unfeature')}>Bỏ nổi bật</Button>
            </Stack>
          </Stack>
        </Paper>
      )}

      {viewMode === 'table' ? (
        <TableContainer component={Paper} sx={{ borderRadius: 2, position: 'relative' }}>
          {tableLoading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1,
                borderRadius: 2
              }}
            >
              <Stack spacing={2} alignItems="center">
                <CircularProgress size={40} />
                <Typography variant="body2" color="text.secondary">
                  Đang tải dữ liệu...
                </Typography>
              </Stack>
            </Box>
          )}
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCourses.length === courses.length && courses.length > 0}
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
              {courses.map((course) => (
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
                        {course.isFeatured && (<Chip size="small" color="warning" icon={<StarIcon />} label="Nổi bật" />)}
                      </Stack>
                      <Stack direction="row" spacing={1}>
                        <Chip size="small" label={getLevelLabel(course.level)} />
                        <Chip size="small" label={`${course.totalDuration || 0}h`} />
                        <Chip size="small" label={`${course.totalLessons || 0} bài`} />
                      </Stack>
                      <Stack direction="row" spacing={1}>
                        {course.tags.slice(0, 3).map((tag, idx) => (<Chip key={idx} size="small" variant="outlined" label={tag} />))}
                        {course.tags.length > 3 && (<Chip size="small" label={`+${course.tags.length - 3}`} />)}
                      </Stack>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ py: 1.25 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar alt={course.instructorName || course.instructor?.name || 'N/A'} />
                      <Box>
                        <Typography>{String(course.instructorName || course.instructor?.name || (course.instructor as any)?.fullName || 'N/A')}</Typography>
                        <Typography variant="body2" color="text.secondary">ID: {String(course.instructorId || course.instructor?._id || 'N/A')}</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ py: 1.25 }}>
                    <Typography>{String(course.domain || '')}</Typography>
                    <Typography variant="body2" color="text.secondary">{String(course.level || '')}</Typography>
                  </TableCell>
                  <TableCell sx={{ py: 1.25 }}>
                    <Chip
                      label={getStatusLabel(course)}
                      color={getStatusColor(course) as any}
                      variant={getCourseStatus(course) === 'draft' ? 'outlined' : 'filled'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ py: 1.25 }}>
                    <Typography fontWeight={700}>{formatNumber(course.totalStudents || 0)}</Typography>
                    <Typography variant="body2" color="text.secondary">Cuối: {course.updatedAt ? formatDate(course.updatedAt) : 'N/A'}</Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ py: 1.25 }}>
                    <Typography fontWeight={700}>⭐ {course.averageRating?.toFixed(1) || '0.0'}</Typography>
                    <Typography variant="body2" color="text.secondary">({formatNumber(course.totalStudents || 0)} học viên)</Typography>
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
                    <Typography fontWeight={700}>{formatCurrency(course.price * (course.totalStudents || 0))}</Typography>
                  </TableCell>
                  <TableCell align="center" sx={{ py: 1.25 }}>
                    <Stack direction="row" spacing={0.5} justifyContent="center">
                      <Tooltip title="Xem chi tiết">
                        <IconButton size="small" onClick={() => handleViewCourse(course._id)}>
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      {/* Admin không có quyền chỉnh sửa nội dung */}
                      {/* <Tooltip title="Chỉnh sửa">
                        <IconButton size="small" color="primary" onClick={() => handleEditCourse(course)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip> */}
                      <Tooltip title="Thêm tùy chọn">
                        <IconButton
                          size="small"
                          onClick={(e) => handleCourseMenuOpen(e, course._id)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>

                    {/* Course Action Menu */}
                    <Menu
                      anchorEl={courseMenuAnchor[course._id]}
                      open={Boolean(courseMenuAnchor[course._id])}
                      onClose={() => handleCourseMenuClose(course._id)}
                    >
                      <MenuItem onClick={() => {
                        handleCourseMenuClose(course._id);
                        handleViewCourse(course._id);
                      }}>
                        <ListItemIcon><VisibilityIcon fontSize="small" /></ListItemIcon>
                        <ListItemText>Xem chi tiết</ListItemText>
                      </MenuItem>
                      {/* Admin không có quyền chỉnh sửa nội dung */}
                      {/* <MenuItem onClick={() => {
                        handleCourseMenuClose(course._id);
                        handleEditCourse(course);
                      }}>
                        <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
                        <ListItemText>Chỉnh sửa</ListItemText>
                      </MenuItem> */}
                      <MenuItem onClick={async () => {
                        handleCourseMenuClose(course._id);
                        try {
                          if (course.isPublished) {
                            // Sử dụng updateCourseStatus để set isPublished = false
                            await courseService.updateCourseStatus(course._id, { isPublished: false });
                            showSnackbar('Vô hiệu hóa khóa học thành công', 'success');
                          } else {
                            // Sử dụng updateCourseStatus để set isPublished = true
                            await courseService.updateCourseStatus(course._id, { isPublished: true });
                            showSnackbar('Kích hoạt khóa học thành công', 'success');
                          }
                          loadCourses(false);
                        } catch (error) {
                          console.error('Error toggling course status:', error);
                          showSnackbar('Lỗi khi thay đổi trạng thái khóa học', 'error');
                        }
                      }}>
                        <ListItemIcon>
                          {course.isPublished ? <PauseCircleOutlineIcon fontSize="small" /> : <PublishIcon fontSize="small" />}
                        </ListItemIcon>
                        <ListItemText>
                          {course.isPublished ? 'Vô hiệu hóa' : 'Kích hoạt'}
                        </ListItemText>
                      </MenuItem>
                      <MenuItem onClick={async () => {
                        handleCourseMenuClose(course._id);
                        try {
                          await courseService.toggleCourseFeature(course._id, !course.isFeatured);
                          showSnackbar(
                            course.isFeatured ? 'Bỏ nổi bật khóa học thành công' : 'Đánh dấu nổi bật khóa học thành công',
                            'success'
                          );
                          loadCourses(false);
                        } catch (error) {
                          console.error('Error toggling course feature:', error);
                          showSnackbar('Lỗi khi thay đổi trạng thái nổi bật', 'error');
                        }
                      }}>
                        <ListItemIcon><StarIcon fontSize="small" /></ListItemIcon>
                        <ListItemText>
                          {course.isFeatured ? 'Bỏ nổi bật' : 'Đánh dấu nổi bật'}
                        </ListItemText>
                      </MenuItem>
                      <Divider />
                      {/* Only show delete button if course has no enrolled students */}
                      {course.totalStudents === 0 && (
                        <MenuItem onClick={() => {
                          handleCourseMenuClose(course._id);
                          setDeleteDialog({ open: true, courseId: course._id });
                        }}>
                          <ListItemIcon><DeleteOutlineIcon fontSize="small" color="error" /></ListItemIcon>
                          <ListItemText sx={{ color: 'error.main' }}>Xóa</ListItemText>
                        </MenuItem>
                      )}
                    </Menu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box sx={{ position: 'relative' }}>
          {tableLoading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1,
                borderRadius: 2
              }}
            >
              <Stack spacing={2} alignItems="center">
                <CircularProgress size={40} />
                <Typography variant="body2" color="text.secondary">
                  Đang tải dữ liệu...
                </Typography>
              </Stack>
            </Box>
          )}
          <Grid container spacing={2}>
            {courses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course._id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Checkbox checked={selectedCourses.includes(course._id)} onChange={() => handleCourseSelection(course._id)} />
                      <Chip
                        label={getStatusLabel(course)}
                        color={getStatusColor(course) as any}
                        size="small"
                      />
                    </Stack>
                    <Typography variant="h6" fontWeight={800} mt={1}>
                      {course.title} {course.isFeatured && <Chip size="small" color="warning" icon={<StarIcon />} label="Nổi bật" sx={{ ml: 1 }} />}
                    </Typography>
                    <Stack direction="row" spacing={1.5} alignItems="center" mt={1}>
                      <Avatar alt={course.instructorName || course.instructor?.name || 'N/A'} />
                      <Typography>{String(course.instructorName || course.instructor?.name || (course.instructor as any)?.fullName || 'N/A')}</Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      {String(course.domain || '')} • {String(course.level || '')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                      {getLevelLabel(course.level)} • {course.totalDuration || 0}h • {course.totalLessons || 0} bài
                    </Typography>
                    <Stack direction="row" spacing={1} mt={1}>
                      {course.tags.slice(0, 3).map((tag, idx) => (<Chip key={idx} size="small" variant="outlined" label={tag} />))}
                    </Stack>
                    <Divider sx={{ my: 1.5 }} />
                    <Grid container>
                      <Grid item xs={6}><Typography variant="body2" color="text.secondary">Học viên</Typography><Typography fontWeight={700}>{formatNumber(course.totalStudents || 0)}</Typography></Grid>
                      <Grid item xs={6}><Typography variant="body2" color="text.secondary">Đánh giá</Typography><Typography fontWeight={700}>⭐ {course.averageRating?.toFixed(1) || '0.0'}</Typography></Grid>
                      <Grid item xs={6} mt={1}><Typography variant="body2" color="text.secondary">Giá</Typography><Typography fontWeight={700}>{formatCurrency(course.price)}</Typography></Grid>
                      <Grid item xs={6} mt={1}><Typography variant="body2" color="text.secondary">Doanh thu</Typography><Typography fontWeight={700}>{formatCurrency(course.price * (course.totalStudents || 0))}</Typography></Grid>
                    </Grid>
                    <Stack direction="row" spacing={1} mt={1.5}>
                      <Button
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewCourse(course._id)}
                      >
                        Xem
                      </Button>
                      {/* Admin không có quyền chỉnh sửa nội dung */}
                      {/* <Button 
                        size="small" 
                        startIcon={<EditIcon />} 
                        color="primary"
                        onClick={() => handleEditCourse(course)}
                      >
                        Sửa
                      </Button> */}
                      {course.isPublished ? (
                        <Button
                          size="small"
                          startIcon={<PauseCircleOutlineIcon />}
                          color="warning"
                          onClick={async () => {
                            try {
                              await courseService.updateCourseStatus(course._id, { isPublished: false });
                              showSnackbar('Vô hiệu hóa khóa học thành công', 'success');
                              loadCourses(false);
                            } catch (error) {
                              console.error('Error disabling course:', error);
                              showSnackbar('Lỗi khi vô hiệu hóa khóa học', 'error');
                            }
                          }}
                        >
                          Vô hiệu hóa
                        </Button>
                      ) : (
                        <Button
                          size="small"
                          startIcon={<PublishIcon />}
                          color="success"
                          onClick={async () => {
                            try {
                              await courseService.updateCourseStatus(course._id, { isPublished: true });
                              showSnackbar('Kích hoạt khóa học thành công', 'success');
                              loadCourses(false);
                            } catch (error) {
                              console.error('Error enabling course:', error);
                              showSnackbar('Lỗi khi kích hoạt khóa học', 'error');
                            }
                          }}
                        >
                          Kích hoạt
                        </Button>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Empty State */}
      {courses.length === 0 && !loading && !tableLoading && (
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

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.page}
            onChange={(_, page) => setPagination(prev => ({ ...prev, page }))}
            color="primary"
            size="large"
          />
        </Box>
      )}

      {/* Pagination Info */}
      {courses.length > 0 && (
        <Paper sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body2">
            Hiển thị {courses.length} trong tổng số {pagination.total} khóa học
          </Typography>
          <Typography variant="body2">
            Trang {pagination.page} / {pagination.totalPages}
          </Typography>
        </Paper>
      )}

      {/* Course Form Dialog - Admin không có quyền tạo/sửa */}
      {/* <Dialog open={showCourseForm} onClose={() => setShowCourseForm(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingCourse ? 'Chỉnh sửa khóa học' : 'Tạo khóa học mới'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tên khóa học"
                value={courseFormData.title}
                onChange={(e) => setCourseFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Mô tả ngắn"
                value={courseFormData.shortDescription}
                onChange={(e) => setCourseFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Lĩnh vực</InputLabel>
                <Select
                  value={courseFormData.domain}
                  onChange={(e) => setCourseFormData(prev => ({ ...prev, domain: e.target.value }))}
                  label="Lĩnh vực"
                >
                  <MenuItem value="IT">IT</MenuItem>
                  <MenuItem value="Design">Design</MenuItem>
                  <MenuItem value="Science">Science</MenuItem>
                  <MenuItem value="Business">Business</MenuItem>
                  <MenuItem value="Marketing">Marketing</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Cấp độ</InputLabel>
                <Select
                  value={courseFormData.level}
                  onChange={(e) => setCourseFormData(prev => ({ ...prev, level: e.target.value }))}
                  label="Cấp độ"
                >
                  <MenuItem value="beginner">Cơ bản</MenuItem>
                  <MenuItem value="intermediate">Trung cấp</MenuItem>
                  <MenuItem value="advanced">Nâng cao</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Ngôn ngữ</InputLabel>
                <Select
                  value={courseFormData.language}
                  onChange={(e) => setCourseFormData(prev => ({ ...prev, language: e.target.value }))}
                  label="Ngôn ngữ"
                >
                  <MenuItem value="vi">Tiếng Việt</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Giá (VNĐ)"
                type="number"
                value={courseFormData.price}
                onChange={(e) => setCourseFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Giá gốc (VNĐ)"
                type="number"
                value={courseFormData.originalPrice}
                onChange={(e) => setCourseFormData(prev => ({ ...prev, originalPrice: Number(e.target.value) }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mô tả chi tiết"
                value={courseFormData.description}
                onChange={(e) => setCourseFormData(prev => ({ ...prev, description: e.target.value }))}
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={courseFormData.tags}
                onChange={(_, newValue) => setCourseFormData(prev => ({ ...prev, tags: newValue }))}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tags"
                    placeholder="Nhập tags..."
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={courseFormData.certificate}
                    onChange={(e) => setCourseFormData(prev => ({ ...prev, certificate: e.target.checked }))}
                  />
                }
                label="Có chứng chỉ"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCourseForm(false)} startIcon={<CancelIcon />}>
            Hủy
          </Button>
          <Button onClick={handleSaveCourse} variant="contained" startIcon={<SaveIcon />}>
            {editingCourse ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </DialogActions>
      </Dialog> */}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, courseId: null })}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa khóa học này? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, courseId: null })}>
            Hủy
          </Button>
          <Button
            onClick={() => deleteDialog.courseId && handleDeleteCourse(deleteDialog.courseId)}
            color="error"
            variant="contained"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Course Detail Dialog */}
      <Dialog
        open={viewCourseDialog}
        onClose={() => setViewCourseDialog(false)}
        maxWidth="lg"
        fullWidth
        scroll="paper"
        disableScrollLock={true}
        sx={{
          '& .MuiDialog-root': {
            '& .MuiBackdrop-root': {
              backgroundColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }}
        PaperProps={{
          sx: {
            borderRadius: 1,
            maxHeight: '90vh',
            margin: '32px'
          }
        }}
      >
        <DialogTitle sx={{
          backgroundColor: 'primary.main',
          color: 'white',
          py: 2,
          px: 3
        }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <SchoolIcon sx={{ fontSize: 24 }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" component="div" fontWeight={600}>
                Chi tiết khóa học
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {viewingCourse?.title}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Chip
                label={viewingCourse ? getStatusLabel(viewingCourse) : ''}
                color={viewingCourse ? getStatusColor(viewingCourse) as any : 'default'}
                size="small"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white'
                }}
              />
              {viewingCourse?.isFeatured && (
                <Chip
                  icon={<StarIcon />}
                  label="Nổi bật"
                  color="warning"
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(255, 193, 7, 0.2)',
                    color: 'white'
                  }}
                />
              )}
            </Stack>
          </Stack>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 0 }}>
          {viewingCourse && (
            <Box sx={{ p: 3 }}>
              {/* Hero Section */}
              <Card sx={{ mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={8}>
                      <Typography variant="h5" fontWeight={600} color="primary" gutterBottom>
                        {String(viewingCourse.title || '')}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" paragraph>
                        {String(viewingCourse.shortDescription || viewingCourse.description || 'Không có mô tả')}
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        <Chip
                          label={String(viewingCourse.domain || '')}
                          color="primary"
                          variant="outlined"
                          icon={<CategoryIcon />}
                        />
                        <Chip
                          label={String(getLevelLabel(viewingCourse.level))}
                          color="secondary"
                          variant="outlined"
                          icon={<TrendingUpIcon />}
                        />
                        <Chip
                          label={String(viewingCourse.language === 'vi' ? 'Tiếng Việt' : 'English')}
                          color="info"
                          variant="outlined"
                          icon={<LanguageIcon />}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="primary" fontWeight={600}>
                          {formatCurrency(viewingCourse.price)}
                        </Typography>
                        {viewingCourse.originalPrice && viewingCourse.originalPrice > viewingCourse.price && (
                          <Typography variant="body1" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                            {formatCurrency(viewingCourse.originalPrice)}
                          </Typography>
                        )}
                        {viewingCourse.discountPercentage && viewingCourse.discountPercentage > 0 && (
                          <Chip
                            label={`Giảm ${viewingCourse.discountPercentage}%`}
                            color="success"
                            sx={{ mt: 1 }}
                          />
                        )}
                        {viewingCourse.certificate && (
                          <Chip
                            label="Có chứng chỉ"
                            color="info"
                            sx={{ mt: 1, ml: 1 }}
                          />
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Stats Overview */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
                    📊 Tổng quan thống kê
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'primary.main', borderRadius: 1, color: 'white' }}>
                        <Typography variant="h4" fontWeight={600}>
                          {formatNumber(viewingCourse.totalStudents || 0)}
                        </Typography>
                        <Typography variant="body2">
                          Học viên
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'secondary.main', borderRadius: 1, color: 'white' }}>
                        <Typography variant="h4" fontWeight={600}>
                          ⭐ {viewingCourse.averageRating?.toFixed(1) || '0.0'}
                        </Typography>
                        <Typography variant="body2">
                          Đánh giá
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'info.main', borderRadius: 1, color: 'white' }}>
                        <Typography variant="h4" fontWeight={600}>
                          {viewingCourse.totalLessons || 0}
                        </Typography>
                        <Typography variant="body2">
                          Bài học
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'success.main', borderRadius: 1, color: 'white' }}>
                        <Typography variant="h4" fontWeight={600}>
                          {viewingCourse.totalDuration || 0}h
                        </Typography>
                        <Typography variant="body2">
                          Thời lượng
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Grid container spacing={3}>
                {/* Instructor & Pricing */}
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
                        👨‍🏫 Thông tin giảng viên
                      </Typography>
                      {(() => {
                        const instructorInfo = getInstructorInfo(viewingCourse);
                        return (
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar
                              alt={instructorInfo.name}
                              sx={{ width: 50, height: 50 }}
                            />
                            <Box>
                              <Typography variant="h6" fontWeight={600}>
                                {instructorInfo.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                ID: {instructorInfo.id}
                              </Typography>
                              {instructorInfo.email && (
                                <Typography variant="body2" color="text.secondary">
                                  Email: {instructorInfo.email}
                                </Typography>
                              )}
                              {instructorInfo.subscriptionStatus && (
                                <Typography variant="body2" color="text.secondary">
                                  Trạng thái: {instructorInfo.subscriptionStatus}
                                </Typography>
                              )}
                              <Typography variant="body2" color="text.secondary">
                                Premium: {instructorInfo.isPremium ? 'Có' : 'Không'}
                              </Typography>
                            </Box>
                          </Stack>
                        );
                      })()}
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
                        💰 Thông tin giá cả
                      </Typography>
                      <Stack spacing={2}>
                        <Box sx={{
                          p: 2,
                          backgroundColor: 'primary.main',
                          borderRadius: 1,
                          color: 'white',
                          textAlign: 'center'
                        }}>
                          <Typography variant="h5" fontWeight={600}>
                            {formatCurrency(viewingCourse.price)}
                          </Typography>
                          <Typography variant="body2">
                            Giá hiện tại
                          </Typography>
                        </Box>
                        {viewingCourse.originalPrice && viewingCourse.originalPrice > viewingCourse.price && (
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                              Giá gốc: <span style={{ textDecoration: 'line-through' }}>{formatCurrency(viewingCourse.originalPrice)}</span>
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Description */}
                {viewingCourse.description && (
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
                          📝 Mô tả chi tiết
                        </Typography>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                          {viewingCourse.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {/* Tags */}
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
                        🏷️ Tags
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                        {viewingCourse.tags && viewingCourse.tags.length > 0 ? (
                          viewingCourse.tags.map((tag, index) => (
                            <Chip
                              key={index}
                              label={tag}
                              variant="outlined"
                              size="small"
                              color="primary"
                            />
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Không có tags
                          </Typography>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Prerequisites & Benefits */}
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
                        📋 Yêu cầu tiên quyết
                      </Typography>
                      <Stack spacing={1}>
                        {viewingCourse.prerequisites && viewingCourse.prerequisites.length > 0 ? (
                          viewingCourse.prerequisites.map((prereq, index) => (
                            <Box key={index} sx={{
                              p: 1.5,
                              backgroundColor: 'secondary.light',
                              borderRadius: 1,
                              color: 'secondary.contrastText'
                            }}>
                              <Typography variant="body2">
                                • {prereq}
                              </Typography>
                            </Box>
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Không có yêu cầu tiên quyết
                          </Typography>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
                        🎯 Lợi ích
                      </Typography>
                      <Stack spacing={1}>
                        {viewingCourse.benefits && viewingCourse.benefits.length > 0 ? (
                          viewingCourse.benefits.map((benefit, index) => (
                            <Box key={index} sx={{
                              p: 1.5,
                              backgroundColor: 'info.light',
                              borderRadius: 1,
                              color: 'info.contrastText'
                            }}>
                              <Typography variant="body2">
                                • {benefit}
                              </Typography>
                            </Box>
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Không có thông tin lợi ích
                          </Typography>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Technical Requirements */}
                {viewingCourse.technicalRequirements && (
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
                          🔧 Yêu cầu kỹ thuật
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, backgroundColor: 'success.main', borderRadius: 1, color: 'white', textAlign: 'center' }}>
                              <Typography variant="h6" fontWeight={600}>
                                {viewingCourse.technicalRequirements.minBandwidth} Mbps
                              </Typography>
                              <Typography variant="body2">
                                Băng thông tối thiểu
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, backgroundColor: 'warning.main', borderRadius: 1, color: 'white', textAlign: 'center' }}>
                              <Typography variant="h6" fontWeight={600}>
                                {viewingCourse.technicalRequirements.recommendedBandwidth} Mbps
                              </Typography>
                              <Typography variant="body2">
                                Băng thông khuyến nghị
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              Thiết bị hỗ trợ
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                              {viewingCourse.technicalRequirements.supportedDevices?.map((device, index) => (
                                <Chip
                                  key={index}
                                  label={device}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              ))}
                            </Stack>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              Trình duyệt hỗ trợ
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                              {viewingCourse.technicalRequirements.browserCompatibility?.map((browser, index) => (
                                <Chip
                                  key={index}
                                  label={browser}
                                  size="small"
                                  color="info"
                                  variant="outlined"
                                />
                              ))}
                            </Stack>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              Phần mềm yêu cầu
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                              {viewingCourse.technicalRequirements.requiredSoftware?.map((software, index) => (
                                <Chip
                                  key={index}
                                  label={software}
                                  size="small"
                                  color="secondary"
                                  variant="outlined"
                                />
                              ))}
                            </Stack>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {/* Learning Objectives */}
                {(viewingCourse as any).learningObjectives && (viewingCourse as any).learningObjectives.length > 0 && (
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
                          🎯 Mục tiêu học tập
                        </Typography>
                        <Stack spacing={1}>
                          {(viewingCourse as any).learningObjectives.map((objective: string, index: number) => (
                            <Box key={index} sx={{
                              p: 1.5,
                              backgroundColor: 'primary.light',
                              borderRadius: 1,
                              color: 'primary.contrastText'
                            }}>
                              <Typography variant="body2">
                                • {objective}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {/* Target Audience */}
                {(viewingCourse as any).targetAudience && (viewingCourse as any).targetAudience.length > 0 && (
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
                          👥 Đối tượng mục tiêu
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                          {(viewingCourse as any).targetAudience.map((audience: string, index: number) => (
                            <Chip
                              key={index}
                              label={audience}
                              variant="outlined"
                              size="small"
                              color="info"
                            />
                          ))}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {/* Estimated Duration */}
                {(viewingCourse as any).estimatedDuration && (
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
                          ⏱️ Thời lượng ước tính
                        </Typography>
                        <Box sx={{ p: 2, backgroundColor: 'primary.main', borderRadius: 1, color: 'white', textAlign: 'center' }}>
                          <Typography variant="h4" fontWeight={600}>
                            {(viewingCourse as any).estimatedDuration} giờ
                          </Typography>
                          <Typography variant="body2">
                            Tổng thời lượng khóa học
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {/* External Links */}
                {(viewingCourse as any).externalLinks && (viewingCourse as any).externalLinks.length > 0 && (
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
                          🔗 Liên kết ngoài
                        </Typography>
                        <Stack spacing={2}>
                          {(viewingCourse as any).externalLinks.map((link: any, index: number) => (
                            <Box key={index} sx={{
                              p: 2,
                              backgroundColor: 'grey.50',
                              borderRadius: 1,
                              border: '1px solid',
                              borderColor: 'grey.200'
                            }}>
                              <Typography variant="subtitle1" fontWeight={600}>
                                {link.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {link.description}
                              </Typography>
                              <Typography variant="body2" color="primary" sx={{ wordBreak: 'break-all' }}>
                                {link.url}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {/* Assessment */}
                {viewingCourse.assessment && (
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
                          📝 Hệ thống đánh giá
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <Box sx={{
                              p: 2,
                              backgroundColor: viewingCourse.assessment.hasQuizzes ? 'success.main' : 'error.main',
                              borderRadius: 1,
                              color: 'white',
                              textAlign: 'center'
                            }}>
                              <Typography variant="h6" fontWeight={600}>
                                {viewingCourse.assessment.hasQuizzes ? 'Có' : 'Không'}
                              </Typography>
                              <Typography variant="body2">
                                Quiz
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Box sx={{
                              p: 2,
                              backgroundColor: viewingCourse.assessment.hasAssignments ? 'success.main' : 'error.main',
                              borderRadius: 1,
                              color: 'white',
                              textAlign: 'center'
                            }}>
                              <Typography variant="h6" fontWeight={600}>
                                {viewingCourse.assessment.hasAssignments ? 'Có' : 'Không'}
                              </Typography>
                              <Typography variant="body2">
                                Bài tập
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Box sx={{
                              p: 2,
                              backgroundColor: viewingCourse.assessment.hasCertification ? 'success.main' : 'error.main',
                              borderRadius: 1,
                              color: 'white',
                              textAlign: 'center'
                            }}>
                              <Typography variant="h6" fontWeight={600}>
                                {viewingCourse.assessment.hasCertification ? 'Có' : 'Không'}
                              </Typography>
                              <Typography variant="body2">
                                Chứng chỉ
                              </Typography>
                            </Box>
                          </Grid>
                          {viewingCourse.assessment.passingScore && (
                            <Grid item xs={12} md={6}>
                              <Box sx={{ p: 2, backgroundColor: 'primary.main', borderRadius: 1, color: 'white', textAlign: 'center' }}>
                                <Typography variant="h6" fontWeight={600}>
                                  {viewingCourse.assessment.passingScore}%
                                </Typography>
                                <Typography variant="body2">
                                  Điểm đậu
                                </Typography>
                              </Box>
                            </Grid>
                          )}
                          {viewingCourse.assessment.maxAttempts && (
                            <Grid item xs={12} md={6}>
                              <Box sx={{ p: 2, backgroundColor: 'info.main', borderRadius: 1, color: 'white', textAlign: 'center' }}>
                                <Typography variant="h6" fontWeight={600}>
                                  {viewingCourse.assessment.maxAttempts}
                                </Typography>
                                <Typography variant="body2">
                                  Số lần thử tối đa
                                </Typography>
                              </Box>
                            </Grid>
                          )}
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {/* Course Status & Approval */}
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
                        📊 Trạng thái khóa học
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                          <Box sx={{ p: 2, backgroundColor: viewingCourse.isPublished ? 'success.main' : 'warning.main', borderRadius: 1, color: 'white', textAlign: 'center' }}>
                            <Typography variant="h6" fontWeight={600}>
                              {viewingCourse.isPublished ? 'Đã xuất bản' : 'Chưa xuất bản'}
                            </Typography>
                            <Typography variant="body2">
                              Trạng thái xuất bản
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Box sx={{ p: 2, backgroundColor: viewingCourse.isApproved ? 'success.main' : 'error.main', borderRadius: 1, color: 'white', textAlign: 'center' }}>
                            <Typography variant="h6" fontWeight={600}>
                              {viewingCourse.isApproved ? 'Đã phê duyệt' : 'Chưa phê duyệt'}
                            </Typography>
                            <Typography variant="body2">
                              Trạng thái phê duyệt
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Box sx={{ p: 2, backgroundColor: viewingCourse.isFeatured ? 'warning.main' : 'info.main', borderRadius: 1, color: 'white', textAlign: 'center' }}>
                            <Typography variant="h6" fontWeight={600}>
                              {viewingCourse.isFeatured ? 'Nổi bật' : 'Bình thường'}
                            </Typography>
                            <Typography variant="body2">
                              Trạng thái nổi bật
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Box sx={{ p: 2, backgroundColor: 'info.main', borderRadius: 1, color: 'white', textAlign: 'center' }}>
                            <Typography variant="h6" fontWeight={600}>
                              {viewingCourse.language === 'vi' ? 'Tiếng Việt' : 'English'}
                            </Typography>
                            <Typography variant="body2">
                              Ngôn ngữ
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Accessibility */}
                {viewingCourse.accessibility && (
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
                          ♿ Khả năng tiếp cận
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={3}>
                            <Box sx={{ p: 2, backgroundColor: viewingCourse.accessibility.hasSubtitles ? 'success.main' : 'error.main', borderRadius: 1, color: 'white', textAlign: 'center' }}>
                              <Typography variant="h6" fontWeight={600}>
                                {viewingCourse.accessibility.hasSubtitles ? 'Có' : 'Không'}
                              </Typography>
                              <Typography variant="body2">
                                Phụ đề
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Box sx={{ p: 2, backgroundColor: viewingCourse.accessibility.supportsScreenReaders ? 'success.main' : 'error.main', borderRadius: 1, color: 'white', textAlign: 'center' }}>
                              <Typography variant="h6" fontWeight={600}>
                                {viewingCourse.accessibility.supportsScreenReaders ? 'Có' : 'Không'}
                              </Typography>
                              <Typography variant="body2">
                                Hỗ trợ đọc màn hình
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Box sx={{ p: 2, backgroundColor: viewingCourse.accessibility.hasHighContrast ? 'success.main' : 'error.main', borderRadius: 1, color: 'white', textAlign: 'center' }}>
                              <Typography variant="h6" fontWeight={600}>
                                {viewingCourse.accessibility.hasHighContrast ? 'Có' : 'Không'}
                              </Typography>
                              <Typography variant="body2">
                                Độ tương phản cao
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Box sx={{ p: 2, backgroundColor: viewingCourse.accessibility.hasAudioDescription ? 'success.main' : 'error.main', borderRadius: 1, color: 'white', textAlign: 'center' }}>
                              <Typography variant="h6" fontWeight={600}>
                                {viewingCourse.accessibility.hasAudioDescription ? 'Có' : 'Không'}
                              </Typography>
                              <Typography variant="body2">
                                Mô tả âm thanh
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {/* Content Delivery */}
                {viewingCourse.contentDelivery && (
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
                          📺 Phương thức học
                        </Typography>
                        <Stack spacing={2}>
                          <Box sx={{ p: 2, backgroundColor: 'primary.main', borderRadius: 1, color: 'white', textAlign: 'center' }}>
                            <Typography variant="h6" fontWeight={600}>
                              {viewingCourse.contentDelivery.deliveryMethod === 'self-paced' ? 'Tự học' : 'Có lịch trình'}
                            </Typography>
                            <Typography variant="body2">
                              Phương thức
                            </Typography>
                          </Box>
                          <Box sx={{ p: 2, backgroundColor: viewingCourse.contentDelivery.hasLiveSessions ? 'success.main' : 'info.main', borderRadius: 1, color: 'white', textAlign: 'center' }}>
                            <Typography variant="h6" fontWeight={600}>
                              {viewingCourse.contentDelivery.hasLiveSessions ? 'Có' : 'Không'}
                            </Typography>
                            <Typography variant="body2">
                              Phiên trực tiếp
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Timezone:</strong> {viewingCourse.contentDelivery.timezone}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Chính sách ghi âm:</strong> {viewingCourse.contentDelivery.recordingPolicy}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {/* Support */}
                {viewingCourse.support && (
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
                          🆘 Hỗ trợ
                        </Typography>
                        <Stack spacing={2}>
                          <Box sx={{ p: 2, backgroundColor: viewingCourse.support.hasInstructorSupport ? 'success.main' : 'error.main', borderRadius: 1, color: 'white', textAlign: 'center' }}>
                            <Typography variant="h6" fontWeight={600}>
                              {viewingCourse.support.hasInstructorSupport ? 'Có' : 'Không'}
                            </Typography>
                            <Typography variant="body2">
                              Hỗ trợ giảng viên
                            </Typography>
                          </Box>
                          <Box sx={{ p: 2, backgroundColor: viewingCourse.support.hasTechnicalSupport ? 'success.main' : 'error.main', borderRadius: 1, color: 'white', textAlign: 'center' }}>
                            <Typography variant="h6" fontWeight={600}>
                              {viewingCourse.support.hasTechnicalSupport ? 'Có' : 'Không'}
                            </Typography>
                            <Typography variant="body2">
                              Hỗ trợ kỹ thuật
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Thời gian phản hồi:</strong> {viewingCourse.support.responseTime}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {/* Monetization */}
                {viewingCourse.monetization && (
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
                          💰 Mô hình kinh doanh
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={3}>
                            <Box sx={{ p: 2, backgroundColor: 'primary.main', borderRadius: 1, color: 'white', textAlign: 'center' }}>
                              <Typography variant="h6" fontWeight={600}>
                                {viewingCourse.monetization.pricingModel === 'one-time' ? 'Một lần' : 'Định kỳ'}
                              </Typography>
                              <Typography variant="body2">
                                Mô hình giá
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Box sx={{ p: 2, backgroundColor: viewingCourse.monetization.hasFreeTrial ? 'success.main' : 'error.main', borderRadius: 1, color: 'white', textAlign: 'center' }}>
                              <Typography variant="h6" fontWeight={600}>
                                {viewingCourse.monetization.hasFreeTrial ? 'Có' : 'Không'}
                              </Typography>
                              <Typography variant="body2">
                                Dùng thử miễn phí
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Box sx={{ p: 2, backgroundColor: viewingCourse.monetization.installmentPlan?.enabled ? 'success.main' : 'error.main', borderRadius: 1, color: 'white', textAlign: 'center' }}>
                              <Typography variant="h6" fontWeight={600}>
                                {viewingCourse.monetization.installmentPlan?.enabled ? 'Có' : 'Không'}
                              </Typography>
                              <Typography variant="body2">
                                Trả góp
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Box sx={{ p: 2, backgroundColor: viewingCourse.monetization.hasMoneyBackGuarantee ? 'success.main' : 'error.main', borderRadius: 1, color: 'white', textAlign: 'center' }}>
                              <Typography variant="h6" fontWeight={600}>
                                {viewingCourse.monetization.hasMoneyBackGuarantee ? 'Có' : 'Không'}
                              </Typography>
                              <Typography variant="body2">
                                Bảo đảm hoàn tiền
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {/* Analytics */}
                {viewingCourse.analytics && (
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
                          📈 Phân tích & Thống kê
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={3}>
                            <Box sx={{ p: 2, backgroundColor: 'primary.main', borderRadius: 1, color: 'white', textAlign: 'center' }}>
                              <Typography variant="h6" fontWeight={600}>
                                {formatNumber(viewingCourse.analytics.viewCount || 0)}
                              </Typography>
                              <Typography variant="body2">
                                Lượt xem
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Box sx={{ p: 2, backgroundColor: 'success.main', borderRadius: 1, color: 'white', textAlign: 'center' }}>
                              <Typography variant="h6" fontWeight={600}>
                                {(viewingCourse.analytics.conversionRate || 0).toFixed(1)}%
                              </Typography>
                              <Typography variant="body2">
                                Tỷ lệ chuyển đổi
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Box sx={{ p: 2, backgroundColor: 'warning.main', borderRadius: 1, color: 'white', textAlign: 'center' }}>
                              <Typography variant="h6" fontWeight={600}>
                                {formatNumber(viewingCourse.analytics.engagementScore || 0)}
                              </Typography>
                              <Typography variant="body2">
                                Điểm tương tác
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Box sx={{ p: 2, backgroundColor: 'info.main', borderRadius: 1, color: 'white', textAlign: 'center' }}>
                              <Typography variant="h6" fontWeight={600}>
                                {(viewingCourse.analytics.retentionRate || 0).toFixed(1)}%
                              </Typography>
                              <Typography variant="body2">
                                Tỷ lệ giữ chân
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {/* Localization */}
                {viewingCourse.localization && (
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
                          🌍 Đa ngôn ngữ
                        </Typography>
                        <Stack spacing={2}>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Ngôn ngữ gốc:</strong> {viewingCourse.localization.originalLanguage}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Ngôn ngữ có sẵn:</strong>
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                            {viewingCourse.localization.availableLanguages?.map((lang: string, index: number) => (
                              <Chip
                                key={index}
                                label={lang}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            ))}
                          </Stack>
                          <Box sx={{ p: 2, backgroundColor: viewingCourse.localization.hasSubtitles ? 'success.main' : 'error.main', borderRadius: 1, color: 'white', textAlign: 'center' }}>
                            <Typography variant="h6" fontWeight={600}>
                              {viewingCourse.localization.hasSubtitles ? 'Có' : 'Không'}
                            </Typography>
                            <Typography variant="body2">
                              Phụ đề
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {/* Compliance */}
                {viewingCourse.compliance && (
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
                          ✅ Tuân thủ
                        </Typography>
                        <Stack spacing={2}>
                          <Box sx={{ p: 2, backgroundColor: viewingCourse.compliance.gdprCompliant ? 'success.main' : 'error.main', borderRadius: 1, color: 'white', textAlign: 'center' }}>
                            <Typography variant="h6" fontWeight={600}>
                              {viewingCourse.compliance.gdprCompliant ? 'Có' : 'Không'}
                            </Typography>
                            <Typography variant="body2">
                              Tuân thủ GDPR
                            </Typography>
                          </Box>
                          <Box sx={{ p: 2, backgroundColor: viewingCourse.compliance.accessibilityCompliant ? 'success.main' : 'error.main', borderRadius: 1, color: 'white', textAlign: 'center' }}>
                            <Typography variant="h6" fontWeight={600}>
                              {viewingCourse.compliance.accessibilityCompliant ? 'Có' : 'Không'}
                            </Typography>
                            <Typography variant="body2">
                              Tuân thủ tiếp cận
                            </Typography>
                          </Box>
                          {viewingCourse.compliance.industryStandards && viewingCourse.compliance.industryStandards.length > 0 && (
                            <>
                              <Typography variant="body2" color="text.secondary">
                                <strong>Tiêu chuẩn ngành:</strong>
                              </Typography>
                              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                                {viewingCourse.compliance.industryStandards.map((standard: string, index: number) => (
                                  <Chip
                                    key={index}
                                    label={standard}
                                    size="small"
                                    color="secondary"
                                    variant="outlined"
                                  />
                                ))}
                              </Stack>
                            </>
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {/* Dates */}
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
                        📅 Thông tin thời gian
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                          <Box sx={{ p: 2, backgroundColor: 'primary.main', borderRadius: 1, color: 'white', textAlign: 'center' }}>
                            <Typography variant="h6" fontWeight={600}>
                              {formatDate(viewingCourse.createdAt)}
                            </Typography>
                            <Typography variant="body2">
                              Ngày tạo
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Box sx={{ p: 2, backgroundColor: 'secondary.main', borderRadius: 1, color: 'white', textAlign: 'center' }}>
                            <Typography variant="h6" fontWeight={600}>
                              {formatDate(viewingCourse.updatedAt)}
                            </Typography>
                            <Typography variant="body2">
                              Cập nhật lần cuối
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Box sx={{ p: 2, backgroundColor: 'success.main', borderRadius: 1, color: 'white', textAlign: 'center' }}>
                            <Typography variant="h6" fontWeight={600}>
                              {viewingCourse.publishedAt ? formatDate(viewingCourse.publishedAt) : 'Chưa xuất bản'}
                            </Typography>
                            <Typography variant="body2">
                              Ngày xuất bản
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Box sx={{ p: 2, backgroundColor: 'info.main', borderRadius: 1, color: 'white', textAlign: 'center' }}>
                            <Typography variant="h6" fontWeight={600}>
                              {viewingCourse.approvedAt ? formatDate(viewingCourse.approvedAt) : 'Chưa phê duyệt'}
                            </Typography>
                            <Typography variant="body2">
                              Ngày phê duyệt
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setViewCourseDialog(false)}
            variant="contained"
            color="primary"
            size="large"
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterMenuAnchor}
        open={Boolean(filterMenuAnchor)}
        onClose={handleFilterMenuClose}
      >
        <MenuItem onClick={() => {
          setAdvancedFilters(prev => ({ ...prev, showAdvanced: true }));
          handleFilterMenuClose();
        }}>
          <ListItemIcon><FilterListIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Bộ lọc nâng cao</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          clearAllFilters();
          handleFilterMenuClose();
        }}>
          <ListItemIcon><CloseIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Xóa tất cả bộ lọc</ListItemText>
        </MenuItem>
      </Menu>

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

export default CourseDirectory;

