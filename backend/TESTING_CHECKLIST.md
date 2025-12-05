# 🧪 Backend Testing Checklist

## Prerequisites
- [ ] PostgreSQL is running
- [ ] Database credentials are correct in `.env`
- [ ] Node.js 16+ is installed
- [ ] All dependencies installed (`npm install`)

## Database Setup
- [ ] Run `npm run prisma:generate` - Generate Prisma Client
- [ ] Run `npm run prisma:migrate` - Create database tables
- [ ] Run `npm run prisma:seed` - Populate test data
- [ ] Verify database with `npm run prisma:studio`

## Server Startup
- [ ] Run `npm run dev` - Start development server
- [ ] Server starts on port 4000
- [ ] No errors in console
- [ ] Visit `http://localhost:4000` - Should return `{"ok":true}`

## User Authentication Tests

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
- [ ] Returns JWT token
- [ ] Returns user object with balance "0.00"
- [ ] User has referral code

### Login User
```bash
curl -X POST http://localhost:4000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```
- [ ] Returns JWT token
- [ ] Returns user with correct balance

**Save the token for next tests:**
```bash
export TOKEN="your_token_here"
```

### Get Profile
```bash
curl http://localhost:4000/api/users/profile \
  -H "Authorization: Bearer $TOKEN"
```
- [ ] Returns full user profile
- [ ] Balance is correct

### Get Balance
```bash
curl http://localhost:4000/api/users/balance \
  -H "Authorization: Bearer $TOKEN"
```
- [ ] Returns balance only

## Deposit Tests

### Initiate Deposit
```bash
curl -X POST http://localhost:4000/api/deposits/initiate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "amount": 100,
    "method": "card"
  }'
```
- [ ] Returns deposit ID and txRef
- [ ] Returns paymentLink
- [ ] Status is "pending"

**Save txRef for verification:**
```bash
export TX_REF="DEP..."
```

### Verify Deposit (Simulate Payment Success)
```bash
curl -X POST http://localhost:4000/api/deposits/verify/$TX_REF \
  -H "Content-Type: application/json" \
  -d '{
    "status": "success",
    "metadata": {"tx_id": "TEST123"}
  }'
```
- [ ] Returns success
- [ ] Check balance increased by deposit amount

### Get Deposit History
```bash
curl http://localhost:4000/api/deposits/history \
  -H "Authorization: Bearer $TOKEN"
```
- [ ] Returns list of deposits
- [ ] Pagination info included

## Withdrawal Tests

### Request Withdrawal
```bash
curl -X POST http://localhost:4000/api/withdrawals/request \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "amount": 50,
    "walletAddress": "0x1234567890abcdef",
    "method": "crypto"
  }'
```
- [ ] Returns withdrawal ID and txRef
- [ ] Status is "pending"
- [ ] Balance decreased immediately

**Save withdrawal ID:**
```bash
export WITHDRAWAL_ID="123"
```

### Get Withdrawal History
```bash
curl http://localhost:4000/api/withdrawals/history \
  -H "Authorization: Bearer $TOKEN"
```
- [ ] Returns list of withdrawals
- [ ] Shows pending withdrawal

### Cancel Withdrawal
```bash
curl -X POST http://localhost:4000/api/withdrawals/$WITHDRAWAL_ID/cancel \
  -H "Authorization: Bearer $TOKEN"
```
- [ ] Returns success
- [ ] Balance refunded
- [ ] Status changed to "cancelled"

## Transaction Tests

### Search Users
```bash
curl "http://localhost:4000/api/transactions/users/search?q=jane" \
  -H "Authorization: Bearer $TOKEN"
```
- [ ] Returns matching users
- [ ] Doesn't include current user

### Transfer Money
First login as john@example.com, then:
```bash
curl -X POST http://localhost:4000/api/transactions/transfer \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "receiverId": 2,
    "amount": 25,
    "description": "Test transfer"
  }'
```
- [ ] Returns transaction details
- [ ] Status is "completed"
- [ ] Sender balance decreased
- [ ] Receiver balance increased (check by logging in as jane)

### Get Transaction History
```bash
curl "http://localhost:4000/api/transactions/history?type=sent" \
  -H "Authorization: Bearer $TOKEN"
```
- [ ] Returns sent transactions
- [ ] Each has type "sent"

```bash
curl "http://localhost:4000/api/transactions/history?type=received" \
  -H "Authorization: Bearer $TOKEN"
```
- [ ] Returns received transactions

## Admin Tests

### Admin Login
```bash
curl -X POST http://localhost:4000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```
- [ ] Returns admin token
- [ ] totpEnabled is false

**Save admin token:**
```bash
export ADMIN_TOKEN="admin_token_here"
```

### Get All Users
```bash
curl http://localhost:4000/api/admin/users \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```
- [ ] Returns list of users
- [ ] Pagination info included

### Get User Details
```bash
curl http://localhost:4000/api/admin/users/1 \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```
- [ ] Returns user with transaction history

### Get All Deposits
```bash
curl "http://localhost:4000/api/admin/deposits?status=completed" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```
- [ ] Returns filtered deposits
- [ ] Includes user info

