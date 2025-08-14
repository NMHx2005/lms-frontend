import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Register.css';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    agreeToTerms: false
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Handle registration logic here
    }, 2000);
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-background-overlay"></div>
        <div className="auth-background-content">
          <h2>Bắt đầu hành trình học tập!</h2>
          <p>Đăng ký ngay để truy cập hàng nghìn khóa học chất lượng cao</p>
        </div>
      </div>
      
      <div className="auth-form-container">
        <div className="auth-form-wrapper">
          <div className="auth-header">
            <div className="auth-logo">
              <img src="/images/logo.png" alt="LMS Logo" />
              <h1>LMS Platform</h1>
            </div>
            <h2>Đăng ký tài khoản</h2>
            <p>Tạo tài khoản mới để bắt đầu học tập</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Họ và tên</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nhập họ và tên của bạn"
                  required
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Nhập email của bạn"
                  required
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Số điện thoại</label>
              <div className="input-wrapper">
                <span className="input-icon">📱</span>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Nhập số điện thoại"
                  required
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Mật khẩu</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Tạo mật khẩu"
                    required
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔐</span>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Nhập lại mật khẩu"
                    required
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="role">Vai trò</label>
              <div className="input-wrapper">
                <span className="input-icon">🎯</span>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="student">Học viên</option>
                  <option value="teacher">Giảng viên</option>
                </select>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-wrapper">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  required
                />
                <span className="checkmark"></span>
                Tôi đồng ý với{' '}
                <Link to="/terms" className="terms-link">
                  Điều khoản sử dụng
                </Link>{' '}
                và{' '}
                <Link to="/privacy" className="terms-link">
                  Chính sách bảo mật
                </Link>
              </label>
            </div>

            <button 
              type="submit" 
              className="auth-submit-btn"
              disabled={loading || !formData.agreeToTerms}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Đang tạo tài khoản...
                </>
              ) : (
                'Đăng ký ngay'
              )}
            </button>

            <div className="auth-divider">
              <span>hoặc</span>
            </div>

            <div className="social-login">
              <button type="button" className="social-btn social-btn--google">
                <span className="social-icon">🔍</span>
                Đăng ký với Google
              </button>
              <button type="button" className="social-btn social-btn--facebook">
                <span className="social-icon">📘</span>
                Đăng ký với Facebook
              </button>
            </div>

            <div className="auth-footer">
              <p>
                Đã có tài khoản?{' '}
                <Link to="/login" className="auth-link">
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;