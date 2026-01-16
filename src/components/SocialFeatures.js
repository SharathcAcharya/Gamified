import React, { useState, useEffect } from 'react';
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
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Chip,
  Badge,
  Divider,
  Alert,
  Switch,
  FormControlLabel,
  Paper,
  Stack,
  Menu,
  MenuItem,
  useTheme
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  Person as PersonIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Block as BlockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  MoreVert as MoreVertIcon,
  GroupAdd as GroupAddIcon,
  Timeline as ActivityIcon,
  Favorite as HeartIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  EmojiEvents as TrophyIcon
} from '@mui/icons-material';
import { useSocket } from '../contexts/SocketContext';

// Friend Request Item Component
const FriendRequestItem = ({ request, onAccept, onReject }) => {
  const [loading, setLoading] = useState(false);

  const handleAction = async (action) => {
    setLoading(true);
    try {
      if (action === 'accept') {
        await onAccept(request.from._id);
      } else {
        await onReject(request.from._id);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar src={request.from.profilePicture}>
          {request.from.username?.[0]?.toUpperCase()}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={request.from.username}
        secondary={`Wants to connect with you`}
      />
      <Stack direction="row" spacing={1}>
        <IconButton
          color="primary"
          disabled={loading}
          onClick={() => handleAction('accept')}
        >
          <CheckIcon />
        </IconButton>
        <IconButton
          color="error"
          disabled={loading}
          onClick={() => handleAction('reject')}
        >
          <CloseIcon />
        </IconButton>
      </Stack>
    </ListItem>
  );
};

// User Search Component
const UserSearch = ({ onAddFriend }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/social/search?query=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setSearchResults(data.users || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (userId) => {
    try {
      await onAddFriend(userId);
      // Update the search results to reflect the sent request
      setSearchResults(results =>
        results.map(user =>
          user._id === userId
            ? { ...user, friendStatus: 'pending' }
            : user
        )
      );
    } catch (error) {
      console.error('Failed to send friend request:', error);
    }
  };

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      handleSearch(searchQuery);
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  return (
    <Box>
      <TextField
        fullWidth
        placeholder="Search users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
        }}
        sx={{ mb: 2 }}
      />

      {loading && (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
          Searching...
        </Typography>
      )}

      <List>
        {searchResults.map((user) => (
          <ListItem key={user._id}>
            <ListItemAvatar>
              <Avatar src={user.profilePicture}>
                {user.username?.[0]?.toUpperCase()}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={user.username}
              secondary={`${user.stats?.totalChallengesCompleted || 0} challenges completed`}
            />
            <Box>
              {user.friendStatus === 'friends' && (
                <Chip label="Friends" color="success" size="small" />
              )}
              {user.friendStatus === 'pending' && (
                <Chip label="Request Sent" color="warning" size="small" />
              )}
              {user.friendStatus === 'none' && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<PersonAddIcon />}
                  onClick={() => handleSendRequest(user._id)}
                >
                  Add Friend
                </Button>
              )}
            </Box>
          </ListItem>
        ))}
      </List>

      {searchQuery && !loading && searchResults.length === 0 && (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
          No users found
        </Typography>
      )}
    </Box>
  );
};

