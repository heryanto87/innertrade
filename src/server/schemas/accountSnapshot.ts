import { z } from 'zod';
import { AccountSnapshotZodSchema } from '../collections/AccountSnapshot';

// Base account snapshot schema without timestamps for input operations
const baseAccountSnapshotSchema = AccountSnapshotZodSchema.omit({ createdAt: true, updatedAt: true });

// Input schemas for account snapshot operations
export const createAccountSnapshotSchema = baseAccountSnapshotSchema;

export const updateAccountSnapshotSchema = z.object({
  id: z.string().min(1, 'Account Snapshot ID is required'),
}).merge(baseAccountSnapshotSchema.partial());

export const getAccountSnapshotSchema = z.object({
  id: z.string().min(1, 'Account Snapshot ID is required'),
});

export const deleteAccountSnapshotSchema = z.object({
  id: z.string().min(1, 'Account Snapshot ID is required'),
});

export const getAccountSnapshotsByAccountSchema = z.object({
  accountId: z.string().min(1, 'Account ID is required'),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export const generateSnapshotSchema = z.object({
  accountId: z.string().min(1, 'Account ID is required'),
  date: z.date(),
});

// Output schemas
export const accountSnapshotOutputSchema = z.object({
  _id: z.string(),
}).merge(AccountSnapshotZodSchema);

export const accountSnapshotsListOutputSchema = z.array(accountSnapshotOutputSchema);

// Type exports
export type CreateAccountSnapshotInput = z.infer<typeof createAccountSnapshotSchema>;
export type UpdateAccountSnapshotInput = z.infer<typeof updateAccountSnapshotSchema>;
export type GetAccountSnapshotInput = z.infer<typeof getAccountSnapshotSchema>;
export type DeleteAccountSnapshotInput = z.infer<typeof deleteAccountSnapshotSchema>;
export type GetAccountSnapshotsByAccountInput = z.infer<typeof getAccountSnapshotsByAccountSchema>;
export type GenerateSnapshotInput = z.infer<typeof generateSnapshotSchema>;
export type AccountSnapshotOutput = z.infer<typeof accountSnapshotOutputSchema>;
export type AccountSnapshotsListOutput = z.infer<typeof accountSnapshotsListOutputSchema>;