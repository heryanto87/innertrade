import mongoose, { Schema, Document } from 'mongoose';
import { z } from 'zod';

// Zod schema for User validation
export const UserZodSchema = z.object({
  email: z.string().email('Please enter a valid email').toLowerCase().trim(),
  passwordHash: z.string().min(1, 'Password hash is required'),
  name: z.string().min(1, 'Name is required').max(100, 'Name cannot be more than 100 characters').trim().optional(),
  avatarUrl: z.string().url('Invalid URL format').optional(),
  role: z.enum(['user', 'admin']).default('user').optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Infer TypeScript type from Zod schema
export type IUser = z.infer<typeof UserZodSchema>;

const UserSchema: Schema<IUser> = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
    },
    name: {
      type: String,
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    avatarUrl: {
      type: String,
      validate: {
        validator: function(url: string) {
          return /^https?:\/\/.+/.test(url);
        },
        message: 'Avatar URL must be a valid HTTP/HTTPS URL',
      },
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent re-compilation during development
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;