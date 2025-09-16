import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import './PaymentResult.css';

const PaymentResult: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState<'success' | 'failed' | 'pending'>('pending');
    const [paymentData, setPaymentData] = useState<any>(null);

    useEffect(() => {
        const processPaymentResult = async () => {
            try {
                setLoading(true);

                // Get VNPay parameters from URL
                const vnpParams = {
                    vnp_TxnRef: searchParams.get('vnp_TxnRef'),
                    vnp_ResponseCode: searchParams.get('vnp_ResponseCode'),
                    vnp_Amount: searchParams.get('vnp_Amount'),
                    vnp_TransactionNo: searchParams.get('vnp_TransactionNo'),
                    vnp_BankCode: searchParams.get('vnp_BankCode'),
                    vnp_SecureHash: searchParams.get('vnp_SecureHash')
                };

                console.log('VNPay return params:', vnpParams);

                // Check if we have required parameters
                if (!vnpParams.vnp_TxnRef || !vnpParams.vnp_ResponseCode) {
                    setPaymentStatus('failed');
                    setPaymentData({ error: 'Thiếu thông tin thanh toán' });
                    return;
                }

                // Determine payment status based on response code
                if (vnpParams.vnp_ResponseCode === '00') {
                    setPaymentStatus('success');
                    setPaymentData({
                        orderId: vnpParams.vnp_TxnRef,
                        amount: vnpParams.vnp_Amount ? parseInt(vnpParams.vnp_Amount) / 100 : 0,
                        transactionId: vnpParams.vnp_TransactionNo,
                        bankCode: vnpParams.vnp_BankCode
                    });

                    toast.success('Thanh toán thành công! Bạn đã được đăng ký khóa học.');

                    // Redirect to courses page after 3 seconds
                    setTimeout(() => {
                        navigate('/dashboard/courses');
                    }, 3000);
                } else {
                    setPaymentStatus('failed');
                    setPaymentData({
                        orderId: vnpParams.vnp_TxnRef,
                        responseCode: vnpParams.vnp_ResponseCode,
                        amount: vnpParams.vnp_Amount ? parseInt(vnpParams.vnp_Amount) / 100 : 0
                    });

                    toast.error('Thanh toán thất bại! Vui lòng thử lại.');
                }
            } catch (error) {
                console.error('Payment result processing error:', error);
                setPaymentStatus('failed');
                setPaymentData({ error: 'Có lỗi xảy ra khi xử lý kết quả thanh toán' });
                toast.error('Có lỗi xảy ra khi xử lý thanh toán');
            } finally {
                setLoading(false);
            }
        };

        processPaymentResult();
    }, [searchParams, navigate]);

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const getStatusMessage = () => {
        switch (paymentStatus) {
            case 'success':
                return {
                    title: 'Thanh toán thành công!',
                    message: 'Bạn đã được đăng ký khóa học thành công.',
                    icon: '✅',
                    color: 'success'
                };
            case 'failed':
                return {
                    title: 'Thanh toán thất bại',
                    message: 'Có lỗi xảy ra trong quá trình thanh toán.',
                    icon: '❌',
                    color: 'error'
                };
            default:
                return {
                    title: 'Đang xử lý...',
                    message: 'Vui lòng chờ trong giây lát.',
                    icon: '⏳',
                    color: 'pending'
                };
        }
    };

    const statusInfo = getStatusMessage();

    if (loading) {
        return (
            <div className="payment-result">
                <div className="payment-result__container">
                    <div className="payment-result__loading">
                        <div className="payment-result__spinner"></div>
                        <h2>Đang xử lý kết quả thanh toán...</h2>
                        <p>Vui lòng chờ trong giây lát</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-result">
            <div className="payment-result__container">
                <div className={`payment-result__card payment-result__card--${statusInfo.color}`}>
                    <div className="payment-result__icon">
                        {statusInfo.icon}
                    </div>

                    <h1 className="payment-result__title">{statusInfo.title}</h1>
                    <p className="payment-result__message">{statusInfo.message}</p>

                    {paymentData && (
                        <div className="payment-result__details">
                            <h3>Chi tiết giao dịch</h3>
                            <div className="payment-result__detail-item">
                                <span>Mã đơn hàng:</span>
                                <span>{paymentData.orderId}</span>
                            </div>

                            {paymentData.amount && (
                                <div className="payment-result__detail-item">
                                    <span>Số tiền:</span>
                                    <span>{formatPrice(paymentData.amount)}</span>
                                </div>
                            )}

                            {paymentData.transactionId && (
                                <div className="payment-result__detail-item">
                                    <span>Mã giao dịch:</span>
                                    <span>{paymentData.transactionId}</span>
                                </div>
                            )}

                            {paymentData.bankCode && (
                                <div className="payment-result__detail-item">
                                    <span>Ngân hàng:</span>
                                    <span>{paymentData.bankCode}</span>
                                </div>
                            )}

                            {paymentData.responseCode && (
                                <div className="payment-result__detail-item">
                                    <span>Mã phản hồi:</span>
                                    <span>{paymentData.responseCode}</span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="payment-result__actions">
                        {paymentStatus === 'success' ? (
                            <>
                                <button
                                    className="payment-result__btn payment-result__btn--primary"
                                    onClick={() => navigate('/dashboard/courses')}
                                >
                                    Xem khóa học của tôi
                                </button>
                                <button
                                    className="payment-result__btn payment-result__btn--secondary"
                                    onClick={() => navigate('/courses')}
                                >
                                    Tiếp tục mua khóa học
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    className="payment-result__btn payment-result__btn--primary"
                                    onClick={() => navigate('/courses')}
                                >
                                    Thử lại thanh toán
                                </button>
                                <button
                                    className="payment-result__btn payment-result__btn--secondary"
                                    onClick={() => navigate('/dashboard')}
                                >
                                    Về trang chủ
                                </button>
                            </>
                        )}
                    </div>

                    {paymentStatus === 'success' && (
                        <div className="payment-result__redirect">
                            <p>Đang chuyển hướng đến trang khóa học trong <span id="countdown">3</span> giây...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentResult;
