import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import {
  AddPhotoAlternate as PhotoIcon,
  AttachFile as FileIcon,
  Close as CloseIcon,
  EmojiEvents as TrophyIcon,
  Upload as UploadIcon
} from '@mui/icons-material';

// Mock data for demonstration
const mockChallenge = {
  id: '1',
  title: 'Learn React in 30 Days',
  currentDay: 15,
  totalDays: 30,
  progress: 40,
  milestones: [
    { id: '1', title: 'Setup Development Environment', completed: true },
    { id: '2', title: 'Complete Basic React Concepts', completed: true },
    { id: '3', title: 'Build First Component', completed: false },
    { id: '4', title: 'State Management', completed: false },
    { id: '5', title: 'Final Project', completed: false }
  ],
  xpReward: 500
};

function ProgressSubmission() {
  const theme = useTheme();
  const [milestone, setMilestone] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleMilestoneChange = (event) => {
    setMilestone(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleFileUpload = (event) => {
    const newFiles = Array.from(event.target.files);
    setFiles([...files, ...newFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSubmitting(false);
    // Reset form
    setMilestone('');
    setDescription('');
    setFiles([]);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Submit Progress
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Challenge Progress
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(mockChallenge.currentDay / mockChallenge.totalDays) * 100}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: theme.palette.grey[200],
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 5
                  }
                }}
              />
              <Typography variant="body2" color="text.secondary" align="right" sx={{ mt: 1 }}>
                Day {mockChallenge.currentDay} of {mockChallenge.totalDays}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrophyIcon sx={{ color: theme.palette.warning.main }} />
              <Typography variant="body2">
                {mockChallenge.xpReward} XP Reward upon completion
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Select Milestone</InputLabel>
            <Select
              value={milestone}
              label="Select Milestone"
              onChange={handleMilestoneChange}
            >
              {mockChallenge.milestones
                .filter(m => !m.completed)
                .map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.title}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Progress Description"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Describe what you've accomplished and any challenges you faced..."
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Evidence
          </Typography>
          <Stack spacing={2}>
            <Box
              sx={{
                p: 2,
                border: `2px dashed ${theme.palette.grey[300]}`,
                borderRadius: 1,
                textAlign: 'center'
              }}
            >
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<UploadIcon />}
                >
                  Upload Files
                </Button>
              </label>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Upload screenshots, code files, or other evidence
              </Typography>
            </Box>

            {files.length > 0 && (
              <Stack spacing={1}>
                {files.map((file, index) => (
                  <Card key={index} variant="outlined">
                    <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ minHeight: 40 }}
                      >
                        {file.type.startsWith('image/') ? (
                          <PhotoIcon color="action" />
                        ) : (
                          <FileIcon color="action" />
                        )}
                        <Typography
                          variant="body2"
                          sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}
                        >
                          {file.name}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveFile(index)}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={!milestone || !description || submitting}
          >
            {submitting ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 24, mr: 1 }}>
                  <CircularProgress size={24} />
                </Box>
                Submitting...
              </Box>
            ) : (
              'Submit Progress'
            )}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProgressSubmission;