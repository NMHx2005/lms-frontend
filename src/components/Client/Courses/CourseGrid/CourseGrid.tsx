import React from 'react';
import { Course } from '@/components/Client/Dashboard/types';
import Card from "../../Home/Card/Card";
import './CourseGrid.css';

interface CourseGridProps {
  courses: Course[];
  loading?: boolean;
}

const CourseGrid: React.FC<CourseGridProps> = ({ courses, loading = false }) => {
  if (loading) {
    return (
      <div className="course-grid course-grid--loading">
        <div className="course-grid__container">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="course-grid__skeleton-item">
              <div className="course-grid__skeleton-image"></div>
              <div className="course-grid__skeleton-content">
                <div className="course-grid__skeleton-title"></div>
                <div className="course-grid__skeleton-desc"></div>
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
        <div className="course-grid__container">
          <div className="course-grid__empty-content">
            <div className="course-grid__empty-icon">📚</div>
            <h3 className="course-grid__empty-title">Không tìm thấy khóa học</h3>
            <p className="course-grid__empty-desc">Hãy thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
            <button className="course-grid__empty-btn">Xóa bộ lọc</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="course-grid">
      <div className="course-grid__container">
        {courses.map((course) => (
          <div key={course._id} className="course-grid__item">
            <Card
              id={course._id}
              category={course.domain}
              title={course.title}
              desc={course.description}
              imgSrc={course.thumbnail || '/images/default-course.jpg'}
              imgAlt={course.title}
              btnText="Xem khóa học"
              linkText="Chi tiết →"
              linkHref="#"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseGrid;
