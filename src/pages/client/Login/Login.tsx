import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { login as loginThunk, getProfile } from '@/store/authSlice';
import { toast } from 'react-hot-toast';
import { api } from '@/services';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
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
              <button type="button" className="social-btn social-btn--google" onClick={handleGoogleLogin}>
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