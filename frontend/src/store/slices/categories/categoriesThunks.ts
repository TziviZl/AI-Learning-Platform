import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../../utils/api';

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/categories');
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch categories');
    }
  }
);

export const fetchSubCategories = createAsyncThunk(
  'categories/fetchSubCategories',
  async (categoryId: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/categories/${categoryId}/sub-categories`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch sub-categories');
    }
  }
);
