import React, { useState, useEffect } from 'react';
// import './SystemSettings.css';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Button,
  Chip,
  CircularProgress,
  Tabs,
  Tab,
  Paper
} from '@mui/material';

interface SystemConfig {
  general: { siteName: string; siteDescription: string; contactEmail: string; supportPhone: string; timezone: string; language: string; maintenanceMode: boolean; };
  security: { passwordMinLength: number; requireSpecialChars: boolean; sessionTimeout: number; maxLoginAttempts: number; twoFactorAuth: boolean; sslRequired: boolean; };
  email: { smtpHost: string; smtpPort: number; smtpUser: string; smtpPassword: string; fromEmail: string; fromName: string; enableNotifications: boolean; };
  payment: { stripeEnabled: boolean; stripePublicKey: string; stripeSecretKey: string; paypalEnabled: boolean; paypalClientId: string; paypalSecret: string; currency: string; taxRate: number; };
  storage: { maxFileSize: number; allowedFileTypes: string[]; cloudStorage: boolean; s3Bucket: string; s3Region: string; s3AccessKey: string; s3SecretKey: string; };
}

const SystemSettings: React.FC = () => {
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [hasChanges, setHasChanges] = useState(false);
  const [originalConfig, setOriginalConfig] = useState<SystemConfig | null>(null);

  useEffect(() => {
    setTimeout(() => {
      const mockConfig: SystemConfig = {
        general: { siteName: 'LMS Learning Platform', siteDescription: 'Nền tảng học tập trực tuyến hàng đầu Việt Nam', contactEmail: 'admin@lms.com', supportPhone: '+84 123 456 789', timezone: 'Asia/Ho_Chi_Minh', language: 'vi', maintenanceMode: false },
        security: { passwordMinLength: 8, requireSpecialChars: true, sessionTimeout: 30, maxLoginAttempts: 5, twoFactorAuth: true, sslRequired: true },
        email: { smtpHost: 'smtp.gmail.com', smtpPort: 587, smtpUser: 'noreply@lms.com', smtpPassword: '********', fromEmail: 'noreply@lms.com', fromName: 'LMS System', enableNotifications: true },
        payment: { stripeEnabled: true, stripePublicKey: 'pk_test_...', stripeSecretKey: 'sk_test_...', paypalEnabled: false, paypalClientId: '', paypalSecret: '', currency: 'VND', taxRate: 10 },
        storage: { maxFileSize: 100, allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'mp4', 'mp3'], cloudStorage: true, s3Bucket: 'lms-storage', s3Region: 'ap-southeast-1', s3AccessKey: 'AKIA...', s3SecretKey: '********' }
      };
      setConfig(mockConfig);
      setOriginalConfig(mockConfig);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (config && originalConfig) setHasChanges(JSON.stringify(config) !== JSON.stringify(originalConfig));
  }, [config, originalConfig]);

  const handleInputChange = (section: keyof SystemConfig, field: string, value: any) => {
    if (!config) return;
    setConfig(prev => ({ ...prev!, [section]: { ...prev![section], [field]: value } }));
  };

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setOriginalConfig(config);
    setHasChanges(false);
    setSaving(false);
    alert('Cài đặt đã được lưu thành công!');
  };

  const handleReset = () => { if (originalConfig) { setConfig(originalConfig); setHasChanges(false); } };
  const handleTestEmail = async () => { setSaving(true); await new Promise(r => setTimeout(r, 2000)); setSaving(false); alert('Email test đã được gửi thành công!'); };
  const handleTestStorage = async () => { setSaving(true); await new Promise(r => setTimeout(r, 2000)); setSaving(false); alert('Kết nối storage thành công!'); };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">Đang tải cài đặt hệ thống...</Typography>
        </Stack>
      </Box>
    );
  }

  if (!config) return <div>Không thể tải cài đặt hệ thống</div>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Header */}
      <Card sx={{ background: 'linear-gradient(135deg, #5b8def 0%, #8b5cf6 100%)', color: 'white', borderRadius: 2 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={2}>
            <Box>
              <Typography variant="h5" fontWeight={800}>Cài đặt hệ thống</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Quản lý cấu hình toàn bộ hệ thống LMS</Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              {hasChanges && (<Button variant="outlined" onClick={handleReset} disabled={saving}>Khôi phục</Button>)}
              <Button variant="contained" onClick={handleSave} disabled={saving || !hasChanges}>{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Paper variant="outlined">
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} variant="scrollable" scrollButtons allowScrollButtonsMobile>
          <Tab value="general" label="Chung" />
          <Tab value="security" label="Bảo mật" />
          <Tab value="email" label="Email" />
          <Tab value="payment" label="Thanh toán" />
          <Tab value="storage" label="Lưu trữ" />
        </Tabs>
      </Paper>

      {/* General */}
      {activeTab === 'general' && (
        <Card><CardContent>
          <Typography variant="subtitle1" fontWeight={700} mb={2}>Cài đặt chung</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}><TextField fullWidth label="Tên website" value={config.general.siteName} onChange={(e) => handleInputChange('general', 'siteName', e.target.value)} /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth label="Email liên hệ" type="email" value={config.general.contactEmail} onChange={(e) => handleInputChange('general', 'contactEmail', e.target.value)} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Mô tả website" multiline minRows={3} value={config.general.siteDescription} onChange={(e) => handleInputChange('general', 'siteDescription', e.target.value)} /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth label="Số điện thoại hỗ trợ" value={config.general.supportPhone} onChange={(e) => handleInputChange('general', 'supportPhone', e.target.value)} /></Grid>
            <Grid item xs={12} md={3}><FormControl fullWidth><InputLabel>Múi giờ</InputLabel><Select label="Múi giờ" value={config.general.timezone} onChange={(e) => handleInputChange('general', 'timezone', e.target.value)} MenuProps={{ disableScrollLock: true }}><MenuItem value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7)</MenuItem><MenuItem value="UTC">UTC (GMT+0)</MenuItem><MenuItem value="America/New_York">America/New_York (GMT-5)</MenuItem></Select></FormControl></Grid>
            <Grid item xs={12} md={3}><FormControl fullWidth><InputLabel>Ngôn ngữ</InputLabel><Select label="Ngôn ngữ" value={config.general.language} onChange={(e) => handleInputChange('general', 'language', e.target.value)} MenuProps={{ disableScrollLock: true }}><MenuItem value="vi">Tiếng Việt</MenuItem><MenuItem value="en">English</MenuItem><MenuItem value="ja">日本語</MenuItem></Select></FormControl></Grid>
            <Grid item xs={12}><FormControlLabel control={<Switch checked={config.general.maintenanceMode} onChange={(e) => handleInputChange('general', 'maintenanceMode', e.target.checked)} />} label="Chế độ bảo trì" /></Grid>
          </Grid>
        </CardContent></Card>
      )}

      {/* Security */}
      {activeTab === 'security' && (
        <Card><CardContent>
          <Typography variant="subtitle1" fontWeight={700} mb={2}>Cài đặt bảo mật</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}><TextField fullWidth type="number" label="Độ dài mật khẩu tối thiểu" inputProps={{ min: 6, max: 20 }} value={config.security.passwordMinLength} onChange={(e) => handleInputChange('security', 'passwordMinLength', parseInt(e.target.value))} /></Grid>
            <Grid item xs={12} md={4}><TextField fullWidth type="number" label="Timeout phiên (phút)" inputProps={{ min: 5, max: 480 }} value={config.security.sessionTimeout} onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))} /></Grid>
            <Grid item xs={12} md={4}><TextField fullWidth type="number" label="Số lần đăng nhập tối đa" inputProps={{ min: 3, max: 10 }} value={config.security.maxLoginAttempts} onChange={(e) => handleInputChange('security', 'maxLoginAttempts', parseInt(e.target.value))} /></Grid>
            <Grid item xs={12}><FormControlLabel control={<Switch checked={config.security.requireSpecialChars} onChange={(e) => handleInputChange('security', 'requireSpecialChars', e.target.checked)} />} label="Yêu cầu ký tự đặc biệt" /></Grid>
            <Grid item xs={12}><FormControlLabel control={<Switch checked={config.security.twoFactorAuth} onChange={(e) => handleInputChange('security', 'twoFactorAuth', e.target.checked)} />} label="Xác thực 2 yếu tố" /></Grid>
            <Grid item xs={12}><FormControlLabel control={<Switch checked={config.security.sslRequired} onChange={(e) => handleInputChange('security', 'sslRequired', e.target.checked)} />} label="Yêu cầu SSL" /></Grid>
          </Grid>
        </CardContent></Card>
      )}

      {/* Email */}
      {activeTab === 'email' && (
        <Card><CardContent>
          <Typography variant="subtitle1" fontWeight={700} mb={2}>Cài đặt Email</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}><TextField fullWidth label="SMTP Host" value={config.email.smtpHost} onChange={(e) => handleInputChange('email', 'smtpHost', e.target.value)} /></Grid>
            <Grid item xs={12} md={3}><TextField fullWidth type="number" label="SMTP Port" value={config.email.smtpPort} onChange={(e) => handleInputChange('email', 'smtpPort', parseInt(e.target.value))} /></Grid>
            <Grid item xs={12} md={3}><TextField fullWidth label="SMTP Username" value={config.email.smtpUser} onChange={(e) => handleInputChange('email', 'smtpUser', e.target.value)} /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth type="password" label="SMTP Password" value={config.email.smtpPassword} onChange={(e) => handleInputChange('email', 'smtpPassword', e.target.value)} /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth label="Email gửi từ" type="email" value={config.email.fromEmail} onChange={(e) => handleInputChange('email', 'fromEmail', e.target.value)} /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth label="Tên người gửi" value={config.email.fromName} onChange={(e) => handleInputChange('email', 'fromName', e.target.value)} /></Grid>
            <Grid item xs={12}><FormControlLabel control={<Switch checked={config.email.enableNotifications} onChange={(e) => handleInputChange('email', 'enableNotifications', e.target.checked)} />} label="Bật thông báo email" /></Grid>
            <Grid item xs={12}><Button variant="outlined" onClick={handleTestEmail} disabled={saving}>Test Email</Button></Grid>
          </Grid>
        </CardContent></Card>
      )}

      {/* Payment */}
      {activeTab === 'payment' && (
        <Card><CardContent>
          <Typography variant="subtitle1" fontWeight={700} mb={2}>Cài đặt thanh toán</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}><FormControlLabel control={<Switch checked={config.payment.stripeEnabled} onChange={(e) => handleInputChange('payment', 'stripeEnabled', e.target.checked)} />} label="Bật Stripe" /></Grid>
            {config.payment.stripeEnabled && (
              <>
                <Grid item xs={12} md={6}><TextField fullWidth label="Stripe Public Key" value={config.payment.stripePublicKey} onChange={(e) => handleInputChange('payment', 'stripePublicKey', e.target.value)} /></Grid>
                <Grid item xs={12} md={6}><TextField fullWidth type="password" label="Stripe Secret Key" value={config.payment.stripeSecretKey} onChange={(e) => handleInputChange('payment', 'stripeSecretKey', e.target.value)} /></Grid>
              </>
            )}
            <Grid item xs={12}><FormControlLabel control={<Switch checked={config.payment.paypalEnabled} onChange={(e) => handleInputChange('payment', 'paypalEnabled', e.target.checked)} />} label="Bật PayPal" /></Grid>
            {config.payment.paypalEnabled && (
              <>
                <Grid item xs={12} md={6}><TextField fullWidth label="PayPal Client ID" value={config.payment.paypalClientId} onChange={(e) => handleInputChange('payment', 'paypalClientId', e.target.value)} /></Grid>
                <Grid item xs={12} md={6}><TextField fullWidth type="password" label="PayPal Secret" value={config.payment.paypalSecret} onChange={(e) => handleInputChange('payment', 'paypalSecret', e.target.value)} /></Grid>
              </>
            )}
            <Grid item xs={12} md={6}><FormControl fullWidth><InputLabel>Tiền tệ</InputLabel><Select label="Tiền tệ" value={config.payment.currency} onChange={(e) => handleInputChange('payment', 'currency', e.target.value)} MenuProps={{ disableScrollLock: true }}><MenuItem value="VND">VND</MenuItem><MenuItem value="USD">USD</MenuItem><MenuItem value="EUR">EUR</MenuItem></Select></FormControl></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth type="number" label="Thuế suất (%)" inputProps={{ min: 0, max: 50, step: 0.1 }} value={config.payment.taxRate} onChange={(e) => handleInputChange('payment', 'taxRate', parseFloat(e.target.value))} /></Grid>
          </Grid>
        </CardContent></Card>
      )}

      {/* Storage */}
      {activeTab === 'storage' && (
        <Card><CardContent>
          <Typography variant="subtitle1" fontWeight={700} mb={2}>Cài đặt lưu trữ</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}><TextField fullWidth type="number" label="Kích thước file tối đa (MB)" inputProps={{ min: 1, max: 1000 }} value={config.storage.maxFileSize} onChange={(e) => handleInputChange('storage', 'maxFileSize', parseInt(e.target.value))} /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth label="Loại file được phép" helperText="Phân cách bằng dấu phẩy" value={config.storage.allowedFileTypes.join(', ')} onChange={(e) => handleInputChange('storage', 'allowedFileTypes', e.target.value.split(',').map(t => t.trim()))} /></Grid>
            <Grid item xs={12}><FormControlLabel control={<Switch checked={config.storage.cloudStorage} onChange={(e) => handleInputChange('storage', 'cloudStorage', e.target.checked)} />} label="Sử dụng cloud storage (AWS S3)" /></Grid>
            {config.storage.cloudStorage && (
              <>
                <Grid item xs={12} md={6}><TextField fullWidth label="S3 Bucket" value={config.storage.s3Bucket} onChange={(e) => handleInputChange('storage', 's3Bucket', e.target.value)} /></Grid>
                <Grid item xs={12} md={6}><FormControl fullWidth><InputLabel>S3 Region</InputLabel><Select label="S3 Region" value={config.storage.s3Region} onChange={(e) => handleInputChange('storage', 's3Region', e.target.value)} MenuProps={{ disableScrollLock: true }}><MenuItem value="ap-southeast-1">ap-southeast-1</MenuItem><MenuItem value="us-east-1">us-east-1</MenuItem><MenuItem value="eu-west-1">eu-west-1</MenuItem></Select></FormControl></Grid>
                <Grid item xs={12} md={6}><TextField fullWidth label="S3 Access Key" value={config.storage.s3AccessKey} onChange={(e) => handleInputChange('storage', 's3AccessKey', e.target.value)} /></Grid>
                <Grid item xs={12} md={6}><TextField fullWidth type="password" label="S3 Secret Key" value={config.storage.s3SecretKey} onChange={(e) => handleInputChange('storage', 's3SecretKey', e.target.value)} /></Grid>
                <Grid item xs={12}><Button variant="outlined" onClick={handleTestStorage} disabled={saving}>Test Storage</Button></Grid>
              </>
            )}
          </Grid>
        </CardContent></Card>
      )}

      {/* Save Status */}
      {hasChanges && (
        <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={1} alignItems="center"><Chip label="Có thay đổi chưa lưu" color="warning" variant="outlined" /></Stack>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={handleReset} disabled={saving}>Khôi phục</Button>
            <Button variant="contained" onClick={handleSave} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</Button>
          </Stack>
        </Paper>
      )}
    </Box>
  );
};

export default SystemSettings;
