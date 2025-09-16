import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Layout/client/Header';
import Footer from '@/components/Layout/client/Footer';
import LearningSidebar from '@/components/Client/LearningPlayer/LearningSidebar/LearningSidebar';
import { clientAuthService } from '@/services/client/auth.service';
import { clientCoursesService } from '@/services/client/courses.service';
import './LearningPlayer.css';

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'file' | 'link';
  content: string;
  duration: string;
  isCompleted: boolean;
  isLocked: boolean;
}

interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
  isExpanded: boolean;
}

interface Course {
  id: string;
  title: string;
  instructor: string;
  image: string;
  description: string;
  domain: string;
  level: string;
  price: number;
  enrolledStudents: string[];
  instructorId: {
    _id: string;
    name: string;
    avatar: string;
  };
}

const LearningPlayer: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [currentLessonId, setCurrentLessonId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);

        if (!courseId) {
          setError('Khóa học không tồn tại');
          return;
        }

        // Fetch course details and enrollment data
        const [courseResponse, enrolledCoursesResponse] = await Promise.allSettled([
          clientCoursesService.getCourseById(courseId),
          clientAuthService.getEnrolledCourses({ limit: 100 })
        ]);

        let courseData: Course | null = null;
        let enrollmentData: any = null;

        // Get course data
        if (courseResponse.status === 'fulfilled' && courseResponse.value.success) {
          const courseInfo = courseResponse.value.data;
          courseData = {
            id: courseInfo._id,
            title: courseInfo.title,
            instructor: courseInfo.instructorId?.name || 'N/A',
            image: courseInfo.thumbnail,
            description: courseInfo.description,
            domain: courseInfo.domain,
            level: courseInfo.level,
            price: courseInfo.price,
            enrolledStudents: courseInfo.enrolledStudents || [],
            instructorId: courseInfo.instructorId
          };
        }

        // Get enrollment data
        if (enrolledCoursesResponse.status === 'fulfilled' && enrolledCoursesResponse.value.success) {
          const enrollments = enrolledCoursesResponse.value.data.enrollments || enrolledCoursesResponse.value.data;
          enrollmentData = enrollments.find((e: any) => e.courseId._id === courseId);
        }

        if (!courseData) {
          setError('Không thể tải thông tin khóa học');
          return;
        }

        if (!enrollmentData) {
          setError('Bạn chưa đăng ký khóa học này');
          return;
        }

        setCourse(courseData);
        setEnrollment(enrollmentData);
        setProgress(enrollmentData.progress || 0);

        // Tạm thời sử dụng dữ liệu mock cho sections và lessons
        // TODO: Thay thế bằng API thật khi có
        const mockSections: Section[] = [
          {
            id: '1',
            title: 'Phần 1: Giới thiệu và cài đặt môi trường',
            isExpanded: true,
            lessons: [
              {
                id: '1-1',
                title: 'Chào mừng đến với khóa học',
                type: 'video',
                content: 'https://example.com/video1.mp4',
                duration: '5 phút',
                isCompleted: true,
                isLocked: false
              },
              {
                id: '1-2',
                title: 'Cài đặt môi trường phát triển',
                type: 'text',
                content: `
                  <h2>Cài đặt môi trường phát triển</h2>
                  <p>Trong bài học này, chúng ta sẽ học cách cài đặt các công cụ cần thiết để bắt đầu lập trình web:</p>
                  <h3>1. Cài đặt Node.js</h3>
                  <ul>
                    <li>Truy cập <a href="https://nodejs.org" target="_blank">nodejs.org</a></li>
                    <li>Tải phiên bản LTS mới nhất</li>
                    <li>Chạy installer và làm theo hướng dẫn</li>
                  </ul>
                  <h3>2. Cài đặt Code Editor</h3>
                  <ul>
                    <li>Visual Studio Code (khuyến nghị)</li>
                    <li>Sublime Text</li>
                    <li>WebStorm</li>
                  </ul>
                  <h3>3. Cài đặt Git</h3>
                  <ul>
                    <li>Tải từ <a href="https://git-scm.com" target="_blank">git-scm.com</a></li>
                    <li>Cấu hình user name và email</li>
                  </ul>
                `,
                duration: '15 phút',
                isCompleted: false,
                isLocked: false
              },
              {
                id: '1-3',
                title: 'Tài liệu tham khảo',
                type: 'file',
                content: 'environment-setup.pdf',
                duration: '10 phút',
                isCompleted: false,
                isLocked: false
              }
            ]
          },
          {
            id: '2',
            title: 'Phần 2: HTML cơ bản',
            isExpanded: false,
            lessons: [
              {
                id: '2-1',
                title: 'Cấu trúc HTML cơ bản',
                type: 'video',
                content: 'https://example.com/video2.mp4',
                duration: '20 phút',
                isCompleted: false,
                isLocked: false
              },
              {
                id: '2-2',
                title: 'Các thẻ HTML phổ biến',
                type: 'text',
                content: `
                  <h2>Các thẻ HTML phổ biến</h2>
                  <p>HTML cung cấp nhiều thẻ để tạo cấu trúc và nội dung cho trang web:</p>
                  <h3>Thẻ tiêu đề</h3>
                  <ul>
                    <li>&lt;h1&gt; đến &lt;h6&gt;: Tạo các cấp độ tiêu đề khác nhau</li>
                    <li>&lt;h1&gt; là tiêu đề chính, &lt;h6&gt; là tiêu đề nhỏ nhất</li>
                  </ul>
                  <h3>Thẻ đoạn văn</h3>
                  <ul>
                    <li>&lt;p&gt;: Tạo đoạn văn bản</li>
                    <li>&lt;br&gt;: Xuống dòng</li>
                  </ul>
                  <h3>Thẻ danh sách</h3>
                  <ul>
                    <li>&lt;ul&gt;: Danh sách không có thứ tự</li>
                    <li>&lt;ol&gt;: Danh sách có thứ tự</li>
                    <li>&lt;li&gt;: Phần tử trong danh sách</li>
                  </ul>
                `,
                duration: '25 phút',
                isCompleted: false,
                isLocked: false
              },
              {
                id: '2-3',
                title: 'Tài liệu HTML',
                type: 'link',
                content: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
                duration: '30 phút',
                isCompleted: false,
                isLocked: false
              }
            ]
          },
          {
            id: '3',
            title: 'Phần 3: CSS cơ bản',
            isExpanded: false,
            lessons: [
              {
                id: '3-1',
                title: 'Giới thiệu CSS',
                type: 'video',
                content: 'https://example.com/video3.mp4',
                duration: '18 phút',
                isCompleted: false,
                isLocked: true
              },
              {
                id: '3-2',
                title: 'Selectors và Properties',
                type: 'text',
                content: 'Nội dung về CSS selectors và properties...',
                duration: '22 phút',
                isCompleted: false,
                isLocked: true
              }
            ]
          }
        ];

        setSections(mockSections);

        // Set first lesson as current
        if (mockSections.length > 0 && mockSections[0].lessons.length > 0) {
          setCurrentLessonId(mockSections[0].lessons[0].id);
        }

      } catch (err) {
        setError('Không thể tải thông tin khóa học');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const handleLessonSelect = (lessonId: string) => {
    setCurrentLessonId(lessonId);
  };

  const handleSectionToggle = (sectionId: string) => {
    setSections(prev => prev.map(section =>
      section.id === sectionId
        ? { ...section, isExpanded: !section.isExpanded }
        : section
    ));
  };


  const getCurrentLesson = (): Lesson | null => {
    for (const section of sections) {
      const lesson = section.lessons.find(l => l.id === currentLessonId);
      if (lesson) return lesson;
    }
    return null;
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
    <div className="learning-player-page">
      <Header />

      <main className="learning-player__main">
        <div className="learning-player__container">
          <div className="learning-player__header">
            <div className="learning-player__course-info">
              <img src={course.image} alt={course.title} className="learning-player__course-image" />
              <div className="learning-player__course-details">
                <div className="learning-player__course-header">
                  <h1 className="learning-player__course-title">{course.title}</h1>
                  <div className="learning-player__course-badges">
                    <span className="learning-player__course-level">{course.level}</span>
                    <span className="learning-player__course-domain">{course.domain}</span>
                  </div>
                </div>
                <p className="learning-player__course-instructor">
                  <img src={course.instructorId?.avatar} alt={course.instructor} className="learning-player__instructor-avatar" />
                  Giảng viên: {course.instructor}
                </p>
                <div className="learning-player__course-stats">
                  <div className="learning-player__stat">
                    <span className="learning-player__stat-icon">👥</span>
                    <span className="learning-player__stat-text">{course.enrolledStudents?.length || 0} học viên</span>
                  </div>
                  <div className="learning-player__stat">
                    <span className="learning-player__stat-icon">📊</span>
                    <span className="learning-player__stat-text">Tiến độ: {progress}%</span>
                  </div>
                  <div className="learning-player__stat">
                    <span className="learning-player__stat-icon">📅</span>
                    <span className="learning-player__stat-text">Đăng ký: {enrollment?.enrolledAt ? new Date(enrollment.enrolledAt).toLocaleDateString('vi-VN') : 'N/A'}</span>
                  </div>
                </div>

                {/* Thông báo về dữ liệu mock */}
                <div className="learning-player__mock-notice">
                  <div className="learning-player__notice-icon">ℹ️</div>
                  <div className="learning-player__notice-content">
                    <strong>Lưu ý:</strong> Nội dung khóa học hiện đang sử dụng dữ liệu mẫu. Nội dung thật sẽ được cập nhật sớm!
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="learning-player__content">
            {/* Video Player Section */}
            <div className="learning-player__video-section">
              {currentLesson ? (
                <div className="learning-player__video-container">
                  {currentLesson.type === 'video' ? (
                    <div className="learning-player__video-player">
                      <video
                        controls
                        className="learning-player__video"
                        poster={course.image}
                      >
                        <source src={currentLesson.content} type="video/mp4" />
                        Trình duyệt của bạn không hỗ trợ video.
                      </video>
                    </div>
                  ) : (
                    <div className="learning-player__video-placeholder">
                      <div className="learning-player__placeholder-content">
                        <div className="learning-player__play-icon">▶️</div>
                        <h3>{currentLesson.title}</h3>
                        <p>{currentLesson.type === 'text' ? 'Nội dung văn bản' : 'Tài liệu học tập'}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="learning-player__video-placeholder">
                  <div className="learning-player__placeholder-content">
                    <div className="learning-player__play-icon">📚</div>
                    <h3>Chọn bài học để bắt đầu</h3>
                    <p>Vui lòng chọn một bài học từ danh sách bên phải</p>
                  </div>
                </div>
              )}
            </div>

            {/* Main Content Area */}
            <div className="learning-player__main-content">
              {/* Course Tabs */}
              <div className="learning-player__tabs">
                <div className="learning-player__tab active">Tổng quan</div>
                <div className="learning-player__tab">Hỏi đáp</div>
                <div className="learning-player__tab">Ghi chú</div>
                <div className="learning-player__tab">Thông báo</div>
                <div className="learning-player__tab">Đánh giá</div>
                <div className="learning-player__tab">Công cụ học tập</div>
              </div>

              {/* Course Details */}
              <div className="learning-player__course-details">
                <h2 className="learning-player__course-title-main">{course.title}</h2>

                <div className="learning-player__course-rating">
                  <div className="learning-player__stars">⭐⭐⭐⭐⭐</div>
                  <span className="learning-player__rating-text">4.9 (154 đánh giá)</span>
                </div>

                <div className="learning-player__course-meta">
                  <div className="learning-player__meta-item">
                    <span className="learning-player__meta-icon">👥</span>
                    <span className="learning-player__meta-text">{course.enrolledStudents?.length || 0} Học viên</span>
                  </div>
                  <div className="learning-player__meta-item">
                    <span className="learning-player__meta-icon">⏱️</span>
                    <span className="learning-player__meta-text">14,5 giờ Tổng thời gian</span>
                  </div>
                  <div className="learning-player__meta-item">
                    <span className="learning-player__meta-icon">📅</span>
                    <span className="learning-player__meta-text">Cập nhật tháng 9/2025</span>
                  </div>
                  <div className="learning-player__meta-item">
                    <span className="learning-player__meta-icon">🌐</span>
                    <span className="learning-player__meta-text">Tiếng Việt</span>
                  </div>
                </div>

                {/* Course Description */}
                <div className="learning-player__description">
                  <h3>Mô tả khóa học</h3>
                  <p>{course.description}</p>
                </div>

                {/* Learning Objectives */}
                <div className="learning-player__objectives">
                  <h3>Bạn sẽ học được gì</h3>
                  <ul>
                    <li>Nắm vững kiến thức cơ bản về {course.domain}</li>
                    <li>Thực hành các dự án thực tế</li>
                    <li>Phát triển kỹ năng lập trình chuyên nghiệp</li>
                    <li>Chuẩn bị cho các cơ hội nghề nghiệp</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="learning-player__sidebar">
              <LearningSidebar
                courseId={courseId || ''}
                currentLessonId={currentLessonId}
                onLessonSelect={handleLessonSelect}
                sections={sections}
                onSectionToggle={handleSectionToggle}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LearningPlayer;
