import './App.css';
import React, { useState, useEffect, useCallback } from 'react';
import Dashboard from './Dashboard';
import ChallengeList from './ChallengeList';
import CreateChallenge from './CreateChallenge';
import ProgressSubmission from './ProgressSubmission';
import ChallengeDetails from './ChallengeDetails';
import DisplayGamification from './DisplayGamification';
import Profile from './Profile';
import Login from './components/Login';
import SocialFeatures from './components/SocialFeatures';
import PaymentSystem from './components/PaymentSystem';
import NotificationSystem from './components/NotificationSystem';
import AdvancedAnalytics from './components/AdvancedAnalytics';
import SecurityDashboard from './components/SecurityDashboard';
import Leaderboard from './components/Leaderboard';
import VirtualEconomyHub from './components/VirtualEconomyHub';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SocketProvider, useSocket } from './contexts/SocketContext';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  // Container, // Removed Container import
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
  Avatar,
  Divider,
  Fade,
  Badge,
  Tooltip,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Chip,
  Zoom,
  Skeleton,
  CssBaseline,
  Paper,
  Snackbar,
  Alert,
  BottomNavigation,
  BottomNavigationAction
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  AddCircle as AddIcon,
  EmojiEvents as TrophyIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  List as ListIcon,
  Timeline as TimelineIcon,
  Notifications as NotificationsIcon,
  Close as CloseIcon,
  Assessment as AssessmentIcon,
  Group as GroupIcon,
  Star as StarIcon,
  LocalFireDepartment as FireIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  Analytics as AnalyticsIcon,
  Payment as PaymentIcon,
  Home as HomeIcon
} from '@mui/icons-material';

function MobileBottomNav() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate(); // Fixed: using useNavigate directly from react-router-dom

  if (!isMobile) return null;

  const getValue = (path) => {
    if (path === '/') return 0;
    if (path.startsWith('/challenges')) return 1;
    if (path === '/create-challenge') return 2;
    if (path.startsWith('/social')) return 3;
    if (path.startsWith('/profile')) return 4;
    return 0;
  };

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1100,
        borderRadius: '20px 20px 0 0',
        overflow: 'hidden',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.05)',
        display: { xs: 'block', md: 'none' }
      }} 
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={getValue(location.pathname)}
        onChange={(event, newValue) => {
          switch(newValue) {
            case 0: navigate('/'); break;
            case 1: navigate('/challenges'); break;
            case 2: navigate('/create-challenge'); break;
            case 3: navigate('/social'); break;
            case 4: navigate('/profile'); break;
            default: navigate('/');
          }
        }}
        sx={{
          height: 65 + (window.safeAreaInsets?.bottom || 0), // Account for safe area if possible, though window.safeAreaInsets isn't standard JS. Box pb is better.
          pb: 'env(safe-area-inset-bottom)',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          '& .MuiBottomNavigationAction-root': {
            color: theme.palette.text.secondary,
            minWidth: 'auto',
            p: 1,
            '&.Mui-selected': {
              color: theme.palette.primary.main,
            },
          },
        }}
      >
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Challenges" icon={<TrophyIcon />} />
        <BottomNavigationAction 
          label="" 
          icon={
            <Box
              sx={{
                bgcolor: theme.palette.primary.main,
                color: 'white',
                width: { xs: 48, sm: 52 },
                height: { xs: 48, sm: 52 },
                borderRadius: '50%',
                mt: { xs: -2.5, sm: -3 },
                boxShadow: '0 6px 16px rgba(99, 102, 241, 0.4)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&:active': {
                  transform: 'scale(0.95)',
                },
              }}
            >
              <AddIcon fontSize={isMobile ? 'medium' : 'large'} />
            </Box>
          } 
        />
        <BottomNavigationAction label="Social" icon={<PeopleIcon />} />
        <BottomNavigationAction label="Profile" icon={<PersonIcon />} />
      </BottomNavigation>
    </Paper>
  );
}

