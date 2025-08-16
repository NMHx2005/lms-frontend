import React, { useState, useEffect } from 'react';
import './Analytics.css';

interface AnalyticsData {
  revenue: {
    total: number;
    monthly: number;
    growth: number;
    chartData: { month: string; value: number }[];
  };
  users: {
    total: number;
    active: number;
    new: number;
    growth: number;
    chartData: { month: string; value: number }[];
  };
  courses: {
    total: number;
    published: number;
    draft: number;
    enrollment: number;
    chartData: { month: string; value: number }[];
  };
  engagement: {
    completionRate: number;
    avgSessionTime: number;
    bounceRate: number;
    chartData: { month: string; value: number }[];
  };
}

interface TopPerformer {
  _id: string;
  name: string;
  type: 'course' | 'instructor' | 'category';
  metric: string;
  value: number;
  change: number;
  icon: string;
}

const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  useEffect(() => {
    // Simulate API call for analytics data
    setTimeout(() => {
      const mockAnalyticsData: AnalyticsData = {
        revenue: {
          total: 1250000,
          monthly: 98000,
          growth: 12.5,
          chartData: [
            { month: 'T1', value: 85000 },
            { month: 'T2', value: 92000 },
            { month: 'T3', value: 88000 },
            { month: 'T4', value: 95000 },
            { month: 'T5', value: 102000 },
            { month: 'T6', value: 98000 }
          ]
        },
        users: {
          total: 15420,
          active: 8920,
          new: 1250,
          growth: 8.3,
          chartData: [
            { month: 'T1', value: 8200 },
            { month: 'T2', value: 8400 },
            { month: 'T3', value: 8600 },
            { month: 'T4', value: 8800 },
            { month: 'T5', value: 9000 },
            { month: 'T6', value: 8920 }
          ]
        },
        courses: {
          total: 1247,
          published: 1189,
          draft: 58,
          enrollment: 45620,
          chartData: [
            { month: 'T1', value: 42000 },
            { month: 'T2', value: 43500 },
            { month: 'T3', value: 44800 },
            { month: 'T4', value: 45200 },
            { month: 'T5', value: 45500 },
            { month: 'T6', value: 45620 }
          ]
        },
        engagement: {
          completionRate: 78.5,
          avgSessionTime: 24.3,
          bounceRate: 32.1,
          chartData: [
            { month: 'T1', value: 75.2 },
            { month: 'T2', value: 76.8 },
            { month: 'T3', value: 77.5 },
            { month: 'T4', value: 78.1 },
            { month: 'T5', value: 78.3 },
            { month: 'T6', value: 78.5 }
          ]
        }
      };

      const mockTopPerformers: TopPerformer[] = [
        {
          _id: '1',
          name: 'React Advanced Patterns',
          type: 'course',
          metric: 'Doanh thu',
          value: 125000,
          change: 15.2,
          icon: '📚'
        },
        {
          _id: '2',
          name: 'Nguyễn Văn A',
          type: 'instructor',
          metric: 'Học viên',
          value: 1247,
          change: 8.7,
          icon: '👨‍🏫'
        },
        {
          _id: '3',
          name: 'Lập trình Web',
          type: 'category',
          metric: 'Khóa học',
          value: 89,
          change: 12.3,
          icon: '🌐'
        },
        {
          _id: '4',
          name: 'Machine Learning Basics',
          type: 'course',
          metric: 'Đánh giá',
          value: 4.8,
          change: 5.2,
          icon: '📚'
        },
        {
          _id: '5',
          name: 'Trần Thị B',
          type: 'instructor',
          metric: 'Doanh thu',
          value: 89000,
          change: 22.1,
          icon: '👩‍🏫'
        }
      ];

      setAnalyticsData(mockAnalyticsData);
      setTopPerformers(mockTopPerformers);
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getGrowthColor = (value: number) => {
    return value >= 0 ? 'green' : 'red';
  };

  const renderChart = (data: { month: string; value: number }[], metric: string) => {
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue;

    return (
      <div className="chart-container">
        <div className="chart-bars">
          {data.map((item, index) => {
            const height = range > 0 ? ((item.value - minValue) / range) * 100 : 50;
            return (
              <div key={index} className="chart-bar">
                <div 
                  className="bar-fill"
                  style={{ height: `${height}%` }}
                ></div>
                <span className="bar-label">{item.month}</span>
                <span className="bar-value">
                  {metric === 'revenue' ? formatCurrency(item.value) : 
                   metric === 'users' || metric === 'courses' ? formatNumber(item.value) :
                   `${item.value.toFixed(1)}%`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="analytics-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải dữ liệu Analytics...</p>
      </div>
    );
  }

  if (!analyticsData) {
    return <div>Không có dữ liệu</div>;
  }

  return (
    <div className="analytics">
      {/* Header */}
      <div className="analytics-header">
        <div className="header-content">
          <h1>📈 Analytics & Báo cáo</h1>
          <p>Phân tích dữ liệu toàn diện về hiệu suất hệ thống LMS</p>
        </div>
        <div className="header-controls">
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="date-range-select"
          >
            <option value="7d">7 ngày qua</option>
            <option value="30d">30 ngày qua</option>
            <option value="90d">90 ngày qua</option>
            <option value="1y">1 năm qua</option>
          </select>
          <button className="btn btn-primary">
            📊 Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="key-metrics-grid">
        <div className="metric-card revenue">
          <div className="metric-header">
            <div className="metric-icon">💰</div>
            <div className="metric-info">
              <h3>Doanh thu</h3>
              <p>Tháng này</p>
            </div>
          </div>
          <div className="metric-value">
            {formatCurrency(analyticsData.revenue.monthly)}
          </div>
          <div className={`metric-change ${getGrowthColor(analyticsData.revenue.growth)}`}>
            {formatPercentage(analyticsData.revenue.growth)}
          </div>
        </div>

        <div className="metric-card users">
          <div className="metric-header">
            <div className="metric-icon">👥</div>
            <div className="metric-info">
              <h3>Người dùng</h3>
              <p>Hoạt động</p>
            </div>
          </div>
          <div className="metric-value">
            {formatNumber(analyticsData.users.active)}
          </div>
          <div className={`metric-change ${getGrowthColor(analyticsData.users.growth)}`}>
            {formatPercentage(analyticsData.users.growth)}
          </div>
        </div>

        <div className="metric-card courses">
          <div className="metric-header">
            <div className="metric-icon">📚</div>
            <div className="metric-info">
              <h3>Khóa học</h3>
              <p>Đã xuất bản</p>
            </div>
          </div>
          <div className="metric-value">
            {formatNumber(analyticsData.courses.published)}
          </div>
          <div className="metric-subtitle">
            / {formatNumber(analyticsData.courses.total)} tổng cộng
          </div>
        </div>

        <div className="metric-card engagement">
          <div className="metric-header">
            <div className="metric-icon">🎯</div>
            <div className="metric-info">
              <h3>Tỷ lệ hoàn thành</h3>
              <p>Trung bình</p>
            </div>
          </div>
          <div className="metric-value">
            {analyticsData.engagement.completionRate}%
          </div>
          <div className="metric-subtitle">
            Thời gian trung bình: {analyticsData.engagement.avgSessionTime} phút
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="charts-header">
          <h2>📊 Biểu đồ xu hướng</h2>
          <div className="chart-tabs">
            <button 
              className={`chart-tab ${selectedMetric === 'revenue' ? 'active' : ''}`}
              onClick={() => setSelectedMetric('revenue')}
            >
              💰 Doanh thu
            </button>
            <button 
              className={`chart-tab ${selectedMetric === 'users' ? 'active' : ''}`}
              onClick={() => setSelectedMetric('users')}
            >
              👥 Người dùng
            </button>
            <button 
              className={`chart-tab ${selectedMetric === 'courses' ? 'active' : ''}`}
              onClick={() => setSelectedMetric('courses')}
            >
              📚 Khóa học
            </button>
            <button 
              className={`chart-tab ${selectedMetric === 'engagement' ? 'active' : ''}`}
              onClick={() => setSelectedMetric('engagement')}
            >
              🎯 Tương tác
            </button>
          </div>
        </div>

        <div className="chart-display">
          {selectedMetric === 'revenue' && renderChart(analyticsData.revenue.chartData, 'revenue')}
          {selectedMetric === 'users' && renderChart(analyticsData.users.chartData, 'users')}
          {selectedMetric === 'courses' && renderChart(analyticsData.courses.chartData, 'courses')}
          {selectedMetric === 'engagement' && renderChart(analyticsData.engagement.chartData, 'engagement')}
        </div>
      </div>

      {/* Top Performers */}
      <div className="top-performers-section">
        <h2>🏆 Top Performers</h2>
        <div className="performers-grid">
          {topPerformers.map(performer => (
            <div key={performer._id} className="performer-card">
              <div className="performer-header">
                <div className="performer-icon">{performer.icon}</div>
                <div className="performer-info">
                  <h4>{performer.name}</h4>
                  <span className="performer-type">{performer.type}</span>
                </div>
              </div>
              <div className="performer-metrics">
                <div className="metric-label">{performer.metric}</div>
                <div className="metric-value">
                  {performer.metric === 'Doanh thu' ? formatCurrency(performer.value) :
                   performer.metric === 'Đánh giá' ? `${performer.value}/5.0` :
                   formatNumber(performer.value)}
                </div>
                <div className={`metric-change ${getGrowthColor(performer.change)}`}>
                  {formatPercentage(performer.change)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="detailed-stats-section">
        <h2>📋 Thống kê chi tiết</h2>
        <div className="stats-grid">
          <div className="stat-group">
            <h3>💰 Tài chính</h3>
            <div className="stat-item">
              <span>Doanh thu tổng:</span>
              <span>{formatCurrency(analyticsData.revenue.total)}</span>
            </div>
            <div className="stat-item">
              <span>Tăng trưởng TB:</span>
              <span className={getGrowthColor(analyticsData.revenue.growth)}>
                {formatPercentage(analyticsData.revenue.growth)}
              </span>
            </div>
          </div>

          <div className="stat-group">
            <h3>👥 Người dùng</h3>
            <div className="stat-item">
              <span>Tổng số:</span>
              <span>{formatNumber(analyticsData.users.total)}</span>
            </div>
            <div className="stat-item">
              <span>Mới tháng này:</span>
              <span>{formatNumber(analyticsData.users.new)}</span>
            </div>
          </div>

          <div className="stat-group">
            <h3>📚 Khóa học</h3>
            <div className="stat-item">
              <span>Tổng số:</span>
              <span>{formatNumber(analyticsData.courses.total)}</span>
            </div>
            <div className="stat-item">
              <span>Đăng ký:</span>
              <span>{formatNumber(analyticsData.courses.enrollment)}</span>
            </div>
          </div>

          <div className="stat-group">
            <h3>🎯 Tương tác</h3>
            <div className="stat-item">
              <span>Tỷ lệ bounce:</span>
              <span>{analyticsData.engagement.bounceRate}%</span>
            </div>
            <div className="stat-item">
              <span>Thời gian TB:</span>
              <span>{analyticsData.engagement.avgSessionTime} phút</span>
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="export-section">
        <h2>📤 Xuất báo cáo</h2>
        <div className="export-options">
          <button className="btn btn-secondary">
            📊 PDF Report
          </button>
          <button className="btn btn-secondary">
            📈 Excel Data
          </button>
          <button className="btn btn-secondary">
            📋 CSV Export
          </button>
          <button className="btn btn-primary">
            🔄 Tự động gửi email
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
