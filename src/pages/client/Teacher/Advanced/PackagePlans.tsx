import React, { useMemo, useState, useEffect } from 'react';
import { Container, Box, Breadcrumbs, Typography, Card, CardContent, CardActions, Grid, Button, Chip, Stack, TextField, FormControl, InputLabel, Select, MenuItem, Alert, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { teacherPackagesService, Package, Subscription } from '../../../../services/client/teacher-packages.service';

const formatVND = (n: number) => n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

const PackagePlans: React.FC = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all');
    const [packages, setPackages] = useState<Package[]>([]);
    const [activeSubscriptions, setActiveSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [subscribeDialog, setSubscribeDialog] = useState<{ open: boolean; packageId: string | null }>({ open: false, packageId: null });
    const [subscribing, setSubscribing] = useState(false);

    // Load packages and current subscription
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [packagesRes, subscriptionRes] = await Promise.all([
                    teacherPackagesService.getAvailablePackages(status === 'all' ? 'all' : status),
                    teacherPackagesService.getActiveSubscriptionsList()
                ]);

                setPackages(packagesRes.data || []);
                setActiveSubscriptions(subscriptionRes.data || []);
                setError(null);
            } catch (err: any) {
                console.error('Error loading data:', err);
                const errorMessage = err.response?.data?.error;
                if (typeof errorMessage === 'string') {
                    setError(errorMessage);
                } else if (errorMessage?.message) {
                    setError(errorMessage.message);
                } else {
                    setError('Có lỗi xảy ra khi tải dữ liệu');
                }
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [status]);

    const plans = useMemo(() => {
        return packages.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }, [packages, search]);

    const handleSubscribe = async (packageId: string, paymentMethod: string = 'vnpay') => {
        try {
            setSubscribing(true);
            const response = await teacherPackagesService.subscribeToPackage({
                packageId,
                paymentMethod: paymentMethod as any
            });

            if (response.success) {
                if (paymentMethod === 'vnpay' && response.data.paymentUrl) {
                    // Redirect to VNPay
                    window.location.href = response.data.paymentUrl;
                } else if (paymentMethod === 'vnpay' && response.data.mockPayment) {
                    // Mock payment successful
                    setSuccessMessage(response.data.message || 'Đăng ký gói thành công! (Mock Payment)');
                    setSubscribeDialog({ open: false, packageId: null });

                    // Reload data
                    const [packagesRes, subscriptionRes] = await Promise.all([
                        teacherPackagesService.getAvailablePackages(status === 'all' ? 'all' : status),
                        teacherPackagesService.getActiveSubscriptionsList()
                    ]);
                    setPackages(packagesRes.data || []);
                    setActiveSubscriptions(subscriptionRes.data || []);
                } else {
                    setSuccessMessage('Đăng ký gói thành công!');
                    setSubscribeDialog({ open: false, packageId: null });

                    // Reload data
                    const [packagesRes, subscriptionRes] = await Promise.all([
                        teacherPackagesService.getAvailablePackages(status === 'all' ? 'all' : status),
                        teacherPackagesService.getActiveSubscriptionsList()
                    ]);
                    setPackages(packagesRes.data || []);
                    setActiveSubscriptions(subscriptionRes.data || []);
                }
            } else {
                setError(response.error || 'Có lỗi xảy ra khi đăng ký gói');
            }
        } catch (err: any) {
            console.error('Subscribe error:', err);
            const errorMessage = err.response?.data?.error;
            if (typeof errorMessage === 'string') {
                setError(errorMessage);
            } else if (errorMessage?.message) {
                setError(errorMessage.message);
            } else {
                setError('Có lỗi xảy ra khi đăng ký gói');
            }
        } finally {
            setSubscribing(false);
        }
    };

    const handleRenew = async () => {
        try {
            setSubscribing(true);
            await teacherPackagesService.renewSubscription({
                paymentMethod: 'wallet'
            });

            setSuccessMessage('Gia hạn gói thành công!');

            // Reload data
            const [packagesRes, subscriptionRes] = await Promise.all([
                teacherPackagesService.getAvailablePackages(status === 'all' ? 'all' : status),
                teacherPackagesService.getActiveSubscriptionsList()
            ]);
            setPackages(packagesRes.data || []);
            setActiveSubscriptions(subscriptionRes.data || []);
        } catch (err: any) {
            console.error('Renew error:', err);
            const errorMessage = err.response?.data?.error;
            if (typeof errorMessage === 'string') {
                setError(errorMessage);
            } else if (errorMessage?.message) {
                setError(errorMessage.message);
            } else {
                setError('Có lỗi xảy ra khi gia hạn gói');
            }
        } finally {
            setSubscribing(false);
        }
    };

    const handleCancel = async (packageId: string) => {
        console.log('handleCancel called with packageId:', packageId);

        if (!packageId) {
            setError('Không tìm thấy ID gói để hủy đăng ký');
            return;
        }

        if (!confirm('Bạn có chắc chắn muốn hủy đăng ký gói này không?')) return;

        try {
            setSubscribing(true);
            console.log('Calling cancelPackageSubscription with packageId:', packageId);
            const response = await teacherPackagesService.cancelPackageSubscription(packageId);
            console.log('Cancel response:', response);

            if (response.success) {
                setSuccessMessage('Hủy đăng ký gói thành công!');

                // Reload data
                const [packagesRes, subscriptionRes] = await Promise.all([
                    teacherPackagesService.getAvailablePackages(status === 'all' ? 'all' : status),
                    teacherPackagesService.getActiveSubscriptionsList()
                ]);
                setPackages(packagesRes.data || []);
                setActiveSubscriptions(subscriptionRes.data || []);
            } else {
                setError(response.error || 'Có lỗi xảy ra khi hủy đăng ký gói');
            }
        } catch (err: any) {
            console.error('Cancel error:', err);
            const errorMessage = err.response?.data?.error;
            if (typeof errorMessage === 'string') {
                setError(errorMessage);
            } else if (errorMessage?.message) {
                setError(errorMessage.message);
            } else {
                setError('Có lỗi xảy ra khi hủy đăng ký gói');
            }
        } finally {
            setSubscribing(false);
        }
    };

    const isCurrentPackage = (packageId: string) => {
        return activeSubscriptions.some((s) => {
            const ref: any = s.packageId as any;
            const id = typeof ref === 'string' ? ref : (ref?.id || ref?._id);
            return id === packageId;
        });
    };

    const hasActiveSubscription = (packageId: string) => {
        // Check if user has any active subscription for this package
        return isCurrentPackage(packageId);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    if (loading) {
        return (
            <Container maxWidth="xl" sx={{ py: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <CircularProgress />
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
                </Breadcrumbs>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>Gói khóa học</Typography>
                <Typography color="text.secondary">Giảng viên có thể đăng ký và gia hạn gói. Quản trị viên quản lý cấu hình gói.</Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {successMessage && (
                <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage(null)}>
                    {successMessage}
                </Alert>
            )}

            {activeSubscriptions.length > 0 && (
                <Card sx={{ mb: 3, bgcolor: 'primary.50' }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                            Các gói đang hoạt động của bạn
                        </Typography>
                        <Stack spacing={1}>
                            {activeSubscriptions.map((s, idx) => {
                                const ref: any = s.packageId as any;
                                const id = typeof ref === 'string' ? ref : (ref?._id || ref?.id);
                                const name = (s.snapshot?.name) || (typeof ref === 'object' ? ref?.name : 'Gói');
                                const price = (s.snapshot?.price) || (typeof ref === 'object' ? ref?.price : 0);
                                return (
                                    <Stack key={idx} direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="body1">
                                            <strong>{name}</strong> - {formatVND(price)} • Hết hạn: {formatDate(s.endAt as any)}
                                        </Typography>
                                        <Stack direction="row" spacing={1}>
                                            <Button variant="contained" size="small" onClick={handleRenew} disabled={subscribing}>
                                                {subscribing ? 'Đang gia hạn...' : 'Gia hạn'}
                                            </Button>
                                            <Button variant="outlined" color="error" size="small" onClick={() => handleCancel(id)} disabled={subscribing}>
                                                {subscribing ? 'Đang hủy...' : 'Hủy'}
                                            </Button>
                                        </Stack>
                                    </Stack>
                                );
                            })}
                        </Stack>
                    </CardContent>
                </Card>
            )}

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Tìm gói"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Trạng thái</InputLabel>
                                <Select
                                    label="Trạng thái"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as any)}
                                    MenuProps={{ disableScrollLock: true }}
                                >
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
                                    <Chip
                                        size="small"
                                        label={p.isActive ? 'Đang bán' : 'Tạm dừng'}
                                        color={p.isActive ? 'success' : 'default'}
                                    />
                                </Stack>
                                <Typography variant="h4" sx={{ fontWeight: 700 }}>{formatVND(p.price)}</Typography>
                                <Typography color="text.secondary" sx={{ mb: 1 }}>
                                    {p.durationMonths} tháng • Tối đa {p.maxCourses} khóa
                                </Typography>
                                <Stack spacing={0.5} sx={{ mb: 1 }}>
                                    {p.features.map((f: string, i: number) => (
                                        <Typography key={i} variant="body2">• {f}</Typography>
                                    ))}
                                </Stack>
                                {isCurrentPackage(p.id) && (
                                    <Chip
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                        label={`Đang hoạt động`}
                                    />
                                )}
                            </CardContent>
                            <CardActions>
                                <Button
                                    variant="contained"
                                    disabled={!p.isActive || hasActiveSubscription(p.id) || subscribing}
                                    onClick={() => setSubscribeDialog({ open: true, packageId: p.id })}
                                >
                                    {hasActiveSubscription(p.id) ? 'Đã đăng ký' : 'Đăng ký'}
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate(`/teacher/advanced/packages/${p.id}`)}
                                >
                                    Xem chi tiết
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Subscribe Confirmation Dialog */}
            <Dialog
                open={subscribeDialog.open}
                onClose={() => setSubscribeDialog({ open: false, packageId: null })}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Xác nhận đăng ký gói</DialogTitle>
                <DialogContent>
                    <Typography sx={{ mb: 2 }}>
                        Bạn có chắc chắn muốn đăng ký gói này không?
                    </Typography>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Phương thức thanh toán</InputLabel>
                        <Select
                            label="Phương thức thanh toán"
                            value="vnpay"
                            MenuProps={{ disableScrollLock: true }}
                        >
                            <MenuItem value="vnpay">VNPay</MenuItem>
                            <MenuItem value="wallet">Ví điện tử</MenuItem>
                        </Select>
                    </FormControl>
                    <Typography variant="body2" color="text.secondary">
                        Với VNPay: Bạn sẽ được chuyển hướng đến trang thanh toán VNPay để hoàn tất giao dịch.
                        Với ví điện tử: Gói sẽ được kích hoạt ngay lập tức.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setSubscribeDialog({ open: false, packageId: null })}
                        disabled={subscribing}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={() => subscribeDialog.packageId && handleSubscribe(subscribeDialog.packageId, 'vnpay')}
                        variant="contained"
                        disabled={subscribing}
                    >
                        {subscribing ? 'Đang xử lý...' : 'Thanh toán VNPay'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default PackagePlans;