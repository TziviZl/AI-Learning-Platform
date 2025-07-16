import { z } from 'zod';

// Schema for user registration
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long.'),
  phone: z.string().regex(/^05\d{8}$/, 'Invalid Israeli phone number format (e.g., 05X1234567).'),
  password: z.string().min(6, 'Password must be at least 6 characters long.'),
});

// Schema for user login
export const loginSchema = z.object({
  phone: z.string().regex(/^05\d{8}$/, 'Invalid Israeli phone number format.'),
  password: z.string().min(6, 'Password must be at least 6 characters long.'),
});

// Schema for updating user profile 
export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long.').optional(),
  currentPassword: z.string().min(6, 'Current password must be at least 6 characters long.').optional(),
  newPassword: z.string().min(6, 'New password must be at least 6 characters long.').optional(),
}).refine(data => {
  // If newPassword is provided, currentPassword must also be provided
  if (data.newPassword && !data.currentPassword) {
    return false; 
  }
  return true;
}, {
  message: 'Current password is required when setting a new password.',
  path: ['currentPassword'], 
});


export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const adminUpdateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long.').optional(),
  phone: z.string().regex(/^05\d{8}$/, 'Invalid Israeli phone number format (e.g., 05X1234567).').optional(),
  role: z.enum(['USER', 'ADMIN']).optional(), 
});

export type AdminUpdateUserInput = z.infer<typeof adminUpdateUserSchema>;
