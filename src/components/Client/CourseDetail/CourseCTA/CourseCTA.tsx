import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientCoursesService } from '../../../../services/client/courses.service';
import './CourseCTA.css';

interface CourseCTAProps {
  course: {
    id: string;
    title: string;
    price: number;
    originalPrice?: number;
    students: number;
    rating: number;
    totalRatings: number;
    duration: string;
    level: string;
  };
}

const CourseCTA: React.FC<CourseCTAProps> = ({ course }) => {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'vnpay' | 'contact_teacher'>('vnpay');
  const [isProcessingVNPay, setIsProcessingVNPay] = useState(false);
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
        // If we can't check enrollment, assume not enrolled
        setIsEnrolled(false);
      } finally {
        setIsCheckingEnrollment(false);
      }
    };

    checkEnrollmentStatus();
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
        <svg key={i} width="16" height="16" fill="#fbbf24" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" width="16" height="16" fill="#fbbf24" viewBox="0 0 20 20">
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

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} width="16" height="16" fill="#e5e7eb" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    return stars;
  };

  const handleEnroll = async () => {
    if (isEnrolled) {
      // If already enrolled, navigate to course content
      navigate(`/dashboard/courses/${course.id}`);
      return;
    }

    // Show payment modal first
    setShowPaymentModal(true);
  };

  const handleVNPayPayment = async () => {
    try {
      setIsProcessingVNPay(true);
      setEnrollmentStatus('idle');
      setErrorMessage('');

      // Create VNPay payment - using mock payment for testing (no user input needed)
      const paymentResponse = await clientCoursesService.createVNPayPayment(course.id, {
        amount: course.price,
        courseTitle: course.title
      });

      if (paymentResponse.success) {
        // Check if user is already enrolled
        if (paymentResponse.data?.alreadyEnrolled) {
          setIsEnrolled(true);
          setEnrollmentStatus('success');
          setErrorMessage('Bạn đã đăng ký khóa học này rồi! Đang chuyển hướng...');
          setShowPaymentModal(false);

          // Auto-navigate to course content after a short delay
          setTimeout(() => {
            navigate(`/dashboard/courses/${course.id}`);
          }, 2000);
        } else if (paymentResponse.data?.paymentUrl) {
          // Redirect to VNPay payment gateway (or mock result page)
          window.location.href = paymentResponse.data.paymentUrl;
        } else {
          setEnrollmentStatus('error');
          setErrorMessage('Không thể tạo thanh toán VNPay. Vui lòng thử lại.');
        }
      } else {
        setEnrollmentStatus('error');
        setErrorMessage(paymentResponse.error || 'Không thể tạo thanh toán VNPay. Vui lòng thử lại.');
      }
    } catch (error: any) {
      setEnrollmentStatus('error');
      setErrorMessage(error.response?.data?.error || 'Có lỗi xảy ra khi tạo thanh toán VNPay');
      console.error('VNPay payment error:', error);
    } finally {
      setIsProcessingVNPay(false);
    }
  };

  const handleContactTeacher = async () => {
    try {
      setIsEnrolling(true);
      setEnrollmentStatus('idle');
      setErrorMessage('');
      setShowPaymentModal(false);

      // Create pending enrollment with contact_teacher method
      const response = await clientCoursesService.enrollInCourseDirect(course.id, {
        paymentMethod: 'contact_teacher',
        agreeToTerms: true
      });

      if (response.success) {
        // Check if user is already enrolled
        if (response.data?.alreadyEnrolled) {
          setIsEnrolled(true);
          setEnrollmentStatus('success');
          setErrorMessage('Bạn đã đăng ký khóa học này rồi! Đang chuyển hướng...');
          setShowPaymentModal(false);

          // Auto-navigate to course content after a short delay
          setTimeout(() => {
            navigate(`/dashboard/courses/${course.id}`);
          }, 2000);
        } else {
          setEnrollmentStatus('success');
          setIsEnrolled(true);
          // Show success message and redirect
          setTimeout(() => {
            navigate('/dashboard/courses');
          }, 3000);
        }
      } else {
        setEnrollmentStatus('error');
        setErrorMessage(response.error || 'Có lỗi xảy ra khi đăng ký khóa học');
      }
    } catch (error: any) {
      setEnrollmentStatus('error');
      setErrorMessage('Có lỗi xảy ra khi đăng ký khóa học');
    } finally {
      setIsEnrolling(false);
    }
  };

  const getEnrollButtonText = () => {
    if (isCheckingEnrollment) return 'Đang kiểm tra...';
    if (isEnrolling) return 'Đang đăng ký...';
    if (enrollmentStatus === 'success') return 'Đăng ký thành công!';
    if (enrollmentStatus === 'error') return 'Thử lại';
    if (isEnrolled) return 'Tiếp tục học';
    return 'Đăng ký khóa học ngay';
  };

  const getEnrollButtonClass = () => {
    let baseClass = 'course-cta__enroll-btn';
    if (isCheckingEnrollment) baseClass += ' course-cta__enroll-btn--loading';
    if (isEnrolling) baseClass += ' course-cta__enroll-btn--loading';
    if (enrollmentStatus === 'success') baseClass += ' course-cta__enroll-btn--success';
    if (enrollmentStatus === 'error') baseClass += ' course-cta__enroll-btn--error';
    if (isEnrolled) baseClass += ' course-cta__enroll-btn--enrolled';
    return baseClass;
  };

  const isButtonDisabled = () => {
    return isCheckingEnrollment || isEnrolling || enrollmentStatus === 'success';
  };

  return (
    <>
      <section className="course-cta">
        <div className="course-cta__container">
          <div className="course-cta__content">
            <div className="course-cta__info">
              <h2 className="course-cta__title">Bắt đầu học ngay hôm nay</h2>
              <p className="course-cta__description">
                Tham gia khóa học và nâng cao kỹ năng của bạn với nội dung chất lượng cao
              </p>

              {/* Success Notification */}
              {enrollmentStatus === 'success' && (
                <div className="course-cta__success-notification">
                  <div className="course-cta__success-icon">✓</div>
                  <div className="course-cta__success-content">
                    <h3 className="course-cta__success-title">Thành công!</h3>
                    <p className="course-cta__success-message">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {enrollmentStatus === 'error' && errorMessage && (
                <div className="course-cta__error-message">
                  <span className="course-cta__error-icon">⚠</span>
                  {errorMessage}
                </div>
              )}

              <div className="course-cta__features">
                <div className="course-cta__feature">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Học mọi lúc, mọi nơi</span>
                </div>
                <div className="course-cta__feature">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Chứng chỉ hoàn thành</span>
                </div>
                <div className="course-cta__feature">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Hỗ trợ 24/7</span>
                </div>
              </div>

              <div className="course-cta__guarantee">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>30 ngày hoàn tiền nếu không hài lòng</span>
              </div>
            </div>

            <div className="course-cta__right">
              <div className="course-cta__card">
                <div className="course-cta__card-header">
                  <div className="course-cta__price">
                    {course.originalPrice && course.originalPrice > course.price && (
                      <span className="course-cta__original-price">
                        {formatPrice(course.originalPrice)}
                      </span>
                    )}
                    <span className="course-cta__current-price">
                      {formatPrice(course.price)}
                    </span>
                  </div>

                  {course.originalPrice && course.originalPrice > course.price && (
                    <div className="course-cta__discount">
                      Giảm {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}%
                    </div>
                  )}
                </div>

                <div className="course-cta__card-content">
                  <div className="course-cta__course-info">
                    <h3 className="course-cta__course-title">{course.title}</h3>

                    <div className="course-cta__course-stats">
                      <div className="course-cta__course-stat">
                        <span className="course-cta__course-stat-label">Đánh giá:</span>
                        <div className="course-cta__rating">
                          {renderStars(course.rating)}
                          <span className="course-cta__rating-text">
                            {formatRating(course.rating)} ({course.totalRatings} đánh giá)
                          </span>
                        </div>
                      </div>

                      <div className="course-cta__course-stat">
                        <span className="course-cta__course-stat-label">Thời lượng:</span>
                        <span className="course-cta__course-stat-value">{course.duration}</span>
                      </div>

                      <div className="course-cta__course-stat">
                        <span className="course-cta__course-stat-label">Trình độ:</span>
                        <span className="course-cta__course-stat-value">{course.level}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    className={getEnrollButtonClass()}
                    onClick={handleEnroll}
                    disabled={isButtonDisabled()}
                  >
                    {getEnrollButtonText()}
                  </button>

                  {enrollmentStatus === 'success' && (
                    <div className="course-cta__success-message">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Đăng ký thành công! Đang chuyển hướng...</span>
                    </div>
                  )}

                  {enrollmentStatus === 'error' && (
                    <div className="course-cta__error-message">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="course-cta__payment-info">
                    <p>Thanh toán an toàn với:</p>
                    <div className="course-cta__payment-methods">
                      <span>🏦 VNPay</span>
                      <span>👨‍🏫 Liên hệ giáo viên</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="course-cta__payment-modal">
          <div className="course-cta__payment-modal-content">
            <div className="course-cta__payment-modal-header">
              <h3>Chọn phương thức thanh toán</h3>
              <button
                className="course-cta__payment-modal-close"
                onClick={() => setShowPaymentModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="course-cta__payment-modal-body">
              <div className="course-cta__payment-methods">
                <div className="course-cta__payment-method">
                  <input
                    type="radio"
                    id="vnpay"
                    name="paymentMethod"
                    value="vnpay"
                    checked={selectedPaymentMethod === 'vnpay'}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value as any)}
                  />
                  <label htmlFor="vnpay">
                    <span className="course-cta__payment-method-icon">🏦</span>
                    <span className="course-cta__payment-method-name">Thanh toán qua VNPay</span>
                    <span className="course-cta__payment-method-desc">Thanh toán trực tuyến an toàn</span>
                  </label>
                </div>

                <div className="course-cta__payment-method">
                  <input
                    type="radio"
                    id="contact_teacher"
                    name="paymentMethod"
                    value="contact_teacher"
                    checked={selectedPaymentMethod === 'contact_teacher'}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value as any)}
                  />
                  <label htmlFor="contact_teacher">
                    <span className="course-cta__payment-method-icon">👨‍🏫</span>
                    <span className="course-cta__payment-method-name">Liên hệ giáo viên</span>
                    <span className="course-cta__payment-method-desc">Đăng ký trực tiếp với giáo viên</span>
                  </label>
                </div>
              </div>

              <div className="course-cta__payment-summary">
                <div className="course-cta__payment-summary-item">
                  <span>Giá khóa học:</span>
                  <span>{formatPrice(course.price)}</span>
                </div>
                <div className="course-cta__payment-summary-item course-cta__payment-summary-total">
                  <span>Tổng cộng:</span>
                  <span>{formatPrice(course.price)}</span>
                </div>
              </div>

              <div className="course-cta__payment-actions">
                <button
                  className="course-cta__payment-cancel-btn"
                  onClick={() => setShowPaymentModal(false)}
                >
                  Hủy
                </button>
                {selectedPaymentMethod === 'vnpay' ? (
                  <button
                    className="course-cta__payment-confirm-btn course-cta__payment-confirm-btn--vnpay"
                    onClick={handleVNPayPayment}
                    disabled={isProcessingVNPay}
                  >
                    {isProcessingVNPay ? 'Đang xử lý...' : 'Thanh toán VNPay'}
                  </button>
                ) : (
                  <button
                    className="course-cta__payment-confirm-btn course-cta__payment-confirm-btn--contact"
                    onClick={handleContactTeacher}
                    disabled={isEnrolling}
                  >
                    {isEnrolling ? 'Đang xử lý...' : 'Liên hệ giáo viên'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseCTA;
