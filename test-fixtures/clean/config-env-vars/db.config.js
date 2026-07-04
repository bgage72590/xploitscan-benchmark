// DB config entirely from env vars. Nothing material in source.
// VC049 must NOT fire.

module.exports = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};
