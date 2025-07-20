import { createAsyncThunk } from '@reduxjs/toolkit';
import { Prompt } from './promptsTypes';
import { api } from '../../../utils/api';

export const submitPrompt = createAsyncThunk<
  Prompt,
  { userId: number; categoryId: number; subCategoryId: number; promptText: string },
  { rejectValue: string }
>(
  'prompts/submit',
  async (promptData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/prompts', promptData);
      return response.data as Prompt;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit prompt');
    }
  }
);

export const fetchUserPrompts = createAsyncThunk<
  Prompt[],
  number,
  { rejectValue: string }
>(
  'prompts/fetchUserPrompts',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/users/${userId}/prompts`);
      const fetchedPrompts: Prompt[] = response.data.map((p: any) => ({
        id: p.id,
        userId: p.userId,
        categoryId: p.categoryId,
        subCategoryId: p.subCategoryId,
        prompt: p.prompt,
        response: p.response,
        createdAt: p.createdAt,
      }));
      return fetchedPrompts;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch prompts');
    }
  }
);
