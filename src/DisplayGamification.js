import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Paper,
  Typography,
  useTheme,
  Skeleton
} from '@mui/material';
import {
  Star as StarIcon,
  LocalFireDepartment as StreakIcon,
  EmojiEvents as TrophyIcon,
  WorkspacePremium as AchievementIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useSocket } from './contexts/SocketContext';
import { useAuth } from './contexts/AuthContext';

function DisplayGamification() {
  const theme = useTheme();
  const { socket, isConnected } = useSocket();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    level: 1,
    experience: 0,
    experienceToNextLevel: 1000,
    points: 0,
    streak: 0,
    challengesCompleted: 0,
    achievements: [],
    recentRewards: []
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
    if (socket && isConnected) {
      const handleStatsUpdate = (data) => {
        setStats(prev => ({
          ...prev,
          experience: data.totalPoints !== undefined ? data.totalPoints : prev.experience,
          points: data.totalPoints !== undefined ? data.totalPoints : prev.points,
          level: data.level !== undefined ? data.level : prev.level,
          streak: data.streak !== undefined ? data.streak : prev.streak,
          experienceToNextLevel: (data.level || prev.level) * 1000
        }));
      };

      const handleAchievementUnlocked = (achievement) => {
        setStats(prev => ({
          ...prev,
          achievements: [achievement, ...prev.achievements]
        }));
      };

      socket.on('stats_update', handleStatsUpdate);
      socket.on('points_update', (data) => handleStatsUpdate({ totalPoints: data.points }));
      socket.on('level_update', (data) => handleStatsUpdate({ level: data.level }));
      socket.on('streak_update', (data) => handleStatsUpdate({ streak: data.streak }));
      socket.on('achievement_unlocked', handleAchievementUnlocked);

      return () => {
        socket.off('stats_update', handleStatsUpdate);
        socket.off('points_update');
        socket.off('level_update');
        socket.off('streak_update');
        socket.off('achievement_unlocked', handleAchievementUnlocked);
      };
    }
  }, [socket, isConnected]);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const profile = await response.json();
      if (profile) {
        setStats({
          level: profile.level || 1,
          experience: profile.experience || 0,
          experienceToNextLevel: (profile.level || 1) * 1000,
          points: profile.experience || 0,
          streak: profile.streak || 0,
          challengesCompleted: profile.challenges?.completed || 0,
          achievements: profile.achievements || [],
          recentRewards: profile.recentActivity || []
        });
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const rarityColors = {
    common: '#8BC34A',
    uncommon: '#4CAF50',
    rare: '#2196F3',
    epic: '#9C27B0',
    legendary: '#FFD700'
  };

  const formatDate = (date) => {
    try {
      return format(new Date(date), 'MMM d, yyyy');
    } catch (e) {
      return 'N/A';
    }
  };

  const getRarityColor = (rarity) => {
    return rarityColors[rarity] || rarityColors.common;
  };

  if (loading) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={100} sx={{ mb: 4, borderRadius: 2 }} />
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={4}><Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2 }} /></Grid>
          <Grid item xs={4}><Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2 }} /></Grid>
          <Grid item xs={4}><Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2 }} /></Grid>
        </Grid>
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Your Progress
      </Typography>

      <Box sx={{ mb: 4 }}>        
        <Typography variant="h6" gutterBottom color="text.secondary">          
          Level {stats.level}
        </Typography>        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>          
          <Box sx={{ flexGrow: 1, mr: 2 }}>            
            <LinearProgress              
              variant="determinate"              
              value={Math.min(100, (stats.experience % 1000) / 10)}              
              sx={{ 
                height: 12, 
                borderRadius: 6,
                backgroundColor: theme.palette.grey[200],
                '& .MuiLinearProgress-bar': {
                  borderRadius: 6,
                  backgroundImage: 'linear-gradient(90deg, #6366F1 0%, #8B8CF8 100%)'
                }
              }}            
            />          
          </Box>          
          <Typography variant="h6" color="primary" fontWeight="bold">            
            {stats.experience % 1000} / 1000 XP          
          </Typography>        
        </Box>
        <Typography variant="caption" color="text.secondary">
          Total Experience: {stats.experience.toLocaleString()} XP
        </Typography>
      </Box>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={0} sx={{ p: 3, textAlign: 'center', bgcolor: '#F5F7FF', borderRadius: 4, border: '1px solid #E0E7FF' }}>
            <Typography variant="h4" color="primary" fontWeight="bold">
              {stats.points.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, mt: 1 }}>
              Total Points
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={0} sx={{ p: 3, textAlign: 'center', bgcolor: '#FFF5F5', borderRadius: 4, border: '1px solid #FEE2E2' }}>
            <Typography variant="h4" sx={{ color: theme.palette.error.main, fontWeight: 'bold' }}>
              {stats.streak}
              <StreakIcon sx={{ ml: 0.5, fontSize: '0.8em', verticalAlign: 'middle' }} />
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, mt: 1 }}>
              Day Streak
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={0} sx={{ p: 3, textAlign: 'center', bgcolor: '#F0FDF4', borderRadius: 4, border: '1px solid #DCFCE7' }}>
            <Typography variant="h4" sx={{ color: theme.palette.success.main, fontWeight: 'bold' }}>
              {stats.challengesCompleted}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, mt: 1 }}>
              Challenges Done
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Achievements Section */}
        <Grid item xs={12} md={8}>
          <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #E5E7EB' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <TrophyIcon sx={{ color: theme.palette.warning.main, mr: 1 }} />
                <Typography variant="h5" fontWeight="bold">
                  Achievements
                </Typography>
              </Box>
              <Grid container spacing={2}>
                {stats.achievements.length > 0 ? (
                  stats.achievements.map((achievement) => (
                    <Grid item xs={12} sm={6} key={achievement.id}>
                      <Card variant="outlined" sx={{ borderRadius: 3, '&:hover': { transform: 'translateY(-4px)', transition: 'transform 0.3s' } }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                            <AchievementIcon
                              sx={{
                                color: getRarityColor(achievement.rarity || 'common'),
                                mr: 1.5,
                                fontSize: 40
                              }}
                            />
                            <Box>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {achievement.name}
                              </Typography>
                              <Chip
                                label={achievement.rarity || 'common'}
                                size="small"
                                sx={{
                                  bgcolor: getRarityColor(achievement.rarity || 'common'),
                                  color: 'white',
                                  height: 20,
                                  fontSize: '0.65rem',
                                  textTransform: 'uppercase'
                                }}
                              />
                            </Box>
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                            {achievement.description}
                          </Typography>
                          <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="caption" color="text.secondary">Progress</Typography>
                              <Typography variant="caption" fontWeight="bold">{achievement.progress}%</Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={achievement.progress}
                              sx={{
                                height: 6,
                                borderRadius: 3,
                                bgcolor: theme.palette.grey[100]
                              }}
                            />
                          </Box>
                          {achievement.completedAt && (
                            <Typography variant="caption" sx={{ display: 'block', mt: 1.5, color: theme.palette.success.main, fontWeight: 500 }}>
                              Unlocked on {formatDate(achievement.completedAt)}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography color="text.secondary">No achievements yet. Keep pushing!</Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity Section */}
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #E5E7EB' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                Recent Activity
              </Typography>
              {stats.recentRewards.length > 0 ? (
                stats.recentRewards.map((reward, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      mb: 2.5,
                      '&:last-child': { mb: 0 }
                    }}
                  >
                    <Box sx={{ 
                      p: 1, 
                      borderRadius: 2, 
                      bgcolor: reward.type === 'xp' ? '#FFFBEB' : '#F5F3FF',
                      mr: 2
                    }}>
                      {reward.type === 'xp' ? (
                        <StarIcon sx={{ color: theme.palette.warning.main, fontSize: 20 }} />
                      ) : (
                        <TrophyIcon sx={{ color: theme.palette.secondary.main, fontSize: 20 }} />
                      )}
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" fontWeight="500">
                        {reward.title || reward.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        {formatDate(reward.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                ))
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary">No recent activity found.</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DisplayGamification;