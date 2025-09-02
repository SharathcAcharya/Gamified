import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Paper,
  // Removed unused Stack import
  Typography,
  useTheme
} from '@mui/material';
import {
  Star as StarIcon,
  LocalFireDepartment as StreakIcon,
  EmojiEvents as TrophyIcon,
  WorkspacePremium as AchievementIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

function DisplayGamification() {
  const theme = useTheme();

  // Mock data - replace with actual data from your backend
  const mockUserStats = {
  level: 5,
  experience: 2500,
  experienceToNextLevel: 5000,
  points: 1250,
  streak: 7,
  challengesCompleted: 15,
  achievements: [
    {
      id: 1,
      title: 'Early Bird',
      description: 'Complete 5 challenges before 9 AM',
      rarity: 'rare',
      progress: 80,
      earnedDate: new Date('2023-06-15')
    },
    {
      id: 2,
      title: 'Team Player',
      description: 'Participate in 3 team challenges',
      rarity: 'uncommon',
      progress: 66,
      earnedDate: null
    },
    {
      id: 3,
      title: 'Challenge Master',
      description: 'Complete 50 challenges',
      rarity: 'legendary',
      progress: 30,
      earnedDate: null
    },
    {
      id: 4,
      title: 'Innovation Champion',
      description: 'Create and complete 3 custom challenges',
      rarity: 'epic',
      progress: 100,
      earnedDate: new Date('2023-06-18')
    }
  ],
  recentRewards: [
    {
      id: 1,
      type: 'xp',
      amount: 100,
      source: 'Daily Challenge Completion',
      date: new Date('2023-06-20')
    },
    {
      id: 2,
      type: 'achievement',
      achievement: 'Innovation Champion',
      rarity: 'epic',
      source: 'Achievement Unlocked',
      date: new Date('2023-06-18')
    },
    {
      id: 3,
      type: 'points',
      amount: 50,
      source: 'Weekly Challenge Bonus',
      date: new Date('2023-06-20')
    }
  ]
};

const rarityColors = {
  common: '#8BC34A',
  uncommon: '#4CAF50',
  rare: '#2196F3',
  epic: '#9C27B0',
  legendary: '#FFD700'
};

const formatDate = (date) => {
  return format(date, 'MMM d, yyyy');
};

const getRarityColor = (rarity) => {
  return rarityColors[rarity] || rarityColors.common;
};

// Removed unused StatCard component



  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Your Progress
      </Typography>

      <Box sx={{ mb: 4 }}>        
        <Typography variant="h6" gutterBottom>          
          Level {mockUserStats.level}
        </Typography>        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>          
          <Box sx={{ flexGrow: 1, mr: 1 }}>            
            <LinearProgress              
              variant="determinate"              
              value={(mockUserStats.experience / mockUserStats.experienceToNextLevel) * 100}              
              sx={{ height: 10, borderRadius: 5 }}            
            />          
          </Box>          
          <Typography variant="body2" color="text.secondary">            
            {mockUserStats.experience}/{mockUserStats.experienceToNextLevel} XP          
          </Typography>        
        </Box>      
      </Box>
      
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Paper sx={{ p: 1.5, textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              {mockUserStats.points}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total Points
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper sx={{ p: 1.5, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: theme.palette.error.main }}>
              {mockUserStats.streak}
              <StreakIcon sx={{ ml: 0.5, fontSize: '0.8em', verticalAlign: 'top' }} />
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Day Streak
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper sx={{ p: 1.5, textAlign: 'center' }}>
            <Typography variant="h6" color="success.main">
              {mockUserStats.challengesCompleted}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Challenges
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Rewards */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Recent Rewards
          </Typography>
          {mockUserStats.recentRewards.map((reward) => (
            <Box
              key={reward.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2,
                '&:last-child': { mb: 0 }
              }}
            >
              {reward.type === 'xp' && (
                <StarIcon sx={{ color: theme.palette.warning.main, mr: 1 }} />
              )}
              {reward.type === 'achievement' && (
                <TrophyIcon sx={{ color: theme.palette.secondary.main, mr: 1 }} />
              )}
              {reward.type === 'streak' && (
                <StreakIcon sx={{ color: theme.palette.error.main, mr: 1 }} />
              )}
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2">
                  {reward.type === 'xp' && `Earned ${reward.amount} XP`}
                  {reward.type === 'achievement' && `Unlocked ${reward.achievement}`}
                  {reward.type === 'streak' && `${reward.amount} Day Streak Bonus`}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {reward.source} • {formatDate(reward.date)}
                </Typography>
              </Box>
            </Box>
          ))}
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Achievements
          </Typography>
          <Grid container spacing={3}>
            {mockUserStats.achievements.map((achievement) => (
              <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AchievementIcon
                        sx={{
                          color: getRarityColor(achievement.rarity),
                          mr: 1
                        }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1">
                          {achievement.title.toString()}
                        </Typography>
                        <Chip
                          label={achievement.rarity.toString()}
                          size="small"
                          sx={{
                            bgcolor: getRarityColor(achievement.rarity),
                            color: 'white',
                            textTransform: 'capitalize'
                          }}
                        />
                      </Box>
                    </Box>

                    <Typography variant="body2" color="text.secondary" paragraph>
                      {achievement.description.toString()}
                    </Typography>

                    <Box sx={{ mb: achievement.earnedDate ? 0 : 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          Progress
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {achievement.progress}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={achievement.progress}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: theme.palette.grey[200]
                        }}
                      />
                    </Box>

                    {achievement.earnedDate && (
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          mt: 1,
                          color: theme.palette.success.main
                        }}
                      >
                        Earned on {formatDate(achievement.earnedDate)}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

export default DisplayGamification;