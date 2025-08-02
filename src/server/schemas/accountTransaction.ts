import { z } from 'zod';
import { AccountTransactionZodSchema } from '../collections/AccountTransaction';

// Base account transaction schema without timestamps for input operations
const baseAccountTransactionSchema = AccountTransactionZodSchema.omit({ createdAt: true, updatedAt: true });

// Input schemas for account transaction operations
export const createAccountTransactionSchema = baseAccountTransactionSchema;

export const updateAccountTransactionSchema = z.object({
  id: z.string().min(1, 'Account Transaction ID is required'),
}).merge(baseAccountTransactionSchema.partial());

export const getAccountTransactionSchema = z.object({
  id: z.string().min(1, 'Account Transaction ID is required'),
});

export const deleteAccountTransactionSchema = z.object({
  id: z.string().min(1, 'Account Transaction ID is required'),
});

export const getAccountTransactionsByAccountSchema = z.object({
  accountId: z.string().min(1, 'Account ID is required'),
  type: z.enum(['deposit', 'withdrawal']).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

// Output schemas
export const accountTransactionOutputSchema = z.object({
  _id: z.string(),
}).merge(AccountTransactionZodSchema);

export const accountTransactionsListOutputSchema = z.array(accountTransactionOutputSchema);

// Type exports
export type CreateAccountTransactionInput = z.infer<typeof createAccountTransactionSchema>;
export type UpdateAccountTransactionInput = z.infer<typeof updateAccountTransactionSchema>;
export type GetAccountTransactionInput = z.infer<typeof getAccountTransactionSchema>;
export type DeleteAccountTransactionInput = z.infer<typeof deleteAccountTransactionSchema>;
export type GetAccountTransactionsByAccountInput = z.infer<typeof getAccountTransactionsByAccountSchema>;
export type AccountTransactionOutput = z.infer<typeof accountTransactionOutputSchema>;
export type AccountTransactionsListOutput = z.infer<typeof accountTransactionsListOutputSchema>;