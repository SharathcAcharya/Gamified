import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Fade,
  Slide,
  Zoom,
  Avatar,
  Divider,
  Container,
  Alert,
  IconButton,
  Collapse,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  AddPhotoAlternate as PhotoIcon,
  EmojiEvents as TrophyIcon,
  Groups as TeamIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Info as InfoIcon,
  CheckCircle as CheckIcon,
  Star as StarIcon,
  Timeline as TimelineIcon,
  Category as CategoryIcon,
  CalendarToday as CalendarIcon,
  Settings as SettingsIcon,
  Psychology as BrainIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
} from '@mui/icons-material';
import { useAuth } from './contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const categories = [
  { value: 'Programming', icon: '💻', color: '#6366F1' },
  { value: 'Design', icon: '🎨', color: '#EC4899' },
  { value: 'Writing', icon: '✍️', color: '#8B5CF6' },
  { value: 'Fitness', icon: '💪', color: '#10B981' },
  { value: 'Learning', icon: '📚', color: '#F59E0B' },
  { value: 'Personal Development', icon: '🌱', color: '#EF4444' },
];

const difficulties = [
  { value: 'easy', label: 'Easy', color: 'success', description: 'Perfect for beginners' },
  { value: 'medium', label: 'Medium', color: 'warning', description: 'Requires some experience' },
  { value: 'hard', label: 'Hard', color: 'error', description: 'For experienced participants' }
];

const frequencies = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'custom', label: 'Custom' }
];

const proofTypes = [
  { value: 'text', label: 'Text Description', icon: '📝' },
  { value: 'photo', label: 'Photo Upload', icon: '📸' },
  { value: 'video', label: 'Video Upload', icon: '🎥' },
  { value: 'integration', label: 'App Integration', icon: '🔌' }
];

const steps = [
  { label: 'Basic Info', icon: <InfoIcon /> },
  { label: 'Time & Logistics', icon: <SettingsIcon /> },
  { label: 'Teams & Rewards', icon: <TrophyIcon /> },
  { label: 'Milestones', icon: <TimelineIcon /> },
];

