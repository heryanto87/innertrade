import { z } from 'zod';
import { AccountZodSchema } from '../collections/Account';

// Base account schema without timestamps for input operations
const baseAccountSchema = AccountZodSchema.omit({ createdAt: true, updatedAt: true });

// Input schemas for account operations
export const createAccountSchema = baseAccountSchema;

export const updateAccountSchema = z.object({
  id: z.string().min(1, 'Account ID is required'),
}).merge(baseAccountSchema.partial());

export const getAccountSchema = z.object({
  id: z.string().min(1, 'Account ID is required'),
});

export const deleteAccountSchema = z.object({
  id: z.string().min(1, 'Account ID is required'),
});

export const getAccountsByUserSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
});

// Output schemas
export const accountOutputSchema = z.object({
  _id: z.string(),
}).merge(AccountZodSchema);

export const accountsListOutputSchema = z.array(accountOutputSchema);

// Type exports
export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;
export type GetAccountInput = z.infer<typeof getAccountSchema>;
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
export type GetAccountsByUserInput = z.infer<typeof getAccountsByUserSchema>;
export type AccountOutput = z.infer<typeof accountOutputSchema>;
export type AccountsListOutput = z.infer<typeof accountsListOutputSchema>;