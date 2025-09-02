import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const mockChallenge = {
  id: 'challenge-123',
  title: '30 Day Fitness Challenge',
  description: '30 days of consistent workout',
  creator: 'John Doe',
  participants: 150,
  likes: 45,
  category: 'Fitness',
  difficulty: 'Intermediate'
};

function ShareChallenge({ open, onClose, challenge = mockChallenge }) {
  const theme = useTheme();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  const shareUrl = `${window.location.origin}/challenge/${challenge.id}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setSnackbarOpen(true);
  };

  const handleSocialShare = (platform) => {
    const shareText = `Check out this amazing challenge: ${challenge.title} on Gamified!`;
    let shareUrl;

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(window.location.href)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: theme.shadows[10]
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          Share Challenge
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {challenge.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {challenge.description}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, color: 'text.secondary' }}>
                <Typography variant="caption">
                  By {challenge.creator}
                </Typography>
                <Typography variant="caption">
                  {challenge.participants} participants
                </Typography>
                <Typography variant="caption">
                  {challenge.likes} likes
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Typography variant="subtitle2" gutterBottom>
            Challenge Link
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            <TextField
              fullWidth
              value={shareUrl}
              size="small"
              InputProps={{
                readOnly: true
              }}
            />
            <Button
              variant="contained"
              startIcon={<CopyIcon />}
              onClick={handleCopyLink}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Copy
            </Button>
          </Box>

          <Typography variant="subtitle2" gutterBottom>
            Share on Social Media
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<TwitterIcon />}
              onClick={() => handleSocialShare('twitter')}
              sx={{
                borderColor: '#1DA1F2',
                color: '#1DA1F2',
                '&:hover': {
                  borderColor: '#1DA1F2',
                  backgroundColor: 'rgba(29, 161, 242, 0.1)'
                }
              }}
            >
              Twitter
            </Button>
            <Button
              variant="outlined"
              startIcon={<FacebookIcon />}
              onClick={() => handleSocialShare('facebook')}
              sx={{
                borderColor: '#4267B2',
                color: '#4267B2',
                '&:hover': {
                  borderColor: '#4267B2',
                  backgroundColor: 'rgba(66, 103, 178, 0.1)'
                }
              }}
            >
              Facebook
            </Button>
            <Button
              variant="outlined"
              startIcon={<LinkedInIcon />}
              onClick={() => handleSocialShare('linkedin')}
              sx={{
                borderColor: '#0A66C2',
                color: '#0A66C2',
                '&:hover': {
                  borderColor: '#0A66C2',
                  backgroundColor: 'rgba(10, 102, 194, 0.1)'
                }
              }}
            >
              LinkedIn
            </Button>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message="Link copied to clipboard"
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={handleCloseSnackbar}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  );
}

export default ShareChallenge;