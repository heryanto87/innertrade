import { createTRPCRouter, publicProcedure } from '../trpc';
import TradeLog from '../../collections/TradeLog';
import Account from '../../collections/Account';
import {
  createTradeLogSchema,
  updateTradeLogSchema,
  closeTradeSchema,
  getTradeLogSchema,
  deleteTradeLogSchema,
  getTradeLogsByAccountSchema,
  getTradeLogsByUserSchema,
  tradeLogOutputSchema,
  tradeLogsListOutputSchema,
} from '../../schemas/tradeLog';

export const tradeLogRouter = createTRPCRouter({
  create: publicProcedure
    .input(createTradeLogSchema)
    .output(tradeLogOutputSchema)
    .mutation(async ({ input }) => {
      // Verify account exists
      const account = await Account.findById(input.accountId);
      if (!account) {
        throw new Error('Account not found');
      }

      const tradeLog = new TradeLog({
        ...input,
        status: 'open',
      });
      const savedTradeLog = await tradeLog.save();
      return {
        _id: savedTradeLog._id.toString(),
        ...savedTradeLog.toObject(),
      };
    }),

  getById: publicProcedure
    .input(getTradeLogSchema)
    .output(tradeLogOutputSchema)
    .query(async ({ input }) => {
      const tradeLog = await TradeLog.findById(input.id)
        .populate('accountId', 'name userId')
        .populate('strategyIds', 'name');
      if (!tradeLog) {
        throw new Error('Trade log not found');
      }
      return {
        _id: tradeLog._id.toString(),
        ...tradeLog.toObject(),
      };
    }),

  getByAccount: publicProcedure
    .input(getTradeLogsByAccountSchema)
    .output(tradeLogsListOutputSchema)
    .query(async ({ input }) => {
      const filter: any = { accountId: input.accountId };
      if (input.status) {
        filter.status = input.status;
      }

      const tradeLogs = await TradeLog.find(filter)
        .populate('accountId', 'name userId')
        .populate('strategyIds', 'name')
        .sort({ openDate: -1 });
      
      return tradeLogs.map(tradeLog => ({
        _id: tradeLog._id.toString(),
        ...tradeLog.toObject(),
      }));
    }),

  getByUser: publicProcedure
    .input(getTradeLogsByUserSchema)
    .output(tradeLogsListOutputSchema)
    .query(async ({ input }) => {
      // First get all accounts for the user
      const accounts = await Account.find({ userId: input.userId });
      const accountIds = accounts.map(account => account._id.toString());

      const filter: any = { accountId: { $in: accountIds } };
      if (input.status) {
        filter.status = input.status;
      }

      const tradeLogs = await TradeLog.find(filter)
        .populate('accountId', 'name userId')
        .populate('strategyIds', 'name')
        .sort({ openDate: -1 });
      
      return tradeLogs.map(tradeLog => ({
        _id: tradeLog._id.toString(),
        ...tradeLog.toObject(),
      }));
    }),

  update: publicProcedure
    .input(updateTradeLogSchema)
    .output(tradeLogOutputSchema)
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;
      const tradeLog = await TradeLog.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      if (!tradeLog) {
        throw new Error('Trade log not found');
      }
      return {
        _id: tradeLog._id.toString(),
        ...tradeLog.toObject(),
      };
    }),

  closeTrade: publicProcedure
    .input(closeTradeSchema)
    .output(tradeLogOutputSchema)
    .mutation(async ({ input }) => {
      const { id, ...closeData } = input;
      const tradeLog = await TradeLog.findByIdAndUpdate(
        id,
        {
          ...closeData,
          status: 'closed',
        },
        { new: true, runValidators: true }
      );
      if (!tradeLog) {
        throw new Error('Trade log not found');
      }
      return {
        _id: tradeLog._id.toString(),
        ...tradeLog.toObject(),
      };
    }),

  delete: publicProcedure
    .input(deleteTradeLogSchema)
    .output(tradeLogOutputSchema)
    .mutation(async ({ input }) => {
      const tradeLog = await TradeLog.findByIdAndDelete(input.id);
      if (!tradeLog) {
        throw new Error('Trade log not found');
      }
      return {
        _id: tradeLog._id.toString(),
        ...tradeLog.toObject(),
      };
    }),
});