import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { submitPrompt, fetchUserPrompts } from './promptsThunks';
import { Prompt, PromptsState } from './promptsTypes';

const initialState: PromptsState = {
  prompts: [],
  currentResponse: null,
  lastPromptText: null,
  loading: false,
  error: null,
};

const promptsSlice = createSlice({
  name: 'prompts',
  initialState,
  reducers: {
    clearCurrentResponse: (state) => {
      state.currentResponse = null;
      state.lastPromptText = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitPrompt.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentResponse = null;
        state.lastPromptText = null;
      })
      .addCase(submitPrompt.fulfilled, (state, action: PayloadAction<Prompt>) => {
        state.loading = false;
        state.currentResponse = action.payload.response;
        state.lastPromptText = action.payload.prompt;
        state.prompts.unshift(action.payload);
      })
      .addCase(submitPrompt.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to submit prompt';
        state.currentResponse = null;
        state.lastPromptText = null;
      })
      .addCase(fetchUserPrompts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPrompts.fulfilled, (state, action: PayloadAction<Prompt[]>) => {
        state.loading = false;
        state.prompts = action.payload;
      })
      .addCase(fetchUserPrompts.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to fetch prompts';
      });
  },
});

export const { clearCurrentResponse } = promptsSlice.actions;
export default promptsSlice.reducer;
