import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import './SearchResults.css';
import TopBar from '@/components/Client/Home/TopBar/TopBar';
import Header from '@/components/Layout/client/Header';
import Footer from '@/components/Layout/client/Footer';

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: string;
  instructorAvatar: string;
  rating: number;
  totalStudents: number;
  price: number;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags: string[];
  createdAt: string;
}

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'all',
    level: 'all',
    priceRange: 'all',
    rating: 'all',
    duration: 'all'
  });
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const mockCourses: Course[] = [
        {
          _id: '1',
          title: 'React Advanced Patterns & Best Practices',
          description: 'Master advanced React concepts including hooks, context, performance optimization, and modern patterns.',
          thumbnail: '/images/course1.jpg',
          instructor: 'Sarah Johnson',
          instructorAvatar: '/images/avatar1.jpg',
          rating: 4.8,
          totalStudents: 1247,
          price: 299000,
          duration: '12 giờ',
          level: 'advanced',
          category: 'Web Development',
          tags: ['React', 'JavaScript', 'Frontend', 'Advanced'],
          createdAt: '2024-01-15'
        },
        {
          _id: '2',
          title: 'Node.js Backend Development Masterclass',
          description: 'Build scalable backend applications with Node.js, Express, and MongoDB. Learn authentication, APIs, and deployment.',
          thumbnail: '/images/course2.jpg',
          instructor: 'Michael Chen',
          instructorAvatar: '/images/avatar2.jpg',
          rating: 4.6,
          totalStudents: 892,
          price: 249000,
          duration: '15 giờ',
          level: 'intermediate',
          category: 'Backend Development',
          tags: ['Node.js', 'Express', 'MongoDB', 'API'],
          createdAt: '2024-01-10'
        },
        {
          _id: '3',
          title: 'UI/UX Design Fundamentals for Developers',
          description: 'Learn essential design principles, user research, wireframing, and prototyping to create better user experiences.',
          thumbnail: '/images/course3.jpg',
          instructor: 'Emma Rodriguez',
          instructorAvatar: '/images/avatar3.jpg',
          rating: 4.7,
          totalStudents: 567,
          price: 199000,
          duration: '10 giờ',
          level: 'beginner',
          category: 'Design',
          tags: ['UI/UX', 'Design', 'Prototyping', 'User Research'],
          createdAt: '2024-01-05'
        },
        {
          _id: '4',
          title: 'Python Data Science & Machine Learning',
          description: 'Explore data analysis, visualization, and machine learning algorithms using Python and popular libraries.',
          thumbnail: '/images/course4.jpg',
          instructor: 'David Kim',
          instructorAvatar: '/images/avatar4.jpg',
          rating: 4.9,
          totalStudents: 2034,
          price: 349000,
          duration: '18 giờ',
          level: 'intermediate',
          category: 'Data Science',
          tags: ['Python', 'Data Science', 'Machine Learning', 'AI'],
          createdAt: '2024-01-20'
        },
        {
          _id: '5',
          title: 'Mobile App Development with React Native',
          description: 'Build cross-platform mobile apps using React Native. Learn navigation, state management, and native features.',
          thumbnail: '/images/course5.jpg',
          instructor: 'Lisa Wang',
          instructorAvatar: '/images/avatar5.jpg',
          rating: 4.5,
          totalStudents: 445,
          price: 279000,
          duration: '14 giờ',
          level: 'intermediate',
          category: 'Mobile Development',
          tags: ['React Native', 'Mobile', 'JavaScript', 'Cross-platform'],
          createdAt: '2024-01-12'
        },
        {
          _id: '6',
          title: 'DevOps & CI/CD Pipeline Mastery',
          description: 'Master DevOps practices, Docker, Kubernetes, and automated deployment pipelines for modern applications.',
          thumbnail: '/images/course6.jpg',
          instructor: 'Alex Thompson',
          instructorAvatar: '/images/avatar6.jpg',
          rating: 4.7,
          totalStudents: 678,
          price: 399000,
          duration: '16 giờ',
          level: 'advanced',
          category: 'DevOps',
          tags: ['DevOps', 'Docker', 'Kubernetes', 'CI/CD'],
          createdAt: '2024-01-08'
        }
      ];

      // Filter courses based on search query
      const filteredCourses = mockCourses.filter(course =>
        course.title.toLowerCase().includes(query.toLowerCase()) ||
        course.description.toLowerCase().includes(query.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
        course.category.toLowerCase().includes(query.toLowerCase())
      );

      setCourses(filteredCourses);
      setLoading(false);
    }, 1000);
  }, [query]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return '#10B981';
      case 'intermediate': return '#F59E0B';
      case 'advanced': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner': return 'Cơ bản';
      case 'intermediate': return 'Trung cấp';
      case 'advanced': return 'Nâng cao';
      default: return 'Không xác định';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>
        ⭐
      </span>
    ));
  };

  if (loading) {
    return (
      <>
      <TopBar />
      <Header />
      <div className="search-results">
        <div className="search-results__header">
          <div className="search-loading">
            <div className="loading-spinner"></div>
            <h2>Đang tìm kiếm "{query}"...</h2>
            <p>Vui lòng chờ trong giây lát</p>
          </div>
        </div>
      </div>
      <Footer />
      </>
    );
  }

  return (
    <>
    <TopBar />
    <Header />
      <div className="search-results">
        <div className="search-results__content">
          <div className="search-sidebar">
            <div className="filter-section">
              <h3>Bộ lọc tìm kiếm</h3>

              <div className="filter-group">
                <label>Danh mục</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                >
                  <option value="all">Tất cả danh mục</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Backend Development">Backend Development</option>
                  <option value="Design">Design</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="DevOps">DevOps</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Cấp độ</label>
                <select
                  value={filters.level}
                  onChange={(e) => setFilters({ ...filters, level: e.target.value })}
                >
                  <option value="all">Tất cả cấp độ</option>
                  <option value="beginner">Cơ bản</option>
                  <option value="intermediate">Trung cấp</option>
                  <option value="advanced">Nâng cao</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Khoảng giá</label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                >
                  <option value="all">Tất cả giá</option>
                  <option value="free">Miễn phí</option>
                  <option value="0-200">Dưới 200k</option>
                  <option value="200-500">200k - 500k</option>
                  <option value="500+">Trên 500k</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Đánh giá</label>
                <select
                  value={filters.rating}
                  onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                >
                  <option value="all">Tất cả đánh giá</option>
                  <option value="4.5+">4.5+ sao</option>
                  <option value="4.0+">4.0+ sao</option>
                  <option value="3.5+">3.5+ sao</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Thời lượng</label>
                <select
                  value={filters.duration}
                  onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
                >
                  <option value="all">Tất cả thời lượng</option>
                  <option value="0-5">Dưới 5 giờ</option>
                  <option value="5-10">5-10 giờ</option>
                  <option value="10-15">10-15 giờ</option>
                  <option value="15+">Trên 15 giờ</option>
                </select>
              </div>
            </div>
          </div>

          <div className="search-main">
            <div className="search-controls">
              <div className="search-controls__left">
                <div className="view-toggle">
                  <button
                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <span className="icon">⊞</span>
                    Grid
                  </button>
                  <button
                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <span className="icon">☰</span>
                    List
                  </button>
                </div>
              </div>

              <div className="search-controls__right">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="relevance">Sắp xếp theo độ liên quan</option>
                  <option value="newest">Mới nhất</option>
                  <option value="rating">Đánh giá cao nhất</option>
                  <option value="price-low">Giá thấp nhất</option>
                  <option value="price-high">Giá cao nhất</option>
                  <option value="students">Nhiều học viên nhất</option>
                </select>
              </div>
            </div>

            {courses.length === 0 ? (
              <div className="no-results">
                <div className="no-results__icon">🔍</div>
                <h3>Không tìm thấy kết quả</h3>
                <p>Không có khóa học nào phù hợp với từ khóa "{query}"</p>
                <div className="no-results__suggestions">
                  <h4>Gợi ý tìm kiếm:</h4>
                  <ul>
                    <li>Kiểm tra chính tả của từ khóa</li>
                    <li>Thử từ khóa khác, ngắn hơn</li>
                    <li>Thử từ khóa đồng nghĩa</li>
                    <li>Bỏ bớt bộ lọc tìm kiếm</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className={`courses-container ${viewMode}`}>
                {courses.map((course) => (
                  <div key={course._id} className="course-card">
                    <div className="course-card__image">
                      <img src={course.thumbnail} alt={course.title} />
                      <div className="course-card__overlay">
                        <button className="preview-btn">Xem trước</button>
                      </div>
                    </div>

                    <div className="course-card__content">
                      <div className="course-card__header">
                        <h3 className="course-title">{course.title}</h3>
                        <div className="course-meta">
                          <span className="course-level" style={{ backgroundColor: getLevelColor(course.level) }}>
                            {getLevelText(course.level)}
                          </span>
                          <span className="course-duration">⏱ {course.duration}</span>
                        </div>
                      </div>

                      <p className="course-description">{course.description}</p>

                      <div className="course-instructor">
                        <img src={course.instructorAvatar} alt={course.instructor} />
                        <span>{course.instructor}</span>
                      </div>

                      <div className="course-stats">
                        <div className="course-rating">
                          {renderStars(course.rating)}
                          <span className="rating-text">{course.rating}</span>
                          <span className="students-count">({course.totalStudents} học viên)</span>
                        </div>
                      </div>

                      <div className="course-tags">
                        {course.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="tag">{tag}</span>
                        ))}
                      </div>

                      <div className="course-card__footer">
                        <div className="course-price">
                          <span className="price-amount">{formatPrice(course.price)} ₫</span>
                          <span className="price-label">Khóa học</span>
                        </div>
                        <Link to={`/courses/${course._id}`} className="view-course-btn">
                          Xem khóa học
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SearchResults;