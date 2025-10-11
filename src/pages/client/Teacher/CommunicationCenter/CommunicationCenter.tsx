import React, { useState, useEffect } from 'react';
import { useSearchParams, Link as RouterLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Chip,
  Avatar,
  Switch,
  FormControlLabel,
  IconButton,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Send as SendIcon,
  Save as SaveIcon,
  AttachFile as AttachFileIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Replay as ReplayIcon,
  Archive as ArchiveIcon
} from '@mui/icons-material';
import * as messageService from '@/services/client/message.service';
import * as teacherCoursesService from '@/services/client/teacher-courses.service';

interface MessageDisplay {
  _id: string;
  subject: string;
  content: string;
  senderId: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  recipientId: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  isRead: boolean;
  createdAt: string;
  attachments?: Array<{
    url: string;
    name: string;
    type: string;
  }>;
}

interface Course {
  _id: string;
  title: string;
  thumbnail: string;
  studentCount: number;
}

interface Student {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  courseId?: string;
  courseName?: string;
}

const CommunicationCenter: React.FC = () => {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('course');

  const [activeTab, setActiveTab] = useState<'compose' | 'sent' | 'received' | 'drafts' | 'templates'>('compose');
  const [messages, setMessages] = useState<MessageDisplay[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // Compose message state
  const [composeData, setComposeData] = useState({
    type: 'announcement' as const,
    title: '',
    content: '',
    courseId: courseId || '',
    recipientType: 'all' as 'all' | 'course' | 'specific',
    selectedStudents: [] as string[],
    scheduledSend: false,
    scheduledDate: '',
    attachments: [] as File[]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch teacher's courses
        const coursesRes = await teacherCoursesService.getTeacherCourses({ limit: 100 });
        if (coursesRes.success) {
          const formattedCourses = coursesRes.data.map((c: any) => ({
            _id: c._id,
            title: c.title,
            thumbnail: c.thumbnail || '/images/default-course.jpg',
            studentCount: c.studentsCount || 0
          }));
          setCourses(formattedCourses);
        }

        // Fetch sent messages
        const messagesRes = await messageService.getMessages({ type: 'sent', limit: 50 });
        if (messagesRes.success) {
          setMessages(messagesRes.data);
        }

        // Fetch students from teacher's courses (simplified)
        // For now, leave empty. User needs to select from enrolled students per course
        // TODO: Add API to get all enrolled students across teacher's courses
        setStudents([]);

      } catch (error: any) {
        console.error('Error loading communication data:', error);
        toast.error(error.response?.data?.message || 'Lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleComposeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate title and content
      if (!composeData.title.trim()) {
        toast.error('Vui lòng nhập tiêu đề tin nhắn');
        return;
      }

      if (!composeData.content.trim()) {
        toast.error('Vui lòng nhập nội dung tin nhắn');
        return;
      }

      // For demo: disable sending until students list is implemented
      toast.warning('Chức năng gửi tin nhắn đang được phát triển. Vui lòng sử dụng trang "Quản lý học viên" để liên hệ trực tiếp.');
      return;
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error(error.response?.data?.message || 'Lỗi khi gửi tin nhắn');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setComposeData(prev => ({ ...prev, attachments: [...prev.attachments, ...files] }));
  };

  const removeAttachment = (index: number) => {
    setComposeData(prev => ({ ...prev, attachments: prev.attachments.filter((_, i) => i !== index) }));
  };


  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h6" color="text.secondary">Đang tải trung tâm giao tiếp...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs sx={{ mb: 1 }}>
          <Typography color="text.primary">Teacher Dashboard</Typography>
          <Typography color="text.secondary">Communication Center</Typography>
        </Breadcrumbs>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>Trung tâm giao tiếp</Typography>
        <Typography variant="body1" color="text.secondary">Giao tiếp với học viên và quản lý tin nhắn</Typography>
      </Box>

      {/* Tabs */}
      <Tabs value={['compose', 'sent', 'received', 'drafts', 'templates'].indexOf(activeTab)} onChange={(_, i) => setActiveTab(['compose', 'sent', 'received', 'drafts', 'templates'][i] as any)} sx={{ mb: 3 }} variant="scrollable" scrollButtons allowScrollButtonsMobile>
        <Tab label="Soạn tin nhắn" />
        <Tab label="Đã gửi" />
        <Tab label="Đã nhận" />
        <Tab label="Nháp" />
        <Tab label="Mẫu" />
      </Tabs>

      {/* Compose */}
      {activeTab === 'compose' && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Soạn tin nhắn mới</Typography>
            <Box component="form" onSubmit={handleComposeSubmit}>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Loại tin nhắn</InputLabel>
                    <Select value={composeData.type} label="Loại tin nhắn" onChange={(e) => setComposeData(prev => ({ ...prev, type: e.target.value as any }))} MenuProps={{ disableScrollLock: true }}>
                      <MenuItem value="announcement">Thông báo chung</MenuItem>
                      <MenuItem value="course">Thông báo khóa học</MenuItem>
                      <MenuItem value="personal">Tin nhắn cá nhân</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={8}>
                  <TextField fullWidth label="Tiêu đề" value={composeData.title} onChange={(e) => setComposeData(prev => ({ ...prev, title: e.target.value }))} required />
                </Grid>
              </Grid>

              <TextField fullWidth multiline rows={6} label="Nội dung" value={composeData.content} onChange={(e) => setComposeData(prev => ({ ...prev, content: e.target.value }))} sx={{ mb: 2 }} />

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Người nhận</InputLabel>
                    <Select value={composeData.recipientType} label="Người nhận" onChange={(e) => setComposeData(prev => ({ ...prev, recipientType: e.target.value as any }))} MenuProps={{ disableScrollLock: true }}>
                      <MenuItem value="all">Tất cả học viên</MenuItem>
                      <MenuItem value="course">Theo khóa học</MenuItem>
                      <MenuItem value="specific">Chọn học viên cụ thể</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {composeData.recipientType === 'course' && (
                  <Grid item xs={12} md={8}>
                    <FormControl fullWidth>
                      <InputLabel>Khóa học</InputLabel>
                      <Select value={composeData.courseId} label="Khóa học" onChange={(e) => setComposeData(prev => ({ ...prev, courseId: e.target.value }))} required MenuProps={{ disableScrollLock: true }}>
                        <MenuItem value="">Chọn khóa học</MenuItem>
                        {courses.map(c => (
                          <MenuItem key={c._id} value={c._id}>{c.title} ({c.studentCount} học viên)</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}

                {composeData.recipientType === 'specific' && (
                  <Grid item xs={12}>
                    {students.length === 0 ? (
                      <Card>
                        <CardContent>
                          <Typography color="text.secondary">
                            Chức năng chọn học viên cụ thể đang được phát triển.
                            Vui lòng sử dụng "Theo khóa học" hoặc liên hệ học viên trực tiếp qua trang "Quản lý học viên".
                          </Typography>
                        </CardContent>
                      </Card>
                    ) : (
                      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                        {students.map(s => (
                          <Chip
                            key={s._id}
                            avatar={<Avatar src={s.avatar} />}
                            label={s.name}
                            color={composeData.selectedStudents.includes(s._id) ? 'primary' : 'default'}
                            variant={composeData.selectedStudents.includes(s._id) ? 'filled' : 'outlined'}
                            onClick={() => setComposeData(prev => ({
                              ...prev,
                              selectedStudents: prev.selectedStudents.includes(s._id)
                                ? prev.selectedStudents.filter(id => id !== s._id)
                                : [...prev.selectedStudents, s._id]
                            }))}
                          />
                        ))}
                      </Stack>
                    )}
                  </Grid>
                )}
              </Grid>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ mb: 2 }}>
                <FormControlLabel control={<Switch checked={!composeData.scheduledSend} onChange={(e) => setComposeData(prev => ({ ...prev, scheduledSend: !e.target.checked }))} />} label="Gửi ngay" />
                {composeData.scheduledSend && (
                  <TextField type="datetime-local" label="Lên lịch gửi" InputLabelProps={{ shrink: true }} value={composeData.scheduledDate} onChange={(e) => setComposeData(prev => ({ ...prev, scheduledDate: e.target.value }))} required />
                )}
                <Button variant="outlined" component="label" startIcon={<AttachFileIcon />}>
                  Đính kèm tệp
                  <input type="file" hidden multiple onChange={handleFileUpload} />
                </Button>
              </Stack>

              {composeData.attachments.length > 0 && (
                <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
                  {composeData.attachments.map((file, idx) => (
                    <Chip key={idx} icon={<AttachFileIcon />} label={file.name} onDelete={() => removeAttachment(idx)} deleteIcon={<DeleteIcon />} />
                  ))}
                </Stack>
              )}

              <Stack direction="row" spacing={2}>
                <Button type="button" variant="outlined" startIcon={<SaveIcon />}>Lưu nháp</Button>
                <Button type="submit" variant="contained" startIcon={<SendIcon />}>Gửi tin nhắn</Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Sent */}
      {activeTab === 'sent' && (
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Tin nhắn đã gửi</Typography>
          {messages.length === 0 ? (
            <Card><CardContent><Typography color="text.secondary">Chưa có tin nhắn nào được gửi</Typography></CardContent></Card>
          ) : (
            <Grid container spacing={2}>
              {messages.map((message) => (
                <Grid item xs={12} md={6} key={message._id}>
                  <Card>
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{message.subject}</Typography>
                        <Chip size="small" label={new Date(message.createdAt).toLocaleDateString('vi-VN')} />
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {message.content.substring(0, 100)}{message.content.length > 100 ? '...' : ''}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar src={message.recipientId?.avatar} sx={{ width: 24, height: 24 }} />
                        <Typography variant="caption" color="text.secondary">
                          Gửi đến: {message.recipientId?.firstName || 'N/A'} {message.recipientId?.lastName || ''}
                        </Typography>
                        {message.isRead && <Chip size="small" label="Đã đọc" color="success" />}
                      </Stack>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
                      <IconButton size="small" title="Xem chi tiết"><VisibilityIcon /></IconButton>
                      <IconButton size="small" title="Lưu trữ" onClick={async () => {
                        try {
                          await messageService.archiveMessage(message._id);
                          toast.success('Đã lưu trữ tin nhắn');
                          // Refresh messages
                          const res = await messageService.getMessages({ type: 'sent', limit: 50 });
                          if (res.success) setMessages(res.data);
                        } catch (error) {
                          toast.error('Lỗi khi lưu trữ tin nhắn');
                        }
                      }}><ArchiveIcon /></IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {/* Received */}
      {activeTab === 'received' && (
        <ReceivedMessages />
      )}

      {activeTab === 'drafts' && (
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Tin nhắn nháp</Typography>
          <Card><CardContent><Typography color="text.secondary">Chưa có tin nhắn nháp nào</Typography></CardContent></Card>
        </Box>
      )}

      {activeTab === 'templates' && (
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Mẫu tin nhắn</Typography>
          <Grid container spacing={2}>
            {[{ t: 'Thông báo bài tập mới', d: 'Mẫu thông báo khi có bài tập mới được giao' }, { t: 'Chúc mừng hoàn thành', d: 'Mẫu chúc mừng học viên hoàn thành khóa học' }, { t: 'Nhắc nhở học tập', d: 'Mẫu nhắc nhở học viên tiếp tục học tập' }].map((tpl, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: .5 }}>{tpl.t}</Typography>
                    <Typography variant="body2" color="text.secondary">{tpl.d}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button variant="outlined">Sử dụng mẫu</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Quick Actions */}
      <Divider sx={{ my: 3 }} />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Button component={RouterLink} to="/teacher/courses" variant="outlined">Quản lý khóa học</Button>
        <Button component={RouterLink} to="/teacher/analytics" variant="outlined">Xem thống kê</Button>
        <Button component={RouterLink} to="/teacher/earnings" variant="outlined">Xem thu nhập</Button>
      </Stack>
    </Container>
  );
};

// Received Messages Component
const ReceivedMessages: React.FC = () => {
  const [receivedMessages, setReceivedMessages] = useState<MessageDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await messageService.getMessages({ type: 'inbox', limit: 50 });
        if (response.success) {
          setReceivedMessages(response.data);
        }
      } catch (error) {
        console.error('Error loading received messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) {
    return <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Tin nhắn đã nhận</Typography>
      {receivedMessages.length === 0 ? (
        <Card><CardContent><Typography color="text.secondary">Chưa có tin nhắn nào được nhận</Typography></CardContent></Card>
      ) : (
        <Grid container spacing={2}>
          {receivedMessages.map((message) => (
            <Grid item xs={12} md={6} key={message._id}>
              <Card sx={{ bgcolor: message.isRead ? 'background.paper' : 'action.hover' }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: message.isRead ? 400 : 600 }}>
                      {message.subject}
                    </Typography>
                    <Chip size="small" label={new Date(message.createdAt).toLocaleDateString('vi-VN')} />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {message.content.substring(0, 100)}{message.content.length > 100 ? '...' : ''}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar src={message.senderId?.avatar} sx={{ width: 24, height: 24 }} />
                    <Typography variant="caption" color="text.secondary">
                      Từ: {message.senderId?.firstName || 'N/A'} {message.senderId?.lastName || ''}
                    </Typography>
                    {!message.isRead && <Chip size="small" label="Chưa đọc" color="primary" />}
                  </Stack>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
                  {!message.isRead && (
                    <Button size="small" onClick={async () => {
                      try {
                        await messageService.markAsRead(message._id);
                        toast.success('Đã đánh dấu là đã đọc');
                        // Refresh
                        const res = await messageService.getMessages({ type: 'inbox', limit: 50 });
                        if (res.success) setReceivedMessages(res.data);
                      } catch (error) {
                        toast.error('Lỗi khi đánh dấu');
                      }
                    }}>Đánh dấu đã đọc</Button>
                  )}
                  <IconButton size="small" title="Xem chi tiết"><VisibilityIcon /></IconButton>
                  <IconButton size="small" title="Trả lời"><ReplayIcon /></IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default CommunicationCenter;
