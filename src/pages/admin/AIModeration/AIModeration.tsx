import React, { useState, useEffect } from 'react';
// import './AIModeration.css';
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
  Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import RefreshIcon from '@mui/icons-material/Refresh';

interface AIModerationResult {
  _id: string;
  contentId: string;
  contentType: 'course' | 'comment' | 'review' | 'assignment';
  content: string;
  confidence: number;
  flagged: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  categories: string[];
  suggestions: string[];
  processedAt: string;
  status: 'pending' | 'reviewed' | 'auto-approved' | 'auto-rejected';
  reviewedBy?: string;
  reviewNotes?: string;
}

interface AIModerationStats {
  totalProcessed: number;
  flaggedContent: number;
  autoApproved: number;
  autoRejected: number;
  pendingReview: number;
  accuracy: number;
  processingTime: number;
}

const AIModeration: React.FC = () => {
  const [moderationResults, setModerationResults] = useState<AIModerationResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<AIModerationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AIModerationStats | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    contentType: 'all',
    riskLevel: 'all',
    status: 'all'
  });
  const [selectedResults, setSelectedResults] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const mockResults: AIModerationResult[] = [
        { _id: '1', contentId: 'course-123', contentType: 'course', content: 'Advanced JavaScript Programming with Modern ES6+ Features', confidence: 0.94, flagged: false, riskLevel: 'low', categories: ['educational', 'programming'], suggestions: ['Content appears appropriate for educational platform'], processedAt: '2024-01-15T10:30:00Z', status: 'auto-approved' },
        { _id: '2', contentId: 'comment-456', contentType: 'comment', content: 'This course is absolutely terrible and the instructor should be fired immediately!', confidence: 0.89, flagged: true, riskLevel: 'high', categories: ['inappropriate', 'harassment', 'spam'], suggestions: ['Review for inappropriate language', 'Consider moderation action'], processedAt: '2024-01-15T11:15:00Z', status: 'pending' },
        { _id: '3', contentId: 'review-789', contentType: 'review', content: 'Great course! Learned a lot about React hooks and state management.', confidence: 0.97, flagged: false, riskLevel: 'low', categories: ['positive', 'educational'], suggestions: ['Content appears appropriate'], processedAt: '2024-01-15T12:00:00Z', status: 'auto-approved' },
        { _id: '4', contentId: 'assignment-101', contentType: 'assignment', content: 'Please submit your final project demonstrating understanding of the concepts covered in this course.', confidence: 0.92, flagged: false, riskLevel: 'low', categories: ['educational', 'assignment'], suggestions: ['Content appears appropriate'], processedAt: '2024-01-15T13:45:00Z', status: 'auto-approved' },
        { _id: '5', contentId: 'comment-202', contentType: 'comment', content: 'I think this course could be improved by adding more practical examples', confidence: 0.88, flagged: true, riskLevel: 'medium', categories: ['feedback', 'suggestion'], suggestions: ['Review for constructive feedback', 'May be appropriate with minor edits'], processedAt: '2024-01-15T14:20:00Z', status: 'pending' }
      ];
      const mockStats: AIModerationStats = { totalProcessed: 1247, flaggedContent: 23, autoApproved: 1189, autoRejected: 35, pendingReview: 18, accuracy: 94.2, processingTime: 2.3 };
      setModerationResults(mockResults);
      setFilteredResults(mockResults);
      setStats(mockStats);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = moderationResults;
    if (filters.search) {
      filtered = filtered.filter(result => result.content.toLowerCase().includes(filters.search.toLowerCase()) || result.contentId.toLowerCase().includes(filters.search.toLowerCase()));
    }
    if (filters.contentType !== 'all') filtered = filtered.filter(r => r.contentType === filters.contentType);
    if (filters.riskLevel !== 'all') filtered = filtered.filter(r => r.riskLevel === filters.riskLevel);
    if (filters.status !== 'all') filtered = filtered.filter(r => r.status === filters.status);
    setFilteredResults(filtered);
  }, [moderationResults, filters]);

  const handleFilterChange = (key: string, value: string) => setFilters(prev => ({ ...prev, [key]: value }));
  const handleResultSelection = (resultId: string) => setSelectedResults(prev => prev.includes(resultId) ? prev.filter(id => id !== resultId) : [...prev, resultId]);
  const handleBulkAction = (action: string) => { console.log(`Bulk action: ${action}`); setSelectedResults([]); };
  const handleResultAction = (resultId: string, action: string) => { console.log(`Action ${action} on ${resultId}`); };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleString('vi-VN');

  const getRiskLabel = (risk: string) => risk === 'low' ? 'Thấp' : risk === 'medium' ? 'Trung bình' : 'Cao';
  const getStatusLabel = (status: string) => {
    if (status === 'auto-approved') return 'auto-approved';
    if (status === 'auto-rejected') return 'auto-rejected';
    if (status === 'pending') return 'pending';
    if (status === 'reviewed') return 'reviewed';
    return status;
  };

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
              <Button variant="contained" color="inherit" startIcon={<SettingsIcon />} sx={{ color: '#111827' }} onClick={() => setShowSettings(!showSettings)}>Cài đặt AI</Button>
              <Button variant="contained" color="inherit" startIcon={<RefreshIcon />} sx={{ color: '#111827' }}>Cập nhật mô hình</Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Stats */}
      {stats && (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}><Card><CardContent><Stack direction="row" spacing={2}><Chip label="Đã xử lý" /><Typography variant="h6" fontWeight={700}>{stats.totalProcessed.toLocaleString()}</Typography></Stack></CardContent></Card></Grid>
          <Grid item xs={12} sm={6} md={3}><Card><CardContent><Stack direction="row" spacing={2}><Chip color="warning" label="Bị đánh dấu" /><Typography variant="h6" fontWeight={700}>{stats.flaggedContent}</Typography></Stack></CardContent></Card></Grid>
          <Grid item xs={12} sm={6} md={3}><Card><CardContent><Stack direction="row" spacing={2}><Chip color="success" label="Tự động duyệt" /><Typography variant="h6" fontWeight={700}>{stats.autoApproved}</Typography></Stack></CardContent></Card></Grid>
          <Grid item xs={12} sm={6} md={3}><Card><CardContent><Stack direction="row" spacing={2}><Chip color="info" label="Độ chính xác" /><Typography variant="h6" fontWeight={700}>{stats.accuracy}%</Typography></Stack></CardContent></Card></Grid>
        </Grid>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <Paper sx={{ p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={1}>Cài đặt AI Moderation</Typography>
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
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">Kích hoạt AI cho</Typography>
              <Stack direction="row" spacing={2} mt={1}>
                <Chip label="Khóa học" color="primary" variant="outlined" />
                <Chip label="Bình luận" color="primary" variant="outlined" />
                <Chip label="Đánh giá" color="primary" variant="outlined" />
                <Chip label="Bài tập" color="primary" variant="outlined" />
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Filters */}
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField fullWidth placeholder="Tìm kiếm nội dung..." value={filters.search} onChange={(e) => handleFilterChange('search', e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }} />
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <FormControl fullWidth>
              <InputLabel>Loại nội dung</InputLabel>
              <Select label="Loại nội dung" value={filters.contentType} onChange={(e) => handleFilterChange('contentType', String(e.target.value))} MenuProps={{ disableScrollLock: true }}>
                <MenuItem value="all">Tất cả loại nội dung</MenuItem>
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
              <Select label="Mức rủi ro" value={filters.riskLevel} onChange={(e) => handleFilterChange('riskLevel', String(e.target.value))} MenuProps={{ disableScrollLock: true }}>
                <MenuItem value="all">Tất cả mức rủi ro</MenuItem>
                <MenuItem value="low">Thấp</MenuItem>
                <MenuItem value="medium">Trung bình</MenuItem>
                <MenuItem value="high">Cao</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select label="Trạng thái" value={filters.status} onChange={(e) => handleFilterChange('status', String(e.target.value))} MenuProps={{ disableScrollLock: true }}>
                <MenuItem value="all">Tất cả trạng thái</MenuItem>
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
      {selectedResults.length > 0 && (
        <Paper sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography>{selectedResults.length} mục được chọn</Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="contained" color="success" onClick={() => handleBulkAction('approve')}>Phê duyệt</Button>
            <Button variant="outlined" color="error" onClick={() => handleBulkAction('reject')}>Từ chối</Button>
            <Button variant="outlined" onClick={() => handleBulkAction('flag')}>Đánh dấu</Button>
          </Stack>
        </Paper>
      )}

      {/* Results List */}
      <Grid container spacing={2}>
        {filteredResults.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>Không có kết quả nào</Typography>
              <Typography variant="body2" color="text.secondary">Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</Typography>
            </Paper>
          </Grid>
        ) : (
          filteredResults.map(result => (
            <Grid key={result._id} item xs={12}>
              <Card>
                <CardContent>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }}>
                    <Checkbox checked={selectedResults.includes(result._id)} onChange={() => handleResultSelection(result._id)} />
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 220 }}>
                      <Chip label={result.contentType} color="primary" variant="outlined" />
                      <Chip label={result.contentId} variant="outlined" />
                      <Chip label={`Tin cậy ${Math.round(result.confidence * 100)}%`} size="small" />
                    </Stack>
                    <Box sx={{ flex: 1 }}>
                      <Typography>{result.content}</Typography>
                      <Stack direction="row" spacing={1} mt={1}>
                        {result.categories.map(category => (<Chip key={category} size="small" variant="outlined" label={category} />))}
                      </Stack>
                    </Box>
                    <Stack spacing={1} sx={{ minWidth: 200 }}>
                      <Chip label={getRiskLabel(result.riskLevel)} color={result.riskLevel === 'high' ? 'error' : result.riskLevel === 'medium' ? 'warning' : 'success'} variant="filled" />
                      <Chip label={getStatusLabel(result.status)} color={result.status === 'auto-approved' ? 'success' : result.status === 'auto-rejected' ? 'error' : result.status === 'pending' ? 'warning' : 'info'} variant="filled" />
                      <Typography variant="body2" color="text.secondary">{formatDate(result.processedAt)}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1.5}>
                      {result.status === 'pending' && (
                        <>
                          <Button variant="contained" color="success" onClick={() => handleResultAction(result._id, 'approve')}>Phê duyệt</Button>
                          <Button variant="outlined" color="error" onClick={() => handleResultAction(result._id, 'reject')}>Từ chối</Button>
                        </>
                      )}
                      <Button variant="text" onClick={() => handleResultAction(result._id, 'review')}>Xem chi tiết</Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Simple Pagination placeholder */}
      {filteredResults.length > 0 && (
        <Paper sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button disabled>← Trước</Button>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" size="small">1</Button>
            <Button variant="outlined" size="small">2</Button>
            <Button variant="outlined" size="small">3</Button>
          </Stack>
          <Button disabled>Sau →</Button>
        </Paper>
      )}
    </Box>
  );
};

export default AIModeration;
