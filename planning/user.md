# 📄 User Model Specification

**Purpose:**  
This document defines the structure of the **User** model in the Trading Journal Web App.  
It handles authentication, basic identity, and ownership of trade logs.

---

## ✅ Core Fields

| Field           | Type       | Description                                      |
|----------------|------------|--------------------------------------------------|
| `id`            | `string`   | Unique identifier (UUID or ObjectId)             |
| `email`         | `string`   | User’s email address (used for login)            |
| `passwordHash`  | `string`   | Hashed password using a secure algorithm         |
| `createdAt`     | `string`   | ISO timestamp of account creation                |
| `updatedAt`     | `string`   | ISO timestamp of last profile update             |

---

## ⚙️ Optional Fields

| Field        | Type        | Description                            |
|--------------|-------------|----------------------------------------|
| `name?`      | `string`    | Display name or nickname               |
| `avatarUrl?` | `string`    | Optional avatar/profile image          |
| `role?`      | `"user"` \| `"admin"` | Role for access control        |

---

## 🔐 Notes on Authentication

- Passwords must be securely hashed (e.g., using `bcrypt`)
- Support for basic email/password auth (OAuth not implemented)
- Each user owns their own trade logs

---

## 🧠 Example (Minimal User JSON)

```json
{
  "id": "user_abc123",
  "email": "trader@example.com",
  "passwordHash": "$2b$10$...",
  "createdAt": "2025-08-01T08:00:00Z",
  "updatedAt": "2025-08-01T08:00:00Z"
}
