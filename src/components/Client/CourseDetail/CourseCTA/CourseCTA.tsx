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
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" width="16" height="16" fill="#fbbf24" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="halfStar">
              <stop offset="50%" stopColor="#fbbf24"/>
              <stop offset="50%" stopColor="#e5e7eb"/>
            </linearGradient>
          </defs>
          <path fill="url(#halfStar)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} width="16" height="16" fill="#e5e7eb" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      );
    }

    return stars;
  };

  return (
    <section className="course-cta">
      <div className="course-cta__container">
        <div className="course-cta__content">
          <div className="course-cta__left">
            <h2 className="course-cta__title">Sẵn sàng bắt đầu học?</h2>
            <p className="course-cta__description">
              Tham gia cùng {course.students.toLocaleString('vi-VN')}+ học viên khác và bắt đầu hành trình học tập của bạn ngay hôm nay!
            </p>
            
            <div className="course-cta__features">
              <div className="course-cta__feature">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>Quyền truy cập vĩnh viễn</span>
              </div>
              
              <div className="course-cta__feature">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>Chứng chỉ hoàn thành</span>
              </div>
              
              <div className="course-cta__feature">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>Tài liệu khóa học</span>
              </div>
              
              <div className="course-cta__feature">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>Hỗ trợ 1-1</span>
              </div>
            </div>

            <div className="course-cta__guarantee">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
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

                <button className="course-cta__enroll-btn">
                  Đăng ký khóa học ngay
                </button>

                <div className="course-cta__payment-info">
                  <p>Thanh toán an toàn với:</p>
                  <div className="course-cta__payment-methods">
                    <span>💳 Thẻ tín dụng</span>
                    <span>🏦 Chuyển khoản</span>
                    <span>💰 Ví điện tử</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseCTA;
