import React from 'react';
import { Course } from '../types';
import './CourseStats.css';

interface CourseStatsProps {
  courses: Course[];
}

const CourseStats: React.FC<CourseStatsProps> = ({ courses }) => {
  const totalCourses = courses.length;
  const publishedCourses = courses.filter(course => course.isPublished).length;
  const approvedCourses = courses.filter(course => course.isApproved).length;
  const draftCourses = courses.filter(course => !course.isPublished).length;
  
  const totalUpvotes = courses.reduce((sum, course) => sum + course.upvotes, 0);
  const totalReports = courses.reduce((sum, course) => sum + course.reports, 0);
  
  const totalValue = courses.reduce((sum, course) => sum + course.price, 0);
  const averagePrice = totalCourses > 0 ? Math.round(totalValue / totalCourses) : 0;

  const stats = [
    {
      label: 'Tổng khóa học',
      value: totalCourses,
      icon: '📚',
      color: 'blue'
    },
    {
      label: 'Đã xuất bản',
      value: publishedCourses,
      icon: '✅',
      color: 'green'
    },
    {
      label: 'Đã duyệt',
      value: approvedCourses,
      icon: '🔒',
      color: 'blue'
    },
    {
      label: 'Bản nháp',
      value: draftCourses,
      icon: '📝',
      color: 'yellow'
    },
    {
      label: 'Tổng upvotes',
      value: totalUpvotes,
      icon: '👍',
      color: 'purple'
    },
    {
      label: 'Giá trung bình',
      value: `${(averagePrice / 1000).toFixed(0)}k`,
      icon: '💰',
      color: 'orange'
    }
  ];

  return (
    <div className="dashboard-stats">
      <div className="dashboard-stats__grid">
        {stats.map((stat, index) => (
          <div key={index} className={`dashboard-stats__card dashboard-stats__card--${stat.color}`}>
            <div className="dashboard-stats__icon">
              {stat.icon}
            </div>
            <div className="dashboard-stats__content">
              <div className="dashboard-stats__value">{stat.value}</div>
              <div className="dashboard-stats__label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="dashboard-stats__insights">
        <div className="dashboard-stats__insight">
          <span className="dashboard-stats__insight-icon">💡</span>
          <span>
            {publishedCourses > 0 
              ? `Bạn có ${publishedCourses} khóa học đã xuất bản và ${approvedCourses} khóa học đã được duyệt.`
              : 'Bạn chưa có khóa học nào được xuất bản. Hãy tạo và xuất bản khóa học đầu tiên!'
            }
          </span>
        </div>
        <div className="dashboard-stats__insight">
          <span className="dashboard-stats__insight-icon">📊</span>
          <span>
            Tổng giá trị: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalValue)}
          </span>
        </div>
        {totalReports > 0 && (
          <div className="dashboard-stats__insight dashboard-stats__insight--warning">
            <span className="dashboard-stats__insight-icon">⚠️</span>
            <span>
              Có {totalReports} báo cáo cần xem xét. Hãy kiểm tra và xử lý kịp thời.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseStats;
