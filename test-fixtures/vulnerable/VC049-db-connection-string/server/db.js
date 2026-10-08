// MySQL pool for the Express reporting service. The production RDS endpoint
// and its password are written straight into the pool options.

const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "reports-db.c9akciq32xyz.us-east-1.rds.amazonaws.com",
  port: 3306,
  user: "reports_app",
  password: "Wm4#tRz8qLp2",
  database: "reports",
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
