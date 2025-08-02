# 📄 Account Model Specification (with Position Unit)

**Purpose:**  
Each trading account managed by the user includes a preferred unit of position sizing (`usdt`, `lot`, etc.),  
which is automatically applied to all trades under that account.

---

## ✅ Core Fields

| Field           | Type                 | Description                                         |
|----------------|----------------------|-----------------------------------------------------|
| `id`            | `string`             | Unique identifier                                   |
| `userId`        | `string`             | ID of the user who owns this account                |
| `name`          | `string`             | User-defined account name (e.g., "Binance Futures") |
| `balance`       | `number`             | Current account balance in USD                      |
| `positionUnit`  | `"usd"` \| `"lot"`  | Unit used for position sizing                       |
| `createdAt`     | `string`             | Timestamp when the account was created              |
| `updatedAt`     | `string`             | Timestamp when the account was last updated         |

---

## 📌 Impact on TradeLog

- Remove `positionUnit` from `TradeLog` model.
- When logging a trade, the system pulls `positionUnit` from the related `Account`.

---

## 🧠 Example

```json
{
  "id": "account_001",
  "userId": "user_abc123",
  "name": "ICMarkets Demo",
  "balance": 10000,
  "positionUnit": "lot",
  "createdAt": "2025-08-01T10:00:00Z",
  "updatedAt": "2025-08-01T10:00:00Z"
}
