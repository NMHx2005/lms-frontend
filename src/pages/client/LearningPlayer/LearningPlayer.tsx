import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/Layout/client/Header';
import Footer from '@/components/Layout/client/Footer';
import LearningSidebar from '@/components/Client/LearningPlayer/LearningSidebar/LearningSidebar';
import VideoPlayer from '@/components/VideoPlayer/VideoPlayer';
import VideoNotes from '@/components/VideoNotes/VideoNotes';
import QuizPlayer from '@/components/Quiz/QuizPlayer';
import FileViewer from '@/components/File/FileViewer';
import TextLessonViewer from '@/components/TextLesson/TextLessonViewer';
import LinkLessonViewer from '@/components/Link/LinkLessonViewer';
import AssignmentSubmission from '@/components/Assignment/AssignmentSubmission';
import CourseQA from '@/components/Client/LearningPlayer/CourseQA/CourseQA';
import { clientAuthService } from '@/services/client/auth.service';
import { clientCoursesService } from '@/services/client/courses.service';
import { courseContentService, CourseContent, SectionWithLessons, LessonContent } from '@/services/client/course-content.service';
import { enrollmentService } from '@/services/client/enrollment.service';
import { progressService } from '@/services/client/progress.service';
import { videoService, VideoSubtitle, VideoNote } from '@/services/client/video.service';
import { clientAssignmentsService } from '@/services/client/assignments.service';
import toast from 'react-hot-toast';
import './LearningPlayer.css';

// Default course thumbnail
const DEFAULT_THUMBNAIL = '/images/Content.png';
const DEFAULT_AVATAR = '/images/default-avatar.png';

// Component for handling image errors
const ImageWithFallback = ({ src, alt, className, fallbackSrc = DEFAULT_THUMBNAIL, ...props }: any) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};

// Use interfaces from course-content.service
type Lesson = LessonContent & { id: string }; // Add id for compatibility
type Section = SectionWithLessons & { id: string }; // Add id for compatibility

interface Course {
  id: string;
  title: string;
  instructor: string;
  image: string;
  description: string;
  shortDescription?: string;
  domain: string;
  level: string;
  price: number;
  enrolledStudents: string[];
  totalStudents?: number;
  totalLessons?: number;
  totalDuration?: number;
  estimatedDuration?: number;
  averageRating?: number;
  totalRatings?: number;
  learningObjectives?: string[];
  prerequisites?: string[];
  benefits?: string[];
  certificate?: boolean;
  instructorId: {
    _id: string;
    firstName?: string;
    lastName?: string;
    name: string;
    avatar: string;
    bio?: string;
  };
}

