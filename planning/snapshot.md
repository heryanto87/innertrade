# 📄 Account Snapshot Model Specification

**Purpose:**  
Captures the end-of-day financial state of a user’s trading account.  
Used to track daily balance growth, generate PnL calendars, and chart account performance over time.

---

## ✅ Model Fields

| Field           | Type              | Description                                                   |
|------------------|-------------------|---------------------------------------------------------------|
| `id`             | `string`          | Unique identifier for the snapshot                            |
| `accountId`      | `string`          | Foreign key to the related user account                       |
| `date`           | `string` (ISO)    | Snapshot date (e.g., `2025-08-01`)                            |
| `balance`        | `number`          | Total balance of the account at the end of the day            |
| `dailyPnl`       | `number`          | Net PnL (profit/loss) from closed trades that day             |
| `deposits?`      | `number` (optional)| Total deposits made on this date (if any)                     |
| `withdrawals?`   | `number` (optional)| Total withdrawals made on this date (if any)                  |
| `notes?`         | `string` (optional)| Optional user notes or remarks about the day                 |

---

## ⚙️ Calculation Logic

- `balance` is calculated from:
previousBalance + deposits - withdrawals + dailyPnl
- Daily snapshots can be generated:
- Automatically by a cron job (e.g., daily at 23:59 UTC)
- Or triggered on user interaction (e.g., after adding a trade)

---

## 🧠 Design Considerations

- Required for plotting balance growth charts and generating PnL calendars
- Enables visual insight into consistency, equity curves, and long-term progress
- Can be extended in the future to include:
- `floatingPnl` for unrealized gains/losses
- `drawdown` metrics
- `equity` and `availableMargin` for real-time snapshot comparisons

---

## 🔗 Related Models

- Linked to: `Account`, `AccountTransaction`, and `TradeLog`
- Snapshot depends on:
- Closed trades from `TradeLog`
- Deposits/Withdrawals from `AccountTransaction`