import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './CourseReviews.css';

interface Review {
  _id: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  studentProgress: number;
  rating: number;
  comment: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  teacherResponse?: string;
  responseDate?: string;
}

interface CourseInfo {
  _id: string;
  title: string;
  thumbnail: string;
  totalReviews: number;
  averageRating: number;
  status: 'published' | 'draft' | 'pending';
  field: string;
  level: 'basic' | 'intermediate' | 'advanced';
  price: number;
  sections: number;
  lessons: number;
  rating: number;
}

const CourseReviews: React.FC = () => {
  const { id: courseId } = useParams<{ id: string }>();
  const [courseInfo, setCourseInfo] = useState<CourseInfo | null>(null);
  const [courses, setCourses] = useState<CourseInfo[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'progress'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedCourse, setSelectedCourse] = useState<CourseInfo | null>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    // Mock data - replace with API call
    setLoading(true);
    setTimeout(() => {
      const mockCourses: CourseInfo[] = [
        {
          _id: '1',
          title: 'React Advanced Patterns',
          thumbnail: '/images/course1.jpg',
          totalReviews: 45,
          averageRating: 4.8,
          status: 'published',
          field: 'Web Development',
          level: 'advanced',
          price: 299000,
          sections: 8,
          lessons: 45,
          rating: 4.8
        },
        {
          _id: '2',
          title: 'Node.js Backend Development',
          thumbnail: '/images/course2.jpg',
          totalReviews: 32,
          averageRating: 4.6,
          status: 'published',
          field: 'Backend Development',
          level: 'intermediate',
          price: 249000,
          sections: 6,
          lessons: 32,
          rating: 4.6
        },
        {
          _id: '3',
          title: 'UI/UX Design Fundamentals',
          thumbnail: '/images/course3.jpg',
          totalReviews: 0,
          averageRating: 0,
          status: 'draft',
          field: 'Design',
          level: 'basic',
          price: 199000,
          sections: 4,
          lessons: 24,
          rating: 0
        },
        {
          _id: '4',
          title: 'Python Data Science',
          thumbnail: '/images/course4.jpg',
          totalReviews: 0,
          averageRating: 0,
          status: 'pending',
          field: 'Data Science',
          level: 'intermediate',
          price: 349000,
          sections: 7,
          lessons: 38,
          rating: 0
        }
      ];

      setCourses(mockCourses);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (courseId && selectedCourse) {
      // Load reviews for specific course
      setLoading(true);
      setTimeout(() => {
        const mockReviews: Review[] = [
          {
            _id: '1',
            studentId: '1',
            studentName: 'Nguyễn Văn A',
            studentAvatar: '/images/avatar1.jpg',
            studentProgress: 85,
            rating: 5,
            comment: 'Khóa học rất hay và bổ ích! Giảng viên giảng dạy rất chi tiết và dễ hiểu. Tôi đã học được rất nhiều từ khóa học này.',
            createdAt: '2024-06-15T00:00:00Z',
            status: 'approved'
          },
          {
            _id: '2',
            studentId: '2',
            studentName: 'Trần Thị B',
            studentAvatar: '/images/avatar2.jpg',
            studentProgress: 65,
            rating: 4,
            comment: 'Nội dung khóa học tốt, nhưng có một số phần hơi khó hiểu. Mong giảng viên có thể giải thích rõ hơn.',
            createdAt: '2024-06-12T00:00:00Z',
            status: 'pending'
          },
          {
            _id: '3',
            studentId: '3',
            studentName: 'Lê Văn C',
            studentAvatar: '/images/avatar3.jpg',
            studentProgress: 100,
            rating: 5,
            comment: 'Khóa học tuyệt vời! Tôi đã hoàn thành và áp dụng được ngay vào dự án thực tế. Cảm ơn giảng viên rất nhiều!',
            createdAt: '2024-06-10T00:00:00Z',
            status: 'approved',
            teacherResponse: 'Cảm ơn bạn đã đánh giá tích cực! Chúc bạn thành công với dự án!',
            responseDate: '2024-06-11T00:00:00Z'
          },
          {
            _id: '4',
            studentId: '4',
            studentName: 'Phạm Thị D',
            studentAvatar: '/images/avatar4.jpg',
            studentProgress: 45,
            rating: 3,
            comment: 'Khóa học có nội dung tốt nhưng tốc độ giảng dạy hơi nhanh. Mong giảng viên có thể chậm lại một chút.',
            createdAt: '2024-06-08T00:00:00Z',
            status: 'pending'
          }
        ];
        setReviews(mockReviews);
        setLoading(false);
      }, 500);
    }
  }, [courseId, selectedCourse]);

  const handleCourseSelect = (course: CourseInfo) => {
    setSelectedCourse(course);
    setCourseInfo(course);
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setCourseInfo(null);
    setReviews([]);
  };

  const handleResponseSubmit = () => {
    if (selectedReview && responseText.trim()) {
      // Update review with teacher response
      const updatedReviews = reviews.map(review => 
        review._id === selectedReview._id 
          ? { 
              ...review, 
              teacherResponse: responseText, 
              responseDate: new Date().toISOString(),
              status: 'approved' as const
            }
          : review
      );
      setReviews(updatedReviews);
      setShowResponseModal(false);
      setSelectedReview(null);
      setResponseText('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return '#10B981';
      case 'draft': return '#F59E0B';
      case 'pending': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'ĐÃ XUẤT BẢN';
      case 'draft': return 'BẢN NHÁP';
      case 'pending': return 'CHỜ DUYỆT';
      default: return 'KHÔNG XÁC ĐỊNH';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'advanced': return '#F97316';
      case 'intermediate': return '#F59E0B';
      case 'basic': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'advanced': return 'NÂNG CAO';
      case 'intermediate': return 'TRUNG CẤP';
      case 'basic': return 'CƠ BẢN';
      default: return 'KHÔNG XÁC ĐỊNH';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getRatingDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
    const matchesRating = ratingFilter === 0 || review.rating === ratingFilter;
    return matchesSearch && matchesStatus && matchesRating;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    let aValue: any;
    let bValue: any;
    
    if (sortBy === 'date') {
      aValue = new Date(a.createdAt).getTime();
      bValue = new Date(b.createdAt).getTime();
    } else if (sortBy === 'rating') {
      aValue = a.rating;
      bValue = b.rating;
    } else if (sortBy === 'progress') {
      aValue = a.studentProgress;
      bValue = b.studentProgress;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // If no course is selected, show course list
  if (!selectedCourse) {
    return (
      <div className="course-reviews">
        <div className="course-reviews__header">
          <h1>Quản lý đánh giá</h1>
          <p>Chọn khóa học để quản lý đánh giá</p>
        </div>

        {loading ? (
          <div className="dashboard__loading">
            <div className="dashboard__loading-spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : (
          <div className="course-grid">
            {courses.map((course) => (
              <div key={course._id} className="course-card" onClick={() => handleCourseSelect(course)}>
                <div className="course-card__header">
                  <div className="course-status" style={{ backgroundColor: getStatusColor(course.status) }}>
                    {getStatusText(course.status)}
                  </div>
                  <div className="course-thumbnail course-thumbnail-analytics">
                    <img src={course.thumbnail} alt={course.title} />
                  </div>
                </div>
                
                <div className="course-card__content">
                  <h3 className="course-title">{course.title}</h3>
                  
                  <div className="course-details">
                    <div className="course-field">
                      <span className="label">Lĩnh vực:</span>
                      <span className="value">{course.field}</span>
                    </div>
                    <div className="course-level">
                      <span className="label">Cấp độ:</span>
                      <span className="value" style={{ backgroundColor: getLevelColor(course.level) }}>
                        {getLevelText(course.level)}
                      </span>
                    </div>
                    <div className="course-price">
                      <span className="label">Giá:</span>
                      <span className="value">{formatPrice(course.price)} ₫</span>
                    </div>
                  </div>
                  
                  <div className="course-metrics">
                    <div className="metric">
                      <span className="icon">📚</span>
                      <span className="text">{course.sections} sections</span>
                    </div>
                    <div className="metric">
                      <span className="icon">🎯</span>
                      <span className="text">{course.lessons} lessons</span>
                    </div>
                    <div className="metric">
                      <span className="icon">⭐</span>
                      <span className="text">{course.rating}</span>
                    </div>
                    <div className="metric">
                      <span className="icon">💬</span>
                      <span className="text">{course.totalReviews} reviews</span>
                    </div>
                  </div>
                </div>
                
                <div className="course-card__actions">
                  <button className="btn btn--primary" onClick={(e) => {
                    e.stopPropagation();
                    handleCourseSelect(course);
                  }}>
                    Quản lý đánh giá
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // If course is selected, show review management for that course
  const ratingDistribution = getRatingDistribution();
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
    : 0;

  return (
    <div className="course-reviews">
      <div className="course-reviews__header">
        <button className="back-button" onClick={handleBackToCourses}>
          ← Quay lại danh sách khóa học
        </button>
        <div className="header-content">
          <h1>Quản lý đánh giá - {courseInfo?.title}</h1>
          <div className="course-overview">
            <div className="overview-item">
              <span className="label">Tổng đánh giá:</span>
              <span className="value">{totalReviews}</span>
            </div>
            <div className="overview-item">
              <span className="label">Điểm trung bình:</span>
              <span className="value">{averageRating}/5.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Overview */}
      <div className="rating-overview">
        <div className="rating-summary">
          <div className="average-rating">
            <span className="rating-number">{averageRating}</span>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map(star => (
                <span key={star} className={`star ${star <= Number(averageRating) ? 'filled' : ''}`}>
                  ⭐
                </span>
              ))}
            </div>
            <span className="total-reviews">{totalReviews} đánh giá</span>
          </div>
        </div>
        
        <div className="rating-distribution">
          {[5, 4, 3, 2, 1].map(rating => (
            <div key={rating} className="rating-bar">
              <span className="rating-label">{rating} ⭐</span>
              <div className="bar-container">
                <div 
                  className="bar-fill" 
                  style={{ 
                    width: totalReviews > 0 ? `${(ratingDistribution[rating as keyof typeof ratingDistribution] / totalReviews) * 100}%` : '0%' 
                  }}
                ></div>
              </div>
              <span className="rating-count">{ratingDistribution[rating as keyof typeof ratingDistribution]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="course-reviews__controls">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Tìm kiếm đánh giá..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="status-filter"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Đã từ chối</option>
          </select>

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(Number(e.target.value))}
            className="rating-filter"
          >
            <option value={0}>Tất cả điểm</option>
            <option value={5}>5 sao</option>
            <option value={4}>4 sao</option>
            <option value={3}>3 sao</option>
            <option value={2}>2 sao</option>
            <option value={1}>1 sao</option>
          </select>
        </div>

        <div className="sort-controls">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="sort-select"
          >
            <option value="date">Sắp xếp theo ngày</option>
            <option value="rating">Sắp xếp theo điểm</option>
            <option value="progress">Sắp xếp theo tiến độ</option>
          </select>
          
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="sort-order-btn"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">Đang tải danh sách đánh giá...</div>
      ) : (
        <div className="reviews-list">
          {sortedReviews.map((review) => (
            <div key={review._id} className="review-card">
              <div className="review-header">
                <div className="student-info">
                  <div className="student-avatar">
                    <img src={review.studentAvatar} alt={review.studentName} />
                  </div>
                  <div className="student-details">
                    <h3 className="student-name">{review.studentName}</h3>
                    <div className="student-meta">
                      <span className="progress">Tiến độ: {review.studentProgress}%</span>
                      <span className="review-date">{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="review-rating">
                  <div className="stars">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span key={star} className={`star ${star <= review.rating ? 'filled' : ''}`}>
                        ⭐
                      </span>
                    ))}
                  </div>
                  <span className="rating-number">{review.rating}/5</span>
                </div>
              </div>

              <div className="review-content">
                <p className="review-comment">{review.comment}</p>
              </div>

              {review.teacherResponse && (
                <div className="teacher-response">
                  <div className="response-header">
                    <span className="response-label">Phản hồi của giảng viên:</span>
                    <span className="response-date">{formatDate(review.responseDate!)}</span>
                  </div>
                  <p className="response-text">{review.teacherResponse}</p>
                </div>
              )}

              <div className="review-footer">
                <div className="review-status">
                  <span className={`status-badge status-${review.status}`}>
                    {review.status === 'pending' && 'Chờ duyệt'}
                    {review.status === 'approved' && 'Đã duyệt'}
                    {review.status === 'rejected' && 'Đã từ chối'}
                  </span>
                </div>
                
                <div className="review-actions">
                  {review.status === 'pending' && (
                    <button 
                      className="btn btn--primary"
                      onClick={() => {
                        setSelectedReview(review);
                        setShowResponseModal(true);
                      }}
                    >
                      Phản hồi
                    </button>
                  )}
                  <button className="btn btn--secondary">Xem chi tiết</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Response Modal */}
      {showResponseModal && selectedReview && (
        <div className="modal-overlay" onClick={() => setShowResponseModal(false)}>
          <div className="response-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Phản hồi đánh giá</h3>
              <button 
                className="close-btn"
                onClick={() => setShowResponseModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-content">
              <div className="review-summary">
                <p><strong>Học viên:</strong> {selectedReview.studentName}</p>
                <p><strong>Đánh giá:</strong> {selectedReview.comment}</p>
              </div>
              
              <div className="response-form">
                <label htmlFor="responseText">Phản hồi của bạn:</label>
                <textarea
                  id="responseText"
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Nhập phản hồi của bạn..."
                  rows={4}
                />
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn btn--secondary"
                onClick={() => setShowResponseModal(false)}
              >
                Hủy
              </button>
              <button 
                className="btn btn--primary"
                onClick={handleResponseSubmit}
                disabled={!responseText.trim()}
              >
                Gửi phản hồi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseReviews;
