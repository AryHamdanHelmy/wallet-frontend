import client from './client'

export const authApi = {
  login: (email, password) =>
    client.post('/auth/login', { email, password }),

  register: (data) => client.post('/auth/register', data),

  logout: () => client.post('/auth/logout'),

  me: () => client.get('/me'),
}

export const walletApi = {
  getBalance: () => client.get('/wallet'),

  topup: (amount) => client.post('/topup', { amount }),

  transfer: (recipient, amount, description) =>
    client.post('/transfer', { recipient, amount, description }),

  getTransactions: (page = 1) =>
    client.get('/transactions', { params: { page } }),
}