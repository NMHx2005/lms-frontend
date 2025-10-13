import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { register as registerThunk } from '@/store/authSlice';
import { toast } from 'react-hot-toast';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import SecurityIcon from '@mui/icons-material/Security';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Password strength calculator
  const passwordStrength = useMemo(() => {
    const password = formData.password;
    if (!password) return { level: 0, text: '', color: '' };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { level: 1, text: 'Yếu', color: '#ef4444' };
    if (strength <= 3) return { level: 2, text: 'Trung bình', color: '#f59e0b' };
    if (strength <= 4) return { level: 3, text: 'Mạnh', color: '#10b981' };
    return { level: 4, text: 'Rất mạnh', color: '#059669' };
  }, [formData.password]);

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
    <div className="register-container">
      {/* Background Decorations */}
      <div className="register-bg-decoration">
        <div className="decoration-circle circle-1"></div>
        <div className="decoration-circle circle-2"></div>
        <div className="decoration-circle circle-3"></div>
      </div>

      {/* Left Section - Benefits */}
      <div className="register-left-section">
        <div className="register-branding">
          <div className="brand-logo-wrapper">
            <div className="brand-logo">
              <SchoolIcon sx={{ fontSize: 60 }} />
            </div>
            <h1 className="brand-title">Tham gia LMS Platform</h1>
            <p className="brand-subtitle">Khởi đầu hành trình học tập của bạn ngay hôm nay</p>
          </div>

          <div className="benefits-list">
            <div className="benefit-item">
              <div className="benefit-icon">
                <CheckCircleIcon sx={{ fontSize: 28 }} />
              </div>
              <div className="benefit-content">
                <h3>Học tập linh hoạt</h3>
                <p>Học mọi lúc, mọi nơi theo lịch trình của bạn</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">
                <TrendingUpIcon sx={{ fontSize: 28 }} />
              </div>
              <div className="benefit-content">
                <h3>Phát triển kỹ năng</h3>
                <p>Hơn 1000+ khóa học từ cơ bản đến nâng cao</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">
                <WorkspacePremiumIcon sx={{ fontSize: 28 }} />
              </div>
              <div className="benefit-content">
                <h3>Chứng chỉ uy tín</h3>
                <p>Nhận chứng chỉ được công nhận khi hoàn thành</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">
                <SecurityIcon sx={{ fontSize: 28 }} />
              </div>
              <div className="benefit-content">
                <h3>Bảo mật cao</h3>
                <p>Thông tin cá nhân được mã hóa và bảo vệ</p>
              </div>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">1000+</div>
              <div className="stat-label">Khóa học</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">50k+</div>
              <div className="stat-label">Học viên</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">500+</div>
              <div className="stat-label">Giảng viên</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Register Form */}
      <div className="register-right-section">
        <div className="register-form-container">
          {/* Back to home link */}
          <Link to="/" className="back-home-link">
            ← Về trang chủ
          </Link>

          <div className="register-form-header">
            <h2>Tạo tài khoản mới</h2>
            <p>Điền thông tin bên dưới để bắt đầu học tập</p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            {/* Name Input */}
            <div className="form-group">
              <label htmlFor="name">Họ và tên</label>
              <div className="input-wrapper">
                <PersonIcon className="input-icon" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nhập họ và tên đầy đủ"
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <EmailIcon className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Phone Input */}
            <div className="form-group">
              <label htmlFor="phone">Số điện thoại</label>
              <div className="input-wrapper">
                <PhoneIcon className="input-icon" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0123456789"
                  required
                  autoComplete="tel"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <div className="input-wrapper">
                <LockIcon className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Tạo mật khẩu mạnh"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <VisibilityOffIcon sx={{ fontSize: 20 }} />
                  ) : (
                    <VisibilityIcon sx={{ fontSize: 20 }} />
                  )}
                </button>
              </div>
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div
                      className="strength-fill"
                      style={{
                        width: `${(passwordStrength.level / 4) * 100}%`,
                        backgroundColor: passwordStrength.color
                      }}
                    ></div>
                  </div>
                  <span className="strength-text" style={{ color: passwordStrength.color }}>
                    {passwordStrength.text}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="form-group">
              <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
              <div className="input-wrapper">
                <LockIcon className="input-icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Nhập lại mật khẩu"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <VisibilityOffIcon sx={{ fontSize: 20 }} />
                  ) : (
                    <VisibilityIcon sx={{ fontSize: 20 }} />
                  )}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <span className="error-message">Mật khẩu không khớp</span>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  required
                />
                <span className="checkbox-custom"></span>
                <span>
                  Tôi đồng ý với{' '}
                  <Link to="/terms" className="terms-link">
                    Điều khoản sử dụng
                  </Link>{' '}
                  và{' '}
                  <Link to="/privacy" className="terms-link">
                    Chính sách bảo mật
                  </Link>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="submit-btn"
              disabled={loading || !formData.agreeToTerms}
            >
              {loading ? (
                <>
                  <span className="btn-spinner"></span>
                  <span>Đang tạo tài khoản...</span>
                </>
              ) : (
                'Tạo tài khoản'
              )}
            </button>

            {/* Divider */}
            <div className="divider">
              <span>hoặc đăng ký với</span>
            </div>

            {/* Social Login Buttons */}
            <div className="social-login-buttons">
              <button
                type="button"
                className="social-login-btn google-btn"
                disabled
              >
                <GoogleIcon />
                <span>Google</span>
              </button>
              <button
                type="button"
                className="social-login-btn facebook-btn"
                disabled
              >
                <FacebookIcon />
                <span>Facebook</span>
              </button>
            </div>

            {/* Login Link */}
            <div className="signup-prompt">
              <p>
                Đã có tài khoản?{' '}
                <Link to="/login" className="signup-link">
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </form>

          {/* Footer */}
          <div className="register-form-footer">
            <p>© 2024 LMS Platform. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;