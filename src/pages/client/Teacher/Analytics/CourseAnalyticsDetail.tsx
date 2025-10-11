import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
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
    Divider,
    CircularProgress
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    People as PeopleIcon,
    Star as StarIcon,
    Visibility as VisibilityIcon,
    AttachMoney as AttachMoneyIcon
} from '@mui/icons-material';
import * as courseAnalyticsService from '@/services/client/course-analytics.service';

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
        const fetchData = async () => {
            if (!id) return;

            try {
                setLoading(true);

                // Get course details
                const courseResponse = await courseAnalyticsService.getCourseAnalyticsDetail(id);
                if (courseResponse.success) {
                    setCourse(courseResponse.data);
                }

                // Get enrollment trends
                const trendsResponse = await courseAnalyticsService.getCourseEnrollmentTrends(id);
                if (trendsResponse.success) {
                    setSeries(trendsResponse.data);
                }
            } catch (error: any) {
                console.error('Error loading course analytics detail:', error);
                toast.error(error.response?.data?.message || 'Lỗi khi tải dữ liệu analytics');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading || !course) {
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
                            <Chip icon={<AttachMoneyIcon />} label={`Thu nhập ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.revenue)}`} color="success" />
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
