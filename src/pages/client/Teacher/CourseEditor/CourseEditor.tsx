import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Stack,
  CircularProgress,
  Chip,
  IconButton,
  Alert,
  Paper,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Save as SaveIcon,
  Publish as PublishIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

interface CourseData {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  domain: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  status: 'draft' | 'published' | 'pending' | 'rejected';
  tags: string[];
  requirements: string[];
  objectives: string[];
}

interface SectionConfig {
  id: string;
  title: string;
  icon: string;
  visible: boolean;
  type: 'tags' | 'requirements' | 'objectives' | 'custom';
  data: string[];
}

const CourseEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<CourseData>>({});
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');

  console.log(course, thumbnailFile);
  // Quản lý hiển thị các section
  const [sections, setSections] = useState<SectionConfig[]>([
    { id: 'tags', title: 'Tags', icon: '🏷️', visible: true, type: 'tags', data: [''] },
    { id: 'requirements', title: 'Yêu cầu đầu vào', icon: '📋', visible: true, type: 'requirements', data: [''] },
    { id: 'objectives', title: 'Mục tiêu học tập', icon: '🎯', visible: true, type: 'objectives', data: [''] }
  ]);

  // State cho section mới
  const [showAddSectionForm, setShowAddSectionForm] = useState(false);
  const [newSection, setNewSection] = useState({
    title: '',
    icon: '📝',
    type: 'custom' as const
  });

  useEffect(() => {
    // Check if this is create mode (no id) or edit mode
    if (!id || id === 'new') {
      // Create mode - set default values
      const defaultCourse: Partial<CourseData> = {
        title: '',
        description: '',
        thumbnail: '',
        domain: '',
        level: 'beginner',
        price: 0,
        status: 'draft',
        tags: [''],
        requirements: [''],
        objectives: ['']
      };
      setCourse(null);
      setFormData(defaultCourse);
      setThumbnailPreview('');
      setLoading(false);
    } else {
      // Edit mode - fetch existing course data
      setTimeout(() => {
        const mockCourse: CourseData = {
          _id: id,
          title: 'React Advanced Patterns',
          description: 'Khóa học nâng cao về React, bao gồm các pattern và best practices để xây dựng ứng dụng web hiện đại.',
          thumbnail: '/images/apollo.png',
          domain: 'Web Development',
          level: 'advanced',
          price: 299000,
          status: 'draft',
          tags: ['React', 'JavaScript', 'Frontend', 'Advanced'],
          requirements: ['Kiến thức cơ bản về React', 'JavaScript ES6+', 'HTML/CSS'],
          objectives: ['Hiểu sâu về React patterns', 'Xây dựng ứng dụng scalable', 'Tối ưu hiệu suất']
        };
        setCourse(mockCourse);
        setFormData(mockCourse);
        setThumbnailPreview(mockCourse.thumbnail);
        setLoading(false);
      }, 1000);
    }
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...(formData.tags || [])];
    newTags[index] = value;
    setFormData(prev => ({ ...prev, tags: newTags }));
  };

  const addTag = () => {
    setFormData(prev => ({
      ...prev,
      tags: [...(prev.tags || []), '']
    }));
  };

  const removeTag = (index: number) => {
    const newTags = [...(formData.tags || [])];
    newTags.splice(index, 1);
    setFormData(prev => ({ ...prev, tags: newTags }));
  };

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...(formData.requirements || [])];
    newRequirements[index] = value;
    setFormData(prev => ({ ...prev, requirements: newRequirements }));
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...(prev.requirements || []), '']
    }));
  };

  const removeRequirement = (index: number) => {
    const newRequirements = [...(formData.requirements || [])];
    newRequirements.splice(index, 1);
    setFormData(prev => ({ ...prev, requirements: newRequirements }));
  };

  const handleObjectiveChange = (index: number, value: string) => {
    const newObjectives = [...(formData.objectives || [])];
    newObjectives[index] = value;
    setFormData(prev => ({ ...prev, objectives: newObjectives }));
  };

  const addObjective = () => {
    setFormData(prev => ({
      ...prev,
      objectives: [...(prev.objectives || []), '']
    }));
  };

  const removeObjective = (index: number) => {
    const newObjectives = [...(formData.objectives || [])];
    newObjectives.splice(index, 1);
    setFormData(prev => ({ ...prev, objectives: newObjectives }));
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSaving(false);
    alert('Khóa học đã được lưu thành công!');
  };

  const handlePublish = async () => {
    if (confirm('Bạn có chắc chắn muốn xuất bản khóa học này?')) {
      setSaving(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSaving(false);
      alert('Khóa học đã được xuất bản thành công!');
      navigate('/teacher/courses');
    }
  };

  // Quản lý hiển thị section
  // const toggleSection = (sectionId: string) => {
  //   setSections(prev => prev.map(section => 
  //     section.id === sectionId 
  //       ? { ...section, visible: !section.visible }
  //       : section
  //   ));
  // };

  const addSection = (sectionId: string) => {
    setSections(prev => prev.map(section =>
      section.id === sectionId
        ? { ...section, visible: true }
        : section
    ));
  };

  const removeSection = (sectionId: string) => {
    setSections(prev => prev.map(section =>
      section.id === sectionId
        ? { ...section, visible: false }
        : section
    ));
  };

  // Thêm section mới
  const addNewSection = () => {
    if (newSection.title.trim()) {
      const newSectionConfig: SectionConfig = {
        id: `custom-${Date.now()}`,
        title: newSection.title.trim(),
        icon: newSection.icon,
        visible: true,
        type: 'custom',
        data: ['']
      };

      setSections(prev => [...prev, newSectionConfig]);
      setNewSection({ title: '', icon: '📝', type: 'custom' });
      setShowAddSectionForm(false);
    }
  };

  // Xóa section hoàn toàn
  const deleteSection = (sectionId: string) => {
    setSections(prev => prev.filter(section => section.id !== sectionId));
  };

  // Quản lý data của custom section
  const handleCustomSectionChange = (sectionId: string, index: number, value: string) => {
    setSections(prev => prev.map(section =>
      section.id === sectionId
        ? { ...section, data: section.data.map((item, i) => i === index ? value : item) }
        : section
    ));
  };

  const addCustomSectionItem = (sectionId: string) => {
    setSections(prev => prev.map(section =>
      section.id === sectionId
        ? { ...section, data: [...section.data, ''] }
        : section
    ));
  };

  const removeCustomSectionItem = (sectionId: string, index: number) => {
    setSections(prev => prev.map(section =>
      section.id === sectionId
        ? { ...section, data: section.data.filter((_, i) => i !== index) }
        : section
    ));
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box sx={{ mb: 4 }}>
          <Breadcrumbs sx={{ mb: 2 }}>
            <Typography color="text.primary">Teacher Dashboard</Typography>
            <Typography color="text.primary">Course Studio</Typography>
            <Typography color="text.secondary">
              {!id || id === 'new' ? 'Tạo khóa học mới' : 'Chỉnh sửa khóa học'}
            </Typography>
          </Breadcrumbs>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            {!id || id === 'new' ? 'Tạo khóa học mới' : 'Chỉnh sửa khóa học'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h6" color="text.secondary">
            Đang tải dữ liệu...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Typography color="text.primary">Teacher Dashboard</Typography>
          <Typography color="text.primary">Course Studio</Typography>
          <Typography color="text.secondary">
            {!id || id === 'new' ? 'Tạo khóa học mới' : 'Chỉnh sửa khóa học'}
          </Typography>
        </Breadcrumbs>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
          {!id || id === 'new' ? 'Tạo khóa học mới' : 'Chỉnh sửa khóa học'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {!id || id === 'new'
            ? 'Tạo khóa học mới và chia sẻ kiến thức của bạn với học viên'
            : 'Chỉnh sửa thông tin khóa học và cập nhật nội dung'
          }
        </Typography>
      </Box>

      <Box component="form" onSubmit={(e) => e.preventDefault()}>
        {/* Basic Information */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <EditIcon color="primary" />
              Thông tin cơ bản
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tên khóa học"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleInputChange}
                  placeholder="Nhập tên khóa học"
                  required
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mô tả khóa học"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  placeholder="Mô tả chi tiết về khóa học"
                  multiline
                  rows={4}
                  required
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth required>
                  <InputLabel>Lĩnh vực</InputLabel>
                  <Select
                    name="domain"
                    value={formData.domain || ''}
                    onChange={handleSelectChange}
                    label="Lĩnh vực"
                    MenuProps={{ disableScrollLock: true }}
                  >
                    <MenuItem value="Web Development">Web Development</MenuItem>
                    <MenuItem value="Mobile Development">Mobile Development</MenuItem>
                    <MenuItem value="Data Science">Data Science</MenuItem>
                    <MenuItem value="Design">Design</MenuItem>
                    <MenuItem value="Business">Business</MenuItem>
                    <MenuItem value="Marketing">Marketing</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth required>
                  <InputLabel>Cấp độ</InputLabel>
                  <Select
                    name="level"
                    value={formData.level || ''}
                    onChange={handleSelectChange}
                    label="Cấp độ"
                    MenuProps={{ disableScrollLock: true }}
                  >
                    <MenuItem value="beginner">Cơ bản</MenuItem>
                    <MenuItem value="intermediate">Trung cấp</MenuItem>
                    <MenuItem value="advanced">Nâng cao</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Giá (VND)"
                  name="price"
                  type="number"
                  value={formData.price || ''}
                  onChange={handleInputChange}
                  placeholder="0"
                  inputProps={{ min: 0 }}
                  required
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Thumbnail */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <ImageIcon color="primary" />
              Thumbnail
            </Typography>

            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    border: '2px dashed',
                    borderColor: 'grey.300',
                    borderRadius: 2,
                    minHeight: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {thumbnailPreview ? (
                    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                      />
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: 'center' }}>
                      <ImageIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                      <Typography variant="body2" color="text.secondary">
                        Chưa có ảnh thumbnail
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>

              <Grid item xs={12} md={8}>
                <Stack spacing={2}>
                  <input
                    type="file"
                    id="thumbnail"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    style={{ display: 'none' }}
                  />
                  <Button
                    component="label"
                    htmlFor="thumbnail"
                    variant="outlined"
                    startIcon={<ImageIcon />}
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    Chọn ảnh thumbnail
                  </Button>

                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <strong>Kích thước khuyến nghị:</strong> 1280x720px<br />
                      <strong>Định dạng:</strong> JPG, PNG<br />
                      <strong>Kích thước tối đa:</strong> 5MB
                    </Typography>
                  </Alert>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Section Management */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <EditIcon color="primary" />
              Quản lý các section
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Bật/tắt các section để tùy chỉnh giao diện khóa học
            </Typography>

            <Stack spacing={2}>
              {sections.map((section) => (
                <Paper key={section.id} sx={{ p: 2, border: '1px solid', borderColor: 'grey.200' }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Typography variant="h6" sx={{ fontSize: '1.2rem' }}>
                        {section.icon}
                      </Typography>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {section.title}
                        </Typography>
                        {section.type === 'custom' && (
                          <Chip label="Tùy chỉnh" size="small" color="secondary" />
                        )}
                      </Box>
                    </Stack>

                    <Stack direction="row" spacing={1}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={section.visible}
                            onChange={() => section.visible ? removeSection(section.id) : addSection(section.id)}
                            color="primary"
                          />
                        }
                        label={section.visible ? "Hiển thị" : "Ẩn"}
                        labelPlacement="start"
                      />
                      {section.type === 'custom' && (
                        <IconButton
                          onClick={() => deleteSection(section.id)}
                          color="error"
                          size="small"
                          title={`Xóa section ${section.title}`}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Stack>
                  </Stack>
                </Paper>
              ))}
            </Stack>

            {/* Add New Section */}
            <Box sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setShowAddSectionForm(!showAddSectionForm)}
                sx={{ mb: 2 }}
              >
                {showAddSectionForm ? 'Hủy' : 'Thêm section mới'}
              </Button>

              {showAddSectionForm && (
                <Paper sx={{ p: 3, border: '1px solid', borderColor: 'primary.main' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Tạo section mới
                  </Typography>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Icon</InputLabel>
                        <Select
                          value={newSection.icon}
                          onChange={(e) => setNewSection(prev => ({ ...prev, icon: e.target.value }))}
                          label="Icon"
                          MenuProps={{ disableScrollLock: true }}
                        >
                          <MenuItem value="📝">📝 Văn bản</MenuItem>
                          <MenuItem value="📚">📚 Tài liệu</MenuItem>
                          <MenuItem value="🎬">🎬 Video</MenuItem>
                          <MenuItem value="🔗">🔗 Liên kết</MenuItem>
                          <MenuItem value="📊">📊 Thống kê</MenuItem>
                          <MenuItem value="💡">💡 Gợi ý</MenuItem>
                          <MenuItem value="⚠️">⚠️ Lưu ý</MenuItem>
                          <MenuItem value="✅">✅ Checklist</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Tên section"
                        value={newSection.title}
                        onChange={(e) => setNewSection(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Nhập tên section mới"
                        required
                      />
                    </Grid>
                  </Grid>

                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={addNewSection}
                    disabled={!newSection.title.trim()}
                  >
                    Tạo section mới
                  </Button>
                </Paper>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Tags */}
        {sections.find(s => s.id === 'tags')?.visible && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                  🏷️ Tags
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => setFormData(prev => ({ ...prev, tags: [] }))}
                  size="small"
                >
                  Xóa tất cả
                </Button>
              </Stack>

              <Stack spacing={2}>
                {(formData.tags || []).map((tag, index) => (
                  <Stack key={index} direction="row" spacing={1} alignItems="center">
                    <TextField
                      fullWidth
                      value={tag}
                      onChange={(e) => handleTagChange(index, e.target.value)}
                      placeholder="Nhập tag"
                      variant="outlined"
                      size="small"
                    />
                    <IconButton
                      onClick={() => removeTag(index)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                ))}
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={addTag}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  Thêm tag
                </Button>
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Requirements */}
        {sections.find(s => s.id === 'requirements')?.visible && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                  📋 Yêu cầu đầu vào
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => setFormData(prev => ({ ...prev, requirements: [] }))}
                  size="small"
                >
                  Xóa tất cả
                </Button>
              </Stack>

              <Stack spacing={2}>
                {(formData.requirements || []).map((req, index) => (
                  <Stack key={index} direction="row" spacing={1} alignItems="flex-start">
                    <TextField
                      fullWidth
                      value={req}
                      onChange={(e) => handleRequirementChange(index, e.target.value)}
                      placeholder="Nhập yêu cầu"
                      multiline
                      rows={2}
                      variant="outlined"
                      size="small"
                    />
                    <IconButton
                      onClick={() => removeRequirement(index)}
                      color="error"
                      size="small"
                      sx={{ mt: 0.5 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                ))}
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={addRequirement}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  Thêm yêu cầu
                </Button>
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Learning Objectives */}
        {sections.find(s => s.id === 'objectives')?.visible && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                  🎯 Mục tiêu học tập
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => setFormData(prev => ({ ...prev, objectives: [] }))}
                  size="small"
                >
                  Xóa tất cả
                </Button>
              </Stack>

              <Stack spacing={2}>
                {(formData.objectives || []).map((obj, index) => (
                  <Stack key={index} direction="row" spacing={1} alignItems="flex-start">
                    <TextField
                      fullWidth
                      value={obj}
                      onChange={(e) => handleObjectiveChange(index, e.target.value)}
                      placeholder="Nhập mục tiêu học tập"
                      multiline
                      rows={2}
                      variant="outlined"
                      size="small"
                    />
                    <IconButton
                      onClick={() => removeObjective(index)}
                      color="error"
                      size="small"
                      sx={{ mt: 0.5 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                ))}
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={addObjective}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  Thêm mục tiêu
                </Button>
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Custom Sections */}
        {sections
          .filter(section => section.type === 'custom' && section.visible)
          .map((section) => (
            <Card key={section.id} sx={{ mb: 3 }}>
              <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    {section.icon} {section.title}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => setSections(prev => prev.map(s =>
                      s.id === section.id ? { ...s, data: [] } : s
                    ))}
                    size="small"
                  >
                    Xóa tất cả
                  </Button>
                </Stack>

                <Stack spacing={2}>
                  {section.data.map((item, index) => (
                    <Stack key={index} direction="row" spacing={1} alignItems="flex-start">
                      <TextField
                        fullWidth
                        value={item}
                        onChange={(e) => handleCustomSectionChange(section.id, index, e.target.value)}
                        placeholder={`Nhập ${section.title.toLowerCase()}`}
                        multiline
                        rows={2}
                        variant="outlined"
                        size="small"
                      />
                      <IconButton
                        onClick={() => removeCustomSectionItem(section.id, index)}
                        color="error"
                        size="small"
                        sx={{ mt: 0.5 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  ))}
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => addCustomSectionItem(section.id)}
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    Thêm {section.title.toLowerCase()}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))}

        {/* Actions */}
        <Card>
          <CardActions sx={{ justifyContent: 'space-between', p: 3 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/teacher/courses')}
              size="large"
            >
              Quay lại
            </Button>

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="secondary"
                startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                onClick={handleSave}
                disabled={saving}
                size="large"
              >
                {saving ? 'Đang lưu...' : (!id || id === 'new' ? 'Tạo khóa học' : 'Lưu bản nháp')}
              </Button>
              <Button
                variant="contained"
                startIcon={saving ? <CircularProgress size={20} /> : <PublishIcon />}
                onClick={handlePublish}
                disabled={saving}
                size="large"
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  },
                }}
              >
                {saving ? 'Đang xuất bản...' : 'Xuất bản khóa học'}
              </Button>
            </Stack>
          </CardActions>
        </Card>
      </Box>
    </Container>
  );
};

export default CourseEditor;
