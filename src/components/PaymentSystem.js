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
  TextField,
  MenuItem,
  Alert,
  LinearProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Divider,
  useTheme,
  Paper,
  Stack
} from '@mui/material';
import {
  CreditCard as CreditCardIcon,
  Receipt as ReceiptIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  History as HistoryIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// Payment Form Component
const PaymentForm = ({ onSuccess, onError, amount, description, type = 'one-time' }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) return;
    
    setProcessing(true);
    
    try {
      // Create payment intent
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ amount, description, type })
      });
      
      const { clientSecret } = await response.json();
      
      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)
        }
      });
      
      if (result.error) {
        onError(result.error.message);
      } else {
        onSuccess(result.paymentIntent);
      }
    } catch (error) {
      onError(error.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2, mb: 3 }}>
        <CardElement 
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </Box>
      
      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={!stripe || processing}
        size="large"
        sx={{ height: 48 }}
      >
        {processing ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LinearProgress sx={{ width: 100, mr: 2 }} />
            Processing...
          </Box>
        ) : (
          `Pay $${amount}`
        )}
      </Button>
    </Box>
  );
};

// Subscription Plans Component
const SubscriptionPlans = ({ onSelectPlan, currentPlan = 'free' }) => {
  const theme = useTheme();
  
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: 'forever',
      features: [
        'Up to 5 active challenges',
        'Basic analytics',
        'Community support',
        'Mobile app access'
      ],
      color: theme.palette.grey[500],
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 9.99,
      period: 'month',
      priceId: 'price_premium_monthly',
      features: [
        'Unlimited challenges',
        'Advanced analytics',
        'Priority support',
        'Custom achievements',
        'Team challenges',
        'Export data'
      ],
      color: theme.palette.primary.main,
      popular: true
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 19.99,
      period: 'month',
      priceId: 'price_pro_monthly',
      features: [
        'Everything in Premium',
        'White-label branding',
        'API access',
        'Advanced integrations',
        'Custom domains',
        'Priority phone support'
      ],
      color: theme.palette.secondary.main,
      popular: false
    }
  ];

  return (
    <Grid container spacing={3}>
      {plans.map((plan) => (
        <Grid item xs={12} md={4} key={plan.id}>
          <Card 
            sx={{ 
              height: '100%',
              position: 'relative',
              border: currentPlan === plan.id ? 2 : 1,
              borderColor: currentPlan === plan.id ? plan.color : 'grey.300',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[8]
              },
              transition: 'all 0.3s ease'
            }}
          >
            {plan.popular && (
              <Chip
                label="Most Popular"
                color="primary"
                size="small"
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  zIndex: 1
                }}
              />
            )}
            
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                {plan.name}
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="h3" color={plan.color} fontWeight="bold">
                  ${plan.price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  per {plan.period}
                </Typography>
              </Box>
              
              <List dense sx={{ mb: 3 }}>
                {plan.features.map((feature, index) => (
                  <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                    <ListItemAvatar sx={{ minWidth: 32 }}>
                      <CheckCircleIcon 
                        color="primary" 
                        fontSize="small"
                      />
                    </ListItemAvatar>
                    <ListItemText 
                      primary={feature}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
              
              <Button
                variant={currentPlan === plan.id ? "outlined" : "contained"}
                fullWidth
                size="large"
                disabled={currentPlan === plan.id}
                onClick={() => onSelectPlan(plan)}
                sx={{ height: 48 }}
              >
                {currentPlan === plan.id ? 'Current Plan' : 
                 plan.price === 0 ? 'Get Started' : 'Upgrade Now'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

// Payment History Component
const PaymentHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchPaymentHistory();
  }, [page]);

  const fetchPaymentHistory = async () => {
    try {
      const response = await fetch(`/api/payments/history?page=${page}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error('Error fetching payment history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'succeeded': return 'success';
      case 'failed': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const formatAmount = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount / 100);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      {transactions.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <ReceiptIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No payment history found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your payment transactions will appear here
          </Typography>
        </Box>
      ) : (
        <List>
          {transactions.map((transaction) => (
            <React.Fragment key={transaction._id}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <CreditCardIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body1">
                        {transaction.description}
                      </Typography>
                      <Chip
                        label={transaction.status}
                        color={getStatusColor(transaction.status)}
                        size="small"
                      />
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </Typography>
                      <Typography 
                        variant="body1" 
                        fontWeight="bold"
                        color={transaction.status === 'succeeded' ? 'success.main' : 'text.primary'}
                      >
                        {formatAmount(transaction.amount, transaction.currency)}
                      </Typography>
                    </Box>
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

// Main Payment Component
const PaymentSystem = () => {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState(0);
  const [user, setUser] = useState(null);
  const [upgradeDialog, setUpgradeDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handlePlanSelection = (plan) => {
    setSelectedPlan(plan);
    setUpgradeDialog(true);
  };

  const handleUpgradeSuccess = (paymentIntent) => {
    setAlert({
      open: true,
      message: 'Upgrade successful! Welcome to ' + selectedPlan.name,
      severity: 'success'
    });
    setUpgradeDialog(false);
    fetchUserData(); // Refresh user data
  };

  const handleUpgradeError = (error) => {
    setAlert({
      open: true,
      message: 'Upgrade failed: ' + error,
      severity: 'error'
    });
  };

  const handleCancelSubscription = async () => {
    try {
      const response = await fetch('/api/payments/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        setAlert({
          open: true,
          message: 'Subscription cancelled successfully',
          severity: 'success'
        });
        fetchUserData();
      }
    } catch (error) {
      setAlert({
        open: true,
        message: 'Failed to cancel subscription',
        severity: 'error'
      });
    }
  };

  const tabLabels = ['Plans', 'Payment History', 'Billing Settings'];

  return (
    <Elements stripe={stripePromise}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        {/* Header */}
        <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h4" gutterBottom>
            Billing & Payments
          </Typography>
          <Typography variant="body1">
            Manage your subscription and payment methods
          </Typography>
          {user?.payment?.subscriptionTier && (
            <Chip
              label={`Current: ${user.payment.subscriptionTier.toUpperCase()}`}
              sx={{ 
                mt: 2, 
                bgcolor: 'white', 
                color: 'primary.main',
                fontWeight: 'bold'
              }}
            />
          )}
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
          {currentTab === 0 && (
            <SubscriptionPlans
              onSelectPlan={handlePlanSelection}
              currentPlan={user?.payment?.subscriptionTier || 'free'}
            />
          )}
          
          {currentTab === 1 && <PaymentHistory />}
          
          {currentTab === 2 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Subscription Management
                </Typography>
                {user?.payment?.subscriptionId ? (
                  <Box>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <Typography>
                        Status: {user.payment.subscriptionStatus || 'Active'}
                      </Typography>
                      <Chip
                        label={user.payment.subscriptionTier?.toUpperCase() || 'FREE'}
                        color="primary"
                      />
                    </Stack>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<CancelIcon />}
                      onClick={handleCancelSubscription}
                    >
                      Cancel Subscription
                    </Button>
                  </Box>
                ) : (
                  <Typography color="text.secondary">
                    No active subscription
                  </Typography>
                )}
              </CardContent>
            </Card>
          )}
        </Box>

        {/* Upgrade Dialog */}
        <Dialog 
          open={upgradeDialog} 
          onClose={() => setUpgradeDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Upgrade to {selectedPlan?.name}
          </DialogTitle>
          <DialogContent>
            {selectedPlan && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  ${selectedPlan.price} per {selectedPlan.period}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {selectedPlan.features.join(', ')}
                </Typography>
                
                <PaymentForm
                  amount={selectedPlan.price}
                  description={`${selectedPlan.name} subscription`}
                  type="subscription"
                  onSuccess={handleUpgradeSuccess}
                  onError={handleUpgradeError}
                />
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </Elements>
  );
};

export default PaymentSystem;
