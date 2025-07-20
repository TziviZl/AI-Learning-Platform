import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from './authTypes';
import { loginUser, registerUser, updateProfile } from './authThunks';

const loadAuthFromLocalStorage = (): Omit<AuthState, 'initialLoading' | 'userNotFound'> => {
  try {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    let user = userString ? JSON.parse(userString) : null;

    if (user && typeof user.role === 'string') {
      user.role = user.role.toLowerCase() as 'user' | 'admin';
    }

    return {
      user,
      token,
      loading: false,
      error: null,
    };
  } catch (e) {
    console.error('Failed to load auth state from localStorage', e);
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
  userNotFound: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token;
      state.user = {
        ...action.payload.user,
        role: action.payload.user.role.toLowerCase() as 'user' | 'admin',
      };
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(state.user));
      state.initialLoading = false;
      state.userNotFound = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      state.userNotFound = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.initialLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearUserNotFound: (state) => {
      state.userNotFound = false;
    },
    setInitialAuthLoaded: (state) => {
      state.initialLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // loginUser cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.userNotFound = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        state.error = null;
        state.userNotFound = false;
        state.initialLoading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.token = null;
        state.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        state.error = action.payload || 'Login failed';
        state.initialLoading = false;
        state.userNotFound = action.payload === 'User not found';
      })
      // registerUser cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        state.initialLoading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.token = null;
        state.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        state.error = action.payload || 'Registration failed';
        state.initialLoading = false;
      })
      // updateProfile cases
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
        state.error = action.payload || 'Profile update failed';
        state.initialLoading = false;
      });
  },
});

export const {
  logout,
  clearError,
  setCredentials,
  setInitialAuthLoaded,
  clearUserNotFound,
} = authSlice.actions;
export default authSlice.reducer;
