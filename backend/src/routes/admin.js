const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma");
const {
  generateSecret,
  generateQRCodeDataURL,
  verifyToken,
} = require("../utils/totp");

const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret";

// ADMIN LOGIN (password only) - returns token and whether MFA required
router.post("/login", async (req, res) => {
  const { username, password, totp } = req.body;
  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin) return res.status(401).json({ error: "Invalid credentials" });
  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  // if TOTP enabled, require totp code
  if (admin.totpEnabled) {
    if (!totp) return res.status(401).json({ error: "TOTP required" });
    const okTotp = verifyToken(admin.totpSecret, totp);
    if (!okTotp) return res.status(401).json({ error: "Invalid TOTP" });
  }

  const token = jwt.sign(
    { id: admin.id, username: admin.username },
    JWT_SECRET,
    { expiresIn: "8h" }
  );
  res.json({ token, totpEnabled: admin.totpEnabled });
});

// TOTP - generate (only for logged-in admin via token)
router.post("/totp/setup", async (req, res) => {
  const { username, password } = req.body;
  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin) return res.status(401).json({ error: "Invalid credentials" });
  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const secretObj = generateSecret(admin.username);
  const qr = await generateQRCodeDataURL(secretObj.otpauth_url);
  
  await prisma.admin.update({
    where: { id: admin.id },
    data: { totpSecret: secretObj.base32 },
  });
  
  res.json({
    otpauth_url: secretObj.otpauth_url,
    qr_code: qr,
    base32: secretObj.base32,
  });
});

// TOTP - verify and enable
router.post("/totp/verify-enable", async (req, res) => {
  const { username, password, token } = req.body;
  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin) return res.status(401).json({ error: "Invalid credentials" });
  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  if (!admin.totpSecret)
    return res.status(400).json({ error: "TOTP not initialized" });
  const okTotp = verifyToken(admin.totpSecret, token);
  if (!okTotp) return res.status(400).json({ error: "Invalid TOTP code" });

  await prisma.admin.update({
    where: { id: admin.id },
    data: { totpEnabled: true },
  });
  res.json({ ok: true });
});

// Reserve endpoints (protected)
const { adminAuth } = require("../middleware/auth");

// GET reserves
router.get("/reserve", adminAuth, async (req, res) => {
  const reserves = await prisma.reserveAccount.findMany({
    orderBy: { currency: "asc" },
  });
  res.json(reserves);
});

// GET reserve history
router.get("/reserve/history", adminAuth, async (req, res) => {
  const history = await prisma.reserveTransaction.findMany({
    orderBy: [{ timestamp: "desc" }],
    take: 200,
  });
  res.json(history);
});

