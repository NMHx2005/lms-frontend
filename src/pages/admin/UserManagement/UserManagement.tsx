import React, { useState, useEffect, useCallback } from 'react';
// import './UserManagement.css';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  CircularProgress,
  Avatar,
  Checkbox,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  TableSortLabel,
  TablePagination,
  Paper,
  Tooltip,
  IconButton,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  Divider,
  Tabs,
  Tab,
  LinearProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AddIcon from '@mui/icons-material/Add';
import BlockIcon from '@mui/icons-material/Block';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LinkIcon from '@mui/icons-material/Link';
import { UserService, User, UserFilters, UserStats } from '../../../services/admin/userService';
import api from '../../../services/api';

interface UserFiltersState {
  search: string;
  role: string;
  status: string;
  subscriptionPlan: string;
  emailVerified: string;
  dateRange: string;
}

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  roles: string[];
  phone?: string;
  country?: string;
  bio?: string;
  avatar?: string;
}

interface EditUserData {
  name: string;
  email: string;
  roles: string[];
  phone?: string;
  country?: string;
  bio?: string;
  avatar?: string;
  isActive: boolean;
}

type SortKey = 'name' | 'roles' | 'isActive' | 'createdAt';

type SortDirection = 'asc' | 'desc';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [filters, setFilters] = useState<UserFiltersState>({
    search: '',
    role: 'all',
    status: 'all',
    subscriptionPlan: 'all',
    emailVerified: 'all',
    dateRange: 'all'
  });
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortKey>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [userStats, setUserStats] = useState<UserStats | null>(null);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showBulkRoleModal, setShowBulkRoleModal] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Selected user for edit/view
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form data
  const [createUserData, setCreateUserData] = useState<CreateUserData>({
    name: '',
    email: '',
    password: '',
    roles: ['student'],
    phone: '',
    country: '',
    bio: ''
  });

  const [editUserData, setEditUserData] = useState<EditUserData>({
    name: '',
    email: '',
    roles: ['student'],
    phone: '',
    country: '',
    bio: '',
    isActive: true
  });

  const [bulkRoleData, setBulkRoleData] = useState<string[]>(['student']);

  // Loading states
  const [actionLoading, setActionLoading] = useState(false);

  // Debounce search
  const [searchTimeout, setSearchTimeout] = useState<number | null>(null);

  // Avatar upload states
  const [avatarTab, setAvatarTab] = useState(0); // 0: URL, 1: Upload
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Load users data
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiFilters: UserFilters = {
        page: page + 1, // API uses 1-based pagination
        limit: rowsPerPage,
        sortBy,
        sortOrder: sortDirection,
      };

      if (filters.search) apiFilters.search = filters.search;
      if (filters.role !== 'all') apiFilters.roles = [filters.role];
      if (filters.status !== 'all') apiFilters.isActive = filters.status === 'active';

      const response = await UserService.getUsers(apiFilters);

      if (response.success) {
        setUsers(response.data.users);
        setTotalUsers(response.data.total);
      } else {
        setError(response.error || 'Không thể tải danh sách users');
      }
    } catch (err: any) {
      console.error('Error loading users:', err);
      setError(err.response?.data?.error || 'Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  // Load user stats
  const loadUserStats = async () => {
    try {
      const response = await UserService.getUserStats();
      if (response.success) {
        setUserStats(response.data);
      }
    } catch (err) {
      console.error('Error loading user stats:', err);
    }
  };

  useEffect(() => {
    loadUsers();
    loadUserStats();
  }, [page, rowsPerPage, sortBy, sortDirection, filters]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);


  const handleFilterChange = (newFilters: Partial<UserFiltersState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(0);
  };

  // Debounced search function
  const debouncedSearch = useCallback((searchValue: string) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      handleFilterChange({ search: searchValue });
    }, 500); // 500ms delay

    setSearchTimeout(timeout);
  }, [searchTimeout]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilters(prev => ({ ...prev, search: value }));
    debouncedSearch(value);
  };

  const handleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    const pageUserIds = users.map(u => u._id);
    const allSelected = pageUserIds.every(id => selectedUsers.includes(id));
    if (allSelected) {
      setSelectedUsers(prev => prev.filter(id => !pageUserIds.includes(id)));
    } else {
      setSelectedUsers(prev => Array.from(new Set([...prev, ...pageUserIds])));
    }
  };

  const handleBulkAction = async (action: 'ban' | 'unban' | 'delete') => {
    if (selectedUsers.length === 0) return;

    const actionText = { ban: 'khóa', unban: 'mở khóa', delete: 'xóa' }[action];
    if (confirm(`Bạn có chắc chắn muốn ${actionText} ${selectedUsers.length} user đã chọn?`)) {
      try {
        setLoading(true);

        if (action === 'delete') {
          // Delete users one by one
          for (const userId of selectedUsers) {
            await UserService.deleteUser(userId);
          }
          setSuccessMessage(`Đã xóa ${selectedUsers.length} user thành công`);
        } else {
          // Bulk update status
          const isActive = action === 'unban';
          await UserService.bulkUpdateUserStatus(selectedUsers, isActive);
          setSuccessMessage(`Đã ${actionText} ${selectedUsers.length} user thành công`);
        }

        setSelectedUsers([]);
        await loadUsers();
      } catch (err: any) {
        console.error(`Error ${action} users:`, err);
        setError(err.response?.data?.error || `Có lỗi xảy ra khi ${actionText} users`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUserAction = async (userId: string, action: 'ban' | 'unban' | 'delete') => {
    const user = users.find(u => u._id === userId);
    if (!user) return;

    const actionText = { ban: 'khóa', unban: 'mở khóa', delete: 'xóa' }[action];
    if (confirm(`Bạn có chắc chắn muốn ${actionText} user "${user.name}"?`)) {
      try {
        setLoading(true);

        if (action === 'delete') {
          await UserService.deleteUser(userId);
        } else {
          const isActive = action === 'unban';
          if (isActive) {
            await UserService.activateUser(userId);
          } else {
            await UserService.deactivateUser(userId);
          }
        }

        setSuccessMessage(`Đã ${actionText} user "${user.name}" thành công`);
        await loadUsers();
      } catch (err: any) {
        console.error(`Error ${action} user:`, err);
        setError(err.response?.data?.error || `Có lỗi xảy ra khi ${actionText} user`);
      } finally {
        setLoading(false);
      }
    }
  };

  const getRoleLabel = (roles: string[]) => {
    if (roles.includes('admin')) return 'Quản trị viên';
    if (roles.includes('teacher')) return 'Giảng viên';
    if (roles.includes('student')) return 'Học viên';
    return roles.join(', ');
  };

  const getStatusLabel = (isActive: boolean) => {
    return isActive ? 'Hoạt động' : 'Đã khóa';
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('vi-VN');

  const handleRequestSort = (property: SortKey) => {
    const isAsc = sortBy === property && sortDirection === 'asc';
    setSortBy(property);
    setSortDirection(isAsc ? 'desc' : 'asc');
  };

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const exportCsv = () => {
    const rows = users.map(u => ({
      id: u._id,
      name: u.name,
      email: u.email,
      roles: getRoleLabel(u.roles || []),
      status: getStatusLabel(u.isActive),
      createdAt: formatDate(u.createdAt)
    }));
    const header = Object.keys(rows[0] || {}).join(',');
    const body = rows.map(r => Object.values(r).map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const csv = [header, body].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'users.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccessMessage(null);
  };

  // Create User
  const handleCreateUser = async () => {
    try {
      setActionLoading(true);

      // Prepare create data
      let createData = { ...createUserData };

      // Handle avatar upload if file is selected
      if (avatarTab === 1 && avatarFile) {
        // For create user, we need to upload to a temporary endpoint first
        // We'll use the upload service directly
        const formData = new FormData();
        formData.append('profilePicture', avatarFile);

        try {
          const uploadResponse = await api.post('/upload/profile-picture', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          if (uploadResponse.data.success) {
            createData.avatar = uploadResponse.data.data.secureUrl;
          } else {
            setError('Không thể upload avatar');
            return;
          }
        } catch (error: any) {
          console.error('Avatar upload error:', error);
          setError(error.response?.data?.error || 'Không thể upload avatar');
          return;
        }
      }

      const response = await UserService.createUser(createData);

      if (response.success) {
        setSuccessMessage('Tạo user thành công');
        setShowCreateModal(false);
        setCreateUserData({
          name: '',
          email: '',
          password: '',
          roles: ['student'],
          phone: '',
          country: '',
          bio: '',
          avatar: ''
        });
        // Reset avatar states
        setAvatarFile(null);
        setAvatarPreview(null);
        setAvatarTab(0);
        await loadUsers();
      } else {
        setError(response.error || 'Không thể tạo user');
      }
    } catch (err: any) {
      console.error('Error creating user:', err);
      setError(err.response?.data?.error || 'Có lỗi xảy ra khi tạo user');
    } finally {
      setActionLoading(false);
    }
  };

  // Edit User
  const handleEditUser = async () => {
    if (!selectedUser) return;

    try {
      setActionLoading(true);

      // Prepare update data
      let updateData = { ...editUserData };

      // Handle avatar upload if file is selected
      if (avatarTab === 1 && avatarFile) {
        const avatarUrl = await uploadAvatarFile(selectedUser._id);
        if (avatarUrl) {
          updateData.avatar = avatarUrl;
        }
      }

      const response = await UserService.updateUser(selectedUser._id, updateData);

      if (response.success) {
        setSuccessMessage('Cập nhật user thành công');
        setShowEditModal(false);
        setSelectedUser(null);
        // Reset avatar states
        setAvatarFile(null);
        setAvatarPreview(null);
        setAvatarTab(0);
        await loadUsers();
      } else {
        setError(response.error || 'Không thể cập nhật user');
      }
    } catch (err: any) {
      console.error('Error updating user:', err);
      setError(err.response?.data?.error || 'Có lỗi xảy ra khi cập nhật user');
    } finally {
      setActionLoading(false);
    }
  };

  // View User Details
  const handleViewUser = async (userId: string) => {
    try {
      const response = await UserService.getUserById(userId);
      if (response.success) {
        setSelectedUser(response.data);
        setShowViewModal(true);
      } else {
        setError(response.error || 'Không thể lấy thông tin user');
      }
    } catch (err: any) {
      console.error('Error getting user:', err);
      setError(err.response?.data?.error || 'Có lỗi xảy ra khi lấy thông tin user');
    }
  };

  // Edit User (open modal)
  const handleEditUserClick = async (userId: string) => {
    try {
      console.log('Getting user with ID:', userId);
      const response = await UserService.getUserById(userId);
      if (response.success) {
        const user = response.data;
        setEditUserData({
          name: user.name,
          email: user.email,
          roles: user.roles || ['student'],
          phone: user.phone || '',
          country: user.country || '',
          bio: user.bio || '',
          avatar: user.avatar || '',
          isActive: user.isActive
        });
        setSelectedUser(user);
        // Reset avatar states
        setAvatarFile(null);
        setAvatarPreview(null);
        setAvatarTab(0);
        setShowEditModal(true);
      } else {
        setError(response.error || 'Không thể lấy thông tin user');
      }
    } catch (err: any) {
      console.error('Error getting user:', err);
      setError(err.response?.data?.error || 'Có lỗi xảy ra khi lấy thông tin user');
    }
  };

  // Bulk Role Update
  const handleBulkRoleUpdate = async () => {
    if (selectedUsers.length === 0) return;

    try {
      setActionLoading(true);
      const response = await UserService.bulkUpdateUserRoles(selectedUsers, bulkRoleData);

      if (response.success) {
        setSuccessMessage(`Cập nhật role cho ${selectedUsers.length} user thành công`);
        setShowBulkRoleModal(false);
        setSelectedUsers([]);
        await loadUsers();
      } else {
        setError(response.error || 'Không thể cập nhật roles');
      }
    } catch (err: any) {
      console.error('Error updating roles:', err);
      setError(err.response?.data?.error || 'Có lỗi xảy ra khi cập nhật roles');
    } finally {
      setActionLoading(false);
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      search: '',
      role: 'all',
      status: 'all',
      subscriptionPlan: 'all',
      emailVerified: 'all',
      dateRange: 'all'
    });
    setPage(0);
  };

  // Refresh data
  const handleRefresh = () => {
    loadUsers();
    loadUserStats();
  };

  // Avatar upload functions
  const handleAvatarFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatarFile = async (userId?: string): Promise<string | null> => {
    if (!avatarFile) return null;

    try {
      setUploadingAvatar(true);
      const formData = new FormData();
      formData.append('profilePicture', avatarFile);

      // For create user, we'll use a temporary ID and handle it differently
      const targetUserId = userId || selectedUser?._id || 'temp';

      const response = await api.post(`/admin/users/${targetUserId}/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload response status:', response.status);
      console.log('Upload response data:', response.data);

      if (response.data.success) {
        return response.data.data.avatar;
      } else {
        throw new Error(response.data.error || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      setError(error.response?.data?.error || 'Không thể upload avatar');
      return null;
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleAvatarTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setAvatarTab(newValue);
    // Reset avatar states when switching tabs
    if (newValue === 0) {
      setAvatarFile(null);
      setAvatarPreview(null);
    }
  };

  // Remove the full component loading state - only show loading in table

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Header */}
      <Card sx={{ background: 'linear-gradient(135deg, #5b8def 0%, #8b5cf6 100%)', color: 'white', borderRadius: 2 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={2}>
            <Box>
              <Typography variant="h5" fontWeight={600}>Quản lý User</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Quản lý tất cả người dùng trong hệ thống</Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button variant="contained" color="inherit" startIcon={<FileDownloadIcon />} sx={{ color: '#111827' }} onClick={exportCsv}>Xuất CSV</Button>
              <Button variant="contained" color="inherit" startIcon={<RefreshIcon />} sx={{ color: '#111827' }} onClick={handleRefresh}>Làm mới</Button>
              <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={() => {
                // Reset avatar states when opening create modal
                setAvatarFile(null);
                setAvatarPreview(null);
                setAvatarTab(0);
                setShowCreateModal(true);
              }}>Thêm User</Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Stats */}
      {userStats && (
        <Grid container spacing={2}>
          <Grid item xs={6} md={2.4}>
            <Card>
              <CardContent>
                <Stack alignItems="center">
                  <Typography variant="h6" fontWeight={800}>{userStats.totalUsers}</Typography>
                  <Typography variant="caption">Tổng users</Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={2.4}>
            <Card>
              <CardContent>
                <Stack alignItems="center">
                  <Typography variant="h6" fontWeight={800}>{userStats.activeUsers}</Typography>
                  <Typography variant="caption">Hoạt động</Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={2.4}>
            <Card>
              <CardContent>
                <Stack alignItems="center">
                  <Typography variant="h6" fontWeight={800}>
                    {userStats.usersByRole.find(r => r.role === 'admin')?.count || 0}
                  </Typography>
                  <Typography variant="caption">Admin</Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={2.4}>
            <Card>
              <CardContent>
                <Stack alignItems="center">
                  <Typography variant="h6" fontWeight={800}>
                    {userStats.usersByRole.find(r => r.role === 'teacher')?.count || 0}
                  </Typography>
                  <Typography variant="caption">Giảng viên</Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={2.4}>
            <Card>
              <CardContent>
                <Stack alignItems="center">
                  <Typography variant="h6" fontWeight={800}>
                    {userStats.usersByRole.find(r => r.role === 'student')?.count || 0}
                  </Typography>
                  <Typography variant="caption">Học viên</Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Filters */}
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6">Bộ lọc</Typography>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              Bộ lọc nâng cao
            </Button>
            <Button
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={handleClearFilters}
            >
              Xóa bộ lọc
            </Button>
          </Stack>
        </Stack>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={filters.search}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Vai trò</InputLabel>
              <Select
                label="Vai trò"
                value={filters.role}
                onChange={(e) => handleFilterChange({ role: e.target.value })}
                MenuProps={{ disableScrollLock: true }}
              >
                <MenuItem value="all">Tất cả vai trò</MenuItem>
                <MenuItem value="student">Học viên</MenuItem>
                <MenuItem value="teacher">Giảng viên</MenuItem>
                <MenuItem value="admin">Quản trị viên</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                label="Trạng thái"
                value={filters.status}
                onChange={(e) => handleFilterChange({ status: e.target.value })}
                MenuProps={{ disableScrollLock: true }}
              >
                <MenuItem value="all">Tất cả trạng thái</MenuItem>
                <MenuItem value="active">Hoạt động</MenuItem>
                <MenuItem value="inactive">Đã khóa</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Gói đăng ký</InputLabel>
                  <Select
                    label="Gói đăng ký"
                    value={filters.subscriptionPlan}
                    onChange={(e) => handleFilterChange({ subscriptionPlan: e.target.value })}
                    MenuProps={{ disableScrollLock: true }}
                  >
                    <MenuItem value="all">Tất cả gói</MenuItem>
                    <MenuItem value="free">Miễn phí</MenuItem>
                    <MenuItem value="premium">Premium</MenuItem>
                    <MenuItem value="pro">Pro</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Xác thực email</InputLabel>
                  <Select
                    label="Xác thực email"
                    value={filters.emailVerified}
                    onChange={(e) => handleFilterChange({ emailVerified: e.target.value })}
                    MenuProps={{ disableScrollLock: true }}
                  >
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="verified">Đã xác thực</MenuItem>
                    <MenuItem value="unverified">Chưa xác thực</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Khoảng thời gian</InputLabel>
                  <Select
                    label="Khoảng thời gian"
                    value={filters.dateRange}
                    onChange={(e) => handleFilterChange({ dateRange: e.target.value })}
                    MenuProps={{ disableScrollLock: true }}
                  >
                    <MenuItem value="all">Tất cả thời gian</MenuItem>
                    <MenuItem value="today">Hôm nay</MenuItem>
                    <MenuItem value="week">Tuần này</MenuItem>
                    <MenuItem value="month">Tháng này</MenuItem>
                    <MenuItem value="year">Năm nay</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <Paper sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip color="primary" label={`Đã chọn ${selectedUsers.length} user`} />
            <Button onClick={() => setSelectedUsers([])}>Bỏ chọn tất cả</Button>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" color="error" startIcon={<BlockIcon />} onClick={() => handleBulkAction('ban')}>
              Khóa ({selectedUsers.length})
            </Button>
            <Button variant="outlined" color="success" startIcon={<LockOpenIcon />} onClick={() => handleBulkAction('unban')}>
              Mở khóa ({selectedUsers.length})
            </Button>
            <Button variant="outlined" color="info" startIcon={<PersonAddIcon />} onClick={() => setShowBulkRoleModal(true)}>
              Cập nhật Role ({selectedUsers.length})
            </Button>
            <Button variant="contained" color="error" startIcon={<DeleteOutlineIcon />} onClick={() => handleBulkAction('delete')}>
              Xóa ({selectedUsers.length})
            </Button>
          </Stack>
        </Paper>
      )}

      {/* Users Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, position: 'relative' }}>
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
              borderRadius: 2
            }}
          >
            <Stack spacing={2} alignItems="center">
              <CircularProgress size={40} />
              <Typography variant="body2" color="text.secondary">Đang tải dữ liệu...</Typography>
            </Stack>
          </Box>
        )}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={users.every(u => selectedUsers.includes(u._id)) && users.length > 0}
                  indeterminate={users.some(u => selectedUsers.includes(u._id)) && !users.every(u => selectedUsers.includes(u._id))}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell sortDirection={sortBy === 'name' ? sortDirection : false}>
                <TableSortLabel active={sortBy === 'name'} direction={sortBy === 'name' ? sortDirection : 'asc'} onClick={() => handleRequestSort('name')}>
                  Thông tin
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={sortBy === 'roles' ? sortDirection : false}>
                <TableSortLabel active={sortBy === 'roles'} direction={sortBy === 'roles' ? sortDirection : 'asc'} onClick={() => handleRequestSort('roles')}>
                  Vai trò
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={sortBy === 'isActive' ? sortDirection : false}>
                <TableSortLabel active={sortBy === 'isActive'} direction={sortBy === 'isActive' ? sortDirection : 'asc'} onClick={() => handleRequestSort('isActive')}>
                  Trạng thái
                </TableSortLabel>
              </TableCell>
              <TableCell>Thống kê</TableCell>
              <TableCell sortDirection={sortBy === 'createdAt' ? sortDirection : false}>
                <TableSortLabel active={sortBy === 'createdAt'} direction={sortBy === 'createdAt' ? sortDirection : 'asc'} onClick={() => handleRequestSort('createdAt')}>
                  Ngày tạo
                </TableSortLabel>
              </TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => handleUserSelection(user._id)}
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar src={user.avatar}>{user.name.charAt(0).toUpperCase()}</Avatar>
                    <Box>
                      <Typography fontWeight={700}>{user.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getRoleLabel(user.roles || [])}
                    color={user.roles?.includes('admin') ? 'secondary' : user.roles?.includes('teacher') ? 'info' : 'default'}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(user.isActive)}
                    color={user.isActive ? 'success' : 'error'}
                    variant={user.isActive ? 'filled' : 'outlined'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={3}>
                    <Stack direction="row" spacing={1}>
                      <Typography variant="body2" color="text.secondary">Đăng ký:</Typography>
                      <Typography variant="body2" fontWeight={700}>{user.stats?.totalCoursesEnrolled || 0}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <Typography variant="body2" color="text.secondary">Hoàn thành:</Typography>
                      <Typography variant="body2" fontWeight={700}>{user.stats?.totalCoursesCompleted || 0}</Typography>
                    </Stack>
                  </Stack>
                </TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5}>
                    {user.isActive ? (
                      <Tooltip title="Khóa user">
                        <span>
                          <IconButton color="error" onClick={() => handleUserAction(user._id, 'ban')}>
                            <BlockIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Mở khóa user">
                        <span>
                          <IconButton color="success" onClick={() => handleUserAction(user._id, 'unban')}>
                            <LockOpenIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    )}
                    <Tooltip title="Xem chi tiết">
                      <span>
                        <IconButton color="info" onClick={() => handleViewUser(user._id)}>
                          <VisibilityIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                      <span>
                        <IconButton color="primary" onClick={() => handleEditUserClick(user._id)}>
                          <EditIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Xóa user">
                      <span>
                        <IconButton color="error" onClick={() => handleUserAction(user._id, 'delete')}>
                          <DeleteOutlineIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={totalUsers}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{ px: 2 }}
        />
      </TableContainer>

      {/* Empty State */}
      {users.length === 0 && !loading && (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>Không có user nào</Typography>
          <Typography variant="body2" color="text.secondary">
            {filters.search || filters.role !== 'all' || filters.status !== 'all'
              ? 'Không tìm thấy user nào phù hợp với bộ lọc hiện tại'
              : 'Chưa có user nào trong hệ thống'}
          </Typography>
        </Paper>
      )}

      {/* Snackbars */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Create User Modal */}
      <Dialog open={showCreateModal} onClose={() => setShowCreateModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Tạo User Mới</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tên"
                value={createUserData.name}
                onChange={(e) => setCreateUserData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={createUserData.email}
                onChange={(e) => setCreateUserData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mật khẩu"
                type="password"
                value={createUserData.password}
                onChange={(e) => setCreateUserData(prev => ({ ...prev, password: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Vai trò</InputLabel>
                <Select
                  multiple
                  value={createUserData.roles}
                  onChange={(e) => setCreateUserData(prev => ({ ...prev, roles: e.target.value as string[] }))}
                  MenuProps={{ disableScrollLock: true }}
                >
                  <MenuItem value="student">Học viên</MenuItem>
                  <MenuItem value="teacher">Giảng viên</MenuItem>
                  <MenuItem value="admin">Quản trị viên</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Số điện thoại"
                value={createUserData.phone}
                onChange={(e) => setCreateUserData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quốc gia"
                value={createUserData.country}
                onChange={(e) => setCreateUserData(prev => ({ ...prev, country: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Avatar
              </Typography>
              <Tabs value={avatarTab} onChange={handleAvatarTabChange} sx={{ mb: 2 }}>
                <Tab
                  icon={<LinkIcon />}
                  label="URL"
                  iconPosition="start"
                  sx={{ minHeight: 48 }}
                />
                <Tab
                  icon={<CloudUploadIcon />}
                  label="Upload File"
                  iconPosition="start"
                  sx={{ minHeight: 48 }}
                />
              </Tabs>

              {avatarTab === 0 ? (
                <TextField
                  fullWidth
                  label="URL Avatar"
                  value={createUserData.avatar || ''}
                  onChange={(e) => setCreateUserData(prev => ({ ...prev, avatar: e.target.value }))}
                  placeholder="https://example.com/avatar.jpg"
                  helperText="URL hình ảnh đại diện (phải bắt đầu bằng http:// hoặc https://)"
                />
              ) : (
                <Box>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="create-avatar-upload"
                    type="file"
                    onChange={handleAvatarFileChange}
                  />
                  <label htmlFor="create-avatar-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<CloudUploadIcon />}
                      fullWidth
                      sx={{ mb: 2 }}
                    >
                      Chọn file avatar
                    </Button>
                  </label>

                  {avatarFile && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        File đã chọn: {avatarFile.name}
                      </Typography>
                      {avatarPreview && (
                        <Avatar
                          src={avatarPreview}
                          sx={{ width: 100, height: 100, mx: 'auto', display: 'block' }}
                        />
                      )}
                    </Box>
                  )}

                  {uploadingAvatar && (
                    <Box sx={{ mt: 2 }}>
                      <LinearProgress />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Đang upload...
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Giới thiệu"
                multiline
                rows={3}
                value={createUserData.bio}
                onChange={(e) => setCreateUserData(prev => ({ ...prev, bio: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateModal(false)}>Hủy</Button>
          <Button onClick={handleCreateUser} variant="contained" disabled={actionLoading}>
            {actionLoading ? <CircularProgress size={20} /> : 'Tạo User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={showEditModal} onClose={() => setShowEditModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Chỉnh sửa User</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tên đầy đủ"
                value={editUserData.name}
                onChange={(e) => setEditUserData(prev => ({ ...prev, name: e.target.value }))}
                required
                helperText="Tên đầy đủ của người dùng"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={editUserData.email}
                onChange={(e) => setEditUserData(prev => ({ ...prev, email: e.target.value }))}
                required
                helperText="Địa chỉ email để đăng nhập"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Vai trò</InputLabel>
                <Select
                  multiple
                  value={editUserData.roles}
                  onChange={(e) => setEditUserData(prev => ({ ...prev, roles: e.target.value as string[] }))}
                  MenuProps={{ disableScrollLock: true }}
                >
                  <MenuItem value="student">Học viên</MenuItem>
                  <MenuItem value="teacher">Giảng viên</MenuItem>
                  <MenuItem value="admin">Quản trị viên</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={editUserData.isActive}
                    onChange={(e) => setEditUserData(prev => ({ ...prev, isActive: e.target.checked }))}
                  />
                }
                label="Trạng thái hoạt động"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Số điện thoại"
                value={editUserData.phone || ''}
                onChange={(e) => setEditUserData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="0123456789"
                helperText="Số điện thoại liên hệ (10-15 ký tự)"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quốc gia"
                value={editUserData.country || ''}
                onChange={(e) => setEditUserData(prev => ({ ...prev, country: e.target.value }))}
                placeholder="Việt Nam"
                helperText="Quốc gia cư trú"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Avatar
              </Typography>
              <Tabs value={avatarTab} onChange={handleAvatarTabChange} sx={{ mb: 2 }}>
                <Tab
                  icon={<LinkIcon />}
                  label="URL"
                  iconPosition="start"
                  sx={{ minHeight: 48 }}
                />
                <Tab
                  icon={<CloudUploadIcon />}
                  label="Upload File"
                  iconPosition="start"
                  sx={{ minHeight: 48 }}
                />
              </Tabs>

              {avatarTab === 0 ? (
                <TextField
                  fullWidth
                  label="URL Avatar"
                  value={editUserData.avatar || ''}
                  onChange={(e) => setEditUserData(prev => ({ ...prev, avatar: e.target.value }))}
                  placeholder="https://example.com/avatar.jpg"
                  helperText="URL hình ảnh đại diện (phải bắt đầu bằng http:// hoặc https://)"
                />
              ) : (
                <Box>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="avatar-upload"
                    type="file"
                    onChange={handleAvatarFileChange}
                  />
                  <label htmlFor="avatar-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<CloudUploadIcon />}
                      fullWidth
                      sx={{ mb: 2 }}
                    >
                      Chọn file avatar
                    </Button>
                  </label>

                  {avatarFile && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        File đã chọn: {avatarFile.name}
                      </Typography>
                      {avatarPreview && (
                        <Avatar
                          src={avatarPreview}
                          sx={{ width: 100, height: 100, mx: 'auto', display: 'block' }}
                        />
                      )}
                    </Box>
                  )}

                  {uploadingAvatar && (
                    <Box sx={{ mt: 2 }}>
                      <LinearProgress />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Đang upload...
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Giới thiệu bản thân"
                multiline
                rows={3}
                value={editUserData.bio || ''}
                onChange={(e) => setEditUserData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Mô tả ngắn về bản thân..."
                helperText="Thông tin giới thiệu về người dùng (tối đa 500 ký tự)"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEditModal(false)}>Hủy</Button>
          <Button onClick={handleEditUser} variant="contained" disabled={actionLoading}>
            {actionLoading ? <CircularProgress size={20} /> : 'Cập nhật'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View User Modal */}
      <Dialog open={showViewModal} onClose={() => setShowViewModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Chi tiết User</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={4}>
                <Avatar src={selectedUser.avatar} sx={{ width: 100, height: 100, mx: 'auto' }}>
                  {selectedUser.name.charAt(0).toUpperCase()}
                </Avatar>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Typography variant="h6" gutterBottom>{selectedUser.name}</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>{selectedUser.email}</Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  {selectedUser.roles?.map(role => (
                    <Chip key={role} label={getRoleLabel([role])} size="small" />
                  ))}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>Thông tin chi tiết</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Trạng thái:</Typography>
                <Chip
                  label={getStatusLabel(selectedUser.isActive)}
                  color={selectedUser.isActive ? 'success' : 'error'}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Ngày tạo:</Typography>
                <Typography variant="body2">{formatDate(selectedUser.createdAt)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Số điện thoại:</Typography>
                <Typography variant="body2">{selectedUser.phone || 'Chưa cập nhật'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Quốc gia:</Typography>
                <Typography variant="body2">{selectedUser.country || 'Chưa cập nhật'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">Giới thiệu:</Typography>
                <Typography variant="body2">{selectedUser.bio || 'Chưa cập nhật'}</Typography>
              </Grid>
              {selectedUser.stats && (
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>Thống kê học tập</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="body2" color="text.secondary">Khóa đã đăng ký:</Typography>
                      <Typography variant="h6">{selectedUser.stats.totalCoursesEnrolled}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="body2" color="text.secondary">Khóa đã hoàn thành:</Typography>
                      <Typography variant="h6">{selectedUser.stats.totalCoursesCompleted}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="body2" color="text.secondary">Bài tập đã nộp:</Typography>
                      <Typography variant="h6">{selectedUser.stats.totalAssignmentsSubmitted}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="body2" color="text.secondary">Điểm trung bình:</Typography>
                      <Typography variant="h6">{selectedUser.stats.averageScore}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowViewModal(false)}>Đóng</Button>
          <Button onClick={() => {
            setShowViewModal(false);
            if (selectedUser) handleEditUserClick(selectedUser._id);
          }} variant="contained">
            Chỉnh sửa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Role Update Modal */}
      <Dialog open={showBulkRoleModal} onClose={() => setShowBulkRoleModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Cập nhật Role cho {selectedUsers.length} User</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Vai trò mới</InputLabel>
            <Select
              multiple
              value={bulkRoleData}
              onChange={(e) => setBulkRoleData(e.target.value as string[])}
              MenuProps={{ disableScrollLock: true }}
            >
              <MenuItem value="student">Học viên</MenuItem>
              <MenuItem value="teacher">Giảng viên</MenuItem>
              <MenuItem value="admin">Quản trị viên</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowBulkRoleModal(false)}>Hủy</Button>
          <Button onClick={handleBulkRoleUpdate} variant="contained" disabled={actionLoading}>
            {actionLoading ? <CircularProgress size={20} /> : 'Cập nhật'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
