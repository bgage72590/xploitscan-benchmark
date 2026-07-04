// Adapted from appsecco/dvna core/appHandler.js (MIT). See NOTICE.
const exec = require('child_process').exec;
module.exports.ping = function (req, res) {
  exec('ping -c 2 ' + req.body.address, function (err, stdout, stderr) {
    res.render('app/ping', { output: stdout + stderr });
  });
};
