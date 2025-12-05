# 🚀 E-Money Backend - Quick Start Guide

## Installation (5 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Setup database
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

# Start server
npm run dev
```

✅ Server runs on `http://localhost:4000`

## Test Login

```bash
# User Login
curl -X POST http://localhost:4000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Admin Login
curl -X POST http://localhost:4000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## Environment Variables

Edit `backend/.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your-secret-key
PORT=4000
```

## Default Accounts

| Role | Username/Email | Password |
|------|----------------|----------|
| Admin | admin | admin123 |
| User | john@example.com | password123 |
| User | jane@example.com | password123 |

## Common Commands

```bash
npm run dev              # Start development server
npm run start            # Start production server
npm run prisma:studio    # Open database GUI
npm run prisma:reset     # Reset database
npm run prisma:seed      # Re-seed data
```

## Quick API Test

```bash
# Health check
curl http://localhost:4000

# Register new user
curl -X POST http://localhost:4000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"New User","email":"new@test.com","password":"test123"}'
```

## Project Structure

```
backend/
├── src/
│   ├── routes/          # API endpoints
│   ├── middleware/      # Authentication
│   ├── utils/           # Helper functions
│   └── server.js        # Main server
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.js          # Test data
└── .env                 # Configuration
```

## Documentation

- **Full Setup:** `SETUP_GUIDE.md`
- **API Reference:** `API_DOCUMENTATION.md`
- **Testing:** `TESTING_CHECKLIST.md`
- **Summary:** `REBUILD_SUMMARY.md`

## Support

If you encounter issues:
1. Check `TESTING_CHECKLIST.md`
2. Verify PostgreSQL is running
3. Check `.env` configuration
4. View console logs for errors

## What's Included

✅ User authentication (register/login)
✅ Money transfers between users
✅ Deposits with payment gateway support
✅ Withdrawals with admin approval
✅ Admin panel with 2FA
✅ Reserve account management
✅ Transaction history
✅ Audit logging
✅ Complete REST API
✅ JWT authentication
✅ Password hashing
✅ Database migrations
✅ Seed data

## Frontend Integration

Update your frontend API base URL:

```javascript
// Client app
const API_BASE = "http://localhost:4000/api";

// Example fetch
const response = await fetch(`${API_BASE}/users/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
```

## Database GUI

View and edit database:

```bash
npm run prisma:studio
```

Opens at `http://localhost:5555`

## Ready to Go! 🎉

Your backend is complete and tested. Start your frontend development now!
