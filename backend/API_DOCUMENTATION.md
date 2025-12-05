# E-Money API Documentation

Base URL: `http://localhost:4000`

## Authentication

Most endpoints require authentication using JWT Bearer tokens.

Include in headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Response Format

### Success Response
```json
{
  "data": {...},
  "message": "Success message"
}
```

### Error Response
```json
{
  "error": "Error message"
}
```

---

## 👤 User Authentication

### POST /api/users/register
Register a new user account.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "securepassword",
  "referralCode": "REF123" // Optional
}
```

**Response:**
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "balance": "0.00",
    "referralCode": "REF1234567890ABC",
    "isVerified": false
  }
}
```

### POST /api/users/login
Login to user account.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "balance": "1000.00",
    "referralCode": "REF1234567890ABC",
    "isVerified": true
  }
}
```

### GET /api/users/profile
Get current user profile. **(Auth Required)**

**Response:**
```json
{
  "id": 1,
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "balance": "1000.00",
  "referralCode": "REF1234567890ABC",
  "referredBy": null,
  "isVerified": true,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### PATCH /api/users/profile
Update user profile. **(Auth Required)**

**Request Body:**
```json
{
  "fullName": "John Updated",
  "phone": "+0987654321"
}
```

### GET /api/users/balance
Get current balance. **(Auth Required)**

**Response:**
```json
{
  "balance": "1000.00"
}
```

---

## 💰 Deposits

### POST /api/deposits/initiate
Initiate a deposit. **(Auth Required)**

**Request Body:**
```json
{
  "amount": 100.50,
  "method": "card",
  "currency": "USD"
}
```

**Response:**
```json
{
  "depositId": 123,
  "txRef": "DEP1234567890ABCDEF",
  "amount": "100.50",
  "status": "pending",
  "paymentLink": "https://payment.example.com/pay/DEP1234567890ABCDEF",
  "message": "Redirect user to payment gateway"
}
```

### POST /api/deposits/verify/:txRef
Verify deposit (webhook endpoint for payment gateway).

**Request Body:**
```json
{
  "status": "success",
  "metadata": {
    "transaction_id": "FLW_TX_123"
  }
}
```

**Response:**
```json
{
  "ok": true,
  "status": "completed"
}
```

### GET /api/deposits/history
Get deposit history. **(Auth Required)**

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)

