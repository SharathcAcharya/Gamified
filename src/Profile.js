import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
  useTheme,
  useMediaQuery,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Slide,
  Zoom,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  CircularProgress,
  Tooltip,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from '@mui/material';
import {
  Edit as EditIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
  LocalFireDepartment as FireIcon,
  Settings as SettingsIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
  LeaderboardRounded as LeaderboardIcon,
  LocationOn as LocationIcon,
  Language as LanguageIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useSocket } from './contexts/SocketContext';

function Profile() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { socket } = useSocket();

  // Enhanced mock user data
  const userProfile = {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    avatar: '/static/images/avatar/1.jpg',
    title: 'Full-Stack Developer',
    location: 'San Francisco, CA',
    bio: 'Passionate developer who loves building amazing user experiences. Always learning and sharing knowledge with the community.',
    joinedDate: new Date('2023-01-15'),
    website: 'https://sarahchen.dev',
    github: 'sarahchen',
    linkedin: 'sarahchen-dev',
    
    stats: {
      totalPoints: 12450,
      currentStreak: 28,
      longestStreak: 45,
      challengesCompleted: 23,
      challengesCreated: 8,
      rank: 15,
      level: 12,
      nextLevelPoints: 2550,
      totalChallengesJoined: 31,
      successRate: 74,
      communityScore: 4.9
    },

    achievements: [
      {
        id: '1',
        title: 'Code Master',
        description: 'Completed 10 coding challenges',
        icon: '💻',
        rarity: 'legendary',
        earnedDate: new Date('2024-01-15'),
        points: 1000
      },
      {
        id: '2',
        title: 'Streak Champion',
        description: '30-day challenge streak',
        icon: '🔥',
        rarity: 'epic',
        earnedDate: new Date('2024-02-01'),
        points: 750
      },
      {
        id: '3',
        title: 'Community Leader',
        description: 'Helped 50+ community members',
        icon: '🌟',
        rarity: 'rare',
        earnedDate: new Date('2024-01-20'),
        points: 500
      },
      {
        id: '4',
        title: 'Fitness Guru',
        description: 'Completed all fitness challenges',
        icon: '💪',
        rarity: 'epic',
        earnedDate: new Date('2024-02-10'),
        points: 800
      }
    ],

    activeChallenges: [
      {
        id: '1',
        title: '30-Day React Mastery',
        progress: 68,
        daysLeft: 12,
        category: 'Programming',
        points: 1500,
        difficulty: 'intermediate'
      },
      {
        id: '2',
        title: 'Morning Meditation',
        progress: 85,
        daysLeft: 8,
        category: 'Wellness',
        points: 800,
        difficulty: 'easy'
      },
      {
        id: '3',
        title: 'Design Sprint Challenge',
        progress: 42,
        daysLeft: 18,
        category: 'Design',
        points: 1200,
        difficulty: 'hard'
      }
    ],

    recentActivity: [
      {
        id: '1',
        type: 'achievement',
        title: 'Earned "Code Master" achievement',
        points: 1000,
        date: new Date('2024-02-15'),
        icon: '🏆'
      },
      {
        id: '2',
        type: 'challenge_completed',
        title: 'Completed "JavaScript Fundamentals"',
        points: 500,
        date: new Date('2024-02-14'),
        icon: '✅'
      },
      {
        id: '3',
        type: 'streak',
        title: 'Reached 25-day streak!',
        points: 250,
        date: new Date('2024-02-13'),
        icon: '🔥'
      },
      {
        id: '4',
        type: 'challenge_joined',
        title: 'Joined "React Mastery Challenge"',
        points: 0,
        date: new Date('2024-02-12'),
        icon: '🚀'
      }
    ],

    skills: [
      { name: 'JavaScript', level: 95, color: '#F7DF1E' },
      { name: 'React', level: 90, color: '#61DAFB' },
      { name: 'Node.js', level: 85, color: '#339933' },
      { name: 'Python', level: 80, color: '#3776AB' },
      { name: 'Design', level: 75, color: '#FF6B6B' },
      { name: 'Leadership', level: 88, color: '#6366F1' }
    ]
  };

  const [activeTab, setActiveTab] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      // Map backend profile to frontend structure
      const mappedProfile = {
        id: data._id || data.id,
        name: data.displayName || data.username,
        email: data.email,
        avatar: data.avatar || data.profilePicture,
        title: data.bio || 'Member',
        location: data.location || 'Online',
        joinedDate: new Date(data.createdAt || Date.now()),
        
        stats: {
          totalPoints: data.experience || 0,
          currentStreak: data.streak || 0,
          longestStreak: data.longestStreak || 0,
          challengesCompleted: data.stats?.challengesCompleted || 0,
          challengesCreated: data.stats?.challengesCreated || 0,
          rank: data.rank || 0,
          level: data.level || 1,
          nextLevelPoints: 1000 - ((data.experience || 0) % 1000),
          totalChallengesJoined: data.challenges?.total || 0,
          successRate: data.successRate || 0,
          communityScore: data.communityScore || 5.0
        },

        achievements: data.achievements || [],
        activeChallenges: data.challenges?.activeChallenges || [],
        recentActivity: data.recentActivity || [],
        skills: data.skills || []
      };

      setProfileData(mappedProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on('stats_update', (data) => {
        setProfileData(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            stats: {
              ...prev.stats,
              totalPoints: data.totalPoints,
              level: data.currentLevel
            }
          };
        });
      });

      socket.on('streak_update', (newStreak) => {
        setProfileData(prev => ({
          ...prev,
          stats: { ...prev.stats, currentStreak: newStreak }
        }));
      });

      socket.on('points_update', (newPoints) => {
        setProfileData(prev => ({
          ...prev,
          stats: { ...prev.stats, totalPoints: newPoints }
        }));
      });

      socket.on('level_update', (newLevel) => {
        setProfileData(prev => ({
          ...prev,
          stats: { ...prev.stats, level: newLevel }
        }));
      });

      socket.on('achievement_unlocked', (achievement) => {
        setProfileData(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            achievements: [achievement, ...prev.achievements]
          };
        });
      });

      return () => {
        socket.off('stats_update');
        socket.off('streak_update');
        socket.off('points_update');
        socket.off('level_update');
        socket.off('achievement_unlocked');
      };
    }
  }, [socket]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return theme.palette.grey[600];
      case 'rare': return theme.palette.info.main;
      case 'epic': return theme.palette.secondary.main;
      case 'legendary': return theme.palette.warning.main;
      default: return theme.palette.primary.main;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return theme.palette.success.main;
      case 'intermediate': return theme.palette.warning.main;
      case 'hard': return theme.palette.error.main;
      default: return theme.palette.primary.main;
    }
  };

  const StatCard = ({ icon, label, value, color = 'primary', subtitle }) => (
    <Zoom in={true} timeout={600}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          textAlign: 'center',
          background: `linear-gradient(135deg, ${theme.palette[color].main}15 0%, ${theme.palette[color].main}05 100%)`,
          border: `1px solid ${theme.palette[color].main}20`,
          borderRadius: 3,
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[8],
          },
        }}
      >
        <Box sx={{ color: `${color}.main`, mb: 2 }}>
          {icon}
        </Box>
        <Typography variant="h4" fontWeight="bold" color={`${color}.main`}>
          {value}
        </Typography>
        <Typography variant="body1" fontWeight="medium" gutterBottom>
          {label}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Paper>
    </Zoom>
  );

  const AchievementCard = ({ achievement, index }) => (
    <Zoom in={true} timeout={400} style={{ transitionDelay: `${index * 100}ms` }}>
      <Card
        sx={{
          height: '100%',
          background: `linear-gradient(135deg, ${getRarityColor(achievement.rarity)}15 0%, ${getRarityColor(achievement.rarity)}05 100%)`,
          border: `2px solid ${getRarityColor(achievement.rarity)}30`,
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: theme.shadows[12],
          },
        }}
      >
        <CardContent sx={{ p: 3, textAlign: 'center' }}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: getRarityColor(achievement.rarity),
              fontSize: '2rem',
              mx: 'auto',
              mb: 2,
              boxShadow: theme.shadows[8],
            }}
          >
            {achievement.icon}
          </Avatar>
          
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {achievement.title}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" paragraph>
            {achievement.description}
          </Typography>
          
          <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
            <Chip
              label={achievement.rarity.toUpperCase()}
              size="small"
              sx={{
                bgcolor: getRarityColor(achievement.rarity),
                color: 'white',
                fontWeight: 600,
                fontSize: '0.7rem'
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <StarIcon sx={{ color: theme.palette.warning.main, fontSize: 16 }} />
              <Typography variant="body2" fontWeight="bold">
                {achievement.points}
              </Typography>
            </Box>
          </Stack>
          
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Earned {format(achievement.earnedDate, 'MMM d, yyyy')}
          </Typography>
        </CardContent>
      </Card>
    </Zoom>
  );

  const ChallengeCard = ({ challenge, index }) => (
    <Zoom in={true} timeout={400} style={{ transitionDelay: `${index * 100}ms` }}>
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ flex: 1 }}>
              {challenge.title}
            </Typography>
            <Chip
              label={challenge.difficulty}
              size="small"
              sx={{
                bgcolor: getDifficultyColor(challenge.difficulty),
                color: 'white',
                fontWeight: 600,
                ml: 1
              }}
            />
          </Box>

          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Chip label={challenge.category} size="small" variant="outlined" />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ScheduleIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {challenge.daysLeft}d left
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {challenge.progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={challenge.progress}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: theme.palette.grey[200],
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #6366F1 0%, #8B8CF8 100%)',
                },
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <StarIcon sx={{ color: theme.palette.warning.main, fontSize: 18 }} />
            <Typography variant="body2" fontWeight="medium">
              {challenge.points} points
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Zoom>
  );

  const ActivityItem = ({ activity, index }) => (
    <Slide direction="left" in={true} timeout={400} style={{ transitionDelay: `${index * 50}ms` }}>
      <ListItem
        sx={{
          border: '1px solid #E5E7EB',
          borderRadius: 2,
          mb: 1,
          '&:hover': {
            backgroundColor: theme.palette.grey[50],
            transform: 'translateX(8px)',
          },
        }}
      >
        <ListItemAvatar>
          <Avatar
            sx={{
              bgcolor: activity.points > 0 ? 'success.main' : 'info.main',
              width: 40,
              height: 40,
            }}
          >
            {activity.icon}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={activity.title}
          secondary={
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
              <Typography variant="body2" color="text.secondary" component="span">
                {format(activity.date, 'MMM d, yyyy • h:mm a')}
              </Typography>
              {activity.points > 0 && (
                <Chip
                  label={`+${activity.points} pts`}
                  size="small"
                  color="success"
                  sx={{ fontSize: '0.7rem', height: 20 }}
                />
              )}
            </Box>
          }
          secondaryTypographyProps={{ component: 'div' }}
        />
      </ListItem>
    </Slide>
  );

  const SkillBar = ({ skill, index }) => (
    <Slide direction="right" in={true} timeout={400} style={{ transitionDelay: `${index * 100}ms` }}>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" fontWeight="medium">
            {skill.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {skill.level}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={skill.level}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: theme.palette.grey[200],
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
              backgroundColor: skill.color,
            },
          }}
        />
      </Box>
    </Slide>
  );

  const renderOverview = () => (
    <Grid container spacing={3}>
      {/* Stats */}
      <Grid item xs={12}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Your Statistics
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <StatCard
              icon={<StarIcon fontSize="large" />}
              label="Total Points"
              value={profileData.stats.totalPoints.toLocaleString()}
              color="warning"
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <StatCard
              icon={<FireIcon fontSize="large" />}
              label="Current Streak"
              value={`${profileData.stats.currentStreak}d`}
              color="error"
              subtitle={`Best: ${profileData.stats.longestStreak}d`}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <StatCard
              icon={<TrophyIcon fontSize="large" />}
              label="Completed"
              value={profileData.stats.challengesCompleted}
              color="success"
              subtitle={`${profileData.stats.successRate}% success rate`}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <StatCard
              icon={<LeaderboardIcon fontSize="large" />}
              label="Global Rank"
              value={`#${profileData.stats.rank}`}
              color="info"
              subtitle={`Level ${profileData.stats.level}`}
            />
          </Grid>
        </Grid>
      </Grid>

      {/* Level Progress */}
      <Grid item xs={12}>
        <Card elevation={0} sx={{ border: '1px solid #E5E7EB' }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Level Progress
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 56,
                  height: 56,
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                }}
              >
                {profileData.stats.level}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight="bold">
                  Level {profileData.stats.level}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {profileData.stats.nextLevelPoints} points to next level
                </Typography>
              </Box>
            </Box>
            <LinearProgress
              variant="determinate"
              value={75}
              sx={{
                height: 12,
                borderRadius: 6,
                bgcolor: theme.palette.grey[200],
                '& .MuiLinearProgress-bar': {
                  borderRadius: 6,
                  background: 'linear-gradient(135deg, #6366F1 0%, #8B8CF8 100%)',
                },
              }}
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Skills */}
      <Grid item xs={12} md={6}>
        <Card elevation={0} sx={{ border: '1px solid #E5E7EB', height: '100%' }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Skills & Expertise
            </Typography>
            {profileData.skills.map((skill, index) => (
              <SkillBar key={skill.name} skill={skill} index={index} />
            ))}
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Activity */}
      <Grid item xs={12} md={6}>
        <Card elevation={0} sx={{ border: '1px solid #E5E7EB', height: '100%' }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Recent Activity
            </Typography>
            <List sx={{ p: 0 }}>
              {profileData.recentActivity.slice(0, 4).map((activity, index) => (
                <ActivityItem key={activity.id} activity={activity} index={index} />
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderAchievements = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Your Achievements ({profileData.achievements.length})
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Showcase your accomplishments and milestones
        </Typography>
      </Grid>
      
      {profileData.achievements.map((achievement, index) => (
        <Grid item xs={12} sm={6} lg={3} key={achievement.id}>
          <AchievementCard achievement={achievement} index={index} />
        </Grid>
      ))}
    </Grid>
  );

  const renderActiveChallenges = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Active Challenges ({profileData.activeChallenges.length})
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Keep track of your ongoing challenges and progress
        </Typography>
      </Grid>
      
      {profileData.activeChallenges.map((challenge, index) => (
        <Grid item xs={12} md={6} lg={4} key={challenge.id}>
          <ChallengeCard challenge={challenge} index={index} />
        </Grid>
      ))}
    </Grid>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!profileData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Error loading profile. Please try again later.</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
      {/* Profile Header */}
      <Slide direction="down" in={true} timeout={600}>
        <Card 
          elevation={0} 
          sx={{ 
            mb: 4,
            border: '1px solid #E5E7EB',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 140, 248, 0.05) 100%)',
          }}
        >
          <CardContent sx={{ p: { xs: 2, md: 4 } }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md="auto">
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 3 }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <Avatar
                        sx={{ 
                          bgcolor: 'primary.main', 
                          width: 32, 
                          height: 32,
                          border: '2px solid white',
                          fontSize: '0.9rem',
                          fontWeight: 'bold'
                        }}
                      >
                        {profileData.stats.level}
                      </Avatar>
                    }
                  >
                    <Avatar
                      src={profileData.avatar}
                      sx={{
                        width: { xs: 120, md: 140 },
                        height: { xs: 120, md: 140 },
                        border: '4px solid white',
                        boxShadow: theme.shadows[8],
                      }}
                    >
                      {profileData.name.charAt(0)}
                    </Avatar>
                  </Badge>
                  
                  <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                      {profileData.name}
                    </Typography>
                    <Typography variant="h6" color="primary.main" gutterBottom>
                      {profileData.title}
                    </Typography>
                    <Stack direction="row" spacing={1} justifyContent={{ xs: 'center', sm: 'flex-start' }} flexWrap="wrap" sx={{ mb: 2 }}>
                      <Chip
                        icon={<LocationIcon />}
                        label={profileData.location}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        icon={<CalendarIcon />}
                        label={`Joined ${format(profileData.joinedDate, 'MMM yyyy')}`}
                        size="small"
                        variant="outlined"
                      />
                    </Stack>
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400 }}>
                      {profileData.bio}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} md sx={{ textAlign: { xs: 'center', md: 'right' } }}>
                <Stack spacing={2} alignItems={{ xs: 'center', md: 'flex-end' }}>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Edit Profile">
                      <IconButton onClick={() => setEditDialogOpen(true)} color="primary">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Share Profile">
                      <IconButton color="primary">
                        <ShareIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Settings">
                      <IconButton color="primary">
                        <SettingsIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                  
                  {/* Social Links */}
                  <Stack direction="row" spacing={1}>
                    {profileData.github && (
                      <IconButton size="small" component="a" href={`https://github.com/${profileData.github}`} target="_blank">
                        <GitHubIcon />
                      </IconButton>
                    )}
                    {profileData.linkedin && (
                      <IconButton size="small" component="a" href={`https://linkedin.com/in/${profileData.linkedin}`} target="_blank">
                        <LinkedInIcon />
                      </IconButton>
                    )}
                    {profileData.website && (
                      <IconButton size="small" component="a" href={profileData.website} target="_blank">
                        <LanguageIcon />
                      </IconButton>
                    )}
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Slide>

      {/* Navigation Tabs */}
      <Slide direction="up" in={true} timeout={800}>
        <Paper elevation={0} sx={{ mb: 4, border: '1px solid #E5E7EB', borderRadius: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              variant={isMobile ? "fullWidth" : "standard"}
              sx={{
                '& .MuiTab-root': {
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem'
                }
              }}
            >
              <Tab label="Overview" />
              <Tab label="Achievements" />
              <Tab label="Active Challenges" />
            </Tabs>
          </Box>
        </Paper>
      </Slide>

      {/* Content */}
      <Box>
        {activeTab === 0 && renderOverview()}
        {activeTab === 1 && renderAchievements()}
        {activeTab === 2 && renderActiveChallenges()}
      </Box>

      {/* Mobile Actions */}
      {isMobile && (
        <SpeedDial
          ariaLabel="Profile actions"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
        >
          <SpeedDialAction
            icon={<EditIcon />}
            tooltipTitle="Edit Profile"
            onClick={() => setEditDialogOpen(true)}
          />
          <SpeedDialAction
            icon={<ShareIcon />}
            tooltipTitle="Share"
            onClick={() => {}}
          />
          <SpeedDialAction
            icon={<DownloadIcon />}
            tooltipTitle="Export Data"
            onClick={() => {}}
          />
        </SpeedDial>
      )}

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h5" component="span" fontWeight="bold">
            Edit Profile
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                defaultValue={profileData.name}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Title"
                defaultValue={profileData.title}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bio"
                defaultValue={profileData.bio}
                multiline
                rows={3}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                defaultValue={profileData.location}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Website"
                defaultValue={profileData.website}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => setEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(135deg, #6366F1 0%, #8B8CF8 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
                    },
                  }}
                >
                  Save Changes
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default Profile;