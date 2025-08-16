import React, { useState, useEffect } from 'react';
import CourseStats from '@/components/Client/Dashboard/Courses/CourseStats';
import './MyCourses.css';
import { Course } from '@/types/index';

// Thêm interface CourseFilter
interface CourseFilter {
  search: string;
  domain: string;
  level: string;
}

const MyCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<CourseFilter>({
    search: '',
    domain: 'all',
    level: 'all'
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockCourses: Course[] = [
        {
          _id: '1',
          title: 'React Fundamentals',
          description: 'Học React từ cơ bản đến nâng cao',
          thumbnail: '/images/react-course.jpg',
          domain: 'IT',
          level: 'beginner',
          prerequisites: ['HTML', 'CSS', 'JavaScript'],
          benefits: ['Xây dựng ứng dụng web', 'Hiểu về component-based architecture'],
          relatedLinks: ['https://reactjs.org', 'https://react.dev'],
          instructorId: 'instructor1',
          price: 299000,
          isPublished: true,
          isApproved: true,
          upvotes: 45,
          reports: 0,
          enrolledStudents: ['student1', 'student2', 'student3'],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          _id: '2',
          title: 'Advanced JavaScript',
          description: 'Nâng cao kỹ năng JavaScript',
          thumbnail: '/images/js-course.jpg',
          domain: 'IT',
          level: 'advanced',
          prerequisites: ['JavaScript basics'],
          benefits: ['Hiểu sâu về JavaScript', 'ES6+ features'],
          relatedLinks: ['https://developer.mozilla.org'],
          instructorId: 'instructor2',
          price: 399000,
          isPublished: true,
          isApproved: true,
          upvotes: 32,
          reports: 1,
          enrolledStudents: ['student1', 'student4', 'student5'],
          createdAt: '2024-01-02T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z'
        },
        {
          _id: '3',
          title: 'Python Data Science',
          description: 'Phân tích dữ liệu với Python',
          thumbnail: '/images/python-course.jpg',
          domain: 'IT',
          level: 'intermediate',
          prerequisites: ['Python basics'],
          benefits: ['Phân tích dữ liệu', 'Machine Learning cơ bản'],
          relatedLinks: ['https://python.org'],
          instructorId: 'instructor3',
          price: 499000,
          isPublished: true,
          isApproved: true,
          upvotes: 67,
          reports: 0,
          enrolledStudents: ['student1', 'student6', 'student7', 'student8'],
          createdAt: '2024-01-03T00:00:00Z',
          updatedAt: '2024-01-03T00:00:00Z'
        },
        {
          _id: '4',
          title: 'UI/UX Design',
          description: 'Thiết kế giao diện người dùng',
          thumbnail: '/images/design-course.jpg',
          domain: 'Design',
          level: 'beginner',
          prerequisites: ['Không yêu cầu'],
          benefits: ['Thiết kế UI/UX', 'Prototyping'],
          relatedLinks: ['https://figma.com'],
          instructorId: 'instructor4',
          price: 199000,
          isPublished: true,
          isApproved: true,
          upvotes: 28,
          reports: 0,
          enrolledStudents: ['student9', 'student10'],
          createdAt: '2024-01-04T00:00:00Z',
          updatedAt: '2024-01-04T00:00:00Z'
        },
        {
          _id: '5',
          title: 'Mobile App Development',
          description: 'Phát triển ứng dụng di động',
          thumbnail: '/images/mobile-course.jpg',
          domain: 'IT',
          level: 'intermediate',
          prerequisites: ['JavaScript', 'React basics'],
          benefits: ['React Native', 'Mobile app development'],
          relatedLinks: ['https://reactnative.dev'],
          instructorId: 'instructor5',
          price: 599000,
          isPublished: true,
          isApproved: true,
          upvotes: 41,
          reports: 2,
          enrolledStudents: ['student11', 'student12', 'student13'],
          createdAt: '2024-01-05T00:00:00Z',
          updatedAt: '2024-01-05T00:00:00Z'
        }
      ];
      setCourses(mockCourses);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      course.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesDomain = filters.domain === 'all' || course.domain === filters.domain;
    const matchesLevel = filters.level === 'all' || course.level === filters.level;

    return matchesSearch && matchesDomain && matchesLevel;
  });

  const handleFilterChange = (newFilters: Partial<CourseFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return '#10B981';
      case 'intermediate':
        return '#F59E0B';
      case 'advanced':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'Cơ bản';
      case 'intermediate':
        return 'Trung cấp';
      case 'advanced':
        return 'Nâng cao';
      default:
        return level;
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard__header">
          <div className="dashboard__breadcrumbs">
            <span>Dashboard</span>
            <span>/</span>
            <span>Khóa học của tôi</span>
          </div>
          <h1 className="dashboard__title">Khóa học của tôi</h1>
        </div>
        <div className="dashboard__content">
          <div className="dashboard__loading">
            <div className="dashboard__loading-spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard__header">
        <div className="dashboard__breadcrumbs">
          <span>Dashboard</span>
          <span>/</span>
          <span>Khóa học của tôi</span>
        </div>
        <h1 className="dashboard__title">Khóa học của tôi</h1>
      </div>

      {/* Content */}
      <div className="dashboard__content">
        {/* Stats */}
        <CourseStats courses={courses} />

        {/* Filters */}
        <div className="dashboard__section">
          <div className="dashboard__section-header">
            <h2>Bộ lọc</h2>
            <p>Tìm kiếm và lọc khóa học theo nhu cầu</p>
          </div>

          <div className="dashboard__search--parent">
            <div className="dashboard__search">
              <input
                type="text"
                placeholder="Tìm kiếm khóa học..."
                value={filters.search}
                onChange={(e) => handleFilterChange({ search: e.target.value })}
              />
              <button>🔍</button>
            </div>

            <div className="dashboard__filters">
              <select
                value={filters.domain}
                onChange={(e) => handleFilterChange({ domain: e.target.value })}
              >
                <option value="all">Tất cả lĩnh vực</option>
                <option value="IT">IT</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>

            <div className="dashboard__filters">
              <select
                value={filters.level}
                onChange={(e) => handleFilterChange({ level: e.target.value as 'all' | 'beginner' | 'intermediate' | 'advanced' })}
              >
                <option value="all">Tất cả cấp độ</option>
                <option value="beginner">Cơ bản</option>
                <option value="intermediate">Trung cấp</option>
                <option value="advanced">Nâng cao</option>
              </select>
            </div>
          </div>
        </div>

        {/* Courses List */}
        <div className="dashboard__section">
          <div className="dashboard__section-header">
            <h2>Danh sách khóa học ({filteredCourses.length})</h2>
            <p>Quản lý tất cả khóa học bạn đã đăng ký</p>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="dashboard__empty">
              <div className="dashboard__empty-icon">📚</div>
              <h3>Không có khóa học nào</h3>
              <p>Bạn chưa đăng ký khóa học nào hoặc không có kết quả tìm kiếm</p>
            </div>
          ) : (
            <div className="dashboard__courses-grid">
              {filteredCourses.map((course) => (
                <div key={course._id} className="dashboard__course-card">
                  <div className="course-thumbnail course-thumbnail-analytics">
                    <img src={course.thumbnail} alt={course.title} />
                    <div className="course-level" style={{ backgroundColor: getLevelColor(course.level) }}>
                      {getLevelText(course.level)}
                    </div>

                  </div>

                  <div className="course-content">
                    <div className="course-header">
                      <h3 className="course-title">{course.title}</h3>
                      <div className="course-rating">
                        <span className="rating-stars">⭐⭐⭐⭐⭐</span>
                        <span className="rating-count">({course.upvotes} đánh giá)</span>
                      </div>
                    </div>

                    <p className="course-description">{course.description}</p>

                    <div className="course-meta">
                      <div className="meta-item">
                        <span className="meta-icon">🏷️</span>
                        <span className="meta-label">Lĩnh vực:</span>
                        <span className="meta-value">{course.domain}</span>
                      </div>

                      <div className="meta-item">
                        <span className="meta-icon">📚</span>
                        <span className="meta-label">Yêu cầu:</span>
                        <span className="meta-value">{course.prerequisites.length} điều kiện</span>
                      </div>

                      <div className="meta-item">
                        <span className="meta-icon">👥</span>
                        <span className="meta-label">Học viên:</span>
                        <span className="meta-value">{course.enrolledStudents.length} người</span>
                      </div>

                      <div className="meta-item">
                        <span className="meta-icon">📊</span>
                        <span className="meta-label">Đánh giá:</span>
                        <span className="meta-value">
                          {course.upvotes}
                          {course.reports > 0 && ` | ${course.reports} ⚠️`}
                        </span>
                      </div>
                    </div>

                    <div className="course-benefits">
                      <h4 className="benefits-title">🎯 Lợi ích khóa học:</h4>
                      <div className="benefits-list">
                        {course.benefits.slice(0, 3).map((benefit, index) => (
                          <span key={index} className="benefit-tag">
                            {benefit}
                          </span>
                        ))}
                        {course.benefits.length > 3 && (
                          <span className="benefit-more">+{course.benefits.length - 3} khác</span>
                        )}
                      </div>
                    </div>

                    <div className="course-footer">
                      <div className="course-price">
                        <span className="price-label">Giá khóa học:</span>
                        <span className="price-value">{formatPrice(course.price)}</span>
                      </div>

                      <div className="course-actions">
                        <button className="dashboard__btn dashboard__btn--primary">
                          {/* <span className="btn-icon">🎯</span> */}
                          Tiếp tục học
                        </button>
                        <button className="dashboard__btn dashboard__btn--outline">
                          {/* <span className="btn-icon">👁️</span> */}
                          Xem chi tiết
                        </button>
                        <button className="dashboard__btn dashboard__btn--secondary">
                          {/* <span className="btn-icon">📚</span> */}
                          Nội dung
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCourses;