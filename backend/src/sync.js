require("dotenv").config();
const { sequelize, Admin, ReserveAccount } = require("./models/index");
const bcrypt = require("bcrypt");

async function sync() {
  await sequelize.sync({ force: true }); // wipes and recreates - fine for dev
  console.log("DB synced.");

  // Create default admin
  const pwd = process.env.ADMIN_DEFAULT_PASS || "adminpassword";
  const hash = await bcrypt.hash(pwd, 10);
  await Admin.create({
    username: process.env.ADMIN_DEFAULT_USER || "admin",
    password_hash: hash,
  });
  console.log("Default admin created.");

  // Seed reserve accounts
  const seeds = [
    { currency: "EMC", balance: 1000000 },
    { currency: "USD", balance: 0 },
    { currency: "KES", balance: 0 },
    { currency: "NGN", balance: 0 },
    { currency: "BTC", balance: 0 },
  ];
  for (let s of seeds) await ReserveAccount.create(s);
  console.log("Seeded reserve accounts.");

  process.exit(0);
}

sync().catch((err) => {
  console.error(err);
  process.exit(1);
});
