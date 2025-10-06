import React, { useState, useEffect } from 'react';
// import './PermissionsManagement.css';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Button,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Alert,
  Snackbar,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import PermissionsService, {
  User,
  AuthUser,
  BulkRoleUpdate,
  BulkAuthRoleUpdate
} from '../../../services/admin/permissionsService';

const PermissionsManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [authUsers, setAuthUsers] = useState<AuthUser[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'auth-users'>('users');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedAuthUsers, setSelectedAuthUsers] = useState<string[]>([]);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' | 'warning' }>({
    open: false,
    message: '',
    severity: 'info'
  });
  const [bulkUpdateDialog, setBulkUpdateDialog] = useState<{ open: boolean; type: 'users' | 'auth-users' }>({
    open: false,
    type: 'users'
  });
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Load data from API
  const loadData = async (page = pagination.page, limit = pagination.limit) => {
    try {
      setLoading(true);
      console.log('🔄 Loading permissions data...', { page, limit });

      const [usersResponse, authUsersResponse, rolesResponse] = await Promise.all([
        PermissionsService.getUsers({ page, limit }),
        PermissionsService.getAuthUsers({ page, limit }),
        PermissionsService.getRoles()
      ]);

      console.log('👥 Users:', usersResponse);
      console.log('🔐 Auth Users:', authUsersResponse);
      console.log('🎭 Roles:', rolesResponse);

      if (usersResponse.success) {
        setUsers(usersResponse.data.users || []);
        const responseData = usersResponse.data as any; // Cast to any to access all properties
        setPagination(prev => ({
          ...prev,
          page: responseData.page || page,
          limit: responseData.limit || limit,
          total: responseData.total || 0,
          totalPages: responseData.totalPages || 0
        }));
      }
      if (authUsersResponse.success) {
        setAuthUsers(authUsersResponse.data.users || []);
      }
      if (rolesResponse.success) {
        setRoles(rolesResponse.data || []);
      }
    } catch (error) {
      console.error('Error loading permissions data:', error);
      showSnackbar('Lỗi khi tải dữ liệu quyền hạn', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Helper functions
  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAuthUserSelect = (userId: string) => {
    setSelectedAuthUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAllUsers = () => {
    if (!users || users.length === 0) return;

    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user._id));
    }
  };

  const handleSelectAllAuthUsers = () => {
    if (!authUsers || authUsers.length === 0) return;

    if (selectedAuthUsers.length === authUsers.length) {
      setSelectedAuthUsers([]);
    } else {
      setSelectedAuthUsers(authUsers.map(user => user._id));
    }
  };

  const handleBulkRoleUpdate = async () => {
    if (selectedRoles.length === 0) {
      showSnackbar('Vui lòng chọn ít nhất một role', 'warning');
      return;
    }

    try {
      if (bulkUpdateDialog.type === 'users') {
        const data: BulkRoleUpdate = {
          userIds: selectedUsers,
          roles: selectedRoles,
          reason: 'Bulk role update by admin'
        };
        await PermissionsService.bulkUpdateRoles(data);
        showSnackbar(`Đã cập nhật roles cho ${selectedUsers.length} người dùng`, 'success');
      } else {
        const data: BulkAuthRoleUpdate = {
          userIds: selectedAuthUsers,
          roles: selectedRoles,
          reason: 'Bulk role update by admin'
        };
        await PermissionsService.bulkUpdateAuthRoles(data);
        showSnackbar(`Đã cập nhật roles cho ${selectedAuthUsers.length} auth users`, 'success');
      }

      setBulkUpdateDialog({ open: false, type: 'users' });
      setSelectedRoles([]);
      setSelectedUsers([]);
      setSelectedAuthUsers([]);
      loadData();
    } catch (error) {
      console.error('Error updating roles:', error);
      showSnackbar('Lỗi khi cập nhật roles', 'error');
    }
  };

  // Pagination handlers
  const handlePageChange = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage + 1 }));
    loadData(newPage + 1, pagination.limit);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newLimit = parseInt(event.target.value, 10);
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
    loadData(1, newLimit);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">Đang tải quản lý quyền...</Typography>
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
              <Typography variant="h5" fontWeight={800}>Quản lý quyền & vai trò</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Phân quyền chi tiết cho admin và role-based access control</Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => loadData()}>
                Làm mới
              </Button>
              {(selectedUsers.length > 0 || selectedAuthUsers.length > 0) && (
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={() => setBulkUpdateDialog({
                    open: true,
                    type: selectedUsers.length > 0 ? 'users' : 'auth-users'
                  })}
                >
                  Cập nhật hàng loạt ({selectedUsers.length + selectedAuthUsers.length})
                </Button>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Paper variant="outlined">
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} variant="scrollable" scrollButtons allowScrollButtonsMobile>
          <Tab value="users" label={`Người dùng (${pagination.total})`} />
          <Tab value="auth-users" label={`Auth Users (${authUsers?.length || 0})`} />
        </Tabs>
      </Paper>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <Card>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h6">Quản lý người dùng</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  Đã chọn: {selectedUsers.length} / {pagination.total} (hiển thị {users.length})
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleSelectAllUsers}
                >
                  {selectedUsers.length === users.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                </Button>
              </Stack>
            </Stack>

            {users.length > 0 ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedUsers.length === users.length && users.length > 0}
                        indeterminate={selectedUsers.length > 0 && selectedUsers.length < users.length}
                        onChange={handleSelectAllUsers}
                      />
                    </TableCell>
                    <TableCell>Người dùng</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Ngày tạo</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id} selected={selectedUsers.includes(user._id)}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedUsers.includes(user._id)}
                          onChange={() => handleUserSelect(user._id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Avatar
                            src={user.avatar}
                            sx={{ width: 32, height: 32 }}
                          >
                            {user.name.charAt(0)}
                          </Avatar>
                          <Typography variant="body2">{user.name}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5} flexWrap="wrap">
                          {user.roles?.map((role, index) => (
                            <Chip key={index} label={role} color="primary" size="small" />
                          )) || <Typography variant="caption" color="text.secondary">No roles</Typography>}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.isActive ? 'Hoạt động' : 'Vô hiệu hóa'}
                          color={user.isActive ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Box textAlign="center" py={4}>
                <Typography variant="body2" color="text.secondary">
                  Không có dữ liệu người dùng
                </Typography>
              </Box>
            )}

            {/* Pagination */}
            {users.length > 0 && (
              <TablePagination
                component="div"
                count={pagination.total}
                page={pagination.page - 1}
                onPageChange={handlePageChange}
                rowsPerPage={pagination.limit}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPageOptions={[5, 10, 25, 50]}
                labelRowsPerPage="Số hàng mỗi trang:"
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} của ${count !== -1 ? count : `nhiều hơn ${to}`}`
                }
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* Auth Users Tab */}
      {activeTab === 'auth-users' && (
        <Card>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h6">Auth Users</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  Đã chọn: {selectedAuthUsers.length} / {pagination.total} (hiển thị {authUsers?.length || 0})
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleSelectAllAuthUsers}
                  disabled={!authUsers || authUsers.length === 0}
                >
                  {selectedAuthUsers.length === (authUsers?.length || 0) ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                </Button>
              </Stack>
            </Stack>

            {authUsers && authUsers.length > 0 ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedAuthUsers.length === (authUsers?.length || 0) && (authUsers?.length || 0) > 0}
                        indeterminate={selectedAuthUsers.length > 0 && selectedAuthUsers.length < (authUsers?.length || 0)}
                        onChange={handleSelectAllAuthUsers}
                        disabled={!authUsers || authUsers.length === 0}
                      />
                    </TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Roles</TableCell>
                    <TableCell>Permissions</TableCell>
                    <TableCell>Trạng thái</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {authUsers.map((user) => (
                    <TableRow key={user._id} selected={selectedAuthUsers.includes(user._id)}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedAuthUsers.includes(user._id)}
                          onChange={() => handleAuthUserSelect(user._id)}
                        />
                      </TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5} flexWrap="wrap">
                          {user.roles?.map((role, index) => (
                            <Chip key={index} label={role} color="primary" size="small" />
                          )) || <Typography variant="caption" color="text.secondary">No roles</Typography>}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {user.permissions?.length || 0} permissions
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.isActive ? 'Hoạt động' : 'Vô hiệu hóa'}
                          color={user.isActive ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Box textAlign="center" py={4}>
                <Typography variant="body2" color="text.secondary">
                  Không có dữ liệu auth users
                </Typography>
              </Box>
            )}

            {/* Pagination for Auth Users */}
            {authUsers && authUsers.length > 0 && (
              <TablePagination
                component="div"
                count={pagination.total}
                page={pagination.page - 1}
                onPageChange={handlePageChange}
                rowsPerPage={pagination.limit}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPageOptions={[5, 10, 25, 50]}
                labelRowsPerPage="Số hàng mỗi trang:"
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} của ${count !== -1 ? count : `nhiều hơn ${to}`}`
                }
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* Bulk Update Dialog */}
      <Dialog open={bulkUpdateDialog.open} onClose={() => setBulkUpdateDialog({ open: false, type: 'users' })} maxWidth="sm" fullWidth>
        <DialogTitle>
          Cập nhật roles hàng loạt
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Bạn đang cập nhật roles cho {bulkUpdateDialog.type === 'users' ? selectedUsers.length : selectedAuthUsers.length} người dùng
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Chọn roles mới</InputLabel>
              <Select
                multiple
                value={selectedRoles}
                onChange={(e) => setSelectedRoles(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
                label="Chọn roles mới"
                renderValue={(selected) => (
                  <Stack direction="row" spacing={0.5} flexWrap="wrap">
                    {selected.map((role) => (
                      <Chip key={role} label={role} size="small" />
                    ))}
                  </Stack>
                )}
              >
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkUpdateDialog({ open: false, type: 'users' })}>
            Hủy
          </Button>
          <Button variant="contained" onClick={handleBulkRoleUpdate} disabled={selectedRoles.length === 0}>
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PermissionsManagement;