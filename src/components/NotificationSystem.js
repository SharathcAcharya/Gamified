import React, { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Tab,
  Tabs,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
  Badge,
  useTheme,
  Paper,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsOff as NotificationsOffIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Web as WebIcon,
  Settings as SettingsIcon,
  Clear as ClearIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Campaign as CampaignIcon
} from '@mui/icons-material';

// Notification Item Component
const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
  const theme = useTheme();
  
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'challenge_completed':
        return <CheckCircleIcon color="success" />;
      case 'friend_request':
        return <NotificationsIcon color="primary" />;
      case 'challenge_reminder':
        return <WarningIcon color="warning" />;
      case 'system':
        return <InfoIcon color="info" />;
      case 'payment':
        return <CampaignIcon color="secondary" />;
      default:
        return <NotificationsIcon />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'challenge_completed': return theme.palette.success.light;
      case 'friend_request': return theme.palette.primary.light;
      case 'challenge_reminder': return theme.palette.warning.light;
      case 'system': return theme.palette.info.light;
      case 'payment': return theme.palette.secondary.light;
      default: return theme.palette.grey[100];
    }
  };

  return (
    <ListItem
      sx={{
        bgcolor: notification.read ? 'transparent' : getNotificationColor(notification.type),
        borderRadius: 1,
        mb: 1,
        opacity: notification.read ? 0.7 : 1
      }}
    >
      <ListItemIcon>
        {getNotificationIcon(notification.type)}
      </ListItemIcon>
      <ListItemText
        primary={notification.title}
        secondary={
          <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {notification.message}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(notification.createdAt).toLocaleString()}
            </Typography>
          </Box>
        }
      />
      <Stack direction="row" spacing={1}>
        {!notification.read && (
          <IconButton
            size="small"
            onClick={() => onMarkAsRead(notification._id)}
            title="Mark as read"
          >
            <CheckCircleIcon />
          </IconButton>
        )}
        <IconButton
          size="small"
          onClick={() => onDelete(notification._id)}
          title="Delete"
        >
          <ClearIcon />
        </IconButton>
      </Stack>
    </ListItem>
  );
};

