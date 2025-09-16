import React, { useState, useMemo, useCallback } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Chip,
  Button,
  Tabs,
  Tab,
  TextField,
  Alert,
  Avatar,
  Divider,
  Paper,
  Grid
} from '@mui/material';
import {
  Search as SearchIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Report as ReportIcon,
  CheckCircle as CheckCircleIcon,
  Undo as UndoIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';

interface RatingAction {
  id: string;
  courseId: string;
  courseName: string;
  courseImage: string;
  actionType: 'upvotes' | 'reports';
  action: 'added' | 'removed';
  reason?: string;
  createdAt: string;
  canUndo: boolean;
}

const Ratings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'upvotes' | 'reports'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const ratingActions: RatingAction[] = [
    {
      id: '1',
      courseId: '1',
      courseName: 'React Advanced Patterns',
      courseImage: '/images/apollo.png',
      actionType: 'upvotes',
      action: 'added',
      createdAt: '2024-01-15T10:30:00Z',
      canUndo: true
    },
    {
      id: '2',
      courseId: '2',
      courseName: 'Node.js Backend Development',
      courseImage: '/images/aptech.png',
      actionType: 'upvotes',
      action: 'removed',
      createdAt: '2024-01-14T14:20:00Z',
      canUndo: false
    },
    {
      id: '3',
      courseId: '3',
      courseName: 'UI/UX Design Fundamentals',
      courseImage: '/images/codegym.png',
      actionType: 'reports',
      action: 'added',
      reason: 'Nội dung không phù hợp với lứa tuổi',
      createdAt: '2024-01-13T16:45:00Z',
      canUndo: true
    },
    {
      id: '4',
      courseId: '4',
      courseName: 'Python Data Science',
      courseImage: '/images/funix.png',
      actionType: 'upvotes',
      action: 'added',
      createdAt: '2024-01-12T08:15:00Z',
      canUndo: true
    },
    {
      id: '5',
      courseId: '5',
      courseName: 'Machine Learning Basics',
      courseImage: '/images/rikedu.png',
      actionType: 'reports',
      action: 'removed',
      reason: 'Báo cáo sai, nội dung hoàn toàn phù hợp',
      createdAt: '2024-01-11T11:30:00Z',
      canUndo: false
    },
    {
      id: '6',
      courseId: '6',
      courseName: 'Web Development Bootcamp',
      courseImage: '/images/logo.png',
      actionType: 'upvotes',
      action: 'added',
      createdAt: '2024-01-10T09:45:00Z',
      canUndo: true
    }
  ];

  const filteredActions = useMemo(() => {
    return ratingActions.filter(action => {
      const matchesTab = activeTab === 'all' || action.actionType === activeTab;
      const matchesSearch = action.courseName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [ratingActions, activeTab, searchTerm]);

  const stats = useMemo(() => {
    const totalUpvotes = ratingActions.filter(a => a.actionType === 'upvotes' && a.action === 'added').length;
    const totalReports = ratingActions.filter(a => a.actionType === 'reports' && a.action === 'added').length;
    return { totalUpvotes, totalReports };
  }, [ratingActions]);

  const getActionIcon = useCallback((actionType: string, action: string) => {
    if (actionType === 'upvotes') {
      return action === 'added' ? <ThumbUpIcon /> : <ThumbDownIcon />;
    } else {
      return action === 'added' ? <ReportIcon /> : <CheckCircleIcon />;
    }
  }, []);

  const getActionLabel = useCallback((actionType: string, action: string) => {
    if (actionType === 'upvotes') {
      return action === 'added' ? 'Đã upvote' : 'Đã bỏ upvote';
    } else {
      return action === 'added' ? 'Đã báo cáo' : 'Đã hủy báo cáo';
    }
  }, []);

  const getActionColor = useCallback((actionType: string, action: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    if (actionType === 'upvotes') {
      return action === 'added' ? 'success' : 'error';
    } else {
      return action === 'added' ? 'warning' : 'info';
    }
  }, []);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  const handleUndoAction = useCallback((actionId: string) => {
    // Mock function - in real app this would call API
    console.log('Undoing action:', actionId);
    alert('Đã hủy hành động thành công!');
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Lịch sử đánh giá & báo cáo
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Theo dõi các hoạt động đánh giá và báo cáo của bạn
        </Typography>
      </Box>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            variant="fullWidth"
          >
            <Tab
              label="Tất cả"
              value="all"
              icon={<AssessmentIcon />}
              iconPosition="start"
            />
            <Tab
              label="Upvotes"
              value="upvotes"
              icon={<ThumbUpIcon />}
              iconPosition="start"
            />
            <Tab
              label="Báo cáo"
              value="reports"
              icon={<ReportIcon />}
              iconPosition="start"
            />
          </Tabs>
        </Box>
      </Card>

      {/* Filter Bar */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
            <TextField
              fullWidth
              placeholder="Tìm kiếm theo tên khóa học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              sx={{ maxWidth: 500 }}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Paper variant="outlined" sx={{ p: 2, minWidth: 150 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <ThumbUpIcon color="success" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Tổng upvotes
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {stats.totalUpvotes}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              <Paper variant="outlined" sx={{ p: 2, minWidth: 150 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <ReportIcon color="warning" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Tổng báo cáo
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {stats.totalReports}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Rating Actions List */}
      <Card>
        <CardContent>
          {filteredActions.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <AssessmentIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Không có hoạt động nào
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bạn chưa có hoạt động đánh giá hoặc báo cáo nào hoặc không có hoạt động nào khớp với bộ lọc hiện tại.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={3}>
              {filteredActions.map((action) => (
                <Card key={action.id} variant="outlined">
                  <CardContent>
                    {/* Header */}
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
                      <Avatar
                        src={action.courseImage}
                        alt={action.courseName}
                        sx={{ width: 80, height: 60 }}
                        variant="rounded"
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          {action.courseName}
                        </Typography>
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                          <Chip
                            icon={getActionIcon(action.actionType, action.action)}
                            label={getActionLabel(action.actionType, action.action)}
                            color={getActionColor(action.actionType, action.action)}
                            size="small"
                          />
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(action.createdAt)}
                          </Typography>
                        </Stack>
                      </Box>
                      <Box>
                        {action.canUndo && (
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<UndoIcon />}
                            onClick={() => handleUndoAction(action.id)}
                          >
                            Hủy hành động
                          </Button>
                        )}
                      </Box>
                    </Stack>

                    {action.reason && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        <Alert severity="info">
                          <Typography variant="body2">
                            <strong>Lý do:</strong> {action.reason}
                          </Typography>
                        </Alert>
                      </>
                    )}

                    <Divider sx={{ my: 2 }} />

                    {/* Footer */}
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Loại:</strong> {action.actionType === 'upvotes' ? 'Upvote' : 'Báo cáo'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Hành động:</strong> {action.action === 'added' ? 'Thêm' : 'Xóa'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Có thể hủy:</strong> {action.canUndo ? 'Có' : 'Không'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default Ratings;
