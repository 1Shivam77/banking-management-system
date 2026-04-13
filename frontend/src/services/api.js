const API_BASE = 'http://localhost:8080/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.error || data?.message || `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  // Auth
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  adminLogin: (data) => request('/auth/admin-login', { method: 'POST', body: JSON.stringify(data) }),
  verifyOtp: (data) => request('/auth/verify-otp', { method: 'POST', body: JSON.stringify(data) }),

  // Account operations
  getBalance: () => request('/account/balance'),
  deposit: (amount) => request('/account/deposit', { method: 'POST', body: JSON.stringify({ amount }) }),
  withdraw: (amount) => request('/account/withdraw', { method: 'POST', body: JSON.stringify({ amount }) }),
  fastCash: (amount) => request('/account/fast-cash', { method: 'POST', body: JSON.stringify({ amount }) }),
  transfer: (data) => request('/account/transfer', { method: 'POST', body: JSON.stringify(data) }),
  changePin: (data) => request('/account/pin-change', { method: 'POST', body: JSON.stringify(data) }),
  getStatement: () => request('/account/statement'),
  getAnalytics: () => request('/account/analytics'),
  // Admin endpoints
  getAllUsers: () => request('/admin/users'),
  freezeAccount: (id) => request(`/admin/users/${id}/freeze`, { method: 'POST' }),
  getSystemMetrics: () => request('/admin/metrics'),
  get2faStatus: () => request('/admin/2fa-status'),
  toggle2fa: (enabled) => request('/admin/2fa-toggle', { method: 'POST', body: JSON.stringify({ enabled }) }),
  downloadStatement: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/account/statement/download`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to download PDF');
    return await response.blob();
  },
};
