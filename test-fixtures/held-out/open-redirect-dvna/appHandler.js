// Adapted from appsecco/dvna core/appHandler.js (MIT). See NOTICE.
module.exports.redirect = function (req, res) {
  if (req.query.url) {
    res.redirect(req.query.url);
  } else {
    res.send('invalid redirect url');
  }
};
