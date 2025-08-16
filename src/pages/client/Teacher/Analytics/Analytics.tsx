import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnalyticsData } from '../../../../types/index';
import './Analytics.css';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'students' | 'engagement'>('revenue');

  // Mock data - replace with API call
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const mockData: AnalyticsData = {
        overview: {
          totalStudents: 1247,
          totalCourses: 23,
          totalRevenue: 45678,
          totalViews: 89234,
          averageRating: 4.7,
          completionRate: 78.5
        },
        revenueData: [
          { month: 'Jan', revenue: 3200, students: 45, courses: 2 },
          { month: 'Feb', revenue: 4100, students: 52, courses: 3 },
          { month: 'Mar', revenue: 3800, students: 48, courses: 2 },
          { month: 'Apr', revenue: 5200, students: 67, courses: 4 },
          { month: 'May', revenue: 4800, students: 61, courses: 3 },
          { month: 'Jun', revenue: 6100, students: 78, courses: 5 }
        ],
        coursePerformance: [
          {
            _id: 'course1',
            name: 'React Advanced Patterns',
            students: 234,
            rating: 4.8,
            revenue: 8900,
            completionRate: 82,
            views: 15420,
            thumbnail: '/images/course1.jpg'
          },
          {
            _id: 'course2',
            name: 'Node.js Backend Development',
            students: 189,
            rating: 4.6,
            revenue: 7200,
            completionRate: 75,
            views: 12890,
            thumbnail: '/images/course2.jpg'
          },
          {
            _id: 'course3',
            name: 'UI/UX Design Fundamentals',
            students: 156,
            rating: 4.9,
            revenue: 6800,
            completionRate: 88,
            views: 11230,
            thumbnail: '/images/course3.jpg'
          },
          {
            _id: 'course4',
            name: 'Machine Learning Basics',
            students: 134,
            rating: 4.7,
            revenue: 5900,
            completionRate: 71,
            views: 9870,
            thumbnail: '/images/course4.jpg'
          },
          {
            _id: 'course5',
            name: 'Mobile App Development',
            students: 98,
            rating: 4.5,
            revenue: 4200,
            completionRate: 68,
            views: 7650,
            thumbnail: '/images/course5.jpg'
          }
        ],
        studentGrowth: [
          { month: 'Jan', newStudents: 45, activeStudents: 180, returningStudents: 135 },
          { month: 'Feb', newStudents: 52, activeStudents: 195, returningStudents: 143 },
          { month: 'Mar', newStudents: 48, activeStudents: 210, returningStudents: 162 },
          { month: 'Apr', newStudents: 67, activeStudents: 245, returningStudents: 178 },
          { month: 'May', newStudents: 61, activeStudents: 268, returningStudents: 207 },
          { month: 'Jun', newStudents: 78, activeStudents: 312, returningStudents: 234 }
        ],
        topCourses: [
          { _id: 'course1', name: 'React Advanced Patterns', views: 15420, enrollments: 234, rating: 4.8, revenue: 8900, thumbnail: '/images/course1.jpg' },
          { _id: 'course2', name: 'Node.js Backend Development', views: 12890, enrollments: 189, rating: 4.6, revenue: 7200, thumbnail: '/images/course2.jpg' },
          { _id: 'course3', name: 'UI/UX Design Fundamentals', views: 11230, enrollments: 156, rating: 4.9, revenue: 6800, thumbnail: '/images/course3.jpg' },
          { _id: 'course4', name: 'Machine Learning Basics', views: 9870, enrollments: 134, rating: 4.7, revenue: 5900, thumbnail: '/images/course4.jpg' },
          { _id: 'course5', name: 'Mobile App Development', views: 7650, enrollments: 98, rating: 4.5, revenue: 4200, thumbnail: '/images/course5.jpg' }
        ],
        studentDemographics: {
          ageGroups: [
            { age: '18-24', count: 456, percentage: 36.6 },
            { age: '25-34', count: 523, percentage: 42.0 },
            { age: '35-44', count: 189, percentage: 15.2 },
            { age: '45+', count: 79, percentage: 6.3 }
          ],
          countries: [
            { country: 'Vietnam', count: 623, percentage: 50.0 },
            { country: 'United States', count: 187, percentage: 15.0 },
            { country: 'Singapore', count: 124, percentage: 10.0 },
            { country: 'Australia', count: 93, percentage: 7.5 },
            { country: 'Others', count: 220, percentage: 17.6 }
          ],
          experienceLevels: [
            { level: 'Beginner', count: 498, percentage: 40.0 },
            { level: 'Intermediate', count: 561, percentage: 45.0 },
            { level: 'Advanced', count: 188, percentage: 15.0 }
          ]
        },
        engagementMetrics: {
          averageWatchTime: 42.5,
          assignmentSubmissionRate: 76.8,
          discussionParticipation: 68.3,
          certificateEarned: 72.1
        }
      };
      
      setAnalyticsData(mockData);
      setIsLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <div className="analytics-page">
        <div className="analytics-loading">
          <div className="loading-spinner"></div>
          <p>Đang tải dữ liệu phân tích...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <h1>Analytics Dashboard 📊</h1>
        <p>Phân tích hiệu suất giảng dạy và thu nhập của bạn</p>
      </div>

      {/* Time Range Selector */}
      <div className="time-range-selector">
        <div className="time-buttons">
          {(['7d', '30d', '90d', '1y'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`time-btn ${timeRange === range ? 'active' : ''}`}
            >
              {range === '7d' ? '7 Ngày' : 
               range === '30d' ? '30 Ngày' : 
               range === '90d' ? '90 Ngày' : '1 Năm'}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="overview-stats">
        <div className="stat-card primary">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{formatNumber(analyticsData.overview.totalStudents)}</h3>
            <p>Tổng học viên</p>
            <span className="stat-change positive">+12% so với tháng trước</span>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>{analyticsData.overview.totalCourses}</h3>
            <p>Khóa học</p>
            <span className="stat-change positive">+2 khóa mới</span>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>{formatCurrency(analyticsData.overview.totalRevenue)}</h3>
            <p>Tổng thu nhập</p>
            <span className="stat-change positive">+18% so với tháng trước</span>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">👁️</div>
          <div className="stat-content">
            <h3>{formatNumber(analyticsData.overview.totalViews)}</h3>
            <p>Tổng lượt xem</p>
            <span className="stat-change positive">+8% so với tháng trước</span>
          </div>
        </div>

        <div className="stat-card secondary">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>{analyticsData.overview.averageRating}</h3>
            <p>Đánh giá trung bình</p>
            <span className="stat-change positive">+0.2 điểm</span>
          </div>
        </div>

        <div className="stat-card tertiary">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>{formatPercentage(analyticsData.overview.completionRate)}</h3>
            <p>Tỷ lệ hoàn thành</p>
            <span className="stat-change positive">+3.2%</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container">
          <h3>Thu nhập & Học viên theo thời gian</h3>
          <div className="chart-placeholder">
            <div className="chart-mock">
              <div className="chart-bars">
                {analyticsData.revenueData.map((data, index) => (
                  <div key={index} className="chart-bar">
                    <div 
                      className="bar-fill revenue" 
                      style={{ height: `${(data.revenue / 7000) * 100}%` }}
                    ></div>
                    <div 
                      className="bar-fill students" 
                      style={{ height: `${(data.students / 100) * 100}%` }}
                    ></div>
                    <span className="bar-label">{data.month}</span>
                  </div>
                ))}
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-color revenue"></span>
                  <span>Thu nhập ($)</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color students"></span>
                  <span>Học viên</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="chart-container">
          <h3>Tăng trưởng học viên</h3>
          <div className="chart-placeholder">
            <div className="chart-mock">
              <div className="growth-chart">
                {analyticsData.studentGrowth.map((data, index) => (
                  <div key={index} className="growth-bar">
                    <div className="growth-stack">
                      <div 
                        className="stack-segment new" 
                        style={{ height: `${(data.newStudents / 100) * 100}%` }}
                        title={`Mới: ${data.newStudents}`}
                      ></div>
                      <div 
                        className="stack-segment active" 
                        style={{ height: `${(data.activeStudents / 400) * 100}%` }}
                        title={`Hoạt động: ${data.activeStudents}`}
                      ></div>
                    </div>
                    <span className="growth-label">{data.month}</span>
                  </div>
                ))}
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-color new"></span>
                  <span>Học viên mới</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color active"></span>
                  <span>Học viên hoạt động</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Performance */}
      <div className="course-performance">
        <div className="section-header">
          <h3>Hiệu suất khóa học</h3>
          <Link to="/teacher/courses" className="view-all-btn">
            Xem tất cả khóa học
          </Link>
        </div>
        
        <div className="performance-grid">
          {analyticsData.coursePerformance.map((course) => (
            <div key={course._id} className="performance-card">
              <div className="course-header">
                <img src={course.thumbnail} alt={course.name} className="course-thumbnail course-thumbnail-analytics" />
                <div className="course-info">
                  <h4 className="course-name">{course.name}</h4>
                  <div className="course-stats">
                    <span className="stat">👥 {formatNumber(course.students)} học viên</span>
                    <span className="stat">⭐ {course.rating}</span>
                  </div>

                </div>
              </div>
              
              <div className="performance-metrics">
                <div className="metric">
                  <span className="metric-label">Thu nhập</span>
                  <span className="metric-value">{formatCurrency(course.revenue)}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Tỷ lệ hoàn thành</span>
                  <span className="metric-value">{formatPercentage(course.completionRate)}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Lượt xem</span>
                  <span className="metric-value">{formatNumber(course.views)}</span>
                </div>
              </div>
              
              <div className="course-actions">
                <Link to={`/teacher/courses/${course._id}`} className="view-course-btn">
                  Xem chi tiết
                </Link>
                <Link to={`/teacher/courses/${course._id}/edit`} className="edit-course-btn">
                  Chỉnh sửa
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Demographics */}
      <div className="demographics-section">
        <div className="section-header">
          <h3>Thông tin học viên</h3>
        </div>
        
        <div className="demographics-grid">
          <div className="demographics-card">
            <h4>Nhóm tuổi</h4>
            <div className="demographics-chart">
              {analyticsData.studentDemographics.ageGroups.map((group) => (
                <div key={group.age} className="demographic-item">
                  <div className="demographic-bar">
                    <div 
                      className="bar-fill" 
                      style={{ width: `${group.percentage}%` }}
                    ></div>
                  </div>
                  <div className="demographic-info">
                    <span className="demographic-label">{group.age}</span>
                    <span className="demographic-value">{group.count} ({formatPercentage(group.percentage)})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="demographics-card">
            <h4>Quốc gia</h4>
            <div className="demographics-chart">
              {analyticsData.studentDemographics.countries.map((country) => (
                <div key={country.country} className="demographic-item">
                  <div className="demographic-bar">
                    <div 
                      className="bar-fill" 
                      style={{ width: `${country.percentage}%` }}
                    ></div>
                  </div>
                  <div className="demographic-info">
                    <span className="demographic-label">{country.country}</span>
                    <span className="demographic-value">{country.count} ({formatPercentage(country.percentage)})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="demographics-card">
            <h4>Trình độ kinh nghiệm</h4>
            <div className="demographics-chart">
              {analyticsData.studentDemographics.experienceLevels.map((level) => (
                <div key={level.level} className="demographic-item">
                  <div className="demographic-bar">
                    <div 
                      className="bar-fill" 
                      style={{ width: `${level.percentage}%` }}
                    ></div>
                  </div>
                  <div className="demographic-info">
                    <span className="demographic-label">{level.level}</span>
                    <span className="demographic-value">{level.count} ({formatPercentage(level.percentage)})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="engagement-section">
        <div className="section-header">
          <h3>Chỉ số tương tác</h3>
        </div>
        
        <div className="engagement-grid">
          <div className="engagement-card">
            <div className="engagement-icon">⏱️</div>
            <div className="engagement-content">
              <h4>Thời gian xem trung bình</h4>
              <p className="engagement-value">{analyticsData.engagementMetrics.averageWatchTime} phút</p>
              <span className="engagement-change positive">+5.2 phút</span>
            </div>
          </div>

          <div className="engagement-card">
            <div className="engagement-icon">📝</div>
            <div className="engagement-content">
              <h4>Tỷ lệ nộp bài tập</h4>
              <p className="engagement-value">{formatPercentage(analyticsData.engagementMetrics.assignmentSubmissionRate)}</p>
              <span className="engagement-change positive">+2.1%</span>
            </div>
          </div>

          <div className="engagement-card">
            <div className="engagement-icon">💬</div>
            <div className="engagement-content">
              <h4>Tham gia thảo luận</h4>
              <p className="engagement-value">{formatPercentage(analyticsData.engagementMetrics.discussionParticipation)}</p>
              <span className="engagement-change positive">+4.3%</span>
            </div>
          </div>

          <div className="engagement-card">
            <div className="engagement-icon">🏆</div>
            <div className="engagement-content">
              <h4>Chứng chỉ đạt được</h4>
              <p className="engagement-value">{formatPercentage(analyticsData.engagementMetrics.certificateEarned)}</p>
              <span className="engagement-change positive">+1.8%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/teacher/courses/new" className="create-course-btn">
          ➕ Tạo khóa học mới
        </Link>
        <Link to="/teacher/earnings" className="view-earnings-btn">
          💰 Xem thu nhập chi tiết
        </Link>
        <Link to="/teacher/courses" className="manage-courses-btn">
          📚 Quản lý khóa học
        </Link>
      </div>
    </div>
  );
};

export default Analytics;
