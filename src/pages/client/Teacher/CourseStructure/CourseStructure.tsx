import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Stack,
  Avatar,
  CircularProgress,
  Chip,
  IconButton,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  PlayArrow as PlayArrowIcon,
  Description as DescriptionIcon,
  AttachFile as AttachFileIcon,
  Link as LinkIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  School as SchoolIcon,
  Schedule as ScheduleIcon,
  LibraryBooks as LibraryBooksIcon
} from '@mui/icons-material';

interface Section {
  _id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

interface Lesson {
  _id: string;
  title: string;
  type: 'video' | 'text' | 'file' | 'link';
  duration: number;
  order: number;
  isPublished: boolean;
  content?: string;
  videoUrl?: string;
  fileUrl?: string;
  linkUrl?: string;
}

interface CourseStructure {
  _id: string;
  title: string;
  sections: Section[];
}

const CourseStructure: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // const navigate = useNavigate();
  const [course, setCourse] = useState<CourseStructure | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<string | null>(null);
  const [showAddSection, setShowAddSection] = useState(false);
  const [showAddLesson, setShowAddLesson] = useState<string | null>(null);
  const [newSection, setNewSection] = useState({ title: '', description: '' });
  const [newLesson, setNewLesson] = useState<{
    title: string;
    type: 'video' | 'text' | 'file' | 'link';
    content: string;
    videoUrl: string;
    fileUrl: string;
    linkUrl: string;
  }>({
    title: '',
    type: 'video',
    content: '',
    videoUrl: '',
    fileUrl: '',
    linkUrl: ''
  });

  useEffect(() => {
    // Simulate API call to get course structure
    setTimeout(() => {
      const mockCourse: CourseStructure = {
        _id: id || '1',
        title: 'React Advanced Patterns',
        sections: [
          {
            _id: 's1',
            title: 'Giới thiệu và Cài đặt',
            description: 'Tổng quan về khóa học và hướng dẫn cài đặt môi trường',
            order: 1,
            lessons: [
              {
                _id: 'l1',
                title: 'Chào mừng đến với khóa học',
                type: 'video',
                duration: 300,
                order: 1,
                isPublished: true,
                videoUrl: 'https://example.com/video1.mp4'
              },
              {
                _id: 'l2',
                title: 'Cài đặt môi trường phát triển',
                type: 'text',
                duration: 180,
                order: 2,
                isPublished: true,
                content: 'Hướng dẫn chi tiết cài đặt Node.js, npm và các công cụ cần thiết...'
              }
            ]
          },
          {
            _id: 's2',
            title: 'React Hooks Nâng cao',
            description: 'Tìm hiểu sâu về React Hooks và custom hooks',
            order: 2,
            lessons: [
              {
                _id: 'l3',
                title: 'useState và useEffect',
                type: 'video',
                duration: 600,
                order: 1,
                isPublished: true,
                videoUrl: 'https://example.com/video2.mp4'
              },
              {
                _id: 'l4',
                title: 'Custom Hooks',
                type: 'video',
                duration: 450,
                order: 2,
                isPublished: false,
                videoUrl: 'https://example.com/video3.mp4'
              }
            ]
          }
        ]
      };
      setCourse(mockCourse);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleSectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSection.title.trim()) return;

    const newSectionData: Section = {
      _id: `s${Date.now()}`,
      title: newSection.title,
      description: newSection.description,
      order: (course?.sections.length || 0) + 1,
      lessons: []
    };

    setCourse(prev => prev ? {
      ...prev,
      sections: [...prev.sections, newSectionData]
    } : null);

    setNewSection({ title: '', description: '' });
    setShowAddSection(false);
  };

  const handleLessonSubmit = (e: React.FormEvent, sectionId: string) => {
    e.preventDefault();
    if (!newLesson.title.trim()) return;

    const section = course?.sections.find(s => s._id === sectionId);
    if (!section) return;

    const newLessonData: Lesson = {
      _id: `l${Date.now()}`,
      title: newLesson.title,
      type: newLesson.type,
      duration: 0,
      order: section.lessons.length + 1,
      isPublished: false,
      content: newLesson.content,
      videoUrl: newLesson.videoUrl,
      fileUrl: newLesson.fileUrl,
      linkUrl: newLesson.linkUrl
    };

    setCourse(prev => prev ? {
      ...prev,
      sections: prev.sections.map(s =>
        s._id === sectionId
          ? { ...s, lessons: [...s.lessons, newLessonData] }
          : s
      )
    } : null);

    setNewLesson({
      title: '',
      type: 'video',
      content: '',
      videoUrl: '',
      fileUrl: '',
      linkUrl: ''
    });
    setShowAddLesson(null);
  };

  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    setCourse(prev => prev ? {
      ...prev,
      sections: prev.sections.map(s =>
        s._id === sectionId ? { ...s, ...updates } : s
      )
    } : null);
    setEditingSection(null);
  };

  const updateLesson = (sectionId: string, lessonId: string, updates: Partial<Lesson>) => {
    setCourse(prev => prev ? {
      ...prev,
      sections: prev.sections.map(s =>
        s._id === sectionId
          ? {
            ...s,
            lessons: s.lessons.map(l =>
              l._id === lessonId ? { ...l, ...updates } : l
            )
          }
          : s
      )
    } : null);
    setEditingLesson(null);
  };

  const deleteSection = (sectionId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa section này?')) {
      setCourse(prev => prev ? {
        ...prev,
        sections: prev.sections.filter(s => s._id !== sectionId)
      } : null);
    }
  };

