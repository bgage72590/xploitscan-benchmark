// pg connection pool with SSL explicitly disabled. Credentials and query
// data traverse the network in plaintext. VC050 must fire.

const { Pool } = require("pg");

module.exports = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: false,
});
