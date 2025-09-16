import React, { useMemo, useState } from 'react';
import { Container, Box, Breadcrumbs, Typography, Card, CardContent, CardActions, Grid, Button, Chip, Stack, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface Plan { id: string; name: string; price: number; durationMonths: number; coursesAllowed: number; features: string[]; status: 'active' | 'inactive'; }

const mockPlans: Plan[] = [
    { id: 'basic', name: 'Gói Cơ Bản', price: 199000, durationMonths: 1, coursesAllowed: 1, features: ['Đăng 1 khóa học', 'Hỗ trợ cơ bản'], status: 'active' },
    { id: 'pro', name: 'Gói Pro', price: 499000, durationMonths: 3, coursesAllowed: 5, features: ['Đăng 5 khóa học', 'Hỗ trợ ưu tiên', 'Badge giảng viên'], status: 'active' },
    { id: 'enterprise', name: 'Gói Doanh Nghiệp', price: 1499000, durationMonths: 12, coursesAllowed: 50, features: ['Đăng 50 khóa học', 'Hỗ trợ doanh nghiệp', 'Tư vấn marketing'], status: 'inactive' }
];

const formatVND = (n: number) => n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

const PackagePlans: React.FC = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all');
    // Trạng thái gói hiện tại của giáo viên (mock)
    const [currentPlanId] = useState<string>('pro');
    const [currentPlanExpiresAt] = useState<string>('2025-12-31');

    const plans = useMemo(() => {
        return mockPlans.filter(p => (status === 'all' || p.status === status) && p.name.toLowerCase().includes(search.toLowerCase()));
    }, [search, status]);

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <Box sx={{ mb: 3 }}>
                <Breadcrumbs sx={{ mb: 1 }}>
                    <Typography color="text.primary">Teacher Dashboard</Typography>
                    <Typography color="text.secondary">Quản lý nâng cao</Typography>
                    <Typography color="text.secondary">Gói khóa học</Typography>
                </Breadcrumbs>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>Gói khóa học</Typography>
                <Typography color="text.secondary">Giảng viên chỉ có thể đăng ký/gia hạn gói. Quản trị viên quản lý cấu hình gói.</Typography>
            </Box>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}><TextField fullWidth label="Tìm gói" value={search} onChange={(e) => setSearch(e.target.value)} /></Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Trạng thái</InputLabel>
                                <Select label="Trạng thái" value={status} onChange={(e) => setStatus(e.target.value as any)} MenuProps={{ disableScrollLock: true }}>
                                    <MenuItem value="all">Tất cả</MenuItem>
                                    <MenuItem value="active">Đang bán</MenuItem>
                                    <MenuItem value="inactive">Tạm dừng</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Grid container spacing={2}>
                {plans.map(p => (
                    <Grid key={p.id} item xs={12} md={6} lg={4}>
                        <Card>
                            <CardContent>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{p.name}</Typography>
                                    <Chip size="small" label={p.status === 'active' ? 'Đang bán' : 'Tạm dừng'} color={p.status === 'active' ? 'success' : 'default'} />
                                </Stack>
                                <Typography variant="h4" sx={{ fontWeight: 700 }}>{formatVND(p.price)}</Typography>
                                <Typography color="text.secondary" sx={{ mb: 1 }}>{p.durationMonths} tháng • Tối đa {p.coursesAllowed} khóa</Typography>
                                <Stack spacing={0.5} sx={{ mb: 1 }}>
                                    {p.features.map((f, i) => (<Typography key={i} variant="body2">• {f}</Typography>))}
                                </Stack>
                                {p.id === currentPlanId && (
                                    <Chip size="small" color="primary" variant="outlined" label={`Gói hiện tại • Hết hạn: ${currentPlanExpiresAt}`} />
                                )}
                            </CardContent>
                            <CardActions>
                                <Button variant="contained" disabled={p.status === 'inactive'}>
                                    {p.id === currentPlanId ? 'Gia hạn' : 'Đăng ký'}
                                </Button>
                                <Button variant="outlined" onClick={() => navigate(`/teacher/advanced/packages/${p.id}`)}>Xem chi tiết</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default PackagePlans;
