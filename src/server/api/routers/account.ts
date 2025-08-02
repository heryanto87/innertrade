import { createTRPCRouter, publicProcedure } from '../trpc';
import Account from '../../collections/Account';
import {
  createAccountSchema,
  updateAccountSchema,
  getAccountSchema,
  deleteAccountSchema,
  getAccountsByUserSchema,
  accountOutputSchema,
  accountsListOutputSchema,
} from '../../schemas/account';

export const accountRouter = createTRPCRouter({
  create: publicProcedure
    .input(createAccountSchema)
    .output(accountOutputSchema)
    .mutation(async ({ input }) => {
      const account = new Account(input);
      const savedAccount = await account.save();
      return {
        _id: savedAccount._id.toString(),
        ...savedAccount.toObject(),
      };
    }),

  getById: publicProcedure
    .input(getAccountSchema)
    .output(accountOutputSchema)
    .query(async ({ input }) => {
      const account = await Account.findById(input.id);
      if (!account) {
        throw new Error('Account not found');
      }
      return {
        _id: account._id.toString(),
        ...account.toObject(),
      };
    }),

  getByUser: publicProcedure
    .input(getAccountsByUserSchema)
    .output(accountsListOutputSchema)
    .query(async ({ input }) => {
      const accounts = await Account.find({ userId: input.userId });
      return accounts.map(account => ({
        _id: account._id.toString(),
        ...account.toObject(),
      }));
    }),

  update: publicProcedure
    .input(updateAccountSchema)
    .output(accountOutputSchema)
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;
      const account = await Account.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      if (!account) {
        throw new Error('Account not found');
      }
      return {
        _id: account._id.toString(),
        ...account.toObject(),
      };
    }),

  delete: publicProcedure
    .input(deleteAccountSchema)
    .output(accountOutputSchema)
    .mutation(async ({ input }) => {
      const account = await Account.findByIdAndDelete(input.id);
      if (!account) {
        throw new Error('Account not found');
      }
      return {
        _id: account._id.toString(),
        ...account.toObject(),
      };
    }),
});