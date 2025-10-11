import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
    Box, Container, Typography, Breadcrumbs, Grid, Card, CardContent, CircularProgress, Stack,
    Select, MenuItem, FormControl, InputLabel, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper
} from '@mui/material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';
import * as earningsAnalyticsService from '@/services/client/earnings-analytics.service';
import type {
    AnalyticsOverview,
    TrendData,
    EarningsByCourse,
    PeriodEarnings,
    Forecast,
    Comparison
} from '@/services/client/earnings-analytics.service';

interface AnalyticsData {
    overview: AnalyticsOverview | null;
    trends: TrendData[];
    byCourse: EarningsByCourse | null;
    byPeriod: PeriodEarnings[];
    forecast: Forecast | null;
    comparison: Comparison | null;
}

const EarningsAnalytics: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
        overview: null,
        trends: [],
        byCourse: null,
        byPeriod: [],
        forecast: null,
        comparison: null
    });
    const [selectedPeriod, setSelectedPeriod] = useState('30days');
    const [selectedGroupBy, setSelectedGroupBy] = useState('month');

    useEffect(() => {
        fetchAnalyticsData();
    }, [selectedPeriod, selectedGroupBy]);

    const fetchAnalyticsData = async () => {
        try {
            setLoading(true);

            const [
                overviewRes,
                trendsRes,
                byCourseRes,
                byPeriodRes,
                forecastRes,
                comparisonRes
            ] = await Promise.all([
                earningsAnalyticsService.getAnalyticsOverview(),
                earningsAnalyticsService.getTrends(selectedPeriod),
                earningsAnalyticsService.getEarningsByCourse(),
                earningsAnalyticsService.getEarningsByPeriod(selectedGroupBy),
                earningsAnalyticsService.getForecast(3),
                earningsAnalyticsService.getComparison('previous_period')
            ]);

            if (overviewRes.success) {
                setAnalyticsData({
                    overview: overviewRes.data,
                    trends: trendsRes.success ? trendsRes.data : [],
                    byCourse: byCourseRes.success ? byCourseRes.data : null,
                    byPeriod: byPeriodRes.success ? byPeriodRes.data : [],
                    forecast: forecastRes.success ? forecastRes.data : null,
                    comparison: comparisonRes.success ? comparisonRes.data : null
                });
            }
        } catch (error: any) {
            console.error('Error loading analytics:', error);
            toast.error(error.response?.data?.message || 'Error loading analytics data');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    if (loading) {
        return (
            <Container maxWidth="xl" sx={{ py: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
                    <CircularProgress size={60} sx={{ mb: 3 }} />
                    <Typography variant="h6" color="text.secondary">Loading analytics data...</Typography>
                </Box>
            </Container>
        );
    }

    if (!analyticsData.overview) {
        return (
            <Container maxWidth="xl" sx={{ py: 6 }}>
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary">No analytics data available</Typography>
                </Box>
            </Container>
        );
    }

    const { overview } = analyticsData;

    return (
        <Container maxWidth="xl" sx={{ py: 6 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Breadcrumbs sx={{ mb: 2 }}>
                    <Typography color="text.secondary">Earnings</Typography>
                    <Typography color="text.secondary">Analytics</Typography>
                </Breadcrumbs>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Earnings Analytics</Typography>
            </Box>

            {/* Filters */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
                <FormControl sx={{ minWidth: 180 }} size="small">
                    <InputLabel>Time Period</InputLabel>
                    <Select value={selectedPeriod} label="Time Period" onChange={(e) => setSelectedPeriod(e.target.value)} MenuProps={{ disableScrollLock: true }}>
                        <MenuItem value="7days">Last 7 days</MenuItem>
                        <MenuItem value="30days">Last 30 days</MenuItem>
                        <MenuItem value="90days">Last 90 days</MenuItem>
                        <MenuItem value="1year">Last year</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 180 }} size="small">
                    <InputLabel>Group By</InputLabel>
                    <Select value={selectedGroupBy} label="Group By" onChange={(e) => setSelectedGroupBy(e.target.value)} MenuProps={{ disableScrollLock: true }}>
                        <MenuItem value="day">Day</MenuItem>
                        <MenuItem value="week">Week</MenuItem>
                        <MenuItem value="month">Month</MenuItem>
                        <MenuItem value="quarter">Quarter</MenuItem>
                        <MenuItem value="year">Year</MenuItem>
                    </Select>
                </FormControl>
            </Stack>

            {/* Overview Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Typography variant="subtitle2" color="text.secondary">Total Revenue</Typography>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>{formatCurrency(overview.totalRevenue)}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Typography variant="subtitle2" color="text.secondary">Total Students</Typography>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>{overview.totalStudents}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Typography variant="subtitle2" color="text.secondary">Average Rating</Typography>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>{overview.averageRating.toFixed(1)}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Typography variant="subtitle2" color="text.secondary">Growth Rate</Typography>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: overview.growthRate >= 0 ? 'success.main' : 'error.main' }}>
                                {overview.growthRate >= 0 ? '+' : ''}{overview.growthRate.toFixed(1)}%
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Charts Row 1 */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} lg={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Revenue Trends</Typography>
                            {analyticsData.trends.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={analyticsData.trends}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                                        <YAxis tickFormatter={(value) => `${value / 1000}K`} />
                                        <Tooltip
                                            formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                                            labelFormatter={(label) => new Date(label).toLocaleDateString('en-US')}
                                        />
                                        <Line type="monotone" dataKey="revenue" stroke="#5b8def" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
                                    <Typography>No trend data available</Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} lg={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Top Performing Course</Typography>
                            {overview.topPerformingCourse ? (
                                <Box>
                                    <Typography variant="h6" sx={{ mb: 1 }}>{overview.topPerformingCourse.title}</Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>{formatCurrency(overview.topPerformingCourse.revenue)}</Typography>
                                    <Typography color="text.secondary" sx={{ mb: 1 }}>
                                        {overview.topPerformingCourse.students} students
                                    </Typography>
                                    <Typography color="text.secondary">
                                        Rating: {overview.topPerformingCourse.rating.toFixed(1)}/5
                                    </Typography>
                                </Box>
                            ) : (
                                <Typography color="text.secondary">No course data available</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Charts Row 2 */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} lg={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Earnings by Period</Typography>
                            {analyticsData.byPeriod.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={analyticsData.byPeriod}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="period" />
                                        <YAxis tickFormatter={(value) => `${value / 1000}K`} />
                                        <Tooltip
                                            formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                                            labelFormatter={(label) => `Period: ${label}`}
                                        />
                                        <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
                                    <Typography>No period data available</Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} lg={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Revenue Forecast</Typography>
                            {analyticsData.forecast && analyticsData.forecast.forecast.length > 0 ? (
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                        {formatCurrency(analyticsData.forecast.averageMonthlyRevenue)}
                                    </Typography>
                                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                                        Average monthly revenue
                                    </Typography>
                                    {analyticsData.forecast.forecast.slice(0, 3).map((forecast, index) => (
                                        <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2">{forecast.month}</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {formatCurrency(forecast.predictedRevenue)}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            ) : (
                                <Typography color="text.secondary">No forecast data available</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Course Performance Table */}
            {analyticsData.byCourse && (
                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Course Performance</Typography>
                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Course</TableCell>
                                        <TableCell align="right">Revenue</TableCell>
                                        <TableCell align="right">Students</TableCell>
                                        <TableCell align="right">Price</TableCell>
                                        <TableCell align="right">Rating</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {analyticsData.byCourse.courses.slice(0, 10).map((course) => (
                                        <TableRow key={course.id} hover>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    {course.thumbnail && (
                                                        <Box
                                                            component="img"
                                                            src={course.thumbnail}
                                                            alt={course.title}
                                                            sx={{
                                                                width: 40,
                                                                height: 40,
                                                                borderRadius: 1,
                                                                mr: 2,
                                                                objectFit: 'cover'
                                                            }}
                                                        />
                                                    )}
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        {course.title}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="right">{formatCurrency(course.revenue)}</TableCell>
                                            <TableCell align="right">{course.students}</TableCell>
                                            <TableCell align="right">{formatCurrency(course.price)}</TableCell>
                                            <TableCell align="right">{course.rating.toFixed(1)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            )}

            {/* Comparison */}
            {analyticsData.comparison && (
                <Card>
                    <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Period Comparison</Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Current Period</Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                                        {formatCurrency(analyticsData.comparison.current.revenue)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {analyticsData.comparison.current.students} students
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Previous Period</Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                                        {formatCurrency(analyticsData.comparison.comparison.revenue)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {analyticsData.comparison.comparison.students} students
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Growth</Typography>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontWeight: 700,
                                            mb: 1,
                                            color: analyticsData.comparison.growth.revenue >= 0 ? 'success.main' : 'error.main'
                                        }}
                                    >
                                        {analyticsData.comparison.growth.revenue >= 0 ? '+' : ''}{analyticsData.comparison.growth.revenue.toFixed(1)}%
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Revenue growth
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            )}
        </Container>
    );
};

export default EarningsAnalytics;