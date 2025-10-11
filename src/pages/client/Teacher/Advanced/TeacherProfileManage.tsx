import React, { useState, useEffect, useRef } from 'react';
import { Container, Box, Breadcrumbs, Typography, Card, CardContent, CardActions, Grid, Button, TextField, Avatar, Stack, Chip, CircularProgress, Alert, Snackbar, LinearProgress } from '@mui/material';
import { toast } from 'react-toastify';
import userProfileService, { UserProfile, ProfileStats } from '../../../../services/client/user-profile.service';

const TeacherProfileManage: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [profileStats, setProfileStats] = useState<ProfileStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success'
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load profile data
    useEffect(() => {
        loadProfile();
        loadProfileStats();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const response = await userProfileService.getProfile();
            if (response.success) {
                setProfile(response.data);
                // Set skills input
                setSkillsInput((response.data.skills || []).join(', '));
            }
        } catch (error: any) {
            console.error('Error loading profile:', error);
            toast.error(error.response?.data?.message || 'Error loading profile');
        } finally {
            setLoading(false);
        }
    };

    const loadProfileStats = async () => {
        try {
            const response = await userProfileService.getProfileStats();
            if (response.success) {
                setProfileStats(response.data);
            }
        } catch (error) {
            console.error('Error loading profile stats:', error);
        }
    };

    const handleSaveProfile = async () => {
        if (!profile) return;

        try {
            setSaving(true);

            // Process skills from input
            const skillsArray = skillsInput.split(',').map(s => s.trim()).filter(Boolean);

            console.log('💾 Saving profile with skills:', skillsArray);

            const response = await userProfileService.updateProfile({
                name: profile.name,
                email: profile.email,
                phone: profile.phone,
                bio: profile.bio,
                country: profile.country,
                skills: skillsArray, // Use processed skills
                socialLinks: profile.socialLinks
            });

            console.log('✅ Profile saved, response:', response.data);

            if (response.success) {
                setProfile(response.data);
                setSkillsInput((response.data.skills || []).join(', '));
                toast.success('Cập nhật profile thành công!');
                loadProfileStats(); // Refresh stats
            }
        } catch (error: any) {
            console.error('Error saving profile:', error);
            toast.error(error.response?.data?.message || 'Lỗi khi lưu profile');
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file
        if (!file.type.startsWith('image/')) {
            toast.error('Vui lòng chọn file ảnh hợp lệ');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Kích thước file không được vượt quá 5MB');
            return;
        }

        try {
            setUploading(true);
            const response = await userProfileService.uploadAvatar(file);

            if (response.success) {
                setProfile(prev => prev ? { ...prev, avatar: response.data.avatar } : null);
                toast.success('Cập nhật avatar thành công!');
            }
        } catch (error: any) {
            console.error('Error uploading avatar:', error);
            toast.error(error.response?.data?.message || 'Lỗi khi upload avatar');
        } finally {
            setUploading(false);
        }
    };

    const [skillsInput, setSkillsInput] = useState('');

    const handleChange = (field: keyof UserProfile, value: any) => {
        setProfile(prev => prev ? { ...prev, [field]: value } : null);
    };

    const handleSkillsBlur = () => {
        // Only process skills when user leaves the input field
        const skillsArray = skillsInput.split(',').map(s => s.trim()).filter(Boolean);
        handleChange('skills', skillsArray);
    };

    if (loading) {
        return (
            <Container maxWidth="xl" sx={{ py: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
                    <CircularProgress size={60} sx={{ mb: 3 }} />
                    <Typography variant="h6" color="text.secondary">Đang tải dữ liệu...</Typography>
                </Box>
            </Container>
        );
    }

    if (!profile) {
        return (
            <Container maxWidth="xl" sx={{ py: 3 }}>
                <Alert severity="error">Không thể tải thông tin profile</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <Box sx={{ mb: 3 }}>
                <Breadcrumbs sx={{ mb: 1 }}>
                    <Typography color="text.primary">Teacher Dashboard</Typography>
                    <Typography color="text.secondary">Quản lý nâng cao</Typography>
                    <Typography color="text.secondary">Thông tin giáo viên</Typography>
                </Breadcrumbs>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>Quản lý thông tin giáo viên</Typography>
                <Typography color="text.secondary">Cập nhật hồ sơ, kỹ năng và liên hệ.</Typography>
            </Box>

            {/* Profile Stats */}
            {profileStats && (
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                    Hoàn thiện hồ sơ: {profileStats.profileCompletion}%
                                </Typography>
                                <LinearProgress variant="determinate" value={profileStats.profileCompletion} sx={{ mb: 2 }} />
                                <Grid container spacing={2}>
                                    <Grid item xs={6} md={3}>
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>{profileStats.coursesCreated}</Typography>
                                        <Typography variant="body2" color="text.secondary">Khóa học</Typography>
                                    </Grid>
                                    <Grid item xs={6} md={3}>
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>{profileStats.totalStudents}</Typography>
                                        <Typography variant="body2" color="text.secondary">Học viên</Typography>
                                    </Grid>
                                    <Grid item xs={6} md={3}>
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(profileStats.totalRevenue)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">Doanh thu</Typography>
                                    </Grid>
                                    <Grid item xs={6} md={3}>
                                        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                                {profileStats.activeSubscriptions}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">/</Typography>
                                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                                {profileStats.totalSubscriptions}
                                            </Typography>
                                        </Stack>
                                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                                            Gói đã đăng ký
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Stack alignItems="center" spacing={2}>
                                <Box sx={{ position: 'relative' }}>
                                    <Avatar src={profile.avatar || '/images/default-avatar.png'} sx={{ width: 96, height: 96 }} />
                                    {uploading && (
                                        <CircularProgress
                                            size={100}
                                            sx={{
                                                position: 'absolute',
                                                top: -2,
                                                left: -2,
                                            }}
                                        />
                                    )}
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>{profile.name}</Typography>
                                <Typography variant="body2" color="text.secondary">{profile.email}</Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ justifyContent: 'center' }}>
                                    {profile.skills && profile.skills.length > 0 ? (
                                        profile.skills.map((s, i) => (<Chip key={i} label={s} size="small" />))
                                    ) : (
                                        <Typography variant="caption" color="text.secondary">Chưa có kỹ năng</Typography>
                                    )}
                                </Stack>
                            </Stack>
                        </CardContent>
                        <CardActions>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleAvatarChange}
                            />
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                            >
                                {uploading ? 'Đang upload...' : 'Đổi ảnh đại diện'}
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Họ và tên"
                                        value={profile.name || ''}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        value={profile.email || ''}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        disabled
                                        helperText="Email không thể thay đổi"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Số điện thoại"
                                        value={profile.phone || ''}
                                        onChange={(e) => handleChange('phone', e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Quốc gia"
                                        value={profile.country || ''}
                                        onChange={(e) => handleChange('country', e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={4}
                                        label="Giới thiệu"
                                        value={profile.bio || ''}
                                        onChange={(e) => handleChange('bio', e.target.value)}
                                        placeholder="Giới thiệu về bản thân, kinh nghiệm giảng dạy..."
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Kỹ năng (phân tách bằng dấu phẩy)"
                                        value={skillsInput}
                                        onChange={(e) => setSkillsInput(e.target.value)}
                                        onBlur={handleSkillsBlur}
                                        placeholder="React, Node.js, MongoDB, ..."
                                        helperText="Nhập các kỹ năng của bạn, phân tách bằng dấu phẩy. Ấn ra ngoài để lưu."
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Website"
                                        value={profile.socialLinks?.website || ''}
                                        onChange={(e) => handleChange('socialLinks', { ...profile.socialLinks, website: e.target.value })}
                                        placeholder="https://your-website.com"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="LinkedIn"
                                        value={profile.socialLinks?.linkedin || ''}
                                        onChange={(e) => handleChange('socialLinks', { ...profile.socialLinks, linkedin: e.target.value })}
                                        placeholder="https://linkedin.com/in/yourprofile"
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    loadProfile(); // This will reset both profile and skillsInput
                                }}
                            >
                                Hủy
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleSaveProfile}
                                disabled={saving}
                            >
                                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default TeacherProfileManage;
