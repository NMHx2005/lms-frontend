import React, { useState, useEffect, useCallback } from 'react';
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
  DialogActions,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
  Checkbox,
  TablePagination
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import {
  Announcement,
  AnnouncementStats,
  AnnouncementFilters,
  AnnouncementAnalytics,
  BulkActionData,
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  publishAnnouncement,
  cancelAnnouncement,
  getAnnouncementAnalytics,
  bulkPublishAnnouncements,
  bulkDeleteAnnouncements,
  getAnnouncementStats
} from '../../../services/admin/announcementService';

const Announcements: React.FC = () => {
  // ========== STATE ==========
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [stats, setStats] = useState<AnnouncementStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'draft' | 'scheduled' | 'published' | 'expired' | 'cancelled'>('all');

  // Filters and pagination
  const [filters, setFilters] = useState<AnnouncementFilters>({
    search: '',
    type: 'all',
    priority: 'all',
    targetAudience: 'all',
    status: 'all',
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [totalAnnouncements, setTotalAnnouncements] = useState(0);

  // Modals and dialogs
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [analytics, setAnalytics] = useState<AnnouncementAnalytics | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Bulk selection
  const [selectedAnnouncements, setSelectedAnnouncements] = useState<string[]>([]);

  // Forms
  const [announcementForm, setAnnouncementForm] = useState<{
    title: string;
    content: string;
    type: 'general' | 'course' | 'urgent' | 'maintenance' | 'update';
    priority: 'low' | 'normal' | 'high' | 'urgent';
    targetAudience: 'all' | 'role' | 'course' | 'user';
    tags: string[];
  }>({
    title: '',
    content: '',
    type: 'general',
    priority: 'normal',
    targetAudience: 'all',
    tags: []
  });

  // Notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  });

  // ========== API FUNCTIONS ==========
  const loadAnnouncements = useCallback(async () => {
    try {
      // Clean filters - remove empty values and "all" values
      const cleanFilters: any = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '' && value !== 'all') {
          cleanFilters[key] = value;
        }
      });

      // Add status filter based on active tab
      if (activeTab !== 'all') {
        cleanFilters.status = activeTab;
      }

      const response = await getAnnouncements(cleanFilters);
      if (response.success) {
        setAnnouncements(response.data.announcements || []);
        setTotalAnnouncements(response.data.total || 0);
      }
    } catch (error: any) {
      console.error('Error loading announcements:', error);
      // Set empty data instead of showing error for now
      setAnnouncements([]);
      setTotalAnnouncements(0);
      // showNotification('API chưa được implement - Announcements sẽ được thêm sau', 'warning');
    }
  }, [filters, activeTab]);

  const loadStats = useCallback(async () => {
    try {
      const response = await getAnnouncementStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error: any) {
      console.error('Error loading stats:', error);
      // Set default stats instead of showing error for now
      setStats({
        totalAnnouncements: 0,
        publishedAnnouncements: 0,
        scheduledAnnouncements: 0,
        draftAnnouncements: 0,
        expiredAnnouncements: 0,
        cancelledAnnouncements: 0,
        totalReads: 0,
        totalClicks: 0,
        averageReadRate: 0,
        averageClickRate: 0,
        announcementsByType: [],
        announcementsByPriority: [],
        announcementsByAudience: []
      });
      // showNotification('API chưa được implement - Stats sẽ được thêm sau', 'warning');
    }
  }, []);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadAnnouncements(),
        loadStats()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [loadAnnouncements, loadStats]);

  // ========== EFFECTS ==========
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Load announcements when filters change
  useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements]);

  // ========== HANDLER FUNCTIONS ==========
  const showNotification = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
    showNotification('Đã làm mới dữ liệu', 'success');
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...(prev || {}), [key]: value, page: 1 }));
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    setFilters(prev => ({ ...(prev || {}), page: newPage + 1 }));
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...(prev || {}),
      limit: parseInt(event.target.value, 10),
      page: 1
    }));
  };

  const handleCreateAnnouncement = () => {
    setAnnouncementForm({
      title: '',
      content: '',
      type: 'general',
      priority: 'normal',
      targetAudience: 'all',
      tags: []
    });
    setShowCreateModal(true);
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setAnnouncementForm({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      priority: announcement.priority,
      targetAudience: announcement.target?.type || 'all',
      tags: announcement.tags || []
    });
    setShowEditModal(true);
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thông báo này?')) {
      try {
        const response = await deleteAnnouncement(id);
        if (response.success) {
          setAnnouncements(prev => (prev || []).filter(item => item._id !== id));
          showNotification('Xóa thông báo thành công', 'success');
        }
      } catch (error: any) {
        console.error('Error deleting announcement:', error);
        showNotification('Lỗi khi xóa thông báo', 'error');
      }
    }
  };

  const handlePublishAnnouncement = async (id: string) => {
    try {
      const response = await publishAnnouncement(id);
      if (response.success) {
        setAnnouncements(prev => (prev || []).map(item => item._id === id ? response.data : item));
        showNotification('Xuất bản thông báo thành công', 'success');
      }
    } catch (error: any) {
      console.error('Error publishing announcement:', error);
      showNotification('Lỗi khi xuất bản thông báo', 'error');
    }
  };

  const handleCancelAnnouncement = async (id: string) => {
    try {
      const response = await cancelAnnouncement(id);
      if (response.success) {
        setAnnouncements(prev => (prev || []).map(item => item._id === id ? response.data : item));
        showNotification('Hủy thông báo thành công', 'success');
      }
    } catch (error: any) {
      console.error('Error canceling announcement:', error);
      showNotification('Lỗi khi hủy thông báo', 'error');
    }
  };

  const handleCreateAnnouncementSubmit = async () => {
    try {
      // Transform data to match backend validation
      const createData: any = {
        ...announcementForm,
        target: {
          type: announcementForm.targetAudience,
          value: announcementForm.targetAudience === 'all' ? undefined : undefined // Add specific value if needed
        }
      };
      delete createData.targetAudience; // Remove targetAudience as it's now in target.type

      const response = await createAnnouncement(createData);
      if (response.success) {
        setAnnouncements(prev => [response.data, ...(prev || [])]);
        setShowCreateModal(false);
        setAnnouncementForm({
          title: '',
          content: '',
          type: 'general',
          priority: 'normal',
          targetAudience: 'all',
          tags: []
        });
        showNotification('Tạo thông báo thành công', 'success');
      }
    } catch (error: any) {
      console.error('Error creating announcement:', error);
      showNotification('Lỗi khi tạo thông báo', 'error');
    }
  };

  const handleUpdateAnnouncementSubmit = async () => {
    if (!selectedAnnouncement) return;

    try {
      // Transform data to match backend validation
      const updateData: any = {
        ...announcementForm,
        target: {
          type: announcementForm.targetAudience,
          value: announcementForm.targetAudience === 'all' ? undefined : undefined // Add specific value if needed
        }
      };
      delete updateData.targetAudience; // Remove targetAudience as it's now in target.type

      const response = await updateAnnouncement(selectedAnnouncement?._id || '', updateData);
      if (response.success) {
        setAnnouncements(prev => (prev || []).map(item => item._id === selectedAnnouncement?._id ? response.data : item));
        setShowEditModal(false);
        setSelectedAnnouncement(null);
        setAnnouncementForm({
          title: '',
          content: '',
          type: 'general',
          priority: 'normal',
          targetAudience: 'all',
          tags: []
        });
        showNotification('Cập nhật thông báo thành công', 'success');
      }
    } catch (error: any) {
      console.error('Error updating announcement:', error);
      showNotification('Lỗi khi cập nhật thông báo', 'error');
    }
  };

  const handleViewAnalytics = async (announcement: Announcement) => {
    try {
      const response = await getAnnouncementAnalytics(announcement._id);
      if (response.success) {
        setAnalytics(response.data);
        setSelectedAnnouncement(announcement);
        setShowAnalyticsModal(true);
      }
    } catch (error: any) {
      console.error('Error loading analytics:', error);
      showNotification('Lỗi khi tải thống kê', 'error');
    }
  };

  const handleBulkAction = async (action: 'publish' | 'delete') => {
    if (!selectedAnnouncements || selectedAnnouncements.length === 0) return;

    const data: BulkActionData = {
      ids: selectedAnnouncements,
      action
    };

    try {
      let response;
      if (action === 'publish') {
        response = await bulkPublishAnnouncements(data);
      } else {
        response = await bulkDeleteAnnouncements(data);
      }

      if (response.success) {
        setSelectedAnnouncements([]);
        await loadAnnouncements(); // Reload data
        showNotification(`${action === 'publish' ? 'Xuất bản' : 'Xóa'} ${selectedAnnouncements?.length || 0} thông báo thành công`, 'success');
      }
    } catch (error: any) {
      console.error(`Error ${action}ing announcements:`, error);
      showNotification(`Lỗi khi ${action === 'publish' ? 'xuất bản' : 'xóa'} thông báo`, 'error');
    }
  };

  const handleAnnouncementSelection = (id: string) => {
    setSelectedAnnouncements(prev => {
      const currentSelection = prev || [];
      return currentSelection.includes(id)
        ? currentSelection.filter(selectedId => selectedId !== id)
        : [...currentSelection, id];
    });
  };


  const getStatusLabel = (s: string) => ({ draft: 'Bản nháp', scheduled: 'Đã lên lịch', published: 'Đã xuất bản', expired: 'Hết hạn', cancelled: 'Đã hủy' }[s] || s);
  const getPriorityLabel = (p: string) => ({ low: 'Thấp', normal: 'Bình thường', high: 'Cao', urgent: 'Khẩn cấp' }[p] || p);
  const getTypeLabel = (t: string) => ({ general: 'Chung', course: 'Khóa học', urgent: 'Khẩn cấp', maintenance: 'Bảo trì', update: 'Cập nhật' }[t] || t);
  const getTargetAudienceLabel = (a: string) => ({ all: 'Tất cả', role: 'Theo vai trò', course: 'Theo khóa học', user: 'Theo người dùng' }[a] || a);
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
            <Stack direction="row" spacing={1}>
              <Tooltip title="Làm mới">
                <IconButton
                  color="inherit"
                  onClick={handleRefresh}
                  disabled={refreshing}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              {selectedAnnouncements && selectedAnnouncements.length > 0 && (
                <>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={() => handleBulkAction('publish')}
                    disabled={refreshing}
                  >
                    Xuất bản ({selectedAnnouncements?.length || 0})
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleBulkAction('delete')}
                    disabled={refreshing}
                  >
                    Xóa ({selectedAnnouncements?.length || 0})
                  </Button>
                </>
              )}
              <Button
                variant="contained"
                onClick={handleCreateAnnouncement}
                startIcon={<AddIcon />}
              >
                Tạo thông báo mới
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Stats */}
      <Grid container spacing={2}>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Stack alignItems="center">
                <Typography variant="h6" fontWeight={800}>
                  {stats?.totalAnnouncements || 0}
                </Typography>
                <Typography variant="caption">Tổng thông báo</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Stack alignItems="center">
                <Typography variant="h6" fontWeight={800}>
                  {stats?.publishedAnnouncements || 0}
                </Typography>
                <Typography variant="caption">Đã xuất bản</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Stack alignItems="center">
                <Typography variant="h6" fontWeight={800}>
                  {stats?.scheduledAnnouncements || 0}
                </Typography>
                <Typography variant="caption">Đã lên lịch</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Stack alignItems="center">
                <Typography variant="h6" fontWeight={800}>
                  {stats?.draftAnnouncements || 0}
                </Typography>
                <Typography variant="caption">Bản nháp</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper variant="outlined">
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} variant="scrollable" scrollButtons allowScrollButtonsMobile>
          <Tab value="all" label={`Tất cả (${stats?.totalAnnouncements || 0})`} />
          <Tab value="draft" label={`Bản nháp (${stats?.draftAnnouncements || 0})`} />
          <Tab value="scheduled" label={`Đã lên lịch (${stats?.scheduledAnnouncements || 0})`} />
          <Tab value="published" label={`Đã xuất bản (${stats?.publishedAnnouncements || 0})`} />
          <Tab value="expired" label={`Hết hạn (${stats?.expiredAnnouncements || 0})`} />
          <Tab value="cancelled" label={`Đã hủy (${stats?.cancelledAnnouncements || 0})`} />
        </Tabs>
      </Paper>

      {/* Filters & View */}
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}><TextField fullWidth placeholder="Tìm kiếm thông báo..." value={filters?.search || ''} onChange={(e) => handleFilterChange('search', e.target.value)} /></Grid>
          <Grid item xs={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Loại</InputLabel>
              <Select
                label="Loại"
                value={filters?.type === 'all' ? '' : (filters?.type || '')}
                onChange={(e) => handleFilterChange('type', String(e.target.value))}
                MenuProps={{ disableScrollLock: true }}
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="general">Chung</MenuItem>
                <MenuItem value="course">Khóa học</MenuItem>
                <MenuItem value="urgent">Khẩn cấp</MenuItem>
                <MenuItem value="maintenance">Bảo trì</MenuItem>
                <MenuItem value="update">Cập nhật</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Mức độ</InputLabel>
              <Select
                label="Mức độ"
                value={filters?.priority === 'all' ? '' : (filters?.priority || '')}
                onChange={(e) => handleFilterChange('priority', String(e.target.value))}
                MenuProps={{ disableScrollLock: true }}
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="low">Thấp</MenuItem>
                <MenuItem value="normal">Bình thường</MenuItem>
                <MenuItem value="high">Cao</MenuItem>
                <MenuItem value="urgent">Khẩn cấp</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Đối tượng</InputLabel>
              <Select
                label="Đối tượng"
                value={filters?.targetAudience === 'all' ? '' : (filters?.targetAudience || '')}
                onChange={(e) => handleFilterChange('targetAudience', String(e.target.value))}
                MenuProps={{ disableScrollLock: true }}
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="role">Theo vai trò</MenuItem>
                <MenuItem value="course">Theo khóa học</MenuItem>
                <MenuItem value="user">Theo người dùng</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                label="Trạng thái"
                value={filters?.status === 'all' ? '' : (filters?.status || '')}
                onChange={(e) => handleFilterChange('status', String(e.target.value))}
                MenuProps={{ disableScrollLock: true }}
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="draft">Bản nháp</MenuItem>
                <MenuItem value="scheduled">Đã lên lịch</MenuItem>
                <MenuItem value="published">Đã xuất bản</MenuItem>
                <MenuItem value="expired">Hết hạn</MenuItem>
                <MenuItem value="cancelled">Đã hủy</MenuItem>
              </Select>
            </FormControl>
          </Grid>
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
          {(!announcements || announcements.length === 0) ? (
            <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6">Không có thông báo nào</Typography>
              <Typography variant="body2" color="text.secondary">Không tìm thấy thông báo phù hợp với bộ lọc hiện tại.</Typography>
            </Paper>
          ) : (
            announcements?.map(announcement => (
              <Card key={announcement._id} variant="outlined">
                <CardContent>
                  <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Checkbox
                        checked={selectedAnnouncements?.includes(announcement._id) || false}
                        onChange={() => handleAnnouncementSelection(announcement._id)}
                        size="small"
                      />
                      <Chip label={getPriorityLabel(announcement.priority)} color={announcement.priority === 'urgent' ? 'error' : announcement.priority === 'high' ? 'error' : announcement.priority === 'normal' ? 'warning' : 'success'} />
                      <Chip label={getStatusLabel(announcement.status)} color={announcement.status === 'published' ? 'success' : announcement.status === 'scheduled' ? 'info' : announcement.status === 'draft' ? 'default' : 'warning'} />
                      <Chip label={getTypeLabel(announcement.type)} />
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Xem thống kê">
                        <IconButton size="small" onClick={() => handleViewAnalytics(announcement)}>
                          <AnalyticsIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Chỉnh sửa">
                        <IconButton size="small" onClick={() => handleEditAnnouncement(announcement)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton size="small" color="error" onClick={() => handleDeleteAnnouncement(announcement._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>
                  <Typography variant="h6" fontWeight={800} mt={1}>{announcement.title}</Typography>
                  <Typography variant="body2" color="text.secondary" mt={0.5}>{announcement.content}</Typography>
                  <Grid container spacing={2} mt={1}>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="text.secondary">Đối tượng</Typography>
                      <Typography>{getTargetAudienceLabel(announcement.target?.type || 'all')}</Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="text.secondary">Người tạo</Typography>
                      <Typography>{typeof announcement.createdBy === 'string' ? announcement.createdBy : announcement.createdBy?.name || 'Unknown'}</Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="text.secondary">Ngày tạo</Typography>
                      <Typography>{formatDate(announcement.createdAt)}</Typography>
                    </Grid>
                    {announcement.publishedAt && (
                      <Grid item xs={12} md={3}>
                        <Typography variant="body2" color="text.secondary">Xuất bản</Typography>
                        <Typography>{formatDate(announcement.publishedAt)}</Typography>
                      </Grid>
                    )}
                  </Grid>
                  <Stack direction="row" spacing={1} mt={1}>
                    <Chip size="small" label={`📖 ${announcement.analytics?.totalViews || 0}`} />
                    <Chip size="small" label={`🖱️ ${announcement.analytics?.totalClicks || 0}`} />
                    {announcement.analytics?.totalAcknowledgments > 0 && (
                      <Chip size="small" label={`✅ ${announcement.analytics.totalAcknowledgments}`} />
                    )}
                    {announcement.tags?.map((tag, index) => (<Chip key={`${announcement._id}-tag-${index}`} size="small" variant="outlined" label={tag} />))}
                  </Stack>
                  <Stack direction="row" spacing={1} mt={1}>
                    {announcement.status === 'draft' && (<Button size="small" variant="contained" onClick={() => handlePublishAnnouncement(announcement._id)}>Xuất bản</Button>)}
                    {announcement.status === 'scheduled' && (<Button size="small" variant="contained" onClick={() => handlePublishAnnouncement(announcement._id)}>Xuất bản ngay</Button>)}
                    {announcement.status === 'published' && (<Button size="small" variant="outlined" color="warning" onClick={() => handleCancelAnnouncement(announcement._id)}>Hủy</Button>)}
                    {announcement.status === 'cancelled' && (<Button size="small" variant="outlined" onClick={() => handlePublishAnnouncement(announcement._id)}>Khôi phục</Button>)}
                  </Stack>
                </CardContent>
              </Card>
            ))
          )}

          {/* Pagination */}
          {announcements && announcements.length > 0 && (
            <TablePagination
              component="div"
              count={totalAnnouncements}
              page={(filters?.page || 1) - 1}
              onPageChange={handlePageChange}
              rowsPerPage={filters?.limit || 20}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPageOptions={[10, 20, 50]}
              labelRowsPerPage="Số dòng mỗi trang:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} trong ${count !== -1 ? count : `nhiều hơn ${to}`}`}
            />
          )}
        </Stack>
      ) : (
        <Card><CardContent>
          <Typography variant="h6" fontWeight={800}>Chế độ xem lịch</Typography>
          <Typography variant="body2" color="text.secondary">Chức năng xem lịch thông báo sẽ được phát triển trong phiên bản tiếp theo.</Typography>
        </CardContent></Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={showCreateModal || showEditModal} onClose={() => { setShowCreateModal(false); setShowEditModal(false); setSelectedAnnouncement(null); }} fullWidth maxWidth="md">
        <DialogTitle>{showCreateModal ? 'Tạo thông báo mới' : `Chỉnh sửa: ${selectedAnnouncement?.title ?? ''}`}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Tiêu đề"
              value={announcementForm?.title || ''}
              onChange={(e) => setAnnouncementForm(prev => ({ ...(prev || {}), title: e.target.value }))}
              required
            />
            <TextField
              fullWidth
              label="Nội dung"
              value={announcementForm?.content || ''}
              onChange={(e) => setAnnouncementForm(prev => ({ ...(prev || {}), content: e.target.value }))}
              multiline
              rows={4}
              required
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Loại</InputLabel>
                  <Select
                    value={announcementForm?.type || 'general'}
                    onChange={(e) => setAnnouncementForm(prev => ({ ...(prev || {}), type: e.target.value as any }))}
                  >
                    <MenuItem value="general">Chung</MenuItem>
                    <MenuItem value="course">Khóa học</MenuItem>
                    <MenuItem value="urgent">Khẩn cấp</MenuItem>
                    <MenuItem value="maintenance">Bảo trì</MenuItem>
                    <MenuItem value="update">Cập nhật</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Mức độ</InputLabel>
                  <Select
                    value={announcementForm?.priority || 'normal'}
                    onChange={(e) => setAnnouncementForm(prev => ({ ...(prev || {}), priority: e.target.value as any }))}
                  >
                    <MenuItem value="low">Thấp</MenuItem>
                    <MenuItem value="normal">Bình thường</MenuItem>
                    <MenuItem value="high">Cao</MenuItem>
                    <MenuItem value="urgent">Khẩn cấp</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <FormControl fullWidth>
              <InputLabel>Đối tượng</InputLabel>
              <Select
                value={announcementForm?.targetAudience || 'all'}
                onChange={(e) => setAnnouncementForm(prev => ({ ...(prev || {}), targetAudience: e.target.value as any }))}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="role">Theo vai trò</MenuItem>
                <MenuItem value="course">Theo khóa học</MenuItem>
                <MenuItem value="user">Theo người dùng</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Tags (phân cách bằng dấu phẩy)"
              value={announcementForm?.tags?.join(', ') || ''}
              onChange={(e) => setAnnouncementForm(prev => ({
                ...(prev || {}),
                tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
              }))}
              placeholder="maintenance, system-update, important"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setShowCreateModal(false); setShowEditModal(false); setSelectedAnnouncement(null); }}>Hủy</Button>
          <Button
            variant="contained"
            onClick={showCreateModal ? handleCreateAnnouncementSubmit : handleUpdateAnnouncementSubmit}
            disabled={!announcementForm?.title || !announcementForm?.content}
          >
            {showCreateModal ? 'Tạo' : 'Cập nhật'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Analytics Dialog */}
      <Dialog open={showAnalyticsModal} onClose={() => { setShowAnalyticsModal(false); setSelectedAnnouncement(null); setAnalytics(null); }} fullWidth maxWidth="md">
        <DialogTitle>Thống kê: {selectedAnnouncement?.title}</DialogTitle>
        <DialogContent dividers>
          {analytics ? (
            <Stack spacing={2}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" color="primary">{analytics?.readCount || 0}</Typography>
                      <Typography variant="caption">Lượt đọc</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" color="secondary">{analytics?.clickCount || 0}</Typography>
                      <Typography variant="caption">Lượt click</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              <Typography variant="body2" color="text.secondary">
                Chi tiết thống kê sẽ được hiển thị khi API được implement.
              </Typography>
            </Stack>
          ) : (
            <Typography>Đang tải thống kê...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setShowAnalyticsModal(false); setSelectedAnnouncement(null); setAnalytics(null); }}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...(prev || {}), open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...(prev || {}), open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Announcements;
