// child_process.spawn called with shell: true and interpolated user input.
// Equivalent to running the string through /bin/sh -c, which means meta
// characters in the user input (;, |, $(), backticks) execute as shell
// commands. VC094 must fire.

import { spawn } from "child_process";

export function makeThumbnail(req, res) {
  const src = req.body.src;
  // shell: true turns the first argument into a string passed to `sh -c`.
  // With interpolation, any ; or $() in the user input runs as a command.
  const child = spawn(`convert ${src} -resize 200x200 thumb.png`, { shell: true });

  child.on("close", (code) => {
    res.json({ ok: code === 0 });
  });
}
