import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock validation - in real app, this would be API call
      if (formData.email === 'admin@lms.com' && formData.password === 'admin123') {
        // Store admin token/session
        localStorage.setItem('adminToken', 'mock-admin-token');
        localStorage.setItem('adminUser', JSON.stringify({
          id: 'admin-1',
          email: formData.email,
          role: 'admin',
          name: 'System Administrator'
        }));
        
        navigate('/admin');
      } else {
        setError('Email hoặc mật khẩu không chính xác');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login__container">
        {/* Background Pattern */}
        <div className="admin-login__background">
          <div className="admin-login__pattern"></div>
        </div>

        {/* Login Form */}
        <div className="admin-login__form-container">
          <div className="admin-login__header">
            <div className="admin-login__logo">
              <span className="admin-login__logo-icon">🏛️</span>
              <h1 className="admin-login__title">Admin Panel</h1>
            </div>
            <p className="admin-login__subtitle">
              Đăng nhập để quản lý hệ thống LMS
            </p>
          </div>

          <form className="admin-login__form" onSubmit={handleSubmit}>
            {error && (
              <div className="admin-login__error">
                <span className="admin-login__error-icon">⚠️</span>
                {error}
              </div>
            )}

            <div className="admin-login__form-group">
              <label htmlFor="email" className="admin-login__label">
                Email
              </label>
              <div className="admin-login__input-wrapper">
                <span className="admin-login__input-icon">📧</span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="admin-login__input"
                  placeholder="admin@lms.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="admin-login__form-group">
              <label htmlFor="password" className="admin-login__label">
                Mật khẩu
              </label>
              <div className="admin-login__input-wrapper">
                <span className="admin-login__input-icon">🔒</span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="admin-login__input"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              className="admin-login__submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="admin-login__loading-spinner"></span>
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  <span className="admin-login__submit-icon">🚀</span>
                  Đăng nhập
                </>
              )}
            </button>
          </form>

          <div className="admin-login__demo-info">
            <div className="admin-login__demo-header">
              <span className="admin-login__demo-icon">💡</span>
              <span className="admin-login__demo-title">Demo Account</span>
            </div>
            <div className="admin-login__demo-credentials">
              <div className="admin-login__demo-item">
                <span className="admin-login__demo-label">Email:</span>
                <span className="admin-login__demo-value">admin@lms.com</span>
              </div>
              <div className="admin-login__demo-item">
                <span className="admin-login__demo-label">Password:</span>
                <span className="admin-login__demo-value">admin123</span>
              </div>
            </div>
          </div>

          <div className="admin-login__footer">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="admin-login__back-btn"
            >
              ← Quay về trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
