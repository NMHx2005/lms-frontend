import './CourseHeader.css';

const CourseHeader: React.FC = () => {
  return (
    <section className="course-header" aria-label="Course catalog header">
      <div className="course-header__container">
        <div className="course-header__content">
          <h1 className="course-header__title">Danh sách khóa học</h1>
          <p className="course-header__desc">
            Khám phá hàng trăm khóa học chất lượng cao từ các lĩnh vực khác nhau. 
            Tìm kiếm khóa học phù hợp với mục tiêu học tập và phát triển sự nghiệp của bạn.
          </p>
          <div className="course-header__stats">
            <div className="course-header__stat">
              <span className="course-header__stat-number">500+</span>
              <span className="course-header__stat-label">Khóa học</span>
            </div>
            <div className="course-header__stat">
              <span className="course-header__stat-number">50+</span>
              <span className="course-header__stat-label">Lĩnh vực</span>
            </div>
            <div className="course-header__stat">
              <span className="course-header__stat-number">100+</span>
              <span className="course-header__stat-label">Giảng viên</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseHeader;
