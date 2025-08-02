import { createTRPCRouter, publicProcedure } from '../trpc';
import Strategy from '../../collections/Strategy';
import {
  createStrategySchema,
  updateStrategySchema,
  getStrategySchema,
  deleteStrategySchema,
  getStrategiesByUserSchema,
  strategyOutputSchema,
  strategiesListOutputSchema,
} from '../../schemas/strategy';

export const strategyRouter = createTRPCRouter({
  create: publicProcedure
    .input(createStrategySchema)
    .output(strategyOutputSchema)
    .mutation(async ({ input }) => {
      const strategy = new Strategy(input);
      const savedStrategy = await strategy.save();
      return {
        _id: savedStrategy._id.toString(),
        ...savedStrategy.toObject(),
      };
    }),

  getById: publicProcedure
    .input(getStrategySchema)
    .output(strategyOutputSchema)
    .query(async ({ input }) => {
      const strategy = await Strategy.findById(input.id);
      if (!strategy) {
        throw new Error('Strategy not found');
      }
      return {
        _id: strategy._id.toString(),
        ...strategy.toObject(),
      };
    }),

  getByUser: publicProcedure
    .input(getStrategiesByUserSchema)
    .output(strategiesListOutputSchema)
    .query(async ({ input }) => {
      const strategies = await Strategy.find({ userId: input.userId });
      return strategies.map(strategy => ({
        _id: strategy._id.toString(),
        ...strategy.toObject(),
      }));
    }),

  update: publicProcedure
    .input(updateStrategySchema)
    .output(strategyOutputSchema)
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;
      const strategy = await Strategy.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      if (!strategy) {
        throw new Error('Strategy not found');
      }
      return {
        _id: strategy._id.toString(),
        ...strategy.toObject(),
      };
    }),

  delete: publicProcedure
    .input(deleteStrategySchema)
    .output(strategyOutputSchema)
    .mutation(async ({ input }) => {
      const strategy = await Strategy.findByIdAndDelete(input.id);
      if (!strategy) {
        throw new Error('Strategy not found');
      }
      return {
        _id: strategy._id.toString(),
        ...strategy.toObject(),
      };
    }),
});