function Navigation({ mobileOpen, handleDrawerToggle }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const { logout, user } = useAuth();
  const { socket, isConnected } = useSocket();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [stats, setStats] = useState({
    level: 1,
    xp: 0,
    streak: 0,
    notifications: 0,
    challenges: 0
  });

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !user) {
          return;
        }
        const response = await fetch('/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          console.error('Failed to fetch user stats:', response.status);
          return;
        }
        const profile = await response.json();
        if (profile) {
          setStats({
            level: profile.level || 1,
            xp: profile.experience || 0,
            streak: profile.streak || 0,
            notifications: profile.unreadCount || 0,
            challenges: profile.challenges?.active || 0
          });
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };

    if (user) {
      fetchUserStats();
    }
  }, [user]);

  useEffect(() => {
    if (socket && isConnected) {
      socket.on('stats_update', (data) => {
        setStats(prev => ({ 
          ...prev, 
          xp: data.totalPoints !== undefined ? data.totalPoints : prev.xp,
          level: data.level !== undefined ? data.level : prev.level,
          streak: data.streak !== undefined ? data.streak : prev.streak
        }));
      });

      socket.on('points_update', (data) => {
        setStats(prev => ({ ...prev, xp: data.points }));
      });

      socket.on('level_update', (data) => {
        setStats(prev => ({ ...prev, level: data.level }));
      });

      socket.on('streak_update', (data) => {
        setStats(prev => ({ ...prev, streak: data.streak }));
      });

      socket.on('unread_count_update', (count) => {
        setStats(prev => ({ ...prev, notifications: count }));
      });

      return () => {
        socket.off('stats_update');
        socket.off('points_update');
        socket.off('level_update');
        socket.off('streak_update');
        socket.off('unread_count_update');
      };
    }
  }, [socket, isConnected]);

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/', badge: null },
    { text: 'All Challenges', icon: <ListIcon />, path: '/challenges', badge: stats.challenges > 0 ? stats.challenges.toString() : null },
    { text: 'Create Challenge', icon: <AddIcon />, path: '/create-challenge', badge: null },
    { text: 'My Progress', icon: <TimelineIcon />, path: '/progress', badge: null },
    { text: 'Leaderboard', icon: <TrophyIcon />, path: '/leaderboard', badge: 'New' },
    { text: 'Virtual Economy', icon: <StarIcon />, path: '/economy', badge: 'New' },
    { text: 'Social Hub', icon: <PeopleIcon />, path: '/social', badge: 'New' },
    { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics', badge: null },
    { text: 'Billing', icon: <PaymentIcon />, path: '/payments', badge: null },
    { text: 'Notifications', icon: <NotificationsIcon />, path: '/notifications', badge: stats.notifications > 0 ? stats.notifications.toString() : null },
    { text: 'Security', icon: <SettingsIcon />, path: '/security', badge: null },
    { text: 'Gamification', icon: <FireIcon />, path: '/gamification', badge: null },
    { text: 'Profile', icon: <PersonIcon />, path: '/profile', badge: null }
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* User Profile Section */}
      <Box sx={{ p: 3, pt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
              mr: 2,
              border: '2px solid transparent',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'scale(1.1)',
                border: '2px solid #6366F1',
              },
            }}
          >
            {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="h6" noWrap sx={{ fontWeight: 600 }}>
              {user?.firstName || user?.email?.split('@')[0] || 'User'}
            </Typography>
            <Chip
              label={`Level ${stats.level}`}
              size="small"
              color="primary"
              sx={{
                height: 20,
                fontSize: '0.7rem',
                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
              }}
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            icon={<StarIcon />}
            label={`${stats.xp.toLocaleString()} XP`}
            size="small"
            variant="outlined"
            sx={{ fontSize: '0.7rem' }}
          />
          <Chip
            icon={<FireIcon />}
            label={`${stats.streak} day streak`}
            size="small"
            variant="outlined"
            color="warning"
            sx={{ fontSize: '0.7rem' }}
          />
        </Box>
      </Box>

      <Divider sx={{ mx: 2 }} />

      {/* Navigation Items */}
      <List sx={{ flex: 1, py: 2 }}>
        {menuItems.map((item, index) => (
          <Zoom
            key={item.text}
            in={true}
            timeout={300}
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              onMouseEnter={() => setHoveredItem(item.text)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={isMobile ? handleDrawerToggle : undefined}
              sx={{
                mx: 1,
                borderRadius: 3,
                mb: 0.5,
                minHeight: 48,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  backgroundColor: 'rgba(99, 102, 241, 0.08)',
                  transform: 'translateX(8px)',
                },
                '&.Mui-selected': {
                  backgroundColor: 'rgba(99, 102, 241, 0.12)',
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: 'rgba(99, 102, 241, 0.16)',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path 
                    ? theme.palette.primary.main 
                    : 'inherit',
                  minWidth: 40,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: hoveredItem === item.text ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                {item.badge ? (
                  <Badge
                    badgeContent={item.badge}
                    color={item.badge === 'New' ? 'secondary' : 'error'}
                    sx={{
                      '& .MuiBadge-badge': {
                        fontSize: '0.6rem',
                        height: 16,
                        minWidth: 16,
                      },
                    }}
                  >
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontSize: '0.875rem',
                    fontWeight: location.pathname === item.path ? 600 : 400,
                  },
                }}
              />
            </ListItemButton>
          </Zoom>
        ))}
      </List>

      <Divider sx={{ mx: 2 }} />

      {/* Bottom Actions */}
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={logout}
          sx={{
            borderRadius: 3,
            color: theme.palette.error.main,
            '&:hover': {
              backgroundColor: 'rgba(244, 67, 54, 0.08)',
              transform: 'translateX(4px)',
            },
          }}
        >
          <ListItemIcon sx={{ color: theme.palette.error.main, minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Logout" 
            sx={{
              '& .MuiListItemText-primary': {
                fontSize: '0.875rem',
                fontWeight: 500,
              },
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box>
      {/* Modern AppBar */}
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid #E5E7EB',
          color: '#1F2937',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { md: 'none' },
              '&:hover': {
                backgroundColor: 'rgba(99, 102, 241, 0.08)',
                transform: 'scale(1.1)',
              },
            }}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
          
          <Typography 
            variant="h5" 
            noWrap 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Gamified ⚡
          </Typography>

          {/* Desktop Actions */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            <Tooltip title="Notifications">
              <IconButton
                color="inherit"
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(99, 102, 241, 0.08)',
                    transform: 'scale(1.1)',
                  },
                }}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Avatar
              sx={{
                width: 32,
                height: 32,
                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                ml: 1,
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
            >
              {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: 280 }, flexShrink: { md: 0 } }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ 
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: 280,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid #E5E7EB',
              },
            }}
          >
            <Toolbar />
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: 280,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid #E5E7EB',
              },
            }}
            open
          >
            <Toolbar />
            {drawer}
          </Drawer>
        )}
      </Box>
    </Box>
  );
}

