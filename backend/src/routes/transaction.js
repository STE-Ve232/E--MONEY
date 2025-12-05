const express = require("express");
const router = express.Router();
const prisma = require("../prisma");
const { userAuth } = require("../middleware/auth");

// Send Money / Transfer
router.post("/transfer", userAuth, async (req, res) => {
  try {
    const { receiverId, amount, description, currency = "USD" } = req.body;

    if (!receiverId || !amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid transfer details" });
    }

    if (req.user.id === parseInt(receiverId)) {
      return res.status(400).json({ error: "Cannot transfer to yourself" });
    }

    // Check sender balance and receiver existence
    const [sender, receiver] = await Promise.all([
      prisma.user.findUnique({ where: { id: req.user.id } }),
      prisma.user.findUnique({ where: { id: parseInt(receiverId) } }),
    ]);

    if (!receiver) {
      return res.status(404).json({ error: "Receiver not found" });
    }

    if (sender.balance.lessThan(amount)) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // Perform transfer in transaction
    const transaction = await prisma.$transaction(async (tx) => {
      // Deduct from sender
      await tx.user.update({
        where: { id: sender.id },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      // Credit receiver
      await tx.user.update({
        where: { id: receiver.id },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      // Create transaction record
      return await tx.transaction.create({
        data: {
          senderId: sender.id,
          receiverId: receiver.id,
          amount: amount.toString(),
          currency,
          description,
          status: "completed",
        },
        include: {
          sender: {
            select: { fullName: true, email: true },
          },
          receiver: {
            select: { fullName: true, email: true },
          },
        },
      });
    });

    res.json({
      transactionId: transaction.id,
      amount: transaction.amount.toString(),
      sender: transaction.sender,
      receiver: transaction.receiver,
      status: transaction.status,
      message: "Transfer successful",
    });
  } catch (error) {
    console.error("Transfer error:", error);
    res.status(500).json({ error: "Transfer failed" });
  }
});

// Get Transaction History
router.get("/history", userAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    const skip = (page - 1) * limit;

    let where = {
      OR: [
        { senderId: req.user.id },
        { receiverId: req.user.id },
      ],
    };

    if (type === "sent") {
      where = { senderId: req.user.id };
    } else if (type === "received") {
      where = { receiverId: req.user.id };
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: parseInt(skip),
      take: parseInt(limit),
      include: {
        sender: {
          select: { id: true, fullName: true, email: true },
        },
        receiver: {
          select: { id: true, fullName: true, email: true },
        },
      },
    });

    const total = await prisma.transaction.count({ where });

    res.json({
      transactions: transactions.map(t => ({
        ...t,
        amount: t.amount.toString(),
        type: t.senderId === req.user.id ? "sent" : "received",
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Transaction history error:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// Get Transaction by ID
router.get("/:id", userAuth, async (req, res) => {
  try {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: parseInt(req.params.id),
        OR: [
          { senderId: req.user.id },
          { receiverId: req.user.id },
        ],
      },
      include: {
        sender: {
          select: { id: true, fullName: true, email: true },
        },
        receiver: {
          select: { id: true, fullName: true, email: true },
        },
      },
    });

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.json({
      ...transaction,
      amount: transaction.amount.toString(),
      type: transaction.senderId === req.user.id ? "sent" : "received",
    });
  } catch (error) {
    console.error("Transaction fetch error:", error);
    res.status(500).json({ error: "Failed to fetch transaction" });
  }
});

// Search users for transfer (by email or name)
router.get("/users/search", userAuth, async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({ error: "Query too short" });
    }

    const users = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: req.user.id } },
          {
            OR: [
              { email: { contains: q, mode: "insensitive" } },
              { fullName: { contains: q, mode: "insensitive" } },
            ],
          },
        ],
      },
      select: {
        id: true,
        fullName: true,
        email: true,
      },
      take: 10,
    });

    res.json({ users });
  } catch (error) {
    console.error("User search error:", error);
    res.status(500).json({ error: "Search failed" });
  }
});

module.exports = router;
