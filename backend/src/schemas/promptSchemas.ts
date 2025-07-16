import { z } from 'zod';

export const createPromptSchema = z.object({
  userId: z.number().int().positive('userId must be a positive integer'),
  categoryId: z.number().int().positive('categoryId must be a positive integer'),
  subCategoryId: z.number().int().positive('subCategoryId must be a positive integer'),
  promptText: z.string().min(1, 'Prompt text cannot be empty'), 
});

export type CreatePromptInput = z.infer<typeof createPromptSchema>;
