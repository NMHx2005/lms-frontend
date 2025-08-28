import { sharedAuthService } from '@/services/shared/auth.service';
import { clientAuthService } from '@/services/client/auth.service';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';

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
  token: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: Boolean(localStorage.getItem('accessToken')),
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    const response = await sharedAuthService.login(credentials);
    return response;
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: { email: string; password: string; name: string; phone?: string }) => {
    const response = await sharedAuthService.register(userData as any);
    return response;
  }
);

export const getProfile = createAsyncThunk('auth/getProfile', async (_, { getState }) => {
  const state = getState() as any;
  const accessToken = state.auth.token || localStorage.getItem('accessToken');
  
  // Chỉ gọi API khi có accessToken
  if (!accessToken) {
    return null;
  }
  
  const response = await sharedAuthService.getProfile();
  return response;
});

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData: { email?: string; name?: string; avatar?: string; phone?: string; address?: string; bio?: string }) => {
    const response = await clientAuthService.updateProfile(userData as any);
    return response;
  }
);

function extractAuthPayload(payload: any) {
  const data = payload?.data ?? payload;
  const userRaw = data?.user ?? data;
  const user = {
    ...userRaw,
    _id: userRaw?.id || userRaw?._id,
  };
  const accessToken = data?.accessToken;
  const refreshToken = data?.refreshToken;
  return { user, accessToken, refreshToken };
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      toast.success('Đăng xuất thành công');
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
        const { user, accessToken, refreshToken } = extractAuthPayload(action.payload);
        state.user = user as any;
        state.token = accessToken || null;
        state.refreshToken = refreshToken || null;
        state.isAuthenticated = Boolean(accessToken);
        if (accessToken) localStorage.setItem('accessToken', accessToken);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        toast.success('Đăng nhập thành công');
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
        const { user, accessToken, refreshToken } = extractAuthPayload(action.payload);
        state.user = user as any;
        state.token = accessToken || null;
        state.refreshToken = refreshToken || null;
        state.isAuthenticated = Boolean(accessToken);
        if (accessToken) localStorage.setItem('accessToken', accessToken);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        toast.success('Đăng ký thành công');
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      })
      // Get Profile
      .addCase(getProfile.fulfilled, (state, action) => {
        // Nếu không có accessToken, action.payload sẽ là null
        if (!action.payload) {
          return; // Không làm gì cả, giữ nguyên state
        }
        
        // Backend returns { success, data } for /auth/me
        const data = (action.payload as any)?.data ?? action.payload;
        const userData = {
          ...data,
          _id: data?.id || data?._id,
        } as any;
        state.user = userData;
        state.isAuthenticated = true;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        // Backend returns { success, data: { user } } for /auth/profile
        const data = (action.payload as any)?.data ?? action.payload;
        const userData = {
          ...data,
          _id: data?.id || data?._id,
        } as any;
        state.user = userData;
        toast.success('Cập nhật hồ sơ thành công');
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Update profile failed';
        toast.error('Cập nhật hồ sơ thất bại');
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;