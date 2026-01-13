import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  Paper,
  useTheme
} from '@mui/material';

function CommentChallenge() {
  const theme = useTheme();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(['This is a great challenge!', 'I\'m excited to participate.']); // Mock comments

  const handleSubmit = (event) => {
    event.preventDefault();
    if (comment.trim() !== '') {
      setComments([...comments, comment]);
      setComment('');
    }
  };

  return (
    <Box
      sx={{
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Comments ({comments.length})
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" color="primary">
          Post Comment
        </Button>
      </form>
      <List sx={{ mt: 2, padding: 0 }}>
        {comments.map((comment, index) => (
          <ListItem key={index} divider>
            <Typography variant="body2" color="text.secondary">
              {comment}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default CommentChallenge;