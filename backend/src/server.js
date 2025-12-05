require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const prisma = require("./prisma");

// Import routes
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const depositRoutes = require("./routes/deposit");
const withdrawalRoutes = require("./routes/withdrawal");
const transactionRoutes = require("./routes/transaction");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Health check
app.get("/", (req, res) =>
  res.json({ ok: true, message: "E-Money Backend API" })
);
app.get("/health", (req, res) =>
  res.json({ status: "healthy", timestamp: new Date() })
);

// API Routes
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/deposits", depositRoutes);
app.use("/api/withdrawals", withdrawalRoutes);
app.use("/api/transactions", transactionRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res
    .status(500)
    .json({ error: "Internal server error", message: err.message });
});

const port = process.env.PORT || 4000;

async function start() {
  try {
    await prisma.$connect();
    console.log("✅ Prisma connected to database");

    app.listen(port, () => {
      console.log(`🚀 Server listening on port ${port}`);
      console.log(`📍 API Base: http://localhost:${port}`);
      console.log(`🔐 Admin API: http://localhost:${port}/api/admin`);
      console.log(`👤 User API: https://client-beige-ten.vercel.app/`);
    });
  } catch (err) {
    console.error("❌ Unable to connect to database:", err);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

start();
