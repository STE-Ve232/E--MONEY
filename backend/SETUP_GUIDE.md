# E-Money Backend - Complete Setup Guide

## 🎯 Overview
This is a complete Node.js + Express + Prisma backend for the E-Money application with:
- ✅ User authentication and management
- ✅ Admin panel with 2FA support
- ✅ Deposits and withdrawals
- ✅ Money transfers between users
- ✅ Reserve account management
- ✅ Audit logging
- ✅ PostgreSQL database with Prisma ORM

## 📋 Prerequisites
- Node.js 16+ installed
- PostgreSQL database running
- npm or yarn package manager

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
Edit `backend/.env` with your database credentials:
```env
DATABASE_URL=postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME
JWT_SECRET=your-secret-key-here
PORT=4000
```

### 3. Setup Database
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations (creates tables)
npm run prisma:migrate

# Seed database with test data
npm run prisma:seed
```

### 4. Start Server
```bash
# Development mode (auto-restart on changes)
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:4000`

## 🔐 Test Credentials

### Admin Panel
- **Username:** admin
- **Password:** admin123

### User Accounts
- **Email:** john@example.com | **Password:** password123
- **Email:** jane@example.com | **Password:** password123

## 📡 API Endpoints

### User Endpoints (`/api/users`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /profile` - Get user profile (auth required)
- `PATCH /profile` - Update profile (auth required)
- `GET /balance` - Get current balance (auth required)

### Deposit Endpoints (`/api/deposits`)
- `POST /initiate` - Initiate deposit (auth required)
- `POST /verify/:txRef` - Verify deposit (webhook)
- `GET /history` - Get deposit history (auth required)
- `GET /:id` - Get specific deposit (auth required)

### Withdrawal Endpoints (`/api/withdrawals`)
- `POST /request` - Request withdrawal (auth required)
- `GET /history` - Get withdrawal history (auth required)
- `GET /:id` - Get specific withdrawal (auth required)
- `POST /:id/cancel` - Cancel pending withdrawal (auth required)

### Transaction Endpoints (`/api/transactions`)
- `POST /transfer` - Send money to another user (auth required)
- `GET /history` - Get transaction history (auth required)
- `GET /:id` - Get specific transaction (auth required)
- `GET /users/search?q=query` - Search users for transfer (auth required)

### Admin Endpoints (`/api/admin`)
- `POST /login` - Admin login (with optional 2FA)
- `POST /totp/setup` - Setup 2FA
- `POST /totp/verify-enable` - Enable 2FA
- `GET /users` - Get all users
- `GET /users/:id` - Get user details
- `GET /deposits` - Get all deposits
- `GET /withdrawals` - Get all withdrawals
- `POST /withdrawals/:id/approve` - Approve withdrawal
- `POST /withdrawals/:id/reject` - Reject withdrawal
- `GET /reserve` - Get reserve accounts
- `GET /reserve/history` - Get reserve history
- `POST /reserve/credit` - Credit reserve
- `POST /reserve/debit` - Debit reserve
- `GET /audit-logs` - Get audit logs

## 🧪 Testing API with cURL

### Register User
```bash
curl -X POST http://localhost:4000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "phone": "+1234567892",
    "password": "password123"
  }'
```

### Login User
```bash
curl -X POST http://localhost:4000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Profile (replace TOKEN with actual JWT)
```bash
curl http://localhost:4000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Transfer Money
```bash
curl -X POST http://localhost:4000/api/transactions/transfer \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "receiverId": 2,
    "amount": 50,
    "description": "Payment for services"
  }'
```

### Admin Login
```bash
curl -X POST http://localhost:4000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

## 🗄️ Database Schema

### Users
- Stores user accounts with balance
- Supports referral system
- Email verification flag

### Transactions
- Tracks money transfers between users
- Links sender and receiver

### Deposits
- Tracks incoming payments
- Supports multiple payment methods
- Webhook-ready for payment gateways

### Withdrawals
- Tracks outgoing payments
- Admin approval workflow
- Automatic balance locking

### Reserve Accounts
- Multi-currency support
- Admin-managed reserves
- Transaction logging

### Audit Logs
- Tracks all admin actions
- Includes timestamps and details

## 🔧 Common Tasks

### Reset Database
```bash
# Drop all tables and recreate
npx prisma migrate reset

# Seed again
npm run prisma:seed
```

### View Database
```bash
# Open Prisma Studio
npx prisma studio
```

### Update Schema
1. Edit `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name your_migration_name`
3. Run `npx prisma generate`

## 🚨 Troubleshooting

### "Cannot connect to database"
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Ensure database exists

### "Invalid token" errors
- Check JWT_SECRET matches between requests
- Verify token hasn't expired (7 days for users, 8h for admin)
- Ensure "Bearer " prefix in Authorization header

### "Module not found" errors
- Run `npm install` again
- Delete node_modules and reinstall

## 📝 Next Steps

1. **Frontend Integration**: Update client/admin apps to use these endpoints
2. **Payment Gateway**: Integrate Flutterwave or Paystack for real deposits
3. **Email Notifications**: Add email service for transactions
4. **Security Hardening**: Add rate limiting, input validation
5. **Testing**: Write unit and integration tests
6. **Deployment**: Setup on hosting service (Railway, Heroku, AWS, etc.)

## 🎉 Success!
Your backend is now fully functional. All routes are implemented and ready for frontend integration!
