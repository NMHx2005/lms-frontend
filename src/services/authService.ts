import api from './api';

export const authService = {
  async login(credentials: { email: string; password: string }) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async register(userData: { email: string; password: string; name: string }) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  async updateProfile(userData: { email?: string; name?: string; avatar?: string; phone?: string; address?: string; bio?: string }) {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },

  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};