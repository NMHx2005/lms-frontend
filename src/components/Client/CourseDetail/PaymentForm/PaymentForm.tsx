import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography,
    Paper,
    Alert,
    CircularProgress
} from '@mui/material';
import {
    Person as PersonIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
    Payment as PaymentIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

interface PaymentFormProps {
    visible: boolean;
    onCancel: () => void;
    onConfirm: (paymentInfo: PaymentInfo) => void;
    courseTitle: string;
    coursePrice: number;
    loading?: boolean;
    useRealVNPay?: boolean;
}

interface PaymentInfo {
    fullName: string;
    phone: string;
    address: string;
}

// Styled components
const StyledDialog = styled(Dialog)(() => ({
    '& .MuiDialog-paper': {
        borderRadius: 16,
        minWidth: 500,
        maxWidth: 600,
    },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    textAlign: 'center',
    fontWeight: 600,
    fontSize: '1.5rem',
    padding: theme.spacing(3),
}));

const CourseInfoCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    background: '#f8f9fa',
    borderLeft: '4px solid #1890ff',
    borderRadius: 8,
}));

const PaymentButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
    color: 'white',
    fontWeight: 600,
    padding: theme.spacing(1.5, 3),
    borderRadius: 8,
    textTransform: 'none',
    fontSize: '1rem',
    boxShadow: '0 2px 4px rgba(24, 144, 255, 0.3)',
    '&:hover': {
        background: 'linear-gradient(135deg, #40a9ff 0%, #1890ff 100%)',
        boxShadow: '0 4px 8px rgba(24, 144, 255, 0.4)',
        transform: 'translateY(-1px)',
    },
    '&:active': {
        transform: 'translateY(0)',
    },
}));

const CancelButton = styled(Button)(({ theme }) => ({
    color: '#666',
    borderColor: '#d9d9d9',
    padding: theme.spacing(1.5, 3),
    borderRadius: 8,
    textTransform: 'none',
    fontSize: '1rem',
    '&:hover': {
        borderColor: '#40a9ff',
        color: '#40a9ff',
    },
}));

const PaymentForm: React.FC<PaymentFormProps> = ({
    visible,
    onCancel,
    onConfirm,
    courseTitle,
    coursePrice,
    loading = false,
    useRealVNPay = false
}) => {
    const [formData, setFormData] = useState<PaymentInfo>({
        fullName: '',
        phone: '',
        address: ''
    });
    const [errors, setErrors] = useState<Partial<PaymentInfo>>({});

    const handleInputChange = (field: keyof PaymentInfo) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<PaymentInfo> = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Vui lòng nhập họ và tên';
        } else if (formData.fullName.trim().length < 2) {
            newErrors.fullName = 'Họ và tên phải có ít nhất 2 ký tự';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Vui lòng nhập số điện thoại';
        } else if (!/^[0-9]{10,11}$/.test(formData.phone.trim())) {
            newErrors.phone = 'Số điện thoại không hợp lệ (10-11 số)';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Vui lòng nhập địa chỉ';
        } else if (formData.address.trim().length < 10) {
            newErrors.address = 'Địa chỉ phải có ít nhất 10 ký tự';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (validateForm()) {
            try {
                await onConfirm(formData);
                // Reset form after successful submission
                setFormData({ fullName: '', phone: '', address: '' });
                setErrors({});
            } catch (error) {
                console.error('Payment form error:', error);
            }
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN').format(value) + ' VNĐ';
    };

    return (
        <StyledDialog
            open={visible}
            onClose={onCancel}
            maxWidth="sm"
            fullWidth
        >
            <StyledDialogTitle>
                <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                    <PaymentIcon />
                    Thông tin thanh toán
                </Box>
            </StyledDialogTitle>

            <DialogContent sx={{ p: 3 }}>
                {/* Course Information */}
                <CourseInfoCard elevation={0}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#333' }}>
                        {courseTitle}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666', fontSize: '1rem' }}>
                        Giá: <Typography component="span" sx={{ color: '#1890ff', fontWeight: 600, fontSize: '1.125rem' }}>
                            {formatCurrency(coursePrice)}
                        </Typography>
                    </Typography>
                </CourseInfoCard>

                {/* Payment Form */}
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        fullWidth
                        label="Họ và tên"
                        value={formData.fullName}
                        onChange={handleInputChange('fullName')}
                        error={!!errors.fullName}
                        helperText={errors.fullName}
                        placeholder="Nhập họ và tên của bạn"
                        InputProps={{
                            startAdornment: <PersonIcon sx={{ color: 'action.active', mr: 1 }} />
                        }}
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        fullWidth
                        label="Số điện thoại"
                        value={formData.phone}
                        onChange={handleInputChange('phone')}
                        error={!!errors.phone}
                        helperText={errors.phone}
                        placeholder="Nhập số điện thoại"
                        InputProps={{
                            startAdornment: <PhoneIcon sx={{ color: 'action.active', mr: 1 }} />
                        }}
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        fullWidth
                        label="Địa chỉ"
                        value={formData.address}
                        onChange={handleInputChange('address')}
                        error={!!errors.address}
                        helperText={errors.address}
                        placeholder="Nhập địa chỉ của bạn"
                        multiline
                        rows={3}
                        InputProps={{
                            startAdornment: <LocationIcon sx={{ color: 'action.active', mr: 1, alignSelf: 'flex-start', mt: 1 }} />
                        }}
                        sx={{ mb: 3 }}
                    />

                    {/* Note */}
                    <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                        <Typography variant="body2">
                            <strong>Lưu ý:</strong> Sau khi nhấn "Thanh toán VNPay", bạn sẽ được chuyển hướng đến trang thanh toán của VNPay để hoàn tất giao dịch.
                        </Typography>
                    </Alert>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, gap: 2 }}>
                <CancelButton
                    onClick={onCancel}
                    variant="outlined"
                    disabled={loading}
                >
                    Hủy
                </CancelButton>
                <PaymentButton
                    onClick={handleSubmit}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PaymentIcon />}
                >
                    {loading ? 'Đang xử lý...' : (useRealVNPay ? 'Thanh toán VNPay (Thật)' : 'Thanh toán VNPay (Test)')}
                </PaymentButton>
            </DialogActions>
        </StyledDialog>
    );
};

export default PaymentForm;
