const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = (sequelize) => {
  const Admin = sequelize.define(
    "Admin",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: DataTypes.STRING, unique: true, allowNull: false },
      password_hash: { type: DataTypes.TEXT, allowNull: false },
      role: { type: DataTypes.STRING, defaultValue: "superadmin" },
    },
    {
      tableName: "admins",
      timestamps: false,
    }
  );

  Admin.prototype.validatePassword = async function (password) {
    return bcrypt.compare(password, this.password_hash);
  };

  return Admin;
};
