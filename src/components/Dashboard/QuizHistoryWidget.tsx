import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Button,
  CircularProgress,
  Chip,
  Avatar,
  Divider
} from '@mui/material';
import {
  Quiz as QuizIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { getQuizHistory, QuizAttempt } from '@/services/client/quiz.service';

const QuizHistoryWidget: React.FC = () => {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecentAttempts = async () => {
      try {
        setLoading(true);
        const response = await getQuizHistory({ limit: 5 });
        if (response.success && response.data) {
          setAttempts(response.data.attempts);
        }
      } catch (error) {
        console.error('Error loading quiz history:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecentAttempts();
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (percentage: number): 'success' | 'warning' | 'error' => {
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'error';
  };

  if (loading) {
    return (
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: 3, height: '100%' }}>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <QuizIcon color="primary" />
            <Typography variant="h6" fontWeight={700}>
              Lịch sử Quiz
            </Typography>
          </Stack>
          <Button
            component={Link}
            to="/dashboard/quiz-history"
            variant="text"
            size="small"
            endIcon={<ArrowForwardIcon />}
          >
            Xem tất cả
          </Button>
        </Stack>

        {attempts.length === 0 ? (
          <Box textAlign="center" py={4}>
            <QuizIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Bạn chưa làm quiz nào
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {attempts.map((attempt) => (
              <Box key={attempt._id}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Avatar
                    sx={{
                      bgcolor: getScoreColor(attempt.percentage) === 'success' ? 'success.light' :
                               getScoreColor(attempt.percentage) === 'warning' ? 'warning.light' : 'error.light',
                      width: 40,
                      height: 40
                    }}
                  >
                    {attempt.percentage >= 80 ? (
                      <CheckCircleIcon fontSize="small" />
                    ) : (
                      <CancelIcon fontSize="small" />
                    )}
                  </Avatar>
                  <Box flex={1} minWidth={0}>
                    <Typography variant="subtitle2" fontWeight={600} noWrap>
                      {attempt.lessonId?.title || 'Quiz'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {attempt.courseId?.title || 'Khóa học'}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 0.5 }} flexWrap="wrap">
                      <Chip
                        label={`${attempt.percentage.toFixed(0)}%`}
                        size="small"
                        color={getScoreColor(attempt.percentage)}
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                      <Chip
                        icon={<AccessTimeIcon sx={{ fontSize: '0.875rem !important' }} />}
                        label={formatTime(attempt.timeSpent)}
                        size="small"
                        variant="outlined"
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                    </Stack>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      {attempt.submittedAt
                        ? new Date(attempt.submittedAt).toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : ''}
                    </Typography>
                  </Box>
                </Stack>
                {attempts.indexOf(attempt) < attempts.length - 1 && <Divider sx={{ mt: 2 }} />}
              </Box>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default QuizHistoryWidget;
