import React, { useState, useEffect, useCallback } from 'react';
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
  Checkbox,
  Paper,
  TablePagination,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import RefreshIcon from '@mui/icons-material/Refresh';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {
  AIEvaluation,
  AIEvaluationStats,
  AIEvaluationFilters,
  getEvaluationStatistics,
  getAllEvaluations,
  submitAdminReview,
  retryAIEvaluation,
  bulkApproveEvaluations,
  exportEvaluations
} from '../../../services/admin';

const AIModeration: React.FC = () => {
  // ========== STATE ==========
  const [evaluations, setEvaluations] = useState<AIEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<AIEvaluationStats | null>(null);

  // Filters and pagination
  const [filters, setFilters] = useState<AIEvaluationFilters>({
    search: '',
    contentType: 'all',
    riskLevel: 'all',
    status: 'all',
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [totalEvaluations, setTotalEvaluations] = useState(0);

  // UI state
  const [selectedEvaluations, setSelectedEvaluations] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState<AIEvaluation | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  // Snackbar
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({ open: false, message: '', severity: 'success' });

  // ========== DATA LOADING ==========
  const loadStats = useCallback(async () => {
    try {
      const response = await getEvaluationStatistics();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error: any) {
      console.error('Error loading stats:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Lỗi khi tải thống kê',
        severity: 'error'
      });
    }
  }, []);

  const loadEvaluations = useCallback(async () => {
    try {
      setRefreshing(true);
      const apiFilters: AIEvaluationFilters = {
        ...filters,
        contentType: filters.contentType === 'all' ? undefined : filters.contentType,
        riskLevel: filters.riskLevel === 'all' ? undefined : filters.riskLevel,
        status: filters.status === 'all' ? undefined : filters.status
      };

      const response = await getAllEvaluations(apiFilters);
      if (response.success) {
        setEvaluations(Array.isArray(response.data) ? response.data : []);
        setTotalEvaluations(response.pagination?.total || 0);
      }
    } catch (error: any) {
      console.error('Error loading evaluations:', error);
      setEvaluations([]);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Lỗi khi tải đánh giá AI',
        severity: 'error'
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filters]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadEvaluations();
  }, [loadEvaluations]);

  // ========== HANDLERS ==========
  const handleFilterChange = (key: keyof AIEvaluationFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (_event: unknown, newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage + 1 }));
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, limit: parseInt(event.target.value, 10), page: 1 }));
  };

  const handleRefresh = () => {
    loadStats();
    loadEvaluations();
  };

  const handleEvaluationSelection = (evaluationId: string) => {
    setSelectedEvaluations(prev =>
      prev.includes(evaluationId)
        ? prev.filter(id => id !== evaluationId)
        : [...prev, evaluationId]
    );
  };

  // Select all evaluations (future feature)
  // const handleSelectAll = () => {
  //   if (selectedEvaluations.length === evaluations.length) {
  //     setSelectedEvaluations([]);
  //   } else {
  //     setSelectedEvaluations(evaluations.map(e => e._id));
  //   }
  // };

  const handleOpenReview = (evaluation: AIEvaluation, _decision: 'approve' | 'reject') => {
    setCurrentEvaluation(evaluation);
    setReviewNotes('');
    setShowReviewDialog(true);
  };

  const handleSubmitReview = async (decision: 'approve' | 'reject') => {
    if (!currentEvaluation) return;

    try {
      const response = await submitAdminReview(currentEvaluation._id, {
        decision,
        notes: reviewNotes
      });

      if (response.success) {
        setSnackbar({
          open: true,
          message: `Đã ${decision === 'approve' ? 'phê duyệt' : 'từ chối'} thành công`,
          severity: 'success'
        });
        setShowReviewDialog(false);
        loadEvaluations();
        loadStats();
      }
    } catch (error: any) {
      console.error('Error submitting review:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Lỗi khi gửi đánh giá',
        severity: 'error'
      });
    }
  };

  const handleRetry = async (evaluationId: string) => {
    try {
      const response = await retryAIEvaluation(evaluationId);
      if (response.success) {
        setSnackbar({
          open: true,
          message: 'Đã thử lại đánh giá AI thành công',
          severity: 'success'
        });
        loadEvaluations();
      }
    } catch (error: any) {
      console.error('Error retrying evaluation:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Lỗi khi thử lại đánh giá',
        severity: 'error'
      });
    }
  };

  const handleBulkApprove = async () => {
    try {
      const response = await bulkApproveEvaluations({
        evaluationIds: selectedEvaluations
      });

      if (response.success) {
        setSnackbar({
          open: true,
          message: `Đã phê duyệt ${response.data.approved} đánh giá`,
          severity: 'success'
        });
        setSelectedEvaluations([]);
        loadEvaluations();
        loadStats();
      }
    } catch (error: any) {
      console.error('Error bulk approving:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Lỗi khi phê duyệt hàng loạt',
        severity: 'error'
      });
    }
  };

  const handleExport = async () => {
    try {
      const apiFilters: AIEvaluationFilters = {
        ...filters,
        contentType: filters.contentType === 'all' ? undefined : filters.contentType,
        riskLevel: filters.riskLevel === 'all' ? undefined : filters.riskLevel,
        status: filters.status === 'all' ? undefined : filters.status
      };

      const blob = await exportEvaluations(apiFilters);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ai-evaluations-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSnackbar({
        open: true,
        message: 'Xuất file thành công',
        severity: 'success'
      });
    } catch (error: any) {
      console.error('Error exporting:', error);
      setSnackbar({
        open: true,
        message: 'Lỗi khi xuất file',
        severity: 'error'
      });
    }
  };

  // ========== HELPER FUNCTIONS ==========
  const formatDate = (dateString: string) => new Date(dateString).toLocaleString('vi-VN');

  const getRiskLabel = (risk: string) => {
    const labels: Record<string, string> = {
      low: 'Thấp',
      medium: 'Trung bình',
      high: 'Cao'
    };
    return labels[risk] || risk;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'auto-approved': 'Tự động phê duyệt',
      'auto-rejected': 'Tự động từ chối',
      'pending': 'Chờ xem xét',
      'reviewed': 'Đã xem xét'
    };
    return labels[status] || status;
  };

  // ========== RENDER ==========
  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">Đang tải dữ liệu AI Moderation...</Typography>
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
              <Typography variant="h5" fontWeight={800}>AI Moderation</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Quản lý nội dung tự động với AI, phát hiện và xử lý nội dung không phù hợp</Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button variant="contained" color="inherit" startIcon={<RefreshIcon />} sx={{ color: '#111827' }} onClick={handleRefresh} disabled={refreshing}>
                {refreshing ? 'Đang tải...' : 'Làm mới'}
              </Button>
              <Button variant="contained" color="inherit" startIcon={<FileDownloadIcon />} sx={{ color: '#111827' }} onClick={handleExport}>
                Xuất CSV
              </Button>
              <Button variant="contained" color="inherit" startIcon={<SettingsIcon />} sx={{ color: '#111827' }} onClick={() => setShowSettings(!showSettings)}>
                Cài đặt AI
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Stats */}
      {stats && (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">Đã xử lý</Typography>
                  <Typography variant="h4" fontWeight={700}>{stats.totalProcessed?.toLocaleString() || 0}</Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">Bị đánh dấu</Typography>
                  <Typography variant="h4" fontWeight={700} color="warning.main">{stats.flaggedContent || 0}</Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">Tự động duyệt</Typography>
                  <Typography variant="h4" fontWeight={700} color="success.main">{stats.autoApproved || 0}</Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">Độ chính xác</Typography>
                  <Typography variant="h4" fontWeight={700} color="info.main">{stats.accuracy || 0}%</Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <Paper sx={{ p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2}>Cài đặt AI Moderation</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField type="number" label="Độ tin cậy tối thiểu (%)" defaultValue={80} inputProps={{ min: 50, max: 100, step: 1 }} fullWidth />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Tự động từ chối rủi ro</InputLabel>
                <Select label="Tự động từ chối rủi ro" defaultValue="high" MenuProps={{ disableScrollLock: true }}>
                  <MenuItem value="low">Thấp</MenuItem>
                  <MenuItem value="medium">Trung bình</MenuItem>
                  <MenuItem value="high">Cao</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Filters */}
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm nội dung..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <FormControl fullWidth>
              <InputLabel>Loại nội dung</InputLabel>
              <Select label="Loại nội dung" value={filters.contentType} onChange={(e) => handleFilterChange('contentType', e.target.value)} MenuProps={{ disableScrollLock: true }}>
                <MenuItem value="all">Tất cả loại</MenuItem>
                <MenuItem value="course">Khóa học</MenuItem>
                <MenuItem value="comment">Bình luận</MenuItem>
                <MenuItem value="review">Đánh giá</MenuItem>
                <MenuItem value="assignment">Bài tập</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <FormControl fullWidth>
              <InputLabel>Mức rủi ro</InputLabel>
              <Select label="Mức rủi ro" value={filters.riskLevel} onChange={(e) => handleFilterChange('riskLevel', e.target.value)} MenuProps={{ disableScrollLock: true }}>
                <MenuItem value="all">Tất cả mức</MenuItem>
                <MenuItem value="low">Thấp</MenuItem>
                <MenuItem value="medium">Trung bình</MenuItem>
                <MenuItem value="high">Cao</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select label="Trạng thái" value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)} MenuProps={{ disableScrollLock: true }}>
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="pending">Chờ xem xét</MenuItem>
                <MenuItem value="auto-approved">Tự động phê duyệt</MenuItem>
                <MenuItem value="auto-rejected">Tự động từ chối</MenuItem>
                <MenuItem value="reviewed">Đã xem xét</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Bulk Actions */}
      {selectedEvaluations.length > 0 && (
        <Paper sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography>{selectedEvaluations.length} mục được chọn</Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="contained" color="success" onClick={handleBulkApprove}>Phê duyệt hàng loạt</Button>
            <Button variant="outlined" onClick={() => setSelectedEvaluations([])}>Bỏ chọn</Button>
          </Stack>
        </Paper>
      )}

      {/* Results List */}
      <Grid container spacing={2}>
        {evaluations.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>Không có kết quả nào</Typography>
              <Typography variant="body2" color="text.secondary">Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</Typography>
            </Paper>
          </Grid>
        ) : (
          evaluations.map(evaluation => (
            <Grid key={evaluation._id} item xs={12}>
              <Card>
                <CardContent>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }}>
                    <Checkbox
                      checked={selectedEvaluations.includes(evaluation._id)}
                      onChange={() => handleEvaluationSelection(evaluation._id)}
                    />
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 220 }}>
                      <Chip label={evaluation.contentType} color="primary" variant="outlined" />
                      <Chip label={evaluation.contentId} variant="outlined" size="small" />
                      <Chip label={`${Math.round(evaluation.confidence * 100)}%`} size="small" />
                    </Stack>
                    <Box sx={{ flex: 1 }}>
                      <Typography>{evaluation.content}</Typography>
                      <Stack direction="row" spacing={1} mt={1}>
                        {evaluation.categories.map(category => (
                          <Chip key={category} size="small" variant="outlined" label={category} />
                        ))}
                      </Stack>
                    </Box>
                    <Stack spacing={1} sx={{ minWidth: 200 }}>
                      <Chip
                        label={getRiskLabel(evaluation.riskLevel)}
                        color={evaluation.riskLevel === 'high' ? 'error' : evaluation.riskLevel === 'medium' ? 'warning' : 'success'}
                        variant="filled"
                      />
                      <Chip
                        label={getStatusLabel(evaluation.status)}
                        color={evaluation.status === 'auto-approved' ? 'success' : evaluation.status === 'auto-rejected' ? 'error' : evaluation.status === 'pending' ? 'warning' : 'info'}
                        variant="filled"
                      />
                      <Typography variant="body2" color="text.secondary">{formatDate(evaluation.processedAt)}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      {evaluation.status === 'pending' && (
                        <>
                          <Button variant="contained" color="success" onClick={() => handleOpenReview(evaluation, 'approve')}>
                            Phê duyệt
                          </Button>
                          <Button variant="outlined" color="error" onClick={() => handleOpenReview(evaluation, 'reject')}>
                            Từ chối
                          </Button>
                        </>
                      )}
                      {evaluation.status === 'auto-rejected' && (
                        <Button variant="outlined" onClick={() => handleRetry(evaluation._id)}>
                          Thử lại
                        </Button>
                      )}
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Pagination */}
      {totalEvaluations > 0 && (
        <Paper sx={{ borderRadius: 2 }}>
          <TablePagination
            component="div"
            count={totalEvaluations}
            page={filters.page! - 1}
            onPageChange={handlePageChange}
            rowsPerPage={filters.limit!}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Số dòng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
          />
        </Paper>
      )}

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onClose={() => setShowReviewDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Xem xét đánh giá AI</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="body2">Nội dung: {currentEvaluation?.content}</Typography>
            <TextField
              multiline
              rows={4}
              label="Ghi chú (tùy chọn)"
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReviewDialog(false)}>Hủy</Button>
          <Button variant="contained" color="error" onClick={() => handleSubmitReview('reject')}>
            Từ chối
          </Button>
          <Button variant="contained" color="success" onClick={() => handleSubmitReview('approve')}>
            Phê duyệt
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AIModeration;
