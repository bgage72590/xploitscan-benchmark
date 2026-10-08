const sql = require("mssql");

// The legacy SQL Server 2012 box only speaks TLS 1.0, so Node's default
// (TLS 1.2 minimum) fails with "SSL routines: unsupported protocol".
const config = {
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: true,
    trustServerCertificate: false,
    cryptoCredentialsDetails: {
      minVersion: "TLSv1",
    },
  },
};

let pool;

async function getPool() {
  if (!pool) pool = await sql.connect(config);
  return pool;
}

module.exports = { getPool };
