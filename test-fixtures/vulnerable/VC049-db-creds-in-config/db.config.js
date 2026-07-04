// Database password hardcoded in a config file that ships with the repo.
// Anyone with read access — including public forks — can connect. VC049
// must fire.

module.exports = {
  host: "db.production.internal",
  port: 5432,
  user: "app_user",
  password: "hunter2-super-secret-prod",
  database: "app_prod",
};
