import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ForgotPassword.css';
import api from '@/services/api';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
    } catch (err) {
      // toast được interceptor hiển thị
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="auth-container">
        <div className="auth-background">
          <div className="auth-background-overlay"></div>
          <div className="auth-background-content">
            <h2>Kiểm tra email của bạn!</h2>
            <p>Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu</p>
          </div>
        </div>
        
        <div className="auth-form-container">
          <div className="auth-form-wrapper">
            <div className="auth-header">
              <div className="auth-logo">
                <img src="/images/logo.png" alt="LMS Logo" />
                <h1>LMS Platform</h1>
              </div>
              <div className="success-icon">✅</div>
              <h2>Email đã được gửi</h2>
              <p>Vui lòng kiểm tra hộp thư của bạn</p>
            </div>

            <div className="auth-message">
              <p>
                Chúng tôi đã gửi email chứa link đặt lại mật khẩu đến <strong>{email}</strong>.
                Vui lòng kiểm tra hộp thư và spam folder.
              </p>
              
              <div className="auth-actions">
                <button 
                  type="button" 
                  className="auth-submit-btn"
                  onClick={() => setSubmitted(false)}
                >
                  Gửi lại email
                </button>
                
                <Link to="/login" className="auth-link">
                  Quay lại đăng nhập
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-background-overlay"></div>
        <div className="auth-background-content">
          <h2>Quên mật khẩu?</h2>
          <p>Đừng lo lắng! Chúng tôi sẽ giúp bạn đặt lại mật khẩu</p>
        </div>
      </div>
      
      <div className="auth-form-container">
        <div className="auth-form-wrapper">
          <div className="auth-header">
            <div className="auth-logo">
              <img src="/images/logo.png" alt="LMS Logo" />
              <h1>LMS Platform</h1>
            </div>
            <h2>Đặt lại mật khẩu</h2>
            <p>Nhập email để nhận hướng dẫn đặt lại mật khẩu</p>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email của bạn"
                  required
                  autoComplete="off"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="auth-submit-btn"
              disabled={loading || !email.trim()}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Đang gửi email...
                </>
              ) : (
                'Gửi email đặt lại mật khẩu'
              )}
            </button>

            <div className="auth-footer">
              <p>
                Nhớ mật khẩu?{' '}
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

export default ForgotPassword;
