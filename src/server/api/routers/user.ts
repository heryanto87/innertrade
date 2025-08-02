import { createTRPCRouter, publicProcedure } from '../trpc';
import {
  createUserSchema,
  registerUserSchema,
  loginUserSchema,
  updateUserSchema,
  getUserSchema,
  deleteUserSchema,
  userOutputSchema,
  usersListOutputSchema,
} from '../../schemas/user';
import User from '../../collections/User';
import { TRPCError } from '@trpc/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

export const userRouter = createTRPCRouter({
  // Register a new user
  register: publicProcedure
    .meta({ description: 'Register a new user with email and password. Email must be unique.' })
    .input(registerUserSchema)
    .output(userOutputSchema)
    .mutation(async ({ input }) => {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: input.email });
        if (existingUser) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'User with this email already exists',
          });
        }

        // Hash password
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(input.password, saltRounds);

        const user = new User({
          email: input.email,
          passwordHash,
          name: input.name,
          role: 'user',
        });
        const savedUser = await user.save();
        return {
          _id: savedUser._id.toString(),
          email: savedUser.email,
          passwordHash: savedUser.passwordHash,
          name: savedUser.name,
          avatarUrl: savedUser.avatarUrl,
          role: savedUser.role,
          createdAt: savedUser.createdAt,
          updatedAt: savedUser.updatedAt,
        };
      } catch (error: unknown) {
        if (error instanceof TRPCError) {
          throw error;
        }
        if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'User with this email already exists',
          });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create user',
        });
      }
    }),

  // Login user
  login: publicProcedure
    .meta({ description: 'Authenticate user with email and password.' })
    .input(loginUserSchema)
    .output(userOutputSchema)
    .mutation(async ({ input }) => {
      try {
        const user = await User.findOne({ email: input.email });
        if (!user) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Invalid email or password',
          });
        }

        const isValidPassword = await bcrypt.compare(input.password, user.passwordHash);
        if (!isValidPassword) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Invalid email or password',
          });
        }

        return {
          _id: user._id.toString(),
          email: user.email,
          passwordHash: user.passwordHash,
          name: user.name,
          avatarUrl: user.avatarUrl,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      } catch (error: unknown) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to authenticate user',
        });
      }
    }),

  // Create a new user (admin function)
  create: publicProcedure
    .meta({ description: 'Create a new user with all fields. Admin function.' })
    .input(createUserSchema)
    .output(userOutputSchema)
    .mutation(async ({ input }) => {
      try {
        const user = new User(input);
        const savedUser = await user.save();
        return {
          _id: savedUser._id.toString(),
          email: savedUser.email,
          passwordHash: savedUser.passwordHash,
          name: savedUser.name,
          avatarUrl: savedUser.avatarUrl,
          role: savedUser.role,
          createdAt: savedUser.createdAt,
          updatedAt: savedUser.updatedAt,
        };
      } catch (error: unknown) {
        if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'User with this email already exists',
          });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create user',
        });
      }
    }),

  // Get all users
  getAll: publicProcedure
    .meta({ description: 'Retrieve all users from the database, sorted by creation date (newest first).' })
    .output(usersListOutputSchema)
    .query(async () => {
      try {
        const users = await User.find({}).sort({ createdAt: -1 });
        return users.map(user => ({
          _id: user._id.toString(),
          email: user.email,
          passwordHash: user.passwordHash,
          name: user.name,
          avatarUrl: user.avatarUrl,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }));
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch users',
        });
      }
    }),

  // Get user by ID
  getById: publicProcedure
    .meta({ description: 'Retrieve a specific user by their unique ID.' })
    .input(getUserSchema)
    .output(userOutputSchema)
    .query(async ({ input }) => {
      try {
        const user = await User.findById(input.id);
        if (!user) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          });
        }
        return {
          _id: user._id.toString(),
          email: user.email,
          passwordHash: user.passwordHash,
          name: user.name,
          avatarUrl: user.avatarUrl,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      } catch (error: unknown) {
        if (error instanceof TRPCError && error.code === 'NOT_FOUND') {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch user',
        });
      }
    }),

  // Update user
  update: publicProcedure
    .meta({ description: 'Update an existing user\'s information. All fields are optional except ID.' })
    .input(updateUserSchema)
    .output(userOutputSchema)
    .mutation(async ({ input }) => {
      try {
        const { id, ...updateData } = input;
        const user = await User.findByIdAndUpdate(
          id,
          updateData,
          { new: true, runValidators: true }
        );
        if (!user) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          });
        }
        return {
          _id: user._id.toString(),
          email: user.email,
          passwordHash: user.passwordHash,
          name: user.name,
          avatarUrl: user.avatarUrl,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      } catch (error: unknown) {
        if (error instanceof TRPCError && error.code === 'NOT_FOUND') {
          throw error;
        }
        if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'User with this email already exists',
          });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update user',
        });
      }
    }),

  // Delete user
  delete: publicProcedure
    .meta({ description: 'Permanently delete a user from the database by their ID.' })
    .input(deleteUserSchema)
    .output(userOutputSchema)
    .mutation(async ({ input }) => {
      try {
        const user = await User.findByIdAndDelete(input.id);
        if (!user) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          });
        }
        return {
          _id: user._id.toString(),
          email: user.email,
          passwordHash: user.passwordHash,
          name: user.name,
          avatarUrl: user.avatarUrl,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      } catch (error: unknown) {
        if (error instanceof TRPCError && error.code === 'NOT_FOUND') {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete user',
        });
      }
    }),
});