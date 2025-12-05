const express = require("express");
const router = express.Router();
const prisma = require("../prisma");
const { userAuth } = require("../middleware/auth");

// Request Withdrawal
router.post("/request", userAuth, async (req, res) => {
  try {
    const { amount, walletAddress, method, currency = "USD" } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    if (!walletAddress && method !== "bank") {
      return res.status(400).json({ error: "Wallet address required" });
    }

    // Check user balance
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (user.balance.lessThan(amount)) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // Generate transaction reference
    const txRef = `WTH${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create withdrawal and deduct balance in transaction
    const withdrawal = await prisma.$transaction(async (tx) => {
      // Deduct from user balance immediately
      await tx.user.update({
        where: { id: req.user.id },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      // Create withdrawal record
      return await tx.withdrawal.create({
        data: {
          userId: req.user.id,
          amount: amount.toString(),
          currency,
          walletAddress,
          method: method || "crypto",
          txRef,
          status: "pending",
        },
      });
    });

    res.json({
      withdrawalId: withdrawal.id,
      txRef: withdrawal.txRef,
      amount: withdrawal.amount.toString(),
      status: withdrawal.status,
      message: "Withdrawal request submitted. Awaiting admin approval.",
    });
  } catch (error) {
    console.error("Withdrawal request error:", error);
    res.status(500).json({ error: "Failed to request withdrawal" });
  }
});

// Get User Withdrawals
router.get("/history", userAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const withdrawals = await prisma.withdrawal.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      skip: parseInt(skip),
      take: parseInt(limit),
    });

    const total = await prisma.withdrawal.count({
      where: { userId: req.user.id },
    });

    res.json({
      withdrawals: withdrawals.map(w => ({
        ...w,
        amount: w.amount.toString(),
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Withdrawal history error:", error);
    res.status(500).json({ error: "Failed to fetch withdrawals" });
  }
});

// Get Withdrawal by ID
router.get("/:id", userAuth, async (req, res) => {
  try {
    const withdrawal = await prisma.withdrawal.findFirst({
      where: {
        id: parseInt(req.params.id),
        userId: req.user.id,
      },
    });

    if (!withdrawal) {
      return res.status(404).json({ error: "Withdrawal not found" });
    }

    res.json({
      ...withdrawal,
      amount: withdrawal.amount.toString(),
    });
  } catch (error) {
    console.error("Withdrawal fetch error:", error);
    res.status(500).json({ error: "Failed to fetch withdrawal" });
  }
});

// Cancel Withdrawal (only if pending)
router.post("/:id/cancel", userAuth, async (req, res) => {
  try {
    const withdrawal = await prisma.withdrawal.findFirst({
      where: {
        id: parseInt(req.params.id),
        userId: req.user.id,
        status: "pending",
      },
    });

    if (!withdrawal) {
      return res.status(404).json({ error: "Pending withdrawal not found" });
    }

    // Refund and cancel in transaction
    await prisma.$transaction(async (tx) => {
      // Refund balance
      await tx.user.update({
        where: { id: req.user.id },
        data: {
          balance: {
            increment: withdrawal.amount,
          },
        },
      });

      // Update withdrawal status
      await tx.withdrawal.update({
        where: { id: withdrawal.id },
        data: { status: "cancelled" },
      });
    });

    res.json({ ok: true, message: "Withdrawal cancelled and balance refunded" });
  } catch (error) {
    console.error("Withdrawal cancellation error:", error);
    res.status(500).json({ error: "Failed to cancel withdrawal" });
  }
});

module.exports = router;
