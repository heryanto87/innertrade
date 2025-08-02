import { createTRPCRouter, publicProcedure } from '../trpc';
import AccountSnapshot from '../../collections/AccountSnapshot';
import Account from '../../collections/Account';
import AccountTransaction from '../../collections/AccountTransaction';
import TradeLog from '../../collections/TradeLog';
import {
  createAccountSnapshotSchema,
  updateAccountSnapshotSchema,
  getAccountSnapshotSchema,
  deleteAccountSnapshotSchema,
  getAccountSnapshotsByAccountSchema,
  generateSnapshotSchema,
  accountSnapshotOutputSchema,
  accountSnapshotsListOutputSchema,
} from '../../schemas/accountSnapshot';

export const accountSnapshotRouter = createTRPCRouter({
  create: publicProcedure
    .input(createAccountSnapshotSchema)
    .output(accountSnapshotOutputSchema)
    .mutation(async ({ input }) => {
      // Verify account exists
      const account = await Account.findById(input.accountId);
      if (!account) {
        throw new Error('Account not found');
      }

      const snapshot = new AccountSnapshot(input);
      const savedSnapshot = await snapshot.save();
      return {
        _id: savedSnapshot._id.toString(),
        ...savedSnapshot.toObject(),
      };
    }),

  generateSnapshot: publicProcedure
    .input(generateSnapshotSchema)
    .output(accountSnapshotOutputSchema)
    .mutation(async ({ input }) => {
      const { accountId, date } = input;
      
      // Verify account exists
      const account = await Account.findById(accountId);
      if (!account) {
        throw new Error('Account not found');
      }

      // Check if snapshot already exists for this date
      const existingSnapshot = await AccountSnapshot.findOne({
        accountId,
        date: {
          $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          $lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
        },
      });

      if (existingSnapshot) {
        throw new Error('Snapshot already exists for this date');
      }

      // Calculate daily PnL from closed trades on this date
      const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
      
      const closedTrades = await TradeLog.find({
        accountId,
        status: 'closed',
        exitDate: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      });

      const dailyPnl = closedTrades.reduce((total, trade) => {
        return total + (trade.pnl || 0);
      }, 0);

      // Calculate deposits and withdrawals for this date
      const transactions = await AccountTransaction.find({
        accountId,
        date: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      });

      const deposits = transactions
        .filter(t => t.type === 'deposit')
        .reduce((total, t) => total + t.amount, 0);
      
      const withdrawals = transactions
        .filter(t => t.type === 'withdrawal')
        .reduce((total, t) => total + t.amount, 0);

      // Get previous day's balance
      const previousSnapshot = await AccountSnapshot.findOne({
        accountId,
        date: { $lt: startOfDay },
      }).sort({ date: -1 });

      const previousBalance = previousSnapshot ? previousSnapshot.balance : 0;
      const currentBalance = previousBalance + deposits - withdrawals + dailyPnl;

      const snapshotData = {
        accountId,
        date,
        balance: currentBalance,
        dailyPnl,
        deposits: deposits > 0 ? deposits : undefined,
        withdrawals: withdrawals > 0 ? withdrawals : undefined,
      };

      const snapshot = new AccountSnapshot(snapshotData);
      const savedSnapshot = await snapshot.save();
      
      return {
        _id: savedSnapshot._id.toString(),
        ...savedSnapshot.toObject(),
      };
    }),

  getById: publicProcedure
    .input(getAccountSnapshotSchema)
    .output(accountSnapshotOutputSchema)
    .query(async ({ input }) => {
      const snapshot = await AccountSnapshot.findById(input.id)
        .populate('accountId', 'name userId');
      if (!snapshot) {
        throw new Error('Account snapshot not found');
      }
      return {
        _id: snapshot._id.toString(),
        ...snapshot.toObject(),
      };
    }),

  getByAccount: publicProcedure
    .input(getAccountSnapshotsByAccountSchema)
    .output(accountSnapshotsListOutputSchema)
    .query(async ({ input }) => {
      const filter: any = { accountId: input.accountId };
      
      if (input.startDate || input.endDate) {
        filter.date = {};
        if (input.startDate) {
          filter.date.$gte = input.startDate;
        }
        if (input.endDate) {
          filter.date.$lte = input.endDate;
        }
      }

      const snapshots = await AccountSnapshot.find(filter)
        .populate('accountId', 'name userId')
        .sort({ date: 1 }); // Sort by date ascending for chart data
      
      return snapshots.map(snapshot => ({
        _id: snapshot._id.toString(),
        ...snapshot.toObject(),
      }));
    }),

  update: publicProcedure
    .input(updateAccountSnapshotSchema)
    .output(accountSnapshotOutputSchema)
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;
      const snapshot = await AccountSnapshot.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      if (!snapshot) {
        throw new Error('Account snapshot not found');
      }
      return {
        _id: snapshot._id.toString(),
        ...snapshot.toObject(),
      };
    }),

  delete: publicProcedure
    .input(deleteAccountSnapshotSchema)
    .output(accountSnapshotOutputSchema)
    .mutation(async ({ input }) => {
      const snapshot = await AccountSnapshot.findByIdAndDelete(input.id);
      if (!snapshot) {
        throw new Error('Account snapshot not found');
      }
      return {
        _id: snapshot._id.toString(),
        ...snapshot.toObject(),
      };
    }),
});