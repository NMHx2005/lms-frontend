import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Layout/client/Header';
import Footer from '@/components/Layout/client/Footer';
import CheckoutSummary from '@/components/Client/Checkout/CheckoutSummary/CheckoutSummary';
import PaymentMethods from '@/components/Client/Checkout/PaymentMethods/PaymentMethods';
import CheckoutForm from '@/components/Client/Checkout/CheckoutForm/CheckoutForm';
import CheckoutActions from '@/components/Client/Checkout/CheckoutActions/CheckoutActions';
import './Checkout.css';

interface Course {
  id: string;
  title: string;
  instructor: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
  duration: string;
  level: string;
  students: number;
  rating: number;
}

interface Coupon {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
}

const Checkout: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('credit-card');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | undefined>(undefined);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock course data based on courseId
        const mockCourse: Course = {
          id: courseId || '1',
          title: 'Đào tạo lập trình viên quốc tế',
          instructor: 'Nguyễn Văn A',
          image: 'https://storage.googleapis.com/a1aa/image/0820ec3b-33e6-468b-cc54-d7317c4a00fd.jpg',
          originalPrice: 2000000,
          discountedPrice: 1500000,
          duration: '6 tháng',
          level: 'Trung cấp',
          students: 1250,
          rating: 4.8
        };
        
        setCourse(mockCourse);
      } catch (err) {
        setError('Không thể tải thông tin khóa học');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const handleCouponApply = (couponCode: string) => {
    // Mock coupon logic
    if (couponCode === 'WELCOME10') {
      setAppliedCoupon({
        code: couponCode,
        discount: 10,
        type: 'percentage'
      });
    } else if (couponCode === 'SAVE20') {
      setAppliedCoupon({
        code: couponCode,
        discount: 200000,
        type: 'fixed'
      });
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(undefined);
  };

  const handleCheckout = () => {
    // Simulate successful checkout
    alert('Thanh toán thành công! Bạn sẽ được chuyển hướng đến trang khóa học.');
    navigate(`/courses/${courseId}`);
  };

  const validateForm = () => {
    // Simple validation - in real app, this would be more comprehensive
    setIsFormValid(true);
  };

  useEffect(() => {
    validateForm();
  }, []);

  if (loading) {
    return (
      <div className="checkout-page">
        <Header />
        <div className="checkout-page__loading">
          <div className="checkout-page__spinner"></div>
          <p>Đang tải thông tin khóa học...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="checkout-page">
        <Header />
        <div className="checkout-page__error">
          <h2>Không thể tải trang thanh toán</h2>
          <p>{error || 'Khóa học không tồn tại'}</p>
          <button onClick={() => navigate('/courses')} className="checkout-page__back-btn">
            Quay lại danh sách khóa học
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <Header />
      
      <main className="checkout-page__main">
        <div className="checkout-page__container">
          <div className="checkout-page__header">
            <h1 className="checkout-page__title">Thanh toán khóa học</h1>
            <p className="checkout-page__subtitle">
              Hoàn tất đơn hàng để bắt đầu học ngay
            </p>
          </div>

          <div className="checkout-page__content">
            <div className="checkout-page__left">
              <CheckoutForm
                onCouponApply={handleCouponApply}
                appliedCoupon={appliedCoupon}
                onRemoveCoupon={handleRemoveCoupon}
              />
              
              <PaymentMethods
                selectedMethod={selectedPaymentMethod}
                onMethodSelect={setSelectedPaymentMethod}
              />
            </div>

            <div className="checkout-page__right">
              <CheckoutSummary
                course={course}
                appliedCoupon={appliedCoupon}
              />
              
              <CheckoutActions
                course={course}
                appliedCoupon={appliedCoupon}
                onCheckout={handleCheckout}
                isFormValid={isFormValid}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
