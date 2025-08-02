import { z } from 'zod';
import { UserZodSchema } from '../collections/User';

// Base user schema without timestamps for input operations
const baseUserSchema = UserZodSchema.omit({ createdAt: true, updatedAt: true });

// Input schemas for user operations
export const createUserSchema = baseUserSchema;

export const registerUserSchema = z.object({
  email: z.string().email('Please enter a valid email').toLowerCase().trim(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required').max(100, 'Name cannot be more than 100 characters').trim().optional(),
});

export const loginUserSchema = z.object({
  email: z.string().email('Please enter a valid email').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

export const updateUserSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
}).merge(baseUserSchema.partial());

export const getUserSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
});

export const deleteUserSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
});

// Output schemas
export const userOutputSchema = z.object({
  _id: z.string(),
}).merge(UserZodSchema);

export const usersListOutputSchema = z.array(userOutputSchema);

// Type exports
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type GetUserInput = z.infer<typeof getUserSchema>;
export type DeleteUserInput = z.infer<typeof deleteUserSchema>;
export type UserOutput = z.infer<typeof userOutputSchema>;
export type UsersListOutput = z.infer<typeof usersListOutputSchema>;