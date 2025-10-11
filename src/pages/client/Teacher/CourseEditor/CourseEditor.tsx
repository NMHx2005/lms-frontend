import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Stack,
  CircularProgress,
  IconButton,
  Alert,
  Snackbar,
  Switch,
  FormControlLabel,
  Paper
} from '@mui/material';
import {
  Save as SaveIcon,
  Publish as PublishIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import {
  getCourseById,
  createCourse,
  updateCourse,
  updateCourseStatus
} from '../../../../services/client/teacher-courses.service';
import { sharedUploadService } from '../../../../services/shared/upload.service';
import { getCategoryDomains } from '../../../../services/client/category.service';

interface CourseFormData {
  title: string;
  description: string;
  shortDescription: string; // ✅ NEW: Short description
  thumbnail: string;
  domain: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  originalPrice: number; // ✅ NEW: Original price
  discountPercentage: number; // ✅ NEW: Discount percentage
  language: string;
  duration: number;
  tags: string[];
  requirements: string[];
  objectives: string[];
  benefits: string[];
  isFree: boolean;
  certificateAvailable: boolean;
  maxStudents: number; // ✅ NEW: Max students
}

const CourseEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = id && id !== 'new';

  // ========== STATE ==========
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [availableDomains, setAvailableDomains] = useState<string[]>([]);
  const [loadingDomains, setLoadingDomains] = useState(true);

  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    shortDescription: '', // ✅ NEW: Short description
    thumbnail: '',
    domain: '',
    level: 'beginner',
    price: 0,
    originalPrice: 0, // ✅ NEW: Original price
    discountPercentage: 0, // ✅ NEW: Discount percentage
    language: 'vi',
    duration: 0,
    tags: [''],
    requirements: [''],
    objectives: [''],
    benefits: [''],
    isFree: false,
    certificateAvailable: false,
    maxStudents: 0 // ✅ NEW: Max students
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'success' });

  // ========== DATA LOADING ==========
  useEffect(() => {
    loadDomains();
  }, []);

  useEffect(() => {
    if (isEditMode) {
      loadCourse();
    }
  }, [id]);

  const loadDomains = async () => {
    try {
      setLoadingDomains(true);
      const domains = await getCategoryDomains();
      setAvailableDomains(domains);
    } catch (error) {
      console.error('Error loading domains:', error);
      toast.error('Lỗi khi tải danh sách lĩnh vực');
      // Set default domains if API fails
      setAvailableDomains(['IT', 'Business', 'Design', 'Marketing', 'Science', 'Law', 'Other']);
    } finally {
      setLoadingDomains(false);
    }
  };

  const loadCourse = async () => {
    try {
      setLoading(true);
      const response = await getCourseById(id!);

      if (response.success) {
        const course = response.data;
        console.log('🔍 Course data loaded:', {
          title: course.title,
          benefits: course.benefits,
          shortDescription: course.shortDescription,
          originalPrice: course.originalPrice,
          maxStudents: course.maxStudents
        });
        setFormData({
          title: course.title || '',
          description: course.description || '',
          shortDescription: course.shortDescription || '', // ✅ NEW: Map shortDescription
          thumbnail: course.thumbnail || '',
          domain: course.domain || '',
          level: course.level || 'beginner',
          price: course.price || 0,
          originalPrice: course.originalPrice || 0, // ✅ NEW: Map originalPrice
          discountPercentage: course.discountPercentage || 0, // ✅ NEW: Map discountPercentage
          language: course.language || 'vi',
          duration: course.estimatedDuration || 0,
          tags: course.tags?.length > 0 ? course.tags : [''],
          requirements: course.prerequisites?.length > 0 ? course.prerequisites : [''],
          objectives: course.learningObjectives?.length > 0 ? course.learningObjectives : [''],
          benefits: course.benefits?.length > 0 ? course.benefits : [''],
          isFree: course.isFree || false,
          certificateAvailable: course.certificate || false,
          maxStudents: course.maxStudents || 0 // ✅ NEW: Map maxStudents
        });
        setThumbnailPreview(course.thumbnail || '');
      }
    } catch (error: any) {
      console.error('Error loading course:', error);
      setSnackbar({
        open: true,
        message: 'Lỗi khi tải khóa học',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // ========== HANDLERS ==========
  const handleChange = (field: keyof CourseFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: 'tags' | 'requirements' | 'objectives' | 'benefits', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const handleAddArrayItem = (field: 'tags' | 'requirements' | 'objectives' | 'benefits') => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const handleRemoveArrayItem = (field: 'tags' | 'requirements' | 'objectives' | 'benefits', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [field]: newArray.length > 0 ? newArray : [''] }));
  };

  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    setThumbnailFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setThumbnailPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadThumbnail = async (): Promise<string> => {
    if (!thumbnailFile) return formData.thumbnail;

    try {
      setUploading(true);
      const response = await sharedUploadService.uploadSingleImage(thumbnailFile);

      const thumbnailUrl = response?.url || response?.data?.url || response?.data?.secure_url || '';

      if (thumbnailUrl) {
        return thumbnailUrl;
      } else {
        throw new Error('Upload response không chứa URL');
      }
    } catch (error: any) {
      console.error('Error uploading thumbnail:', error);
      toast.error('Lỗi khi upload thumbnail');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      setSaving(true);

      // Upload thumbnail nếu có file mới
      let thumbnailUrl = formData.thumbnail;
      if (thumbnailFile) {
        thumbnailUrl = await uploadThumbnail();
      }

      // Clean up data - remove empty strings from arrays
      const cleanedData = {
        ...formData,
        thumbnail: thumbnailUrl,
        tags: formData.tags.filter(t => t.trim() !== ''),
        requirements: formData.requirements.filter(r => r.trim() !== ''),
        objectives: formData.objectives.filter(o => o.trim() !== ''),
        benefits: formData.benefits.filter(b => b.trim() !== '') // ✅ NEW: Filter benefits
      };

      console.log('💾 Saving course data:', {
        title: cleanedData.title,
        benefits: cleanedData.benefits,
        shortDescription: cleanedData.shortDescription,
        originalPrice: cleanedData.originalPrice,
        maxStudents: cleanedData.maxStudents
      });

      let response;
      if (isEditMode) {
        response = await updateCourse(id!, cleanedData);
      } else {
        response = await createCourse(cleanedData);
      }

      if (response.success) {
        toast.success(isEditMode ? 'Cập nhật khóa học thành công' : 'Tạo khóa học thành công');
        navigate('/teacher/courses');
      }
    } catch (error: any) {
      console.error('Error saving course:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Lỗi khi lưu khóa học',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.domain) {
        toast.error('Vui lòng điền đầy đủ thông tin bắt buộc (Tên, Mô tả, Lĩnh vực)');
        return;
      }

      setSaving(true);

      // Upload thumbnail nếu có file mới
      let thumbnailUrl = formData.thumbnail;
      if (thumbnailFile) {
        thumbnailUrl = await uploadThumbnail();
      }

      // Clean up data
      const cleanedData = {
        ...formData,
        thumbnail: thumbnailUrl,
        tags: formData.tags.filter(t => t.trim() !== ''),
        requirements: formData.requirements.filter(r => r.trim() !== ''),
        objectives: formData.objectives.filter(o => o.trim() !== '')
      };

      let courseId = id;

      // If creating new, create first
      if (!isEditMode) {
        const createResponse = await createCourse(cleanedData);
        if (createResponse.success) {
          courseId = createResponse.data._id;
        } else {
          throw new Error('Failed to create course');
        }
      } else {
        // Update existing course
        await updateCourse(id!, cleanedData);
      }

      // Then submit for review
      if (courseId) {
        const submitResponse = await updateCourseStatus(courseId, 'submitted');
        if (submitResponse.success) {
          toast.success('Gửi khóa học để phê duyệt thành công');
          navigate('/teacher/courses');
        }
      }
    } catch (error: any) {
      console.error('Error publishing course:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Lỗi khi xuất bản khóa học',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  // ========== RENDER ==========
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h6" color="text.secondary">
            Đang tải khóa học...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <IconButton onClick={() => navigate('/teacher/courses')}>
            <ArrowBackIcon />
          </IconButton>
          <Breadcrumbs>
            <Typography color="text.primary">Teacher</Typography>
            <Typography color="text.primary">Courses</Typography>
            <Typography color="text.secondary">
              {isEditMode ? 'Chỉnh sửa' : 'Tạo mới'}
            </Typography>
          </Breadcrumbs>
        </Stack>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          {isEditMode ? 'Chỉnh sửa khóa học' : 'Tạo khóa học mới'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {isEditMode ? 'Cập nhật thông tin khóa học của bạn' : 'Điền thông tin để tạo khóa học mới'}
        </Typography>
      </Box>

      {/* Form */}
      <Grid container spacing={3}>
        {/* Main Information */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Thông tin cơ bản
              </Typography>

              <Stack spacing={3}>
                <TextField
                  fullWidth
                  required
                  label="Tên khóa học"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Nhập tên khóa học..."
                />

                <TextField
                  fullWidth
                  required
                  multiline
                  rows={6}
                  label="Mô tả khóa học"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Mô tả chi tiết về khóa học..."
                />

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Mô tả ngắn"
                  value={formData.shortDescription}
                  onChange={(e) => handleChange('shortDescription', e.target.value)}
                  placeholder="Mô tả ngắn gọn về khóa học (1-2 câu)..."
                  helperText="Mô tả ngắn sẽ hiển thị trên thẻ khóa học và kết quả tìm kiếm"
                />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Lĩnh vực</InputLabel>
                      <Select
                        value={formData.domain}
                        onChange={(e) => handleChange('domain', e.target.value)}
                        label="Lĩnh vực"
                        disabled={loadingDomains}
                        MenuProps={{ disableScrollLock: true }}
                      >
                        {loadingDomains ? (
                          <MenuItem disabled>Đang tải...</MenuItem>
                        ) : availableDomains.length > 0 ? (
                          availableDomains.map((domain) => (
                            <MenuItem key={domain} value={domain}>
                              {domain}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>Không có lĩnh vực nào</MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Cấp độ</InputLabel>
                      <Select
                        value={formData.level}
                        onChange={(e) => handleChange('level', e.target.value)}
                        label="Cấp độ"
                        MenuProps={{ disableScrollLock: true }}
                      >
                        <MenuItem value="beginner">Cơ bản</MenuItem>
                        <MenuItem value="intermediate">Trung cấp</MenuItem>
                        <MenuItem value="advanced">Nâng cao</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Giá hiện tại (VND)"
                      value={formData.price}
                      onChange={(e) => handleChange('price', Number(e.target.value))}
                      disabled={formData.isFree}
                      InputProps={{ inputProps: { min: 0 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Giá gốc (VND)"
                      value={formData.originalPrice}
                      onChange={(e) => handleChange('originalPrice', Number(e.target.value))}
                      disabled={formData.isFree}
                      InputProps={{ inputProps: { min: 0 } }}
                      helperText="Giá gốc trước khi giảm giá"
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Phần trăm giảm giá (%)"
                      value={formData.discountPercentage}
                      onChange={(e) => handleChange('discountPercentage', Number(e.target.value))}
                      disabled={formData.isFree}
                      InputProps={{ inputProps: { min: 0, max: 100 } }}
                      helperText="Từ 0-100%"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Thời lượng (giờ)"
                      value={formData.duration}
                      onChange={(e) => handleChange('duration', Number(e.target.value))}
                      InputProps={{ inputProps: { min: 0 } }}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Số học viên tối đa"
                      value={formData.maxStudents}
                      onChange={(e) => handleChange('maxStudents', Number(e.target.value))}
                      InputProps={{ inputProps: { min: 0 } }}
                      helperText="Để trống hoặc 0 = không giới hạn"
                    />
                  </Grid>
                </Grid>

                <FormControl fullWidth>
                  <InputLabel>Ngôn ngữ</InputLabel>
                  <Select
                    value={formData.language}
                    onChange={(e) => handleChange('language', e.target.value)}
                    label="Ngôn ngữ"
                    MenuProps={{ disableScrollLock: true }}
                  >
                    <MenuItem value="vi">Tiếng Việt</MenuItem>
                    <MenuItem value="en">English</MenuItem>
                  </Select>
                </FormControl>

                <Stack direction="row" spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isFree}
                        onChange={(e) => {
                          handleChange('isFree', e.target.checked);
                          if (e.target.checked) handleChange('price', 0);
                        }}
                      />
                    }
                    label="Khóa học miễn phí"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.certificateAvailable}
                        onChange={(e) => handleChange('certificateAvailable', e.target.checked)}
                      />
                    }
                    label="Có chứng chỉ"
                  />
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Tags 🏷️
              </Typography>
              <Stack spacing={2}>
                {formData.tags.map((tag, index) => (
                  <Stack key={index} direction="row" spacing={1}>
                    <TextField
                      fullWidth
                      size="small"
                      value={tag}
                      onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                      placeholder="Nhập tag..."
                    />
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveArrayItem('tags', index)}
                      disabled={formData.tags.length === 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => handleAddArrayItem('tags')}
                  variant="outlined"
                >
                  Thêm tag
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Yêu cầu đầu vào 📋
              </Typography>
              <Stack spacing={2}>
                {formData.requirements.map((req, index) => (
                  <Stack key={index} direction="row" spacing={1}>
                    <TextField
                      fullWidth
                      size="small"
                      value={req}
                      onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                      placeholder="Nhập yêu cầu..."
                    />
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveArrayItem('requirements', index)}
                      disabled={formData.requirements.length === 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => handleAddArrayItem('requirements')}
                  variant="outlined"
                >
                  Thêm yêu cầu
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Objectives */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Mục tiêu học tập 🎯
              </Typography>
              <Stack spacing={2}>
                {formData.objectives.map((obj, index) => (
                  <Stack key={index} direction="row" spacing={1}>
                    <TextField
                      fullWidth
                      size="small"
                      value={obj}
                      onChange={(e) => handleArrayChange('objectives', index, e.target.value)}
                      placeholder="Nhập mục tiêu..."
                    />
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveArrayItem('objectives', index)}
                      disabled={formData.objectives.length === 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => handleAddArrayItem('objectives')}
                  variant="outlined"
                >
                  Thêm mục tiêu
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Lợi ích khóa học 🌟
              </Typography>
              <Stack spacing={2}>
                {formData.benefits.map((benefit, index) => (
                  <Stack key={index} direction="row" spacing={1}>
                    <TextField
                      fullWidth
                      size="small"
                      value={benefit}
                      onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
                      placeholder="Nhập lợi ích..."
                    />
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveArrayItem('benefits', index)}
                      disabled={formData.benefits.length === 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => handleAddArrayItem('benefits')}
                  variant="outlined"
                >
                  Thêm lợi ích
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Thumbnail */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Thumbnail
              </Typography>

              {thumbnailPreview && (
                <Box
                  component="img"
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  sx={{
                    width: '100%',
                    height: 200,
                    objectFit: 'cover',
                    borderRadius: 2,
                    mb: 2
                  }}
                />
              )}

              <Button
                fullWidth
                variant="outlined"
                component="label"
                startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                disabled={uploading}
              >
                {uploading ? 'Đang upload...' : 'Upload Thumbnail'}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleThumbnailChange}
                />
              </Button>

              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Định dạng: JPG, PNG. Kích thước tối đa: 5MB
              </Typography>
            </CardContent>
          </Card>

          {/* Actions */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Stack spacing={2}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveDraft}
                disabled={saving || uploading}
              >
                {saving ? 'Đang lưu...' : isEditMode ? 'Lưu thay đổi' : 'Lưu bản nháp'}
              </Button>

              <Button
                fullWidth
                variant="contained"
                color="success"
                startIcon={<PublishIcon />}
                onClick={handlePublish}
                disabled={saving || uploading}
              >
                {saving ? 'Đang xử lý...' : 'Gửi để phê duyệt'}
              </Button>

              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/teacher/courses')}
              >
                Hủy
              </Button>
            </Stack>
          </Paper>

          {/* Help */}
          <Alert severity="info">
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              💡 Mẹo
            </Typography>
            <Typography variant="caption" component="div">
              • Tên khóa học ngắn gọn, súc tích
            </Typography>
            <Typography variant="caption" component="div">
              • Mô tả chi tiết nội dung khóa học
            </Typography>
            <Typography variant="caption" component="div">
              • Thumbnail hấp dẫn để thu hút học viên
            </Typography>
          </Alert>
        </Grid>
      </Grid>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CourseEditor;
