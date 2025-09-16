import React, { useState } from 'react';
import { Container, Box, Typography, Breadcrumbs, Card, CardContent, CardActions, Button, Grid, TextField, Stack, Chip } from '@mui/material';

const ModerationTool: React.FC = () => {
    const [text, setText] = useState('Nội dung bình luận...');
    const [result, setResult] = useState<string[]>([]);

    const analyze = () => {
        const flags: string[] = [];
        if (/bad|spam|toxic/i.test(text)) flags.push('Toxic/Spam');
        if (text.length > 200) flags.push('Quá dài');
        setResult(flags.length ? flags : ['Sạch']);
    };

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <Box sx={{ mb: 3 }}>
                <Breadcrumbs sx={{ mb: 1 }}>
                    <Typography color="text.primary">Teacher Dashboard</Typography>
                    <Typography color="text.secondary">AI Tools - Content Moderation</Typography>
                </Breadcrumbs>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>Content Moderation</Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <TextField fullWidth multiline rows={6} value={text} onChange={(e) => setText(e.target.value)} label="Nội dung cần kiểm tra" sx={{ mb: 2 }} />
                            <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
                                {result.map((r, i) => (<Chip key={i} label={r} color={r === 'Sạch' ? 'success' : 'warning'} />))}
                            </Stack>
                            <Typography variant="caption" color="text.secondary">Tối giản và chỉ mang tính demo logic</Typography>
                        </CardContent>
                        <CardActions>
                            <Button variant="contained" onClick={analyze}>Phân tích</Button>
                            <Button variant="outlined" onClick={() => { setText(''); setResult([]); }}>Xóa</Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ModerationTool;
