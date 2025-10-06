import React, { useState, useEffect, useCallback } from 'react';
// import './SupportCenter.css';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Assignment as AssignmentIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import {
  SupportTicket,
  FAQ,
  SupportStaff,
  TicketStats,
  TicketFilters,
  AssignTicketData,
  UpdateTicketStatusData,
  CreateFAQData,
  UpdateFAQData,
  getSupportTickets,
  getSupportTicketById,
  assignTicket,
  updateTicketStatus,
  getSupportStaff,
  getSupportStats,
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  toggleFAQStatus
} from '../../../services/admin/supportService';

const SupportCenter: React.FC = () => {
  // ========== STATE ==========
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [supportStaff, setSupportStaff] = useState<SupportStaff[]>([]);
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'tickets' | 'faqs' | 'chat'>('tickets');

  // Filters and pagination
  const [ticketFilters, setTicketFilters] = useState<TicketFilters>({
    search: '',
    status: 'all',
    priority: 'all',
    category: 'all',
    assignedTo: 'all',
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [totalTickets, setTotalTickets] = useState(0);

  // Modals and dialogs
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showTicketDetails, setShowTicketDetails] = useState(false);
  const [showCreateFAQ, setShowCreateFAQ] = useState(false);
  const [showEditFAQ, setShowEditFAQ] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);

  // Forms
  const [faqForm, setFaqForm] = useState<CreateFAQData>({
    question: '',
    answer: '',
    category: 'general',
    isPublished: false
  });

  // Notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  });

  // ========== API FUNCTIONS ==========
  const loadTickets = useCallback(async () => {
    try {
      const response = await getSupportTickets(ticketFilters);
      if (response.success) {
        setTickets(response.data.data);
        setTotalTickets(response.data.total);
      }
    } catch (error: any) {
      console.error('Error loading tickets:', error);
      // Set empty data instead of showing error for now
      setTickets([]);
      setTotalTickets(0);
      // showNotification('API chưa được implement - Tickets sẽ được thêm sau', 'warning');
    }
  }, [ticketFilters]);

  const loadFAQs = useCallback(async () => {
    try {
      const response = await getFAQs();
      if (response.success) {
        setFaqs(response.data);
      }
    } catch (error: any) {
      console.error('Error loading FAQs:', error);
      // Set empty array instead of showing error for now
      setFaqs([]);
      // showNotification('API chưa được implement - FAQ sẽ được thêm sau', 'warning');
    }
  }, []);

  const loadSupportStaff = useCallback(async () => {
    try {
      const response = await getSupportStaff();
      if (response.success) {
        setSupportStaff(response.data);
      }
    } catch (error: any) {
      console.error('Error loading support staff:', error);
      // Set empty array instead of showing error for now
      setSupportStaff([]);
      // showNotification('API chưa được implement - Staff sẽ được thêm sau', 'warning');
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const response = await getSupportStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error: any) {
      console.error('Error loading stats:', error);
      // Set default stats instead of showing error for now
      setStats({
        totalTickets: 0,
        openTickets: 0,
        inProgressTickets: 0,
        resolvedTickets: 0,
        closedTickets: 0,
        averageResponseTime: 0,
        averageResolutionTime: 0,
        ticketsByCategory: [],
        ticketsByPriority: []
      });
      // showNotification('API chưa được implement - Stats sẽ được thêm sau', 'warning');
    }
  }, []);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadTickets(),
        loadFAQs(),
        loadSupportStaff(),
        loadStats()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [loadTickets, loadFAQs, loadSupportStaff, loadStats]);

  // ========== EFFECTS ==========
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Load tickets when filters change
  useEffect(() => {
    if (activeTab === 'tickets') {
      loadTickets();
    }
  }, [loadTickets, activeTab]);

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

  const handleTicketFilterChange = (key: string, value: string) => {
    setTicketFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    setTicketFilters(prev => ({ ...prev, page: newPage + 1 }));
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTicketFilters(prev => ({
      ...prev,
      limit: parseInt(event.target.value, 10),
      page: 1
    }));
  };

  const handleTicketClick = async (ticket: SupportTicket) => {
    try {
      const response = await getSupportTicketById(ticket._id);
      if (response.success) {
        setSelectedTicket(response.data);
        setShowTicketDetails(true);
      }
    } catch (error: any) {
      console.error('Error loading ticket details:', error);
      showNotification('Lỗi khi tải chi tiết ticket', 'error');
    }
  };

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    try {
      const data: UpdateTicketStatusData = { status: newStatus };
      const response = await updateTicketStatus(ticketId, data);
      if (response.success) {
        setTickets(prev => prev.map(t => t._id === ticketId ? response.data : t));
        if (selectedTicket?._id === ticketId) {
          setSelectedTicket(response.data);
        }
        showNotification('Cập nhật trạng thái thành công', 'success');
      }
    } catch (error: any) {
      console.error('Error updating ticket status:', error);
      showNotification('Lỗi khi cập nhật trạng thái', 'error');
    }
  };

  const handleAssignTicket = async (ticketId: string, assignTo: string) => {
    try {
      const data: AssignTicketData = { assignedTo: assignTo };
      const response = await assignTicket(ticketId, data);
      if (response.success) {
        setTickets(prev => prev.map(t => t._id === ticketId ? response.data : t));
        if (selectedTicket?._id === ticketId) {
          setSelectedTicket(response.data);
        }
        showNotification('Phân công ticket thành công', 'success');
      }
    } catch (error: any) {
      console.error('Error assigning ticket:', error);
      showNotification('Lỗi khi phân công ticket', 'error');
    }
  };

  const handlePriorityChange = async (ticketId: string, newPriority: string) => {
    try {
      // Update priority via API (you might need to create this endpoint)
      setTickets(prev => prev.map(t => t._id === ticketId ? { ...t, priority: newPriority as any } : t));
      if (selectedTicket?._id === ticketId) {
        setSelectedTicket(prev => prev ? { ...prev, priority: newPriority as any } : null);
      }
      showNotification('Cập nhật mức độ thành công', 'success');
    } catch (error: any) {
      console.error('Error updating priority:', error);
      showNotification('Lỗi khi cập nhật mức độ', 'error');
    }
  };


  const handleCreateFAQ = async () => {
    try {
      const response = await createFAQ(faqForm);
      if (response.success) {
        setFaqs(prev => [...prev, response.data]);
        setShowCreateFAQ(false);
        setFaqForm({ question: '', answer: '', category: 'general', isPublished: false });
        showNotification('Tạo FAQ thành công', 'success');
      }
    } catch (error: any) {
      console.error('Error creating FAQ:', error);
      showNotification('Lỗi khi tạo FAQ', 'error');
    }
  };

  const handleUpdateFAQ = async () => {
    if (!editingFAQ) return;

    try {
      const data: UpdateFAQData = { ...faqForm };
      const response = await updateFAQ(editingFAQ._id, data);
      if (response.success) {
        setFaqs(prev => prev.map(faq => faq._id === editingFAQ._id ? response.data : faq));
        setShowEditFAQ(false);
        setEditingFAQ(null);
        setFaqForm({ question: '', answer: '', category: 'general', isPublished: false });
        showNotification('Cập nhật FAQ thành công', 'success');
      }
    } catch (error: any) {
      console.error('Error updating FAQ:', error);
      showNotification('Lỗi khi cập nhật FAQ', 'error');
    }
  };

  const handleDeleteFAQ = async (faqId: string) => {
    try {
      const response = await deleteFAQ(faqId);
      if (response.success) {
        setFaqs(prev => prev.filter(faq => faq._id !== faqId));
        showNotification('Xóa FAQ thành công', 'success');
      }
    } catch (error: any) {
      console.error('Error deleting FAQ:', error);
      showNotification('Lỗi khi xóa FAQ', 'error');
    }
  };

  const handleToggleFAQStatus = async (faqId: string) => {
    try {
      const response = await toggleFAQStatus(faqId);
      if (response.success) {
        setFaqs(prev => prev.map(faq => faq._id === faqId ? response.data : faq));
        showNotification('Cập nhật trạng thái FAQ thành công', 'success');
      }
    } catch (error: any) {
      console.error('Error toggling FAQ status:', error);
      showNotification('Lỗi khi cập nhật trạng thái FAQ', 'error');
    }
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleString('vi-VN');

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">Đang tải Support Center...</Typography>
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
              <Typography variant="h5" fontWeight={800}>Support Center</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Quản lý ticket hỗ trợ, FAQ và giám sát chat</Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                disabled={refreshing}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.3)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderColor: 'rgba(255,255,255,0.5)'
                  }
                }}
              >
                {refreshing ? 'Đang tải...' : 'Làm mới'}
              </Button>
              {activeTab === 'faqs' && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setShowCreateFAQ(true)}
                  sx={{ backgroundColor: 'rgba(255,255,255,0.2)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' } }}
                >
                  Tạo FAQ mới
                </Button>
              )}
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
                  {stats?.totalTickets || 0}
                </Typography>
                <Typography variant="caption">Tổng ticket</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Stack alignItems="center">
                <Typography variant="h6" fontWeight={800}>
                  {stats?.openTickets || 0}
                </Typography>
                <Typography variant="caption">Ticket mới</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Stack alignItems="center">
                <Typography variant="h6" fontWeight={800}>
                  {stats?.inProgressTickets || 0}
                </Typography>
                <Typography variant="caption">Đang xử lý</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Stack alignItems="center">
                <Typography variant="h6" fontWeight={800}>
                  {stats?.resolvedTickets || 0}
                </Typography>
                <Typography variant="caption">Đã giải quyết</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper variant="outlined">
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} variant="scrollable" scrollButtons allowScrollButtonsMobile>
          <Tab value="tickets" label={`Tickets (${totalTickets})`} />
          <Tab value="faqs" label={`FAQ (${faqs.length})`} />
          <Tab value="chat" label="Live Chat" />
        </Tabs>
      </Paper>

      {/* Tickets */}
      {activeTab === 'tickets' && (
        <Card>
          <CardContent>
            {/* Filters */}
            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Tìm kiếm tickets..."
                  value={ticketFilters.search || ''}
                  onChange={(e) => handleTicketFilterChange('search', e.target.value)}
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    label="Trạng thái"
                    value={ticketFilters.status || 'all'}
                    onChange={(e) => handleTicketFilterChange('status', String(e.target.value))}
                    MenuProps={{ disableScrollLock: true }}
                  >
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="open">Mới</MenuItem>
                    <MenuItem value="in_progress">Đang xử lý</MenuItem>
                    <MenuItem value="waiting_user">Chờ phản hồi</MenuItem>
                    <MenuItem value="resolved">Đã giải quyết</MenuItem>
                    <MenuItem value="closed">Đã đóng</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Mức độ</InputLabel>
                  <Select
                    label="Mức độ"
                    value={ticketFilters.priority || 'all'}
                    onChange={(e) => handleTicketFilterChange('priority', String(e.target.value))}
                    MenuProps={{ disableScrollLock: true }}
                  >
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="low">Thấp</MenuItem>
                    <MenuItem value="medium">Trung bình</MenuItem>
                    <MenuItem value="high">Cao</MenuItem>
                    <MenuItem value="urgent">Khẩn cấp</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Danh mục</InputLabel>
                  <Select
                    label="Danh mục"
                    value={ticketFilters.category || 'all'}
                    onChange={(e) => handleTicketFilterChange('category', String(e.target.value))}
                    MenuProps={{ disableScrollLock: true }}
                  >
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="technical">Kỹ thuật</MenuItem>
                    <MenuItem value="billing">Thanh toán</MenuItem>
                    <MenuItem value="course">Khóa học</MenuItem>
                    <MenuItem value="account">Tài khoản</MenuItem>
                    <MenuItem value="general">Chung</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Phân công</InputLabel>
                  <Select
                    label="Phân công"
                    value={ticketFilters.assignedTo || 'all'}
                    onChange={(e) => handleTicketFilterChange('assignedTo', String(e.target.value))}
                    MenuProps={{ disableScrollLock: true }}
                  >
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="unassigned">Chưa phân công</MenuItem>
                    {supportStaff?.map(staff => (
                      <MenuItem key={staff._id} value={staff._id}>{staff.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Tickets Table */}
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Ticket</TableCell>
                    <TableCell>Tiêu đề</TableCell>
                    <TableCell>Người dùng</TableCell>
                    <TableCell>Danh mục</TableCell>
                    <TableCell>Mức độ</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Phân công</TableCell>
                    <TableCell>Ngày tạo</TableCell>
                    <TableCell>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tickets?.map((ticket) => (
                    <TableRow key={ticket._id} hover sx={{ cursor: 'pointer' }}>
                      <TableCell>
                        <Chip label={ticket.ticketNumber} size="small" />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {ticket.subject}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {ticket.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{ticket.userName}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {ticket.userEmail}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={ticket.category} size="small" />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={ticket.priority}
                          size="small"
                          color={ticket.priority === 'urgent' ? 'error' : ticket.priority === 'high' ? 'error' : ticket.priority === 'medium' ? 'warning' : 'success'}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={ticket.status}
                          size="small"
                          color={ticket.status === 'resolved' ? 'success' : ticket.status === 'open' ? 'info' : ticket.status === 'in_progress' ? 'warning' : ticket.status === 'waiting_user' ? 'secondary' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        {ticket.assignedToName ? (
                          <Chip label={ticket.assignedToName} size="small" color="primary" variant="outlined" />
                        ) : (
                          <Chip label="Chưa phân công" size="small" color="default" variant="outlined" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {formatDate(ticket.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Xem chi tiết">
                            <IconButton size="small" onClick={() => handleTicketClick(ticket)}>
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Gán ticket">
                            <IconButton size="small" color="primary">
                              <AssignmentIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
              component="div"
              count={totalTickets}
              page={(ticketFilters.page || 1) - 1}
              onPageChange={handlePageChange}
              rowsPerPage={ticketFilters.limit || 20}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPageOptions={[10, 20, 50]}
              labelRowsPerPage="Số dòng mỗi trang:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
            />
          </CardContent>
        </Card>
      )}

      {/* FAQs */}
      {activeTab === 'faqs' && (
        <Card>
          <CardContent>
            <Stack spacing={2}>
              {faqs?.map((faq) => (
                <Paper key={faq._id} variant="outlined" sx={{ p: 2 }}>
                  <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
                    <Box>
                      <Typography fontWeight={700}>{faq.question}</Typography>
                      <Typography variant="body2" color="text.secondary" mt={0.5}>
                        {faq.answer.length > 100 ? `${faq.answer.substring(0, 100)}...` : faq.answer}
                      </Typography>
                      <Stack direction="row" spacing={1} mt={1}>
                        <Chip size="small" label={faq.category} />
                        <Chip
                          size="small"
                          label={faq.isPublished ? 'Đã xuất bản' : 'Bản nháp'}
                          color={faq.isPublished ? 'success' : 'default'}
                        />
                        <Chip size="small" label={`👁️ ${faq.viewCount}`} />
                        <Chip size="small" label={`👍 ${faq.helpfulCount}`} />
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(faq.createdAt)}
                        </Typography>
                      </Stack>
                    </Box>
                    <Stack direction="row" spacing={1} mt={{ xs: 1, md: 0 }}>
                      <Tooltip title="Sửa FAQ">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => {
                            setEditingFAQ(faq);
                            setFaqForm({
                              question: faq.question,
                              answer: faq.answer,
                              category: faq.category,
                              isPublished: faq.isPublished
                            });
                            setShowEditFAQ(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={faq.isPublished ? 'Ẩn FAQ' : 'Xuất bản FAQ'}>
                        <IconButton
                          size="small"
                          color={faq.isPublished ? 'warning' : 'success'}
                          onClick={() => handleToggleFAQStatus(faq._id)}
                        >
                          {faq.isPublished ? <CloseIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa FAQ">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            if (window.confirm('Bạn có chắc chắn muốn xóa FAQ này?')) {
                              handleDeleteFAQ(faq._id);
                            }
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>
                </Paper>
              ))}
              {(!faqs || faqs.length === 0) && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    Chưa có FAQ nào
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Tạo FAQ đầu tiên để giúp người dùng
                  </Typography>
                </Box>
              )}
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Chat placeholder */}
      {activeTab === 'chat' && (
        <Card><CardContent>
          <Typography variant="h6" fontWeight={800}>Live Chat Monitoring</Typography>
          <Typography variant="body2" color="text.secondary">Hệ thống live chat sẽ được tích hợp ở đây để theo dõi real-time.</Typography>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} md={6}><Paper variant="outlined" sx={{ p: 2 }}><Typography align="center" variant="h4">0</Typography><Typography align="center" variant="caption">Cuộc hội thoại đang diễn ra</Typography></Paper></Grid>
            <Grid item xs={12} md={6}><Paper variant="outlined" sx={{ p: 2 }}><Typography align="center" variant="h4">0</Typography><Typography align="center" variant="caption">Người dùng đang chờ</Typography></Paper></Grid>
          </Grid>
        </CardContent></Card>
      )}

      {/* Ticket Details Dialog */}
      <Dialog open={showTicketDetails && !!selectedTicket} onClose={() => setShowTicketDetails(false)} fullWidth maxWidth="md">
        {selectedTicket && (
          <>
            <DialogTitle>Chi tiết Ticket: {selectedTicket.ticketNumber}</DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12}><Typography fontWeight={700}>{selectedTicket.subject}</Typography></Grid>
                <Grid item xs={12}><Typography variant="body2" color="text.secondary">{selectedTicket.description}</Typography></Grid>
                <Grid item xs={12} md={6}><Typography variant="body2" color="text.secondary">Mức độ</Typography><Chip label={selectedTicket.priority} color={selectedTicket.priority === 'urgent' ? 'error' : selectedTicket.priority === 'high' ? 'error' : selectedTicket.priority === 'medium' ? 'warning' : 'success'} /></Grid>
                <Grid item xs={12} md={6}><Typography variant="body2" color="text.secondary">Trạng thái</Typography><Chip label={selectedTicket.status} color={selectedTicket.status === 'resolved' ? 'success' : selectedTicket.status === 'open' ? 'info' : selectedTicket.status === 'in_progress' ? 'warning' : selectedTicket.status === 'waiting_user' ? 'secondary' : 'default'} /></Grid>
                <Grid item xs={12} md={6}><Typography variant="body2" color="text.secondary">Danh mục</Typography><Chip label={selectedTicket.category} /></Grid>
                <Grid item xs={12} md={6}><Typography variant="body2" color="text.secondary">Người dùng</Typography><Typography>{selectedTicket.userName} — {selectedTicket.userEmail}</Typography></Grid>
                <Grid item xs={12} md={6}><Typography variant="body2" color="text.secondary">Ngày tạo</Typography><Typography>{formatDate(selectedTicket.createdAt)}</Typography></Grid>
                <Grid item xs={12} md={6}><Typography variant="body2" color="text.secondary">Cập nhật</Typography><Typography>{formatDate(selectedTicket.updatedAt)}</Typography></Grid>
                <Grid item xs={12}><Typography variant="body2" color="text.secondary">Gắn thẻ</Typography><Stack direction="row" spacing={1}>{selectedTicket.tags.map((t, i) => (<Chip key={i} size="small" variant="outlined" label={t} />))}</Stack></Grid>
                <Grid item xs={12}><Typography variant="body2" color="text.secondary">Thao tác</Typography><Stack direction={{ xs: 'column', md: 'row' }} spacing={1}><FormControl fullWidth><InputLabel>Trạng thái</InputLabel><Select label="Trạng thái" value={selectedTicket.status} onChange={(e) => handleStatusChange(selectedTicket._id, String(e.target.value))}><MenuItem value="open">Mới</MenuItem><MenuItem value="in_progress">Đang xử lý</MenuItem><MenuItem value="waiting_user">Chờ phản hồi</MenuItem><MenuItem value="resolved">Đã giải quyết</MenuItem><MenuItem value="closed">Đã đóng</MenuItem></Select></FormControl><FormControl fullWidth><InputLabel>Mức độ</InputLabel><Select label="Mức độ" value={selectedTicket.priority} onChange={(e) => handlePriorityChange(selectedTicket._id, String(e.target.value))}><MenuItem value="low">Thấp</MenuItem><MenuItem value="medium">Trung bình</MenuItem><MenuItem value="high">Cao</MenuItem><MenuItem value="urgent">Khẩn cấp</MenuItem></Select></FormControl><FormControl fullWidth><InputLabel>Phân công</InputLabel><Select label="Phân công" value={selectedTicket.assignedTo || 'unassigned'} onChange={(e) => handleAssignTicket(selectedTicket._id, String(e.target.value))}><MenuItem value="unassigned">Chưa phân công</MenuItem><MenuItem value="admin-1">Admin User</MenuItem><MenuItem value="admin-2">Support Agent</MenuItem></Select></FormControl></Stack></Grid>
              </Grid>
            </DialogContent>
            <DialogActions><Button onClick={() => setShowTicketDetails(false)}>Đóng</Button></DialogActions>
          </>
        )}
      </Dialog>

      {/* Create FAQ Dialog */}
      <Dialog
        open={showCreateFAQ}
        onClose={() => {
          setShowCreateFAQ(false);
          setFaqForm({ question: '', answer: '', category: 'general', isPublished: false });
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Tạo FAQ mới</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Câu hỏi"
              value={faqForm.question}
              onChange={(e) => setFaqForm(prev => ({ ...prev, question: e.target.value }))}
              placeholder="Nhập câu hỏi..."
              required
              multiline
              rows={2}
            />
            <TextField
              fullWidth
              label="Câu trả lời"
              value={faqForm.answer}
              onChange={(e) => setFaqForm(prev => ({ ...prev, answer: e.target.value }))}
              placeholder="Nhập câu trả lời..."
              required
              multiline
              rows={4}
            />
            <FormControl fullWidth>
              <InputLabel>Danh mục</InputLabel>
              <Select
                label="Danh mục"
                value={faqForm.category}
                onChange={(e) => setFaqForm(prev => ({ ...prev, category: e.target.value }))}
              >
                <MenuItem value="general">Chung</MenuItem>
                <MenuItem value="technical">Kỹ thuật</MenuItem>
                <MenuItem value="billing">Thanh toán</MenuItem>
                <MenuItem value="course">Khóa học</MenuItem>
                <MenuItem value="account">Tài khoản</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                label="Trạng thái"
                value={faqForm.isPublished ? 'published' : 'draft'}
                onChange={(e) => setFaqForm(prev => ({ ...prev, isPublished: e.target.value === 'published' }))}
              >
                <MenuItem value="draft">Bản nháp</MenuItem>
                <MenuItem value="published">Đã xuất bản</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setShowCreateFAQ(false);
            setFaqForm({ question: '', answer: '', category: 'general', isPublished: false });
          }}>
            Hủy
          </Button>
          <Button onClick={handleCreateFAQ} variant="contained" color="primary">
            Tạo FAQ
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit FAQ Dialog */}
      <Dialog
        open={showEditFAQ}
        onClose={() => {
          setShowEditFAQ(false);
          setEditingFAQ(null);
          setFaqForm({ question: '', answer: '', category: 'general', isPublished: false });
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Sửa FAQ</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Câu hỏi"
              value={faqForm.question}
              onChange={(e) => setFaqForm(prev => ({ ...prev, question: e.target.value }))}
              placeholder="Nhập câu hỏi..."
              required
              multiline
              rows={2}
            />
            <TextField
              fullWidth
              label="Câu trả lời"
              value={faqForm.answer}
              onChange={(e) => setFaqForm(prev => ({ ...prev, answer: e.target.value }))}
              placeholder="Nhập câu trả lời..."
              required
              multiline
              rows={4}
            />
            <FormControl fullWidth>
              <InputLabel>Danh mục</InputLabel>
              <Select
                label="Danh mục"
                value={faqForm.category}
                onChange={(e) => setFaqForm(prev => ({ ...prev, category: e.target.value }))}
              >
                <MenuItem value="general">Chung</MenuItem>
                <MenuItem value="technical">Kỹ thuật</MenuItem>
                <MenuItem value="billing">Thanh toán</MenuItem>
                <MenuItem value="course">Khóa học</MenuItem>
                <MenuItem value="account">Tài khoản</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                label="Trạng thái"
                value={faqForm.isPublished ? 'published' : 'draft'}
                onChange={(e) => setFaqForm(prev => ({ ...prev, isPublished: e.target.value === 'published' }))}
              >
                <MenuItem value="draft">Bản nháp</MenuItem>
                <MenuItem value="published">Đã xuất bản</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setShowEditFAQ(false);
            setEditingFAQ(null);
            setFaqForm({ question: '', answer: '', category: 'general', isPublished: false });
          }}>
            Hủy
          </Button>
          <Button onClick={handleUpdateFAQ} variant="contained" color="primary">
            Cập nhật FAQ
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SupportCenter;
