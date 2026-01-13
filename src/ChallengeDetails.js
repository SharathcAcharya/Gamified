import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Tab,
  Tabs,
  Typography,
  useTheme,
  useMediaQuery,
  Container,
  Paper,
  Fade,
  Slide,
  Zoom,
  Badge,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Favorite as HeartIcon,
  FavoriteBorder as HeartOutlineIcon,
  Share as ShareIcon,
  Star as StarIcon,
  CheckCircle as CheckIcon,
  RadioButtonUnchecked as UncheckedIcon,
  CalendarToday as CalendarIcon,
  LocalFireDepartment as FireIcon,
  Comment as CommentIcon,
  Flag as FlagIcon,
  BookmarkBorder as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingIcon,
  PlayArrow as PlayIcon,
  Groups as GroupsIcon,
  Leaderboard as LeaderboardIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';
import { useSocket } from './contexts/SocketContext';

// Enhanced mock data with modern features
const mockChallenge = {
  id: '1',
  title: '30-Day Full-Stack JavaScript Mastery',
  description: 'Master modern JavaScript, React, Node.js, and MongoDB through hands-on projects. Build 5 real-world applications while learning industry best practices and modern development workflows.',
  longDescription: 'This comprehensive challenge is designed for aspiring developers who want to master the complete JavaScript ecosystem. Over 30 days, you\'ll progress from JavaScript fundamentals to building full-stack applications using the MERN stack.',
  category: 'Programming',
  difficulty: 'intermediate',
  startDate: new Date('2024-02-01'),
  endDate: new Date('2024-03-02'),
  creator: {
    id: '1',
    name: 'Sarah Chen',
    avatar: '/static/images/avatar/1.jpg',
    title: 'Senior Full-Stack Developer',
    experience: '5+ years'
  },
  participants: [
    { 
      id: '2', 
      name: 'Mike Johnson', 
      avatar: '/static/images/avatar/2.jpg', 
      progress: 85,
      rank: 1,
      points: 2450,
      streak: 12
    },
    { 
      id: '3', 
      name: 'Emma Davis', 
      avatar: '/static/images/avatar/3.jpg', 
      progress: 72,
      rank: 2, 
      points: 2100,
      streak: 8
    },
    { 
      id: '4', 
      name: 'Alex Kim', 
      avatar: '/static/images/avatar/4.jpg', 
      progress: 68,
      rank: 3,
      points: 1950,
      streak: 6
    },
    { 
      id: '5', 
      name: 'Lisa Wang', 
      avatar: '/static/images/avatar/5.jpg', 
      progress: 54,
      rank: 4,
      points: 1600,
      streak: 4
    }
  ],
  milestones: [
    { 
      id: '1', 
      title: 'JavaScript Fundamentals', 
      description: 'Variables, functions, objects, and ES6+ features',
      completed: true,
      points: 200,
      week: 1
    },
    { 
      id: '2', 
      title: 'DOM Manipulation & Events', 
      description: 'Interactive web development basics',
      completed: true,
      points: 250,
      week: 1
    },
    { 
      id: '3', 
      title: 'React Components & Hooks', 
      description: 'Modern React development patterns',
      completed: true,
      points: 300,
      week: 2
    },
    { 
      id: '4', 
      title: 'State Management', 
      description: 'Context API and Redux fundamentals',
      completed: false,
      points: 350,
      week: 3
    },
    { 
      id: '5', 
      title: 'Node.js & Express', 
      description: 'Backend development with JavaScript',
      completed: false,
      points: 400,
      week: 3
    },
    { 
      id: '6', 
      title: 'Database Integration', 
      description: 'MongoDB and Mongoose ODM',
      completed: false,
      points: 450,
      week: 4
    },
    { 
      id: '7', 
      title: 'Full-Stack Project', 
      description: 'Deploy a complete MERN application',
      completed: false,
      points: 500,
      week: 4
    }
  ],
  stats: {
    totalParticipants: 1247,
    activeParticipants: 892,
    completionRate: 73,
    averageProgress: 45,
    totalPoints: 2500,
    communityScore: 4.8
  },
  progress: 42,
  userProgress: {
    completedMilestones: 3,
    totalMilestones: 7,
    currentStreak: 5,
    longestStreak: 8,
    pointsEarned: 750,
    rank: 156
  },
  likes: 428,
  isLiked: false,
  isBookmarked: true,
  isTrending: true,
  xpReward: 2500,
  achievement: {
    title: 'JavaScript Master',
    description: 'Successfully mastered the complete JavaScript ecosystem',
    rarity: 'legendary',
    badge: '🏆'
  },
  tags: ['javascript', 'react', 'nodejs', 'mongodb', 'fullstack'],
  features: [
    'Daily coding challenges',
    'Live mentoring sessions',
    'Project-based learning',
    'Community support',
    'Career guidance'
  ],
  daysLeft: 18,
  isActive: true
};

