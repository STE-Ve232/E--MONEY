const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  return sequelize.define(
    "ReserveTransaction",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      reserve_id: { type: DataTypes.INTEGER },
      amount: { type: DataTypes.DECIMAL(30, 2) },
      type: { type: DataTypes.ENUM("credit", "debit") },
      description: { type: DataTypes.TEXT },
      admin_id: { type: DataTypes.INTEGER },
      timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    { tableName: "reserve_transactions", timestamps: false }
  );
};