const LearningPlayer: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [course, setCourse] = useState<Course | null>(null);
  const [courseContent, setCourseContent] = useState<CourseContent | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [currentLessonId, setCurrentLessonId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  // Timer states for auto-complete lesson
  const [_timeSpentInLesson, setTimeSpentInLesson] = useState(0);
  const [lessonTimer, setLessonTimer] = useState<number | null>(null);
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);

  // Video features states
  const [subtitles, setSubtitles] = useState<VideoSubtitle[]>([]);
  const [notes, setNotes] = useState<VideoNote[]>([]);
  const [_videoProgress, setVideoProgress] = useState(0);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [videoFileUrl, setVideoFileUrl] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null); // Duration from Cloudinary API

  // Assignment states
  const [assignmentData, setAssignmentData] = useState<any>(null);
  const [assignmentSubmission, setAssignmentSubmission] = useState<any>(null);
  const [loadingAssignment, setLoadingAssignment] = useState(false);

  // Preview mode state (for non-enrolled users)
  const searchParams = new URLSearchParams(location.search);
  const isPreviewMode = searchParams.get('preview') === 'true';

  // Tab state
  const [activeTab, setActiveTab] = useState<'overview' | 'qa' | 'notes'>('overview');

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);

        if (!courseId) {
          setError('Khóa học không tồn tại');
          return;
        }

        // Fetch course details, enrollment data, and course content in parallel
        const [courseResponse, enrolledCoursesResponse, courseContentResponse] = await Promise.allSettled([
          clientCoursesService.getCourseById(courseId),
          clientAuthService.getEnrolledCourses({ limit: 100 }),
          courseContentService.getCourseContent(courseId, false, isPreviewMode)
        ]);

        let courseData: Course | null = null;
        let enrollmentData: any = null;
        let contentData: CourseContent | null = null;

        // Get course data
        if (courseResponse.status === 'fulfilled' && courseResponse.value.success) {
          const courseInfo = courseResponse.value.data;
          courseData = {
            id: courseInfo._id,
            title: courseInfo.title,
            instructor: courseInfo.instructorId?.lastName || 'N/A',
            image: courseInfo.thumbnail,
            description: courseInfo.description,
            domain: courseInfo.domain,
            level: courseInfo.level,
            totalStudents: courseInfo.totalStudents,
            averageRating: courseInfo.averageRating,
            totalRatings: courseInfo.totalRatings,
            price: courseInfo.price,
            enrolledStudents: courseInfo.enrolledStudents || [],
            instructorId: courseInfo.instructorId,
            certificate: courseInfo.certificate || courseInfo.assessment?.hasCertification || false
          };
        }

        // Get enrollment data
        if (enrolledCoursesResponse.status === 'fulfilled' && enrolledCoursesResponse.value.success) {
          const enrollments = enrolledCoursesResponse.value.data.enrollments || enrolledCoursesResponse.value.data;
          enrollmentData = enrollments.find((e: any) => e.courseId._id === courseId || e.courseId === courseId);

          console.log('📚 Enrollment data loaded:', {
            enrollmentId: enrollmentData?._id,
            progress: enrollmentData?.progress,
            isCompleted: enrollmentData?.isCompleted,
            courseId: courseId,
            enrollmentCourseId: enrollmentData?.courseId?._id || enrollmentData?.courseId
          });
        }

        // Get course content
        if (courseContentResponse.status === 'fulfilled' && courseContentResponse.value.success) {
          contentData = courseContentResponse.value.data || null;
        }

        if (!courseData) {
          setError('Không thể tải thông tin khóa học');
          return;
        }

        if (!enrollmentData) {
          // If preview mode, allow access to preview lessons without enrollment
          if (isPreviewMode) {
            console.log('👁️ Preview mode: Allowing access to preview lessons');
            // Continue without enrollment - will filter to only preview lessons
          } else {
            setError('Bạn chưa đăng ký khóa học này');
            return;
          }
        }

        if (!contentData) {
          setError('Không thể tải nội dung khóa học');
          return;
        }

        setCourse(courseData);
        setCourseContent(contentData);
        setSections(contentData.sections.map(section => ({
          ...section,
          id: section._id,
          lessons: section.lessons.map(lesson => ({
            ...lesson,
            id: lesson._id,
            // In preview mode, mark non-preview lessons as locked
            isLocked: isPreviewMode && !enrollmentData && !(lesson as any).isFree && !(lesson as any).isPreview
          }))
        })));
        setEnrollment(enrollmentData);
        setProgress(enrollmentData?.progress || 0);

        // Set first lesson as current, or use lessonId from location.state if provided
        const stateLessonId = (location.state as any)?.lessonId;
        if (stateLessonId) {
          // Check if lessonId exists in sections
          const lessonExists = contentData.sections.some(section =>
            section.lessons.some(lesson => lesson._id === stateLessonId)
          );
          if (lessonExists) {
            setCurrentLessonId(stateLessonId);
          } else {
            // Fallback to first lesson if state lessonId doesn't exist
            if (contentData.sections.length > 0 && contentData.sections[0].lessons.length > 0) {
              setCurrentLessonId(contentData.sections[0].lessons[0]._id);
            }
          }
        } else if (contentData.sections.length > 0 && contentData.sections[0].lessons.length > 0) {
          setCurrentLessonId(contentData.sections[0].lessons[0]._id);
        }

        // Auto-check and generate certificate if course is completed but certificate not issued
        if (enrollmentData?.isCompleted && enrollmentData?.progress === 100 && courseData?.certificate && !enrollmentData?.certificateIssued) {
          try {
            // Call getCertificates API to trigger auto-generation
            await clientAuthService.getCertificates();

            // Refresh enrollment data to get updated certificate status
            const refreshedEnrollmentsResponse = await clientAuthService.getEnrolledCourses({ limit: 100 });
            if (refreshedEnrollmentsResponse.success) {
              const refreshedEnrollments = refreshedEnrollmentsResponse.data.enrollments || refreshedEnrollmentsResponse.data;
              const refreshedEnrollment = refreshedEnrollments.find((e: any) => e.courseId._id === courseId || e.courseId === courseId);
              if (refreshedEnrollment) {
                setEnrollment(refreshedEnrollment);
                console.log('✅ Enrollment data refreshed with certificate status:', refreshedEnrollment.certificateIssued);
              }
            }
          } catch (certError) {
            console.error('Error checking/generating certificate:', certError);
            // Don't show error to user, just log it
          }
        }

      } catch (err) {
        console.error('Error fetching course data:', err);
        setError('Không thể tải thông tin khóa học');
        toast.error('Lỗi khi tải dữ liệu khóa học');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  // Function to recalculate progress based on completed lessons (disabled in preview mode)
  const recalculateProgress = async () => {
    // Don't calculate progress in preview mode
    if (isPreviewMode) {
      return;
    }
    const allLessons = sections.flatMap(s => s.lessons);
    const completedLessons = allLessons.filter(l => l.isCompleted);
    const newProgress = allLessons.length > 0
      ? Math.round((completedLessons.length / allLessons.length) * 100)
      : 0;

    setProgress(newProgress);

    // Detailed debug logging
    console.log('📊 Progress Calculation Details:');
    console.log('Sections:', sections.length);
    sections.forEach((section, idx) => {
      const sectionCompleted = section.lessons.filter(l => l.isCompleted).length;
      console.log(`  Section ${idx + 1} (${section.title}):`, {
        total: section.lessons.length,
        completed: sectionCompleted,
        lessons: section.lessons.map(l => ({
          title: l.title,
          isCompleted: l.isCompleted
        }))
      });
    });
    console.log('Total Summary:', {
      completedLessons: completedLessons.length,
      totalLessons: allLessons.length,
      percentage: newProgress,
      completedLessonIds: completedLessons.map(l => l._id)
    });

    // Update progress in database if we have enrollment
    if (enrollment && enrollment._id) {
      try {
        console.log('💾 Attempting to save progress to database:', {
          enrollmentId: enrollment._id,
          newProgress: newProgress,
          enrollmentObject: enrollment
        });

        const updateResult = await enrollmentService.updateProgress(enrollment._id, {
          progress: newProgress
        });

        console.log('💾 Update progress API response:', updateResult);

        if (updateResult.success) {
          console.log('✅ Progress saved to database successfully:', newProgress);

          // Check if course is completed (100%)
          if (newProgress === 100 && !enrollment.isCompleted) {
            toast.success('🎉 Chúc mừng! Bạn đã hoàn thành khóa học!', { duration: 5000 });

            // Update local enrollment state
            setEnrollment({ ...enrollment, isCompleted: true, progress: newProgress });
          } else {
            // Update local enrollment progress
            setEnrollment({ ...enrollment, progress: newProgress });
          }
        } else {
          console.error('❌ Failed to save progress to database:', updateResult.error);
          toast.error(`Không thể lưu tiến độ: ${updateResult.error}`);
        }
      } catch (error) {
        console.error('❌ Exception when updating progress:', error);
        toast.error('Lỗi khi cập nhật tiến độ học tập');
      }
    } else {
      console.warn('⚠️ Cannot update progress: No enrollment data', {
        hasEnrollment: !!enrollment,
        enrollmentId: enrollment?._id
      });
    }
  };

  // Load assignment data when assignment lesson is selected
  useEffect(() => {
    const currentLesson = getCurrentLesson();
    if (currentLesson && currentLesson.type === 'assignment' && currentLessonId) {
      const loadAssignmentData = async () => {
        try {
          setLoadingAssignment(true);
          // Try to get assignment by lesson ID
          // Note: In the current structure, assignment might be stored in lesson.assignmentDetails
          // or we might need to fetch it separately
          if (currentLesson.assignmentDetails) {
            setAssignmentData({
              _id: currentLessonId,
              title: currentLesson.title,
              description: currentLesson.content || '',
              instructions: currentLesson.assignmentDetails.instructions || '',
              type: 'file' as const, // Default to file, can be enhanced
              dueDate: currentLesson.assignmentDetails.dueDate,
              maxScore: currentLesson.assignmentDetails.maxScore || 100,
              attempts: 1,
              allowLateSubmission: (currentLesson.assignmentDetails as any)?.allowLateSubmission || false,
              latePenalty: 0,
            });
          }

          // Try to get existing submission
          try {
            const submissionsResponse = await clientAssignmentsService.getSubmissions(currentLessonId);
            if (submissionsResponse.success && submissionsResponse.data && submissionsResponse.data.length > 0) {
              setAssignmentSubmission(submissionsResponse.data[0]);
            }
          } catch (error) {
            // No submission yet, that's okay
            console.log('No existing submission found');
          }
        } catch (error) {
          console.error('Error loading assignment data:', error);
        } finally {
          setLoadingAssignment(false);
        }
      };
      loadAssignmentData();
    } else {
      setAssignmentData(null);
      setAssignmentSubmission(null);
    }
  }, [currentLessonId, sections]);

  // Load subtitles, notes, and video file when lesson changes
  useEffect(() => {
    if (!currentLessonId) {
      setSubtitles([]);
      setNotes([]);
      setVideoFileUrl(null);
      setVideoDuration(null);
      return;
    }

    const currentLesson = getCurrentLesson();

    const loadVideoData = async () => {
      try {
        // Load video file URL (if uploaded via VideoUpload)
        // Only try to load if lesson type is video AND it's not a YouTube/external URL
        if (currentLesson && currentLesson.type === 'video') {
          const videoUrl = currentLesson.videoUrl || currentLesson.content || '';
          const isYouTube = isYouTubeUrl(videoUrl);

          // Don't call API for YouTube videos - they don't have VideoFile records
          // Also don't call API if videoUrl is empty (preview mode with no videoUrl)
          if (!isYouTube && videoUrl) {
            try {
              const videoFileResponse = await videoService.getVideoFile(currentLessonId);
              if (videoFileResponse.success && videoFileResponse.data) {
                // VideoFile has fileUrl field (Cloudinary secureUrl)
                const url = videoFileResponse.data.fileUrl ||
                  videoFileResponse.data.url ||
                  videoFileResponse.data.secureUrl;
                if (url) {
                  setVideoFileUrl(url);
                  console.log('✅ Video file URL loaded from VideoFile:', url);

                  // Get duration from Cloudinary API response (in seconds)
                  if (videoFileResponse.data.duration) {
                    const durationInSeconds = videoFileResponse.data.duration;
                    setVideoDuration(durationInSeconds);
                    console.log('✅ Video duration loaded from Cloudinary:', durationInSeconds, 'seconds');
                  } else {
                    setVideoDuration(null);
                  }
                } else {
                  setVideoFileUrl(null);
                  setVideoDuration(null);
                }
              } else {
                setVideoFileUrl(null);
                setVideoDuration(null);
              }
            } catch (error: any) {
              // Video file not found (404), use lesson.videoUrl instead
              // This is normal if video was uploaded via URL instead of VideoUpload
              if (error.response?.status === 404) {
                console.log('ℹ️ No VideoFile record found (404), will use lesson.videoUrl if available');
                // If lesson.videoUrl exists (Cloudinary URL), use it directly
                if (videoUrl && !isYouTube) {
                  console.log('✅ Using lesson.videoUrl directly:', videoUrl);
                  setVideoFileUrl(videoUrl);
                } else {
                  setVideoFileUrl(null);
                }
              } else {
                console.error('❌ Error loading VideoFile:', error);
                // On other errors, still try to use lesson.videoUrl if available
                if (videoUrl && !isYouTube) {
                  console.log('✅ Using lesson.videoUrl as fallback:', videoUrl);
                  setVideoFileUrl(videoUrl);
                } else {
                  setVideoFileUrl(null);
                }
              }
              setVideoDuration(null);
            }
          } else {
            // YouTube video - don't try to load VideoFile, use videoUrl directly
            // Duration will come from lesson.duration or estimatedTime (in minutes, convert to seconds)
            console.log('ℹ️ YouTube video detected, skipping VideoFile API call');
            setVideoFileUrl(null);
            setVideoDuration(null); // Will use duration from lesson props
          }
        } else {
          setVideoFileUrl(null);
        }

        // Load subtitles (disabled in preview mode)
        if (!isPreviewMode) {
          const subtitlesResponse = await videoService.getSubtitles(currentLessonId);
          if (subtitlesResponse.success) {
            setSubtitles(subtitlesResponse.data || []);
          }
        } else {
          setSubtitles([]);
        }

        // Load notes (disabled in preview mode)
        if (!isPreviewMode) {
          const notesResponse = await videoService.getNotes(currentLessonId);
          if (notesResponse.success) {
            setNotes(notesResponse.data || []);
          }
        } else {
          setNotes([]);
        }
      } catch (error) {
        console.error('Failed to load video data:', error);
      }
    };

    loadVideoData();
  }, [currentLessonId]); // Only reload when lesson ID changes, not when sections change

  // Timer effect to track time spent in lesson and auto-complete
  useEffect(() => {
    const currentLesson = getCurrentLesson();

    // Only start timer if we have a lesson and it's not completed yet (disabled in preview mode)
    if (!isPreviewMode && currentLessonId && currentLesson && !isLessonCompleted) {
      const requiredDuration = (currentLesson.duration || currentLesson.estimatedTime || 0) * 60; // Convert minutes to seconds

      console.log('⏱️ Starting timer for lesson:', {
        lessonId: currentLessonId,
        title: currentLesson.title,
        requiredDuration: requiredDuration,
        requiredMinutes: currentLesson.duration || currentLesson.estimatedTime
      });

      // Start interval to increment time
      const timer = setInterval(() => {
        setTimeSpentInLesson((prev: number) => {
          const newTime = prev + 1;

          // Check if user has spent enough time
          if (newTime >= requiredDuration && !isLessonCompleted) {
            console.log('✅ Lesson duration completed! Auto-marking as complete...');
            setIsLessonCompleted(true);

            // Mark lesson as completed via API
            if (courseId) {
              courseContentService.markLessonCompleted(courseId, currentLessonId)
                .then(() => {
                  console.log('✅ Lesson marked as completed successfully');
                  toast.success(`Hoàn thành bài học: ${currentLesson.title}`);

                  // Update local state
                  setSections(prev => {
                    const updatedSections = prev.map(section => ({
                      ...section,
                      lessons: section.lessons.map(lesson =>
                        ((lesson as any).id === currentLessonId || lesson._id === currentLessonId)
                          ? { ...lesson, isCompleted: true }
                          : lesson
                      )
                    }));

                    // Recalculate progress with updated sections
                    setTimeout(() => recalculateProgress(), 100);

                    return updatedSections;
                  });
                })
                .catch(error => {
                  console.error('❌ Error marking lesson as completed:', error);
                  toast.error('Không thể đánh dấu bài học hoàn thành');
                });
            }

            // Clear the timer
            clearInterval(timer);
            setLessonTimer(null);
          }

          return newTime;
        });
      }, 1000); // Update every second

      setLessonTimer(timer);

      // Cleanup timer on unmount or when lesson changes
      return () => {
        clearInterval(timer);
        setLessonTimer(null);
      };
    }
  }, [currentLessonId, isLessonCompleted, courseId, isPreviewMode]);

  const handleLessonSelect = async (lessonId: string) => {
    // Clear previous timer when switching lessons
    if (lessonTimer) {
      clearInterval(lessonTimer);
      setLessonTimer(null);
    }

    // Find the lesson to check if it's already completed
    let lessonAlreadyCompleted = false;
    for (const section of sections) {
      const lesson = section.lessons.find(l => (l as any).id === lessonId || l._id === lessonId);
      if (lesson && lesson.isCompleted) {
        lessonAlreadyCompleted = true;
        break;
      }
    }

    // Reset timer and set completion status based on lesson data
    setTimeSpentInLesson(0);
    setIsLessonCompleted(lessonAlreadyCompleted);
    setCurrentLessonId(lessonId);

    console.log('🔍 Selected lesson:', lessonId, 'Already completed:', lessonAlreadyCompleted);
  };

  const handleSectionToggle = (sectionId: string) => {
    setSections(prev => prev.map(section =>
      section.id === sectionId
        ? { ...section, isExpanded: !section.isExpanded }
        : section
    ));
  };

  const handleDownloadCertificate = async () => {
    if (!enrollment || !enrollment._id) {
      toast.error('Không tìm thấy thông tin đăng ký');
      return;
    }

    try {
      const loadingToast = toast.loading('Đang tải chứng chỉ...');

      const blob = await progressService.downloadCertificate(enrollment._id);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate-${course?.title.replace(/\s+/g, '-') || 'course'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.dismiss(loadingToast);
      toast.success('Đã tải chứng chỉ thành công!');
    } catch (error: any) {
      toast.dismiss();
      toast.error(error?.response?.data?.error || 'Không thể tải chứng chỉ');
      console.error('Error downloading certificate:', error);
    }
  };


  const getCurrentLesson = (): Lesson | null => {
    for (const section of sections) {
      const lesson = section.lessons.find(l => (l as any).id === currentLessonId || l._id === currentLessonId);
      if (lesson) return lesson as Lesson;
    }
    return null;
  };

  // Function to convert YouTube URL to embed URL
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return '';

    // Handle different YouTube URL formats
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);

    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }

    return url;
  };

  // Function to check if URL is YouTube
  const isYouTubeUrl = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  if (loading) {
    return (
      <div className="learning-player-page">
        <Header />
        <div className="learning-player__loading">
          <div className="learning-player__spinner"></div>
          <p>Đang tải khóa học...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="learning-player-page">
        <Header />
        <div className="learning-player__error">
          <h2>Không thể tải trang học tập</h2>
          <p>{error || 'Khóa học không tồn tại'}</p>
          <button onClick={() => navigate('/courses')} className="learning-player__back-btn">
            Quay lại danh sách khóa học
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const currentLesson = getCurrentLesson();

  return (
    <div className="udemy-learning-page">
      <Header />

      {/* Preview Mode Banner */}
      {isPreviewMode && !enrollment && (
        <div className="preview-mode-banner">
          <div className="preview-mode-banner__content">
            <span className="preview-mode-banner__icon">👁️</span>
            <span className="preview-mode-banner__text">
              Bạn đang ở chế độ <strong>Học thử</strong> - Chỉ xem được các bài học miễn phí
            </span>
            <button
              className="preview-mode-banner__btn"
              onClick={() => navigate(`/courses/${courseId}`)}
            >
              Đăng ký để xem toàn bộ →
            </button>
          </div>
        </div>
      )}

      <main className="udemy-learning__main">
        <div className="udemy-learning__container">
          {/* Video Player Section */}
          <div className="udemy-learning__video-section">
            {currentLesson ? (
              <>
                {currentLesson.type === 'video' ? (
                  <div className="udemy-learning__video-container">
                    {(() => {
                      const videoUrl = currentLesson.videoUrl || currentLesson.content || '';
                      const isYouTube = isYouTubeUrl(videoUrl);
                      // Only log once when lesson changes, not on every render
                      if (videoUrl && !isYouTube) {
                        console.log('🎥 Video debug (non-YouTube):', {
                          videoUrl,
                          isYouTube,
                          lessonId: currentLesson._id,
                          lessonTitle: currentLesson.title
                        });
                      }
                      return isYouTube ? (
                        <div className="udemy-learning__video-player">
                          <iframe
                            src={getYouTubeEmbedUrl(currentLesson.videoUrl || currentLesson.content || '')}
                            title={currentLesson.title}
                            className="udemy-learning__video udemy-learning__video--youtube"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              border: 'none',
                              borderRadius: '8px'
                            }}
                          />
                        </div>
                      ) : null;
                    })() || (
                        <>
                          {(() => {
                            const finalVideoUrl = videoFileUrl || currentLesson.videoUrl || currentLesson.content || '';

                            if (!finalVideoUrl) {
                              return (
                                <div className="udemy-learning__video-placeholder">
                                  <div className="udemy-learning__video-placeholder-content">
                                    <div className="udemy-learning__video-placeholder-icon">📹</div>
                                    <h3>Chưa có video</h3>
                                    <p>Video chưa được upload hoặc URL video chưa được cấu hình.</p>
                                    <p style={{ fontSize: '12px', color: '#6a6f73', marginTop: '8px' }}>
                                      Vui lòng upload video trong phần cấu trúc khóa học hoặc thêm URL video.
                                    </p>
                                  </div>
                                </div>
                              );
                            }

                            // Calculate duration: 
                            // 1. If video is from Cloudinary, use videoDuration from API (already in seconds)
                            // 2. If video is external/YouTube, use lesson.duration or estimatedTime (convert minutes to seconds)
                            const finalDuration = videoDuration !== null
                              ? videoDuration
                              : (currentLesson.duration || currentLesson.estimatedTime || 0) * 60;

                            return (
                              <div className="udemy-learning__video-player">
                                <VideoPlayer
                                  lessonId={currentLessonId}
                                  videoUrl={finalVideoUrl}
                                  duration={finalDuration}
                                  key={`video-${currentLessonId}-${finalVideoUrl}`} // Force re-render when videoUrl changes
                                  subtitles={!isPreviewMode ? subtitles : []}
                                  notes={!isPreviewMode ? notes : []}
                                  onTimeUpdate={(currentTime) => {
                                    // Update currentTime for VideoNotes component
                                    setCurrentVideoTime(currentTime);
                                  }}
                                  onProgressUpdate={(progress) => {
                                    setVideoProgress(progress);
                                    // Disable auto-complete in preview mode
                                    if (!isPreviewMode && progress >= 80 && !isLessonCompleted) {
                                      setIsLessonCompleted(true);
                                      // Mark as completed
                                      if (courseId) {
                                        courseContentService.markLessonCompleted(courseId, currentLessonId)
                                          .then(() => {
                                            toast.success(`Hoàn thành bài học: ${currentLesson.title}`);
                                            setSections(prev => {
                                              const updatedSections = prev.map(section => ({
                                                ...section,
                                                lessons: section.lessons.map(lesson =>
                                                  ((lesson as any).id === currentLessonId || lesson._id === currentLessonId)
                                                    ? { ...lesson, isCompleted: true }
                                                    : lesson
                                                )
                                              }));
                                              setTimeout(() => recalculateProgress(), 100);
                                              return updatedSections;
                                            });
                                          })
                                          .catch(error => {
                                            console.error('Error marking lesson as completed:', error);
                                          });
                                      }
                                    }
                                  }}
                                  onComplete={() => {
                                    // Disable completion in preview mode
                                    if (!isPreviewMode) {
                                      setIsLessonCompleted(true);
                                      if (courseId) {
                                        courseContentService.markLessonCompleted(courseId, currentLessonId)
                                          .then(() => {
                                            toast.success(`Hoàn thành bài học: ${currentLesson.title}`);
                                            setSections(prev => {
                                              const updatedSections = prev.map(section => ({
                                                ...section,
                                                lessons: section.lessons.map(lesson =>
                                                  ((lesson as any).id === currentLessonId || lesson._id === currentLessonId)
                                                    ? { ...lesson, isCompleted: true }
                                                    : lesson
                                                )
                                              }));
                                              setTimeout(() => recalculateProgress(), 100);
                                              return updatedSections;
                                            });
                                          })
                                          .catch(error => {
                                            console.error('Error marking lesson as completed:', error);
                                          });
                                      }
                                    }
                                  }}
                                  onNoteClick={(timestamp) => {
                                    setCurrentVideoTime(timestamp);
                                  }}
                                  autoResume={true}
                                />
                              </div>
                            );
                          })()}
                        </>
                      )}
                    {!isPreviewMode && isLessonCompleted && (
                      <div className="udemy-learning__completed-badge">
                        ✅ Đã hoàn thành bài học này
                      </div>
                    )}
                  </div>
                ) : currentLesson.type === 'text' ? (
                  <TextLessonViewer
                    title={currentLesson.title}
                    content={currentLesson.content || ''}
                    estimatedTime={currentLesson.estimatedTime || currentLesson.duration}
                    onComplete={() => {
                      // Disable completion in preview mode
                      if (!isPreviewMode && courseId && currentLessonId) {
                        courseContentService.markLessonCompleted(courseId, currentLessonId)
                          .then(() => {
                            toast.success(`Hoàn thành bài học: ${currentLesson.title}`);
                            setSections(prev => {
                              const updatedSections = prev.map(section => ({
                                ...section,
                                lessons: section.lessons.map(lesson =>
                                  lesson._id === currentLessonId
                                    ? { ...lesson, isCompleted: true }
                                    : lesson
                                )
                              }));
                              return updatedSections;
                            });
                          })
                          .catch((error) => {
                            console.error('Error marking lesson as completed:', error);
                            toast.error('Không thể đánh dấu bài học đã hoàn thành');
                          });
                      }
                    }}
                    onProgressUpdate={(progress) => {
                      // Track reading progress for analytics
                      console.log('Reading progress:', progress);
                    }}
                  />
                ) : currentLesson.type === 'quiz' ? (
                  <QuizPlayer
                    questions={currentLesson.quizQuestions?.map((q: any) => ({
                      question: q.question,
                      type: (q.type || 'multiple-choice') as any,
                      answers: q.answers,
                      correctAnswer: q.correctAnswer,
                      explanation: q.explanation,
                      points: q.points || 10,
                      difficulty: (q.difficulty || 'medium') as any
                    })) || []}
                    lessonId={currentLesson._id}
                    courseId={courseId || ''}
                    settings={{
                      ...(currentLesson as any).quizSettings,
                      showProgress: true,
                      showTimer: true,
                      immediateFeedback: (currentLesson as any).quizSettings?.immediateFeedback || false,
                      showCorrectAnswers: (currentLesson as any).quizSettings?.showCorrectAnswers !== false,
                      showExplanation: (currentLesson as any).quizSettings?.showExplanation !== false
                    }}
                    onComplete={(results) => {
                      console.log('Quiz completed:', results);
                      toast.success(`Hoàn thành! Điểm số: ${results.percentage}%`);
                    }}
                    onExit={() => {
                      // Handle exit
                    }}
                  />
                ) : currentLesson.type === 'file' ? (
                  <div className="udemy-learning__file-viewer">
                    <div className="udemy-learning__file-header">
                      <h2 className="udemy-learning__lesson-title">{currentLesson.title}</h2>
                      <div className="udemy-learning__lesson-meta">
                        <span className="udemy-learning__lesson-type">Tài liệu</span>
                        <span className="udemy-learning__lesson-duration">
                          {currentLesson.duration || currentLesson.estimatedTime || 0} phút
                        </span>
                      </div>
                    </div>
                    <div className="udemy-learning__file-content">
                      {currentLesson.fileUrl ? (
                        <FileViewer
                          fileUrl={currentLesson.fileUrl}
                          fileName={currentLesson.title}
                          fileType={currentLesson.fileType}
                          fileSize={currentLesson.fileSize}
                          showDownload={true}
                          showFullscreen={true}
                        />
                      ) : (
                        <div className="udemy-learning__file-info">
                          <div className="udemy-learning__file-icon">📄</div>
                          <div className="udemy-learning__file-details">
                            <h3>Tài liệu bài học</h3>
                            <p>Chưa có tài liệu cho bài học này.</p>
                          </div>
                        </div>
                      )}
                      {currentLesson.attachments && currentLesson.attachments.length > 0 && (
                        <div style={{ marginTop: '24px', padding: '16px', borderTop: '1px solid #e5e5e5' }}>
                          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>Tài liệu đính kèm</h3>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {currentLesson.attachments.map((att: any, idx: number) => (
                              <FileViewer
                                key={idx}
                                fileUrl={att.url}
                                fileName={att.name}
                                fileType={att.type}
                                fileSize={att.size}
                                showDownload={true}
                                showFullscreen={true}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : currentLesson.type === 'link' ? (
                  <LinkLessonViewer
                    title={currentLesson.title}
                    url={currentLesson.linkUrl || currentLesson.externalLink || currentLesson.content || ''}
                    description={currentLesson.description}
                    lessonId={currentLessonId}
                    onComplete={() => {
                      // Disable completion in preview mode
                      if (!isPreviewMode && courseId && currentLessonId) {
                        courseContentService.markLessonCompleted(courseId, currentLessonId)
                          .then(() => {
                            toast.success(`Hoàn thành bài học: ${currentLesson.title}`);
                            setSections(prev => {
                              const updatedSections = prev.map(section => ({
                                ...section,
                                lessons: section.lessons.map(lesson =>
                                  lesson._id === currentLessonId
                                    ? { ...lesson, isCompleted: true }
                                    : lesson
                                )
                              }));
                              return updatedSections;
                            });
                          })
                          .catch((error) => {
                            console.error('Error marking lesson as completed:', error);
                            toast.error('Không thể đánh dấu bài học đã hoàn thành');
                          });
                      }
                    }}
                  />
                ) : currentLesson.type === 'assignment' ? (
                  loadingAssignment ? (
                    <div className="udemy-learning__placeholder">
                      <div className="udemy-learning__placeholder-content">
                        <div className="udemy-learning__placeholder-icon">⏳</div>
                        <p>Đang tải bài tập...</p>
                      </div>
                    </div>
                  ) : assignmentData ? (
                    <AssignmentSubmission
                      assignment={assignmentData}
                      existingSubmission={assignmentSubmission}
                      onSaveDraft={async (data) => {
                        if (!courseId) return;
                        try {
                          await clientAssignmentsService.saveDraft(currentLessonId, courseId, {
                            fileUrl: data.fileUrl,
                            textAnswer: data.textAnswer,
                            comment: data.comment,
                          });
                        } catch (error: any) {
                          throw new Error(error.message || 'Lỗi khi lưu bản nháp');
                        }
                      }}
                      onSubmit={async (data) => {
                        if (!courseId) return;
                        try {
                          const result = await clientAssignmentsService.submitAssignment(
                            currentLessonId,
                            courseId,
                            {
                              fileUrl: data.fileUrl,
                              textAnswer: data.textAnswer,
                              comment: data.comment,
                              isDraft: false,
                            }
                          );
                          if (result.success) {
                            setAssignmentSubmission(result.data);
                            // Mark lesson as completed (disabled in preview mode)
                            if (!isPreviewMode && courseId) {
                              courseContentService.markLessonCompleted(courseId, currentLessonId)
                                .then(() => {
                                  toast.success('Nộp bài thành công!');
                                  recalculateProgress();
                                });
                            }
                          }
                        } catch (error: any) {
                          throw new Error(error.message || 'Lỗi khi nộp bài');
                        }
                      }}
                      onViewHistory={async () => {
                        try {
                          const submissions = await clientAssignmentsService.getSubmissions(currentLessonId);
                          if (submissions.success && submissions.data) {
                            // Show submission history in a dialog or navigate
                            console.log('Submission history:', submissions.data);
                            toast.success(`Bạn đã nộp ${submissions.data.length} lần`);
                          }
                        } catch (error) {
                          console.error('Error loading submission history:', error);
                        }
                      }}
                    />
                  ) : (
                    <div className="udemy-learning__placeholder">
                      <div className="udemy-learning__placeholder-content">
                        <div className="udemy-learning__placeholder-icon">📝</div>
                        <h3>Không tìm thấy thông tin bài tập</h3>
                        <p>Vui lòng thử lại sau.</p>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="udemy-learning__placeholder">
                    <div className="udemy-learning__placeholder-content">
                      <div className="udemy-learning__placeholder-icon">📚</div>
                      <h3>Loại bài học không được hỗ trợ</h3>
                      <p>Loại bài học "{currentLesson.type}" chưa được hỗ trợ.</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="udemy-learning__placeholder">
                <div className="udemy-learning__placeholder-content">
                  <div className="udemy-learning__placeholder-icon">📚</div>
                  <h3>Chọn bài học để bắt đầu</h3>
                  <p>Vui lòng chọn một bài học từ danh sách bên phải</p>
                </div>
              </div>
            )}

            {/* Course Navigation */}
            <div className="udemy-learning__navigation">
              <div className="udemy-learning__nav-info">
                <h3 className="udemy-learning__course-title">{course.title}</h3>
                <div className="udemy-learning__course-meta">
                  <span className="udemy-learning__course-level">{course.level}</span>
                  <span className="udemy-learning__course-domain">{course.domain}</span>
                </div>
              </div>
            </div>

            {/* Course Tabs */}
            <div className="udemy-learning__tabs">
              <div
                className={`udemy-learning__tab ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Tổng quan
              </div>
              <div
                className={`udemy-learning__tab ${activeTab === 'qa' ? 'active' : ''}`}
                onClick={() => setActiveTab('qa')}
              >
                Q&A
              </div>
              <div
                className={`udemy-learning__tab ${activeTab === 'notes' ? 'active' : ''}`}
                onClick={() => setActiveTab('notes')}
              >
                Ghi chú
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="udemy-learning__details">
                <div className="udemy-learning__details-header">
                  <h2>Về khóa học này</h2>
                  <div className="udemy-learning__rating">
                    <div className="udemy-learning__stars">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span key={i}>{i < Math.floor(course.averageRating || 0) ? '⭐' : '☆'}</span>
                      ))}
                    </div>
                    <span className="udemy-learning__rating-text">
                      {course.averageRating?.toFixed(1) || '0.0'} ({course.totalRatings || 0} đánh giá)
                    </span>
                  </div>
                </div>

                <div className="udemy-learning__stats">
                  <div className="udemy-learning__stat">
                    <span className="udemy-learning__stat-number">{course.totalStudents || 0}</span>
                    <span className="udemy-learning__stat-label">Học viên</span>
                  </div>
                  <div className="udemy-learning__stat">
                    <span className="udemy-learning__stat-number">
                      {course.estimatedDuration ? (course.estimatedDuration / 60).toFixed(1) :
                        courseContent ? (courseContent.totalDuration / 60).toFixed(1) : '0'}
                    </span>
                    <span className="udemy-learning__stat-label">Giờ</span>
                  </div>
                  <div className="udemy-learning__stat">
                    <span className="udemy-learning__stat-number">{courseContent?.totalLessons || course.totalLessons || 0}</span>
                    <span className="udemy-learning__stat-label">Bài học</span>
                  </div>
                  {!isPreviewMode && (
                    <div className="udemy-learning__stat">
                      <span className="udemy-learning__stat-number">{progress}%</span>
                      <span className="udemy-learning__stat-label">Hoàn thành</span>
                    </div>
                  )}
                </div>

                {!isPreviewMode && enrollment && (
                  <div className="udemy-learning__enrollment-info">
                    <p><strong>Đăng ký:</strong> {enrollment.enrolledAt ? new Date(enrollment.enrolledAt).toLocaleDateString('vi-VN') : 'N/A'}</p>
                    <p><strong>Tiến độ:</strong> {progress}% hoàn thành</p>
                    {progress === 100 && enrollment.isCompleted && enrollment.certificateIssued && (
                      <div className="udemy-learning__certificate-section">
                        <div className="udemy-learning__certificate-text">
                          🎉 Chúc mừng! Bạn đã hoàn thành khóa học!
                        </div>
                        <button
                          className="udemy-learning__certificate-btn"
                          onClick={handleDownloadCertificate}
                        >
                          🏆 Tải chứng chỉ
                        </button>
                      </div>
                    )}
                    {progress === 100 && enrollment.isCompleted && !enrollment.certificateIssued && (
                      <div className="udemy-learning__certificate-section">
                        <div className="udemy-learning__certificate-text">
                          🎉 Chúc mừng! Bạn đã hoàn thành khóa học!
                        </div>
                        <div className="udemy-learning__certificate-pending">
                          Chứng chỉ đang được xử lý, vui lòng quay lại sau.
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="udemy-learning__description">
                  <h3>Mô tả khóa học</h3>
                  <p>{course.description || course.shortDescription}</p>
                </div>

                {course.learningObjectives && course.learningObjectives.length > 0 && (
                  <div className="udemy-learning__objectives">
                    <h3>Bạn sẽ học được gì</h3>
                    <ul>
                      {course.learningObjectives.map((objective, index) => (
                        <li key={index}>{objective}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {course.prerequisites && course.prerequisites.length > 0 && (
                  <div className="udemy-learning__prerequisites">
                    <h3>Yêu cầu</h3>
                    <ul>
                      {course.prerequisites.map((prerequisite, index) => (
                        <li key={index}>{prerequisite}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {course.benefits && course.benefits.length > 0 && (
                  <div className="udemy-learning__benefits">
                    <h3>Lợi ích</h3>
                    <ul>
                      {course.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="udemy-learning__instructor">
                  <h3>Giảng viên</h3>
                  <div className="udemy-learning__instructor-card">
                    <ImageWithFallback
                      src={course.instructorId?.avatar}
                      alt={course.instructor || `${course.instructorId?.firstName} ${course.instructorId?.lastName}`}
                      className="udemy-learning__instructor-avatar"
                      fallbackSrc={DEFAULT_AVATAR}
                    />
                    <div className="udemy-learning__instructor-info">
                      <h4>
                        {course.instructor ||
                          (course.instructorId?.firstName && course.instructorId?.lastName
                            ? `${course.instructorId.firstName} ${course.instructorId.lastName}`
                            : course.instructorId?.name || 'Instructor')}
                      </h4>
                      {course.instructorId?.bio && <p>{course.instructorId.bio}</p>}
                      {!course.instructorId?.bio && <p>Chuyên gia {course.domain}</p>}
                      <div className="udemy-learning__instructor-stats">
                        <span>⭐ {course.averageRating?.toFixed(1) || '0.0'} Instructor Rating</span>
                        <span>👥 {course.totalStudents || 0} Students</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'qa' && (
              <div className="udemy-learning__tab-content">
                <CourseQA courseId={courseId || ''} lessonId={currentLessonId || undefined} />
              </div>
            )}

            {!isPreviewMode && activeTab === 'notes' && (
              <div className="udemy-learning__tab-content">
                {currentLesson && currentLesson.type === 'video' && currentLessonId ? (
                  <VideoNotes
                    lessonId={currentLessonId}
                    currentTime={currentVideoTime}
                    onNoteClick={(timestamp) => {
                      setCurrentVideoTime(timestamp);
                    }}
                  />
                ) : (
                  <div className="udemy-learning__placeholder">
                    <div className="udemy-learning__placeholder-content">
                      <div className="udemy-learning__placeholder-icon">📝</div>
                      <h3>Ghi chú chỉ khả dụng cho bài học video</h3>
                      <p>Vui lòng chọn một bài học video để xem và tạo ghi chú.</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="udemy-learning__sidebar">
            <LearningSidebar
              courseId={courseId || ''}
              currentLessonId={currentLessonId}
              onLessonSelect={handleLessonSelect}
              sections={sections as any}
              onSectionToggle={handleSectionToggle}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LearningPlayer;
