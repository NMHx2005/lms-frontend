import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { register as registerThunk } from '@/store/authSlice';
import { toast } from 'react-hot-toast';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'student', // Mặc định là student
    agreeToTerms: false
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }
    if (!formData.agreeToTerms) {
      toast.error('Vui lòng đồng ý với điều khoản');
      return;
    }
    setLoading(true);
    try {
      await dispatch(
        registerThunk({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        })
      ).unwrap();
      navigate('/');
    } catch (err) {
      // Lỗi đã được interceptor toast; giữ UI responsive
    } finally {
      setLoading(false);
    }
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
            <p>Tạo tài khoản học viên mới để bắt đầu học tập</p>
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