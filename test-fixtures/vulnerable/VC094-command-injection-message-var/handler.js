// Regression fixture for the isInsideFixMessage() variable-name collision.
//
// The command-injection sink is assigned to a variable named `message`.
// The fix-message suppressor used to match any line containing `message =`
// (its `[:=(]` clause), so the real VC094 finding on this line was silently
// dropped. The suppressor now requires a string-literal value after the
// separator, so an assignment whose value is a CALL still fires.

import { execSync } from "child_process";

export function runDiagnostic(req) {
  // `message =` must NOT suppress this — the value is a call, not a "fix: ..."
  // string literal. VC094 must fire on this line.
  const message = execSync(`echo ${req.body.note} >> /var/log/diag.log`);
  return message.toString();
}

export function sendNotice(req) {
  // A second sink assigned to `doc`, the other colliding variable name.
  const doc = execSync(`cat /tmp/${req.query.id}.txt`);
  return doc.toString();
}
