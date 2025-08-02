import mongoose, { Schema, Document } from 'mongoose';
import { z } from 'zod';

// Zod schema for Account validation
export const AccountZodSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  name: z.string().min(1, 'Account name is required').max(100, 'Account name cannot be more than 100 characters').trim(),
  balance: z.number().min(0, 'Balance cannot be negative'),
  positionUnit: z.enum(['usd', 'lot'], { required_error: 'Position unit must be either usd or lot' }),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Infer TypeScript type from Zod schema
export type IAccount = z.infer<typeof AccountZodSchema>;

const AccountSchema: Schema<IAccount> = new Schema<IAccount>(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Account name is required'],
      trim: true,
      maxlength: [100, 'Account name cannot be more than 100 characters'],
    },
    balance: {
      type: Number,
      required: [true, 'Balance is required'],
      min: [0, 'Balance cannot be negative'],
    },
    positionUnit: {
      type: String,
      required: [true, 'Position unit is required'],
      enum: ['usd', 'lot'],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent re-compilation during development
const Account = mongoose.models.Account || mongoose.model<IAccount>('Account', AccountSchema);

export default Account;