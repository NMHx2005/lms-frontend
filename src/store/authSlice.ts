import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '@/services/authService';

import { User } from '../types/index';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    const response = await authService.login(credentials);
    return response;
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: { email: string; password: string; name: string }) => {
    const response = await authService.register(userData);
    return response;
  }
);

export const getProfile = createAsyncThunk('auth/getProfile', async () => {
  const response = await authService.getProfile();
  return response;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        // Map the response to match User interface
        const userData = {
          ...action.payload.user,
          _id: action.payload.user.id || action.payload.user._id
        };
        state.user = userData;
        state.token = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        // Map the response to match User interface
        const userData = {
          ...action.payload.user,
          _id: action.payload.user.id || action.payload.user._id
        };
        state.user = userData;
        state.token = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      })
      // Get Profile
      .addCase(getProfile.fulfilled, (state, action) => {
        // Map the response to match User interface
        const userData = {
          ...action.payload,
          _id: action.payload.id || action.payload._id
        };
        state.user = userData;
        state.isAuthenticated = true;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;