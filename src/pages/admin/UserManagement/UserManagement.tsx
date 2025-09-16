import React, { useState, useEffect, useMemo } from 'react';
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
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AddIcon from '@mui/icons-material/Add';
import BlockIcon from '@mui/icons-material/Block';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  status: 'active' | 'banned' | 'pending';
  createdAt: string;
  lastLogin: string;
  courseCount: number;
  enrollmentCount: number;
}

interface UserFilters {
  search: string;
  role: string;
  status: string;
}

type SortKey = 'name' | 'role' | 'status' | 'createdAt';

type SortDirection = 'asc' | 'desc';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    role: 'all',
    status: 'all'
  });
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortKey>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockUsers: User[] = [
        {
          _id: '1',
          name: 'Nguyễn Văn A',
          email: 'nguyenvana@email.com',
          role: 'student',
          status: 'active',
          createdAt: '2024-01-15T00:00:00Z',
          lastLogin: '2024-01-20T10:30:00Z',
          courseCount: 0,
          enrollmentCount: 3
        },
        {
          _id: '2',
          name: 'Trần Thị B',
          email: 'tranthib@email.com',
          role: 'teacher',
          status: 'active',
          createdAt: '2024-01-10T00:00:00Z',
          lastLogin: '2024-01-20T09:15:00Z',
          courseCount: 2,
          enrollmentCount: 0
        },
        {
          _id: '3',
          name: 'Lê Văn C',
          email: 'levanc@email.com',
          role: 'student',
          status: 'banned',
          createdAt: '2024-01-05T00:00:00Z',
          lastLogin: '2024-01-18T14:20:00Z',
          courseCount: 0,
          enrollmentCount: 1
        },
        {
          _id: '4',
          name: 'Phạm Thị D',
          email: 'phamthid@email.com',
          role: 'teacher',
          status: 'pending',
          createdAt: '2024-01-20T00:00:00Z',
          lastLogin: '2024-01-20T08:45:00Z',
          courseCount: 0,
          enrollmentCount: 0
        },
        {
          _id: '5',
          name: 'Hoàng Văn E',
          email: 'hoangvane@email.com',
          role: 'admin',
          status: 'active',
          createdAt: '2024-01-01T00:00:00Z',
          lastLogin: '2024-01-20T11:00:00Z',
          courseCount: 0,
          enrollmentCount: 0
        }
      ];
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  // Derived: filtered, sorted, paginated
  const filteredUsers = useMemo(() => {
    const filtered = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase());
      const matchesRole = filters.role === 'all' || user.role === filters.role;
      const matchesStatus = filters.status === 'all' || user.status === filters.status;
      return matchesSearch && matchesRole && matchesStatus;
    });
    // sort
    const sorted = [...filtered].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (sortBy === 'createdAt') {
        const aTime = new Date(aVal as string).getTime();
        const bTime = new Date(bVal as string).getTime();
        return sortDirection === 'asc' ? aTime - bTime : bTime - aTime;
      }
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      if (aStr < bStr) return sortDirection === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [users, filters, sortBy, sortDirection]);

  const paginatedUsers = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredUsers.slice(start, end);
  }, [filteredUsers, page, rowsPerPage]);

  const handleFilterChange = (newFilters: Partial<UserFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(0);
  };

  const handleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    const pageUserIds = paginatedUsers.map(u => u._id);
    const allSelected = pageUserIds.every(id => selectedUsers.includes(id));
    if (allSelected) {
      setSelectedUsers(prev => prev.filter(id => !pageUserIds.includes(id)));
    } else {
      setSelectedUsers(prev => Array.from(new Set([...prev, ...pageUserIds])));
    }
  };

  const handleBulkAction = (action: 'ban' | 'unban' | 'delete') => {
    if (selectedUsers.length === 0) return;
    const actionText = { ban: 'khóa', unban: 'mở khóa', delete: 'xóa' }[action];
    if (confirm(`Bạn có chắc chắn muốn ${actionText} ${selectedUsers.length} user đã chọn?`)) {
      setUsers(prev => prev.map(user => {
        if (selectedUsers.includes(user._id)) {
          if (action === 'delete') return { ...user, _id: `deleted-${user._id}` };
          if (action === 'ban') return { ...user, status: 'banned' as const };
          if (action === 'unban') return { ...user, status: 'active' as const };
        }
        return user;
      }));
      setSelectedUsers([]);
    }
  };

  const handleUserAction = (userId: string, action: 'ban' | 'unban' | 'delete') => {
    const user = users.find(u => u._id === userId);
    if (!user) return;
    const actionText = { ban: 'khóa', unban: 'mở khóa', delete: 'xóa' }[action];
    if (confirm(`Bạn có chắc chắn muốn ${actionText} user "${user.name}"?`)) {
      setUsers(prev => prev.map(u => {
        if (u._id === userId) {
          if (action === 'delete') return { ...u, _id: `deleted-${u._id}` };
          if (action === 'ban') return { ...u, status: 'banned' as const };
          if (action === 'unban') return { ...u, status: 'active' as const };
        }
        return u;
      }));
    }
  };

  const getRoleLabel = (role: string) => {
    const labels = { student: 'Học viên', teacher: 'Giảng viên', admin: 'Quản trị viên' };
    return labels[role as keyof typeof labels] || role;
  };

  const getStatusLabel = (status: string) => {
    const labels = { active: 'Hoạt động', banned: 'Đã khóa', pending: 'Chờ duyệt' };
    return labels[status as keyof typeof labels] || status;
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
    const rows = filteredUsers.map(u => ({
      id: u._id,
      name: u.name,
      email: u.email,
      role: getRoleLabel(u.role),
      status: getStatusLabel(u.status),
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">Đang tải dữ liệu...</Typography>
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
              <Typography variant="h5" fontWeight={800}>Quản lý User</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Quản lý tất cả người dùng trong hệ thống</Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button variant="contained" color="inherit" startIcon={<FileDownloadIcon />} sx={{ color: '#111827' }} onClick={exportCsv}>Xuất CSV</Button>
              <Button variant="contained" color="secondary" startIcon={<AddIcon />}>Thêm User</Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Filters */}
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
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
              >
                <MenuItem value="all">Tất cả trạng thái</MenuItem>
                <MenuItem value="active">Hoạt động</MenuItem>
                <MenuItem value="banned">Đã khóa</MenuItem>
                <MenuItem value="pending">Chờ duyệt</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
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
            <Button variant="contained" color="error" startIcon={<DeleteOutlineIcon />} onClick={() => handleBulkAction('delete')}>
              Xóa ({selectedUsers.length})
            </Button>
          </Stack>
        </Paper>
      )}

      {/* Users Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={paginatedUsers.every(u => selectedUsers.includes(u._id)) && paginatedUsers.length > 0}
                  indeterminate={paginatedUsers.some(u => selectedUsers.includes(u._id)) && !paginatedUsers.every(u => selectedUsers.includes(u._id))}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell sortDirection={sortBy === 'name' ? sortDirection : false}>
                <TableSortLabel active={sortBy === 'name'} direction={sortBy === 'name' ? sortDirection : 'asc'} onClick={() => handleRequestSort('name')}>
                  Thông tin
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={sortBy === 'role' ? sortDirection : false}>
                <TableSortLabel active={sortBy === 'role'} direction={sortBy === 'role' ? sortDirection : 'asc'} onClick={() => handleRequestSort('role')}>
                  Vai trò
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={sortBy === 'status' ? sortDirection : false}>
                <TableSortLabel active={sortBy === 'status'} direction={sortBy === 'status' ? sortDirection : 'asc'} onClick={() => handleRequestSort('status')}>
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
            {paginatedUsers.map((user) => (
              <TableRow key={user._id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => handleUserSelection(user._id)}
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar>{user.name.charAt(0).toUpperCase()}</Avatar>
                    <Box>
                      <Typography fontWeight={700}>{user.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getRoleLabel(user.role)}
                    color={user.role === 'admin' ? 'secondary' : user.role === 'teacher' ? 'info' : 'default'}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(user.status)}
                    color={user.status === 'active' ? 'success' : user.status === 'banned' ? 'error' : 'warning'}
                    variant={user.status === 'active' ? 'filled' : 'outlined'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={3}>
                    <Stack direction="row" spacing={1}>
                      <Typography variant="body2" color="text.secondary">Khóa học:</Typography>
                      <Typography variant="body2" fontWeight={700}>{user.courseCount}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <Typography variant="body2" color="text.secondary">Đăng ký:</Typography>
                      <Typography variant="body2" fontWeight={700}>{user.enrollmentCount}</Typography>
                    </Stack>
                  </Stack>
                </TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5}>
                    {user.status === 'active' ? (
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
                    <Tooltip title="Chỉnh sửa">
                      <span>
                        <IconButton color="primary">
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
          count={filteredUsers.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{ px: 2 }}
        />
      </TableContainer>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>Không có user nào</Typography>
          <Typography variant="body2" color="text.secondary">
            {filters.search || filters.role !== 'all' || filters.status !== 'all'
              ? 'Không tìm thấy user nào phù hợp với bộ lọc hiện tại'
              : 'Chưa có user nào trong hệ thống'}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default UserManagement;
