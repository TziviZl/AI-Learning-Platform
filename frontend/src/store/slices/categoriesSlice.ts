import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../utils/api';

interface Category {
  id: number;
  name: string;
}

interface SubCategory {
  id: number;
  name: string;
  categoryId: number;
}

interface CategoriesState {
  categories: Category[];
  subCategories: SubCategory[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  subCategories: [],
  loading: false,
  error: null,
};

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

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearSubCategories: (state) => {
      state.subCategories = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch categories';
      })
      .addCase(fetchSubCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.subCategories = action.payload;
      })
      .addCase(fetchSubCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch sub-categories';
      });
  },
});

export const { clearSubCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;
