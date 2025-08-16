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

  // Xác định lĩnh vực chính
  const getMainDomain = () => {
    if (totalCourses === 0) return 'N/A';
    
    const domainCounts: { [key: string]: number } = {};
    courses.forEach(course => {
      domainCounts[course.domain] = (domainCounts[course.domain] || 0) + 1;
    });
    
    const mainDomain = Object.entries(domainCounts).reduce((a, b) => 
      domainCounts[a[0]] > domainCounts[b[0]] ? a : b
    );
    
    return mainDomain[0];
  };

  const stats = [
    {
      label: 'Khóa học đã mua',
      value: totalCourses,
      icon: '📚',
      color: 'blue'
    },
    {
      label: 'Tổng giá trị',
      value: `${(totalValue / 1000).toFixed(0)}k`,
      icon: '💰',
      color: 'green'
    },
    {
      label: 'Tổng đánh giá',
      value: totalUpvotes,
      icon: '⭐',
      color: 'yellow'
    },
    {
      label: 'Lĩnh vực chính',
      value: getMainDomain(),
      icon: '🏷️',
      color: 'purple'
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
            {totalCourses > 0 
              ? `Bạn đã mua ${totalCourses} khóa học. Hãy tiếp tục học tập để nâng cao kỹ năng!`
              : 'Bạn chưa mua khóa học nào. Hãy khám phá và đăng ký khóa học phù hợp!'
            }
          </span>
        </div>
        <div className="dashboard-stats__insight">
          <span className="dashboard-stats__insight-icon">📊</span>
          <span>
            Tổng giá trị: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalValue)}
          </span>
        </div>
        {totalCourses > 0 && (
          <>
            <div className="dashboard-stats__insight">
              <span className="dashboard-stats__insight-icon">🎯</span>
              <span>
                Lĩnh vực chính: {getMainDomain()}
              </span>
            </div>
            <div className="dashboard-stats__insight">
              <span className="dashboard-stats__insight-icon">⭐</span>
              <span>
                Trung bình {totalUpvotes > 0 ? Math.round(totalUpvotes / totalCourses) : 0} đánh giá mỗi khóa học
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CourseStats;