function ChallengeDetails() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { id } = useParams();
  const { socket } = useSocket();
  
  const [activeTab, setActiveTab] = useState(0);
  const [isLiked, setIsLiked] = useState(mockChallenge.isLiked);
  const [isBookmarked, setIsBookmarked] = useState(mockChallenge.isBookmarked);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [challengeData, setChallengeData] = useState(null);

  useEffect(() => {
    fetchChallengeDetails();
  }, [id]);

  const fetchChallengeDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/challenges/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      // Map backend challenge to frontend structure
      const mappedChallenge = {
        ...data,
        id: data._id || data.id,
        userProgress: {
          completedMilestones: data.userProgress?.completedMilestones || 0,
          totalMilestones: data.milestones?.length || 0,
          currentStreak: data.userProgress?.streak || 0,
          pointsEarned: data.userProgress?.points || 0,
          rank: data.userProgress?.rank || 0
        },
        stats: {
          totalParticipants: data.stats?.totalParticipants || 0,
          activeParticipants: data.stats?.activeParticipants || 0,
          completionRate: data.stats?.completionRate || 0,
          averageProgress: data.stats?.averageProgress || 0,
          totalPoints: data.points || 0,
          communityScore: data.communityScore || 4.5
        }
      };

      setChallengeData(mappedChallenge);
      setIsLiked(data.isLiked);
      setLikesCount(data.likes || 0);
    } catch (error) {
      console.error('Error fetching challenge details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (socket && id) {
      socket.emit('join_challenge', id);

      socket.on('participant_joined', (data) => {
        console.log('New participant joined:', data);
        // Could update participants list in real-time
      });

      socket.on('challenge_update', (data) => {
        console.log('Challenge update received:', data);
        if (data.id === id || data._id === id) {
          setChallengeData(prev => prev ? ({ ...prev, ...data }) : null);
        }
      });

      socket.on('participant_count_update', ({ challengeId, count }) => {
        if (challengeId === id) {
          setChallengeData(prev => prev ? ({
            ...prev,
            stats: { ...prev.stats, totalParticipants: count }
          }) : null);
        }
      });

      return () => {
        socket.emit('leave_challenge', id);
        socket.off('participant_joined');
        socket.off('challenge_update');
        socket.off('participant_count_update');
      };
    }
  }, [socket, id]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleLikeToggle = async () => {
    try {
      const response = await fetch(`/api/challenges/${id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        setIsLiked(!isLiked);
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return theme.palette.success.main;
      case 'intermediate': return theme.palette.warning.main;
      case 'hard': return theme.palette.error.main;
      default: return theme.palette.grey[500];
    }
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

  const calculateProgress = () => {
    return Math.round((challengeData.userProgress.completedMilestones / challengeData.userProgress.totalMilestones) * 100);
  };

  const AnimatedStat = ({ icon, label, value, color = 'primary' }) => (
    <Zoom in={true} timeout={600}>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 140, 248, 0.05) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.1)',
          borderRadius: 3,
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[8],
          },
        }}
      >
        <Box sx={{ color: `${color}.main`, mb: 1 }}>
          {icon}
        </Box>
        <Typography variant="h6" fontWeight="bold">
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </Paper>
    </Zoom>
  );

  const MilestoneStep = ({ milestone, index, isActive }) => (
    <Zoom in={true} timeout={400} style={{ transitionDelay: `${index * 100}ms` }}>
      <Card
        sx={{
          mb: 2,
          border: milestone.completed ? '2px solid' : '1px solid',
          borderColor: milestone.completed ? 'success.main' : 'divider',
          background: milestone.completed 
            ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%)'
            : isActive 
            ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 140, 248, 0.05) 100%)'
            : 'transparent',
          '&:hover': {
            transform: 'translateX(8px)',
          },
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: milestone.completed
                  ? theme.palette.success.main
                  : isActive
                  ? theme.palette.primary.main
                  : theme.palette.grey[300],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              {milestone.completed ? (
                <CheckIcon />
              ) : isActive ? (
                <PlayIcon />
              ) : (
                <UncheckedIcon />
              )}
            </Box>
            
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="h6" fontWeight="bold">
                  {milestone.title}
                </Typography>
                <Chip
                  label={`${milestone.points} pts`}
                  size="small"
                  color={milestone.completed ? 'success' : 'default'}
                  sx={{ fontWeight: 600 }}
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary" paragraph>
                {milestone.description}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip
                  label={`Week ${milestone.week}`}
                  size="small"
                  variant="outlined"
                />
                {milestone.completed && (
                  <Typography variant="caption" color="success.main" fontWeight="bold">
                    ✅ Completed
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Zoom>
  );

  const renderOverview = () => (
    <Grid container spacing={3}>
      {/* Progress Stats */}
      <Grid item xs={12}>
        <Fade in={true} timeout={800}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #E5E7EB', mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Your Progress
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} sm={3}>
                <AnimatedStat
                  icon={<TrophyIcon fontSize="large" />}
                  label="Progress"
                  value={`${calculateProgress()}%`}
                  color="success"
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <AnimatedStat
                  icon={<FireIcon fontSize="large" />}
                  label="Streak"
                  value={`${challengeData.userProgress.currentStreak}d`}
                  color="error"
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <AnimatedStat
                  icon={<StarIcon fontSize="large" />}
                  label="Points"
                  value={challengeData.userProgress.pointsEarned}
                  color="warning"
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <AnimatedStat
                  icon={<LeaderboardIcon fontSize="large" />}
                  label="Rank"
                  value={`#${challengeData.userProgress.rank}`}
                  color="info"
                />
              </Grid>
            </Grid>

            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1" fontWeight="medium">
                  Overall Progress
                </Typography>
                <Typography variant="body1" fontWeight="bold" color="primary.main">
                  {calculateProgress()}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={calculateProgress()}
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
            </Box>
          </Paper>
        </Fade>
      </Grid>

      {/* Challenge Description */}
      <Grid item xs={12} lg={8}>
        <Slide direction="up" in={true} timeout={600}>
          <Card elevation={0} sx={{ border: '1px solid #E5E7EB', mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                About This Challenge
              </Typography>
              <Typography variant="body1" paragraph>
                {challengeData.longDescription}
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  What You'll Learn
                </Typography>
                <Stack spacing={1}>
                  {challengeData.features.map((feature, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckIcon color="success" fontSize="small" />
                      <Typography variant="body2">{feature}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>

              <Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Tags
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                  {challengeData.tags.map(tag => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: theme.palette.primary.main,
                          color: 'white'
                        }
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Slide>
      </Grid>

      {/* Challenge Stats */}
      <Grid item xs={12} lg={4}>
        <Slide direction="left" in={true} timeout={800}>
          <Card elevation={0} sx={{ border: '1px solid #E5E7EB', mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Challenge Stats
              </Typography>
              
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GroupsIcon color="action" fontSize="small" />
                    <Typography variant="body2">Participants</Typography>
                  </Box>
                  <Typography variant="body2" fontWeight="bold">
                    {challengeData.stats.totalParticipants.toLocaleString()}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingIcon color="action" fontSize="small" />
                    <Typography variant="body2">Completion Rate</Typography>
                  </Box>
                  <Typography variant="body2" fontWeight="bold" color="success.main">
                    {challengeData.stats.completionRate}%
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StarIcon color="action" fontSize="small" />
                    <Typography variant="body2">Community Score</Typography>
                  </Box>
                  <Typography variant="body2" fontWeight="bold">
                    {challengeData.stats.communityScore}/5.0
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ScheduleIcon color="action" fontSize="small" />
                    <Typography variant="body2">Days Left</Typography>
                  </Box>
                  <Typography variant="body2" fontWeight="bold" color="warning.main">
                    {challengeData.daysLeft} days
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 2 }} />

              {/* Achievement Preview */}
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Achievement Reward
              </Typography>
              <Card 
                variant="outlined" 
                sx={{ 
                  background: `linear-gradient(135deg, ${getRarityColor(challengeData.achievement.rarity)}15 0%, ${getRarityColor(challengeData.achievement.rarity)}05 100%)`,
                  border: `2px solid ${getRarityColor(challengeData.achievement.rarity)}30`
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      sx={{
                        bgcolor: getRarityColor(challengeData.achievement.rarity),
                        width: 48,
                        height: 48,
                        fontSize: '1.5rem'
                      }}
                    >
                      {challengeData.achievement.badge}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {challengeData.achievement.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        {challengeData.achievement.description}
                      </Typography>
                      <Chip
                        label={challengeData.achievement.rarity.toUpperCase()}
                        size="small"
                        sx={{
                          mt: 0.5,
                          bgcolor: getRarityColor(challengeData.achievement.rarity),
                          color: 'white',
                          fontSize: '0.7rem',
                          height: 20
                        }}
                      />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </Slide>
      </Grid>

      {/* Milestones */}
      <Grid item xs={12}>
        <Slide direction="up" in={true} timeout={1000}>
          <Card elevation={0} sx={{ border: '1px solid #E5E7EB' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Learning Milestones
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Track your progress through structured learning milestones
              </Typography>
              
              <Box>
                {challengeData.milestones.map((milestone, index) => {
                  const isActive = !milestone.completed && 
                    challengeData.milestones.slice(0, index).every(m => m.completed);
                  
                  return (
                    <MilestoneStep
                      key={milestone.id}
                      milestone={milestone}
                      index={index}
                      isActive={isActive}
                    />
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Slide>
      </Grid>
    </Grid>
  );

  const renderParticipants = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card elevation={0} sx={{ border: '1px solid #E5E7EB' }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Leaderboard
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              See how you stack up against other participants
            </Typography>

            <List>
              {mockChallenge.participants.map((participant, index) => (
                <Zoom in={true} timeout={400} style={{ transitionDelay: `${index * 100}ms` }} key={participant.id}>
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
                      <Badge
                        badgeContent={participant.rank}
                        color={participant.rank <= 3 ? 'primary' : 'default'}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                        }}
                      >
                        <Avatar 
                          src={participant.avatar}
                          sx={{ 
                            width: 48, 
                            height: 48,
                            border: participant.rank <= 3 ? '3px solid' : '2px solid',
                            borderColor: participant.rank === 1 ? '#FFD700' : 
                                       participant.rank === 2 ? '#C0C0C0' : 
                                       participant.rank === 3 ? '#CD7F32' : 'transparent'
                          }}
                        >
                          {participant.name.charAt(0)}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {participant.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <StarIcon sx={{ color: theme.palette.warning.main, fontSize: 16 }} />
                              <Typography variant="body2" fontWeight="bold">
                                {participant.points}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <FireIcon sx={{ color: theme.palette.error.main, fontSize: 16 }} />
                              <Typography variant="body2" fontWeight="bold">
                                {participant.streak}d
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2" color="text.secondary">
                              Progress
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {participant.progress}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={participant.progress}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              bgcolor: theme.palette.grey[200],
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 4,
                                background: participant.rank <= 3 
                                  ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
                                  : 'linear-gradient(135deg, #6366F1 0%, #8B8CF8 100%)',
                              },
                            }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                </Zoom>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!challengeData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Challenge not found or error loading data.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 8 }}>
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
        {/* Header */}
        <Slide direction="down" in={true} timeout={600}>
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} lg={8}>
                <Box sx={{ mb: 2 }}>
                  {challengeData.isTrending && (
                    <Chip
                      icon={<TrendingIcon />}
                      label="Trending"
                      color="error"
                      sx={{ 
                        mb: 2, 
                        background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                  )}
                  <Typography 
                    variant={isMobile ? "h4" : "h3"} 
                    component="h1" 
                    fontWeight="bold"
                    gutterBottom
                  >
                    {challengeData.title}
                  </Typography>
                  <Typography variant="h6" color="text.secondary" paragraph>
                    {challengeData.description}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ gap: 1 }}>
                  <Chip 
                    label={challengeData.category} 
                    sx={{ 
                      background: 'linear-gradient(135deg, #6366F1 0%, #8B8CF8 100%)',
                      color: 'white',
                      fontWeight: 600
                    }}
                  />
                  <Chip
                    label={challengeData.difficulty}
                    sx={{
                      bgcolor: getDifficultyColor(challengeData.difficulty),
                      color: 'white',
                      fontWeight: 600,
                      textTransform: 'capitalize'
                    }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={handleLikeToggle}
                      sx={{ 
                        color: isLiked ? 'error.main' : 'action.active',
                        '&:hover': { transform: 'scale(1.1)' }
                      }}
                    >
                      {isLiked ? <HeartIcon /> : <HeartOutlineIcon />}
                    </IconButton>
                    <Typography variant="body2" color="text.secondary" fontWeight="medium">
                      {likesCount}
                    </Typography>
                  </Box>
                </Stack>

                {/* Creator Info */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 3 }}>
                  <Avatar 
                    src={challengeData.creator.avatar} 
                    sx={{ 
                      width: 56, 
                      height: 56,
                      border: '3px solid',
                      borderColor: 'primary.main'
                    }}
                  >
                    {challengeData.creator.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {challengeData.creator.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {challengeData.creator.title} • {challengeData.creator.experience}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} lg={4}>
                <Card 
                  elevation={0} 
                  sx={{ 
                    border: '2px solid',
                    borderColor: 'primary.main',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 140, 248, 0.05) 100%)',
                    p: 2
                  }}
                >
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarIcon color="action" />
                      <Typography variant="body2">
                        {format(challengeData.startDate, 'MMM d')} - {format(challengeData.endDate, 'MMM d, yyyy')}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TrophyIcon sx={{ color: theme.palette.warning.main }} />
                      <Typography variant="body2" fontWeight="medium">
                        {challengeData.xpReward} XP Reward
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <GroupsIcon color="action" />
                      <Typography variant="body2">
                        {challengeData.stats.totalParticipants.toLocaleString()} Participants
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        onClick={() => setShowJoinDialog(true)}
                        sx={{
                          background: 'linear-gradient(135deg, #6366F1 0%, #8B8CF8 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
                          },
                        }}
                      >
                        Join Challenge
                      </Button>
                      <IconButton
                        onClick={handleBookmarkToggle}
                        sx={{ 
                          border: '2px solid',
                          borderColor: 'primary.main',
                          color: isBookmarked ? 'primary.main' : 'action.active'
                        }}
                      >
                        {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                      </IconButton>
                    </Stack>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Slide>

        {/* Navigation Tabs */}
        <Slide direction="up" in={true} timeout={800}>
          <Paper 
            elevation={0} 
            sx={{ 
              mb: 4,
              border: '1px solid #E5E7EB',
              borderRadius: 3
            }}
          >
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
                <Tab label="Leaderboard" />
              </Tabs>
            </Box>
          </Paper>
        </Slide>

        {/* Content */}
        <Box sx={{ mt: 3 }}>
          {activeTab === 0 ? renderOverview() : renderParticipants()}
        </Box>

        {/* Mobile Actions */}
        {isMobile && (
          <SpeedDial
            ariaLabel="Challenge actions"
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
            icon={<SpeedDialIcon />}
          >
            <SpeedDialAction
              icon={<ShareIcon />}
              tooltipTitle="Share"
              onClick={() => {}}
            />
            <SpeedDialAction
              icon={<CommentIcon />}
              tooltipTitle="Comments"
              onClick={() => {}}
            />
            <SpeedDialAction
              icon={<FlagIcon />}
              tooltipTitle="Report"
              onClick={() => {}}
            />
          </SpeedDial>
        )}

        {/* Join Dialog */}
        <Dialog open={showJoinDialog} onClose={() => setShowJoinDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
            <Typography variant="h5" component="span" fontWeight="bold">
              Join Challenge 🚀
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ textAlign: 'center', pb: 3 }}>
            <Typography variant="body1" paragraph>
              Ready to start your JavaScript mastery journey?
            </Typography>
            <Stack spacing={2}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  background: 'linear-gradient(135deg, #6366F1 0%, #8B8CF8 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
                  },
                }}
              >
                Join Now - Free
              </Button>
              <Button
                variant="outlined"
                onClick={() => setShowJoinDialog(false)}
              >
                Maybe Later
              </Button>
            </Stack>
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
}

export default ChallengeDetails;