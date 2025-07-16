import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import categoriesSlice from './slices/categoriesSlice';
import promptsSlice from './slices/promptsSlice';
import usersSlice from './slices/usersSlice';
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

