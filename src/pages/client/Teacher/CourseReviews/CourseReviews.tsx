import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getTeacherCourses } from '@/services/client/teacher-courses.service';
import * as teacherReviewService from '@/services/client/teacher-reviews.service';
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Stack,
  Avatar,
  CircularProgress,
  Chip,
  LinearProgress,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  People as PeopleIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';

interface Review {
  _id: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  studentProgress: number;
  rating: number;
  comment: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  teacherResponse?: string;
  responseDate?: string;
  responseId?: string; // ID of teacher response for update/delete
}

interface CourseInfo {
  _id: string;
  title: string;
  thumbnail: string;
  totalReviews: number;
  averageRating: number;
  status: 'published' | 'draft' | 'pending' | 'submitted' | 'approved' | 'rejected' | 'needs_revision' | 'delisted';
  field: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  sections: number;
  lessons: number;
  rating: number;
}

const CourseReviews: React.FC = () => {
  const { id: courseId } = useParams<{ id: string }>();
  const [courseInfo, setCourseInfo] = useState<CourseInfo | null>(null);
  const [courses, setCourses] = useState<CourseInfo[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [sortBy] = useState<'createdAt' | 'rating' | 'helpfulCount'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState<CourseInfo | null>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [responseText, setResponseText] = useState('');

  // Load teacher's courses
  const loadCourses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getTeacherCourses({ page: 1, limit: 100 });

      if (response.success && response.data) {
        const coursesData = response.data.map((course: any) => ({
          _id: course._id,
          title: course.title,
          thumbnail: course.thumbnail,
          totalReviews: 0, // Will be loaded separately
          averageRating: course.rating || 0,
          status: course.status,
          field: course.domain,
          level: course.level,
          price: course.price,
          sections: course.sectionsCount || 0,
          lessons: course.lessonsCount || 0,
          rating: course.rating || 0
        }));

        setCourses(coursesData);

        // Only auto-select if courseId is provided in URL params
        if (courseId) {
          const course = coursesData.find((c: CourseInfo) => c._id === courseId);
          if (course) {
            setSelectedCourse(course);
            setCourseInfo(course);
          }
        }
        // Otherwise, show course list (don't auto-select)
      }
    } catch (error: any) {
      console.error('Error loading courses:', error);
      toast.error('Lỗi khi tải danh sách khóa học');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  // Load reviews for selected course
  const loadReviews = useCallback(async () => {
    if (!selectedCourse) return;

    try {
      setLoading(true);

      // Get reviews with filters
      const reviewsResponse = await teacherReviewService.getCourseReviews(
        selectedCourse._id,
        {
          page,
          limit: 12,
          rating: ratingFilter === 0 ? undefined : ratingFilter,
          sortBy,
          sortOrder,
          search: searchTerm
        }
      );

      if (reviewsResponse.success && reviewsResponse.data) {
        const reviewsData = reviewsResponse.data.ratings?.map((r: any) => ({
          _id: r._id,
          studentId: r.studentId?._id || r.studentId,
          studentName: r.studentId?.firstName && r.studentId?.lastName
            ? `${r.studentId.firstName} ${r.studentId.lastName}`
            : 'Học viên',
          studentAvatar: r.studentId?.avatar || '/images/default-avatar.png',
          studentProgress: 0, // TODO: Load from enrollment if needed
          rating: r.rating,
          comment: r.comment,
          createdAt: r.createdAt,
          status: 'approved', // All fetched reviews are approved
          teacherResponse: r.teacherResponse?.response,
          responseDate: r.teacherResponse?.createdAt,
          responseId: r.teacherResponse?._id // Store response ID for update/delete
        })) || [];

        setReviews(reviewsData);
        setTotalReviews(reviewsResponse.data.total || reviewsData.length);
      }

      // Get stats
      const statsResponse = await teacherReviewService.getCourseReviewStats(selectedCourse._id);
      if (statsResponse.success && statsResponse.data) {
        // Update courseInfo with stats
        setCourseInfo(prev => prev ? {
          ...prev,
          totalReviews: statsResponse.data.totalReviews || 0,
          averageRating: statsResponse.data.averageRating || 0
        } : null);
      }
    } catch (error: any) {
      console.error('Error loading reviews:', error);
      toast.error(error.response?.data?.message || 'Lỗi khi tải đánh giá');
    } finally {
      setLoading(false);
    }
  }, [selectedCourse, page, ratingFilter, sortBy, sortOrder, searchTerm]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleCourseSelect = (course: CourseInfo) => {
    setSelectedCourse(course);
    setCourseInfo(course);
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setCourseInfo(null);
    setReviews([]);
  };

  const handleResponseSubmit = async () => {
    if (!selectedReview || !responseText.trim()) return;

    try {
      setSaving(true);

      // If updating existing response
      if (selectedReview.responseId) {
        const response = await teacherReviewService.updateTeacherResponse(
          selectedReview.responseId,
          responseText
        );

        if (response.success) {
          toast.success('Đã cập nhật phản hồi thành công');
        }
      } else {
        // Creating new response
        const response = await teacherReviewService.createTeacherResponse(
          selectedReview._id,
          responseText
        );

        if (response.success) {
          toast.success('Đã gửi phản hồi thành công');
        }
      }

      // Reload reviews to get updated data
      await loadReviews();

      setShowResponseModal(false);
      setSelectedReview(null);
      setResponseText('');
    } catch (error: any) {
      console.error('Error submitting response:', error);
      toast.error(error.response?.data?.message || 'Lỗi khi gửi phản hồi');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteResponse = async (review: Review) => {
    if (!review.responseId) return;

    if (!window.confirm('Bạn có chắc chắn muốn xóa phản hồi này?')) return;

    try {
      setSaving(true);
      const response = await teacherReviewService.deleteTeacherResponse(review.responseId);

      if (response.success) {
        toast.success('Đã xóa phản hồi');
        await loadReviews();
      }
    } catch (error: any) {
      console.error('Error deleting response:', error);
      toast.error(error.response?.data?.message || 'Lỗi khi xóa phản hồi');
    } finally {
      setSaving(false);
    }
  };

  const handleEditResponse = (review: Review) => {
    setSelectedReview(review);
    setResponseText(review.teacherResponse || '');
    setShowResponseModal(true);
  };

  // Mark as helpful (future feature)
  // const handleMarkAsHelpful = async (reviewId: string) => {
  //   try {
  //     const response = await teacherReviewService.markReviewAsHelpful(reviewId);

  //     if (response.success) {
  //       toast.success('Đã đánh dấu hữu ích');
  //       await loadReviews();
  //     }
  //   } catch (error: any) {
  //     console.error('Error marking as helpful:', error);
  //     toast.error(error.response?.data?.message || 'Lỗi khi đánh dấu hữu ích');
  //   }
  // };

  // Report review (future feature)
  // const handleReportReview = async (reviewId: string, reason: string) => {
  //   try {
  //     const response = await teacherReviewService.reportReview(reviewId, reason);

  //     if (response.success) {
  //       toast.success('Đã báo cáo đánh giá');
  //     }
  //   } catch (error: any) {
  //     console.error('Error reporting review:', error);
  //     toast.error(error.response?.data?.message || 'Lỗi khi báo cáo');
  //   }
  // };

  const getStatusColor = useCallback((status: string): 'success' | 'warning' | 'info' | 'error' | 'default' => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'default';
      case 'submitted': return 'info';
      case 'approved': return 'info';
      case 'rejected': return 'error';
      case 'needs_revision': return 'warning';
      case 'delisted': return 'error';
      default: return 'default';
    }
  }, []);

  const getStatusText = useCallback((status: string) => {
    switch (status) {
      case 'published': return 'Đã xuất bản';
      case 'draft': return 'Bản nháp';
      case 'submitted': return 'Chờ duyệt';
      case 'approved': return 'Đã duyệt';
      case 'rejected': return 'Bị từ chối';
      case 'needs_revision': return 'Cần sửa';
      case 'delisted': return 'Đã gỡ';
      default: return 'Không xác định';
    }
  }, []);

  const getLevelColor = useCallback((level: string): 'error' | 'warning' | 'info' | 'default' => {
    switch (level) {
      case 'advanced': return 'error';
      case 'intermediate': return 'warning';
      case 'beginner': return 'info';
      default: return 'default';
    }
  }, []);

  const getLevelText = useCallback((level: string) => {
    switch (level) {
      case 'advanced': return 'Nâng cao';
      case 'intermediate': return 'Trung cấp';
      case 'beginner': return 'Cơ bản';
      default: return 'Không xác định';
    }
  }, []);

  const formatDate = useCallback((dateString: string) => new Date(dateString).toLocaleDateString('vi-VN'), []);

  const ratingDistribution = useMemo(() => {
    const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(r => { dist[r.rating] = (dist[r.rating] || 0) + 1; });
    return dist;
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    return reviews.filter(review => {
      const matchesSearch = review.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
      const matchesRating = ratingFilter === 0 || review.rating === ratingFilter;
      return matchesSearch && matchesStatus && matchesRating;
    });
  }, [reviews, searchTerm, statusFilter, ratingFilter]);

  const sortedReviews = useMemo(() => {
    return [...filteredReviews].sort((a, b) => {
      let aValue: any;
      let bValue: any;
      if (sortBy === 'createdAt') { aValue = new Date(a.createdAt).getTime(); bValue = new Date(b.createdAt).getTime(); }
      else if (sortBy === 'rating') { aValue = a.rating; bValue = b.rating; }
      else { aValue = a.studentProgress; bValue = b.studentProgress; }
      return sortOrder === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });
  }, [filteredReviews, sortBy, sortOrder]);

  // Course list view
  if (!selectedCourse) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box sx={{ mb: 4 }}>
          <Breadcrumbs sx={{ mb: 2 }}>
            <Typography color="text.primary">Teacher Dashboard</Typography>
            <Typography color="text.secondary">Quản lý đánh giá</Typography>
          </Breadcrumbs>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
              Quản lý đánh giá
            </Typography>
            <Typography variant="body1" color="text.secondary">Chọn khóa học để quản lý đánh giá</Typography>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h6" color="text.secondary">Đang tải dữ liệu...</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {courses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'all .3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }} onClick={() => handleCourseSelect(course)}>
                  <CardMedia component="img" height="200" image={course.thumbnail} alt={course.title} sx={{ objectFit: 'cover' }} />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>{course.title}</Typography>
                      <Chip label={getStatusText(course.status)} color={getStatusColor(course.status)} size="small" />
                    </Stack>
                    <Stack spacing={1} sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Lĩnh vực: <b>{course.field}</b></Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="body2" color="text.secondary">Cấp độ:</Typography>
                        <Chip label={getLevelText(course.level)} color={getLevelColor(course.level)} size="small" />
                      </Stack>
                      <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>{new Intl.NumberFormat('vi-VN').format(course.price)} ₫</Typography>
                    </Stack>
                    <Grid container spacing={1}>
                      <Grid item xs={6}><Typography variant="caption" color="text.secondary">Sections: <b>{course.sections}</b></Typography></Grid>
                      <Grid item xs={6}><Typography variant="caption" color="text.secondary">Lessons: <b>{course.lessons}</b></Typography></Grid>
                      <Grid item xs={6}><Typography variant="caption" color="text.secondary">ĐTB: <b>{course.rating}</b></Typography></Grid>
                      <Grid item xs={6}><Typography variant="caption" color="text.secondary">Reviews: <b>{course.totalReviews}</b></Typography></Grid>
                    </Grid>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button variant="contained" fullWidth onClick={(e) => { e.stopPropagation(); handleCourseSelect(course); }}>Quản lý đánh giá</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    );
  }

  // Selected course view
  const reviewCount = reviews.length;
  const averageRating = reviewCount > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviewCount).toFixed(1) : 0;

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Typography color="text.primary">Teacher Dashboard</Typography>
          <Typography color="text.primary">Quản lý đánh giá</Typography>
          <Typography color="text.secondary">{courseInfo?.title}</Typography>
        </Breadcrumbs>

        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBackToCourses}>Quay lại</Button>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>Quản lý đánh giá - {courseInfo?.title}</Typography>
            <Stack direction="row" spacing={4}>
              <Stack direction="row" spacing={1} alignItems="center">
                <PeopleIcon color="primary" />
                <Typography variant="body1"><b>{courseInfo?.totalReviews}</b> đánh giá</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <TrendingUpIcon color="warning" />
                <Typography variant="body1">Điểm TB: <b>{averageRating}</b></Typography>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* Rating Overview */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>{averageRating}</Typography>
              <Stack direction="row" justifyContent="center" spacing={0.5} sx={{ mb: 1 }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <StarIcon key={star} color={star <= Number(averageRating) ? 'warning' : 'disabled'} />
                ))}
              </Stack>
              <Typography variant="body2" color="text.secondary">{totalReviews} đánh giá</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                {[5, 4, 3, 2, 1].map(rating => (
                  <Stack key={rating} direction="row" alignItems="center" spacing={2}>
                    <Typography sx={{ width: 48 }}>{rating} ⭐</Typography>
                    <LinearProgress variant="determinate" value={totalReviews > 0 ? (ratingDistribution[rating] / totalReviews) * 100 : 0} sx={{ flexGrow: 1, height: 8, borderRadius: 4 }} />
                    <Typography sx={{ width: 32, textAlign: 'right' }}>{ratingDistribution[rating]}</Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField fullWidth placeholder="Tìm kiếm đánh giá..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }} />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} label="Trạng thái" MenuProps={{ disableScrollLock: true }}>
                  <MenuItem value="all">Tất cả trạng thái</MenuItem>
                  <MenuItem value="pending">Chờ duyệt</MenuItem>
                  <MenuItem value="approved">Đã duyệt</MenuItem>
                  <MenuItem value="rejected">Đã từ chối</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Điểm</InputLabel>
                <Select value={ratingFilter} onChange={(e) => setRatingFilter(Number(e.target.value))} label="Điểm" MenuProps={{ disableScrollLock: true }}>
                  <MenuItem value={0}>Tất cả điểm</MenuItem>
                  <MenuItem value={5}>5 sao</MenuItem>
                  <MenuItem value={4}>4 sao</MenuItem>
                  <MenuItem value={3}>3 sao</MenuItem>
                  <MenuItem value={2}>2 sao</MenuItem>
                  <MenuItem value={1}>1 sao</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button variant="outlined" fullWidth startIcon={<FilterListIcon />} onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                {sortOrder === 'asc' ? 'Tăng dần' : 'Giảm dần'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Reviews List */}
      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h6" color="text.secondary">Đang tải danh sách đánh giá...</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {sortedReviews.map((review) => (
            <Grid item xs={12} md={6} key={review._id}>
              <Card>
                <CardContent>
                  <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Avatar src={review.studentAvatar} alt={review.studentName} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{review.studentName}</Typography>
                      <Stack direction="row" spacing={2}>
                        <Typography variant="caption" color="text.secondary">Tiến độ: {review.studentProgress}%</Typography>
                        <Typography variant="caption" color="text.secondary">{formatDate(review.createdAt)}</Typography>
                      </Stack>
                    </Box>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      {[1, 2, 3, 4, 5].map(star => (<StarIcon key={star} fontSize="small" color={star <= review.rating ? 'warning' : 'disabled'} />))}
                      <Typography variant="body2">{review.rating}/5</Typography>
                    </Stack>
                  </Stack>

                  <Typography variant="body2" sx={{ mb: 2 }}>{review.comment}</Typography>

                  {review.teacherResponse && (
                    <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                        <Typography variant="subtitle2">Phản hồi của giảng viên</Typography>
                        <Typography variant="caption" color="text.secondary">{formatDate(review.responseDate!)}</Typography>
                      </Stack>
                      <Typography variant="body2">{review.teacherResponse}</Typography>
                    </Box>
                  )}
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
                  {!review.teacherResponse ? (
                    <Button
                      variant="contained"
                      onClick={() => {
                        setSelectedReview(review);
                        setResponseText('');
                        setShowResponseModal(true);
                      }}
                      disabled={saving}
                    >
                      Phản hồi
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outlined"
                        onClick={() => handleEditResponse(review)}
                        disabled={saving}
                      >
                        Sửa phản hồi
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteResponse(review)}
                        disabled={saving}
                      >
                        Xóa phản hồi
                      </Button>
                    </>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}

          {/* Table view below */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Danh sách đánh giá</Typography>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Học viên</TableCell>
                        <TableCell>Tiến độ</TableCell>
                        <TableCell>Điểm</TableCell>
                        <TableCell>Bình luận</TableCell>
                        <TableCell>Ngày</TableCell>
                        <TableCell>Trạng thái</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sortedReviews.map((r) => (
                        <TableRow key={r._id} hover>
                          <TableCell>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Avatar src={r.studentAvatar} sx={{ width: 28, height: 28 }} />
                              <Typography variant="body2">{r.studentName}</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>{r.studentProgress}%</TableCell>
                          <TableCell>{r.rating}/5</TableCell>
                          <TableCell sx={{ maxWidth: 420, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.comment}</TableCell>
                          <TableCell>{formatDate(r.createdAt)}</TableCell>
                          <TableCell>
                            <Chip label={r.status === 'pending' ? 'Chờ duyệt' : r.status === 'approved' ? 'Đã duyệt' : 'Đã từ chối'} size="small" color={r.status === 'approved' ? 'success' : r.status === 'pending' ? 'warning' : 'default'} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Response Dialog */}
      <Dialog open={showResponseModal && !!selectedReview} onClose={() => setShowResponseModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          {selectedReview?.responseId ? 'Sửa phản hồi' : 'Phản hồi đánh giá'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Học viên: {selectedReview?.studentName}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{selectedReview?.comment}</Typography>
          <TextField
            fullWidth
            label="Phản hồi của bạn"
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            multiline
            rows={4}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResponseModal(false)} disabled={saving}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleResponseSubmit}
            disabled={!responseText.trim() || saving}
          >
            {saving ? 'Đang gửi...' : (selectedReview?.responseId ? 'Cập nhật' : 'Gửi phản hồi')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CourseReviews;
