const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  return sequelize.define(
    "ReserveAccount",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      currency: { type: DataTypes.STRING, allowNull: false },
      balance: { type: DataTypes.DECIMAL(30, 2), defaultValue: 0 },
      last_updated: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    { tableName: "reserve_accounts", timestamps: false }
  );
};
