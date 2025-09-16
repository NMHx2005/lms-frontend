import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Button,
  Tabs,
  Tab,
  Chip,
  Avatar,
  IconButton,
  Snackbar,
  Alert,
  Badge,
  Paper,
  Link as MuiLink
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  MarkEmailRead as MarkReadIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
  Settings as SettingsIcon,
  Payment as PaymentIcon,
  EmojiEvents as AchievementIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  category: 'course' | 'system' | 'payment' | 'achievement';
  actionUrl?: string;
}

const Notifications: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'course' | 'system' | 'payment' | 'achievement'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Mock data
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'success',
      title: 'Khóa học mới',
      message: 'Khóa học "React Advanced Patterns" đã được thêm vào danh sách yêu thích của bạn',
      timestamp: '2024-01-15T10:30:00Z',
      isRead: false,
      category: 'course',
      actionUrl: '/courses/1'
    },
    {
      id: '2',
      type: 'info',
      title: 'Cập nhật hệ thống',
      message: 'Hệ thống sẽ được bảo trì từ 02:00 - 04:00 ngày mai. Vui lòng lưu công việc của bạn',
      timestamp: '2024-01-15T09:15:00Z',
      isRead: false,
      category: 'system'
    },
    {
      id: '3',
      type: 'success',
      title: 'Thanh toán thành công',
      message: 'Bạn đã thanh toán thành công khóa học "Node.js Backend Development" với số tiền 399,000 VND',
      timestamp: '2024-01-14T16:45:00Z',
      isRead: true,
      category: 'payment'
    },
    {
      id: '4',
      type: 'warning',
      title: 'Nhắc nhở học tập',
      message: 'Bạn chưa hoàn thành bài học nào trong 3 ngày qua. Hãy tiếp tục học tập để duy trì tiến độ!',
      timestamp: '2024-01-14T14:20:00Z',
      isRead: true,
      category: 'course'
    },
    {
      id: '5',
      type: 'success',
      title: 'Chứng chỉ mới',
      message: 'Chúc mừng! Bạn đã hoàn thành khóa học "Python Basics" và nhận được chứng chỉ',
      timestamp: '2024-01-13T11:30:00Z',
      isRead: true,
      category: 'achievement'
    },
    {
      id: '6',
      type: 'error',
      title: 'Lỗi thanh toán',
      message: 'Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại hoặc liên hệ hỗ trợ',
      timestamp: '2024-01-12T08:15:00Z',
      isRead: true,
      category: 'payment'
    }
  ];

  useEffect(() => {
    setNotifications(mockNotifications);
  }, []);

  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      if (activeTab === 'all') return true;
      if (activeTab === 'unread') return !notification.isRead;
      return notification.category === activeTab;
    });
  }, [notifications, activeTab]);

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.isRead).length;
  }, [notifications]);

  const getNotificationIcon = useCallback((type: string) => {
    const icons = {
      info: <InfoIcon />,
      success: <SuccessIcon />,
      warning: <WarningIcon />,
      error: <ErrorIcon />
    };
    return icons[type as keyof typeof icons] || <InfoIcon />;
  }, []);

  const getNotificationColor = useCallback((type: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    const colors = {
      info: 'info' as const,
      success: 'success' as const,
      warning: 'warning' as const,
      error: 'error' as const
    };
    return colors[type as keyof typeof colors] || 'info';
  }, []);

  const getCategoryIcon = useCallback((category: string) => {
    const icons = {
      course: <SchoolIcon />,
      system: <SettingsIcon />,
      payment: <PaymentIcon />,
      achievement: <AchievementIcon />
    };
    return icons[category as keyof typeof icons] || <InfoIcon />;
  }, []);

  const getCategoryLabel = useCallback((category: string) => {
    const labels = {
      course: 'Khóa học',
      system: 'Hệ thống',
      payment: 'Thanh toán',
      achievement: 'Thành tích'
    };
    return labels[category as keyof typeof labels] || category;
  }, []);

  const formatDate = useCallback((dateString: string) => {
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Vừa xong';
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    if (diffInHours < 48) return 'Hôm qua';

    return notificationDate.toLocaleDateString('vi-VN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    showToastMessage('Đã đánh dấu tất cả thông báo là đã đọc');
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    showToastMessage('Đã xóa thông báo');
  }, []);

  const showToastMessage = useCallback((message: string) => {
    setToastMessage(message);
    setShowToast(true);
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Trung tâm thông báo
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quản lý và theo dõi tất cả thông báo của bạn
        </Typography>
      </Box>

      {/* Header Actions */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Paper variant="outlined" sx={{ p: 2, minWidth: 120 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <NotificationsIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Tổng
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {notifications.length}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              <Paper variant="outlined" sx={{ p: 2, minWidth: 120 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Badge badgeContent={unreadCount} color="error">
                    <MarkReadIcon color="warning" />
                  </Badge>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Chưa đọc
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {unreadCount}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <Button
                variant="contained"
                startIcon={<MarkReadIcon />}
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                color="secondary"
              >
                Đánh dấu tất cả đã đọc
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => showToastMessage('Đang làm mới thông báo...')}
              >
                Làm mới
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab
              label="Tất cả"
              value="all"
              icon={<NotificationsIcon />}
              iconPosition="start"
            />
            <Tab
              label={
                <Badge badgeContent={unreadCount} color="error">
                  Chưa đọc
                </Badge>
              }
              value="unread"
              icon={<MarkReadIcon />}
              iconPosition="start"
            />
            <Tab
              label="Khóa học"
              value="course"
              icon={<SchoolIcon />}
              iconPosition="start"
            />
            <Tab
              label="Hệ thống"
              value="system"
              icon={<SettingsIcon />}
              iconPosition="start"
            />
            <Tab
              label="Thanh toán"
              value="payment"
              icon={<PaymentIcon />}
              iconPosition="start"
            />
            <Tab
              label="Thành tích"
              value="achievement"
              icon={<AchievementIcon />}
              iconPosition="start"
            />
          </Tabs>
        </Box>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardContent>
          {filteredNotifications.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <NotificationsIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Không có thông báo nào
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bạn chưa có thông báo nào hoặc không có thông báo nào khớp với bộ lọc hiện tại.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  variant="outlined"
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    borderLeft: 4,
                    borderLeftColor: getNotificationColor(notification.type) + '.main',
                    backgroundColor: !notification.isRead ? 'action.hover' : 'background.paper',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: 2
                    }
                  }}
                  onClick={() => markAsRead(notification.id)}
                >
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Avatar
                        sx={{
                          bgcolor: getNotificationColor(notification.type) + '.light',
                          color: getNotificationColor(notification.type) + '.main',
                          width: 40,
                          height: 40
                        }}
                      >
                        {getNotificationIcon(notification.type)}
                      </Avatar>

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {notification.title}
                          </Typography>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Chip
                              icon={getCategoryIcon(notification.category)}
                              label={getCategoryLabel(notification.category)}
                              size="small"
                              variant="outlined"
                            />
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(notification.timestamp)}
                            </Typography>
                          </Stack>
                        </Stack>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {notification.message}
                        </Typography>

                        {notification.actionUrl && (
                          <MuiLink
                            component={Link}
                            to={notification.actionUrl}
                            sx={{
                              textDecoration: 'none',
                              '&:hover': { textDecoration: 'underline' }
                            }}
                          >
                            <Button size="small" variant="text">
                              Xem chi tiết →
                            </Button>
                          </MuiLink>
                        )}
                      </Box>

                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        sx={{
                          color: 'text.secondary',
                          '&:hover': {
                            color: 'error.main',
                            bgcolor: 'error.light'
                          }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>

      {/* Toast Notification */}
      <Snackbar
        open={showToast}
        autoHideDuration={3000}
        onClose={() => setShowToast(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setShowToast(false)}
          severity="info"
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => setShowToast(false)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Notifications;
