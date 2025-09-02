import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
  Container,
  Paper,
  Button,
  Avatar,
  Stack,
  FormControl,
  InputLabel,
  Badge,
  Tooltip,
  Fade,
  Slide,
  Zoom,
  Skeleton,
  ToggleButton,
  ToggleButtonGroup,
  Fab,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  LocalFireDepartment as FireIcon,
  Search as SearchIcon,
  Star as StarIcon,
  WorkspacePremium as PremiumIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Schedule as ScheduleIcon,
  EmojiEvents as TrophyIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  Sort as SortIcon,
  TrendingUp as TrendingIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

function ChallengeList() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [sortBy, setSortBy] = useState('trending');
  const [viewMode, setViewMode] = useState('grid');
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/challenges', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setChallenges(data);
      } else {
        console.error('Failed to fetch challenges');
      }
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced mock data with modern features
  const mockChallenges = [
    {
      _id: 1,
      name: '30-Day Fitness Revolution',
      description: 'Transform your body with daily workouts, nutrition tracking, and mindfulness practices for 30 days.',
      category: 'fitness',
      difficulty: 'medium',
      creator: {
        name: 'Sarah Johnson',
        avatar: '/static/images/avatar/1.jpg'
      },
      participants: 1247,
      maxParticipants: 2000,
      startDate: new Date(2024, 0, 1),
      endDate: new Date(2024, 1, 1),
      progress: 68,
      likes: 892,
      isLiked: false,
      isTrending: true,
      isTeamChallenge: false,
      milestones: 6,
      completedMilestones: 4,
      points: 1500,
      badge: 'Fitness Champion',
      tags: ['health', 'motivation', 'beginner-friendly'],
      daysLeft: 12,
    },
    {
      _id: 2,
      name: 'Full-Stack Developer Bootcamp',
      description: 'Master React, Node.js, and MongoDB by building 5 real-world projects with industry mentorship.',
      category: 'coding',
      difficulty: 'hard',
      creator: {
        name: 'Alex Chen',
        avatar: '/static/images/avatar/2.jpg'
      },
      participants: 456,
      maxParticipants: 500,
      progress: 34,
      likes: 324,
      isLiked: true,
      isTrending: true,
      isTeamChallenge: true,
      points: 3000,
      badge: 'Code Master',
      tags: ['javascript', 'react', 'portfolio'],
      daysLeft: 45,
    },
    {
      _id: 3,
      name: 'Mindful Reading Journey',
      description: 'Read 24 books across different genres while practicing mindful reading techniques and joining book discussions.',
      category: 'education',
      difficulty: 'easy',
      creator: {
        name: 'Emma Watson',
        avatar: '/static/images/avatar/3.jpg'
      },
      participants: 892,
      maxParticipants: 1000,
      progress: 85,
      likes: 567,
      isLiked: false,
      isTrending: false,
      isTeamChallenge: false,
      points: 2000,
      badge: 'Literary Scholar',
      tags: ['books', 'personal-growth', 'community'],
      daysLeft: 23,
    },
    {
      _id: 4,
      name: 'Creative Design Sprint',
      description: 'Design 50 unique graphics, learn new design tools, and build an amazing portfolio in 60 days.',
      category: 'design',
      difficulty: 'medium',
      creator: {
        name: 'David Kim',
        avatar: '/static/images/avatar/4.jpg'
      },
      participants: 234,
      maxParticipants: 300,
      progress: 42,
      likes: 189,
      isLiked: true,
      isTrending: true,
      isTeamChallenge: true,
      points: 2200,
      badge: 'Design Wizard',
      tags: ['creativity', 'portfolio', 'skills'],
      daysLeft: 38,
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories', icon: '🎯' },
    { value: 'fitness', label: 'Fitness', icon: '💪' },
    { value: 'coding', label: 'Coding', icon: '💻' },
    { value: 'education', label: 'Education', icon: '📚' },
    { value: 'design', label: 'Design', icon: '🎨' },
    { value: 'lifestyle', label: 'Lifestyle', icon: '🌱' },
  ];

  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'easy', label: 'Easy', color: 'success' },
    { value: 'medium', label: 'Medium', color: 'warning' },
    { value: 'hard', label: 'Hard', color: 'error' }
  ];

  const sortOptions = [
    { value: 'trending', label: 'Trending' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'newest', label: 'Newest' },
    { value: 'ending-soon', label: 'Ending Soon' },
  ];

  // Combine real challenges with mock data, ensuring unique IDs
  // In development, supplement with mock data; in production, use only real data
  const allChallenges = [
    ...challenges,
    ...(process.env.NODE_ENV === 'development' 
      ? mockChallenges.map((challenge, index) => ({
          ...challenge,
          _id: `mock_${challenge._id}` // Prefix mock IDs to ensure uniqueness
        }))
      : [])
  ];

  const filteredAndSortedChallenges = allChallenges
    .filter(challenge => {
      const matchesSearch = challenge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        challenge.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || challenge.category === categoryFilter;
      const matchesDifficulty = difficultyFilter === 'all' || challenge.difficulty === difficultyFilter;
      return matchesSearch && matchesCategory && matchesDifficulty;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.likes || 0) - (a.likes || 0);
        case 'newest':
          return new Date(b.startDate || Date.now()) - new Date(a.startDate || Date.now());
        case 'ending-soon':
          return (a.daysLeft || 999) - (b.daysLeft || 999);
        case 'trending':
        default:
          return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0);
      }
    });

  const getDifficultyColor = (difficulty) => {
    const diff = difficulties.find(d => d.value === difficulty);
    return diff?.color || 'primary';
  };

  const handleLike = (challengeId) => {
    // Toggle like functionality
    console.log('Toggle like for challenge:', challengeId);
  };

  const ChallengeCard = ({ challenge, index }) => (
    <Zoom in={true} timeout={400} style={{ transitionDelay: `${index * 100}ms` }}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'visible',
          '&:hover': {
            transform: 'translateY(-8px)',
            '& .challenge-image': {
              transform: 'scale(1.05)',
            }
          },
        }}
      >
        {/* Trending Badge */}
        {challenge.isTrending && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              zIndex: 2,
            }}
          >
            <Chip
              icon={<TrendingIcon />}
              label="Trending"
              size="small"
              color="error"
              sx={{
                background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
                color: 'white',
                fontWeight: 600,
              }}
            />
          </Box>
        )}

        <CardContent sx={{ flex: 1, p: 3 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
            <Avatar
              src={challenge.creator?.avatar}
              sx={{ 
                width: 40, 
                height: 40,
                border: '2px solid',
                borderColor: `${theme.palette.primary.main}20`,
              }}
            >
              {challenge.creator?.name?.charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
                {challenge.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                by {challenge.creator?.name}
              </Typography>
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary" paragraph>
            {challenge.description}
          </Typography>

          {/* Tags */}
          {challenge.tags && (
            <Stack direction="row" spacing={0.5} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
              {challenge.tags.slice(0, 3).map((tag, tagIndex) => (
                <Chip
                  key={`${challenge._id}-tag-${tagIndex}`}
                  label={tag}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem', height: 20 }}
                />
              ))}
            </Stack>
          )}

          {/* Stats Row */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <Chip
              label={challenge.difficulty}
              size="small"
              color={getDifficultyColor(challenge.difficulty)}
              sx={{ fontWeight: 500 }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PersonIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {challenge.participants || 0}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ScheduleIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {challenge.daysLeft}d left
              </Typography>
            </Box>
          </Box>

          {/* Progress */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {challenge.progress || 0}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={challenge.progress || 0}
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

          {/* Rewards */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <StarIcon sx={{ color: theme.palette.warning.main, fontSize: 18 }} />
              <Typography variant="body2" fontWeight="medium">
                {challenge.points || 100} pts
              </Typography>
            </Box>
            {challenge.badge && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TrophyIcon sx={{ color: theme.palette.secondary.main, fontSize: 18 }} />
                <Typography variant="body2" fontWeight="medium">
                  {challenge.badge}
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>

        <CardActions sx={{ px: 3, pb: 2, justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              size="small"
              onClick={() => handleLike(challenge._id)}
              color={challenge.isLiked ? 'error' : 'default'}
              sx={{
                '&:hover': {
                  transform: 'scale(1.1)',
                }
              }}
            >
              {challenge.isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              {challenge.likes || 0}
            </Typography>
            {challenge.isTeamChallenge && (
              <Tooltip title="Team Challenge">
                <GroupIcon fontSize="small" color="primary" />
              </Tooltip>
            )}
          </Box>
          
          <Button
            component={Link}
            to={`/challenges/${challenge._id}`}
            variant="contained"
            size="small"
            sx={{
              background: 'linear-gradient(135deg, #6366F1 0%, #8B8CF8 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
              },
            }}
          >
            Join Challenge
          </Button>
        </CardActions>
      </Card>
    </Zoom>
  );

  const SkeletonCard = () => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" height={24} />
            <Skeleton variant="text" width="40%" height={20} />
          </Box>
        </Box>
        <Skeleton variant="text" width="100%" height={60} sx={{ mb: 2 }} />
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Skeleton variant="rounded" width={60} height={24} />
          <Skeleton variant="rounded" width={40} height={24} />
          <Skeleton variant="rounded" width={50} height={24} />
        </Stack>
        <Skeleton variant="rectangular" width="100%" height={8} sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton variant="text" width="30%" />
          <Skeleton variant="rounded" width={100} height={32} />
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Slide direction="down" in={true} timeout={600}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant={isMobile ? "h4" : "h3"} 
            component="h1" 
            gutterBottom 
            fontWeight="bold"
          >
            Discover Challenges 🚀
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Join thousands of people achieving their goals together
          </Typography>
          
          {/* Quick Stats */}
          <Stack 
            direction="row" 
            spacing={2} 
            justifyContent="center" 
            sx={{ mt: 2 }}
            flexWrap="wrap"
          >
            <Chip 
              icon={<PersonIcon />}
              label="2,847 Active Members"
              variant="outlined"
            />
            <Chip 
              icon={<TrophyIcon />}
              label="156 Challenges"
              variant="outlined"
            />
            <Chip 
              icon={<StarIcon />}
              label="98% Success Rate"
              variant="outlined"
            />
          </Stack>
        </Box>
      </Slide>

      {/* Filters */}
      <Slide direction="up" in={true} timeout={800} style={{ transitionDelay: '200ms' }}>
        <Paper elevation={0} sx={{ p: 3, mb: 4, border: '1px solid #E5E7EB' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Find Your Perfect Challenge
            </Typography>
            {isMobile && (
              <IconButton onClick={() => setShowFilters(!showFilters)}>
                <FilterIcon />
              </IconButton>
            )}
            {!isMobile && (
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(e, newView) => newView && setViewMode(newView)}
                size="small"
              >
                <ToggleButton value="grid">
                  <GridViewIcon />
                </ToggleButton>
                <ToggleButton value="list">
                  <ListViewIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            )}
          </Box>
          
          <Fade in={!isMobile || showFilters}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search challenges..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={categoryFilter}
                    label="Category"
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    sx={{ borderRadius: 3 }}
                  >
                    {categories.map(category => (
                      <MenuItem key={category.value} value={category.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span>{category.icon}</span>
                          {category.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Difficulty</InputLabel>
                  <Select
                    value={difficultyFilter}
                    label="Difficulty"
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    sx={{ borderRadius: 3 }}
                  >
                    {difficulties.map(difficulty => (
                      <MenuItem key={difficulty.value} value={difficulty.value}>
                        {difficulty.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort By"
                    onChange={(e) => setSortBy(e.target.value)}
                    sx={{ borderRadius: 3 }}
                  >
                    {sortOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={2}>
                <Button
                  component={Link}
                  to="/create-challenge"
                  variant="contained"
                  fullWidth
                  startIcon={<AddIcon />}
                  sx={{
                    height: '56px',
                    background: 'linear-gradient(135deg, #6366F1 0%, #8B8CF8 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
                    },
                  }}
                >
                  Create
                </Button>
              </Grid>
            </Grid>
          </Fade>
        </Paper>
      </Slide>

      {/* Results Count */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Found {filteredAndSortedChallenges.length} challenges
          {searchQuery && ` matching "${searchQuery}"`}
        </Typography>
      </Box>

      {/* Challenge Grid */}
      <Grid container spacing={3}>
        {loading ? (
          Array.from(new Array(6)).map((_, index) => (
            <Grid item xs={12} sm={6} lg={4} key={index}>
              <SkeletonCard />
            </Grid>
          ))
        ) : filteredAndSortedChallenges.length > 0 ? (
          filteredAndSortedChallenges.map((challenge, index) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              lg={viewMode === 'grid' ? 4 : 12} 
              key={challenge._id}
            >
              <ChallengeCard challenge={challenge} index={index} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 6, 
                textAlign: 'center',
                background: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
              }}
            >
              <Typography variant="h5" gutterBottom>
                No challenges found 😔
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Try adjusting your filters or search terms
              </Typography>
              <Button
                variant="contained"
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                  setDifficultyFilter('all');
                }}
              >
                Clear Filters
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Mobile FAB */}
      {isMobile && (
        <Fab
          component={Link}
          to="/create-challenge"
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            background: 'linear-gradient(135deg, #6366F1 0%, #8B8CF8 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
            },
          }}
        >
          <AddIcon />
        </Fab>
      )}
    </Container>
  );
}

export default ChallengeList;