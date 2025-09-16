import React, { useEffect, useState } from 'react';
import {
    Box, Container, Typography, Breadcrumbs, Grid, Card, CardContent, Stack, Chip, LinearProgress,
    Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper
} from '@mui/material';

interface StudentRow { id: string; name: string; email: string; progress: number; avgScore: number; lastActive: string }

const StudentAnalytics: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [rows, setRows] = useState<StudentRow[]>([]);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setRows([
                { id: '1', name: 'Nguyễn Văn A', email: 'a@email.com', progress: 85, avgScore: 92, lastActive: '2024-06-20' },
                { id: '2', name: 'Trần Thị B', email: 'b@email.com', progress: 65, avgScore: 78, lastActive: '2024-06-19' },
                { id: '3', name: 'Lê Văn C', email: 'c@email.com', progress: 100, avgScore: 95, lastActive: '2024-06-15' },
                { id: '4', name: 'Phạm Thị D', email: 'd@email.com', progress: 45, avgScore: 65, lastActive: '2024-06-10' },
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
                    <Typography color="text.secondary">Analytics - Phân tích học viên</Typography>
                </Breadcrumbs>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>Phân tích học viên</Typography>
            </Box>

            {/* Summary cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                    <Card><CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="subtitle2" color="text.secondary">Học viên hoạt động</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>312</Typography>
                        <Chip label="+4.5%" color="success" size="small" sx={{ mt: 1 }} />
                    </CardContent></Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card><CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="subtitle2" color="text.secondary">Điểm trung bình</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>82/100</Typography>
                        <Chip label="+1.2" color="success" size="small" sx={{ mt: 1 }} />
                    </CardContent></Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card><CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="subtitle2" color="text.secondary">Hoàn thành chứng chỉ</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>72.1%</Typography>
                        <Chip label="+0.9%" color="success" size="small" sx={{ mt: 1 }} />
                    </CardContent></Card>
                </Grid>
            </Grid>

            {/* Charts placeholders */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Phân bố tiến độ học</Typography>
                            <Stack spacing={1}>
                                {[100, 80, 60, 40, 20].map((p) => (
                                    <Box key={p}>
                                        <Stack direction="row" justifyContent="space-between"><Typography variant="body2">≥ {p}%</Typography><Typography variant="body2" color="text.secondary">{Math.round(Math.random() * 100)}</Typography></Stack>
                                        <LinearProgress variant="determinate" value={p} sx={{ height: 8, borderRadius: 4 }} />
                                    </Box>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Điểm số theo nhóm</Typography>
                            <Stack spacing={1}>
                                {['<60', '60-69', '70-79', '80-89', '90-100'].map((g, i) => (
                                    <Box key={g}>
                                        <Stack direction="row" justifyContent="space-between"><Typography variant="body2">{g}</Typography><Typography variant="body2" color="text.secondary">{80 - i * 7}</Typography></Stack>
                                        <LinearProgress variant="determinate" value={80 - i * 7} color={i > 2 ? 'success' : 'info'} sx={{ height: 8, borderRadius: 4 }} />
                                    </Box>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Table */}
            <Card>
                <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Danh sách học viên tiêu biểu</Typography>
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Học viên</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell align="right">Tiến độ</TableCell>
                                    <TableCell align="right">Điểm TB</TableCell>
                                    <TableCell>Hoạt động cuối</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((r) => (
                                    <TableRow key={r.id} hover>
                                        <TableCell>{r.name}</TableCell>
                                        <TableCell>{r.email}</TableCell>
                                        <TableCell align="right">{r.progress}%</TableCell>
                                        <TableCell align="right">{r.avgScore}</TableCell>
                                        <TableCell>{r.lastActive}</TableCell>
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
