const Sequelize = require("sequelize");
const sequelize = require("../db");

const Admin = require("./admin")(sequelize);
const User = require("./user")(sequelize);
const ReserveAccount = require("./reserve_account")(sequelize);
const ReserveTransaction = require("./reserve_transaction")(sequelize);
const Wallet = require("./wallet")(sequelize);
const Deposit = require("./deposit")(sequelize);
const Withdrawal = require("./withdrawal")(sequelize);
const AuditLog = require("./audit_log")(sequelize);
const Referral = require("./referral")(sequelize);
const Notification = require("./notification")(sequelize);

// associations
ReserveAccount.hasMany(ReserveTransaction, { foreignKey: "reserve_id" });
ReserveTransaction.belongsTo(ReserveAccount, { foreignKey: "reserve_id" });

module.exports = {
  sequelize,
  Admin,
  User,
  ReserveAccount,
  ReserveTransaction,
  Wallet,
  Deposit,
  Withdrawal,
  AuditLog,
  Referral,
  Notification,
};
