import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../utils/api';

interface User {
    id: number;
    name: string;
    phone: string;
    role: 'user' | 'admin'; // Expecting lowercase roles in the frontend User interface
}

interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    initialLoading: boolean;
    error: string | null;
    userNotFound: boolean; // Added for specific login error handling
}

export interface UserUpdatePayload {
    name?: string;
    currentPassword?: string;
    newPassword?: string;
}

const loadAuthFromLocalStorage = (): Omit<AuthState, 'initialLoading' | 'userNotFound'> => {
    try {
        const token = localStorage.getItem('token');
        const userString = localStorage.getItem('user');
        let user = userString ? JSON.parse(userString) : null;

        // Normalize role to lowercase if it exists and is a string (from backend uppercase)
        if (user && typeof user.role === 'string') {
            user.role = user.role.toLowerCase() as 'user' | 'admin';
        }

        return {
            user: user,
            token: token,
            loading: false,
            error: null,
        };
    } catch (e) {
        console.error("Failed to load auth state from localStorage", e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return {
            user: null,
            token: null,
            loading: false,
            error: null,
        };
    }
};

const initialState: AuthState = {
    ...loadAuthFromLocalStorage(),
    initialLoading: true,
    userNotFound: false, // Initialize userNotFound state
};

export const loginUser = createAsyncThunk<
    { user: User; token: string },
    { phone: string; password: string },
    { rejectValue: string }
>(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await api.post('/api/auth/login', credentials);
            if (response.data && response.data.user && response.data.token) {
                const normalizedUser = {
                    ...response.data.user,
                    role: response.data.user.role.toLowerCase() as 'user' | 'admin' // Normalize role to lowercase
                };
                return { user: normalizedUser, token: response.data.token };
            }
            return rejectWithValue('Login response missing user or token');
        } catch (error: any) {
            console.error('Login error:', error);
            const errorMessage = error.response?.data?.message || 'Login failed';
            // Check for specific backend error message for "User not found"
            if (errorMessage === 'User not found') {
                // Reject with a specific string that can be caught in extraReducers
                return rejectWithValue('User not found');
            }
            if (errorMessage === 'Invalid credentials'){
                return rejectWithValue('Incorrect password');
            }
             return rejectWithValue(errorMessage);
        }
    }
);

export const registerUser = createAsyncThunk<
    { user: User; token: string },
    { name: string; phone: string; password: string },
    { rejectValue: string }
>(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            // Ensure this endpoint matches your backend's registration route,
            // which should be /api/auth/register as per previous discussions.
            const response = await api.post('/api/auth/register', userData);
            if (response.data && response.data.user && response.data.token) {
                const normalizedUser = {
                    ...response.data.user,
                    role: response.data.user.role.toLowerCase() as 'user' | 'admin' // Normalize role to lowercase
                };
                return { user: normalizedUser, token: response.data.token };
            }
            return rejectWithValue('Registration response missing user or token');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Registration failed';
            return rejectWithValue(errorMessage);
        }
    }
);

export const updateProfile = createAsyncThunk<
    { user: User },
    UserUpdatePayload,
    { rejectValue: string; state: { auth: AuthState } }
>(
    'auth/updateProfile',
    async (userData, { rejectWithValue, getState }) => {
        try {
            const currentToken = getState().auth.token;
            if (!currentToken) {
                return rejectWithValue('No token found, please log in.');
            }
            const response = await api.patch('/api/users/me', userData, {
                headers: {
                    Authorization: `Bearer ${currentToken}`
                }
            });
            if (response.data && response.data.user) {
                const normalizedUser = {
                    ...response.data.user,
                    role: response.data.user.role.toLowerCase() as 'user' | 'admin' // Normalize role to lowercase
                };
                return { user: normalizedUser };
            }
            return rejectWithValue('Profile update response missing user data');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Profile update failed';
            return rejectWithValue(errorMessage);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ token: string; user: User }>
        ) => {
            state.token = action.payload.token;
            state.user = {
                ...action.payload.user,
                role: action.payload.user.role.toLowerCase() as 'user' | 'admin' // Normalize role to lowercase
            };
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(state.user));
            state.initialLoading = false;
            state.userNotFound = false; // Reset on successful login/set credentials
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.loading = false; // Ensure loading is false on logout
            state.error = null;
            state.userNotFound = false; // Reset on logout
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            state.initialLoading = false;
        },
        clearError: (state) => {
            state.error = null;
        },
        // New action to clear the userNotFound flag
        clearUserNotFound: (state) => {
            state.userNotFound = false;
        },
        setInitialAuthLoaded: (state) => {
            state.initialLoading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Login cases
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.userNotFound = false; // Reset on new login attempt
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                console.log('authSlice - Login Fulfilled, Payload User:', action.payload.user);
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem('token', action.payload.token);
                localStorage.setItem('user', JSON.stringify(action.payload.user));
                state.error = null;
                state.userNotFound = false; // Clear on success
                state.initialLoading = false;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.token = null;
                state.user = null;
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                state.error = action.payload as string || 'Login failed';
                state.initialLoading = false;
                // Set userNotFound flag if the specific error message is received
                if (action.payload === 'User not found') {
                    state.userNotFound = true;
                } else {
                    state.userNotFound = false;
                }
            })
            // Register cases
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                console.log('authSlice - Register Fulfilled, Payload User:', action.payload.user); // Added console log
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem('token', action.payload.token);
                localStorage.setItem('user', JSON.stringify(action.payload.user));
                state.initialLoading = false;
                state.error = null; // Clear any previous errors on successful registration
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.token = null;
                state.user = null;
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                state.error = action.payload as string || 'Registration failed';
                state.initialLoading = false;
            })
            // Update Profile cases
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                localStorage.setItem('user', JSON.stringify(action.payload.user));
                state.initialLoading = false;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Profile update failed';
                state.initialLoading = false;
            });
    },
});

export const { logout, clearError, setCredentials, setInitialAuthLoaded, clearUserNotFound } = authSlice.actions;
export default authSlice.reducer;
