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
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" width="20" height="20" fill="#fbbf24" viewBox="0 0 20 20">
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
        <svg key={`empty-${i}`} width="20" height="20" fill="#e5e7eb" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      );
    }

    return stars;
  };

  return (
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
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span>Quyền truy cập vĩnh viễn</span>
                  </div>
                  
                  <div className="course-hero__card-feature">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>Chứng chỉ hoàn thành</span>
                  </div>
                  
                  <div className="course-hero__card-feature">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                    </svg>
                    <span>Tài liệu khóa học</span>
                  </div>
                  
                  <div className="course-hero__card-feature">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                    </svg>
                    <span>Hỗ trợ 1-1</span>
                  </div>
                </div>

                <button className="course-hero__enroll-btn">
                  Đăng ký khóa học
                </button>

                <div className="course-hero__guarantee">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                  <span>30 ngày hoàn tiền nếu không hài lòng</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseHero;
