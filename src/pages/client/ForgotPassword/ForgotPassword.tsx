import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from "@/components/Layout/client/Header";
import Footer from "@/components/Layout/client/Footer";
import TopBar from '@/components/Client/Home/TopBar/TopBar';
import "./ForgotPassword.css";

interface ForgotPasswordForm {
  email: string;
}

interface FormErrors {
  email?: string;
  general?: string;
}

const ForgotPassword = () => {
  const [formData, setFormData] = useState<ForgotPasswordForm>({
    email: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
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
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // TODO: Implement actual password reset logic
      // await dispatch(sendPasswordResetEmail(formData.email)).unwrap();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSubmitted(true);
    } catch (error: any) {
      setErrors({
        general: error?.message || 'Gửi email thất bại. Vui lòng thử lại.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = () => {
    setIsSubmitted(false);
    setFormData({ email: '' });
  };

  if (isSubmitted) {
    return (
      <>
        <TopBar />
        <Header />
        
        <main className="auth-page">
          <div className="auth-container">
            <div className="auth-card">
              <div className="auth-success">
                <div className="auth-success-icon">
                  <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22,4 12,14.01 9,11.01"/>
                  </svg>
                </div>
                
                <div className="auth-header">
                  <h1 className="auth-title">Kiểm tra email của bạn</h1>
                  <p className="auth-subtitle">
                    Chúng tôi đã gửi link đặt lại mật khẩu đến <strong>{formData.email}</strong>
                  </p>
                </div>

                <div className="auth-info">
                  <p>
                    Nếu bạn không nhận được email trong vòng vài phút, hãy kiểm tra thư mục spam hoặc{' '}
                    <button 
                      type="button" 
                      className="auth-link-button"
                      onClick={handleResendEmail}
                    >
                      gửi lại email
                    </button>
                  </p>
                </div>

                <div className="auth-actions">
                  <Link to="/login" className="auth-btn auth-btn--secondary">
                    Quay lại đăng nhập
                  </Link>
                </div>

                <div className="auth-footer">
                  <p>
                    Vẫn gặp vấn đề?{' '}
                    <Link to="/contact" className="auth-link">
                      Liên hệ hỗ trợ
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </>
    );
  }

  return (
    <>
      <TopBar />
      <Header />
      
      <main className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h1 className="auth-title">Quên mật khẩu?</h1>
              <p className="auth-subtitle">
                Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu.
              </p>
            </div>

            {errors.general && (
              <div className="auth-error">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form" autoComplete="off">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <div className="form-input-wrapper">
                  <svg className="form-input-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m6.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                  </svg>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="Nhập email của bạn"
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <span className="form-error">{errors.email}</span>
                )}
              </div>

              <button
                type="submit"
                className="auth-btn auth-btn--primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="auth-btn-spinner" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    Đang gửi email...
                  </>
                ) : (
                  'Gửi link đặt lại mật khẩu'
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span>hoặc</span>
            </div>

            <div className="auth-actions">
              <Link to="/login" className="auth-btn auth-btn--secondary">
                Quay lại đăng nhập
              </Link>
            </div>

            <div className="auth-footer">
              <p>
                Chưa có tài khoản?{' '}
                <Link to="/register" className="auth-link">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default ForgotPassword;
