// Sequelize CLI config (config.js instead of the generated config.json) so
// every credential is read from the environment.

require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "mysql",
    dialectOptions: { ssl: { require: true } },
  },
};
