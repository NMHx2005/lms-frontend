import React, { useState } from 'react';
import {
  Box, Container, Typography, Breadcrumbs, Grid, Card, CardContent, CardActions, Button, TextField, InputAdornment,
  FormControl, InputLabel, Select, MenuItem, Chip, LinearProgress, Stack
} from '@mui/material';
import { Search as SearchIcon, RocketLaunch as RocketIcon, Lock as LockIcon } from '@mui/icons-material';

interface AITool { id: string; name: string; description: string; icon: string; category: 'content' | 'design' | 'analysis' | 'automation'; isAvailable: boolean; usageCount: number; maxUsage: number }

const AITools: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'content' | 'design' | 'analysis' | 'automation'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const aiTools: AITool[] = [
    { id: '1', name: 'AI Avatar Generator', description: 'Tạo avatar chuyên nghiệp cho khóa học với AI', icon: '👤', category: 'design', isAvailable: true, usageCount: 12, maxUsage: 50 },
    { id: '2', name: 'Thumbnail Designer', description: 'Thiết kế thumbnail hấp dẫn cho video và khóa học', icon: '🖼️', category: 'design', isAvailable: true, usageCount: 8, maxUsage: 30 },
    { id: '3', name: 'Content Moderation', description: 'Kiểm tra và lọc nội dung không phù hợp', icon: '🛡️', category: 'content', isAvailable: true, usageCount: 25, maxUsage: 100 },
    { id: '4', name: 'Auto Transcription', description: 'Chuyển đổi video thành văn bản tự động', icon: '📝', category: 'content', isAvailable: true, usageCount: 15, maxUsage: 40 },
    { id: '5', name: 'Student Analytics', description: 'Phân tích hành vi và hiệu suất học tập của học viên', icon: '📊', category: 'analysis', isAvailable: false, usageCount: 0, maxUsage: 0 },
    { id: '6', name: 'Smart Grading', description: 'Chấm điểm bài tập tự động với AI', icon: '✅', category: 'automation', isAvailable: false, usageCount: 0, maxUsage: 0 },
    { id: '7', name: 'Course Structure Optimizer', description: 'Tối ưu hóa cấu trúc khóa học dựa trên dữ liệu', icon: '🏗️', category: 'analysis', isAvailable: true, usageCount: 3, maxUsage: 20 },
    { id: '8', name: 'Auto Quiz Generator', description: 'Tạo câu hỏi trắc nghiệm từ nội dung khóa học', icon: '❓', category: 'automation', isAvailable: true, usageCount: 18, maxUsage: 60 }
  ];

  const filteredTools = aiTools.filter(tool => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryLabel = (category: string) => ({ content: 'Nội dung', design: 'Thiết kế', analysis: 'Phân tích', automation: 'Tự động hóa' } as any)[category] || category;
  const getUsagePercentage = (u: number, m: number) => m === 0 ? 0 : Math.min((u / m) * 100, 100);

  const handleToolClick = (tool: AITool) => {
    if (!tool.isAvailable) { alert('Công cụ này chưa có sẵn. Vui lòng nâng cấp gói để sử dụng!'); return; }
    alert(`Đang mở ${tool.name}...`);
  };

  const stats = {
    total: aiTools.length,
    available: aiTools.filter(t => t.isAvailable).length,
    totalUsage: aiTools.reduce((s, t) => s + t.usageCount, 0),
    usageRate: Math.round((aiTools.reduce((s, t) => s + t.usageCount, 0) / aiTools.reduce((s, t) => s + t.maxUsage, 0)) * 100)
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs sx={{ mb: 1 }}>
          <Typography color="text.primary">Teacher Dashboard</Typography>
          <Typography color="text.secondary">AI Tools</Typography>
        </Breadcrumbs>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>AI Tools</Typography>
        <Typography variant="body1" color="text.secondary">Khám phá và sử dụng các công cụ AI hỗ trợ giảng dạy</Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}><Card><CardContent sx={{ textAlign: 'center' }}><Typography variant="subtitle2" color="text.secondary">Tổng công cụ</Typography><Typography variant="h5" sx={{ fontWeight: 700 }}>{stats.total}</Typography></CardContent></Card></Grid>
        <Grid item xs={12} md={3}><Card><CardContent sx={{ textAlign: 'center' }}><Typography variant="subtitle2" color="text.secondary">Có sẵn</Typography><Typography variant="h5" sx={{ fontWeight: 700 }}>{stats.available}</Typography></CardContent></Card></Grid>
        <Grid item xs={12} md={3}><Card><CardContent sx={{ textAlign: 'center' }}><Typography variant="subtitle2" color="text.secondary">Lượt sử dụng</Typography><Typography variant="h5" sx={{ fontWeight: 700 }}>{stats.totalUsage}</Typography></CardContent></Card></Grid>
        <Grid item xs={12} md={3}><Card><CardContent sx={{ textAlign: 'center' }}><Typography variant="subtitle2" color="text.secondary">Tỷ lệ sử dụng</Typography><Typography variant="h5" sx={{ fontWeight: 700 }}>{isFinite(stats.usageRate) ? stats.usageRate : 0}%</Typography></CardContent></Card></Grid>
      </Grid>

      {/* Actions */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}><TextField fullWidth placeholder="Tìm kiếm công cụ AI..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }} /></Grid>
        <Grid item xs={12} md={3}><FormControl fullWidth><InputLabel>Danh mục</InputLabel><Select value={selectedCategory} label="Danh mục" onChange={(e) => setSelectedCategory(e.target.value as any)} MenuProps={{ disableScrollLock: true }}><MenuItem value="all">Tất cả</MenuItem><MenuItem value="content">Nội dung</MenuItem><MenuItem value="design">Thiết kế</MenuItem><MenuItem value="analysis">Phân tích</MenuItem><MenuItem value="automation">Tự động hóa</MenuItem></Select></FormControl></Grid>
        <Grid item xs={12} md={3}><Button fullWidth variant="contained" startIcon={<RocketIcon />}>Nâng cấp gói</Button></Grid>
      </Grid>

      {/* Tools Grid */}
      <Grid container spacing={3}>
        {filteredTools.length === 0 ? (
          <Grid item xs={12}><Card><CardContent><Typography align="center" color="text.secondary">Không có công cụ AI nào khớp với bộ lọc hiện tại.</Typography></CardContent></Card></Grid>
        ) : filteredTools.map((tool) => (
          <Grid item xs={12} md={6} lg={4} key={tool.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{tool.icon} {tool.name}</Typography>
                  <Chip size="small" label={getCategoryLabel(tool.category)} />
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{tool.description}</Typography>
                {tool.isAvailable ? (
                  <Box>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: .5 }}>
                      <Typography variant="caption" color="text.secondary">{tool.usageCount} / {tool.maxUsage} lượt sử dụng</Typography>
                      <Typography variant="caption" color="text.secondary">{Math.round(getUsagePercentage(tool.usageCount, tool.maxUsage))}%</Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={getUsagePercentage(tool.usageCount, tool.maxUsage)} sx={{ height: 8, borderRadius: 4 }} />
                  </Box>
                ) : (
                  <Chip icon={<LockIcon />} label="Cần nâng cấp" color="warning" />
                )}
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button variant="contained" disabled={!tool.isAvailable} onClick={() => handleToolClick(tool)} startIcon={<RocketIcon />}>Sử dụng ngay</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AITools;
