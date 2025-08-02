import mongoose, { Schema, Document } from 'mongoose';
import { z } from 'zod';

// Zod schema for Strategy validation
export const StrategyZodSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  name: z.string().min(1, 'Strategy name is required').max(100, 'Strategy name cannot be more than 100 characters').trim(),
  description: z.string().max(1000, 'Description cannot be more than 1000 characters').optional(),
  exampleImageUrls: z.array(z.string().url('Invalid URL format')).optional(),
  createdAt: z.date(),
});

// Infer TypeScript type from Zod schema
export type IStrategy = z.infer<typeof StrategyZodSchema>;

const StrategySchema: Schema<IStrategy> = new Schema<IStrategy>(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Strategy name is required'],
      trim: true,
      maxlength: [100, 'Strategy name cannot be more than 100 characters'],
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    exampleImageUrls: {
      type: [String],
      validate: {
        validator: function(urls: string[]) {
          return urls.every(url => /^https?:\/\/.+/.test(url));
        },
        message: 'All URLs must be valid HTTP/HTTPS URLs',
      },
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Prevent re-compilation during development
const Strategy = mongoose.models.Strategy || mongoose.model<IStrategy>('Strategy', StrategySchema);

export default Strategy;