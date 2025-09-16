import React, { useState } from 'react';
import { Container, Box, Typography, Breadcrumbs, Card, CardContent, CardActions, Button, Grid, TextField } from '@mui/material';

const ThumbnailTool: React.FC = () => {
    const [title, setTitle] = useState('React Advanced Patterns');
    const [colors, setColors] = useState('#1976d2, #764ba2');

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <Box sx={{ mb: 3 }}>
                <Breadcrumbs sx={{ mb: 1 }}>
                    <Typography color="text.primary">Teacher Dashboard</Typography>
                    <Typography color="text.secondary">AI Tools - Tạo Thumbnail</Typography>
                </Breadcrumbs>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>Tạo Thumbnail bằng AI</Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Thông tin</Typography>
                            <TextField fullWidth label="Tiêu đề" value={title} onChange={(e) => setTitle(e.target.value)} sx={{ mb: 2 }} />
                            <TextField fullWidth label="Màu (gradient)" value={colors} onChange={(e) => setColors(e.target.value)} helperText="VD: #1976d2, #764ba2" />
                        </CardContent>
                        <CardActions>
                            <Button variant="contained">Tạo thumbnail</Button>
                            <Button variant="outlined">Tải xuống</Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Xem trước</Typography>
                            <Box sx={{ height: 200, borderRadius: 2, background: `linear-gradient(135deg, ${colors})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>{title}</Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ThumbnailTool;
