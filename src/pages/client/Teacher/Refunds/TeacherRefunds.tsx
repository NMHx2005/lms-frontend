import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { refundService, RefundRequest } from '@/services/client/refund.service';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Stack,
    Grid,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Chip,
    CircularProgress,
    Avatar,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import MoneyIcon from '@mui/icons-material/MonetizationOn';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

const TeacherRefunds: React.FC = () => {
    const [refunds, setRefunds] = useState<RefundRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        search: '',
        status: 'all'
    });
    const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [teacherNotes, setTeacherNotes] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [refundMethod, setRefundMethod] = useState('original_payment');

    useEffect(() => {
        loadRefunds();
    }, [filters.status]);

    const loadRefunds = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await refundService.getTeacherRefundRequests({
                status: filters.status !== 'all' ? filters.status : undefined,
                limit: 100
            });

            if (response.success) {
                setRefunds(response.data || []);
            }
        } catch (err: any) {
            const errorMessage = err?.response?.data?.error || 'Failed to load refunds';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!selectedRefund) return;

        try {
            const loadingToast = toast.loading('Đang duyệt yêu cầu hoàn tiền...');
            const response = await refundService.approveRefund(selectedRefund._id, {
                notes: teacherNotes,
                refundMethod
            });

            toast.dismiss(loadingToast);

            if (response.success) {
                toast.success('Đã duyệt hoàn tiền! Học viên đã bị loại khỏi khóa học.');
                setShowApproveModal(false);
                setTeacherNotes('');
                setSelectedRefund(null);
                loadRefunds();
            }
        } catch (err: any) {
            toast.dismiss();
            toast.error(err?.response?.data?.error || 'Failed to approve refund');
        }
    };

    const handleReject = async () => {
        if (!selectedRefund || !rejectionReason.trim()) {
            toast.error('Vui lòng nhập lý do từ chối');
            return;
        }

        try {
            const loadingToast = toast.loading('Đang từ chối yêu cầu...');
            const response = await refundService.rejectRefund(selectedRefund._id, {
                reason: rejectionReason,
                notes: teacherNotes
            });

            toast.dismiss(loadingToast);

            if (response.success) {
                toast.success('Đã từ chối yêu cầu hoàn tiền');
                setShowRejectModal(false);
                setRejectionReason('');
                setTeacherNotes('');
                setSelectedRefund(null);
                loadRefunds();
            }
        } catch (err: any) {
            toast.dismiss();
            toast.error(err?.response?.data?.error || 'Failed to reject refund');
        }
    };

    const filteredRefunds = useMemo(() => {
        let result = refunds;

        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter(r =>
                (typeof r.courseId === 'object' && r.courseId.title?.toLowerCase().includes(searchLower)) ||
                r.reason?.toLowerCase().includes(searchLower) ||
                (typeof r.studentId === 'object' && (r.studentId as any).name?.toLowerCase().includes(searchLower))
            );
        }

        return result;
    }, [refunds, filters.search]);

    const stats = useMemo(() => ({
        total: refunds.length,
        pending: refunds.filter(r => r.status === 'pending').length,
        approved: refunds.filter(r => r.status === 'approved').length,
        rejected: refunds.filter(r => r.status === 'rejected').length,
        totalAmount: refunds.reduce((sum, r) => sum + r.amount, 0)
    }), [refunds]);

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'info' | 'default' => {
        switch (status) {
            case 'approved': return 'success';
            case 'pending': return 'warning';
            case 'rejected': return 'error';
            case 'cancelled': return 'info';
            default: return 'default';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'approved': return 'Đã duyệt';
            case 'pending': return 'Chờ duyệt';
            case 'rejected': return 'Từ chối';
            case 'cancelled': return 'Đã hủy';
            default: return status;
        }
    };

    if (loading) {
        return (
            <Box display="flex" alignItems="center" justifyContent="center" minHeight="80vh">
                <Stack spacing={2} alignItems="center">
                    <CircularProgress size={60} />
                    <Typography variant="h6">Đang tải dữ liệu...</Typography>
                </Stack>
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={4}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    <Typography variant="h6">Đã xảy ra lỗi</Typography>
                    <Typography>{error}</Typography>
                </Alert>
                <Button variant="contained" onClick={loadRefunds} startIcon={<AutorenewIcon />}>
                    Thử lại
                </Button>
            </Box>
        );
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    Quản lý Hoàn tiền
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Xử lý các yêu cầu hoàn tiền từ học viên trong khóa học của bạn
                </Typography>
            </Box>

            {/* Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ borderRadius: 3, border: (t) => `1px solid ${t.palette.divider}` }}>
                        <CardContent>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar sx={{ bgcolor: 'primary.light', width: 60, height: 60 }}>
                                    <MoneyIcon sx={{ color: 'primary.main' }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="h5" fontWeight={800}>{stats.total}</Typography>
                                    <Typography color="text.secondary" variant="body2">Tổng yêu cầu</Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ borderRadius: 3, border: (t) => `1px solid ${t.palette.divider}` }}>
                        <CardContent>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar sx={{ bgcolor: 'warning.light', width: 60, height: 60 }}>
                                    <PendingIcon sx={{ color: 'warning.main' }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="h5" fontWeight={800}>{stats.pending}</Typography>
                                    <Typography color="text.secondary" variant="body2">Chờ duyệt</Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ borderRadius: 3, border: (t) => `1px solid ${t.palette.divider}` }}>
                        <CardContent>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar sx={{ bgcolor: 'success.light', width: 60, height: 60 }}>
                                    <CheckCircleIcon sx={{ color: 'success.main' }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="h5" fontWeight={800}>{stats.approved}</Typography>
                                    <Typography color="text.secondary" variant="body2">Đã duyệt</Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ borderRadius: 3, border: (t) => `1px solid ${t.palette.divider}` }}>
                        <CardContent>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar sx={{ bgcolor: 'error.light', width: 60, height: 60 }}>
                                    <CancelIcon sx={{ color: 'error.main' }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="h5" fontWeight={800}>{stats.rejected}</Typography>
                                    <Typography color="text.secondary" variant="body2">Từ chối</Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Filters */}
            <Card sx={{ mb: 3, borderRadius: 3 }}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                            <TextField
                                fullWidth
                                placeholder="Tìm kiếm theo khóa học, học viên hoặc lý do..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>Trạng thái</InputLabel>
                                <Select
                                    value={filters.status}
                                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                    label="Trạng thái"
                                >
                                    <MenuItem value="all">Tất cả ({stats.total})</MenuItem>
                                    <MenuItem value="pending">Chờ duyệt ({stats.pending})</MenuItem>
                                    <MenuItem value="approved">Đã duyệt ({stats.approved})</MenuItem>
                                    <MenuItem value="rejected">Từ chối ({stats.rejected})</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Refunds Table */}
            <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                        Danh sách yêu cầu hoàn tiền ({filteredRefunds.length})
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Xử lý các yêu cầu hoàn tiền từ học viên
                    </Typography>

                    {filteredRefunds.length === 0 ? (
                        <Box textAlign="center" py={8}>
                            <MoneyIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                Không có yêu cầu hoàn tiền nào
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {filters.status === 'pending'
                                    ? 'Không có yêu cầu chờ duyệt'
                                    : 'Chưa có yêu cầu hoàn tiền nào cho khóa học của bạn'}
                            </Typography>
                        </Box>
                    ) : (
                        <TableContainer component={Paper} variant="outlined">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Khóa học</strong></TableCell>
                                        <TableCell><strong>Học viên</strong></TableCell>
                                        <TableCell><strong>Số tiền</strong></TableCell>
                                        <TableCell><strong>Lý do</strong></TableCell>
                                        <TableCell><strong>Liên hệ</strong></TableCell>
                                        <TableCell><strong>Trạng thái</strong></TableCell>
                                        <TableCell><strong>Ngày tạo</strong></TableCell>
                                        <TableCell align="center"><strong>Hành động</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredRefunds.map((refund) => (
                                        <TableRow key={refund._id} hover>
                                            <TableCell>
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    {typeof refund.courseId === 'object' && refund.courseId.thumbnail && (
                                                        <Avatar src={refund.courseId.thumbnail} variant="rounded" />
                                                    )}
                                                    <Box>
                                                        <Typography variant="body2" fontWeight={600}>
                                                            {typeof refund.courseId === 'object' ? refund.courseId.title : 'N/A'}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            ID: {refund._id.substring(18)}
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    {typeof refund.studentId === 'object' && (refund.studentId as any).avatar && (
                                                        <Avatar src={(refund.studentId as any).avatar} sx={{ width: 32, height: 32 }} />
                                                    )}
                                                    <Typography variant="body2">
                                                        {typeof refund.studentId === 'object'
                                                            ? (refund.studentId as any).name || (refund.studentId as any).email || 'N/A'
                                                            : 'N/A'}
                                                    </Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={600} color="primary">
                                                    {formatPrice(refund.amount)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    maxWidth: 200
                                                }}>
                                                    {refund.reason}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={0.5}>
                                                    {(refund.contactMethod.type === 'email' || refund.contactMethod.type === 'both') && (
                                                        <Tooltip title={refund.contactMethod.email || ''}>
                                                            <EmailIcon fontSize="small" color="action" />
                                                        </Tooltip>
                                                    )}
                                                    {(refund.contactMethod.type === 'phone' || refund.contactMethod.type === 'both') && (
                                                        <Tooltip title={refund.contactMethod.phone || ''}>
                                                            <PhoneIcon fontSize="small" color="action" />
                                                        </Tooltip>
                                                    )}
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={getStatusLabel(refund.status)}
                                                    color={getStatusColor(refund.status)}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="caption">
                                                    {formatDate(refund.createdAt)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Stack direction="row" spacing={1} justifyContent="center">
                                                    <Tooltip title="Xem chi tiết">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => {
                                                                setSelectedRefund(refund);
                                                                setShowDetailModal(true);
                                                            }}
                                                        >
                                                            <VisibilityIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    {refund.status === 'pending' && (
                                                        <>
                                                            <Tooltip title="Duyệt">
                                                                <IconButton
                                                                    size="small"
                                                                    color="success"
                                                                    onClick={() => {
                                                                        setSelectedRefund(refund);
                                                                        setShowApproveModal(true);
                                                                    }}
                                                                >
                                                                    <ThumbUpIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Từ chối">
                                                                <IconButton
                                                                    size="small"
                                                                    color="error"
                                                                    onClick={() => {
                                                                        setSelectedRefund(refund);
                                                                        setShowRejectModal(true);
                                                                    }}
                                                                >
                                                                    <ThumbDownIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </>
                                                    )}
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </CardContent>
            </Card>

            {/* Detail Modal */}
            <Dialog open={showDetailModal} onClose={() => setShowDetailModal(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="h6" fontWeight={700}>Chi tiết yêu cầu hoàn tiền</Typography>
                        <IconButton onClick={() => setShowDetailModal(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                </DialogTitle>
                <DialogContent dividers>
                    {selectedRefund && (
                        <Stack spacing={3}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">Khóa học</Typography>
                                <Typography variant="body1" fontWeight={600}>
                                    {typeof selectedRefund.courseId === 'object' ? selectedRefund.courseId.title : 'N/A'}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">Học viên</Typography>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    {typeof selectedRefund.studentId === 'object' && (selectedRefund.studentId as any).avatar && (
                                        <Avatar src={(selectedRefund.studentId as any).avatar} />
                                    )}
                                    <Box>
                                        <Typography variant="body1">
                                            {typeof selectedRefund.studentId === 'object'
                                                ? (selectedRefund.studentId as any).name || 'N/A'
                                                : 'N/A'}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {typeof selectedRefund.studentId === 'object'
                                                ? (selectedRefund.studentId as any).email || ''
                                                : ''}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Box>

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Số tiền hoàn</Typography>
                                    <Typography variant="h6" color="primary">{formatPrice(selectedRefund.amount)}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Trạng thái</Typography>
                                    <Chip
                                        label={getStatusLabel(selectedRefund.status)}
                                        color={getStatusColor(selectedRefund.status)}
                                    />
                                </Grid>
                            </Grid>

                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">Lý do</Typography>
                                <Typography variant="body1">{selectedRefund.reason}</Typography>
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">Mô tả chi tiết</Typography>
                                <Typography variant="body1">{selectedRefund.description}</Typography>
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">Phương thức liên hệ</Typography>
                                <Stack spacing={1} sx={{ mt: 1 }}>
                                    {selectedRefund.contactMethod.email && (
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <EmailIcon fontSize="small" color="action" />
                                            <Typography variant="body2">{selectedRefund.contactMethod.email}</Typography>
                                        </Stack>
                                    )}
                                    {selectedRefund.contactMethod.phone && (
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <PhoneIcon fontSize="small" color="action" />
                                            <Typography variant="body2">{selectedRefund.contactMethod.phone}</Typography>
                                        </Stack>
                                    )}
                                </Stack>
                            </Box>

                            {selectedRefund.teacherNotes && (
                                <Alert severity="info">
                                    <Typography variant="subtitle2" fontWeight={600}>Ghi chú của bạn:</Typography>
                                    <Typography variant="body2">{selectedRefund.teacherNotes}</Typography>
                                </Alert>
                            )}

                            {selectedRefund.rejectionReason && (
                                <Alert severity="error">
                                    <Typography variant="subtitle2" fontWeight={600}>Lý do từ chối:</Typography>
                                    <Typography variant="body2">{selectedRefund.rejectionReason}</Typography>
                                </Alert>
                            )}

                            <Divider />

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="caption" color="text.secondary">Ngày tạo</Typography>
                                    <Typography variant="body2">{formatDate(selectedRefund.createdAt)}</Typography>
                                </Grid>
                                {selectedRefund.processedAt && (
                                    <Grid item xs={6}>
                                        <Typography variant="caption" color="text.secondary">Ngày xử lý</Typography>
                                        <Typography variant="body2">{formatDate(selectedRefund.processedAt)}</Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowDetailModal(false)}>Đóng</Button>
                    {selectedRefund?.status === 'pending' && (
                        <>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => {
                                    setShowDetailModal(false);
                                    setShowRejectModal(true);
                                }}
                            >
                                Từ chối
                            </Button>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={() => {
                                    setShowDetailModal(false);
                                    setShowApproveModal(true);
                                }}
                            >
                                Duyệt
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>

            {/* Approve Modal */}
            <Dialog open={showApproveModal} onClose={() => setShowApproveModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="h6" fontWeight={700}>Duyệt hoàn tiền</Typography>
                        <IconButton onClick={() => setShowApproveModal(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                </DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={3}>
                        <Alert severity="warning">
                            <Typography variant="body2">
                                ⚠️ Khi duyệt hoàn tiền:
                                <br />• Học viên sẽ bị loại khỏi khóa học
                                <br />• Không thể hoàn tác
                                <br />• Tiền sẽ được hoàn lại cho học viên (offline)
                            </Typography>
                        </Alert>

                        {selectedRefund && (
                            <Box>
                                <Typography variant="subtitle2" gutterBottom>Thông tin:</Typography>
                                <Typography variant="body2">
                                    Khóa học: <strong>{typeof selectedRefund.courseId === 'object' ? selectedRefund.courseId.title : ''}</strong>
                                </Typography>
                                <Typography variant="body2">
                                    Số tiền: <strong>{formatPrice(selectedRefund.amount)}</strong>
                                </Typography>
                            </Box>
                        )}

                        <FormControl fullWidth>
                            <InputLabel>Phương thức hoàn tiền</InputLabel>
                            <Select
                                value={refundMethod}
                                onChange={(e) => setRefundMethod(e.target.value)}
                                label="Phương thức hoàn tiền"
                            >
                                <MenuItem value="original_payment">Gốc (VNPay)</MenuItem>
                                <MenuItem value="bank_transfer">Chuyển khoản ngân hàng</MenuItem>
                                <MenuItem value="credit">Credit vào tài khoản</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Ghi chú (tuỳ chọn)"
                            value={teacherNotes}
                            onChange={(e) => setTeacherNotes(e.target.value)}
                            placeholder="Nhập ghi chú cho học viên..."
                            inputProps={{ maxLength: 500 }}
                            helperText={`${teacherNotes.length}/500 ký tự`}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowApproveModal(false)}>Hủy</Button>
                    <Button variant="contained" color="success" onClick={handleApprove}>
                        Xác nhận duyệt
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Reject Modal */}
            <Dialog open={showRejectModal} onClose={() => setShowRejectModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="h6" fontWeight={700}>Từ chối hoàn tiền</Typography>
                        <IconButton onClick={() => setShowRejectModal(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                </DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={3}>
                        <Alert severity="info">
                            <Typography variant="body2">
                                Vui lòng cung cấp lý do từ chối rõ ràng để học viên hiểu
                            </Typography>
                        </Alert>

                        {selectedRefund && (
                            <Box>
                                <Typography variant="subtitle2" gutterBottom>Thông tin:</Typography>
                                <Typography variant="body2">
                                    Khóa học: <strong>{typeof selectedRefund.courseId === 'object' ? selectedRefund.courseId.title : ''}</strong>
                                </Typography>
                                <Typography variant="body2">
                                    Lý do học viên: <em>{selectedRefund.reason}</em>
                                </Typography>
                            </Box>
                        )}

                        <TextField
                            fullWidth
                            required
                            multiline
                            rows={3}
                            label="Lý do từ chối"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Ví dụ: Yêu cầu không hợp lệ vì đã hoàn thành quá 50% khóa học..."
                            inputProps={{ maxLength: 500 }}
                            helperText={`${rejectionReason.length}/500 ký tự`}
                        />

                        <TextField
                            fullWidth
                            multiline
                            rows={2}
                            label="Ghi chú thêm (tuỳ chọn)"
                            value={teacherNotes}
                            onChange={(e) => setTeacherNotes(e.target.value)}
                            placeholder="Ghi chú bổ sung cho học viên..."
                            inputProps={{ maxLength: 500 }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowRejectModal(false)}>Hủy</Button>
                    <Button variant="contained" color="error" onClick={handleReject}>
                        Xác nhận từ chối
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TeacherRefunds;

