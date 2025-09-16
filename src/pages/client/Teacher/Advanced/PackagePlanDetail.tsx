import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Breadcrumbs, Typography, Card, CardContent, Grid, Chip, Stack, Button, Divider } from '@mui/material';

const mockPlanById = (id: string) => {
    const plans = {
        basic: { id: 'basic', name: 'Gói Cơ Bản', price: 199000, durationMonths: 1, coursesAllowed: 1, features: ['Đăng 1 khóa học', 'Hỗ trợ cơ bản'], status: 'active' },
        pro: { id: 'pro', name: 'Gói Pro', price: 499000, durationMonths: 3, coursesAllowed: 5, features: ['Đăng 5 khóa học', 'Hỗ trợ ưu tiên', 'Badge giảng viên'], status: 'active' },
        enterprise: { id: 'enterprise', name: 'Gói Doanh Nghiệp', price: 1499000, durationMonths: 12, coursesAllowed: 50, features: ['Đăng 50 khóa học', 'Hỗ trợ doanh nghiệp', 'Tư vấn marketing'], status: 'inactive' }
    } as const;
    return (plans as any)[id];
};

const formatVND = (n: number) => n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

const PackagePlanDetail: React.FC = () => {
    const { id = '' } = useParams();
    const navigate = useNavigate();
    const plan = useMemo(() => mockPlanById(id), [id]);
    const currentPlanId = 'pro';
    const currentPlanExpiresAt = '2025-12-31';

    if (!plan) {
        return (
            <Container maxWidth="xl" sx={{ py: 3 }}>
                <Typography>Không tìm thấy gói.</Typography>
                <Button sx={{ mt: 2 }} onClick={() => navigate('/teacher/advanced/packages')}>Quay lại</Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <Box sx={{ mb: 3 }}>
                <Breadcrumbs sx={{ mb: 1 }}>
                    <Typography color="text.primary">Teacher Dashboard</Typography>
                    <Typography color="text.secondary">Quản lý nâng cao</Typography>
                    <Typography color="text.secondary">Gói khóa học</Typography>
                    <Typography color="text.secondary">{plan.name}</Typography>
                </Breadcrumbs>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>{plan.name}</Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>{formatVND(plan.price)}</Typography>
                            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                                <Chip label={`${plan.durationMonths} tháng`} />
                                <Chip label={`Tối đa ${plan.coursesAllowed} khóa`} />
                                <Chip label={plan.status === 'active' ? 'Đang bán' : 'Tạm dừng'} color={plan.status === 'active' ? 'success' : 'default'} />
                            </Stack>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Tính năng</Typography>
                            <Stack spacing={0.75}>{plan.features.map((f: string, i: number) => (<Typography key={i} variant="body2">• {f}</Typography>))}</Stack>
                            <Divider sx={{ my: 2 }} />
                            {plan.id === currentPlanId && (
                                <Chip size="small" color="primary" variant="outlined" label={`Gói hiện tại • Hết hạn: ${currentPlanExpiresAt}`} />
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>Hành động</Typography>
                            <Stack spacing={1}>
                                <Button variant="contained" disabled={plan.status === 'inactive'}>{plan.id === currentPlanId ? 'Gia hạn gói' : 'Đăng ký gói'}</Button>
                                <Button variant="outlined" onClick={() => navigate('/teacher/advanced/packages')}>Quay lại danh sách</Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default PackagePlanDetail;