// CREDIT
router.post("/reserve/credit", adminAuth, async (req, res) => {
  const { currency, amount, description } = req.body;
  if (!currency || !amount)
    return res.status(400).json({ error: "currency & amount required" });

  try {
    const result = await prisma.$transaction(async (tx) => {
      const r = await tx.reserveAccount.findFirst({ where: { currency } });
      if (!r) throw new Error("Reserve not found");
      
      const newBal = parseFloat(r.balance) + parseFloat(amount);
      
      await tx.reserveAccount.update({
        where: { id: r.id },
        data: { balance: newBal },
      });
      
      const txRecord = await tx.reserveTransaction.create({
        data: {
          reserveId: r.id,
          amount: amount.toString(),
          type: "credit",
          description,
          adminId: req.admin.id,
        },
      });
      
      const updatedReserve = await tx.reserveAccount.findFirst({
        where: { currency },
      });
      
      return { reserve: updatedReserve, tx: txRecord };
    });

    res.json({ ok: true, ...result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DEBIT
router.post("/reserve/debit", adminAuth, async (req, res) => {
  const { currency, amount, description } = req.body;
  if (!currency || !amount)
    return res.status(400).json({ error: "currency & amount required" });

  try {
    const result = await prisma.$transaction(async (tx) => {
      const r = await tx.reserveAccount.findFirst({ where: { currency } });
      if (!r) throw new Error("Reserve not found");
      
      if (parseFloat(r.balance) < parseFloat(amount)) {
        throw new Error("Insufficient reserve balance");
      }
      
      const newBal = parseFloat(r.balance) - parseFloat(amount);
      
      await tx.reserveAccount.update({
        where: { id: r.id },
        data: { balance: newBal },
      });
      
      const txRecord = await tx.reserveTransaction.create({
        data: {
          reserveId: r.id,
          amount: amount.toString(),
          type: "debit",
          description,
          adminId: req.admin.id,
        },
      });
      
      const updatedReserve = await tx.reserveAccount.findFirst({
        where: { currency },
      });
      
      return { reserve: updatedReserve, tx: txRecord };
    });

    res.json({ ok: true, ...result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== USER MANAGEMENT =====

// Get all users
router.get("/users", adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      skip: parseInt(skip),
      take: parseInt(limit),
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        balance: true,
        isVerified: true,
        createdAt: true,
      },
    });

    const total = await prisma.user.count();

    res.json({
      users: users.map(u => ({ ...u, balance: u.balance.toString() })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by ID
router.get("/users/:id", adminAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        deposits: { take: 10, orderBy: { createdAt: "desc" } },
        withdrawals: { take: 10, orderBy: { createdAt: "desc" } },
        sentTransfers: { take: 10, orderBy: { createdAt: "desc" } },
        receivedTransfers: { take: 10, orderBy: { createdAt: "desc" } },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      ...user,
      balance: user.balance.toString(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== DEPOSIT MANAGEMENT =====

// Get all deposits
router.get("/deposits", adminAuth, async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    const where = status ? { status } : {};

    const deposits = await prisma.deposit.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: parseInt(skip),
      take: parseInt(limit),
      include: {
        user: {
          select: { id: true, fullName: true, email: true },
        },
      },
    });

    const total = await prisma.deposit.count({ where });

    res.json({
      deposits: deposits.map(d => ({ ...d, amount: d.amount.toString() })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== WITHDRAWAL MANAGEMENT =====

// Get all withdrawals
router.get("/withdrawals", adminAuth, async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    const where = status ? { status } : {};

    const withdrawals = await prisma.withdrawal.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: parseInt(skip),
      take: parseInt(limit),
      include: {
        user: {
          select: { id: true, fullName: true, email: true },
        },
      },
    });

    const total = await prisma.withdrawal.count({ where });

    res.json({
      withdrawals: withdrawals.map(w => ({ ...w, amount: w.amount.toString() })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve withdrawal
router.post("/withdrawals/:id/approve", adminAuth, async (req, res) => {
  try {
    const withdrawal = await prisma.withdrawal.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!withdrawal) {
      return res.status(404).json({ error: "Withdrawal not found" });
    }

    if (withdrawal.status !== "pending") {
      return res.status(400).json({ error: "Withdrawal already processed" });
    }

    await prisma.withdrawal.update({
      where: { id: withdrawal.id },
      data: { status: "completed" },
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        adminId: req.admin.id,
        action: "APPROVE_WITHDRAWAL",
        details: `Approved withdrawal #${withdrawal.id} for ${withdrawal.amount}`,
      },
    });

    res.json({ ok: true, message: "Withdrawal approved" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reject withdrawal
router.post("/withdrawals/:id/reject", adminAuth, async (req, res) => {
  try {
    const { reason } = req.body;
    
    const withdrawal = await prisma.withdrawal.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { user: true },
    });

    if (!withdrawal) {
      return res.status(404).json({ error: "Withdrawal not found" });
    }

    if (withdrawal.status !== "pending") {
      return res.status(400).json({ error: "Withdrawal already processed" });
    }

    // Refund and reject in transaction
    await prisma.$transaction(async (tx) => {
      // Refund user balance
      await tx.user.update({
        where: { id: withdrawal.userId },
        data: {
          balance: {
            increment: withdrawal.amount,
          },
        },
      });

      // Update withdrawal
      await tx.withdrawal.update({
        where: { id: withdrawal.id },
        data: { status: "rejected" },
      });

      // Log audit
      await tx.auditLog.create({
        data: {
          adminId: req.admin.id,
          action: "REJECT_WITHDRAWAL",
          details: `Rejected withdrawal #${withdrawal.id}. Reason: ${reason || 'N/A'}`,
        },
      });
    });

    res.json({ ok: true, message: "Withdrawal rejected and balance refunded" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get audit logs
router.get("/audit-logs", adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 100 } = req.query;
    const skip = (page - 1) * limit;

    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      skip: parseInt(skip),
      take: parseInt(limit),
      include: {
        admin: {
          select: { id: true, username: true },
        },
      },
    });

    const total = await prisma.auditLog.count();

    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
