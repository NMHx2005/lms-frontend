import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Grade as GradeIcon,
} from '@mui/icons-material';

export interface AssignmentAnalyticsData {
  totalStudents: number;
  submittedCount: number;
  gradedCount: number;
  averageScore: number;
  medianScore: number;
  submissionRate: number;
  lateSubmissionRate: number;
  gradeDistribution: {
    range: string;
    count: number;
    percentage: number;
  }[];
  topPerformers: {
    studentId: string;
    studentName: string;
    score: number;
  }[];
  commonMistakes?: string[];
}

interface AssignmentAnalyticsProps {
  assignment: {
    _id: string;
    title: string;
    maxScore: number;
  };
  analytics: AssignmentAnalyticsData;
}

const AssignmentAnalytics: React.FC<AssignmentAnalyticsProps> = ({
  assignment,
  analytics,
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Overview Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: 'primary.light',
                    color: 'primary.main',
                  }}
                >
                  <PeopleIcon />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {analytics.submittedCount}/{analytics.totalStudents}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Đã nộp bài
                  </Typography>
                </Box>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={analytics.submissionRate}
                sx={{ mt: 2 }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                {analytics.submissionRate.toFixed(1)}% tỷ lệ nộp bài
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: 'success.light',
                    color: 'success.main',
                  }}
                >
                  <GradeIcon />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {analytics.gradedCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Đã chấm
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: 'info.light',
                    color: 'info.main',
                  }}
                >
                  <TrendingUpIcon />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {analytics.averageScore.toFixed(1)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Điểm trung bình
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: 'warning.light',
                    color: 'warning.main',
                  }}
                >
                  <AssignmentIcon />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {analytics.lateSubmissionRate.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tỷ lệ nộp muộn
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Grade Distribution */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Phân bố điểm số
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Khoảng điểm</TableCell>
                <TableCell align="right">Số lượng</TableCell>
                <TableCell align="right">Tỷ lệ</TableCell>
                <TableCell>Biểu đồ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analytics.gradeDistribution.map((dist, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Chip label={dist.range} size="small" />
                  </TableCell>
                  <TableCell align="right">{dist.count}</TableCell>
                  <TableCell align="right">{dist.percentage.toFixed(1)}%</TableCell>
                  <TableCell>
                    <LinearProgress
                      variant="determinate"
                      value={dist.percentage}
                      sx={{ height: 8, borderRadius: 1 }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Top Performers */}
      {analytics.topPerformers.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Học sinh xuất sắc
          </Typography>
          <Stack spacing={1}>
            {analytics.topPerformers.map((performer, index) => (
              <Box
                key={performer.studentId}
                sx={{
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Chip
                    label={`#${index + 1}`}
                    color={index === 0 ? 'primary' : 'default'}
                    size="small"
                  />
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {performer.studentName}
                  </Typography>
                </Stack>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  {performer.score}/{assignment.maxScore}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Paper>
      )}

      {/* Common Mistakes */}
      {analytics.commonMistakes && analytics.commonMistakes.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Lỗi thường gặp
          </Typography>
          <Stack spacing={1}>
            {analytics.commonMistakes.map((mistake, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  bgcolor: 'error.light',
                  borderRadius: 1,
                }}
              >
                <Typography variant="body2">{mistake}</Typography>
              </Box>
            ))}
          </Stack>
        </Paper>
      )}
    </Box>
  );
};

export default AssignmentAnalytics;
