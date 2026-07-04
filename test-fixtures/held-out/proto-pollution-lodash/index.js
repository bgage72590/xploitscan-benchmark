// Adapted from kimmobrunfeldt/lodash-merge-pollution-example (ISC). See NOTICE.
const _ = require('lodash');
module.exports.createOrder = function (req, res) {
  const clientOrder = _.merge({}, req.body, { ipAddress: req.ip });
  res.json({ order: clientOrder });
};
