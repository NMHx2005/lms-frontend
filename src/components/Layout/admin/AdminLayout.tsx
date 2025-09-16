import React, { useState, useCallback } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Badge,
  Toolbar,
  CssBaseline,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  RateReview as ReviewIcon,
  AccountBalanceWallet as RefundIcon,
  Receipt as BillIcon,
  SmartToy as AIIcon,
  Analytics as ReportIcon,
  Settings as SettingsIcon,
  Security as PermissionIcon,
  Assignment as AuditIcon,
  Category as CategoryIcon,
  Support as SupportIcon,
  Campaign as AnnouncementIcon,
  Speed as PerformanceIcon,
  Backup as BackupIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactElement;
  path: string;
  badge?: number;
}

const AdminLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const sidebarItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
    { id: 'users', label: 'Quản lý User', icon: <PeopleIcon />, path: '/admin/users' },
    { id: 'courses', label: 'Quản lý khóa học', icon: <SchoolIcon />, path: '/admin/courses', badge: 12 },
    { id: 'courses-review', label: 'Duyệt khóa học', icon: <ReviewIcon />, path: '/admin/courses/review', badge: 5 },
    { id: 'refunds', label: 'Trung tâm hoàn tiền', icon: <RefundIcon />, path: '/admin/refunds', badge: 2 },
    { id: 'bills', label: 'Hóa đơn & Thanh toán', icon: <BillIcon />, path: '/admin/bills', badge: 8 },
    { id: 'ai', label: 'AI Moderation', icon: <AIIcon />, path: '/admin/ai' },
    { id: 'reports', label: 'Báo cáo & Analytics', icon: <ReportIcon />, path: '/admin/reports' },
    { id: 'settings', label: 'Cài đặt hệ thống', icon: <SettingsIcon />, path: '/admin/settings' },
    { id: 'permissions', label: 'Quản lý quyền', icon: <PermissionIcon />, path: '/admin/permissions' },
    { id: 'audit-logs', label: 'Audit Logs', icon: <AuditIcon />, path: '/admin/audit-logs' },
    { id: 'category-management', label: 'Quản lý danh mục', icon: <CategoryIcon />, path: '/admin/category-management' },
    { id: 'support-center', label: 'Support Center', icon: <SupportIcon />, path: '/admin/support-center' },
    { id: 'announcements', label: 'Thông báo', icon: <AnnouncementIcon />, path: '/admin/announcements' },
    { id: 'performance', label: 'Giám sát hiệu suất', icon: <PerformanceIcon />, path: '/admin/performance' },
    { id: 'backup', label: 'Backup & Restore', icon: <BackupIcon />, path: '/admin/backup' },
  ];

  const handleSidebarItemClick = useCallback((path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  }, [navigate, isMobile]);

  const handleDrawerToggle = useCallback(() => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  }, [isMobile, mobileOpen, sidebarCollapsed]);

  const isActiveItem = useCallback((path: string) => {
    // Find all items that could be active based on the current path
    const matchingItems = sidebarItems.filter(
      (item) =>
        location.pathname === item.path ||
        (item.path !== '/admin' && location.pathname.startsWith(item.path + '/'))
    );

    // If the current path matches this item's path exactly, it's active
    if (location.pathname === path) {
      return true;
    }

    // For non-exact matches, only mark as active if this item's path is the longest match
    if (path !== '/admin' && location.pathname.startsWith(path + '/')) {
      // Check if there's any other item with a longer path that also matches
      const hasMoreSpecificMatch = matchingItems.some(
        (item) => item.path !== path && item.path.length > path.length
      );
      // Only mark this item as active if no more specific (longer) path matches
      return !hasMoreSpecificMatch;
    }

    return false;
  }, [location.pathname, sidebarItems]);

  const drawerWidth = 280;
  const collapsedWidth = 80;

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Toolbar
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          minHeight: '80px !important',
          px: 2,
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {!sidebarCollapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#fbbf24' }}>
              Admin Panel
            </Typography>
          </Box>
        )}
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            color: 'white',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
          }}
        >
          {sidebarCollapsed ? <MenuIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Toolbar>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ px: 1, py: 2 }}>
          {sidebarItems.map((item) => {
            const isActive = isActiveItem(item.path);

            return (
              <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleSidebarItemClick(item.path)}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    minHeight: 48,
                    backgroundColor: isActive ? 'primary.main' : 'transparent',
                    color: isActive ? 'white' : 'text.primary',
                    '&:hover': {
                      backgroundColor: isActive ? 'primary.dark' : 'action.hover',
                      transform: 'translateX(4px)',
                    },
                    transition: 'all 0.2s ease',
                    ...(sidebarCollapsed && {
                      justifyContent: 'center',
                      px: 2
                    })
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: sidebarCollapsed ? 'auto' : 40,
                      color: isActive ? 'white' : 'text.secondary',
                      justifyContent: 'center'
                    }}
                  >
                    {item.badge ? (
                      <Badge badgeContent={item.badge} color="error">
                        {item.icon}
                      </Badge>
                    ) : (
                      item.icon
                    )}
                  </ListItemIcon>
                  {!sidebarCollapsed && (
                    <ListItemText
                      primary={item.label}
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontWeight: isActive ? 600 : 500,
                          fontSize: '0.9rem'
                        }
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <ListItemButton
          onClick={() => navigate('/admin/login')}
          sx={{
            borderRadius: 2,
            backgroundColor: 'error.light',
            color: 'error.contrastText',
            '&:hover': {
              backgroundColor: 'error.main',
            },
            transition: 'all 0.2s ease',
            ...(sidebarCollapsed && {
              justifyContent: 'center',
              px: 2
            })
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: sidebarCollapsed ? 'auto' : 40,
              color: 'inherit',
              justifyContent: 'center'
            }}
          >
            <LogoutIcon />
          </ListItemIcon>
          {!sidebarCollapsed && (
            <ListItemText
              primary="Đăng xuất"
              sx={{
                '& .MuiListItemText-primary': {
                  fontWeight: 500,
                  fontSize: '0.9rem'
                }
              }}
            />
          )}
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            background: 'linear-gradient(180deg, #1e293b 0%, #334155 100%)',
            color: 'white'
          }
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: sidebarCollapsed ? collapsedWidth : drawerWidth,
            background: 'linear-gradient(180deg, #1e293b 0%, #334155 100%)',
            color: 'white',
            transition: 'width 0.3s ease'
          }
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${sidebarCollapsed ? collapsedWidth : drawerWidth}px)` },
          transition: 'width 0.3s ease',
          backgroundColor: 'background.default',
          minHeight: '100vh'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;