// Activity Feed Component
const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivityFeed();
  }, []);

  const fetchActivityFeed = async () => {
    try {
      const response = await fetch('/api/social/activity-feed', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setActivities(data.activities || []);
    } catch (error) {
      console.error('Error fetching activity feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'challenge_completed':
        return <TrophyIcon color="success" />;
      case 'challenge_created':
        return <ActivityIcon color="primary" />;
      case 'challenge_joined':
        return <GroupAddIcon color="info" />;
      case 'achievement_earned':
        return <TrophyIcon color="warning" />;
      default:
        return <ActivityIcon />;
    }
  };

  const getActivityDescription = (activity) => {
    switch (activity.type) {
      case 'challenge_completed':
        return `completed the challenge "${activity.metadata?.challengeTitle}"`;
      case 'challenge_created':
        return `created a new challenge "${activity.metadata?.challengeTitle}"`;
      case 'challenge_joined':
        return `joined the challenge "${activity.metadata?.challengeTitle}"`;
      case 'achievement_earned':
        return `earned the achievement "${activity.metadata?.achievementName}"`;
      default:
        return activity.description || 'performed an activity';
    }
  };

  if (loading) {
    return <Typography>Loading activity feed...</Typography>;
  }

  return (
    <Box>
      {(!Array.isArray(activities) || activities.length === 0) ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <ActivityIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No recent activity
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Follow friends to see their activities here
          </Typography>
        </Box>
      ) : (
        <List>
          {activities.map((activity) => (
            <React.Fragment key={activity._id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar src={activity.user?.profilePicture}>
                    {activity.user?.username?.[0]?.toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body1">
                        <strong>{activity.user?.username}</strong>{' '}
                        {getActivityDescription(activity)}
                      </Typography>
                      {getActivityIcon(activity.type)}
                    </Box>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {new Date(activity.createdAt).toLocaleString()}
                    </Typography>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
};

// Friends List Component
const FriendsList = ({ friends, onUnfriend, onBlock }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const handleMenuOpen = (event, friend) => {
    setAnchorEl(event.currentTarget);
    setSelectedFriend(friend);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedFriend(null);
  };

  const handleAction = async (action) => {
    if (selectedFriend) {
      if (action === 'unfriend') {
        await onUnfriend(selectedFriend._id);
      } else if (action === 'block') {
        await onBlock(selectedFriend._id);
      }
    }
    handleMenuClose();
  };

  return (
    <Box>
      {friends.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <PersonIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No friends yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Search for users to add as friends
          </Typography>
        </Box>
      ) : (
        <List>
          {friends.map((friend) => (
            <ListItem key={friend._id}>
              <ListItemAvatar>
                <Badge
                  color={friend.isOnline ? 'success' : 'default'}
                  variant="dot"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                  <Avatar src={friend.profilePicture}>
                    {friend.username?.[0]?.toUpperCase()}
                  </Avatar>
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={friend.username}
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {friend.stats?.totalChallengesCompleted || 0} challenges completed
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {friend.isOnline ? 'Online' : `Last seen ${new Date(friend.lastActive).toLocaleDateString()}`}
                    </Typography>
                  </Box>
                }
              />
              <IconButton
                onClick={(e) => handleMenuOpen(e, friend)}
              >
                <MoreVertIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleAction('unfriend')}>
          <PersonIcon sx={{ mr: 1 }} /> Unfriend
        </MenuItem>
        <MenuItem onClick={() => handleAction('block')} sx={{ color: 'error.main' }}>
          <BlockIcon sx={{ mr: 1 }} /> Block
        </MenuItem>
      </Menu>
    </Box>
  );
};

// Privacy Settings Component
const PrivacySettings = ({ settings, onUpdateSettings }) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleToggle = (setting) => {
    const newSettings = {
      ...localSettings,
      [setting]: !localSettings[setting]
    };
    setLocalSettings(newSettings);
    onUpdateSettings(newSettings);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Privacy Settings
        </Typography>
        
        <Stack spacing={2}>
          <FormControlLabel
            control={
              <Switch
                checked={localSettings.profileVisibility === 'public'}
                onChange={() => handleToggle('profileVisibility')}
              />
            }
            label="Public Profile"
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={localSettings.showOnlineStatus}
                onChange={() => handleToggle('showOnlineStatus')}
              />
            }
            label="Show Online Status"
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={localSettings.allowFriendRequests}
                onChange={() => handleToggle('allowFriendRequests')}
              />
            }
            label="Allow Friend Requests"
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={localSettings.showActivityToFriends}
                onChange={() => handleToggle('showActivityToFriends')}
              />
            }
            label="Show Activity to Friends"
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

// Main Social Features Component
const SocialFeatures = () => {
  const theme = useTheme();
  const { socket } = useSocket();
  const [currentTab, setCurrentTab] = useState(0);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showOnlineStatus: true,
    allowFriendRequests: true,
    showActivityToFriends: true
  });
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    fetchSocialData();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('new_notification', (notification) => {
        // Handle different notification types
        if (notification.type === 'friend_request') {
          // The notification data might need to be mapped to what friend_request_received expected
          // SocialService.js sendNotification sends { recipient, sender, type: 'friend_request', data: { connectionId } }
          // SocialFeatures expects { from: { username, ... }, ... }
          
          // For friend requests, we should probably fetch the request details or just refresh
          fetchSocialData();
          setAlert({
            open: true,
            message: notification.message || `New friend request received!`,
            severity: 'info'
          });
        } else if (notification.type === 'friend_request_accepted') {
          fetchSocialData();
          setAlert({
            open: true,
            message: notification.message || `A friend request was accepted!`,
            severity: 'success'
          });
        }
      });

      socket.on('friend_online', (userId) => {
        setFriends(prev => prev.map(f => 
          f._id === userId ? { ...f, isOnline: true } : f
        ));
      });

      socket.on('friend_offline', (userId) => {
        setFriends(prev => prev.map(f => 
          f._id === userId ? { ...f, isOnline: false, lastActive: new Date() } : f
        ));
      });

      return () => {
        socket.off('new_notification');
        socket.off('friend_online');
        socket.off('friend_offline');
      };
    }
  }, [socket]);

  const fetchSocialData = async () => {
    try {
      // Fetch friends
      const friendsResponse = await fetch('/api/social/friends', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const friendsData = await friendsResponse.json();
      setFriends(friendsData.friends || []);

      // Fetch friend requests
      const requestsResponse = await fetch('/api/social/friend-requests', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const requestsData = await requestsResponse.json();
      setFriendRequests(requestsData.requests || []);

      // Fetch privacy settings
      const settingsResponse = await fetch('/api/social/privacy-settings', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const settingsData = await settingsResponse.json();
      setPrivacySettings(settingsData.settings || privacySettings);
    } catch (error) {
      console.error('Error fetching social data:', error);
    }
  };

  const handleAddFriend = async (userId) => {
    try {
      const response = await fetch('/api/social/send-friend-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId })
      });

      if (response.ok) {
        setAlert({
          open: true,
          message: 'Friend request sent!',
          severity: 'success'
        });
      }
    } catch (error) {
      setAlert({
        open: true,
        message: 'Failed to send friend request',
        severity: 'error'
      });
    }
  };

  const handleAcceptRequest = async (userId) => {
    try {
      const response = await fetch('/api/social/accept-friend-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId })
      });

      if (response.ok) {
        setAlert({
          open: true,
          message: 'Friend request accepted!',
          severity: 'success'
        });
        fetchSocialData(); // Refresh data
      }
    } catch (error) {
      setAlert({
        open: true,
        message: 'Failed to accept request',
        severity: 'error'
      });
    }
  };

  const handleRejectRequest = async (userId) => {
    try {
      const response = await fetch('/api/social/reject-friend-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId })
      });

      if (response.ok) {
        fetchSocialData(); // Refresh data
      }
    } catch (error) {
      setAlert({
        open: true,
        message: 'Failed to reject request',
        severity: 'error'
      });
    }
  };

  const handleUnfriend = async (userId) => {
    try {
      const response = await fetch('/api/social/unfriend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId })
      });

      if (response.ok) {
        fetchSocialData(); // Refresh data
      }
    } catch (error) {
      setAlert({
        open: true,
        message: 'Failed to unfriend user',
        severity: 'error'
      });
    }
  };

  const handleBlock = async (userId) => {
    try {
      const response = await fetch('/api/social/block', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId })
      });

      if (response.ok) {
        fetchSocialData(); // Refresh data
      }
    } catch (error) {
      setAlert({
        open: true,
        message: 'Failed to block user',
        severity: 'error'
      });
    }
  };

  const handleUpdatePrivacySettings = async (newSettings) => {
    try {
      const response = await fetch('/api/social/privacy-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ settings: newSettings })
      });

      if (response.ok) {
        setPrivacySettings(newSettings);
      }
    } catch (error) {
      console.error('Failed to update privacy settings:', error);
    }
  };

  const tabLabels = [
    `Activity Feed`,
    `Friends (${friends.length})`,
    `Requests (${friendRequests.length})`,
    'Find Friends',
    'Privacy'
  ];

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'secondary.main', color: 'white' }}>
        <Typography variant="h4" gutterBottom>
          Social Hub
        </Typography>
        <Typography variant="body1">
          Connect with friends and share your challenge journey
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
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabLabels.map((label, index) => (
            <Tab 
              key={index} 
              label={label}
              icon={
                index === 2 && friendRequests.length > 0 ? (
                  <Badge badgeContent={friendRequests.length} color="error" />
                ) : null
              }
            />
          ))}
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box>
        {currentTab === 0 && <ActivityFeed />}
        
        {currentTab === 1 && (
          <FriendsList
            friends={friends}
            onUnfriend={handleUnfriend}
            onBlock={handleBlock}
          />
        )}
        
        {currentTab === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Friend Requests
            </Typography>
            {friendRequests.length === 0 ? (
              <Typography color="text.secondary">
                No pending friend requests
              </Typography>
            ) : (
              <List>
                {friendRequests.map((request) => (
                  <FriendRequestItem
                    key={request._id}
                    request={request}
                    onAccept={handleAcceptRequest}
                    onReject={handleRejectRequest}
                  />
                ))}
              </List>
            )}
          </Box>
        )}
        
        {currentTab === 3 && (
          <UserSearch onAddFriend={handleAddFriend} />
        )}
        
        {currentTab === 4 && (
          <PrivacySettings
            settings={privacySettings}
            onUpdateSettings={handleUpdatePrivacySettings}
          />
        )}
      </Box>
    </Box>
  );
};

export default SocialFeatures;