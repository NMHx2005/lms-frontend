import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Breadcrumbs,
    Card,
    CardContent,
    CardActions,
    CardMedia,
    Grid,
    Stack,
    Button,
    Chip,
    Divider
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    People as PeopleIcon,
    Star as StarIcon,
    Visibility as VisibilityIcon,
    AttachMoney as AttachMoneyIcon
} from '@mui/icons-material';

interface RevenuePoint { month: string; revenue: number; students: number }

interface CourseSummary {
    _id: string;
    name: string;
    thumbnail: string;
    students: number;
    rating: number;
    revenue: number;
    completionRate: number;
    views: number;
}

const CourseAnalyticsDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState<CourseSummary | null>(null);
    const [series, setSeries] = useState<RevenuePoint[]>([]);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            const mockCourse: CourseSummary = {
                _id: id || 'course1',
                name: 'React Advanced Patterns',
                thumbnail: '/images/course1.jpg',
                students: 234,
                rating: 4.8,
                revenue: 8900,
                completionRate: 82,
                views: 15420
            };
            const mockSeries: RevenuePoint[] = [
                { month: 'Jan', revenue: 1200, students: 35 },
                { month: 'Feb', revenue: 1500, students: 38 },
                { month: 'Mar', revenue: 1300, students: 33 },
                { month: 'Apr', revenue: 1700, students: 41 },
                { month: 'May', revenue: 1600, students: 39 },
                { month: 'Jun', revenue: 2200, students: 48 }
            ];
            setCourse(mockCourse);
            setSeries(mockSeries);
            setLoading(false);
        }, 500);
    }, [id]);

    if (loading || !course) {
        return (
            <Container maxWidth="xl" sx={{ py: 3 }}>
                <Typography>Đang tải...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Breadcrumbs sx={{ mb: 2 }}>
                    <Typography color="text.primary">Teacher Dashboard</Typography>
                    <Typography color="text.primary">Analytics</Typography>
                    <Typography color="text.secondary">{course.name}</Typography>
                </Breadcrumbs>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Button component={Link} to="/teacher/analytics" startIcon={<ArrowBackIcon />} variant="outlined" sx={{ minWidth: 'auto' }}>
                        Quay lại
                    </Button>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>{course.name}</Typography>
                </Stack>
            </Box>

            {/* Summary */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardMedia component="img" height="200" image={course.thumbnail} alt={course.name} sx={{ objectFit: 'cover' }} />
                        <CardContent>
                            <Stack direction="row" spacing={2}>
                                <Chip icon={<PeopleIcon />} label={`${course.students} học viên`} />
                                <Chip icon={<StarIcon />} label={`${course.rating} sao`} color="warning" />
                                <Chip icon={<VisibilityIcon />} label={`${new Intl.NumberFormat('en-US').format(course.views)} views`} color="info" />
                            </Stack>
                        </CardContent>
                        <CardActions>
                            <Chip icon={<AttachMoneyIcon />} label={`Thu nhập ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(course.revenue)}`} color="success" />
                            <Chip label={`Hoàn thành ${course.completionRate}%`} />
                        </CardActions>
                    </Card>
                </Grid>

                {/* Income & Students chart */}
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Thu nhập & Học viên theo thời gian</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 220 }}>
                                {series.map((d) => (
                                    <Box key={d.month} sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.75, width: 32 }}>
                                        <Box sx={{ width: 12, height: `${(d.revenue / 2400) * 100}%`, bgcolor: 'primary.main', borderRadius: 0.5 }} />
                                        <Box sx={{ width: 12, height: `${(d.students / 60) * 100}%`, bgcolor: 'success.main', borderRadius: 0.5 }} />
                                    </Box>
                                ))}
                            </Box>
                            <Divider sx={{ my: 1 }} />
                            <Stack direction="row" spacing={2}>
                                <Chip label="Thu nhập ($)" color="primary" size="small" />
                                <Chip label="Học viên" color="success" size="small" />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Growth chart */}
            <Card>
                <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Tăng trưởng học viên</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 220 }}>
                        {series.map((d) => (
                            <Box key={d.month} sx={{ width: 36 }}>
                                <Box sx={{ height: `${(d.students / 60) * 100}%`, bgcolor: 'info.main', borderRadius: 0.5 }} />
                            </Box>
                        ))}
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Chip label="Học viên hoạt động" color="info" size="small" />
                </CardContent>
            </Card>
        </Container>
    );
};

export default CourseAnalyticsDetail;