**Response:**
```json
{
  "deposits": [
    {
      "id": 1,
      "amount": "100.00",
      "status": "completed",
      "method": "card",
      "txRef": "DEP1234567890ABCDEF",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

### GET /api/deposits/:id
Get specific deposit. **(Auth Required)**

---

## 💸 Withdrawals

### POST /api/withdrawals/request
Request a withdrawal. **(Auth Required)**

**Request Body:**
```json
{
  "amount": 50.00,
  "walletAddress": "0x1234567890abcdef",
  "method": "crypto",
  "currency": "USD"
}
```

**Response:**
```json
{
  "withdrawalId": 456,
  "txRef": "WTH1234567890ABCDEF",
  "amount": "50.00",
  "status": "pending",
  "message": "Withdrawal request submitted. Awaiting admin approval."
}
```

### GET /api/withdrawals/history
Get withdrawal history. **(Auth Required)**

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)

### GET /api/withdrawals/:id
Get specific withdrawal. **(Auth Required)**

### POST /api/withdrawals/:id/cancel
Cancel pending withdrawal. **(Auth Required)**

**Response:**
```json
{
  "ok": true,
  "message": "Withdrawal cancelled and balance refunded"
}
```

---

## 🔄 Transactions

### POST /api/transactions/transfer
Transfer money to another user. **(Auth Required)**

**Request Body:**
```json
{
  "receiverId": 2,
  "amount": 25.00,
  "description": "Payment for services",
  "currency": "USD"
}
```

**Response:**
```json
{
  "transactionId": 789,
  "amount": "25.00",
  "sender": {
    "fullName": "John Doe",
    "email": "john@example.com"
  },
  "receiver": {
    "fullName": "Jane Smith",
    "email": "jane@example.com"
  },
  "status": "completed",
  "message": "Transfer successful"
}
```

### GET /api/transactions/history
Get transaction history. **(Auth Required)**

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `type` (optional: "sent", "received")

**Response:**
```json
{
  "transactions": [
    {
      "id": 1,
      "amount": "25.00",
      "sender": {
        "id": 1,
        "fullName": "John Doe",
        "email": "john@example.com"
      },
      "receiver": {
        "id": 2,
        "fullName": "Jane Smith",
        "email": "jane@example.com"
      },
      "description": "Payment for services",
      "status": "completed",
      "type": "sent",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

### GET /api/transactions/:id
Get specific transaction. **(Auth Required)**

### GET /api/transactions/users/search
Search users for transfer. **(Auth Required)**

**Query Parameters:**
- `q` (search query)

**Response:**
```json
{
  "users": [
    {
      "id": 2,
      "fullName": "Jane Smith",
      "email": "jane@example.com"
    }
  ]
}
```

---

## 🔐 Admin Authentication

### POST /api/admin/login
Admin login (supports 2FA).

**Request Body (without 2FA):**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Request Body (with 2FA):**
```json
{
  "username": "admin",
  "password": "admin123",
  "totp": "123456"
}
```

**Response:**
```json
{
  "token": "eyJhbGc...",
  "totpEnabled": false
}
```

### POST /api/admin/totp/setup
Setup 2FA for admin account.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "otpauth_url": "otpauth://totp/E-Money%20(admin)?secret=ABC123...",
  "qr_code": "data:image/png;base64,...",
  "base32": "ABC123DEF456..."
}
```

### POST /api/admin/totp/verify-enable
Verify and enable 2FA.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123",
  "token": "123456"
}
```

---

## 👥 Admin - User Management

### GET /api/admin/users
Get all users. **(Admin Auth Required)**

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 50)

### GET /api/admin/users/:id
Get user details with transaction history. **(Admin Auth Required)**

---

## 💰 Admin - Deposit Management

### GET /api/admin/deposits
Get all deposits. **(Admin Auth Required)**

**Query Parameters:**
- `status` (optional: "pending", "completed", "failed")
- `page` (default: 1)
- `limit` (default: 50)

---

## 💸 Admin - Withdrawal Management

### GET /api/admin/withdrawals
Get all withdrawals. **(Admin Auth Required)**

**Query Parameters:**
- `status` (optional: "pending", "completed", "rejected", "cancelled")
- `page` (default: 1)
- `limit` (default: 50)

### POST /api/admin/withdrawals/:id/approve
Approve pending withdrawal. **(Admin Auth Required)**

**Response:**
```json
{
  "ok": true,
  "message": "Withdrawal approved"
}
```

### POST /api/admin/withdrawals/:id/reject
Reject pending withdrawal. **(Admin Auth Required)**

**Request Body:**
```json
{
  "reason": "Insufficient documentation"
}
```

**Response:**
```json
{
  "ok": true,
  "message": "Withdrawal rejected and balance refunded"
}
```

---

## 🏦 Admin - Reserve Management

### GET /api/admin/reserve
Get all reserve accounts. **(Admin Auth Required)**

**Response:**
```json
[
  {
    "id": 1,
    "currency": "USD",
    "balance": "10000.00",
    "lastUpdated": "2024-01-01T00:00:00.000Z"
  }
]
```

### GET /api/admin/reserve/history
Get reserve transaction history. **(Admin Auth Required)**

### POST /api/admin/reserve/credit
Credit reserve account. **(Admin Auth Required)**

**Request Body:**
```json
{
  "currency": "USD",
  "amount": 1000.00,
  "description": "Initial funding"
}
```

### POST /api/admin/reserve/debit
Debit reserve account. **(Admin Auth Required)**

**Request Body:**
```json
{
  "currency": "USD",
  "amount": 500.00,
  "description": "Withdrawal payout"
}
```

---

## 📋 Admin - Audit Logs

### GET /api/admin/audit-logs
Get audit logs. **(Admin Auth Required)**

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 100)

**Response:**
```json
{
  "logs": [
    {
      "id": 1,
      "action": "APPROVE_WITHDRAWAL",
      "details": "Approved withdrawal #123 for 50.00",
      "admin": {
        "id": 1,
        "username": "admin"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 100,
    "total": 250,
    "pages": 3
  }
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing or invalid token |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

## Rate Limiting

Currently no rate limiting is implemented. Consider adding in production.

## Webhooks

Payment gateway webhooks should hit:
- `POST /api/deposits/verify/:txRef`

Configure your payment provider to send notifications to this endpoint.
