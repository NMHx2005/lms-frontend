import React, { useState, useCallback, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import userProfileService, { UserProfile } from '../../../services/client/user-profile.service';
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
  Avatar,
  Divider,
  Collapse,
  Toolbar,
  CssBaseline,
  useTheme,
  useMediaQuery,
  AppBar
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  School as SchoolIcon,
  Analytics as AnalyticsIcon,
  Message as MessageIcon,
  AccountBalanceWallet as EarningsIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  RateReview as ReviewIcon,
  Assessment as AssessmentIcon,
  MonetizationOn as MonetizationOnIcon,
  Create as CreateIcon,
  Person as PersonIcon
} from '@mui/icons-material';

const drawerWidth = 280;

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactElement;
  path: string;
  description: string;
  subItems?: {
    label: string;
    path: string;
    icon: React.ReactElement;
  }[];
}

const TeacherLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedTabs, setExpandedTabs] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await userProfileService.getProfile();
        if (response.success) {
          setUserProfile(response.data);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };
    loadProfile();
  }, []);

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(!mobileOpen);
  }, [mobileOpen]);

  const closeSidebar = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const toggleTab = useCallback((tabPath: string) => {
    setExpandedTabs(prev =>
      prev.includes(tabPath)
        ? prev.filter(path => path !== tabPath)
        : [...prev, tabPath]
    );
  }, []);

  const sidebarItems: SidebarItem[] = [
    {
      id: 'courses',
      label: 'Course Studio',
      icon: <SchoolIcon />,
      path: '/teacher/courses',
      description: 'Quản lý khóa học của bạn',
      subItems: [
        { label: 'Danh sách khóa học', path: '/teacher/courses', icon: <DashboardIcon /> },
        { label: 'Tạo khóa học mới', path: '/teacher/courses/new', icon: <CreateIcon /> },
        { label: 'Quản lý học viên', path: '/teacher/student-management', icon: <PeopleIcon /> },
        { label: 'Quản lý đánh giá', path: '/teacher/course-reviews', icon: <ReviewIcon /> }
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <AnalyticsIcon />,
      path: '/teacher/analytics',
      description: 'Phân tích hiệu suất và thu nhập',
      subItems: [
        { label: 'Tổng quan', path: '/teacher/analytics', icon: <AssessmentIcon /> },
        { label: 'Phân tích khóa học', path: '/teacher/analytics/courses', icon: <AnalyticsIcon /> },
        { label: 'Phân tích học viên', path: '/teacher/analytics/students', icon: <PeopleIcon /> }
      ]
    },
    {
      id: 'messages',
      label: 'Communication Center',
      icon: <MessageIcon />,
      path: '/teacher/messages',
      description: 'Giao tiếp với học viên'
    },
    {
      id: 'earnings',
      label: 'Doanh thu & Hóa đơn',
      icon: <EarningsIcon />,
      path: '/teacher/earnings',
      description: 'Theo dõi thu nhập và thanh toán',
      subItems: [
        { label: 'Tổng quan doanh thu', path: '/teacher/earnings', icon: <MonetizationOnIcon /> },
        { label: 'Phân tích', path: '/teacher/earnings/analytics', icon: <AnalyticsIcon /> }
      ]
    },
    // {
    //   id: 'ai',
    //   label: 'AI Tools',
    //   icon: <AIIcon />,
    //   path: '/teacher/ai',
    //   description: 'Công cụ AI hỗ trợ giảng dạy',
    //   subItems: [
    //     { label: 'Tổng quan AI Tools', path: '/teacher/ai', icon: <PsychologyIcon /> },
    //     { label: 'Tạo Avatar', path: '/teacher/ai/avatar', icon: <PersonIcon /> },
    //     { label: 'Tạo Thumbnail', path: '/teacher/ai/thumbnail', icon: <CreateIcon /> },
    //     { label: 'Content Moderation', path: '/teacher/ai/moderation', icon: <SecurityIcon /> }
    //   ]
    // }
  ];

  const additionalItems = [
    {
      label: 'Gói khóa học',
      path: '/teacher/advanced/packages',
      icon: <MonetizationOnIcon />,
      description: 'Đăng ký gói để đăng khóa học'
    },
    {
      label: 'Thông tin giáo viên',
      path: '/teacher/advanced/profile',
      icon: <PersonIcon />,
      description: 'Quản lý hồ sơ giảng viên'
    }
  ];

  const renderSidebarItem = (item: SidebarItem) => {
    const isExpanded = expandedTabs.includes(item.path);
    const hasSubItems = item.subItems && item.subItems.length > 0;

    const rootProps = hasSubItems
      ? {}
      : { component: NavLink as any, to: item.path, onClick: closeSidebar };

    return (
      <Box key={item.id} sx={{ width: '100%' }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => hasSubItems && toggleTab(item.path)}
            {...rootProps}
            sx={{
              minHeight: 56,
              px: 2,
              py: 1,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
              ...(location.pathname === item.path && {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
              }),
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              secondary={item.description}
              primaryTypographyProps={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'white'
              }}
              secondaryTypographyProps={{
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.7)'
              }}
            />
            {hasSubItems && (
              <IconButton size="small" sx={{ color: 'white' }}>
                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            )}
          </ListItemButton>
        </ListItem>

        {hasSubItems && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.subItems!.map((subItem) => (
                <ListItem key={subItem.path} disablePadding>
                  <ListItemButton
                    component={NavLink}
                    to={subItem.path}
                    onClick={closeSidebar}
                    sx={{
                      pl: 6,
                      py: 0.5,
                      minHeight: 40,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      },
                      ...(location.pathname === subItem.path && {
                        backgroundColor: 'rgba(255, 255, 255, 0.12)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.16)',
                        },
                      }),
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32, color: 'rgba(255, 255, 255, 0.8)' }}>
                      {subItem.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={subItem.label}
                      primaryTypographyProps={{
                        fontSize: '0.8rem',
                        color: 'rgba(255, 255, 255, 0.9)'
                      }}
                    />
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
      <Toolbar sx={{
        minHeight: 64,
        px: 2,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
          Teacher Dashboard
        </Typography>
        {isMobile && (
          <IconButton
            color="inherit"
            onClick={handleDrawerToggle}
            edge="end"
          >
            <CloseIcon />
          </IconButton>
        )}
      </Toolbar>

      {/* Navigation */}
      <Box sx={{
        flexGrow: 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Box sx={{
          flexGrow: 1,
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          <List sx={{ px: 1, py: 2 }}>
            {sidebarItems.map(renderSidebarItem)}
          </List>

          <Divider sx={{ mx: 2, my: 1, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

          <Typography
            variant="caption"
            sx={{
              px: 2,
              py: 1,
              color: 'rgba(255, 255, 255, 0.6)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 0.5
            }}
          >
            Quản lý nâng cao
          </Typography>

          <List sx={{ px: 1 }}>
            {additionalItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  component={NavLink}
                  to={item.path}
                  onClick={closeSidebar}
                  sx={{
                    px: 2,
                    py: 1,
                    minHeight: 48,
                    borderRadius: 1,
                    mb: 0.5,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    ...(location.pathname === item.path && {
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      },
                    }),
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: 'rgba(255, 255, 255, 0.8)' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    secondary={item.description}
                    primaryTypographyProps={{
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      color: 'white'
                    }}
                    secondaryTypographyProps={{
                      fontSize: '0.7rem',
                      color: 'rgba(255, 255, 255, 0.6)'
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={userProfile?.avatar || '/images/default-avatar.png'}
            alt={userProfile?.name || 'Teacher Avatar'}
            sx={{ width: 40, height: 40 }}
          />
          <Box>
            <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
              {userProfile?.name || 'Teacher'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Instructor
            </Typography>
          </Box>
        </Box>
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
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          zIndex: theme.zIndex.drawer + 1
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
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700 }}>
            Teacher Dashboard
          </Typography>
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
        open
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            background: 'linear-gradient(180deg, #1e293b 0%, #334155 100%)',
            color: 'white',
            borderRight: 'none'
          }
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          marginLeft: { md: `${drawerWidth}px` },
          backgroundColor: 'background.default',
          minHeight: '100vh',
          mt: { xs: 7, md: 0 }
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default TeacherLayout;
