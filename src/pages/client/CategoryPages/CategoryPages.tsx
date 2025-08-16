import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './CategoryPages.css';

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: {
    name: string;
    avatar: string;
  };
  price: number;
  rating: number;
  studentsCount: number;
  level: string;
  duration: number;
  isNew?: boolean;
  isPopular?: boolean;
}

interface Category {
  _id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  courseCount: number;
}

const CategoryPages: React.FC = () => {
  const { domain } = useParams<{ domain: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    level: '',
    priceRange: '',
    rating: '',
    duration: ''
  });
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const mockCategory: Category = {
        _id: domain || 'programming',
        name: domain === 'programming' ? 'Lập trình' : 
              domain === 'design' ? 'Thiết kế' :
              domain === 'business' ? 'Kinh doanh' : 'Marketing',
        description: domain === 'programming' ? 'Học lập trình từ cơ bản đến nâng cao với các ngôn ngữ phổ biến' :
                    domain === 'design' ? 'Thiết kế giao diện, đồ họa và trải nghiệm người dùng' :
                    domain === 'business' ? 'Kiến thức kinh doanh, quản lý và khởi nghiệp' : 
                    'Marketing số, quảng cáo và truyền thông',
        icon: domain === 'programming' ? '💻' : 
              domain === 'design' ? '🎨' :
              domain === 'business' ? '💼' : '📢',
        color: domain === 'programming' ? '#3498db' : 
               domain === 'design' ? '#e74c3c' :
               domain === 'business' ? '#2ecc71' : '#f39c12',
        courseCount: 156
      };

      const mockCourses: Course[] = [
        {
          _id: '1',
          title: 'React Advanced Patterns',
          description: 'Học các pattern nâng cao trong React để xây dựng ứng dụng chuyên nghiệp',
          thumbnail: '/images/course1.jpg',
          instructor: { name: 'Hieu Doan', avatar: '/images/avatar1.jpg' },
          price: 299000,
          rating: 4.8,
          studentsCount: 1250,
          level: 'Advanced',
          duration: 1800,
          isPopular: true
        },
        {
          _id: '2',
          title: 'Node.js Backend Development',
          description: 'Xây dựng REST API và backend services với Node.js và Express',
          thumbnail: '/images/course2.jpg',
          instructor: { name: 'Minh Nguyen', avatar: '/images/avatar2.jpg' },
          price: 399000,
          rating: 4.6,
          studentsCount: 890,
          level: 'Intermediate',
          duration: 2400,
          isNew: true
        },
        {
          _id: '3',
          title: 'Python for Data Science',
          description: 'Phân tích dữ liệu và machine learning với Python',
          thumbnail: '/images/course3.jpg',
          instructor: { name: 'Lan Tran', avatar: '/images/avatar3.jpg' },
          price: 199000,
          rating: 4.9,
          studentsCount: 2100,
          level: 'Beginner',
          duration: 1200,
          isPopular: true
        },
        {
          _id: '4',
          title: 'JavaScript Fundamentals',
          description: 'Nền tảng JavaScript cơ bản cho người mới bắt đầu',
          thumbnail: '/images/course4.jpg',
          instructor: { name: 'Nam Le', avatar: '/images/avatar4.jpg' },
          price: 150000,
          rating: 4.7,
          studentsCount: 1800,
          level: 'Beginner',
          duration: 900
        }
      ];

      setCategory(mockCategory);
      setCourses(mockCourses);
      setLoading(false);
    }, 1000);
  }, [domain]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="category-page">
        <div className="category-loading">
          <div className="loading-spinner"></div>
          <p>Đang tải danh mục...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="category-page">
        <div className="category-not-found">
          <h1>Không tìm thấy danh mục</h1>
          <p>Danh mục bạn tìm kiếm không tồn tại.</p>
          <Link to="/courses" className="back-to-courses-btn">
            Quay lại danh sách khóa học
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="category-page">
      {/* Category Header */}
      <div className="category-header" style={{ backgroundColor: category.color + '20' }}>
        <div className="category-header__content">
          <div className="category-icon" style={{ backgroundColor: category.color }}>
            <span>{category.icon}</span>
          </div>
          <div className="category-info">
            <h1>{category.name}</h1>
            <p>{category.description}</p>
            <div className="category-stats">
              <span>{category.courseCount} khóa học</span>
              <span>•</span>
              <span>Nhiều trình độ</span>
              <span>•</span>
              <span>Giảng viên chất lượng</span>
            </div>
          </div>
        </div>
      </div>

      <div className="category-content">
        {/* Filters and Controls */}
        <div className="category-controls">
          <div className="filters">
            <select 
              value={filters.level} 
              onChange={(e) => handleFilterChange('level', e.target.value)}
              className="filter-select"
            >
              <option value="">Tất cả trình độ</option>
              <option value="Beginner">Người mới bắt đầu</option>
              <option value="Intermediate">Trung cấp</option>
              <option value="Advanced">Nâng cao</option>
            </select>

            <select 
              value={filters.priceRange} 
              onChange={(e) => handleFilterChange('priceRange', e.target.value)}
              className="filter-select"
            >
              <option value="">Tất cả giá</option>
              <option value="free">Miễn phí</option>
              <option value="0-200k">Dưới 200k</option>
              <option value="200k-500k">200k - 500k</option>
              <option value="500k+">Trên 500k</option>
            </select>

            <select 
              value={filters.rating} 
              onChange={(e) => handleFilterChange('rating', e.target.value)}
              className="filter-select"
            >
              <option value="">Tất cả đánh giá</option>
              <option value="4.5+">4.5+ sao</option>
              <option value="4.0+">4.0+ sao</option>
              <option value="3.5+">3.5+ sao</option>
            </select>
          </div>

          <div className="controls">
            <div className="view-toggle">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                ⏹️ Grid
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                📋 List
              </button>
            </div>

            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="popular">Phổ biến nhất</option>
              <option value="newest">Mới nhất</option>
              <option value="rating">Đánh giá cao nhất</option>
              <option value="price-low">Giá thấp nhất</option>
              <option value="price-high">Giá cao nhất</option>
            </select>
          </div>
        </div>

        {/* Course Grid/List */}
        <div className={`courses-container ${viewMode}`}>
          {courses.map((course) => (
            <div key={course._id} className={`course-card ${viewMode}`}>
              <div className="course-badges">
                {course.isNew && <span className="badge new">Mới</span>}
                {course.isPopular && <span className="badge popular">Phổ biến</span>}
              </div>
              
              <div className="course-thumbnail course-thumbnail-analytics">
                <img src={course.thumbnail} alt={course.title} />
                <div className="course-overlay">
                  <Link to={`/courses/${course._id}`} className="view-course-btn">
                    Xem khóa học
                  </Link>
                </div>
              </div>

              <div className="course-content">
                <h3 className="course-title">
                  <Link to={`/courses/${course._id}`}>{course.title}</Link>
                </h3>
                
                <p className="course-description">{course.description}</p>
                
                <div className="course-meta">
                  <div className="instructor">
                    <img src={course.instructor.avatar} alt={course.instructor.name} />
                    <span>{course.instructor.name}</span>
                  </div>
                  
                  <div className="course-stats">
                    <span className="rating">⭐ {course.rating}</span>
                    <span className="students">👥 {course.studentsCount}</span>
                    <span className="duration">⏱️ {formatDuration(course.duration)}</span>
                  </div>
                </div>

                <div className="course-footer">
                  <div className="course-tags">
                    <span className="tag level">{course.level}</span>
                  </div>
                  <div className="course-price">
                    <span className="price">{formatPrice(course.price)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="load-more">
          <button className="load-more-btn">
            Tải thêm khóa học
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryPages;
