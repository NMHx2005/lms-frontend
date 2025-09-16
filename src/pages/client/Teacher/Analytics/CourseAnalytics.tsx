import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Box, Container, Typography, Breadcrumbs, Grid, Card, CardContent, CardActions, CardMedia,
    Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';

interface CourseRow {
    _id: string;
    name: string;
    thumbnail: string;
    students: number;
    rating: number;
    revenue: number;
    completionRate: number;
    views: number;
}

const CourseAnalytics: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [rows, setRows] = useState<CourseRow[]>([]);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setRows([
                { _id: 'course1', name: 'React Advanced Patterns', thumbnail: '/images/course1.jpg', students: 234, rating: 4.8, revenue: 8900, completionRate: 82, views: 15420 },
                { _id: 'course2', name: 'Node.js Backend Development', thumbnail: '/images/course2.jpg', students: 189, rating: 4.6, revenue: 7200, completionRate: 75, views: 12890 },
                { _id: 'course3', name: 'UI/UX Design Fundamentals', thumbnail: '/images/course3.jpg', students: 156, rating: 4.9, revenue: 6800, completionRate: 88, views: 11230 },
            ]);
            setLoading(false);
        }, 500);
    }, []);

    if (loading) {
        return (
            <Container maxWidth="xl" sx={{ py: 3 }}>
                <Typography>Đang tải...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <Box sx={{ mb: 3 }}>
                <Breadcrumbs sx={{ mb: 2 }}>
                    <Typography color="text.primary">Teacher Dashboard</Typography>
                    <Typography color="text.secondary">Analytics - Phân tích khóa học</Typography>
                </Breadcrumbs>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>Phân tích khóa học</Typography>
            </Box>

            {/* Top cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                {rows.map((course) => (
                    <Grid item xs={12} md={6} lg={4} key={course._id}>
                        <Card>
                            <CardMedia component="img" height="140" image={course.thumbnail} sx={{ objectFit: 'cover' }} />
                            <CardContent>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>{course.name}</Typography>
                                <Stack spacing={1}>
                                    <Stack direction="row" justifyContent="space-between"><Typography variant="caption" color="text.secondary">Học viên</Typography><Typography variant="body2" sx={{ fontWeight: 600 }}>{course.students}</Typography></Stack>
                                    <Stack direction="row" justifyContent="space-between"><Typography variant="caption" color="text.secondary">Đánh giá</Typography><Typography variant="body2" sx={{ fontWeight: 600 }}>{course.rating}</Typography></Stack>
                                    <Stack direction="row" justifyContent="space-between"><Typography variant="caption" color="text.secondary">Thu nhập</Typography><Typography variant="body2" sx={{ fontWeight: 600 }}>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(course.revenue)}</Typography></Stack>
                                    <Stack direction="row" justifyContent="space-between"><Typography variant="caption" color="text.secondary">Hoàn thành</Typography><Typography variant="body2" sx={{ fontWeight: 600 }}>{course.completionRate}%</Typography></Stack>
                                </Stack>
                            </CardContent>
                            <CardActions sx={{ p: 2, pt: 0 }}>
                                <Button component={Link} to={`/teacher/analytics/course/${course._id}`} variant="outlined" size="small">Xem chi tiết</Button>
                                <Button component={Link} to={`/teacher/courses/${course._id}/edit`} variant="contained" size="small">Chỉnh sửa</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Table */}
            <Card>
                <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Bảng hiệu suất</Typography>
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Khóa học</TableCell>
                                    <TableCell align="right">Học viên</TableCell>
                                    <TableCell align="right">Đánh giá</TableCell>
                                    <TableCell align="right">Thu nhập</TableCell>
                                    <TableCell align="right">Hoàn thành</TableCell>
                                    <TableCell align="right">Lượt xem</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((r) => (
                                    <TableRow key={r._id} hover>
                                        <TableCell>{r.name}</TableCell>
                                        <TableCell align="right">{r.students}</TableCell>
                                        <TableCell align="right">{r.rating}</TableCell>
                                        <TableCell align="right">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(r.revenue)}</TableCell>
                                        <TableCell align="right">{r.completionRate}%</TableCell>
                                        <TableCell align="right">{new Intl.NumberFormat('en-US').format(r.views)}</TableCell>
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

export default CourseAnalytics;
