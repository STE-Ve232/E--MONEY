// wallet.js
const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  return sequelize.define(
    "Wallet",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: DataTypes.INTEGER },
      currency: { type: DataTypes.STRING, defaultValue: "EMC" },
      balance: { type: DataTypes.DECIMAL(30, 2), defaultValue: 0 },
      updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    { tableName: "wallets", timestamps: false }
  );
};
