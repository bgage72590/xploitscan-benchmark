// Server that shells out using user-controlled input.
// VC094 must fire on the exec() call with string interpolation.

import { exec } from "child_process";

export function backupDatabase(filename, req) {
  // User-controlled filename passed straight into a shell command.
  exec(`pg_dump mydb > /backups/${req.body.filename}.sql`, (err) => {
    if (err) console.error(err);
  });
}

export function restoreFile(req) {
  // String concatenation with req.body — classic shell injection.
  exec("cat " + req.body.path, (err, stdout) => {
    if (err) console.error(err);
    console.log(stdout);
  });
}
