import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as sectionService from '@/services/client/section.service';
import * as lessonService from '@/services/client/lesson.service';
// import { sharedUploadService } from '../../../services/shared/upload.service'; // Will be used for upload handlers
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Card,
  CardContent,
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
  LibraryBooks as LibraryBooksIcon,
  Quiz as QuizIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';

interface Section {
  _id: string;
  title: string;
  description?: string;
  order: number;
  lessons: Lesson[];
}

interface Lesson {
  _id: string;
  title: string;
  type: 'video' | 'text' | 'file' | 'link' | 'quiz' | 'assignment';
  duration: number;
  estimatedTime?: number; // Backend field name
  order: number;
  isPublished: boolean;
  content?: string;
  videoUrl?: string;
  fileUrl?: string;
  linkUrl?: string;
  quizQuestions?: Array<{
    question: string;
    answers: string[];
    correctAnswer: number;
    explanation?: string;
  }>;
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
    type: 'video' | 'text' | 'file' | 'link' | 'quiz' | 'assignment';
    duration: number;
    content: string;
    videoUrl: string;
    fileUrl: string;
    linkUrl: string;
    quizQuestions: Array<{
      question: string;
      answers: string[];
      correctAnswer: number;
      explanation: string;
    }>;
  }>({
    title: '',
    type: 'video',
    duration: 5,
    content: '',
    videoUrl: '',
    fileUrl: '',
    linkUrl: '',
    quizQuestions: [{
      question: '',
      answers: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    }]
  });

  // Load course structure from API
  const loadCourseStructure = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);

      // Get sections for the course
      const sectionsResponse = await sectionService.getSectionsByCourse(id);

      if (sectionsResponse.success && sectionsResponse.data) {
        // Load lessons for each section
        const sectionsWithLessons = await Promise.all(
          sectionsResponse.data.map(async (section: sectionService.Section) => {
            const lessonsResponse = await lessonService.getLessonsBySection(section._id);
            const lessons = lessonsResponse.success && lessonsResponse.data ?
              lessonsResponse.data.map((lesson: any) => ({
                ...lesson,
                duration: lesson.estimatedTime || lesson.duration || 0 // Map estimatedTime -> duration
              })) : [];
            return {
              ...section,
              lessons
            };
          })
        );

        // Set course structure
        setCourse({
          _id: id,
          title: '', // Will be loaded from course details if needed
          sections: sectionsWithLessons
        });
      }
    } catch (error: any) {
      console.error('Error loading course structure:', error);
      toast.error(error.response?.data?.message || 'Lỗi khi tải cấu trúc khóa học');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadCourseStructure();
  }, [loadCourseStructure]);

  const handleSectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSection.title.trim() || !id) return;

    try {
      setSaving(true);
      const response = await sectionService.createSection({
        courseId: id,
        title: newSection.title,
        description: newSection.description,
        order: (course?.sections.length || 0) + 1
      });

      if (response.success && response.data) {
        toast.success('Tạo chương mới thành công');
        setNewSection({ title: '', description: '' });
        setShowAddSection(false);
        // Reload course structure
        await loadCourseStructure();
      }
    } catch (error: any) {
      console.error('Error creating section:', error);
      toast.error(error.response?.data?.message || 'Lỗi khi tạo chương mới');
    } finally {
      setSaving(false);
    }
  };

  const handleLessonSubmit = async (e: React.FormEvent, sectionId: string) => {
    e.preventDefault();
    if (!newLesson.title.trim() || !id) return;

    const section = course?.sections.find(s => s._id === sectionId);
    if (!section) return;

    try {
      setSaving(true);
      const lessonData: any = {
        sectionId,
        courseId: id,
        title: newLesson.title,
        type: newLesson.type,
        content: newLesson.content,
        videoUrl: newLesson.videoUrl,
        fileUrl: newLesson.fileUrl,
        linkUrl: newLesson.linkUrl,
        duration: newLesson.duration,
        order: section.lessons.length + 1,
        isPublished: false
      };

      // Add quiz questions if type is quiz
      if (newLesson.type === 'quiz') {
        lessonData.quizQuestions = newLesson.quizQuestions;
      }

      const response = await lessonService.createLesson(lessonData);

      if (response.success && response.data) {
        toast.success('Tạo bài học mới thành công');
        setNewLesson({
          title: '',
          type: 'video',
          duration: 5,
          content: '',
          videoUrl: '',
          fileUrl: '',
          linkUrl: '',
          quizQuestions: [{
            question: '',
            answers: ['', '', '', ''],
            correctAnswer: 0,
            explanation: ''
          }]
        });
        setShowAddLesson(null);
        // Reload course structure
        await loadCourseStructure();
      }
    } catch (error: any) {
      console.error('Error creating lesson:', error);
      toast.error(error.response?.data?.message || 'Lỗi khi tạo bài học mới');
    } finally {
      setSaving(false);
    }
  };

  const updateSection = async (sectionId: string, updates: Partial<Section>) => {
    try {
      setSaving(true);
      const response = await sectionService.updateSection(sectionId, updates);

      if (response.success) {
        toast.success('Cập nhật chương thành công');
        setEditingSection(null);
        await loadCourseStructure();
      }
    } catch (error: any) {
      console.error('Error updating section:', error);
      toast.error(error.response?.data?.message || 'Lỗi khi cập nhật chương');
    } finally {
      setSaving(false);
    }
  };

  const updateLesson = async (sectionId: string, lessonId: string, updates: Partial<Lesson>) => {
    // For real-time updates, update local state first
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
  };

  const saveLessonChanges = async (lessonId: string) => {
    try {
      setSaving(true);
      const lesson = course?.sections
        .flatMap(s => s.lessons)
        .find(l => l._id === lessonId);

      if (!lesson) return;

      // Map fields for backend
      const updates: any = {
        title: lesson.title,
        type: lesson.type,
        duration: lesson.duration,
        content: lesson.content,
        videoUrl: lesson.videoUrl,
        fileUrl: lesson.fileUrl,
        linkUrl: lesson.linkUrl
      };

      // Add quiz questions if type is quiz
      if (lesson.type === 'quiz') {
        updates.quizQuestions = lesson.quizQuestions;
      }

      const response = await lessonService.updateLesson(lessonId, updates);

      if (response.success) {
        toast.success('Cập nhật bài học thành công');
        setEditingLesson(null);
        await loadCourseStructure();
      }
    } catch (error: any) {
      console.error('Error saving lesson:', error);
      toast.error(error.response?.data?.message || 'Lỗi khi lưu bài học');
    } finally {
      setSaving(false);
    }
  };

  const deleteSection = async (sectionId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa chương này? Tất cả bài học trong chương cũng sẽ bị xóa.')) {
      return;
    }

    try {
      setSaving(true);
      const response = await sectionService.deleteSection(sectionId);

      if (response.success) {
        toast.success('Xóa chương thành công');
        await loadCourseStructure();
      }
    } catch (error: any) {
      console.error('Error deleting section:', error);
      toast.error(error.response?.data?.message || 'Lỗi khi xóa chương');
    } finally {
      setSaving(false);
    }
  };

  const deleteLesson = async (_sectionId: string, lessonId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài học này?')) {
      return;
    }

    try {
      setSaving(true);
      const response = await lessonService.deleteLesson(lessonId);

      if (response.success) {
        toast.success('Xóa bài học thành công');
        await loadCourseStructure();
      }
    } catch (error: any) {
      console.error('Error deleting lesson:', error);
      toast.error(error.response?.data?.message || 'Lỗi khi xóa bài học');
    } finally {
      setSaving(false);
    }
  };

  const moveSection = async (sectionId: string, direction: 'up' | 'down') => {
    if (!course || !id) return;

    const sections = [...course.sections];
    const currentIndex = sections.findIndex(s => s._id === sectionId);

    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === sections.length - 1) return;

    // Swap positions
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    [sections[currentIndex], sections[newIndex]] = [sections[newIndex], sections[currentIndex]];

    // Update order numbers
    const reorderedSections = sections.map((section, index) => ({
      sectionId: section._id,
      newOrder: index + 1
    }));

    try {
      setSaving(true);
      const response = await sectionService.reorderSections(id, reorderedSections);

      if (response.success) {
        await loadCourseStructure();
      }
    } catch (error: any) {
      console.error('Error reordering sections:', error);
      toast.error(error.response?.data?.message || 'Lỗi khi sắp xếp lại chương');
    } finally {
      setSaving(false);
    }
  };

  const moveLesson = async (sectionId: string, lessonId: string, direction: 'up' | 'down') => {
    const section = course?.sections.find(s => s._id === sectionId);
    if (!section) return;

    const lessons = [...section.lessons];
    const currentIndex = lessons.findIndex(l => l._id === lessonId);

    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === lessons.length - 1) return;

    // Swap positions
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    [lessons[currentIndex], lessons[newIndex]] = [lessons[newIndex], lessons[currentIndex]];

    // Update order numbers
    const reorderedLessons = lessons.map((lesson, index) => ({
      lessonId: lesson._id,
      newOrder: index + 1
    }));

    try {
      setSaving(true);
      const response = await lessonService.reorderLessons(sectionId, reorderedLessons);

      if (response.success) {
        await loadCourseStructure();
      }
    } catch (error: any) {
      console.error('Error reordering lessons:', error);
      toast.error(error.response?.data?.message || 'Lỗi khi sắp xếp lại bài học');
    } finally {
      setSaving(false);
    }
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
      link: <LinkIcon />,
      quiz: <QuizIcon />,
      assignment: <AssignmentIcon />
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
                        <Grid item xs={12} md={3}>
                          <FormControl fullWidth>
                            <InputLabel>Loại lesson</InputLabel>
                            <Select
                              value={newLesson.type}
                              onChange={(e) => setNewLesson(prev => ({ ...prev, type: e.target.value as 'video' | 'text' | 'file' | 'link' | 'quiz' | 'assignment' }))}
                              label="Loại lesson"
                              MenuProps={{ disableScrollLock: true }}
                            >
                              <MenuItem value="video">Video</MenuItem>
                              <MenuItem value="text">Văn bản</MenuItem>
                              <MenuItem value="file">File</MenuItem>
                              <MenuItem value="link">Link</MenuItem>
                              <MenuItem value="quiz">Quiz</MenuItem>
                              <MenuItem value="assignment">Bài tập</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <TextField
                            fullWidth
                            type="number"
                            label="Thời lượng (phút)"
                            value={newLesson.duration}
                            onChange={(e) => setNewLesson(prev => ({ ...prev, duration: Number(e.target.value) }))}
                            InputProps={{ inputProps: { min: 1 } }}
                            required
                            variant="outlined"
                          />
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

                      {newLesson.type === 'quiz' && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                            Câu hỏi trắc nghiệm
                          </Typography>
                          {newLesson.quizQuestions.map((q, qIndex) => (
                            <Paper key={qIndex} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                              <Stack spacing={2}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    Câu {qIndex + 1}
                                  </Typography>
                                  {newLesson.quizQuestions.length > 1 && (
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => {
                                        const newQuestions = newLesson.quizQuestions.filter((_, i) => i !== qIndex);
                                        setNewLesson(prev => ({ ...prev, quizQuestions: newQuestions }));
                                      }}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  )}
                                </Stack>

                                <TextField
                                  fullWidth
                                  size="small"
                                  label="Câu hỏi"
                                  value={q.question}
                                  onChange={(e) => {
                                    const newQuestions = [...newLesson.quizQuestions];
                                    newQuestions[qIndex].question = e.target.value;
                                    setNewLesson(prev => ({ ...prev, quizQuestions: newQuestions }));
                                  }}
                                  placeholder="Nhập câu hỏi..."
                                  required
                                />

                                {q.answers.map((answer, aIndex) => (
                                  <Stack key={aIndex} direction="row" spacing={1} alignItems="center">
                                    <IconButton
                                      size="small"
                                      color={q.correctAnswer === aIndex ? 'success' : 'default'}
                                      onClick={() => {
                                        const newQuestions = [...newLesson.quizQuestions];
                                        newQuestions[qIndex].correctAnswer = aIndex;
                                        setNewLesson(prev => ({ ...prev, quizQuestions: newQuestions }));
                                      }}
                                    >
                                      {q.correctAnswer === aIndex ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                                    </IconButton>
                                    <TextField
                                      fullWidth
                                      size="small"
                                      label={`Đáp án ${aIndex + 1}`}
                                      value={answer}
                                      onChange={(e) => {
                                        const newQuestions = [...newLesson.quizQuestions];
                                        newQuestions[qIndex].answers[aIndex] = e.target.value;
                                        setNewLesson(prev => ({ ...prev, quizQuestions: newQuestions }));
                                      }}
                                      placeholder={`Nhập đáp án ${aIndex + 1}...`}
                                      required
                                    />
                                  </Stack>
                                ))}

                                <TextField
                                  fullWidth
                                  size="small"
                                  label="Giải thích (tùy chọn)"
                                  value={q.explanation}
                                  onChange={(e) => {
                                    const newQuestions = [...newLesson.quizQuestions];
                                    newQuestions[qIndex].explanation = e.target.value;
                                    setNewLesson(prev => ({ ...prev, quizQuestions: newQuestions }));
                                  }}
                                  placeholder="Giải thích đáp án đúng..."
                                  multiline
                                  rows={2}
                                />
                              </Stack>
                            </Paper>
                          ))}

                          <Button
                            startIcon={<AddIcon />}
                            onClick={() => {
                              setNewLesson(prev => ({
                                ...prev,
                                quizQuestions: [
                                  ...prev.quizQuestions,
                                  {
                                    question: '',
                                    answers: ['', '', '', ''],
                                    correctAnswer: 0,
                                    explanation: ''
                                  }
                                ]
                              }));
                            }}
                            variant="outlined"
                            size="small"
                          >
                            Thêm câu hỏi
                          </Button>
                        </Box>
                      )}

                      {newLesson.type === 'assignment' && (
                        <TextField
                          fullWidth
                          label="Mô tả Bài tập"
                          value={newLesson.content}
                          onChange={(e) => setNewLesson(prev => ({ ...prev, content: e.target.value }))}
                          placeholder="Nhập mô tả bài tập, yêu cầu, deadline..."
                          multiline
                          rows={4}
                          variant="outlined"
                          sx={{ mb: 2 }}
                          helperText="Chi tiết bài tập và cách nộp bài"
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
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 1 }}>
                              <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    size="small"
                                    label="Tiêu đề"
                                    value={lesson.title}
                                    onChange={(e) => updateLesson(section._id, lesson._id, { title: e.target.value })}
                                    variant="outlined"
                                  />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                  <FormControl fullWidth size="small">
                                    <InputLabel>Loại</InputLabel>
                                    <Select
                                      value={lesson.type}
                                      onChange={(e) => updateLesson(section._id, lesson._id, { type: e.target.value as any })}
                                      label="Loại"
                                      MenuProps={{ disableScrollLock: true }}
                                    >
                                      <MenuItem value="video">Video</MenuItem>
                                      <MenuItem value="text">Văn bản</MenuItem>
                                      <MenuItem value="file">File</MenuItem>
                                      <MenuItem value="link">Link</MenuItem>
                                      <MenuItem value="quiz">Quiz</MenuItem>
                                      <MenuItem value="assignment">Bài tập</MenuItem>
                                    </Select>
                                  </FormControl>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                  <TextField
                                    fullWidth
                                    size="small"
                                    type="number"
                                    label="Thời lượng (phút)"
                                    value={lesson.duration}
                                    onChange={(e) => updateLesson(section._id, lesson._id, { duration: Number(e.target.value) })}
                                    InputProps={{ inputProps: { min: 1 } }}
                                    variant="outlined"
                                  />
                                </Grid>
                              </Grid>

                              {lesson.type === 'text' && (
                                <TextField
                                  fullWidth
                                  size="small"
                                  label="Nội dung"
                                  value={lesson.content || ''}
                                  onChange={(e) => updateLesson(section._id, lesson._id, { content: e.target.value })}
                                  multiline
                                  rows={3}
                                  variant="outlined"
                                />
                              )}

                              {lesson.type === 'video' && (
                                <TextField
                                  fullWidth
                                  size="small"
                                  label="URL Video"
                                  value={lesson.videoUrl || ''}
                                  onChange={(e) => updateLesson(section._id, lesson._id, { videoUrl: e.target.value })}
                                  variant="outlined"
                                />
                              )}

                              {lesson.type === 'file' && (
                                <TextField
                                  fullWidth
                                  size="small"
                                  label="URL File"
                                  value={lesson.fileUrl || ''}
                                  onChange={(e) => updateLesson(section._id, lesson._id, { fileUrl: e.target.value })}
                                  variant="outlined"
                                />
                              )}

                              {lesson.type === 'link' && (
                                <TextField
                                  fullWidth
                                  size="small"
                                  label="URL Link"
                                  value={lesson.linkUrl || ''}
                                  onChange={(e) => updateLesson(section._id, lesson._id, { linkUrl: e.target.value })}
                                  variant="outlined"
                                />
                              )}

                              {lesson.type === 'quiz' && (
                                <Box>
                                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                    Câu hỏi trắc nghiệm
                                  </Typography>
                                  {(lesson.quizQuestions && lesson.quizQuestions.length > 0 ? lesson.quizQuestions : [{
                                    question: '',
                                    answers: ['', '', '', ''],
                                    correctAnswer: 0,
                                    explanation: ''
                                  }]).map((q, qIndex) => (
                                    <Paper key={qIndex} sx={{ p: 1.5, mb: 1.5, bgcolor: 'grey.50' }}>
                                      <Stack spacing={1}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                            Câu {qIndex + 1}
                                          </Typography>
                                          {(lesson.quizQuestions?.length || 0) > 1 && (
                                            <IconButton
                                              size="small"
                                              color="error"
                                              onClick={() => {
                                                const newQuestions = lesson.quizQuestions?.filter((_, i) => i !== qIndex) || [];
                                                updateLesson(section._id, lesson._id, { quizQuestions: newQuestions });
                                              }}
                                            >
                                              <DeleteIcon fontSize="small" />
                                            </IconButton>
                                          )}
                                        </Stack>

                                        <TextField
                                          fullWidth
                                          size="small"
                                          label="Câu hỏi"
                                          value={q.question}
                                          onChange={(e) => {
                                            const newQuestions = [...(lesson.quizQuestions || [])];
                                            newQuestions[qIndex].question = e.target.value;
                                            updateLesson(section._id, lesson._id, { quizQuestions: newQuestions });
                                          }}
                                          placeholder="Nhập câu hỏi..."
                                        />

                                        {q.answers.map((answer, aIndex) => (
                                          <Stack key={aIndex} direction="row" spacing={0.5} alignItems="center">
                                            <IconButton
                                              size="small"
                                              color={q.correctAnswer === aIndex ? 'success' : 'default'}
                                              onClick={() => {
                                                const newQuestions = [...(lesson.quizQuestions || [])];
                                                newQuestions[qIndex].correctAnswer = aIndex;
                                                updateLesson(section._id, lesson._id, { quizQuestions: newQuestions });
                                              }}
                                            >
                                              {q.correctAnswer === aIndex ? <CheckCircleIcon fontSize="small" /> : <RadioButtonUncheckedIcon fontSize="small" />}
                                            </IconButton>
                                            <TextField
                                              fullWidth
                                              size="small"
                                              label={`Đáp án ${aIndex + 1}`}
                                              value={answer}
                                              onChange={(e) => {
                                                const newQuestions = [...(lesson.quizQuestions || [])];
                                                newQuestions[qIndex].answers[aIndex] = e.target.value;
                                                updateLesson(section._id, lesson._id, { quizQuestions: newQuestions });
                                              }}
                                              placeholder={`Đáp án ${aIndex + 1}`}
                                            />
                                          </Stack>
                                        ))}

                                        <TextField
                                          fullWidth
                                          size="small"
                                          label="Giải thích"
                                          value={q.explanation || ''}
                                          onChange={(e) => {
                                            const newQuestions = [...(lesson.quizQuestions || [])];
                                            newQuestions[qIndex].explanation = e.target.value;
                                            updateLesson(section._id, lesson._id, { quizQuestions: newQuestions });
                                          }}
                                          placeholder="Giải thích đáp án đúng..."
                                          multiline
                                          rows={2}
                                        />
                                      </Stack>
                                    </Paper>
                                  ))}

                                  <Button
                                    startIcon={<AddIcon />}
                                    onClick={() => {
                                      const newQuestions = [
                                        ...(lesson.quizQuestions || []),
                                        {
                                          question: '',
                                          answers: ['', '', '', ''],
                                          correctAnswer: 0,
                                          explanation: ''
                                        }
                                      ];
                                      updateLesson(section._id, lesson._id, { quizQuestions: newQuestions });
                                    }}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                  >
                                    Thêm câu hỏi
                                  </Button>
                                </Box>
                              )}

                              {lesson.type === 'assignment' && (
                                <TextField
                                  fullWidth
                                  size="small"
                                  label="Mô tả Bài tập"
                                  value={lesson.content || ''}
                                  onChange={(e) => updateLesson(section._id, lesson._id, { content: e.target.value })}
                                  multiline
                                  rows={4}
                                  variant="outlined"
                                />
                              )}

                              <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() => {
                                    setEditingLesson(null);
                                    loadCourseStructure(); // Reload to discard changes
                                  }}
                                >
                                  Hủy
                                </Button>
                                <Button
                                  size="small"
                                  variant="contained"
                                  onClick={() => saveLessonChanges(lesson._id)}
                                  disabled={saving}
                                >
                                  {saving ? 'Đang lưu...' : 'Lưu'}
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
                                  label={`${lesson.duration} phút`}
                                  size="small"
                                  color="info"
                                  variant="outlined"
                                  icon={<ScheduleIcon />}
                                />
                                <Chip
                                  label={lesson.isPublished ? 'Đã xuất bản' : 'Bản nháp'}
                                  size="small"
                                  color={lesson.isPublished ? 'success' : 'default'}
                                  icon={lesson.isPublished ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                                />
                              </Stack>
                              <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                                <Chip
                                  label={lesson.type}
                                  size="small"
                                  variant="outlined"
                                  sx={{ textTransform: 'capitalize' }}
                                />
                                {lesson.videoUrl && (
                                  <Chip
                                    label="Có video"
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    icon={<PlayArrowIcon />}
                                  />
                                )}
                                {lesson.fileUrl && (
                                  <Chip
                                    label="Có file"
                                    size="small"
                                    color="secondary"
                                    variant="outlined"
                                    icon={<AttachFileIcon />}
                                  />
                                )}
                                {lesson.linkUrl && (
                                  <Chip
                                    label="Có link"
                                    size="small"
                                    color="info"
                                    variant="outlined"
                                    icon={<LinkIcon />}
                                  />
                                )}
                                {lesson.type === 'quiz' && lesson.quizQuestions && (
                                  <Chip
                                    label={`${lesson.quizQuestions.length} câu hỏi`}
                                    size="small"
                                    color="warning"
                                    variant="outlined"
                                    icon={<QuizIcon />}
                                  />
                                )}
                                {lesson.content && lesson.type === 'text' && (
                                  <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, ml: 1 }}>
                                    {lesson.content.substring(0, 80)}...
                                  </Typography>
                                )}
                                {lesson.type === 'assignment' && (
                                  <Chip
                                    label="Bài tập"
                                    size="small"
                                    color="error"
                                    variant="outlined"
                                    icon={<AssignmentIcon />}
                                  />
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

      {/* Info Card */}
      {course.sections.length === 0 && (
        <Card sx={{ textAlign: 'center', py: 4 }}>
          <CardContent>
            <SchoolIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Chưa có chương nào
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Bắt đầu bằng cách tạo chương đầu tiên cho khóa học của bạn
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default CourseStructure;
