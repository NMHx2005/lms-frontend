import React, { useState, useEffect } from 'react';
// import './PerformanceMonitoring.css';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Grid,
  Paper,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  LinearProgress,
  Chip,
  Button,
  Divider,
  CircularProgress
} from '@mui/material';

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

  useEffect(() => {
    const mockMetrics: PerformanceMetrics = {
      server: { cpu: 45.2, memory: 78.5, disk: 62.3, network: 34.7, uptime: 99.97, responseTime: 245, requestsPerSecond: 156, errorRate: 0.8 },
      database: { connections: 89, queryTime: 125, slowQueries: 12, cacheHitRate: 94.2, indexUsage: 87.5, deadlocks: 2, size: 2.4 },
      userExperience: { pageLoadTime: 1.8, apiResponseTime: 245, mobilePerformance: 92, desktopPerformance: 96, bounceRate: 23.4, sessionDuration: 8.5, conversionRate: 4.2 },
      alerts: { critical: 1, warning: 3, info: 7, resolved: 15 }
    };

    const mockAlerts: Alert[] = [
      { id: '1', type: 'critical', title: 'CPU Usage High', description: 'Server CPU usage has exceeded 90% for more than 5 minutes', timestamp: '2024-12-10T14:30:00Z', status: 'active', source: 'Server Monitoring', value: 92.5, threshold: 90 },
      { id: '2', type: 'warning', title: 'Memory Usage Warning', description: 'Server memory usage is approaching critical levels', timestamp: '2024-12-10T14:25:00Z', status: 'active', source: 'Server Monitoring', value: 85.2, threshold: 80 },
      { id: '3', type: 'warning', title: 'Database Slow Queries', description: 'Multiple slow queries detected in the last hour', timestamp: '2024-12-10T14:20:00Z', status: 'active', source: 'Database Monitoring', value: 15, threshold: 10 },
      { id: '4', type: 'info', title: 'High Traffic Detected', description: 'Unusual traffic spike detected, monitoring performance', timestamp: '2024-12-10T14:15:00Z', status: 'active', source: 'Network Monitoring', value: 180, threshold: 150 }
    ];

    setMetrics(mockMetrics);
    setAlerts(mockAlerts);
    setLoading(false);
  }, []);

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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">Đang tải dữ liệu hiệu suất...</Typography>
        </Stack>
      </Box>
    );
  }

  if (!metrics) {
    return (
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h6">❌ Lỗi tải dữ liệu</Typography>
        <Typography variant="body2" color="text.secondary">Không thể tải dữ liệu hiệu suất hệ thống.</Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Header */}
      <Card sx={{ background: 'linear-gradient(135deg, #5b8def 0%, #8b5cf6 100%)', color: 'white', borderRadius: 2 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between" spacing={2}>
            <Box>
              <Typography variant="h5" fontWeight={800}>Giám sát hiệu suất</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Theo dõi hiệu suất server, database và trải nghiệm người dùng</Typography>
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Khoảng thời gian</InputLabel>
                <Select label="Khoảng thời gian" value={timeRange} onChange={(e) => setTimeRange(e.target.value as any)} MenuProps={{ disableScrollLock: true }}>
                  <MenuItem value="1h">1 giờ</MenuItem>
                  <MenuItem value="6h">6 giờ</MenuItem>
                  <MenuItem value="24h">24 giờ</MenuItem>
                  <MenuItem value="7d">7 ngày</MenuItem>
                  <MenuItem value="30d">30 ngày</MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel control={<Switch checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} />} label="Tự động cập nhật" />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Paper variant="outlined">
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} variant="scrollable" scrollButtons allowScrollButtonsMobile>
          <Tab value="overview" label="📊 Tổng quan" />
          <Tab value="server" label="🖥️ Server" />
          <Tab value="database" label="🗄️ Database" />
          <Tab value="ux" label="👥 Trải nghiệm người dùng" />
          <Tab value="alerts" label={`🚨 Cảnh báo (${alerts.filter(a => a.status === 'active').length})`} />
        </Tabs>
      </Paper>

      {/* Overview */}
      {activeTab === 'overview' && (
        <Stack spacing={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography fontWeight={800}>🖥️ Server</Typography>
                    <Typography>{getStatusIcon(metrics.server.cpu, { warning: 60, critical: 80 })}</Typography>
                  </Stack>
                  <Typography variant="h4" fontWeight={800}>{metrics.server.cpu.toFixed(1)}%</Typography>
                  <Typography variant="caption" color="text.secondary">CPU Usage</Typography>
                  <Stack mt={1} spacing={0.5}>
                    <Typography variant="caption" color="text.secondary">Memory: {metrics.server.memory.toFixed(1)}%</Typography>
                    <Typography variant="caption" color="text.secondary">Response: {formatDuration(metrics.server.responseTime / 1000)}</Typography>
                    <Typography variant="caption" color="text.secondary">Uptime: {formatUptime(metrics.server.uptime)}</Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography fontWeight={800}>🗄️ Database</Typography>
                    <Typography>{getStatusIcon(metrics.database.slowQueries, { warning: 5, critical: 10 })}</Typography>
                  </Stack>
                  <Typography variant="h4" fontWeight={800}>{metrics.database.slowQueries}</Typography>
                  <Typography variant="caption" color="text.secondary">Slow Queries</Typography>
                  <Stack mt={1} spacing={0.5}>
                    <Typography variant="caption" color="text.secondary">Cache Hit: {metrics.database.cacheHitRate.toFixed(1)}%</Typography>
                    <Typography variant="caption" color="text.secondary">Query Time: {formatDuration(metrics.database.queryTime / 1000)}</Typography>
                    <Typography variant="caption" color="text.secondary">Size: {formatBytes(metrics.database.size * 1024)}</Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography fontWeight={800}>👥 User Experience</Typography>
                    <Typography>{getStatusIcon(metrics.userExperience.pageLoadTime, { warning: 2, critical: 3 })}</Typography>
                  </Stack>
                  <Typography variant="h4" fontWeight={800}>{metrics.userExperience.pageLoadTime.toFixed(1)}s</Typography>
                  <Typography variant="caption" color="text.secondary">Page Load Time</Typography>
                  <Stack mt={1} spacing={0.5}>
                    <Typography variant="caption" color="text.secondary">Mobile: {metrics.userExperience.mobilePerformance}/100</Typography>
                    <Typography variant="caption" color="text.secondary">Desktop: {metrics.userExperience.desktopPerformance}/100</Typography>
                    <Typography variant="caption" color="text.secondary">Bounce Rate: {metrics.userExperience.bounceRate.toFixed(1)}%</Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography fontWeight={800}>🚨 Alerts</Typography>
                    <Typography>{metrics.alerts.critical > 0 ? '🔴' : metrics.alerts.warning > 0 ? '🟡' : '🟢'}</Typography>
                  </Stack>
                  <Typography variant="h4" fontWeight={800}>{metrics.alerts.critical + metrics.alerts.warning}</Typography>
                  <Typography variant="caption" color="text.secondary">Active Alerts</Typography>
                  <Stack mt={1} spacing={0.5}>
                    <Typography variant="caption" color="text.secondary">Critical: {metrics.alerts.critical}</Typography>
                    <Typography variant="caption" color="text.secondary">Warning: {metrics.alerts.warning}</Typography>
                    <Typography variant="caption" color="text.secondary">Resolved: {metrics.alerts.resolved}</Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography fontWeight={800}>📈 Server Performance Trends</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 160, mt: 2 }}>
                    {[60, 80, 45, 70, 55, 90].map((h, i) => (
                      <Box key={i} sx={{ width: '16%', height: `${h}%`, bgcolor: 'primary.main', borderRadius: 1 }} />
                    ))}
                  </Box>
                  <Typography variant="caption" color="text.secondary">Biểu đồ hiệu suất server trong 24 giờ qua</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography fontWeight={800}>📊 Database Performance</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 160, mt: 2 }}>
                    {[75, 90, 60, 85, 70].map((h, i) => (
                      <Box key={i} sx={{ flex: 1, height: `${h}%`, bgcolor: 'secondary.main', borderRadius: 1 }} />
                    ))}
                  </Box>
                  <Typography variant="caption" color="text.secondary">Hiệu suất database và cache hit rate</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Stack>
      )}

      {/* Server */}
      {activeTab === 'server' && (
        <Stack spacing={2}>
          <Card variant="outlined">
            <CardContent>
              <Grid container spacing={2}>
                {[{ label: 'CPU Usage', value: metrics.server.cpu, thresholds: { warning: 60, critical: 80 } }, { label: 'Memory Usage', value: metrics.server.memory, thresholds: { warning: 70, critical: 85 } }, { label: 'Disk Usage', value: metrics.server.disk, thresholds: { warning: 70, critical: 85 } }, { label: 'Network Usage', value: metrics.server.network, thresholds: { warning: 70, critical: 85 } }].map((m, idx) => (
                  <Grid item xs={12} md={6} key={idx}>
                    <Typography variant="body2" color="text.secondary">{m.label}</Typography>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography fontWeight={700}>{m.value.toFixed(1)}%</Typography>
                      <Chip size="small" label={getStatusIcon(m.value, m.thresholds)} sx={{ bgcolor: getStatusColor(m.value, m.thresholds), color: '#fff' }} />
                    </Stack>
                    <LinearProgress variant="determinate" value={m.value} sx={{ height: 8, borderRadius: 1, mt: 1, '& .MuiLinearProgress-bar': { backgroundColor: getStatusColor(m.value, m.thresholds) } }} />
                  </Grid>
                ))}
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                {[{ icon: '⏱️', label: 'Response Time', value: formatDuration(metrics.server.responseTime / 1000) }, { icon: '📡', label: 'Requests/sec', value: metrics.server.requestsPerSecond }, { icon: '❌', label: 'Error Rate', value: `${metrics.server.errorRate.toFixed(2)}%` }, { icon: '🔄', label: 'Uptime', value: formatUptime(metrics.server.uptime) }].map((s, i) => (
                  <Grid item xs={6} md={3} key={i}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography>{s.icon}</Typography>
                      <Typography fontWeight={800}>{s.value}</Typography>
                      <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Stack>
      )}

      {/* Database */}
      {activeTab === 'database' && (
        <Stack spacing={2}>
          <Card variant="outlined">
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">Active Connections</Typography>
                  <Typography fontWeight={700}>{metrics.database.connections}</Typography>
                  <LinearProgress variant="determinate" value={Math.min(100, (metrics.database.connections / 100) * 100)} sx={{ height: 8, borderRadius: 1, mt: 1, '& .MuiLinearProgress-bar': { backgroundColor: getStatusColor(metrics.database.connections, { warning: 70, critical: 90 }) } }} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">Cache Hit Rate</Typography>
                  <Typography fontWeight={700}>{metrics.database.cacheHitRate.toFixed(1)}%</Typography>
                  <LinearProgress variant="determinate" value={metrics.database.cacheHitRate} sx={{ height: 8, borderRadius: 1, mt: 1, '& .MuiLinearProgress-bar': { backgroundColor: getStatusColor(100 - metrics.database.cacheHitRate, { warning: 20, critical: 40 }) } }} />
                </Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                {[{ icon: '⏱️', label: 'Avg Query Time', value: formatDuration(metrics.database.queryTime / 1000) }, { icon: '🐌', label: 'Slow Queries', value: metrics.database.slowQueries }, { icon: '📊', label: 'Index Usage', value: `${metrics.database.indexUsage.toFixed(1)}%` }, { icon: '💾', label: 'Database Size', value: formatBytes(metrics.database.size * 1024) }].map((s, i) => (
                  <Grid item xs={6} md={3} key={i}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography>{s.icon}</Typography>
                      <Typography fontWeight={800}>{s.value}</Typography>
                      <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Stack>
      )}

      {/* UX */}
      {activeTab === 'ux' && (
        <Stack spacing={2}>
          <Card variant="outlined">
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">Page Load Time</Typography>
                  <Typography fontWeight={700}>{metrics.userExperience.pageLoadTime.toFixed(1)}s</Typography>
                  <LinearProgress variant="determinate" value={Math.min(100, (metrics.userExperience.pageLoadTime / 5) * 100)} sx={{ height: 8, borderRadius: 1, mt: 1, '& .MuiLinearProgress-bar': { backgroundColor: getStatusColor(metrics.userExperience.pageLoadTime, { warning: 2, critical: 3 }) } }} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">API Response Time</Typography>
                  <Typography fontWeight={700}>{formatDuration(metrics.userExperience.apiResponseTime / 1000)}</Typography>
                  <LinearProgress variant="determinate" value={Math.min(100, (metrics.userExperience.apiResponseTime / 1000) * 20)} sx={{ height: 8, borderRadius: 1, mt: 1, '& .MuiLinearProgress-bar': { backgroundColor: getStatusColor(metrics.userExperience.apiResponseTime, { warning: 500, critical: 1000 }) } }} />
                </Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                {[{ icon: '📱', label: 'Mobile Performance', value: `${metrics.userExperience.mobilePerformance}/100` }, { icon: '💻', label: 'Desktop Performance', value: `${metrics.userExperience.desktopPerformance}/100` }, { icon: '📉', label: 'Bounce Rate', value: `${metrics.userExperience.bounceRate.toFixed(1)}%` }, { icon: '⏱️', label: 'Session Duration', value: `${metrics.userExperience.sessionDuration.toFixed(1)}m` }].map((s, i) => (
                  <Grid item xs={6} md={3} key={i}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography>{s.icon}</Typography>
                      <Typography fontWeight={800}>{s.value}</Typography>
                      <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Stack>
      )}

      {/* Alerts */}
      {activeTab === 'alerts' && (
        <Stack spacing={2}>
          <Grid container spacing={2}>
            {[{ label: 'Critical', value: metrics.alerts.critical, color: 'error' as const }, { label: 'Warning', value: metrics.alerts.warning, color: 'warning' as const }, { label: 'Info', value: metrics.alerts.info, color: 'info' as const }, { label: 'Resolved', value: metrics.alerts.resolved, color: 'success' as const }].map((a, i) => (
              <Grid item xs={6} md={3} key={i}>
                <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                  <Chip color={a.color} label={a.label} />
                  <Typography variant="h5" fontWeight={800} mt={1}>{a.value}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Stack spacing={1}>
            {alerts.filter(alert => alert.status === 'active').map(alert => (
              <Paper key={alert.id} variant="outlined" sx={{ p: 2, borderLeft: 4, borderColor: alert.type === 'critical' ? 'error.main' : alert.type === 'warning' ? 'warning.main' : 'info.main' }}>
                <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={1}>
                  <Stack spacing={0.5}>
                    <Typography fontWeight={800}>{alert.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{alert.description}</Typography>
                    <Stack direction="row" spacing={2}>
                      <Typography variant="caption" color="text.secondary">Nguồn: {alert.source}</Typography>
                      <Typography variant="caption" color="text.secondary">Hiện tại: {alert.value} | Ngưỡng: {alert.threshold}</Typography>
                    </Stack>
                  </Stack>
                  <Stack alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
                    <Typography variant="caption" color="text.secondary">{new Date(alert.timestamp).toLocaleString('vi-VN')}</Typography>
                    <Stack direction="row" spacing={1} mt={1}>
                      <Button size="small" variant="outlined">Acknowledge</Button>
                      <Button size="small" variant="contained">Resolve</Button>
                    </Stack>
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Stack>
      )}
    </Box>
  );
};

export default PerformanceMonitoring;
