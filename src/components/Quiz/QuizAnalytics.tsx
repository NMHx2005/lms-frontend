import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { toast } from 'react-toastify';
import api from '../../services/api';

export interface QuizAnalyticsData {
  lessonId: string;
  totalAttempts: number;
  totalStudents: number;
  averageScore: number;
  averageTime: number;
  passingRate: number;
  questionStats: Array<{
    questionIndex: number;
    question: string;
    correctCount: number;
    incorrectCount: number;
    unansweredCount: number;
    correctRate: number;
    averageTime: number;
    difficulty: number; // 0-100, based on correct rate
  }>;
  scoreDistribution: Array<{
    range: string;
    count: number;
  }>;
  timeDistribution: Array<{
    range: string;
    count: number;
  }>;
  attemptsOverTime: Array<{
    date: string;
    count: number;
    averageScore: number;
  }>;
}

interface QuizAnalyticsProps {
  lessonId: string;
  isTeacher?: boolean;
}

const QuizAnalytics: React.FC<QuizAnalyticsProps> = ({ lessonId, isTeacher: _isTeacher = false }) => {
  const [analytics, setAnalytics] = useState<QuizAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [lessonId]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/client/lessons/${lessonId}/quiz/analytics`);
      if (response.data.success && response.data.data) {
        setAnalytics(response.data.data);
      } else {
        // Fallback to empty state
        setAnalytics(null);
      }
    } catch (error: any) {
      console.error('Error loading analytics:', error);
      // Mock data for development if API not available
      if (error.response?.status === 404 || error.response?.status === 400) {
        setAnalytics({
          lessonId,
          totalAttempts: 45,
          totalStudents: 30,
          averageScore: 75.5,
          averageTime: 420,
          passingRate: 66.7,
          questionStats: [
            { questionIndex: 0, question: 'Java là ngôn ngữ gì?', correctCount: 28, incorrectCount: 2, unansweredCount: 0, correctRate: 93.3, averageTime: 15, difficulty: 7 },
            { questionIndex: 1, question: 'Từ khóa class trong Java?', correctCount: 25, incorrectCount: 5, unansweredCount: 0, correctRate: 83.3, averageTime: 12, difficulty: 17 },
            { questionIndex: 2, question: 'JVM là gì?', correctCount: 20, incorrectCount: 10, unansweredCount: 0, correctRate: 66.7, averageTime: 18, difficulty: 33 }
          ],
          scoreDistribution: [
            { range: '0-50', count: 5 },
            { range: '51-70', count: 10 },
            { range: '71-85', count: 15 },
            { range: '86-100', count: 15 }
          ],
          timeDistribution: [
            { range: '0-5 phút', count: 10 },
            { range: '5-10 phút', count: 20 },
            { range: '10-15 phút', count: 10 },
            { range: '15+ phút', count: 5 }
          ],
          attemptsOverTime: [
            { date: '2024-01-01', count: 5, averageScore: 72 },
            { date: '2024-01-02', count: 8, averageScore: 75 },
            { date: '2024-01-03', count: 12, averageScore: 78 },
            { date: '2024-01-04', count: 10, averageScore: 76 },
            { date: '2024-01-05', count: 10, averageScore: 77 }
          ]
        });
      } else {
        toast.error('Lỗi khi tải analytics');
        setAnalytics(null);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!analytics) {
    return (
      <Alert severity="info">Chưa có dữ liệu analytics</Alert>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Quiz Analytics</Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="primary">
                {analytics.totalAttempts}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng số lần làm bài
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="success.main">
                {analytics.averageScore.toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Điểm trung bình
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="info.main">
                {analytics.passingRate.toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tỷ lệ đạt
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="warning.main">
                {Math.floor(analytics.averageTime / 60)}:{(analytics.averageTime % 60).toString().padStart(2, '0')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Thời gian trung bình
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Question Difficulty Analysis */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Phân Tích Độ Khó Câu Hỏi</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Câu hỏi</TableCell>
                <TableCell align="right">Đúng</TableCell>
                <TableCell align="right">Sai</TableCell>
                <TableCell align="right">Tỷ lệ đúng</TableCell>
                <TableCell align="right">Thời gian TB</TableCell>
                <TableCell align="right">Độ khó</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analytics.questionStats.map((stat) => (
                <TableRow key={stat.questionIndex}>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 300 }}>
                      {stat.question}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Chip label={stat.correctCount} color="success" size="small" />
                  </TableCell>
                  <TableCell align="right">
                    <Chip label={stat.incorrectCount} color="error" size="small" />
                  </TableCell>
                  <TableCell align="right">
                    {stat.correctRate.toFixed(1)}%
                  </TableCell>
                  <TableCell align="right">
                    {stat.averageTime}s
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={stat.difficulty < 20 ? 'Dễ' : stat.difficulty < 50 ? 'Trung bình' : 'Khó'}
                      color={stat.difficulty < 20 ? 'success' : stat.difficulty < 50 ? 'warning' : 'error'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Score Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Phân Bố Điểm Số</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Time Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Phân Bố Thời Gian</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.timeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ range, count }) => `${range}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analytics.timeDistribution.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Attempts Over Time */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Xu Hướng Theo Thời Gian</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.attemptsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="count" stroke="#8884d8" name="Số lần làm" />
                <Line yAxisId="right" type="monotone" dataKey="averageScore" stroke="#82ca9d" name="Điểm TB" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QuizAnalytics;
