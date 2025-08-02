# 📄 Trade Log Model Specification

**Purpose:**  
This document defines the structure and logic of the **Trade Log** model used in the Trading Journal Web App.  
It supports multi-stage trade logging for crypto, forex, and commodities, including margin handling, account linking, strategy tracking, and trade journaling.

---

## ✅ Initial Trade Input (at entry)

These fields are filled in when the trade is opened.

| Field            | Type                         | Description                                  |
|------------------|------------------------------|----------------------------------------------|
| `symbol`         | `string`                     | Custom symbol identifier (e.g., BTCUSDT)     |
| `entryPrice`     | `number`                     | Entry price                                  |
| `stopLoss`       | `number`                     | Stop loss price                              |
| `takeProfit`     | `number`                     | Take profit price                            |
| `positionSize`   | `number`                     | Position size in units or lots               |
| `positionUnit`   | `"usdt"` \| `"lot"`          | Unit type: crypto or forex                   |
| `leverage?`      | `number` (optional)          | Only required for leveraged assets           |
| `openDate`       | `string` (ISO date)          | When the trade was opened                    |
| `accountId`      | `string`                     | FK to the account used for this trade        |
| `strategyIds?`    | `	string[]` (optional)          | FK array for one or more applied strategies |
| `entryImageUrls?`| `string[]` (optional)        | Entry screenshots / chart examples           |
| `notes?`         | `string` (optional)          | Notes or reasoning for the setup             |

---

## ✅ Closing Trade Input (after position is closed)

These fields are entered only when the trade is exited.

| Field             | Type                                                  | Description                                  |
|-------------------|-------------------------------------------------------|----------------------------------------------|
| `status`          | `"open"` \| `"closed"` \| `"cancelled"`               | Lifecycle status of the trade                |
| `exitDate`        | `string` (ISO date)                                   | When the trade was closed or cancelled       |
| `pnl?`            | `number`                                              | Profit/loss in absolute terms                |
| `result`          | `"win"` \| `"loss"` \| `"breakeven"` \| `"partial-win"` \| `null` | Outcome summary       |
| `closeImageUrls?` | `string[]` (optional)                                 | Post-trade screenshots or chart follow-up    |

---

## ⚙️ Auto-Calculated Fields

These values are inferred or computed from user input.

| Field             | Formula                                                              | Notes                                       |
|-------------------|----------------------------------------------------------------------|---------------------------------------------|
| `direction`        | `takeProfit > entryPrice ? "long" : "short"`                        | Inferred from price direction                |
| `marginUsed`       | `positionSize * entryPrice / leverage` (if leverage is defined)     | Calculated for leveraged trades              |
| `exposure`         | `positionSize * entryPrice`                                         | Market exposure                              |
| `riskRewardRatio`  | `abs(takeProfit - entryPrice) / abs(entryPrice - stopLoss)`         | Setup quality indicator                      |
| `duration`         | `exitDate - openDate`                                               | Time in trade                                |
| `rMultiple`        | `pnl / (entryPrice - stopLoss)`                                     | Profit relative to initial risk              |

---

## 🧠 Design Principles

- Initial and closing inputs are clearly separated for better UX.
- Images are organized into `entryImageUrls` and `closeImageUrls` for before/after journaling.
- `positionUnit` is locked to `"usdt"` or `"lot"` and inferred from account.
- `direction` is derived, not input.
- `strategyId` is optional for flexible workflows.
- `accountId` is required for contextual reporting and performance tracking.

---

## 🛠️ Future Considerations

- Support partial exits or multiple exit logs per trade
- Upload image metadata (e.g., timestamp, label)
- Add “emotions” or “confidence level” to entry
- Allow draft/in-progress trades before saving full logs
