// Adapted from appsecco/dvna core/appHandler.js (MIT). See NOTICE.
const db = require('../models');
module.exports.userSearch = function (req, res) {
  var query = "SELECT name,id FROM Users WHERE login='" + req.body.login + "'";
  db.sequelize.query(query, { model: db.User }).then(user => {
    res.render('app/usersearch', { user: user });
  });
};
