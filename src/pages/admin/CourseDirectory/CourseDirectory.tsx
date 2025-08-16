import React, { useState, useEffect } from 'react';
import './CourseDirectory.css';

interface Course {
  _id: string;
  title: string;
  instructor: {
    name: string;
    email: string;
    avatar: string;
  };
  category: string;
  subcategory: string;
  price: number;
  originalPrice?: number;
  status: 'published' | 'draft' | 'archived' | 'suspended';
  enrollmentCount: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  featured: boolean;
  tags: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  lessons: number;
  language: string;
  certificate: boolean;
  lastEnrollment: string;
  revenue: number;
}

interface CourseFilters {
  search: string;
  status: string;
  category: string;
  level: string;
  featured: string;
  instructor: string;
}

const CourseDirectory: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<CourseFilters>({
    search: '',
    status: 'all',
    category: 'all',
    level: 'all',
    featured: 'all',
    instructor: ''
  });
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    setTimeout(() => {
      const mockCourses: Course[] = [
        {
          _id: '1',
          title: 'React Advanced Patterns & Best Practices',
          instructor: {
            name: 'Nguyễn Văn A',
            email: 'nguyenvana@email.com',
            avatar: 'https://via.placeholder.com/40x40'
          },
          category: 'Programming',
          subcategory: 'Frontend Development',
          price: 299000,
          originalPrice: 399000,
          status: 'published',
          enrollmentCount: 1247,
          rating: 4.8,
          reviewCount: 89,
          createdAt: '2024-01-15T00:00:00Z',
          updatedAt: '2024-01-20T10:30:00Z',
          publishedAt: '2024-01-18T00:00:00Z',
          featured: true,
          tags: ['React', 'JavaScript', 'Frontend', 'Advanced'],
          level: 'advanced',
          duration: 15,
          lessons: 45,
          language: 'Vietnamese',
          certificate: true,
          lastEnrollment: '2024-01-20T15:45:00Z',
          revenue: 372653000
        },
        {
          _id: '2',
          title: 'Python Data Science Fundamentals',
          instructor: {
            name: 'Trần Thị B',
            email: 'tranthib@email.com',
            avatar: 'https://via.placeholder.com/40x40'
          },
          category: 'Data Science',
          subcategory: 'Machine Learning',
          price: 399000,
          status: 'published',
          enrollmentCount: 892,
          rating: 4.6,
          reviewCount: 67,
          createdAt: '2024-01-10T00:00:00Z',
          updatedAt: '2024-01-19T14:20:00Z',
          publishedAt: '2024-01-12T00:00:00Z',
          featured: false,
          tags: ['Python', 'Data Science', 'Machine Learning', 'Beginner'],
          level: 'beginner',
          duration: 20,
          lessons: 38,
          language: 'Vietnamese',
          certificate: true,
          lastEnrollment: '2024-01-20T12:30:00Z',
          revenue: 355908000
        },
        {
          _id: '3',
          title: 'Web Design Principles & UI/UX',
          instructor: {
            name: 'Lê Văn C',
            email: 'levanc@email.com',
            avatar: 'https://via.placeholder.com/40x40'
          },
          category: 'Design',
          subcategory: 'Web Design',
          price: 199000,
          status: 'draft',
          enrollmentCount: 0,
          rating: 0,
          reviewCount: 0,
          createdAt: '2024-01-18T00:00:00Z',
          updatedAt: '2024-01-20T09:15:00Z',
          featured: false,
          tags: ['Design', 'UI/UX', 'Web Design', 'Principles'],
          level: 'beginner',
          duration: 12,
          lessons: 24,
          language: 'Vietnamese',
          certificate: false,
          lastEnrollment: '',
          revenue: 0
        },
        {
          _id: '4',
          title: 'Mobile App Development with React Native',
          instructor: {
            name: 'Phạm Thị D',
            email: 'phamthid@email.com',
            avatar: 'https://via.placeholder.com/40x40'
          },
          category: 'Mobile',
          subcategory: 'Cross-platform',
          price: 499000,
          status: 'suspended',
          enrollmentCount: 156,
          rating: 4.2,
          reviewCount: 23,
          createdAt: '2024-01-17T00:00:00Z',
          updatedAt: '2024-01-20T16:45:00Z',
          publishedAt: '2024-01-19T00:00:00Z',
          featured: false,
          tags: ['React Native', 'Mobile', 'Cross-platform', 'JavaScript'],
          level: 'intermediate',
          duration: 25,
          lessons: 52,
          language: 'Vietnamese',
          certificate: true,
          lastEnrollment: '2024-01-19T11:20:00Z',
          revenue: 77844000
        },
        {
          _id: '5',
          title: 'Blockchain & Cryptocurrency Basics',
          instructor: {
            name: 'Hoàng Văn E',
            email: 'hoangvane@email.com',
            avatar: 'https://via.placeholder.com/40x40'
          },
          category: 'Technology',
          subcategory: 'Blockchain',
          price: 599000,
          status: 'published',
          enrollmentCount: 234,
          rating: 4.7,
          reviewCount: 31,
          createdAt: '2024-01-16T00:00:00Z',
          updatedAt: '2024-01-20T11:30:00Z',
          publishedAt: '2024-01-17T00:00:00Z',
          featured: true,
          tags: ['Blockchain', 'Cryptocurrency', 'Technology', 'Basics'],
          level: 'beginner',
          duration: 18,
          lessons: 36,
          language: 'Vietnamese',
          certificate: true,
          lastEnrollment: '2024-01-20T14:15:00Z',
          revenue: 140166000
        }
      ];
      setCourses(mockCourses);
      setFilteredCourses(mockCourses);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const filtered = courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                          course.instructor.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                          course.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()));
      const matchesStatus = filters.status === 'all' || course.status === filters.status;
      const matchesCategory = filters.category === 'all' || course.category === filters.category;
      const matchesLevel = filters.level === 'all' || course.level === filters.level;
      const matchesFeatured = filters.featured === 'all' || 
                             (filters.featured === 'true' && course.featured) ||
                             (filters.featured === 'false' && !course.featured);
      const matchesInstructor = !filters.instructor || course.instructor.name.toLowerCase().includes(filters.instructor.toLowerCase());
      
      return matchesSearch && matchesStatus && matchesCategory && matchesLevel && matchesFeatured && matchesInstructor;
    });

    // Sort courses
    const sorted = [...filtered].sort((a, b) => {
      let aValue: any = a[sortBy as keyof Course];
      let bValue: any = b[sortBy as keyof Course];

      if (sortBy === 'instructor') {
        aValue = a.instructor.name;
        bValue = b.instructor.name;
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredCourses(sorted);
  }, [courses, filters, sortBy, sortOrder]);

  const handleFilterChange = (newFilters: Partial<CourseFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleCourseSelection = (courseId: string) => {
    setSelectedCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId) 
        : [...prev, courseId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCourses.length === filteredCourses.length) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(filteredCourses.map(course => course._id));
    }
  };

  const handleBulkAction = (action: 'publish' | 'suspend' | 'archive' | 'feature' | 'unfeature') => {
    if (selectedCourses.length === 0) return;
    
    const actionText = {
      publish: 'xuất bản',
      suspend: 'tạm ngưng',
      archive: 'lưu trữ',
      feature: 'đánh dấu nổi bật',
      unfeature: 'bỏ đánh dấu nổi bật'
    }[action];

    if (confirm(`Bạn có chắc chắn muốn ${actionText} ${selectedCourses.length} khóa học đã chọn?`)) {
      setCourses(prev => prev.map(course => {
        if (selectedCourses.includes(course._id)) {
          switch (action) {
            case 'publish':
              return { ...course, status: 'published' as const, publishedAt: new Date().toISOString() };
            case 'suspend':
              return { ...course, status: 'suspended' as const };
            case 'archive':
              return { ...course, status: 'archived' as const };
            case 'feature':
              return { ...course, featured: true };
            case 'unfeature':
              return { ...course, featured: false };
            default:
              return course;
          }
        }
        return course;
      }));
      setSelectedCourses([]);
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = { 
      published: 'Đã xuất bản', 
      draft: 'Bản nháp', 
      archived: 'Đã lưu trữ',
      suspended: 'Tạm ngưng'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusClass = (status: string) => {
    const classes = { 
      published: 'status-published', 
      draft: 'status-draft', 
      archived: 'status-archived',
      suspended: 'status-suspended'
    };
    return classes[status as keyof typeof classes] || '';
  };

  const getLevelLabel = (level: string) => {
    const labels = { 
      beginner: 'Cơ bản', 
      intermediate: 'Trung cấp', 
      advanced: 'Nâng cao' 
    };
    return labels[level as keyof typeof labels] || level;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  if (loading) {
    return (
      <div className="course-directory">
        <div className="course-directory__loading">
          <div className="course-directory__loading-spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="course-directory">
      <div className="course-directory__header">
        <div className="course-directory__header-content">
          <h1 className="course-directory__title">Quản lý khóa học</h1>
          <p className="course-directory__subtitle">Quản lý tất cả khóa học trong hệ thống</p>
        </div>
        <div className="course-directory__header-actions">
          <button className="course-directory__refresh-btn">🔄 Làm mới</button>
          <button className="course-directory__export-btn">📊 Xuất Excel</button>
          <button className="course-directory__add-btn">➕ Thêm khóa học</button>
        </div>
      </div>

      <div className="course-directory__stats">
        <div className="course-directory__stat-card">
          <div className="course-directory__stat-icon">📚</div>
          <div className="course-directory__stat-content">
            <div className="course-directory__stat-value">{formatNumber(courses.length)}</div>
            <div className="course-directory__stat-label">Tổng khóa học</div>
          </div>
        </div>
        <div className="course-directory__stat-card">
          <div className="course-directory__stat-icon">✅</div>
          <div className="course-directory__stat-content">
            <div className="course-directory__stat-value">
              {formatNumber(courses.filter(c => c.status === 'published').length)}
            </div>
            <div className="course-directory__stat-label">Đã xuất bản</div>
          </div>
        </div>
        <div className="course-directory__stat-card">
          <div className="course-directory__stat-card">
            <div className="course-directory__stat-icon">⭐</div>
            <div className="course-directory__stat-content">
              <div className="course-directory__stat-value">
                {formatNumber(courses.filter(c => c.featured).length)}
              </div>
              <div className="course-directory__stat-label">Nổi bật</div>
            </div>
          </div>
        </div>
        <div className="course-directory__stat-card">
          <div className="course-directory__stat-icon">💰</div>
          <div className="course-directory__stat-content">
            <div className="course-directory__stat-value">
              {formatCurrency(courses.reduce((sum, c) => sum + c.revenue, 0))}
            </div>
            <div className="course-directory__stat-label">Tổng doanh thu</div>
          </div>
        </div>
      </div>

      <div className="course-directory__controls">
        <div className="course-directory__filters">
          <div className="course-directory__search">
            <input
              type="text"
              placeholder="Tìm kiếm khóa học, giảng viên hoặc tags..."
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              className="course-directory__search-input"
            />
            <span className="course-directory__search-icon">🔍</span>
          </div>
          <div className="course-directory__filter-controls">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange({ status: e.target.value })}
              className="course-directory__filter-select"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="published">Đã xuất bản</option>
              <option value="draft">Bản nháp</option>
              <option value="archived">Đã lưu trữ</option>
              <option value="suspended">Tạm ngưng</option>
            </select>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange({ category: e.target.value })}
              className="course-directory__filter-select"
            >
              <option value="all">Tất cả danh mục</option>
              <option value="Programming">Programming</option>
              <option value="Data Science">Data Science</option>
              <option value="Design">Design</option>
              <option value="Mobile">Mobile</option>
              <option value="Technology">Technology</option>
            </select>
            <select
              value={filters.level}
              onChange={(e) => handleFilterChange({ level: e.target.value })}
              className="course-directory__filter-select"
            >
              <option value="all">Tất cả cấp độ</option>
              <option value="beginner">Cơ bản</option>
              <option value="intermediate">Trung cấp</option>
              <option value="advanced">Nâng cao</option>
            </select>
            <select
              value={filters.featured}
              onChange={(e) => handleFilterChange({ featured: e.target.value })}
              className="course-directory__filter-select"
            >
              <option value="all">Tất cả</option>
              <option value="true">Nổi bật</option>
              <option value="false">Không nổi bật</option>
            </select>
            <input
              type="text"
              placeholder="Tìm giảng viên..."
              value={filters.instructor}
              onChange={(e) => handleFilterChange({ instructor: e.target.value })}
              className="course-directory__filter-select"
            />
          </div>
        </div>

        <div className="course-directory__view-controls">
          <div className="course-directory__view-mode">
            <button
              className={`course-directory__view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Chế độ bảng"
            >
              📊
            </button>
            <button
              className={`course-directory__view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Chế độ lưới"
            >
              🔲
            </button>
          </div>
          <div className="course-directory__sort">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order as 'asc' | 'desc');
              }}
              className="course-directory__sort-select"
            >
              <option value="createdAt-desc">Mới nhất</option>
              <option value="createdAt-asc">Cũ nhất</option>
              <option value="title-asc">Tên A-Z</option>
              <option value="title-desc">Tên Z-A</option>
              <option value="enrollmentCount-desc">Nhiều học viên nhất</option>
              <option value="rating-desc">Đánh giá cao nhất</option>
              <option value="price-desc">Giá cao nhất</option>
              <option value="price-asc">Giá thấp nhất</option>
              <option value="revenue-desc">Doanh thu cao nhất</option>
            </select>
          </div>
        </div>
      </div>

      {selectedCourses.length > 0 && (
        <div className="course-directory__bulk-actions">
          <div className="course-directory__bulk-info">
            <span className="course-directory__bulk-count">
              Đã chọn {selectedCourses.length} khóa học
            </span>
            <button 
              className="course-directory__bulk-clear"
              onClick={() => setSelectedCourses([])}
            >
              Bỏ chọn tất cả
            </button>
          </div>
          <div className="course-directory__bulk-buttons">
            <button 
              className="course-directory__bulk-btn course-directory__bulk-btn--publish"
              onClick={() => handleBulkAction('publish')}
            >
              ✅ Xuất bản ({selectedCourses.length})
            </button>
            <button 
              className="course-directory__bulk-btn course-directory__bulk-btn--suspend"
              onClick={() => handleBulkAction('suspend')}
            >
              ⏸️ Tạm ngưng ({selectedCourses.length})
            </button>
            <button 
              className="course-directory__bulk-btn course-directory__bulk-btn--archive"
              onClick={() => handleBulkAction('archive')}
            >
              📦 Lưu trữ ({selectedCourses.length})
            </button>
            <button 
              className="course-directory__bulk-btn course-directory__bulk-btn--feature"
              onClick={() => handleBulkAction('feature')}
            >
              ⭐ Nổi bật ({selectedCourses.length})
            </button>
            <button 
              className="course-directory__bulk-btn course-directory__bulk-btn--unfeature"
              onClick={() => handleBulkAction('unfeature')}
            >
              🔲 Bỏ nổi bật ({selectedCourses.length})
            </button>
          </div>
        </div>
      )}

      {viewMode === 'table' ? (
        <div className="course-directory__table-container">
          <table className="course-directory__table">
            <thead className="course-directory__table-header">
              <tr>
                <th className="course-directory__table-th">
                  <input
                    type="checkbox"
                    checked={selectedCourses.length === filteredCourses.length && filteredCourses.length > 0}
                    onChange={handleSelectAll}
                    className="course-directory__checkbox"
                  />
                </th>
                <th 
                  className="course-directory__table-th course-directory__table-th--sortable"
                  onClick={() => handleSort('title')}
                >
                  Khóa học
                  {sortBy === 'title' && (
                    <span className="course-directory__sort-indicator">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th 
                  className="course-directory__table-th course-directory__table-th--sortable"
                  onClick={() => handleSort('instructor')}
                >
                  Giảng viên
                  {sortBy === 'instructor' && (
                    <span className="course-directory__sort-indicator">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th className="course-directory__table-th">Danh mục</th>
                <th className="course-directory__table-th">Trạng thái</th>
                <th 
                  className="course-directory__table-th course-directory__table-th--sortable"
                  onClick={() => handleSort('enrollmentCount')}
                >
                  Học viên
                  {sortBy === 'enrollmentCount' && (
                    <span className="course-directory__sort-indicator">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th 
                  className="course-directory__table-th course-directory__table-th--sortable"
                  onClick={() => handleSort('rating')}
                >
                  Đánh giá
                  {sortBy === 'rating' && (
                    <span className="course-directory__sort-indicator">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th 
                  className="course-directory__table-th course-directory__table-th--sortable"
                  onClick={() => handleSort('price')}
                >
                  Giá
                  {sortBy === 'price' && (
                    <span className="course-directory__sort-indicator">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th 
                  className="course-directory__table-th course-directory__table-th--sortable"
                  onClick={() => handleSort('revenue')}
                >
                  Doanh thu
                  {sortBy === 'revenue' && (
                    <span className="course-directory__sort-indicator">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th className="course-directory__table-th">Hành động</th>
              </tr>
            </thead>
            <tbody className="course-directory__table-body">
              {filteredCourses.map((course) => (
                <tr key={course._id} className="course-directory__table-row">
                  <td className="course-directory__table-td">
                    <input
                      type="checkbox"
                      checked={selectedCourses.includes(course._id)}
                      onChange={() => handleCourseSelection(course._id)}
                      className="course-directory__checkbox"
                    />
                  </td>
                  <td className="course-directory__table-td">
                    <div className="course-directory__course-info">
                      <div className="course-directory__course-title">
                        {course.title}
                        {course.featured && (
                          <span className="course-directory__featured-badge">⭐</span>
                        )}
                      </div>
                      <div className="course-directory__course-meta">
                        <span className="course-directory__course-level">{getLevelLabel(course.level)}</span>
                        <span className="course-directory__course-duration">{course.duration}h</span>
                        <span className="course-directory__course-lessons">{course.lessons} bài</span>
                      </div>
                      <div className="course-directory__course-tags">
                        {course.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="course-directory__course-tag">{tag}</span>
                        ))}
                        {course.tags.length > 3 && (
                          <span className="course-directory__course-tag-more">+{course.tags.length - 3}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="course-directory__table-td">
                    <div className="course-directory__instructor">
                      <img 
                        src={course.instructor.avatar} 
                        alt={course.instructor.name}
                        className="course-directory__instructor-avatar"
                      />
                      <div className="course-directory__instructor-info">
                        <div className="course-directory__instructor-name">{course.instructor.name}</div>
                        <div className="course-directory__instructor-email">{course.instructor.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="course-directory__table-td">
                    <div className="course-directory__category">
                      <div className="course-directory__category-main">{course.category}</div>
                      <div className="course-directory__category-sub">{course.subcategory}</div>
                    </div>
                  </td>
                  <td className="course-directory__table-td">
                    <span className={`course-directory__status-badge ${getStatusClass(course.status)}`}>
                      {getStatusLabel(course.status)}
                    </span>
                  </td>
                  <td className="course-directory__table-td">
                    <div className="course-directory__enrollment">
                      <div className="course-directory__enrollment-count">{formatNumber(course.enrollmentCount)}</div>
                      <div className="course-directory__enrollment-last">
                        Cuối: {course.lastEnrollment ? formatDate(course.lastEnrollment) : 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="course-directory__table-td">
                    <div className="course-directory__rating">
                      <div className="course-directory__rating-score">
                        ⭐ {course.rating.toFixed(1)}
                      </div>
                      <div className="course-directory__rating-count">
                        ({formatNumber(course.reviewCount)} đánh giá)
                      </div>
                    </div>
                  </td>
                  <td className="course-directory__table-td">
                    <div className="course-directory__price">
                      <div className="course-directory__price-current">
                        {formatCurrency(course.price)}
                      </div>
                      {course.originalPrice && course.originalPrice > course.price && (
                        <div className="course-directory__price-original">
                          {formatCurrency(course.originalPrice)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="course-directory__table-td">
                    <div className="course-directory__revenue">
                      {formatCurrency(course.revenue)}
                    </div>
                  </td>
                  <td className="course-directory__table-td">
                    <div className="course-directory__actions">
                      <button className="course-directory__action-btn course-directory__action-btn--view" title="Xem chi tiết">
                        👁️
                      </button>
                      <button className="course-directory__action-btn course-directory__action-btn--edit" title="Chỉnh sửa">
                        ✏️
                      </button>
                      {course.status === 'published' ? (
                        <button className="course-directory__action-btn course-directory__action-btn--suspend" title="Tạm ngưng">
                          ⏸️
                        </button>
                      ) : (
                        <button className="course-directory__action-btn course-directory__action-btn--publish" title="Xuất bản">
                          ✅
                        </button>
                      )}
                      <button className="course-directory__action-btn course-directory__action-btn--delete" title="Xóa">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="course-directory__grid">
          {filteredCourses.map((course) => (
            <div key={course._id} className="course-directory__course-card">
              <div className="course-directory__course-card-header">
                <input
                  type="checkbox"
                  checked={selectedCourses.includes(course._id)}
                  onChange={() => handleCourseSelection(course._id)}
                  className="course-directory__checkbox"
                />
                <span className={`course-directory__status-badge ${getStatusClass(course.status)}`}>
                  {getStatusLabel(course.status)}
                </span>
              </div>
              
              <div className="course-directory__course-card-content">
                <h3 className="course-directory__course-card-title">
                  {course.title}
                  {course.featured && (
                    <span className="course-directory__featured-badge">⭐</span>
                  )}
                </h3>
                
                <div className="course-directory__course-card-instructor">
                  <img 
                    src={course.instructor.avatar} 
                    alt={course.instructor.name}
                    className="course-directory__instructor-avatar"
                  />
                  <span className="course-directory__instructor-name">{course.instructor.name}</span>
                </div>
                
                <div className="course-directory__course-card-meta">
                  <div className="course-directory__course-card-category">
                    {course.category} • {course.subcategory}
                  </div>
                  <div className="course-directory__course-card-level">
                    {getLevelLabel(course.level)} • {course.duration}h • {course.lessons} bài
                  </div>
                </div>
                
                <div className="course-directory__course-card-stats">
                  <div className="course-directory__course-card-stat">
                    <span className="course-directory__course-card-stat-label">Học viên:</span>
                    <span className="course-directory__course-card-stat-value">{formatNumber(course.enrollmentCount)}</span>
                  </div>
                  <div className="course-directory__course-card-stat">
                    <span className="course-directory__course-card-stat-label">Đánh giá:</span>
                    <span className="course-directory__course-card-stat-value">⭐ {course.rating.toFixed(1)}</span>
                  </div>
                  <div className="course-directory__course-card-stat">
                    <span className="course-directory__course-card-stat-label">Giá:</span>
                    <span className="course-directory__course-card-stat-value">{formatCurrency(course.price)}</span>
                  </div>
                  <div className="course-directory__course-card-stat">
                    <span className="course-directory__course-card-stat-label">Doanh thu:</span>
                    <span className="course-directory__course-card-stat-value">{formatCurrency(course.revenue)}</span>
                  </div>
                </div>
                
                <div className="course-directory__course-card-tags">
                  {course.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="course-directory__course-card-tag">{tag}</span>
                  ))}
                </div>
              </div>
              
              <div className="course-directory__course-card-actions">
                <button className="course-directory__course-card-btn course-directory__course-card-btn--view">
                  👁️ Xem
                </button>
                <button className="course-directory__course-card-btn course-directory__course-card-btn--edit">
                  ✏️ Sửa
                </button>
                {course.status === 'published' ? (
                  <button className="course-directory__course-card-btn course-directory__course-card-btn--suspend">
                    ⏸️ Tạm ngưng
                  </button>
                ) : (
                  <button className="course-directory__course-card-btn course-directory__course-card-btn--publish">
                    ✅ Xuất bản
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredCourses.length === 0 && (
        <div className="course-directory__empty">
          <div className="course-directory__empty-icon">📚</div>
          <h3>Không có khóa học nào</h3>
          <p>
            {filters.search || filters.status !== 'all' || filters.category !== 'all' || 
             filters.level !== 'all' || filters.featured !== 'all' || filters.instructor
              ? 'Không tìm thấy khóa học nào phù hợp với bộ lọc hiện tại'
              : 'Chưa có khóa học nào trong hệ thống'
            }
          </p>
        </div>
      )}

      {filteredCourses.length > 0 && (
        <div className="course-directory__pagination">
          <div className="course-directory__pagination-info">
            Hiển thị {filteredCourses.length} trong tổng số {courses.length} khóa học
          </div>
          <div className="course-directory__pagination-controls">
            <button className="course-directory__pagination-btn" disabled>← Trước</button>
            <span className="course-directory__pagination-page">Trang 1</span>
            <button className="course-directory__pagination-btn" disabled>Sau →</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDirectory;
