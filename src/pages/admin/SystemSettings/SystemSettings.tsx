import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { systemSettingsService, SystemSettingsData } from '../../../services/admin/system-settings.service';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
  Avatar,
  Chip
} from '@mui/material';
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
  CloudUpload as UploadIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const SystemSettings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalSettings, setOriginalSettings] = useState<SystemSettingsData | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (settings && originalSettings) {
      setHasChanges(JSON.stringify(settings) !== JSON.stringify(originalSettings));
    }
  }, [settings, originalSettings]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await systemSettingsService.getSettings();
      if (response.success) {
        // Ensure all nested objects exist with defaults
        const settingsData: SystemSettingsData = {
          ...response.data,
          contactInfo: response.data.contactInfo || {
            email: '',
            phone: '',
            address: '',
            city: '',
            country: '',
            zipCode: ''
          },
          socialMedia: response.data.socialMedia || {},
          seo: response.data.seo || {
            metaTitle: '',
            metaDescription: '',
            metaKeywords: [],
            ogImage: ''
          },
          features: response.data.features || {
            enableRegistration: true,
            enableCourseEnrollment: true,
            enablePayments: true,
            enableRefunds: true,
            enableRatings: true,
            enableCertificates: true,
            enableDiscussions: false,
            enableAI: false
          },
          email: response.data.email || {
            enabled: true,
            fromName: '',
            fromEmail: '',
            enableSSL: true
          },
          storage: response.data.storage || {
            provider: 'cloudinary',
            maxFileSize: 10485760,
            allowedFileTypes: []
          },
          payment: response.data.payment || {
            enabled: true,
            currency: 'VND',
            vnpay: { enabled: false },
            momo: { enabled: false }
          },
          maintenance: response.data.maintenance || {
            enabled: false,
            message: '',
            allowedIPs: []
          },
          security: response.data.security || {
            enableTwoFactor: false,
            sessionTimeout: 60,
            maxLoginAttempts: 5,
            lockoutDuration: 30,
            requireEmailVerification: true,
            passwordMinLength: 8,
            passwordRequireSpecialChar: true
          },
          performance: response.data.performance || {
            enableCaching: true,
            cacheExpiry: 3600,
            enableCompression: true,
            maxConcurrentUsers: 1000
          },
          moderation: response.data.moderation || {
            enableAutoModeration: false,
            requireCourseApproval: true,
            requireReviewApproval: false,
            profanityFilter: true
          },
          legal: response.data.legal || {
            termsOfServiceUrl: '/terms',
            privacyPolicyUrl: '/privacy',
            refundPolicyUrl: '/refund-policy',
            copyrightText: '© 2025 LMS Platform. All rights reserved.'
          }
        };

        setSettings(settingsData);
        setOriginalSettings(JSON.parse(JSON.stringify(settingsData)));
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Không thể tải cài đặt');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      const response = await systemSettingsService.updateSettings(settings);
      if (response.success) {
        setSettings(response.data);
        setOriginalSettings(JSON.parse(JSON.stringify(response.data)));
        setHasChanges(false);
        toast.success('Cập nhật cài đặt thành công!');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Không thể lưu cài đặt');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (originalSettings) {
      setSettings(JSON.parse(JSON.stringify(originalSettings)));
      setHasChanges(false);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh');
      return;
    }

    try {
      const loadingToast = toast.loading('Đang tải logo lên...');
      const response = await systemSettingsService.uploadLogo(file);
      toast.dismiss(loadingToast);

      console.log('Logo upload response:', response);

      if (response.success) {
        // Reload settings to get updated data
        await loadSettings();
        toast.success('Tải logo thành công!');
      }
    } catch (error: any) {
      console.error('Logo upload error:', error);
      toast.error(error?.response?.data?.error || 'Không thể tải logo');
    }

    // Reset input
    event.target.value = '';
  };

  const handleFaviconUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh');
      return;
    }

    try {
      const loadingToast = toast.loading('Đang tải favicon lên...');
      const response = await systemSettingsService.uploadFavicon(file);
      toast.dismiss(loadingToast);

      console.log('Favicon upload response:', response);

      if (response.success) {
        // Reload settings to get updated data
        await loadSettings();
        toast.success('Tải favicon thành công!');
      }
    } catch (error: any) {
      console.error('Favicon upload error:', error);
      toast.error(error?.response?.data?.error || 'Không thể tải favicon');
    }

    // Reset input
    event.target.value = '';
  };

  const updateField = (path: string, value: any) => {
    if (!settings) return;
    
    const keys = path.split('.');
    const newSettings = JSON.parse(JSON.stringify(settings));
    let current: any = newSettings;
    
    // Navigate and create nested objects if they don't exist
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    setSettings(newSettings);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress size={60} />
          <Typography variant="h6">Đang tải cài đặt...</Typography>
        </Stack>
      </Box>
    );
  }

  if (!settings) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">Không thể tải cài đặt hệ thống</Typography>
        <Button variant="contained" onClick={loadSettings} sx={{ mt: 2 }}>
          Thử lại
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h4" fontWeight={800}>Cài đặt hệ thống</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                Quản lý thông tin website, tính năng, và cấu hình hệ thống
              </Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              {hasChanges && (
                <>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={handleReset}
                    disabled={saving}
                    sx={{ color: 'white', borderColor: 'white' }}
                  >
                    Khôi phục
                  </Button>
                  <Chip label="Có thay đổi chưa lưu" color="warning" />
                </>
              )}
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={saving || !hasChanges}
                sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
              >
                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="🏢 Thông tin Website" />
          <Tab label="📞 Liên hệ" />
          <Tab label="📱 Mạng xã hội" />
          <Tab label="🔍 SEO" />
          <Tab label="⚙️ Tính năng" />
          <Tab label="✉️ Email" />
          <Tab label="💾 Lưu trữ" />
          <Tab label="💳 Thanh toán" />
          <Tab label="🔒 Bảo mật" />
          <Tab label="⚡ Hiệu suất" />
          <Tab label="🛡️ Kiểm duyệt" />
          <Tab label="⚖️ Pháp lý" />
        </Tabs>
      </Card>

      {/* Tab 0: Website Info */}
      {activeTab === 0 && settings && (
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Thông tin Website
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              {/* Logo Upload */}
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <Typography variant="subtitle2" fontWeight={600}>Logo Website</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={settings.siteLogo}
                      variant="rounded"
                      sx={{ width: 80, height: 80 }}
                    />
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<UploadIcon />}
                    >
                      Tải logo lên
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleLogoUpload}
                      />
                    </Button>
                  </Box>
                </Stack>
              </Grid>

              {/* Favicon Upload */}
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <Typography variant="subtitle2" fontWeight={600}>Favicon</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={settings.siteFavicon}
                      variant="square"
                      sx={{ width: 32, height: 32 }}
                    />
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<UploadIcon />}
                    >
                      Tải favicon lên
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleFaviconUpload}
                      />
                    </Button>
                  </Box>
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tên Website"
                  value={settings.siteName}
                  onChange={(e) => updateField('siteName', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tagline"
                  value={settings.siteTagline}
                  onChange={(e) => updateField('siteTagline', e.target.value)}
                  helperText="Slogan ngắn gọn của website"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Mô tả Website"
                  value={settings.siteDescription}
                  onChange={(e) => updateField('siteDescription', e.target.value)}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Tab 1: Contact Info */}
      {activeTab === 1 && settings && (
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Thông tin liên hệ
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email liên hệ"
                  type="email"
                  value={settings.contactInfo?.email || ''}
                  onChange={(e) => updateField('contactInfo.email', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  value={settings.contactInfo?.phone || ''}
                  onChange={(e) => updateField('contactInfo.phone', e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Địa chỉ"
                  value={settings.contactInfo?.address}
                  onChange={(e) => updateField('contactInfo.address', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Thành phố"
                  value={settings.contactInfo?.city}
                  onChange={(e) => updateField('contactInfo.city', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Quốc gia"
                  value={settings.contactInfo?.country}
                  onChange={(e) => updateField('contactInfo.country', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Mã ZIP"
                  value={settings.contactInfo?.zipCode}
                  onChange={(e) => updateField('contactInfo.zipCode', e.target.value)}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Tab 2: Social Media */}
      {activeTab === 2 && settings && (
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Mạng xã hội
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Facebook"
                  placeholder="https://facebook.com/yourpage"
                  value={settings.socialMedia?.facebook || ''}
                  onChange={(e) => updateField('socialMedia.facebook', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Twitter"
                  placeholder="https://twitter.com/yourhandle"
                  value={settings.socialMedia?.twitter || ''}
                  onChange={(e) => updateField('socialMedia.twitter', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Instagram"
                  placeholder="https://instagram.com/yourhandle"
                  value={settings.socialMedia?.instagram || ''}
                  onChange={(e) => updateField('socialMedia.instagram', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="LinkedIn"
                  placeholder="https://linkedin.com/company/yourcompany"
                  value={settings.socialMedia?.linkedin || ''}
                  onChange={(e) => updateField('socialMedia.linkedin', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="YouTube"
                  placeholder="https://youtube.com/c/yourchannel"
                  value={settings.socialMedia?.youtube || ''}
                  onChange={(e) => updateField('socialMedia.youtube', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="GitHub"
                  placeholder="https://github.com/yourorganization"
                  value={settings.socialMedia?.github || ''}
                  onChange={(e) => updateField('socialMedia.github', e.target.value)}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Tab 3: SEO */}
      {activeTab === 3 && settings && (
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Cài đặt SEO
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Meta Title"
                  value={settings.seo?.metaTitle}
                  onChange={(e) => updateField('seo.metaTitle', e.target.value)}
                  helperText="Tiêu đề hiển thị trên Google Search"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Meta Description"
                  value={settings.seo?.metaDescription}
                  onChange={(e) => updateField('seo.metaDescription', e.target.value)}
                  helperText="Mô tả hiển thị trên Google Search (max 160 chars)"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Meta Keywords"
                  value={settings.seo?.metaKeywords?.join(', ') || ''}
                  onChange={(e) => updateField('seo.metaKeywords', e.target.value.split(',').map(k => k.trim()))}
                  helperText="Từ khóa phân cách bằng dấu phẩy"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="OG Image URL"
                  value={settings.seo?.ogImage}
                  onChange={(e) => updateField('seo.ogImage', e.target.value)}
                  helperText="Ảnh hiển thị khi share trên social media"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Google Analytics ID"
                  placeholder="G-XXXXXXXXXX"
                  value={settings.seo?.googleAnalyticsId || ''}
                  onChange={(e) => updateField('seo.googleAnalyticsId', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Facebook Pixel ID"
                  placeholder="123456789012345"
                  value={settings.seo?.facebookPixelId || ''}
                  onChange={(e) => updateField('seo.facebookPixelId', e.target.value)}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Tab 4: Features */}
      {activeTab === 4 && settings && (
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Tính năng hệ thống
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.features?.enableRegistration}
                      onChange={(e) => updateField('features.enableRegistration', e.target.checked)}
                    />
                  }
                  label="Cho phép đăng ký"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.features?.enableCourseEnrollment}
                      onChange={(e) => updateField('features.enableCourseEnrollment', e.target.checked)}
                    />
                  }
                  label="Cho phép đăng ký khóa học"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.features?.enablePayments}
                      onChange={(e) => updateField('features.enablePayments', e.target.checked)}
                    />
                  }
                  label="Bật thanh toán"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.features?.enableRefunds}
                      onChange={(e) => updateField('features.enableRefunds', e.target.checked)}
                    />
                  }
                  label="Cho phép hoàn tiền"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.features?.enableRatings}
                      onChange={(e) => updateField('features.enableRatings', e.target.checked)}
                    />
                  }
                  label="Cho phép đánh giá"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.features?.enableCertificates}
                      onChange={(e) => updateField('features.enableCertificates', e.target.checked)}
                    />
                  }
                  label="Cấp chứng chỉ"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.features?.enableDiscussions}
                      onChange={(e) => updateField('features.enableDiscussions', e.target.checked)}
                    />
                  }
                  label="Diễn đàn thảo luận"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.features?.enableAI}
                      onChange={(e) => updateField('features.enableAI', e.target.checked)}
                    />
                  }
                  label="Tính năng AI"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Tab 5: Email */}
      {activeTab === 5 && settings && (
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Cài đặt Email
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.email?.enabled}
                      onChange={(e) => updateField('email.enabled', e.target.checked)}
                    />
                  }
                  label="Bật gửi email"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tên người gửi"
                  value={settings.email?.fromName}
                  onChange={(e) => updateField('email.fromName', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email người gửi"
                  type="email"
                  value={settings.email?.fromEmail}
                  onChange={(e) => updateField('email.fromEmail', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="SMTP Host"
                  value={settings.email?.smtpHost || ''}
                  onChange={(e) => updateField('email.smtpHost', e.target.value)}
                  placeholder="smtp.gmail.com"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="SMTP Port"
                  type="number"
                  value={settings.email?.smtpPort || ''}
                  onChange={(e) => updateField('email.smtpPort', parseInt(e.target.value))}
                  placeholder="587"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="SMTP User"
                  value={settings.email?.smtpUser || ''}
                  onChange={(e) => updateField('email.smtpUser', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="SMTP Password"
                  type="password"
                  value={settings.email?.smtpPassword || ''}
                  onChange={(e) => updateField('email.smtpPassword', e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.email?.enableSSL}
                      onChange={(e) => updateField('email.enableSSL', e.target.checked)}
                    />
                  }
                  label="Bật SSL/TLS"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Tab 6: Storage */}
      {activeTab === 6 && settings && (
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Cài đặt lưu trữ
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Provider"
                  value={settings.storage?.provider}
                  onChange={(e) => updateField('storage.provider', e.target.value)}
                  SelectProps={{ native: true }}
                >
                  <option value="cloudinary">Cloudinary</option>
                  <option value="aws-s3">AWS S3</option>
                  <option value="local">Local Storage</option>
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Kích thước file tối đa (MB)"
                  type="number"
                  value={(settings.storage?.maxFileSize / 1024 / 1024).toFixed(0)}
                  onChange={(e) => updateField('storage.maxFileSize', parseInt(e.target.value) * 1024 * 1024)}
                  helperText={`Hiện tại: ${(settings.storage?.maxFileSize / 1024 / 1024).toFixed(2)} MB`}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Loại file cho phép"
                  value={settings.storage?.allowedFileTypes?.join(', ') || ''}
                  onChange={(e) => updateField('storage.allowedFileTypes', e.target.value.split(',').map(t => t.trim()))}
                  helperText="Phân cách bằng dấu phẩy (VD: image/jpeg, image/png, application/pdf)"
                />
              </Grid>

              {settings.storage?.provider === 'cloudinary' && (
                <>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Cloudinary Cloud Name"
                      value={settings.storage?.cloudinaryCloudName || ''}
                      onChange={(e) => updateField('storage.cloudinaryCloudName', e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Cloudinary API Key"
                      value={settings.storage?.cloudinaryApiKey || ''}
                      onChange={(e) => updateField('storage.cloudinaryApiKey', e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Cloudinary API Secret"
                      type="password"
                      value={settings.storage?.cloudinaryApiSecret || ''}
                      onChange={(e) => updateField('storage.cloudinaryApiSecret', e.target.value)}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Tab 7: Payment */}
      {activeTab === 7 && settings && (
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Cài đặt thanh toán
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.payment?.enabled}
                      onChange={(e) => updateField('payment.enabled', e.target.checked)}
                    />
                  }
                  label="Bật chức năng thanh toán"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Đơn vị tiền tệ"
                  value={settings.payment?.currency}
                  onChange={(e) => updateField('payment.currency', e.target.value)}
                  helperText="VD: VND, USD, EUR"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
                  VNPay
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.payment?.vnpay.enabled}
                      onChange={(e) => updateField('payment.vnpay.enabled', e.target.checked)}
                    />
                  }
                  label="Bật VNPay"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="TMN Code"
                  value={settings.payment?.vnpay.tmnCode || ''}
                  onChange={(e) => updateField('payment.vnpay.tmnCode', e.target.value)}
                  disabled={!settings.payment?.vnpay.enabled}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Hash Secret"
                  type="password"
                  value={settings.payment?.vnpay.hashSecret || ''}
                  onChange={(e) => updateField('payment.vnpay.hashSecret', e.target.value)}
                  disabled={!settings.payment?.vnpay.enabled}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="VNPay URL"
                  value={settings.payment?.vnpay.url || ''}
                  onChange={(e) => updateField('payment.vnpay.url', e.target.value)}
                  disabled={!settings.payment?.vnpay.enabled}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Tab 8: Security */}
      {activeTab === 8 && settings && (
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Cài đặt bảo mật
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.security?.enableTwoFactor}
                      onChange={(e) => updateField('security.enableTwoFactor', e.target.checked)}
                    />
                  }
                  label="Bật xác thực 2 yếu tố"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.security?.requireEmailVerification}
                      onChange={(e) => updateField('security.requireEmailVerification', e.target.checked)}
                    />
                  }
                  label="Yêu cầu xác thực email"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Session Timeout (phút)"
                  type="number"
                  value={settings.security?.sessionTimeout}
                  onChange={(e) => updateField('security.sessionTimeout', parseInt(e.target.value))}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Max Login Attempts"
                  type="number"
                  value={settings.security?.maxLoginAttempts}
                  onChange={(e) => updateField('security.maxLoginAttempts', parseInt(e.target.value))}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Lockout Duration (phút)"
                  type="number"
                  value={settings.security?.lockoutDuration}
                  onChange={(e) => updateField('security.lockoutDuration', parseInt(e.target.value))}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Độ dài mật khẩu tối thiểu"
                  type="number"
                  value={settings.security?.passwordMinLength}
                  onChange={(e) => updateField('security.passwordMinLength', parseInt(e.target.value))}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.security?.passwordRequireSpecialChar}
                      onChange={(e) => updateField('security.passwordRequireSpecialChar', e.target.checked)}
                    />
                  }
                  label="Yêu cầu ký tự đặc biệt trong mật khẩu"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Tab 9: Performance */}
      {activeTab === 9 && settings && (
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Cài đặt hiệu suất
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.performance?.enableCaching}
                      onChange={(e) => updateField('performance.enableCaching', e.target.checked)}
                    />
                  }
                  label="Bật caching"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.performance?.enableCompression}
                      onChange={(e) => updateField('performance.enableCompression', e.target.checked)}
                    />
                  }
                  label="Bật nén dữ liệu"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Cache Expiry (giây)"
                  type="number"
                  value={settings.performance?.cacheExpiry}
                  onChange={(e) => updateField('performance.cacheExpiry', parseInt(e.target.value))}
                  disabled={!settings.performance?.enableCaching}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Max Concurrent Users"
                  type="number"
                  value={settings.performance?.maxConcurrentUsers}
                  onChange={(e) => updateField('performance.maxConcurrentUsers', parseInt(e.target.value))}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Tab 10: Moderation */}
      {activeTab === 10 && settings && (
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Kiểm duyệt nội dung
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.moderation?.enableAutoModeration}
                      onChange={(e) => updateField('moderation.enableAutoModeration', e.target.checked)}
                    />
                  }
                  label="Bật tự động kiểm duyệt"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.moderation?.requireCourseApproval}
                      onChange={(e) => updateField('moderation.requireCourseApproval', e.target.checked)}
                    />
                  }
                  label="Yêu cầu duyệt khóa học"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.moderation?.requireReviewApproval}
                      onChange={(e) => updateField('moderation.requireReviewApproval', e.target.checked)}
                    />
                  }
                  label="Yêu cầu duyệt đánh giá"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.moderation?.profanityFilter}
                      onChange={(e) => updateField('moderation.profanityFilter', e.target.checked)}
                    />
                  }
                  label="Bật lọc từ ngữ không phù hợp"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Tab 11: Legal */}
      {activeTab === 11 && settings && (
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Thông tin pháp lý
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Terms of Service URL"
                  value={settings.legal?.termsOfServiceUrl}
                  onChange={(e) => updateField('legal.termsOfServiceUrl', e.target.value)}
                  placeholder="/terms"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Privacy Policy URL"
                  value={settings.legal?.privacyPolicyUrl}
                  onChange={(e) => updateField('legal.privacyPolicyUrl', e.target.value)}
                  placeholder="/privacy"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Refund Policy URL"
                  value={settings.legal?.refundPolicyUrl}
                  onChange={(e) => updateField('legal.refundPolicyUrl', e.target.value)}
                  placeholder="/refund-policy"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Copyright Text"
                  value={settings.legal?.copyrightText}
                  onChange={(e) => updateField('legal.copyrightText', e.target.value)}
                  placeholder="© 2025 Your Company. All rights reserved."
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Floating Save Button */}
      {hasChanges && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000
          }}
        >
          <Card sx={{ boxShadow: 6 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <InfoIcon color="warning" />
                <Typography variant="body2">Có thay đổi chưa lưu</Typography>
                <Button variant="outlined" onClick={handleReset} disabled={saving}>
                  Hủy
                </Button>
                <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} disabled={saving}>
                  {saving ? 'Đang lưu...' : 'Lưu ngay'}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default SystemSettings;
