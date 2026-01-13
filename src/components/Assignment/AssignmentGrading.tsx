import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
  Stack,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
} from '@mui/material';
import {
  Grade as GradeIcon,
  Download as DownloadIcon,
  Search as SearchIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import RichTextEditor from '../RichTextEditor/RichTextEditor';

export interface Submission {
  _id: string;
  studentId: string;
  studentName: string;
  studentEmail?: string;
  status: 'draft' | 'submitted' | 'graded' | 'late' | 'overdue' | 'returned';
  submittedAt?: string;
  fileUrl?: string;
  textAnswer?: string;
  score?: number;
  feedback?: string;
  attemptNumber: number;
  isLate: boolean;
}

interface AssignmentGradingProps {
  assignment: {
    _id: string;
    title: string;
    maxScore: number;
    anonymousGrading?: boolean;
  };
  submissions: Submission[];
  onGrade?: (submissionId: string, score: number, feedback: string, rubricScore?: any[]) => Promise<void>;
  onBulkGrade?: (submissionIds: string[], score: number, feedback: string) => Promise<void>;
  onExport?: () => void;
  onDownloadAll?: () => void;
}

const AssignmentGrading: React.FC<AssignmentGradingProps> = ({
  assignment,
  submissions,
  onGrade,
  onBulkGrade,
  onExport,
  onDownloadAll,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([]);
  const [gradingDialog, setGradingDialog] = useState<{
    open: boolean;
    submission: Submission | null;
  }>({ open: false, submission: null });
  const [gradingData, setGradingData] = useState({
    score: 0,
    feedback: '',
    rubricScore: [] as any[],
  });
  const [isGrading, setIsGrading] = useState(false);

  const filteredSubmissions = submissions.filter(sub => {
    if (filterStatus !== 'all' && sub.status !== filterStatus) return false;
    if (searchQuery && !sub.studentName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleGrade = async () => {
    if (!gradingDialog.submission || !onGrade) return;
    
    setIsGrading(true);
    try {
      await onGrade(
        gradingDialog.submission._id,
        gradingData.score,
        gradingData.feedback,
        gradingData.rubricScore.length > 0 ? gradingData.rubricScore : undefined
      );
      setGradingDialog({ open: false, submission: null });
      setGradingData({ score: 0, feedback: '', rubricScore: [] });
      // Refresh submissions would be handled by parent
    } catch (error: any) {
      console.error('Error grading submission:', error);
    } finally {
      setIsGrading(false);
    }
  };

  const handleBulkGrade = async () => {
    if (selectedSubmissions.length === 0 || !onBulkGrade) return;
    
    setIsGrading(true);
    try {
      await onBulkGrade(
        selectedSubmissions,
        gradingData.score,
        gradingData.feedback
      );
      setSelectedSubmissions([]);
      setGradingData({ score: 0, feedback: '', rubricScore: [] });
    } catch (error: any) {
      console.error('Error bulk grading:', error);
    } finally {
      setIsGrading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'graded': return 'success';
      case 'submitted': return 'info';
      case 'late': return 'warning';
      case 'overdue': return 'error';
      case 'returned': return 'warning';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Bản nháp';
      case 'submitted': return 'Đã nộp';
      case 'graded': return 'Đã chấm';
      case 'late': return 'Nộp muộn';
      case 'overdue': return 'Quá hạn';
      case 'returned': return 'Trả lại';
      default: return status;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Chấm bài: {assignment.title}
          </Typography>
          <Stack direction="row" spacing={2}>
            {onDownloadAll && (
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={onDownloadAll}
              >
                Tải tất cả files
              </Button>
            )}
            {onExport && (
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={onExport}
              >
                Xuất Excel
              </Button>
            )}
          </Stack>
        </Stack>

        {/* Filters */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Tìm kiếm học sinh..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Lọc theo trạng thái</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Lọc theo trạng thái"
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="submitted">Đã nộp</MenuItem>
                <MenuItem value="graded">Đã chấm</MenuItem>
                <MenuItem value="late">Nộp muộn</MenuItem>
                <MenuItem value="overdue">Quá hạn</MenuItem>
                <MenuItem value="returned">Trả lại</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">
              Tổng: {submissions.length} | Đã nộp: {submissions.filter(s => s.status === 'submitted' || s.status === 'graded').length} | Đã chấm: {submissions.filter(s => s.status === 'graded').length}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Bulk Actions */}
      {selectedSubmissions.length > 0 && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: 'primary.light' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2">
              Đã chọn {selectedSubmissions.length} bài nộp
            </Typography>
            <Stack direction="row" spacing={2}>
              <TextField
                size="small"
                type="number"
                label="Điểm"
                value={gradingData.score}
                onChange={(e) => setGradingData(prev => ({ ...prev, score: Number(e.target.value) }))}
                InputProps={{ inputProps: { min: 0, max: assignment.maxScore } }}
                sx={{ width: 100 }}
              />
              <Button
                variant="contained"
                size="small"
                onClick={handleBulkGrade}
                disabled={isGrading}
              >
                Chấm hàng loạt
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setSelectedSubmissions([])}
              >
                Hủy chọn
              </Button>
            </Stack>
          </Stack>
        </Paper>
      )}

      {/* Submissions Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedSubmissions.length > 0 && selectedSubmissions.length < filteredSubmissions.length}
                  checked={filteredSubmissions.length > 0 && selectedSubmissions.length === filteredSubmissions.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedSubmissions(filteredSubmissions.map(s => s._id));
                    } else {
                      setSelectedSubmissions([]);
                    }
                  }}
                />
              </TableCell>
              <TableCell>Học sinh</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Thời gian nộp</TableCell>
              <TableCell>Lần nộp</TableCell>
              <TableCell align="right">Điểm</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSubmissions
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((submission) => (
                <TableRow key={submission._id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedSubmissions.includes(submission._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSubmissions([...selectedSubmissions, submission._id]);
                        } else {
                          setSelectedSubmissions(selectedSubmissions.filter(id => id !== submission._id));
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {assignment.anonymousGrading ? (
                      `Học sinh ${submission._id.slice(-6)}`
                    ) : (
                      <>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {submission.studentName}
                        </Typography>
                        {submission.studentEmail && (
                          <Typography variant="caption" color="text.secondary">
                            {submission.studentEmail}
                          </Typography>
                        )}
                      </>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(submission.status)}
                      color={getStatusColor(submission.status) as any}
                      size="small"
                    />
                    {submission.isLate && (
                      <Chip label="Muộn" color="warning" size="small" sx={{ ml: 1 }} />
                    )}
                  </TableCell>
                  <TableCell>
                    {submission.submittedAt
                      ? new Date(submission.submittedAt).toLocaleString('vi-VN')
                      : '-'}
                  </TableCell>
                  <TableCell>{submission.attemptNumber}</TableCell>
                  <TableCell align="right">
                    {submission.score !== undefined ? (
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {submission.score}/{assignment.maxScore}
                      </Typography>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setGradingDialog({ open: true, submission });
                        setGradingData({
                          score: submission.score || 0,
                          feedback: submission.feedback || '',
                          rubricScore: [],
                        });
                      }}
                    >
                      <GradeIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            {filteredSubmissions.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="text.secondary">
                    Không có bài nộp nào
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredSubmissions.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setPage(0);
          }}
          labelRowsPerPage="Số dòng mỗi trang:"
        />
      </TableContainer>

      {/* Grading Dialog */}
      <Dialog
        open={gradingDialog.open}
        onClose={() => setGradingDialog({ open: false, submission: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Chấm bài: {gradingDialog.submission?.studentName || 'Học sinh'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            {/* Submission Content */}
            {gradingDialog.submission?.fileUrl && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  File bài làm:
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  href={gradingDialog.submission.fileUrl}
                  target="_blank"
                >
                  Tải file
                </Button>
              </Box>
            )}
            {gradingDialog.submission?.textAnswer && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Nội dung bài làm:
                </Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Box dangerouslySetInnerHTML={{ __html: gradingDialog.submission.textAnswer }} />
                </Paper>
              </Box>
            )}

            {/* Score */}
            <TextField
              fullWidth
              type="number"
              label="Điểm số"
              value={gradingData.score}
              onChange={(e) => setGradingData(prev => ({ ...prev, score: Number(e.target.value) }))}
              InputProps={{ inputProps: { min: 0, max: assignment.maxScore } }}
              helperText={`Tối đa: ${assignment.maxScore} điểm`}
            />

            {/* Feedback */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Nhận xét:
              </Typography>
              <RichTextEditor
                value={gradingData.feedback}
                onChange={(value) => setGradingData(prev => ({ ...prev, feedback: value }))}
                placeholder="Nhập nhận xét cho học sinh..."
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGradingDialog({ open: false, submission: null })}>
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleGrade}
            disabled={isGrading || gradingData.score < 0 || gradingData.score > assignment.maxScore}
            startIcon={<SendIcon />}
          >
            {isGrading ? 'Đang lưu...' : 'Lưu điểm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssignmentGrading;