function CreateChallenge() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef();
  
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: '',
    proofType: '',
    frequency: '',
    startDate: null,
    endDate: null,
    maxParticipants: '',
    points: '100',
    isTeamChallenge: false,
    minTeamSize: '2',
    maxTeamSize: '5',
    customAchievement: {
      title: '',
      description: '',
      image: null
    },
    milestones: [{ title: '', description: '', points: '50' }]
  });

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const handleDateChange = (field) => (date) => {
    setFormData({
      ...formData,
      [field]: date
    });
  };

  const handleSwitchChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.checked
    });
  };

  const handleAchievementChange = (field) => (event) => {
    setFormData({
      ...formData,
      customAchievement: {
        ...formData.customAchievement,
        [field]: event.target.value
      }
    });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size must be less than 5MB');
        return;
      }
      setFormData({
        ...formData,
        customAchievement: {
          ...formData.customAchievement,
          image: URL.createObjectURL(file)
        }
      });
    }
  };

  const handleAddMilestone = () => {
    setFormData({
      ...formData,
      milestones: [...formData.milestones, { title: '', description: '', points: '50' }]
    });
  };

  const handleRemoveMilestone = (index) => {
    if (formData.milestones.length > 1) {
      const newMilestones = formData.milestones.filter((_, i) => i !== index);
      setFormData({ ...formData, milestones: newMilestones });
    }
  };

  const handleMilestoneChange = (index, field) => (event) => {
    const newMilestones = formData.milestones.map((milestone, i) => {
      if (i === index) {
        return { ...milestone, [field]: event.target.value };
      }
      return milestone;
    });
    setFormData({ ...formData, milestones: newMilestones });
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 0:
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.difficulty) newErrors.difficulty = 'Difficulty is required';
        break;
      case 1:
        if (!formData.startDate) newErrors.startDate = 'Start date is required';
        if (!formData.endDate) newErrors.endDate = 'End date is required';
        if (!formData.frequency) newErrors.frequency = 'Frequency is required';
        if (!formData.proofType) newErrors.proofType = 'Proof type is required';
        if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
          newErrors.endDate = 'End date must be after start date';
        }
        break;
      case 2:
        if (!formData.points || formData.points <= 0) newErrors.points = 'Valid points required';
        if (formData.isTeamChallenge) {
          if (!formData.minTeamSize || formData.minTeamSize < 2) newErrors.minTeamSize = 'Min 2 team members';
          if (!formData.maxTeamSize || formData.maxTeamSize < formData.minTeamSize) {
            newErrors.maxTeamSize = 'Max team size must be >= min size';
          }
        }
        break;
      case 3:
        formData.milestones.forEach((milestone, index) => {
          if (!milestone.title.trim()) {
            newErrors[`milestone_${index}_title`] = 'Milestone title required';
          }
        });
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return;
    
    setIsSubmitting(true);
    
    try {
      const difficultyMap = {
        'easy': 'beginner',
        'medium': 'intermediate',
        'hard': 'advanced'
      };

      const challengeData = {
        name: formData.title,
        description: formData.description,
        category: formData.category.toLowerCase(),
        difficulty: difficultyMap[formData.difficulty] || formData.difficulty,
        frequency: formData.frequency,
        proofType: formData.proofType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        maxParticipants: formData.maxParticipants || null,
        points: parseInt(formData.points),
        isTeamChallenge: formData.isTeamChallenge,
        teamSettings: formData.isTeamChallenge ? {
          minSize: parseInt(formData.minTeamSize),
          maxSize: parseInt(formData.maxTeamSize)
        } : null,
        customAchievement: formData.customAchievement.title ? formData.customAchievement : null,
        milestones: formData.milestones.filter(m => m.title.trim()),
        creator: user?.id || 'anonymous'
      };

      const token = localStorage.getItem('token');
      const response = await fetch('/api/challenges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(challengeData),
      });

      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/challenges');
        }, 2000);
      } else {
        const errorData = await response.json();
        alert('Error creating challenge: ' + (errorData.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating challenge:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryIcon = (categoryValue) => {
    const category = categories.find(cat => cat.value === categoryValue);
    return category ? category.icon : '📋';
  };

  const getDifficultyConfig = (difficultyValue) => {
    return difficulties.find(diff => diff.value === difficultyValue) || difficulties[0];
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Fade in={true} timeout={600}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Challenge Title"
                  value={formData.title}
                  onChange={handleChange('title')}
                  error={!!errors.title}
                  helperText={errors.title || "Give your challenge an engaging title"}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <StarIcon color={formData.title ? "primary" : "disabled"} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={isMobile ? 3 : 4}
                  label="Description"
                  value={formData.description}
                  onChange={handleChange('description')}
                  error={!!errors.description}
                  helperText={errors.description || "Describe what participants need to do"}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!!errors.category}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    label="Category"
                    onChange={handleChange('category')}
                    startAdornment={
                      formData.category && (
                        <InputAdornment position="start">
                          <span style={{ fontSize: '1.2rem' }}>
                            {getCategoryIcon(formData.category)}
                          </span>
                        </InputAdornment>
                      )
                    }
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.value} value={category.value}>
                        <Box display="flex" alignItems="center">
                          <span style={{ fontSize: '1.2rem', marginRight: 8 }}>
                            {category.icon}
                          </span>
                          {category.value}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!!errors.difficulty}>
                  <InputLabel>Difficulty</InputLabel>
                  <Select
                    value={formData.difficulty}
                    label="Difficulty"
                    onChange={handleChange('difficulty')}
                  >
                    {difficulties.map((difficulty) => (
                      <MenuItem key={difficulty.value} value={difficulty.value}>
                        <Box display="flex" alignItems="center" width="100%">
                          <Chip
                            label={difficulty.label}
                            size="small"
                            color={difficulty.color}
                            sx={{ mr: 1 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {difficulty.description}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Fade>
        );

      case 1:
        return (
          <Fade in={true} timeout={600}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!!errors.frequency}>
                  <InputLabel>Frequency</InputLabel>
                  <Select
                    value={formData.frequency}
                    label="Frequency"
                    onChange={handleChange('frequency')}
                  >
                    {frequencies.map((freq) => (
                      <MenuItem key={freq.value} value={freq.value}>
                        {freq.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!!errors.proofType}>
                  <InputLabel>Proof Type</InputLabel>
                  <Select
                    value={formData.proofType}
                    label="Proof Type"
                    onChange={handleChange('proofType')}
                  >
                    {proofTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        <Box display="flex" alignItems="center">
                          <span style={{ marginRight: 8 }}>{type.icon}</span>
                          {type.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    value={formData.startDate}
                    onChange={handleDateChange('startDate')}
                    slots={{
                      textField: (params) => (
                        <TextField 
                          {...params} 
                          fullWidth 
                          required 
                          error={!!errors.startDate}
                          helperText={errors.startDate}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarIcon />
                              </InputAdornment>
                            ),
                          }}
                        />
                      )
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="End Date"
                    value={formData.endDate}
                    onChange={handleDateChange('endDate')}
                    slots={{
                      textField: (params) => (
                        <TextField 
                          {...params} 
                          fullWidth 
                          required 
                          error={!!errors.endDate}
                          helperText={errors.endDate}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarIcon />
                              </InputAdornment>
                            ),
                          }}
                        />
                      )
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Maximum Participants"
                  value={formData.maxParticipants}
                  onChange={handleChange('maxParticipants')}
                  helperText="Leave empty for unlimited"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TeamIcon />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Alert severity="info" icon={<InfoIcon />}>
                  Choose dates carefully! Participants will work towards completing your challenge within this timeframe.
                </Alert>
              </Grid>
            </Grid>
          </Fade>
        );

      case 2:
        return (
          <Fade in={true} timeout={600}>
            <Stack spacing={3}>
              <Paper elevation={0} sx={{ p: 3, border: '1px solid #E5E7EB' }}>
                <Typography variant="h6" gutterBottom>
                  Reward Settings
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Points Reward"
                      value={formData.points}
                      onChange={handleChange('points')}
                      required
                      error={!!errors.points}
                      helperText={errors.points || "Points awarded for completion"}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <TrophyIcon />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>

              <Paper elevation={0} sx={{ p: 3, border: '1px solid #E5E7EB' }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="h6">
                    Team Challenge
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isTeamChallenge}
                        onChange={handleSwitchChange('isTeamChallenge')}
                        color="primary"
                      />
                    }
                    label="Enable teams"
                  />
                </Box>
                
                <Collapse in={formData.isTeamChallenge}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Min Team Size"
                        value={formData.minTeamSize}
                        onChange={handleChange('minTeamSize')}
                        error={!!errors.minTeamSize}
                        helperText={errors.minTeamSize}
                        required={formData.isTeamChallenge}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Max Team Size"
                        value={formData.maxTeamSize}
                        onChange={handleChange('maxTeamSize')}
                        error={!!errors.maxTeamSize}
                        helperText={errors.maxTeamSize}
                        required={formData.isTeamChallenge}
                      />
                    </Grid>
                  </Grid>
                </Collapse>
              </Paper>

              <Paper elevation={0} sx={{ p: 3, border: '1px solid #E5E7EB' }}>
                <Typography variant="h6" gutterBottom>
                  Custom Achievement Badge (Optional)
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Badge Title"
                      value={formData.customAchievement.title}
                      onChange={handleAchievementChange('title')}
                      placeholder="e.g., Code Master"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="achievement-image"
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                    />
                    <Button
                      variant="outlined"
                      component="label"
                      htmlFor="achievement-image"
                      fullWidth
                      startIcon={<UploadIcon />}
                      sx={{ height: '56px' }}
                    >
                      Upload Badge
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Badge Description"
                      value={formData.customAchievement.description}
                      onChange={handleAchievementChange('description')}
                      placeholder="Describe what this badge represents"
                    />
                  </Grid>
                  {formData.customAchievement.image && (
                    <Grid item xs={12}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                          src={formData.customAchievement.image}
                          sx={{ width: 64, height: 64 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Badge preview
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            </Stack>
          </Fade>
        );

      case 3:
        return (
          <Fade in={true} timeout={600}>
            <Stack spacing={3}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">
                  Challenge Milestones
                </Typography>
                <Button
                  variant="outlined"
                  onClick={handleAddMilestone}
                  startIcon={<AddIcon />}
                  size={isMobile ? "small" : "medium"}
                >
                  Add Milestone
                </Button>
              </Box>
              
              {formData.milestones.map((milestone, index) => (
                <Zoom in={true} timeout={300} key={index} style={{ transitionDelay: `${index * 100}ms` }}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3, 
                      border: '1px solid #E5E7EB',
                      position: 'relative',
                    }}
                  >
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Milestone {index + 1}
                      </Typography>
                      {formData.milestones.length > 1 && (
                        <IconButton
                          onClick={() => handleRemoveMilestone(index)}
                          color="error"
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={8}>
                        <TextField
                          fullWidth
                          label="Milestone Title"
                          value={milestone.title}
                          onChange={handleMilestoneChange(index, 'title')}
                          error={!!errors[`milestone_${index}_title`]}
                          helperText={errors[`milestone_${index}_title`]}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Points"
                          value={milestone.points}
                          onChange={handleMilestoneChange(index, 'points')}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <StarIcon />
                              </InputAdornment>
                            )
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          label="Description"
                          value={milestone.description}
                          onChange={handleMilestoneChange(index, 'description')}
                          placeholder="Describe what needs to be accomplished"
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Zoom>
              ))}
            </Stack>
          </Fade>
        );

      default:
        return null;
    }
  };

  if (showSuccess) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Fade in={true} timeout={800}>
          <Box>
            <Zoom in={true} timeout={1000}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'success.main',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <CheckIcon fontSize="large" />
              </Avatar>
            </Zoom>
            <Typography variant="h4" gutterBottom fontWeight="bold" color="success.main">
              Challenge Created! 🎉
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph>
              Your challenge is now live and ready for participants.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Redirecting to challenges page...
            </Typography>
          </Box>
        </Fade>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
      <Slide direction="down" in={true} timeout={600}>
        <Box mb={4} textAlign="center">
          <Typography 
            variant={isMobile ? "h4" : "h3"} 
            component="h1" 
            gutterBottom 
            fontWeight="bold"
          >
            Create New Challenge ✨
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Design an engaging challenge for your community
          </Typography>
        </Box>
      </Slide>

      <Paper elevation={0} sx={{ border: '1px solid #E5E7EB', overflow: 'hidden' }}>
        {isMobile ? (
          // Mobile: Full-width stepped form
          <Box>
            <Box sx={{ p: 2, borderBottom: '1px solid #E5E7EB' }}>
              <Typography variant="h6" fontWeight="bold">
                {steps[activeStep].label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Step {activeStep + 1} of {steps.length}
              </Typography>
            </Box>
            
            <Box sx={{ p: 3 }}>
              {renderStepContent(activeStep)}
            </Box>
            
            <Divider />
            
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
              >
                Back
              </Button>
              
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? null : <CheckIcon />}
                >
                  {isSubmitting ? 'Creating...' : 'Create Challenge'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        ) : (
          // Desktop: Stepper layout
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel icon={step.icon}>
                  <Typography variant="h6" fontWeight="bold">
                    {step.label}
                  </Typography>
                </StepLabel>
                <StepContent>
                  <Box sx={{ py: 3 }}>
                    {renderStepContent(index)}
                  </Box>
                  <Box sx={{ pb: 2, display: 'flex', gap: 1 }}>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      variant="outlined"
                    >
                      Back
                    </Button>
                    {index === steps.length - 1 ? (
                      <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        startIcon={<CheckIcon />}
                      >
                        {isSubmitting ? 'Creating...' : 'Create Challenge'}
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={handleNext}
                      >
                        Continue
                      </Button>
                    )}
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        )}
      </Paper>
    </Container>
  );
}

export default CreateChallenge;