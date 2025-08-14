import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
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
      
      // Mock successful login
      console.log('Login successful:', formData);
      
      // Navigate to dashboard or home page
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      setErrors({ general: 'Đăng nhập thất bại. Vui lòng thử lại.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Đăng nhập</h1>
            <p>Chào mừng bạn trở lại! Vui lòng đăng nhập để tiếp tục.</p>
          </div>

          {errors.general && (
            <div className="auth-error">{errors.general}</div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
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

            <div className="form-options">
              <label className="form-checkbox">
                <input type="checkbox" className="form-checkbox-input" />
                <span className="form-checkbox-custom"></span>
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <Link to="/forgot-password" className="form-link">
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              className="auth-btn auth-btn--primary"
              disabled={isLoading}
            >
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <div className="auth-divider">
            <span>hoặc</span>
          </div>

          <div className="auth-social">
            <button className="auth-social-btn auth-social-btn--google">
              <span>🔍</span>
              Đăng nhập với Google
            </button>
            <button className="auth-social-btn auth-social-btn--facebook">
              <span>📘</span>
              Đăng nhập với Facebook
            </button>
          </div>

          <div className="auth-footer">
            <p>
              Chưa có tài khoản?{' '}
              <Link to="/register" className="auth-link-button">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;