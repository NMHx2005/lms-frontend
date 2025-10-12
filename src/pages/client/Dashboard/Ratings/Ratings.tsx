import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ratingService, CourseRating, RatingStats } from '@/services/client/rating.service';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Chip,
  Button,
  TextField,
  Alert,
  Avatar,
  Grid,
  Rating,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  RateReview as ReviewIcon,
  TrendingUp as TrendingUpIcon,
  Close as CloseIcon,
  Visibility as VisibilityIcon,
  Assessment as AssessmentIcon,
  Search as SearchIcon
} from '@mui/icons-material';

interface EligibleCourse {
  _id: string;
  title: string;
  thumbnail?: string;
  enrollmentId: string;
}

const Ratings: React.FC = () => {
  const [reviews, setReviews] = useState<CourseRating[]>([]);
  const [stats, setStats] = useState<RatingStats | null>(null);
  const [eligibleCourses, setEligibleCourses] = useState<EligibleCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Create dialog state
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    courseId: '',
    rating: 5,
    title: '',
    content: '',
    isPublic: true
  });

  // Edit dialog state
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingReview, setEditingReview] = useState<CourseRating | null>(null);
  const [editFormData, setEditFormData] = useState({
    rating: 5,
    title: '',
    content: '',
    isPublic: true
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    if (reviews.length >= 0) {
      fetchEligibleCourses();
    }
  }, [reviews.length]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      const [reviewsResponse, statsResponse] = await Promise.all([
        ratingService.getMyReviews({ limit: 100 }),
        ratingService.getMyReviewStats()
      ]);

      if (reviewsResponse.success) {
        setReviews(reviewsResponse.data || []);
      }

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || 'Failed to load reviews';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchEligibleCourses = async () => {
    try {
      // Get enrolled courses
      const { clientAuthService } = await import('@/services/client/auth.service');
      const enrollmentsResponse = await clientAuthService.getEnrolledCourses({ limit: 100 });

      if (enrollmentsResponse.success && enrollmentsResponse.data?.enrollments) {
        const enrollments = enrollmentsResponse.data.enrollments;

        // Filter out courses that already have reviews
        const reviewedCourseIds = new Set(reviews.map(r =>
          typeof r.courseId === 'object' ? r.courseId._id : r.courseId
        ));

        const eligible = enrollments
          .filter((e: any) => {
            const courseId = e.courseId?._id;
            // Only include ACTIVE enrollments that haven't been reviewed
            return (
              courseId &&
              e.isActive === true &&           // ✅ Must be active (not refunded)
              !reviewedCourseIds.has(courseId) // ✅ Not already reviewed
            );
          })
          .map((e: any) => ({
            _id: e.courseId._id,
            title: e.courseId.title,
            thumbnail: e.courseId.thumbnail,
            enrollmentId: e._id
          }));

        setEligibleCourses(eligible);
      }
    } catch (err: any) {
      console.error('Error fetching eligible courses:', err);
    }
  };

  const handleEditClick = (review: CourseRating) => {
    setEditingReview(review);
    setEditFormData({
      rating: review.rating,
      title: review.title || '',
      content: review.content || review.review || '',
      isPublic: review.isPublic
    });
    setShowEditDialog(true);
  };

  const handleCreateReview = async () => {
    if (!createFormData.courseId) {
      toast.error('Vui lòng chọn khóa học');
      return;
    }

    if (!createFormData.title || createFormData.title.length < 5 || createFormData.title.length > 200) {
      toast.error('Tiêu đề phải từ 5-200 ký tự');
      return;
    }

    if (!createFormData.content || createFormData.content.length < 10 || createFormData.content.length > 2000) {
      toast.error('Nội dung phải từ 10-2000 ký tự');
      return;
    }

    if (createFormData.rating < 1 || createFormData.rating > 5) {
      toast.error('Rating phải từ 1-5 sao');
      return;
    }

    try {
      const loadingToast = toast.loading('Đang tạo đánh giá...');
      const response = await ratingService.createReview(createFormData.courseId, {
        rating: createFormData.rating,
        title: createFormData.title,
        content: createFormData.content,
        isPublic: createFormData.isPublic
      });

      toast.dismiss(loadingToast);

      if (response.success) {
        toast.success('Tạo đánh giá thành công!');
        setShowCreateDialog(false);
        setCreateFormData({ courseId: '', rating: 5, title: '', content: '', isPublic: true });
        fetchReviews();
        fetchEligibleCourses();
      }
    } catch (err: any) {
      toast.dismiss();
      toast.error(err?.response?.data?.error || 'Failed to create review');
    }
  };

  const handleUpdateReview = async () => {
    if (!editingReview) return;

    if (!editFormData.title || editFormData.title.length < 5 || editFormData.title.length > 200) {
      toast.error('Tiêu đề phải từ 5-200 ký tự');
      return;
    }

    if (!editFormData.content || editFormData.content.length < 10 || editFormData.content.length > 2000) {
      toast.error('Nội dung phải từ 10-2000 ký tự');
      return;
    }

    if (editFormData.rating < 1 || editFormData.rating > 5) {
      toast.error('Rating phải từ 1-5 sao');
      return;
    }

    try {
      const loadingToast = toast.loading('Đang cập nhật đánh giá...');
      const response = await ratingService.updateReview(editingReview._id, {
        rating: editFormData.rating,
        title: editFormData.title,
        content: editFormData.content,
        isPublic: editFormData.isPublic
      });

      toast.dismiss(loadingToast);

      if (response.success) {
        toast.success('Cập nhật đánh giá thành công!');
        setShowEditDialog(false);
        setEditingReview(null);
        fetchReviews();
      }
    } catch (err: any) {
      toast.dismiss();
      toast.error(err?.response?.data?.error || 'Failed to update review');
    }
  };

  const filteredReviews = useMemo(() => {
    if (!searchTerm) return reviews;

    const searchLower = searchTerm.toLowerCase();
    return reviews.filter(r =>
      (typeof r.courseId === 'object' && r.courseId.title?.toLowerCase().includes(searchLower)) ||
      r.title?.toLowerCase().includes(searchLower) ||
      r.content?.toLowerCase().includes(searchLower) ||
      r.review?.toLowerCase().includes(searchLower)
    );
  }, [reviews, searchTerm]);

  const handleDeleteReview = async (reviewId: string, courseName: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa đánh giá cho khóa học "${courseName}"?`)) {
      return;
    }

    try {
      const loadingToast = toast.loading('Đang xóa đánh giá...');
      const response = await ratingService.deleteReview(reviewId);

      toast.dismiss(loadingToast);

      if (response.success) {
        toast.success('Xóa đánh giá thành công!');
        fetchReviews();
      }
    } catch (err: any) {
      toast.dismiss();
      toast.error(err?.response?.data?.error || 'Failed to delete review');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" alignItems="center" justifyContent="center" minHeight={400}>
          <Stack spacing={2} alignItems="center">
            <CircularProgress size={60} />
            <Typography variant="h6">Đang tải dữ liệu...</Typography>
          </Stack>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6">Đã xảy ra lỗi</Typography>
          <Typography>{error}</Typography>
        </Alert>
        <Button variant="contained" onClick={fetchReviews}>
          🔄 Thử lại
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
              Đánh giá của tôi
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Quản lý các đánh giá bạn đã viết cho khóa học
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<ReviewIcon />}
            onClick={() => setShowCreateDialog(true)}
            disabled={eligibleCourses.length === 0}
          >
            Tạo đánh giá
          </Button>
        </Stack>
      </Box>

      {/* Stats */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, border: (t) => `1px solid ${t.palette.divider}` }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: 'primary.light', width: 60, height: 60 }}>
                    <ReviewIcon sx={{ color: 'primary.main' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={800}>{stats.totalReviews}</Typography>
                    <Typography color="text.secondary" variant="body2">Tổng đánh giá</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, border: (t) => `1px solid ${t.palette.divider}` }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: 'warning.light', width: 60, height: 60 }}>
                    <StarIcon sx={{ color: 'warning.main' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={800}>
                      {stats.averageRating.toFixed(1)}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">Trung bình</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, border: (t) => `1px solid ${t.palette.divider}` }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: 'success.light', width: 60, height: 60 }}>
                    <TrendingUpIcon sx={{ color: 'success.main' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={800}>{stats.helpfulVotesReceived}</Typography>
                    <Typography color="text.secondary" variant="body2">Hữu ích</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, border: (t) => `1px solid ${t.palette.divider}` }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: 'info.light', width: 60, height: 60 }}>
                    <AssessmentIcon sx={{ color: 'info.main' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={800}>{stats.coursesReviewed}</Typography>
                    <Typography color="text.secondary" variant="body2">Khóa học</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Search */}
      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Tìm kiếm theo tên khóa học hoặc nội dung đánh giá..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
        </CardContent>
      </Card>

      {/* Reviews List */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Danh sách đánh giá ({filteredReviews.length})
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Quản lý tất cả đánh giá bạn đã viết
          </Typography>

          {filteredReviews.length === 0 ? (
            <Box textAlign="center" py={8}>
              <ReviewIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Không có đánh giá nào
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {searchTerm
                  ? 'Không tìm thấy đánh giá phù hợp'
                  : 'Bạn chưa đánh giá khóa học nào'}
              </Typography>
              {!searchTerm && eligibleCourses.length > 0 && (
                <Alert severity="info" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
                  Bạn có {eligibleCourses.length} khóa học có thể đánh giá
                </Alert>
              )}
              {!searchTerm && (
                <Stack direction="row" spacing={2} justifyContent="center">
                  {eligibleCourses.length > 0 ? (
                    <Button
                      variant="contained"
                      onClick={() => setShowCreateDialog(true)}
                      startIcon={<ReviewIcon />}
                    >
                      Tạo đánh giá ngay
                    </Button>
                  ) : (
                    <Button
                      component={Link}
                      to="/dashboard/courses"
                      variant="contained"
                      startIcon={<StarIcon />}
                    >
                      Xem khóa học của tôi
                    </Button>
                  )}
                </Stack>
              )}
            </Box>
          ) : (
            <Stack spacing={3}>
              {filteredReviews.map((review) => (
                <Card key={review._id} variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Grid container spacing={3}>
                      {/* Course Info */}
                      <Grid item xs={12} md={3}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          {typeof review.courseId === 'object' && review.courseId.thumbnail && (
                            <Avatar
                              src={review.courseId.thumbnail}
                              variant="rounded"
                              sx={{ width: 80, height: 80 }}
                            />
                          )}
                          <Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {typeof review.courseId === 'object' ? review.courseId.title : 'N/A'}
                            </Typography>
                            <Button
                              component={Link}
                              to={`/courses/${typeof review.courseId === 'object' ? review.courseId._id : ''}`}
                              size="small"
                              startIcon={<VisibilityIcon />}
                            >
                              Xem khóa học
                            </Button>
                          </Box>
                        </Stack>
                      </Grid>

                      {/* Rating & Review */}
                      <Grid item xs={12} md={6}>
                        <Stack spacing={1}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Rating value={review.rating} readOnly size="small" />
                            <Typography variant="body2" fontWeight={600}>
                              {review.rating}/5
                            </Typography>
                            <Chip
                              label={review.isPublic ? 'Công khai' : 'Riêng tư'}
                              size="small"
                              color={review.isPublic ? 'success' : 'default'}
                              variant="outlined"
                            />
                          </Stack>

                          {review.title && (
                            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                              {review.title}
                            </Typography>
                          )}

                          {(review.content || review.review) && (
                            <Typography variant="body2" color="text.secondary" sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}>
                              {review.content || review.review}
                            </Typography>
                          )}

                          <Typography variant="caption" color="text.secondary">
                            Đánh giá: {formatDate(review.createdAt)}
                            {review.updatedAt !== review.createdAt && ` • Sửa: ${formatDate(review.updatedAt)}`}
                          </Typography>

                          {review.helpfulCount > 0 && (
                            <Chip
                              icon={<TrendingUpIcon />}
                              label={`${review.helpfulCount} người thấy hữu ích`}
                              size="small"
                              variant="outlined"
                              color="success"
                            />
                          )}
                        </Stack>
                      </Grid>

                      {/* Actions */}
                      <Grid item xs={12} md={3}>
                        <Stack spacing={1}>
                          <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={() => handleEditClick(review)}
                            fullWidth
                          >
                            Chỉnh sửa
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDeleteReview(
                              review._id,
                              typeof review.courseId === 'object' ? review.courseId.title : ''
                            )}
                            fullWidth
                          >
                            Xóa
                          </Button>
                        </Stack>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>

      {/* Create Review Dialog */}
      <Dialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight={700}>Tạo đánh giá mới</Typography>
            <IconButton onClick={() => setShowCreateDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3}>
            <FormControl fullWidth required>
              <InputLabel>Chọn khóa học</InputLabel>
              <Select
                value={createFormData.courseId}
                onChange={(e) => setCreateFormData({ ...createFormData, courseId: e.target.value })}
                label="Chọn khóa học"
              >
                {eligibleCourses.map((course) => (
                  <MenuItem key={course._id} value={course._id}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      {course.thumbnail && (
                        <Avatar src={course.thumbnail} variant="rounded" />
                      )}
                      <Typography>{course.title}</Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Đánh giá sao *
              </Typography>
              <Rating
                value={createFormData.rating}
                onChange={(_, newValue) => setCreateFormData({ ...createFormData, rating: newValue || 5 })}
                size="large"
              />
            </Box>

            <TextField
              fullWidth
              required
              label="Tiêu đề đánh giá"
              value={createFormData.title}
              onChange={(e) => setCreateFormData({ ...createFormData, title: e.target.value })}
              placeholder="Ví dụ: Khóa học rất bổ ích"
              inputProps={{ maxLength: 200 }}
              helperText={`${createFormData.title.length}/200 ký tự (tối thiểu 5)`}
              error={createFormData.title.length > 0 && createFormData.title.length < 5}
            />

            <TextField
              fullWidth
              required
              multiline
              rows={4}
              label="Nội dung đánh giá"
              value={createFormData.content}
              onChange={(e) => setCreateFormData({ ...createFormData, content: e.target.value })}
              placeholder="Chia sẻ trải nghiệm chi tiết của bạn về khóa học..."
              inputProps={{ maxLength: 2000 }}
              helperText={`${createFormData.content.length}/2000 ký tự (tối thiểu 10)`}
              error={createFormData.content.length > 0 && createFormData.content.length < 10}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={createFormData.isPublic}
                  onChange={(e) => setCreateFormData({ ...createFormData, isPublic: e.target.checked })}
                />
              }
              label="Hiển thị công khai"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleCreateReview}>
            Tạo đánh giá
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onClose={() => setShowEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight={700}>Chỉnh sửa đánh giá</Typography>
            <IconButton onClick={() => setShowEditDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3}>
            {editingReview && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Khóa học
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {typeof editingReview.courseId === 'object' ? editingReview.courseId.title : 'N/A'}
                </Typography>
              </Box>
            )}

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Đánh giá sao
              </Typography>
              <Rating
                value={editFormData.rating}
                onChange={(_, newValue) => setEditFormData({ ...editFormData, rating: newValue || 5 })}
                size="large"
              />
            </Box>

            <TextField
              fullWidth
              required
              label="Tiêu đề đánh giá"
              value={editFormData.title}
              onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
              placeholder="Ví dụ: Khóa học rất bổ ích"
              inputProps={{ maxLength: 200 }}
              helperText={`${editFormData.title.length}/200 ký tự (tối thiểu 5)`}
              error={editFormData.title.length > 0 && editFormData.title.length < 5}
            />

            <TextField
              fullWidth
              required
              multiline
              rows={4}
              label="Nội dung đánh giá"
              value={editFormData.content}
              onChange={(e) => setEditFormData({ ...editFormData, content: e.target.value })}
              placeholder="Chia sẻ trải nghiệm chi tiết của bạn về khóa học..."
              inputProps={{ maxLength: 2000 }}
              helperText={`${editFormData.content.length}/2000 ký tự (tối thiểu 10)`}
              error={editFormData.content.length > 0 && editFormData.content.length < 10}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={editFormData.isPublic}
                  onChange={(e) => setEditFormData({ ...editFormData, isPublic: e.target.checked })}
                />
              }
              label="Hiển thị công khai"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEditDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleUpdateReview}>
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Ratings;
