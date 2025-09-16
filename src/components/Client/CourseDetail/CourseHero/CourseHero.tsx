import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientCoursesService } from '../../../../services/client/courses.service';
import { wishlistService } from '../../../../services/client/wishlist.service';
import PaymentForm from '../PaymentForm/PaymentForm';
import { toast } from 'react-hot-toast';
import './CourseHero.css';

interface CourseHeroProps {
  course: {
    id: string;
    title: string;
    description: string;
    category: string;
    imgSrc: string;
    imgAlt: string;
    price: number;
    originalPrice?: number;
    rating: number;
    totalRatings: number;
    instructor: {
      name: string;
      avatar: string;
      title: string;
      company: string;
    };
    duration: string;
    level: string;
    students: number;
    lastUpdated: string;
    language: string;
  };
}

const CourseHero: React.FC<CourseHeroProps> = ({ course }) => {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isProcessingVNPay, setIsProcessingVNPay] = useState(false);

  // Wishlist states
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isCheckingWishlist, setIsCheckingWishlist] = useState(true);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const [wishlistId, setWishlistId] = useState<string | null>(null);

  const navigate = useNavigate();

  // Check if user is already enrolled in this course
  useEffect(() => {
    const checkEnrollmentStatus = async () => {
      try {
        setIsCheckingEnrollment(true);
        const enrollments = await clientCoursesService.getUserEnrollments();

        if (enrollments.success && enrollments.data) {
          const isAlreadyEnrolled = enrollments.data.some(
            (enrollment: any) => enrollment.courseId === course.id && enrollment.isActive
          );
          setIsEnrolled(isAlreadyEnrolled);
        }
      } catch (error) {
        console.error('Error checking enrollment status:', error);
      } finally {
        setIsCheckingEnrollment(false);
      }
    };

    checkEnrollmentStatus();
  }, [course.id]);

  // Check if course is in wishlist
  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        setIsCheckingWishlist(true);
        const response = await wishlistService.isInWishlist(course.id);

        if (response.success && response.data) {
          setIsInWishlist(response.data.isInWishlist);
          setWishlistId(response.data.wishlistId || null);
        }
      } catch (error) {
        console.error('Error checking wishlist status:', error);
      } finally {
        setIsCheckingWishlist(false);
      }
    };

    checkWishlistStatus();
  }, [course.id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} width="20" height="20" fill="#fbbf24" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" width="20" height="20" fill="#fbbf24" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="halfStar">
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#e5e7eb" />
            </linearGradient>
          </defs>
          <path fill="url(#halfStar)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    // Add empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} width="20" height="20" fill="#e5e7eb" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    return stars;
  };

  // Handle wishlist toggle
  const handleWishlistToggle = async () => {
    try {
      setIsTogglingWishlist(true);

      if (isInWishlist && wishlistId) {
        // Remove from wishlist
        const response = await wishlistService.removeFromWishlist(wishlistId);
        if (response.success) {
          setIsInWishlist(false);
          setWishlistId(null);
          toast.success('Đã xóa khỏi danh sách yêu thích');
        } else {
          toast.error('Không thể xóa khỏi danh sách yêu thích');
        }
      } else {
        // Add to wishlist
        const response = await wishlistService.addToWishlist({
          courseId: course.id,
          notes: ''
        });
        if (response.success) {
          setIsInWishlist(true);
          setWishlistId(response.data?._id || null);
          toast.success('Đã thêm vào danh sách yêu thích');
        } else {
          toast.error('Không thể thêm vào danh sách yêu thích');
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error('Có lỗi xảy ra khi thao tác với danh sách yêu thích');
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  const handleEnroll = () => {
    if (isEnrolled) {
      navigate(`/dashboard/courses/${course.id}`);
      return;
    }
    setShowPaymentForm(true);
  };

  const handleVNPayPayment = async (paymentInfo: { fullName: string; phone: string; address: string }) => {
    try {
      setIsProcessingVNPay(true);

      // Use real VNPay for production, mock for development
      const useRealVNPay = import.meta.env.PROD || import.meta.env.VITE_USE_REAL_VNPAY === 'true';

      const response = useRealVNPay
        ? await clientCoursesService.createVNPayPaymentReal(course.id, {
          amount: course.price,
          courseTitle: course.title,
          userInfo: paymentInfo
        })
        : await clientCoursesService.createVNPayPayment(course.id, {
          amount: course.price,
          courseTitle: course.title,
          userInfo: paymentInfo
        });

      if (response.success && response.data?.paymentUrl) {
        // Redirect to VNPay payment page
        window.location.href = response.data.paymentUrl;
      } else {
        setEnrollmentStatus('error');
        setErrorMessage(response.error || 'Không thể tạo liên kết thanh toán VNPay');
        setShowPaymentForm(false);
        toast.error(response.error || 'Không thể tạo liên kết thanh toán VNPay');
      }
    } catch (error: any) {
      console.error('VNPay payment error:', error);
      setEnrollmentStatus('error');
      setErrorMessage('Có lỗi xảy ra khi tạo liên kết thanh toán VNPay. Vui lòng thử lại.');
      setShowPaymentForm(false);
      toast.error('Có lỗi xảy ra khi tạo liên kết thanh toán VNPay. Vui lòng thử lại.');
    } finally {
      setIsProcessingVNPay(false);
    }
  };


  const getEnrollButtonText = () => {
    if (isCheckingEnrollment) return 'Đang kiểm tra...';
    if (isEnrolling) return 'Đang đăng ký...';
    if (enrollmentStatus === 'success') return 'Đăng ký thành công!';
    if (enrollmentStatus === 'error') return 'Thử lại';
    if (isEnrolled) return 'Tiếp tục học';
    return 'Đăng ký khóa học';
  };

  const getEnrollButtonClass = () => {
    let baseClass = 'course-hero__enroll-btn';
    if (isCheckingEnrollment) baseClass += ' course-hero__enroll-btn--loading';
    if (isEnrolling) baseClass += ' course-hero__enroll-btn--loading';
    if (enrollmentStatus === 'success') baseClass += ' course-hero__enroll-btn--success';
    if (enrollmentStatus === 'error') baseClass += ' course-hero__enroll-btn--error';
    if (isEnrolled) baseClass += ' course-hero__enroll-btn--enrolled';
    return baseClass;
  };

  const isButtonDisabled = () => {
    return isCheckingEnrollment || isEnrolling || enrollmentStatus === 'success';
  };

  return (
    <>
      <section className="course-hero">
        <div className="course-hero__container">
          <div className="course-hero__content">
            <div className="course-hero__left">
              {/* Breadcrumb */}
              <nav className="course-hero__breadcrumb">
                <a href="/courses" className="course-hero__breadcrumb-link">Khóa học</a>
                <span className="course-hero__breadcrumb-separator">/</span>
                <span className="course-hero__breadcrumb-current">{course.category}</span>
              </nav>

              {/* Title */}
              <h1 className="course-hero__title">{course.title}</h1>

              {/* Description */}
              <p className="course-hero__description">{course.description}</p>

              {/* Course Stats */}
              <div className="course-hero__stats">
                <div className="course-hero__stat">
                  <span className="course-hero__stat-label">Đánh giá:</span>
                  <div className="course-hero__rating">
                    {renderStars(course.rating)}
                    <span className="course-hero__rating-text">
                      {formatRating(course.rating)} ({course.totalRatings} đánh giá)
                    </span>
                  </div>
                </div>

                <div className="course-hero__stat">
                  <span className="course-hero__stat-label">Học viên:</span>
                  <span className="course-hero__stat-value">{course.students.toLocaleString('vi-VN')}+</span>
                </div>

                <div className="course-hero__stat">
                  <span className="course-hero__stat-label">Cập nhật:</span>
                  <span className="course-hero__stat-value">{course.lastUpdated}</span>
                </div>

                <div className="course-hero__stat">
                  <span className="course-hero__stat-label">Ngôn ngữ:</span>
                  <span className="course-hero__stat-value">{course.language}</span>
                </div>
              </div>

              {/* Instructor */}
              <div className="course-hero__instructor">
                <div className="course-hero__instructor-avatar">
                  <img src={course.instructor.avatar} alt={course.instructor.name} />
                </div>
                <div className="course-hero__instructor-info">
                  <span className="course-hero__instructor-label">Giảng viên</span>
                  <h3 className="course-hero__instructor-name">{course.instructor.name}</h3>
                  <p className="course-hero__instructor-title">{course.instructor.title}</p>
                  <p className="course-hero__instructor-company">{course.instructor.company}</p>
                </div>
              </div>

              {/* Success Notification */}
              {enrollmentStatus === 'success' && (
                <div className="course-hero__success-notification">
                  <div className="course-hero__success-icon">✓</div>
                  <div className="course-hero__success-content">
                    <h3 className="course-hero__success-title">Thành công!</h3>
                    <p className="course-hero__success-message">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {enrollmentStatus === 'error' && errorMessage && (
                <div className="course-hero__error-message">
                  <span className="course-hero__error-icon">⚠</span>
                  <div className="course-hero__error-content">
                    <p className="course-hero__error-text">{errorMessage}</p>
                    <div className="course-hero__error-actions">
                      <button
                        className="course-hero__error-retry-btn"
                        onClick={() => setShowPaymentForm(true)}
                      >
                        Thử phương thức khác
                      </button>
                      <button
                        className="course-hero__error-close-btn"
                        onClick={() => setEnrollmentStatus('idle')}
                      >
                        Đóng
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="course-hero__guarantee">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>30 ngày hoàn tiền nếu không hài lòng</span>
              </div>
            </div>

            <div className="course-hero__right">
              {/* Course Image */}
              <div className="course-hero__image">
                <img src={course.imgSrc} alt={course.imgAlt} />
              </div>

              {/* Course Card */}
              <div className="course-hero__card">
                <div className="course-hero__card-header">
                  <div className="course-hero__price">
                    {course.originalPrice && course.originalPrice > course.price && (
                      <span className="course-hero__original-price">
                        {formatPrice(course.originalPrice)}
                      </span>
                    )}
                    <span className="course-hero__current-price">
                      {formatPrice(course.price)}
                    </span>
                  </div>

                  {course.originalPrice && course.originalPrice > course.price && (
                    <div className="course-hero__discount">
                      Giảm {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}%
                    </div>
                  )}
                </div>

                <div className="course-hero__card-content">
                  <div className="course-hero__card-features">
                    <div className="course-hero__card-feature">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span>Quyền truy cập vĩnh viễn</span>
                    </div>

                    <div className="course-hero__card-feature">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Chứng chỉ hoàn thành</span>
                    </div>

                    <div className="course-hero__card-feature">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span>Tài liệu khóa học</span>
                    </div>

                    <div className="course-hero__card-feature">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>Hỗ trợ 1-1</span>
                    </div>
                  </div>

                  {/* Wishlist Button */}
                  <button
                    className={`course-hero__wishlist-btn ${isInWishlist ? 'course-hero__wishlist-btn--active' : ''}`}
                    onClick={handleWishlistToggle}
                    disabled={isCheckingWishlist || isTogglingWishlist}
                    title={isInWishlist ? 'Xóa khỏi danh sách yêu thích' : 'Thêm vào danh sách yêu thích'}
                  >
                    {isCheckingWishlist ? (
                      <div className="course-hero__wishlist-loading">
                        <div className="course-hero__wishlist-spinner"></div>
                      </div>
                    ) : isTogglingWishlist ? (
                      <div className="course-hero__wishlist-loading">
                        <div className="course-hero__wishlist-spinner"></div>
                      </div>
                    ) : (
                      <svg
                        width="24"
                        height="24"
                        fill={isInWishlist ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    )}
                    <span>
                      {isInWishlist ? 'Đã yêu thích' : 'Yêu thích'}
                    </span>
                  </button>

                  <button
                    className={getEnrollButtonClass()}
                    onClick={handleEnroll}
                    disabled={isButtonDisabled()}
                  >
                    {getEnrollButtonText()}
                  </button>

                  {enrollmentStatus === 'success' && (
                    <div className="course-hero__success-message">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Đăng ký thành công! Đang chuyển hướng...</span>
                    </div>
                  )}

                  {enrollmentStatus === 'error' && (
                    <div className="course-hero__error-message">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="course-hero__guarantee">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>30 ngày hoàn tiền nếu không hài lòng</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Form Modal */}
      <PaymentForm
        visible={showPaymentForm}
        onCancel={() => setShowPaymentForm(false)}
        onConfirm={handleVNPayPayment}
        courseTitle={course.title}
        coursePrice={course.price}
        loading={isProcessingVNPay}
      />
    </>
  );
};

export default CourseHero;
