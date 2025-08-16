import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CourseStudio.css';

interface TeacherCourse {
  _id: string;
  title: string;
  thumbnail: string;
  domain: string;
  level: string;
  price: number;
  status: 'draft' | 'published' | 'pending' | 'rejected';
  studentsCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
  sectionsCount: number;
  lessonsCount: number;
}

const CourseStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'draft' | 'published' | 'pending' | 'rejected'>('all');
  const [courses, setCourses] = useState<TeacherCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockCourses: TeacherCourse[] = [
        {
          _id: '1',
          title: 'React Advanced Patterns',
          thumbnail: '/images/apollo.png',
          domain: 'Web Development',
          level: 'advanced',
          price: 299000,
          status: 'published',
          studentsCount: 156,
          rating: 4.8,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T00:00:00Z',
          sectionsCount: 8,
          lessonsCount: 45
        },
        {
          _id: '2',
          title: 'Node.js Backend Development',
          thumbnail: '/images/aptech.png',
          domain: 'Backend Development',
          level: 'intermediate',
          price: 399000,
          status: 'draft',
          studentsCount: 0,
          rating: 0,
          createdAt: '2024-01-10T00:00:00Z',
          updatedAt: '2024-01-14T00:00:00Z',
          sectionsCount: 6,
          lessonsCount: 32
        },
        {
          _id: '3',
          title: 'UI/UX Design Fundamentals',
          thumbnail: '/images/codegym.png',
          domain: 'Design',
          level: 'beginner',
          price: 199000,
          status: 'pending',
          studentsCount: 0,
          rating: 0,
          createdAt: '2024-01-05T00:00:00Z',
          updatedAt: '2024-01-12T00:00:00Z',
          sectionsCount: 5,
          lessonsCount: 28
        },
        {
          _id: '4',
          title: 'Python Data Science',
          thumbnail: '/images/funix.png',
          domain: 'Data Science',
          level: 'advanced',
          price: 499000,
          status: 'published',
          studentsCount: 89,
          rating: 4.9,
          createdAt: '2023-12-15T00:00:00Z',
          updatedAt: '2024-01-10T00:00:00Z',
          sectionsCount: 10,
          lessonsCount: 52
        }
      ];
      setCourses(mockCourses);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesTab = activeTab === 'all' || course.status === activeTab;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.domain.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'Bản nháp', class: 'status-badge--draft' },
      published: { label: 'Đã xuất bản', class: 'status-badge--published' },
      pending: { label: 'Chờ duyệt', class: 'status-badge--pending' },
      rejected: { label: 'Bị từ chối', class: 'status-badge--rejected' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`status-badge ${config.class}`}>
        {config.label}
      </span>
    );
  };

  const getLevelBadge = (level: string) => {
    const levelConfig = {
      beginner: { label: 'Cơ bản', class: 'level-badge--beginner' },
      intermediate: { label: 'Trung cấp', class: 'level-badge--intermediate' },
      advanced: { label: 'Nâng cao', class: 'level-badge--advanced' }
    };
    
    const config = levelConfig[level as keyof typeof levelConfig];
    return (
      <span className={`level-badge ${config.class}`}>
        {config.label}
      </span>
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatsSummary = () => {
    const total = courses.length;
    const published = courses.filter(c => c.status === 'published').length;
    const draft = courses.filter(c => c.status === 'draft').length;
    const pending = courses.filter(c => c.status === 'pending').length;
    const totalStudents = courses.reduce((sum, c) => sum + c.studentsCount, 0);
    const totalRevenue = courses
      .filter(c => c.status === 'published')
      .reduce((sum, c) => sum + (c.price * c.studentsCount), 0);

    return { total, published, draft, pending, totalStudents, totalRevenue };
  };

  const stats = getStatsSummary();

  if (loading) {
    return (
      <div className="teacher-dashboard">
        <div className="teacher-dashboard__header">
          <div className="teacher-dashboard__breadcrumbs">
            <span>Teacher Dashboard</span>
            <span>/</span>
            <span>Course Studio</span>
          </div>
          <h1 className="teacher-dashboard__title">Course Studio</h1>
        </div>
        <div className="teacher-dashboard__content">
          <div className="dashboard__loading">
            <div className="dashboard__loading-spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-dashboard">
      <div className="teacher-dashboard__header">
        <div className="teacher-dashboard__breadcrumbs">
          <span>Teacher Dashboard</span>
          <span>/</span>
          <span>Course Studio</span>
        </div>
        <h1 className="teacher-dashboard__title">Course Studio</h1>
      </div>

      <div className="teacher-dashboard__content">
        {/* Stats Overview */}
        <div className="course-studio__stats">
          <div className="stat-card">
            <div className="stat-card__icon">📚</div>
            <div className="stat-card__content">
              <h3>{stats.total}</h3>
              <p>Tổng khóa học</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card__icon">✅</div>
            <div className="stat-card__content">
              <h3>{stats.published}</h3>
              <p>Đã xuất bản</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card__icon">👥</div>
            <div className="stat-card__content">
              <h3>{stats.totalStudents}</h3>
              <p>Tổng học viên</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card__icon">💰</div>
            <div className="stat-card__content">
              <h3>{formatPrice(stats.totalRevenue)}</h3>
              <p>Doanh thu</p>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="course-studio__header-actions">
          <div className="course-studio__search">
            <input
              type="text"
              placeholder="Tìm kiếm khóa học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button>🔍</button>
          </div>
          <Link to="/teacher/courses/new" className="teacher-dashboard__btn teacher-dashboard__btn--primary">
            ➕ Tạo khóa học mới
          </Link>
        </div>

        {/* Tabs */}
        <div className="teacher-dashboard__tabs">
          <button
            className={`teacher-dashboard__tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Tất cả ({stats.total})
          </button>
          <button
            className={`teacher-dashboard__tab ${activeTab === 'published' ? 'active' : ''}`}
            onClick={() => setActiveTab('published')}
          >
            Đã xuất bản ({stats.published})
          </button>
          <button
            className={`teacher-dashboard__tab ${activeTab === 'draft' ? 'active' : ''}`}
            onClick={() => setActiveTab('draft')}
          >
            Bản nháp ({stats.draft})
          </button>
          <button
            className={`teacher-dashboard__tab ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Chờ duyệt ({stats.pending})
          </button>
        </div>

        {/* Courses List */}
        <div className="course-studio__courses">
          {filteredCourses.length === 0 ? (
            <div className="course-studio__empty">
              <div className="empty__icon">📚</div>
              <h3>Không có khóa học nào</h3>
              <p>Bạn chưa có khóa học nào hoặc không có khóa học nào khớp với bộ lọc hiện tại.</p>
              <Link to="/teacher/courses/new" className="teacher-dashboard__btn teacher-dashboard__btn--primary">
                Tạo khóa học đầu tiên
              </Link>
            </div>
          ) : (
            <div className="courses__grid">
              {filteredCourses.map((course) => (
                <div key={course._id} className="course-card">
                  <div className="course-card__thumbnail">
                    <img src={course.thumbnail} alt={course.title} />
                    <div className="course-card__status">
                      {getStatusBadge(course.status)}
                    </div>
                  </div>
                  
                  <div className="course-card__content">
                    <h3 className="course-card__title">{course.title}</h3>
                    
                    <div className="course-card__meta">
                      <div className="meta-row">
                        <span className="meta-label">Lĩnh vực:</span>
                        <span className="meta-value">{course.domain}</span>
                      </div>
                      <div className="meta-row">
                        <span className="meta-label">Cấp độ:</span>
                        <span className="meta-value">{getLevelBadge(course.level)}</span>
                      </div>
                      <div className="meta-row">
                        <span className="meta-label">Giá:</span>
                        <span className="meta-value price">{formatPrice(course.price)}</span>
                      </div>
                    </div>
                    
                    <div className="course-card__stats">
                      <div className="stat-item">
                        <span className="stat-icon">📖</span>
                        <span>{course.sectionsCount} sections</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-icon">🎯</span>
                        <span>{course.lessonsCount} lessons</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-icon">👥</span>
                        <span>{course.studentsCount} students</span>
                      </div>
                      {course.rating > 0 && (
                        <div className="stat-item">
                          <span className="stat-icon">⭐</span>
                          <span>{course.rating}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="course-card__actions">
                      <Link 
                        to={`/teacher/courses/${course._id}/edit`}
                        className="teacher-dashboard__btn teacher-dashboard__btn--outline"
                      >
                        ✏️ Chỉnh sửa
                      </Link>
                      <Link 
                        to={`/teacher/courses/${course._id}/structure`}
                        className="teacher-dashboard__btn teacher-dashboard__btn--secondary"
                      >
                        🏗️ Cấu trúc
                      </Link>
                    </div>
                    
                    <div className="course-card__footer">
                      <span className="footer-text">
                        Cập nhật: {formatDate(course.updatedAt)}
                      </span>
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

export default CourseStudio;