// Push Notification Settings Component
const PushNotificationSettings = ({ settings, onUpdateSettings }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [testNotification, setTestNotification] = useState(false);

  const handleToggle = (setting) => {
    const newSettings = {
      ...localSettings,
      [setting]: !localSettings[setting]
    };
    setLocalSettings(newSettings);
    onUpdateSettings(newSettings);
  };

  const handleFrequencyChange = (setting, value) => {
    const newSettings = {
      ...localSettings,
      [setting]: value
    };
    setLocalSettings(newSettings);
    onUpdateSettings(newSettings);
  };

  const sendTestNotification = async () => {
    setTestNotification(true);
    try {
      const response = await fetch('/api/notifications/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        // Test notification sent successfully
        setTimeout(() => setTestNotification(false), 3000);
      }
    } catch (error) {
      console.error('Failed to send test notification:', error);
      setTestNotification(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Push Notification Settings
        </Typography>
        
        <Stack spacing={3}>
          {/* General Settings */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              General Notifications
            </Typography>
            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={localSettings.pushNotifications || false}
                    onChange={() => handleToggle('pushNotifications')}
                  />
                }
                label="Enable Push Notifications"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={localSettings.emailNotifications || false}
                    onChange={() => handleToggle('emailNotifications')}
                  />
                }
                label="Enable Email Notifications"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={localSettings.smsNotifications || false}
                    onChange={() => handleToggle('smsNotifications')}
                  />
                }
                label="Enable SMS Notifications"
              />
            </Stack>
          </Box>

          <Divider />

          {/* Challenge Notifications */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Challenge Notifications
            </Typography>
            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={localSettings.challengeReminders || false}
                    onChange={() => handleToggle('challengeReminders')}
                  />
                }
                label="Challenge Reminders"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={localSettings.challengeUpdates || false}
                    onChange={() => handleToggle('challengeUpdates')}
                  />
                }
                label="Challenge Updates"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={localSettings.newChallenges || false}
                    onChange={() => handleToggle('newChallenges')}
                  />
                }
                label="New Challenge Recommendations"
              />
            </Stack>
          </Box>

          <Divider />

          {/* Social Notifications */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Social Notifications
            </Typography>
            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={localSettings.friendRequests || false}
                    onChange={() => handleToggle('friendRequests')}
                  />
                }
                label="Friend Requests"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={localSettings.friendActivity || false}
                    onChange={() => handleToggle('friendActivity')}
                  />
                }
                label="Friend Activity"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={localSettings.mentions || false}
                    onChange={() => handleToggle('mentions')}
                  />
                }
                label="Mentions and Tags"
              />
            </Stack>
          </Box>

          <Divider />

          {/* Frequency Settings */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Notification Frequency
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Email Digest</InputLabel>
                  <Select
                    value={localSettings.emailDigestFrequency || 'weekly'}
                    onChange={(e) => handleFrequencyChange('emailDigestFrequency', e.target.value)}
                    label="Email Digest"
                  >
                    <MenuItem value="never">Never</MenuItem>
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Challenge Reminders</InputLabel>
                  <Select
                    value={localSettings.challengeReminderFrequency || 'daily'}
                    onChange={(e) => handleFrequencyChange('challengeReminderFrequency', e.target.value)}
                    label="Challenge Reminders"
                  >
                    <MenuItem value="never">Never</MenuItem>
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* Test Notification */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Test Notifications
            </Typography>
            <Button
              variant="outlined"
              startIcon={<NotificationsIcon />}
              onClick={sendTestNotification}
              disabled={testNotification}
              fullWidth
            >
              {testNotification ? 'Sending Test Notification...' : 'Send Test Notification'}
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

// Notification Center Component
const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  useEffect(() => {
    if (socket && isConnected) {
      socket.on('new_notification', (notification) => {
        // If the filter is 'unread' or matches the new notification type, add it to the list
        if (filter === 'all' || filter === 'unread' || filter === notification.type) {
          setNotifications(prev => [notification, ...prev]);
        }
        setUnreadCount(prev => prev + 1);
      });

      socket.on('notification_read', (notificationId) => {
        setNotifications(prev => prev.map(n => 
          n._id === notificationId ? { ...n, read: true } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      });

      socket.on('notification_deleted', (notificationId) => {
        setNotifications(prev => prev.filter(n => n._id !== notificationId));
        // Note: we might need to adjust unreadCount if the deleted notification was unread
        // But for simplicity, we can just refetch or rely on the backend emitting unread_count_update
      });

      socket.on('unread_count_update', (count) => {
        setUnreadCount(count);
      });

      return () => {
        socket.off('new_notification');
        socket.off('notification_read');
        socket.off('notification_deleted');
        socket.off('unread_count_update');
      };
    }
  }, [socket, isConnected, filter]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/notifications?filter=${filter}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications/mark-all-read', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await fetch('/api/notifications/clear-all', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const filterOptions = [
    { value: 'all', label: 'All Notifications' },
    { value: 'unread', label: 'Unread Only' },
    { value: 'challenge', label: 'Challenges' },
    { value: 'social', label: 'Social' },
    { value: 'system', label: 'System' }
  ];

  return (
    <Box>
      {/* Header Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Notifications
          {unreadCount > 0 && (
            <Badge badgeContent={unreadCount} color="error" sx={{ ml: 2 }} />
          )}
        </Typography>
        
        <Stack direction="row" spacing={1}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              {filterOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          {unreadCount > 0 && (
            <Button
              size="small"
              variant="outlined"
              onClick={markAllAsRead}
            >
              Mark All Read
            </Button>
          )}
          
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={clearAllNotifications}
          >
            Clear All
          </Button>
        </Stack>
      </Box>

      {/* Notifications List */}
      {loading ? (
        <Typography>Loading notifications...</Typography>
      ) : notifications.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <NotificationsOffIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No notifications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You're all caught up!
          </Typography>
        </Box>
      ) : (
        <List>
          {notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
            />
          ))}
        </List>
      )}
    </Box>
  );
};

// Main Notification System Component
const NotificationSystem = () => {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState(0);
  const [notificationSettings, setNotificationSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    challengeReminders: true,
    challengeUpdates: true,
    newChallenges: false,
    friendRequests: true,
    friendActivity: true,
    mentions: true,
    emailDigestFrequency: 'weekly',
    challengeReminderFrequency: 'daily'
  });
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    fetchNotificationSettings();
    requestNotificationPermission();
  }, []);

  const fetchNotificationSettings = async () => {
    try {
      const response = await fetch('/api/notifications/settings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.settings) {
        setNotificationSettings(data.settings);
      }
    } catch (error) {
      console.error('Error fetching notification settings:', error);
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          // Register service worker and get FCM token
          const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
          console.log('Service Worker registered:', registration);
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    }
  };

  const updateNotificationSettings = async (newSettings) => {
    try {
      const response = await fetch('/api/notifications/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ settings: newSettings })
      });

      if (response.ok) {
        setNotificationSettings(newSettings);
        setAlert({
          open: true,
          message: 'Notification settings updated successfully',
          severity: 'success'
        });
      }
    } catch (error) {
      setAlert({
        open: true,
        message: 'Failed to update notification settings',
        severity: 'error'
      });
    }
  };

  const tabLabels = ['Notifications', 'Settings'];

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'info.main', color: 'white' }}>
        <Typography variant="h4" gutterBottom>
          Notification Center
        </Typography>
        <Typography variant="body1">
          Stay updated with your challenge progress and social activity
        </Typography>
      </Paper>

      {/* Alert */}
      {alert.open && (
        <Alert 
          severity={alert.severity} 
          sx={{ mb: 3 }}
          onClose={() => setAlert({ ...alert, open: false })}
        >
          {alert.message}
        </Alert>
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
        {currentTab === 0 && <NotificationCenter />}
        
        {currentTab === 1 && (
          <PushNotificationSettings
            settings={notificationSettings}
            onUpdateSettings={updateNotificationSettings}
          />
        )}
      </Box>
    </Box>
  );
};

export default NotificationSystem;