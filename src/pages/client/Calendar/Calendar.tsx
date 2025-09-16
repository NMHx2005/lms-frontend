import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarEvent, CalendarCourse } from '../../../types/index';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Breadcrumbs,
  Link as MuiLink,
  CircularProgress,
  Paper,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TodayIcon from '@mui/icons-material/Today';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import ViewDayIcon from '@mui/icons-material/ViewDay';
import AddIcon from '@mui/icons-material/Add';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SchoolIcon from '@mui/icons-material/School';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [courses, setCourses] = useState<CalendarCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [filterCourse, setFilterCourse] = useState('');
  console.log(selectedDate, showEventForm);
  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const mockCourses: CalendarCourse[] = [
        {
          _id: 'course1',
          title: 'React Advanced Patterns',
          color: '#3498db',
          lessons: [
            { _id: 'l1', title: 'Component Composition', duration: 45, type: 'video' },
            { _id: 'l2', title: 'State Management', duration: 60, type: 'video' },
            { _id: 'l3', title: 'Custom Hooks', duration: 30, type: 'video' }
          ]
        },
        {
          _id: 'course2',
          title: 'Node.js Backend Development',
          color: '#e74c3c',
          lessons: [
            { _id: 'l4', title: 'Express.js Basics', duration: 50, type: 'video' },
            { _id: 'l5', title: 'Database Integration', duration: 75, type: 'video' }
          ]
        },
        {
          _id: 'course3',
          title: 'UI/UX Design Fundamentals',
          color: '#2ecc71',
          lessons: [
            { _id: 'l6', title: 'Design Principles', duration: 40, type: 'video' },
            { _id: 'l7', title: 'Prototyping', duration: 55, type: 'video' }
          ]
        }
      ];

      const mockEvents: CalendarEvent[] = [
        {
          _id: '1',
          title: 'Component Composition',
          type: 'lesson',
          startDate: '2024-01-20T09:00:00Z',
          endDate: '2024-01-20T09:45:00Z',
          allDay: false,
          courseId: 'course1',
          courseTitle: 'React Advanced Patterns',
          description: 'Học về component composition patterns',
          priority: 'medium',
          isCompleted: false,
          color: '#3498db'
        },
        {
          _id: '2',
          title: 'Build Todo App',
          type: 'assignment',
          startDate: '2024-01-22T23:59:00Z',
          allDay: false,
          courseId: 'course1',
          courseTitle: 'React Advanced Patterns',
          description: 'Deadline nộp bài tập Todo App',
          priority: 'high',
          isCompleted: false,
          color: '#e74c3c'
        },
        {
          _id: '3',
          title: 'Express.js Basics',
          type: 'lesson',
          startDate: '2024-01-21T14:00:00Z',
          endDate: '2024-01-21T14:50:00Z',
          allDay: false,
          courseId: 'course2',
          courseTitle: 'Node.js Backend Development',
          description: 'Học về Express.js framework',
          priority: 'medium',
          isCompleted: false,
          color: '#e74c3c'
        },
        {
          _id: '4',
          title: 'API Documentation',
          type: 'assignment',
          startDate: '2024-01-25T23:59:00Z',
          allDay: false,
          courseId: 'course2',
          courseTitle: 'Node.js Backend Development',
          description: 'Nộp tài liệu API',
          priority: 'medium',
          isCompleted: false,
          color: '#e74c3c'
        },
        {
          _id: '5',
          title: 'Design Principles',
          type: 'lesson',
          startDate: '2024-01-23T10:00:00Z',
          endDate: '2024-01-23T10:40:00Z',
          allDay: false,
          courseId: 'course3',
          courseTitle: 'UI/UX Design Fundamentals',
          description: 'Học về các nguyên tắc thiết kế',
          priority: 'low',
          isCompleted: false,
          color: '#2ecc71'
        }
      ];

      setCourses(mockCourses);
      setEvents(mockEvents);
      setLoading(false);
    }, 1000);
  }, []);

  const getMonthDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDate = new Date(startDate);

    while (currentDate <= lastDay || days.length < 42) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getWeekDays = (date: Date) => {
    const weekStart = new Date(date);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(day.getDate() + i);
      days.push(day);
    }

    return days;
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowEventForm(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    // Handle event click - could open event details modal
    console.log('Event clicked:', event);
  };

  const handlePrevMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const filteredEvents = filterCourse
    ? events.filter(event => event.courseId === filterCourse)
    : events;

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" alignItems="center" justifyContent="center" minHeight={400}>
          <Stack spacing={2} alignItems="center">
            <CircularProgress />
            <Typography variant="h6">Đang tải lịch học...</Typography>
          </Stack>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <MuiLink color="inherit" href="/dashboard">Dashboard</MuiLink>
        <Typography color="text.primary">Lịch học</Typography>
      </Breadcrumbs>

      <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
        Lịch học 📅
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Quản lý lịch học và deadline của bạn
      </Typography>

      {/* Calendar Controls */}
      <Card sx={{ mb: 4, borderRadius: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Chế độ xem</Typography>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(_, newMode) => newMode && setViewMode(newMode)}
                size="small"
              >
                <ToggleButton value="month">
                  <ViewModuleIcon sx={{ mr: 1 }} />
                  Tháng
                </ToggleButton>
                <ToggleButton value="week">
                  <ViewWeekIcon sx={{ mr: 1 }} />
                  Tuần
                </ToggleButton>
                <ToggleButton value="day">
                  <ViewDayIcon sx={{ mr: 1 }} />
                  Ngày
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Điều hướng</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <IconButton onClick={handlePrevMonth} size="small">
                  <ChevronLeftIcon />
                </IconButton>
                <Button
                  variant="outlined"
                  onClick={handleToday}
                  startIcon={<TodayIcon />}
                  size="small"
                >
                  Hôm nay
                </Button>
                <IconButton onClick={handleNextMonth} size="small">
                  <ChevronRightIcon />
                </IconButton>
              </Stack>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Bộ lọc</Typography>
              <FormControl fullWidth size="small">
                <InputLabel>Khóa học</InputLabel>
                <Select
                  value={filterCourse}
                  label="Khóa học"
                  onChange={(e) => setFilterCourse(e.target.value)}
                  MenuProps={{ disableScrollLock: true }}
                >
                  <MenuItem value="">Tất cả khóa học</MenuItem>
                  {courses.map(course => (
                    <MenuItem key={course._id} value={course._id}>
                      {course.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Current Month/Year Display */}
      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={700} textAlign="center">
            {currentDate.toLocaleDateString('vi-VN', {
              month: 'long',
              year: 'numeric'
            })}
          </Typography>
        </CardContent>
      </Card>

      {/* Calendar Grid */}
      <Card sx={{ borderRadius: 3, mb: 4 }}>
        <CardContent>
          {viewMode === 'month' && (
            <Box>
              {/* Weekday Headers */}
              <Grid container sx={{ mb: 1 }}>
                {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
                  <Grid key={day} item xs={12 / 7} sx={{ textAlign: 'center', py: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
                      {day}
                    </Typography>
                  </Grid>
                ))}
              </Grid>

              {/* Calendar Days */}
              <Grid container spacing={0.5}>
                {getMonthDays(currentDate).map((date, index) => {
                  const dayEvents = getEventsForDate(date);
                  const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                  const isToday = date.toDateString() === new Date().toDateString();

                  return (
                    <Grid key={index} item xs={12 / 7}>
                      <Paper
                        elevation={isToday ? 3 : 0}
                        sx={{
                          minHeight: 100,
                          p: 1,
                          cursor: 'pointer',
                          border: isToday ? 2 : 1,
                          borderColor: isToday ? 'primary.main' : 'divider',
                          bgcolor: isToday ? 'primary.light' : isCurrentMonth ? 'background.paper' : 'grey.50',
                          opacity: isCurrentMonth ? 1 : 0.5,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            bgcolor: isToday ? 'primary.light' : 'action.hover',
                            transform: 'scale(1.02)'
                          }
                        }}
                        onClick={() => handleDateClick(date)}
                      >
                        <Typography
                          variant="body2"
                          fontWeight={isToday ? 700 : 400}
                          color={isToday ? 'primary.contrastText' : 'text.primary'}
                          sx={{ mb: 0.5 }}
                        >
                          {date.getDate()}
                        </Typography>

                        <Stack spacing={0.5}>
                          {dayEvents.slice(0, 3).map(event => (
                            <Chip
                              key={event._id}
                              label={event.title}
                              size="small"
                              sx={{
                                height: 16,
                                fontSize: '0.7rem',
                                bgcolor: event.color,
                                color: 'white',
                                '& .MuiChip-label': { px: 0.5 }
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEventClick(event);
                              }}
                            />
                          ))}
                          {dayEvents.length > 3 && (
                            <Typography variant="caption" color="text.secondary">
                              +{dayEvents.length - 3} khác
                            </Typography>
                          )}
                        </Stack>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          )}

          {viewMode === 'week' && (
            <Box>
              <Grid container sx={{ mb: 2 }}>
                {getWeekDays(currentDate).map(date => (
                  <Grid key={date.toISOString()} item xs={12 / 7}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light' }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {date.toLocaleDateString('vi-VN', { weekday: 'short' })}
                      </Typography>
                      <Typography variant="h6" fontWeight={700}>
                        {date.getDate()}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              <Grid container spacing={1}>
                {getWeekDays(currentDate).map(date => {
                  const dayEvents = getEventsForDate(date);
                  return (
                    <Grid key={date.toISOString()} item xs={12 / 7}>
                      <Stack spacing={1}>
                        {dayEvents.map(event => (
                          <Card
                            key={event._id}
                            sx={{
                              bgcolor: event.color,
                              color: 'white',
                              cursor: 'pointer',
                              '&:hover': { transform: 'scale(1.02)' }
                            }}
                            onClick={() => handleEventClick(event)}
                          >
                            <CardContent sx={{ p: 1 }}>
                              <Typography variant="caption" display="block">
                                {formatTime(event.startDate)}
                              </Typography>
                              <Typography variant="body2" fontWeight={600} noWrap>
                                {event.title}
                              </Typography>
                            </CardContent>
                          </Card>
                        ))}
                      </Stack>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          )}

          {viewMode === 'day' && (
            <Box>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                {formatDate(currentDate)}
              </Typography>

              <List>
                {getEventsForDate(currentDate).map(event => (
                  <ListItem
                    key={event._id}
                    sx={{
                      borderLeft: 4,
                      borderLeftColor: event.color,
                      bgcolor: 'background.paper',
                      mb: 1,
                      borderRadius: 1
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: event.color }}>
                        {event.type === 'lesson' ? <PlayArrowIcon /> : <AssignmentIcon />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={event.title}
                      secondary={
                        <Stack>
                          <Typography variant="body2" color="text.secondary">
                            {event.courseTitle}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatTime(event.startDate)}
                          </Typography>
                          {event.description && (
                            <Typography variant="body2" color="text.secondary">
                              {event.description}
                            </Typography>
                          )}
                        </Stack>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton>
                        {event.isCompleted ? <CheckCircleIcon color="success" /> : <RadioButtonUncheckedIcon />}
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card sx={{ mb: 4, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>Sự kiện sắp tới</Typography>
          <List>
            {filteredEvents
              .filter(event => new Date(event.startDate) > new Date())
              .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
              .slice(0, 5)
              .map(event => (
                <ListItem
                  key={event._id}
                  sx={{
                    borderLeft: 4,
                    borderLeftColor: event.color,
                    bgcolor: 'background.paper',
                    mb: 1,
                    borderRadius: 1
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: event.color }}>
                      {event.type === 'lesson' ? <PlayArrowIcon /> : <AssignmentIcon />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={event.title}
                    secondary={
                      <Stack>
                        <Typography variant="body2" color="text.secondary">
                          {event.courseTitle}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(new Date(event.startDate))} - {formatTime(event.startDate)}
                        </Typography>
                      </Stack>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Button
                      component={Link}
                      to={`/courses/${event.courseId}`}
                      variant="outlined"
                      size="small"
                    >
                      Xem khóa học
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
          </List>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>Hành động nhanh</Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowEventForm(true)}
              sx={{ flex: 1 }}
            >
              Thêm sự kiện
            </Button>
            <Button
              component={Link}
              to="/dashboard/assignments"
              variant="outlined"
              startIcon={<AssignmentIcon />}
              sx={{ flex: 1 }}
            >
              Xem bài tập
            </Button>
            <Button
              component={Link}
              to="/dashboard/courses"
              variant="outlined"
              startIcon={<SchoolIcon />}
              sx={{ flex: 1 }}
            >
              Khóa học của tôi
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Calendar;
