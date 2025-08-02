import { createTRPCRouter } from './trpc';
import { generalRouter } from './routers/general';
import { userRouter } from './routers/user';
import { accountRouter } from './routers/account';
import { strategyRouter } from './routers/strategy';
import { tradeLogRouter } from './routers/tradeLog';
import { accountTransactionRouter } from './routers/accountTransaction';
import { accountSnapshotRouter } from './routers/accountSnapshot';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  general: generalRouter,
  user: userRouter,
  account: accountRouter,
  strategy: strategyRouter,
  tradeLog: tradeLogRouter,
  accountTransaction: accountTransactionRouter,
  accountSnapshot: accountSnapshotRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;