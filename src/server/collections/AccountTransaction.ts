import mongoose, { Schema, Document } from 'mongoose';
import { z } from 'zod';

// Zod schema for AccountTransaction validation
export const AccountTransactionZodSchema = z.object({
  accountId: z.string().min(1, 'Account ID is required'),
  type: z.enum(['deposit', 'withdrawal'], { required_error: 'Type must be either deposit or withdrawal' }),
  amount: z.number().positive('Amount must be positive'),
  date: z.date(),
  description: z.string().max(500, 'Description cannot be more than 500 characters').optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Infer TypeScript type from Zod schema
export type IAccountTransaction = z.infer<typeof AccountTransactionZodSchema>;

const AccountTransactionSchema: Schema<IAccountTransaction> = new Schema<IAccountTransaction>(
  {
    accountId: {
      type: String,
      required: [true, 'Account ID is required'],
      ref: 'Account',
    },
    type: {
      type: String,
      required: [true, 'Transaction type is required'],
      enum: ['deposit', 'withdrawal'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount must be positive'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent re-compilation during development
const AccountTransaction = mongoose.models.AccountTransaction || mongoose.model<IAccountTransaction>('AccountTransaction', AccountTransactionSchema);

export default AccountTransaction;