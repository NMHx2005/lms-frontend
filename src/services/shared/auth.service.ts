import api from '../api';

export const sharedAuthService = {
  // User Registration & Login
  async register(userData: { 
    firstName: string; 
    lastName: string; 
    email: string; 
    password: string; 
    confirmPassword: string; 
    role: string; 
    phoneNumber?: string; 
    dateOfBirth?: string; 
    gender?: string; 
    country?: string; 
    city?: string; 
    interests?: string[]; 
    agreedToTerms: boolean; 
    marketingOptIn?: boolean; 
  }) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async login(credentials: { 
    email: string; 
    password: string; 
    rememberMe?: boolean; 
    deviceInfo?: any; 
  }) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Token Management
  async getProfile() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async refreshToken(refreshToken: string) {
    const response = await api.post('/auth/refresh-token', { refreshToken });
    return response.data;
  },

  async logout(refreshToken: string, logoutAllDevices?: boolean) {
    const response = await api.post('/auth/logout', { 
      refreshToken, 
      logoutAllDevices: logoutAllDevices || false 
    });
    return response.data;
  },

  // Password Management
  async forgotPassword(email: string, redirectUrl?: string, language?: string) {
    const response = await api.post('/auth/forgot-password', { 
      email, 
      redirectUrl, 
      language 
    });
    return response.data;
  },

  async resetPassword(token: string, newPassword: string, confirmPassword: string) {
    const response = await api.post('/auth/reset-password', { 
      token, 
      newPassword, 
      confirmPassword 
    });
    return response.data;
  },

  async changePassword(passwordData: any) {
    const response = await api.post('/auth/change-password', passwordData);
    return response.data;
  },

  // Google OAuth Integration
  async getOAuthConfig() {
    const response = await api.get('/auth/google/config');
    return response.data;
  },

  async startGoogleOAuth(state: string) {
    const response = await api.get(`/auth/google?state=${state}`);
    return response.data;
  },

  async linkGoogleAccount(googleAccessToken: string, googleIdToken: string) {
    const response = await api.post('/auth/google/link', { 
      googleAccessToken, 
      googleIdToken 
    });
    return response.data;
  },

  async unlinkGoogleAccount(confirmUnlink: boolean, reason?: string) {
    const response = await api.delete('/auth/google/unlink', { 
      data: { confirmUnlink, reason } 
    });
    return response.data;
  },

  async checkOAuthStatus() {
    const response = await api.get('/auth/google/status');
    return response.data;
  },
};
