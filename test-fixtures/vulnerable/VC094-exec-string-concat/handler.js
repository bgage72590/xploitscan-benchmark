// Command injection via string concatenation (not a template literal).
const { exec } = require("node:child_process");
module.exports.ping = function (req, res) {
  exec("ping -c 2 " + req.body.host, (err, stdout) => res.send(stdout));
};
