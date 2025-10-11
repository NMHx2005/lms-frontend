import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from "@/components/Layout/client/Header";
import Footer from "@/components/Layout/client/Footer";
import TopBar from '@/components/Client/Home/TopBar/TopBar';
import './PaymentResult.css';

const PaymentResult = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState<'success' | 'failed' | 'error'>('error');
    const [paymentInfo, setPaymentInfo] = useState<any>(null);

    useEffect(() => {
        // Parse VNPay return parameters
        const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
        const vnp_TxnRef = searchParams.get('vnp_TxnRef'); // Order ID
        const vnp_Amount = searchParams.get('vnp_Amount');
        const vnp_TransactionNo = searchParams.get('vnp_TransactionNo');
        const vnp_BankCode = searchParams.get('vnp_BankCode');
        const error = searchParams.get('error');

        // Check if there's an error from backend
        if (error) {
            setPaymentStatus('error');
            setPaymentInfo({
                error: error === 'order_not_found' ? 'Không tìm thấy đơn hàng' : 'Lỗi xử lý thanh toán'
            });
            setLoading(false);
            return;
        }

        // VNPay response code "00" means success
        if (vnp_ResponseCode === '00') {
            setPaymentStatus('success');
            setPaymentInfo({
                orderId: vnp_TxnRef,
                amount: vnp_Amount ? parseInt(vnp_Amount) / 100 : 0,
                transactionNo: vnp_TransactionNo,
                bankCode: vnp_BankCode
            });
        } else {
            setPaymentStatus('failed');
            setPaymentInfo({
                orderId: vnp_TxnRef,
                responseCode: vnp_ResponseCode,
                message: getVNPayErrorMessage(vnp_ResponseCode || '')
            });
        }

        setLoading(false);
    }, [searchParams]);

    const getVNPayErrorMessage = (code: string) => {
        const errorMessages: Record<string, string> = {
            '07': 'Giao dịch bị nghi ngờ gian lận',
            '09': 'Thẻ/Tài khoản chưa đăng ký dịch vụ InternetBanking',
            '10': 'Xác thực thông tin thẻ/tài khoản không đúng quá số lần quy định',
            '11': 'Đã hết hạn chờ thanh toán',
            '12': 'Thẻ/Tài khoản bị khóa',
            '13': 'Mật khẩu OTP không chính xác',
            '24': 'Khách hàng hủy giao dịch',
            '51': 'Tài khoản không đủ số dư',
            '65': 'Tài khoản vượt quá số lần thanh toán trong ngày',
            '75': 'Ngân hàng thanh toán đang bảo trì',
            '79': 'Nhập sai mật khẩu quá số lần quy định',
            '99': 'Giao dịch thất bại'
        };
        return errorMessages[code] || 'Giao dịch không thành công';
    };

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const handleBackToCourses = () => {
        navigate('/courses');
    };

    const handleGoToDashboard = () => {
        navigate('/dashboard/courses');
    };

    if (loading) {
        return (
            <>
                <TopBar />
                <Header />
                <div className="payment-result">
                    <div className="payment-result__loading">
                        <div className="payment-result__spinner"></div>
                        <p>Đang xử lý kết quả thanh toán...</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <TopBar />
            <Header />

            <div className="payment-result">
                <div className="payment-result__container">
                    {paymentStatus === 'success' && (
                        <div className="payment-result__card payment-result__card--success">
                            <div className="payment-result__icon payment-result__icon--success">
                                <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h1 className="payment-result__title">Thanh toán thành công!</h1>
                            <p className="payment-result__message">
                                Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi.
                            </p>

                            <div className="payment-result__info">
                                <div className="payment-result__info-item">
                                    <span className="payment-result__info-label">Mã giao dịch:</span>
                                    <span className="payment-result__info-value">{paymentInfo?.transactionNo || 'N/A'}</span>
                                </div>
                                <div className="payment-result__info-item">
                                    <span className="payment-result__info-label">Mã đơn hàng:</span>
                                    <span className="payment-result__info-value">{paymentInfo?.orderId || 'N/A'}</span>
                                </div>
                                <div className="payment-result__info-item">
                                    <span className="payment-result__info-label">Số tiền:</span>
                                    <span className="payment-result__info-value payment-result__info-value--amount">
                                        {formatPrice(paymentInfo?.amount || 0)}
                                    </span>
                                </div>
                                <div className="payment-result__info-item">
                                    <span className="payment-result__info-label">Ngân hàng:</span>
                                    <span className="payment-result__info-value">{paymentInfo?.bankCode || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="payment-result__actions">
                                <button
                                    className="payment-result__button payment-result__button--primary"
                                    onClick={handleGoToDashboard}
                                >
                                    Đi tới khóa học của tôi
                                </button>
                                <button
                                    className="payment-result__button payment-result__button--secondary"
                                    onClick={handleBackToCourses}
                                >
                                    Khám phá thêm khóa học
                                </button>
                            </div>
                        </div>
                    )}

                    {paymentStatus === 'failed' && (
                        <div className="payment-result__card payment-result__card--failed">
                            <div className="payment-result__icon payment-result__icon--failed">
                                <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h1 className="payment-result__title">Thanh toán không thành công</h1>
                            <p className="payment-result__message">
                                {paymentInfo?.message || 'Giao dịch của bạn đã không thể hoàn tất.'}
                            </p>

                            <div className="payment-result__info">
                                <div className="payment-result__info-item">
                                    <span className="payment-result__info-label">Mã đơn hàng:</span>
                                    <span className="payment-result__info-value">{paymentInfo?.orderId || 'N/A'}</span>
                                </div>
                                <div className="payment-result__info-item">
                                    <span className="payment-result__info-label">Mã lỗi:</span>
                                    <span className="payment-result__info-value">{paymentInfo?.responseCode || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="payment-result__actions">
                                <button
                                    className="payment-result__button payment-result__button--primary"
                                    onClick={() => navigate(-1)}
                                >
                                    Thử lại
                                </button>
                                <button
                                    className="payment-result__button payment-result__button--secondary"
                                    onClick={handleBackToCourses}
                                >
                                    Quay lại trang khóa học
                                </button>
                            </div>
                        </div>
                    )}

                    {paymentStatus === 'error' && (
                        <div className="payment-result__card payment-result__card--error">
                            <div className="payment-result__icon payment-result__icon--error">
                                <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h1 className="payment-result__title">Có lỗi xảy ra</h1>
                            <p className="payment-result__message">
                                {paymentInfo?.error || 'Không thể xử lý kết quả thanh toán. Vui lòng liên hệ hỗ trợ.'}
                            </p>

                            <div className="payment-result__actions">
                                <button
                                    className="payment-result__button payment-result__button--primary"
                                    onClick={handleBackToCourses}
                                >
                                    Quay lại trang khóa học
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="payment-result__support">
                        <p>Cần hỗ trợ? Liên hệ chúng tôi:</p>
                        <div className="payment-result__support-contacts">
                            <a href="tel:1900555577">📞 1900 55 55 77</a>
                            <a href="mailto:support@lms.vn">✉️ support@lms.vn</a>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default PaymentResult;
