# 📄 Strategy Model Specification (with Example Image)

**Purpose:**  
The Strategy model allows users to define their trading strategies with optional visual examples and descriptions.  
This helps reinforce pattern recognition and improves trade consistency.

---

## ✅ Core Fields

| Field            | Type       | Description                                                     |
|------------------|------------|-----------------------------------------------------------------|
| `id`             | `string`   | Unique identifier                                               |
| `userId`         | `string`   | ID of the user who owns this strategy                           |
| `name`           | `string`   | Short strategy label (e.g., "Trend Break", "Supply-Demand")     |
| `description?`   | `string`   | Optional setup explanation or trading conditions                |
| `exampleImageUrls?` | `string[]` | Optional URL to chart screenshot or pattern illustration        |
| `createdAt`      | `string`   | Timestamp when the strategy was created                         |

---

## 🔗 Relationships

- One **User** → many **Strategies**  
- One **TradeLog** → one **Strategy**

---

## 🧠 Example (Extended Strategy JSON)

```json
{
  "id": "strategy_02",
  "userId": "user_xyz123",
  "name": "Breakout Retest",
  "description": "Enter after a confirmed breakout followed by a retest of the broken level.",
  "exampleImageUrls": [
    "https://cdn.yourapp.com/strategies/breakout_retest_example.png",
    "https://cdn.yourapp.com/strategies/breakout_retest_example2.png"
  ],
  "createdAt": "2025-08-01T14:00:00Z"
}
