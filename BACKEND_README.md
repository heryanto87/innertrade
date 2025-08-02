# 🚀 InnerTrade Backend System

A complete trading journal backend system built with Next.js, tRPC, MongoDB, and TypeScript. This system provides comprehensive APIs for managing users, accounts, strategies, trade logs, transactions, and account snapshots.

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Models](#models)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
- [Environment Setup](#environment-setup)
- [Usage Examples](#usage-examples)

## ✨ Features

### Core Functionality
- **User Management**: Registration, authentication with bcrypt password hashing
- **Account Management**: Multi-account support with position unit preferences (USD/LOT)
- **Strategy Management**: Trading strategy definitions with optional example images
- **Trade Logging**: Comprehensive trade tracking with auto-calculated metrics
- **Transaction Tracking**: Deposits and withdrawals with automatic balance updates
- **Account Snapshots**: Daily performance tracking for PnL analysis

### Advanced Features
- **Auto-calculated Trade Metrics**: Direction, exposure, risk-reward ratio, R-multiple
- **Balance Management**: Automatic account balance updates from transactions
- **Snapshot Generation**: Automated daily account performance snapshots
- **Data Validation**: Comprehensive Zod schema validation
- **Type Safety**: Full TypeScript support with inferred types

## 🏗️ Architecture

```
src/server/
├── api/
│   ├── routers/          # tRPC routers grouped by domain
│   │   ├── user.ts       # User authentication & management
│   │   ├── account.ts    # Account management
│   │   ├── strategy.ts   # Trading strategies
│   │   ├── tradeLog.ts   # Trade logging & tracking
│   │   ├── accountTransaction.ts  # Deposits & withdrawals
│   │   └── accountSnapshot.ts     # Daily performance snapshots
│   ├── root.ts           # Router aggregation
│   └── trpc.ts           # tRPC setup & configuration
├── collections/          # Mongoose model definitions
│   ├── User.ts
│   ├── Account.ts
│   ├── Strategy.ts
│   ├── TradeLog.ts
│   ├── AccountTransaction.ts
│   └── AccountSnapshot.ts
├── schemas/              # Zod validation schemas
│   ├── user.ts
│   ├── account.ts
│   ├── strategy.ts
│   ├── tradeLog.ts
│   ├── accountTransaction.ts
│   └── accountSnapshot.ts
└── mongoose.ts           # MongoDB connection
```

## 📊 Models

### User Model
- **Authentication**: Email/password with bcrypt hashing
- **Profile**: Optional name, avatar, role (user/admin)
- **Security**: Secure password storage and validation

### Account Model
- **Multi-account Support**: Users can have multiple trading accounts
- **Position Units**: Configurable position sizing (USD or LOT)
- **Balance Tracking**: Real-time balance updates from transactions

### Strategy Model
- **Strategy Definitions**: Named trading strategies with descriptions
- **Visual Examples**: Optional example images for pattern recognition
- **User-specific**: Each user manages their own strategies

### TradeLog Model
- **Comprehensive Tracking**: Entry/exit data, PnL, images, notes
- **Auto-calculations**: Direction, exposure, risk-reward, R-multiple
- **Status Management**: Open, closed, cancelled trade states
- **Multi-strategy Support**: Link trades to multiple strategies

### AccountTransaction Model
- **Transaction Types**: Deposits and withdrawals
- **Balance Integration**: Automatic account balance updates
- **Audit Trail**: Complete transaction history with descriptions

### AccountSnapshot Model
- **Daily Performance**: End-of-day account state capture
- **PnL Tracking**: Daily profit/loss calculations
- **Chart Data**: Balance growth tracking for visualization
- **Transaction Integration**: Includes deposits/withdrawals in calculations

## 🔌 API Endpoints

### User Router (`/api/trpc/user`)
- `register` - Register new user with email/password
- `login` - Authenticate user credentials
- `create` - Admin function to create users
- `getAll` - Retrieve all users
- `getById` - Get user by ID
- `update` - Update user information
- `delete` - Delete user account

### Account Router (`/api/trpc/account`)
- `create` - Create new trading account
- `getById` - Get account details
- `getByUser` - Get all accounts for a user
- `update` - Update account information
- `delete` - Delete account

### Strategy Router (`/api/trpc/strategy`)
- `create` - Create new trading strategy
- `getById` - Get strategy details
- `getByUser` - Get all strategies for a user
- `update` - Update strategy information
- `delete` - Delete strategy

### TradeLog Router (`/api/trpc/tradeLog`)
- `create` - Log new trade entry
- `getById` - Get trade details with populated references
- `getByAccount` - Get trades for specific account
- `getByUser` - Get all trades for a user
- `update` - Update trade information
- `closeTrade` - Close trade with exit data
- `delete` - Delete trade log

### AccountTransaction Router (`/api/trpc/accountTransaction`)
- `create` - Record deposit/withdrawal (auto-updates balance)
- `getById` - Get transaction details
- `getByAccount` - Get transactions for account with filtering
- `update` - Update transaction (adjusts balance)
- `delete` - Delete transaction (reverses balance change)

### AccountSnapshot Router (`/api/trpc/accountSnapshot`)
- `create` - Manually create snapshot
- `generateSnapshot` - Auto-generate snapshot for specific date
- `getById` - Get snapshot details
- `getByAccount` - Get snapshots for account with date filtering
- `update` - Update snapshot data
- `delete` - Delete snapshot

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB database
- pnpm package manager

### Installation

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Set up environment variables**:
   Create `.env.local` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/innertrade
   ```

3. **Start development server**:
   ```bash
   pnpm dev
   ```

4. **Access the API**:
   - Application: http://localhost:3000
   - tRPC Panel: http://localhost:3000/api/panel (if configured)

## 🔧 Environment Setup

### Required Environment Variables

```env
# Database
MONGODB_URI=mongodb://localhost:27017/innertrade

# Optional: For production
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### MongoDB Setup

1. **Local MongoDB**:
   ```bash
   # Install MongoDB locally or use Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

2. **MongoDB Atlas** (Cloud):
   - Create account at https://cloud.mongodb.com
   - Create cluster and get connection string
   - Update MONGODB_URI in environment variables

## 💡 Usage Examples

### User Registration
```typescript
const user = await trpc.user.register.mutate({
  email: "trader@example.com",
  password: "securepassword123",
  name: "John Trader"
});
```

### Create Trading Account
```typescript
const account = await trpc.account.create.mutate({
  userId: user._id,
  name: "Binance Futures",
  balance: 10000,
  positionUnit: "usd"
});
```

### Log a Trade
```typescript
const trade = await trpc.tradeLog.create.mutate({
  symbol: "BTCUSDT",
  entryPrice: 45000,
  stopLoss: 44000,
  takeProfit: 47000,
  positionSize: 0.1,
  leverage: 10,
  openDate: new Date(),
  accountId: account._id,
  notes: "Bullish breakout pattern"
});
```

### Close a Trade
```typescript
const closedTrade = await trpc.tradeLog.closeTrade.mutate({
  id: trade._id,
  exitDate: new Date(),
  pnl: 200,
  result: "win"
});
```

### Generate Daily Snapshot
```typescript
const snapshot = await trpc.accountSnapshot.generateSnapshot.mutate({
  accountId: account._id,
  date: new Date()
});
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **Input Validation**: Comprehensive Zod schema validation
- **Type Safety**: Full TypeScript coverage
- **Error Handling**: Structured error responses
- **Data Integrity**: Mongoose schema validation

## 📈 Performance Features

- **Database Indexing**: Optimized queries with compound indexes
- **Connection Pooling**: Efficient MongoDB connection management
- **Caching**: Global mongoose connection caching
- **Validation**: Client and server-side validation

## 🧪 Testing

The backend system is ready for testing with:
- All models properly defined with validation
- Complete CRUD operations for all entities
- Auto-calculated fields and business logic
- Proper error handling and type safety

## 📝 Notes

- All monetary values are stored as numbers (not strings)
- Dates are stored as JavaScript Date objects
- Image URLs are validated for proper HTTP/HTTPS format
- Account balances are automatically updated with transactions
- Trade metrics are auto-calculated on save
- Snapshots prevent duplicate entries for the same date

---

**Built with ❤️ using Next.js, tRPC, MongoDB, and TypeScript**