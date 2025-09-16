import React, { useState } from 'react';
import { Container, Box, Typography, Breadcrumbs, Card, CardContent, CardActions, Button, Stack, TextField, Avatar, Grid } from '@mui/material';

const AvatarTool: React.FC = () => {
    const [prompt, setPrompt] = useState('Giảng viên trẻ trung, phong cách hiện đại');
    const [preview, setPreview] = useState<string | null>(null);

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <Box sx={{ mb: 3 }}>
                <Breadcrumbs sx={{ mb: 1 }}>
                    <Typography color="text.primary">Teacher Dashboard</Typography>
                    <Typography color="text.secondary">AI Tools - Tạo Avatar</Typography>
                </Breadcrumbs>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>Tạo Avatar bằng AI</Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Mô tả</Typography>
                            <TextField fullWidth multiline rows={5} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Mô tả avatar mong muốn..." />
                        </CardContent>
                        <CardActions>
                            <Button variant="contained" onClick={() => setPreview('/images/default-avatar.png')}>Tạo thử</Button>
                            <Button variant="outlined">Tải xuống</Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Xem trước</Typography>
                            <Avatar src={preview || '/images/default-avatar.png'} sx={{ width: 160, height: 160, mb: 2 }} />
                            <Typography variant="body2" color="text.secondary">Ảnh đại diện sẽ xuất hiện ở đây sau khi tạo</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default AvatarTool;
