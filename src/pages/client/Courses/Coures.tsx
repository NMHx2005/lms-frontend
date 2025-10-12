import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientCoursesService } from '../../../services/client/courses.service';
import { getCategoryDomains } from '../../../services/client/category.service';
import './Courses.css';
import TopBar from '@/components/Client/Home/TopBar/TopBar';
import Header from '@/components/Layout/client/Header';
import Footer from '@/components/Layout/client/Footer';
import { ChatBot } from '@/components/ChatBot';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Rating,
  Divider,
  CircularProgress,
  IconButton,
  Drawer,
  useMediaQuery,
  useTheme,
  Pagination,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Radio,
  RadioGroup
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  People as PeopleIcon,
  Star as StarIcon
} from '@mui/icons-material';

const Courses: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter options
  const [domains, setDomains] = useState<string[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    loadDomains();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [currentPage, searchTerm, selectedDomain, selectedLevel, selectedPriceRange, selectedRating, sortBy, sortOrder]);

  const loadDomains = async () => {
    try {
      const domainsData = await getCategoryDomains();
      setDomains(domainsData || []);
    } catch (error) {
      console.error('Error loading domains:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params: any = {
        page: currentPage,
        limit: 12,
        sortBy,
        sortOrder
      };

      // Add filters
      if (searchTerm) params.q = searchTerm;
      if (selectedDomain) params.domain = selectedDomain;
      if (selectedLevel) params.level = selectedLevel;

      // Convert priceRange to minPrice/maxPrice
      if (selectedPriceRange) {
        if (selectedPriceRange === 'free') {
          params.isFree = true;
        } else {
          const [min, max] = selectedPriceRange.split('-');
          if (min) params.minPrice = parseInt(min);
          if (max) params.maxPrice = parseInt(max);
        }
      }

      // Convert rating to minRating
      if (selectedRating) {
        params.minRating = parseFloat(selectedRating);
      }

      console.log('🔍 Fetching courses with params:', params);

      const response = await clientCoursesService.getCourses(params);

      console.log('📊 Courses response:', {
        success: response.success,
        total: response.data?.total,
        coursesCount: response.data?.courses?.length
      });

      if (response.success) {
        setCourses(response.data.courses || []);
        setTotalPages(response.data.totalPages || 1);
        setTotalCourses(response.data.total || 0);
      } else {
        setError('Không thể tải danh sách khóa học');
      }
    } catch (err: any) {
      console.error('Error fetching courses:', err);
      setError(err.message || 'Có lỗi xảy ra khi tải khóa học');
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedDomain('');
    setSelectedLevel('');
    setSelectedPriceRange('');
    setSelectedRating('');
    setSortBy('createdAt');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm || selectedDomain || selectedLevel || selectedPriceRange || selectedRating;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getLevelLabel = (level: string) => {
    const labels: any = {
      beginner: 'Cơ bản',
      intermediate: 'Trung cấp',
      advanced: 'Nâng cao'
    };
    return labels[level] || level;
  };

  // Render Filter Sidebar
  const renderFilterSidebar = () => (
    <Box sx={{ position: 'sticky', top: 20 }}>
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Stack spacing={3}>
            {/* Header */}
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h6" fontWeight={700}>
                Bộ lọc
              </Typography>
              {hasActiveFilters && (
                <Button size="small" startIcon={<ClearIcon />} onClick={handleClearFilters}>
                  Xóa
                </Button>
              )}
            </Stack>

            <Divider />

            {/* Search */}
            <TextField
              fullWidth
              size="small"
              placeholder="Tìm kiếm khóa học..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />

            {/* Domain Filter */}
            <Accordion defaultExpanded disableGutters elevation={0}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle2" fontWeight={600}>Lĩnh vực</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <RadioGroup value={selectedDomain} onChange={(e) => {
                  setSelectedDomain(e.target.value);
                  setCurrentPage(1);
                }}>
                  <FormControlLabel value="" control={<Radio size="small" />} label="Tất cả" />
                  {domains.map(domain => (
                    <FormControlLabel
                      key={domain}
                      value={domain}
                      control={<Radio size="small" />}
                      label={domain}
                    />
                  ))}
                </RadioGroup>
              </AccordionDetails>
            </Accordion>

            {/* Level Filter */}
            <Accordion disableGutters elevation={0}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle2" fontWeight={600}>Cấp độ</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <RadioGroup value={selectedLevel} onChange={(e) => {
                  setSelectedLevel(e.target.value);
                  setCurrentPage(1);
                }}>
                  <FormControlLabel value="" control={<Radio size="small" />} label="Tất cả" />
                  <FormControlLabel value="beginner" control={<Radio size="small" />} label="Cơ bản" />
                  <FormControlLabel value="intermediate" control={<Radio size="small" />} label="Trung cấp" />
                  <FormControlLabel value="advanced" control={<Radio size="small" />} label="Nâng cao" />
                </RadioGroup>
              </AccordionDetails>
            </Accordion>

            {/* Price Filter */}
            <Accordion disableGutters elevation={0}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle2" fontWeight={600}>Giá</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <RadioGroup value={selectedPriceRange} onChange={(e) => {
                  setSelectedPriceRange(e.target.value);
                  setCurrentPage(1);
                }}>
                  <FormControlLabel value="" control={<Radio size="small" />} label="Tất cả" />
                  <FormControlLabel value="free" control={<Radio size="small" />} label="Miễn phí" />
                  <FormControlLabel value="0-500000" control={<Radio size="small" />} label="< 500k" />
                  <FormControlLabel value="500000-1000000" control={<Radio size="small" />} label="500k - 1tr" />
                  <FormControlLabel value="1000000-2000000" control={<Radio size="small" />} label="1tr - 2tr" />
                  <FormControlLabel value="2000000-5000000" control={<Radio size="small" />} label="2tr - 5tr" />
                  <FormControlLabel value="5000000-" control={<Radio size="small" />} label="> 5tr" />
                </RadioGroup>
              </AccordionDetails>
            </Accordion>

            {/* Rating Filter */}
            <Accordion disableGutters elevation={0}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle2" fontWeight={600}>Đánh giá</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <RadioGroup value={selectedRating} onChange={(e) => {
                  setSelectedRating(e.target.value);
                  setCurrentPage(1);
                }}>
                  <FormControlLabel value="" control={<Radio size="small" />} label="Tất cả" />
                  <FormControlLabel
                    value="4.5"
                    control={<Radio size="small" />}
                    label={
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Rating value={4.5} readOnly size="small" precision={0.5} />
                        <Typography variant="caption">trở lên</Typography>
                      </Stack>
                    }
                  />
                  <FormControlLabel
                    value="4"
                    control={<Radio size="small" />}
                    label={
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Rating value={4} readOnly size="small" />
                        <Typography variant="caption">trở lên</Typography>
                      </Stack>
                    }
                  />
                  <FormControlLabel
                    value="3"
                    control={<Radio size="small" />}
                    label={
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Rating value={3} readOnly size="small" />
                        <Typography variant="caption">trở lên</Typography>
                      </Stack>
                    }
                  />
                </RadioGroup>
              </AccordionDetails>
            </Accordion>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <>
      <TopBar />
      <Header />

      <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" fontWeight={800} gutterBottom>
              Khám phá khóa học
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Tìm kiếm và lọc {totalCourses.toLocaleString()} khóa học phù hợp với nhu cầu của bạn
            </Typography>
          </Box>

          {/* Mobile Filter Button */}
          {isMobile && (
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => setMobileFilterOpen(true)}
              sx={{ mb: 2 }}
            >
              Bộ lọc
            </Button>
          )}

          <Grid container spacing={3}>
            {/* Sidebar Filters - Desktop */}
            {!isMobile && (
              <Grid item md={3}>
                {renderFilterSidebar()}
              </Grid>
            )}

            {/* Main Content */}
            <Grid item xs={12} md={9}>
              <Stack spacing={3}>
                {/* Toolbar */}
                <Card sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
                      <Typography variant="body1" fontWeight={600}>
                        {loading ? 'Đang tải...' : `${totalCourses.toLocaleString()} khóa học`}
                      </Typography>

                      <Stack direction="row" spacing={2} alignItems="center">
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                          <InputLabel>Sắp xếp</InputLabel>
                          <Select
                            value={sortBy}
                            label="Sắp xếp"
                            onChange={(e) => {
                              setSortBy(e.target.value);
                              setCurrentPage(1);
                            }}
                            MenuProps={{
                              disableScrollLock: true
                            }}
                          >
                            <MenuItem value="createdAt">Mới nhất</MenuItem>
                            <MenuItem value="price">Giá</MenuItem>
                            <MenuItem value="totalStudents">Học viên</MenuItem>
                            <MenuItem value="averageRating">Đánh giá</MenuItem>
                            <MenuItem value="title">Tên A-Z</MenuItem>
                          </Select>
                        </FormControl>

                        <IconButton
                          size="small"
                          onClick={() => {
                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                            setCurrentPage(1);
                          }}
                        >
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </IconButton>
                      </Stack>
                    </Stack>

                    {hasActiveFilters && (
                      <Stack direction="row" spacing={1} sx={{ mt: 2 }} flexWrap="wrap">
                        {searchTerm && (
                          <Chip
                            label={`Tìm kiếm: "${searchTerm}"`}
                            onDelete={() => { setSearchTerm(''); setCurrentPage(1); }}
                            size="small"
                          />
                        )}
                        {selectedDomain && (
                          <Chip
                            label={`Lĩnh vực: ${selectedDomain}`}
                            onDelete={() => { setSelectedDomain(''); setCurrentPage(1); }}
                            size="small"
                          />
                        )}
                        {selectedLevel && (
                          <Chip
                            label={`Cấp độ: ${getLevelLabel(selectedLevel)}`}
                            onDelete={() => { setSelectedLevel(''); setCurrentPage(1); }}
                            size="small"
                          />
                        )}
                        {selectedPriceRange && (
                          <Chip
                            label={`Giá: ${selectedPriceRange === 'free' ? 'Miễn phí' :
                              selectedPriceRange === '0-500000' ? '< 500k' :
                                selectedPriceRange === '500000-1000000' ? '500k - 1tr' :
                                  selectedPriceRange === '1000000-2000000' ? '1tr - 2tr' :
                                    selectedPriceRange === '2000000-5000000' ? '2tr - 5tr' :
                                      selectedPriceRange === '5000000-' ? '> 5tr' :
                                        selectedPriceRange
                              }`}
                            onDelete={() => { setSelectedPriceRange(''); setCurrentPage(1); }}
                            size="small"
                          />
                        )}
                        {selectedRating && (
                          <Chip
                            label={`Đánh giá: ${selectedRating}⭐+`}
                            onDelete={() => { setSelectedRating(''); setCurrentPage(1); }}
                            size="small"
                          />
                        )}
                      </Stack>
                    )}
                  </CardContent>
                </Card>

                {/* Course Grid */}
                {loading ? (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <CircularProgress size={60} />
                    <Typography variant="h6" sx={{ mt: 2 }}>Đang tải khóa học...</Typography>
                  </Box>
                ) : error ? (
                  <Card sx={{ borderRadius: 3 }}>
                    <CardContent sx={{ textAlign: 'center', py: 8 }}>
                      <Typography variant="h6" color="error" gutterBottom>
                        Lỗi tải dữ liệu
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        {error}
                      </Typography>
                      <Button variant="contained" onClick={fetchCourses}>
                        Thử lại
                      </Button>
                    </CardContent>
                  </Card>
                ) : courses.length === 0 ? (
                  <Card sx={{ borderRadius: 3 }}>
                    <CardContent sx={{ textAlign: 'center', py: 8 }}>
                      <Typography variant="h6" gutterBottom>
                        Không tìm thấy khóa học
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Không có khóa học nào phù hợp với bộ lọc của bạn
                      </Typography>
                      <Button variant="outlined" onClick={handleClearFilters}>
                        Xóa bộ lọc
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Grid container spacing={3}>
                    {courses.map((course) => (
                      <Grid item key={course._id} xs={12} sm={6} lg={4}>
                        <Card
                          sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: 3,
                            transition: 'all 0.3s',
                            '&:hover': {
                              transform: 'translateY(-8px)',
                              boxShadow: 6
                            }
                          }}
                        >
                          <CardMedia
                            component="img"
                            height="200"
                            image={course.thumbnail || '/images/default-course.jpg'}
                            alt={course.title}
                            sx={{ cursor: 'pointer' }}
                            onClick={() => navigate(`/courses/${course._id}`)}
                          />

                          <CardContent sx={{ flexGrow: 1 }}>
                            <Typography
                              variant="h6"
                              fontWeight={700}
                              gutterBottom
                              sx={{
                                cursor: 'pointer',
                                '&:hover': { color: 'primary.main' },
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}
                              onClick={() => navigate(`/courses/${course._id}`)}
                            >
                              {course.title}
                            </Typography>

                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                              <Chip label={course.domain || 'General'} size="small" color="primary" variant="outlined" />
                              <Chip label={getLevelLabel(course.level)} size="small" />
                            </Stack>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                mb: 2,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}
                            >
                              {course.description}
                            </Typography>

                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                              <Stack direction="row" spacing={0.5} alignItems="center">
                                <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                                <Typography variant="caption">
                                  {course.averageRating?.toFixed(1) || '0.0'}
                                </Typography>
                              </Stack>

                              <Stack direction="row" spacing={0.5} alignItems="center">
                                <PeopleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="caption" color="text.secondary">
                                  {course.totalStudents || 0}
                                </Typography>
                              </Stack>
                            </Stack>

                            <Divider sx={{ mb: 2 }} />

                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Typography variant="h6" color="primary" fontWeight={700}>
                                {course.price === 0 ? 'Miễn phí' : formatPrice(course.price)}
                              </Typography>
                              {course.isDiscounted && (
                                <Chip label={`-${course.discountPercentage}%`} size="small" color="error" />
                              )}
                            </Stack>
                          </CardContent>

                          <CardActions sx={{ p: 2, pt: 0 }}>
                            <Button
                              fullWidth
                              variant="contained"
                              onClick={() => navigate(`/courses/${course._id}`)}
                            >
                              Xem chi tiết
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}

                {/* Pagination */}
                {!loading && courses.length > 0 && totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={(_e, page) => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      color="primary"
                      size="large"
                      showFirstButton
                      showLastButton
                    />
                  </Box>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="left"
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        disableScrollLock
      >
        <Box sx={{ width: 300, p: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography variant="h6" fontWeight={700}>Bộ lọc</Typography>
            <IconButton onClick={() => setMobileFilterOpen(false)}>
              <ClearIcon />
            </IconButton>
          </Stack>
          {renderFilterSidebar()}
        </Box>
      </Drawer>

      <Footer />

      {/* AI ChatBot */}
      <ChatBot context={{ currentPage: 'courses' }} />
    </>
  );
};

export default Courses;