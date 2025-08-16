import React, { useState, useEffect } from 'react';
import './CourseModeration.css';

interface Course {
  _id: string;
  title: string;
  instructor: {
    name: string;
    email: string;
  };
  category: string;
  price: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  description: string;
  thumbnail: string;
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
}

interface CourseFilters {
  search: string;
  status: string;
  category: string;
  level: string;
}

const CourseModeration: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<CourseFilters>({ 
    search: '', 
    status: 'all', 
    category: 'all',
    level: 'all'
  });
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    setTimeout(() => {
      const mockCourses: Course[] = [
        {
          _id: '1',
          title: 'React Advanced Patterns',
          instructor: { name: 'Nguyễn Văn A', email: 'nguyenvana@email.com' },
          category: 'Programming',
          price: 299000,
          status: 'pending',
          submittedAt: '2024-01-20T10:30:00Z',
          description: 'Khóa học nâng cao về React với các pattern và best practices hiện đại.',
          thumbnail: 'https://via.placeholder.com/300x200',
          duration: 15,
          level: 'advanced'
        },
        {
          _id: '2',
          title: 'Python Data Science',
          instructor: { name: 'Trần Thị B', email: 'tranthib@email.com' },
          category: 'Data Science',
          price: 399000,
          status: 'pending',
          submittedAt: '2024-01-19T14:20:00Z',
          description: 'Học Python để phân tích dữ liệu và machine learning cơ bản.',
          thumbnail: 'https://via.placeholder.com/300x200',
          duration: 20,
          level: 'intermediate'
        },
        {
          _id: '3',
          title: 'Web Design Fundamentals',
          instructor: { name: 'Lê Văn C', email: 'levanc@email.com' },
          category: 'Design',
          price: 199000,
          status: 'approved',
          submittedAt: '2024-01-18T09:15:00Z',
          description: 'Nguyên lý thiết kế web cơ bản cho người mới bắt đầu.',
          thumbnail: 'https://via.placeholder.com/300x200',
          duration: 12,
          level: 'beginner'
        },
        {
          _id: '4',
          title: 'Mobile App Development',
          instructor: { name: 'Phạm Thị D', email: 'phamthid@email.com' },
          category: 'Mobile',
          price: 499000,
          status: 'rejected',
          submittedAt: '2024-01-17T16:45:00Z',
          description: 'Phát triển ứng dụng mobile với React Native.',
          thumbnail: 'https://via.placeholder.com/300x200',
          duration: 25,
          level: 'intermediate'
        },
        {
          _id: '5',
          title: 'Blockchain Basics',
          instructor: { name: 'Hoàng Văn E', email: 'hoangvane@email.com' },
          category: 'Technology',
          price: 599000,
          status: 'pending',
          submittedAt: '2024-01-16T11:30:00Z',
          description: 'Giới thiệu về blockchain và cryptocurrency.',
          thumbnail: 'https://via.placeholder.com/300x200',
          duration: 18,
          level: 'beginner'
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
                          course.instructor.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus = filters.status === 'all' || course.status === filters.status;
      const matchesCategory = filters.category === 'all' || course.category === filters.category;
      const matchesLevel = filters.level === 'all' || course.level === filters.level;
      return matchesSearch && matchesStatus && matchesCategory && matchesLevel;
    });
    setFilteredCourses(filtered);
  }, [courses, filters]);

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

  const handleBulkAction = (action: 'approve' | 'reject') => {
    if (selectedCourses.length === 0) return;
    
    const actionText = action === 'approve' ? 'duyệt' : 'từ chối';
    if (confirm(`Bạn có chắc chắn muốn ${actionText} ${selectedCourses.length} khóa học đã chọn?`)) {
      setCourses(prev => prev.map(course => {
        if (selectedCourses.includes(course._id)) {
          return { ...course, status: action === 'approve' ? 'approved' : 'rejected' as const };
        }
        return course;
      }));
      setSelectedCourses([]);
    }
  };

  const handleReviewCourse = (course: Course) => {
    setSelectedCourse(course);
    setShowReviewModal(true);
    setReviewComment('');
  };

  const handleSubmitReview = (action: 'approve' | 'reject') => {
    if (!selectedCourse) return;
    
    setCourses(prev => prev.map(course => {
      if (course._id === selectedCourse._id) {
        return { ...course, status: action };
      }
      return course;
    }));
    
    setShowReviewModal(false);
    setSelectedCourse(null);
    setReviewComment('');
  };

  const getStatusLabel = (status: string) => {
    const labels = { 
      pending: 'Chờ duyệt', 
      approved: 'Đã duyệt', 
      rejected: 'Đã từ chối' 
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusClass = (status: string) => {
    const classes = { 
      pending: 'status-pending', 
      approved: 'status-approved', 
      rejected: 'status-rejected' 
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
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="course-moderation">
        <div className="course-moderation__loading">
          <div className="course-moderation__loading-spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="course-moderation">
      <div className="course-moderation__header">
        <div className="course-moderation__header-content">
          <h1 className="course-moderation__title">Duyệt khóa học</h1>
          <p className="course-moderation__subtitle">Quản lý và duyệt các khóa học mới</p>
        </div>
        <div className="course-moderation__header-actions">
          <button className="course-moderation__refresh-btn">🔄 Làm mới</button>
          <button className="course-moderation__export-btn">📊 Xuất Excel</button>
        </div>
      </div>

      <div className="course-moderation__stats">
        <div className="course-moderation__stat-card">
          <div className="course-moderation__stat-icon">⏳</div>
          <div className="course-moderation__stat-content">
            <div className="course-moderation__stat-value">
              {courses.filter(c => c.status === 'pending').length}
            </div>
            <div className="course-moderation__stat-label">Chờ duyệt</div>
          </div>
        </div>
        <div className="course-moderation__stat-card">
          <div className="course-moderation__stat-icon">✅</div>
          <div className="course-moderation__stat-content">
            <div className="course-moderation__stat-value">
              {courses.filter(c => c.status === 'approved').length}
            </div>
            <div className="course-moderation__stat-label">Đã duyệt</div>
          </div>
        </div>
        <div className="course-moderation__stat-card">
          <div className="course-moderation__stat-icon">❌</div>
          <div className="course-moderation__stat-content">
            <div className="course-moderation__stat-value">
              {courses.filter(c => c.status === 'rejected').length}
            </div>
            <div className="course-moderation__stat-label">Đã từ chối</div>
          </div>
        </div>
        <div className="course-moderation__stat-card">
          <div className="course-moderation__stat-icon">📚</div>
          <div className="course-moderation__stat-content">
            <div className="course-moderation__stat-value">{courses.length}</div>
            <div className="course-moderation__stat-label">Tổng cộng</div>
          </div>
        </div>
      </div>

      <div className="course-moderation__filters">
        <div className="course-moderation__search">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên khóa học hoặc giảng viên..."
            value={filters.search}
            onChange={(e) => handleFilterChange({ search: e.target.value })}
            className="course-moderation__search-input"
          />
          <span className="course-moderation__search-icon">🔍</span>
        </div>
        <div className="course-moderation__filter-controls">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange({ status: e.target.value })}
            className="course-moderation__filter-select"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Đã từ chối</option>
          </select>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange({ category: e.target.value })}
            className="course-moderation__filter-select"
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
            className="course-moderation__filter-select"
          >
            <option value="all">Tất cả cấp độ</option>
            <option value="beginner">Cơ bản</option>
            <option value="intermediate">Trung cấp</option>
            <option value="advanced">Nâng cao</option>
          </select>
        </div>
      </div>

      {selectedCourses.length > 0 && (
        <div className="course-moderation__bulk-actions">
          <div className="course-moderation__bulk-info">
            <span className="course-moderation__bulk-count">
              Đã chọn {selectedCourses.length} khóa học
            </span>
            <button 
              className="course-moderation__bulk-clear"
              onClick={() => setSelectedCourses([])}
            >
              Bỏ chọn tất cả
            </button>
          </div>
          <div className="course-moderation__bulk-buttons">
            <button 
              className="course-moderation__bulk-btn course-moderation__bulk-btn--approve"
              onClick={() => handleBulkAction('approve')}
            >
              ✅ Duyệt ({selectedCourses.length})
            </button>
            <button 
              className="course-moderation__bulk-btn course-moderation__bulk-btn--reject"
              onClick={() => handleBulkAction('reject')}
            >
              ❌ Từ chối ({selectedCourses.length})
            </button>
          </div>
        </div>
      )}

      <div className="course-moderation__courses">
        {filteredCourses.map((course) => (
          <div key={course._id} className="course-moderation__course-card">
            <div className="course-moderation__course-header">
              <div className="course-moderation__course-selection">
                <input
                  type="checkbox"
                  checked={selectedCourses.includes(course._id)}
                  onChange={() => handleCourseSelection(course._id)}
                  className="course-moderation__checkbox"
                />
              </div>
              <div className="course-moderation__course-status">
                <span className={`course-moderation__status-badge ${getStatusClass(course.status)}`}>
                  {getStatusLabel(course.status)}
                </span>
              </div>
            </div>
            
            <div className="course-moderation__course-content">
              <div className="course-moderation__course-thumbnail">
                <img src={course.thumbnail} alt={course.title} />
              </div>
              
              <div className="course-moderation__course-info">
                <h3 className="course-moderation__course-title">{course.title}</h3>
                <p className="course-moderation__course-description">{course.description}</p>
                
                <div className="course-moderation__course-meta">
                  <div className="course-moderation__meta-item">
                    <span className="course-moderation__meta-label">Giảng viên:</span>
                    <span className="course-moderation__meta-value">{course.instructor.name}</span>
                  </div>
                  <div className="course-moderation__meta-item">
                    <span className="course-moderation__meta-label">Danh mục:</span>
                    <span className="course-moderation__meta-value">{course.category}</span>
                  </div>
                  <div className="course-moderation__meta-item">
                    <span className="course-moderation__meta-label">Cấp độ:</span>
                    <span className="course-moderation__meta-value">{getLevelLabel(course.level)}</span>
                  </div>
                  <div className="course-moderation__meta-item">
                    <span className="course-moderation__meta-label">Thời lượng:</span>
                    <span className="course-moderation__meta-value">{course.duration} giờ</span>
                  </div>
                  <div className="course-moderation__meta-item">
                    <span className="course-moderation__meta-label">Giá:</span>
                    <span className="course-moderation__meta-value course-moderation__price">
                      {formatCurrency(course.price)}
                    </span>
                  </div>
                  <div className="course-moderation__meta-item">
                    <span className="course-moderation__meta-label">Ngày nộp:</span>
                    <span className="course-moderation__meta-value">{formatDate(course.submittedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="course-moderation__course-actions">
              {course.status === 'pending' && (
                <>
                  <button 
                    className="course-moderation__action-btn course-moderation__action-btn--approve"
                    onClick={() => handleReviewCourse(course)}
                  >
                    ✅ Duyệt
                  </button>
                  <button 
                    className="course-moderation__action-btn course-moderation__action-btn--reject"
                    onClick={() => handleReviewCourse(course)}
                  >
                    ❌ Từ chối
                  </button>
                </>
              )}
              <button className="course-moderation__action-btn course-moderation__action-btn--view">
                👁️ Xem chi tiết
              </button>
              <button className="course-moderation__action-btn course-moderation__action-btn--edit">
                ✏️ Chỉnh sửa
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="course-moderation__empty">
          <div className="course-moderation__empty-icon">📚</div>
          <h3>Không có khóa học nào</h3>
          <p>
            {filters.search || filters.status !== 'all' || filters.category !== 'all' || filters.level !== 'all'
              ? 'Không tìm thấy khóa học nào phù hợp với bộ lọc hiện tại'
              : 'Chưa có khóa học nào trong hệ thống'
            }
          </p>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedCourse && (
        <div className="course-moderation__modal-overlay">
          <div className="course-moderation__modal">
            <div className="course-moderation__modal-header">
              <h3>Duyệt khóa học: {selectedCourse.title}</h3>
              <button 
                className="course-moderation__modal-close"
                onClick={() => setShowReviewModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="course-moderation__modal-content">
              <div className="course-moderation__modal-info">
                <p><strong>Giảng viên:</strong> {selectedCourse.instructor.name}</p>
                <p><strong>Danh mục:</strong> {selectedCourse.category}</p>
                <p><strong>Giá:</strong> {formatCurrency(selectedCourse.price)}</p>
              </div>
              
              <div className="course-moderation__modal-comment">
                <label htmlFor="reviewComment" className="course-moderation__modal-label">
                  Ghi chú (tùy chọn):
                </label>
                <textarea
                  id="reviewComment"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Nhập ghi chú về quyết định duyệt/từ chối..."
                  className="course-moderation__modal-textarea"
                  rows={4}
                />
              </div>
            </div>
            
            <div className="course-moderation__modal-actions">
              <button 
                className="course-moderation__modal-btn course-moderation__modal-btn--approve"
                onClick={() => handleSubmitReview('approve')}
              >
                ✅ Duyệt khóa học
              </button>
              <button 
                className="course-moderation__modal-btn course-moderation__modal-btn--reject"
                onClick={() => handleSubmitReview('reject')}
              >
                ❌ Từ chối khóa học
              </button>
              <button 
                className="course-moderation__modal-btn course-moderation__modal-btn--cancel"
                onClick={() => setShowReviewModal(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseModeration;
