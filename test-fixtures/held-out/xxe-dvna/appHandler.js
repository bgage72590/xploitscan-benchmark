// Adapted from appsecco/dvna core/appHandler.js (MIT). See NOTICE.
const libxmljs = require('libxmljs');
module.exports.bulkProducts = function (req, res) {
  if (req.files && req.files.products) {
    var products = libxmljs.parseXmlString(
      req.files.products.data.toString('utf8'),
      { noent: true, noblanks: true });
    res.render('app/bulkproducts', { products: products });
  }
};
