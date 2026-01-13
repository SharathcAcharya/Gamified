import React, { useState } from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';

function LikeChallenge() {
  const theme = useTheme();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(10); // Mock likes

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikes(likes - 1);
    } else {
      setLiked(true);
      setLikes(likes + 1);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mt: theme.spacing(1) }}>
      <Button
        variant={liked ? 'outlined' : 'contained'}
        color="primary"
        onClick={handleLike}
        sx={{ mr: theme.spacing(1) }}
      >
        {liked ? 'Unlike' : 'Like'}
      </Button>
      <Typography variant="body1">{likes} likes</Typography>
    </Box>
  );
}

export default LikeChallenge;