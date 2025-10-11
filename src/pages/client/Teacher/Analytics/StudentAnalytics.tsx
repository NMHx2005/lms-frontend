import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
    Box, Container, Typography, Breadcrumbs, Grid, Card, CardContent, Stack, Chip, LinearProgress,
    Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, CircularProgress
} from '@mui/material';
import * as studentAnalyticsService from '@/services/client/student-analytics.service';

interface StudentRow {
    studentId: string;
    studentName: string;
    courseId: string;
    courseName: string;
    progress: number;
    lastActivity: Date;
    isCompleted: boolean;
    totalTimeSpent: number;
}

interface OverviewData {
    totalStudents: number;
    activeStudents: number;
    completedCourses: number;
    averageProgress: number;
    retentionRate: number;
}

interface ProgressData {
    courseName: string;
    averageProgress: number;
    studentsStarted: number;
    studentsCompleted: number;
    completionRate: number;
}

const StudentAnalytics: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [overview, setOverview] = useState<OverviewData | null>(null);
    const [progressData, setProgressData] = useState<ProgressData[]>([]);
    const [recentActivity, setRecentActivity] = useState<StudentRow[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch all data in parallel
                const [overviewRes, progressRes, activityRes] = await Promise.all([
                    studentAnalyticsService.getStudentOverview(),
                    studentAnalyticsService.getStudentProgress(),
                    studentAnalyticsService.getStudentActivity('30days')
                ]);

                if (overviewRes.success) {
                    setOverview(overviewRes.data);
                }

                if (progressRes.success) {
                    setProgressData(progressRes.data);
                }

                if (activityRes.success) {
                    setRecentActivity(activityRes.data.recentActivity.slice(0, 10));
                }
            } catch (error: any) {
                console.error('Error loading student analytics:', error);
                toast.error(error.response?.data?.message || 'Lỗi khi tải dữ liệu analytics');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <Container maxWidth="xl" sx={{ py: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
                    <CircularProgress size={60} sx={{ mb: 3 }} />
                    <Typography variant="h6" color="text.secondary">Đang tải dữ liệu analytics...</Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <Box sx={{ mb: 3 }}>
                <Breadcrumbs sx={{ mb: 2 }}>
                    <Typography color="text.primary">Teacher Dashboard</Typography>
                    <Typography color="text.secondary">Analytics - Phân tích học viên</Typography>
                </Breadcrumbs>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>Phân tích học viên</Typography>
            </Box>

            {/* Summary cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                    <Card><CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="subtitle2" color="text.secondary">Tổng học viên</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>{overview?.totalStudents || 0}</Typography>
                        <Chip label={`${overview?.activeStudents || 0} hoạt động`} color="success" size="small" sx={{ mt: 1 }} />
                    </CardContent></Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card><CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="subtitle2" color="text.secondary">Tiến độ trung bình</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>{overview?.averageProgress?.toFixed(1) || 0}%</Typography>
                        <Chip label={`${overview?.completedCourses || 0} hoàn thành`} color="info" size="small" sx={{ mt: 1 }} />
                    </CardContent></Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card><CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="subtitle2" color="text.secondary">Tỷ lệ retention</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>{overview?.retentionRate?.toFixed(1) || 0}%</Typography>
                        <Chip label="30 ngày qua" color="primary" size="small" sx={{ mt: 1 }} />
                    </CardContent></Card>
                </Grid>
            </Grid>

            {/* Progress by Course */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Tiến độ học viên theo khóa học</Typography>
                            <Stack spacing={2}>
                                {progressData.slice(0, 5).map((course, index) => (
                                    <Box key={index}>
                                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                                            <Typography variant="body2">{course.courseName}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {course.studentsStarted} học viên • {course.completionRate}% hoàn thành
                                            </Typography>
                                        </Stack>
                                        <LinearProgress
                                            variant="determinate"
                                            value={course.averageProgress}
                                            color={course.averageProgress >= 75 ? 'success' : course.averageProgress >= 50 ? 'primary' : 'warning'}
                                            sx={{ height: 8, borderRadius: 4 }}
                                        />
                                        <Typography variant="caption" color="text.secondary">
                                            Tiến độ trung bình: {course.averageProgress}%
                                        </Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Recent Activity Table */}
            <Card>
                <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Hoạt động gần đây của học viên</Typography>
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Học viên</TableCell>
                                    <TableCell>Khóa học</TableCell>
                                    <TableCell align="right">Tiến độ</TableCell>
                                    <TableCell align="right">Thời gian học</TableCell>
                                    <TableCell>Hoạt động cuối</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {recentActivity.map((activity, index) => (
                                    <TableRow key={index} hover>
                                        <TableCell>{activity.studentName}</TableCell>
                                        <TableCell>{activity.courseName}</TableCell>
                                        <TableCell align="right">{activity.progress}%</TableCell>
                                        <TableCell align="right">{Math.round(activity.totalTimeSpent / 60)}h</TableCell>
                                        <TableCell>{new Date(activity.lastActivity).toLocaleDateString('vi-VN')}</TableCell>
                                        <TableCell>
                                            {activity.isCompleted ? (
                                                <Chip label="Hoàn thành" color="success" size="small" />
                                            ) : (
                                                <Chip label="Đang học" color="primary" size="small" />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </Container>
    );
};

export default StudentAnalytics;
