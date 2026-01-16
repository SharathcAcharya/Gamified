import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Switch,
  FormControlLabel,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Security as SecurityIcon,
  PhoneAndroid as PhoneIcon,
  Email as EmailIcon,
  VpnKey as KeyIcon,
  Devices as DevicesIcon,
  History as HistoryIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { securityAPI } from '../utils/api';

const SecurityDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [securityScore, setSecurityScore] = useState(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [activeSessions, setActiveSessions] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);
  const [changePasswordDialog, setChangePasswordDialog] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState([]);
  const [privacySettings, setPrivacySettings] = useState({
    profileVisible: true,
    showActivity: true,
    allowFriendRequests: true,
    showAchievements: true,
  });
  const [message, setMessage] = useState(null);

  // Load security data on mount
  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    try {
      setLoading(true);
      const [scoreRes, sessionsRes, historyRes] = await Promise.all([
        securityAPI.getScore(),
        securityAPI.getSessions(),
        securityAPI.getLoginHistory(10),
      ]);
      
      setSecurityScore(scoreRes.data);
      setActiveSessions(sessionsRes.data);
      setLoginHistory(historyRes.data);
      
      // Set 2FA status from user data if available
      if (user?.twoFactorEnabled !== undefined) {
        setTwoFactorEnabled(user.twoFactorEnabled);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to load security data:', error);
      setMessage({ type: 'error', text: 'Failed to load security data' });
      setLoading(false);
    }
  };

  const handleRevokeSession = async (sessionId) => {
    try {
      await securityAPI.revokeSession(sessionId);
      setActiveSessions(activeSessions.filter(s => s.id !== sessionId));
      setMessage({ type: 'success', text: 'Session revoked successfully' });
    } catch (error) {
      console.error('Failed to revoke session:', error);
      setMessage({ type: 'error', text: 'Failed to revoke session' });
    }
  };

  const handleToggle2FA = async () => {
    try {
      const newStatus = !twoFactorEnabled;
      await securityAPI.toggle2FA(newStatus);
      setTwoFactorEnabled(newStatus);
      setMessage({ 
        type: 'success', 
        text: `Two-factor authentication ${newStatus ? 'enabled' : 'disabled'}` 
      });
      // Reload security score
      const scoreRes = await securityAPI.getScore();
      setSecurityScore(scoreRes.data);
    } catch (error) {
      console.error('Failed to toggle 2FA:', error);
      setMessage({ type: 'error', text: 'Failed to update 2FA settings' });
    }
  };

  const calculatePasswordStrength = async (password) => {
    if (!password) {
      setPasswordStrength(0);
      setPasswordFeedback([]);
      return;
    }
    
    try {
      const response = await securityAPI.checkPasswordStrength(password);
      setPasswordStrength(response.data.percentage);
      setPasswordFeedback(response.data.feedback);
    } catch (error) {
      // Fallback to client-side calculation
      let strength = 0;
      if (password.length >= 8) strength += 25;
      if (password.length >= 12) strength += 25;
      if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 20;
      if (/\d/.test(password)) strength += 15;
      if (/[^a-zA-Z0-9]/.test(password)) strength += 15;
      setPasswordStrength(strength);
    }
  };

  const handleChangePassword = async (currentPassword, newPassword) => {
    try {
      await securityAPI.changePassword(currentPassword, newPassword);
      setChangePasswordDialog(false);
      setMessage({ 
        type: 'success', 
        text: 'Password changed successfully. Please log in again.' 
      });
      // Logout user after password change
      setTimeout(() => {
        sessionStorage.clear();
        localStorage.clear();
        window.location.href = '/login';
      }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to change password' });
    }
  };

  const handleExportData = async () => {
    try {
      const response = await securityAPI.exportData();
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user-data-${new Date().toISOString()}.json`;
      a.click();
      setMessage({ type: 'success', text: 'Data exported successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to export data' });
    }
  };

  const handleUpdatePrivacySettings = async (newSettings) => {
    try {
      await securityAPI.updatePrivacySettings(newSettings);
      setPrivacySettings(newSettings);
      setMessage({ type: 'success', text: 'Privacy settings updated' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update privacy settings' });
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, textAlign: 'center' }}>
        <Typography>Loading security dashboard...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Security Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account security and privacy settings
        </Typography>
      </Box>

      {/* Messages */}
      {message && (
        <Alert severity={message.type} onClose={() => setMessage(null)} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      {/* Security Score */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #6366F1 0%, #8B8CF8 100%)',
          color: 'white',
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <SecurityIcon sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  Security Score: {securityScore?.score || 0}/{securityScore?.maxScore || 100}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {securityScore?.score >= 80 
                    ? 'Excellent security posture!' 
                    : securityScore?.score >= 60 
                    ? 'Good security. Consider the recommendations below.' 
                    : 'Your account needs better security. Please review recommendations.'}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box display="flex" gap={1} flexWrap="wrap">
              {twoFactorEnabled ? (
                <Chip label="2FA Enabled" icon={<CheckIcon />} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
              ) : (
                <Chip label="2FA Disabled" icon={<WarningIcon />} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {/* Two-Factor Authentication */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <PhoneIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Two-Factor Authentication
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Add an extra layer of security by requiring a verification code in addition to your password.
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={twoFactorEnabled}
                    onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                  />
                }
                label={twoFactorEnabled ? 'Enabled' : 'Disabled'}
              />
              {!twoFactorEnabled && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  Your account is vulnerable. Enable 2FA to protect against unauthorized access.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Password Management */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <KeyIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Password Management
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Last changed: 30 days ago
              </Typography>
              <Button
                variant="contained"
                onClick={() => setChangePasswordDialog(true)}
                fullWidth={isMobile}
              >
                Change Password
              </Button>
              <Box mt={2}>
                <Typography variant="caption" color="text.secondary">
                  Password Strength: {passwordStrength >= 80 ? 'Strong' : passwordStrength >= 50 ? 'Medium' : 'Weak'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Active Sessions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  <DevicesIcon color="primary" />
                  <Typography variant="h6" fontWeight="bold">
                    Active Sessions
                  </Typography>
                </Box>
                <Chip label={`${activeSessions.length} devices`} color="primary" variant="outlined" />
              </Box>
              <List>
                {activeSessions.map((session, index) => (
                  <React.Fragment key={session.id}>
                    <ListItem
                      secondaryAction={
                        !session.current && (
                          <IconButton
                            edge="end"
                            onClick={() => handleRevokeSession(session.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        )
                      }
                    >
                      <ListItemIcon>
                        <DevicesIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            {session.device}
                            {session.current && (
                              <Chip label="Current" size="small" color="success" />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="caption" display="block">
                              <LocationIcon sx={{ fontSize: 12, mr: 0.5 }} />
                              {session.location} • {session.ip}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Last active: {session.lastActive}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < activeSessions.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Login History */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <HistoryIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Login History
                </Typography>
              </Box>
              <List>
                {loginHistory.map((login, index) => (
                  <React.Fragment key={login.id}>
                    <ListItem>
                      <ListItemIcon>
                        {login.status === 'success' ? (
                          <CheckIcon color="success" />
                        ) : (
                          <WarningIcon color="error" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={login.device}
                        secondary={
                          <Box>
                            <Typography variant="caption" display="block">
                              {login.location} • {login.timestamp}
                            </Typography>
                            <Chip
                              label={login.status === 'success' ? 'Successful' : 'Blocked'}
                              size="small"
                              color={login.status === 'success' ? 'success' : 'error'}
                              sx={{ mt: 0.5 }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < loginHistory.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Data & Privacy */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Data & Privacy
              </Typography>
              <List dense>
                <ListItem>
                  <Button variant="outlined" fullWidth>
                    Download My Data
                  </Button>
                </ListItem>
                <ListItem>
                  <Button variant="outlined" fullWidth>
                    Export Activity History
                  </Button>
                </ListItem>
                <ListItem>
                  <Button variant="outlined" color="error" fullWidth>
                    Delete My Account
                  </Button>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Privacy Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Privacy Settings
              </Typography>
              <List dense>
                <ListItem>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Profile visible to friends"
                    fullWidth
                  />
                </ListItem>
                <ListItem>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Show activity status"
                    fullWidth
                  />
                </ListItem>
                <ListItem>
                  <FormControlLabel
                    control={<Switch />}
                    label="Allow friend requests from anyone"
                    fullWidth
                  />
                </ListItem>
                <ListItem>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Show my achievements publicly"
                    fullWidth
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Change Password Dialog */}
      <Dialog open={changePasswordDialog} onClose={() => setChangePasswordDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            type="password"
            label="Current Password"
            margin="normal"
          />
          <TextField
            fullWidth
            type="password"
            label="New Password"
            margin="normal"
            onChange={(e) => calculatePasswordStrength(e.target.value)}
          />
          <TextField
            fullWidth
            type="password"
            label="Confirm New Password"
            margin="normal"
          />
          {passwordStrength > 0 && (
            <Box mt={2}>
              <Typography variant="caption">Password Strength</Typography>
              <Box
                sx={{
                  height: 8,
                  bgcolor: 'grey.200',
                  borderRadius: 1,
                  overflow: 'hidden',
                  mt: 1,
                }}
              >
                <Box
                  sx={{
                    height: '100%',
                    width: `${passwordStrength}%`,
                    bgcolor:
                      passwordStrength >= 80
                        ? 'success.main'
                        : passwordStrength >= 50
                        ? 'warning.main'
                        : 'error.main',
                    transition: 'width 0.3s',
                  }}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChangePasswordDialog(false)}>Cancel</Button>
          <Button variant="contained">Update Password</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SecurityDashboard;
