import Card from "../../Home/Card/Card";
import './CourseGrid.css';

export interface Course {
  id: string;
  category: string;
  title: string;
  desc: string;
  imgSrc: string;
  imgAlt: string;
  btnText: string;
  linkText: string;
  linkHref: string;
  price?: number;
  rating?: number;
  instructor?: string;
  duration?: string;
  level?: string;
}

interface CourseGridProps {
  courses: Course[];
  loading?: boolean;
}

const CourseGrid: React.FC<CourseGridProps> = ({ courses, loading = false }) => {
  if (loading) {
    return (
      <div className="course-grid course-grid--loading">
        <div className="course-grid__skeleton">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="course-grid__skeleton-item">
              <div className="course-grid__skeleton-image"></div>
              <div className="course-grid__skeleton-content">
                <div className="course-grid__skeleton-title"></div>
                <div className="course-grid__skeleton-desc"></div>
                <div className="course-grid__skeleton-btn"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="course-grid course-grid--empty">
        <div className="course-grid__empty-state">
          <div className="course-grid__empty-icon">
            <svg width="64" height="64" fill="none" stroke="#9ca3af" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
          </div>
          <h3 className="course-grid__empty-title">Không tìm thấy khóa học</h3>
          <p className="course-grid__empty-desc">
            Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để tìm khóa học phù hợp.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="course-grid">
      <div className="course-grid__container">
        {courses.map((course) => (
          <div key={course.id} className="course-grid__item">
            <Card {...course} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseGrid;
