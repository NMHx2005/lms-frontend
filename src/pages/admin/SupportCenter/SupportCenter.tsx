import React, { useState, useEffect } from 'react';
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
  DialogActions
} from '@mui/material';

interface SupportTicket { _id: string; ticketNumber: string; userId: string; userName: string; userEmail: string; subject: string; description: string; priority: 'low' | 'medium' | 'high' | 'urgent'; status: 'open' | 'in_progress' | 'waiting_user' | 'resolved' | 'closed'; category: 'technical' | 'billing' | 'course' | 'account' | 'general'; assignedTo?: string; assignedToName?: string; createdAt: string; updatedAt: string; lastResponseAt?: string; responseCount: number; tags: string[]; }
interface FAQ { _id: string; question: string; answer: string; category: string; isPublished: boolean; viewCount: number; helpfulCount: number; createdAt: string; updatedAt: string; }

const SupportCenter: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<SupportTicket[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tickets' | 'faqs' | 'chat'>('tickets');
  const [ticketFilters, setTicketFilters] = useState({ search: '', status: 'all', priority: 'all', category: 'all', assignedTo: 'all' });
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showTicketDetails, setShowTicketDetails] = useState(false);
  const [showCreateFAQ, setShowCreateFAQ] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const mockTickets: SupportTicket[] = [
        { _id: 'ticket-1', ticketNumber: 'TKT-2024-001', userId: 'user-1', userName: 'Nguyễn Văn A', userEmail: 'nguyenvana@email.com', subject: 'Không thể truy cập khóa học React', description: 'Tôi đã mua khóa học React nhưng không thể truy cập được. Hiện tại đang bị lỗi 404 khi click vào khóa học.', priority: 'high', status: 'open', category: 'course', createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z', responseCount: 0, tags: ['react', 'access', '404'] },
        { _id: 'ticket-2', ticketNumber: 'TKT-2024-002', userId: 'user-2', userName: 'Trần Thị B', userEmail: 'tranthib@email.com', subject: 'Vấn đề về thanh toán', description: 'Tôi đã thanh toán bằng thẻ tín dụng nhưng hệ thống vẫn hiển thị chưa thanh toán. Cần hỗ trợ kiểm tra.', priority: 'urgent', status: 'in_progress', category: 'billing', assignedTo: 'admin-1', assignedToName: 'Admin User', createdAt: '2024-01-15T09:15:00Z', updatedAt: '2024-01-15T11:00:00Z', lastResponseAt: '2024-01-15T11:00:00Z', responseCount: 2, tags: ['payment', 'credit-card', 'billing'] },
        { _id: 'ticket-3', ticketNumber: 'TKT-2024-003', userId: 'user-3', userName: 'Lê Văn C', userEmail: 'levanc@email.com', subject: 'Quên mật khẩu tài khoản', description: 'Tôi không thể đăng nhập vào tài khoản vì quên mật khẩu. Đã thử reset password nhưng không nhận được email.', priority: 'medium', status: 'waiting_user', category: 'account', assignedTo: 'admin-2', assignedToName: 'Support Agent', createdAt: '2024-01-14T16:45:00Z', updatedAt: '2024-01-15T08:30:00Z', lastResponseAt: '2024-01-15T08:30:00Z', responseCount: 1, tags: ['password', 'login', 'reset'] },
        { _id: 'ticket-4', ticketNumber: 'TKT-2024-004', userId: 'user-4', userName: 'Phạm Thị D', userEmail: 'phamthid@email.com', subject: 'Video không phát được', description: 'Khi xem video bài giảng, video bị giật lag và không thể phát được. Đã thử nhiều trình duyệt khác nhau.', priority: 'medium', status: 'resolved', category: 'technical', assignedTo: 'admin-1', assignedToName: 'Admin User', createdAt: '2024-01-13T14:20:00Z', updatedAt: '2024-01-14T15:30:00Z', lastResponseAt: '2024-01-14T15:30:00Z', responseCount: 3, tags: ['video', 'streaming', 'technical'] }
      ];
      const mockFAQs: FAQ[] = [
        { _id: 'faq-1', question: 'Làm thế nào để đăng ký tài khoản?', answer: 'Bạn có thể đăng ký tài khoản bằng cách click vào nút "Đăng ký" ở góc trên bên phải, sau đó điền đầy đủ thông tin cá nhân và xác nhận email.', category: 'account', isPublished: true, viewCount: 1250, helpfulCount: 89, createdAt: '2024-01-01', updatedAt: '2024-01-10' },
        { _id: 'faq-2', question: 'Có thể học offline không?', answer: 'Hiện tại tất cả khóa học đều được thiết kế để học online. Bạn có thể học mọi lúc, mọi nơi chỉ cần có kết nối internet.', category: 'course', isPublished: true, viewCount: 890, helpfulCount: 67, createdAt: '2024-01-02', updatedAt: '2024-01-12' },
        { _id: 'faq-3', question: 'Làm sao để hoàn tiền?', answer: 'Bạn có thể yêu cầu hoàn tiền trong vòng 30 ngày kể từ ngày mua khóa học. Liên hệ support team để được hướng dẫn chi tiết.', category: 'billing', isPublished: true, viewCount: 567, helpfulCount: 45, createdAt: '2024-01-03', updatedAt: '2024-01-15' }
      ];
      setTickets(mockTickets); setFilteredTickets(mockTickets); setFaqs(mockFAQs); setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = tickets;
    if (ticketFilters.search) filtered = filtered.filter(t => t.subject.toLowerCase().includes(ticketFilters.search.toLowerCase()) || t.description.toLowerCase().includes(ticketFilters.search.toLowerCase()) || t.userName.toLowerCase().includes(ticketFilters.search.toLowerCase()));
    if (ticketFilters.status !== 'all') filtered = filtered.filter(t => t.status === ticketFilters.status);
    if (ticketFilters.priority !== 'all') filtered = filtered.filter(t => t.priority === ticketFilters.priority);
    if (ticketFilters.category !== 'all') filtered = filtered.filter(t => t.category === ticketFilters.category);
    if (ticketFilters.assignedTo !== 'all') filtered = filtered.filter(t => ticketFilters.assignedTo === 'unassigned' ? !t.assignedTo : t.assignedTo === ticketFilters.assignedTo);
    setFilteredTickets(filtered);
  }, [ticketFilters, tickets]);

  const handleTicketFilterChange = (key: string, value: string) => setTicketFilters(prev => ({ ...prev, [key]: value }));
  const handleTicketClick = (ticket: SupportTicket) => { setSelectedTicket(ticket); setShowTicketDetails(true); };
  const handleStatusChange = (ticketId: string, newStatus: string) => setTickets(tickets.map(t => t._id === ticketId ? { ...t, status: newStatus as any } : t));
  const handlePriorityChange = (ticketId: string, newPriority: string) => setTickets(tickets.map(t => t._id === ticketId ? { ...t, priority: newPriority as any } : t));
  const handleAssignTicket = (ticketId: string, assignTo: string) => setTickets(tickets.map(t => t._id === ticketId ? { ...t, assignedTo: assignTo, assignedToName: 'Admin User' } : t));

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
            <Button variant="contained" onClick={() => setShowCreateFAQ(true)}>+ Tạo FAQ mới</Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Stats */}
      <Grid container spacing={2}>
        <Grid item xs={6} md={3}><Card><CardContent><Stack alignItems="center"><Typography variant="h6" fontWeight={800}>{tickets.length}</Typography><Typography variant="caption">Tổng ticket</Typography></Stack></CardContent></Card></Grid>
        <Grid item xs={6} md={3}><Card><CardContent><Stack alignItems="center"><Typography variant="h6" fontWeight={800}>{tickets.filter(t => t.status === 'open').length}</Typography><Typography variant="caption">Ticket mới</Typography></Stack></CardContent></Card></Grid>
        <Grid item xs={6} md={3}><Card><CardContent><Stack alignItems="center"><Typography variant="h6" fontWeight={800}>{tickets.filter(t => t.status === 'in_progress').length}</Typography><Typography variant="caption">Đang xử lý</Typography></Stack></CardContent></Card></Grid>
        <Grid item xs={6} md={3}><Card><CardContent><Stack alignItems="center"><Typography variant="h6" fontWeight={800}>{tickets.filter(t => t.status === 'resolved').length}</Typography><Typography variant="caption">Đã giải quyết</Typography></Stack></CardContent></Card></Grid>
      </Grid>

      {/* Tabs */}
      <Paper variant="outlined">
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} variant="scrollable" scrollButtons allowScrollButtonsMobile>
          <Tab value="tickets" label={`Tickets (${tickets.length})`} />
          <Tab value="faqs" label={`FAQ (${faqs.length})`} />
          <Tab value="chat" label="Live Chat" />
        </Tabs>
      </Paper>

      {/* Tickets */}
      {activeTab === 'tickets' && (
        <Card><CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}><TextField fullWidth placeholder="Tìm kiếm tickets..." value={ticketFilters.search} onChange={(e) => handleTicketFilterChange('search', e.target.value)} /></Grid>
            <Grid item xs={6} md={2}><FormControl fullWidth><InputLabel>Trạng thái</InputLabel><Select label="Trạng thái" value={ticketFilters.status} onChange={(e) => handleTicketFilterChange('status', String(e.target.value))} MenuProps={{ disableScrollLock: true }}><MenuItem value="all">Tất cả</MenuItem><MenuItem value="open">Mới</MenuItem><MenuItem value="in_progress">Đang xử lý</MenuItem><MenuItem value="waiting_user">Chờ phản hồi</MenuItem><MenuItem value="resolved">Đã giải quyết</MenuItem><MenuItem value="closed">Đã đóng</MenuItem></Select></FormControl></Grid>
            <Grid item xs={6} md={2}><FormControl fullWidth><InputLabel>Mức độ</InputLabel><Select label="Mức độ" value={ticketFilters.priority} onChange={(e) => handleTicketFilterChange('priority', String(e.target.value))} MenuProps={{ disableScrollLock: true }}><MenuItem value="all">Tất cả</MenuItem><MenuItem value="low">Thấp</MenuItem><MenuItem value="medium">Trung bình</MenuItem><MenuItem value="high">Cao</MenuItem><MenuItem value="urgent">Khẩn cấp</MenuItem></Select></FormControl></Grid>
            <Grid item xs={6} md={2}><FormControl fullWidth><InputLabel>Danh mục</InputLabel><Select label="Danh mục" value={ticketFilters.category} onChange={(e) => handleTicketFilterChange('category', String(e.target.value))} MenuProps={{ disableScrollLock: true }}><MenuItem value="all">Tất cả</MenuItem><MenuItem value="technical">Kỹ thuật</MenuItem><MenuItem value="billing">Thanh toán</MenuItem><MenuItem value="course">Khóa học</MenuItem><MenuItem value="account">Tài khoản</MenuItem><MenuItem value="general">Chung</MenuItem></Select></FormControl></Grid>
          </Grid>

          <Stack mt={2} spacing={2}>
            {filteredTickets.map((ticket) => (
              <Paper key={ticket._id} variant="outlined" sx={{ p: 2, cursor: 'pointer' }} onClick={() => handleTicketClick(ticket)}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems={{ xs: 'flex-start', md: 'center' }}>
                  <Chip label={ticket.ticketNumber} />
                  <Chip label={ticket.subject} color="primary" variant="outlined" />
                  <Chip label={ticket.category} />
                  <Chip label={ticket.priority} color={ticket.priority === 'urgent' ? 'error' : ticket.priority === 'high' ? 'error' : ticket.priority === 'medium' ? 'warning' : 'success'} />
                  <Chip label={ticket.status} color={ticket.status === 'resolved' ? 'success' : ticket.status === 'open' ? 'info' : ticket.status === 'in_progress' ? 'warning' : ticket.status === 'waiting_user' ? 'secondary' : 'default'} />
                  <Typography variant="caption" color="text.secondary" ml="auto">{formatDate(ticket.createdAt)}</Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary" mt={1}>{ticket.description}</Typography>
                <Stack direction="row" spacing={1} mt={1}>
                  <Typography variant="caption">{ticket.userName} — {ticket.userEmail}</Typography>
                  {ticket.assignedTo && <Chip size="small" label={`→ ${ticket.assignedToName}`} />}
                  <Chip size="small" label={`${ticket.responseCount} phản hồi`} />
                  {ticket.tags.map((tag, i) => (<Chip key={i} size="small" variant="outlined" label={tag} />))}
                </Stack>
              </Paper>
            ))}
          </Stack>
        </CardContent></Card>
      )}

      {/* FAQs */}
      {activeTab === 'faqs' && (
        <Card><CardContent>
          <Stack spacing={2}>
            {faqs.map((faq) => (
              <Paper key={faq._id} variant="outlined" sx={{ p: 2 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
                  <Box>
                    <Typography fontWeight={700}>{faq.question}</Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>{faq.answer}</Typography>
                    <Stack direction="row" spacing={1} mt={1}>
                      <Chip size="small" label={faq.category} />
                      <Chip size="small" label={faq.isPublished ? 'Đã xuất bản' : 'Bản nháp'} color={faq.isPublished ? 'success' : 'default'} />
                      <Chip size="small" label={`👁️ ${faq.viewCount}`} />
                      <Chip size="small" label={`👍 ${faq.helpfulCount}`} />
                    </Stack>
                  </Box>
                  <Stack direction="row" spacing={1} mt={{ xs: 1, md: 0 }}>
                    <Button size="small" variant="outlined">Sửa</Button>
                    <Button size="small" variant="outlined">{faq.isPublished ? 'Ẩn' : 'Xuất bản'}</Button>
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </CardContent></Card>
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
      <Dialog open={showCreateFAQ} onClose={() => setShowCreateFAQ(false)} fullWidth maxWidth="sm">
        <DialogTitle>Tạo FAQ mới</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">Modal tạo FAQ sẽ được implement ở đây...</Typography>
        </DialogContent>
        <DialogActions><Button onClick={() => setShowCreateFAQ(false)}>Đóng</Button></DialogActions>
      </Dialog>
    </Box>
  );
};

export default SupportCenter;
