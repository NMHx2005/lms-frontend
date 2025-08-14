import React, { useState } from 'react';
import './CheckoutActions.css';

interface CheckoutActionsProps {
  course: {
    id: string;
    title: string;
    originalPrice: number;
    discountedPrice: number;
  };
  appliedCoupon?: {
    code: string;
    discount: number;
    type: 'percentage' | 'fixed';
  };
  onCheckout: () => void;
  isFormValid: boolean;
}

const CheckoutActions: React.FC<CheckoutActionsProps> = ({ 
  course, 
  appliedCoupon, 
  onCheckout, 
  isFormValid 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

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
  const totalSavings = course.originalPrice - finalPrice;

  const handleCheckout = async () => {
    if (!isFormValid) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      onCheckout();
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="checkout-actions">
      <div className="checkout-actions__summary">
        <h3 className="checkout-actions__title">Tóm tắt thanh toán</h3>
        
        <div className="checkout-actions__price-breakdown">
          <div className="checkout-actions__price-row">
            <span>Giá gốc:</span>
            <span className="checkout-actions__original-price">{formatPrice(course.originalPrice)}</span>
          </div>
          
          <div className="checkout-actions__price-row">
            <span>Giá khuyến mãi:</span>
            <span className="checkout-actions__discounted-price">{formatPrice(course.discountedPrice)}</span>
          </div>

          {appliedCoupon && (
            <div className="checkout-actions__price-row checkout-actions__coupon">
              <span>Mã giảm giá ({appliedCoupon.code}):</span>
              <span className="checkout-actions__coupon-discount">-{formatPrice(discountAmount)}</span>
            </div>
          )}

          {totalSavings > 0 && (
            <div className="checkout-actions__savings">
              <span>Bạn tiết kiệm được:</span>
              <span className="checkout-actions__savings-amount">{formatPrice(totalSavings)}</span>
            </div>
          )}

          <div className="checkout-actions__price-row checkout-actions__total">
            <span>Tổng cộng:</span>
            <span className="checkout-actions__final-price">{formatPrice(finalPrice)}</span>
          </div>
        </div>

        <div className="checkout-actions__features">
          <div className="checkout-actions__feature">
            <div className="checkout-actions__feature-icon">✓</div>
            <span>Truy cập trọn đời</span>
          </div>
          <div className="checkout-actions__feature">
            <div className="checkout-actions__feature-icon">✓</div>
            <span>Chứng chỉ hoàn thành</span>
          </div>
          <div className="checkout-actions__feature">
            <div className="checkout-actions__feature-icon">✓</div>
            <span>Hỗ trợ 24/7</span>
          </div>
          <div className="checkout-actions__feature">
            <div className="checkout-actions__feature-icon">✓</div>
            <span>30 ngày hoàn tiền</span>
          </div>
        </div>
      </div>

      <div className="checkout-actions__buttons">
        <button
          className={`checkout-actions__checkout-btn ${!isFormValid ? 'checkout-actions__checkout-btn--disabled' : ''}`}
          onClick={handleCheckout}
          disabled={!isFormValid || isProcessing}
        >
          {isProcessing ? (
            <>
              <span className="checkout-actions__spinner"></span>
              Đang xử lý...
            </>
          ) : (
            `Thanh toán ${formatPrice(finalPrice)}`
          )}
        </button>

        <div className="checkout-actions__secure">
          <div className="checkout-actions__secure-icon">🔒</div>
          <span>Thanh toán an toàn với SSL</span>
        </div>
      </div>

      <div className="checkout-actions__guarantee">
        <div className="checkout-actions__guarantee-icon">🛡️</div>
        <div className="checkout-actions__guarantee-text">
          <strong>Bảo mật 100%</strong>
          <p>Thông tin của bạn được mã hóa và bảo vệ tuyệt đối</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutActions;