### Get All Withdrawals
```bash
curl http://localhost:4000/api/admin/withdrawals \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```
- [ ] Returns all withdrawals
- [ ] Includes user info

### Create Pending Withdrawal (as user first)
Login as user, request withdrawal, then as admin:

### Approve Withdrawal
```bash
curl -X POST http://localhost:4000/api/admin/withdrawals/$WITHDRAWAL_ID/approve \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```
- [ ] Returns success
- [ ] Status changed to "completed"
- [ ] Audit log created

### Reject Withdrawal
```bash
curl -X POST http://localhost:4000/api/admin/withdrawals/$WITHDRAWAL_ID/reject \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "reason": "Suspicious activity"
  }'
```
- [ ] Returns success
- [ ] Status changed to "rejected"
- [ ] Balance refunded
- [ ] Audit log created

### Reserve Management

#### Get Reserves
```bash
curl http://localhost:4000/api/admin/reserve \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```
- [ ] Returns all reserve accounts (USD, EUR, GBP, NGN)

#### Credit Reserve
```bash
curl -X POST http://localhost:4000/api/admin/reserve/credit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "currency": "USD",
    "amount": 1000,
    "description": "Initial funding"
  }'
```
- [ ] Returns updated reserve
- [ ] Balance increased
- [ ] Transaction logged

#### Debit Reserve
```bash
curl -X POST http://localhost:4000/api/admin/reserve/debit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "currency": "USD",
    "amount": 500,
    "description": "Withdrawal payout"
  }'
```
- [ ] Returns updated reserve
- [ ] Balance decreased
- [ ] Transaction logged

#### Get Reserve History
```bash
curl http://localhost:4000/api/admin/reserve/history \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```
- [ ] Returns transaction log
- [ ] Shows credit and debit entries

### Get Audit Logs
```bash
curl http://localhost:4000/api/admin/audit-logs \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```
- [ ] Returns admin actions
- [ ] Includes admin username
- [ ] Shows timestamps

## 2FA Tests

### Setup TOTP
```bash
curl -X POST http://localhost:4000/api/admin/totp/setup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```
- [ ] Returns QR code data URL
- [ ] Returns base32 secret
- [ ] Returns otpauth URL

**Scan QR code with authenticator app (Google Authenticator, Authy, etc.)**

### Verify and Enable TOTP
```bash
curl -X POST http://localhost:4000/api/admin/totp/verify-enable \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123",
    "token": "123456"
  }'
```
- [ ] Returns success
- [ ] TOTP now enabled

### Login with TOTP
```bash
curl -X POST http://localhost:4000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123",
    "totp": "123456"
  }'
```
- [ ] Returns token when TOTP correct
- [ ] Rejects with wrong TOTP

## Error Handling Tests

### Invalid Token
```bash
curl http://localhost:4000/api/users/profile \
  -H "Authorization: Bearer invalid_token"
```
- [ ] Returns 401 Unauthorized

### Missing Fields
```bash
curl -X POST http://localhost:4000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com"}'
```
- [ ] Returns 400 Bad Request

### Insufficient Balance
```bash
curl -X POST http://localhost:4000/api/transactions/transfer \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "receiverId": 2,
    "amount": 999999
  }'
```
- [ ] Returns 400 with "Insufficient balance" error

### User Not Found
```bash
curl http://localhost:4000/api/admin/users/99999 \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```
- [ ] Returns 404 Not Found

## Performance Tests

### Pagination
```bash
curl "http://localhost:4000/api/transactions/history?page=1&limit=5" \
  -H "Authorization: Bearer $TOKEN"
```
- [ ] Returns exactly 5 items
- [ ] Pagination info correct

### Concurrent Transfers (Optional - requires script)
Run multiple transfers simultaneously:
- [ ] All succeed or fail atomically
- [ ] No race conditions
- [ ] Final balance is correct

## Database Integrity

### Check via Prisma Studio
```bash
npm run prisma:studio
```
Visit http://localhost:5555

- [ ] Users table has correct data
- [ ] Transactions link properly
- [ ] Deposits status updated correctly
- [ ] Withdrawals handled properly
- [ ] Reserve balances accurate
- [ ] Audit logs present

## 🎉 All Tests Passed?

If all checkboxes are checked:
✅ **Backend is fully functional and ready for production!**

## Common Issues

### "Cannot connect to database"
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Ensure database exists

### "Token expired"
- Re-login to get fresh token
- Check JWT_SECRET is consistent

### "Insufficient balance"
- Verify user balance with GET /api/users/balance
- Complete a deposit first

### Port already in use
- Change PORT in .env
- Kill process on port 4000: `lsof -ti:4000 | xargs kill`

## Next Steps After Testing

1. ✅ Integrate with frontend (client & admin)
2. ✅ Setup payment gateway (Flutterwave/Paystack)
3. ✅ Add email notifications
4. ✅ Deploy to production server
5. ✅ Setup monitoring and logging
6. ✅ Add rate limiting
7. ✅ Implement caching (Redis)
8. ✅ Write automated tests
