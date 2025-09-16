import React, { useState, useEffect } from 'react';
// import './CategoryManagement.css';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  CircularProgress,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';

interface Category { _id: string; name: string; slug: string; description: string; parentId?: string; parentName?: string; level: number; order: number; isActive: boolean; courseCount: number; seoTitle?: string; seoDescription?: string; seoKeywords?: string[]; imageUrl?: string; createdAt: string; updatedAt: string; }

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', level: 'all', status: 'all', parent: 'all' });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'tree'>('list');

  useEffect(() => {
    setTimeout(() => {
      const mockCategories: Category[] = [
        { _id: 'cat-1', name: 'Lập trình', slug: 'lap-trinh', description: 'Các khóa học về lập trình và phát triển phần mềm', level: 0, order: 1, isActive: true, courseCount: 45, seoTitle: 'Khóa học lập trình online - Học code từ cơ bản đến nâng cao', seoDescription: 'Học lập trình online với các khóa học chất lượng cao từ các chuyên gia hàng đầu', seoKeywords: ['lập trình', 'coding', 'programming', 'phát triển phần mềm'], imageUrl: '/images/categories/programming.jpg', createdAt: '2024-01-01', updatedAt: '2024-01-15' },
        { _id: 'cat-2', name: 'Frontend Development', slug: 'frontend-development', description: 'Phát triển giao diện người dùng với HTML, CSS, JavaScript', parentId: 'cat-1', parentName: 'Lập trình', level: 1, order: 1, isActive: true, courseCount: 18, seoTitle: 'Khóa học Frontend Development - HTML, CSS, JavaScript', seoDescription: 'Học phát triển giao diện web với các công nghệ frontend hiện đại', seoKeywords: ['frontend', 'html', 'css', 'javascript', 'web development'], imageUrl: '/images/categories/frontend.jpg', createdAt: '2024-01-02', updatedAt: '2024-01-16' },
        { _id: 'cat-3', name: 'Backend Development', slug: 'backend-development', description: 'Phát triển phía máy chủ với Node.js, Python, Java', parentId: 'cat-1', parentName: 'Lập trình', level: 1, order: 2, isActive: true, courseCount: 22, seoTitle: 'Khóa học Backend Development - Node.js, Python, Java', seoDescription: 'Học phát triển backend và API với các ngôn ngữ lập trình phổ biến', seoKeywords: ['backend', 'nodejs', 'python', 'java', 'api development'], imageUrl: '/images/categories/backend.jpg', createdAt: '2024-01-03', updatedAt: '2024-01-17' },
        { _id: 'cat-4', name: 'React', slug: 'react', description: 'Thư viện JavaScript cho xây dựng giao diện người dùng', parentId: 'cat-2', parentName: 'Frontend Development', level: 2, order: 1, isActive: true, courseCount: 12, seoTitle: 'Khóa học React - Xây dựng ứng dụng web hiện đại', seoDescription: 'Học React từ cơ bản đến nâng cao, xây dựng SPA chuyên nghiệp', seoKeywords: ['react', 'javascript', 'frontend', 'spa', 'web app'], imageUrl: '/images/categories/react.jpg', createdAt: '2024-01-04', updatedAt: '2024-01-18' },
        { _id: 'cat-5', name: 'Thiết kế', slug: 'thiet-ke', description: 'Các khóa học về thiết kế đồ họa và UI/UX', level: 0, order: 2, isActive: true, courseCount: 28, seoTitle: 'Khóa học thiết kế đồ họa và UI/UX chuyên nghiệp', seoDescription: 'Học thiết kế đồ họa, UI/UX với các công cụ hiện đại', seoKeywords: ['thiết kế', 'design', 'ui/ux', 'đồ họa', 'photoshop'], imageUrl: '/images/categories/design.jpg', createdAt: '2024-01-05', updatedAt: '2024-01-19' },
        { _id: 'cat-6', name: 'Marketing', slug: 'marketing', description: 'Các khóa học về marketing số và quảng cáo', level: 0, order: 3, isActive: false, courseCount: 15, seoTitle: 'Khóa học Marketing số - Chiến lược quảng cáo hiệu quả', seoDescription: 'Học marketing số và các chiến lược quảng cáo online', seoKeywords: ['marketing', 'digital marketing', 'quảng cáo', 'seo'], imageUrl: '/images/categories/marketing.jpg', createdAt: '2024-01-06', updatedAt: '2024-01-20' }
      ];
      setCategories(mockCategories); setFilteredCategories(mockCategories); setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = categories;
    if (filters.search) filtered = filtered.filter(cat => cat.name.toLowerCase().includes(filters.search.toLowerCase()) || cat.description.toLowerCase().includes(filters.search.toLowerCase()));
    if (filters.level !== 'all') filtered = filtered.filter(cat => cat.level === parseInt(filters.level));
    if (filters.status !== 'all') filtered = filtered.filter(cat => filters.status === 'active' ? cat.isActive : !cat.isActive);
    if (filters.parent !== 'all') filtered = filtered.filter(cat => filters.parent === 'root' ? !cat.parentId : !!cat.parentId);
    setFilteredCategories(filtered);
  }, [filters, categories]);

  const handleFilterChange = (key: string, value: string) => setFilters(prev => ({ ...prev, [key]: value }));
  const handleCreateCategory = () => setShowCreateModal(true);
  const handleEditCategory = (category: Category) => { setSelectedCategory(category); setShowEditModal(category._id); };
  const handleDeleteCategory = (categoryId: string) => { if (window.confirm('Bạn có chắc muốn xóa danh mục này?')) setCategories(categories.filter(cat => cat._id !== categoryId)); };
  const handleToggleStatus = (categoryId: string) => setCategories(categories.map(cat => cat._id === categoryId ? { ...cat, isActive: !cat.isActive } : cat));

  const getLevelIcon = (level: number) => level === 0 ? '📁' : level === 1 ? '📂' : '📄';

  const renderCategoryTree = (parentId?: string, level = 0) => {
    const children = filteredCategories.filter(cat => cat.parentId === parentId);
    return children.map(category => (
      <Stack key={category._id} sx={{ pl: level * 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography>{getLevelIcon(level)}</Typography>
          <Typography fontWeight={700}>{category.name}</Typography>
          <Typography variant="caption" color="text.secondary">({category.courseCount} khóa học)</Typography>
          <Stack direction="row" spacing={1} ml="auto">
            <Button size="small" variant="outlined" onClick={() => handleEditCategory(category)}>Sửa</Button>
            <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteCategory(category._id)}>Xóa</Button>
          </Stack>
        </Stack>
        {renderCategoryTree(category._id, level + 1)}
      </Stack>
    ));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">Đang tải quản lý danh mục...</Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Header */}
      <Card sx={{ background: 'linear-gradient(135deg, #5b8def 0%, #8b5cf6 100%)', color: 'white', borderRadius: 2 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={2}>
            <Box>
              <Typography variant="h5" fontWeight={800}>Quản lý danh mục</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Quản lý danh mục khóa học, SEO và cấu trúc phân cấp</Typography>
            </Box>
            <Button variant="contained" onClick={handleCreateCategory}>+ Tạo danh mục mới</Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Stats */}
      <Grid container spacing={2}>
        <Grid item xs={6} md={3}><Card><CardContent><Stack alignItems="center"><Typography variant="h6" fontWeight={800}>{categories.length}</Typography><Typography variant="caption">Tổng danh mục</Typography></Stack></CardContent></Card></Grid>
        <Grid item xs={6} md={3}><Card><CardContent><Stack alignItems="center"><Typography variant="h6" fontWeight={800}>{categories.filter(c => c.isActive).length}</Typography><Typography variant="caption">Đang hoạt động</Typography></Stack></CardContent></Card></Grid>
        <Grid item xs={6} md={3}><Card><CardContent><Stack alignItems="center"><Typography variant="h6" fontWeight={800}>{categories.filter(c => !c.parentId).length}</Typography><Typography variant="caption">Danh mục gốc</Typography></Stack></CardContent></Card></Grid>
        <Grid item xs={6} md={3}><Card><CardContent><Stack alignItems="center"><Typography variant="h6" fontWeight={800}>{categories.reduce((s, c) => s + c.courseCount, 0)}</Typography><Typography variant="caption">Tổng khóa học</Typography></Stack></CardContent></Card></Grid>
      </Grid>

      {/* Filters & View toggle */}
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}><TextField fullWidth placeholder="Tìm kiếm danh mục..." value={filters.search} onChange={(e) => handleFilterChange('search', e.target.value)} /></Grid>
          <Grid item xs={6} md={2}><FormControl fullWidth><InputLabel>Cấp độ</InputLabel><Select label="Cấp độ" value={filters.level} onChange={(e) => handleFilterChange('level', String(e.target.value))} MenuProps={{ disableScrollLock: true }}><MenuItem value="all">Tất cả cấp độ</MenuItem><MenuItem value="0">Cấp 0 (Gốc)</MenuItem><MenuItem value="1">Cấp 1</MenuItem><MenuItem value="2">Cấp 2</MenuItem></Select></FormControl></Grid>
          <Grid item xs={6} md={2}><FormControl fullWidth><InputLabel>Trạng thái</InputLabel><Select label="Trạng thái" value={filters.status} onChange={(e) => handleFilterChange('status', String(e.target.value))} MenuProps={{ disableScrollLock: true }}><MenuItem value="all">Tất cả trạng thái</MenuItem><MenuItem value="active">Đang hoạt động</MenuItem><MenuItem value="inactive">Không hoạt động</MenuItem></Select></FormControl></Grid>
          <Grid item xs={6} md={2}><FormControl fullWidth><InputLabel>Loại</InputLabel><Select label="Loại" value={filters.parent} onChange={(e) => handleFilterChange('parent', String(e.target.value))} MenuProps={{ disableScrollLock: true }}><MenuItem value="all">Tất cả</MenuItem><MenuItem value="root">Chỉ danh mục gốc</MenuItem><MenuItem value="child">Chỉ danh mục con</MenuItem></Select></FormControl></Grid>
        </Grid>
        <Stack direction="row" justifyContent="flex-end" mt={2}>
          <ToggleButtonGroup exclusive value={viewMode} onChange={(_, v) => v && setViewMode(v)} size="small">
            <ToggleButton value="list">Danh sách</ToggleButton>
            <ToggleButton value="tree">Cây danh mục</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Paper>

      {/* Content */}
      {viewMode === 'list' ? (
        <Card><CardContent>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Danh mục</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Cấp độ</TableCell>
                <TableCell>Khóa học</TableCell>
                <TableCell>SEO</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category._id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography>{getLevelIcon(category.level)}</Typography>
                      <Stack>
                        <Typography fontWeight={700}>{category.name}</Typography>
                        <Typography variant="caption" color="text.secondary">/{category.slug} {category.parentName ? `← ${category.parentName}` : ''}</Typography>
                      </Stack>
                    </Stack>
                  </TableCell>
                  <TableCell><Typography variant="body2" color="text.secondary">{category.description}</Typography></TableCell>
                  <TableCell>Cấp {category.level}</TableCell>
                  <TableCell>{category.courseCount}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      {category.seoTitle && <Chip size="small" label="Title" color="success" />}
                      {category.seoDescription && <Chip size="small" label="Desc" color="success" />}
                      {category.seoKeywords && category.seoKeywords.length > 0 && <Chip size="small" label="Keywords" color="success" />}
                    </Stack>
                  </TableCell>
                  <TableCell><Switch checked={category.isActive} onChange={() => handleToggleStatus(category._id)} /></TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button size="small" variant="outlined" onClick={() => handleEditCategory(category)}>Sửa</Button>
                      <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteCategory(category._id)}>Xóa</Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      ) : (
        <Card><CardContent>
          {renderCategoryTree()}
        </CardContent></Card>
      )}

      {/* Create/Edit Dialog placeholders */}
      <Dialog open={showCreateModal} onClose={() => setShowCreateModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>Tạo danh mục mới</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">Modal tạo danh mục sẽ được implement ở đây...</Typography>
        </DialogContent>
        <DialogActions><Button onClick={() => setShowCreateModal(false)}>Đóng</Button></DialogActions>
      </Dialog>

      <Dialog open={!!showEditModal && !!selectedCategory} onClose={() => setShowEditModal(null)} fullWidth maxWidth="sm">
        <DialogTitle>Sửa danh mục: {selectedCategory?.name}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">Modal sửa danh mục sẽ được implement ở đây...</Typography>
        </DialogContent>
        <DialogActions><Button onClick={() => setShowEditModal(null)}>Đóng</Button></DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoryManagement;
