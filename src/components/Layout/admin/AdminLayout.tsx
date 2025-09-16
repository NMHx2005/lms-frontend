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
  useMediaQuery,
  Collapse,
  Divider,
  Avatar,
  Tooltip
} from '@mui/material';
import { AppBar } from '@mui/material';
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
  Logout as LogoutIcon,
  Notifications as NotificationsIcon
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
  const [expandedTabs, setExpandedTabs] = useState<string[]>([]);
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

  const toggleTab = useCallback((tabPath: string) => {
    setExpandedTabs(prev =>
      prev.includes(tabPath)
        ? prev.filter(path => path !== tabPath)
        : [...prev, tabPath]
    );
  }, []);

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

  const renderSidebarItem = (item: SidebarItem) => {
    const isExpanded = expandedTabs.includes(item.path);
    const hasSubItems = (item as any).subItems && (item as any).subItems.length > 0;

    const rootProps = hasSubItems
      ? {}
      : { onClick: () => handleSidebarItemClick(item.path) };

    const button = (
      <ListItemButton
        onClick={() => hasSubItems && toggleTab(item.path)}
        {...rootProps}
        sx={{
          borderRadius: 2,
          mx: 1,
          minHeight: 48,
          my: 0.25,
          '&.Mui-selected': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText
          },
          '&.Mui-selected:hover': {
            backgroundColor: theme.palette.primary.dark
          },
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.06)',
            transform: 'translateX(4px)'
          },
          transition: 'all 0.2s ease',
          ...(sidebarCollapsed && { justifyContent: 'center', px: 2 })
        }}
        selected={isActiveItem(item.path)}
      >
        <ListItemIcon
          sx={{
            minWidth: sidebarCollapsed ? 'auto' : 40,
            color: isActiveItem(item.path) ? theme.palette.primary.contrastText : '#9ca3af',
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
            primaryTypographyProps={{ fontWeight: isActiveItem(item.path) ? 600 : 500, fontSize: '0.9rem' }}
          />
        )}
      </ListItemButton>
    );

    return (
      <Box key={item.id} sx={{ width: '100%' }}>
        <ListItem disablePadding sx={{ mb: 0.25 }}>
          {sidebarCollapsed ? (
            <Tooltip title={item.label} placement="right">
              {button}
            </Tooltip>
          ) : (
            button
          )}
        </ListItem>

        {hasSubItems && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {(item as any).subItems.map((sub: any) => (
                <ListItem key={sub.path} disablePadding>
                  <ListItemButton
                    onClick={() => handleSidebarItemClick(sub.path)}
                    sx={{
                      pl: sidebarCollapsed ? 2 : 6,
                      py: 0.5,
                      minHeight: 40,
                      '&:hover': { backgroundColor: 'action.hover' },
                      ...(isActiveItem(sub.path) && { backgroundColor: 'rgba(25,118,210,0.12)' })
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32, color: 'text.secondary' }}>
                      {sub.icon}
                    </ListItemIcon>
                    {!sidebarCollapsed && (
                      <ListItemText primary={sub.label} primaryTypographyProps={{ fontSize: '0.85rem' }} />
                    )}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Toolbar
        sx={{
          background: 'linear-gradient(135deg, #5b8def 0%, #8b5cf6 100%)',
          color: '#ffffff',
          minHeight: '80px !important',
          px: 2,
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {!sidebarCollapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: 'warning.main', fontWeight: 700 }}>A</Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Admin Panel
              </Typography>
            </Box>
          </Box>
        )}
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            color: 'inherit',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
          }}
        >
          {sidebarCollapsed ? <MenuIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Toolbar>

      {/* Navigation */}
      <Box sx={{
        flex: 1, overflow: 'auto',
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none', msOverflowStyle: 'none',
        backgroundColor: 'transparent'
      }}>
        <List sx={{ px: 1, py: 2 }}>
          {sidebarItems.map(renderSidebarItem)}
        </List>
      </Box>

      <Divider />

      {/* Footer */}
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={() => navigate('/admin/login')}
          sx={{
            borderRadius: 2,
            backgroundColor: 'rgba(239,68,68,0.15)',
            color: '#fecaca',
            '&:hover': {
              backgroundColor: 'rgba(239,68,68,0.25)',
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

      {/* Mobile AppBar */}
      <AppBar
        position="fixed"
        sx={{
          display: { xs: 'block', md: 'none' },
          background: 'linear-gradient(135deg, #5b8def 0%, #8b5cf6 100%)',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, flexGrow: 1 }}>
            Admin Panel
          </Typography>
          <IconButton color="inherit">
            <Badge color="error" variant="dot">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

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
            backgroundColor: '#1f2a37',
            color: '#e5e7eb',
            borderRight: '1px solid #243445'
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
            backgroundColor: '#1f2a37',
            color: '#e5e7eb',
            transition: 'width 0.3s ease',
            borderRight: '1px solid #243445'
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
          p: { xs: 2, md: 3 },
          width: { md: `calc(100% - ${sidebarCollapsed ? collapsedWidth : drawerWidth}px)` },
          transition: 'margin-left 0.3s ease, width 0.3s ease',
          backgroundColor: 'background.default',
          color: 'text.primary',
          minHeight: '100vh',
          mt: { xs: 7, md: 0 },
          ml: { md: `${sidebarCollapsed ? collapsedWidth : drawerWidth}px` }
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;