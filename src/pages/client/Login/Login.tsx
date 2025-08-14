import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
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
      // Handle login logic here
    }, 2000);
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-background-overlay"></div>
        <div className="auth-background-content">
          <h2>Chào mừng bạn trở lại!</h2>
          <p>Đăng nhập để tiếp tục học tập và phát triển kỹ năng</p>
        </div>
      </div>
      
      <div className="auth-form-container">
        <div className="auth-form-wrapper">
          <div className="auth-header">
            <div className="auth-logo">
              <img src="/images/logo.png" alt="LMS Logo" />
              <h1>LMS Platform</h1>
            </div>
            <h2>Đăng nhập</h2>
            <p>Nhập thông tin đăng nhập của bạn</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
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
              <label htmlFor="password">Mật khẩu</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu"
                  required
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-wrapper">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                Ghi nhớ đăng nhập
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Quên mật khẩu?
              </Link>
            </div>

            <button 
              type="submit" 
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Đang đăng nhập...
                </>
              ) : (
                'Đăng nhập'
              )}
            </button>

            <div className="auth-divider">
              <span>hoặc</span>
            </div>

            <div className="social-login">
              <button type="button" className="social-btn social-btn--google">
                <span className="social-icon">🔍</span>
                Đăng nhập với Google
              </button>
              <button type="button" className="social-btn social-btn--facebook">
                <span className="social-icon">📘</span>
                Đăng nhập với Facebook
              </button>
            </div>

            <div className="auth-footer">
              <p>
                Chưa có tài khoản?{' '}
                <Link to="/register" className="auth-link">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;