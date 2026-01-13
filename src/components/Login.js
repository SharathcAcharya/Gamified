import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Tab,
  Tabs,
  Stack,
  Container,
  Paper,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
  LinearProgress,
  Avatar,
  Divider,
  Chip,
  Grid,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Rocket as RocketIcon,
  Psychology as BrainIcon,
  EmojiEvents as TrophyIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

// TabPanel component for better MUI Tabs implementation
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`login-tabpanel-${index}`}
      aria-labelledby={`login-tab-${index}`}
      {...other}
    >
      <Box sx={{ mt: 2 }}>
          {children}
        </Box>
    </div>
  );
}

function Login() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login, register } = useAuth();

  // ⚡ New: central color tokens for better contrast & consistency
  const COLORS = {
    // Page background (dark, but slightly brighter than before for readability)
    bgStart: '#0F172A',       // slate-900
    bgEnd: '#111827',         // gray-900
    overlayFrom: 'rgba(37, 99, 235, 0.10)',   // blue-600 @ 10%
    overlayTo: 'rgba(124, 58, 237, 0.08)',    // violet-600 @ 8%

    // Left column text
    heading: '#F8FAFC',       // near-white
    subtext: 'rgba(248,250,252,0.88)',

    // Primary gradient (used where you referenced theme.palette.gradient.primary)
    primaryGradient: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',

    // Card (Paper)
    cardBg: '#FFFFFF',
    cardText: '#111827',      // gray-900
    cardBorder: 'rgba(17, 24, 39, 0.08)',

    // Accents & controls
    indicator: '#2563EB',
    divider: '#E5E7EB',
    chipBorder: '#E5E7EB',
    avatarBg: 'rgba(37,99,235,0.12)',
    avatarBorder: 'rgba(37,99,235,0.25)',
    progressBg: 'rgba(37,99,235,0.15)',
    progressBar: '#2563EB',

    // Buttons / hovers
    buttonHover: 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 100%)',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (tab === 1 && password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (tab === 1 && password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    const result = tab === 0
      ? await login(email, password)
      : await register(email, password, firstName, lastName);

    if (!result.success) {
      setError(result.error);
    }

    setLoading(false);
  };

  const features = [
    { icon: <TrophyIcon htmlColor={COLORS.indicator} />, title: 'Earn Rewards', desc: 'Complete challenges and earn points' },
    { icon: <BrainIcon htmlColor={COLORS.indicator} />, title: 'Level Up', desc: 'Track your progress and improve skills' },
    { icon: <StarIcon htmlColor={COLORS.indicator} />, title: 'Achievements', desc: 'Unlock badges and milestones' },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${COLORS.bgStart} 0%, ${COLORS.bgEnd} 100%)`,
        display: 'flex',
        alignItems: 'center',
        py: { xs: 2, sm: 4 },
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(45deg, ${COLORS.overlayFrom} 0%, ${COLORS.overlayTo} 100%)`,
          zIndex: 1,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Grid container spacing={4} alignItems="center">
          {/* Left side - Features (hidden on mobile) */}
          {!isMobile && (
            <Grid item md={6}>
              <Slide direction="right" in={true} timeout={800}>
                <Box sx={{ color: COLORS.heading, pr: 4 }}>
                  <Typography
                    variant="h2"
                    component="h1"
                    gutterBottom
                    fontWeight="bold"
                    sx={{ mb: 3, color: COLORS.heading }}
                  >
                    Welcome to
                    <br />
                    <Box
                      component="span"
                      sx={{
                        background: COLORS.primaryGradient,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      Gamified <RocketIcon sx={{ color: '#F59E0B', fontSize: '2.5rem' }} />
                    </Box>
                  </Typography>

                  <Typography variant="h5" sx={{ mb: 4, color: COLORS.subtext }}>
                    Turn your goals into an exciting adventure
                  </Typography>

                  <Stack spacing={3}>
                    {features.map((feature, index) => (
                      <Fade
                        key={feature.title}
                        in={true}
                        timeout={1000}
                        style={{ transitionDelay: `${(index + 1) * 200}ms` }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            sx={{
                              bgcolor: COLORS.avatarBg,
                              border: `1px solid ${COLORS.avatarBorder}`,
                              backdropFilter: 'blur(6px)',
                            }}
                          >
                            {feature.icon}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" fontWeight="bold" sx={{ color: COLORS.heading }}>
                              {feature.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: COLORS.subtext }}>
                              {feature.desc}
                            </Typography>
                          </Box>
                        </Box>
                      </Fade>
                    ))}
                  </Stack>
                </Box>
              </Slide>
            </Grid>
          )}

          {/* Right side - Login Form */}
          <Grid item xs={12} md={6}>
              <Paper
                elevation={24}
                sx={{
                  p: { xs: 3, sm: 4 },
                  borderRadius: 4,
                  background: COLORS.cardBg,
                  color: COLORS.cardText,
                  backdropFilter: 'blur(16px)',
                  border: `1px solid ${COLORS.cardBorder}`,
                  maxWidth: 480,
                  mx: 'auto',
                }}
              >
                {/* Mobile Header */}
                {isMobile && (
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography
                      variant="h4"
                      component="h1"
                      fontWeight="bold"
                      sx={{
                        background: COLORS.primaryGradient,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                      }}
                    >
                      Gamified ⚡
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Turn your goals into achievements
                    </Typography>
                  </Box>
                )}

                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                  <Tabs
                    value={tab}
                    onChange={(e, newValue) => setTab(newValue)}
                    aria-label="login and registration tabs"
                    sx={{
                      '& .MuiTab-root': {
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '1rem',
                        minWidth: isMobile ? 120 : 140,
                      },
                      '& .Mui-selected': {
                        color: 'primary.main',
                      },
                    }}
                  >
                    <Tab key="signInTab" label="Sign In" id="login-tab-0" aria-controls="login-tabpanel-0" />
                    <Tab key="signUpTab" label="Sign Up" id="login-tab-1" aria-controls="login-tabpanel-1" />
                  </Tabs>
                </Box>

                {loading && (
                  <LinearProgress
                    sx={{
                      mb: 2,
                      borderRadius: 2,
                      height: 4,
                      backgroundColor: COLORS.progressBg,
                      '& .MuiLinearProgress-bar': { backgroundColor: COLORS.progressBar },
                    }}
                  />
                )}

                {error && (
                  <Slide direction="down" in={true}>
                    <Alert
                      severity="error"
                      sx={{
                        borderRadius: 2,
                        mb: 2,
                        '& .MuiAlert-message': { fontSize: '0.875rem' },
                      }}
                    >
                      {error}
                    </Alert>
                  </Slide>
                )}

                {/* Sign In Form */}
                <TabPanel value={tab} index={0}>
                  <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon />
                            </InputAdornment>
                          ),
                        }}
                      />

                        <TextField
                          fullWidth
                          label="Password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockIcon />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />

                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          size="large"
                          disabled={loading}
                          sx={{
                            borderRadius: 2,
                            py: 1.5,
                            fontSize: '1rem',
                            fontWeight: 600,
                            background: COLORS.primaryGradient,
                            color: '#FFFFFF',
                            '&:hover': {
                              background: COLORS.buttonHover,
                              transform: 'translateY(-1px)',
                            },
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                          }}
                        >
                          {loading ? 'Signing In...' : 'Sign In'}
                        </Button>
                      </Stack>
                    </form>
                </TabPanel>

                {/* Sign Up Form */}
                <TabPanel value={tab} index={1}>
                  <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                          <TextField
                            fullWidth
                            label="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PersonIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                          <TextField
                            fullWidth
                            label="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                          />
                        </Box>

                        <TextField
                          fullWidth
                          label="Email Address"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <EmailIcon />
                              </InputAdornment>
                            ),
                          }}
                        />

                        <TextField
                          fullWidth
                          label="Password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          helperText="At least 6 characters"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockIcon />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />

                        <TextField
                          fullWidth
                          label="Confirm Password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockIcon />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  edge="end"
                                >
                                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />

                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          size="large"
                          disabled={loading}
                          sx={{
                            borderRadius: 2,
                            py: 1.5,
                            fontSize: '1rem',
                            fontWeight: 600,
                            background: COLORS.primaryGradient,
                            color: '#FFFFFF',
                            '&:hover': {
                              background: COLORS.buttonHover,
                              transform: 'translateY(-1px)',
                            },
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                          }}
                        >
                          {loading ? 'Creating Account...' : 'Create Account'}
                        </Button>
                      </Stack>
                    </form>
                </TabPanel>

                {/* Demo credentials for Sign In */}
                {tab === 0 && (
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Divider sx={{ mb: 2, borderColor: COLORS.divider }}>
                      <Chip label="Quick Demo" size="small" variant="outlined" sx={{ borderColor: COLORS.chipBorder }} />
                    </Divider>
                    <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          setEmail('demo@example.com');
                          setPassword('password123');
                        }}
                      >
                        Use Demo Account
                      </Button>
                    </Stack>
                  </Box>
                )}

                {/* Mobile Features */}
                {isMobile && (
                  <Box sx={{ mt: 4, pt: 3, borderTop: `1px solid ${COLORS.divider}` }}>
                    <Typography variant="body2" color="text.secondary" textAlign="center" gutterBottom>
                      Join thousands of goal achievers
                    </Typography>
                    <Stack direction="row" justifyContent="center" spacing={2} flexWrap="wrap">
                      {features.map((feature) => (
                        <Chip
                          key={feature.title}
                          icon={feature.icon}
                          label={feature.title}
                          variant="outlined"
                          size="small"
                          sx={{ borderColor: COLORS.chipBorder }}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}
              </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Login;