  const deleteLesson = (sectionId: string, lessonId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa lesson này?')) {
      setCourse(prev => prev ? {
        ...prev,
        sections: prev.sections.map(s =>
          s._id === sectionId
            ? { ...s, lessons: s.lessons.filter(l => l._id !== lessonId) }
            : s
        )
      } : null);
    }
  };

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    setCourse(prev => {
      if (!prev) return null;

      const sections = [...prev.sections];
      const currentIndex = sections.findIndex(s => s._id === sectionId);

      if (direction === 'up' && currentIndex > 0) {
        [sections[currentIndex], sections[currentIndex - 1]] = [sections[currentIndex - 1], sections[currentIndex]];
      } else if (direction === 'down' && currentIndex < sections.length - 1) {
        [sections[currentIndex], sections[currentIndex + 1]] = [sections[currentIndex + 1], sections[currentIndex]];
      }

      return { ...prev, sections };
    });
  };

  const moveLesson = (sectionId: string, lessonId: string, direction: 'up' | 'down') => {
    setCourse(prev => {
      if (!prev) return null;

      const sections = prev.sections.map(s => {
        if (s._id !== sectionId) return s;

        const lessons = [...s.lessons];
        const currentIndex = lessons.findIndex(l => l._id === lessonId);

        if (direction === 'up' && currentIndex > 0) {
          [lessons[currentIndex], lessons[currentIndex - 1]] = [lessons[currentIndex - 1], lessons[currentIndex]];
        } else if (direction === 'down' && currentIndex < lessons.length - 1) {
          [lessons[currentIndex], lessons[currentIndex + 1]] = [lessons[currentIndex + 1], lessons[currentIndex]];
        }

        return { ...s, lessons };
      });

      return { ...prev, sections };
    });
  };


  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getLessonTypeIcon = useCallback((type: string) => {
    const icons = {
      video: <PlayArrowIcon />,
      text: <DescriptionIcon />,
      file: <AttachFileIcon />,
      link: <LinkIcon />
    };
    return icons[type as keyof typeof icons] || <DescriptionIcon />;
  }, []);

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box sx={{ mb: 4 }}>
          <Breadcrumbs sx={{ mb: 2 }}>
            <Typography color="text.primary">Teacher Dashboard</Typography>
            <Typography color="text.primary">Course Studio</Typography>
            <Typography color="text.secondary">Cấu trúc khóa học</Typography>
          </Breadcrumbs>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            Cấu trúc khóa học
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h6" color="text.secondary">
            Đang tải dữ liệu...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!course) return null;

  const totalLessons = course.sections.reduce((total, s) => total + s.lessons.length, 0);
  const totalDuration = course.sections.reduce((total, s) =>
    total + s.lessons.reduce((sum, l) => sum + l.duration, 0), 0
  );

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Typography color="text.primary">Teacher Dashboard</Typography>
          <Typography color="text.primary">Course Studio</Typography>
          <Typography color="text.secondary">Cấu trúc khóa học</Typography>
        </Breadcrumbs>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
          Cấu trúc khóa học: {course.title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quản lý cấu trúc và nội dung khóa học của bạn
        </Typography>
      </Box>

      {/* Course Overview Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                <LibraryBooksIcon />
              </Avatar>
              <Typography variant="h4" component="div" sx={{ fontWeight: 600, mb: 1 }}>
                {course.sections.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sections
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                <SchoolIcon />
              </Avatar>
              <Typography variant="h4" component="div" sx={{ fontWeight: 600, mb: 1 }}>
                {totalLessons}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lessons
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                <ScheduleIcon />
              </Avatar>
              <Typography variant="h4" component="div" sx={{ fontWeight: 600, mb: 1 }}>
                {formatDuration(totalDuration)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng thời gian
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Sections */}
      <Stack spacing={2} sx={{ mb: 4 }}>
        {course.sections.map((section, sectionIndex) => (
          <Accordion
            key={section._id}
            expanded={activeSection === section._id}
            onChange={() => setActiveSection(activeSection === section._id ? null : section._id)}
            sx={{
              '&:before': { display: 'none' },
              boxShadow: 2,
              borderRadius: 2,
              '&.Mui-expanded': {
                margin: 0
              }
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: 'primary.50',
                borderRadius: '8px 8px 0 0',
                '&.Mui-expanded': {
                  borderRadius: '8px 8px 0 0'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', pr: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 40, height: 40 }}>
                  {section.order}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  {editingSection === section._id ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
                      <TextField
                        fullWidth
                        size="small"
                        value={section.title}
                        onChange={(e) => updateSection(section._id, { title: e.target.value })}
                        variant="outlined"
                        sx={{ mb: 1 }}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        value={section.description}
                        onChange={(e) => updateSection(section._id, { description: e.target.value })}
                        multiline
                        rows={2}
                        variant="outlined"
                      />
                    </Box>
                  ) : (
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {section.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {section.description}
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Stack direction="row" spacing={1}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveSection(section._id, 'up');
                    }}
                    disabled={sectionIndex === 0}
                    title="Di chuyển lên"
                  >
                    <KeyboardArrowUpIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveSection(section._id, 'down');
                    }}
                    disabled={sectionIndex === course.sections.length - 1}
                    title="Di chuyển xuống"
                  >
                    <KeyboardArrowDownIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingSection(editingSection === section._id ? null : section._id);
                    }}
                    title="Chỉnh sửa"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSection(section._id);
                    }}
                    color="error"
                    title="Xóa"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Box>
            </AccordionSummary>

            <AccordionDetails sx={{ p: 0 }}>

              {/* Lessons */}
              <Box sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Lessons ({section.lessons.length})
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setShowAddLesson(showAddLesson === section._id ? null : section._id)}
                    size="small"
                  >
                    Thêm Lesson
                  </Button>
                </Stack>

                {/* Add Lesson Form */}
                {showAddLesson === section._id && (
                  <Paper sx={{ p: 3, mb: 2, border: '1px solid', borderColor: 'primary.main' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                      Tạo lesson mới
                    </Typography>

                    <Box component="form" onSubmit={(e) => handleLessonSubmit(e, section._id)}>
                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Tiêu đề lesson"
                            value={newLesson.title}
                            onChange={(e) => setNewLesson(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Nhập tiêu đề lesson"
                            required
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
                            <InputLabel>Loại lesson</InputLabel>
                            <Select
                              value={newLesson.type}
                              onChange={(e) => setNewLesson(prev => ({ ...prev, type: e.target.value as 'video' | 'text' | 'file' | 'link' }))}
                              label="Loại lesson"
                              MenuProps={{ disableScrollLock: true }}
                            >
                              <MenuItem value="video">Video</MenuItem>
                              <MenuItem value="text">Văn bản</MenuItem>
                              <MenuItem value="file">File</MenuItem>
                              <MenuItem value="link">Link</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>

                      {newLesson.type === 'text' && (
                        <TextField
                          fullWidth
                          label="Nội dung"
                          value={newLesson.content}
                          onChange={(e) => setNewLesson(prev => ({ ...prev, content: e.target.value }))}
                          placeholder="Nhập nội dung lesson"
                          multiline
                          rows={4}
                          variant="outlined"
                          sx={{ mb: 2 }}
                        />
                      )}

                      {newLesson.type === 'video' && (
                        <TextField
                          fullWidth
                          label="URL Video"
                          type="url"
                          value={newLesson.videoUrl}
                          onChange={(e) => setNewLesson(prev => ({ ...prev, videoUrl: e.target.value }))}
                          placeholder="https://example.com/video.mp4"
                          variant="outlined"
                          sx={{ mb: 2 }}
                        />
                      )}

                      {newLesson.type === 'file' && (
                        <TextField
                          fullWidth
                          label="URL File"
                          type="url"
                          value={newLesson.fileUrl}
                          onChange={(e) => setNewLesson(prev => ({ ...prev, fileUrl: e.target.value }))}
                          placeholder="https://example.com/file.pdf"
                          variant="outlined"
                          sx={{ mb: 2 }}
                        />
                      )}

                      {newLesson.type === 'link' && (
                        <TextField
                          fullWidth
                          label="URL Link"
                          type="url"
                          value={newLesson.linkUrl}
                          onChange={(e) => setNewLesson(prev => ({ ...prev, linkUrl: e.target.value }))}
                          placeholder="https://example.com"
                          variant="outlined"
                          sx={{ mb: 2 }}
                        />
                      )}

                      <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button
                          variant="outlined"
                          onClick={() => setShowAddLesson(null)}
                        >
                          Hủy
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                        >
                          Thêm Lesson
                        </Button>
                      </Stack>
                    </Box>
                  </Paper>
                )}

                {/* Lessons List */}
                <List sx={{ p: 0 }}>
                  {section.lessons.map((lesson, lessonIndex) => (
                    <ListItem
                      key={lesson._id}
                      sx={{
                        border: '1px solid',
                        borderColor: 'grey.200',
                        borderRadius: 2,
                        mb: 1,
                        backgroundColor: 'background.paper',
                        '&:hover': {
                          backgroundColor: 'action.hover'
                        }
                      }}
                    >
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                          {lesson.order}
                        </Avatar>
                      </ListItemIcon>

                      <ListItemText
                        primary={
                          editingLesson === lesson._id ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              <TextField
                                fullWidth
                                size="small"
                                value={lesson.title}
                                onChange={(e) => updateLesson(section._id, lesson._id, { title: e.target.value })}
                                variant="outlined"
                              />
                              <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() => setEditingLesson(null)}
                                >
                                  Hủy
                                </Button>
                                <Button
                                  size="small"
                                  variant="contained"
                                  onClick={() => setEditingLesson(null)}
                                >
                                  Lưu
                                </Button>
                              </Stack>
                            </Box>
                          ) : (
                            <Box>
                              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                                {getLessonTypeIcon(lesson.type)}
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, flexGrow: 1 }}>
                                  {lesson.title}
                                </Typography>
                                <Chip
                                  label={formatDuration(lesson.duration)}
                                  size="small"
                                  color="info"
                                  variant="outlined"
                                />
                                <Chip
                                  label={lesson.isPublished ? 'Đã xuất bản' : 'Bản nháp'}
                                  size="small"
                                  color={lesson.isPublished ? 'success' : 'default'}
                                  icon={lesson.isPublished ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                                />
                              </Stack>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <Chip label={lesson.type} size="small" variant="outlined" />
                                {lesson.content && (
                                  <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                                    {lesson.content.substring(0, 100)}...
                                  </Typography>
                                )}
                              </Stack>
                            </Box>
                          )
                        }
                      />

                      <ListItemSecondaryAction>
                        <Stack direction="row" spacing={0.5}>
                          <IconButton
                            size="small"
                            onClick={() => moveLesson(section._id, lesson._id, 'up')}
                            disabled={lessonIndex === 0}
                            title="Di chuyển lên"
                          >
                            <KeyboardArrowUpIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => moveLesson(section._id, lesson._id, 'down')}
                            disabled={lessonIndex === section.lessons.length - 1}
                            title="Di chuyển xuống"
                          >
                            <KeyboardArrowDownIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => setEditingLesson(editingLesson === lesson._id ? null : lesson._id)}
                            title="Chỉnh sửa"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => deleteLesson(section._id, lesson._id)}
                            color="error"
                            title="Xóa"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>

      {/* Add Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          {showAddSection ? (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Tạo section mới
              </Typography>

              <Box component="form" onSubmit={handleSectionSubmit}>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Tiêu đề section"
                      value={newSection.title}
                      onChange={(e) => setNewSection(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Nhập tiêu đề section"
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Mô tả"
                      value={newSection.description}
                      onChange={(e) => setNewSection(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Mô tả ngắn gọn về section"
                      multiline
                      rows={2}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    onClick={() => setShowAddSection(false)}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                  >
                    Thêm Section
                  </Button>
                </Stack>
              </Box>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setShowAddSection(true)}
                size="large"
                sx={{ px: 4 }}
              >
                Thêm Section mới
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Save Changes */}
      <Card>
        <CardActions sx={{ justifyContent: 'center', p: 3 }}>
          <Button
            variant="contained"
            startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
            onClick={() => {
              setSaving(true);
              setTimeout(() => {
                setSaving(false);
                alert('Cấu trúc khóa học đã được lưu thành công!');
              }, 2000);
            }}
            disabled={saving}
            size="large"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              },
              px: 4,
              py: 1.5
            }}
          >
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
};

export default CourseStructure;
