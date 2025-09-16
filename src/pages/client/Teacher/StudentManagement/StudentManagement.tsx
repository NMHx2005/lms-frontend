import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Stack,
  Avatar,
  CircularProgress,
  Chip,
  LinearProgress,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  Assignment as AssignmentIcon,
  Message as MessageIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  PauseCircle as PauseCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon
} from '@mui/icons-material';

interface Student {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  enrolledAt: string;
  lastActive: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  assignments: {
    submitted: number;
    total: number;
    averageScore: number;
  };
  status: 'active' | 'inactive' | 'completed';
}

interface CourseInfo {
  _id: string;
  title: string;
  thumbnail: string;
  totalStudents: number;
  averageProgress: number;
  status: 'published' | 'draft' | 'pending';
  field: string;
  level: 'basic' | 'intermediate' | 'advanced';
  price: number;
  sections: number;
  lessons: number;
  rating: number;
}

const StudentManagement: React.FC = () => {
  const { id: courseId } = useParams<{ id: string }>();
  const [courseInfo, setCourseInfo] = useState<CourseInfo | null>(null);
  const [courses, setCourses] = useState<CourseInfo[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'progress' | 'enrolledAt' | 'lastActive'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedCourse, setSelectedCourse] = useState<CourseInfo | null>(null);

  useEffect(() => {
    // Mock data - replace with API call
    setLoading(true);
    setTimeout(() => {
      const mockCourses: CourseInfo[] = [
        {
          _id: '1',
          title: 'React Advanced Patterns',
          thumbnail: '/images/course1.jpg',
          totalStudents: 156,
          averageProgress: 78.5,
          status: 'published',
          field: 'Web Development',
          level: 'advanced',
          price: 299000,
          sections: 8,
          lessons: 45,
          rating: 4.8
        },
        {
          _id: '2',
          title: 'Node.js Backend Development',
          thumbnail: '/images/course2.jpg',
          totalStudents: 89,
          averageProgress: 65.2,
          status: 'published',
          field: 'Backend Development',
          level: 'intermediate',
          price: 249000,
          sections: 6,
          lessons: 32,
          rating: 4.6
        },
        {
          _id: '3',
          title: 'UI/UX Design Fundamentals',
          thumbnail: '/images/course3.jpg',
          totalStudents: 0,
          averageProgress: 0,
          status: 'draft',
          field: 'Design',
          level: 'basic',
          price: 199000,
          sections: 4,
          lessons: 24,
          rating: 0
        },
        {
          _id: '4',
          title: 'Python Data Science',
          thumbnail: '/images/course4.jpg',
          totalStudents: 0,
          averageProgress: 0,
          status: 'pending',
          field: 'Data Science',
          level: 'intermediate',
          price: 349000,
          sections: 7,
          lessons: 38,
          rating: 0
        }
      ];

      setCourses(mockCourses);
      // Auto select the first course to immediately show students
      if (!selectedCourse && mockCourses.length) {
        setSelectedCourse(mockCourses[0]);
        setCourseInfo(mockCourses[0]);
      }
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (courseId && selectedCourse) {
      // Load students for specific course (mock)
      setLoading(true);
      setTimeout(() => {
        const names = [
          'Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C', 'Phạm Thị D', 'Hoàng Văn E', 'Vũ Thị F', 'Đặng Minh G', 'Bùi Thu H',
          'Phan Quốc I', 'Đỗ Kim K', 'Trịnh Gia L', 'Võ Thị M', 'Trương Công N', 'Lưu Hải P', 'Tạ Thu Q', 'Lý Minh R',
          'Đinh Hồng S', 'Ngô Nhật T', 'Cao Thảo U', 'La Bảo V', 'Tôn Nữ W', 'Chu Khánh X', 'Kiều Anh Y', 'Quách Duy Z'
        ];
        const avatars = ['/images/avatar1.jpg', '/images/avatar2.jpg', '/images/avatar3.jpg', '/images/avatar4.jpg'];
        const statuses: Array<Student['status']> = ['active', 'inactive', 'completed'];

        const mockStudents: Student[] = names.map((fullName, idx) => {
          const progress = Math.min(100, Math.max(0, Math.round(((idx * 13) % 101))));
          const totalLessons = 20 + ((idx * 3) % 10); // 20-29
          const completedLessons = Math.min(totalLessons, Math.round((progress / 100) * totalLessons));
          const submitted = Math.min(10, Math.round((progress / 100) * 10));
          const averageScore = submitted > 0 ? 60 + ((idx * 7) % 41) : 0; // 60-100 if submitted, else 0
          const status = statuses[idx % statuses.length];
          const daysAgo = 1 + (idx % 28);
          const enrolledDaysAgo = 30 + ((idx * 2) % 90);

          return {
            _id: `${idx + 1}`,
            name: fullName,
            email: `${fullName.toLowerCase().replace(/\s+/g, '')}@email.com`,
            avatar: avatars[idx % avatars.length],
            enrolledAt: new Date(Date.now() - enrolledDaysAgo * 24 * 3600 * 1000).toISOString(),
            lastActive: new Date(Date.now() - daysAgo * 24 * 3600 * 1000).toISOString(),
            progress,
            completedLessons,
            totalLessons,
            assignments: { submitted, total: 10, averageScore },
            status
          };
        });

        setStudents(mockStudents);
        setLoading(false);
      }, 500);
    }
  }, [courseId, selectedCourse]);

  const handleCourseSelect = (course: CourseInfo) => {
    setSelectedCourse(course);
    setCourseInfo(course);
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setCourseInfo(null);
    setStudents([]);
  };

  const getStatusColor = useCallback((status: string): 'success' | 'warning' | 'info' | 'default' => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'warning';
      case 'pending': return 'info';
      default: return 'default';
    }
  }, []);

  const getStatusText = useCallback((status: string) => {
    switch (status) {
      case 'published': return 'Đã xuất bản';
      case 'draft': return 'Bản nháp';
      case 'pending': return 'Chờ duyệt';
      default: return 'Không xác định';
    }
  }, []);

  const getLevelColor = useCallback((level: string): 'error' | 'warning' | 'info' | 'default' => {
    switch (level) {
      case 'advanced': return 'error';
      case 'intermediate': return 'warning';
      case 'basic': return 'info';
      default: return 'default';
    }
  }, []);

  const getLevelText = useCallback((level: string) => {
    switch (level) {
      case 'advanced': return 'Nâng cao';
      case 'intermediate': return 'Trung cấp';
      case 'basic': return 'Cơ bản';
      default: return 'Không xác định';
    }
  }, []);

  const getStudentStatusColor = useCallback((status: string): 'success' | 'warning' | 'default' => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'warning';
      case 'completed': return 'default';
      default: return 'default';
    }
  }, []);

  const getStudentStatusText = useCallback((status: string) => {
    switch (status) {
      case 'active': return 'Đang học';
      case 'inactive': return 'Không hoạt động';
      case 'completed': return 'Đã hoàn thành';
      default: return 'Không xác định';
    }
  }, []);

  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  }, []);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [students, searchTerm, statusFilter]);

  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];

      if (sortBy === 'enrolledAt' || sortBy === 'lastActive') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [filteredStudents, sortBy, sortOrder]);

  // If no course is selected, show course list
  if (!selectedCourse) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Breadcrumbs sx={{ mb: 2 }}>
            <Typography color="text.primary">Teacher Dashboard</Typography>
            <Typography color="text.secondary">Quản lý học viên</Typography>
          </Breadcrumbs>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
              Quản lý học viên
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Chọn khóa học để quản lý học viên
            </Typography>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h6" color="text.secondary">
              Đang tải dữ liệu...
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {courses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course._id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                  onClick={() => handleCourseSelect(course)}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={course.thumbnail}
                      alt={course.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    <Chip
                      label={getStatusText(course.status)}
                      color={getStatusColor(course.status)}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        fontWeight: 600
                      }}
                    />
                  </Box>

                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
                      {course.title}
                    </Typography>

                    <Stack spacing={1} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          Lĩnh vực:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {course.field}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          Cấp độ:
                        </Typography>
                        <Chip
                          label={getLevelText(course.level)}
                          color={getLevelColor(course.level)}
                          size="small"
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          Giá:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: 'primary.main' }}>
                          {formatPrice(course.price)} ₫
                        </Typography>
                      </Box>
                    </Stack>

                    <Grid container spacing={1} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <SchoolIcon fontSize="small" color="primary" />
                          <Typography variant="body2" color="text.secondary">
                            {course.sections} sections
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AssignmentIcon fontSize="small" color="primary" />
                          <Typography variant="body2" color="text.secondary">
                            {course.lessons} lessons
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PeopleIcon fontSize="small" color="primary" />
                          <Typography variant="body2" color="text.secondary">
                            {course.totalStudents} students
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <StarIcon fontSize="small" color="warning" />
                          <Typography variant="body2" color="text.secondary">
                            {course.rating}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<PeopleIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCourseSelect(course);
                      }}
                    >
                      Quản lý học viên
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    );
  }

  // If course is selected, show student management for that course
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Typography color="text.primary">Teacher Dashboard</Typography>
          <Typography color="text.primary">Quản lý học viên</Typography>
          <Typography color="text.secondary">{courseInfo?.title}</Typography>
        </Breadcrumbs>

        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBackToCourses}
            sx={{ minWidth: 'auto' }}
          >
            Quay lại
          </Button>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
              Quản lý học viên - {courseInfo?.title}
            </Typography>
            <Stack direction="row" spacing={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PeopleIcon color="primary" />
                <Typography variant="body1">
                  <strong>{courseInfo?.totalStudents}</strong> học viên
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUpIcon color="success" />
                <Typography variant="body1">
                  Tiến độ TB: <strong>{courseInfo?.averageProgress}%</strong>
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Tìm kiếm học viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  label="Trạng thái"
                  MenuProps={{ disableScrollLock: true }}
                >
                  <MenuItem value="all">Tất cả trạng thái</MenuItem>
                  <MenuItem value="active">Đang học</MenuItem>
                  <MenuItem value="inactive">Không hoạt động</MenuItem>
                  <MenuItem value="completed">Đã hoàn thành</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Sắp xếp theo</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  label="Sắp xếp theo"
                  MenuProps={{ disableScrollLock: true }}
                >
                  <MenuItem value="name">Tên</MenuItem>
                  <MenuItem value="progress">Tiến độ</MenuItem>
                  <MenuItem value="enrolledAt">Ngày đăng ký</MenuItem>
                  <MenuItem value="lastActive">Hoạt động cuối</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={2}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<FilterListIcon />}
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? 'Tăng dần' : 'Giảm dần'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Students List */}
      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h6" color="text.secondary">
            Đang tải dữ liệu...
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {sortedStudents.map((student) => (
            <Grid item xs={12} md={6} lg={4} key={student._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  {/* Student Info */}
                  <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                    <Avatar
                      src={student.avatar}
                      alt={student.name}
                      sx={{ width: 56, height: 56 }}
                    />
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {student.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {student.email}
                      </Typography>
                      <Stack direction="row" spacing={2}>
                        <Typography variant="caption" color="text.secondary">
                          ĐK: {formatDate(student.enrolledAt)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          HĐ: {formatDate(student.lastActive)}
                        </Typography>
                      </Stack>
                    </Box>
                    <Chip
                      label={getStudentStatusText(student.status)}
                      color={getStudentStatusColor(student.status)}
                      size="small"
                      icon={
                        student.status === 'active' ? <CheckCircleIcon /> :
                          student.status === 'inactive' ? <PauseCircleIcon /> :
                            <RadioButtonUncheckedIcon />
                      }
                    />
                  </Stack>

                  {/* Progress */}
                  <Box sx={{ mb: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Tiến độ học tập
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {student.progress}%
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={student.progress}
                      sx={{ mb: 1, height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {student.completedLessons}/{student.totalLessons} bài học
                    </Typography>
                  </Box>

                  {/* Assignments */}
                  <Stack spacing={1} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        Bài tập:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {student.assignments.submitted}/{student.assignments.total} đã nộp
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        Điểm TB:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: 'primary.main' }}>
                        {student.assignments.averageScore}/100
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="outlined"
                    startIcon={<VisibilityIcon />}
                    size="small"
                    sx={{ flexGrow: 1 }}
                  >
                    Chi tiết
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<MessageIcon />}
                    size="small"
                    sx={{ flexGrow: 1 }}
                  >
                    Tin nhắn
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}

          {/* Table view below */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Danh sách học viên</Typography>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Học viên</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell align="right">Tiến độ</TableCell>
                        <TableCell align="right">Bài đã học</TableCell>
                        <TableCell align="right">Bài tập</TableCell>
                        <TableCell align="right">Điểm TB</TableCell>
                        <TableCell>Trạng thái</TableCell>
                        <TableCell>Đăng ký</TableCell>
                        <TableCell>Hoạt động cuối</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sortedStudents.map((s) => (
                        <TableRow key={s._id} hover>
                          <TableCell>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Avatar src={s.avatar} sx={{ width: 28, height: 28 }} />
                              <Typography variant="body2">{s.name}</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>{s.email}</TableCell>
                          <TableCell align="right">{s.progress}%</TableCell>
                          <TableCell align="right">{s.completedLessons}/{s.totalLessons}</TableCell>
                          <TableCell align="right">{s.assignments.submitted}/{s.assignments.total}</TableCell>
                          <TableCell align="right">{s.assignments.averageScore}</TableCell>
                          <TableCell>
                            <Chip label={getStudentStatusText(s.status)} color={getStudentStatusColor(s.status)} size="small" />
                          </TableCell>
                          <TableCell>{formatDate(s.enrolledAt)}</TableCell>
                          <TableCell>{formatDate(s.lastActive)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default StudentManagement;
