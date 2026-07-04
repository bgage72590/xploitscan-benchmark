// Adapted from appsecco/dvna core/appHandler.js (MIT). See NOTICE.
const serialize = require('node-serialize');
module.exports.bulkProductsLegacy = function (req, res) {
  if (req.files && req.files.products) {
    var products = serialize.unserialize(req.files.products.data.toString('utf8'));
    res.render('app/bulkproducts', { products: products });
  }
};
