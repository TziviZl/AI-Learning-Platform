import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../../utils/api';
import { User, UserUpdatePayload, AuthState } from './authTypes';

export const loginUser = createAsyncThunk<
  { user: User; token: string },
  { phone: string; password: string },
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post('/api/auth/login', credentials);
    if (response.data && response.data.user && response.data.token) {
      const normalizedUser = {
        ...response.data.user,
        role: response.data.user.role.toLowerCase() as 'user' | 'admin',
      };
      return { user: normalizedUser, token: response.data.token };
    }
    return rejectWithValue('Login response missing user or token');
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Login failed';
    if (errorMessage === 'User not found') return rejectWithValue('User not found');
    if (errorMessage === 'Invalid credentials') return rejectWithValue('Incorrect password');
    return rejectWithValue(errorMessage);
  }
});

export const registerUser = createAsyncThunk<
  { user: User; token: string },
  { name: string; phone: string; password: string },
  { rejectValue: string }
>('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post('/api/auth/register', userData);
    if (response.data && response.data.user && response.data.token) {
      const normalizedUser = {
        ...response.data.user,
        role: response.data.user.role.toLowerCase() as 'user' | 'admin',
      };
      return { user: normalizedUser, token: response.data.token };
    }
    return rejectWithValue('Registration response missing user or token');
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Registration failed';
    return rejectWithValue(errorMessage);
  }
});

export const updateProfile = createAsyncThunk<
  { user: User },
  UserUpdatePayload,
  { rejectValue: string; state: { auth: AuthState } }
>('auth/updateProfile', async (userData, { rejectWithValue, getState }) => {
  try {
    const currentToken = getState().auth.token;
    if (!currentToken) {
      return rejectWithValue('No token found, please log in.');
    }
    const response = await api.patch('/api/users/me', userData, {
      headers: {
        Authorization: `Bearer ${currentToken}`,
      },
    });
    if (response.data && response.data.user) {
      const normalizedUser = {
        ...response.data.user,
        role: response.data.user.role.toLowerCase() as 'user' | 'admin',
      };
      return { user: normalizedUser };
    }
    return rejectWithValue('Profile update response missing user data');
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Profile update failed';
    return rejectWithValue(errorMessage);
  }
});
