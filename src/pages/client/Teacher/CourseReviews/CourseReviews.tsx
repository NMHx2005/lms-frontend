import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
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
import { useNavigate } from 'react-router-dom';

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
}

interface CourseInfo {
  _id: string;
  title: string;
  thumbnail: string;
  totalReviews: number;
  averageRating: number;
  status: 'published' | 'draft' | 'pending';
  field: string;
  level: 'basic' | 'intermediate' | 'advanced';
  price: number;
  sections: number;
  lessons: number;
  rating: number;
}

const CourseReviews: React.FC = () => {
  const { id: courseId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [courseInfo, setCourseInfo] = useState<CourseInfo | null>(null);
  const [courses, setCourses] = useState<CourseInfo[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'progress'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedCourse, setSelectedCourse] = useState<CourseInfo | null>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockCourses: CourseInfo[] = [
        { _id: '1', title: 'React Advanced Patterns', thumbnail: '/images/course1.jpg', totalReviews: 45, averageRating: 4.8, status: 'published', field: 'Web Development', level: 'advanced', price: 299000, sections: 8, lessons: 45, rating: 4.8 },
        { _id: '2', title: 'Node.js Backend Development', thumbnail: '/images/course2.jpg', totalReviews: 32, averageRating: 4.6, status: 'published', field: 'Backend Development', level: 'intermediate', price: 249000, sections: 6, lessons: 32, rating: 4.6 },
        { _id: '3', title: 'UI/UX Design Fundamentals', thumbnail: '/images/course3.jpg', totalReviews: 0, averageRating: 0, status: 'draft', field: 'Design', level: 'basic', price: 199000, sections: 4, lessons: 24, rating: 0 },
        { _id: '4', title: 'Python Data Science', thumbnail: '/images/course4.jpg', totalReviews: 0, averageRating: 0, status: 'pending', field: 'Data Science', level: 'intermediate', price: 349000, sections: 7, lessons: 38, rating: 0 }
      ];
      setCourses(mockCourses);
      if (!selectedCourse && mockCourses.length) {
        setSelectedCourse(mockCourses[0]);
        setCourseInfo(mockCourses[0]);
      }
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    if (courseId && selectedCourse) {
      setLoading(true);
      setTimeout(() => {
        const names = [
          'Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C', 'Phạm Thị D', 'Hoàng Văn E', 'Vũ Thị F', 'Đặng Minh G', 'Bùi Thu H',
          'Phan Quốc I', 'Đỗ Kim K', 'Trịnh Gia L', 'Võ Thị M', 'Trương Công N', 'Lưu Hải P', 'Tạ Thu Q', 'Lý Minh R',
          'Đinh Hồng S', 'Ngô Nhật T', 'Cao Thảo U', 'La Bảo V', 'Tôn Nữ W', 'Chu Khánh X', 'Kiều Anh Y', 'Quách Duy Z'
        ];
        const avatars = ['/images/avatar1.jpg', '/images/avatar2.jpg', '/images/avatar3.jpg', '/images/avatar4.jpg'];
        const statuses: Array<Review['status']> = ['pending', 'approved', 'rejected'];
        const comments = [
          'Khóa học rất hữu ích và chi tiết!',
          'Một số phần hơi nhanh, mong chậm hơn.',
          'Giảng viên giảng dễ hiểu, ví dụ thực tế.',
          'Nội dung phù hợp người mới bắt đầu.',
          'Tôi đã áp dụng được vào công việc.',
          'Thiếu một vài ví dụ nâng cao.',
          'Bài tập giúp hiểu bài rất tốt.',
          'Mong có thêm tài liệu tham khảo.',
          'Khóa học tuyệt vời, cảm ơn giảng viên!',
          'Một vài video chất lượng âm thanh chưa tốt.'
        ];

        const count = 36;
        const mockReviews: Review[] = Array.from({ length: count }).map((_, idx) => {
          const name = names[idx % names.length];
          const rating = 3 + (idx % 3) + (idx % 2 ? 0 : 1); // 3-5
          const status = statuses[idx % statuses.length];
          const progress = 40 + ((idx * 7) % 61); // 40-100
          const daysAgo = 1 + (idx % 60);
          const approved = status === 'approved';
          const responseOffset = approved ? daysAgo - 1 : null;

          return {
            _id: `${idx + 1}`,
            studentId: `${idx + 1}`,
            studentName: name,
            studentAvatar: avatars[idx % avatars.length],
            studentProgress: progress > 100 ? 100 : progress,
            rating: Math.min(5, rating),
            comment: comments[idx % comments.length],
            createdAt: new Date(Date.now() - daysAgo * 24 * 3600 * 1000).toISOString(),
            status,
            teacherResponse: approved ? 'Cảm ơn bạn đã đóng góp ý kiến!' : undefined,
            responseDate: approved && responseOffset && responseOffset > 0
              ? new Date(Date.now() - responseOffset * 24 * 3600 * 1000).toISOString()
              : undefined
          };
        });

        setReviews(mockReviews);
        setLoading(false);
      }, 500);
    }
  }, [courseId, selectedCourse]);

  const handleCourseSelect = (course: CourseInfo) => {
    setSelectedCourse(course);
    setCourseInfo(course);
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setCourseInfo(null);
    setReviews([]);
  };

  const handleResponseSubmit = () => {
    if (selectedReview && responseText.trim()) {
      const updatedReviews = reviews.map(review =>
        review._id === selectedReview._id
          ? {
            ...review,
            teacherResponse: responseText,
            responseDate: new Date().toISOString(),
            status: 'approved' as const
          }
          : review
      );
      setReviews(updatedReviews);
      setShowResponseModal(false);
      setSelectedReview(null);
      setResponseText('');
    }
  };

  const getStatusColor = useCallback((status: string): 'success' | 'warning' | 'info' | 'default' => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'warning';
      case 'pending': return 'info';
      default: return 'default';
    }
  }, []);

  const getStatusText = useCallback((status: string) => {
    switch (status) {
      case 'published': return 'Đã xuất bản';
      case 'draft': return 'Bản nháp';
      case 'pending': return 'Chờ duyệt';
      default: return 'Không xác định';
    }
  }, []);

  const getLevelColor = useCallback((level: string): 'error' | 'warning' | 'info' | 'default' => {
    switch (level) {
      case 'advanced': return 'error';
      case 'intermediate': return 'warning';
      case 'basic': return 'info';
      default: return 'default';
    }
  }, []);

  const getLevelText = useCallback((level: string) => {
    switch (level) {
      case 'advanced': return 'Nâng cao';
      case 'intermediate': return 'Trung cấp';
      case 'basic': return 'Cơ bản';
      default: return 'Không xác định';
    }
  }, []);

  const formatPrice = useCallback((price: number) => new Intl.NumberFormat('vi-VN').format(price), []);
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
      if (sortBy === 'date') { aValue = new Date(a.createdAt).getTime(); bValue = new Date(b.createdAt).getTime(); }
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
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / totalReviews).toFixed(1) : 0;

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
                  {review.status === 'pending' && (
                    <Button variant="contained" onClick={() => { setSelectedReview(review); setShowResponseModal(true); }}>Phản hồi</Button>
                  )}
                  <Button variant="outlined">Xem chi tiết</Button>
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
        <DialogTitle>Phản hồi đánh giá</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Học viên: {selectedReview?.studentName}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{selectedReview?.comment}</Typography>
          <TextField fullWidth label="Phản hồi của bạn" value={responseText} onChange={(e) => setResponseText(e.target.value)} multiline rows={4} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResponseModal(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleResponseSubmit} disabled={!responseText.trim()}>Gửi phản hồi</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CourseReviews;
