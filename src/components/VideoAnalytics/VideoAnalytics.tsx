import React, { useState, useEffect } from 'react';
import { videoService } from '@/services/client/video.service';
import { toast } from 'react-hot-toast';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import './VideoAnalytics.css';

interface VideoAnalyticsProps {
  lessonId: string;
  isTeacher?: boolean;
}

interface AnalyticsData {
  totalWatchTime: number;
  completionRate: number;
  totalEvents: number;
  averageWatchTime: number;
  dropOffPoints: number[];
  heatmap: Array<{ timestamp: number; watchCount: number }>;
  studentStats?: Array<{
    studentId: string;
    studentName: string;
    totalWatchTime: number;
    completionRate: number;
    lastWatchedAt: string;
  }>;
}

const VideoAnalytics: React.FC<VideoAnalyticsProps> = ({
  lessonId,
  isTeacher = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    loadAnalytics();
  }, [lessonId, isTeacher]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = isTeacher
        ? await videoService.getLessonAnalytics(lessonId)
        : await videoService.getStudentAnalytics(lessonId);

      if (response.success) {
        setAnalytics(response.data);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Không thể tải dữ liệu phân tích');
    } finally {
      setLoading(false);
    }
  };

  // Format time
  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    
    if (h > 0) {
      return `${h}h ${m}m ${s}s`;
    }
    if (m > 0) {
      return `${m}m ${s}s`;
    }
    return `${s}s`;
  };

  // Format percentage
  const formatPercent = (value: number): string => {
    return `${Math.round(value)}%`;
  };

  // Prepare heatmap data for chart
  const prepareHeatmapData = () => {
    if (!analytics?.heatmap) return [];
    
    return analytics.heatmap.map((item) => ({
      time: formatTime(item.timestamp),
      timestamp: item.timestamp,
      watchCount: item.watchCount,
    }));
  };

  // Prepare drop-off data
  const prepareDropOffData = () => {
    if (!analytics?.dropOffPoints) return [];
    
    return analytics.dropOffPoints.map((timestamp, index) => ({
      point: `Point ${index + 1}`,
      timestamp,
      time: formatTime(timestamp),
    }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!analytics) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h6" color="text.secondary">
          Chưa có dữ liệu phân tích
        </Typography>
      </Box>
    );
  }

  return (
    <div className="video-analytics-container">
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Phân Tích Video
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                Tổng Thời Gian Xem
              </Typography>
              <Typography variant="h4" component="div">
                {formatTime(analytics.totalWatchTime)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                Tỷ Lệ Hoàn Thành
              </Typography>
              <Typography variant="h4" component="div" color="primary">
                {formatPercent(analytics.completionRate)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                Thời Gian Xem Trung Bình
              </Typography>
              <Typography variant="h4" component="div">
                {formatTime(analytics.averageWatchTime)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                Tổng Số Sự Kiện
              </Typography>
              <Typography variant="h4" component="div">
                {analytics.totalEvents}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Bản Đồ Nhiệt" />
          <Tab label="Điểm Dừng Xem" />
          {isTeacher && analytics.studentStats && <Tab label="Thống Kê Học Viên" />}
        </Tabs>
      </Paper>

      {/* Heatmap Tab */}
      {activeTab === 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Bản Đồ Nhiệt Xem Video
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Hiển thị số lần mỗi phần của video được xem
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={prepareHeatmapData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  label={{ value: 'Thời Gian Video', position: 'insideBottom', offset: -5 }}
                />
                <YAxis
                  label={{ value: 'Số Lần Xem', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  formatter={(value: number) => [`${value} lần xem`, 'Số Lần Xem']}
                  labelFormatter={(label) => `Thời gian: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="watchCount"
                  stroke="#a435f0"
                  fill="#a435f0"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Drop-off Points Tab */}
      {activeTab === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Điểm Dừng Xem
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Các thời điểm học viên dừng xem video
            </Typography>
            {analytics.dropOffPoints.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={prepareDropOffData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis
                    label={{ value: 'Số Lượng Dừng Xem', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value} học viên`, 'Dừng Xem']}
                    labelFormatter={(label) => `Thời gian: ${label}`}
                  />
                  <Bar dataKey="timestamp" fill="#f44336" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box textAlign="center" py={4}>
                <Typography variant="body1" color="text.secondary">
                  Chưa phát hiện điểm dừng xem
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Student Stats Tab (Teacher only) */}
      {activeTab === 2 && isTeacher && analytics.studentStats && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Thống Kê Học Viên
            </Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <table className="video-analytics-student-table">
                <thead>
                  <tr>
                    <th>Tên Học Viên</th>
                    <th>Thời Gian Xem</th>
                    <th>Tỷ Lệ Hoàn Thành</th>
                    <th>Lần Xem Cuối</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.studentStats.map((student) => (
                    <tr key={student.studentId}>
                      <td>{student.studentName}</td>
                      <td>{formatTime(student.totalWatchTime)}</td>
                      <td>
                        <Box
                          sx={{
                            display: 'inline-block',
                            width: '100px',
                            height: '8px',
                            bgcolor: 'grey.200',
                            borderRadius: 1,
                            overflow: 'hidden',
                            mr: 1,
                          }}
                        >
                          <Box
                            sx={{
                              width: `${student.completionRate}%`,
                              height: '100%',
                              bgcolor: 'primary.main',
                            }}
                          />
                        </Box>
                        {formatPercent(student.completionRate)}
                      </td>
                      <td>
                        {new Date(student.lastWatchedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VideoAnalytics;
