import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Tab,
  Tabs,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  LinearProgress,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Stack,
  useTheme,
  Divider
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Timeline as TimelineIcon,
  Analytics as AnalyticsIcon,
  Speed as SpeedIcon,
  EmojiEvents as EmojiEventsIcon,
  Schedule as ScheduleIcon,
  DateRange as DateRangeIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Metric Card Component
const MetricCard = ({ title, value, subtitle, icon, color = 'primary', trend = null }) => {
  const theme = useTheme();
  
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Typography color="text.secondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h4" component="div" color={`${color}.main`}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUpIcon 
                  sx={{ 
                    fontSize: 16, 
                    color: trend > 0 ? 'success.main' : 'error.main',
                    transform: trend < 0 ? 'rotate(180deg)' : 'none'
                  }} 
                />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    ml: 0.5,
                    color: trend > 0 ? 'success.main' : 'error.main'
                  }}
                >
                  {Math.abs(trend)}% from last month
                </Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ 
            bgcolor: `${color}.light`, 
            borderRadius: '50%', 
            p: 2,
            color: `${color}.main`
          }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// Challenge Analytics Component
const ChallengeAnalytics = ({ data }) => {
  const theme = useTheme();
  
  const completionData = data?.challengeCompletion || [];
  const categoryData = data?.challengesByCategory || [];
  const difficultyData = data?.challengesByDifficulty || [];

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main
  ];

  return (
    <Grid container spacing={3}>
      {/* Challenge Completion Over Time */}
      <Grid item xs={12} lg={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Challenge Completion Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={completionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="completed" 
                  stackId="1"
                  stroke={theme.palette.success.main}
                  fill={theme.palette.success.light}
                  name="Completed"
                />
                <Area 
                  type="monotone" 
                  dataKey="started" 
                  stackId="1"
                  stroke={theme.palette.primary.main}
                  fill={theme.palette.primary.light}
                  name="Started"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Challenges by Category */}
      <Grid item xs={12} lg={4}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Challenges by Category
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="category"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Challenge Difficulty Distribution */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Difficulty Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={difficultyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="difficulty" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="count" 
                  fill={theme.palette.primary.main}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Top Performing Challenges */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Top Performing Challenges
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Challenge</TableCell>
                    <TableCell align="right">Participants</TableCell>
                    <TableCell align="right">Completion Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(data?.topChallenges || []).map((challenge) => (
                    <TableRow key={challenge._id}>
                      <TableCell>
                        <Typography variant="body2" noWrap>
                          {challenge.title}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        {challenge.participantCount}
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={challenge.completionRate} 
                              sx={{ height: 6, borderRadius: 3 }}
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {challenge.completionRate}%
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

// User Analytics Component
const UserAnalytics = ({ data }) => {
  const theme = useTheme();
  
  const userGrowthData = data?.userGrowth || [];
  const activityData = data?.userActivity || [];
  const engagementData = data?.userEngagement || [];

  return (
    <Grid container spacing={3}>
      {/* User Growth Over Time */}
      <Grid item xs={12} lg={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              User Growth
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="totalUsers" 
                  stroke={theme.palette.primary.main}
                  strokeWidth={3}
                  name="Total Users"
                />
                <Line 
                  type="monotone" 
                  dataKey="newUsers" 
                  stroke={theme.palette.secondary.main}
                  strokeWidth={2}
                  name="New Users"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* User Activity Heatmap */}
      <Grid item xs={12} lg={4}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Daily Activity Pattern
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
              {activityData.map((day, index) => (
                <Box
                  key={index}
                  sx={{
                    aspectRatio: '1',
                    bgcolor: `primary.${day.intensity > 0.7 ? 'dark' : day.intensity > 0.4 ? 'main' : 'light'}`,
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography variant="caption" color="white">
                    {day.day}
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* User Engagement Metrics */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              User Engagement Metrics
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="metric" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="value" 
                  fill={theme.palette.info.main}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

// Platform Performance Component
const PlatformPerformance = ({ data }) => {
  const theme = useTheme();
  
  const performanceData = data?.performance || [];
  const systemMetrics = data?.systemMetrics || {};

  return (
    <Grid container spacing={3}>
      {/* System Metrics Cards */}
      <Grid item xs={12} md={3}>
        <MetricCard
          title="Response Time"
          value={`${systemMetrics.avgResponseTime || 0}ms`}
          subtitle="Average API response"
          icon={<SpeedIcon />}
          color="info"
          trend={-5.2}
        />
      </Grid>
      
      <Grid item xs={12} md={3}>
        <MetricCard
          title="Uptime"
          value={`${systemMetrics.uptime || 99.9}%`}
          subtitle="System availability"
          icon={<TrendingUpIcon />}
          color="success"
          trend={0.1}
        />
      </Grid>
      
      <Grid item xs={12} md={3}>
        <MetricCard
          title="Error Rate"
          value={`${systemMetrics.errorRate || 0.1}%`}
          subtitle="System errors"
          icon={<AnalyticsIcon />}
          color="warning"
          trend={-2.1}
        />
      </Grid>
      
      <Grid item xs={12} md={3}>
        <MetricCard
          title="Active Sessions"
          value={systemMetrics.activeSessions || 0}
          subtitle="Current users online"
          icon={<PeopleIcon />}
          color="primary"
          trend={12.5}
        />
      </Grid>

      {/* Performance Over Time */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Platform Performance Metrics
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="responseTime" 
                  stroke={theme.palette.info.main}
                  name="Response Time (ms)"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="activeUsers" 
                  stroke={theme.palette.primary.main}
                  name="Active Users"
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="errorRate" 
                  stroke={theme.palette.error.main}
                  name="Error Rate (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

// Main Advanced Analytics Component
const AdvancedAnalytics = () => {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState(0);
  const [timeRange, setTimeRange] = useState('30d');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics/dashboard?timeRange=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics/export?timeRange=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `analytics_${timeRange}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting analytics:', error);
    }
  };

  const tabLabels = ['Overview', 'Challenges', 'Users', 'Performance'];

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' }
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  const overviewMetrics = analyticsData?.overview || {};

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'success.main', color: 'white' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Advanced Analytics
            </Typography>
            <Typography variant="body1">
              Comprehensive insights into your platform performance
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                sx={{ bgcolor: 'white' }}
              >
                {timeRangeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={exportAnalytics}
              sx={{ bgcolor: 'white', color: 'success.main', '&:hover': { bgcolor: 'grey.100' } }}
            >
              Export
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* Overview Metrics */}
      {currentTab === 0 && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <MetricCard
              title="Total Users"
              value={overviewMetrics.totalUsers || 0}
              subtitle="Platform users"
              icon={<PeopleIcon />}
              color="primary"
              trend={overviewMetrics.userGrowth}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <MetricCard
              title="Total Challenges"
              value={overviewMetrics.totalChallenges || 0}
              subtitle="Created challenges"
              icon={<AssignmentIcon />}
              color="secondary"
              trend={overviewMetrics.challengeGrowth}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <MetricCard
              title="Completion Rate"
              value={`${overviewMetrics.avgCompletionRate || 0}%`}
              subtitle="Average completion"
              icon={<EmojiEventsIcon />}
              color="success"
              trend={overviewMetrics.completionRateChange}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <MetricCard
              title="Engagement Score"
              value={overviewMetrics.engagementScore || 0}
              subtitle="User engagement"
              icon={<TimelineIcon />}
              color="info"
              trend={overviewMetrics.engagementChange}
            />
          </Grid>
        </Grid>
      )}

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={currentTab} 
          onChange={(e, newValue) => setCurrentTab(newValue)}
          variant="fullWidth"
        >
          {tabLabels.map((label, index) => (
            <Tab key={index} label={label} />
          ))}
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box>
        {currentTab === 0 && (
          <Grid container spacing={3}>
            {/* Platform overview charts would go here */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Platform Overview
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Key performance indicators and trends across all platform metrics.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
        
        {currentTab === 1 && (
          <ChallengeAnalytics data={analyticsData?.challenges} />
        )}
        
        {currentTab === 2 && (
          <UserAnalytics data={analyticsData?.users} />
        )}
        
        {currentTab === 3 && (
          <PlatformPerformance data={analyticsData?.platform} />
        )}
      </Box>
    </Box>
  );
};

export default AdvancedAnalytics;
