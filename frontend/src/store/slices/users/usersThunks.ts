import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../../utils/api';
import { User, FetchUsersParams } from './usersTypes';

export const fetchAllUsers = createAsyncThunk<
  { users: User[]; totalCount: number },
  FetchUsersParams,
  { rejectValue: string }
>(
  'users/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();
      if (params.page) query.append('page', params.page.toString());
      if (params.limit) query.append('limit', params.limit.toString());
      if (params.role) query.append('role', params.role);
      if (params.search) query.append('search', params.search);

      const response = await api.get(`/api/admin/users?${query.toString()}`);
      return { users: response.data.users, totalCount: response.data.totalCount };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const updateUser = createAsyncThunk<
  User,
  { id: number; userData: Partial<User> },
  { rejectValue: string }
>(
  'users/update',
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/api/admin/users/${id}`, userData);
      return response.data as User;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

export const deleteUser = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>(
  'users/delete',
  async (userId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/admin/users/${userId}`);
      return userId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);
