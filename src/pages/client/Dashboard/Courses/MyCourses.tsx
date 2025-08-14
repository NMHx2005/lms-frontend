import React, { useState, useEffect, useMemo } from 'react';
import { Course, CourseFilter } from '@/components/Client/Dashboard/types';
import CourseStats from '@/components/Client/Dashboard/Courses/CourseStats';
import './MyCourses.css';

const MyCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filters, setFilters] = useState<CourseFilter>({
    status: 'all',
    domain: 'all',
    level: 'all',
    search: ''
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Mock data theo cấu trúc MongoDB chuẩn
  useEffect(() => {
    const mockCourses: Course[] = [
      {
        _id: '64f0d1234567890abcdef123',
        title: 'React Fundamentals',
        description: 'Khóa học React từ cơ bản đến nâng cao, học cách xây dựng ứng dụng web hiện đại với React hooks, context API và best practices. Khóa học bao gồm 24 bài học thực hành và 3 dự án thực tế.',
        thumbnail: '/images/course-1.jpg',
        domain: 'IT',
        level: 'beginner',
        prerequisites: ['HTML cơ bản', 'CSS cơ bản', 'JavaScript cơ bản', 'ES6+ syntax'],
        benefits: ['Xây dựng ứng dụng web hiện đại', 'Hiểu sâu về React ecosystem', 'Có thể apply vào dự án thực tế', 'Nắm vững React hooks và context'],
        relatedLinks: ['https://reactjs.org', 'https://github.com/facebook/react', 'https://react.dev'],
        instructorId: '64f0c1234567890abcdef123',
        price: 500000,
        isPublished: true,
        isApproved: true,
        upvotes: 25,
        reports: 0,
        createdAt: '2025-08-02T03:00:00.000Z',
        updatedAt: '2025-08-02T03:00:00.000Z'
      },
      {
        _id: '64f0d1234567890abcdef124',
        title: 'Advanced Node.js Development',
        description: 'Khóa học nâng cao về Node.js, bao gồm microservices, testing, deployment và performance optimization. Học cách xây dựng backend scalable và maintainable.',
        thumbnail: '/images/course-2.jpg',
        domain: 'IT',
        level: 'advanced',
        prerequisites: ['Node.js cơ bản', 'JavaScript ES6+', 'Database knowledge', 'REST API concepts'],
        benefits: ['Xây dựng microservices', 'Testing và deployment', 'Performance optimization', 'Architecture patterns'],
        relatedLinks: ['https://nodejs.org', 'https://expressjs.com', 'https://jestjs.io'],
        instructorId: '64f0c1234567890abcdef124',
        price: 800000,
        isPublished: true,
        isApproved: true,
        upvotes: 18,
        reports: 1,
        createdAt: '2025-08-01T03:00:00.000Z',
        updatedAt: '2025-08-01T03:00:00.000Z'
      },
      {
        _id: '64f0d1234567890abcdef125',
        title: 'Digital Marketing Strategy',
        description: 'Chiến lược marketing số toàn diện cho doanh nghiệp, bao gồm SEO, social media, content marketing và analytics. Học cách tối ưu hóa ROI và xây dựng brand.',
        thumbnail: '/images/course-3.jpg',
        domain: 'Marketing',
        level: 'intermediate',
        prerequisites: ['Marketing cơ bản', 'Hiểu về digital landscape', 'Google Analytics cơ bản'],
        benefits: ['Xây dựng chiến lược marketing số', 'Tối ưu hóa ROI', 'Phân tích dữ liệu marketing', 'Content strategy'],
        relatedLinks: ['https://google.com/analytics', 'https://ads.google.com', 'https://business.facebook.com'],
        instructorId: '64f0c1234567890abcdef125',
        price: 600000,
        isPublished: true,
        isApproved: false,
        upvotes: 12,
        reports: 0,
        createdAt: '2025-07-30T03:00:00.000Z',
        updatedAt: '2025-07-30T03:00:00.000Z'
      },
      {
        _id: '64f0d1234567890abcdef126',
        title: 'UI/UX Design Principles',
        description: 'Nguyên lý thiết kế giao diện người dùng và trải nghiệm người dùng cho web và mobile applications. Học design thinking và user-centered design.',
        thumbnail: '/images/course-4.jpg',
        domain: 'Design',
        level: 'beginner',
        prerequisites: ['Không yêu cầu kiến thức trước', 'Có thể sử dụng máy tính cơ bản'],
        benefits: ['Thiết kế giao diện đẹp', 'Tạo trải nghiệm người dùng tốt', 'Sử dụng design tools', 'Design thinking'],
        relatedLinks: ['https://figma.com', 'https://sketch.com', 'https://www.adobe.com/products/xd.html'],
        instructorId: '64f0c1234567890abcdef126',
        price: 450000,
        isPublished: false,
        isApproved: false,
        upvotes: 8,
        reports: 0,
        createdAt: '2025-07-28T03:00:00.000Z',
        updatedAt: '2025-07-28T03:00:00.000Z'
      },
      {
        _id: '64f0d1234567890abcdef127',
        title: 'Python Data Science',
        description: 'Khóa học Python cho Data Science, bao gồm pandas, numpy, matplotlib và scikit-learn. Học cách phân tích dữ liệu và xây dựng machine learning models.',
        thumbnail: '/images/course-5.jpg',
        domain: 'IT',
        level: 'intermediate',
        prerequisites: ['Python cơ bản', 'Toán học cơ bản', 'Thống kê cơ bản'],
        benefits: ['Phân tích dữ liệu', 'Machine learning', 'Data visualization', 'Statistical analysis'],
        relatedLinks: ['https://python.org', 'https://pandas.pydata.org', 'https://scikit-learn.org'],
        instructorId: '64f0c1234567890abcdef127',
        price: 750000,
        isPublished: true,
        isApproved: true,
        upvotes: 32,
        reports: 0,
        createdAt: '2025-07-25T03:00:00.000Z',
        updatedAt: '2025-07-25T03:00:00.000Z'
      }
    ];

    setTimeout(() => {
      setCourses(mockCourses);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesDomain = filters.domain === 'all' || course.domain === filters.domain;
      const matchesLevel = filters.level === 'all' || course.level === filters.level;
      const matchesSearch = course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                           course.description.toLowerCase().includes(filters.search.toLowerCase());

      return matchesDomain && matchesLevel && matchesSearch;
    });
  }, [courses, filters]);

  const handleFilterChange = (newFilters: Partial<CourseFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleTabChange = (tab: 'all' | 'published' | 'approved' | 'draft') => {
    setActiveTab(tab);
  };

  const getTabCount = (tab: string) => {
    switch (tab) {
      case 'published':
        return courses.filter(course => course.isPublished).length;
      case 'approved':
        return courses.filter(course => course.isApproved).length;
      case 'draft':
        return courses.filter(course => !course.isPublished).length;
      default:
        return courses.length;
    }
  };

  const getFilteredCoursesByTab = () => {
    switch (activeTab) {
      case 'published':
        return filteredCourses.filter(course => course.isPublished);
      case 'approved':
        return filteredCourses.filter(course => course.isApproved);
      case 'draft':
        return filteredCourses.filter(course => !course.isPublished);
      default:
        return filteredCourses;
    }
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

  const getLevelLabel = (level: string) => {
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
        <div className="dashboard__sidebar">
          <div className="dashboard__sidebar-header">
            <div className="dashboard__logo">
              <img src="/images/logo.png" alt="Logo" />
              <span>LMS Platform</span>
            </div>
          </div>
          <nav className="dashboard__nav">
            <div className="dashboard__nav-item active">
              <span className="dashboard__nav-icon">📚</span>
              <span>Khóa học của tôi</span>
            </div>
            <div className="dashboard__nav-item">
              <span className="dashboard__nav-icon">📊</span>
              <span>Thống kê</span>
            </div>
            <div className="dashboard__nav-item">
              <span className="dashboard__nav-icon">⚙️</span>
              <span>Cài đặt</span>
            </div>
          </nav>
        </div>
        
        <div className="dashboard__main">
          <div className="dashboard__header">
            <div className="dashboard__breadcrumbs">
              <span>Dashboard</span>
              <span>/</span>
              <span>Khóa học của tôi</span>
            </div>
            <h1 className="dashboard__title">Khóa học của tôi</h1>
          </div>
          
          <div className="dashboard__content">
            <div className="dashboard__tabs">
              <button className="dashboard__tab active">Tất cả</button>
              <button className="dashboard__tab">Đã xuất bản</button>
              <button className="dashboard__tab">Đã duyệt</button>
              <button className="dashboard__tab">Bản nháp</button>
            </div>
            
            <div className="dashboard__filter-bar">
              <div className="dashboard__search">
                <input type="text" placeholder="Tìm kiếm khóa học..." />
                <button>🔍</button>
              </div>
              <div className="dashboard__filters">
                <select>
                  <option>Lĩnh vực</option>
                </select>
                <select>
                  <option>Cấp độ</option>
                </select>
              </div>
            </div>
            
            <div className="dashboard__loading">
              <div className="dashboard__loading-spinner"></div>
              <p>Đang tải khóa học...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="dashboard__sidebar">
        <div className="dashboard__sidebar-header">
          <div className="dashboard__logo">
            <img src="/images/logo.png" alt="Logo" />
            <span>LMS Platform</span>
          </div>
        </div>
        <nav className="dashboard__nav">
          <div className="dashboard__nav-item active">
            <span className="dashboard__nav-icon">📚</span>
            <span>Khóa học của tôi</span>
          </div>
          <div className="dashboard__nav-item">
            <span className="dashboard__nav-icon">📊</span>
            <span>Thống kê</span>
          </div>
          <div className="dashboard__nav-item">
            <span className="dashboard__nav-icon">⚙️</span>
            <span>Cài đặt</span>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="dashboard__main">
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
          {/* Tabs */}
          <div className="dashboard__tabs">
            <button 
              className={`dashboard__tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => handleTabChange('all')}
            >
              Tất cả ({getTabCount('all')})
            </button>
            <button 
              className={`dashboard__tab ${activeTab === 'published' ? 'active' : ''}`}
              onClick={() => handleTabChange('published')}
            >
              Đã xuất bản ({getTabCount('published')})
            </button>
            <button 
              className={`dashboard__tab ${activeTab === 'approved' ? 'active' : ''}`}
              onClick={() => handleTabChange('approved')}
            >
              Đã duyệt ({getTabCount('approved')})
            </button>
            <button 
              className={`dashboard__tab ${activeTab === 'draft' ? 'active' : ''}`}
              onClick={() => handleTabChange('draft')}
            >
              Bản nháp ({getTabCount('draft')})
            </button>
          </div>

          {/* Filter Bar */}
          <div className="dashboard__filter-bar">
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
                <option value="Marketing">Marketing</option>
                <option value="Design">Design</option>
                <option value="Economics">Economics</option>
              </select>
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

          {/* Stats Overview */}
          <div className="dashboard__stats">
            <CourseStats courses={courses} />
          </div>

          {/* Course Cards */}
          <div className="dashboard__courses">
            {getFilteredCoursesByTab().length === 0 ? (
              <div className="dashboard__empty">
                <div className="dashboard__empty-icon">📚</div>
                <h3>Không tìm thấy khóa học</h3>
                <p>Hãy thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
              </div>
            ) : (
              <div className="dashboard__courses-grid">
                {getFilteredCoursesByTab().map(course => (
                  <div key={course._id} className="dashboard__course-card">
                    <div className="dashboard__course-image">
                      <img 
                        src={course.thumbnail || '/images/default-course.jpg'} 
                        alt={course.title} 
                      />
                      <div className="dashboard__course-status">
                        {course.isPublished ? (
                          <span className="dashboard__status-badge dashboard__status-badge--published">
                            Đã xuất bản
                          </span>
                        ) : (
                          <span className="dashboard__status-badge dashboard__status-badge--draft">
                            Bản nháp
                          </span>
                        )}
                        {course.isApproved && (
                          <span className="dashboard__status-badge dashboard__status-badge--approved">
                            Đã duyệt
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="dashboard__course-content">
                      <div className="dashboard__course-header">
                        <h3 className="dashboard__course-title">{course.title}</h3>
                        <div className="dashboard__course-meta">
                          <span className="dashboard__course-domain">{course.domain}</span>
                          <span className="dashboard__course-level">{getLevelLabel(course.level)}</span>
                        </div>
                      </div>
                      
                      <p className="dashboard__course-description">{course.description}</p>
                      
                      <div className="dashboard__course-details">
                        <div className="dashboard__course-prerequisites">
                          <strong>Yêu cầu:</strong>
                          <div className="dashboard__course-tags">
                            {course.prerequisites.slice(0, 2).map((prereq, index) => (
                              <span key={index} className="dashboard__course-tag">
                                {prereq}
                              </span>
                            ))}
                            {course.prerequisites.length > 2 && (
                              <span className="dashboard__course-tag dashboard__course-tag--more">
                                +{course.prerequisites.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="dashboard__course-stats">
                          <div className="dashboard__course-stat">
                            <span className="dashboard__course-stat-icon">👍</span>
                            <span>{course.upvotes}</span>
                          </div>
                          <div className="dashboard__course-stat">
                            <span className="dashboard__course-stat-icon">💰</span>
                            <span>{formatPrice(course.price)}</span>
                          </div>
                          <div className="dashboard__course-stat">
                            <span className="dashboard__course-stat-icon">📅</span>
                            <span>{formatDate(course.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="dashboard__course-actions">
                        <button className="dashboard__btn dashboard__btn--primary">
                          Chỉnh sửa
                        </button>
                        <button className="dashboard__btn dashboard__btn--outline">
                          Xem chi tiết
                        </button>
                        {!course.isPublished && (
                          <button className="dashboard__btn dashboard__btn--secondary">
                            Xuất bản
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCourses;
