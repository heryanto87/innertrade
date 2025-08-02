import { createTRPCRouter, publicProcedure } from '../trpc';
import AccountTransaction from '../../collections/AccountTransaction';
import Account from '../../collections/Account';
import {
  createAccountTransactionSchema,
  updateAccountTransactionSchema,
  getAccountTransactionSchema,
  deleteAccountTransactionSchema,
  getAccountTransactionsByAccountSchema,
  accountTransactionOutputSchema,
  accountTransactionsListOutputSchema,
} from '../../schemas/accountTransaction';

export const accountTransactionRouter = createTRPCRouter({
  create: publicProcedure
    .input(createAccountTransactionSchema)
    .output(accountTransactionOutputSchema)
    .mutation(async ({ input }) => {
      // Verify account exists
      const account = await Account.findById(input.accountId);
      if (!account) {
        throw new Error('Account not found');
      }

      const transaction = new AccountTransaction(input);
      const savedTransaction = await transaction.save();

      // Update account balance
      const balanceChange = input.type === 'deposit' ? input.amount : -input.amount;
      await Account.findByIdAndUpdate(
        input.accountId,
        { $inc: { balance: balanceChange } },
        { new: true }
      );

      return {
        _id: savedTransaction._id.toString(),
        ...savedTransaction.toObject(),
      };
    }),

  getById: publicProcedure
    .input(getAccountTransactionSchema)
    .output(accountTransactionOutputSchema)
    .query(async ({ input }) => {
      const transaction = await AccountTransaction.findById(input.id)
        .populate('accountId', 'name userId');
      if (!transaction) {
        throw new Error('Account transaction not found');
      }
      return {
        _id: transaction._id.toString(),
        ...transaction.toObject(),
      };
    }),

  getByAccount: publicProcedure
    .input(getAccountTransactionsByAccountSchema)
    .output(accountTransactionsListOutputSchema)
    .query(async ({ input }) => {
      const filter: any = { accountId: input.accountId };
      
      if (input.type) {
        filter.type = input.type;
      }
      
      if (input.startDate || input.endDate) {
        filter.date = {};
        if (input.startDate) {
          filter.date.$gte = input.startDate;
        }
        if (input.endDate) {
          filter.date.$lte = input.endDate;
        }
      }

      const transactions = await AccountTransaction.find(filter)
        .populate('accountId', 'name userId')
        .sort({ date: -1 });
      
      return transactions.map(transaction => ({
        _id: transaction._id.toString(),
        ...transaction.toObject(),
      }));
    }),

  update: publicProcedure
    .input(updateAccountTransactionSchema)
    .output(accountTransactionOutputSchema)
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;
      
      // Get the original transaction to calculate balance adjustment
      const originalTransaction = await AccountTransaction.findById(id);
      if (!originalTransaction) {
        throw new Error('Account transaction not found');
      }

      const updatedTransaction = await AccountTransaction.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!updatedTransaction) {
        throw new Error('Account transaction not found');
      }

      // If amount or type changed, update account balance
      if (updateData.amount !== undefined || updateData.type !== undefined) {
        const originalBalanceChange = originalTransaction.type === 'deposit' 
          ? originalTransaction.amount 
          : -originalTransaction.amount;
        
        const newBalanceChange = updatedTransaction.type === 'deposit' 
          ? updatedTransaction.amount 
          : -updatedTransaction.amount;
        
        const balanceDifference = newBalanceChange - originalBalanceChange;
        
        await Account.findByIdAndUpdate(
          updatedTransaction.accountId,
          { $inc: { balance: balanceDifference } },
          { new: true }
        );
      }

      return {
        _id: updatedTransaction._id.toString(),
        ...updatedTransaction.toObject(),
      };
    }),

  delete: publicProcedure
    .input(deleteAccountTransactionSchema)
    .output(accountTransactionOutputSchema)
    .mutation(async ({ input }) => {
      const transaction = await AccountTransaction.findById(input.id);
      if (!transaction) {
        throw new Error('Account transaction not found');
      }

      // Reverse the balance change
      const balanceChange = transaction.type === 'deposit' 
        ? -transaction.amount 
        : transaction.amount;
      
      await Account.findByIdAndUpdate(
        transaction.accountId,
        { $inc: { balance: balanceChange } },
        { new: true }
      );

      await AccountTransaction.findByIdAndDelete(input.id);

      return {
        _id: transaction._id.toString(),
        ...transaction.toObject(),
      };
    }),
});