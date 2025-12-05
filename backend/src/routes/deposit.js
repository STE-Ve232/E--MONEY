const express = require("express");
const router = express.Router();
const prisma = require("../prisma");
const { userAuth } = require("../middleware/auth");

// Initiate Deposit
router.post("/initiate", userAuth, async (req, res) => {
  try {
    const { amount, method, currency = "USD" } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // Generate transaction reference
    const txRef = `DEP${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create deposit record
    const deposit = await prisma.deposit.create({
      data: {
        userId: req.user.id,
        amount: amount.toString(),
        currency,
        method: method || "card",
        txRef,
        status: "pending",
      },
    });

    // In production, integrate with payment gateway (Flutterwave, Paystack, etc.)
    // For now, return payment link mock
    const paymentLink = `${process.env.PAYMENT_GATEWAY_URL || 'https://payment.example.com'}/pay/${txRef}`;

    res.json({
      depositId: deposit.id,
      txRef: deposit.txRef,
      amount: deposit.amount.toString(),
      status: deposit.status,
      paymentLink, // Frontend should redirect here
      message: "Redirect user to payment gateway",
    });
  } catch (error) {
    console.error("Deposit initiation error:", error);
    res.status(500).json({ error: "Failed to initiate deposit" });
  }
});

// Verify Deposit (Webhook/Callback from payment gateway)
router.post("/verify/:txRef", async (req, res) => {
  try {
    const { txRef } = req.params;
    const { status, metadata } = req.body;

    const deposit = await prisma.deposit.findUnique({
      where: { txRef },
      include: { user: true },
    });

    if (!deposit) {
      return res.status(404).json({ error: "Deposit not found" });
    }

    if (deposit.status !== "pending") {
      return res.status(400).json({ error: "Deposit already processed" });
    }

    // Update deposit status
    await prisma.$transaction(async (tx) => {
      // Update deposit
      await tx.deposit.update({
        where: { id: deposit.id },
        data: {
          status: status === "success" ? "completed" : "failed",
          metadata: JSON.stringify(metadata),
        },
      });

      // If successful, credit user balance
      if (status === "success") {
        await tx.user.update({
          where: { id: deposit.userId },
          data: {
            balance: {
              increment: deposit.amount,
            },
          },
        });
      }
    });

    res.json({ ok: true, status: status === "success" ? "completed" : "failed" });
  } catch (error) {
    console.error("Deposit verification error:", error);
    res.status(500).json({ error: "Failed to verify deposit" });
  }
});

// Get User Deposits
router.get("/history", userAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const deposits = await prisma.deposit.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      skip: parseInt(skip),
      take: parseInt(limit),
    });

    const total = await prisma.deposit.count({
      where: { userId: req.user.id },
    });

    res.json({
      deposits: deposits.map(d => ({
        ...d,
        amount: d.amount.toString(),
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Deposit history error:", error);
    res.status(500).json({ error: "Failed to fetch deposits" });
  }
});

// Get Deposit by ID
router.get("/:id", userAuth, async (req, res) => {
  try {
    const deposit = await prisma.deposit.findFirst({
      where: {
        id: parseInt(req.params.id),
        userId: req.user.id,
      },
    });

    if (!deposit) {
      return res.status(404).json({ error: "Deposit not found" });
    }

    res.json({
      ...deposit,
      amount: deposit.amount.toString(),
    });
  } catch (error) {
    console.error("Deposit fetch error:", error);
    res.status(500).json({ error: "Failed to fetch deposit" });
  }
});

module.exports = router;
