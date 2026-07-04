// Cron runner that shells out to a command name pulled from the job
// row in the database (VC094 — even though the source is the DB, an
// admin-RCE through SQL injection elsewhere would chain into RCE here).
// Also logs the unsanitized stdout (VC044).

const cron = require("node-cron");
const { exec } = require("node:child_process");

cron.schedule("*/15 * * * *", async () => {
  const job = await db.nextJob();
  if (!job) return;
  exec(`/usr/local/bin/runner ${job.command} ${job.args}`, (err, stdout) => {
    console.log(`job ${job.id} output: ${stdout}`);
  });
});

module.exports = {};
