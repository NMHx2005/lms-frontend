import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Stack,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Paper
} from '@mui/material';
import {
  Quiz as QuizIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { getQuizHistory, QuizAttempt, QuizHistoryParams } from '@/services/client/quiz.service';
import { toast } from 'react-hot-toast';

interface CourseOption {
  _id: string;
  title: string;
}

const QuizHistory: React.FC = () => {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<QuizHistoryParams>({
    limit: 10,
    page: 1
  });
  const [courseOptions, setCourseOptions] = useState<CourseOption[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadQuizHistory();
  }, [page, rowsPerPage, filters.courseId]);

  const loadQuizHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: QuizHistoryParams = {
        ...filters,
        limit: rowsPerPage,
        page: page + 1
      };
      const response = await getQuizHistory(params);
      if (response.success && response.data) {
        setAttempts(response.data.attempts);
        setTotal(response.data.pagination.total);
        
        // Extract unique courses from attempts for filter dropdown
        if (response.data.attempts.length > 0) {
          const uniqueCourses = new Map<string, CourseOption>();
          response.data.attempts.forEach((attempt: QuizAttempt) => {
            if (attempt.courseId && typeof attempt.courseId === 'object' && '_id' in attempt.courseId) {
              const courseId = attempt.courseId._id;
              const courseTitle = attempt.courseId.title || 'Khóa học';
              if (courseId && !uniqueCourses.has(courseId)) {
                uniqueCourses.set(courseId, {
                  _id: courseId,
                  title: courseTitle
                });
              }
            }
          });
          setCourseOptions(Array.from(uniqueCourses.values()));
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Không thể tải lịch sử quiz');
    } finally {
      setLoading(false);
    }
  };

  // Load all attempts once to get course list for filter
  useEffect(() => {
    const loadAllCourses = async () => {
      try {
        const response = await getQuizHistory({ limit: 1000 });
        if (response.success && response.data && response.data.attempts.length > 0) {
          const uniqueCourses = new Map<string, CourseOption>();
          response.data.attempts.forEach((attempt: QuizAttempt) => {
            if (attempt.courseId && typeof attempt.courseId === 'object' && '_id' in attempt.courseId) {
              const courseId = attempt.courseId._id;
              const courseTitle = attempt.courseId.title || 'Khóa học';
              if (courseId && !uniqueCourses.has(courseId)) {
                uniqueCourses.set(courseId, {
                  _id: courseId,
                  title: courseTitle
                });
              }
            }
          });
          setCourseOptions(Array.from(uniqueCourses.values()));
        }
      } catch (err) {
        console.error('Error loading courses for filter:', err);
      }
    };
    loadAllCourses();
  }, []);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins} phút ${secs} giây`;
    }
    return `${secs} giây`;
  };

  const getScoreColor = (percentage: number): 'success' | 'warning' | 'error' => {
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'error';
  };

  const handleViewDetails = (attempt: QuizAttempt) => {
    // Extract courseId and lessonId
    let courseId: string | undefined;
    let lessonId: string | undefined;

    // Handle courseId - can be string or object
    if (typeof attempt.courseId === 'string') {
      courseId = attempt.courseId;
    } else if (attempt.courseId && typeof attempt.courseId === 'object' && '_id' in attempt.courseId) {
      courseId = attempt.courseId._id;
    }

    // Handle lessonId - can be string or object
    if (typeof attempt.lessonId === 'string') {
      lessonId = attempt.lessonId;
    } else if (attempt.lessonId && typeof attempt.lessonId === 'object' && '_id' in attempt.lessonId) {
      lessonId = attempt.lessonId._id;
    }

    // Navigate to learning player with lessonId in state
    if (courseId && lessonId) {
      navigate(`/learning/${courseId}`, {
        state: { lessonId, from: 'quiz-history' }
      });
    } else if (courseId) {
      // Fallback: navigate to course if lessonId is missing
      navigate(`/learning/${courseId}`);
    } else {
      console.error('Missing courseId or lessonId:', { courseId, lessonId, attempt });
      toast.error('Không thể mở chi tiết quiz');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <QuizIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Lịch sử Quiz
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Xem lại tất cả các bài quiz bạn đã làm
            </Typography>
          </Box>
        </Stack>

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <FilterListIcon color="action" />
              <Typography variant="subtitle2" fontWeight={600}>
                Bộ lọc
              </Typography>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Khóa học</InputLabel>
                <Select
                  value={filters.courseId || ''}
                  label="Khóa học"
                  onChange={(e) => {
                    setFilters({
                      ...filters,
                      courseId: e.target.value || undefined
                    });
                    setPage(0);
                  }}
                >
                  <MenuItem value="">Tất cả khóa học</MenuItem>
                  {courseOptions.map((course) => (
                    <MenuItem key={course._id} value={course._id}>
                      {course.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
          <CircularProgress />
        </Box>
      ) : attempts.length === 0 ? (
        <Card>
          <CardContent>
            <Box textAlign="center" py={6}>
              <QuizIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Chưa có lịch sử quiz
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bạn chưa làm quiz nào. Hãy bắt đầu học và làm quiz để xem lịch sử ở đây.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Quiz</TableCell>
                  <TableCell>Khóa học</TableCell>
                  <TableCell align="center">Lần làm</TableCell>
                  <TableCell align="center">Điểm</TableCell>
                  <TableCell align="center">Thời gian</TableCell>
                  <TableCell>Ngày làm</TableCell>
                  <TableCell align="center">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attempts.map((attempt) => (
                  <TableRow key={attempt._id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {attempt.lessonId?.title || 'Quiz'}
                      </Typography>
                      {attempt.lessonId?.lessonNumber && (
                        <Typography variant="caption" color="text.secondary">
                          Bài {attempt.lessonId.lessonNumber}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {attempt.courseId?.title || 'Khóa học'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={`Lần ${attempt.attemptNumber}`} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`${attempt.percentage.toFixed(0)}%`}
                        color={getScoreColor(attempt.percentage)}
                        size="small"
                        icon={
                          attempt.percentage >= 80 ? (
                            <CheckCircleIcon sx={{ fontSize: '0.875rem !important' }} />
                          ) : (
                            <CancelIcon sx={{ fontSize: '0.875rem !important' }} />
                          )
                        }
                      />
                      <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                        {attempt.score}/{attempt.totalPoints} điểm
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" alignItems="center" spacing={0.5} justifyContent="center">
                        <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {formatTime(attempt.timeSpent)}
                        </Typography>
                      </Stack>
                      {attempt.startedAt && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          Bắt đầu: {new Date(attempt.startedAt).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {attempt.submittedAt
                          ? new Date(attempt.submittedAt).toLocaleString('vi-VN', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : ''}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {attempt.submittedAt
                          ? (() => {
                              const now = new Date();
                              const submitted = new Date(attempt.submittedAt);
                              const diffMs = now.getTime() - submitted.getTime();
                              const diffMins = Math.floor(diffMs / 60000);
                              const diffHours = Math.floor(diffMs / 3600000);
                              const diffDays = Math.floor(diffMs / 86400000);
                              if (diffMins < 1) return 'Vừa xong';
                              if (diffMins < 60) return `${diffMins} phút trước`;
                              if (diffHours < 24) return `${diffHours} giờ trước`;
                              if (diffDays < 7) return `${diffDays} ngày trước`;
                              return submitted.toLocaleDateString('vi-VN');
                            })()
                          : ''}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Xem chi tiết">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleViewDetails(attempt)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Số dòng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} trong ${count !== -1 ? count : `nhiều hơn ${to}`}`
            }
          />
        </>
      )}
    </Container>
  );
};

export default QuizHistory;