// Speed Dial for mobile quick actions
function MobileSpeedDial() {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const actions = [
    { icon: <AddIcon />, name: 'Create Challenge', path: '/create-challenge' },
    { icon: <AssessmentIcon />, name: 'Progress', path: '/progress' },
    { icon: <GroupIcon />, name: 'Community', path: '/community' },
    { icon: <SettingsIcon />, name: 'Settings', path: '/settings' },
  ];

  if (!isMobile) return null;

  return (
    <SpeedDial
      ariaLabel="Quick Actions"
      sx={{
        position: 'fixed',
        bottom: { xs: 90, md: 16 }, // Adjust for bottom nav on mobile
        right: 16,
        '& .MuiSpeedDial-fab': {
          background: 'linear-gradient(135deg, #6366F1 0%, #8B8CF8 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
          },
        },
      }}
      icon={<SpeedDialIcon />}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={() => {
            setOpen(false);
            // Navigate to action.path
          }}
          sx={{
            '& .MuiSpeedDialAction-fab': {
              backgroundColor: 'white',
              '&:hover': {
                backgroundColor: '#F3F4F6',
                transform: 'scale(1.1)',
              },
            },
          }}
        />
      ))}
    </SpeedDial>
  );
}

function AppContent() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { socket, isConnected } = useSocket();
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info', title: '' });

  useEffect(() => {
    if (socket && isConnected) {
      socket.on('new_notification', (notification) => {
        setToast({
          open: true,
          title: notification.title,
          message: notification.message,
          severity: 'info'
        });
      });

      socket.on('achievement_unlocked', (achievement) => {
        setToast({
          open: true,
          title: 'Achievement Unlocked! 🏆',
          message: achievement.name || achievement.title,
          severity: 'success'
        });
      });

      return () => {
        socket.off('new_notification');
        socket.off('achievement_unlocked');
      };
    }
  }, [socket, isConnected]);

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') return;
    setToast(prev => ({ ...prev, open: false }));
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Box sx={{ mb: 2 }}>
            <Skeleton variant="circular" width={60} height={60} />
          </Box>
          <Skeleton variant="text" width={200} height={32} />
          <Skeleton variant="text" width={150} height={24} />
        </Box>
      </Box>
    );
  }

  if (!user) {
    return <Login />;
  }

  const routerConfig = {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  };

  return (
    <Router {...routerConfig}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Navigation mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
        
        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { md: `calc(100% - 280px)` },
            ml: { md: '280px' },
            mt: { xs: 7, md: 8 },
            pb: { xs: 10, md: 0 }, // Added padding for bottom nav
            minHeight: 'calc(100vh - 64px)',
            position: 'relative',
          }}
        >
          <Fade in={true} timeout={600}>
            <Paper // Replaced Container with Paper
              sx={{
                minHeight: '100%', // Ensure Paper takes full height
                display: 'flex',
                flexDirection: 'column',
                borderRadius: { xs: 0, md: 1 }, // Flat on mobile
                boxShadow: { xs: 'none', md: '0 4px 6px -1px rgb(0 0 0 / 0.1)' } // Remove shadow on mobile
              }}
            >
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/challenges" element={<ChallengeList />} />
                <Route path="/create-challenge" element={<CreateChallenge />} />
                <Route path="/challenges/:id" element={<ChallengeDetails />} />
                <Route path="/progress" element={<ProgressSubmission />} />
                <Route path="/social" element={<SocialFeatures />} />
                <Route path="/analytics" element={<AdvancedAnalytics />} />
                <Route path="/payments" element={<PaymentSystem />} />
                <Route path="/notifications" element={<NotificationSystem />} />
                <Route path="/gamification" element={<DisplayGamification />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/security" element={<SecurityDashboard />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/economy" element={<VirtualEconomyHub />} />
              </Routes>
            </Paper>
          </Fade>
        </Box>

        {/* Mobile Navigation Bar */}
        <MobileBottomNav />

        {/* Mobile Speed Dial */}
        <MobileSpeedDial />
        
        {/* Mobile Overlay */}
        {isMobile && mobileOpen && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: theme.zIndex.drawer - 1,
            }}
            onClick={handleDrawerToggle}
          />
        )}
      </Box>

      {/* Real-time Notifications Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseToast} 
          severity={toast.severity} 
          variant="filled"
          sx={{ width: '100%', boxShadow: 3 }}
        >
          {toast.title && <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{toast.title}</Typography>}
          <Typography variant="body2">{toast.message}</Typography>
        </Alert>
      </Snackbar>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <AppContent />
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;