import { useState } from 'react';
import './CourseContent.css';

interface CourseContentProps {
  course: {
    id: string;
    description: string;
    whatYouWillLearn: string[];
    requirements: string[];
    targetAudience: string[];
    curriculum: {
      section: string;
      lessons: {
        title: string;
        duration: string;
        type: 'video' | 'text' | 'quiz' | 'assignment';
        isPreview?: boolean;
      }[];
    }[];
  };
}

const CourseContent: React.FC<CourseContentProps> = ({ course }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'instructor' | 'reviews'>('overview');
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));

  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return (
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
        );
      case 'text':
        return (
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
        );
      case 'quiz':
        return (
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        );
      case 'assignment':
        return (
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const renderOverview = () => (
    <div className="course-content__overview">
      <div className="course-content__section">
        <h3 className="course-content__section-title">Mô tả khóa học</h3>
        <p className="course-content__description">{course.description}</p>
      </div>

      <div className="course-content__section">
        <h3 className="course-content__section-title">Bạn sẽ học được gì?</h3>
        <ul className="course-content__list">
          {course.whatYouWillLearn.map((item, index) => (
            <li key={index} className="course-content__list-item">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="course-content__section">
        <h3 className="course-content__section-title">Yêu cầu</h3>
        <ul className="course-content__list">
          {course.requirements.map((item, index) => (
            <li key={index} className="course-content__list-item">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="course-content__section">
        <h3 className="course-content__section-title">Đối tượng học viên</h3>
        <ul className="course-content__list">
          {course.targetAudience.map((item, index) => (
            <li key={index} className="course-content__list-item">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderCurriculum = () => (
    <div className="course-content__curriculum">
      <div className="course-content__curriculum-header">
        <h3 className="course-content__section-title">Nội dung khóa học</h3>
        <div className="course-content__curriculum-stats">
          <span>{course.curriculum.length} chương</span>
          <span>•</span>
          <span>{course.curriculum.reduce((total, section) => total + section.lessons.length, 0)} bài học</span>
        </div>
      </div>

      <div className="course-content__curriculum-sections">
        {course.curriculum.map((section, sectionIndex) => (
          <div key={sectionIndex} className="course-content__curriculum-section">
            <button
              className="course-content__curriculum-section-header"
              onClick={() => toggleSection(sectionIndex)}
            >
              <div className="course-content__curriculum-section-info">
                <h4 className="course-content__curriculum-section-title">{section.section}</h4>
                <span className="course-content__curriculum-section-lessons">
                  {section.lessons.length} bài học
                </span>
              </div>
              <svg
                className={`course-content__curriculum-section-arrow ${expandedSections.has(sectionIndex) ? 'expanded' : ''}`}
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            {expandedSections.has(sectionIndex) && (
              <div className="course-content__curriculum-lessons">
                {section.lessons.map((lesson, lessonIndex) => (
                  <div key={lessonIndex} className="course-content__curriculum-lesson">
                    <div className="course-content__curriculum-lesson-info">
                      {getLessonIcon(lesson.type)}
                      <span className="course-content__curriculum-lesson-title">
                        {lesson.title}
                        {lesson.isPreview && (
                          <span className="course-content__curriculum-lesson-preview">Xem thử</span>
                        )}
                      </span>
                    </div>
                    <span className="course-content__curriculum-lesson-duration">{lesson.duration}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderInstructor = () => (
    <div className="course-content__instructor">
      <h3 className="course-content__section-title">Về giảng viên</h3>
      <div className="course-content__instructor-content">
        <p>Thông tin chi tiết về giảng viên sẽ được hiển thị ở đây...</p>
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="course-content__reviews">
      <h3 className="course-content__section-title">Đánh giá từ học viên</h3>
      <div className="course-content__reviews-content">
        <p>Đánh giá và nhận xét từ học viên sẽ được hiển thị ở đây...</p>
      </div>
    </div>
  );

  return (
    <section className="course-content">
      <div className="course-content__container">
        {/* Tabs */}
        <div className="course-content__tabs">
          <button
            className={`course-content__tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Tổng quan
          </button>
          <button
            className={`course-content__tab ${activeTab === 'curriculum' ? 'active' : ''}`}
            onClick={() => setActiveTab('curriculum')}
          >
            Nội dung
          </button>
          <button
            className={`course-content__tab ${activeTab === 'instructor' ? 'active' : ''}`}
            onClick={() => setActiveTab('instructor')}
          >
            Giảng viên
          </button>
          <button
            className={`course-content__tab ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Đánh giá
          </button>
        </div>

        {/* Tab Content */}
        <div className="course-content__tab-content">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'curriculum' && renderCurriculum()}
          {activeTab === 'instructor' && renderInstructor()}
          {activeTab === 'reviews' && renderReviews()}
        </div>
      </div>
    </section>
  );
};

export default CourseContent;
