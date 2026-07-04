// execSync with shell: true and user-interpolated command. Same class of
// bug as plain exec() — a ; or $() in the user input executes as a shell
// command. VC094 must fire.

import { execSync } from "node:child_process";
import type { Request } from "express";

export function runLinter(req: Request) {
  const target = req.body.target as string;
  // Template literal + shell:true = user controls the shell command.
  const stdout = execSync(`eslint ${target} --format json`, {
    shell: "/bin/bash",
  }).toString();
  return JSON.parse(stdout);
}
