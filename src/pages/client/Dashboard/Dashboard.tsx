import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Dashboard-specific interfaces
interface DashboardCourse {
  _id: string;
  title: string;
  thumbnail: string;
  progress: number;
  lastLesson: string;
  nextLesson: string;
  instructor: string;
  estimatedTime: number;
}

interface DashboardAssignment {
  _id: string;
  title: string;
  courseTitle: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: number;
}

interface Certificate {
  _id: string;
  courseTitle: string;
  issueDate: string;
  downloadUrl: string;
}
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [recentCourses, setRecentCourses] = useState<DashboardCourse[]>([]);
  const [upcomingAssignments, setUpcomingAssignments] = useState<DashboardAssignment[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [stats, setStats] = useState({
    totalCourses: 12,
    completedCourses: 8,
    totalHours: 156,
    averageGrade: 4.2,
    certificatesEarned: 5,
    currentStreak: 7
  });

  console.log(recentCourses, upcomingAssignments, certificates, stats);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockRecentCourses: DashboardCourse[] = [
        {
          _id: '1',
          title: 'React Advanced Patterns',
          thumbnail: '/images/course1.jpg',
          progress: 75,
          lastLesson: 'Component Composition',
          nextLesson: 'State Management',
          instructor: 'Hieu Doan',
          estimatedTime: 45
        },
        {
          _id: '2',
          title: 'Node.js Backend Development',
          thumbnail: '/images/course2.jpg',
          progress: 45,
          lastLesson: 'Express.js Basics',
          nextLesson: 'Database Integration',
          instructor: 'Minh Nguyen',
          estimatedTime: 60
        },
        {
          _id: '3',
          title: 'UI/UX Design Fundamentals',
          thumbnail: '/images/course3.jpg',
          progress: 90,
          lastLesson: 'Prototyping',
          nextLesson: 'User Testing',
          instructor: 'Lan Tran',
          estimatedTime: 30
        }
      ];

      const mockAssignments: DashboardAssignment[] = [
        {
          _id: '1',
          title: 'Build a Todo App',
          courseTitle: 'React Advanced Patterns',
          dueDate: '2024-01-20',
          status: 'pending'
        },
        {
          _id: '2',
          title: 'API Documentation',
          courseTitle: 'Node.js Backend Development',
          dueDate: '2024-01-25',
          status: 'submitted'
        },
        {
          _id: '3',
          title: 'Design System',
          courseTitle: 'UI/UX Design Fundamentals',
          dueDate: '2024-01-18',
          status: 'graded',
          grade: 95
        }
      ];

      const mockCertificates: Certificate[] = [
        {
          _id: '1',
          courseTitle: 'JavaScript Fundamentals',
          issueDate: '2024-01-10',
          downloadUrl: '/certificates/js-fundamentals.pdf'
        },
        {
          _id: '2',
          courseTitle: 'CSS Mastery',
          issueDate: '2024-01-05',
          downloadUrl: '/certificates/css-mastery.pdf'
        }
      ];

      setRecentCourses(mockRecentCourses);
      setUpcomingAssignments(mockAssignments);
      setCertificates(mockCertificates);
      setStats({
        totalCourses: 12,
        completedCourses: 8,
        totalHours: 156,
        averageGrade: 4.2,
        certificatesEarned: 5,
        currentStreak: 7
      });
    }, 1000);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f39c12';
      case 'submitted': return '#3498db';
      case 'graded': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chưa nộp';
      case 'submitted': return 'Đã nộp';
      case 'graded': return 'Đã chấm';
      default: return 'Không xác định';
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Chào mừng trở lại! 👋</h1>
        <p>Đây là tổng quan về hành trình học tập của bạn</p>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>{stats.totalCourses}</h3>
            <p>Khóa học đã đăng ký</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.completedCourses}</h3>
            <p>Khóa học đã hoàn thành</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <h3>{stats.totalHours}h</h3>
            <p>Tổng thời gian học</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>{stats.averageGrade}</h3>
            <p>Điểm trung bình</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <h3>{stats.certificatesEarned}</h3>
            <p>Chứng chỉ đã nhận</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <h3>{stats.currentStreak}</h3>
            <p>Ngày học liên tiếp</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-main dashboard-main__modife">
          {/* Recent Courses */}
          <section className="recent-courses">
            <div className="section-header">
              <h2>Khóa học gần đây</h2>
              <Link to="/dashboard/courses" className="view-all-btn">
                Xem tất cả
              </Link>
            </div>
            <div className="courses-grid">
              {recentCourses.map((course) => (
                <div key={course._id} className="course-card">
                  <div className="course-thumbnail course-thumbnail-analytics">
                    <img src={course.thumbnail} alt={course.title} />
                    <div className="progress-overlay">
                      <div className="progress-circle">
                        <span className="progress-text">{course.progress}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="course-content">
                    <h3 className="course-title">{course.title}</h3>
                    <p className="instructor">Giảng viên: {course.instructor}</p>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <div className="course-meta">
                      <span className="last-lesson">
                        <strong>Bài học cuối:</strong> {course.lastLesson}
                      </span>
                      <span className="next-lesson">
                        <strong>Tiếp theo:</strong> {course.nextLesson}
                      </span>
                    </div>
                    <div className="course-actions">
                      <Link to={`/learning/${course._id}`} className="continue-btn">
                        Tiếp tục học
                      </Link>
                      <span className="estimated-time">
                        ⏱️ {course.estimatedTime} phút
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Upcoming Assignments */}
          <section className="upcoming-assignments">
            <div className="section-header">
              <h2>Bài tập sắp đến hạn</h2>
              <Link to="/dashboard/assignments" className="view-all-btn">
                Xem tất cả
              </Link>
            </div>
            <div className="assignments-list">
              {upcomingAssignments.map((assignment) => (
                <div key={assignment._id} className="assignment-item">
                  <div className="assignment-info">
                    <h3 className="assignment-title">{assignment.title}</h3>
                    <p className="assignment-course-title">{assignment.courseTitle}</p>
                    <span className="due-date">
                      Hạn nộp: {formatDate(assignment.dueDate)}
                    </span>
                  </div>
                  <div className="assignment-status">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(assignment.status) }}
                    >
                      {getStatusText(assignment.status)}
                    </span>
                    {assignment.grade && (
                      <span className="grade">Điểm: {assignment.grade}</span>
                    )}
                  </div>
                  <div className="assignment-actions">
                    <Link to={`/assignments/${assignment._id}`} className="view-btn">
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;