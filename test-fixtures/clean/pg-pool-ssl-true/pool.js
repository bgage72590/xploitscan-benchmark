// pg connection pool with TLS enforced. VC050 must NOT fire.

const { Pool } = require("pg");
const fs = require("node:fs");

module.exports = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync(process.env.DB_CA_PATH),
  },
});
