import React, { useState, useEffect } from 'react';
import './PerformanceMonitoring.css';

interface PerformanceMetrics {
  server: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
    uptime: number;
    responseTime: number;
    requestsPerSecond: number;
    errorRate: number;
  };
  database: {
    connections: number;
    queryTime: number;
    slowQueries: number;
    cacheHitRate: number;
    indexUsage: number;
    deadlocks: number;
    size: number;
  };
  userExperience: {
    pageLoadTime: number;
    apiResponseTime: number;
    mobilePerformance: number;
    desktopPerformance: number;
    bounceRate: number;
    sessionDuration: number;
    conversionRate: number;
  };
  alerts: {
    critical: number;
    warning: number;
    info: number;
    resolved: number;
  };
}

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: string;
  status: 'active' | 'resolved';
  source: string;
  value: number;
  threshold: number;
}

const PerformanceMonitoring: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'server' | 'database' | 'ux' | 'alerts'>('overview');
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d' | '30d'>('24h');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Mock data
  useEffect(() => {
    const mockMetrics: PerformanceMetrics = {
      server: {
        cpu: 45.2,
        memory: 78.5,
        disk: 62.3,
        network: 34.7,
        uptime: 99.97,
        responseTime: 245,
        requestsPerSecond: 156,
        errorRate: 0.8
      },
      database: {
        connections: 89,
        queryTime: 125,
        slowQueries: 12,
        cacheHitRate: 94.2,
        indexUsage: 87.5,
        deadlocks: 2,
        size: 2.4
      },
      userExperience: {
        pageLoadTime: 1.8,
        apiResponseTime: 245,
        mobilePerformance: 92,
        desktopPerformance: 96,
        bounceRate: 23.4,
        sessionDuration: 8.5,
        conversionRate: 4.2
      },
      alerts: {
        critical: 1,
        warning: 3,
        info: 7,
        resolved: 15
      }
    };

    const mockAlerts: Alert[] = [
      {
        id: '1',
        type: 'critical',
        title: 'CPU Usage High',
        description: 'Server CPU usage has exceeded 90% for more than 5 minutes',
        timestamp: '2024-12-10T14:30:00Z',
        status: 'active',
        source: 'Server Monitoring',
        value: 92.5,
        threshold: 90
      },
      {
        id: '2',
        type: 'warning',
        title: 'Memory Usage Warning',
        description: 'Server memory usage is approaching critical levels',
        timestamp: '2024-12-10T14:25:00Z',
        status: 'active',
        source: 'Server Monitoring',
        value: 85.2,
        threshold: 80
      },
      {
        id: '3',
        type: 'warning',
        title: 'Database Slow Queries',
        description: 'Multiple slow queries detected in the last hour',
        timestamp: '2024-12-10T14:20:00Z',
        status: 'active',
        source: 'Database Monitoring',
        value: 15,
        threshold: 10
      },
      {
        id: '4',
        type: 'info',
        title: 'High Traffic Detected',
        description: 'Unusual traffic spike detected, monitoring performance',
        timestamp: '2024-12-10T14:15:00Z',
        status: 'active',
        source: 'Network Monitoring',
        value: 180,
        threshold: 150
      }
    ];

    setMetrics(mockMetrics);
    setAlerts(mockAlerts);
    setLoading(false);
  }, []);

  // Auto-refresh simulation
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      if (metrics) {
        setMetrics(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            server: {
              ...prev.server,
              cpu: Math.max(0, Math.min(100, prev.server.cpu + (Math.random() - 0.5) * 10)),
              memory: Math.max(0, Math.min(100, prev.server.memory + (Math.random() - 0.5) * 5)),
              responseTime: Math.max(100, Math.min(500, prev.server.responseTime + (Math.random() - 0.5) * 50))
            }
          };
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh, metrics]);

  const getStatusColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return '#dc2626';
    if (value >= thresholds.warning) return '#f59e0b';
    return '#10b981';
  };

  const getStatusIcon = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return '🔴';
    if (value >= thresholds.warning) return '🟡';
    return '🟢';
  };

  const formatUptime = (uptime: number) => {
    const days = Math.floor(uptime);
    const hours = Math.floor((uptime - days) * 24);
    const minutes = Math.floor(((uptime - days) * 24 - hours) * 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const formatBytes = (bytes: number) => {
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} GB`;
    return `${bytes.toFixed(1)} MB`;
  };

  const formatDuration = (seconds: number) => {
    if (seconds >= 60) return `${(seconds / 60).toFixed(1)}m`;
    return `${seconds.toFixed(1)}s`;
  };

  if (loading) {
    return (
      <div className="performance-monitoring loading">
        <div className="loading-spinner"></div>
        <p>Đang tải dữ liệu hiệu suất...</p>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="performance-monitoring error">
        <h3>❌ Lỗi tải dữ liệu</h3>
        <p>Không thể tải dữ liệu hiệu suất hệ thống.</p>
      </div>
    );
  }

  return (
    <div className="performance-monitoring">
      <div className="header">
        <div>
          <h1>Giám sát hiệu suất</h1>
          <p>Theo dõi hiệu suất server, database và trải nghiệm người dùng</p>
        </div>
        <div className="header-controls">
          <div className="time-range-selector time-range-selector--nomargin">
            <label>Khoảng thời gian:</label>
            <select value={timeRange} onChange={(e) => setTimeRange(e.target.value as any)}>
              <option value="1h">1 giờ</option>
              <option value="6h">6 giờ</option>
              <option value="24h">24 giờ</option>
              <option value="7d">7 ngày</option>
              <option value="30d">30 ngày</option>
            </select>
          </div>
          <label className="auto-refresh-toggle">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            <span>Tự động cập nhật</span>
          </label>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Tổng quan
        </button>
        <button
          className={`tab ${activeTab === 'server' ? 'active' : ''}`}
          onClick={() => setActiveTab('server')}
        >
          🖥️ Server
        </button>
        <button
          className={`tab ${activeTab === 'database' ? 'active' : ''}`}
          onClick={() => setActiveTab('database')}
        >
          🗄️ Database
        </button>
        <button
          className={`tab ${activeTab === 'ux' ? 'active' : ''}`}
          onClick={() => setActiveTab('ux')}
        >
          👥 Trải nghiệm người dùng
        </button>
        <button
          className={`tab ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          🚨 Cảnh báo ({alerts.filter(a => a.status === 'active').length})
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="overview-tab">
          <div className="metrics-grid">
            <div className="metric-card critical">
              <div className="metric-header">
                <h3>🖥️ Server</h3>
                <span className={`status ${metrics.server.cpu > 80 ? 'critical' : metrics.server.cpu > 60 ? 'warning' : 'normal'}`}>
                  {getStatusIcon(metrics.server.cpu, { warning: 60, critical: 80 })}
                </span>
              </div>
              <div className="metric-value">{metrics.server.cpu.toFixed(1)}%</div>
              <div className="metric-label">CPU Usage</div>
              <div className="metric-details">
                <div>Memory: {metrics.server.memory.toFixed(1)}%</div>
                <div>Response: {formatDuration(metrics.server.responseTime / 1000)}</div>
                <div>Uptime: {formatUptime(metrics.server.uptime)}</div>
              </div>
            </div>

            <div className="metric-card warning">
              <div className="metric-header">
                <h3>🗄️ Database</h3>
                <span className={`status ${metrics.database.slowQueries > 10 ? 'critical' : metrics.database.slowQueries > 5 ? 'warning' : 'normal'}`}>
                  {getStatusIcon(metrics.database.slowQueries, { warning: 5, critical: 10 })}
                </span>
              </div>
              <div className="metric-value">{metrics.database.slowQueries}</div>
              <div className="metric-label">Slow Queries</div>
              <div className="metric-details">
                <div>Cache Hit: {metrics.database.cacheHitRate.toFixed(1)}%</div>
                <div>Query Time: {formatDuration(metrics.database.queryTime / 1000)}</div>
                <div>Size: {formatBytes(metrics.database.size * 1024)}</div>
              </div>
            </div>

            <div className="metric-card normal">
              <div className="metric-header">
                <h3>👥 User Experience</h3>
                <span className={`status ${metrics.userExperience.pageLoadTime > 3 ? 'critical' : metrics.userExperience.pageLoadTime > 2 ? 'warning' : 'normal'}`}>
                  {getStatusIcon(metrics.userExperience.pageLoadTime, { warning: 2, critical: 3 })}
                </span>
              </div>
              <div className="metric-value">{metrics.userExperience.pageLoadTime.toFixed(1)}s</div>
              <div className="metric-label">Page Load Time</div>
              <div className="metric-details">
                <div>Mobile: {metrics.userExperience.mobilePerformance}/100</div>
                <div>Desktop: {metrics.userExperience.desktopPerformance}/100</div>
                <div>Bounce Rate: {metrics.userExperience.bounceRate.toFixed(1)}%</div>
              </div>
            </div>

            <div className="metric-card info">
              <div className="metric-header">
                <h3>🚨 Alerts</h3>
                <span className="status">
                  {metrics.alerts.critical > 0 ? '🔴' : metrics.alerts.warning > 0 ? '🟡' : '🟢'}
                </span>
              </div>
              <div className="metric-value">{metrics.alerts.critical + metrics.alerts.warning}</div>
              <div className="metric-label">Active Alerts</div>
              <div className="metric-details">
                <div>Critical: {metrics.alerts.critical}</div>
                <div>Warning: {metrics.alerts.warning}</div>
                <div>Resolved: {metrics.alerts.resolved}</div>
              </div>
            </div>
          </div>

          <div className="charts-section">
            <div className="chart-container">
              <h3>📈 Server Performance Trends</h3>
              <div className="chart-placeholder">
                <div className="chart-line" style={{ height: '60%' }}></div>
                <div className="chart-line" style={{ height: '80%' }}></div>
                <div className="chart-line" style={{ height: '45%' }}></div>
                <div className="chart-line" style={{ height: '70%' }}></div>
                <div className="chart-line" style={{ height: '55%' }}></div>
                <div className="chart-line" style={{ height: '90%' }}></div>
              </div>
              <p>Biểu đồ hiệu suất server trong 24 giờ qua</p>
            </div>

            <div className="chart-container">
              <h3>📊 Database Performance</h3>
              <div className="chart-placeholder">
                <div className="chart-bar" style={{ height: '75%' }}></div>
                <div className="chart-bar" style={{ height: '90%' }}></div>
                <div className="chart-bar" style={{ height: '60%' }}></div>
                <div className="chart-bar" style={{ height: '85%' }}></div>
                <div className="chart-bar" style={{ height: '70%' }}></div>
              </div>
              <p>Hiệu suất database và cache hit rate</p>
            </div>
          </div>
        </div>
      )}

      {/* Server Tab */}
      {activeTab === 'server' && (
        <div className="server-tab">
          <div className="server-metrics">
            <div className="metric-row">
              <div className="metric-item">
                <div className="metric-label">CPU Usage</div>
                <div className="metric-value">{metrics.server.cpu.toFixed(1)}%</div>
                <div className="metric-bar">
                  <div 
                    className="metric-bar-fill" 
                    style={{ 
                      width: `${metrics.server.cpu}%`,
                      backgroundColor: getStatusColor(metrics.server.cpu, { warning: 60, critical: 80 })
                    }}
                  ></div>
                </div>
              </div>
              <div className="metric-item">
                <div className="metric-label">Memory Usage</div>
                <div className="metric-value">{metrics.server.memory.toFixed(1)}%</div>
                <div className="metric-bar">
                  <div 
                    className="metric-bar-fill" 
                    style={{ 
                      width: `${metrics.server.memory}%`,
                      backgroundColor: getStatusColor(metrics.server.memory, { warning: 70, critical: 85 })
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="metric-row">
              <div className="metric-item">
                <div className="metric-label">Disk Usage</div>
                <div className="metric-value">{metrics.server.disk.toFixed(1)}%</div>
                <div className="metric-bar">
                  <div 
                    className="metric-bar-fill" 
                    style={{ 
                      width: `${metrics.server.disk}%`,
                      backgroundColor: getStatusColor(metrics.server.disk, { warning: 70, critical: 85 })
                    }}
                  ></div>
                </div>
              </div>
              <div className="metric-item">
                <div className="metric-label">Network Usage</div>
                <div className="metric-value">{metrics.server.network.toFixed(1)}%</div>
                <div className="metric-bar">
                  <div 
                    className="metric-bar-fill" 
                    style={{ 
                      width: `${metrics.server.network}%`,
                      backgroundColor: getStatusColor(metrics.server.network, { warning: 70, critical: 85 })
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="server-stats">
              <div className="stat-card">
                <div className="stat-icon">⏱️</div>
                <div className="stat-value">{formatDuration(metrics.server.responseTime / 1000)}</div>
                <div className="stat-label">Response Time</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📡</div>
                <div className="stat-value">{metrics.server.requestsPerSecond}</div>
                <div className="stat-label">Requests/sec</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">❌</div>
                <div className="stat-value">{metrics.server.errorRate.toFixed(2)}%</div>
                <div className="stat-label">Error Rate</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🔄</div>
                <div className="stat-value">{formatUptime(metrics.server.uptime)}</div>
                <div className="stat-label">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Database Tab */}
      {activeTab === 'database' && (
        <div className="database-tab">
          <div className="database-metrics">
            <div className="metric-row">
              <div className="metric-item">
                <div className="metric-label">Active Connections</div>
                <div className="metric-value">{metrics.database.connections}</div>
                <div className="metric-bar">
                  <div 
                    className="metric-bar-fill" 
                    style={{ 
                      width: `${(metrics.database.connections / 100) * 100}%`,
                      backgroundColor: getStatusColor(metrics.database.connections, { warning: 70, critical: 90 })
                    }}
                  ></div>
                </div>
              </div>
              <div className="metric-item">
                <div className="metric-label">Cache Hit Rate</div>
                <div className="metric-value">{metrics.database.cacheHitRate.toFixed(1)}%</div>
                <div className="metric-bar">
                  <div 
                    className="metric-bar-fill" 
                    style={{ 
                      width: `${metrics.database.cacheHitRate}%`,
                      backgroundColor: getStatusColor(100 - metrics.database.cacheHitRate, { warning: 20, critical: 40 })
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="database-stats">
              <div className="stat-card">
                <div className="stat-icon">⏱️</div>
                <div className="stat-value">{formatDuration(metrics.database.queryTime / 1000)}</div>
                <div className="stat-label">Avg Query Time</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🐌</div>
                <div className="stat-value">{metrics.database.slowQueries}</div>
                <div className="stat-label">Slow Queries</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-value">{metrics.database.indexUsage.toFixed(1)}%</div>
                <div className="stat-label">Index Usage</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💾</div>
                <div className="stat-value">{formatBytes(metrics.database.size * 1024)}</div>
                <div className="stat-label">Database Size</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Experience Tab */}
      {activeTab === 'ux' && (
        <div className="ux-tab">
          <div className="ux-metrics">
            <div className="metric-row">
              <div className="metric-item">
                <div className="metric-label">Page Load Time</div>
                <div className="metric-value">{metrics.userExperience.pageLoadTime.toFixed(1)}s</div>
                <div className="metric-bar">
                  <div 
                    className="metric-bar-fill" 
                    style={{ 
                      width: `${(metrics.userExperience.pageLoadTime / 5) * 100}%`,
                      backgroundColor: getStatusColor(metrics.userExperience.pageLoadTime, { warning: 2, critical: 3 })
                    }}
                  ></div>
                </div>
              </div>
              <div className="metric-item">
                <div className="metric-label">API Response Time</div>
                <div className="metric-value">{formatDuration(metrics.userExperience.apiResponseTime / 1000)}</div>
                <div className="metric-bar">
                  <div 
                    className="metric-bar-fill" 
                    style={{ 
                      width: `${(metrics.userExperience.apiResponseTime / 1000) * 20}%`,
                      backgroundColor: getStatusColor(metrics.userExperience.apiResponseTime, { warning: 500, critical: 1000 })
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="ux-stats">
              <div className="stat-card">
                <div className="stat-icon">📱</div>
                <div className="stat-value">{metrics.userExperience.mobilePerformance}/100</div>
                <div className="stat-label">Mobile Performance</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💻</div>
                <div className="stat-value">{metrics.userExperience.desktopPerformance}/100</div>
                <div className="stat-label">Desktop Performance</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📉</div>
                <div className="stat-value">{metrics.userExperience.bounceRate.toFixed(1)}%</div>
                <div className="stat-label">Bounce Rate</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏱️</div>
                <div className="stat-value">{metrics.userExperience.sessionDuration.toFixed(1)}m</div>
                <div className="stat-label">Session Duration</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="alerts-tab">
          <div className="alerts-summary">
            <div className="alert-stat critical">
              <div className="alert-count">{metrics.alerts.critical}</div>
              <div className="alert-label">Critical</div>
            </div>
            <div className="alert-stat warning">
              <div className="alert-count">{metrics.alerts.warning}</div>
              <div className="alert-label">Warning</div>
            </div>
            <div className="alert-stat info">
              <div className="alert-count">{metrics.alerts.info}</div>
              <div className="alert-label">Info</div>
            </div>
            <div className="alert-stat resolved">
              <div className="alert-count">{metrics.alerts.resolved}</div>
              <div className="alert-label">Resolved</div>
            </div>
          </div>

          <div className="alerts-list">
            {alerts.filter(alert => alert.status === 'active').map(alert => (
              <div key={alert.id} className={`alert-item ${alert.type}`}>
                <div className="alert-header">
                  <div className="alert-type">{alert.type.toUpperCase()}</div>
                  <div className="alert-time">{new Date(alert.timestamp).toLocaleString('vi-VN')}</div>
                </div>
                <div className="alert-title">{alert.title}</div>
                <div className="alert-description">{alert.description}</div>
                <div className="alert-details">
                  <div className="alert-source">Source: {alert.source}</div>
                  <div className="alert-value">
                    Current: {alert.value} | Threshold: {alert.threshold}
                  </div>
                </div>
                <div className="alert-actions">
                  <button className="btn btn-secondary">Acknowledge</button>
                  <button className="btn btn-success">Resolve</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceMonitoring;
