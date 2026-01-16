const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to make API calls with fetch
const fetchWithAuth = async (endpoint, options = {}) => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    // Handle 401 Unauthorized
    if (response.status === 401) {
      sessionStorage.removeItem('token');
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    // Parse JSON response
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'API request failed');
    }

    return { data };
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ==================== CURRENCY APIs ====================

export const currencyAPI = {
  getWallet: () => fetchWithAuth('/currency/wallet'),
  getTransactions: (limit = 50) => fetchWithAuth(`/currency/transactions?limit=${limit}`),
  purchaseItem: (item) => fetchWithAuth('/currency/purchase', {
    method: 'POST',
    body: JSON.stringify(item),
  }),
  claimDailyBonus: () => fetchWithAuth('/currency/daily-bonus', { method: 'POST' }),
  getRichestUsers: (limit = 10) => fetchWithAuth(`/currency/richest?limit=${limit}`),
};

// ==================== LEADERBOARD APIs ====================

export const leaderboardAPI = {
  getLeaderboard: (type, category = null) => {
    const url = category 
      ? `/leaderboard/${type}?category=${category}`
      : `/leaderboard/${type}`;
    return fetchWithAuth(url);
  },
  getUserRank: (userId, type = 'global') => 
    fetchWithAuth(`/leaderboard/${type}/rank/${userId}`),
  refreshAll: () => fetchWithAuth('/leaderboard/refresh', { method: 'POST' }),
};

// ==================== REFERRAL APIs ====================

export const referralAPI = {
  getCode: () => fetchWithAuth('/referrals/code'),
  getStats: () => fetchWithAuth('/referrals/stats'),
  validateCode: (code) => fetchWithAuth(`/referrals/validate/${code}`),
  trackSignup: (referralCode, newUserId) => 
    fetchWithAuth('/referrals/track', {
      method: 'POST',
      body: JSON.stringify({ referralCode, newUserId }),
    }),
  getLeaderboard: (limit = 10) => 
    fetchWithAuth(`/referrals/leaderboard?limit=${limit}`),
};

// ==================== SECURITY APIs ====================

export const securityAPI = {
  getScore: () => fetchWithAuth('/security/score'),
  getSessions: () => fetchWithAuth('/security/sessions'),
  revokeSession: (sessionId) => 
    fetchWithAuth(`/security/sessions/${sessionId}`, { method: 'DELETE' }),
  revokeAllSessions: () => fetchWithAuth('/security/sessions/revoke-all', { method: 'POST' }),
  getLoginHistory: (limit = 20) => 
    fetchWithAuth(`/security/login-history?limit=${limit}`),
  changePassword: (currentPassword, newPassword) => 
    fetchWithAuth('/security/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
  checkPasswordStrength: (password) => 
    fetchWithAuth('/security/check-password-strength', {
      method: 'POST',
      body: JSON.stringify({ password }),
    }),
  exportData: () => fetchWithAuth('/security/export-data'),
  toggle2FA: (enabled) => fetchWithAuth('/security/toggle-2fa', {
    method: 'POST',
    body: JSON.stringify({ enabled }),
  }),
  updatePrivacySettings: (settings) => 
    fetchWithAuth('/security/privacy-settings', {
      method: 'PATCH',
      body: JSON.stringify(settings),
    }),
};

// ==================== USER APIs (existing) ====================

export const userAPI = {
  getProfile: () => fetchWithAuth('/users/profile'),
  updateProfile: (data) => fetchWithAuth('/users/profile', {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  register: (data) => fetchWithAuth('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  login: (email, password) => fetchWithAuth('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
};

// ==================== CHALLENGE APIs (existing) ====================

export const challengeAPI = {
  getAll: () => fetchWithAuth('/challenges'),
  getById: (id) => fetchWithAuth(`/challenges/${id}`),
  create: (data) => fetchWithAuth('/challenges', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => fetchWithAuth(`/challenges/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  delete: (id) => fetchWithAuth(`/challenges/${id}`, { method: 'DELETE' }),
  join: (id) => fetchWithAuth(`/challenges/${id}/join`, { method: 'POST' }),
  submitProgress: (id, data) => fetchWithAuth(`/challenges/${id}/progress`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  like: (id) => fetchWithAuth(`/challenges/${id}/like`, { method: 'POST' }),
  comment: (id, text) => fetchWithAuth(`/challenges/${id}/comments`, {
    method: 'POST',
    body: JSON.stringify({ text }),
  }),
};

export default fetchWithAuth;
