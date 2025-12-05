const { Sequelize } = require("sequelize");
const url = process.env.DATABASE_URL;
const sequelize = new Sequelize(url, {
  logging: false,
});
module.exports = sequelize;
