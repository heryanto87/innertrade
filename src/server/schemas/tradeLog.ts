import { z } from 'zod';
import { TradeLogZodSchema } from '../collections/TradeLog';

// Base trade log schema without timestamps and auto-calculated fields for input operations
const baseTradeLogSchema = TradeLogZodSchema.omit({ 
  createdAt: true, 
  updatedAt: true,
  direction: true,
  marginUsed: true,
  exposure: true,
  riskRewardRatio: true,
  duration: true,
  rMultiple: true,
});

// Input schemas for trade log operations
export const createTradeLogSchema = baseTradeLogSchema.omit({
  status: true,
  exitDate: true,
  pnl: true,
  result: true,
  closeImageUrls: true,
});

export const updateTradeLogSchema = z.object({
  id: z.string().min(1, 'Trade Log ID is required'),
}).merge(baseTradeLogSchema.partial());

export const closeTradeSchema = z.object({
  id: z.string().min(1, 'Trade Log ID is required'),
  exitDate: z.date(),
  pnl: z.number(),
  result: z.enum(['win', 'loss', 'breakeven', 'partial-win']),
  closeImageUrls: z.array(z.string().url('Invalid URL format')).optional(),
});

export const getTradeLogSchema = z.object({
  id: z.string().min(1, 'Trade Log ID is required'),
});

export const deleteTradeLogSchema = z.object({
  id: z.string().min(1, 'Trade Log ID is required'),
});

export const getTradeLogsByAccountSchema = z.object({
  accountId: z.string().min(1, 'Account ID is required'),
  status: z.enum(['open', 'closed', 'cancelled']).optional(),
});

export const getTradeLogsByUserSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  status: z.enum(['open', 'closed', 'cancelled']).optional(),
});

// Output schemas
export const tradeLogOutputSchema = z.object({
  _id: z.string(),
}).merge(TradeLogZodSchema);

export const tradeLogsListOutputSchema = z.array(tradeLogOutputSchema);

// Type exports
export type CreateTradeLogInput = z.infer<typeof createTradeLogSchema>;
export type UpdateTradeLogInput = z.infer<typeof updateTradeLogSchema>;
export type CloseTradeInput = z.infer<typeof closeTradeSchema>;
export type GetTradeLogInput = z.infer<typeof getTradeLogSchema>;
export type DeleteTradeLogInput = z.infer<typeof deleteTradeLogSchema>;
export type GetTradeLogsByAccountInput = z.infer<typeof getTradeLogsByAccountSchema>;
export type GetTradeLogsByUserInput = z.infer<typeof getTradeLogsByUserSchema>;
export type TradeLogOutput = z.infer<typeof tradeLogOutputSchema>;
export type TradeLogsListOutput = z.infer<typeof tradeLogsListOutputSchema>;