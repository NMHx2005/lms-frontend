import React, { useState, useEffect } from 'react';
// import './Announcements.css';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Tabs,
  Tab,
  ToggleButton,
  ToggleButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';

interface Announcement { _id: string; title: string; content: string; type: 'system' | 'email' | 'push'; status: 'draft' | 'scheduled' | 'published' | 'archived'; priority: 'low' | 'medium' | 'high' | 'urgent'; targetAudience: 'all' | 'students' | 'teachers' | 'admins' | 'specific'; scheduledAt?: string; publishedAt?: string; expiresAt?: string; createdBy: string; createdAt: string; updatedAt: string; readCount: number; clickCount: number; tags: string[]; attachments?: string[]; }

const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'draft' | 'scheduled' | 'published' | 'archived'>('all');
  const [filters, setFilters] = useState({ search: '', type: '', priority: '', targetAudience: '', status: '' });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  useEffect(() => {
    const mockAnnouncements: Announcement[] = [
      { _id: '1', title: 'Hệ thống LMS sẽ bảo trì vào ngày 15/12', content: 'Hệ thống sẽ tạm ngưng hoạt động từ 02:00 - 06:00 để bảo trì và nâng cấp. Vui lòng lưu ý thời gian này.', type: 'system', status: 'published', priority: 'high', targetAudience: 'all', publishedAt: '2024-12-10T08:00:00Z', createdBy: 'Admin System', createdAt: '2024-12-10T08:00:00Z', updatedAt: '2024-12-10T08:00:00Z', readCount: 1247, clickCount: 89, tags: ['maintenance', 'system-update'] },
      { _id: '2', title: 'Khóa học mới: Lập trình Python cơ bản', content: 'Chúng tôi vui mừng giới thiệu khóa học lập trình Python cơ bản dành cho người mới bắt đầu. Khóa học sẽ khai giảng vào ngày 20/12.', type: 'email', status: 'scheduled', priority: 'medium', targetAudience: 'students', scheduledAt: '2024-12-18T09:00:00Z', createdBy: 'Marketing Team', createdAt: '2024-12-10T10:00:00Z', updatedAt: '2024-12-10T10:00:00Z', readCount: 0, clickCount: 0, tags: ['new-course', 'python', 'programming'] },
      { _id: '3', title: 'Cập nhật chính sách hoàn tiền', content: 'Chúng tôi đã cập nhật chính sách hoàn tiền để đảm bảo quyền lợi tốt nhất cho học viên. Xem chi tiết tại đây.', type: 'push', status: 'published', priority: 'medium', targetAudience: 'all', publishedAt: '2024-12-09T14:00:00Z', createdBy: 'Policy Team', createdAt: '2024-12-09T14:00:00Z', updatedAt: '2024-12-09T14:00:00Z', readCount: 892, clickCount: 156, tags: ['policy-update', 'refund'] },
      { _id: '4', title: 'Thông báo về kỳ thi cuối khóa', content: 'Kỳ thi cuối khóa sẽ diễn ra từ ngày 25-30/12. Học viên vui lòng chuẩn bị và kiểm tra lịch thi.', type: 'email', status: 'draft', priority: 'high', targetAudience: 'students', createdBy: 'Academic Team', createdAt: '2024-12-10T11:00:00Z', updatedAt: '2024-12-10T11:00:00Z', readCount: 0, clickCount: 0, tags: ['exam', 'final-term'] },
      { _id: '5', title: 'Chúc mừng năm mới 2025', content: 'Chúc mừng năm mới 2025! Chúng tôi chúc tất cả học viên và giảng viên một năm mới tràn đầy sức khỏe và thành công.', type: 'system', status: 'scheduled', priority: 'low', targetAudience: 'all', scheduledAt: '2024-12-31T00:00:00Z', createdBy: 'Admin System', createdAt: '2024-12-10T12:00:00Z', updatedAt: '2024-12-10T12:00:00Z', readCount: 0, clickCount: 0, tags: ['new-year', 'celebration'] }
    ];
    setAnnouncements(mockAnnouncements); setFilteredAnnouncements(mockAnnouncements); setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = announcements;
    if (activeTab !== 'all') filtered = filtered.filter(item => item.status === activeTab);
    if (filters.search) filtered = filtered.filter(item => item.title.toLowerCase().includes(filters.search.toLowerCase()) || item.content.toLowerCase().includes(filters.search.toLowerCase()));
    if (filters.type) filtered = filtered.filter(item => item.type === filters.type);
    if (filters.priority) filtered = filtered.filter(item => item.priority === filters.priority);
    if (filters.targetAudience) filtered = filtered.filter(item => item.targetAudience === filters.targetAudience);
    if (filters.status) filtered = filtered.filter(item => item.status === filters.status);
    setFilteredAnnouncements(filtered);
  }, [announcements, activeTab, filters]);

  const handleFilterChange = (key: string, value: string) => setFilters(prev => ({ ...prev, [key]: value }));
  const handleCreateAnnouncement = () => setShowCreateModal(true);
  const handleEditAnnouncement = (announcement: Announcement) => { setSelectedAnnouncement(announcement); setShowEditModal(true); };
  const handleDeleteAnnouncement = (id: string) => { if (window.confirm('Bạn có chắc chắn muốn xóa thông báo này?')) setAnnouncements(prev => prev.filter(item => item._id !== id)); };
  const handleStatusChange = (id: string, newStatus: Announcement['status']) => setAnnouncements(prev => prev.map(item => item._id === id ? { ...item, status: newStatus } : item));

  const getStatusLabel = (s: string) => ({ draft: 'Bản nháp', scheduled: 'Đã lên lịch', published: 'Đã xuất bản', archived: 'Đã lưu trữ' }[s] || s);
  const getPriorityLabel = (p: string) => ({ low: 'Thấp', medium: 'Trung bình', high: 'Cao', urgent: 'Khẩn cấp' }[p] || p);
  const getTypeLabel = (t: string) => ({ system: 'Hệ thống', email: 'Email', push: 'Push notification' }[t] || t);
  const getTargetAudienceLabel = (a: string) => ({ all: 'Tất cả', students: 'Học viên', teachers: 'Giảng viên', admins: 'Quản trị viên', specific: 'Cụ thể' }[a] || a);
  const formatDate = (d: string) => new Date(d).toLocaleString('vi-VN');

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">Đang tải thông báo...</Typography>
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
              <Typography variant="h5" fontWeight={800}>Quản lý thông báo</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Quản lý thông báo hệ thống, email campaigns và push notifications</Typography>
            </Box>
            <Button variant="contained" onClick={handleCreateAnnouncement}>📢 Tạo thông báo mới</Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Stats */}
      <Grid container spacing={2}>
        <Grid item xs={6} md={3}><Card><CardContent><Stack alignItems="center"><Typography variant="h6" fontWeight={800}>{announcements.length}</Typography><Typography variant="caption">Tổng thông báo</Typography></Stack></CardContent></Card></Grid>
        <Grid item xs={6} md={3}><Card><CardContent><Stack alignItems="center"><Typography variant="h6" fontWeight={800}>{announcements.filter(a => a.status === 'published').length}</Typography><Typography variant="caption">Đã xuất bản</Typography></Stack></CardContent></Card></Grid>
        <Grid item xs={6} md={3}><Card><CardContent><Stack alignItems="center"><Typography variant="h6" fontWeight={800}>{announcements.filter(a => a.status === 'scheduled').length}</Typography><Typography variant="caption">Đã lên lịch</Typography></Stack></CardContent></Card></Grid>
        <Grid item xs={6} md={3}><Card><CardContent><Stack alignItems="center"><Typography variant="h6" fontWeight={800}>{announcements.filter(a => a.status === 'draft').length}</Typography><Typography variant="caption">Bản nháp</Typography></Stack></CardContent></Card></Grid>
      </Grid>

      {/* Tabs */}
      <Paper variant="outlined">
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} variant="scrollable" scrollButtons allowScrollButtonsMobile>
          <Tab value="all" label={`Tất cả (${announcements.length})`} />
          <Tab value="draft" label={`Bản nháp (${announcements.filter(a => a.status === 'draft').length})`} />
          <Tab value="scheduled" label={`Đã lên lịch (${announcements.filter(a => a.status === 'scheduled').length})`} />
          <Tab value="published" label={`Đã xuất bản (${announcements.filter(a => a.status === 'published').length})`} />
          <Tab value="archived" label={`Đã lưu trữ (${announcements.filter(a => a.status === 'archived').length})`} />
        </Tabs>
      </Paper>

      {/* Filters & View */}
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}><TextField fullWidth placeholder="Tìm kiếm thông báo..." value={filters.search} onChange={(e) => handleFilterChange('search', e.target.value)} /></Grid>
          <Grid item xs={6} md={2}><FormControl fullWidth><InputLabel>Loại</InputLabel><Select label="Loại" value={filters.type} onChange={(e) => handleFilterChange('type', String(e.target.value))} MenuProps={{ disableScrollLock: true }}><MenuItem value="">Tất cả</MenuItem><MenuItem value="system">Hệ thống</MenuItem><MenuItem value="email">Email</MenuItem><MenuItem value="push">Push notification</MenuItem></Select></FormControl></Grid>
          <Grid item xs={6} md={2}><FormControl fullWidth><InputLabel>Mức độ</InputLabel><Select label="Mức độ" value={filters.priority} onChange={(e) => handleFilterChange('priority', String(e.target.value))} MenuProps={{ disableScrollLock: true }}><MenuItem value="">Tất cả</MenuItem><MenuItem value="low">Thấp</MenuItem><MenuItem value="medium">Trung bình</MenuItem><MenuItem value="high">Cao</MenuItem><MenuItem value="urgent">Khẩn cấp</MenuItem></Select></FormControl></Grid>
          <Grid item xs={6} md={2}><FormControl fullWidth><InputLabel>Đối tượng</InputLabel><Select label="Đối tượng" value={filters.targetAudience} onChange={(e) => handleFilterChange('targetAudience', String(e.target.value))} MenuProps={{ disableScrollLock: true }}><MenuItem value="">Tất cả</MenuItem><MenuItem value="all">Tất cả</MenuItem><MenuItem value="students">Học viên</MenuItem><MenuItem value="teachers">Giảng viên</MenuItem><MenuItem value="admins">Quản trị viên</MenuItem><MenuItem value="specific">Cụ thể</MenuItem></Select></FormControl></Grid>
          <Grid item xs={6} md={2}><FormControl fullWidth><InputLabel>Trạng thái</InputLabel><Select label="Trạng thái" value={filters.status} onChange={(e) => handleFilterChange('status', String(e.target.value))} MenuProps={{ disableScrollLock: true }}><MenuItem value="">Tất cả</MenuItem><MenuItem value="draft">Bản nháp</MenuItem><MenuItem value="scheduled">Đã lên lịch</MenuItem><MenuItem value="published">Đã xuất bản</MenuItem><MenuItem value="archived">Đã lưu trữ</MenuItem></Select></FormControl></Grid>
        </Grid>
        <Stack direction="row" justifyContent="flex-end" mt={2}>
          <ToggleButtonGroup exclusive value={viewMode} onChange={(_, v) => v && setViewMode(v)} size="small">
            <ToggleButton value="list">Danh sách</ToggleButton>
            <ToggleButton value="calendar">Lịch</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Paper>

      {/* List view */}
      {viewMode === 'list' ? (
        <Stack spacing={2}>
          {filteredAnnouncements.length === 0 ? (
            <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6">Không có thông báo nào</Typography>
              <Typography variant="body2" color="text.secondary">Không tìm thấy thông báo phù hợp với bộ lọc hiện tại.</Typography>
            </Paper>
          ) : (
            filteredAnnouncements.map(announcement => (
              <Card key={announcement._id} variant="outlined">
                <CardContent>
                  <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip label={getPriorityLabel(announcement.priority)} color={announcement.priority === 'urgent' ? 'error' : announcement.priority === 'high' ? 'error' : announcement.priority === 'medium' ? 'warning' : 'success'} />
                      <Chip label={getStatusLabel(announcement.status)} color={announcement.status === 'published' ? 'success' : announcement.status === 'scheduled' ? 'info' : announcement.status === 'draft' ? 'default' : 'warning'} />
                      <Chip label={getTypeLabel(announcement.type)} />
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <Button size="small" variant="outlined" onClick={() => handleEditAnnouncement(announcement)}>Sửa</Button>
                      <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteAnnouncement(announcement._id)}>Xóa</Button>
                    </Stack>
                  </Stack>
                  <Typography variant="h6" fontWeight={800} mt={1}>{announcement.title}</Typography>
                  <Typography variant="body2" color="text.secondary" mt={0.5}>{announcement.content}</Typography>
                  <Grid container spacing={2} mt={1}>
                    <Grid item xs={12} md={3}><Typography variant="body2" color="text.secondary">Đối tượng</Typography><Typography>{getTargetAudienceLabel(announcement.targetAudience)}</Typography></Grid>
                    <Grid item xs={12} md={3}><Typography variant="body2" color="text.secondary">Người tạo</Typography><Typography>{announcement.createdBy}</Typography></Grid>
                    <Grid item xs={12} md={3}><Typography variant="body2" color="text.secondary">Ngày tạo</Typography><Typography>{formatDate(announcement.createdAt)}</Typography></Grid>
                    {announcement.scheduledAt && (<Grid item xs={12} md={3}><Typography variant="body2" color="text.secondary">Lên lịch</Typography><Typography>{formatDate(announcement.scheduledAt)}</Typography></Grid>)}
                    {announcement.publishedAt && (<Grid item xs={12} md={3}><Typography variant="body2" color="text.secondary">Xuất bản</Typography><Typography>{formatDate(announcement.publishedAt)}</Typography></Grid>)}
                  </Grid>
                  <Stack direction="row" spacing={1} mt={1}>
                    <Chip size="small" label={`📖 ${announcement.readCount}`} />
                    <Chip size="small" label={`🖱️ ${announcement.clickCount}`} />
                    {announcement.tags.map(tag => (<Chip key={tag} size="small" variant="outlined" label={tag} />))}
                  </Stack>
                  <Stack direction="row" spacing={1} mt={1}>
                    {announcement.status === 'draft' && (<Button size="small" variant="contained" onClick={() => handleStatusChange(announcement._id, 'scheduled')}>Lên lịch</Button>)}
                    {announcement.status === 'scheduled' && (<Button size="small" variant="contained" onClick={() => handleStatusChange(announcement._id, 'published')}>Xuất bản ngay</Button>)}
                    {announcement.status === 'published' && (<Button size="small" variant="outlined" color="warning" onClick={() => handleStatusChange(announcement._id, 'archived')}>Lưu trữ</Button>)}
                    {announcement.status === 'archived' && (<Button size="small" variant="outlined" onClick={() => handleStatusChange(announcement._id, 'draft')}>Khôi phục</Button>)}
                  </Stack>
                </CardContent>
              </Card>
            ))
          )}
        </Stack>
      ) : (
        <Card><CardContent>
          <Typography variant="h6" fontWeight={800}>Chế độ xem lịch</Typography>
          <Typography variant="body2" color="text.secondary">Chức năng xem lịch thông báo sẽ được phát triển trong phiên bản tiếp theo.</Typography>
        </CardContent></Card>
      )}

      {/* Create/Edit Dialog placeholder */}
      <Dialog open={showCreateModal || showEditModal} onClose={() => { setShowCreateModal(false); setShowEditModal(false); setSelectedAnnouncement(null); }} fullWidth maxWidth="md">
        <DialogTitle>{showCreateModal ? 'Tạo thông báo mới' : `Chỉnh sửa: ${selectedAnnouncement?.title ?? ''}`}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">Biểu mẫu tạo/chỉnh sửa sẽ được thêm ở phiên bản tiếp theo.</Typography>
        </DialogContent>
        <DialogActions><Button onClick={() => { setShowCreateModal(false); setShowEditModal(false); setSelectedAnnouncement(null); }}>Đóng</Button></DialogActions>
      </Dialog>
    </Box>
  );
};

export default Announcements;
