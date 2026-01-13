import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  LinearProgress,
  Chip,
  Avatar,
  Box,
  // IconButton, // Removed unused import
  Fab,
  Zoom,
  Slide,
  Fade,
  useTheme,
  useMediaQuery,
  Skeleton,
} from '@mui/material';
import {
  // TrendingUp as TrendingUpIcon, // Removed unused import
  EmojiEvents as TrophyIcon,
  Star as StarIcon,
  Add as AddIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Group as GroupIcon,
  // LocalFire as FireIcon, // Removed unused import
  Timeline as TimelineIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Animated counter component
const AnimatedCounter = ({ value, duration = 1000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}</span>;
};

// Stats card component with animation
const StatCard = ({ icon, title, value, subtitle, color = 'primary', delay = 0 }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Slide direction="up" in={true} timeout={600} style={{ transitionDelay: `${delay}ms` }}>
      <Card
        sx={{
          height: '100%',
          background: `linear-gradient(135deg, ${theme.palette[color].main}15 0%, ${theme.palette[color].main}05 100%)`,
          border: `1px solid ${theme.palette[color].main}20`,
          position: 'relative',
          overflow: 'visible',
          '&:hover': {
            '& .stat-icon': {
              transform: 'scale(1.1) rotate(5deg)',
            },
          },
        }}
      >
        <CardContent sx={{ p: isMobile ? 2 : 3 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {title}
              </Typography>
              <Typography variant={isMobile ? 'h4' : 'h3'} component="div" fontWeight="bold">
                <AnimatedCounter value={value} />
              </Typography>
              {subtitle && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
            <Avatar
              className="stat-icon"
              sx={{
                bgcolor: theme.palette[color].main,
                width: isMobile ? 48 : 56,
                height: isMobile ? 48 : 56,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {icon}
            </Avatar>
          </Box>
        </CardContent>
      </Card>
    </Slide>
  );
};

// Challenge card component
const ChallengeCard = ({ challenge, index }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'primary';
    }
  };

  return (
    <Fade in={true} timeout={800} style={{ transitionDelay: `${index * 150}ms` }}>
      <Card
        sx={{
          height: '100%',
          position: 'relative',
          '&:hover': {
            '& .challenge-progress': {
              '& .MuiLinearProgress-bar': {
                animation: 'progressPulse 2s infinite',
              },
            },
          },
          '@keyframes progressPulse': {
            '0%': { opacity: 1 },
            '50%': { opacity: 0.7 },
            '100%': { opacity: 1 },
          },
        }}
      >
        <CardContent sx={{ p: isMobile ? 2 : 3 }}>
          <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
            <Typography variant={isMobile ? 'h6' : 'h5'} component="h2" fontWeight="bold">
              {challenge.name || challenge.title}
            </Typography>
            <Chip
              label={challenge.difficulty || 'Medium'}
              color={getDifficultyColor(challenge.difficulty)}
              size="small"
              sx={{ ml: 1 }}
            />
          </Box>
          
          <Typography variant="body2" color="text.secondary" paragraph>
            {challenge.description}
          </Typography>
          
          <Box mb={2}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
              <Typography variant="body2" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {challenge.progress || Math.floor(Math.random() * 101)}%
              </Typography>
            </Box>
            <LinearProgress
              className="challenge-progress"
              variant="determinate"
              value={challenge.progress || Math.floor(Math.random() * 101)}
              sx={{
                height: 8,
                borderRadius: 4,
              }}
            />
          </Box>
          
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Chip
              icon={<StarIcon fontSize="small" />}
              label={`${challenge.points || 100} points`}
              variant="outlined"
              size="small"
            />
            <Chip
              icon={<ScheduleIcon fontSize="small" />}
              label={challenge.deadline || `${Math.floor(Math.random() * 7 + 1)} days left`}
              variant="outlined"
              size="small"
            />
          </Box>
        </CardContent>
        
        <CardActions sx={{ px: isMobile ? 2 : 3, pb: isMobile ? 2 : 3 }}>
          <Button
            component={Link}
            to={`/challenges/${challenge._id}`}
            variant="contained"
            size={isMobile ? 'small' : 'medium'}
            fullWidth={isMobile}
            sx={{
              background: 'linear-gradient(135deg, #6366F1 0%, #8B8CF8 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
              },
            }}
          >
            {(challenge.progress || 0) === 100 ? 'Review' : 'Continue'}
          </Button>
        </CardActions>
      </Card>
    </Fade>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalChallenges: 0,
    completedChallenges: 0,
    totalPoints: 0,
    currentLevel: 1,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch user challenges
      const challengesResponse = await fetch('/api/challenges', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (challengesResponse.ok) {
        const responseData = await challengesResponse.json(); // Rename to avoid confusion
        const challengesArray = responseData.challenges || []; // Access the challenges array
        const recentChallenges = challengesArray.slice(0, 4).map(challenge => ({
          ...challenge,
          progress: Math.floor(Math.random() * 101), // Simulated progress
          deadline: `${Math.floor(Math.random() * 7 + 1)} days left`,
        }));
        setChallenges(recentChallenges);
        
        // Calculate stats
        setStats({
          totalChallenges: challengesArray.length,
          completedChallenges: Math.floor(challengesArray.length * 0.6),
          totalPoints: challengesArray.reduce((sum, c) => sum + (c.points || 100), 0),
          currentLevel: Math.floor(challengesArray.length / 3) + 1,
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { icon: <AddIcon />, label: 'New Challenge', path: '/create-challenge', color: 'primary' },
    { icon: <AssignmentIcon />, label: 'All Challenges', path: '/challenges', color: 'secondary' },
    { icon: <TimelineIcon />, label: 'Progress', path: '/progress', color: 'success' },
    { icon: <GroupIcon />, label: 'Community', path: '/community', color: 'warning' },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: isMobile ? 2 : 4 }}>
      {/* Welcome Section */}
      <Fade in={true} timeout={600}>
        <Box mb={4}>
          <Typography variant={isMobile ? 'h4' : 'h3'} component="h1" gutterBottom fontWeight="bold">
            Welcome back, {user?.firstName || user?.email?.split('@')[0] || 'Champion'}! 🚀
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Ready to conquer new challenges and level up your skills?
          </Typography>
        </Box>
      </Fade>

      {/* Stats Cards */}
      <Grid container spacing={isMobile ? 2 : 3} mb={4}>
        <Grid item xs={6} md={3}>
          <StatCard
            icon={<AssignmentIcon />}
            title="Total Challenges"
            value={loading ? 0 : stats.totalChallenges}
            subtitle="Available"
            color="primary"
            delay={0}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard
            icon={<CheckCircleIcon />}
            title="Completed"
            value={loading ? 0 : stats.completedChallenges}
            subtitle="Challenges"
            color="success"
            delay={100}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard
            icon={<StarIcon />}
            title="Total Points"
            value={loading ? 0 : stats.totalPoints}
            subtitle="Earned"
            color="warning"
            delay={200}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard
            icon={<TrophyIcon />}
            title="Current Level"
            value={loading ? 0 : stats.currentLevel}
            subtitle="Keep growing!"
            color="secondary"
            delay={300}
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Slide direction="up" in={true} timeout={800} style={{ transitionDelay: '400ms' }}>
        <Paper
          elevation={0}
          sx={{
            p: isMobile ? 2 : 3,
            mb: 4,
            background: 'linear-gradient(135deg, #6366F115 0%, #EC489905 100%)',
            border: '1px solid #E5E7EB',
          }}
        >
          <Typography variant="h6" gutterBottom fontWeight="bold" mb={2}>
            Quick Actions
          </Typography>
          <Grid container spacing={isMobile ? 1 : 2}>
            {quickActions.map((action, index) => (
              <Grid item xs={6} sm={3} key={action.label}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={action.icon}
                  onClick={() => navigate(action.path)}
                  sx={{
                    p: isMobile ? 1.5 : 2,
                    borderRadius: 3,
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    borderColor: theme.palette[action.color].main + '30',
                    color: theme.palette[action.color].main,
                    '&:hover': {
                      borderColor: theme.palette[action.color].main,
                      backgroundColor: theme.palette[action.color].main + '08',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  {isMobile ? '' : action.label}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Slide>

      {/* Recent Challenges */}
      <Slide direction="up" in={true} timeout={1000} style={{ transitionDelay: '600ms' }}>
        <Box mb={4}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
            <Typography variant="h5" component="h2" fontWeight="bold">
              Recent Challenges
            </Typography>
            <Button
              component={Link}
              to="/challenges"
              variant="text"
              color="primary"
              sx={{ fontWeight: 500 }}
            >
              View All
            </Button>
          </Box>
          
          <Grid container spacing={isMobile ? 2 : 3}>
            {loading ? (
              // Loading skeletons
              Array.from(new Array(4)).map((_, index) => (
                <Grid item xs={12} sm={6} lg={3} key={index}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Skeleton variant="text" width="80%" height={32} />
                      <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
                      <Skeleton variant="text" width="100%" height={60} sx={{ mb: 2 }} />
                      <Skeleton variant="rectangular" width="100%" height={8} sx={{ mb: 2 }} />
                      <Box display="flex" gap={1}>
                        <Skeleton variant="rounded" width={80} height={24} />
                        <Skeleton variant="rounded" width={100} height={24} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : challenges.length > 0 ? (
              challenges.map((challenge, index) => (
                <Grid item xs={12} sm={6} lg={3} key={challenge._id}>
                  <ChallengeCard challenge={challenge} index={index} />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
                  }}
                >
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No challenges yet!
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Start your journey by creating your first challenge.
                  </Typography>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/create-challenge"
                    startIcon={<AddIcon />}
                  >
                    Create Challenge
                  </Button>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Box>
      </Slide>

      {/* Floating Action Button */}
      <Zoom in={true} timeout={1000} style={{ transitionDelay: '800ms' }}>
        <Fab
          color="primary"
          aria-label="add challenge"
          onClick={() => navigate('/create-challenge')}
          sx={{
            position: 'fixed',
            bottom: isMobile ? 16 : 32,
            right: isMobile ? 16 : 32,
            background: 'linear-gradient(135deg, #6366F1 0%, #8B8CF8 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
              transform: 'scale(1.1)',
            },
          }}
        >
          <AddIcon />
        </Fab>
      </Zoom>
    </Container>
  );
};

export default Dashboard;