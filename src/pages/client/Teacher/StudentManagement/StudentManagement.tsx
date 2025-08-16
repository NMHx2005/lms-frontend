import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './StudentManagement.css';

interface Student {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  enrolledAt: string;
  lastActive: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  assignments: {
    submitted: number;
    total: number;
    averageScore: number;
  };
  status: 'active' | 'inactive' | 'completed';
}

interface CourseInfo {
  _id: string;
  title: string;
  thumbnail: string;
  totalStudents: number;
  averageProgress: number;
  status: 'published' | 'draft' | 'pending';
  field: string;
  level: 'basic' | 'intermediate' | 'advanced';
  price: number;
  sections: number;
  lessons: number;
  rating: number;
}

const StudentManagement: React.FC = () => {
  const { id: courseId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [courseInfo, setCourseInfo] = useState<CourseInfo | null>(null);
  const [courses, setCourses] = useState<CourseInfo[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'progress' | 'enrolledAt' | 'lastActive'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedCourse, setSelectedCourse] = useState<CourseInfo | null>(null);

  useEffect(() => {
    // Mock data - replace with API call
    setLoading(true);
    setTimeout(() => {
      const mockCourses: CourseInfo[] = [
        {
          _id: '1',
          title: 'React Advanced Patterns',
          thumbnail: '/images/course1.jpg',
          totalStudents: 156,
          averageProgress: 78.5,
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
          totalStudents: 89,
          averageProgress: 65.2,
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
          totalStudents: 0,
          averageProgress: 0,
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
          totalStudents: 0,
          averageProgress: 0,
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
      // Load students for specific course
      setLoading(true);
      setTimeout(() => {
        const mockStudents: Student[] = [
          {
            _id: '1',
            name: 'Nguyễn Văn A',
            email: 'nguyenvana@email.com',
            avatar: '/images/avatar1.jpg',
            enrolledAt: '2024-01-15T00:00:00Z',
            lastActive: '2024-06-20T10:30:00Z',
            progress: 85,
            completedLessons: 17,
            totalLessons: 20,
            assignments: { submitted: 8, total: 10, averageScore: 92 },
            status: 'active'
          },
          {
            _id: '2',
            name: 'Trần Thị B',
            email: 'tranthib@email.com',
            avatar: '/images/avatar2.jpg',
            enrolledAt: '2024-02-01T00:00:00Z',
            lastActive: '2024-06-19T15:45:00Z',
            progress: 65,
            completedLessons: 13,
            totalLessons: 20,
            assignments: { submitted: 6, total: 10, averageScore: 78 },
            status: 'active'
          },
          {
            _id: '3',
            name: 'Lê Văn C',
            email: 'levanc@email.com',
            avatar: '/images/avatar3.jpg',
            enrolledAt: '2024-01-20T00:00:00Z',
            lastActive: '2024-06-15T09:20:00Z',
            progress: 100,
            completedLessons: 20,
            totalLessons: 20,
            assignments: { submitted: 10, total: 10, averageScore: 95 },
            status: 'completed'
          },
          {
            _id: '4',
            name: 'Phạm Thị D',
            email: 'phamthid@email.com',
            avatar: '/images/avatar4.jpg',
            enrolledAt: '2024-03-10T00:00:00Z',
            lastActive: '2024-06-10T14:15:00Z',
            progress: 45,
            completedLessons: 9,
            totalLessons: 20,
            assignments: { submitted: 4, total: 10, averageScore: 65 },
            status: 'inactive'
          }
        ];
        setStudents(mockStudents);
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
    setStudents([]);
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

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let aValue: any = a[sortBy];
    let bValue: any = b[sortBy];
    
    if (sortBy === 'enrolledAt' || sortBy === 'lastActive') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
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
      <div className="student-management">
        <div className="student-management__header">
          <h1>Quản lý học viên</h1>
          <p>Chọn khóa học để quản lý học viên</p>
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
                  <div className="course-thumbnail">
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
                      <span className="icon">👥</span>
                      <span className="text">{course.totalStudents} students</span>
                    </div>
                    <div className="metric">
                      <span className="icon">⭐</span>
                      <span className="text">{course.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="course-card__actions">
                  <button className="btn btn--primary" onClick={(e) => {
                    e.stopPropagation();
                    handleCourseSelect(course);
                  }}>
                    Quản lý học viên
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // If course is selected, show student management for that course
  return (
    <div className="student-management">
      <div className="student-management__header">
        <button className="back-button" onClick={handleBackToCourses}>
          ← Quay lại danh sách khóa học
        </button>
        <div className="header-content">
          <h1>Quản lý học viên - {courseInfo?.title}</h1>
          <div className="course-overview">
            <div className="overview-item">
              <span className="label">Tổng học viên:</span>
              <span className="value">{courseInfo?.totalStudents}</span>
            </div>
            <div className="overview-item">
              <span className="label">Tiến độ trung bình:</span>
              <span className="value">{courseInfo?.averageProgress}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="student-management__controls">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Tìm kiếm học viên..."
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
            <option value="active">Đang học</option>
            <option value="inactive">Không hoạt động</option>
            <option value="completed">Đã hoàn thành</option>
          </select>
        </div>

        <div className="sort-controls">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="sort-select"
          >
            <option value="name">Sắp xếp theo tên</option>
            <option value="progress">Sắp xếp theo tiến độ</option>
            <option value="enrolledAt">Sắp xếp theo ngày đăng ký</option>
            <option value="lastActive">Sắp xếp theo hoạt động cuối</option>
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
        <div className="dashboard__loading">
          <div className="dashboard__loading-spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : (
        <div className="students-list">
          {sortedStudents.map((student) => (
            <div key={student._id} className="student-card">
              <div className="student-info">
                <div className="student-avatar">
                  <img src={student.avatar} alt={student.name} />
                </div>
                <div className="student-details">
                  <h3 className="student-name">{student.name}</h3>
                  <p className="student-email">{student.email}</p>
                  <div className="student-meta">
                    <span className="enrolled-date">Đăng ký: {formatDate(student.enrolledAt)}</span>
                    <span className="last-active">Hoạt động cuối: {formatDate(student.lastActive)}</span>
                  </div>
                </div>
              </div>

              <div className="student-progress">
                <div className="progress-header">
                  <span className="progress-label">Tiến độ học tập</span>
                  <span className="progress-percentage">{student.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${student.progress}%` }}
                  ></div>
                </div>
                <div className="progress-details">
                  <span>{student.completedLessons}/{student.totalLessons} bài học</span>
                </div>
              </div>

              <div className="student-assignments">
                <div className="assignment-info">
                  <span className="label">Bài tập:</span>
                  <span className="value">{student.assignments.submitted}/{student.assignments.total} đã nộp</span>
                </div>
                <div className="assignment-score">
                  <span className="label">Điểm trung bình:</span>
                  <span className="value">{student.assignments.averageScore}/100</span>
                </div>
              </div>

              <div className="student-status">
                <span className={`status-badge status-${student.status}`}>
                  {student.status === 'active' && 'Đang học'}
                  {student.status === 'inactive' && 'Không hoạt động'}
                  {student.status === 'completed' && 'Đã hoàn thành'}
                </span>
              </div>

              <div className="student-actions">
                <button className="btn btn--secondary">Xem chi tiết</button>
                <button className="btn btn--primary">Gửi tin nhắn</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
