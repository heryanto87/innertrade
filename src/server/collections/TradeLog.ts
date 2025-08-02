import mongoose, { Schema, Document } from 'mongoose';
import { z } from 'zod';

// Zod schema for TradeLog validation
export const TradeLogZodSchema = z.object({
  // Initial trade input fields
  symbol: z.string().min(1, 'Symbol is required').trim(),
  entryPrice: z.number().positive('Entry price must be positive'),
  stopLoss: z.number().positive('Stop loss must be positive'),
  takeProfit: z.number().positive('Take profit must be positive'),
  positionSize: z.number().positive('Position size must be positive'),
  leverage: z.number().positive('Leverage must be positive').optional(),
  openDate: z.date(),
  accountId: z.string().min(1, 'Account ID is required'),
  strategyIds: z.array(z.string()).optional(),
  entryImageUrls: z.array(z.string().url('Invalid URL format')).optional(),
  notes: z.string().max(2000, 'Notes cannot be more than 2000 characters').optional(),
  
  // Closing trade input fields
  status: z.enum(['open', 'closed', 'cancelled']).default('open'),
  exitDate: z.date().optional(),
  pnl: z.number().optional(),
  result: z.enum(['win', 'loss', 'breakeven', 'partial-win']).nullable().optional(),
  closeImageUrls: z.array(z.string().url('Invalid URL format')).optional(),
  
  // Auto-calculated fields
  direction: z.enum(['long', 'short']),
  marginUsed: z.number().optional(),
  exposure: z.number(),
  riskRewardRatio: z.number(),
  duration: z.number().optional(), // in milliseconds
  rMultiple: z.number().optional(),
  
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Infer TypeScript type from Zod schema
export type ITradeLog = z.infer<typeof TradeLogZodSchema>;

const TradeLogSchema: Schema<ITradeLog> = new Schema<ITradeLog>(
  {
    // Initial trade input fields
    symbol: {
      type: String,
      required: [true, 'Symbol is required'],
      trim: true,
    },
    entryPrice: {
      type: Number,
      required: [true, 'Entry price is required'],
      min: [0, 'Entry price must be positive'],
    },
    stopLoss: {
      type: Number,
      required: [true, 'Stop loss is required'],
      min: [0, 'Stop loss must be positive'],
    },
    takeProfit: {
      type: Number,
      required: [true, 'Take profit is required'],
      min: [0, 'Take profit must be positive'],
    },
    positionSize: {
      type: Number,
      required: [true, 'Position size is required'],
      min: [0, 'Position size must be positive'],
    },
    leverage: {
      type: Number,
      min: [1, 'Leverage must be at least 1'],
    },
    openDate: {
      type: Date,
      required: [true, 'Open date is required'],
    },
    accountId: {
      type: String,
      required: [true, 'Account ID is required'],
      ref: 'Account',
    },
    strategyIds: {
      type: [String],
      ref: 'Strategy',
    },
    entryImageUrls: {
      type: [String],
      validate: {
        validator: function(urls: string[]) {
          return urls.every(url => /^https?:\/\/.+/.test(url));
        },
        message: 'All URLs must be valid HTTP/HTTPS URLs',
      },
    },
    notes: {
      type: String,
      maxlength: [2000, 'Notes cannot be more than 2000 characters'],
    },
    
    // Closing trade input fields
    status: {
      type: String,
      enum: ['open', 'closed', 'cancelled'],
      default: 'open',
    },
    exitDate: {
      type: Date,
    },
    pnl: {
      type: Number,
    },
    result: {
      type: String,
      enum: ['win', 'loss', 'breakeven', 'partial-win'],
    },
    closeImageUrls: {
      type: [String],
      validate: {
        validator: function(urls: string[]) {
          return urls.every(url => /^https?:\/\/.+/.test(url));
        },
        message: 'All URLs must be valid HTTP/HTTPS URLs',
      },
    },
    
    // Auto-calculated fields
    direction: {
      type: String,
      enum: ['long', 'short'],
      required: true,
    },
    marginUsed: {
      type: Number,
    },
    exposure: {
      type: Number,
      required: true,
    },
    riskRewardRatio: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number, // in milliseconds
    },
    rMultiple: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to calculate auto-calculated fields
TradeLogSchema.pre('save', function(next) {
  // Calculate direction
  this.direction = this.takeProfit > this.entryPrice ? 'long' : 'short';
  
  // Calculate exposure
  this.exposure = this.positionSize * this.entryPrice;
  
  // Calculate margin used (if leverage is provided)
  if (this.leverage) {
    this.marginUsed = this.exposure / this.leverage;
  }
  
  // Calculate risk-reward ratio
  const risk = Math.abs(this.entryPrice - this.stopLoss);
  const reward = Math.abs(this.takeProfit - this.entryPrice);
  this.riskRewardRatio = reward / risk;
  
  // Calculate duration (if exitDate is provided)
  if (this.exitDate && this.openDate) {
    this.duration = this.exitDate.getTime() - this.openDate.getTime();
  }
  
  // Calculate R-multiple (if pnl is provided)
  if (this.pnl !== undefined) {
    const initialRisk = Math.abs(this.entryPrice - this.stopLoss) * this.positionSize;
    this.rMultiple = this.pnl / initialRisk;
  }
  
  next();
});

// Prevent re-compilation during development
const TradeLog = mongoose.models.TradeLog || mongoose.model<ITradeLog>('TradeLog', TradeLogSchema);

export default TradeLog;