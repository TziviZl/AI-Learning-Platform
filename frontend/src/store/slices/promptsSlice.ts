import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../utils/api';

// ממשק Prompt מתוקן כדי להתאים לתגובת ה-API
interface Prompt {
    id: number;
    userId: number;
    categoryId: number;
    subCategoryId: number;
    prompt: string;   // השתנה מ-promptText ל-prompt
    response: string; // השתנה מ-responseText ל-response
    createdAt: string;
}

interface PromptsState {
    prompts: Prompt[];
    currentResponse: string | null;
    lastPromptText: string | null; // נשאר promptText עבור ה-frontend, נמיר אותו ב-slice
    loading: boolean;
    error: string | null;
}

const initialState: PromptsState = {
    prompts: [],
    currentResponse: null,
    lastPromptText: null,
    loading: false,
    error: null,
};

export const submitPrompt = createAsyncThunk<
    Prompt, // ה-thunk עדיין יחזיר את המבנה של Prompt מה-API
    { userId: number; categoryId: number; subCategoryId: number; promptText: string },
    { rejectValue: string }
>(
    'prompts/submit',
    async (promptData, { rejectWithValue }) => {
        try {
            // שים לב: ה-API מקבל promptText אבל מחזיר prompt.
            // אם ה-API שלך מצפה ל-prompt בשליחה, תצטרך לשנות את promptData.promptText ל-promptData.prompt
            // אבל לפי מה שהצגת, הוא מקבל promptText.
            // התגובה מה-API צריכה להיות עם prompt ו-response
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
            // המרה של השדות בתגובה כדי שיתאימו לממשק Prompt
            const fetchedPrompts: Prompt[] = response.data.map((p: any) => ({
                id: p.id,
                userId: p.userId,
                categoryId: p.categoryId,
                subCategoryId: p.subCategoryId,
                prompt: p.prompt, // השדה prompt מה-API
                response: p.response, // השדה response מה-API
                createdAt: p.createdAt
            }));
            return fetchedPrompts;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch prompts');
        }
    }
);

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
                state.currentResponse = action.payload.response; // גישה ל-action.payload.response
                state.lastPromptText = action.payload.prompt;   // גישה ל-action.payload.prompt
                state.prompts.unshift(action.payload);
            })
            .addCase(submitPrompt.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to submit prompt';
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
                state.error = action.payload as string || 'Failed to fetch prompts';
            });
    },
});

export const { clearCurrentResponse } = promptsSlice.actions;
export default promptsSlice.reducer;