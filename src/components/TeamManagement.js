import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  AvatarGroup,
  LinearProgress,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Group as TeamIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  EmojiEvents as TrophyIcon,
  PersonAdd as InviteIcon
} from '@mui/icons-material';

function TeamManagement() {
  const theme = useTheme();
  const [teams, setTeams] = useState([
    {
      id: '1',
      name: 'Fitness Warriors',
      description: 'A team dedicated to fitness and healthy lifestyle challenges',
      members: [
        { id: '1', name: 'John Doe', avatar: 'https://mui.com/static/images/avatar/1.jpg', role: 'leader' },
        { id: '2', name: 'Jane Smith', avatar: 'https://mui.com/static/images/avatar/2.jpg', role: 'member' },
      ],
      activeChallenges: 2,
      completedChallenges: 5,
      teamPoints: 1500,
      progress: 75,
      achievements: ['Team Spirit', 'Challenge Masters'],
    },
    // Add more mock teams here
  ]);

  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', description: '' });

  const handleCreateTeam = () => {
    // Add team creation logic here
    setOpenCreateDialog(false);
  };

  const handleInviteMember = (teamId) => {
    // Add member invitation logic here
  };

  const handleLeaveTeam = (teamId) => {
    // Add team leaving logic here
  };

  return (
    <Box sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Teams
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreateDialog(true)}
        >
          Create Team
        </Button>
      </Box>

      <Grid container spacing={3}>
        {teams.map((team) => (
          <Grid item xs={12} md={6} key={team.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TeamIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="h6" component="h2">
                    {team.name}
                  </Typography>
                </Box>

                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  {team.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Members
                  </Typography>
                  <AvatarGroup max={4}>
                    {team.members.map((member) => (
                      <Tooltip key={member.id} title={`${member.name} (${member.role})`}>
                        <Avatar alt={member.name} src={member.avatar} />
                      </Tooltip>
                    ))}
                  </AvatarGroup>
                </Box>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={4}>
                    <Typography variant="subtitle2" align="center">
                      Active Challenges
                    </Typography>
                    <Typography variant="h6" align="center">
                      {team.activeChallenges}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="subtitle2" align="center">
                      Completed
                    </Typography>
                    <Typography variant="h6" align="center">
                      {team.completedChallenges}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="subtitle2" align="center">
                      Team Points
                    </Typography>
                    <Typography variant="h6" align="center">
                      {team.teamPoints}
                    </Typography>
                  </Grid>
                </Grid>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Team Progress
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={team.progress}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Achievements
                  </Typography>
                  {team.achievements.map((achievement) => (
                    <Chip
                      key={achievement}
                      icon={<TrophyIcon />}
                      label={achievement}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  startIcon={<InviteIcon />}
                  onClick={() => handleInviteMember(team.id)}
                >
                  Invite
                </Button>
                <Button
                  size="small"
                  startIcon={<ShareIcon />}
                >
                  Share
                </Button>
                <Button
                  size="small"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleLeaveTeam(team.id)}
                >
                  Leave
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create Team Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)}>
        <DialogTitle>Create New Team</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Team Name"
            fullWidth
            value={newTeam.name}
            onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={newTeam.description}
            onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateTeam} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TeamManagement;