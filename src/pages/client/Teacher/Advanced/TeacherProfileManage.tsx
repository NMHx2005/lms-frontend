import React, { useState } from 'react';
import { Container, Box, Breadcrumbs, Typography, Card, CardContent, CardActions, Grid, Button, TextField, Avatar, Stack, Chip } from '@mui/material';

const TeacherProfileManage: React.FC = () => {
    const [profile, setProfile] = useState({
        name: 'Hieu Doan',
        email: 'teacher@example.com',
        phone: '',
        bio: 'Giảng viên với 5 năm kinh nghiệm trong lĩnh vực lập trình web.',
        website: '',
        location: 'Hà Nội',
        skills: ['React', 'Node.js', 'MongoDB'] as string[],
        avatar: '/images/default-avatar.png'
    });

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

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Stack alignItems="center" spacing={2}>
                                <Avatar src={profile.avatar} sx={{ width: 96, height: 96 }} />
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>{profile.name}</Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                    {profile.skills.map((s, i) => (<Chip key={i} label={s} size="small" />))}
                                </Stack>
                            </Stack>
                        </CardContent>
                        <CardActions>
                            <Button fullWidth variant="outlined">Đổi ảnh đại diện</Button>
                        </CardActions>
                    </Card>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}><TextField fullWidth label="Họ và tên" value={profile.name} onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))} /></Grid>
                                <Grid item xs={12} md={6}><TextField fullWidth label="Email" value={profile.email} onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))} /></Grid>
                                <Grid item xs={12} md={6}><TextField fullWidth label="Số điện thoại" value={profile.phone} onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))} /></Grid>
                                <Grid item xs={12} md={6}><TextField fullWidth label="Website" value={profile.website} onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))} /></Grid>
                                <Grid item xs={12}><TextField fullWidth multiline rows={4} label="Giới thiệu" value={profile.bio} onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))} /></Grid>
                                <Grid item xs={12} md={6}><TextField fullWidth label="Địa điểm" value={profile.location} onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))} /></Grid>
                                <Grid item xs={12}><TextField fullWidth label="Kỹ năng (phân tách bằng dấu phẩy)" value={profile.skills.join(', ')} onChange={(e) => setProfile(prev => ({ ...prev, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))} /></Grid>
                            </Grid>
                        </CardContent>
                        <CardActions>
                            <Button variant="outlined">Hủy</Button>
                            <Button variant="contained">Lưu thay đổi</Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default TeacherProfileManage;
