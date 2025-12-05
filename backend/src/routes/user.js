const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma");
const { userAuth } = require("../middleware/auth");

const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret";

// User Registration
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, phone, password, referralCode } = req.body;

    // Validation
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if user exists
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone: phone || undefined }],
      },
    });

    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Generate unique referral code
    const userReferralCode = `REF${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // Create user
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        phone,
        passwordHash,
        referralCode: userReferralCode,
        referredBy: referralCode || null,
      },
    });

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        balance: user.balance.toString(),
        referralCode: user.referralCode,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// User Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);

    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        balance: user.balance.toString(),
        referralCode: user.referralCode,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Get User Profile
router.get("/profile", userAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        balance: true,
        referralCode: true,
        referredBy: true,
        isVerified: true,
        createdAt: true,
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
    console.error("Profile fetch error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// Update User Profile
router.patch("/profile", userAuth, async (req, res) => {
  try {
    const { fullName, phone } = req.body;
    const updates = {};

    if (fullName) updates.fullName = fullName;
    if (phone) updates.phone = phone;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: updates,
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        balance: true,
        referralCode: true,
        isVerified: true,
      },
    });

    res.json({
      ...user,
      balance: user.balance.toString(),
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// Get User Balance
router.get("/balance", userAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { balance: true },
    });

    res.json({ balance: user.balance.toString() });
  } catch (error) {
    console.error("Balance fetch error:", error);
    res.status(500).json({ error: "Failed to fetch balance" });
  }
});

module.exports = router;
