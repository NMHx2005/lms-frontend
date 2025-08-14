import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Họ là bắt buộc';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'Họ phải có ít nhất 2 ký tự';
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Tên là bắt buộc';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Tên phải có ít nhất 2 ký tự';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
    } else if (!/^[0-9+\-\s()]{10,15}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Mật khẩu phải chứa chữ hoa, chữ thường và số';
    }

    // Confirm password validation
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    // Terms agreement validation
    if (!agreedToTerms) {
      newErrors.terms = 'Bạn phải đồng ý với điều khoản sử dụng';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful registration
      console.log('Registration successful:', formData);
      
      // Navigate to login page
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      setErrors({ general: 'Đăng ký thất bại. Vui lòng thử lại.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Đăng ký tài khoản</h1>
            <p>Tạo tài khoản mới để bắt đầu học tập ngay hôm nay!</p>
          </div>

          {errors.general && (
            <div className="auth-error">{errors.general}</div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">
                  Họ <span className="form-label-optional">*</span>
                </label>
                <div className="form-input-wrapper">
                  <div className="form-input-icon">👤</div>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`form-input ${errors.firstName ? 'form-input--error' : ''}`}
                    placeholder="Nhập họ của bạn"
                    required
                    autoComplete="off"
                  />
                </div>
                {errors.firstName && <div className="form-error">{errors.firstName}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="lastName" className="form-label">
                  Tên <span className="form-label-optional">*</span>
                </label>
                <div className="form-input-wrapper">
                  <div className="form-input-icon">👤</div>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`form-input ${errors.lastName ? 'form-input--error' : ''}`}
                    placeholder="Nhập tên của bạn"
                    required
                    autoComplete="off"
                  />
                </div>
                {errors.lastName && <div className="form-error">{errors.lastName}</div>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email <span className="form-label-optional">*</span>
              </label>
              <div className="form-input-wrapper">
                <div className="form-input-icon">📧</div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                  placeholder="Nhập email của bạn"
                  required
                  autoComplete="off"
                />
              </div>
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Số điện thoại <span className="form-label-optional">*</span>
              </label>
              <div className="form-input-wrapper">
                <div className="form-input-icon">📱</div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`form-input ${errors.phone ? 'form-input--error' : ''}`}
                  placeholder="Nhập số điện thoại của bạn"
                  required
                  autoComplete="off"
                />
              </div>
              {errors.phone && <div className="form-error">{errors.phone}</div>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Mật khẩu <span className="form-label-optional">*</span>
                </label>
                <div className="form-input-wrapper">
                  <div className="form-input-icon">🔒</div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`form-input ${errors.password ? 'form-input--error' : ''}`}
                    placeholder="Nhập mật khẩu của bạn"
                    required
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    className="form-input-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.password && <div className="form-error">{errors.password}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Xác nhận mật khẩu <span className="form-label-optional">*</span>
                </label>
                <div className="form-input-wrapper">
                  <div className="form-input-icon">🔒</div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`form-input ${errors.confirmPassword ? 'form-input--error' : ''}`}
                    placeholder="Nhập lại mật khẩu"
                    required
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    className="form-input-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-checkbox">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="form-checkbox-input"
                />
                <span className="form-checkbox-custom"></span>
                <span className="form-checkbox-text">
                  Tôi đồng ý với <a href="/terms" target="_blank" rel="noopener noreferrer">Điều khoản sử dụng</a> và{' '}
                  <a href="/privacy" target="_blank" rel="noopener noreferrer">Chính sách bảo mật</a>
                </span>
              </label>
              {errors.terms && <div className="form-error">{errors.terms}</div>}
            </div>

            <button
              type="submit"
              className="auth-btn auth-btn--primary"
              disabled={isLoading}
            >
              {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
          </form>

          <div className="auth-divider">
            <span>hoặc</span>
          </div>

          <div className="auth-social">
            <button className="auth-social-btn auth-social-btn--google">
              <span>🔍</span>
              Đăng ký với Google
            </button>
            <button className="auth-social-btn auth-social-btn--facebook">
              <span>📘</span>
              Đăng ký với Facebook
            </button>
          </div>

          <div className="auth-footer">
            <p>
              Đã có tài khoản?{' '}
              <Link to="/login" className="auth-link-button">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;