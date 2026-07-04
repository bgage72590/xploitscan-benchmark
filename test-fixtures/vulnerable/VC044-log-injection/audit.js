// Concatenating user-supplied values into a log line without escaping
// newlines lets an attacker forge fake log entries. If ingestion
// pipelines treat each line as a record, this poisons the audit trail.
// VC044 must fire.

function logLogin(req) {
  const username = req.body.username;
  console.log(`login attempt user=${username} ip=${req.ip}`);
}

module.exports = { logLogin };
