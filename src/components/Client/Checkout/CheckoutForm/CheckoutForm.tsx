import React, { useState } from 'react';
import './CheckoutForm.css';

interface CheckoutFormProps {
  onCouponApply: (couponCode: string) => void;
  appliedCoupon?: {
    code: string;
    discount: number;
    type: 'percentage' | 'fixed';
  };
  onRemoveCoupon: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onCouponApply, appliedCoupon, onRemoveCoupon }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'Việt Nam'
  });
  
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCouponSubmit = async () => {
    if (!couponCode.trim()) {
      setCouponError('Vui lòng nhập mã giảm giá');
      return;
    }

    setIsLoading(true);
    setCouponError('');
    setCouponSuccess('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock coupon validation
      if (couponCode.toUpperCase() === 'WELCOME10') {
        onCouponApply(couponCode.toUpperCase());
        setCouponSuccess('Áp dụng mã giảm giá thành công!');
        setCouponCode('');
      } else if (couponCode.toUpperCase() === 'SAVE20') {
        onCouponApply(couponCode.toUpperCase());
        setCouponSuccess('Áp dụng mã giảm giá thành công!');
        setCouponCode('');
      } else {
        setCouponError('Mã giảm giá không hợp lệ hoặc đã hết hạn');
      }
    } catch (error) {
      setCouponError('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    onRemoveCoupon();
    setCouponSuccess('');
  };

  return (
    <div className="checkout-form">
      <h3 className="checkout-form__title">Thông tin thanh toán</h3>
      
      <form className="checkout-form__form">
        <div className="checkout-form__section">
          <h4 className="checkout-form__section-title">Thông tin cá nhân</h4>
          
          <div className="checkout-form__row">
            <div className="checkout-form__group">
              <label htmlFor="firstName" className="checkout-form__label">
                Họ <span className="required">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="checkout-form__input"
                required
                autoComplete="off"
              />
            </div>
            
            <div className="checkout-form__group">
              <label htmlFor="lastName" className="checkout-form__label">
                Tên <span className="required">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="checkout-form__input"
                required
                autoComplete="off"
              />
            </div>
          </div>

          <div className="checkout-form__row">
            <div className="checkout-form__group">
              <label htmlFor="email" className="checkout-form__label">
                Email <span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="checkout-form__input"
                required
                autoComplete="off"
              />
            </div>
            
            <div className="checkout-form__group">
              <label htmlFor="phone" className="checkout-form__label">
                Số điện thoại <span className="required">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="checkout-form__input"
                required
                autoComplete="off"
              />
            </div>
          </div>
        </div>

        <div className="checkout-form__section">
          <h4 className="checkout-form__section-title">Địa chỉ</h4>
          
          <div className="checkout-form__group">
            <label htmlFor="address" className="checkout-form__label">
              Địa chỉ <span className="required">*</span>
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="checkout-form__input"
              placeholder="Số nhà, tên đường, phường/xã"
              required
              autoComplete="off"
            />
          </div>

          <div className="checkout-form__row">
            <div className="checkout-form__group">
              <label htmlFor="city" className="checkout-form__label">
                Thành phố <span className="required">*</span>
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="checkout-form__input"
                required
                autoComplete="off"
              />
            </div>
            
            <div className="checkout-form__group">
              <label htmlFor="zipCode" className="checkout-form__label">
                Mã bưu điện
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                className="checkout-form__input"
                autoComplete="off"
              />
            </div>
          </div>

          <div className="checkout-form__group">
            <label htmlFor="country" className="checkout-form__label">
              Quốc gia
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="checkout-form__input"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="checkout-form__section">
          <h4 className="checkout-form__section-title">Mã giảm giá</h4>
          
          {appliedCoupon ? (
            <div className="checkout-form__coupon-applied">
              <div className="checkout-form__coupon-info">
                <span className="checkout-form__coupon-code">{appliedCoupon.code}</span>
                <span className="checkout-form__coupon-discount">
                  -{appliedCoupon.type === 'percentage' ? `${appliedCoupon.discount}%` : `${appliedCoupon.discount.toLocaleString('vi-VN')} VND`}
                </span>
              </div>
              <button
                type="button"
                onClick={handleRemoveCoupon}
                className="checkout-form__remove-coupon"
              >
                Xóa
              </button>
            </div>
          ) : (
            <div className="checkout-form__coupon-form">
              <div className="checkout-form__coupon-input-group">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Nhập mã giảm giá"
                  className="checkout-form__coupon-input"
                  autoComplete="off"
                />
                <button
                  type="button"
                  disabled={isLoading}
                  className="checkout-form__coupon-button"
                  onClick={handleCouponSubmit}
                >
                  {isLoading ? 'Đang kiểm tra...' : 'Áp dụng'}
                </button>
              </div>
              
              {couponError && (
                <div className="checkout-form__coupon-error">{couponError}</div>
              )}
              
              {couponSuccess && (
                <div className="checkout-form__coupon-success">{couponSuccess}</div>
              )}
            </div>
          )}
        </div>

        <div className="checkout-form__section">
          <div className="checkout-form__terms">
            <label className="checkout-form__checkbox">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="checkout-form__checkbox-input"
              />
              <span className="checkout-form__checkbox-custom"></span>
              <span className="checkout-form__checkbox-text">
                Tôi đồng ý với <a href="/terms" target="_blank" rel="noopener noreferrer">Điều khoản sử dụng</a> và{' '}
                <a href="/privacy" target="_blank" rel="noopener noreferrer">Chính sách bảo mật</a>
              </span>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;
