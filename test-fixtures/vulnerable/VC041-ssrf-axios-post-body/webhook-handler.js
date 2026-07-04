// axios.post called with a URL pulled from the request body. Tests the AST
// layer's method-call pathway (axios.post vs fetch()). VC041 must fire.

const axios = require("axios");

module.exports = async function forwardWebhook(req, res) {
  const { forwardUrl, payload } = req.body;
  const upstream = await axios.post(forwardUrl, payload);
  res.json({ upstream: upstream.status });
};
