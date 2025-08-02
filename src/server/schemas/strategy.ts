import { z } from 'zod';
import { StrategyZodSchema } from '../collections/Strategy';

// Base strategy schema without timestamps for input operations
const baseStrategySchema = StrategyZodSchema.omit({ createdAt: true });

// Input schemas for strategy operations
export const createStrategySchema = baseStrategySchema;

export const updateStrategySchema = z.object({
  id: z.string().min(1, 'Strategy ID is required'),
}).merge(baseStrategySchema.partial());

export const getStrategySchema = z.object({
  id: z.string().min(1, 'Strategy ID is required'),
});

export const deleteStrategySchema = z.object({
  id: z.string().min(1, 'Strategy ID is required'),
});

export const getStrategiesByUserSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
});

// Output schemas
export const strategyOutputSchema = z.object({
  _id: z.string(),
}).merge(StrategyZodSchema);

export const strategiesListOutputSchema = z.array(strategyOutputSchema);

// Type exports
export type CreateStrategyInput = z.infer<typeof createStrategySchema>;
export type UpdateStrategyInput = z.infer<typeof updateStrategySchema>;
export type GetStrategyInput = z.infer<typeof getStrategySchema>;
export type DeleteStrategyInput = z.infer<typeof deleteStrategySchema>;
export type GetStrategiesByUserInput = z.infer<typeof getStrategiesByUserSchema>;
export type StrategyOutput = z.infer<typeof strategyOutputSchema>;
export type StrategiesListOutput = z.infer<typeof strategiesListOutputSchema>;