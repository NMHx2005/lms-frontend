import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as sectionService from '@/services/client/section.service';
import * as lessonService from '@/services/client/lesson.service';
import { videoService } from '@/services/client/video.service';
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
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  Divider,
  FormControlLabel
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
  Assignment as AssignmentIcon,
  Analytics as AnalyticsIcon,
  Download as DownloadIcon,
  Upload as UploadIcon
} from '@mui/icons-material';
import VideoUpload from '@/components/VideoUpload/VideoUpload';
import SubtitleManager from '@/components/SubtitleManager/SubtitleManager';
import VideoAnalytics from '@/components/VideoAnalytics/VideoAnalytics';
import QuestionBankManager from '@/components/QuestionBank/QuestionBankManager';
import QuizAnalytics from '@/components/Quiz/QuizAnalytics';
import FileUpload, { FileUploadResult } from '@/components/File/FileUpload';
import RichTextEditor from '@/components/RichTextEditor/RichTextEditor';
import LinkPreview from '@/components/Link/LinkPreview';
import AssignmentEditor from '@/components/Assignment/AssignmentEditor';
import { downloadQuizTemplate } from '@/services/client/quiz-template.service';
import { parseQuizCSV, readCSVFile } from '@/services/client/quiz-import.service';

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
  duration?: number; // Chỉ dùng cho video lesson
  estimatedTime?: number; // Backend field name
  order: number;
  isPublished: boolean;
  content?: string;
  videoUrl?: string;
  fileUrl?: string;
  fileSize?: number;
  fileType?: string;
  linkUrl?: string;
  attachments?: Array<{
    name: string;
    url: string;
    size: number;
    type: string;
  }>;
  quizQuestions?: Array<{
    question: string;
    type?: string;
    answers: string[];
    correctAnswer: number | number[] | string | any;
    explanation?: string;
    points?: number;
    difficulty?: string;
  }>;
  quizSettings?: {
    timeLimit?: number;
    timeLimitPerQuestion?: number;
    allowPause?: boolean;
    maxAttempts?: number;
    scoreCalculation?: 'best' | 'average' | 'last';
    cooldownPeriod?: number;
    passingScore?: number;
    negativeMarking?: boolean;
    negativeMarkingPercentage?: number;
    partialCredit?: boolean;
    randomizeQuestions?: boolean;
    randomizeAnswers?: boolean;
    questionPool?: number;
    immediateFeedback?: boolean;
    showCorrectAnswers?: boolean;
    showExplanation?: boolean;
    showScoreBreakdown?: boolean;
    showClassAverage?: boolean;
  };
  assignmentDetails?: {
    instructions?: string;
    dueDate?: string | Date;
    maxScore?: number;
    allowLateSubmission?: boolean;
  };
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
  const [pendingVideoFile, setPendingVideoFile] = useState<File | null>(null);
  const [uploadingPendingVideo, setUploadingPendingVideo] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [originalSectionData, setOriginalSectionData] = useState<{ title: string; description: string } | null>(null);
  const [editingLesson, setEditingLesson] = useState<string | null>(null);
  const [showAddSection, setShowAddSection] = useState(false);
  const [showAddLesson, setShowAddLesson] = useState<string | null>(null);
  const [showVideoUpload, setShowVideoUpload] = useState<string | null>(null);
  const [showSubtitleManager, setShowSubtitleManager] = useState<string | null>(null);
  const [showVideoAnalytics, setShowVideoAnalytics] = useState<string | null>(null);
  const [showImportQuiz, setShowImportQuiz] = useState(false);
  const [importingQuiz, setImportingQuiz] = useState(false);
  const [showQuestionBank, setShowQuestionBank] = useState<string | null>(null);
  const [fileUploadMode, setFileUploadMode] = useState<'upload' | 'url'>('upload'); // Track file upload mode
  const [newSection, setNewSection] = useState({ title: '', description: '' });
  const [newLesson, setNewLesson] = useState<{
    title: string;
    type: 'video' | 'text' | 'file' | 'link' | 'quiz' | 'assignment';
    duration?: number; // Chỉ dùng cho video lesson
    content: string;
    videoUrl: string;
    fileUrl: string;
    fileSize?: number;
    fileType?: string;
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
    fileSize: undefined,
    fileType: undefined,
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
              await Promise.all(
                lessonsResponse.data.map(async (lesson: any) => {
                  // For video lessons, try to get duration from VideoFile API if video is from Cloudinary
                  let lessonDuration = lesson.estimatedTime || lesson.duration || 0;

                  if (lesson.type === 'video' && lesson._id) {
                    // Check if video is from Cloudinary (not YouTube/external link)
                    const videoUrl = lesson.videoUrl || lesson.content || '';
                    const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');

                    if (!isYouTube) {
                      try {
                        // Try to get duration from VideoFile API
                        const videoFileResponse = await videoService.getVideoFile(lesson._id);
                        if (videoFileResponse.success && videoFileResponse.data?.duration) {
                          // Duration from API is in seconds, convert to minutes
                          lessonDuration = Math.ceil(videoFileResponse.data.duration / 60);
                          console.log(`✅ Loaded duration for lesson ${lesson._id}:`, videoFileResponse.data.duration, 'seconds =', lessonDuration, 'minutes');
                        }
                      } catch (error: any) {
                        // VideoFile not found (404) - this is normal for external/YouTube videos
                        if (error.response?.status !== 404) {
                          console.warn('⚠️ Error loading VideoFile for lesson:', lesson._id, error);
                        }
                      }
                    }
                  }

                  return {
                    ...lesson,
                    duration: lessonDuration
                  };
                })
              ) : [];
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

  const handlePendingVideoUpload = async (lessonId: string, file: File) => {
    let toastId: any = null;
    try {
      setUploadingPendingVideo(true);
      toastId = toast.loading('Uploading video for new lesson...');

      const response = await videoService.uploadVideo(
        lessonId,
        file
      );

      if (response.success) {
        toast.update(toastId, { render: "Video uploaded successfully", type: "success", isLoading: false, autoClose: 3000 });
        await loadCourseStructure();
      } else {
        toast.update(toastId, { render: "Video upload failed", type: "error", isLoading: false, autoClose: 3000 });
      }
    } catch (error: any) {
      if (toastId) {
        toast.update(toastId, { render: 'Video upload failed: ' + (error.response?.data?.error || 'Unknown error'), type: "error", isLoading: false, autoClose: 3000 });
      } else {
        toast.error('Video upload failed: ' + (error.response?.data?.error || 'Unknown error'));
      }
    } finally {
      setUploadingPendingVideo(false);
      setPendingVideoFile(null);
    }
  };

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
        // Send placeholder URL if uploading pending file to satisfy backend validation
        videoUrl: (newLesson.type === 'video' && pendingVideoFile) ? 'https://uploading_pending.com' : newLesson.videoUrl,
        fileUrl: newLesson.fileUrl,
        fileSize: newLesson.fileSize,
        fileType: newLesson.fileType,
        linkUrl: newLesson.linkUrl,
        // If uploading, send default duration 1 min, will be updated after upload. Else use user input.
        ...(newLesson.type === 'video' && { duration: pendingVideoFile ? 1 : newLesson.duration }),
        order: section.lessons.length + 1,
        isPublished: true
      };

      // Add quiz questions if type is quiz
      if (newLesson.type === 'quiz') {
        lessonData.quizQuestions = newLesson.quizQuestions;
      }

      const response = await lessonService.createLesson(lessonData);

      if (response.success && response.data) {
        toast.success('Tạo bài học mới thành công');

        // If there is a pending video file, upload it now
        if (newLesson.type === 'video' && pendingVideoFile && response.data._id) {
          handlePendingVideoUpload(response.data._id, pendingVideoFile);
        }

        setNewLesson({
          title: '',
          type: 'video',
          duration: 5, // Default cho video
          content: '',
          videoUrl: '',
          fileUrl: '',
          fileSize: undefined,
          fileType: undefined,
          linkUrl: '',
          quizQuestions: [{
            question: '',
            answers: ['', '', '', ''],
            correctAnswer: 0,
            explanation: ''
          }]
        });
        setFileUploadMode('upload'); // Reset to upload mode
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
        setOriginalSectionData(null);
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
        ...(lesson.type === 'video' && { duration: lesson.duration }),
        content: lesson.content,
        videoUrl: lesson.videoUrl,
        fileUrl: lesson.fileUrl,
        linkUrl: lesson.linkUrl,
        isPublished: true
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
    total + s.lessons.reduce((sum, l) => sum + (l.duration || 0), 0), 0
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
                        onChange={(e) => {
                          // Update local state immediately for responsive UI
                          const updatedSections = course!.sections.map(s =>
                            s._id === section._id ? { ...s, title: e.target.value } : s
                          );
                          setCourse({ ...course!, sections: updatedSections });
                        }}
                        onBlur={(e) => {
                          // Only call API when user finishes editing (on blur) and value changed
                          if (originalSectionData && e.target.value !== originalSectionData.title) {
                            updateSection(section._id, { title: e.target.value });
                          }
                        }}
                        variant="outlined"
                        sx={{ mb: 1 }}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        value={section.description}
                        onChange={(e) => {
                          // Update local state immediately for responsive UI
                          const updatedSections = course!.sections.map(s =>
                            s._id === section._id ? { ...s, description: e.target.value } : s
                          );
                          setCourse({ ...course!, sections: updatedSections });
                        }}
                        onBlur={(e) => {
                          // Only call API when user finishes editing (on blur) and value changed
                          if (originalSectionData && e.target.value !== originalSectionData.description) {
                            updateSection(section._id, { description: e.target.value });
                          }
                        }}
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
                      if (editingSection === section._id) {
                        setEditingSection(null);
                        setOriginalSectionData(null);
                      } else {
                        setEditingSection(section._id);
                        // Save original data for comparison
                        setOriginalSectionData({
                          title: section.title,
                          description: section.description || ''
                        });
                      }
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
                              onChange={(e) => {
                                const newType = e.target.value as 'video' | 'text' | 'file' | 'link' | 'quiz' | 'assignment';
                                setNewLesson(prev => ({ ...prev, type: newType }));
                                // Reset file upload mode when switching to file type
                                if (newType === 'file') {
                                  setFileUploadMode('upload');
                                }
                              }}
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
                        {/* Duration chỉ hiển thị cho video lesson - Hide/Disable if uploading */}
                        {newLesson.type === 'video' && (
                          <Grid item xs={12} md={3}>
                            <TextField
                              fullWidth
                              type="number"
                              label="Thời lượng (phút)"
                              value={newLesson.duration}
                              onChange={(e) => setNewLesson(prev => ({ ...prev, duration: Number(e.target.value) }))}
                              InputProps={{
                                inputProps: { min: 1 },
                                readOnly: showVideoUpload === 'new' // Disable if uploading
                              }}
                              disabled={showVideoUpload === 'new'}
                              helperText={showVideoUpload === 'new' ? "Tự động cập nhật sau khi upload" : ""}
                              required
                              variant="outlined"
                            />
                          </Grid>
                        )}
                      </Grid>

                      {newLesson.type === 'text' && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                            Nội dung bài học
                          </Typography>
                          <RichTextEditor
                            value={newLesson.content}
                            onChange={(content) => setNewLesson(prev => ({ ...prev, content }))}
                            placeholder="Nhập nội dung lesson với rich text editor..."
                            height={400}
                          />
                        </Box>
                      )}

                      {newLesson.type === 'video' && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                            Video Source
                          </Typography>
                          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                            <Button
                              variant={showVideoUpload !== 'new' ? 'contained' : 'outlined'}
                              onClick={() => setShowVideoUpload(null)}
                              size="small"
                            >
                              URL
                            </Button>
                            <Button
                              variant={showVideoUpload === 'new' ? 'contained' : 'outlined'}
                              onClick={() => setShowVideoUpload('new')}
                              size="small"
                            >
                              Upload Video
                            </Button>
                          </Stack>
                          {showVideoUpload === 'new' ? (
                            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                              {!pendingVideoFile ? (
                                <>
                                  <div
                                    className="video-upload-dropzone"
                                    style={{
                                      border: '2px dashed #ccc',
                                      borderRadius: '8px',
                                      padding: '20px',
                                      textAlign: 'center',
                                      cursor: 'pointer',
                                      marginBottom: '10px'
                                    }}
                                    onClick={() => document.getElementById('new-lesson-video-file')?.click()}
                                  >
                                    <input
                                      type="file"
                                      id="new-lesson-video-file"
                                      accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
                                      style={{ display: 'none' }}
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          if (file.size > 524288000) { // 500MB
                                            toast.error('File too large (>500MB)');
                                            return;
                                          }
                                          setPendingVideoFile(file);
                                        }
                                      }}
                                    />
                                    <Typography variant="body1">Click to select video file</Typography>
                                    <Typography variant="caption" color="text.secondary">Max 500MB (MP4, WebM, MOV, AVI)</Typography>
                                  </div>
                                  <Button
                                    variant="outlined"
                                    onClick={() => setShowVideoUpload(null)}
                                    size="small"
                                  >
                                    Use URL Instead
                                  </Button>
                                </>
                              ) : (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1, border: '1px solid #ddd', borderRadius: 1, bgcolor: '#fff' }}>
                                  <Typography variant="body2" sx={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {pendingVideoFile.name} ({(pendingVideoFile.size / (1024 * 1024)).toFixed(2)} MB)
                                  </Typography>
                                  <Button
                                    size="small"
                                    color="error"
                                    onClick={() => setPendingVideoFile(null)}
                                  >
                                    Remove
                                  </Button>
                                </Box>
                              )}
                              {pendingVideoFile && (
                                <Typography variant="caption" color="primary" sx={{ display: 'block', mt: 1 }}>
                                  Video will be uploaded after you click "Thêm Lesson".
                                </Typography>
                              )}
                            </Box>
                          ) : (
                            <TextField
                              fullWidth
                              label="URL Video"
                              type="url"
                              value={newLesson.videoUrl}
                              onChange={(e) => setNewLesson(prev => ({ ...prev, videoUrl: e.target.value }))}
                              placeholder="https://example.com/video.mp4 or YouTube URL"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      )}

                      {newLesson.type === 'file' && (
                        <Box>
                          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                            <Button
                              variant={fileUploadMode === 'upload' ? 'contained' : 'outlined'}
                              onClick={() => {
                                setFileUploadMode('upload');
                                // Clear fileUrl if it was a manual URL
                                if (newLesson.fileUrl && !newLesson.fileUrl.includes('cloudinary') && !newLesson.fileUrl.includes('res.cloudinary')) {
                                  setNewLesson(prev => ({ ...prev, fileUrl: '', fileSize: undefined, fileType: undefined }));
                                }
                              }}
                              size="small"
                            >
                              Upload File
                            </Button>
                            <Button
                              variant={fileUploadMode === 'url' ? 'contained' : 'outlined'}
                              onClick={() => {
                                setFileUploadMode('url');
                                // Clear fileUrl if it was an uploaded file (Cloudinary URL)
                                if (newLesson.fileUrl && (newLesson.fileUrl.includes('cloudinary') || newLesson.fileUrl.includes('res.cloudinary'))) {
                                  setNewLesson(prev => ({ ...prev, fileUrl: '', fileSize: undefined, fileType: undefined }));
                                }
                              }}
                              size="small"
                            >
                              Use URL
                            </Button>
                          </Stack>
                          {fileUploadMode === 'upload' ? (
                            <FileUpload
                              maxFiles={1}
                              maxSizePerFile={50 * 1024 * 1024} // 50MB
                              folder="lms/lesson-files"
                              multiple={false}
                              onUploadComplete={async (files: FileUploadResult[]) => {
                                if (files.length > 0) {
                                  setNewLesson(prev => ({
                                    ...prev,
                                    fileUrl: files[0].secureUrl,
                                    fileSize: files[0].size,
                                    fileType: files[0].mimeType,
                                  }));
                                  toast.success('File uploaded successfully');
                                }
                              }}
                            />
                          ) : (
                            <TextField
                              fullWidth
                              label="URL File"
                              type="url"
                              value={newLesson.fileUrl}
                              onChange={(e) => setNewLesson(prev => ({ ...prev, fileUrl: e.target.value, fileSize: undefined, fileType: undefined }))}
                              placeholder="https://example.com/file.pdf"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      )}

                      {newLesson.type === 'link' && (
                        <Box sx={{ mb: 2 }}>
                          <TextField
                            fullWidth
                            label="URL Link"
                            type="url"
                            value={newLesson.linkUrl}
                            onChange={(e) => setNewLesson(prev => ({ ...prev, linkUrl: e.target.value }))}
                            placeholder="https://example.com"
                            variant="outlined"
                            sx={{ mb: 2 }}
                            required
                          />
                          <TextField
                            fullWidth
                            label="Mô tả (tùy chọn)"
                            value={newLesson.content}
                            onChange={(e) => setNewLesson(prev => ({ ...prev, content: e.target.value }))}
                            placeholder="Mô tả về link này, tại sao nó quan trọng, học viên sẽ học được gì..."
                            multiline
                            rows={3}
                            variant="outlined"
                            sx={{ mb: 2 }}
                          />
                          {newLesson.linkUrl && (
                            <LinkPreview
                              url={newLesson.linkUrl}
                              onUrlChange={(url) => setNewLesson(prev => ({ ...prev, linkUrl: url }))}
                            />
                          )}
                        </Box>
                      )}

                      {newLesson.type === 'quiz' && (
                        <Box sx={{ mb: 2 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              Câu hỏi trắc nghiệm ({newLesson.quizQuestions.length})
                            </Typography>
                            <Stack direction="row" spacing={1}>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<DownloadIcon />}
                                onClick={() => {
                                  downloadQuizTemplate();
                                  toast.success('Đã tải file mẫu Excel');
                                }}
                              >
                                Tải mẫu
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<UploadIcon />}
                                onClick={() => setShowImportQuiz(true)}
                              >
                                Import từ Excel
                              </Button>
                            </Stack>
                          </Stack>
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
                        <Box sx={{ mb: 2 }}>
                          <AssignmentEditor
                            initialData={{
                              title: newLesson.title,
                              description: newLesson.content || '',
                              instructions: '',
                              type: 'file',
                              maxScore: 100,
                              attempts: 1,
                            }}
                            onChange={(data) => {
                              setNewLesson(prev => ({
                                ...prev,
                                title: data.title,
                                content: data.description,
                                assignmentDetails: {
                                  instructions: data.instructions,
                                  dueDate: data.dueDate || undefined,
                                  maxScore: data.maxScore,
                                  allowLateSubmission: data.allowLateSubmission,
                                },
                              }));
                            }}
                            lessonId={showAddLesson || undefined}
                          />
                        </Box>
                      )}

                      <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button
                          variant="outlined"
                          onClick={() => {
                            setShowAddLesson(null);
                            setFileUploadMode('upload'); // Reset mode when canceling
                          }}
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

                {/* Question Bank Manager - hiển thị cho từng quiz lesson */}
                {section.lessons.map((lesson) => (
                  showQuestionBank === lesson._id && lesson.type === 'quiz' ? (
                    <Box key={`qb-${lesson._id}`} sx={{ mt: 2, mb: 2 }}>
                      <QuestionBankManager
                        courseId={id || undefined}
                        mode="select"
                        onSelectQuestions={(selectedQuestions) => {
                          // Add selected questions to lesson
                          const newQuestions = [
                            ...(lesson.quizQuestions || []),
                            ...selectedQuestions.map(q => ({
                              question: q.question,
                              type: q.type,
                              answers: q.answers,
                              correctAnswer: q.correctAnswer,
                              explanation: q.explanation,
                              points: q.points,
                              difficulty: q.difficulty
                            }))
                          ];
                          updateLesson(section._id, lesson._id, { quizQuestions: newQuestions });
                          setShowQuestionBank(null);
                          toast.success(`Đã thêm ${selectedQuestions.length} câu hỏi từ ngân hàng`);
                        }}
                      />
                    </Box>
                  ) : null
                ))}

                {/* Import Quiz Dialog */}
                <Dialog
                  open={showImportQuiz}
                  onClose={() => setShowImportQuiz(false)}
                  maxWidth="sm"
                  fullWidth
                >
                  <DialogTitle>Import Câu Hỏi từ Excel/CSV</DialogTitle>
                  <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Chọn file Excel/CSV đã điền câu hỏi theo mẫu. Hệ thống sẽ tự động import các câu hỏi multiple-choice.
                      </Typography>
                      <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
                          💡 Lưu ý khi mở file CSV:
                        </Typography>
                        <Typography variant="caption" component="div">
                          • Nếu file hiển thị tiếng Việt bị lỗi, hãy mở Excel → Data → Get Data → From File → From Text/CSV<br />
                          • Chọn file → Chọn encoding "UTF-8" → Load<br />
                          • Hoặc mở bằng Google Sheets (tự động nhận diện UTF-8)
                        </Typography>
                      </Box>
                      <input
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        id="quiz-import-file"
                        style={{ display: 'none' }}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          try {
                            setImportingQuiz(true);

                            // Đọc file
                            const content = await readCSVFile(file);

                            // Parse CSV
                            const parsedQuestions = parseQuizCSV(content);

                            if (parsedQuestions.length === 0) {
                              toast.error('Không tìm thấy câu hỏi hợp lệ trong file. Vui lòng kiểm tra lại format.');
                              return;
                            }

                            // Convert sang format của hệ thống
                            const convertedQuestions = parsedQuestions.map(q => ({
                              question: q.question,
                              answers: q.answers,
                              correctAnswer: q.correctAnswer,
                              explanation: q.explanation || ''
                            }));

                            // Thêm vào quizQuestions
                            setNewLesson(prev => ({
                              ...prev,
                              quizQuestions: [
                                ...prev.quizQuestions,
                                ...convertedQuestions
                              ]
                            }));

                            toast.success(`Đã import ${convertedQuestions.length} câu hỏi thành công!`);
                            setShowImportQuiz(false);
                          } catch (error: any) {
                            console.error('Error importing quiz:', error);
                            toast.error(error.message || 'Lỗi khi import file. Vui lòng kiểm tra lại format file.');
                          } finally {
                            setImportingQuiz(false);
                            // Reset input
                            const input = document.getElementById('quiz-import-file') as HTMLInputElement;
                            if (input) input.value = '';
                          }
                        }}
                      />
                      <label htmlFor="quiz-import-file">
                        <Button
                          variant="outlined"
                          component="span"
                          fullWidth
                          startIcon={<UploadIcon />}
                          disabled={importingQuiz}
                        >
                          {importingQuiz ? 'Đang xử lý...' : 'Chọn File Excel/CSV'}
                        </Button>
                      </label>
                      <Typography variant="caption" color="text.secondary">
                        💡 Chưa có file mẫu? Click "Tải mẫu" để tải template Excel.
                      </Typography>
                    </Stack>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setShowImportQuiz(false)}>
                      Đóng
                    </Button>
                  </DialogActions>
                </Dialog>

                {/* Lessons List */}
                <List sx={{ p: 0 }}>
                  {section.lessons.map((lesson, lessonIndex) => (
                    <React.Fragment key={`lesson-${lesson._id}`}>
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
                                  {/* Duration chỉ hiển thị cho video lesson */}
                                  {lesson.type === 'video' && (
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
                                  )}
                                </Grid>

                                {lesson.type === 'text' && (
                                  <Box sx={{ width: '100%' }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                      Nội dung bài học
                                    </Typography>
                                    <RichTextEditor
                                      value={lesson.content || ''}
                                      onChange={(content) => {
                                        const updatedLesson = { ...lesson, content };
                                        updateLesson(section._id, lesson._id, updatedLesson);
                                      }}
                                      placeholder="Nhập nội dung lesson với rich text editor..."
                                      height={400}
                                    />
                                  </Box>
                                )}
                                {lesson.type === 'text' && false && (
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
                                  <Box>
                                    <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                                      <Button
                                        variant={showVideoUpload !== lesson._id ? 'contained' : 'outlined'}
                                        onClick={() => setShowVideoUpload(null)}
                                        size="small"
                                      >
                                        URL
                                      </Button>
                                      <Button
                                        variant={showVideoUpload === lesson._id ? 'contained' : 'outlined'}
                                        onClick={() => setShowVideoUpload(showVideoUpload === lesson._id ? null : lesson._id)}
                                        size="small"
                                      >
                                        Upload Video
                                      </Button>
                                      <Button
                                        variant={showSubtitleManager === lesson._id ? 'contained' : 'outlined'}
                                        onClick={() => setShowSubtitleManager(showSubtitleManager === lesson._id ? null : lesson._id)}
                                        size="small"
                                      >
                                        Manage Subtitles
                                      </Button>
                                      <Button
                                        variant={showVideoAnalytics === lesson._id ? 'contained' : 'outlined'}
                                        onClick={() => setShowVideoAnalytics(showVideoAnalytics === lesson._id ? null : lesson._id)}
                                        size="small"
                                        startIcon={<AnalyticsIcon />}
                                        color="secondary"
                                      >
                                        Analytics
                                      </Button>
                                    </Stack>
                                    {showVideoUpload === lesson._id ? (
                                      <VideoUpload
                                        lessonId={lesson._id}
                                        onUploadComplete={async (data) => {
                                          // If duration is provided from video upload, update lesson automatically
                                          if (data?.duration) {
                                            try {
                                              await updateLesson(section._id, lesson._id, { duration: data.duration });
                                              toast.success(`Đã tự động cập nhật thời lượng: ${data.duration} phút`);
                                            } catch (error) {
                                              console.error('Error updating lesson duration:', error);
                                            }
                                          }
                                          setShowVideoUpload(null);
                                          await loadCourseStructure();
                                        }}
                                        onCancel={() => setShowVideoUpload(null)}
                                      />
                                    ) : (
                                      <TextField
                                        fullWidth
                                        size="small"
                                        label="URL Video"
                                        value={lesson.videoUrl || ''}
                                        onChange={(e) => updateLesson(section._id, lesson._id, { videoUrl: e.target.value })}
                                        variant="outlined"
                                      />
                                    )}
                                    {showSubtitleManager === lesson._id && (
                                      <Box sx={{ mt: 2 }}>
                                        <SubtitleManager lessonId={lesson._id} />
                                      </Box>
                                    )}
                                    {showVideoAnalytics === lesson._id && (
                                      <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper' }}>
                                        <VideoAnalytics
                                          lessonId={lesson._id}
                                          isTeacher={true}
                                        />
                                      </Box>
                                    )}
                                  </Box>
                                )}

                                {lesson.type === 'file' && (
                                  <Box>
                                    <FileUpload
                                      lessonId={lesson._id}
                                      maxFiles={10}
                                      maxSizePerFile={50 * 1024 * 1024} // 50MB
                                      folder={`lms/lessons/${lesson._id}/files`}
                                      multiple={true}
                                      onUploadComplete={async (_files: FileUploadResult[]) => {
                                        try {
                                          // Files are already uploaded to lesson via API
                                          toast.success('Files uploaded successfully');
                                          // Reload course structure to get updated lesson info
                                          await loadCourseStructure();
                                        } catch (error: any) {
                                          toast.error(error.message || 'Failed to update lesson with files');
                                        }
                                      }}
                                    />
                                    {lesson.fileUrl && (
                                      <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                          Current file: <a href={lesson.fileUrl} target="_blank" rel="noopener noreferrer">{lesson.fileUrl}</a>
                                        </Typography>
                                      </Box>
                                    )}
                                    {lesson.attachments && lesson.attachments.length > 0 && (
                                      <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                          Attachments ({lesson.attachments.length}):
                                        </Typography>
                                        <Stack spacing={1}>
                                          {lesson.attachments.map((att, idx) => (
                                            <Chip
                                              key={idx}
                                              label={att.name}
                                              onClick={() => window.open(att.url, '_blank')}
                                              onDelete={() => {
                                                // Remove attachment
                                                const newAttachments = lesson.attachments?.filter((_, i) => i !== idx) || [];
                                                updateLesson(section._id, lesson._id, { attachments: newAttachments });
                                              }}
                                            />
                                          ))}
                                        </Stack>
                                      </Box>
                                    )}
                                  </Box>
                                )}

                                {lesson.type === 'link' && (
                                  <Box>
                                    <TextField
                                      fullWidth
                                      size="small"
                                      label="URL Link"
                                      value={lesson.linkUrl || ''}
                                      onChange={(e) => updateLesson(section._id, lesson._id, { linkUrl: e.target.value })}
                                      variant="outlined"
                                      sx={{ mb: 2 }}
                                    />
                                    <TextField
                                      fullWidth
                                      size="small"
                                      label="Mô tả (tùy chọn)"
                                      value={lesson.content || ''}
                                      onChange={(e) => updateLesson(section._id, lesson._id, { content: e.target.value })}
                                      placeholder="Mô tả về link này..."
                                      multiline
                                      rows={3}
                                      variant="outlined"
                                      sx={{ mb: 2 }}
                                    />
                                    {lesson.linkUrl && (
                                      <LinkPreview
                                        url={lesson.linkUrl}
                                        showActions={false}
                                      />
                                    )}
                                  </Box>
                                )}

                                {lesson.type === 'quiz' && (
                                  <Box>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                        Câu hỏi trắc nghiệm
                                      </Typography>
                                      <Stack direction="row" spacing={1}>
                                        <Button
                                          size="small"
                                          variant="outlined"
                                          startIcon={<DownloadIcon />}
                                          onClick={() => {
                                            downloadQuizTemplate();
                                            toast.success('Đã tải file mẫu Excel');
                                          }}
                                          sx={{ fontSize: '0.75rem' }}
                                        >
                                          Tải mẫu
                                        </Button>
                                        <Button
                                          size="small"
                                          variant="outlined"
                                          startIcon={<UploadIcon />}
                                          onClick={() => setShowImportQuiz(true)}
                                          sx={{ fontSize: '0.75rem' }}
                                        >
                                          Import
                                        </Button>
                                        <Button
                                          size="small"
                                          variant="outlined"
                                          startIcon={<LibraryBooksIcon />}
                                          onClick={() => setShowQuestionBank(showQuestionBank === lesson._id ? null : lesson._id)}
                                          sx={{ fontSize: '0.75rem' }}
                                        >
                                          Ngân hàng
                                        </Button>
                                      </Stack>
                                    </Stack>

                                    {/* Quiz Settings */}
                                    <Accordion sx={{ mb: 2 }}>
                                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                          Cài đặt Quiz
                                        </Typography>
                                      </AccordionSummary>
                                      <AccordionDetails>
                                        <Grid container spacing={2}>
                                          {/* Timer Settings */}
                                          <Grid item xs={12}>
                                            <Typography variant="subtitle2" sx={{ mb: 1 }}>⏱️ Thời gian</Typography>
                                            <Grid container spacing={2}>
                                              <Grid item xs={12} md={6}>
                                                <TextField
                                                  fullWidth
                                                  size="small"
                                                  type="number"
                                                  label="Thời gian tổng (giây)"
                                                  value={lesson.quizSettings?.timeLimit || ''}
                                                  onChange={(e) => updateLesson(section._id, lesson._id, {
                                                    quizSettings: {
                                                      ...lesson.quizSettings,
                                                      timeLimit: e.target.value ? Number(e.target.value) : undefined
                                                    }
                                                  })}
                                                  helperText="0 = không giới hạn"
                                                />
                                              </Grid>
                                              <Grid item xs={12} md={6}>
                                                <TextField
                                                  fullWidth
                                                  size="small"
                                                  type="number"
                                                  label="Thời gian mỗi câu (giây)"
                                                  value={lesson.quizSettings?.timeLimitPerQuestion || ''}
                                                  onChange={(e) => updateLesson(section._id, lesson._id, {
                                                    quizSettings: {
                                                      ...lesson.quizSettings,
                                                      timeLimitPerQuestion: e.target.value ? Number(e.target.value) : undefined
                                                    }
                                                  })}
                                                />
                                              </Grid>
                                              <Grid item xs={12}>
                                                <FormControlLabel
                                                  control={
                                                    <Checkbox
                                                      checked={lesson.quizSettings?.allowPause || false}
                                                      onChange={(e) => updateLesson(section._id, lesson._id, {
                                                        quizSettings: {
                                                          ...lesson.quizSettings,
                                                          allowPause: e.target.checked
                                                        }
                                                      })}
                                                    />
                                                  }
                                                  label="Cho phép tạm dừng"
                                                />
                                              </Grid>
                                            </Grid>
                                          </Grid>

                                          <Divider sx={{ my: 2 }} />

                                          {/* Attempts Settings */}
                                          <Grid item xs={12}>
                                            <Typography variant="subtitle2" sx={{ mb: 1 }}>🔄 Số lần làm bài</Typography>
                                            <Grid container spacing={2}>
                                              <Grid item xs={12} md={6}>
                                                <TextField
                                                  fullWidth
                                                  size="small"
                                                  type="number"
                                                  label="Số lần làm tối đa"
                                                  value={lesson.quizSettings?.maxAttempts || ''}
                                                  onChange={(e) => updateLesson(section._id, lesson._id, {
                                                    quizSettings: {
                                                      ...lesson.quizSettings,
                                                      maxAttempts: e.target.value ? Number(e.target.value) : undefined
                                                    }
                                                  })}
                                                  helperText="Để trống = không giới hạn"
                                                />
                                              </Grid>
                                              <Grid item xs={12} md={6}>
                                                <FormControl fullWidth size="small">
                                                  <InputLabel>Cách tính điểm</InputLabel>
                                                  <Select
                                                    value={lesson.quizSettings?.scoreCalculation || 'best'}
                                                    onChange={(e) => updateLesson(section._id, lesson._id, {
                                                      quizSettings: {
                                                        ...lesson.quizSettings,
                                                        scoreCalculation: e.target.value as 'best' | 'average' | 'last'
                                                      }
                                                    })}
                                                  >
                                                    <MenuItem value="best">Điểm cao nhất</MenuItem>
                                                    <MenuItem value="average">Điểm trung bình</MenuItem>
                                                    <MenuItem value="last">Điểm lần cuối</MenuItem>
                                                  </Select>
                                                </FormControl>
                                              </Grid>
                                              <Grid item xs={12} md={6}>
                                                <TextField
                                                  fullWidth
                                                  size="small"
                                                  type="number"
                                                  label="Thời gian chờ giữa các lần (giây)"
                                                  value={lesson.quizSettings?.cooldownPeriod || 0}
                                                  onChange={(e) => updateLesson(section._id, lesson._id, {
                                                    quizSettings: {
                                                      ...lesson.quizSettings,
                                                      cooldownPeriod: Number(e.target.value)
                                                    }
                                                  })}
                                                />
                                              </Grid>
                                            </Grid>
                                          </Grid>

                                          <Divider sx={{ my: 2 }} />

                                          {/* Scoring Settings */}
                                          <Grid item xs={12}>
                                            <Typography variant="subtitle2" sx={{ mb: 1 }}>📊 Chấm điểm</Typography>
                                            <Grid container spacing={2}>
                                              <Grid item xs={12} md={6}>
                                                <TextField
                                                  fullWidth
                                                  size="small"
                                                  type="number"
                                                  label="Điểm đạt (%)"
                                                  value={lesson.quizSettings?.passingScore || 60}
                                                  onChange={(e) => updateLesson(section._id, lesson._id, {
                                                    quizSettings: {
                                                      ...lesson.quizSettings,
                                                      passingScore: Number(e.target.value)
                                                    }
                                                  })}
                                                  InputProps={{ inputProps: { min: 0, max: 100 } }}
                                                />
                                              </Grid>
                                              <Grid item xs={12}>
                                                <FormControlLabel
                                                  control={
                                                    <Checkbox
                                                      checked={lesson.quizSettings?.negativeMarking || false}
                                                      onChange={(e) => updateLesson(section._id, lesson._id, {
                                                        quizSettings: {
                                                          ...lesson.quizSettings,
                                                          negativeMarking: e.target.checked
                                                        }
                                                      })}
                                                    />
                                                  }
                                                  label="Trừ điểm khi sai"
                                                />
                                              </Grid>
                                              <Grid item xs={12}>
                                                <FormControlLabel
                                                  control={
                                                    <Checkbox
                                                      checked={lesson.quizSettings?.partialCredit || false}
                                                      onChange={(e) => updateLesson(section._id, lesson._id, {
                                                        quizSettings: {
                                                          ...lesson.quizSettings,
                                                          partialCredit: e.target.checked
                                                        }
                                                      })}
                                                    />
                                                  }
                                                  label="Cho điểm từng phần (multiple-select)"
                                                />
                                              </Grid>
                                            </Grid>
                                          </Grid>

                                          <Divider sx={{ my: 2 }} />

                                          {/* Randomization */}
                                          <Grid item xs={12}>
                                            <Typography variant="subtitle2" sx={{ mb: 1 }}>🔀 Xáo trộn</Typography>
                                            <Stack spacing={1}>
                                              <FormControlLabel
                                                control={
                                                  <Checkbox
                                                    checked={lesson.quizSettings?.randomizeQuestions || false}
                                                    onChange={(e) => updateLesson(section._id, lesson._id, {
                                                      quizSettings: {
                                                        ...lesson.quizSettings,
                                                        randomizeQuestions: e.target.checked
                                                      }
                                                    })}
                                                  />
                                                }
                                                label="Xáo trộn thứ tự câu hỏi"
                                              />
                                              <FormControlLabel
                                                control={
                                                  <Checkbox
                                                    checked={lesson.quizSettings?.randomizeAnswers || false}
                                                    onChange={(e) => updateLesson(section._id, lesson._id, {
                                                      quizSettings: {
                                                        ...lesson.quizSettings,
                                                        randomizeAnswers: e.target.checked
                                                      }
                                                    })}
                                                  />
                                                }
                                                label="Xáo trộn thứ tự đáp án"
                                              />
                                            </Stack>
                                          </Grid>

                                          <Divider sx={{ my: 2 }} />

                                          {/* Feedback Settings */}
                                          <Grid item xs={12}>
                                            <Typography variant="subtitle2" sx={{ mb: 1 }}>💬 Phản hồi</Typography>
                                            <Stack spacing={1}>
                                              <FormControlLabel
                                                control={
                                                  <Checkbox
                                                    checked={lesson.quizSettings?.immediateFeedback || false}
                                                    onChange={(e) => updateLesson(section._id, lesson._id, {
                                                      quizSettings: {
                                                        ...lesson.quizSettings,
                                                        immediateFeedback: e.target.checked
                                                      }
                                                    })}
                                                  />
                                                }
                                                label="Phản hồi ngay sau mỗi câu"
                                              />
                                              <FormControlLabel
                                                control={
                                                  <Checkbox
                                                    checked={lesson.quizSettings?.showCorrectAnswers !== false}
                                                    onChange={(e) => updateLesson(section._id, lesson._id, {
                                                      quizSettings: {
                                                        ...lesson.quizSettings,
                                                        showCorrectAnswers: e.target.checked
                                                      }
                                                    })}
                                                  />
                                                }
                                                label="Hiển thị đáp án đúng"
                                              />
                                              <FormControlLabel
                                                control={
                                                  <Checkbox
                                                    checked={lesson.quizSettings?.showExplanation !== false}
                                                    onChange={(e) => updateLesson(section._id, lesson._id, {
                                                      quizSettings: {
                                                        ...lesson.quizSettings,
                                                        showExplanation: e.target.checked
                                                      }
                                                    })}
                                                  />
                                                }
                                                label="Hiển thị giải thích"
                                              />
                                              <FormControlLabel
                                                control={
                                                  <Checkbox
                                                    checked={lesson.quizSettings?.showScoreBreakdown || false}
                                                    onChange={(e) => updateLesson(section._id, lesson._id, {
                                                      quizSettings: {
                                                        ...lesson.quizSettings,
                                                        showScoreBreakdown: e.target.checked
                                                      }
                                                    })}
                                                  />
                                                }
                                                label="Hiển thị chi tiết điểm"
                                              />
                                            </Stack>
                                          </Grid>
                                        </Grid>
                                      </AccordionDetails>
                                    </Accordion>
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
                                  <Box sx={{ mb: 2 }}>
                                    <AssignmentEditor
                                      initialData={{
                                        title: lesson.title,
                                        description: lesson.content || '',
                                        instructions: lesson.assignmentDetails?.instructions || '',
                                        type: 'file',
                                        dueDate: lesson.assignmentDetails?.dueDate ? new Date(lesson.assignmentDetails.dueDate) : null,
                                        maxScore: lesson.assignmentDetails?.maxScore || 100,
                                        attempts: 1,
                                        allowLateSubmission: lesson.assignmentDetails?.allowLateSubmission || false,
                                      }}
                                      onChange={(data) => {
                                        updateLesson(section._id, lesson._id, {
                                          title: data.title,
                                          content: data.description,
                                          assignmentDetails: {
                                            instructions: data.instructions,
                                            dueDate: data.dueDate || undefined,
                                            maxScore: data.maxScore,
                                            allowLateSubmission: data.allowLateSubmission,
                                          },
                                        });
                                      }}
                                      lessonId={lesson._id}
                                    />
                                  </Box>
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
                              <Box sx={{ width: '100%', pr: 20 }}>
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={1}
                                  sx={{ mb: 0.5 }}
                                >
                                  {getLessonTypeIcon(lesson.type)}
                                  <Typography
                                    variant="subtitle1"
                                    sx={{
                                      fontWeight: 600,
                                      flexGrow: 1,
                                      minWidth: 0,
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap'
                                    }}
                                  >
                                    {lesson.title}
                                  </Typography>
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
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Box sx={{ display: 'flex', gap: 0.5, mr: 1 }}>
                              <Chip
                                label={lesson.type === 'video' && lesson.duration ? `${lesson.duration} phút` : ''}
                                size="small"
                                color="info"
                                variant="outlined"
                                icon={<ScheduleIcon />}
                                sx={{ height: '24px', fontSize: '0.75rem' }}
                              />
                              <Chip
                                label={lesson.isPublished ? 'Đã xuất bản' : 'Bản nháp'}
                                size="small"
                                color={lesson.isPublished ? 'success' : 'default'}
                                icon={lesson.isPublished ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                                sx={{ height: '24px', fontSize: '0.75rem' }}
                              />
                            </Box>
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
                              {lesson.type === 'video' && (
                                <IconButton
                                  size="small"
                                  onClick={() => setShowVideoAnalytics(showVideoAnalytics === lesson._id ? null : lesson._id)}
                                  color={showVideoAnalytics === lesson._id ? 'secondary' : 'default'}
                                  title="Xem Analytics"
                                >
                                  <AnalyticsIcon />
                                </IconButton>
                              )}
                              {lesson.type === 'quiz' && (
                                <IconButton
                                  size="small"
                                  onClick={() => setShowVideoAnalytics(showVideoAnalytics === lesson._id ? null : lesson._id)}
                                  color={showVideoAnalytics === lesson._id ? 'secondary' : 'default'}
                                  title="Xem Quiz Analytics"
                                >
                                  <AnalyticsIcon />
                                </IconButton>
                              )}
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
                          </Stack>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {/* Video Analytics - hiển thị bên dưới lesson item */}
                      {lesson.type === 'video' && showVideoAnalytics === lesson._id && (
                        <Box sx={{
                          ml: 4,
                          mr: 2,
                          mb: 2,
                          mt: -1,
                          p: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 2,
                          bgcolor: 'background.paper',
                          boxShadow: 1
                        }}>
                          <VideoAnalytics
                            lessonId={lesson._id}
                            isTeacher={true}
                          />
                        </Box>
                      )}
                      {/* Quiz Analytics - hiển thị bên dưới lesson item */}
                      {lesson.type === 'quiz' && showVideoAnalytics === lesson._id && (
                        <Box sx={{
                          ml: 4,
                          mr: 2,
                          mb: 2,
                          mt: -1,
                          p: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 2,
                          bgcolor: 'background.paper',
                          boxShadow: 1
                        }}>
                          <QuizAnalytics
                            lessonId={lesson._id}
                            isTeacher={true}
                          />
                        </Box>
                      )}
                    </React.Fragment>
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
