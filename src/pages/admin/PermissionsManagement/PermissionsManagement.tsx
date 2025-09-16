import React, { useState, useEffect } from 'react';
// import './PermissionsManagement.css';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Grid,
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
  Switch,
  Avatar
} from '@mui/material';

interface Role { _id: string; name: string; description: string; permissions: string[]; userCount: number; createdAt: string; isSystem: boolean; }
interface Permission { _id: string; name: string; description: string; category: string; isActive: boolean; }
interface UserRole { _id: string; userId: string; userName: string; userEmail: string; currentRole: string; assignedBy: string; assignedAt: string; }

const PermissionsManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'roles' | 'permissions' | 'users'>('roles');
  const [showCreateRole, setShowCreateRole] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const mockRoles: Role[] = [
        { _id: 'role-1', name: 'Super Admin', description: 'Toàn quyền truy cập hệ thống', permissions: ['all'], userCount: 1, createdAt: '2024-01-01', isSystem: true },
        { _id: 'role-2', name: 'Content Moderator', description: 'Quản lý nội dung và duyệt khóa học', permissions: ['courses:read', 'courses:moderate', 'content:moderate'], userCount: 3, createdAt: '2024-01-15', isSystem: false },
        { _id: 'role-3', name: 'User Manager', description: 'Quản lý người dùng và quyền truy cập', permissions: ['users:read', 'users:write', 'roles:read'], userCount: 2, createdAt: '2024-02-01', isSystem: false }
      ];
      const mockPermissions: Permission[] = [
        { _id: 'perm-1', name: 'users:read', description: 'Xem danh sách người dùng', category: 'User Management', isActive: true },
        { _id: 'perm-2', name: 'users:write', description: 'Tạo/sửa/xóa người dùng', category: 'User Management', isActive: true },
        { _id: 'perm-3', name: 'courses:read', description: 'Xem danh sách khóa học', category: 'Course Management', isActive: true },
        { _id: 'perm-4', name: 'courses:moderate', description: 'Duyệt khóa học', category: 'Course Management', isActive: true },
        { _id: 'perm-5', name: 'content:moderate', description: 'Duyệt nội dung', category: 'Content Management', isActive: true },
        { _id: 'perm-6', name: 'reports:read', description: 'Xem báo cáo', category: 'Analytics', isActive: true },
        { _id: 'perm-7', name: 'settings:write', description: 'Thay đổi cài đặt hệ thống', category: 'System', isActive: true }
      ];
      const mockUserRoles: UserRole[] = [
        { _id: 'ur-1', userId: 'user-1', userName: 'Admin User', userEmail: 'admin@lms.com', currentRole: 'Super Admin', assignedBy: 'System', assignedAt: '2024-01-01' },
        { _id: 'ur-2', userId: 'user-2', userName: 'Moderator User', userEmail: 'mod@lms.com', currentRole: 'Content Moderator', assignedBy: 'Admin User', assignedAt: '2024-01-15' }
      ];
      setRoles(mockRoles); setPermissions(mockPermissions); setUserRoles(mockUserRoles); setLoading(false);
    }, 1000);
  }, []);

  const handleCreateRole = () => setShowCreateRole(true);
  const handleEditRole = () => { /* placeholder - open edit modal later */ };
  const handleDeleteRole = (roleId: string) => { if (window.confirm('Bạn có chắc muốn xóa role này?')) setRoles(roles.filter(r => r._id !== roleId)); };

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
            <Button variant="contained" onClick={handleCreateRole}>+ Tạo Role mới</Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Paper variant="outlined">
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} variant="scrollable" scrollButtons allowScrollButtonsMobile>
          <Tab value="roles" label={`Vai trò (${roles.length})`} />
          <Tab value="permissions" label={`Quyền (${permissions.length})`} />
          <Tab value="users" label={`Phân quyền người dùng (${userRoles.length})`} />
        </Tabs>
      </Paper>

      {/* Roles */}
      {activeTab === 'roles' && (
        <Grid container spacing={2}>
          {roles.map((role) => (
            <Grid key={role._id} item xs={12} md={6} lg={4}>
              <Card variant="outlined">
                <CardContent>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6" fontWeight={700}>{role.name}</Typography>
                    {role.isSystem && <Chip size="small" color="info" label="Hệ thống" />}
                  </Stack>
                  <Typography variant="body2" color="text.secondary" mt={0.5}>{role.description}</Typography>
                  <Stack direction="row" spacing={2} mt={1}>
                    <Chip size="small" label={`${role.userCount} người dùng`} />
                    <Chip size="small" label={`${role.permissions.length} quyền`} />
                  </Stack>
                  <Typography variant="body2" fontWeight={700} mt={1}>Quyền:</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" mt={0.5}>
                    {role.permissions.map((perm) => (
                      <Chip key={perm} size="small" variant="outlined" label={perm === 'all' ? 'Tất cả quyền' : perm} />
                    ))}
                  </Stack>
                  {!role.isSystem && (
                    <Stack direction="row" spacing={1} mt={1.5}>
                      <Button size="small" variant="outlined" onClick={() => handleEditRole()}>Sửa</Button>
                      <Button size="small" color="error" variant="outlined" onClick={() => handleDeleteRole(role._id)}>Xóa</Button>
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Permissions Table */}
      {activeTab === 'permissions' && (
        <Card>
          <CardContent>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Quyền</TableCell>
                  <TableCell>Mô tả</TableCell>
                  <TableCell>Danh mục</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {permissions.map((permission) => (
                  <TableRow key={permission._id} hover>
                    <TableCell><Chip size="small" variant="outlined" label={permission.name} /></TableCell>
                    <TableCell>{permission.description}</TableCell>
                    <TableCell><Chip size="small" label={permission.category} /></TableCell>
                    <TableCell><Chip size="small" color={permission.isActive ? 'success' : 'default'} label={permission.isActive ? 'Hoạt động' : 'Không hoạt động'} /></TableCell>
                    <TableCell><Switch checked={permission.isActive} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      {activeTab === 'users' && (
        <Card>
          <CardContent>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Người dùng</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Vai trò hiện tại</TableCell>
                  <TableCell>Được phân quyền bởi</TableCell>
                  <TableCell>Ngày phân quyền</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userRoles.map((userRole) => (
                  <TableRow key={userRole._id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar sx={{ width: 28, height: 28 }}>👤</Avatar>
                        <Typography>{userRole.userName}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{userRole.userEmail}</TableCell>
                    <TableCell><Chip size="small" label={userRole.currentRole} /></TableCell>
                    <TableCell>{userRole.assignedBy}</TableCell>
                    <TableCell>{new Date(userRole.assignedAt).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell><Button size="small" variant="outlined">Thay đổi vai trò</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Role Modal placeholder */}
      {showCreateRole && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1" fontWeight={700}>Tạo Role mới</Typography>
          <Typography variant="body2" color="text.secondary">Modal tạo role sẽ được implement ở đây...</Typography>
          <Button sx={{ mt: 1 }} onClick={() => setShowCreateRole(false)}>Đóng</Button>
        </Paper>
      )}
    </Box>
  );
};

export default PermissionsManagement;
