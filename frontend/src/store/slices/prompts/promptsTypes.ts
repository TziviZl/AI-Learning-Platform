export interface Prompt {
  id: number;
  userId: number;
  categoryId: number;
  subCategoryId: number;
  prompt: string;
  response: string;
  createdAt: string;
}

export interface PromptsState {
  prompts: Prompt[];
  currentResponse: string | null;
  lastPromptText: string | null;
  loading: boolean;
  error: string | null;
}
