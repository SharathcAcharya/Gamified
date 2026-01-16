import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  IconButton,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  Tab,
  Tabs,
} from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  ShoppingCart as ShopIcon,
  History as HistoryIcon,
  CardGiftcard as GiftIcon,
  LocalFireDepartment as FireIcon,
  EmojiEvents as TrophyIcon,
  Star as StarIcon,
  ContentCopy as CopyIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const VirtualEconomyHub = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState(0);
  const [referralDialogOpen, setReferralDialogOpen] = useState(false);

  const [wallet, setWallet] = useState({
    coins: 2500,
    gems: 50,
    lifetimeEarned: 5000,
  });

  const [shopItems, setShopItems] = useState([
    {
      id: 1,
      name: 'Avatar Frame: Gold',
      price: 500,
      currency: 'coins',
      category: 'avatar',
      image: '🎨',
      owned: false,
    },
    {
      id: 2,
      name: 'Profile Theme: Galaxy',
      price: 750,
      currency: 'coins',
      category: 'theme',
      image: '🌌',
      owned: false,
    },
    {
      id: 3,
      name: 'XP Boost 24h',
      price: 300,
      currency: 'coins',
      category: 'boost',
      image: '⚡',
      owned: false,
    },
    {
      id: 4,
      name: 'Streak Freeze',
      price: 200,
      currency: 'coins',
      category: 'boost',
      image: '❄️',
      owned: false,
    },
    {
      id: 5,
      name: 'Challenge Spotlight',
      price: 400,
      currency: 'coins',
      category: 'boost',
      image: '💡',
      owned: false,
    },
    {
      id: 6,
      name: 'Premium Badge',
      price: 20,
      currency: 'gems',
      category: 'badge',
      image: '💎',
      owned: false,
    },
    {
      id: 7,
      name: 'Animated Emoji Pack',
      price: 15,
      currency: 'gems',
      category: 'emoji',
      image: '🎭',
      owned: false,
    },
  ]);

  const [transactions, setTransactions] = useState([
    { id: 1, type: 'earned', amount: 100, currency: 'coins', reason: 'Completed Daily Challenge', date: '2 hours ago' },
    { id: 2, type: 'earned', amount: 50, currency: 'coins', reason: '7-day streak bonus', date: '1 day ago' },
    { id: 3, type: 'spent', amount: 300, currency: 'coins', reason: 'Purchased XP Boost', date: '2 days ago' },
    { id: 4, type: 'earned', amount: 500, currency: 'coins', reason: 'Referral bonus', date: '3 days ago' },
    { id: 5, type: 'earned', amount: 10, currency: 'gems', reason: 'Level up reward', date: '5 days ago' },
  ]);

  const [referralStats, setReferralStats] = useState({
    code: 'GAMIFY-' + (user?.email?.substring(0, 6).toUpperCase() || 'USER123'),
    referrals: 5,
    pending: 2,
    coinsEarned: 2500,
  });

  const handlePurchase = (item) => {
    if (item.currency === 'coins' && wallet.coins >= item.price) {
      setWallet({ ...wallet, coins: wallet.coins - item.price });
      alert(`Purchased ${item.name}!`);
    } else if (item.currency === 'gems' && wallet.gems >= item.price) {
      setWallet({ ...wallet, gems: wallet.gems - item.price });
      alert(`Purchased ${item.name}!`);
    } else {
      alert(`Insufficient ${item.currency}!`);
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralStats.code);
    alert('Referral code copied!');
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          💰 Virtual Economy Hub
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Earn, spend, and manage your GamifyCoins and Gems
        </Typography>
      </Box>

      {/* Wallet Overview */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #6366F1 0%, #8B8CF8 100%)',
          color: 'white',
        }}
      >
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <WalletIcon sx={{ fontSize: 40 }} />
          <Typography variant="h5" fontWeight="bold">
            My Wallet
          </Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white' }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                  GamifyCoins
                </Typography>
                <Typography variant="h3" fontWeight="bold">
                  {wallet.coins.toLocaleString()}
                </Typography>
                <Box display="flex" alignItems="center" gap={1} mt={1}>
                  <StarIcon fontSize="small" />
                  <Typography variant="caption">
                    Lifetime earned: {wallet.lifetimeEarned.toLocaleString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white' }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                  Premium Gems
                </Typography>
                <Typography variant="h3" fontWeight="bold">
                  {wallet.gems}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1, borderColor: 'white', color: 'white' }}
                >
                  Buy Gems
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white' }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                  Earn More Coins
                </Typography>
                <List dense sx={{ color: 'white' }}>
                  <ListItem disablePadding>
                    <Typography variant="caption">✓ Daily Login: +10</Typography>
                  </ListItem>
                  <ListItem disablePadding>
                    <Typography variant="caption">✓ Complete Challenge: +100</Typography>
                  </ListItem>
                  <ListItem disablePadding>
                    <Typography variant="caption">✓ Refer Friend: +500</Typography>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper elevation={0} sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, v) => setActiveTab(v)}
          variant={isMobile ? 'scrollable' : 'fullWidth'}
          scrollButtons="auto"
        >
          <Tab icon={<ShopIcon />} label="Shop" iconPosition="start" />
          <Tab icon={<HistoryIcon />} label="History" iconPosition="start" />
          <Tab icon={<GiftIcon />} label="Referrals" iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Shop Tab */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {shopItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
              >
                <CardContent>
                  <Box textAlign="center" mb={2}>
                    <Typography variant="h1">{item.image}</Typography>
                  </Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom textAlign="center">
                    {item.name}
                  </Typography>
                  <Box display="flex" justifyContent="center" gap={1} mb={2}>
                    <Chip
                      label={item.category}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    {item.owned && <Chip label="Owned" size="small" color="success" />}
                  </Box>
                  <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={2}>
                    {item.currency === 'coins' ? (
                      <>
                        <StarIcon color="warning" />
                        <Typography variant="h6" fontWeight="bold">
                          {item.price}
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Box
                          component="span"
                          sx={{
                            background: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontSize: '1.5rem',
                          }}
                        >
                          💎
                        </Box>
                        <Typography variant="h6" fontWeight="bold">
                          {item.price}
                        </Typography>
                      </>
                    )}
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handlePurchase(item)}
                    disabled={item.owned}
                  >
                    {item.owned ? 'Owned' : 'Purchase'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* History Tab */}
      {activeTab === 1 && (
        <Paper elevation={0}>
          <List>
            {transactions.map((tx, index) => (
              <React.Fragment key={tx.id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor:
                          tx.type === 'earned'
                            ? theme.palette.success.main
                            : theme.palette.warning.main,
                      }}
                    >
                      {tx.type === 'earned' ? '+' : '-'}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body1" fontWeight="bold">
                          {tx.type === 'earned' ? '+' : '-'}
                          {tx.amount} {tx.currency === 'coins' ? '🪙' : '💎'}
                        </Typography>
                        <Chip
                          label={tx.type}
                          size="small"
                          color={tx.type === 'earned' ? 'success' : 'warning'}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2">{tx.reason}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {tx.date}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < transactions.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}

      {/* Referrals Tab */}
      {activeTab === 2 && (
        <Box>
          <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Invite Friends & Earn Rewards
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Share your referral code and earn 500 GamifyCoins + 1 month Premium for each friend who joins!
            </Typography>
            
            <Box
              sx={{
                p: 3,
                bgcolor: 'grey.50',
                borderRadius: 2,
                textAlign: 'center',
                mb: 3,
              }}
            >
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Your Referral Code
              </Typography>
              <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{
                    background: 'linear-gradient(135deg, #6366F1, #EC4899)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {referralStats.code}
                </Typography>
                <IconButton onClick={copyReferralCode} color="primary">
                  <CopyIcon />
                </IconButton>
              </Box>
              <Box display="flex" gap={2} justifyContent="center" mt={2}>
                <Button
                  variant="contained"
                  startIcon={<ShareIcon />}
                  onClick={() => setReferralDialogOpen(true)}
                >
                  Share Code
                </Button>
              </Box>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                      {referralStats.referrals}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total Referrals
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} md={3}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" color="warning.main">
                      {referralStats.pending}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Pending
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} md={3}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" color="success.main">
                      {referralStats.coinsEarned}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Coins Earned
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} md={3}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <TrophyIcon sx={{ fontSize: 40, color: 'warning.main' }} />
                    <Typography variant="caption" color="text.secondary">
                      Invite 10 → Lifetime Premium!
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      )}

      {/* Share Dialog */}
      <Dialog open={referralDialogOpen} onClose={() => setReferralDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Share Your Referral Code</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Share your unique code with friends and family. Both of you will receive rewards when they sign up!
          </Typography>
          <TextField
            fullWidth
            value={`Join me on Gamified! Use my referral code: ${referralStats.code} and get 250 bonus coins! https://gamified.app/ref/${referralStats.code}`}
            multiline
            rows={3}
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
          />
          <Box display="flex" gap={1} mt={2}>
            <Button variant="outlined" fullWidth startIcon={<ShareIcon />}>
              Share on Twitter
            </Button>
            <Button variant="outlined" fullWidth startIcon={<ShareIcon />}>
              Share on Facebook
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReferralDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VirtualEconomyHub;
