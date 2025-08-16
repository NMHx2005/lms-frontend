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
      <div className="course-grid__container">
        <div className="course-grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="course-grid__skeleton">
              <div className="course-grid__skeleton-image"></div>
              <div className="course-grid__skeleton-content">
                <div className="course-grid__skeleton-title"></div>
                <div className="course-grid__skeleton-text"></div>
                <div className="course-grid__skeleton-text short"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="course-grid course-grid__noresult">
        <div className="course-grid__empty">
          <div className="course-grid__empty-icon">📚</div>
          <h3>Không tìm thấy khóa học</h3>
          <p>Hãy thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
        </div>
      </div>
    );
  }

  return (
    <div className="course-grid__container">
      <div className="course-grid">
        {courses.map((course) => (
          <Card
            key={course._id}
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
        ))}
      </div>
    </div>
  );
};

export default CourseGrid;
