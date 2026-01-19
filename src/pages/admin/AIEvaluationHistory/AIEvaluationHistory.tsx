import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  CircularProgress,
  Paper,
  Avatar
} from '@mui/material';
import {
  SmartToy as RobotIcon,
  History as HistoryIcon,
  Visibility as EyeIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Sync as SyncIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import api from '../../../services/api';
import { toast } from 'react-hot-toast';

interface Evaluation {
  _id: string;
  courseId: {
    _id: string;
    title: string;
    thumbnail: string;
  };
  submittedBy: {
    userId: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  status: string;
  aiAnalysis?: {
    overallScore: number;
    contentQuality: { score: number };
    structureQuality: { score: number };
    educationalValue: { score: number };
    completeness: { score: number };
  };
  adminReview?: {
    decision: string;
    reviewedAt?: Date;
    adminFeedback?: string;
  };
  submittedAt: Date;
  processingTime?: number;
}

const AIEvaluationHistory: React.FC = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [decisionFilter, setDecisionFilter] = useState('');
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  useEffect(() => {
    loadEvaluations();
  }, [page, rowsPerPage, statusFilter, decisionFilter]);

  const loadEvaluations = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: page + 1,
        limit: rowsPerPage
      };
      if (statusFilter) params.status = statusFilter;
      if (decisionFilter) params.decision = decisionFilter;

      const response = await api.get('/admin/ai-management/evaluations', { params });
      setEvaluations(response.data.data);
      setTotal(response.data.pagination.total);
    } catch (error: any) {
      toast.error('Không thể tải lịch sử đánh giá');
    } finally {
      setLoading(false);
    }
  };

  const viewDetails = async (evaluation: Evaluation) => {
    try {
      const response = await api.get(`/admin/ai-management/evaluations/${evaluation._id}`);
      setSelectedEvaluation(response.data.data);
      setDetailModalOpen(true);
    } catch (error: any) {
      toast.error('Không thể tải chi tiết đánh giá');
    }
  };

  const getStatusChip = (status: string) => {
    const statusConfig: Record<string, { color: any; icon: any; text: string }> = {
      processing: { color: 'info', icon: <SyncIcon fontSize="small" />, text: 'Đang xử lý' },
      ai_completed: { color: 'warning', icon: <WarningIcon fontSize="small" />, text: 'Cần review' },
      completed: { color: 'success', icon: <CheckCircleIcon fontSize="small" />, text: 'Hoàn thành' },
      failed: { color: 'error', icon: <CancelIcon fontSize="small" />, text: 'Thất bại' }
    };
    const config = statusConfig[status] || statusConfig.processing;
    return <Chip label={config.text} color={config.color} size="small" icon={config.icon} />;
  };

  const getDecisionChip = (decision?: string) => {
    if (!decision || decision === 'pending') return <Chip label="Chờ review" size="small" />;

    const decisionConfig: Record<string, { color: any; text: string }> = {
      approved: { color: 'success', text: 'Đã duyệt' },
      rejected: { color: 'error', text: 'Từ chối' },
      needs_revision: { color: 'warning', text: 'Cần chỉnh sửa' }
    };
    const config = decisionConfig[decision] || { color: 'default', text: decision };
    return <Chip label={config.text} color={config.color} size="small" />;
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <RobotIcon fontSize="large" /> Lịch sử đánh giá AI
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Theo dõi và xem lại các đánh giá khóa học bằng AI
        </Typography>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box display="flex" gap={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={statusFilter}
              label="Trạng thái"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="processing">Đang xử lý</MenuItem>
              <MenuItem value="ai_completed">Cần review</MenuItem>
              <MenuItem value="completed">Hoàn thành</MenuItem>
              <MenuItem value="failed">Thất bại</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Quyết định</InputLabel>
            <Select
              value={decisionFilter}
              label="Quyết định"
              onChange={(e) => setDecisionFilter(e.target.value)}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="approved">Đã duyệt</MenuItem>
              <MenuItem value="rejected">Từ chối</MenuItem>
              <MenuItem value="needs_revision">Cần chỉnh sửa</MenuItem>
            </Select>
          </FormControl>

          <Button
            startIcon={<RefreshIcon />}
            onClick={loadEvaluations}
            variant="outlined"
          >
            Làm mới
          </Button>
        </Box>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Khóa học</TableCell>
              <TableCell>Giảng viên</TableCell>
              <TableCell align="center">Điểm AI</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Quyết định</TableCell>
              <TableCell>Ngày nộp</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : evaluations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                  <Typography color="text.secondary">
                    Không có dữ liệu
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              evaluations.map((evaluation) => (
                <TableRow key={evaluation._id}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar
                        src={evaluation.courseId.thumbnail}
                        alt={evaluation.courseId.title}
                        variant="rounded"
                        sx={{ width: 40, height: 40 }}
                      />
                      <Typography variant="body2">
                        {evaluation.courseId.title}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {evaluation.submittedBy.userId.firstName} {evaluation.submittedBy.userId.lastName}
                  </TableCell>
                  <TableCell align="center">
                    {evaluation.aiAnalysis ? (
                      <Box display="flex" flexDirection="column" alignItems="center">
                        <CircularProgress
                          variant="determinate"
                          value={evaluation.aiAnalysis.overallScore}
                          size={50}
                          sx={{
                            color: evaluation.aiAnalysis.overallScore >= 80 ? 'success.main' :
                                   evaluation.aiAnalysis.overallScore >= 70 ? 'warning.main' : 'error.main'
                          }}
                        />
                        <Typography variant="caption">
                          {evaluation.aiAnalysis.overallScore}/100
                        </Typography>
                      </Box>
                    ) : '-'}
                  </TableCell>
                  <TableCell>{getStatusChip(evaluation.status)}</TableCell>
                  <TableCell>
                    <Box display="flex" gap={0.5}>
                      {getDecisionChip(evaluation.adminReview?.decision)}
                      {evaluation.adminReview?.adminFeedback?.includes('Auto-approved') && (
                        <Chip label="Auto" color="primary" size="small" icon={<RobotIcon fontSize="small" />} />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {new Date(evaluation.submittedAt).toLocaleDateString('vi-VN')}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      startIcon={<EyeIcon />}
                      onClick={() => viewDetails(evaluation)}
                    >
                      Chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          labelRowsPerPage="Số dòng mỗi trang:"
        />
      </TableContainer>

      {/* Detail Modal */}
      <Dialog
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Chi tiết đánh giá AI</DialogTitle>
        <DialogContent>
          {selectedEvaluation && (
            <Box sx={{ pt: 2 }}>
              {/* Course Info */}
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Khóa học
                      </Typography>
                      <Typography variant="body1">
                        {selectedEvaluation.courseId.title}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Giảng viên
                      </Typography>
                      <Typography variant="body1">
                        {selectedEvaluation.submittedBy.userId.firstName} {selectedEvaluation.submittedBy.userId.lastName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Trạng thái
                      </Typography>
                      <Box sx={{ mt: 0.5 }}>
                        {getStatusChip(selectedEvaluation.status)}
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Thời gian xử lý
                      </Typography>
                      <Typography variant="body1">
                        {selectedEvaluation.processingTime
                          ? `${(selectedEvaluation.processingTime / 1000).toFixed(1)}s`
                          : '-'}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* AI Analysis */}
              {selectedEvaluation.aiAnalysis && (
                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <RobotIcon /> Đánh giá của AI
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="caption" color="text.secondary">
                          Tổng điểm
                        </Typography>
                        <Typography variant="h5">
                          {selectedEvaluation.aiAnalysis.overallScore}
                          <Typography component="span" variant="body2" color="text.secondary">
                            / 100
                          </Typography>
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="caption" color="text.secondary">
                          Nội dung
                        </Typography>
                        <Typography variant="h5">
                          {selectedEvaluation.aiAnalysis.contentQuality.score}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="caption" color="text.secondary">
                          Cấu trúc
                        </Typography>
                        <Typography variant="h5">
                          {selectedEvaluation.aiAnalysis.structureQuality.score}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="caption" color="text.secondary">
                          Giá trị
                        </Typography>
                        <Typography variant="h5">
                          {selectedEvaluation.aiAnalysis.educationalValue.score}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              )}

              {/* Admin Review */}
              {selectedEvaluation.adminReview && (
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Quyết định
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">
                          Quyết định
                        </Typography>
                        <Box sx={{ mt: 0.5 }} display="flex" gap={0.5}>
                          {getDecisionChip(selectedEvaluation.adminReview.decision)}
                          {selectedEvaluation.adminReview.adminFeedback?.includes('Auto-approved') && (
                            <Chip label="Tự động duyệt" color="primary" size="small" icon={<RobotIcon fontSize="small" />} />
                          )}
                        </Box>
                      </Grid>
                      {selectedEvaluation.adminReview.adminFeedback && (
                        <Grid item xs={12}>
                          <Typography variant="caption" color="text.secondary">
                            Nhận xét
                          </Typography>
                          <Typography variant="body2">
                            {selectedEvaluation.adminReview.adminFeedback}
                          </Typography>
                        </Grid>
                      )}
                      {selectedEvaluation.adminReview.reviewedAt && (
                        <Grid item xs={12}>
                          <Typography variant="caption" color="text.secondary">
                            Ngày review
                          </Typography>
                          <Typography variant="body2">
                            {new Date(selectedEvaluation.adminReview.reviewedAt).toLocaleString('vi-VN')}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AIEvaluationHistory;
