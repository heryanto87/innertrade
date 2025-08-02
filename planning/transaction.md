# 📄 Account Transaction Model Specification

**Purpose:**  
Defines a unified model for tracking deposits and withdrawals across user accounts.  
This model ensures accurate balance calculations and enables clear financial tracking.

---

## ✅ Model Fields

| Field          | Type                                | Description                                      |
|----------------|-------------------------------------|--------------------------------------------------|
| `id`           | `string`                            | Unique identifier for the transaction            |
| `accountId`    | `string`                            | Foreign key to the related user account          |
| `type`         | `"deposit"` \| `"withdrawal"`       | Indicates the transaction category               |
| `amount`       | `number`                            | Positive amount in the account's currency unit   |
| `date`         | `string` (ISO format)               | Date the transaction occurred                    |
| `description?` | `string` (optional)                 | Optional user note or label for the transaction  |

---

## 🧠 Design Considerations

- All amounts are positive; `type` determines whether it adds to or subtracts from the account balance.
- Linked to each user `account`, enabling multi-account journaling and analysis.
- Supports accurate calculation of account snapshots and PnL charts.
- `description` can be used to label funding sources, withdrawal notes, or internal notes.
