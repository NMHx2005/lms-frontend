import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Button,
  Tabs,
  Tab,
  TextField,
  Avatar,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  CircularProgress,
  Grid,
  IconButton,
  SelectChangeEvent
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  CameraAlt as CameraIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Lock as LockIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon
} from '@mui/icons-material';
import { clientAuthService } from '../../../../services/client/auth.service';
import { sharedUploadService } from '../../../../services/shared/upload.service';
import toast from 'react-hot-toast';
import { sharedAuthService } from '@/services/shared/auth.service';

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  role: string;
  joinDate: string;
  language: string;
  timezone: string;
  bio: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  country?: string;
  isEmailVerified?: boolean;
  subscriptionPlan?: string;
  isActive?: boolean;
}

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // User profile state
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: '',
    fullName: '',
    email: '',
    phone: '',
    avatar: '/images/default-avatar.png',
    role: 'Student',
    joinDate: '',
    language: 'Tiếng Việt',
    timezone: 'Asia/Ho_Chi_Minh',
    bio: ''
  });

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    bio: '',
    language: 'Tiếng Việt',
    timezone: 'Asia/Ho_Chi_Minh'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Load user profile on component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true);
        const response = await sharedAuthService.getProfile();

        if (response.success && response.data) {
          const userData = response.data.user || response.data;
          const profile: UserProfile = {
            id: userData._id || userData.id,
            fullName: userData.fullName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
            email: userData.email,
            phone: userData.phone || '',
            avatar: userData.avatar || '/images/default-avatar.png',
            role: userData.role || 'Student',
            joinDate: userData.createdAt || userData.joinDate,
            language: userData.preferences?.language || 'Tiếng Việt',
            timezone: userData.preferences?.timezone || 'Asia/Ho_Chi_Minh',
            bio: userData.bio || '',
            firstName: userData.firstName,
            lastName: userData.lastName,
            address: userData.address,
            country: userData.country,
            isEmailVerified: userData.isEmailVerified,
            subscriptionPlan: userData.subscriptionPlan,
            isActive: userData.isActive
          };

          setUserProfile(profile);
          setFormData({
            fullName: profile.fullName,
            email: profile.email,
            phone: profile.phone,
            bio: profile.bio,
            language: profile.language,
            timezone: profile.timezone
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Không thể tải thông tin hồ sơ');
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);

      // Prepare data for API
      const updateData = {
        fullName: formData.fullName,
        phone: formData.phone,
        bio: formData.bio,
        preferences: {
          language: formData.language,
          timezone: formData.timezone
        }
      };

      const response = await clientAuthService.updateProfile(updateData);

      if (response.success) {
        // Update local state
        setUserProfile(prev => ({
          ...prev,
          fullName: formData.fullName,
          phone: formData.phone,
          bio: formData.bio,
          language: formData.language,
          timezone: formData.timezone
        }));

        setIsEditing(false);
        toast.success('Cập nhật thông tin thành công!');
      } else {
        toast.error(response.message || 'Có lỗi xảy ra khi cập nhật thông tin');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Không thể cập nhật thông tin hồ sơ');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu mới không khớp!');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }

    try {
      setSaving(true);

      const response = await clientAuthService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (response.success) {
        setIsChangingPassword(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        toast.success('Đổi mật khẩu thành công!');
      } else {
        toast.error(response.message || 'Có lỗi xảy ra khi đổi mật khẩu');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Không thể đổi mật khẩu');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh hợp lệ');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước file không được vượt quá 5MB');
      return;
    }

    try {
      setSaving(true);
      const response = await sharedUploadService.uploadProfilePicture(file);

      if (response.success) {
        const newAvatarUrl = response.data.url;
        setUserProfile(prev => ({ ...prev, avatar: newAvatarUrl }));
        toast.success('Cập nhật ảnh đại diện thành công!');
      } else {
        toast.error('Không thể cập nhật ảnh đại diện');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Không thể cập nhật ảnh đại diện');
    } finally {
      setSaving(false);
    }
  };

  const handleFeatureNotAvailable = (featureName: string) => {
    toast(`Tính năng "${featureName}" đang được phát triển`, {
      icon: '🚧',
      duration: 3000
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Chưa có thông tin';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Đang tải thông tin hồ sơ...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Hồ sơ cá nhân
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quản lý thông tin cá nhân và cài đặt tài khoản
        </Typography>
      </Box>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            variant="fullWidth"
          >
            <Tab
              label="Thông tin cá nhân"
              value="profile"
              icon={<PersonIcon />}
              iconPosition="start"
            />
            <Tab
              label="Bảo mật"
              value="security"
              icon={<SecurityIcon />}
              iconPosition="start"
            />
            <Tab
              label="Cài đặt"
              value="preferences"
              icon={<SettingsIcon />}
              iconPosition="start"
            />
          </Tabs>
        </Box>
      </Card>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <Card>
          <CardContent>
            {/* Profile Header */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="flex-start" sx={{ mb: 4 }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={userProfile.avatar}
                  alt="User Avatar"
                  sx={{ width: 120, height: 120, border: 4, borderColor: 'divider' }}
                />
                <IconButton
                  component="label"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' },
                    width: 36,
                    height: 36
                  }}
                  disabled={saving}
                >
                  <CameraIcon />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    style={{ display: 'none' }}
                    disabled={saving}
                  />
                </IconButton>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" gutterBottom>
                  {userProfile.fullName}
                </Typography>
                <Chip
                  label={userProfile.role}
                  color="primary"
                  sx={{ mb: 1, textTransform: 'capitalize' }}
                />
                <Typography variant="body2" color="text.secondary">
                  Tham gia từ {formatDate(userProfile.joinDate)}
                </Typography>
              </Box>

              <Box>
                {!isEditing ? (
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => setIsEditing(true)}
                  >
                    Chỉnh sửa
                  </Button>
                ) : (
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSaveProfile}
                      disabled={saving}
                    >
                      {saving ? 'Đang lưu...' : 'Lưu'}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          fullName: userProfile.fullName,
                          email: userProfile.email,
                          phone: userProfile.phone,
                          bio: userProfile.bio,
                          language: userProfile.language,
                          timezone: userProfile.timezone
                        });
                      }}
                    >
                      Hủy
                    </Button>
                  </Stack>
                )}
              </Box>
            </Stack>

            <Divider sx={{ mb: 4 }} />

            {/* Profile Form */}
            <Stack spacing={4}>
              {/* Basic Info Section */}
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Thông tin cơ bản
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Họ và tên"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Số điện thoại"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Bio Section */}
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Giới thiệu
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Mô tả về bản thân"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Viết một vài dòng giới thiệu về bản thân..."
                  />
                </CardContent>
              </Card>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <Stack spacing={3}>
          {/* Password Change Section */}
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <LockIcon color="primary" />
                <Box>
                  <Typography variant="h6">Đổi mật khẩu</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Đảm bảo mật khẩu của bạn an toàn và khó đoán
                  </Typography>
                </Box>
              </Stack>

              {!isChangingPassword ? (
                <Button
                  variant="contained"
                  startIcon={<LockIcon />}
                  onClick={() => setIsChangingPassword(true)}
                >
                  Đổi mật khẩu
                </Button>
              ) : (
                <Stack spacing={3} sx={{ maxWidth: 400 }}>
                  <TextField
                    fullWidth
                    label="Mật khẩu hiện tại"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                  <TextField
                    fullWidth
                    label="Mật khẩu mới"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Nhập mật khẩu mới"
                  />
                  <TextField
                    fullWidth
                    label="Xác nhận mật khẩu mới"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Nhập lại mật khẩu mới"
                  />
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleChangePassword}
                      disabled={saving}
                    >
                      {saving ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      }}
                    >
                      Hủy
                    </Button>
                  </Stack>
                </Stack>
              )}
            </CardContent>
          </Card>

          {/* Security Options Section */}
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <SecurityIcon color="primary" />
                <Box>
                  <Typography variant="h6">Bảo mật tài khoản</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cài đặt bảo mật nâng cao cho tài khoản của bạn
                  </Typography>
                </Box>
              </Stack>

              <Stack spacing={2}>
                <Card variant="outlined">
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="subtitle1" gutterBottom>
                          Xác thực 2 yếu tố
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Bảo vệ tài khoản bằng mã xác thực từ ứng dụng
                        </Typography>
                      </Box>
                      <Switch
                        onChange={() => handleFeatureNotAvailable('Xác thực 2 yếu tố')}
                      />
                    </Stack>
                  </CardContent>
                </Card>

                <Card variant="outlined">
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="subtitle1" gutterBottom>
                          Thông báo đăng nhập
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Nhận email khi có đăng nhập mới
                        </Typography>
                      </Box>
                      <Switch
                        defaultChecked
                        onChange={() => handleFeatureNotAvailable('Thông báo đăng nhập')}
                      />
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <Stack spacing={3}>
          {/* Language & Region Section */}
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <LanguageIcon color="primary" />
                <Box>
                  <Typography variant="h6">Cài đặt ngôn ngữ & khu vực</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tùy chỉnh ngôn ngữ và múi giờ cho tài khoản của bạn
                  </Typography>
                </Box>
              </Stack>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Ngôn ngữ</InputLabel>
                    <Select
                      name="language"
                      value={formData.language}
                      label="Ngôn ngữ"
                      onChange={handleSelectChange}
                      MenuProps={{ disableScrollLock: true }}
                    >
                      <MenuItem value="Tiếng Việt">Tiếng Việt</MenuItem>
                      <MenuItem value="English">English</MenuItem>
                      <MenuItem value="日本語">日本語</MenuItem>
                      <MenuItem value="한국어">한국어</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Múi giờ</InputLabel>
                    <Select
                      name="timezone"
                      value={formData.timezone}
                      label="Múi giờ"
                      onChange={handleSelectChange}
                      MenuProps={{ disableScrollLock: true }}
                    >
                      <MenuItem value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7)</MenuItem>
                      <MenuItem value="Asia/Tokyo">Asia/Tokyo (GMT+9)</MenuItem>
                      <MenuItem value="Asia/Seoul">Asia/Seoul (GMT+9)</MenuItem>
                      <MenuItem value="UTC">UTC (GMT+0)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Notification Settings Section */}
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <NotificationsIcon color="primary" />
                <Box>
                  <Typography variant="h6">Cài đặt thông báo</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quản lý các loại thông báo bạn muốn nhận
                  </Typography>
                </Box>
              </Stack>

              <Stack spacing={2}>
                <Card variant="outlined">
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="subtitle1" gutterBottom>
                          Thông báo email
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Nhận thông báo qua email
                        </Typography>
                      </Box>
                      <Switch
                        defaultChecked
                        onChange={() => handleFeatureNotAvailable('Thông báo email')}
                      />
                    </Stack>
                  </CardContent>
                </Card>

                <Card variant="outlined">
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="subtitle1" gutterBottom>
                          Thông báo push
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Nhận thông báo trên trình duyệt
                        </Typography>
                      </Box>
                      <Switch
                        defaultChecked
                        onChange={() => handleFeatureNotAvailable('Thông báo push')}
                      />
                    </Stack>
                  </CardContent>
                </Card>

                <Card variant="outlined">
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="subtitle1" gutterBottom>
                          Thông báo khóa học
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Thông báo về khóa học mới và cập nhật
                        </Typography>
                      </Box>
                      <Switch
                        defaultChecked
                        onChange={() => handleFeatureNotAvailable('Thông báo khóa học')}
                      />
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      )}
    </Container>
  );
};

export default Profile;
