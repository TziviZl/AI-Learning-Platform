import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../utils/api';

interface User {
    id: number;
    name: string;
    phone: string;
    role: 'USER' | 'ADMIN';
    createdAt: string;
}

interface UsersState {
    users: User[];
    loading: boolean;
    error: string | null;
    totalUsers: number;
}

const initialState: UsersState = {
    users: [],
    loading: false,
    error: null,
    totalUsers: 0,
};

interface FetchUsersParams {
    page?: number;
    limit?: number;
    role?: 'user' | 'admin' | '';
    search?: string;
}

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

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action: PayloadAction<{ users: User[]; totalCount: number }>) => {
                state.loading = false;
                state.users = action.payload.users;
                state.totalUsers = action.payload.totalCount;
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to fetch users';
                state.users = [];
                state.totalUsers = 0;
            })
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.loading = false;
                const index = state.users.findIndex((user) => user.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to update user';
            })
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.users = state.users.filter((user) => user.id !== action.payload);
                state.totalUsers -= 1;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to delete user';
            });
    },
});

export default usersSlice.reducer;
