// exec concatenated with a FIXED constant, not user input. The string-concat
// detection must require a user-input operand — VC094 must NOT fire here.
const { exec } = require("node:child_process");
const TARGET = "registry.npmjs.org";
module.exports.healthcheck = function (req, res) {
  exec("ping -c 1 " + TARGET, (err, stdout) => res.send(stdout));
};
