import mongoose, { Schema, Document } from 'mongoose';
import { z } from 'zod';

// Zod schema for AccountSnapshot validation
export const AccountSnapshotZodSchema = z.object({
  accountId: z.string().min(1, 'Account ID is required'),
  date: z.date(),
  balance: z.number().min(0, 'Balance cannot be negative'),
  dailyPnl: z.number(),
  deposits: z.number().min(0, 'Deposits cannot be negative').optional(),
  withdrawals: z.number().min(0, 'Withdrawals cannot be negative').optional(),
  notes: z.string().max(1000, 'Notes cannot be more than 1000 characters').optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Infer TypeScript type from Zod schema
export type IAccountSnapshot = z.infer<typeof AccountSnapshotZodSchema>;

const AccountSnapshotSchema: Schema<IAccountSnapshot> = new Schema<IAccountSnapshot>(
  {
    accountId: {
      type: String,
      required: [true, 'Account ID is required'],
      ref: 'Account',
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    balance: {
      type: Number,
      required: [true, 'Balance is required'],
      min: [0, 'Balance cannot be negative'],
    },
    dailyPnl: {
      type: Number,
      required: [true, 'Daily PnL is required'],
    },
    deposits: {
      type: Number,
      min: [0, 'Deposits cannot be negative'],
    },
    withdrawals: {
      type: Number,
      min: [0, 'Withdrawals cannot be negative'],
    },
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot be more than 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for accountId and date to ensure uniqueness
AccountSnapshotSchema.index({ accountId: 1, date: 1 }, { unique: true });

// Prevent re-compilation during development
const AccountSnapshot = mongoose.models.AccountSnapshot || mongoose.model<IAccountSnapshot>('AccountSnapshot', AccountSnapshotSchema);

export default AccountSnapshot;