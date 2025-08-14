import React from 'react';
import './CheckoutSummary.css';

interface CheckoutSummaryProps {
  course: {
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
  };
  appliedCoupon?: {
    code: string;
    discount: number;
    type: 'percentage' | 'fixed';
  };
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({ course, appliedCoupon }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percentage') {
      return (course.originalPrice * appliedCoupon.discount) / 100;
    }
    return appliedCoupon.discount;
  };

  const discountAmount = calculateDiscount();
  const finalPrice = course.discountedPrice - discountAmount;

  return (
    <div className="checkout-summary">
      <h3 className="checkout-summary__title">Tóm tắt đơn hàng</h3>
      
      <div className="checkout-summary__course">
        <div className="checkout-summary__course-image">
          <img src={course.image} alt={course.title} />
        </div>
        <div className="checkout-summary__course-info">
          <h4 className="checkout-summary__course-title">{course.title}</h4>
          <p className="checkout-summary__course-instructor">Giảng viên: {course.instructor}</p>
          <div className="checkout-summary__course-meta">
            <span className="checkout-summary__course-duration">{course.duration}</span>
            <span className="checkout-summary__course-level">{course.level}</span>
            <span className="checkout-summary__course-students">{course.students} học viên</span>
            <span className="checkout-summary__course-rating">⭐ {course.rating}</span>
          </div>
        </div>
      </div>

      <div className="checkout-summary__pricing">
        <div className="checkout-summary__price-row">
          <span>Giá gốc:</span>
          <span className="checkout-summary__original-price">{formatPrice(course.originalPrice)}</span>
        </div>
        
        <div className="checkout-summary__price-row">
          <span>Giá khuyến mãi:</span>
          <span className="checkout-summary__discounted-price">{formatPrice(course.discountedPrice)}</span>
        </div>

        {appliedCoupon && (
          <div className="checkout-summary__price-row checkout-summary__coupon">
            <span>Mã giảm giá ({appliedCoupon.code}):</span>
            <span className="checkout-summary__coupon-discount">-{formatPrice(discountAmount)}</span>
          </div>
        )}

        <div className="checkout-summary__price-row checkout-summary__total">
          <span>Tổng cộng:</span>
          <span className="checkout-summary__final-price">{formatPrice(finalPrice)}</span>
        </div>
      </div>

      <div className="checkout-summary__guarantee">
        <div className="checkout-summary__guarantee-icon">✓</div>
        <div className="checkout-summary__guarantee-text">
          <strong>30 ngày hoàn tiền</strong>
          <p>Không hài lòng với khóa học? Chúng tôi sẽ hoàn tiền trong 30 ngày</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSummary;
