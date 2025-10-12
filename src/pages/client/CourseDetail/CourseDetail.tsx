import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from "@/components/Layout/client/Header";
import Footer from "@/components/Layout/client/Footer";
import TopBar from '@/components/Client/Home/TopBar/TopBar';
import { clientCoursesService } from '@/services/client/courses.service';
import { enrollmentService } from '@/services/client/enrollment.service';
import { courseContentService } from '@/services/client/course-content.service';
import toast from 'react-hot-toast';
import "./CourseDetail.css";
import { ChatBot } from '@/components/ChatBot';

interface CourseData {
  _id: string;
  title: string;
  description: string;
  shortDescription?: string;
  thumbnail: string;
  domain: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  difficulty: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  instructorId: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    avatar?: string;
    bio?: string;
  };
  totalStudents: number;
  totalLessons: number;
  totalDuration: number;
  averageRating: number;
  totalRatings: number;
  prerequisites: string[];
  benefits: string[];
  learningObjectives: string[];
  estimatedDuration?: number;
  language: string;
  tags: string[];
  certificate: boolean;
  isPublished: boolean;
  isApproved: boolean;
  isFeatured: boolean;
  publishedAt?: string;
  updatedAt: string;
  createdAt: string;
  targetAudience: string[];
  assessment: {
    hasCertification: boolean;
    hasQuizzes: boolean;
    hasAssignments: boolean;
    hasFinalExam: boolean;
  };
  contentDelivery: {
    deliveryMethod: string;
  };
  support: {
    hasInstructorSupport: boolean;
    hasCommunitySupport: boolean;
  };
}

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseData | null>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [showFloatingBar, setShowFloatingBar] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCourse();
    }
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingBar(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchCourse = async () => {
    try {
      setLoading(true);

      // Fetch course info
      const courseResponse = await clientCoursesService.getCourseById(id!);
      if (!courseResponse.success || !courseResponse.data) {
        toast.error('Không thể tải thông tin khóa học');
        navigate('/courses');
        return;
      }
      setCourse(courseResponse.data);

      // Fetch course sections (public info only)
      try {
        const sectionsResponse = await courseContentService.getCourseContent(id!);
        if (sectionsResponse.success && sectionsResponse.data?.sections) {
          setSections(sectionsResponse.data.sections);
          setIsEnrolled(true); // If we can get sections, user is enrolled
        }
      } catch (sectionError) {
        console.log('Could not load sections (user not enrolled):', sectionError);
        setIsEnrolled(false);
        // This is expected for non-enrolled users
      }

    } catch (error: any) {
      console.error('Error fetching course:', error);
      toast.error(error?.message || 'Lỗi khi tải khóa học');
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      const response = await enrollmentService.enrollInCourse(course!._id);
      if (response.success) {
        toast.success('Đăng ký khóa học thành công!');
        setIsEnrolled(true);
        // Reload sections after successful enrollment
        try {
          const sectionsResponse = await courseContentService.getCourseContent(course!._id);
          if (sectionsResponse.success && sectionsResponse.data?.sections) {
            setSections(sectionsResponse.data.sections);
          }
        } catch (sectionError) {
          console.log('Could not reload sections after enrollment:', sectionError);
        }

        if (course!.price === 0) {
          navigate(`/learning/${course!._id}`);
        } else {
          navigate(`/payment/${course!._id}`);
        }
      }
    } catch (error: any) {
      console.error('Error enrolling:', error);
      if (error?.response?.data?.error === 'Already enrolled in this course') {
        toast.error('Bạn đã đăng ký khóa học này rồi!');
        setIsEnrolled(true);
        // Try to load sections if already enrolled
        try {
          const sectionsResponse = await courseContentService.getCourseContent(course!._id);
          if (sectionsResponse.success && sectionsResponse.data?.sections) {
            setSections(sectionsResponse.data.sections);
          }
        } catch (sectionError) {
          console.log('Could not load sections for enrolled user:', sectionError);
        }
      } else {
        toast.error(error?.message || 'Lỗi khi đăng ký khóa học');
      }
    } finally {
      setEnrolling(false);
    }
  };

  const handleGoToLearning = () => {
    navigate(`/learning/${course!._id}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const calculateDiscountPrice = () => {
    if (course?.originalPrice && course?.discountPercentage) {
      return course.originalPrice * (1 - course.discountPercentage / 100);
    }
    return course?.price || 0;
  };

  const instructorName = course?.instructorId?.firstName && course?.instructorId?.lastName
    ? `${course.instructorId.firstName} ${course.instructorId.lastName}`
    : course?.instructorId?.email || 'Chưa có thông tin';

  if (loading) {
    return (
      <>
        <TopBar />
        <Header />
        <div className="udemy-loading">
          <div className="udemy-spinner"></div>
          <p>Đang tải khóa học...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!course) {
    return (
      <>
        <TopBar />
        <Header />
        <div className="udemy-error">
          <h2>Không tìm thấy khóa học</h2>
          <p>Khóa học bạn đang tìm kiếm không tồn tại</p>
          <button onClick={() => navigate('/courses')} className="udemy-btn-primary">
            Quay về trang khóa học
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <TopBar />
      <Header />

      {/* Floating Purchase Bar */}
      {showFloatingBar && (
        <div className="udemy-floating-bar">
          <div className="udemy-floating-bar__container">
            <div className="udemy-floating-bar__left">
              <img src={course.thumbnail} alt={course.title} />
              <div className="udemy-floating-bar__info">
                <h3>{course.title}</h3>
                <div className="udemy-floating-bar__price">
                  {course.price === 0 ? (
                    <span className="price-free">Miễn phí</span>
                  ) : (
                    <>
                      <span className="price-current">{formatPrice(calculateDiscountPrice())}</span>
                      {course.originalPrice && (
                        <span className="price-original">{formatPrice(course.originalPrice)}</span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            <button
              className={`udemy-floating-bar__btn ${isEnrolled ? 'udemy-floating-bar__btn--enrolled' : ''}`}
              onClick={isEnrolled ? handleGoToLearning : handleEnroll}
              disabled={enrolling}
            >
              {enrolling ? 'Đang xử lý...' : isEnrolled ? 'Vào học ngay' : 'Đăng ký ngay'}
            </button>
          </div>
        </div>
      )}

      <main className="udemy-course-detail">
        {/* Hero Section */}
        <section className="udemy-hero">
          <div className="udemy-hero__container">
            <div className="udemy-hero__content">
              {/* Breadcrumb */}
              <nav className="udemy-breadcrumb">
                <a href="/courses">Khóa học</a>
                <span>›</span>
                <a href={`/courses?category=${course.category}`}>{course.category}</a>
                <span>›</span>
                <span>{course.domain}</span>
              </nav>

              {/* Badge */}
              {course.isFeatured && (
                <div className="udemy-badge-bestseller">
                  <span>🏆 Khóa học nổi bật</span>
                </div>
              )}

              {/* Title */}
              <h1 className="udemy-hero__title">{course.title}</h1>

              {/* Subtitle */}
              <p className="udemy-hero__subtitle">
                {course.shortDescription || course.description.substring(0, 150)}
              </p>

              {/* Meta Info */}
              <div className="udemy-hero__meta">
                <div className="udemy-hero__rating">
                  <span className="rating-number">{course.averageRating.toFixed(1)}</span>
                  <div className="rating-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={star <= Math.round(course.averageRating) ? 'star-filled' : 'star-empty'}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="rating-count">({course.totalRatings} xếp hạng)</span>
                </div>
                <span className="udemy-hero__students">{course.totalStudents.toLocaleString()} học viên</span>
              </div>

              {/* Created By */}
              <div className="udemy-hero__author">
                <span>Được tạo bởi</span>
                <a href={`#instructor`}>{instructorName}</a>
              </div>

              {/* Additional Info */}
              <div className="udemy-hero__info">
                <div className="info-item">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.69 3.61.82 1.89 3.2L12 21.04l3.4 1.46 1.89-3.2 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z" />
                  </svg>
                  <span>Cập nhật gần đây {new Date(course.updatedAt).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="info-item">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0 0 14.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" />
                  </svg>
                  <span>{course.language === 'vi' ? 'Tiếng Việt' : 'English'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="udemy-main">
          <div className="udemy-main__container">
            {/* Left Content */}
            <div className="udemy-main__content">
              {/* What you'll learn */}
              {course.learningObjectives && course.learningObjectives.length > 0 && (
                <div className="udemy-section udemy-what-learn">
                  <h2>Những gì bạn sẽ học</h2>
                  <div className="udemy-what-learn__grid">
                    {course.learningObjectives.map((objective, index) => (
                      <div key={index} className="udemy-what-learn__item">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                        </svg>
                        <span>{objective}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Course content */}
              <div className="udemy-section udemy-content-section">
                <h2>Nội dung khóa học</h2>
                <div className="udemy-content-summary">
                  <span>{course.totalLessons} bài học</span>
                  <span>•</span>
                  <span>{course.estimatedDuration || course.totalDuration} giờ video</span>
                </div>

                {sections.length > 0 ? (
                  <div className="udemy-content-sections">
                    {sections.map((section, index) => (
                      <div key={section._id || index} className="udemy-section-item">
                        <div className="udemy-section-header">
                          <h3>
                            <span className="section-number">Phần {index + 1}:</span>
                            {section.title}
                          </h3>
                          <div className="udemy-section-info">
                            <span>{section.lessons?.length || 0} bài học</span>
                            <span>•</span>
                            <span>{section.lessons?.reduce((total: number, lesson: any) => total + (lesson.duration || 0), 0) || 0} phút</span>
                          </div>
                        </div>
                        {section.description && (
                          <p className="udemy-section-description">{section.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="udemy-content-placeholder">
                    <p>📚 Nội dung chi tiết sẽ được hiển thị sau khi đăng ký khóa học</p>
                  </div>
                )}
              </div>

              {/* Requirements */}
              {course.prerequisites && course.prerequisites.length > 0 && (
                <div className="udemy-section udemy-requirements">
                  <h2>Yêu cầu</h2>
                  <ul>
                    {course.prerequisites.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Description */}
              <div className="udemy-section udemy-description">
                <h2>Mô tả</h2>
                <div className="udemy-description__content">
                  <p>{course.description}</p>
                </div>
              </div>

              {/* Target audience */}
              {course.targetAudience && course.targetAudience.length > 0 && (
                <div className="udemy-section udemy-audience">
                  <h2>Khóa học này dành cho ai:</h2>
                  <ul>
                    {course.targetAudience.map((audience, index) => (
                      <li key={index}>{audience}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {course.benefits && course.benefits.length > 0 && (
                <div className="udemy-section udemy-benefits">
                  <h2>Lợi ích khóa học</h2>
                  <div className="udemy-benefits__grid">
                    {course.benefits.map((benefit, index) => (
                      <div key={index} className="udemy-benefits__item">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                          <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.235.235 0 0 0-.31-.01 1.25 1.25 0 0 0-.01 1.76l2.5 2.5a.75.75 0 0 0 1.06 0l4-4a.75.75 0 0 0-.01-1.06z" />
                        </svg>
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Course Features */}
              <div className="udemy-section udemy-features">
                <h2>Tính năng khóa học</h2>
                <div className="udemy-features__grid">
                  <div className="feature-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <div className="feature-content">
                      <h4>Đánh giá</h4>
                      <p>{course.averageRating.toFixed(1)}/5 ({course.totalRatings} đánh giá)</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    <div className="feature-content">
                      <h4>Chứng chỉ</h4>
                      <p>{course.certificate ? 'Có chứng chỉ hoàn thành' : 'Không có chứng chỉ'}</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                    </svg>
                    <div className="feature-content">
                      <h4>Thời lượng</h4>
                      <p>{course.estimatedDuration || course.totalDuration} giờ</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 7H16.5c-.8 0-1.54.5-1.85 1.26L12.5 15H15v7h5zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2 16v-7H9V9.5c0-.83-.67-1.5-1.5-1.5S6 8.67 6 9.5V15H4.5v7h3z" />
                    </svg>
                    <div className="feature-content">
                      <h4>Học viên</h4>
                      <p>{course.totalStudents} học viên</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {course.tags && course.tags.length > 0 && (
                <div className="udemy-section udemy-tags">
                  <h2>Thẻ khóa học</h2>
                  <div className="udemy-tags__list">
                    {course.tags.map((tag, index) => (
                      <span key={index} className="udemy-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Instructor */}
              <div className="udemy-section udemy-instructor" id="instructor">
                <h2>Giảng viên</h2>
                <div className="udemy-instructor__card">
                  <a href={`#instructor-${course.instructorId._id}`} className="udemy-instructor__name">
                    {instructorName}
                  </a>
                  <div className="udemy-instructor__bio">
                    {course.instructorId.bio || 'Chuyên gia trong lĩnh vực'}
                  </div>
                  <div className="udemy-instructor__profile">
                    <img
                      src={course.instructorId.avatar || '/images/default-avatar.png'}
                      alt={instructorName}
                    />
                    <div className="udemy-instructor__stats">
                      <div className="stat-item">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                        </svg>
                        <span>{course.totalStudents} học viên</span>
                      </div>
                      <div className="stat-item">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                        </svg>
                        <span>{course.averageRating.toFixed(1)} xếp hạng</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews placeholder */}
              <div className="udemy-section udemy-reviews">
                <h2>Đánh giá của học viên</h2>
                <div className="udemy-reviews__summary">
                  <div className="udemy-reviews__score">
                    <div className="score-number">{course.averageRating.toFixed(1)}</div>
                    <div className="score-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={star <= Math.round(course.averageRating) ? 'star-filled' : 'star-empty'}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <div className="score-text">Xếp hạng khóa học</div>
                  </div>
                  <div className="udemy-reviews__bars">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const percentage = rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 5 : rating === 2 ? 3 : 2;
                      return (
                        <div key={rating} className="rating-bar">
                          <div className="rating-bar__progress" style={{ width: `${percentage}%` }}></div>
                          <div className="rating-bar__label">
                            {[...Array(rating)].map((_, i) => <span key={i}>★</span>)}
                          </div>
                          <div className="rating-bar__percent">{percentage}%</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Sticky Card */}
            <div className="udemy-main__sidebar">
              <div className="udemy-card">
                {/* Preview */}
                <div className="udemy-card__preview">
                  <img src={course.thumbnail} alt={course.title} />
                  {course.discountPercentage && (
                    <div className="udemy-card__badge-discount">
                      {course.discountPercentage}% OFF
                    </div>
                  )}
                  <button className="udemy-card__play-btn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>

                {/* Price */}
                <div className="udemy-card__price">
                  {course.price === 0 ? (
                    <div className="price-free-large">Miễn phí</div>
                  ) : (
                    <>
                      <div className="price-current-large">{formatPrice(calculateDiscountPrice())}</div>
                      {course.originalPrice && (
                        <>
                          <div className="price-original-large">{formatPrice(course.originalPrice)}</div>
                          {course.discountPercentage && (
                            <div className="price-discount-text">{course.discountPercentage}% giảm giá</div>
                          )}
                        </>
                      )}
                    </>
                  )}
                  {course.discountPercentage && (
                    <div className="udemy-card__countdown">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
                      </svg>
                      <span className="countdown-text">Ưu đãi có hạn!</span>
                    </div>
                  )}
                </div>

                {/* CTA Buttons */}
                <div className="udemy-card__cta">
                  {isEnrolled ? (
                    <>
                      <button
                        className="udemy-btn-enroll udemy-btn-enroll--enrolled"
                        onClick={handleGoToLearning}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="5,3 19,12 5,21"></polygon>
                        </svg>
                        Vào học ngay
                      </button>
                      <div className="udemy-enrolled-badge">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22,4 12,14.01 9,11.01"></polyline>
                        </svg>
                        Đã đăng ký
                      </div>
                    </>
                  ) : (
                    <>
                      <button
                        className="udemy-btn-enroll"
                        onClick={handleEnroll}
                        disabled={enrolling}
                      >
                        {enrolling ? 'Đang xử lý...' : 'Đăng ký ngay'}
                      </button>
                      <button className="udemy-btn-wishlist">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        Yêu thích
                      </button>
                    </>
                  )}
                </div>

                {/* Money back */}
                <div className="udemy-card__guarantee">
                  Đảm bảo hoàn tiền trong 30 ngày
                </div>

                {/* Includes */}
                <div className="udemy-card__includes">
                  <h3>Khóa học này bao gồm:</h3>
                  <ul>
                    <li>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                        <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z" />
                      </svg>
                      <span>{course.estimatedDuration || course.totalDuration} giờ video theo yêu cầu</span>
                    </li>
                    <li>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                        <path d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0z" />
                      </svg>
                      <span>{course.totalLessons} bài học</span>
                    </li>
                    <li>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z" />
                        <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                      </svg>
                      <span>Truy cập trên di động và TV</span>
                    </li>
                    <li>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 13A6 6 0 1 1 8 2a6 6 0 0 1 0 12z" />
                        <path d="M5.854 4.854a.5.5 0 1 0-.708-.708l-2 2a.5.5 0 0 0 0 .708l2 2a.5.5 0 0 0 .708-.708L4.207 6.5l1.647-1.646zm4.292 0a.5.5 0 0 1 .708-.708l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L11.793 6.5l-1.647-1.646z" />
                      </svg>
                      <span>Truy cập trọn đời</span>
                    </li>
                    {course.certificate && (
                      <li>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
                          <path d="M8 4a.5.5 0 0 1 .5.5V6h1.5a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V7H6a.5.5 0 0 1 0-1h1.5V4.5A.5.5 0 0 1 8 4z" />
                        </svg>
                        <span>Chứng chỉ hoàn thành</span>
                      </li>
                    )}
                    {course.assessment.hasQuizzes && (
                      <li>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                          <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
                        </svg>
                        <span>Câu hỏi kiểm tra</span>
                      </li>
                    )}
                    {course.assessment.hasAssignments && (
                      <li>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                          <path d="M5.854 4.854a.5.5 0 1 0-.708-.708l-2 2a.5.5 0 0 0 0 .708l2 2a.5.5 0 0 0 .708-.708L4.207 6.5l1.647-1.646zm4.292 0a.5.5 0 0 1 .708-.708l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L11.793 6.5l-1.647-1.646z" />
                        </svg>
                        <span>Bài tập thực hành</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* AI ChatBot */}
      <ChatBot context={{
        currentPage: 'course-detail',
        courseId: course?._id,
        courseInfo: course
      }} />
    </>
  );
};

export default CourseDetail;
