import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Breadcrumbs, Typography, Card, CardContent, Grid, Chip, Stack, Button, Divider, Alert, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { teacherPackagesService } from '../../../../services/client/teacher-packages.service';
import type { Package, Subscription } from '../../../../services/client/teacher-packages.service';

const formatVND = (n: number) => n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

const PackagePlanDetail: React.FC = () => {
    const { id = '' } = useParams();
    const navigate = useNavigate();
    const [packageDetails, setPackageDetails] = useState<Package | null>(null);
    const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [subscribeDialog, setSubscribeDialog] = useState(false);
    const [subscribing, setSubscribing] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [packageRes, subscriptionRes] = await Promise.all([
                    teacherPackagesService.getPackageDetails(id),
                    teacherPackagesService.getCurrentSubscription()
                ]);

                setPackageDetails(packageRes.data);
                setCurrentSubscription(subscriptionRes.data || null);
                setError(null);
            } catch (err: any) {
                console.error('Error loading data:', err);
                setError(err.response?.data?.error || 'Có lỗi xảy ra khi tải dữ liệu');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadData();
        }
    }, [id]);

    const handleSubscribe = async () => {
        if (!packageDetails) return;

        try {
            setSubscribing(true);
            await teacherPackagesService.subscribeToPackage({
                packageId: packageDetails.id,
                paymentMethod: 'wallet'
            });

            setSuccessMessage('Đăng ký gói thành công!');
            setSubscribeDialog(false);

            // Reload data
            const subscriptionRes = await teacherPackagesService.getCurrentSubscription();
            setCurrentSubscription(subscriptionRes.data || null);
        } catch (err: any) {
            console.error('Subscribe error:', err);
            setError(err.response?.data?.error || 'Có lỗi xảy ra khi đăng ký gói');
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
            const subscriptionRes = await teacherPackagesService.getCurrentSubscription();
            setCurrentSubscription(subscriptionRes.data || null);
        } catch (err: any) {
            console.error('Renew error:', err);
            setError(err.response?.data?.error || 'Có lỗi xảy ra khi gia hạn gói');
        } finally {
            setSubscribing(false);
        }
    };

    const isCurrentPackage = () => {
        return currentSubscription &&
            typeof currentSubscription.packageId === 'object' &&
            currentSubscription.packageId.id === packageDetails?.id;
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

    if (!packageDetails) {
        return (
            <Container maxWidth="xl" sx={{ py: 3 }}>
                <Typography>Không tìm thấy gói.</Typography>
                <Button sx={{ mt: 2 }} onClick={() => navigate('/teacher/advanced/packages')}>
                    Quay lại
                </Button>
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
                    <Typography color="text.secondary">{packageDetails.name}</Typography>
                </Breadcrumbs>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>{packageDetails.name}</Typography>
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

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                                {formatVND(packageDetails.price)}
                            </Typography>
                            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                                <Chip label={`${packageDetails.durationMonths} tháng`} />
                                <Chip label={`Tối đa ${packageDetails.maxCourses} khóa`} />
                                <Chip
                                    label={packageDetails.isActive ? 'Đang bán' : 'Tạm dừng'}
                                    color={packageDetails.isActive ? 'success' : 'default'}
                                />
                            </Stack>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                Mô tả
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {packageDetails.description}
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                Tính năng
                            </Typography>
                            <Stack spacing={0.75}>
                                {packageDetails.features.map((f: string, i: number) => (
                                    <Typography key={i} variant="body2">• {f}</Typography>
                                ))}
                            </Stack>
                            <Divider sx={{ my: 2 }} />
                            {isCurrentPackage() && (
                                <Chip
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    label={`Gói hiện tại • Hết hạn: ${formatDate(currentSubscription!.endAt)}`}
                                />
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
                                Hành động
                            </Typography>
                            <Stack spacing={1}>
                                {isCurrentPackage() ? (
                                    <Button
                                        variant="contained"
                                        onClick={handleRenew}
                                        disabled={subscribing}
                                    >
                                        {subscribing ? 'Đang gia hạn...' : 'Gia hạn gói'}
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        disabled={!packageDetails.isActive || subscribing}
                                        onClick={() => setSubscribeDialog(true)}
                                    >
                                        {subscribing ? 'Đang xử lý...' : 'Đăng ký gói'}
                                    </Button>
                                )}
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/teacher/advanced/packages')}
                                >
                                    Quay lại danh sách
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Subscribe Confirmation Dialog */}
            <Dialog
                open={subscribeDialog}
                onClose={() => setSubscribeDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Xác nhận đăng ký gói</DialogTitle>
                <DialogContent>
                    <Typography sx={{ mb: 2 }}>
                        Bạn có chắc chắn muốn đăng ký gói <strong>{packageDetails.name}</strong> không?
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        • Giá: {formatVND(packageDetails.price)}<br />
                        • Thời hạn: {packageDetails.durationMonths} tháng<br />
                        • Số khóa tối đa: {packageDetails.maxCourses} khóa
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        Gói sẽ được kích hoạt ngay lập tức và bạn sẽ được tính phí.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setSubscribeDialog(false)}
                        disabled={subscribing}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSubscribe}
                        variant="contained"
                        disabled={subscribing}
                    >
                        {subscribing ? 'Đang xử lý...' : 'Xác nhận đăng ký'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default PackagePlanDetail;