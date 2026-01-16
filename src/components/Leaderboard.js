import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Button,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Fade,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  TrendingUp as TrendingUpIcon,
  LocalFireDepartment as FireIcon,
  Star as StarIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';

const Leaderboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);
  const [timeframe, setTimeframe] = useState('week');

  const [leaderboards, setLeaderboards] = useState({
    global: [
      { id: 1, name: 'Sarah Chen', avatar: 'S', points: 12450, level: 42, rank: 1, change: 0, streak: 45 },
      { id: 2, name: 'Mike Johnson', avatar: 'M', points: 11890, level: 40, rank: 2, change: 1, streak: 32 },
      { id: 3, name: 'Emily Rodriguez', avatar: 'E', points: 10250, level: 38, rank: 3, change: -1, streak: 28 },
      { id: 4, name: 'Alex Kim', avatar: 'A', points: 9780, level: 36, rank: 4, change: 2, streak: 25 },
      { id: 5, name: 'Jessica Wang', avatar: 'J', points: 9340, level: 35, rank: 5, change: 0, streak: 30 },
      { id: 6, name: 'David Lee', avatar: 'D', points: 8920, level: 34, rank: 6, change: -2, streak: 22 },
      { id: 7, name: 'Maria Garcia', avatar: 'M', points: 8550, level: 33, rank: 7, change: 3, streak: 18 },
      { id: 8, name: 'Chris Taylor', avatar: 'C', points: 8200, level: 32, rank: 8, change: 1, streak: 20 },
      { id: 9, name: 'Lisa Anderson', avatar: 'L', points: 7890, level: 31, rank: 9, change: -1, streak: 15 },
      { id: 10, name: 'Tom Wilson', avatar: 'T', points: 7620, level: 30, rank: 10, change: 0, streak: 12 },
    ],
    category: [
      { id: 1, name: 'Fitness Fanatic', avatar: 'F', points: 8500, category: 'Fitness', rank: 1 },
      { id: 2, name: 'Code Master', avatar: 'C', points: 7200, category: 'Learning', rank: 2 },
      { id: 3, name: 'Health Hero', avatar: 'H', points: 6800, category: 'Health', rank: 3 },
    ],
    improvement: [
      { id: 1, name: 'Rising Star', avatar: 'R', improvement: '+250%', points: 3500, rank: 1 },
      { id: 2, name: 'Quick Learner', avatar: 'Q', improvement: '+180%', points: 2800, rank: 2 },
      { id: 3, name: 'Comeback King', avatar: 'C', improvement: '+165%', points: 4200, rank: 3 },
    ],
  });

  const getRankColor = (rank) => {
    if (rank === 1) return theme.palette.warning.main;
    if (rank === 2) return theme.palette.grey[400];
    if (rank === 3) return '#CD7F32';
    return theme.palette.text.secondary;
  };

  const getRankIcon = (rank) => {
    if (rank <= 3) {
      return <TrophyIcon sx={{ color: getRankColor(rank), fontSize: 32 }} />;
    }
    return (
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          bgcolor: theme.palette.grey[200],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          color: theme.palette.text.secondary,
        }}
      >
        {rank}
      </Box>
    );
  };

  const LeaderboardCard = ({ user, index, showCategory = false, showImprovement = false }) => (
    <Fade in={true} timeout={600} style={{ transitionDelay: `${index * 50}ms` }}>
      <Paper
        elevation={user.rank <= 3 ? 4 : 0}
        sx={{
          p: 2,
          mb: 2,
          border: user.rank <= 3 ? `2px solid ${getRankColor(user.rank)}` : '1px solid #E5E7EB',
          background:
            user.rank === 1
              ? 'linear-gradient(135deg, #FFF9E6 0%, #FFFFFF 100%)'
              : user.rank === 2
              ? 'linear-gradient(135deg, #F5F5F5 0%, #FFFFFF 100%)'
              : user.rank === 3
              ? 'linear-gradient(135deg, #FFF4E6 0%, #FFFFFF 100%)'
              : 'white',
          transition: 'all 0.3s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[4],
          },
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          {/* Rank */}
          <Box sx={{ minWidth: 40 }}>{getRankIcon(user.rank)}</Box>

          {/* Avatar & Info */}
          <ListItemAvatar>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: theme.palette.primary.main,
                border: `3px solid ${getRankColor(user.rank)}`,
                fontSize: '1.5rem',
                fontWeight: 'bold',
              }}
            >
              {user.avatar}
            </Avatar>
          </ListItemAvatar>

          <Box flex={1}>
            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
              <Typography variant="h6" fontWeight="bold">
                {user.name}
              </Typography>
              {user.change !== undefined && user.change !== 0 && (
                <Chip
                  size="small"
                  label={user.change > 0 ? `↑${user.change}` : `↓${Math.abs(user.change)}`}
                  color={user.change > 0 ? 'success' : 'error'}
                  sx={{ height: 20, fontSize: '0.7rem' }}
                />
              )}
            </Box>
            <Box display="flex" gap={1} flexWrap="wrap">
              <Chip
                icon={<StarIcon fontSize="small" />}
                label={`${user.points.toLocaleString()} pts`}
                size="small"
                variant="outlined"
              />
              {user.level && (
                <Chip label={`Level ${user.level}`} size="small" variant="outlined" color="primary" />
              )}
              {user.streak && (
                <Chip
                  icon={<FireIcon fontSize="small" />}
                  label={`${user.streak} day streak`}
                  size="small"
                  variant="outlined"
                  color="error"
                />
              )}
              {showCategory && <Chip label={user.category} size="small" color="secondary" />}
              {showImprovement && (
                <Chip
                  icon={<TrendingUpIcon fontSize="small" />}
                  label={user.improvement}
                  size="small"
                  color="success"
                />
              )}
            </Box>
          </Box>

          {/* Action */}
          {!isMobile && (
            <Button variant="outlined" size="small">
              View Profile
            </Button>
          )}
        </Box>

        {/* Progress Bar for top 3 */}
        {user.rank <= 3 && (
          <Box mt={2}>
            <Box display="flex" justifyContent="space-between" mb={0.5}>
              <Typography variant="caption">Next Level Progress</Typography>
              <Typography variant="caption" fontWeight="bold">
                {Math.round((user.points % 1000) / 10)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(user.points % 1000) / 10}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background: `linear-gradient(90deg, ${getRankColor(user.rank)}, ${theme.palette.primary.main})`,
                },
              }}
            />
          </Box>
        )}
      </Paper>
    </Fade>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              🏆 Leaderboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Compete with the community and climb the ranks!
            </Typography>
          </Box>
          <Tooltip title="Refresh">
            <IconButton color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Top 3 Podium */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50' }}>
            <Typography variant="h5" fontWeight="bold" textAlign="center" mb={3}>
              Top Champions
            </Typography>
            <Grid container spacing={2} justifyContent="center" alignItems="flex-end">
              {/* 2nd Place */}
              <Grid item xs={4}>
                <Box textAlign="center">
                  <Box
                    sx={{
                      height: 120,
                      bgcolor: theme.palette.grey[300],
                      borderRadius: '8px 8px 0 0',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      pb: 2,
                    }}
                  >
                    <TrophyIcon sx={{ fontSize: 40, color: theme.palette.grey[500], mb: 1 }} />
                    <Typography variant="h3" fontWeight="bold">
                      2
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: theme.palette.primary.main,
                      margin: '-40px auto 0',
                      border: '4px solid white',
                      fontSize: '2rem',
                    }}
                  >
                    M
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold" mt={2}>
                    Mike Johnson
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    11,890 points
                  </Typography>
                </Box>
              </Grid>

              {/* 1st Place */}
              <Grid item xs={4}>
                <Box textAlign="center">
                  <Box
                    sx={{
                      height: 160,
                      bgcolor: theme.palette.warning.light,
                      borderRadius: '8px 8px 0 0',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      pb: 2,
                      position: 'relative',
                      '&::before': {
                        content: '"👑"',
                        position: 'absolute',
                        top: -20,
                        fontSize: '2rem',
                      },
                    }}
                  >
                    <TrophyIcon sx={{ fontSize: 50, color: theme.palette.warning.main, mb: 1 }} />
                    <Typography variant="h2" fontWeight="bold">
                      1
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      bgcolor: theme.palette.warning.main,
                      margin: '-50px auto 0',
                      border: '5px solid white',
                      fontSize: '2.5rem',
                    }}
                  >
                    S
                  </Avatar>
                  <Typography variant="h5" fontWeight="bold" mt={2}>
                    Sarah Chen
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    12,450 points
                  </Typography>
                  <Chip label="🔥 45 day streak" color="warning" sx={{ mt: 1 }} />
                </Box>
              </Grid>

              {/* 3rd Place */}
              <Grid item xs={4}>
                <Box textAlign="center">
                  <Box
                    sx={{
                      height: 100,
                      bgcolor: '#CD7F32',
                      borderRadius: '8px 8px 0 0',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      pb: 2,
                      opacity: 0.7,
                    }}
                  >
                    <TrophyIcon sx={{ fontSize: 35, color: '#8B5A00', mb: 1 }} />
                    <Typography variant="h4" fontWeight="bold" color="white">
                      3
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      width: 70,
                      height: 70,
                      bgcolor: '#CD7F32',
                      margin: '-35px auto 0',
                      border: '4px solid white',
                      fontSize: '1.8rem',
                    }}
                  >
                    E
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold" mt={2}>
                    Emily Rodriguez
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    10,250 points
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Tabs */}
        <Grid item xs={12}>
          <Paper elevation={0}>
            <Tabs
              value={activeTab}
              onChange={(e, v) => setActiveTab(v)}
              variant={isMobile ? 'scrollable' : 'fullWidth'}
              scrollButtons="auto"
            >
              <Tab label="Global Ranking" />
              <Tab label="Category Leaders" />
              <Tab label="Most Improved" />
              <Tab label="Friends" />
            </Tabs>
          </Paper>
        </Grid>

        {/* Leaderboard List */}
        <Grid item xs={12}>
          <Box>
            {activeTab === 0 && (
              <Box>
                {leaderboards.global.slice(3).map((user, index) => (
                  <LeaderboardCard key={user.id} user={user} index={index} />
                ))}
              </Box>
            )}
            {activeTab === 1 && (
              <Box>
                {leaderboards.category.map((user, index) => (
                  <LeaderboardCard key={user.id} user={user} index={index} showCategory />
                ))}
              </Box>
            )}
            {activeTab === 2 && (
              <Box>
                {leaderboards.improvement.map((user, index) => (
                  <LeaderboardCard key={user.id} user={user} index={index} showImprovement />
                ))}
              </Box>
            )}
            {activeTab === 3 && (
              <Box textAlign="center" py={8}>
                <Typography variant="h6" color="text.secondary">
                  Add friends to see their rankings!
                </Typography>
                <Button variant="contained" sx={{ mt: 2 }}>
                  Find Friends
                </Button>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Leaderboard;
