import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Layout/client/Header';
import Footer from '@/components/Layout/client/Footer';
import LearningSidebar from '@/components/Client/LearningPlayer/LearningSidebar/LearningSidebar';
import { clientAuthService } from '@/services/client/auth.service';
import { clientCoursesService } from '@/services/client/courses.service';
import { courseContentService, CourseContent, SectionWithLessons, LessonContent } from '@/services/client/course-content.service';
import { enrollmentService } from '@/services/client/enrollment.service';
import { progressService } from '@/services/client/progress.service';
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

  const [course, setCourse] = useState<Course | null>(null);
  const [courseContent, setCourseContent] = useState<CourseContent | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [currentLessonId, setCurrentLessonId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  // Timer states for auto-complete lesson
  const [timeSpentInLesson, setTimeSpentInLesson] = useState(0);
  const [lessonTimer, setLessonTimer] = useState<number | null>(null);
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);

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
          courseContentService.getCourseContent(courseId)
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
          setError('Bạn chưa đăng ký khóa học này');
          return;
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
          lessons: section.lessons.map(lesson => ({ ...lesson, id: lesson._id }))
        })));
        setEnrollment(enrollmentData);
        setProgress(enrollmentData.progress || 0);

        // Set first lesson as current
        if (contentData.sections.length > 0 && contentData.sections[0].lessons.length > 0) {
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

  // Function to recalculate progress based on completed lessons
  const recalculateProgress = async () => {
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

  // Timer effect to track time spent in lesson and auto-complete
  useEffect(() => {
    const currentLesson = getCurrentLesson();

    // Only start timer if we have a lesson and it's not completed yet
    if (currentLessonId && currentLesson && !isLessonCompleted) {
      const requiredDuration = (currentLesson.duration || currentLesson.estimatedTime || 0) * 60; // Convert minutes to seconds

      console.log('⏱️ Starting timer for lesson:', {
        lessonId: currentLessonId,
        title: currentLesson.title,
        requiredDuration: requiredDuration,
        requiredMinutes: currentLesson.duration || currentLesson.estimatedTime
      });

      // Start interval to increment time
      const timer = setInterval(() => {
        setTimeSpentInLesson(prev => {
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
  }, [currentLessonId, isLessonCompleted, courseId]);

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

      <main className="udemy-learning__main">
        <div className="udemy-learning__container">
          {/* Video Player Section */}
          <div className="udemy-learning__video-section">
            {currentLesson ? (
              <>
                {currentLesson.type === 'video' ? (
                  <div className="udemy-learning__video-container">
                    <div className="udemy-learning__video-player">
                      {isYouTubeUrl(currentLesson.videoUrl || currentLesson.content || '') ? (
                        <iframe
                          src={getYouTubeEmbedUrl(currentLesson.videoUrl || currentLesson.content || '')}
                          title={currentLesson.title}
                          className="udemy-learning__video udemy-learning__video--youtube"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          controls
                          className="udemy-learning__video"
                          poster={course.image || DEFAULT_THUMBNAIL}
                        >
                          <source src={currentLesson.videoUrl || currentLesson.content || ''} type="video/mp4" />
                          Trình duyệt của bạn không hỗ trợ video.
                        </video>
                      )}
                    </div>
                    {/* Timer Progress Bar */}
                    {!isLessonCompleted && (
                      <div className="udemy-learning__timer-progress">
                        <div className="udemy-learning__timer-bar">
                          <div
                            className="udemy-learning__timer-fill"
                            style={{
                              width: `${Math.min(100, (timeSpentInLesson / ((currentLesson.duration || currentLesson.estimatedTime || 0) * 60)) * 100)}%`
                            }}
                          />
                        </div>
                        <div className="udemy-learning__timer-text">
                          <span>Đã xem: {Math.floor(timeSpentInLesson / 60)}:{(timeSpentInLesson % 60).toString().padStart(2, '0')}</span>
                          <span>Yêu cầu: {currentLesson.duration || currentLesson.estimatedTime || 0} phút</span>
                        </div>
                      </div>
                    )}
                    {isLessonCompleted && (
                      <div className="udemy-learning__completed-badge">
                        ✅ Đã hoàn thành bài học này
                      </div>
                    )}
                  </div>
                ) : currentLesson.type === 'text' ? (
                  <div className="udemy-learning__content-viewer">
                    <div className="udemy-learning__content-header">
                      <h2 className="udemy-learning__lesson-title">{currentLesson.title}</h2>
                      <div className="udemy-learning__lesson-meta">
                        <span className="udemy-learning__lesson-type">Text Lesson</span>
                        <span className="udemy-learning__lesson-duration">
                          {currentLesson.duration || currentLesson.estimatedTime || 0} phút
                        </span>
                      </div>
                    </div>
                    <div className="udemy-learning__content-body">
                      <div dangerouslySetInnerHTML={{ __html: currentLesson.content || '' }} />
                    </div>
                  </div>
                ) : currentLesson.type === 'quiz' ? (
                  <div className="udemy-learning__quiz-viewer">
                    <div className="udemy-learning__quiz-header">
                      <h2 className="udemy-learning__lesson-title">{currentLesson.title}</h2>
                      <div className="udemy-learning__lesson-meta">
                        <span className="udemy-learning__lesson-type">Quiz</span>
                        <span className="udemy-learning__lesson-duration">
                          {currentLesson.duration || currentLesson.estimatedTime || 0} phút
                        </span>
                        <span className="udemy-learning__quiz-count">
                          {currentLesson.quizQuestions?.length || 0} câu hỏi
                        </span>
                      </div>
                    </div>
                    <div className="udemy-learning__quiz-content">
                      {currentLesson.quizQuestions && currentLesson.quizQuestions.length > 0 ? (
                        <div className="udemy-learning__quiz-questions">
                          {currentLesson.quizQuestions.map((question, index) => (
                            <div key={question.id || index} className="udemy-learning__question">
                              <div className="udemy-learning__question-header">
                                <h3 className="udemy-learning__question-title">
                                  Câu {index + 1}: {question.question}
                                </h3>
                              </div>
                              <div className="udemy-learning__question-answers">
                                {question.answers.map((answer, answerIndex) => (
                                  <div key={answerIndex} className="udemy-learning__answer-option">
                                    <input
                                      type="radio"
                                      id={`question-${index}-answer-${answerIndex}`}
                                      name={`question-${index}`}
                                      value={answerIndex}
                                      disabled
                                    />
                                    <label htmlFor={`question-${index}-answer-${answerIndex}`}>
                                      <span className="udemy-learning__answer-letter">
                                        {String.fromCharCode(65 + answerIndex)}
                                      </span>
                                      <span className="udemy-learning__answer-text">{answer}</span>
                                      {answerIndex === question.correctAnswer && (
                                        <span className="udemy-learning__correct-badge">Đúng</span>
                                      )}
                                    </label>
                                  </div>
                                ))}
                              </div>
                              {question.explanation && (
                                <div className="udemy-learning__explanation">
                                  <h4>Giải thích:</h4>
                                  <p>{question.explanation}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="udemy-learning__no-questions">
                          <p>Không có câu hỏi nào trong quiz này.</p>
                        </div>
                      )}
                    </div>
                  </div>
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
                      <div className="udemy-learning__file-info">
                        <div className="udemy-learning__file-icon">📄</div>
                        <div className="udemy-learning__file-details">
                          <h3>Tài liệu bài học</h3>
                          <p>Tải xuống tài liệu để xem nội dung chi tiết của bài học này.</p>
                          <div className="udemy-learning__file-actions">
                            <button
                              className="udemy-learning__download-btn"
                              onClick={() => {
                                const url = currentLesson.fileUrl || currentLesson.content;
                                if (url) window.open(url, '_blank');
                              }}
                            >
                              📥 Tải xuống
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : currentLesson.type === 'link' ? (
                  <div className="udemy-learning__link-viewer">
                    <div className="udemy-learning__link-header">
                      <h2 className="udemy-learning__lesson-title">{currentLesson.title}</h2>
                      <div className="udemy-learning__lesson-meta">
                        <span className="udemy-learning__lesson-type">Liên kết</span>
                        <span className="udemy-learning__lesson-duration">
                          {currentLesson.duration || currentLesson.estimatedTime || 0} phút
                        </span>
                      </div>
                    </div>
                    <div className="udemy-learning__link-content">
                      <div className="udemy-learning__link-info">
                        <div className="udemy-learning__link-icon">🔗</div>
                        <div className="udemy-learning__link-details">
                          <h3>Tài nguyên bên ngoài</h3>
                          <p>Mở liên kết để xem nội dung bổ sung cho bài học này.</p>
                          <div className="udemy-learning__link-actions">
                            <button
                              className="udemy-learning__external-btn"
                              onClick={() => {
                                const url = currentLesson.linkUrl || currentLesson.externalLink || currentLesson.content;
                                if (url) window.open(url, '_blank');
                              }}
                            >
                              🌐 Mở liên kết
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : currentLesson.type === 'assignment' ? (
                  <div className="udemy-learning__assignment-viewer">
                    <div className="udemy-learning__assignment-header">
                      <h2 className="udemy-learning__lesson-title">{currentLesson.title}</h2>
                      <div className="udemy-learning__lesson-meta">
                        <span className="udemy-learning__lesson-type">Bài tập</span>
                        <span className="udemy-learning__lesson-duration">
                          {currentLesson.duration || currentLesson.estimatedTime || 0} phút
                        </span>
                      </div>
                    </div>
                    <div className="udemy-learning__assignment-content">
                      <div className="udemy-learning__assignment-info">
                        <div className="udemy-learning__assignment-icon">📝</div>
                        <div className="udemy-learning__assignment-details">
                          <h3>Bài tập</h3>
                          <p>{currentLesson.content || 'Hoàn thành bài tập theo yêu cầu.'}</p>
                          {currentLesson.assignmentDetails && (
                            <div className="udemy-learning__assignment-requirements">
                              <h4>Yêu cầu:</h4>
                              <p>{currentLesson.assignmentDetails.instructions}</p>
                              {currentLesson.assignmentDetails.dueDate && (
                                <p><strong>Hạn nộp:</strong> {new Date(currentLesson.assignmentDetails.dueDate).toLocaleDateString('vi-VN')}</p>
                              )}
                              {currentLesson.assignmentDetails.maxScore && (
                                <p><strong>Điểm tối đa:</strong> {currentLesson.assignmentDetails.maxScore}</p>
                              )}
                            </div>
                          )}
                          <div className="udemy-learning__assignment-actions">
                            <button className="udemy-learning__submit-btn">
                              📤 Nộp bài
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
              <div className="udemy-learning__tab active">Tổng quan</div>
              <div className="udemy-learning__tab">Q&A</div>
              <div className="udemy-learning__tab">Ghi chú</div>
              <div className="udemy-learning__tab">Thông báo</div>
            </div>

            {/* Course Details */}
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
                <div className="udemy-learning__stat">
                  <span className="udemy-learning__stat-number">{progress}%</span>
                  <span className="udemy-learning__stat-label">Hoàn thành</span>
                </div>
              </div>

              {enrollment && (
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
