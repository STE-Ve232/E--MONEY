const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  return sequelize.define(
    "User",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      full_name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      phone: { type: DataTypes.STRING, unique: true },
      password_hash: { type: DataTypes.TEXT, allowNull: false },
      balance: { type: DataTypes.DECIMAL(18, 2), defaultValue: 0 },
      referral_code: { type: DataTypes.STRING, unique: true },
      referred_by: { type: DataTypes.STRING },
      is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    { tableName: "users", timestamps: false }
  );
};
