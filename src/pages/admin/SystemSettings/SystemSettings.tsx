import React, { useState, useEffect } from 'react';
import './SystemSettings.css';

interface SystemConfig {
  general: {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    supportPhone: string;
    timezone: string;
    language: string;
    maintenanceMode: boolean;
  };
  security: {
    passwordMinLength: number;
    requireSpecialChars: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    twoFactorAuth: boolean;
    sslRequired: boolean;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
    enableNotifications: boolean;
  };
  payment: {
    stripeEnabled: boolean;
    stripePublicKey: string;
    stripeSecretKey: string;
    paypalEnabled: boolean;
    paypalClientId: string;
    paypalSecret: string;
    currency: string;
    taxRate: number;
  };
  storage: {
    maxFileSize: number;
    allowedFileTypes: string[];
    cloudStorage: boolean;
    s3Bucket: string;
    s3Region: string;
    s3AccessKey: string;
    s3SecretKey: string;
  };
}

const SystemSettings: React.FC = () => {
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [hasChanges, setHasChanges] = useState(false);
  const [originalConfig, setOriginalConfig] = useState<SystemConfig | null>(null);

  useEffect(() => {
    // Simulate API call for system configuration
    setTimeout(() => {
      const mockConfig: SystemConfig = {
        general: {
          siteName: 'LMS Learning Platform',
          siteDescription: 'Nền tảng học tập trực tuyến hàng đầu Việt Nam',
          contactEmail: 'admin@lms.com',
          supportPhone: '+84 123 456 789',
          timezone: 'Asia/Ho_Chi_Minh',
          language: 'vi',
          maintenanceMode: false
        },
        security: {
          passwordMinLength: 8,
          requireSpecialChars: true,
          sessionTimeout: 30,
          maxLoginAttempts: 5,
          twoFactorAuth: true,
          sslRequired: true
        },
        email: {
          smtpHost: 'smtp.gmail.com',
          smtpPort: 587,
          smtpUser: 'noreply@lms.com',
          smtpPassword: '********',
          fromEmail: 'noreply@lms.com',
          fromName: 'LMS System',
          enableNotifications: true
        },
        payment: {
          stripeEnabled: true,
          stripePublicKey: 'pk_test_...',
          stripeSecretKey: 'sk_test_...',
          paypalEnabled: false,
          paypalClientId: '',
          paypalSecret: '',
          currency: 'VND',
          taxRate: 10
        },
        storage: {
          maxFileSize: 100,
          allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'mp4', 'mp3'],
          cloudStorage: true,
          s3Bucket: 'lms-storage',
          s3Region: 'ap-southeast-1',
          s3AccessKey: 'AKIA...',
          s3SecretKey: '********'
        }
      };

      setConfig(mockConfig);
      setOriginalConfig(mockConfig);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Check for changes
    if (config && originalConfig) {
      const changed = JSON.stringify(config) !== JSON.stringify(originalConfig);
      setHasChanges(changed);
    }
  }, [config, originalConfig]);

  const handleInputChange = (section: keyof SystemConfig, field: string, value: any) => {
    if (!config) return;

    setConfig(prev => ({
      ...prev!,
      [section]: {
        ...prev![section],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    if (!config) return;

    setSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setOriginalConfig(config);
    setHasChanges(false);
    setSaving(false);
    
    // Show success message
    alert('Cài đặt đã được lưu thành công!');
  };

  const handleReset = () => {
    if (originalConfig) {
      setConfig(originalConfig);
      setHasChanges(false);
    }
  };

  const handleTestEmail = async () => {
    setSaving(true);
    
    // Simulate email test
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSaving(false);
    alert('Email test đã được gửi thành công!');
  };

  const handleTestStorage = async () => {
    setSaving(true);
    
    // Simulate storage test
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSaving(false);
    alert('Kết nối storage thành công!');
  };

  if (loading) {
    return (
      <div className="system-settings-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải cài đặt hệ thống...</p>
      </div>
    );
  }

  if (!config) {
    return <div>Không thể tải cài đặt hệ thống</div>;
  }

  return (
    <div className="system-settings">
      {/* Header */}
      <div className="settings-header">
        <div className="header-content">
          <h1>⚙️ Cài đặt hệ thống</h1>
          <p>Quản lý cấu hình toàn bộ hệ thống LMS</p>
        </div>
        <div className="header-actions">
          {hasChanges && (
            <button 
              className="btn btn-secondary"
              onClick={handleReset}
              disabled={saving}
            >
              🔄 Khôi phục
            </button>
          )}
          <button 
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving || !hasChanges}
          >
            {saving ? '💾 Đang lưu...' : '💾 Lưu thay đổi'}
          </button>
        </div>
      </div>

      {/* Settings Tabs */}
      <div className="settings-tabs">
        <button 
          className={`tab-button ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          🌐 Chung
        </button>
        <button 
          className={`tab-button ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          🔒 Bảo mật
        </button>
        <button 
          className={`tab-button ${activeTab === 'email' ? 'active' : ''}`}
          onClick={() => setActiveTab('email')}
        >
          📧 Email
        </button>
        <button 
          className={`tab-button ${activeTab === 'payment' ? 'active' : ''}`}
          onClick={() => setActiveTab('payment')}
        >
          💳 Thanh toán
        </button>
        <button 
          className={`tab-button ${activeTab === 'storage' ? 'active' : ''}`}
          onClick={() => setActiveTab('storage')}
        >
          💾 Lưu trữ
        </button>
      </div>

      {/* Settings Content */}
      <div className="settings-content">
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="settings-section">
            <h2>🌐 Cài đặt chung</h2>
            <div className="settings-grid">
              <div className="setting-group">
                <label>Tên website:</label>
                <input
                  type="text"
                  value={config.general.siteName}
                  onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
                  placeholder="Nhập tên website"
                />
              </div>
              <div className="setting-group">
                <label>Mô tả website:</label>
                <textarea
                  value={config.general.siteDescription}
                  onChange={(e) => handleInputChange('general', 'siteDescription', e.target.value)}
                  placeholder="Nhập mô tả website"
                  rows={3}
                />
              </div>
              <div className="setting-group">
                <label>Email liên hệ:</label>
                <input
                  type="email"
                  value={config.general.contactEmail}
                  onChange={(e) => handleInputChange('general', 'contactEmail', e.target.value)}
                  placeholder="admin@example.com"
                />
              </div>
              <div className="setting-group">
                <label>Số điện thoại hỗ trợ:</label>
                <input
                  type="tel"
                  value={config.general.supportPhone}
                  onChange={(e) => handleInputChange('general', 'supportPhone', e.target.value)}
                  placeholder="+84 123 456 789"
                />
              </div>
              <div className="setting-group">
                <label>Múi giờ:</label>
                <select
                  value={config.general.timezone}
                  onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
                >
                  <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7)</option>
                  <option value="UTC">UTC (GMT+0)</option>
                  <option value="America/New_York">America/New_York (GMT-5)</option>
                </select>
              </div>
              <div className="setting-group">
                <label>Ngôn ngữ:</label>
                <select
                  value={config.general.language}
                  onChange={(e) => handleInputChange('general', 'language', e.target.value)}
                >
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
                  <option value="ja">日本語</option>
                </select>
              </div>
              <div className="setting-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={config.general.maintenanceMode}
                    onChange={(e) => handleInputChange('general', 'maintenanceMode', e.target.checked)}
                  />
                  Chế độ bảo trì
                </label>
                <small>Khi bật, chỉ admin mới có thể truy cập website</small>
              </div>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="settings-section">
            <h2>🔒 Cài đặt bảo mật</h2>
            <div className="settings-grid">
              <div className="setting-group">
                <label>Độ dài mật khẩu tối thiểu:</label>
                <input
                  type="number"
                  min="6"
                  max="20"
                  value={config.security.passwordMinLength}
                  onChange={(e) => handleInputChange('security', 'passwordMinLength', parseInt(e.target.value))}
                />
              </div>
              <div className="setting-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={config.security.requireSpecialChars}
                    onChange={(e) => handleInputChange('security', 'requireSpecialChars', e.target.checked)}
                  />
                  Yêu cầu ký tự đặc biệt
                </label>
              </div>
              <div className="setting-group">
                <label>Thời gian timeout phiên (phút):</label>
                <input
                  type="number"
                  min="5"
                  max="480"
                  value={config.security.sessionTimeout}
                  onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
                />
              </div>
              <div className="setting-group">
                <label>Số lần đăng nhập tối đa:</label>
                <input
                  type="number"
                  min="3"
                  max="10"
                  value={config.security.maxLoginAttempts}
                  onChange={(e) => handleInputChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                />
              </div>
              <div className="setting-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={config.security.twoFactorAuth}
                    onChange={(e) => handleInputChange('security', 'twoFactorAuth', e.target.checked)}
                  />
                  Xác thực 2 yếu tố
                </label>
              </div>
              <div className="setting-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={config.security.sslRequired}
                    onChange={(e) => handleInputChange('security', 'sslRequired', e.target.checked)}
                  />
                  Yêu cầu SSL
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Email Settings */}
        {activeTab === 'email' && (
          <div className="settings-section">
            <h2>📧 Cài đặt Email</h2>
            <div className="settings-grid">
              <div className="setting-group">
                <label>SMTP Host:</label>
                <input
                  type="text"
                  value={config.email.smtpHost}
                  onChange={(e) => handleInputChange('email', 'smtpHost', e.target.value)}
                  placeholder="smtp.gmail.com"
                />
              </div>
              <div className="setting-group">
                <label>SMTP Port:</label>
                <input
                  type="number"
                  value={config.email.smtpPort}
                  onChange={(e) => handleInputChange('email', 'smtpPort', parseInt(e.target.value))}
                  placeholder="587"
                />
              </div>
              <div className="setting-group">
                <label>SMTP Username:</label>
                <input
                  type="text"
                  value={config.email.smtpUser}
                  onChange={(e) => handleInputChange('email', 'smtpUser', e.target.value)}
                  placeholder="user@example.com"
                />
              </div>
              <div className="setting-group">
                <label>SMTP Password:</label>
                <input
                  type="password"
                  value={config.email.smtpPassword}
                  onChange={(e) => handleInputChange('email', 'smtpPassword', e.target.value)}
                  placeholder="********"
                />
              </div>
              <div className="setting-group">
                <label>Email gửi từ:</label>
                <input
                  type="email"
                  value={config.email.fromEmail}
                  onChange={(e) => handleInputChange('email', 'fromEmail', e.target.value)}
                  placeholder="noreply@example.com"
                />
              </div>
              <div className="setting-group">
                <label>Tên người gửi:</label>
                <input
                  type="text"
                  value={config.email.fromName}
                  onChange={(e) => handleInputChange('email', 'fromName', e.target.value)}
                  placeholder="LMS System"
                />
              </div>
              <div className="setting-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={config.email.enableNotifications}
                    onChange={(e) => handleInputChange('email', 'enableNotifications', e.target.checked)}
                  />
                  Bật thông báo email
                </label>
              </div>
              <div className="setting-group">
                <button 
                  className="btn btn-secondary"
                  onClick={handleTestEmail}
                  disabled={saving}
                >
                  📧 Test Email
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Settings */}
        {activeTab === 'payment' && (
          <div className="settings-section">
            <h2>💳 Cài đặt thanh toán</h2>
            <div className="settings-grid">
              <div className="setting-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={config.payment.stripeEnabled}
                    onChange={(e) => handleInputChange('payment', 'stripeEnabled', e.target.checked)}
                  />
                  Bật Stripe
                </label>
              </div>
              {config.payment.stripeEnabled && (
                <>
                  <div className="setting-group">
                    <label>Stripe Public Key:</label>
                    <input
                      type="text"
                      value={config.payment.stripePublicKey}
                      onChange={(e) => handleInputChange('payment', 'stripePublicKey', e.target.value)}
                      placeholder="pk_test_..."
                    />
                  </div>
                  <div className="setting-group">
                    <label>Stripe Secret Key:</label>
                    <input
                      type="password"
                      value={config.payment.stripeSecretKey}
                      onChange={(e) => handleInputChange('payment', 'stripeSecretKey', e.target.value)}
                      placeholder="sk_test_..."
                    />
                  </div>
                </>
              )}
              <div className="setting-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={config.payment.paypalEnabled}
                    onChange={(e) => handleInputChange('payment', 'paypalEnabled', e.target.checked)}
                  />
                  Bật PayPal
                </label>
              </div>
              {config.payment.paypalEnabled && (
                <>
                  <div className="setting-group">
                    <label>PayPal Client ID:</label>
                    <input
                      type="text"
                      value={config.payment.paypalClientId}
                      onChange={(e) => handleInputChange('payment', 'paypalClientId', e.target.value)}
                      placeholder="Client ID..."
                    />
                  </div>
                  <div className="setting-group">
                    <label>PayPal Secret:</label>
                    <input
                      type="password"
                      value={config.payment.paypalSecret}
                      onChange={(e) => handleInputChange('payment', 'paypalSecret', e.target.value)}
                      placeholder="Secret..."
                    />
                  </div>
                </>
              )}
              <div className="setting-group">
                <label>Tiền tệ:</label>
                <select
                  value={config.payment.currency}
                  onChange={(e) => handleInputChange('payment', 'currency', e.target.value)}
                >
                  <option value="VND">VND (Việt Nam Đồng)</option>
                  <option value="USD">USD (US Dollar)</option>
                  <option value="EUR">EUR (Euro)</option>
                </select>
              </div>
              <div className="setting-group">
                <label>Thuế suất (%):</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  step="0.1"
                  value={config.payment.taxRate}
                  onChange={(e) => handleInputChange('payment', 'taxRate', parseFloat(e.target.value))}
                />
              </div>
            </div>
          </div>
        )}

        {/* Storage Settings */}
        {activeTab === 'storage' && (
          <div className="settings-section">
            <h2>💾 Cài đặt lưu trữ</h2>
            <div className="settings-grid">
              <div className="setting-group">
                <label>Kích thước file tối đa (MB):</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={config.storage.maxFileSize}
                  onChange={(e) => handleInputChange('storage', 'maxFileSize', parseInt(e.target.value))}
                />
              </div>
              <div className="setting-group">
                <label>Loại file được phép:</label>
                <input
                  type="text"
                  value={config.storage.allowedFileTypes.join(', ')}
                  onChange={(e) => handleInputChange('storage', 'allowedFileTypes', e.target.value.split(',').map(t => t.trim()))}
                  placeholder="jpg, png, pdf, doc..."
                />
                <small>Phân cách bằng dấu phẩy</small>
              </div>
              <div className="setting-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={config.storage.cloudStorage}
                    onChange={(e) => handleInputChange('storage', 'cloudStorage', e.target.checked)}
                  />
                  Sử dụng cloud storage (AWS S3)
                </label>
              </div>
              {config.storage.cloudStorage && (
                <>
                  <div className="setting-group">
                    <label>S3 Bucket:</label>
                    <input
                      type="text"
                      value={config.storage.s3Bucket}
                      onChange={(e) => handleInputChange('storage', 's3Bucket', e.target.value)}
                      placeholder="bucket-name"
                    />
                  </div>
                  <div className="setting-group">
                    <label>S3 Region:</label>
                    <select
                      value={config.storage.s3Region}
                      onChange={(e) => handleInputChange('storage', 's3Region', e.target.value)}
                    >
                      <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
                      <option value="us-east-1">US East (N. Virginia)</option>
                      <option value="eu-west-1">Europe (Ireland)</option>
                    </select>
                  </div>
                  <div className="setting-group">
                    <label>S3 Access Key:</label>
                    <input
                      type="text"
                      value={config.storage.s3AccessKey}
                      onChange={(e) => handleInputChange('storage', 's3AccessKey', e.target.value)}
                      placeholder="AKIA..."
                    />
                  </div>
                  <div className="setting-group">
                    <label>S3 Secret Key:</label>
                    <input
                      type="password"
                      value={config.storage.s3SecretKey}
                      onChange={(e) => handleInputChange('storage', 's3SecretKey', e.target.value)}
                      placeholder="********"
                    />
                  </div>
                  <div className="setting-group">
                    <button 
                      className="btn btn-secondary"
                      onClick={handleTestStorage}
                      disabled={saving}
                    >
                      💾 Test Storage
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Save Status */}
      {hasChanges && (
        <div className="save-status">
          <div className="status-message">
            <span>⚠️</span>
            <span>Có thay đổi chưa được lưu</span>
          </div>
          <div className="status-actions">
            <button 
              className="btn btn-secondary"
              onClick={handleReset}
              disabled={saving}
            >
              🔄 Khôi phục
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? '💾 Đang lưu...' : '💾 Lưu thay đổi'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemSettings;
