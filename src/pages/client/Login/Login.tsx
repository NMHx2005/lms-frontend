import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { login as loginThunk, getProfile } from '@/store/authSlice';
import { toast } from 'react-hot-toast';
import { api } from '@/services';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import SchoolIcon from '@mui/icons-material/School';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupsIcon from '@mui/icons-material/Groups';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Parse token from OAuth redirect
  useEffect(() => {
    const search = window.location.search;
    if (!search) return;
    const params = new URLSearchParams(search);
    const token = params.get('token');
    const refreshToken = params.get('refresh_token');
    const oauthError = params.get('error');

    if (oauthError) {
      const msg = params.get('message') || 'Google OAuth thất bại';
      toast.error(msg);
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    if (token) {
      localStorage.setItem('accessToken', token);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      window.history.replaceState({}, document.title, window.location.pathname);
      dispatch<any>(getProfile());
      navigate('/');
    }
  }, [dispatch, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Vui lòng nhập email và mật khẩu');
      return;
    }

    const payload = {
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    };

    try {
      setLoading(true);
      console.log('[LOGIN] request payload:', { email: payload.email, passwordLength: payload.password.length });

      const res: any = await dispatch<any>(loginThunk(payload)).unwrap();
      console.log('[LOGIN] success response:', res);

      await dispatch<any>(getProfile());
      navigate('/');
    } catch (err: any) {
      const status = err?.response?.status || err?.status;
      const data = err?.response?.data || err?.data;
      console.error('[LOGIN] error:', { status, data, message: err?.message });

      const msg = data?.error?.message || data?.message || 'Đăng nhập thất bại';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Only logic: start Google OAuth
  const handleGoogleLogin = async () => {
    if (googleBusy) return;
    try {
      setGoogleBusy(true);
      // Optional: check config is enabled
      try {
        const cfg = await api.get('/auth/google/config');
        console.log('[GOOGLE-OAUTH] config:', cfg?.data?.data);
        const enabled = !!cfg?.data?.data?.googleOAuth?.enabled;
        if (!enabled) {
          toast.error('Google OAuth chưa được cấu hình');
          return;
        }
      } catch (_) {
        // If config check fails, still attempt start; backend will validate again
      }
      const resp = await api.get('/auth/google/start', { params: { returnUrl: window.location.origin } });
      const authUrl = resp?.data?.data?.authUrl;
      if (!authUrl) {
        toast.error('Không lấy được URL đăng nhập Google');
        return;
      }
      window.location.href = authUrl;
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || 'Không thể bắt đầu đăng nhập Google';
      toast.error(String(msg));
    } finally {
      setGoogleBusy(false);
    }
  };

  return (
    <div className="login-container">
      {/* Background Decorations */}
      <div className="login-bg-decoration">
        <div className="decoration-circle circle-1"></div>
        <div className="decoration-circle circle-2"></div>
        <div className="decoration-circle circle-3"></div>
      </div>

      {/* Left Section - Branding */}
      <div className="login-left-section">
        <div className="login-branding">
          <div className="brand-logo-wrapper">
            <div className="brand-logo">
              <SchoolIcon sx={{ fontSize: 60 }} />
            </div>
            <h1 className="brand-title">LMS Platform</h1>
            <p className="brand-subtitle">Nền tảng học tập trực tuyến hàng đầu</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <AutoStoriesIcon sx={{ fontSize: 32 }} />
              </div>
              <h3>1000+ Khóa học</h3>
              <p>Đa dạng lĩnh vực chuyên môn</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <GroupsIcon sx={{ fontSize: 32 }} />
              </div>
              <h3>50k+ Học viên</h3>
              <p>Cộng đồng học tập sôi động</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <EmojiEventsIcon sx={{ fontSize: 32 }} />
              </div>
              <h3>Chứng chỉ uy tín</h3>
              <p>Được công nhận rộng rãi</p>
            </div>
          </div>

          <div className="testimonial">
            <p className="testimonial-text">
              "LMS đã thay đổi cách tôi học tập. Giao diện thân thiện, nội dung chất lượng!"
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">NT</div>
              <div className="author-info">
                <strong>Nguyễn Thị A</strong>
                <span>Học viên xuất sắc 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="login-right-section">
        <div className="login-form-container">
          {/* Back to home link */}
          <Link to="/" className="back-home-link">
            ← Về trang chủ
          </Link>

          <div className="login-form-header">
            <h2>Chào mừng trở lại!</h2>
            <p>Đăng nhập để tiếp tục hành trình học tập của bạn</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
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
                  placeholder="Nhập mật khẩu của bạn"
                  required
                  autoComplete="current-password"
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
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span className="checkbox-custom"></span>
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <Link to="/forgot-password" className="forgot-password-link">
                Quên mật khẩu?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="btn-spinner"></span>
                  <span>Đang đăng nhập...</span>
                </>
              ) : (
                'Đăng nhập'
              )}
            </button>

            {/* Divider */}
            <div className="divider">
              <span>hoặc tiếp tục với</span>
            </div>

            {/* Social Login Buttons */}
            <div className="social-login-buttons">
              <button
                type="button"
                className="social-login-btn google-btn"
                onClick={handleGoogleLogin}
                disabled={googleBusy}
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

            {/* Sign Up Link */}
            <div className="signup-prompt">
              <p>
                Chưa có tài khoản?{' '}
                <Link to="/register" className="signup-link">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </form>

          {/* Footer */}
          <div className="login-form-footer">
            <p>© 2024 LMS Platform. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;