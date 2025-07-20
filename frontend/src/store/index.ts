import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/auth/authSlice';
import categoriesSlice from './slices/categories/categoriesSlice';
import promptsSlice from './slices/prompts/promptsSlice';
import usersSlice from './slices/users/usersSlice';
import { useDispatch } from 'react-redux';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    categories: categoriesSlice,
    prompts: promptsSlice,
    users: usersSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

