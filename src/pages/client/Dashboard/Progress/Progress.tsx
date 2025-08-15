import React, { useState, useEffect } from 'react';
import { Course, Enrollment } from '@/components/Client/Dashboard/types';
import './Progress.css';

interface ProgressData {
  totalCourses: number;
  completedCourses: number;
  totalLessons: number;
  completedLessons: number;
  overallProgress: number;
  certificates: Certificate[];
}

interface Certificate {
  _id: string;
  courseId: string;
  courseTitle: string;
  issuedAt: string;
  downloadUrl: string;
  grade?: string;
}

const Progress: React.FC = () => {
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'completed' | 'in-progress'>('all');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockData: ProgressData = {
        totalCourses: 8,
        completedCourses: 3,
        totalLessons: 156,
        completedLessons: 89,
        overallProgress: 57,
        certificates: [
          {
            _id: 'cert_001',
            courseId: 'course_001',
            courseTitle: 'React Fundamentals',
            issuedAt: '2025-01-15T10:30:00Z',
            downloadUrl: '/certificates/react-fundamentals.pdf',
            grade: 'A+'
          },
          {
            _id: 'cert_002',
            courseId: 'course_002',
            courseTitle: 'Node.js Backend Development',
            issuedAt: '2025-01-10T14:20:00Z',
            downloadUrl: '/certificates/nodejs-backend.pdf',
            grade: 'A'
          },
          {
            _id: 'cert_003',
            courseId: 'course_003',
            courseTitle: 'Database Design & SQL',
            issuedAt: '2025-01-05T09:15:00Z',
            downloadUrl: '/certificates/database-design.pdf',
            grade: 'A+'
          }
        ]
      };
      setProgressData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleDownloadCertificate = (certificate: Certificate) => {
    // Simulate download
    console.log('Downloading certificate:', certificate.courseTitle);
    // In real app, this would trigger actual download
    window.open(certificate.downloadUrl, '_blank');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard__header">
          <div className="dashboard__breadcrumbs">
            <span>Dashboard</span>
            <span>/</span>
            <span>Tiến độ & Chứng chỉ</span>
          </div>
          <h1 className="dashboard__title">Tiến độ & Chứng chỉ</h1>
        </div>
        <div className="dashboard__content">
          <div className="dashboard__loading">
            <div className="dashboard__loading-spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!progressData) {
    return (
      <div className="dashboard">
        <div className="dashboard__header">
          <div className="dashboard__breadcrumbs">
            <span>Dashboard</span>
            <span>/</span>
            <span>Tiến độ & Chứng chỉ</span>
          </div>
          <h1 className="dashboard__title">Tiến độ & Chứng chỉ</h1>
        </div>
        <div className="dashboard__content">
          <div className="dashboard__error">
            <h2>Không thể tải dữ liệu</h2>
            <p>Vui lòng thử lại sau</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard__header">
        <div className="dashboard__breadcrumbs">
          <span>Dashboard</span>
          <span>/</span>
          <span>Tiến độ & Chứng chỉ</span>
        </div>
        <h1 className="dashboard__title">Tiến độ & Chứng chỉ</h1>
      </div>

      {/* Content */}
      <div className="dashboard__content">
        {/* Progress Overview */}
        <div className="dashboard__progress-overview">
          <div className="dashboard__progress-main">
            <div className="dashboard__progress-circle">
              <div className="dashboard__progress-circle__inner">
                <span className="dashboard__progress-percentage">{progressData.overallProgress}%</span>
              </div>
            </div>
            <div className="dashboard__progress-info">
              <h3>Tiến độ tổng thể</h3>
              <p>{progressData.completedLessons} / {progressData.totalLessons} bài học đã hoàn thành</p>
            </div>
          </div>

          <div className="dashboard__progress-stats">
            <div className="dashboard__progress-stat">
              <div className="dashboard__progress-stat-icon">📚</div>
              <div className="dashboard__progress-stat-content">
                <h4>Tổng khóa học</h4>
                <span>{progressData.totalCourses}</span>
              </div>
            </div>

            <div className="dashboard__progress-stat">
              <div className="dashboard__progress-stat-icon">✅</div>
              <div className="dashboard__progress-stat-content">
                <h4>Đã hoàn thành</h4>
                <span>{progressData.completedCourses}</span>
              </div>
            </div>

            <div className="dashboard__progress-stat">
              <div className="dashboard__progress-stat-icon">📖</div>
              <div className="dashboard__progress-stat-content">
                <h4>Tổng bài học</h4>
                <span>{progressData.totalLessons}</span>
              </div>
            </div>

            <div className="dashboard__progress-stat">
              <div className="dashboard__progress-stat-icon">🏆</div>
              <div className="dashboard__progress-stat-content">
                <h4>Chứng chỉ</h4>
                <span>{progressData.certificates.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="dashboard__tabs">
          <button
            className={`dashboard__tab ${selectedFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('all')}
          >
            Tất cả ({progressData.totalCourses})
          </button>
          <button
            className={`dashboard__tab ${selectedFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('completed')}
          >
            Đã hoàn thành ({progressData.completedCourses})
          </button>
          <button
            className={`dashboard__tab ${selectedFilter === 'in-progress' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('in-progress')}
          >
            Đang học ({progressData.totalCourses - progressData.completedCourses})
          </button>
        </div>

        {/* Certificates Section */}
        <div className="dashboard__section">
          <div className="dashboard__section-header">
            <h2>Chứng chỉ đã đạt được</h2>
            <p>Bạn có thể tải xuống các chứng chỉ đã hoàn thành</p>
          </div>

          {progressData.certificates.length === 0 ? (
            <div className="dashboard__empty">
              <div className="dashboard__empty-icon">🏆</div>
              <h3>Chưa có chứng chỉ nào</h3>
              <p>Hoàn thành khóa học đầu tiên để nhận chứng chỉ</p>
            </div>
          ) : (
            <div className="dashboard__certificates-grid">
              {progressData.certificates.map((certificate) => (
                <div key={certificate._id} className="dashboard__certificate-card">
                  <div className="dashboard__certificate-header">
                    <div className="dashboard__certificate-icon">🎓</div>
                    <div className="dashboard__certificate-info">
                      <h4>{certificate.courseTitle}</h4>
                      <p>Phát hành: {formatDate(certificate.issuedAt)}</p>
                      {certificate.grade && (
                        <span className="dashboard__certificate-grade">Điểm: {certificate.grade}</span>
                      )}
                    </div>
                  </div>
                  <div className="dashboard__certificate-actions">
                    <button
                      className="dashboard__btn dashboard__btn--primary"
                      onClick={() => handleDownloadCertificate(certificate)}
                    >
                      <span>📥</span>
                      Tải chứng chỉ
                    </button>
                    <button className="dashboard__btn dashboard__btn--outline">
                      <span>👁️</span>
                      Xem trước
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="dashboard__section">
          <div className="dashboard__section-header">
            <h2>Hoạt động gần đây</h2>
            <p>Những bài học bạn đã hoàn thành gần đây</p>
          </div>
          
          <div className="dashboard__activity-list">
            <div className="dashboard__activity-item">
              <div className="dashboard__activity-icon">✅</div>
              <div className="dashboard__activity-content">
                <h4>Hoàn thành bài học "React Hooks"</h4>
                <p>Khóa học: React Fundamentals</p>
                <span className="dashboard__activity-time">2 giờ trước</span>
              </div>
            </div>
            
            <div className="dashboard__activity-item">
              <div className="dashboard__activity-icon">🏆</div>
              <div className="dashboard__activity-content">
                <h4>Nhận chứng chỉ "Database Design"</h4>
                <p>Điểm: A+</p>
                <span className="dashboard__activity-time">1 ngày trước</span>
              </div>
            </div>
            
            <div className="dashboard__activity-item">
              <div className="dashboard__activity-icon">📚</div>
              <div className="dashboard__activity-content">
                <h4>Bắt đầu khóa học "Node.js Backend"</h4>
                <p>Tiến độ: 15%</p>
                <span className="dashboard__activity-time">3 ngày trước</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
